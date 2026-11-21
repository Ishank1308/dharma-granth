// Checks the chapter summaries the app bundles (scripts/build-study.mjs): every chapter has text
// in both languages, and every key verse opens a real verse.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { buildStudy } from './build-study.mjs';

const GEN = resolve(dirname(fileURLToPath(import.meta.url)), '../src/content/generated');
const read = (f) => JSON.parse(readFileSync(join(GEN, f), 'utf8'));
const haveContent = existsSync(join(GEN, 'catalog.json'));

test('builds summaries from the website data', async () => {
  await buildStudy();
  const summaries = read('study/summaries.json');
  assert.ok(summaries.bhagavadgita?.chapters.length === 18, 'all 18 Gita chapters have a summary');
  assert.ok(summaries.yogasutra?.chapters.length === 4, 'all four Yoga Sutra padas have a summary');
});

test('every summary has text in both languages and key verses that exist', { skip: !haveContent && 'run npm run content first' }, () => {
  const summaries = read('study/summaries.json');
  const catalog = new Map(read('catalog.json').map((b) => [b.id, b]));
  for (const [id, c] of Object.entries(summaries)) {
    const book = catalog.get(id);
    assert.ok(book, `${id} is in the catalog`);
    for (const s of c.chapters) {
      assert.ok(s.hi && s.en, `${id} ${s.chapter} has Hindi and English`);
      assert.ok(s.nameHi || s.nameEn || book.chapters.some((ch) => ch.number === s.chapter), `${id} ${s.chapter} has a name`);
      assert.ok(s.keyVerses.length > 0, `${id} ${s.chapter} has key verses`);
      if (!book.bundled) continue;
      const verses = read(`books/${id}/ch-${s.chapter}.json`).verses.map((v) => String(v.number));
      for (const k of s.keyVerses) assert.ok(verses.includes(String(k.verse)), `${id} ${s.chapter}.${k.verse} is a real verse`);
    }
  }
});
