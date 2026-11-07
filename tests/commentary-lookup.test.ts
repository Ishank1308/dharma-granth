import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { commentaryAmbiguities, commentaryLookupKey, lookupCommentary } from '../lib/commentary-lookup';
import { commentaryOf } from '../lib/verse-has-meaning';
import { commentaryFor, verseMeaningSummary } from '../lib/verse-meaning';

test('exact dotted identifiers take precedence and ambiguous shortened keys are suppressed', () => {
  const all = { '1:1': 'ambiguous', '1:2.1': 'exact second', '1:3': 'unique' };
  const context = commentaryAmbiguities(1, ['1.1', '2.1', '3.1', '1.3']);
  assert.equal(lookupCommentary(all, 1, '2.1', context), 'exact second');
  assert.equal(lookupCommentary(all, 1, '1.1', context), undefined);
  assert.equal(lookupCommentary(all, 1, '3.1', context), undefined);
  assert.equal(lookupCommentary(all, 1, '1.3', context), 'unique');
  assert.equal(commentaryOf(all, 1, '2.1', context), 'exact second');
  assert.equal(lookupCommentary(all, 1, '1.3'), undefined);
});

test('numeric, unique dotted and duplicate raw identifiers resolve safely', () => {
  const context = commentaryAmbiguities(3, [28, '1.3.29', '1.3.30', '1.3.30']);
  const all = { '3:28': 'numeric', '3:29': 'legacy', '3:1.3.29': 'exact', '3:1.3.30': 'duplicate' };
  assert.equal(lookupCommentary(all, 3, 28, context), 'numeric');
  assert.equal(lookupCommentary(all, 3, '1.3.29', context), 'exact');
  assert.equal(lookupCommentary({ '3:29': 'legacy' }, 3, '1.3.29', context), 'legacy');
  assert.equal(lookupCommentary(all, 3, '1.3.30', context), undefined);
  assert.equal(commentaryLookupKey({ '3:NaN': 'invalid' }, 3, 'not-a-number', context), undefined);
});

test('real Mahabharata collisions are suppressed and Prashna exact entries are preferred', () => {
  const chapter = JSON.parse(fs.readFileSync('public/data/scriptures-full/mahabharata/ch-1.json', 'utf8')).chapter;
  const context = commentaryAmbiguities(1, chapter.verses.map((v: { number: number | string }) => v.number));
  const comments = JSON.parse(fs.readFileSync('public/data/hi-commentary/mahabharata.json', 'utf8'));
  assert.ok(context.normalized.has('1:1'));
  assert.ok(comments['1:1']);
  assert.equal(lookupCommentary(comments, 1, '1.1', context), undefined);
  assert.equal(lookupCommentary(comments, 1, '2.1', context), undefined);
  assert.equal(commentaryFor('mahabharata', 1, '2.1'), undefined);
  assert.equal(verseMeaningSummary('mahabharata', 1, { number: '2.1' }).explanation, false);
  const prashna = JSON.parse(fs.readFileSync('public/data/scriptures-full/prashna/ch-1.json', 'utf8')).chapter;
  const pcontext = commentaryAmbiguities(1, prashna.verses.map((v: { number: number | string }) => v.number));
  const pcomments = JSON.parse(fs.readFileSync('public/data/hi-commentary/prashna.json', 'utf8'));
  assert.equal(lookupCommentary(pcomments, 1, '1.9', pcontext), pcomments['1:1.9']);
  assert.equal(commentaryFor('prashna', 1, '1.9')?.explanation, pcomments['1:1.9'].explanation);
});

test('serialized full-chapter ambiguity still protects a single page part', () => {
  const full = commentaryAmbiguities(1, ['1.1', '2.1']);
  const serialized = JSON.parse(JSON.stringify({ normalized: [...full.normalized], raw: [...full.raw] }));
  const restored = { normalized: new Set<string>(serialized.normalized), raw: new Set<string>(serialized.raw) };
  assert.equal(lookupCommentary({ '1:1': 'not uniquely attributable' }, 1, '1.1', restored), undefined);
});
