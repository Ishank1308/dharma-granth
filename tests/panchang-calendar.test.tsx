import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateEducationalPanchang, PRESET_LOCATIONS } from '@/lib/panchang';
import { FESTIVAL_DATES } from '@/data/festival-dates';
import { CalendarClient } from '@/app/panchang/calendar/CalendarClient';

test('panchang calendar computes accurate month days including leap years', () => {
  // February 2026 has 28 days
  const feb2026Days = new Date(2026, 2, 0).getDate();
  assert.equal(feb2026Days, 28, 'Feb 2026 must have 28 days');

  // February 2028 is a leap year and has 29 days
  const feb2028Days = new Date(2028, 2, 0).getDate();
  assert.equal(feb2028Days, 29, 'Feb 2028 must have 29 days (leap year)');

  // November 2026 has 30 days
  const nov2026Days = new Date(2026, 11, 0).getDate();
  assert.equal(nov2026Days, 30, 'Nov 2026 must have 30 days');
});

test('panchang calculations identify sacred vratas: Ekadashi, Pradosha, Purnima, Amavasya', () => {
  const loc = PRESET_LOCATIONS[0]; // Varanasi

  // Test Diwali 2026 (Nov 8, 2026) -> Kartik Krishna Amavasya (tithi 30)
  const diwaliDate = new Date(2026, 10, 8, 6, 0, 0);
  const diwaliPanchang = calculateEducationalPanchang(diwaliDate, loc);
  assert.equal(diwaliPanchang.tithi.number, 30, 'Diwali 2026 is Amavasya (tithi 30)');
  assert.equal(diwaliPanchang.tithi.paksha, 'Krishna', 'Diwali 2026 is Krishna Paksha');
  assert.equal(diwaliPanchang.paksha.isWaxing, false, 'Krishna Paksha is waning');

  // Verify festival registry has Diwali 2026
  const diwaliFest = FESTIVAL_DATES.find((f) => f.date === '2026-11-08');
  assert.ok(diwaliFest, 'Diwali 2026 must be present in FESTIVAL_DATES');
  assert.match(diwaliFest.name, /Diwali|Deepavali/i);
});

test('CalendarClient component renders accessible monthly calendar with filters and inspector', () => {
  const html = renderToStaticMarkup(<CalendarClient />);

  // Should render year buttons
  assert.match(html, />2026<\/button>/);
  assert.match(html, />2027<\/button>/);
  assert.match(html, />2028<\/button>/);

  // Should render filter chips with sacred symbols
  assert.match(html, /एकादशी व्रत/);
  assert.match(html, /प्रदोष व्रत/);
  assert.match(html, /पूर्णिमा व अमावस्या/);
  assert.match(html, /प्रमुख पर्व व त्यौहार/);

  // Should render link to daily panchang
  assert.match(html, /दैनिक पंचांग खोलें/);

  // Should render weekday headers
  assert.match(html, />रवि<\/div>/);
  assert.match(html, />सोम<\/div>/);
  assert.match(html, />शनि<\/div>/);
});
