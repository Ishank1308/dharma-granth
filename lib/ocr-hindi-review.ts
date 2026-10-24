import review from '@/data/ocr-hindi-review.json';

export const HINDI_REVIEW_KEYS = new Set(
  review.entries.map(({ scriptureId, chapter, verse }) => `${scriptureId}:${chapter}:${verse}`),
);

export function isHindiSourceReviewRequired(
  scriptureId: string,
  chapter: number | string,
  verse: number | string,
): boolean {
  return HINDI_REVIEW_KEYS.has(`${scriptureId}:${Number(chapter)}:${String(verse)}`);
}
