// Tests for the Explore tab's content (scripts/build-explore.mjs and the website data it copies). `npm test`.
import assert from 'node:assert/strict';
import test from 'node:test';

import { buildExplore, extractVrataTable } from './build-explore.mjs';

buildExplore();
const panchang = await import('../src/content/generated/explore/panchang.ts');
const vrats = await import('../src/content/generated/explore/vrata-dates.ts');
const { SACRED_MANTRAS } = await import('../src/content/generated/explore/mantras.ts');
const { festivals } = await import('../src/content/generated/explore/festivals.ts');
const { FESTIVAL_DATES } = await import('../src/content/generated/explore/festival-dates.ts');
const { mantraLines } = await import('../src/lib/mantra-lines.ts');
const { festivalColors } = await import('../src/theme/festival-colors.ts');

test('vrat tables come across from the website pages, dated and in order', () => {
  for (const name of ['EKADASHI_DATES', 'PURNIMA_DATES', 'AMAVASYA_DATES', 'PRADOSH_DATES']) {
    const table = vrats[name];
    assert.ok(table.length >= 20, `${name} has ${table.length} rows`);
    for (const row of table) assert.match(row.dateEn, /^\d{4}-\d{2}-\d{2}$/, `${name} ${row.name}`);
  }
});

test('extractVrataTable stops at the table, not at a later bracket', () => {
  const src = "const A: VrataDateItem[] = [\n  { name: 'x', month: 'm', date: 'd', dateEn: '2026-01-01' },\n];\nconst B = [1];";
  assert.equal(extractVrataTable(src, 'A'), "[\n  { name: 'x', month: 'm', date: 'd', dateEn: '2026-01-01' },\n]");
});

test('panchang matches the website for a fixed day and city', () => {
  const varanasi = panchang.PRESET_LOCATIONS.find((c) => c.id === 'varanasi');
  const p = panchang.calculateEducationalPanchang(new Date(2026, 10, 21, 12), varanasi);
  assert.equal(p.isoDate, '2026-11-21');
  assert.ok(p.tithi.number >= 1 && p.tithi.number <= 30);
  assert.ok(p.nakshatra.index >= 0 && p.nakshatra.index <= 26);
  assert.ok(p.solarTimes.isReliable);
  assert.match(p.solarTimes.sunrise, /^0[5-7]:\d\d AM$/);
  assert.match(p.solarTimes.sunset, /^0[4-6]:\d\d PM$/);
});

test('mantra lines keep every character of every mantra', () => {
  for (const m of SACRED_MANTRAS) {
    const lines = mantraLines(m.sanskrit);
    assert.ok(lines.length >= 1, m.slug);
    assert.equal(lines.join('').replace(/\s+/g, ''), m.sanskrit.replace(/\s+/g, ''), m.slug);
  }
});

test('a verse number stays on the line its daṇḍas close', () => {
  assert.deepEqual(mantraLines('क ख । ग घ ॥ १ ॥ ङ च ॥'), ['क ख ।', 'ग घ ॥ १ ॥', 'ङ च ॥']);
});

test('every festival cover colour resolves, light and deep', () => {
  for (const f of festivals) {
    for (const deep of [false, true]) {
      const [a, b] = festivalColors(f.gradient, deep);
      assert.match(a, /^#[0-9a-f]{6}$/);
      assert.match(b, /^#[0-9a-f]{6}$/);
      assert.notEqual(a, '#ea580c', `${f.id} from-stop (deep=${deep}) is missing from the colour table`);
    }
  }
});

test('festival calendar links only to festival pages that exist', () => {
  const ids = new Set(festivals.map((f) => f.id));
  for (const d of FESTIVAL_DATES) if (d.festivalId) assert.ok(ids.has(d.festivalId), `${d.name} → ${d.festivalId}`);
});
