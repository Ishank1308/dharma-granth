/**
 * Publish curated-only hi-commentary JSON for the web/mobile fetch layer.
 * Output: public/data/hi-commentary/<scripture>/<chapter>-<unit>.json, one small file per section
 * (lib/commentary-units.mjs, docs/commentary-storage.md), so a book of any size publishes in files the
 * reader can load a page at a time and Cloudflare Pages accepts.
 * Bulk machine-generated explanations are excluded (same policy as hi-analysis.json).
 * AI drafts from data/ai-commentary/ are included only once a reviewer has
 * set them to "approved", never over hand-written entries, and marked `ai`.
 *
 *   npm run publish:commentary
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { filterCuratedFragment } from "../data/hi-commentary/publish";
import { isBoilerplateField, isTranslationEchoNote, TRANSLATION_ECHO_SCRIPTURES } from "../data/hi-commentary/quality";
import { aiQueueScriptureIds, approvedAiEntries } from "../data/hi-commentary/_ai-queue";
import { aiCommentaryReviewHolds } from "../data/hi-commentary/_ai-holds";
import type { HiCommentaryFragment } from "../data/hi-commentary/_types";
import { findTemplateFields } from "./lib/template-text";
import { commentaryEntry, loadPilotOverlay } from "./pilot/overlay";
import { legacyPublishedFiles, publishedCommentaryIds, readRecord, removeRecord, writeRecord } from "./lib/commentary-store.mjs";

// Editorial pilot records (data/pilot/records) are published through this file, one entry per verse.
const PILOT = loadPilotOverlay();

const SRC = path.resolve("data/hi-commentary");
const OUT = path.resolve("public/data/hi-commentary");
// The published folder goes up as its own Cloudflare Pages deployment (docs/commentary-storage.md),
// which takes at most 20,000 files. Warn well before that; fail just below it.
const WARN_FILES = 15_000;
const MAX_FILES = 19_500;

/** Each verse's Hindi translation, keyed "chapter:verse", from the published book. */
function verseHindiByKey(scriptureId: string): Map<string, string> {
  const out = new Map<string, string>();
  const file = path.resolve("public/data/scriptures-full", `${scriptureId}.json`);
  if (!fs.existsSync(file)) return out;
  const book = JSON.parse(fs.readFileSync(file, "utf8")) as {
    chapters?: Array<{ number: number | string; verses?: Array<{ number: number | string; hindi?: string }> }>;
  };
  for (const ch of book.chapters ?? []) {
    for (const v of ch.verses ?? []) {
      if (v.hindi) out.set(`${Number(ch.number)}:${Number(v.number)}`, v.hindi);
    }
  }
  return out;
}

async function main(): Promise<void> {
  fs.mkdirSync(OUT, { recursive: true });
  // Per-book files from before the split into sections.
  for (const f of legacyPublishedFiles()) {
    fs.unlinkSync(path.join(OUT, f));
    console.log(`removed ${f} (now published by section in ${path.basename(f, ".json")}/)`);
  }

  const files = fs
    .readdirSync(SRC)
    .filter(
      (f) =>
        f.endsWith(".ts") &&
        !f.startsWith("_") &&
        f !== "quality.ts" &&
        f !== "publish.ts",
    );

  let totalEntries = 0;
  let totalBytes = 0;
  let totalFiles = 0;
  let largest = { file: "", bytes: 0 };
  let skipped = 0;
  let aiPublished = 0;

  const fragmentNames = files.map((f) => path.basename(f, ".ts"));
  // Scriptures that only have AI drafts still get a file.
  const names = Array.from(new Set([...fragmentNames, ...aiQueueScriptureIds(), ...PILOT.map((p) => p.scriptureId)])).sort();

  for (const name of names) {
    let curated: HiCommentaryFragment = {};
    if (fragmentNames.includes(name)) {
      const exportName = `${name}Hi`;
      const mod = await import(pathToFileURL(path.join(SRC, `${name}.ts`)).href);
      const fragment = mod[exportName];
      if (!fragment) {
        console.warn(`skip ${name}.ts: no export ${exportName}`);
        continue;
      }
      curated = filterCuratedFragment(name, fragment);
    }

    // Approved AI drafts fill gaps only; hand-written commentary wins, except
    // where a draft was approved to replace the hand-written व्याख्या.
    const { entries: ai, stale, replaces } = approvedAiEntries(name);
    for (const key of stale) {
      console.warn(`⚠ ${name}:${key} approved AI draft skipped — the verse text changed since review`);
    }
    for (const [key, entry] of Object.entries(ai)) {
      // A hand-written entry with no व्याख्या of its own gets the approved one, labelled.
      const handWrittenHasNoExplanation = curated[key] && !curated[key].explanation;
      if (curated[key] && (replaces.has(key) || handWrittenHasNoExplanation) && entry.explanation) {
        // Only the व्याख्या changes hands; hand-written science and lifeLesson stay, unlabelled.
        curated[key] = { ...curated[key], explanation: entry.explanation, explanationAi: true };
        aiPublished++;
        continue;
      }
      // Otherwise any hand-written field for this verse means a human owns it; never mix.
      if (curated[key]) continue;
      curated[key] = entry;
      aiPublished++;
    }

    const held = aiCommentaryReviewHolds(name);
    // One file, or a folder of sections for a big book (scripts/lib/commentary-store.mjs).
    const rest = readRecord(path.join(SRC, `${name}-rest`)) as HiCommentaryFragment;
    {
      for (const [restKey, entry] of Object.entries(rest)) {
        // Do not publish modern context coupled to an interpretation on editorial hold.
        if (held.has(restKey)) continue;
        // "1:1.9" and "1:9" name the same verse. If the short key already holds the व्याख्या, merge into it:
        // an exact "1:1.9" entry would win the reader's lookup and hide that व्याख्या.
        const dotted = /^(\d+):(\d+)\.(\d+)$/.exec(restKey);
        const shortKey = dotted && dotted[1] === dotted[2] ? `${dotted[1]}:${Number(dotted[3])}` : undefined;
        const key = shortKey && curated[shortKey] && !curated[restKey] ? shortKey : restKey;
        const explanation = entry.explanation?.trim();
        const science = entry.science?.trim();
        const lifeLesson = entry.lifeLesson?.trim();
        if (science && isBoilerplateField(science)) continue;
        const prev = curated[key] ?? {};
        const next: HiCommentaryFragment[string] = { ...prev };
        if (explanation && !prev.explanation) next.explanation = explanation;
        if (science && !prev.science) next.science = science;
        // A hand-written modern-context note (### आधुनिक संदर्भ) fills a verse that has none; unlabelled.
        if (lifeLesson && !prev.lifeLesson?.includes("### आधुनिक संदर्भ")) next.lifeLesson = lifeLesson;
        if (next.explanation || next.science || next.lifeLesson) curated[key] = next;
      }
    }

    // Research notes that only repeat the verse's translation plus a stock sentence.
    if (TRANSLATION_ECHO_SCRIPTURES.has(name)) {
      const hindi = verseHindiByKey(name);
      let hidden = 0;
      for (const [key, entry] of Object.entries(curated)) {
        if (!isTranslationEchoNote(entry.science, hindi.get(key))) continue;
        const { science: _filler, ...kept } = entry;
        hidden++;
        if (kept.explanation || kept.lifeLesson) curated[key] = kept;
        else delete curated[key];
      }
      if (hidden) console.log(`${name}: ${hidden} filler research notes left out`);
    }

    // Research and practical-life notes that end in the same stock sentence on many verses are generated filler
    // wrapped around each verse's own text; the whole note is left out (source files are untouched).
    {
      const STOCK_MIN = 5;
      const lastSentence = (text: string) => {
        const parts = text.split(/(?<=[।?!])\s+/).map((s) => s.trim()).filter(Boolean);
        return (parts[parts.length - 1] ?? "").replace(/[0-9०-९]+/g, "#");
      };
      let stock = 0;
      for (const field of ["science", "lifeLesson"] as const) {
        const groups = new Map<string, string[]>();
        for (const [key, entry] of Object.entries(curated)) {
          const text = entry[field];
          if (!text) continue;
          const tail = lastSentence(text);
          if (tail.length < 40) continue;
          groups.set(tail, [...(groups.get(tail) ?? []), key]);
        }
        for (const keys of groups.values()) {
          if (keys.length < STOCK_MIN) continue;
          for (const key of keys) {
            const { [field]: _stock, ...kept } = curated[key];
            stock++;
            if (kept.explanation || kept.science || kept.lifeLesson) curated[key] = kept;
            else delete curated[key];
          }
        }
      }
      if (stock) console.log(`  ${name}: ${stock} stock-sentence research/life notes left out`);
    }

    // Leave out explanation text that is the same template on several different verses (source files are untouched).
    {
      const FIELDS = ["explanation", "science", "lifeLesson"] as const;
      const hidden = findTemplateFields(
        Object.entries(curated).map(([key, e]) => ({
          key,
          sanskrit: key,
          fields: Object.fromEntries(FIELDS.map((k) => [k, (e as Record<string, string | undefined>)[k]])),
        })),
      );
      if (hidden.size > 0) {
        for (const w of hidden) {
          const [key, field] = w.split("|");
          delete (curated[key] as Record<string, unknown>)[field];
          if (!Object.keys(curated[key]).length) delete curated[key];
        }
        console.log(`  ${name}: hid ${hidden.size} template field(s)`);
      }
    }

    // Approved rewrites of research notes (शोध व आधुनिक संदर्भ). An empty note withdraws the stored one;
    // it is published as "" so the shard's own note does not show through.
    const research = readRecord(path.resolve("data/ai-commentary", `${name}-research`)) as Record<
        string,
        { science?: string; explanation?: string | [string, string][]; lifeLesson?: string | [string, string][]; status: string }
      >;
    if (Object.keys(research).length) {
      // `science` is the research note (labelled when rewritten); `explanation` and `lifeLesson` are register
      // corrections of existing text. An empty string withdraws the stored field.
      let rewritten = 0;
      let withdrawn = 0;
      for (const [key, r] of Object.entries(research)) {
        if (r.status !== "approved") continue;
        if (typeof r.science === "string") {
          const science = r.science.trim();
          if (science) {
            curated[key] = { ...curated[key], science, scienceAi: true };
            rewritten++;
          } else {
            const { scienceAi: _label, ...rest } = curated[key] ?? {};
            curated[key] = { ...rest, science: "" };
            withdrawn++;
          }
        }
        for (const field of ["explanation", "lifeLesson"] as const) {
          if (field === "lifeLesson" && curated[key]?.lifeLesson?.includes("### आधुनिक संदर्भ")) {
            continue;
          }
          const value = r[field];
          if (typeof value === "string") {
            curated[key] = { ...curated[key], [field]: value.trim() };
            rewritten++;
          } else if (Array.isArray(value)) {
            // A list of [old, new] phrase pairs applied to the stored text.
            let text = curated[key]?.[field] ?? "";
            for (const [from, to] of value) {
              // "re:<pattern>" pairs are regular expressions (for example to drop a bracketed English gloss).
              const next = from.startsWith("re:") ? text.replace(new RegExp(from.slice(3), "gu"), to) : text.split(from).join(to);
              if (next === text) {
                console.warn(`⚠ ${name}:${key} ${field}: "${from.slice(0, 30)}" not found in the stored text`);
                continue;
              }
              text = next;
            }
            curated[key] = { ...curated[key], [field]: text };
            rewritten++;
          }
        }
      }
      console.log(`${name}: ${rewritten} fields rewritten, ${withdrawn} research notes withdrawn`);
    }

    // Pilot records replace any stored entry for their verse (the old text is kept in the source data).
    for (const p of PILOT.filter((x) => x.scriptureId === name)) {
      const existing = curated[p.commentaryKey];
      const entry = commentaryEntry(p.record) as HiCommentaryFragment[string];
      if (existing?.lifeLesson && existing.lifeLesson.includes('### आधुनिक संदर्भ')) {
        entry.lifeLesson = existing.lifeLesson;
      }
      curated[p.commentaryKey] = entry;
    }

    const entryCount = Object.keys(curated).length;
    if (entryCount === 0) {
      skipped++;
      removeRecord(path.join(OUT, name));
      continue;
    }

    // Compact JSON, one file per section; unchanged sections are not rewritten.
    const stats = writeRecord(path.join(OUT, name), curated, { split: "always", stringify: (v) => JSON.stringify(v) });
    totalEntries += entryCount;
    totalBytes += stats.bytes;
    totalFiles += stats.files;
    if (stats.largest.bytes > largest.bytes) largest = stats.largest;
    const changes = stats.written || stats.removed ? `, ${stats.written} written, ${stats.removed} removed` : "";
    console.log(`${name}: ${entryCount} curated entries in ${stats.files} files (${(stats.bytes / 1024).toFixed(1)}KB${changes})`);
  }

  // A scripture whose sources are gone leaves no published folder behind.
  for (const id of publishedCommentaryIds()) {
    if (!names.includes(id)) console.log(`removed ${id}/ (${removeRecord(path.join(OUT, id))} files): no commentary sources left`);
  }

  console.log(
    `\nPublished ${totalEntries} entries in ${totalFiles} files across ${names.length - skipped} scriptures ` +
      `(${(totalBytes / 1048576).toFixed(1)} MB total, largest ${path.relative(OUT, largest.file)} ${(largest.bytes / 1024).toFixed(0)} KB, ` +
      `${skipped} empty scriptures skipped, ${aiPublished} approved AI drafts)`,
  );

  if (totalFiles > MAX_FILES) {
    console.error(`Published commentary is ${totalFiles} files; its Cloudflare deployment takes 20,000 (limit here ${MAX_FILES}). See docs/commentary-storage.md.`);
    process.exit(1);
  }
  if (totalFiles > WARN_FILES) {
    console.warn(`⚠ Published commentary is ${totalFiles} files, nearing the 20,000-file deployment limit (docs/commentary-storage.md).`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
