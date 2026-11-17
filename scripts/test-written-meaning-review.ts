import assert from 'node:assert/strict';
import { requireWrittenMeaningReview } from './lib/written-meaning-review';

const ok = [
  { note: 'Independently written and checked against the recorded source edition.', reviewStatus: 'reviewed' },
  { note: 'Legacy reviewed meaning entries, no status metadata.' },
];
for (const entry of ok) {
  assert.doesNotThrow(() => requireWrittenMeaningReview('example', entry));
}

const blocked = [
  { reviewStatus: 'draft' },
  { reviewStatus: 'UNREVIEWED' },
  { status: 'needs_review' },
  { note: 'UNREVIEWED DRAFT: check every verse before applying or publishing.' },
  { note: 'Not yet reviewed against the printed source.' },
  { note: 'समीक्षा शेष: संस्कृत मूल पाठ से मिलान आवश्यक है।' },
];
for (const entry of blocked) {
  assert.throws(
    () => requireWrittenMeaningReview('devibhagavat', entry),
    /cannot be applied/,
    JSON.stringify(entry),
  );
}
console.log('✓ Unreviewed written meaning batches are blocked before publication.');
