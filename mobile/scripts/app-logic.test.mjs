// Unit tests for the app's pure logic. Run with `npm test` (Node 22+ strips the TypeScript types).
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import { BACKUP_FORMAT, BackupError, makeBackup, mergeBookmarks, normalizeSettings, parseBackup } from '../src/lib/backup.ts';
import { LANGUAGE_SETTINGS, resolveLanguage } from '../src/i18n/language.ts';
import { formatVerseRef, meaningState, sanskritLines, verseMarkNumber } from '../src/lib/verse-format.ts';

test('interface language follows the setting, then the phone', () => {
  assert.equal(resolveLanguage('hi', 'en'), 'hi');
  assert.equal(resolveLanguage('en', 'hi'), 'en');
  assert.equal(resolveLanguage('system', 'hi'), 'hi');
  assert.equal(resolveLanguage(undefined, 'en'), 'en');
  assert.equal(normalizeSettings({}).language, 'system');
  assert.equal(normalizeSettings({ language: 'hi' }).language, 'hi');
  assert.equal(normalizeSettings({ language: 'fr' }).language, 'system');
  for (const l of LANGUAGE_SETTINGS) assert.equal(normalizeSettings({ language: l }).language, l);
});

test('backup errors carry a code the UI can translate', () => {
  assert.throws(() => parseBackup('not json'), (e) => e instanceof BackupError && e.code === 'not-json');
  assert.throws(() => parseBackup('{"format":"other"}'), (e) => e instanceof BackupError && e.code === 'wrong-file');
});

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

test('daily verse reminder: one notification per day at the chosen time, skipping a time already past', async () => {
  const { upcomingReminderTimes, formatReminderTime, REMINDER_DAYS } = await import('../src/lib/reminder.ts');
  const morning = new Date(2026, 10, 21, 6, 0);
  const ahead = upcomingReminderTimes(morning, 7, 30);
  assert.equal(ahead.length, REMINDER_DAYS);
  assert.deepEqual([ahead[0].getDate(), ahead[0].getHours(), ahead[0].getMinutes()], [21, 7, 30]);
  assert.equal(ahead[1].getDate(), 22);
  const evening = new Date(2026, 10, 21, 20, 0);
  const next = upcomingReminderTimes(evening, 7, 30, 3);
  assert.deepEqual(next.map((d) => d.getDate()), [22, 23, 24]);
  // Under a minute away counts as missed, so nothing fires while the queue is being rebuilt.
  assert.equal(upcomingReminderTimes(new Date(2026, 10, 21, 7, 29, 30), 7, 30, 1)[0].getDate(), 22);
  // Month rollover keeps the wall-clock time.
  const end = upcomingReminderTimes(new Date(2026, 10, 30, 9, 0), 8, 0, 2);
  assert.deepEqual(end.map((d) => [d.getMonth(), d.getDate(), d.getHours()]), [[11, 1, 8], [11, 2, 8]]);
  assert.equal(formatReminderTime(7, 5), '7:05 AM');
  assert.equal(formatReminderTime(0, 0), '12:00 AM');
  assert.equal(formatReminderTime(19, 30), '7:30 PM');
  assert.equal(formatReminderTime(19, 30, true), '19:30');
});

test('reminder settings are optional, validated and survive a backup', () => {
  const s = normalizeSettings({});
  assert.equal(s.dailyReminder, false);
  assert.equal(s.reminderHour, 7);
  assert.equal(s.reminderMinute, 0);
  const bad = normalizeSettings({ dailyReminder: 'yes', reminderHour: 25, reminderMinute: 7.5 });
  assert.deepEqual([bad.dailyReminder, bad.reminderHour, bad.reminderMinute], [false, 7, 0]);
  const on = normalizeSettings({ dailyReminder: true, reminderHour: 21, reminderMinute: 45 });
  const back = parseBackup(JSON.stringify(makeBackup({ settings: on, bookmarks: [], lastRead: null })));
  assert.deepEqual([back.settings.dailyReminder, back.settings.reminderHour, back.settings.reminderMinute], [true, 21, 45]);
});

test('visual effects setting defaults to automatic and rejects unknown values', () => {
  assert.equal(normalizeSettings({}).effects, 'auto');
  assert.equal(normalizeSettings({ effects: 'light' }).effects, 'light');
  assert.equal(normalizeSettings({ effects: 'full' }).effects, 'full');
  assert.equal(normalizeSettings({ effects: 'ultra' }).effects, 'auto');
});

test('a speaker run into the verse gets its own line, as on the website', () => {
  const lines = sanskritLines('अर्जुन उवाचएवं सततयुक्ता ये भक्तास्त्वां पर्युपासते।येचाप्यक्षरमव्यक्तं तेषां के योगवित्तमाः।।12.1।।');
  assert.equal(lines[0], 'अर्जुन उवाच');
  assert.equal(lines[1], 'एवं सततयुक्ता ये भक्तास्त्वां पर्युपासते।');
  assert.equal(lines.length, 3);
  assert.equal(sanskritLines('श्रीभगवानुवाचमय्यावेश्य मनो ये मां नित्ययुक्ता उपासते।')[0], 'श्रीभगवानुवाच');
  // A sandhi on a vowel sign is not a lost line break.
  assert.equal(sanskritLines('स होवाचेदम् इति।')[0], 'स होवाचेदम् इति');
});
