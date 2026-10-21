/** Run: npm run test:format */
import assert from 'node:assert/strict';
import { chapterCount, countLabel, daysAgo, dayCount, formatDate, formatNumber, languageLabel, parseLocalDate, plural, scriptureTitle, sessionCount, verseCount } from '../lib/format';
import { toAsciiDigits } from '../lib/verse-format';

assert.equal(plural(0, 'verse'), 'verses');
assert.equal(plural(1, 'verse'), 'verse');
assert.equal(plural(2, 'verse'), 'verses');

for (const [n, c, v, s] of [[0, '0 chapters', '0 verses', '0 sessions'], [1, '1 chapter', '1 verse', '1 session'], [2, '2 chapters', '2 verses', '2 sessions']] as const) {
  assert.equal(chapterCount(n), c);
  assert.equal(verseCount(n), v);
  assert.equal(sessionCount(n), s);
}
assert.equal(dayCount(1), '1 day');
assert.equal(dayCount(3), '3 days');
assert.equal(countLabel(1, 'verse', 'hi'), '1 श्लोक');
assert.equal(countLabel(1, 'reading'), '1 reading');

assert.equal(formatNumber(1234567, 'indian'), '12,34,567');
assert.equal(formatNumber(1234567, 'international'), '1,234,567');
assert.equal(formatNumber(Number.NaN), '–');
assert.equal(verseCount(187392, 'en', 'indian'), '1,87,392 verses');
assert.equal(toAsciiDigits('गीता २.४७'), 'गीता 2.47');
assert.equal(toAsciiDigits('2026-10-08'), '2026-10-08');

// A calendar day stays on that day whatever the machine's time zone.
const d = parseLocalDate('2026-10-08');
assert.deepEqual([d.getFullYear(), d.getMonth(), d.getDate()], [2026, 9, 8]);
assert.match(formatDate('2026-10-08', 'en'), /8 October 2026/);
assert.doesNotMatch(formatDate('2026-10-08', 'hi'), /[०-९]/);
assert.equal(formatDate('not a date'), '–');
assert.equal(daysAgo('2026-10-08', new Date(2026, 9, 8, 23, 59)), 'today');
assert.equal(daysAgo('2026-10-07', new Date(2026, 9, 8, 0, 1)), 'yesterday');
assert.equal(daysAgo('2026-10-05', new Date(2026, 9, 8)), '3 days ago');

assert.equal(scriptureTitle({ title: 'Bhagavad Gita', titleSanskrit: 'श्रीमद्भगवद्गीता' }), 'Bhagavad Gita · श्रीमद्भगवद्गीता');
assert.equal(scriptureTitle({ title: 'Isha Upanishad' }, 'hi'), 'Isha Upanishad');
assert.equal(languageLabel('hi', 'en'), 'Hindi');
assert.equal(languageLabel('xx'), 'xx');

console.log('format: all assertions passed');
