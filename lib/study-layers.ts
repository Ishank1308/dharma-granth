/**
 * Study-layer guide (Phase 6): one plain-language explanation per content
 * layer, so readers can tell what each section is — and what it is not.
 * Surfaced on /how-dharma-granth-works#layers and linked from verse pages.
 */

export interface StudyLayerExplanation {
  id: string;
  titleEn: string;
  titleHi: string;
  /** What this layer is. */
  what: string;
  /** What this layer is not. */
  notWhat: string;
}

export const STUDY_LAYER_GUIDE: StudyLayerExplanation[] = [
  {
    id: 'artha',
    titleEn: 'Artha — word meaning',
    titleHi: 'अर्थ',
    what: 'A plain, word-by-word rendering of what the Sanskrit says, in Hindi and English, to help you follow the verse.',
    notWhat: 'Not a scholarly translation and not scripture itself; where it was prepared with machine assistance it is flagged.',
  },
  {
    id: 'vyakhya',
    titleEn: 'Vyakhya — simple exposition',
    titleHi: 'व्याख्या',
    what: 'An editorial explanation of the verse in simple language, written for this site to make the meaning accessible.',
    notWhat: 'Not a classical bhashya and not a quotation of any acharya; an editorial draft awaiting scholarly review.',
  },
  {
    id: 'modern-context',
    titleEn: 'Modern Context — reflection for today',
    titleHi: 'आधुनिक चिंतन',
    what: 'A contemplative reflection connecting the verse to contemporary life, offered as a starting point for your own thought.',
    notWhat: 'Not part of the scripture, not medical or psychological advice, and makes no promises about outcomes.',
  },
  {
    id: 'knowledge-hubs',
    titleEn: 'Knowledge Hubs — concepts and cross-references',
    titleHi: 'ज्ञान केंद्र',
    what: 'Related verses, concepts, and scriptures gathered for cross-study, so one verse opens doors to others.',
    notWhat: 'Not an exhaustive concordance; links are editorial selections, each marked draft until reviewed.',
  },
  {
    id: 'wisdom-paths',
    titleEn: 'Wisdom Paths — guided study journeys',
    titleHi: 'स्वाध्याय मार्ग',
    what: 'Step-by-step paths through real human questions, answered with validated verses and the masters who taught them.',
    notWhat: 'Not a course with credentials and not a substitute for study with a teacher; the scripture remains the authority.',
  },
];
