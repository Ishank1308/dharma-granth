// Unit tests for the app's pure logic. Run with `npm test` (Node 22+ strips the TypeScript types).
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import { BACKUP_FORMAT, makeBackup, mergeBookmarks, normalizeSettings, parseBackup } from '../src/lib/backup.ts';
import { formatVerseRef, meaningState, sanskritLines, verseMarkNumber } from '../src/lib/verse-format.ts';

test('verse references match the website', () => {
  assert.equal(formatVerseRef('bhagavadgita', 2, 47), '2.47');
  assert.equal(formatVerseRef('durgasaptashati', 1, '1.13'), '1.13');
  assert.equal(formatVerseRef('chandogya', 3, '1.3.28'), '1.3.28');
  assert.equal(verseMarkNumber('1.3.28'), '28');
});

test('sanskritLines keeps every line and drops only the closing number marker', () => {
  const src = 'धृतराष्ट्र उवाच\n\nधर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः।\n\nमामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय।।1.1।।\n ';
  assert.deepEqual(sanskritLines(src), ['धृतराष्ट्र उवाच', 'धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः।', 'मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय']);
  assert.deepEqual(sanskritLines('ॐ पूर्णमदः पूर्णमिदम् ॥ १ ॥'), ['ॐ पूर्णमदः पूर्णमिदम्']);
  assert.deepEqual(sanskritLines(''), []);
  assert.deepEqual(sanskritLines('ऋतं पिबन्तौ परार्धे । छायातपौ त्रिणाचिकेताः ॥ १ ॥'), ['ऋतं पिबन्तौ परार्धे ।', 'छायातपौ त्रिणाचिकेताः']);
});

test('meaningState reports pointers and review notices', () => {
  assert.deepEqual(meaningState({ hindi: 'अर्थ', translation: 'meaning' }), { hi: 'text', en: 'text' });
  assert.deepEqual(meaningState({ hindiSeeVerse: 3, translationSeeVerse: 3 }), { hi: 'with', en: 'with' });
  assert.deepEqual(meaningState({ hindiReviewRequired: true }), { hi: 'review', en: 'pending' });
});

test('backup round-trips and merges without losing bookmarks', () => {
  const data = {
    settings: normalizeSettings({ theme: 'paper', textScale: 1.3 }),
    bookmarks: [{ id: 'bhagavadgita', chapter: 2, verse: '47', savedAt: '2026-11-21T00:00:00.000Z' }],
    lastRead: { id: 'katha', chapter: 1, at: '2026-11-21T00:00:00.000Z' },
  };
  const file = JSON.stringify(makeBackup(data));
  const back = parseBackup(file);
  assert.deepEqual(back, data);
  const merged = mergeBookmarks([{ id: 'katha', chapter: 1, verse: '1', savedAt: 'x' }, data.bookmarks[0]], back.bookmarks);
  assert.equal(merged.length, 2);
});

test('backup rejects foreign or future files', () => {
  assert.throws(() => parseBackup('not json'), /not valid JSON/);
  assert.throws(() => parseBackup('{"format":"other"}'), /not a Dharma Granth backup/);
  assert.throws(() => parseBackup(JSON.stringify({ format: BACKUP_FORMAT, version: 99 })), /newer version/);
});

test('settings are clamped to safe values', () => {
  const s = normalizeSettings({ theme: 'neon', textScale: 9, showHindi: 'yes' });
  assert.equal(s.theme, 'day');
  assert.equal(s.textScale, 1.6);
  assert.equal(s.showHindi, true);
});

// Philological integrity (CLAUDE.md rule 4): the reader shows every verse's complete Sanskrit.
const BOOKS = new URL('../src/content/generated/books/', import.meta.url).pathname;
test('bundled content keeps every Sanskrit line', { skip: !existsSync(BOOKS) && 'run `npm run content` first' }, () => {
  const strip = (s) => s.replace(/[\s|।॥0-9०-९.]/gu, '');
  let checked = 0;
  for (const id of readdirSync(BOOKS)) {
    for (const name of readdirSync(join(BOOKS, id))) {
      const ch = JSON.parse(readFileSync(join(BOOKS, id, name), 'utf8'));
      for (const v of ch.verses) {
        if (!v.sanskrit) continue;
        // Only digits, dandas and whitespace may be dropped by line splitting.
        assert.equal(strip(sanskritLines(v.sanskrit).join('')), strip(v.sanskrit), `${id} ${ch.number}.${v.number}`);
        checked++;
      }
    }
  }
  assert.ok(checked > 10000, `checked ${checked} verses`);
});
