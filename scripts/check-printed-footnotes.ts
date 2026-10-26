/**
 * Guards the publish-time footnote strip (scripts/lib/printed-footnotes.ts). For every published verse of a scripture
 * whose printed footnotes are filed in front of its verses, the shard may differ from the source only by a leading
 * footnote block: the source must open with a footnote number (so no verse text before it is lost), the published
 * Sanskrit must be a non-empty tail of the source, and the transliteration likewise.
 *
 * Run: tsx scripts/check-printed-footnotes.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { FOOTNOTE_SCRIPTURES } from "./lib/printed-footnotes";

type Verse = { number: number | string; sanskrit?: string; transliteration?: string };
type Chapter = { number: number | string; verses: Verse[] };

const FULL_DIR = resolve(__dirname, "..", "public/data/scriptures-full");
const failures: string[] = [];
let stripped = 0;

for (const id of FOOTNOTE_SCRIPTURES) {
  const book = JSON.parse(readFileSync(join(FULL_DIR, `${id}.json`), "utf8")) as { chapters: Chapter[] };
  for (const ch of book.chapters) {
    const shardFile = join(FULL_DIR, id, `ch-${ch.number}.json`);
    if (!existsSync(shardFile)) continue;
    const published = (JSON.parse(readFileSync(shardFile, "utf8")) as { chapter: Chapter }).chapter.verses;
    ch.verses.forEach((source, i) => {
      const out = published[i];
      const ref = `${id}:${ch.number}:${source.number}`;
      if (!out || String(out.number) !== String(source.number)) return void failures.push(`${ref}: published verse missing or out of order`);
      if (out.sanskrit === source.sanskrit) return;
      stripped++;
      const sa = source.sanskrit ?? "";
      const pub = out.sanskrit ?? "";
      if (!/^\s*[०-९0-9]{1,2}\s/.test(sa)) failures.push(`${ref}: Sanskrit changed although it does not open with a footnote`);
      if ((pub.match(/[अ-ह]/g) ?? []).length < 12) failures.push(`${ref}: published Sanskrit is (nearly) empty`);
      if (!sa.trimEnd().endsWith(pub.trim())) failures.push(`${ref}: published Sanskrit is not the tail of the source`);
      const tr = source.transliteration ?? "";
      const pubTr = out.transliteration ?? "";
      if (pubTr !== tr && !tr.trimEnd().endsWith(pubTr.trim())) failures.push(`${ref}: published transliteration is not the tail of the source`);
    });
  }
}

if (failures.length) {
  console.error(`Printed-footnote strip check failed (${failures.length}):`);
  for (const f of failures.slice(0, 40)) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`✓ Printed footnotes: ${stripped} verse(s) published without their leading footnote block; nothing else changed.`);
