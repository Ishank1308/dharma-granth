# Hindi OCR source-review queue

Commit `aef2fdcb` removed Latin OCR fragments from 64 Hindi meaning fields in nine scripture transcriptions. Removing those fragments did not establish that the remaining Hindi is readable or faithful to its printed edition. For example, Agni Purana 18:16 still consisted mostly of nonsensical syllables on the live chapter page.

`data/ocr-hindi-review.json` records the 64 exact scripture, chapter, and verse coordinates. During `npm run shard:scriptures`, the generated chapter shards omit those Hindi meaning fields and carry `hindiReviewRequired: true`. The reader says the Hindi meaning is awaiting source-edition verification. The full-book source JSON is left intact for comparison, and the Sanskrit, transliteration, and English fields are untouched.

To restore an entry, a reviewer must compare the Hindi field with the identified printed edition, record that evidence in the editorial handoff, correct the source transcription if needed, then remove its coordinate from the queue. Run `npm run shard:scriptures` and `npm run test:ocr-hindi-review` before building. The test fails if a queued verse disappears or a generated shard exposes its unreviewed Hindi.

This queue covers only the 64 Hindi fields affected by that OCR cleanup. It does not certify other translations or commentary fields; those need their own review.
