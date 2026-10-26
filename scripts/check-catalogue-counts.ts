/**
 * The catalogue (data/scripture-meta.ts) must count what the library publishes: totalChapters and totalVerses equal
 * the chapters and verses in each scripture's published manifest, and canonicalTotalVerses, when present, is the larger
 * traditional size of a partial text ("13,487 of about 15,000"). Fix a failure by updating the catalogue entry.
 *
 * Run: tsx scripts/check-catalogue-counts.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { scriptureCatalog } from "../data/scripture-meta";

const FULL_DIR = resolve(__dirname, "..", "public/data/scriptures-full");
const failures: string[] = [];
let checked = 0;

for (const meta of scriptureCatalog) {
  const manifestFile = join(FULL_DIR, meta.id, "manifest.json");
  if (!existsSync(manifestFile)) continue;
  const manifest = JSON.parse(readFileSync(manifestFile, "utf8")) as { chapters: Array<{ verseCount: number }> };
  const held = manifest.chapters.filter((c) => c.verseCount > 0);
  const verses = held.reduce((n, c) => n + c.verseCount, 0);
  if (verses === 0) continue;
  checked++;
  if (meta.totalChapters !== held.length) failures.push(`${meta.id}: totalChapters ${meta.totalChapters}, library has ${held.length}`);
  if (meta.totalVerses !== verses) failures.push(`${meta.id}: totalVerses ${meta.totalVerses}, library has ${verses}`);
  if (meta.canonicalTotalVerses != null && meta.canonicalTotalVerses <= verses) {
    failures.push(`${meta.id}: canonicalTotalVerses ${meta.canonicalTotalVerses} is not larger than the ${verses} verses held`);
  }
}

if (failures.length) {
  console.error(`Catalogue counts differ from the published library (${failures.length}):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`✓ Catalogue counts: ${checked} scriptures count exactly what the library publishes.`);
