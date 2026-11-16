import { expect, test } from '@playwright/test';
import { findLexiconEntry } from '../data/sanskrit-lexicon';

test('short Sanskrit particles never acquire an unrelated word explorer entry', () => {
  for (const particle of ['ma', 'mā', 'मा', 'te', 'ते']) {
    expect(findLexiconEntry(particle), particle).toBeNull();
  }
});

test('reviewed Sanskrit headwords and their documented inflections still match', () => {
  for (const form of ['karma', 'कर्मणि', 'karmaṇi', 'karmani']) {
    expect(findLexiconEntry(form)?.id, form).toBe('karma');
  }
  for (const form of ['phala', 'फलेषु', 'phaleṣu', 'phaleshu']) {
    expect(findLexiconEntry(form)?.id, form).toBe('phala');
  }
  for (const form of ['akarma', 'अकर्मणि']) {
    expect(findLexiconEntry(form)?.id, form).toBe('akarma');
  }
});
