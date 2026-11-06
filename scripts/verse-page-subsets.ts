/**
 * lib/verse-page-subsets.json lists, for each scripture in
 * PARTIAL_VERSE_PAGE_SCRIPTURE_IDS (lib/verse-paths.ts), the verses that get a
 * page of their own: those with a meaning a reader can use, by the same test
 * the verse page and sitemap use (verseMeaningSummary(...).any, read from the
 * published shards and commentary).
 *
 *   npx tsx scripts/verse-page-subsets.ts           check the file is current (scripts/check-all.mjs)
 *   npx tsx scripts/verse-page-subsets.ts --write   rewrite it after publishing a meaning
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { readSeededChapter, readSeededChapterNumbers } from "../lib/read-seeded-chapters";
import { verseMeaningSummary, type VerseLike } from "../lib/verse-meaning";
import { PARTIAL_VERSE_PAGE_SCRIPTURE_IDS, verseSlug } from "../lib/verse-paths";

const FILE = resolve("lib/verse-page-subsets.json");

const subsets: Record<string, string[]> = {};
for (const id of PARTIAL_VERSE_PAGE_SCRIPTURE_IDS) {
  const keys: string[] = [];
  for (const chapterId of readSeededChapterNumbers(id)) {
    const verses = (readSeededChapter(id, chapterId)?.chapter.verses ?? []) as VerseLike[];
    for (const verse of verses) {
      const slug = verseSlug(verse.number);
      if (slug && verseMeaningSummary(id, chapterId, verse).any) keys.push(`${chapterId}:${slug}`);
    }
  }
  subsets[id] = keys;
}

const next = `${JSON.stringify(subsets, null, 2)}\n`;
const current = readFileSync(FILE, "utf8").replace(/\r\n/g, "\n");

if (process.argv.includes("--write")) {
  writeFileSync(FILE, next, "utf8");
  for (const [id, keys] of Object.entries(subsets)) console.log(`${id}: ${keys.length} verse pages`);
} else if (current !== next) {
  console.error(
    "✗ lib/verse-page-subsets.json is out of date with the published meanings. " +
      "Run: npx tsx scripts/verse-page-subsets.ts --write",
  );
  process.exit(1);
} else {
  console.log(`✓ verse-page subsets current (${Object.entries(subsets).map(([id, k]) => `${id} ${k.length}`).join(", ")})`);
}
