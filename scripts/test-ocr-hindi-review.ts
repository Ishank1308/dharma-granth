import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import review from '../data/ocr-hindi-review.json';

type Verse = {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
  hindi?: string;
  hindiReviewRequired?: boolean;
};
type Chapter = { number: number | string; verses: Verse[] };
type Book = { chapters: Chapter[] };
type Shard = { chapter: Chapter };

const root = path.resolve(__dirname, '..');
const sourceCache = new Map<string, Book>();
const shardCache = new Map<string, Shard>();
const keys = new Set<string>();

assert.equal(review.entries.filter((e) => !('queue' in e)).length, 64, 'the original OCR review queue has 64 verse coordinates');
for (const entry of review.entries) {
  const { scriptureId, chapter, verse } = entry;
  // Refilled Hindi (data/refill/*.json) waits for review; its English is judged by the alignment step like any other.
  const refilled = 'queue' in entry;
  const key = `${scriptureId}:${chapter}:${verse}`;
  assert.ok(!keys.has(key), `duplicate review coordinate ${key}`);
  keys.add(key);

  if (!sourceCache.has(scriptureId)) {
    sourceCache.set(scriptureId, JSON.parse(fs.readFileSync(
      path.join(root, 'public/data/scriptures-full', `${scriptureId}.json`), 'utf8',
    )) as Book);
  }
  const source = sourceCache.get(scriptureId)?.chapters
    .find((candidate) => Number(candidate.number) === chapter)?.verses
    .find((candidate) => String(candidate.number) === verse);
  assert.ok(source, `source verse exists: ${key}`);
  assert.ok(source.hindi?.trim(), `original Hindi transcription is preserved: ${key}`);
  assert.equal(source.hindiReviewRequired, undefined, `source is not overwritten: ${key}`);

  const shardKey = `${scriptureId}:${chapter}`;
  if (!shardCache.has(shardKey)) {
    shardCache.set(shardKey, JSON.parse(fs.readFileSync(
      path.join(root, 'public/data/scriptures-full', scriptureId, `ch-${chapter}.json`), 'utf8',
    )) as Shard);
  }
  const published = shardCache.get(shardKey)?.chapter.verses
    .find((candidate) => String(candidate.number) === verse);
  assert.ok(published, `published verse exists: ${key}`);
  assert.equal(published.hindi, undefined, `unverified Hindi is withheld: ${key}`);
  assert.equal(published.hindiReviewRequired, true, `reader gets a review notice: ${key}`);
  assert.equal(published.sanskrit, source.sanskrit, `canonical Sanskrit is unchanged: ${key}`);
  assert.equal(published.transliteration, source.transliteration, `IAST is unchanged: ${key}`);
  if (refilled) assert.ok(published.translation === undefined || published.translation === source.translation, `English is withheld or unchanged: ${key}`);
  else assert.equal(published.translation, source.translation, `English translation is unchanged: ${key}`);
}

// The control comes from an aligned chapter: chapters whose Hindi drifted are hidden by scripts/lib/meaning-alignment.ts.
assert.ok(!keys.has('lingapuran:4:5'), 'the control verse is not in the review queue');
const controlShard = JSON.parse(fs.readFileSync(
  path.join(root, 'public/data/scriptures-full', 'lingapuran', 'ch-4.json'), 'utf8',
)) as Shard;
const control = controlShard.chapter.verses
  .find((candidate) => String(candidate.number) === '5');
assert.ok(control?.hindi, 'an unflagged verse keeps its Hindi meaning');
assert.equal(control.hindiReviewRequired, undefined, 'the unflagged verse is not quarantined');

console.log(`OCR Hindi source-review gate passed: ${keys.size} meanings withheld; original source and canonical fields preserved.`);
