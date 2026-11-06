/**
 * Move the per-verse commentary keys of a renumbered scripture to the verses'
 * new numbers, using a reviewed realignment table (data/realign/*.json).
 *
 *   npx tsx scripts/realign-verse-keys.ts --table data/realign/<table>.json \
 *     --previous ramayana=<old ramayana.json> --previous rigveda=<old rigveda.json> [--write]
 *
 * Files moved, for each scripture in the table:
 *   data/hi-commentary/{id}.ts             'chapter:verse' keys
 *   data/hi-commentary/{id}-rest.json
 *   data/ai-commentary/{id}-research.json
 *   data/hi-commentary/curated-manifest.json   '{id}:chapter:verse' keys
 *
 * A key belongs to an old verse when it is "chapter:number" or the reader's
 * short form "chapter:N" (lib/verse-meaning verseCommentaryKey). It moves to
 * the verse's new position when the table maps that verse and the verse kept
 * its meaning (the first of a set of repeats). Every other key no longer
 * belongs to a verse of the text, and could attach to the wrong verse under
 * the new numbering, so its entry is moved verbatim into
 * data/realign/{table}.orphans.json for review instead of being deleted.
 * New keys are always the exact "chapter:number".
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import ts from "typescript";
import { canonicalVerseId } from "../lib/canonical-verse-id";
import type { FullScripture } from "./lib/scripture-schema";

interface TableGroup {
  old: string[];
  to: string | null;
}
interface Table {
  scriptures: Record<string, { entries: Record<string, string | null>; groups: TableGroup[] }>;
}

const WRITE = process.argv.includes("--write");

function args(name: string): string[] {
  const out: string[] = [];
  process.argv.forEach((a, i) => {
    if (a === name && process.argv[i + 1]) out.push(process.argv[i + 1]);
  });
  return out;
}

const tablePath = args("--table")[0];
if (!tablePath) throw new Error("--table is required");
const table = JSON.parse(readFileSync(resolve(tablePath), "utf8")) as Table;
const previousPaths = new Map(
  args("--previous").map((a) => {
    const [id, path] = a.split("=");
    return [id, path] as const;
  }),
);

type Decision = { to: string } | { orphan: string };

/** Key → new key, for one scripture. */
function keyResolver(id: string): (key: string) => Decision {
  const spec = table.scriptures[id];
  const previousPath = previousPaths.get(id);
  if (!previousPath) throw new Error(`--previous ${id}=<old ${id}.json> is required`);
  const previous = JSON.parse(readFileSync(resolve(previousPath), "utf8")) as FullScripture;

  // Only the first old position of each group kept its meaning; its keys move with it.
  const head = new Set(spec.groups.filter((g) => g.to).map((g) => g.old[0]));
  const exact = new Map<string, string>();
  const short = new Map<string, string[]>();
  for (const chapter of previous.chapters) {
    for (const verse of chapter.verses) {
      const pos = `${chapter.number}:${verse.number}`;
      exact.set(pos, pos);
      const s = `${chapter.number}:${Number(canonicalVerseId(chapter.number, verse.number))}`;
      short.set(s, [...(short.get(s) ?? []), pos]);
    }
  }

  return (key: string) => {
    const positions = exact.has(key) ? [key] : (short.get(key) ?? []);
    if (positions.length === 0) return { orphan: "no verse of the old text has this key" };
    if (positions.length > 1) return { orphan: `ambiguous: answers to ${positions.join(", ")}` };
    const pos = positions[0];
    const to = spec.entries[pos];
    if (!to) return { orphan: `${pos} is not a verse of this text (realignment table)` };
    if (!head.has(pos)) return { orphan: `${pos} repeats a verse whose first entry keeps the meaning` };
    return { to };
  };
}

const orphans: Record<string, Record<string, { reason: string; entry: unknown }>> = {};
const summary: string[] = [];

function addOrphan(file: string, key: string, reason: string, entry: unknown) {
  (orphans[file] ??= {})[key] = { reason, entry };
}

/** Moves keys inside a JSON object, keeping the first entry for a new key. */
function moveJsonKeys(
  file: string,
  object: Record<string, unknown>,
  resolveKey: (key: string) => Decision | null,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  let moved = 0;
  let orphaned = 0;
  for (const [key, value] of Object.entries(object)) {
    const d = resolveKey(key);
    if (d === null) {
      out[key] = value;
      continue;
    }
    if ("orphan" in d) {
      addOrphan(file, key, d.orphan, value);
      orphaned++;
      continue;
    }
    if (out[d.to] !== undefined) {
      addOrphan(file, key, `a second entry for ${d.to}`, value);
      orphaned++;
      continue;
    }
    out[d.to] = value;
    if (d.to !== key) moved++;
  }
  summary.push(`${file}: ${moved} moved, ${orphaned} to orphans`);
  return out;
}

function realignJsonFile(path: string, resolveKey: (key: string) => Decision | null): void {
  if (!existsSync(path)) return;
  const raw = readFileSync(path, "utf8");
  const data = JSON.parse(raw) as Record<string, unknown>;
  const file = path.replace(/\\/g, "/").replace(/^.*?(data\/)/, "$1");
  const moved = moveJsonKeys(file, data, resolveKey);
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  const indent = /^\{\r?\n( +)/.exec(raw)?.[1].length ?? 2;
  if (WRITE) writeFileSync(path, JSON.stringify(moved, null, indent).replace(/\n/g, eol) + (raw.endsWith("\n") ? eol : ""), "utf8");
}

/** Renames or removes the properties of the exported HiCommentaryFragment object literal, in place. */
function realignTsFragment(path: string, resolveKey: (key: string) => Decision): void {
  if (!existsSync(path)) return;
  const text = readFileSync(path, "utf8");
  const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);
  let literal: ts.ObjectLiteralExpression | undefined;
  source.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;
    for (const decl of node.declarationList.declarations) {
      if (decl.initializer && ts.isObjectLiteralExpression(decl.initializer)) literal = decl.initializer;
    }
  });
  if (!literal) throw new Error(`${path}: no exported object literal`);

  const file = `data/hi-commentary/${basename(path)}`;
  const edits: Array<{ start: number; end: number; text: string }> = [];
  const taken = new Set<string>();
  let moved = 0;
  let orphaned = 0;
  for (const prop of literal.properties) {
    if (!ts.isPropertyAssignment(prop) || !ts.isStringLiteral(prop.name)) continue;
    const key = prop.name.text;
    let d = resolveKey(key);
    if ("to" in d && taken.has(d.to)) d = { orphan: `a second entry for ${d.to}` };
    if ("to" in d) {
      taken.add(d.to);
      if (d.to !== key) {
        edits.push({ start: prop.name.getStart(source), end: prop.name.getEnd(), text: `'${d.to}'` });
        moved++;
      }
      continue;
    }
    addOrphan(file, key, d.orphan, prop.initializer.getText(source));
    orphaned++;
    // Remove the whole property line(s): indentation, the property, its comma and the line break.
    let start = prop.getStart(source);
    while (start > 0 && (text[start - 1] === " " || text[start - 1] === "\t")) start--;
    let end = prop.getEnd();
    if (text[end] === ",") end++;
    while (text[end] === " " || text[end] === "\t") end++;
    if (text[end] === "\r") end++;
    if (text[end] === "\n") end++;
    edits.push({ start, end, text: "" });
  }
  let out = text;
  for (const e of edits.sort((a, b) => b.start - a.start)) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  summary.push(`${file}: ${moved} moved, ${orphaned} to orphans`);
  if (WRITE) writeFileSync(path, out, "utf8");
}

const resolvers = new Map(Object.keys(table.scriptures).map((id) => [id, keyResolver(id)]));

for (const [id, resolveKey] of resolvers) {
  realignTsFragment(resolve(`data/hi-commentary/${id}.ts`), resolveKey);
  realignJsonFile(resolve(`data/hi-commentary/${id}-rest.json`), resolveKey);
  realignJsonFile(resolve(`data/ai-commentary/${id}-research.json`), resolveKey);
}

// curated-manifest.json: { generatedAt, entries: { "id:chapter:verse": flags } }
{
  const path = resolve("data/hi-commentary/curated-manifest.json");
  const raw = readFileSync(path, "utf8");
  const manifest = JSON.parse(raw) as { entries: Record<string, unknown> };
  manifest.entries = moveJsonKeys("data/hi-commentary/curated-manifest.json", manifest.entries, (key) => {
    const [id, ...rest] = key.split(":");
    const resolveKey = resolvers.get(id);
    if (!resolveKey) return null;
    const d = resolveKey(rest.join(":"));
    return "to" in d ? { to: `${id}:${d.to}` } : d;
  });
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  if (WRITE) writeFileSync(path, JSON.stringify(manifest, null, 2).replace(/\n/g, eol) + (raw.endsWith("\n") ? eol : ""), "utf8");
}

const orphanPath = resolve(tablePath.replace(/\.json$/, ".orphans.json"));
console.log(summary.join("\n"));
if (WRITE) {
  writeFileSync(
    orphanPath,
    JSON.stringify(
      {
        note: "Commentary entries that belonged to no verse of the rebuilt text (or to a repeat), moved out of the published sources by scripts/realign-verse-keys.ts. Kept verbatim for review: attach one to a verse only after checking it describes that verse.",
        files: orphans,
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );
  console.log(`Orphans written to ${orphanPath}`);
} else {
  console.log("Dry run; pass --write to change the files.");
}
