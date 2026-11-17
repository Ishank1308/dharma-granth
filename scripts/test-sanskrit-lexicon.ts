/**
 * Run in the Node/tsx checks job, not Playwright's browser-test shard.
 * The reviewed lexicon is application data, not a browser test fixture.
 */
import assert from 'node:assert/strict';
import { findLexiconEntry } from '../data/sanskrit-lexicon';

for (const particle of ['ma', 'mā', 'मा', 'te', 'ते']) {
  assert.equal(findLexiconEntry(particle), null, `Unrelated match for Sanskrit particle ${particle}`);
}
for (const form of ['karma', 'कर्मणि', 'karmaṇi', 'karmani']) {
  assert.equal(findLexiconEntry(form)?.id, 'karma', `Missing karma form ${form}`);
}
for (const form of ['phala', 'फलेषु', 'phaleṣu', 'phaleshu']) {
  assert.equal(findLexiconEntry(form)?.id, 'phala', `Missing phala form ${form}`);
}
for (const form of ['akarma', 'अकर्मणि']) {
  assert.equal(findLexiconEntry(form)?.id, 'akarma', `Missing akarma form ${form}`);
}
console.log('Sanskrit lexicon particle and inflection integrity: OK');
