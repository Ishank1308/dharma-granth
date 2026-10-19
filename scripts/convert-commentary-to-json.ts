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
import { isBoilerplateField } from "../data/hi-commentary/quality";
import { aiQueueScriptureIds, approvedAiEntries } from "../data/hi-commentary/_ai-queue";
import type { HiCommentaryFragment } from "../data/hi-commentary/_types";
import { findTemplateFields } from "./lib/template-text";

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
  const names = Array.from(new Set([...fragmentNames, ...aiQueueScriptureIds()])).sort();

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

    // Approved AI drafts fill gaps only; hand-written commentary always wins.
    const { entries: ai, stale } = approvedAiEntries(name);
    for (const key of stale) {
      console.warn(`⚠ ${name}:${key} approved AI draft skipped — the verse text changed since review`);
    }
    for (const [key, entry] of Object.entries(ai)) {
      // Any hand-written field for this verse means a human owns it; never mix.
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