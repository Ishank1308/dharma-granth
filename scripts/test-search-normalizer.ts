/** normalizePhonetic: Devanagari, IAST and casual Hinglish forms of the same word share one key. */
import assert from 'node:assert/strict';
import { normalizePhonetic } from '../lib/searchNormalizer';

const GROUPS: string[][] = [
  ['कर्मण्येवाधिकारस्ते', 'karmaṇyevādhikāraste', 'karmanyevadhikaraste'],
  ['कृष्ण', 'kṛṣṇa', 'krishna'],
  ['कर्मण्ये', 'karmaṇye', 'karmanye'],
  ['गीता', 'gītā', 'geeta', 'gita'],
  ['शान्ति', 'śānti', 'shanti'],
  ['संसार', 'सन्सार', 'saṃsāra', 'sansaara'],
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

console.log('normalizePhonetic: ok');
