/** Phase 6: the citation and phonetic queries the search box must resolve. */
import assert from 'node:assert/strict';
import { parseDirectCitation } from '../lib/search-citation';
import { normalizePhonetic } from '../lib/normalize-search';

const GITA_247 = '/scripture/bhagavadgita/chapter/2/verse/47/';
for (const q of ['Gita 2.47', 'Bhagavad Gita 2.47', 'bg 2.47', 'गीता २.४७', 'गीता 2.47']) {
  assert.equal(parseDirectCitation(q)?.href, GITA_247, `citation: ${q}`);
}
assert.equal(parseDirectCitation('katha 1.3.3')?.href, '/scripture/katha/chapter/3/verse/3/');
assert.ok(parseDirectCitation('rv 1.1.1'), 'rv 1.1.1 resolves');

assert.equal(normalizePhonetic('तत्त्वमसि'), normalizePhonetic('tattvamasi'), 'तत्त्वमसि = tattvamasi');
assert.equal(normalizePhonetic('कर्म'), normalizePhonetic('karma'), 'कर्म = karma');
console.log('search query checks passed');
