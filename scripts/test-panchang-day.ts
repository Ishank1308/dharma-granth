/** Run: npm run test:panchang */
import assert from 'node:assert/strict';
import {
  PRESET_LOCATIONS,
  calculateEducationalPanchang,
  civilPartsAtOffset,
  formatPanchangClock,
  locationNoon,
  todayForLocation,
} from '../lib/panchang';
import { getMuhurtaDaylight, parseMuhurtaDate } from '../lib/muhurta-daylight';

const instant = new Date('2026-10-10T20:30:00.000Z');
const ist = civilPartsAtOffset(instant, 5.5);
assert.deepEqual(ist, { year: 2026, month: 9, day: 11 });
const newYork = civilPartsAtOffset(instant, -5);
assert.deepEqual(newYork, { year: 2026, month: 9, day: 10 });

const noon = locationNoon(2026, 9, 10, 5.5);
assert.equal(noon.toISOString(), '2026-10-10T06:30:00.000Z');

const varanasi = PRESET_LOCATIONS[0];
const today = todayForLocation(varanasi, instant);
assert.equal(today.getFullYear(), 2026);
assert.equal(today.getMonth(), 9);
assert.equal(today.getDate(), 11);

const day = calculateEducationalPanchang(new Date(2026, 9, 10, 12, 0, 0), varanasi);
assert.equal(day.isoDate, '2026-10-10');
assert.match(day.tithi.approxSpan, /^Approximate · ends ~/);
assert.match(day.nakshatra.approxSpan, /IST$/);
assert.match(day.yoga.approxSpan, /^Approximate · ends ~/);
assert.match(day.karana.approxSpan, /^Approximate · ends ~/);

const west = PRESET_LOCATIONS.find((item) => item.utcOffsetHours === -5);
assert.ok(west);
const sameCivilDay = calculateEducationalPanchang(new Date(2026, 9, 10, 23, 30, 0), west);
assert.equal(sameCivilDay.isoDate, '2026-10-10');
assert.ok(sameCivilDay.tithi.approxSpan.endsWith(west.timezone));

assert.equal(parseMuhurtaDate('2028-02-29')?.getDate(), 29);
assert.equal(parseMuhurtaDate('2027-02-29'), null);
assert.equal(parseMuhurtaDate('2026-11-31'), null);
assert.equal(parseMuhurtaDate('2026-13-01'), null);

const diwaliDate = new Date(2026, 10, 8, 12);
const varanasiDiwali = calculateEducationalPanchang(diwaliDate, varanasi);
const { solarTimes } = varanasiDiwali;
assert.ok(solarTimes.daylight);
// Drik Panchang lists 06:10 and 17:13 for Varanasi on this date.
assert.ok(Math.abs(solarTimes.daylight.sunriseMinute - (6 * 60 + 10)) < 3);
assert.ok(Math.abs(solarTimes.daylight.sunsetMinute - (17 * 60 + 13)) < 3);
const sunday = getMuhurtaDaylight(solarTimes, 0);
assert.ok(sunday?.abhijit);
assert.equal(formatPanchangClock(sunday.rahu.end), solarTimes.sunset);
assert.equal(sunday.rahu.offsetPercent, 87.5);
assert.equal(sunday.rahu.widthPercent, 12.5);
assert.ok(Math.abs((sunday.abhijit.end - sunday.abhijit.start)
  - (solarTimes.daylight.sunsetMinute - solarTimes.daylight.sunriseMinute) / 15) < 0.001);
assert.equal(getMuhurtaDaylight(solarTimes, 3)?.abhijit, null);
assert.equal(getMuhurtaDaylight(solarTimes, 1)?.rahu.offsetPercent, 12.5);

const delhi = PRESET_LOCATIONS.find(({ id }) => id === 'delhi');
assert.ok(delhi);
const delhiDiwali = calculateEducationalPanchang(diwaliDate, delhi);
const delhiSunday = getMuhurtaDaylight(delhiDiwali.solarTimes, 0);
assert.ok(delhiSunday);
assert.notEqual(formatPanchangClock(delhiSunday.rahu.start), formatPanchangClock(sunday.rahu.start));
const unspecified = PRESET_LOCATIONS.find(({ hasReliableCoordinates }) => !hasReliableCoordinates);
assert.ok(unspecified);
assert.equal(getMuhurtaDaylight(calculateEducationalPanchang(diwaliDate, unspecified).solarTimes, 0), null);

console.log('panchang-day: all assertions passed');
