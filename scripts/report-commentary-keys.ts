/** Produce a read-only review inventory; no commentary or scripture data is modified. */
import fs from "node:fs";
import path from "node:path";
import { canonicalVerseId } from "../lib/canonical-verse-id";
import { commentaryAmbiguities, commentaryLookupKey } from "../lib/commentary-lookup";

type Verse = { number: number | string; sanskrit?: string };
type Chapter = { number: number | string; verses?: Verse[] };
type RecordVerse = { chapter: number; number: number | string; canonicalKey: string; rawKey: string; sanskrit?: string };
type Entry = { sanskrit?: string; replacesQueueSnapshot?: unknown; status?: string };
const args = process.argv.slice(2);
let out = "", only = "";
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--out" && args[i + 1] && !out) out = args[++i];
  else if (args[i] === "--scripture" && args[i + 1] && !only) only = args[++i];
  else throw new Error("usage: npx tsx scripts/report-commentary-keys.ts --out <new-file.json> [--scripture <id>]");
}
if (!out || (only && !/^[a-z0-9-]+$/.test(only))) throw new Error("Provide --out and a valid optional --scripture id");
const dirs = { queue: "data/ai-commentary", published: "public/data/hi-commentary", proposal: "data/ai-commentary/proposals" } as const;
const files = (dir: string) => fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith(".json") && !f.endsWith("-research.json")).map(f => f.slice(0, -5)) : [];
const ids = only ? [only] : [...new Set(Object.values(dirs).flatMap(files))].sort();
const load = (file: string) => JSON.parse(fs.readFileSync(file, "utf8"));
const asRecords = (chapter: number, verses: Verse[] = []): RecordVerse[] => verses.map(v => ({ chapter, number: v.number, canonicalKey: `${chapter}:${Number(canonicalVerseId(chapter, v.number))}`, rawKey: `${chapter}:${v.number}`, sanskrit: v.sanskrit }));
const matching = (records: RecordVerse[], key: string) => records.filter(v => v.canonicalKey === key || v.rawKey === key);
const publicRecord = (v: RecordVerse) => ({ chapter: v.chapter, number: v.number, canonicalKey: v.canonicalKey, rawKey: v.rawKey });
const count: Record<string, number> = {};
const findings: unknown[] = [];
let entriesChecked = 0, filesChecked = 0;
for (const id of ids) {
  const input: Record<string, Record<string, Entry | null>> = {};
  for (const [kind, dir] of Object.entries(dirs)) {
    const file = path.join(dir, `${id}.json`);
    if (fs.existsSync(file)) { input[kind] = load(file); filesChecked++; }
  }
  const monolithPath = path.join("public/data/scriptures-full", `${id}.json`);
  const chapters: Chapter[] = fs.existsSync(monolithPath) ? load(monolithPath).chapters ?? [] : [];
  const monolith = chapters.flatMap(c => asRecords(Number(c.number), c.verses));
  const chapterIds = new Set(chapters.map(c => Number(c.number)).filter(n => Number.isInteger(n) && n > 0));
  for (const entries of Object.values(input)) for (const key of Object.keys(entries)) {
    const n = Number(key.split(":")[0]); if (Number.isInteger(n) && n > 0) chapterIds.add(n);
  }
  const reader: RecordVerse[] = [];
  const shardUsed = new Set<number>();
  for (const chapter of chapterIds) {
    const shard = path.join("public/data/scriptures-full", id, `ch-${chapter}.json`);
    if (fs.existsSync(shard)) { reader.push(...asRecords(chapter, load(shard).chapter?.verses ?? [])); shardUsed.add(chapter); }
    else reader.push(...monolith.filter(v => v.chapter === chapter));
  }
  const published = input.published ?? {};
  const ambiguities = new Map([...chapterIds].map(chapter => [chapter, commentaryAmbiguities(chapter, reader.filter(v => v.chapter === chapter).map(v => v.number))]));
  for (const [kind, entries] of Object.entries(input)) for (const [key, entry] of Object.entries(entries)) {
    entriesChecked++;
    const reasons: string[] = [];
    const mono = matching(monolith, key), views = matching(reader, key);
    const selected = views.map(v => ({ ...publicRecord(v), selectedKey: commentaryLookupKey(published, v.chapter, v.number, ambiguities.get(v.chapter)) ?? null }));
    if (!fs.existsSync(monolithPath)) reasons.push("monolith_missing");
    else if (mono.length === 0) reasons.push("monolith_key_unmatched");
    else if (mono.length > 1) reasons.push("monolith_key_ambiguous");
    if (kind === "published") {
      if (!views.length) reasons.push("reader_key_unmatched");
      else if (selected.every(v => v.selectedKey !== key) && selected.some(v => v.selectedKey !== null)) reasons.push("reader_key_shadowed");
      else if (selected.some(v => v.selectedKey === key) && selected.some(v => v.selectedKey !== null && v.selectedKey !== key)) reasons.push("reader_key_partially_shadowed");
      if (views.some(v => v.canonicalKey === key && v.rawKey !== key && ambiguities.get(v.chapter)?.normalized.has(key) && commentaryLookupKey(published, v.chapter, v.number, ambiguities.get(v.chapter)) === undefined)) reasons.push("reader_alias_suppressed");
      if (views.some(v => v.rawKey === key && ambiguities.get(v.chapter)?.raw.has(key))) reasons.push("reader_raw_ambiguous");
      if (selected.filter(v => v.selectedKey === key).length > 1) reasons.push("reader_key_ambiguous");
    }
    if (!!mono.length !== !!views.length) reasons.push("reader_monolith_disagree");
    if (!entry || typeof entry !== "object") reasons.push("invalid_entry");
    else if (kind !== "published") {
      if (typeof entry.sanskrit !== "string" || !entry.sanskrit.trim()) reasons.push("snapshot_missing");
      else if (mono.length === 1 && entry.sanskrit !== mono[0].sanskrit) reasons.push("snapshot_stale");
      if (kind === "proposal" && JSON.stringify(entry.replacesQueueSnapshot) !== JSON.stringify(input.queue?.[key])) reasons.push("proposal_original_changed");
    }
    if (!reasons.length) continue;
    for (const reason of reasons) count[reason] = (count[reason] ?? 0) + 1;
    const chapter = Number(key.split(":")[0]);
    const numberPart = Number(key.slice(key.indexOf(":") + 1));
    const nearby = reader.filter(v => v.chapter === chapter).sort((a, b) => {
      const distance = (v: RecordVerse) => Number.isFinite(numberPart) && Number.isFinite(Number(v.number)) ? Math.abs(Number(v.number) - numberPart) : Infinity;
      return distance(a) - distance(b);
    }).slice(0, 5).map(publicRecord);
    const snapshotMatches = entry?.sanskrit ? monolith.filter(v => v.sanskrit === entry.sanskrit) : [];
    findings.push({ scripture: id, kind, key, status: entry?.status ?? null, reasons, source: { monolith: fs.existsSync(monolithPath) ? monolithPath.replace(/\\/g, "/") : null, reader: shardUsed.has(chapter) ? `public/data/scriptures-full/${id}/ch-${chapter}.json` : fs.existsSync(monolithPath) ? monolithPath.replace(/\\/g, "/") : null }, monolithMatchCount: mono.length, monolithMatches: mono.slice(0, 10).map(publicRecord), readerMatchCount: selected.length, readerMatches: selected.slice(0, 10), snapshotMatchCount: snapshotMatches.length, snapshotMatches: snapshotMatches.slice(0, 5).map(publicRecord), nearbyReaderVerses: nearby });
  }
}
const report = { generatedAt: new Date().toISOString(), scope: only || "all", filesChecked, entriesChecked, findingsCount: findings.length, reasons: count, note: "Reader selection models lib/commentary-lookup.ts using full-chapter ambiguity; nearby numbers are review candidates, not suggested corrections. Shards are preferred over monoliths. Findings are not editorial approvals.", findings };
fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
fs.writeFileSync(out, JSON.stringify(report, null, 2) + "\n", { flag: "wx" });
console.log(`Wrote ${findings.length} findings from ${entriesChecked} entries in ${filesChecked} files to ${out}`);
console.log(JSON.stringify(count));
