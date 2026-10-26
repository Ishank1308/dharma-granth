import review from '@/data/ocr-hindi-review.json';

export const HINDI_REVIEW_KEYS = new Set(
  review.entries.map(({ scriptureId, chapter, verse }) => `${scriptureId}:${chapter}:${verse}`),
);

/**
 * Entries with a `queue` hold Hindi that was matched back to its verse from a printed edition (data/refill/*.json),
 * not the original OCR review queue. Only their Hindi waits for review: their English is judged like any other verse.
 */
export const REFILL_REVIEW_KEYS = new Set(
  review.entries.filter((e) => 'queue' in e).map(({ scriptureId, chapter, verse }) => `${scriptureId}:${chapter}:${verse}`),
);

export function isHindiSourceReviewRequired(
  scriptureId: string,
  chapter: number | string,
  verse: number | string,
): boolean {
  return HINDI_REVIEW_KEYS.has(`${scriptureId}:${Number(chapter)}:${String(verse)}`);
}

/** The publish-time alignment test leaves this field of the verse to the review step. */
export function isReviewKept(
  scriptureId: string,
  chapter: number | string,
  verse: number | string,
  field: 'hindi' | 'translation',
): boolean {
  const key = `${scriptureId}:${Number(chapter)}:${String(verse)}`;
  if (!HINDI_REVIEW_KEYS.has(key)) return false;
  return field === 'hindi' || !REFILL_REVIEW_KEYS.has(key);
}
