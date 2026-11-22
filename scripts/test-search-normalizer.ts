/** normalizePhonetic: Devanagari, IAST and casual Hinglish forms of the same word share one key. */
import assert from 'node:assert/strict';
import { normalizePhonetic } from '../lib/searchNormalizer';
import { parseDirectCitation } from '../lib/search-citation';
import { parseIntent } from '../lib/search-intent';

const GROUPS: string[][] = [
  ['कर्मण्येवाधिकारस्ते', 'karmaṇyevādhikāraste', 'karmanyevadhikaraste'],
  ['कृष्ण', 'kṛṣṇa', 'krishna'],
  ['कर्मण्ये', 'karmaṇye', 'karmanye'],
  ['कर्म', 'karma'],
  ['तत्त्वमसि', 'tattvamasi', 'tat tvam asi'],
  ['गीता', 'gītā', 'geeta', 'gita'],
  ['शान्ति', 'śānti', 'shanti'],
  ['संसार', 'सन्सार', 'saṃsāra', 'sansaara'],
  ['एकादशी', 'ekādaśī', 'ekadashi', 'ekadasi'],
  ['पूर्णिमा', 'pūrṇimā', 'purnima', 'poornima'],
  ['प्रदोष', 'pradoṣa', 'pradosha'],
  ['ज्ञान', 'jñāna', 'gyana', 'gyaana'],
  ['लक्ष्मी', 'lakṣmī', 'lakshmi', 'laxmi'],
];

for (const group of GROUPS) {
  const keys = group.map((form) => normalizePhonetic(form));
  assert.ok(keys[0], `empty key for ${group[0]}`);
  for (let i = 1; i < keys.length; i += 1) {
    assert.equal(keys[i], keys[0], `${group[i]} -> ${keys[i]} should equal ${group[0]} -> ${keys[0]}`);
  }
}

// Dandas and verse numbers do not change the key.
assert.equal(normalizePhonetic('कृष्ण ॥ २ ॥'), normalizePhonetic('कृष्ण') + normalizePhonetic('2'));
assert.equal(normalizePhonetic(''), '');

// Different words stay different.
assert.notEqual(normalizePhonetic('कृष्ण'), normalizePhonetic('कर्म'));
assert.equal(normalizePhonetic('fear'), 'fear');

// Direct Citation Jump Parser (Devanagari & Roman numerals)
const gitaCitationExpected = '/scripture/bhagavadgita/chapter/2/verse/47/';
const gita1 = parseDirectCitation('Gita 2.47');
assert.ok(gita1, 'Gita 2.47 should parse');
assert.equal(gita1.href, gitaCitationExpected);

const gita2 = parseDirectCitation('गीता २.४७');
assert.ok(gita2, 'गीता २.४७ should parse with Devanagari numerals');
assert.equal(gita2.href, gitaCitationExpected);

const gita3 = parseDirectCitation('Bhagavad Gita 2.47');
assert.ok(gita3, 'Bhagavad Gita 2.47 should parse');
assert.equal(gita3.href, gitaCitationExpected);

// Intent parsing: English, Hindi & Romanized Hindi query families
const intent = parseIntent('verses about stress');
assert.ok(intent && intent.kind === 'about', 'Intent should recognize "about" pattern');
assert.equal(intent.term, 'stress');

const hiDef = parseIntent('धर्म क्या है');
assert.ok(hiDef && hiDef.kind === 'define' && hiDef.term === 'धर्म', 'Hindi define intent');

const romDef = parseIntent('samsara meaning in hindi');
assert.ok(romDef && romDef.kind === 'define' && romDef.term === 'samsara', 'meaning in hindi define intent');

const hiCmp = parseIntent('आत्मा और ब्रह्म में अंतर');
assert.ok(hiCmp && hiCmp.kind === 'compare', 'Hindi compare intent');

assert.equal(parseDirectCitation('Gita 2.47 meaning in hindi')?.href, gitaCitationExpected);
assert.equal(parseDirectCitation('11.15 in hindi')?.href, '/scripture/bhagavadgita/chapter/11/verse/15/');

console.log('normalizePhonetic & citation parser tests: ALL PASSED');
