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


/** Skandha 1, Adhyāya 2 is library chapter 2 (global chapter numbering). */
const chapter2 = scripture.chapters.find((entry) => Number(entry.number) === 2);
assert.ok(chapter2, 'Devi Bhagavata Skandha 1 Chapter 2 is missing');
const chapter2ByVerse = new Map(chapter2.verses.map((verse) => [String(verse.number), verse]));
assert.equal(chapter2.verses.length, 40, 'Devi Bhagavata 1.2 should contain 40 Sanskrit verses');
assert.equal(chapter2ByVerse.size, 40, 'Devi Bhagavata 1.2 contains a duplicate verse key');
for (let n = 1; n <= 40; n++) {
  const verse = chapter2ByVerse.get(String(n));
  assert.ok(verse?.sanskrit, `Missing source Sanskrit at Devi Bhagavata 1.2.${n}`);
}
const chapter2Witness = new Map<number, string>([
  [1, 'धन्योऽहमतिभाग्योऽहं'],
  [11, 'अष्टादश'],
  [18, 'वंशो मन्वन्तराणि'],
  [34, 'पशुहीनाः कृता यज्ञाः'],
  [40, 'प्रकटय भगवत्या'],
]);
for (const [number, phrase] of chapter2Witness) {
  assert.ok(
    normalize(chapter2ByVerse.get(String(number))?.sanskrit ?? '').includes(normalize(phrase)),
    `Devi Bhagavata 1.2.${number}: published Sanskrit diverges from selected witness phrase`,
  );
}

const draft = JSON.parse(readFileSync('data/written-meanings/devibhagavat.json', 'utf8')) as {
  reviewStatus?: string;
  meanings: Record<string, { hindi?: string }>;
};
assert.equal(draft.reviewStatus, 'unreviewed', 'draft meanings must stay unpublished until independently source-verified');
const keys = Object.keys(draft.meanings);
assert.equal(keys.length, 65, 'draft must contain Chapter 1 verses 1-25 and Chapter 2 verses 1-40');
for (const [chapterNumber, verseCount] of [[1, 25], [2, 40]] as const) {
  const sourceChapter = scripture.chapters.find((entry) => Number(entry.number) === chapterNumber);
  assert.ok(sourceChapter, `Missing source chapter ${chapterNumber}`);
  for (let n = 1; n <= verseCount; n++) {
    const key = `${chapterNumber}:${n}`;
    assert.ok(sourceChapter.verses.some((v) => String(v.number) === String(n)), `Source verse not found: ${key}`);
    const hindi = draft.meanings[key]?.hindi;
    assert.ok(hindi && /[ऀ-ॿ]/.test(hindi) && hindi.length >= 40, `Missing/substantively empty Hindi draft ${key}`);
  }
}
// The public chapter shard is what readers actually see. A source-checked
// chapter must not sit forever in data/written-meanings/ without reaching it.
const publicChapter2 = JSON.parse(readFileSync('public/data/scriptures-full/devibhagavat/ch-2.json', 'utf8')) as {
  chapter: { verses: Array<{ number: number | string; sanskrit?: string; hindi?: string; hindiSource?: string; hindiReviewRequired?: boolean }> };
};
assert.equal(publicChapter2.chapter.verses.length, 40, 'Published Devi Bhagavata 1.2 should contain all 40 Sanskrit verses');
for (let n = 1; n <= 40; n++) {
  const key = `2:${n}`;
  const verse = publicChapter2.chapter.verses.find((v) => String(v.number) === String(n));
  assert.ok(verse, `Published Devi Bhagavata verse missing: ${key}`);
  assert.equal(verse.hindi, draft.meanings[key].hindi, `Devi Bhagavata ${key}: source-checked Hindi not visible in published shard`);
  assert.equal(verse.hindiSource, 'ai', `Devi Bhagavata ${key}: AI-assisted source attribution missing`);
  assert.notEqual(verse.hindiReviewRequired, true, `Devi Bhagavata ${key}: stale OCR hold hides newly drafted Hindi`);
}
console.log('✓ Devi Bhagavata 1.2 publishes all 40 source-checked AI-labelled Hindi meanings in reader shards; remaining meanings are still protected.');
