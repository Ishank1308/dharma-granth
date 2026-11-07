import assert from 'node:assert/strict';
import { FESTIVAL_DATES, upcomingFestivals } from '@/data/festival-dates';

const localStart = new Date(2028, 0, 1, 23, 30);
const next = upcomingFestivals(4, localStart);
assert.equal(next.length, 4);
assert.deepEqual(next.map((event) => event.date), ['2028-01-15', '2028-01-31', '2028-02-23', '2028-03-11']);
assert.ok(next.every((event) => event.daysAway >= 0));
assert.ok(FESTIVAL_DATES.some((event) => event.date.startsWith('2029-')));
assert.ok(FESTIVAL_DATES.some((event) => event.date.startsWith('2030-')));
assert.equal(upcomingFestivals(4, new Date(2030, 11, 31)).length, 0);

console.log('✓ Local-date festival filtering and 2028–2030 reminder coverage passed.');
