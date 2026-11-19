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
import { execFileSync } from 'node:child_process';

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

/** Chapter 3 has 43 distinct original Sanskrit verses; all 3:1–3:43 are released. */
const chapter3 = scripture.chapters.find((entry) => Number(entry.number) === 3);
assert.ok(chapter3, 'Devi Bhagavata Skandha 1 Chapter 3 is missing');
assert.equal(chapter3.verses.length, 43, 'Devi Bhagavata 1.3 should contain all 43 Sanskrit verses');
assert.equal(new Set(chapter3.verses.map(v => String(v.number))).size, 43, 'Duplicate chapter 3 verse key');

const draft = JSON.parse(readFileSync('data/written-meanings/devibhagavat.json', 'utf8')) as {
  reviewStatus?: string;
  meanings: Record<string, { hindi?: string }>;
};
assert.equal(draft.reviewStatus, 'unreviewed', 'bulk importing the AI-written batch must remain blocked');
const keys = Object.keys(draft.meanings);
assert.equal(keys.length, 143, 'source batch should contain chapters 1:1–25, 2:1–40, 3:1–43 and 4:1–35');
for (const [chapterNumber, verseCount] of [[1, 25], [2, 40], [3, 43], [4, 35]] as const) {
  const sourceChapter = scripture.chapters.find((entry) => Number(entry.number) === chapterNumber);
  assert.ok(sourceChapter, `Missing source chapter ${chapterNumber}`);
  for (let n = 1; n <= verseCount; n++) {
    const key = `${chapterNumber}:${n}`;
    assert.ok(sourceChapter.verses.some((v) => String(v.number) === String(n)), `Source verse not found: ${key}`);
    const hindi = draft.meanings[key]?.hindi;
    assert.ok(hindi && /[ऀ-ॿ]/.test(hindi) && hindi.length >= 40, `Missing/substantively empty Hindi draft ${key}`);
  }
}
// Chapter 1 is released through the same narrow verse-identity overlay as chapter 2.
const publicChapter1 = JSON.parse(readFileSync('public/data/scriptures-full/devibhagavat/ch-1.json', 'utf8')) as {
  chapter: { verses: Array<{ number: number | string; sanskrit?: string; hindi?: string; hindiSource?: string; hindiReviewRequired?: boolean }> };
};
assert.equal(publicChapter1.chapter.verses.length, 25, 'Published Devi Bhagavata chapter 1 should contain 25 verses');
for (let n = 1; n <= 25; n++) {
  const key = `1:${n}`;
  const verse = publicChapter1.chapter.verses.find((v) => String(v.number) === String(n));
  assert.ok(verse, `Published Devi Bhagavata verse missing: ${key}`);
  assert.equal(verse.hindi, draft.meanings[key].hindi, `Hindi meaning not visible on published reader: ${key}`);
  assert.equal(verse.hindiSource, 'ai', `AI translation attribution missing: ${key}`);
  assert.notEqual(verse.hindiReviewRequired, true, `Old OCR hold hides newly written Hindi ${key}`);
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
const publicChapter3 = JSON.parse(readFileSync('public/data/scriptures-full/devibhagavat/ch-3.json', 'utf8')) as {
  chapter: { verses: Array<{ number: number | string; sanskrit?: string; hindi?: string; hindiSource?: string; hindiReviewRequired?: boolean }> };
};
assert.equal(publicChapter3.chapter.verses.length, 43, 'Chapter 3 must preserve all Sanskrit verses');
for (let n = 1; n <= 43; n++) {
  const key = `3:${n}`;
  const verse = publicChapter3.chapter.verses.find((v) => String(v.number) === String(n));
  assert.ok(verse, `Published source verse missing: ${key}`);
  assert.equal(verse.hindi, draft.meanings[key].hindi, `Reader meaning missing: ${key}`);
  assert.equal(verse.hindiSource, 'ai', `AI attribution missing: ${key}`);
  assert.notEqual(verse.hindiReviewRequired, true, `Stale OCR hold at ${key}`);
  assert.equal(verse.sanskrit, chapter3.verses.find(v => String(v.number) === String(n))?.sanskrit,
    `Original Sanskrit modified at ${key}`);
}
const chapter4 = scripture.chapters.find((entry) => Number(entry.number) === 4);
assert.ok(chapter4, 'Devi Bhagavata Skandha 1 Chapter 4 is missing');
assert.equal(chapter4.verses.length, 65, 'Chapter 4 must preserve all 65 Sanskrit verses');
const publicChapter4 = JSON.parse(readFileSync('public/data/scriptures-full/devibhagavat/ch-4.json', 'utf8')) as {
  chapter: { verses: Array<{ number: number | string; sanskrit?: string; hindi?: string; hindiSource?: string; hindiReviewRequired?: boolean }> };
};
assert.equal(publicChapter4.chapter.verses.length, 65, 'Published chapter 4 must preserve all 65 Sanskrit verses');
for (let n = 1; n <= 35; n++) {
  const key = `4:${n}`;
  const verse = publicChapter4.chapter.verses.find((v) => String(v.number) === String(n));
  assert.ok(verse, `Published source verse missing: ${key}`);
  assert.equal(verse.hindi, draft.meanings[key].hindi, `Reader meaning missing: ${key}`);
  assert.equal(verse.hindiSource, 'ai', `AI attribution missing: ${key}`);
  assert.notEqual(verse.hindiReviewRequired, true, `Stale OCR hold at ${key}`);
  assert.equal(verse.sanskrit, chapter4.verses.find(v => String(v.number) === String(n))?.sanskrit,
    `Original Sanskrit modified at ${key}`);
}
assert.ok(publicChapter4.chapter.verses.slice(35).every((verse) => verse.hindiSource !== 'ai'),
  'Unreleased chapter 4 verses must not inherit AI translation status');
console.log('✓ Devi Bhagavata publishes 143 source-keyed Hindi meanings (chapters 1–2, 3:1–43 and 4:1–35).');

// Future chapter gate: the next chapter must not inherit the success signal for
// chapters 1–3. Readers should never confuse the raw Sanskrit chapter count with
// an independently checked and released Hindi interpretation.
const subsequentChapters = scripture.chapters.filter((entry) => Number(entry.number) > 4);
assert.ok(subsequentChapters.length > 0, 'Devi Bhagavata should retain chapters after 1.3');
for (const sourceChapter of subsequentChapters) {
  const n = Number(sourceChapter.number);
  assert.ok(Number.isInteger(n), 'Devi Bhagavata chapter number must be numeric');
  assert.ok(sourceChapter.verses.length > 0, `Devi Bhagavata chapter ${n} has no Sanskrit verses`);
  const keys = sourceChapter.verses.map((verse) => String(verse.number));
  assert.equal(new Set(keys).size, keys.length, `Duplicate Sanskrit verse identity in chapter ${n}`);
  assert.ok(sourceChapter.verses.every((verse) =>
    typeof verse.sanskrit === 'string' && /[ऀ-ॿ]/u.test(verse.sanskrit)),
  `Missing Sanskrit text in chapter ${n}`);
}
const nextChapter = subsequentChapters.find((entry) => Number(entry.number) === 5);
assert.ok(nextChapter, 'Devi Bhagavata 1.5 must exist before drafting the next guarded release');
assert.ok(nextChapter.verses.length > 0, 'Devi Bhagavata 1.5 has no numbered Sanskrit verses');
assert.ok(!Object.keys(draft.meanings).some((key) => /^(?:[5-9]|[1-9][0-9]+):/.test(key)),
  'Unverified later chapters must not be silently added to the 143-verse release batch');
console.log(`✓ Devi Bhagavata later Sanskrit chapters retained; chapter 5 has ${nextChapter.verses.length} verses awaiting independent release checks.`);



/**
 * Reader-visible structured व्याख्या, separately from verse meanings:
 * all 143 source-checked, AI-assisted notes and modern-context panels must reach the reader.
 * This is a structural/source-identity check, not scholar certification.
 */
type StructuredEntry = {
  status?: string;
  sanskritOpening?: string;
  sourceWitness?: string;
  explanation?: string;
  lifeLesson?: string;
};
const structured = JSON.parse(readFileSync('data/ai-commentary/devibhagavat.json', 'utf8')) as Record<string, StructuredEntry>;
assert.equal(Object.keys(structured).length, 143, 'Devi Bhagavata source batch must contain 143 structured explanations');
const publishedCommentary = JSON.parse(readFileSync('public/data/hi-commentary/devibhagavat.json', 'utf8')) as
  Record<string, { explanation?: string; lifeLesson?: string; ai?: boolean }>;
const explanationSet = new Set<string>();
const modernContextSet = new Set<string>();
for (const [chapterNumber, sourceChapter, verseCount] of [
  [1, chapter, 25],
  [2, chapter2, 40],
  [3, chapter3, 43],
  [4, chapter4, 35],
] as const) {
  for (let n = 1; n <= verseCount; n++) {
    const key = `${chapterNumber}:${n}`;
    const item = structured[key];
    const verse = sourceChapter.verses.find(v => String(v.number) === String(n));
    assert.ok(item && verse?.sanskrit, `Missing Sanskrit or source-checked explanation ${key}`);
    assert.equal(item.status, 'source-checked', `Unjustified editorial review status at ${key}`);
    assert.equal(item.sourceWitness, 'https://sanskritdocuments.org/doc_purana/devIbhAgavatam01.html',
      `Unexpected primary Sanskrit witness at ${key}`);
    const opening = normalize(item.sanskritOpening ?? '');
    assert.ok(opening.length >= 8 && normalize(verse.sanskrit).includes(opening),
      `Sanskrit witness opening does not match ${key}`);
    const explanation = item.explanation ?? '';
    const words = explanation.trim().split(/\s+/).filter(Boolean).length;
    assert.ok(words >= 200 && words <= 280,
      `Verse-specific व्याख्या at ${key} must contain 200–280 words; found ${words}`);
    assert.ok(explanation.includes('प्रसंग एवं भाव — ') &&
      explanation.includes('पद-विवेचन — ') &&
      explanation.includes('जीवन-साधना — '), `Missing three movements at ${key}`);
    assert.ok(!explanationSet.has(explanation), `Repeated template commentary at ${key}`);
    explanationSet.add(explanation);
    assert.equal(publishedCommentary[key]?.explanation, explanation,
      `Structured व्याख्या is missing from web reader JSON: ${key}`);
    assert.equal(publishedCommentary[key]?.ai, true,
      `Source-checked व्याख्या must retain an explicit AI label: ${key}`);
    if ([1, 2, 3, 4].includes(chapterNumber)) {
      const modern = item.lifeLesson ?? '';
      assert.ok(modern.includes('### आधुनिक संदर्भ') &&
        modern.includes('### आज के जीवन में प्रयोग') &&
        modern.includes('### चिंतन प्रश्न'),
        `Missing verse-specific structured modern context: ${key}`);
      assert.ok(modern.trim().length >= 350, `Modern context too short: ${key}`);
      assert.ok(!modernContextSet.has(modern), `Repeated modern-context template at ${key}`);
      modernContextSet.add(modern);
      assert.equal(publishedCommentary[key]?.lifeLesson, modern,
        `Modern-context panel data missing from published reader JSON: ${key}`);
    }
  }
}
const register = execFileSync(process.execPath, [
  'scripts/check-hindi-register.mjs',
  'data/ai-commentary/devibhagavat.json',
], { encoding: 'utf8' });
assert.match(register, /sentences to fix 0, तुम to check 0/,
  'Devi Bhagavata explanation has colloquial words or informal address');
console.log('✓ Devi Bhagavata publishes 143 distinct Sanskrit-keyed व्याख्या and 143 individually written modern-context panels.');
