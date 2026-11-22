// Festival-eve and Ekadashi-eve notifications: which dates, when, and what they say. Run with `npm test`.
import assert from 'node:assert/strict';
import test from 'node:test';

import { buildExplore } from './build-explore.mjs';
import { normalizeSettings, parseBackup, makeBackup } from '../src/lib/backup.ts';
import {
  ekadashiName,
  ekadashiObservances,
  eveOf,
  festivalObservances,
  MAX_OBSERVANCE_NOTICES,
  OBSERVANCE_ID_PREFIX,
  observanceId,
  observanceSchedule,
} from '../src/lib/observance-reminders.ts';
import { S } from '../src/i18n/strings.ts';

buildExplore();
const { FESTIVAL_DATES } = await import('../src/content/generated/explore/festival-dates.ts');
const { EKADASHI_DATES } = await import('../src/content/generated/explore/vrata-dates.ts');

test('Ekadashi names split into Hindi and plain English', () => {
  assert.deepEqual(ekadashiName('उत्पन्ना एकादशी (Utpanna Ekadashi)'), { hi: 'उत्पन्ना एकादशी', en: 'Utpanna Ekadashi' });
  assert.deepEqual(ekadashiName('मोक्षदा एकादशी (Mokshada / गीता जयंती 2027)'), { hi: 'मोक्षदा एकादशी', en: 'Mokshada Ekadashi' });
  assert.deepEqual(ekadashiName('पुत्रदा एकादशी (Pausha Putrada)'), { hi: 'पुत्रदा एकादशी', en: 'Pausha Putrada Ekadashi' });
  assert.deepEqual(ekadashiName('इन्दिरा एकादशी (Indira Ekadashi / पितृ पक्ष)'), { hi: 'इन्दिरा एकादशी', en: 'Indira Ekadashi' });
  assert.deepEqual(ekadashiName('कामदा एकादशी (Kamada Ekadashi 2028)'), { hi: 'कामदा एकादशी', en: 'Kamada Ekadashi' });
  assert.deepEqual(ekadashiName('एकादशी'), { hi: 'एकादशी', en: 'Ekadashi' });
});

test('every Ekadashi in the website table gets a clean English name', () => {
  for (const o of ekadashiObservances(EKADASHI_DATES)) {
    assert.match(o.en, /^[A-Za-z /-]+ Ekadashi$/, o.en);
    assert.match(o.hi, /एकादशी/, o.hi);
    assert.match(o.date, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test('the note arrives at 6 PM on the evening before', () => {
  const eve = eveOf('2026-12-05');
  assert.deepEqual([eve.getFullYear(), eve.getMonth(), eve.getDate(), eve.getHours(), eve.getMinutes()], [2026, 11, 4, 18, 0]);
  // The first of a month: the evening before is the last day of the previous month.
  const first = eveOf('2027-03-01');
  assert.deepEqual([first.getMonth(), first.getDate()], [1, 28]);
  assert.equal(eveOf('not a date'), undefined);
});

test('only evenings still ahead are queued, soonest first, capped', () => {
  const items = [
    ...festivalObservances([
      { name: 'Gita Jayanti', nameHindi: 'गीता जयंती', date: '2026-12-20', festivalId: 'gita-jayanti' },
      { name: 'Kartik Purnima', date: '2026-11-24' },
      { name: 'Diwali', date: '2026-11-08' },
    ]),
    ...ekadashiObservances([
      { name: 'उत्पन्ना एकादशी (Utpanna Ekadashi)', dateEn: '2026-12-05' },
      { name: 'उत्पन्ना एकादशी (Utpanna Ekadashi)', dateEn: '2026-12-05' },
    ]),
  ];
  const now = new Date(2026, 10, 22, 9, 0);
  const plan = observanceSchedule(now, items);
  assert.deepEqual(
    plan.map((p) => `${p.item.kind}:${p.item.date}`),
    ['festival:2026-11-24', 'ekadashi:2026-12-05', 'festival:2026-12-20'],
  );
  assert.equal(plan[0].item.hi, 'Kartik Purnima', 'a festival without a Hindi name keeps its English one');
  // 6 PM on the eve has passed: that date is dropped.
  assert.equal(observanceSchedule(new Date(2026, 10, 23, 18, 30), items)[0].item.date, '2026-12-05');
  assert.equal(observanceSchedule(now, items, { limit: 1 }).length, 1);
});

test('with both switches on, the website dates fill at most the cap', () => {
  const items = [...festivalObservances(FESTIVAL_DATES), ...ekadashiObservances(EKADASHI_DATES)];
  const plan = observanceSchedule(new Date(2026, 10, 22, 9, 0), items);
  assert.equal(plan.length, MAX_OBSERVANCE_NOTICES);
  for (let i = 1; i < plan.length; i += 1) assert.ok(plan[i].when >= plan[i - 1].when);
  assert.equal(plan.find((p) => p.item.kind === 'ekadashi').item.en, 'Utpanna Ekadashi');
  const ids = plan.map((p) => observanceId(p.item));
  assert.equal(new Set(ids).size, ids.length, 'identifiers are unique');
  for (const id of ids) assert.ok(id.startsWith(OBSERVANCE_ID_PREFIX));
});

test('both switches start off and survive a backup', () => {
  const s = normalizeSettings({});
  assert.deepEqual([s.festivalReminder, s.ekadashiReminder], [false, false]);
  assert.deepEqual([normalizeSettings({ festivalReminder: 'yes' }).festivalReminder], [false]);
  const on = normalizeSettings({ festivalReminder: true, ekadashiReminder: true });
  const back = parseBackup(JSON.stringify(makeBackup({ settings: on, bookmarks: [], lastRead: null, progress: { days: [] } })));
  assert.deepEqual([back.settings.festivalReminder, back.settings.ekadashiReminder], [true, true]);
});

test('the notes are calm and always ask to confirm locally', () => {
  const texts = [
    S.festivalTomorrow('Diwali'),
    S.festivalTomorrowBody,
    S.ekadashiTomorrow,
    S.ekadashiTomorrowBody('Utpanna Ekadashi'),
    S.observanceNote,
    S.observanceChannelDescription,
  ];
  for (const m of texts) {
    assert.doesNotMatch(m.en, /missed|streak|hurry|don't forget|do not forget|last chance|lose|!/i, m.en);
    assert.doesNotMatch(m.hi, /सिलसिला|छूट|जल्दी|मत भूल|आखिरी मौका|आख़िरी मौका|!/, m.hi);
  }
  for (const m of [S.festivalTomorrowBody, S.ekadashiTomorrowBody('x')]) {
    assert.match(m.en, /local panchang/);
    assert.match(m.hi, /स्थानीय पंचांग/);
  }
  assert.deepEqual(S.ekadashiTomorrow, { en: 'Ekadashi tomorrow', hi: 'कल एकादशी है' });
});
