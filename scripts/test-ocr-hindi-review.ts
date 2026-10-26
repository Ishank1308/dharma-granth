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

assert.equal(review.entries.length, 64, 'the original OCR review queue has 64 verse coordinates');
for (const { scriptureId, chapter, verse } of review.entries) {
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
  // English is never rewritten; it is only left out when the same English sits on other, different verses
  // (a template or misplaced line, see findMeaningTemplates in scripts/lib/template-text.ts).
  if (published.translation !== undefined) {
    assert.equal(published.translation, source.translation, `English translation is unchanged: ${key}`);
  }
}

const control = shardCache.get('agnipuran:18')?.chapter.verses
  .find((candidate) => String(candidate.number) === '15');
assert.ok(control?.hindi, 'an adjacent Hindi meaning remains available');
assert.equal(control.hindiReviewRequired, undefined, 'the adjacent verse is not quarantined');

console.log(`OCR Hindi source-review gate passed: ${keys.size} meanings withheld; original source and canonical fields preserved.`);
