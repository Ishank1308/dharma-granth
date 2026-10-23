/**
 * Publish curated-only hi-commentary JSON for the web/mobile fetch layer.
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
import type { HiCommentaryFragment } from "../data/hi-commentary/_types";
import { findTemplateFields } from "./lib/template-text";
import { commentaryEntry, loadPilotOverlay } from "./pilot/overlay";

// Editorial pilot records (data/pilot/records) are published through this file, one entry per verse.
const PILOT = loadPilotOverlay();

const SRC = path.resolve("data/hi-commentary");
const OUT = path.resolve("public/data/hi-commentary");
const MAX_TOTAL_MB = 15;

async function safeWrite(filePath: string, data: string) {
  let tries = 0;
  while (true) {
    try {
      fs.writeFileSync(filePath, data, { flag: 'w' });
      return;
    } catch (e: any) {
      if (++tries >= 10) throw e;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}

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

    const restPath = path.join(SRC, `${name}-rest.json`);
    if (fs.existsSync(restPath)) {
      const rest = JSON.parse(fs.readFileSync(restPath, "utf8")) as HiCommentaryFragment;
      for (const [key, entry] of Object.entries(rest)) {
        const explanation = entry.explanation?.trim();
        const science = entry.science?.trim();
        if (science && isBoilerplateField(science)) continue;
        const prev = curated[key] ?? {};
        const next: HiCommentaryFragment[string] = { ...prev };
        if (explanation && !prev.explanation) next.explanation = explanation;
        if (science && !prev.science) next.science = science;
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
    const researchPath = path.resolve("data/ai-commentary", `${name}-research.json`);
    if (fs.existsSync(researchPath)) {
      // `science` is the research note (labelled when rewritten); `explanation` and `lifeLesson` are register
      // corrections of existing text. An empty string withdraws the stored field.
      const research = JSON.parse(fs.readFileSync(researchPath, "utf8")) as Record<
        string,
        { science?: string; explanation?: string | [string, string][]; lifeLesson?: string | [string, string][]; status: string }
      >;
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
      const stale = path.join(OUT, `${name}.json`);
      if (fs.existsSync(stale)) fs.unlinkSync(stale);
      continue;
    }

    const json = JSON.stringify(curated);
    const dest = path.join(OUT, `${name}.json`);
    if (!fs.existsSync(dest) || fs.readFileSync(dest, "utf8") !== json) {
      await safeWrite(dest, json);
    }
    totalEntries += entryCount;
    totalBytes += Buffer.byteLength(json);
    console.log(`${name}: ${entryCount} curated entries (${(json.length / 1024).toFixed(1)}KB)`);
  }

  const totalMB = totalBytes / (1024 * 1024);
  console.log(
    `\nPublished ${totalEntries} entries across ${names.length - skipped} files ` +
      `(${(totalBytes / 1024).toFixed(0)}KB total, ${skipped} empty scriptures skipped, ` +
      `${aiPublished} approved AI drafts)`,
  );

  if (totalMB > MAX_TOTAL_MB) {
    console.error(`Published commentary exceeds ${MAX_TOTAL_MB}MB — check curated filter.`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
