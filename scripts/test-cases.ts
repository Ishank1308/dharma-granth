import { normalizePhonetic } from '../lib/searchNormalizer';
import { parseDirectCitation } from '../lib/search-citation';
import { parseIntent } from '../lib/search-intent';

console.log('तत्त्वमसि:', normalizePhonetic('तत्त्वमसि'));
console.log('tattvamasi:', normalizePhonetic('tattvamasi'));
console.log('tat tvam asi:', normalizePhonetic('tat tvam asi'));

console.log('Gita 2.47:', parseDirectCitation('Gita 2.47'));
console.log('गीता २.४७:', parseDirectCitation('गीता २.४७'));
console.log('Bhagavad Gita 2.47:', parseDirectCitation('Bhagavad Gita 2.47'));

console.log('verses about stress:', parseIntent('verses about stress'));
console.log('fear:', normalizePhonetic('fear'));
console.log('कर्म:', normalizePhonetic('कर्म'));
console.log('karma:', normalizePhonetic('karma'));
