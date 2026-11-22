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

test('rituals and the Upakarma guide come across whole, every ritual cover colour resolves', async () => {
  const { rituals } = await import('../src/content/generated/explore/rituals.ts');
  const upa = await import('../src/content/generated/explore/upakarma.ts');
  assert.ok(rituals.length >= 10, `${rituals.length} rituals`);
  assert.equal(new Set(rituals.map((r) => r.id)).size, rituals.length, 'ritual ids are unique');
  for (const r of rituals) {
    assert.ok(r.meaning && r.scripturalBasis && r.symbolism && r.practicalEtiquette.length, r.id);
    for (const deep of [false, true]) {
      const [a, b] = festivalColors(r.gradient, deep);
      assert.notEqual(a, '#ea580c', `${r.id} from-stop (deep=${deep}) is missing from the colour table`);
      assert.notEqual(b, '#c2410c', `${r.id} to-stop (deep=${deep}) is missing from the colour table`);
    }
  }
  assert.equal(upa.UPAKARMA_STEPS.length, 5);
  for (const s of upa.UPAKARMA_STEPS) {
    if (s.mantraRef) assert.ok(upa.UPAKARMA_MANTRAS[s.mantraRef], `step ${s.stepNumber} mantra ${s.mantraRef}`);
    assert.equal(s.rituals.length, s.ritualsHi.length, `step ${s.stepNumber} has an action list in both languages`);
  }
  assert.equal(upa.YAJNOPAVITA_TANTUS.length, 9);
  // Mantras are shown whole, line by line: none is cut off mid-verse.
  for (const m of Object.values(upa.UPAKARMA_MANTRAS)) {
    assert.ok(/॥\s*$/.test(m.sanskrit), `${m.id} ends on a full verse`);
  }
});

test('each Panchang page keeps its questions and answers', async () => {
  const { PAGE_FAQS } = await import('../src/content/generated/explore/faqs.ts');
  for (const page of ['calendar', 'tithis', 'nakshatras', 'yogas', 'karanas', 'varas']) {
    assert.ok(PAGE_FAQS[page]?.length >= 3, `${page} has ${PAGE_FAQS[page]?.length} questions`);
    for (const f of PAGE_FAQS[page]) assert.ok(f.q.length > 10 && f.a.length > 20, `${page}: ${f.q}`);
  }
});

test('every day lands on a limb entry the guides have, and the calendar marks match the website', () => {
  const varanasi = panchang.PRESET_LOCATIONS.find((c) => c.id === 'varanasi');
  const tithiSlugs = new Set(panchang.UNIQUE_TITHI_ARCHETYPES.map((t) => t.slug));
  const yogaSlugs = new Set(panchang.YOGA_DATA.map((y) => y.slug));
  const karanaNames = new Set(panchang.getAllKaranas().map((k) => k.name));
  const seen = new Set();
  for (let d = 0; d < 60; d++) {
    const p = panchang.calculateEducationalPanchang(new Date(2026, 10, 1 + d, 12), varanasi);
    const n = p.tithi.number;
    const slug = n === 15 ? 'purnima' : n === 30 ? 'amavasya' : panchang.UNIQUE_TITHI_ARCHETYPES.find((t) => t.shuklaNumber === n || t.krishnaNumber === n)?.slug;
    assert.ok(slug && tithiSlugs.has(slug), `tithi ${n}`);
    assert.ok(yogaSlugs.has(panchang.YOGA_DATA[p.yoga.index]?.slug), `yoga ${p.yoga.index}`);
    assert.ok(karanaNames.has(p.karana.name), `karana ${p.karana.name}`);
    assert.ok(panchang.getNakshatraBySlug(panchang.nakshatraSlug(p.nakshatra.name)), p.nakshatra.name);
    seen.add(slug);
  }
  assert.ok(seen.size >= 14, 'two months cover nearly every tithi');
});
