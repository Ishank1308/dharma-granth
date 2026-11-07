/** Run: npm run test:holdings */
import assert from 'node:assert/strict';
import { catalogueNote, formatCount, formatCountDevanagari, hindiCatalogueNote } from '../lib/holdings-label';

assert.equal(formatCount(10600), '10,600');
assert.equal(formatCount(187421), '1,87,421');
assert.equal(formatCountDevanagari(701), '७०१');
assert.equal(formatCountDevanagari(187421), '१,८७,४२१');

assert.equal(catalogueNote(67, 10600, 'verse'), 'Traditional count: 10,600 verses');
assert.equal(catalogueNote(2, 1, 'verse'), 'Traditional count: 1 verse');
assert.equal(catalogueNote(90, 137, 'chapter'), 'Traditional count: 137 chapters');
assert.equal(catalogueNote(6, 1, 'chapter'), 'Traditional count: 1 chapter');
assert.equal(catalogueNote(18, 18, 'chapter'), undefined);
assert.equal(catalogueNote(18, undefined, 'verse'), undefined);

assert.equal(hindiCatalogueNote(67, 10600, 'verse'), 'परम्परागत गणना: 10,600 श्लोक');
assert.equal(hindiCatalogueNote(90, 137, 'chapter'), 'परम्परागत गणना: 137 अध्याय');
assert.equal(hindiCatalogueNote(18, 18, 'verse'), undefined);
assert.equal(hindiCatalogueNote(0, undefined, 'chapter'), undefined);

console.log('holdings-label: all assertions passed');
