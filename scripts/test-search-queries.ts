/** Phase 6: the citation and phonetic queries the search box must resolve. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseDirectCitation } from '../lib/search-citation';
import { normalizePhonetic } from '../lib/searchNormalizer';
import { loadCoreIndex, searchCoreIndex } from '../lib/search-core';

const GITA_247 = '/scripture/bhagavadgita/chapter/2/verse/47/';
for (const q of ['Gita 2.47', 'Bhagavad Gita 2.47', 'bg 2.47', 'गीता २.४७', 'गीता 2.47']) {
  assert.equal(parseDirectCitation(q)?.href, GITA_247, `citation: ${q}`);
}
assert.equal(parseDirectCitation('katha 1.3.3')?.href, '/scripture/katha/chapter/3/verse/3/');
assert.ok(parseDirectCitation('rv 1.1.1'), 'rv 1.1.1 resolves');

// Compare citation bounds with the published corpus, including every hymn's last verse.
const rigveda = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/scriptures-full/rigveda.json'), 'utf8')) as {
  chapters: Array<{ number: number; verses: Array<{ number: string }> }>;
};
for (const chapter of rigveda.chapters) {
  const ends = new Map<string, number>();
  for (const verse of chapter.verses) {
    const ref = `rv ${chapter.number}.${verse.number}`;
    assert.equal(parseDirectCitation(ref)?.href, `/scripture/rigveda/chapter/${chapter.number}/#verse-${verse.number}`, ref);
    const [hymn, rik] = verse.number.split('.');
    ends.set(hymn, Math.max(ends.get(hymn) ?? 0, Number(rik)));
  }
  for (const [hymn, last] of ends) {
    const ref = `rv ${chapter.number}.${hymn}.${last + 1}`;
    assert.equal(parseDirectCitation(ref), null, `unpublished verse: ${ref}`);
  }
}
for (const ref of ['rv 1.1.999', 'rv 1.1.0', 'rv 1.0.1', 'rv 1.192.1', 'rv 0.1.1', 'rv 11.1.1', 'rv 8.67.1', 'rv 8.67.21']) {
  assert.equal(parseDirectCitation(ref), null, `invalid or unavailable reference: ${ref}`);
}
assert.equal(parseDirectCitation('ऋग्वेद १.१६४.४६')?.href, '/scripture/rigveda/chapter/1/#verse-164.46');
assert.equal(parseDirectCitation('rv 10.129.1')?.href, '/scripture/rigveda/chapter/10/#verse-129.1');

loadCoreIndex({
  v: 1,
  scriptures: [['bhagavatapurana', 'Bhagavata Purana', 'भागवत पुराण', '/scripture/bhagavatapurana/']],
  chapters: [['bhagavatapurana', 247, 'Chapter 247', 'अध्याय 247']],
  pathways: [], topics: [], verses: [],
});
assert.equal(searchCoreIndex('2.47').some(({ item }) => item.group === 'chapter'), false,
  'a dotted verse query must not become chapter 247');
const chapter247 = searchCoreIndex('247').find(({ item }) => item.group === 'chapter')?.item;
assert.equal(chapter247?.href, '/scripture/bhagavatapurana/chapter/247/');
assert.equal(chapter247?.reference, 'Bhagavata Purana · Ch. 247');
assert.equal(normalizePhonetic('तत्त्वमसि'), normalizePhonetic('tattvamasi'), 'तत्त्वमसि = tattvamasi');
assert.equal(normalizePhonetic('कर्म'), normalizePhonetic('karma'), 'कर्म = karma');

const liveCore = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/search/core-index.json'), 'utf8'));
loadCoreIndex(liveCore);
const gayatri = searchCoreIndex('gayatri').find(({ item }) => item.href.includes('/mantras/'));
assert.ok(gayatri, 'searching gayatri should find gayatri mantra');
assert.equal(gayatri?.item.href, '/mantras/gayatri-mantra/');

const ekadashi = searchCoreIndex('ekadashi').find(({ item }) => item.href === '/panchang/ekadashi/');
assert.ok(ekadashi, 'searching ekadashi should direct to /panchang/ekadashi/');

const chalisa = searchCoreIndex('chalisa').find(({ item }) => item.href === '/mantras/hanuman-chalisa/');
assert.ok(chalisa, 'searching chalisa should find hanuman chalisa');

const aditya = searchCoreIndex('aditya').find(({ item }) => item.href === '/mantras/aditya-hridaya-stotra/');
assert.ok(aditya, 'searching aditya should find aditya hridaya stotra');

const rohini = searchCoreIndex('rohini').find(({ item }) => item.href === '/panchang/nakshatras/rohini/');
assert.ok(rohini, 'searching rohini should direct to /panchang/nakshatras/rohini/');

const nachiketa = searchCoreIndex('nachiketa').find(({ item }) => item.href === '/characters/nachiketa/');
assert.ok(nachiketa, 'searching nachiketa should direct to /characters/nachiketa/');

const vidura = searchCoreIndex('vidura').find(({ item }) => item.href === '/characters/vidura/');
assert.ok(vidura, 'searching vidura should direct to /characters/vidura/');

const chaturthi = searchCoreIndex('chaturthi').find(({ item }) => item.href === '/panchang/tithis/chaturthi/');
assert.ok(chaturthi, 'searching chaturthi should direct to /panchang/tithis/chaturthi/');

const atharvashirsha = searchCoreIndex('atharvashirsha').find(({ item }) => item.href === '/mantras/ganapati-atharvashirsha/');
assert.ok(atharvashirsha, 'searching atharvashirsha should find ganapati atharvashirsha');

const bajrang = searchCoreIndex('bajrang').find(({ item }) => item.href === '/mantras/bajrang-baan/');
assert.ok(bajrang, 'searching bajrang should find bajrang baan');

const vyatipata = searchCoreIndex('vyatipata').find(({ item }) => item.href === '/panchang/yogas/vyatipata/');
assert.ok(vyatipata, 'searching vyatipata should direct to /panchang/yogas/vyatipata/');

const vishti = searchCoreIndex('vishti').find(({ item }) => item.href === '/panchang/karanas/vishti/');
assert.ok(vishti, 'searching vishti should direct to /panchang/karanas/vishti/');

const argala = searchCoreIndex('argala').find(({ item }) => item.href === '/mantras/argala-stotram/');
assert.ok(argala, 'searching argala should direct to /mantras/argala-stotram/');

const kavacham = searchCoreIndex('kavacham').find(({ item }) => item.href === '/mantras/devi-kavacham/');
assert.ok(kavacham, 'searching kavacham should find devi-kavacham');

console.log('search query checks passed');
