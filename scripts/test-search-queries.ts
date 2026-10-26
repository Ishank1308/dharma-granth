/** Phase 6: the citation and phonetic queries the search box must resolve. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseDirectCitation } from '../lib/search-citation';
import { normalizePhonetic } from '../lib/searchNormalizer';

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

assert.equal(normalizePhonetic('तत्त्वमसि'), normalizePhonetic('tattvamasi'), 'तत्त्वमसि = tattvamasi');
assert.equal(normalizePhonetic('कर्म'), normalizePhonetic('karma'), 'कर्म = karma');
console.log('search query checks passed');
