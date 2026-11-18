import assert from 'node:assert/strict';
import { parseWordMeanings } from '../lib/word-gloss';

// Genuine word—meaning pairs remain available in both Sanskrit and IAST.
assert.deepEqual(parseWordMeanings('धर्म — कर्तव्य; कर्म — कार्य'), [
  { pada: 'धर्म', meaning: 'कर्तव्य' },
  { pada: 'कर्म', meaning: 'कार्य' },
]);
assert.deepEqual(parseWordMeanings('prāṇa — vital breath'), [
  { pada: 'prāṇa', meaning: 'vital breath' },
]);

// Existing legacy records sometimes put prose into wordMeaning. Do not transform
// a long editorial sentence, or an overly long explanation, into a word chip.
assert.deepEqual(parseWordMeanings('The Self is paradoxical — unmoving yet swifter than mind. It is the substratum in which movement occurs.'), []);
assert.deepEqual(parseWordMeanings('Prājña — the consciousness of deep sleep — is identified with Īśvara, the cosmic Lord. The same undifferentiated awareness in which the individual dissolves each night is the source of all beings and the destination to which they return.'), []);

console.log('word-gloss: valid entries retained; prose rejected');
