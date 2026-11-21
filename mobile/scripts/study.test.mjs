// Checks the chapter summaries and quizzes the app bundles (scripts/build-study.mjs):
// every key verse opens a real verse, and every quiz has a valid answer and real books.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { buildStudy } from './build-study.mjs';

const GEN = resolve(dirname(fileURLToPath(import.meta.url)), '../src/content/generated');
const read = (f) => JSON.parse(readFileSync(join(GEN, f), 'utf8'));
const haveContent = existsSync(join(GEN, 'catalog.json'));

test('builds summaries and quizzes from the website data', async () => {
  await buildStudy();
  const summaries = read('study/summaries.json');
  const quizzes = read('study/quizzes.json');
  assert.ok(summaries.bhagavadgita?.chapters.length === 18, 'all 18 Gita chapters have a summary');
  assert.ok(summaries.yogasutra?.chapters.length === 4, 'all four Yoga Sutra padas have a summary');
  assert.ok(quizzes.length >= 8, 'every course quiz is bundled');
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

test('every quiz question has one valid answer and an explanation', () => {
  const quizzes = read('study/quizzes.json');
  const ids = new Set();
  for (const q of quizzes) {
    assert.ok(!ids.has(q.id), `${q.id} is unique`);
    ids.add(q.id);
    assert.ok(['beginner', 'intermediate', 'advanced'].includes(q.difficulty), `${q.id} difficulty`);
    for (const x of q.questions) {
      assert.ok(x.options.length >= 2 && x.options.length <= 6, `${q.id}/${x.id} has 2 to 6 options`);
      assert.ok(Number.isInteger(x.answer) && x.answer >= 0 && x.answer < x.options.length, `${q.id}/${x.id} answer in range`);
      assert.ok(x.q && x.why, `${q.id}/${x.id} has a question and an explanation`);
    }
  }
});

test('quizzes only point at books in the catalog', { skip: !haveContent && 'run npm run content first' }, () => {
  const catalog = new Set(read('catalog.json').map((b) => b.id));
  for (const q of read('study/quizzes.json')) for (const b of q.books) assert.ok(catalog.has(b), `${q.id} → ${b}`);
});
