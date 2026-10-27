/**
 * Guards the filler-chapter rule (scripts/lib/filler-chapters.ts): every published chapter carries exactly the verses
 * of its source chapter, except filler chapters, which are published empty so the reader shows "text being added".
 *
 * Run: tsx scripts/check-filler-chapters.ts
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fillerChapters } from "./lib/filler-chapters";

type Chapter = { number: number | string; verses?: unknown[] };
const FULL_DIR = resolve(__dirname, "..", "public/data/scriptures-full");
const failures: string[] = [];
let emptied = 0;

for (const file of readdirSync(FULL_DIR).filter((f) => f.endsWith(".json")).sort()) {
  const id = file.slice(0, -5);
  const manifestFile = join(FULL_DIR, id, "manifest.json");
  if (!existsSync(manifestFile)) continue;
  const book = JSON.parse(readFileSync(join(FULL_DIR, file), "utf8")) as { chapters: Chapter[] };
  const manifest = JSON.parse(readFileSync(manifestFile, "utf8")) as { chapters: Array<{ number: number; verseCount: number }> };
  const filler = fillerChapters(id, book.chapters);
  const published = new Map(manifest.chapters.map((c) => [Number(c.number), c.verseCount]));
  for (const ch of book.chapters) {
    const n = Number(ch.number);
    const expected = filler.has(n) ? 0 : ch.verses?.length ?? 0;
    if (published.get(n) !== expected) failures.push(`${id} ${n}: published ${published.get(n)} verse(s), expected ${expected}`);
  }
  emptied += filler.size;
}

if (failures.length) {
  console.error(`Filler-chapter check failed (${failures.length}):`);
  for (const f of failures.slice(0, 40)) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`✓ Filler chapters: ${emptied} chapter(s) published empty; every other chapter carries all its verses.`);
