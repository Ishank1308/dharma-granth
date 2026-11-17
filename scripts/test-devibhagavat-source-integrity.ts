/**
 * Narrow regression test: the live Devi Bhagavata Skandha 1 chapter 1
 * preserves complete Sanskrit verses even though the older OCR staging
 * extract (scripts/devibhagavat_extracted.json) drops some half-lines.
 *
 * Witness: https://sanskritdocuments.org/doc_purana/devIbhAgavatam01.html
 * This checks specific known source-integrity defects, not translation
 * accuracy or agreement with every Gita Press edition.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

type Verse = { number: number | string; sanskrit?: string };
type Chapter = { number: number | string; verses: Verse[] };
const scripture = JSON.parse(readFileSync('public/data/scriptures-full/devibhagavat.json', 'utf8')) as {
  chapters: Chapter[];
};
const chapter = scripture.chapters.find((entry) => Number(entry.number) === 1);
assert.ok(chapter, 'Devi Bhagavata chapter 1 is missing');

const required = new Map<number, string[]>([
  [2, ['सूत सूत महाभाग धन्योऽसि पुरुषर्षभ', 'यदधीतास्त्वया सम्यक् पुराणसंहिताः शुभाः']],
  [3, ['अष्टादश पुराणानि कृष्णेन मुनिनानघ', 'कथितानि सुदिव्यानि पठितानि त्वयानघ']],
  [4, ['पञ्चलक्षणयुक्तानि सरहस्यानि मानद', 'त्वया ज्ञातानि सर्वाणि व्यासात्सत्यवतीसुतात्']],
  [6, ['समाजोऽयं मुनीनां हि श्रोतुकामोऽस्ति पुण्यदाम्', 'पुराणसंहितां सूत ब्रूहि त्वं नः समाहितः']],
]);

function normalize(text: string): string {
  return text.normalize('NFC').replace(/[\s।॥०-९0-9|.,:;!?\u200c\u200d]/g, '');
}

for (const [number, halves] of required) {
  const verse = chapter.verses.find((entry) => Number(entry.number) === number);
  assert.ok(verse, `Missing Devi Bhagavata 1:${number}`);
  assert.ok(verse.sanskrit, `Missing Sanskrit at Devi Bhagavata 1:${number}`);
  const actual = normalize(verse.sanskrit);
  for (const half of halves) {
    assert.ok(actual.includes(normalize(half)), `Devi Bhagavata 1:${number} is missing a known Sanskrit half-line: ${half}`);
  }
}
console.log('✓ Devi Bhagavata 1:2, 1:3, 1:4 and 1:6 retain both Sanskrit half-lines.');
