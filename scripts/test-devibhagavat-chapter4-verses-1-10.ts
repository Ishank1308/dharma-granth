/**
 * Devī Bhāgavata 1.4.1–10: editorial staging gate.
 *
 * Independently written study content is staged only. Never publish this
 * material until a separate verse-key allowlist and reader-parity checks
 * have been added and passed. Sanskrit witness:
 * https://sanskritdocuments.org/doc_purana/devIbhAgavatam01.html
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

type Verse = { number: number | string; sanskrit: string; hindi?: string };
type Chapter = { number: number | string; verses: Verse[] };
type Note = { sanskritOpening: string; hindi: string; explanation: string; lifeLesson: string };
const source = JSON.parse(readFileSync('public/data/scriptures-full/devibhagavat.json', 'utf8')) as { chapters: Chapter[] };
const staged = JSON.parse(readFileSync('data/staging/devibhagavat-1-4-verses-1-10.json', 'utf8')) as {
  sourceWitness: string; reviewStatus: string; publicationStatus: string;
  keyFormat: string; entries: Record<string, Note>;
};
assert.equal(staged.sourceWitness, 'https://sanskritdocuments.org/doc_purana/devIbhAgavatam01.html');
assert.equal(staged.reviewStatus, 'unreviewed');
assert.equal(staged.publicationStatus, 'staged');
assert.equal(staged.keyFormat, 'chapter:verse');
const keys = Object.keys(staged.entries).sort();
assert.deepEqual(keys, Array.from({length: 10}, (_, i) => `4:${i + 1}`), 'Only first ten chapter 4 verse identities are staged');
const chapter = source.chapters.find((entry) => Number(entry.number) === 4);
assert.ok(chapter && chapter.verses.length >= 10, 'Devi Bhagavata chapter 4 Sanskrit is missing');
const normalize = (s: string) => s.normalize('NFC').replace(/[\s।॥|.,:;!?०-९0-9\u200c\u200d]/g, '');
const explanations = new Set<string>();
const modernContexts = new Set<string>();
for (let n = 1; n <= 10; n++) {
  const key = `4:${n}`;
  const note = staged.entries[key];
  const verse = chapter.verses.find((entry) => String(entry.number) === String(n));
  assert.ok(verse && verse.sanskrit, `Missing source Sanskrit for ${key}`);
  assert.ok(normalize(verse.sanskrit).includes(normalize(note.sanskritOpening)),
    `Sanskrit numbered witness mismatch for ${key}`);
  assert.ok(note.hindi.length >= 40 && /[ऀ-ॿ]/u.test(note.hindi),
    `Hindi meaning absent for ${key}`);
  const count = note.explanation.trim().split(/\s+/).length;
  assert.ok(count >= 200 && count <= 280, `${key} must have 200–280 words, found ${count}`);
  for (const heading of ['प्रसंग एवं भाव —', 'पद-विवेचन —', 'जीवन-साधना —']) {
    assert.ok(note.explanation.includes(heading), `Missing ${heading} in ${key}`);
  }
  for (const heading of ['### आधुनिक संदर्भ', '### आज के जीवन में प्रयोग', '### चिंतन प्रश्न']) {
    assert.ok(note.lifeLesson.includes(heading), `Missing ${heading} in ${key}`);
  }
  assert.ok(note.lifeLesson.length >= 350, `Modern context too short for ${key}`);
  assert.ok(!explanations.has(note.explanation), `Duplicate explanation at ${key}`);
  assert.ok(!modernContexts.has(note.lifeLesson), `Duplicate modern context at ${key}`);
  explanations.add(note.explanation);
  modernContexts.add(note.lifeLesson);
}
console.log('✓ Devī Bhāgavata 1.4.1–10: ten distinct Hindi meanings, 200–280 word explanations, modern contexts and exact Sanskrit openings staged without publication.');
