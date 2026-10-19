import * as assert from 'node:assert/strict';
import { validateEditorialEnrichment, validateReviewQueueItem } from '../lib/editorial-audit/validate';

const ref = { scriptureId: 'bhagavadgita', chapterId: '2', verseId: '47' };
const base = {
  id: 'gita:2:47:application', canonicalRef: ref, layer: 'modern-application',
  text: 'A clearly labeled editorial example.', language: 'en',
  epistemicLabel: 'editorial-application', notScripture: true,
  status: 'draft', provenance: { sources: [], method: 'editor-authored', confidence: 'medium' },
} as const;

assert.equal(validateEditorialEnrichment(base).notScripture, true);
assert.throws(() => validateEditorialEnrichment({ ...base, notScripture: undefined }), /Not Scripture/);
assert.throws(() => validateEditorialEnrichment({ ...base, sanskrit: 'must not be accepted' }), /Canonical field/);
assert.throws(() => validateEditorialEnrichment({ ...base, layer: 'vigyana', epistemicLabel: 'analytical-perspective' }), /analytical perspective/);
assert.throws(() => validateEditorialEnrichment({ ...base, layer: 'traditional-commentary', epistemicLabel: 'traditional-commentary' }), /commentary source/);
assert.equal(validateReviewQueueItem({
  id: 'review:gita:2:47', canonicalRef: ref, layer: 'artha', reason: 'source-missing',
  priority: 'high', evidence: 'No independent source recorded.', status: 'open', createdOn: '2026-10-19',
}).status, 'open');
assert.throws(() => validateReviewQueueItem({
  id: 'review:gita:2:47', canonicalRef: ref, layer: 'artha', reason: 'source-missing',
  priority: 'high', evidence: 'x', status: 'resolved', createdOn: '2026-10-19',
}), /requires a resolution/);
console.log('Editorial schema validation passed.');
