/** Review labels, the verse key and the commentary registry shared by the study features (data/study-content.ts). */

export type ReviewStatus = 'draft' | 'editorial-review' | 'source-review' | 'approved';

export const REVIEW_LABEL: Record<ReviewStatus, string> = {
  draft: 'Draft, awaiting review',
  'editorial-review': 'In editorial review',
  'source-review': 'In source review',
  approved: 'Approved',
};

export const verseKey = (scriptureId: string, chapter: number | string, verse: number | string) =>
  `${scriptureId}:${chapter}:${verse}`;

/* ── Commentary comparison ─────────────────────────────────────────── */

export interface CommentaryEntry {
  commentator: string;
  tradition: string;
  language: 'Sanskrit' | 'Hindi' | 'English';
  detail: 'brief' | 'full';
  text: string;
  sourceEdition: string;
  translator?: string;
  publication: string;
  review: ReviewStatus;
}

/**
 * Empty on purpose: no traditional commentary has been entered and reviewed
 * yet. Add entries here (with a full source edition) and the comparison
 * interface lights up for that verse.
 */
export const COMMENTARIES: Record<string, CommentaryEntry[]> = {};
