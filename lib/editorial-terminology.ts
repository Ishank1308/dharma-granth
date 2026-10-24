/**
 * Editorial terminology: the approved visitor-facing words for study aids.
 *
 * Rule: the visible label names the *kind* of help (study translation,
 * editorial draft, research note) and leads with scripture-first language.
 * The honest provenance (AI-assisted, review state) is never removed — it
 * moves to the tooltip, the detail line, the Sources card, and /methodology.
 *
 * Internal flags and identifiers (translationIsAi, commentaryIsAi, AiBadge,
 * FLAG_EXPLANATION_AI) keep their names; they are not rendered.
 */

import { AI_COMMENTARY_LABEL } from '@/lib/ai-labels';

export const EDITION_NAME = 'Dharma Granth Research Edition';

export const SCRIPTURE_PRIMARY_LINE =
  'The Sanskrit text above is the scripture. Everything below it is a study aid, not scripture.';

export interface VisitorLabel {
  /** Short visible text. No AI token; safe for chips and pills. */
  en: string;
  hi: string;
  /** Honest tooltip / detail. Names AI assistance and the review state. */
  detail: string;
  detailHi: string;
}

/** Hindi / English verse translations drafted with AI assistance. */
export const STUDY_TRANSLATION_LABEL: VisitorLabel = {
  en: 'Study translation · review pending',
  hi: 'अध्ययन अनुवाद · समीक्षा बाकी',
  detail:
    'A study translation prepared with AI assistance; not yet reviewed by a person. See Methodology.',
  detailHi:
    'AI सहायता से तैयार अध्ययन अनुवाद; किसी व्यक्ति ने अभी इसकी समीक्षा नहीं की। कार्यपद्धति देखें।',
};

/** Short pill form for search results and compare views. */
export const STUDY_TRANSLATION_SHORT: VisitorLabel = {
  en: 'Study translation',
  hi: 'अध्ययन अनुवाद',
  detail: STUDY_TRANSLATION_LABEL.detail,
  detailHi: STUDY_TRANSLATION_LABEL.detailHi,
};

/** Vyakhya, commentary, reflection and research layers drafted with AI assistance. */
export const EDITORIAL_DRAFT_LABEL: VisitorLabel = {
  en: 'Editorial draft',
  hi: 'संपादकीय प्रारूप',
  detail: AI_COMMENTARY_LABEL.detail,
  detailHi: AI_COMMENTARY_LABEL.detailHi,
};

/** Compare-view source line: approved term first, honest note kept. */
export const COMPARE_STUDY_TRANSLATION_SOURCE =
  'Study translation (AI-assisted draft) · not a scholarly edition';

/** Footer / methodology-adjacent transparency line. */
export const TRANSPARENCY_LINE =
  'Study translations and editorial notes are flagged where they appear; some were prepared with machine assistance and await independent review.';

/** Study helper (Ask) framing: function first, model credit kept quiet. */
export const STUDY_HELPER_NAME = 'AI study helper';
export const STUDY_HELPER_NAME_HI = 'सारथी';
export const STUDY_HELPER_MODEL_CREDIT = 'Meta Muse Spark 1.3';
export const STUDY_HELPER_CAUTION =
  'Answers are generated and may err; verify against the verses.';
export const STUDY_HELPER_CAUTION_HI =
  'उत्तर स्वतः तैयार होते हैं और त्रुटिपूर्ण हो सकते हैं; श्लोकों से जाँच करें।';
