// Unit tests for the app's pure logic. Run with `npm test` (Node 22+ strips the TypeScript types).
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import { BACKUP_FORMAT, BackupError, makeBackup, mergeBookmarks, normalizeSettings, parseBackup } from '../src/lib/backup.ts';
import { LANGUAGE_SETTINGS, resolveLanguage } from '../src/i18n/language.ts';
import { formatVerseRef, meaningState, sanskritLines, verseMarkNumber } from '../src/lib/verse-format.ts';
import {
  addDays,
  bookReadCount,
  chapterReadCount,
  dayKey,
  markVersesRead,
  MAX_DAYS,
  mergeProgress,
  normalizeProgress,
  percentRead,
  streakForNotification,
  streakInfo,
} from '../src/lib/progress.ts';

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
    settings: normalizeSettings({ theme: 'dark', textScale: 1.3 }),
    bookmarks: [{ id: 'bhagavadgita', chapter: 2, verse: '47', savedAt: '2026-11-21T00:00:00.000Z' }],
    lastRead: { id: 'katha', chapter: 1, verse: '3', at: '2026-11-21T00:00:00.000Z' },
    progress: { verses: { bhagavadgita: { 2: ['1', '2'] } }, days: ['2026-11-20', '2026-11-21'], best: 2 },
  };
  const file = JSON.stringify(makeBackup(data));
  const back = parseBackup(file);
  assert.deepEqual({ ...back, progress: normalizeProgress(back.progress) }, data);
  // A backup from before progress existed still reads, with nothing read yet.
  const old = JSON.parse(file);
  delete old.progress;
  assert.deepEqual(normalizeProgress(parseBackup(JSON.stringify(old)).progress), { verses: {}, days: [], best: 0 });
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
  assert.equal(s.theme, 'sunset');
  assert.equal(s.textScale, 1.6);
  assert.equal(s.showHindi, true);
});

test('removed themes move to the theme of the same brightness', () => {
  assert.equal(normalizeSettings({ theme: 'day' }).theme, 'sunset');
  assert.equal(normalizeSettings({ theme: 'paper' }).theme, 'sunset');
  assert.equal(normalizeSettings({ theme: 'sunset' }).theme, 'sunset');
  assert.equal(normalizeSettings({ theme: 'dark' }).theme, 'dark');
  assert.equal(normalizeSettings({ theme: 'toString' }).theme, 'sunset');
});

// Philological integrity (CLAUDE.md rule 4): the reader shows every verse's complete Sanskrit.
const BOOKS = new URL('../src/content/generated/assets/content/books/', import.meta.url).pathname;
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

test('daily verse schedule: no nagging (skips a day already read, tapers after a week, stops after two)', async () => {
  const { reminderSchedule, DAILY_DAYS, QUIET_AFTER_DAYS } = await import('../src/lib/reminder.ts');
  const morning = new Date(2026, 10, 21, 6, 0); // a Saturday
  const plain = reminderSchedule(morning, 7, 30);
  // Daily for the first week, then every other day, and nothing from two weeks out.
  assert.deepEqual(plain.map((d) => d.getDate()), [21, 22, 23, 24, 25, 26, 27, 28, 30, 2, 4]);
  assert.ok(plain.every((d) => d.getHours() === 7 && d.getMinutes() === 30));
  const last = plain[plain.length - 1];
  assert.ok((last - morning) / 86_400_000 < QUIET_AFTER_DAYS);
  assert.equal(plain.filter((d) => (d - morning) / 86_400_000 < DAILY_DAYS).length, DAILY_DAYS);
  // Already read today: today's reminder is dropped, tomorrow's stays.
  assert.equal(reminderSchedule(morning, 7, 30, { readToday: true })[0].getDate(), 22);
  // The time has passed (or is under a minute away): start tomorrow.
  assert.equal(reminderSchedule(new Date(2026, 10, 21, 20, 0), 7, 30)[0].getDate(), 22);
  assert.equal(reminderSchedule(new Date(2026, 10, 21, 7, 29, 30), 7, 30)[0].getDate(), 22);
  // Only the chosen weekdays (here Monday to Friday).
  const weekdays = reminderSchedule(morning, 7, 30, { days: [1, 2, 3, 4, 5] });
  assert.ok(weekdays.length > 0 && weekdays.every((d) => d.getDay() >= 1 && d.getDay() <= 5));
  // An empty list cannot silence the reminder by accident; that is what the switch is for.
  assert.equal(reminderSchedule(morning, 7, 30, { days: [] }).length, plain.length);
});

test('daily verse choices: book and weekdays are validated, and only a first install sees the welcome', () => {
  const s = normalizeSettings({});
  assert.equal(s.reminderBook, 'gita');
  assert.deepEqual(s.reminderDays, [0, 1, 2, 3, 4, 5, 6]);
  const picked = normalizeSettings({ reminderBook: 'reading', reminderDays: [5, 1, 1, 9, 'x', 3] });
  assert.equal(picked.reminderBook, 'reading');
  assert.deepEqual(picked.reminderDays, [1, 3, 5]);
  assert.equal(normalizeSettings({ reminderBook: 'bible' }).reminderBook, 'gita');
  assert.deepEqual(normalizeSettings({ reminderDays: [] }).reminderDays, [0, 1, 2, 3, 4, 5, 6]);
  // Settings saved before the welcome existed belong to an existing reader; nothing saved is a new one.
  assert.equal(normalizeSettings({ theme: 'dark' }).onboarded, true);
  assert.equal(normalizeSettings(undefined).onboarded, false);
  assert.equal(normalizeSettings({ onboarded: false }).onboarded, false);
  const back = parseBackup(JSON.stringify(makeBackup({ settings: picked, bookmarks: [], lastRead: null })));
  assert.deepEqual([back.settings.reminderBook, back.settings.reminderDays], ['reading', [1, 3, 5]]);
});

test('visual effects setting defaults to automatic and rejects unknown values', () => {
  assert.equal(normalizeSettings({}).effects, 'auto');
  assert.equal(normalizeSettings({ effects: 'light' }).effects, 'light');
  assert.equal(normalizeSettings({ effects: 'full' }).effects, 'full');
  assert.equal(normalizeSettings({ effects: 'ultra' }).effects, 'auto');
});

test('day keys are padded and calendar arithmetic crosses months and years', () => {
  assert.equal(dayKey(new Date(2026, 0, 5, 23, 30)), '2026-01-05');
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(addDays('2024-03-01', -1), '2024-02-29');
  assert.equal(addDays('2026-11-21', -7), '2026-11-14');
});

test('marking verses read records the day and skips repeats without a new object', () => {
  let p = normalizeProgress(undefined);
  p = markVersesRead(p, 'bhagavadgita', 2, ['47', '48'], '2026-11-20');
  assert.deepEqual(p.verses, { bhagavadgita: { 2: ['47', '48'] } });
  assert.deepEqual(p.days, ['2026-11-20']);
  const same = markVersesRead(p, 'bhagavadgita', 2, ['48', '47'], '2026-11-20');
  assert.equal(same, p, 'nothing new returns the same object, so React skips the update');
  p = markVersesRead(p, 'bhagavadgita', 2, ['48'], '2026-11-21');
  assert.deepEqual(p.days, ['2026-11-20', '2026-11-21']);
  assert.equal(p.best, 2);
  assert.equal(chapterReadCount(p, 'bhagavadgita', 2), 2);
  assert.equal(chapterReadCount(p, 'bhagavadgita', 2, 1), 1, 'never more than the chapter holds');
  assert.equal(markVersesRead(p, 'x', 1, [], '2026-11-22'), p, 'an empty batch does not count as a reading day');
});

test('book progress counts verses against each chapter and percent never overstates', () => {
  const p = normalizeProgress({ verses: { katha: { 1: ['1', '2', '3'], 2: ['1'], 9: ['1'] } }, days: [] });
  const chapters = [
    { number: 1, verseCount: 2 },
    { number: 2, verseCount: 10 },
  ];
  assert.equal(bookReadCount(p, 'katha', chapters), 3);
  assert.equal(bookReadCount(p, 'nope', chapters), 0);
  assert.equal(percentRead(0, 700), 0);
  assert.equal(percentRead(1, 700), 1);
  assert.equal(percentRead(699, 700), 99);
  assert.equal(percentRead(700, 700), 100);
});

test('the streak counts today, or stays alive from yesterday, and resets gently', () => {
  const days = ['2026-11-15', '2026-11-18', '2026-11-19', '2026-11-20'];
  const p = normalizeProgress({ days });
  assert.equal(p.best, 3);
  let s = streakInfo(p, '2026-11-20');
  assert.equal(s.current, 3);
  assert.equal(s.readToday, true);
  s = streakInfo(p, '2026-11-21');
  assert.equal(s.current, 3, 'not read yet today: yesterday still carries the streak');
  assert.equal(s.readToday, false);
  assert.deepEqual(
    s.week.map((d) => d.read),
    [true, false, false, true, true, true, false],
  );
  assert.equal(s.week[6].day, '2026-11-21');
  s = streakInfo(p, '2026-11-23');
  assert.equal(s.current, 0);
  assert.equal(s.best, 3);
});

test('only the next notification mentions the streak, and only when it is already known', () => {
  const days = ['2026-11-19', '2026-11-20', '2026-11-21'];
  // Read today: tomorrow's notification can say day 4 begins.
  assert.equal(streakForNotification(days, '2026-11-21', '2026-11-22'), 3);
  // Two days ahead is unknown yet.
  assert.equal(streakForNotification(days, '2026-11-21', '2026-11-23'), 0);
  // A notification later today, already read today: no nudge.
  assert.equal(streakForNotification(days, '2026-11-21', '2026-11-21'), 0);
  // Not read yet today, notification later today: the run up to yesterday.
  assert.equal(streakForNotification(days.slice(0, 2), '2026-11-21', '2026-11-21'), 2);
  // A single day is not a streak worth a line.
  assert.equal(streakForNotification(['2026-11-21'], '2026-11-21', '2026-11-22'), 0);
});

test('progress from a backup merges with the phone and bad data is dropped', () => {
  const a = normalizeProgress({ verses: { gita: { 1: ['1'] } }, days: ['2026-11-01'], best: 5 });
  const b = normalizeProgress({ verses: { gita: { 1: ['2'], 2: ['1'] }, katha: { 1: ['1'] } }, days: ['2026-11-02', 'junk'] });
  const m = mergeProgress(a, b);
  assert.deepEqual(m.verses, { gita: { 1: ['1', '2'], 2: ['1'] }, katha: { 1: ['1'] } });
  assert.deepEqual(m.days, ['2026-11-01', '2026-11-02']);
  assert.equal(m.best, 5);
  const junk = normalizeProgress({ verses: { gita: { x: ['1'], 3: 'no' }, '': {} }, days: [1, '2026-1-1'], best: -2 });
  assert.deepEqual(junk, { verses: {}, days: [], best: 0 });
  const many = normalizeProgress({ days: Array.from({ length: MAX_DAYS + 50 }, (_, i) => addDays('2020-01-01', i)) });
  assert.equal(many.days.length, MAX_DAYS);
  assert.equal(many.best, MAX_DAYS);
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
