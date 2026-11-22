// Checks the bundled Learn section: every part builds from the website's data, verses are whole, every
// journey lesson found its verse in the bundled text, "discover your path" answers every combination, and
// the progress store's rules (normalise, tick, merge on import) hold. Quizzes stay out.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { buildLearn, LEARN_PARTS } from './build-learn.mjs';
import { doneCount, EMPTY_LEARN, mergeLearn, nextLesson, normalizeLearn, setGita, setLesson } from '../src/lib/learn-progress.ts';
import { makeBackup, normalizeSettings, parseBackup } from '../src/lib/backup.ts';

const MOBILE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GEN = join(MOBILE, 'src/content/generated/learn');
const read = (part) => JSON.parse(readFileSync(join(GEN, `${part}.json`), 'utf8'));

await buildLearn();

test('every part builds and has content', () => {
  for (const part of LEARN_PARTS) assert.ok(readFileSync(join(GEN, `${part}.json`), 'utf8').length > 100, part);
  assert.ok(read('courses').items.length >= 6);
  assert.ok(read('journeys').items.length >= 10);
  assert.equal(read('gita').items.length, 18);
  assert.equal(read('gita').shatkas.length, 3);
  assert.ok(read('daily').items.length >= 1);
  assert.ok(read('faq').items.length >= 5);
});

test('no quizzes are bundled', () => {
  const text = readFileSync(join(GEN, 'courses.json'), 'utf8');
  assert.doesNotMatch(text, /"quiz"/);
});

test('every journey lesson has its whole verse from the bundled text', () => {
  for (const j of read('journeys').items) {
    assert.ok(j.lessons.length > 0, j.id);
    for (const l of j.lessons) {
      assert.ok(l.text, `${j.id}/${l.id} ${l.scriptureId} ${l.chapter}.${l.verse} not found`);
      assert.ok(l.text.sanskrit.length > 10, `${j.id}/${l.id} empty Sanskrit`);
      assert.doesNotMatch(l.text.sanskrit.trim(), /(\.\.\.|…)$/, `${j.id}/${l.id} cut verse`);
      assert.ok(l.text.en || l.text.hi, `${j.id}/${l.id} has no translation`);
    }
  }
});

test('course and daily verses are whole', () => {
  const verses = [
    ...read('courses').items.flatMap((c) => [c.overview.mangal, ...c.lessons.map((l) => l.verse).filter(Boolean), ...c.revision.verses]),
    ...read('daily').items,
    ...read('gita').items.map((c) => c.keyVerse),
  ];
  assert.ok(verses.length > 50);
  for (const v of verses) {
    assert.ok(v.sanskrit && v.sanskrit.trim().length > 0);
    assert.doesNotMatch(v.sanskrit.trim(), /(\.\.\.|…)$/, `cut verse ${v.ref ?? v.source ?? v.id}`);
  }
});

test('discover your path answers every combination of answers', () => {
  const d = read('discover');
  assert.equal(d.questions.length, 5);
  for (const q of d.questions) assert.ok(q.options.length >= 2 && q.question.en && q.question.hi, q.key);
  const dims = d.keys.map((k) => d.questions.find((q) => q.key === k));
  let combos = 0;
  const walk = (i, parts) => {
    if (i === dims.length) {
      const row = d.table[parts.join('|')];
      assert.ok(row && row.length === 6, parts.join('|'));
      for (const r of row.slice(0, 5)) assert.ok(d.recs[r], `rec ${r}`);
      assert.equal(typeof d.summaries[row[5]], 'string');
      combos++;
      return;
    }
    for (const o of dims[i].options) walk(i + 1, [...parts, o.value]);
  };
  walk(0, []);
  assert.equal(combos, Object.keys(d.table).length);
});

test('progress: ticking, counting and the next lesson', () => {
  let p = setLesson(EMPTY_LEARN, 'journeys', 'karma-yoga', 'k1', true);
  p = setLesson(p, 'journeys', 'karma-yoga', 'k2', true);
  assert.equal(doneCount(p, 'journeys', 'karma-yoga', ['k1', 'k2', 'k3']), 2);
  assert.equal(nextLesson(p, 'journeys', 'karma-yoga', ['k1', 'k2', 'k3']), 2);
  p = setLesson(p, 'journeys', 'karma-yoga', 'k3', true);
  assert.equal(nextLesson(p, 'journeys', 'karma-yoga', ['k1', 'k2', 'k3']), 0);
  p = setLesson(p, 'journeys', 'karma-yoga', 'k1', false);
  assert.deepEqual(p.journeys['karma-yoga'], ['k2', 'k3']);
  assert.equal(setLesson(p, 'journeys', 'karma-yoga', 'k2', true), p, 'no change returns the same object');
  p = setGita(setGita(p, 12, true), 2, true);
  assert.deepEqual(p.gita, [2, 12]);
});

test('progress: damaged data is cleaned, imports only add', () => {
  const clean = normalizeLearn({ courses: { beginner: ['l1', 5, 'l1'], 'bad key!': ['x'] }, gita: [1, 40, 'x', 3], discover: { interest: 'practical', x: 3 } });
  assert.deepEqual(clean, { courses: { beginner: ['l1'] }, journeys: {}, gita: [1, 3], discover: { interest: 'practical' } });
  assert.deepEqual(normalizeLearn('nonsense'), EMPTY_LEARN);
  const merged = mergeLearn({ ...EMPTY_LEARN, courses: { beginner: ['l1'] }, gita: [2] }, { courses: { beginner: ['l2'] }, gita: [1] });
  assert.deepEqual(merged.courses.beginner, ['l1', 'l2']);
  assert.deepEqual(merged.gita, [1, 2]);
});

test('learn progress round-trips through the backup file', () => {
  const learn = { ...EMPTY_LEARN, journeys: { 'karma-yoga': ['k1'] }, gita: [2] };
  const data = { settings: normalizeSettings({}), bookmarks: [], lastRead: null, progress: { verses: {}, days: [], best: 0 } };
  const file = makeBackup(data, new Date(0), { learn });
  const back = parseBackup(JSON.stringify(file));
  assert.deepEqual(normalizeLearn(back.learn), learn);
  // A backup from before Learn existed still reads.
  delete file.learn;
  assert.equal(parseBackup(JSON.stringify(file)).learn, undefined);
});
