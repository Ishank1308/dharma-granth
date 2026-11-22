/** Run: npm run test:daily-verse */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { DAILY_WISDOM_REGISTRY } from '../data/daily-wisdom-engine';
import { SAMPLE_DAILY_JOURNEYS } from '../data/daily-dharma-data';
import { channelMessage, channelUrl, dailyVersePool, dayNumber, verseForDay } from '../lib/daily-verse';

const pool = dailyVersePool();
assert.ok(pool.length >= 20, `pool has ${pool.length} verses`);
assert.equal(new Set(pool.map((v) => v.reference)).size, pool.length, 'no verse twice');
for (const v of pool) {
  assert.ok(v.sanskrit && v.hindi && v.english, `${v.reference} has Sanskrit, Hindi and English`);
  assert.ok(v.href.startsWith('/scripture/'), `${v.reference} links into the library`);
  assert.ok(!/[A-Za-z]/.test(v.sanskrit), `${v.reference}: Latin letters inside the Sanskrit text`);
  assert.ok(!/[A-Za-z]/.test(v.hindi), `${v.reference}: Latin letters inside the Hindi text`);
}

// Day numbers are calendar days, independent of the clock time.
assert.equal(dayNumber(new Date(2026, 0, 1, 0, 0, 1)), 0);
assert.equal(dayNumber(new Date(2026, 0, 1, 23, 59, 59)), 0);
assert.equal(dayNumber(new Date(2026, 0, 2, 0, 0, 0)), 1);
assert.equal(dayNumber(new Date(2026, 11, 31)), 364);
assert.equal(dayNumber(new Date(2027, 0, 1)), 365, 'no jump at the new year');
assert.equal(dayNumber(new Date(2025, 11, 31)), -1);

// Same day, same verse; consecutive days differ; the cycle repeats after pool.length days.
assert.equal(verseForDay(pool, 100).id, verseForDay(pool, 100).id);
assert.notEqual(verseForDay(pool, 100).id, verseForDay(pool, 101).id);
assert.equal(verseForDay(pool, 5).id, verseForDay(pool, 5 + pool.length).id);
assert.equal(verseForDay(pool, -1).id, pool[pool.length - 1].id, 'days before the epoch still resolve');

const verse = pool.find((v) => v.reference === 'Bhagavad Gita 2.47')!;
const url = channelUrl('https://dharmagranth.dev', verse);
assert.equal(url, 'https://dharmagranth.dev/scripture/bhagavadgita/chapter/2/verse/47/?utm_source=whatsapp&utm_medium=channel');

const msg = channelMessage(verse, url);
assert.ok(msg.startsWith('🕉️ *दैनिक श्लोक · Verse of the Day*\n\n*Bhagavad Gita 2.47*\n\n'));
assert.ok(msg.includes(verse.sanskrit) && msg.includes(verse.hindi) && msg.includes(`_${verse.english}_`));
assert.ok(msg.endsWith(`📖 ${url}\n— Dharma Granth`));

// Every item in DAILY_WISDOM_REGISTRY and SAMPLE_DAILY_JOURNEYS must resolve to a real published verse and trailing-slash href.
for (const item of DAILY_WISDOM_REGISTRY) {
  const book = JSON.parse(fs.readFileSync(`public/data/scriptures-full/${item.scriptureId}.json`, 'utf8'));
  const ch = book.chapters?.find((c: { number: number | string }) => Number(c.number) === item.chapterId);
  assert.ok(ch, `${item.id}: missing chapter ${item.chapterId} in ${item.scriptureId}`);
  const foundVerse = ch.verses?.find((x: { number: number | string }) => String(x.number) === String(item.verseId));
  assert.ok(foundVerse, `${item.id}: missing verse ${item.verseId} in ${item.scriptureId} ch ${item.chapterId}`);
  const [pathname] = item.href.split('#', 2);
  assert.ok(pathname.endsWith('/'), `${item.id}: href missing trailing slash (${item.href})`);
}
for (const session of Object.values(SAMPLE_DAILY_JOURNEYS)) {
  for (const rec of session.recommendations) {
    const [pathname] = rec.href.split('#', 2);
    assert.ok(pathname.endsWith('/'), `${session.id} rec ${rec.id}: href missing trailing slash (${rec.href})`);
  }
}

console.log(`daily-verse: all assertions passed (${pool.length} verses, ${DAILY_WISDOM_REGISTRY.length} daily journey items)`);
