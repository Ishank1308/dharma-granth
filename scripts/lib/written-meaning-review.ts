/**
 * Guard the manual written-meaning application step against batches explicitly
 * marked as drafts or awaiting editorial review.
 *
 * A missing review flag is allowed for the repository's legacy reviewed data;
 * this guard does NOT certify the quality or provenance of those batches.
 */
export type MeaningBatchReview = {
  note?: unknown;
  reviewStatus?: unknown;
  status?: unknown;
};

const NOT_READY = new Set([
  'draft',
  'unreviewed',
  'pending',
  'pending-review',
  'needs-review',
  'rejected',
]);

export function requireWrittenMeaningReview(id: string, batch: MeaningBatchReview): void {
  for (const value of [batch.reviewStatus, batch.status]) {
    if (typeof value !== 'string') continue;
    const status = value.trim().toLowerCase().replace(/[ _]+/g, '-');
    if (NOT_READY.has(status)) {
      throw new Error(`${id}: written meanings are marked "${value}" and cannot be applied. Complete editorial/source review first.`);
    }
  }
  const note = typeof batch.note === 'string' ? batch.note : '';
  if (/\bunreviewed\b|\bnot[\s-]+(?:yet[\s-]+)?reviewed\b|\bpending[\s-]+review\b|असमीक्षित|समीक्षा शेष/i.test(note)) {
    throw new Error(`${id}: written meanings have an unreviewed/pending-review note and cannot be applied. Complete editorial/source review first.`);
  }
}
