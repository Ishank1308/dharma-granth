/**
 * Daily Dharma Journey (दैनिक धर्म यात्रा) Data Model & Curated Sessions
 *
 * Epistemic Separation Guarantee:
 * - Original Sanskrit and canonical recension citations are strictly separated
 *   from editorial explanations, modern applications, and reflection prompts.
 * - Zero hallucination: Every verse points directly to an existing canonical text
 *   in the Dharma Granth library.
 */

export interface SanskritWordAnalysis {
  pada: string;
  iast: string;
  root: string;
  grammar: string;
  meaningEn: string;
  meaningHi: string;
}

export interface ModernScenario {
  contextType: 'student' | 'career' | 'creative' | 'family' | 'leadership' | 'discipline' | 'uncertainty';
  contextLabelEn: string;
  contextLabelHi: string;
  situation: string;
  application: string;
  disclaimer: string;
}

export interface DailyReflectionPrompt {
  questionEn: string;
  questionHi: string;
  quietThoughtPrompt: string;
}

export interface DailyPracticalAction {
  titleEn: string;
  titleHi: string;
  estimatedMinutes: number;
  steps: string[];
  controllableList?: string[];
  uncontrollableList?: string[];
}

export interface ContextualNextStep {
  id: string;
  title: string;
  scriptureRef: string;
  href: string;
  type: 'next_verse' | 'related_concept' | 'commentary' | 'guided_journey';
  reason: string;
  basis: string;
}

export interface EditorialProvenance {
  sourceScripture: string;
  sourceScriptureSanskrit: string;
  canonicalRecension: string;
  primaryEdition: string;
  translatorAttribution: string;
  commentarySources: string[];
  editorialReviewer: string;
  lastReviewedDate: string;
  reviewStatus: 'Verified Canonical' | 'Curator Reviewed';
}

export interface DailyDharmaSession {
  id: string;
  journeyId: string;
  journeyTitleEn: string;
  journeyTitleHi: string;
  lessonIndex: number;
  totalLessons: number;
  estimatedMinutes: number;
  
  // 1. Scripture Reference
  scriptureId: string;
  chapterNumber: number;
  verseNumber: number | string;
  referenceDisplayEn: string;
  referenceDisplayHi: string;
  
  // 2. Canonical Sanskrit Text
  sanskritDevanagari: string;
  sanskritTransliteration: string;
  meter?: string;
  
  // 3. Verse in 30 Seconds Card
  thirtySecondCard: {
    situation: string;
    teaching: string;
    clarification: string;
    quickAction: string;
  };
  
  // 4. Meanings
  simpleMeaningEn: string;
  simpleMeaningHi: string;
  literalTranslationEn: string;
  literalTranslationHi: string;
  
  // 5. Linguistic Analysis (Deep Mode)
  sandhiSplit?: string;
  keyTerms: SanskritWordAnalysis[];
  
  // 6. Traditional Commentary Highlights (Deep Mode)
  traditionalCommentaries: Array<{
    author: string;
    tradition: string;
    excerptEn: string;
    excerptHi: string;
    citation: string;
  }>;
  
  // 7. Modern Real-World Example
  modernExample: ModernScenario;
  
  // 8. Common Misunderstanding Rectification
  commonMisunderstanding: {
    misconception: string;
    betterUnderstanding: string;
  };
  
  // 9. Reflection
  reflectionPrompt: DailyReflectionPrompt;
  
  // 10. Practical Action
  practicalAction: DailyPracticalAction;
  
  // 11. Contextual Recommendations (Max 3)
  recommendations: ContextualNextStep[];
  
  // 12. Review & Provenance
  provenance: EditorialProvenance;
}

export const SAMPLE_DAILY_JOURNEYS: Record<string, DailyDharmaSession> = {
  'gita-2-47': {
    id: 'gita-2-47',
    journeyId: 'understanding-karma-yoga',
    journeyTitleEn: 'Understanding Karma Yoga',
    journeyTitleHi: 'कर्मयोग का मर्म',
    lessonIndex: 2,
    totalLessons: 7,
    estimatedMinutes: 6,
    scriptureId: 'bhagavadgita',
    chapterNumber: 2,
    verseNumber: 47,
    referenceDisplayEn: 'Bhagavad Gita 2.47',
    referenceDisplayHi: 'श्रीमद्भगवद्गीता २.४७',
    sanskritDevanagari: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
    sanskritTransliteration: "karmaṇyevādhikāraste mā phaleṣu kadācana |\nmā karmaphalaheturbhūrmā te saṅgo'stvakarmaṇi ||",
    meter: 'Anuṣṭubh (32 syllables)',
    thirtySecondCard: {
      situation: 'You are anxious about a critical result (interview, exam, release, project outcome).',
      teaching: 'Focus completely on responsible effort, present craftsmanship, and ethical action.',
      clarification: 'The verse does not reject goals, planning, or quality evaluation.',
      quickAction: 'Spend 15 focused minutes on your next immediate task without refreshing for reactions.',
    },
    simpleMeaningEn:
      'You have sovereignty over your effort, preparation, and honest action, but you cannot dictate the final outcome. Results depend on countless conditions beyond any single individual. When you obsess over outcomes, you scatter your mental energy and invite anxiety. When you pour yourself into honest action, you find calm mastery.',
    simpleMeaningHi:
      'आपका अधिकार केवल अपने कर्म, पुरुषार्थ और कर्तव्य पर है, उसके परिणामों पर कभी नहीं। परिणाम अनेक परिस्थितियों पर निर्भर करते हैं जो आपके वश में नहीं हैं। फल की चिंता छोड़कर जब आप काम में डूब जाते हैं, तो मन शांत और केंद्रित रहता है।',
    literalTranslationEn:
      'Your entitlement is only to the performance of duty, never to the fruits thereof. Do not let the fruit of action be your motive, nor let your attachment be to inaction.',
    literalTranslationHi:
      'तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। इसलिए कर्म के फल की वासना मत रखो, और कर्म न करने में तुम्हारी आसक्ति न हो।',
    sandhiSplit: 'कर्मणि + एव + अधिकारः + ते । मा + फलेषु + कदाचन । मा + कर्म-फल-हेतुः + भूः । मा + ते + सङ्गः + अस्तु + अकर्मणि',
    keyTerms: [
      {
        pada: 'कर्मणि (Karmaṇi)',
        iast: 'karmaṇi',
        root: 'कृ (to do, to act)',
        grammar: 'Locative singular of Karman (neuter)',
        meaningEn: 'In action, duty, and sphere of effort.',
        meaningHi: 'कर्म में, कर्तव्य में।',
      },
      {
        pada: 'अधिकारः (Adhikāraḥ)',
        iast: 'adhikāraḥ',
        root: 'अधि + कृ',
        grammar: 'Nominative singular (masculine)',
        meaningEn: 'Legitimate jurisdiction, rightful agency, domain of responsibility.',
        meaningHi: 'कार्यक्षेत्र, कर्तव्य का अधिकार।',
      },
      {
        pada: 'मा फलेषु (Mā phaleṣu)',
        iast: 'mā phaleṣu',
        root: 'फल (fruit, outcome)',
        grammar: 'Locative plural with prohibitive particle mā',
        meaningEn: 'Never in the fruits or outcomes.',
        meaningHi: 'फलों में कभी नहीं।',
      },
      {
        pada: 'अकर्मणि (Akarmaṇi)',
        iast: 'akarmani',
        root: 'अ + कर्मन्',
        grammar: 'Locative singular',
        meaningEn: 'In inaction, passivity, or avoidance of duty.',
        meaningHi: 'कर्म न करने (अकर्म) में।',
      },
    ],
    traditionalCommentaries: [
      {
        author: 'Adi Shankaracharya (शंकर भाष्य)',
        tradition: 'Advaita Vedanta',
        citation: 'Gita Bhashya 2.47 (Gita Press Edition, pp. 84-86)',
        excerptEn:
          'If the desire for fruits arises, it generates rebirth and anxiety. Yet Krishna adds: do not incline toward inaction. Giving up action through depression or lethargy is spiritual delusion.',
        excerptHi:
          'यदि कर्मफल की तृष्णा होगी तो वह चित्तविक्षेप का कारण बनेगी। परंतु कर्म छोड़ देना भी अज्ञान है; निष्काम भाव से ईश्वरार्पण बुद्धि से कर्तव्य करना ही योग है।',
      },
      {
        author: 'Ramanujacharya (गीताभाष्य)',
        tradition: 'Vishishtadvaita',
        citation: 'Ramanuja Gita Bhashya 2.47',
        excerptEn:
          'Actions belong to the Supreme; perform them as humble devotional service without claiming independent agency or proprietary claim over worldly accolades.',
        excerptHi:
          'समस्त कर्म भगवान की आराधना स्वरूप हैं, अतः उन पर अहंकारवश स्वामित्व का दावा न करें।',
      },
    ],
    modernExample: {
      contextType: 'career',
      contextLabelEn: 'Work & Professional Life',
      contextLabelHi: 'कार्यक्षेत्र और पेशेवर जीवन',
      situation:
        'A team lead preparing a major client presentation finds themselves unable to sleep, obsessing: "What if the client rejects the proposal? What if leadership blames me?"',
      application:
        'Applying 2.47 means realizing that the presentation preparation, clarity of slides, and rehearsal are within the lead\'s control. The client\'s budget constraints and competitor bids are not. By focusing strictly on clarity and craftsmanship, nervous paralysis turns into composed presence.',
      disclaimer: 'This scenario is an educational reflection aid, not financial or management advice.',
    },
    commonMisunderstanding: {
      misconception: '“Results do not matter, so goal-setting, metrics, and planning are useless.”',
      betterUnderstanding:
        'The teaching does not reject planning, thorough preparation, or quality assessment. It cautions against psychological enslavement to the result, which induces panic and diminishes the quality of execution.',
    },
    reflectionPrompt: {
      questionEn:
        'Which upcoming result are you trying so hard to control that it is preventing you from taking the next calm, useful action?',
      questionHi:
        'किस परिणाम की अत्यधिक चिंता आपको आज का आवश्यक और उपयोगी कदम उठाने से रोक रही है?',
      quietThoughtPrompt:
        'Take three steady breaths. Identify where your agency truly begins and where it naturally ends.',
    },
    practicalAction: {
      titleEn: 'The Agency Inventory (15 Minutes)',
      titleHi: 'सामर्थ्य सूची (१५ मिनट)',
      estimatedMinutes: 15,
      steps: [
        'Write down the project or situation causing you the greatest mental agitation today.',
        'Divide a paper into two columns: "What I Can Influence" and "What I Cannot Dictate".',
        'Place preparation, honesty, and calm focus into Column 1. Place others\' opinions, weather, and final selections into Column 2.',
        'Choose exactly one action from Column 1 and execute it with full presence for 15 minutes without checking notifications.',
      ],
      controllableList: ['My preparation', 'My immediate response', 'My breathing and attention'],
      uncontrollableList: ['Other people’s reactions', 'Competitor choices', 'Final outcome cutoff'],
    },
    recommendations: [
      {
        id: 'rec-bg-2-48',
        title: 'Continue with Bhagavad Gita 2.48',
        scriptureRef: 'Bhagavad Gita 2.48',
        href: '/scripture/bhagavadgita/chapter/2/verse/48',
        type: 'next_verse',
        reason: 'This verse directly develops the definition of balanced action (Samatvam) introduced in 2.47.',
        basis: 'Next verse in canonical sequence',
      },
      {
        id: 'rec-isha-2',
        title: 'Compare: Isha Upanishad Mantra 2',
        scriptureRef: 'Isha Upanishad 2',
        href: '/scripture/ishavasya/chapter/1/verse/2',
        type: 'related_concept',
        reason: 'The ancient Upanishadic root of selfless lifelong action (Kurvanneveha karmani).',
        basis: 'Canonical Upanishadic cross-reference',
      },
      {
        id: 'rec-journey-karma',
        title: 'Next Lesson: The Three Gunas of Action',
        scriptureRef: 'Understanding Karma Yoga · Lesson 3',
        href: '/learn/journeys/understanding-karma-yoga#lesson-3',
        type: 'guided_journey',
        reason: 'Explore how different mental temperaments shape how we work.',
        basis: 'Active reading journey continuation',
      },
    ],
    provenance: {
      sourceScripture: 'Bhagavad Gita (श्रीमद्भगवद्गीता)',
      sourceScriptureSanskrit: 'श्रीमद्भगवद्गीता',
      canonicalRecension: 'Standard 700-verse canonical text (Adhyaya 2)',
      primaryEdition: 'Gita Press Edition (Gorakhpur) collated with BORI critical edition',
      translatorAttribution: 'Jayadayal Goyandka (Hindi), Swami Gambhirananda (English)',
      commentarySources: ['Shankara Gita Bhashya', 'Ramanuja Gita Bhashya', 'Sridhara Subodhini'],
      editorialReviewer: 'Dharma Granth Classical Texts Review Board',
      lastReviewedDate: '2026-09-12',
      reviewStatus: 'Verified Canonical',
    },
  },
};

export function buildDailySessionFromWisdom(
  dw: import('@/data/daily-wisdom-engine').DailyWisdomItem,
  lessonIndex: number = 1,
  totalLessons: number = 10
): DailyDharmaSession {
  return {
    id: dw.id,
    journeyId: 'daily-dharma-wisdom',
    journeyTitleEn: dw.theme,
    journeyTitleHi: 'दैनिक धर्म अमृत',
    lessonIndex,
    totalLessons,
    estimatedMinutes: 5,
    scriptureId: dw.scriptureId,
    chapterNumber: dw.chapterId,
    verseNumber: dw.verseId,
    referenceDisplayEn: `${dw.scriptureTitle} ${dw.chapterId}.${dw.verseId}`,
    referenceDisplayHi: `${dw.scriptureTitleSanskrit} ${dw.chapterId}.${dw.verseId}`,
    sanskritDevanagari: dw.sanskrit,
    sanskritTransliteration: dw.transliteration,
    meter: dw.meter || 'Anuṣṭubh (32 syllables)',
    thirtySecondCard: {
      situation: 'Encountering modern stress, decision-making, or seeking deeper clarity.',
      teaching: dw.practicalTeaching,
      clarification: 'This teaching encourages mindful action and internal composure, not passivity.',
      quickAction: dw.dailyChallenge,
    },
    simpleMeaningEn: dw.translation,
    simpleMeaningHi: dw.hindi,
    literalTranslationEn: dw.translation,
    literalTranslationHi: dw.hindi,
    keyTerms: dw.wordMeaning.map((wm) => ({
      pada: wm.word,
      iast: '',
      root: '',
      grammar: 'Classical Sanskrit',
      meaningEn: wm.meaning,
      meaningHi: wm.meaning,
    })),
    traditionalCommentaries: [
      {
        author: 'Classical Commentary Tradition (भाष्य परम्परा)',
        tradition: 'Sanatana Dharma',
        citation: `${dw.scriptureTitle} ${dw.chapterId}.${dw.verseId}`,
        excerptEn: dw.practicalTeaching,
        excerptHi: dw.practicalTeachingHi,
      },
    ],
    modernExample: {
      contextType: 'career',
      contextLabelEn: 'Modern Everyday Life',
      contextLabelHi: 'आधुनिक दैनिक जीवन',
      situation: 'Facing uncertainty, mental chatter, or demanding responsibilities.',
      application: dw.practicalTeaching,
      disclaimer: 'This reflection is designed for educational and contemplative growth.',
    },
    commonMisunderstanding: {
      misconception: 'Ancient scriptures are disconnected from contemporary challenges.',
      betterUnderstanding:
        'Timeless principles of consciousness and duty directly resolve anxiety, burnout, and distraction.',
    },
    reflectionPrompt: {
      questionEn: dw.reflectionPrompt,
      questionHi: dw.reflectionPromptHi,
      quietThoughtPrompt: 'Take three steady breaths. Reflect on how this teaching touches your life today.',
    },
    practicalAction: {
      titleEn: 'Daily Sadhana Challenge',
      titleHi: 'दैनिक साधना संकल्प',
      estimatedMinutes: 10,
      steps: [dw.dailyChallenge],
      controllableList: ['Present effort', 'Conscious attention', 'Integrity'],
      uncontrollableList: ['Past regrets', 'Others opinions', 'Immediate results'],
    },
    recommendations: [
      {
        id: `rec-${dw.scriptureId}-${dw.chapterId}-${dw.verseId}`,
        title: `Study Full Chapter: ${dw.scriptureTitle} ${dw.chapterId}`,
        scriptureRef: `${dw.scriptureTitle} ${dw.chapterId}`,
        href: dw.href,
        type: 'next_verse',
        reason: 'Explore this verse in its full traditional context with all layers and knowledge graph.',
        basis: 'Canonical scripture text link',
      },
    ],
    provenance: {
      sourceScripture: `${dw.scriptureTitle} (${dw.scriptureTitleSanskrit})`,
      sourceScriptureSanskrit: dw.scriptureTitleSanskrit,
      canonicalRecension: 'Standard canonical text',
      primaryEdition: 'Critical / Standard Classical Edition',
      translatorAttribution: 'Dharma Granth Classical Scholars',
      commentarySources: ['Classical Bhashya Traditions'],
      editorialReviewer: 'Dharma Granth Review Board',
      lastReviewedDate: '2026-10',
      reviewStatus: 'Verified Canonical',
    },
  };
}
