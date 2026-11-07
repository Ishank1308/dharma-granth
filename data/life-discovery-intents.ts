/**
 * Curated, non-clinical entry points into existing Wisdom for Life topics.
 * Each slug resolves to a topic whose passages and source citations are
 * validated by scripts/test-life-discovery.ts. Search terms are for discovery;
 * they are never used to infer a reader's state.
 */
export type LifeDiscoveryKind = 'emotion' | 'situation' | 'question' | 'practice';

export interface LifeDiscoveryIntent {
  slug: string;
  kind: LifeDiscoveryKind;
  labelEn: string;
  labelHi: string;
  searchTerms: readonly string[];
  quickPick?: boolean;
  seo?: {
    titleHi: string;
    gitaTitle: string;
    libraryTitle: string;
  };
}

export const LIFE_DISCOVERY_INTENTS: readonly LifeDiscoveryIntent[] = [
  {
    slug: 'stress-and-worry',
    kind: 'emotion',
    labelEn: 'Worry and overthinking',
    labelHi: 'चिंता और बार-बार विचार',
    searchTerms: ['anxiety', 'stress', 'racing mind', 'pressure', 'उद्वेग', 'तनाव'],
    quickPick: true,
    seo: {
      titleHi: 'चिंता और मन की चंचलता',
      gitaTitle: 'What the Bhagavad Gita says about a restless mind',
      libraryTitle: 'Study passages on worry and uncertainty',
    },
  },
  {
    slug: 'fear-and-courage',
    kind: 'emotion',
    labelEn: 'Fear and uncertainty',
    labelHi: 'भय और अनिश्चितता',
    searchTerms: ['courage', 'fear of the future', 'भविष्य का भय', 'साहस'],
    quickPick: true,
    seo: {
      titleHi: 'भय और साहस',
      gitaTitle: 'What the Bhagavad Gita says about fear and courage',
      libraryTitle: 'Study passages on fear and courage',
    },
  },
  {
    slug: 'anger',
    kind: 'emotion',
    labelEn: 'Anger and frustration',
    labelHi: 'क्रोध और खिन्नता',
    searchTerms: ['irritation', 'resentment', 'क्रोध', 'अशान्ति'],
    quickPick: true,
    seo: {
      titleHi: 'क्रोध',
      gitaTitle: 'What the Bhagavad Gita says about anger',
      libraryTitle: 'Study passages on anger',
    },
  },
  {
    slug: 'grief-and-loss',
    kind: 'emotion',
    labelEn: 'Grief and loss',
    labelHi: 'शोक और वियोग',
    searchTerms: ['bereavement', 'heartbreak', 'loss', 'शोक', 'वियोग'],
    quickPick: true,
    seo: {
      titleHi: 'शोक और वियोग',
      gitaTitle: 'What the Bhagavad Gita says about grief and loss',
      libraryTitle: 'Study passages on grief and loss',
    },
  },
  {
    slug: 'duty-and-decision-making',
    kind: 'situation',
    labelEn: 'Difficult decisions',
    labelHi: 'कठिन निर्णय',
    searchTerms: ['choices', 'duty', 'dilemma', 'कर्तव्य', 'द्वंद्व'],
    quickPick: true,
    seo: {
      titleHi: 'कठिन निर्णय और कर्तव्य-संकट',
      gitaTitle: 'What the Bhagavad Gita says about duty and tough decisions',
      libraryTitle: 'Study passages on duty and decision-making',
    },
  },
  {
    slug: 'discipline',
    kind: 'practice',
    labelEn: 'Discipline and resolve',
    labelHi: 'अनुशासन और संकल्प',
    searchTerms: ['willpower', 'procrastination', 'आलस्य', 'संकल्प'],
    quickPick: true,
    seo: {
      titleHi: 'अनुशासन और संकल्प',
      gitaTitle: 'What the Bhagavad Gita says about discipline',
      libraryTitle: 'Study passages on discipline',
    },
  },
  {
    slug: 'concentration',
    kind: 'practice',
    labelEn: 'Focus and attention',
    labelHi: 'एकाग्रता और ध्यान',
    searchTerms: ['distraction', 'attention', 'focus', 'मन का भटकाव'],
    quickPick: true,
    seo: {
      titleHi: 'एकाग्रता',
      gitaTitle: 'What the Bhagavad Gita says about attention',
      libraryTitle: 'Study passages on attention and focus',
    },
  },
  {
    slug: 'leadership',
    kind: 'situation',
    labelEn: 'Leadership responsibilities',
    labelHi: 'नेतृत्व का दायित्व',
    searchTerms: ['responsibility', 'team', 'नेतृत्व', 'दायित्व'],
    quickPick: true,
    seo: {
      titleHi: 'नेतृत्व और उत्तरदायित्व',
      gitaTitle: 'What the Bhagavad Gita says about leadership',
      libraryTitle: 'Study passages on leadership',
    },
  },
  {
    slug: 'family-responsibilities',
    kind: 'situation',
    labelEn: 'Family responsibilities',
    labelHi: 'पारिवारिक दायित्व',
    searchTerms: ['family', 'caregiving', 'परिवार', 'गृहस्थ'],
    quickPick: true,
    seo: {
      titleHi: 'पारिवारिक दायित्व और गृहस्थ धर्म',
      gitaTitle: 'What the Bhagavad Gita says about family duties',
      libraryTitle: 'Study passages on family responsibilities and Grihastha dharma',
    },
  },
  {
    slug: 'relationships',
    kind: 'situation',
    labelEn: 'Relationships and belonging',
    labelHi: 'संबंध और अपनत्व',
    searchTerms: ['conflict', 'communication', 'loneliness', 'belonging', 'connection', 'सम्बन्ध', 'संवाद', 'अपनत्व'],
    quickPick: true,
    seo: {
      titleHi: 'संबंध, सहानुभूति और अपनत्व',
      gitaTitle: 'What the Bhagavad Gita says about relationships',
      libraryTitle: 'Study passages on relationships, empathy and harmony',
    },
  },
  {
    slug: 'devotion',
    kind: 'question',
    labelEn: 'Questions of faith and devotion',
    labelHi: 'श्रद्धा और भक्ति के प्रश्न',
    searchTerms: ['spiritual dryness', 'faith', 'भक्ति', 'श्रद्धा'],
    quickPick: true,
    seo: {
      titleHi: 'श्रद्धा और भक्ति के प्रश्न',
      gitaTitle: 'What the Bhagavad Gita says about devotion and surrender',
      libraryTitle: 'Study passages on devotion, faith and surrender',
    },
  },
  {
    slug: 'self-knowledge',
    kind: 'question',
    labelEn: 'Who am I? Self-knowledge',
    labelHi: 'मैं कौन हूँ? आत्मज्ञान',
    searchTerms: ['identity', 'self', 'आत्मस्वरूप', 'पहचान'],
    quickPick: true,
    seo: {
      titleHi: 'आत्मज्ञान और आत्मस्वरूप',
      gitaTitle: 'What the Bhagavad Gita says about self-knowledge',
      libraryTitle: 'Study passages on self-knowledge and the true Self',
    },
  },
  {
    slug: 'meaning-of-life',
    kind: 'question',
    labelEn: 'Purpose and meaning',
    labelHi: 'उद्देश्य और जीवन का अर्थ',
    searchTerms: ['purpose', 'meaning', 'direction', 'ध्येय'],
    quickPick: true,
    seo: {
      titleHi: 'उद्देश्य और जीवन का अर्थ',
      gitaTitle: 'What the Bhagavad Gita says about purpose',
      libraryTitle: 'Study passages on purpose and meaning',
    },
  },
  {
    slug: 'failure-and-setbacks',
    kind: 'situation',
    labelEn: 'Failure and setbacks',
    labelHi: 'असफलता और बाधाएँ',
    searchTerms: ['setback', 'disappointment', 'असफलता', 'विघ्न'],
    seo: {
      titleHi: 'असफलता और बाधाएँ',
      gitaTitle: 'What the Bhagavad Gita says about handling failure and setbacks',
      libraryTitle: 'Study passages on overcoming failure and disappointment',
    },
  },
  {
    slug: 'skill-in-work',
    kind: 'practice',
    labelEn: 'Skill in action',
    labelHi: 'कर्म-कौशल',
    searchTerms: ['work', 'productivity', 'action', 'कर्म में कुशलता'],
    seo: {
      titleHi: 'कर्म-कौशल (योगः कर्मसु कौशलम्)',
      gitaTitle: 'What the Bhagavad Gita says about skill in action and work',
      libraryTitle: 'Study passages on skill in action and selfless work',
    },
  },
  {
    slug: 'success',
    kind: 'question',
    labelEn: 'Success and achievement',
    labelHi: 'सफलता और सिद्धि',
    searchTerms: ['achievement', 'results', 'सिद्धि', 'फल'],
    seo: {
      titleHi: 'सफलता और सिद्धि',
      gitaTitle: 'What the Bhagavad Gita says about success',
      libraryTitle: 'Study passages on success',
    },
  },
  {
    slug: 'attachment',
    kind: 'question',
    labelEn: 'Attachment and care',
    labelHi: 'आसक्ति और अनुराग',
    searchTerms: ['attachment', 'clinging', 'आसक्ति', 'मोह'],
    seo: {
      titleHi: 'आसक्ति और मोह',
      gitaTitle: 'What the Bhagavad Gita says about attachment and desire',
      libraryTitle: 'Study passages on attachment, desire and possessiveness',
    },
  },
  {
    slug: 'detachment',
    kind: 'question',
    labelEn: 'Non-attachment',
    labelHi: 'अनासक्ति',
    searchTerms: ['detachment', 'letting go', 'वैराग्य', 'अनासक्ति'],
    seo: {
      titleHi: 'अनासक्ति और वैराग्य',
      gitaTitle: 'What the Bhagavad Gita says about non-attachment and freedom',
      libraryTitle: 'Study passages on non-attachment and mental freedom',
    },
  },
  {
    slug: 'death',
    kind: 'question',
    labelEn: 'Life, death, and the Self',
    labelHi: 'जीवन, मृत्यु और आत्मा',
    searchTerms: ['mortality', 'death', 'मृत्यु', 'आत्मा'],
    seo: {
      titleHi: 'जीवन, मृत्यु और अमर आत्मा',
      gitaTitle: 'What the Bhagavad Gita says about death and the eternal soul',
      libraryTitle: 'Study passages on death, transition and the immortal Self',
    },
  },
  {
    slug: 'contentment',
    kind: 'practice',
    labelEn: 'Contentment and gratitude',
    labelHi: 'संतोष और कृतज्ञता',
    searchTerms: ['gratitude', 'satisfaction', 'संतोष', 'कृतज्ञता'],
    seo: {
      titleHi: 'संतोष और कृतज्ञता',
      gitaTitle: 'What the Bhagavad Gita says about contentment and gratitude',
      libraryTitle: 'Study passages on contentment, peace and inner joy',
    },
  },
  {
    slug: 'self-control',
    kind: 'practice',
    labelEn: 'Self-control',
    labelHi: 'आत्मसंयम',
    searchTerms: ['self regulation', 'restraint', 'आत्मसंयम', 'संयम'],
    seo: {
      titleHi: 'आत्मसंयम और इंद्रिय-निग्रह',
      gitaTitle: 'What the Bhagavad Gita says about self-control and mastery',
      libraryTitle: 'Study passages on self-control and sensory discipline',
    },
  },
] as const;

export const LIFE_DISCOVERY_QUICK_PICKS = LIFE_DISCOVERY_INTENTS.filter(
  (intent) => intent.quickPick,
);

export const LIFE_DISCOVERY_SEO_INTENTS = LIFE_DISCOVERY_INTENTS.filter(
  (intent) => intent.seo,
);
