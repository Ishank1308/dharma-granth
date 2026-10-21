/**
 * The one wording for AI-drafted commentary, used by every badge and note.
 *
 * What the data records: an AI draft is published only after an editor sets
 * it to "approved" in the review queue (data/hi-commentary/_ai-queue.ts →
 * scripts/convert-commentary-to-json.ts), so "not reviewed" would be false.
 * No reviewer name or date is stored and REVIEW_RECORDS is empty, so a bare
 * "reviewed" would overstate it. Change this wording only when that changes.
 */
export const AI_COMMENTARY_LABEL = {
  en: 'AI-drafted · editor-approved',
  hi: 'AI प्रारूप · संपादक-स्वीकृत',
  detail: 'Drafted by AI and approved for publishing by an editor. No named scholarly review is recorded.',
  detailHi: 'AI द्वारा तैयार और संपादक द्वारा प्रकाशन हेतु स्वीकृत। किसी विद्वान की नामित समीक्षा दर्ज नहीं है।',
} as const;
