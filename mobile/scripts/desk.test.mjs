// Study desk (src/lib/desk.ts), the study sheet (src/lib/study-sheet.ts), the compare and sources data
// (scripts/build-study.mjs), and the desk's place in the backup file. Run with `npm test`.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { DEFAULT_SETTINGS, makeBackup, parseBackup } from '../src/lib/backup.ts';
import { addToQueue, EMPTY_DESK, MAX_QUEUE, mergeDesk, moveInQueue, normalizeDesk, removeFromQueue, setGoal, studyStats, weekSoFar } from '../src/lib/desk.ts';
import { escapeHtml, sheetHtml, DEFAULT_LAYERS } from '../src/lib/study-sheet.ts';
import { buildStudy, compareTarget } from './build-study.mjs';

const GEN = resolve(dirname(fileURLToPath(import.meta.url)), '../src/content/generated');
const read = (f) => JSON.parse(readFileSync(join(GEN, f), 'utf8'));
const haveContent = existsSync(join(GEN, 'catalog.json'));

const g = { id: 'bhagavadgita', chapter: 2, verse: '47' };
const k = { id: 'katha', chapter: 1, verse: '3.3' };

test('queue adds without repeats, moves and removes', () => {
  let { desk, added } = addToQueue(EMPTY_DESK, [g, k, g, { id: 'Bad Id', chapter: 1, verse: '1' }]);
  assert.equal(added, 2);
  assert.deepEqual(desk.queue, [g, k]);
  assert.equal(addToQueue(desk, [g]).desk, desk, 'nothing new returns the same object');
  desk = moveInQueue(desk, 1, -1);
  assert.deepEqual(desk.queue, [k, g]);
  assert.equal(moveInQueue(desk, 0, -1), desk, 'cannot move above the top');
  desk = removeFromQueue(desk, k);
  assert.deepEqual(desk.queue, [g]);
});

test('queue is capped and the goal stays 1 to 7', () => {
  const many = Array.from({ length: MAX_QUEUE + 20 }, (_, i) => ({ id: 'bhagavadgita', chapter: 1, verse: String(i + 1) }));
  assert.equal(addToQueue(EMPTY_DESK, many).desk.queue.length, MAX_QUEUE);
  assert.equal(setGoal(EMPTY_DESK, 5).goal, 5);
  assert.equal(setGoal(EMPTY_DESK, 9), EMPTY_DESK);
  assert.deepEqual(normalizeDesk({ queue: [g, g, null, { id: 'x' }], goal: 12 }), { queue: [g], goal: 3 });
  assert.deepEqual(normalizeDesk('junk'), EMPTY_DESK);
});

test('a backup carries the desk and merging keeps the phone goal', () => {
  const desk = { queue: [k], goal: 6 };
  const file = makeBackup({ settings: DEFAULT_SETTINGS, bookmarks: [], lastRead: null, progress: { verses: {}, days: [], best: 0 } }, new Date(0), { desk });
  const parsed = parseBackup(JSON.stringify(file));
  assert.deepEqual(parsed.desk, desk);
  const merged = mergeDesk({ queue: [g], goal: 2 }, parsed.desk);
  assert.deepEqual(merged, { queue: [g, k], goal: 2 });
  const old = parseBackup(JSON.stringify({ ...file, desk: undefined }));
  assert.equal('desk' in old, false, 'older backups have no desk');
});

test('the week starts on Monday', () => {
  assert.deepEqual(weekSoFar('2026-11-23'), ['2026-11-23']); // a Monday
  assert.deepEqual(weekSoFar('2026-11-22'), ['2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21', '2026-11-22']);
  assert.deepEqual(weekSoFar('2026-03-04').slice(0, 1), ['2026-03-02']);
});

test('stats count no further than each chapter holds', () => {
  const sizes = (id) => (id === 'bhagavadgita' ? [{ number: 1, verseCount: 3 }, { number: 2, verseCount: 72 }] : undefined);
  const p = {
    verses: { bhagavadgita: { 1: ['1', '2', '3', '4'], 2: ['47'] }, unknown: { 1: ['1'] } },
    days: ['2026-11-10', '2026-11-17', '2026-11-22'],
  };
  const s = studyStats(p, '2026-11-22', sizes);
  assert.equal(s.versesRead, 4);
  assert.equal(s.chaptersTouched, 2);
  assert.equal(s.booksStarted, 1);
  assert.equal(s.daysRead, 3);
  assert.equal(s.daysThisWeek, 2);
  assert.deepEqual(s.books, [{ id: 'bhagavadgita', read: 4, total: 75 }]);
});

test('the study sheet prints every line, escapes text and honours layers', () => {
  const verse = {
    label: 'Katha <Upanishad> 1.3.3',
    sanskrit: ['आत्मानं रथिनं विद्धि शरीरं रथमेव तु ।', 'बुद्धिं तु सारथिं विद्धि मनः प्रग्रहमेव च ॥ ३ ॥'],
    translit: 'ātmānaṃ rathinaṃ viddhi',
    hindi: 'आत्मा को रथी जानो।',
    hindiAi: true,
    english: 'Know the Self as the lord of the chariot.',
    words: 'ātmānam: the Self',
    notes: ['My <b>note</b>'],
  };
  const text = { lang: 'en', prepared: 'Prepared', hindi: 'Hindi', english: 'English', words: 'Word meanings', note: 'My reflection', ai: 'AI-assisted', footer: 'Footer' };
  const html = sheetHtml('My & sheet', [verse], DEFAULT_LAYERS, text);
  for (const line of verse.sanskrit) assert.ok(html.includes(escapeHtml(line)), 'each Sanskrit line is printed whole');
  assert.ok(html.includes('Katha &lt;Upanishad&gt; 1.3.3'));
  assert.ok(html.includes('<title>My &amp; sheet</title>'));
  assert.ok(html.includes('(AI-assisted)'));
  assert.ok(!html.includes('My &lt;b&gt;note'), 'reflections are left out unless turned on');
  assert.ok(!html.includes('Word meanings:'), 'word meanings are off by default');
  const withNotes = sheetHtml('', [verse], { ...DEFAULT_LAYERS, notes: true, verse: false }, text);
  assert.ok(withNotes.includes('My &lt;b&gt;note&lt;/b&gt;'));
  assert.ok(!withNotes.includes('रथिनं'), 'the verse layer can be turned off');
  assert.ok(withNotes.includes('<title>Dharma Granth</title>'));
});

test('compare links map to app screens or the website', () => {
  assert.deepEqual(compareTarget('/scripture/bhagavadgita/chapter/2/verse/20'), { kind: 'verse', id: 'bhagavadgita', chapter: 2, verse: '20' });
  assert.deepEqual(compareTarget('/scripture/bhagavadgita/chapter/2'), { kind: 'chapter', id: 'bhagavadgita', chapter: 2 });
  assert.deepEqual(compareTarget('/scripture/ramayana'), { kind: 'book', id: 'ramayana' });
  assert.deepEqual(compareTarget('/concepts/bhakti'), { kind: 'knowledge', section: 'concepts', id: 'bhakti' });
  assert.deepEqual(compareTarget('/wisdom-for-life/devotion'), { kind: 'wisdom', id: 'devotion' });
  assert.deepEqual(compareTarget('/timelines/#ramayana-narrative'), { kind: 'knowledge', section: 'timelines', id: 'ramayana-narrative' });
  assert.deepEqual(compareTarget('/learn/plans/#plan-karma-yoga'), { kind: 'web', url: 'https://dharmagranth.dev/learn/plans/#plan-karma-yoga' });
});

test('compare and sources data build, and every app target exists', { skip: !haveContent && 'run npm run content first' }, async () => {
  await buildStudy();
  const sets = read('study/compare.json');
  const sources = read('study/sources.json');
  assert.ok(sets.length >= 5);
  assert.ok(sources.bhagavadgita?.sanskritEdition);
  const catalog = new Map(read('catalog.json').map((b) => [b.id, b]));
  const kn = (f) => new Set(read(`knowledge/${f}.json`).items.map((x) => x.id ?? x.slug));
  const sections = { concepts: kn('concepts'), timelines: kn('timelines') };
  const wisdom = kn('wisdom');
  for (const s of sets) {
    assert.ok(s.title.en && s.title.hi && s.blurb.en && s.blurb.hi, `${s.id} has both languages`);
    for (const { target: t } of s.links) {
      if (t.kind === 'verse' || t.kind === 'chapter' || t.kind === 'book') {
        const book = catalog.get(t.id);
        assert.ok(book, `${t.id} is in the catalog`);
        if (t.kind !== 'book') assert.ok(book.chapters.some((c) => c.number === t.chapter), `${t.id} ${t.chapter} exists`);
        if (t.kind === 'verse' && book.bundled) {
          const verses = read(`assets/content/books/${t.id}/ch-${t.chapter}.json`).verses.map((v) => String(v.number));
          assert.ok(verses.includes(t.verse), `${t.id} ${t.chapter}.${t.verse} is a real verse`);
        }
      }
      if (t.kind === 'knowledge') assert.ok(sections[t.section]?.has(t.id), `${t.section}/${t.id} exists`);
      if (t.kind === 'wisdom') assert.ok(wisdom.has(t.id), `wisdom/${t.id} exists`);
    }
  }
});
