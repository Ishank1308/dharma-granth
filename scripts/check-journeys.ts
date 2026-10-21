/**
 * Verifies every reading-journey lesson points at the verse it names:
 * the library's Sanskrit for that chapter and verse must contain `expect`.
 * Run: npx tsx scripts/check-journeys.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { READING_JOURNEYS } from '../data/reading-journeys';

const strip = (s: string) => s.replace(/[\s|।॥0-9०-९.‌‍]+/g, '');
let bad = 0;

for (const j of READING_JOURNEYS) {
  for (const l of j.lessons) {
    const file = path.join('public', 'data', 'scriptures-full', l.scriptureId, `ch-${l.chapter}.json`);
    let found = '';
    try {
      const d = JSON.parse(fs.readFileSync(file, 'utf8'));
      const v = d.chapter.verses.find((x: { number: number | string }) => String(x.number) === String(l.verse));
      found = v?.sanskrit ?? '';
    } catch {
      /* reported below */
    }
    // A quotation's initial अ can be absorbed by sandhi with the word before it in the running text
    // (Brihadaranyaka 1.3.28 reads "japed asato" as जपेदसतो), so the expectation may match without it.
    const want = strip(l.expect);
    if (!strip(found).includes(want) && !(want.startsWith('अ') && strip(found).includes(want.slice(1)))) {
      bad++;
      console.error(`MISMATCH ${j.id} ${l.id}: ${l.scriptureId} ${l.chapter}.${l.verse} does not contain "${l.expect}"`);
    }
  }
}
console.log(bad === 0 ? 'All journey lessons match their verses.' : `${bad} lesson(s) need fixing.`);
process.exit(bad === 0 ? 0 : 1);
