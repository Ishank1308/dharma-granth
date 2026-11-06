/**
 * Study markup for the palm-leaf reader prototype.
 *
 * Nothing here rewrites a printed translation or a published व्याख्या: every
 * `text` is an exact phrase that already appears in that layer, and the reader
 * only wraps it (colour group or highlight). A phrase that is not found is
 * skipped, so the text always renders in full.
 */

export type StudyGroup = 'action' | 'fruit' | 'claim';

export const STUDY_GROUPS: Record<StudyGroup, { hi: string; en: string }> = {
  action: { hi: 'कर्म', en: 'Action' },
  fruit: { hi: 'फल', en: 'Fruit' },
  claim: { hi: 'अधिकार व आसक्ति', en: 'Claim and attachment' },
};

export interface StudyPhrase {
  text: string;
  group: StudyGroup;
}

export interface VerseStudy {
  /** IAST pada exactly as written in the verse's wordMeaning gloss. */
  padaGroups: Record<string, StudyGroup>;
  /** Phrases in the printed Hindi translation, tinted by group. */
  translationTerms: StudyPhrase[];
  /** Phrases in the व्याख्या marked as terms of a group. */
  explanationTerms: StudyPhrase[];
  /** Phrases in the व्याख्या highlighted as the key ideas. */
  highlights: string[];
  /** Two or more readings the व्याख्या itself names, shown side by side. */
  readings?: { term: string; items: string[]; note: string };
  /** Short glosses for the margin (टिप्पणी). */
  marginNotes: { title: string; body: string; href?: string }[];
}

const STUDIES: Record<string, VerseStudy> = {
  'bhagavadgita:2:47': {
    padaGroups: {
      'karmaṇi': 'action',
      'akarmaṇi': 'action',
      'phaleṣhu': 'fruit',
      'karma-phala': 'fruit',
      'hetuḥ': 'fruit',
      'adhikāraḥ': 'claim',
      'saṅgaḥ': 'claim',
    },
    // Phrases for both Hindi wordings this verse is served with; the one not on the page is skipped.
    translationTerms: [
      { text: 'कर्म करने में', group: 'action' },
      { text: 'फलों में', group: 'fruit' },
      { text: 'कर्मफल के हेतु', group: 'fruit' },
      { text: 'कर्म न करने', group: 'action' },
      { text: 'कर्तव्य-कर्म करनेमें', group: 'action' },
      { text: 'अधिकार', group: 'claim' },
      { text: 'फलोंमें', group: 'fruit' },
      { text: 'कर्मफलका हेतु', group: 'fruit' },
      { text: 'अकर्मण्यतामें', group: 'action' },
      { text: 'आसक्ति', group: 'claim' },
    ],
    // Phrases from the approved व्याख्या (docs/vyakhya-guide.md, published from data/ai-commentary).
    explanationTerms: [
      { text: "'एव' (ही)", group: 'claim' },
      { text: 'फल पर कभी नहीं', group: 'fruit' },
      { text: 'स्वयं को कर्मफल का हेतु मत बनाओ', group: 'fruit' },
      { text: 'कर्म न करने में भी आसक्ति मत रखो', group: 'action' },
    ],
    highlights: [
      'परिणाम का बोझ',
      'फल पर अपना अधिकार मान लेना ही चिंता का मूल बन जाता है',
      'आज का कर्म पूरी निष्ठा और प्रेम से करें',
    ],
    marginNotes: [
      {
        title: 'हेतु',
        body: 'कारण भी, प्रयोजन भी। श्लोक के दूसरे चरण "मा कर्मफलहेतुर्भूः" में यही शब्द है।',
      },
      {
        title: 'आगे देखें · गीता २.४८',
        body: 'समत्वं योग उच्यते। अगला श्लोक उसी समता को योग कहता है जिसकी ओर यह श्लोक ले जाता है।',
        href: '/scripture/bhagavadgita/chapter/2/verse/48/',
      },
    ],
  },
};

export function getVerseStudy(scriptureId: string, chapterId: number | string, verse: number | string): VerseStudy | undefined {
  return STUDIES[`${scriptureId}:${chapterId}:${verse}`];
}
