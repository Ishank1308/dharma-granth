/**
 * Discover Your Path / अपना अध्ययन मार्ग खोजें
 *
 * Epistemic & Pedagogical Commitments:
 * - Help beginners find a suitable starting point without requiring them
 *   to understand scripture categories, philosophical schools, or Sanskrit terms.
 * - Do not classify the user spiritually.
 * - Do not assign a religious identity.
 * - Do not claim to determine the user's "true spiritual path".
 * - All recommendations are explainable and non-deterministic:
 *   "This may be a helpful place to begin."
 */

export type Interest =
  | 'practical'
  | 'devotion'
  | 'self_knowledge'
  | 'meditation'
  | 'stories'
  | 'sanskrit'
  | 'practice';

export type Challenge =
  | 'duty'
  | 'uncertainty'
  | 'focus'
  | 'relationships'
  | 'courage'
  | 'self'
  | 'god';

export type Familiarity = 'new' | 'some' | 'regular' | 'deep';
export type TimePref = '5' | '10' | '20' | 'deep';
export type FormatPref = 'reading' | 'audio' | 'visual' | 'mixed';

export interface DiscoverAnswers {
  interest: Interest;
  challenge: Challenge;
  familiarity: Familiarity;
  time: TimePref;
  format: FormatPref;
}

// Backwards compatibility alias
export type JourneyAnswers = DiscoverAnswers;

export interface PathRecommendation {
  category: 'Primary Reading Journey' | 'Scripture' | 'Introductory Concept' | 'Daily Practice' | 'Alternative Path';
  categoryHi: string;
  id: string;
  title: string;
  titleHi: string;
  summary: string;
  href: string;
  reason: string;
}

export interface RecommendationSuite {
  primaryJourney: PathRecommendation;
  scripture: PathRecommendation;
  concept: PathRecommendation;
  dailyPractice: PathRecommendation;
  alternativePath: PathRecommendation;
  explanationSummary: string;
}

export const JOURNEY_KEY = 'dharma.journey.v1';

export interface JourneyPath {
  id: string;
  title: string;
  titleHi: string;
  summary: string;
  minutes: string;
  href: string;
  steps: Array<{ label: string; href: string }>;
  note?: string;
}

export const PATHS: Record<string, JourneyPath> = {
  gitaBeginners: {
    id: 'gita-beginners',
    title: 'Bhagavad Gita for Beginners',
    titleHi: 'गीता: आरंभिक पाठ',
    summary: 'A guided course through the Gita’s main ideas, with one verse explained step by step.',
    minutes: '10 min a day',
    href: '/learn/journeys/bhagavad-gita-for-beginners',
    steps: [
      { label: 'Chapter 1: The Human Dilemma', href: '/scripture/bhagavadgita/chapter/1' },
      { label: 'Chapter 2: Equanimity in Action', href: '/scripture/bhagavadgita/chapter/2' },
      { label: 'Study Gita 2.47 in Simple mode', href: '/scripture/bhagavadgita/chapter/2/verse/47' },
    ],
  },
  dailyWisdom: {
    id: 'daily-wisdom',
    title: 'Five-Minute Daily Wisdom',
    titleHi: 'पाँच मिनट का दैनिक चिंतन',
    summary: 'One verse, one reflection, one quiet moment each day.',
    minutes: '5 min a day',
    href: '/daily',
    steps: [
      { label: 'Daily verse session', href: '/daily' },
      { label: 'Wisdom for life situations', href: '/wisdom-for-life' },
    ],
  },
  upanishads: {
    id: 'upanishads',
    title: 'Understanding the Upanishads',
    titleHi: 'उपनिषद् परिचय',
    summary: 'The central ideas of the Upanishads, one lesson at a time.',
    minutes: '15–20 min a session',
    href: '/learn/journeys/understanding-the-self',
    steps: [
      { label: 'Isha Upanishad Mantra 1', href: '/scripture/ishavasya/chapter/1/verse/1' },
      { label: 'Concepts: Atman and Brahman', href: '/concepts/atman' },
    ],
  },
  bhakti: {
    id: 'bhakti',
    title: 'Introduction to Bhakti',
    titleHi: 'भक्ति परिचय',
    summary: 'The devotional traditions and what they teach.',
    minutes: '10–15 min a session',
    href: '/learn/journeys/introduction-to-bhakti',
    steps: [
      { label: 'Bhakti traditions course', href: '/learn/journeys/introduction-to-bhakti' },
      { label: 'Wisdom: Devotion', href: '/wisdom-for-life/devotion' },
    ],
  },
  sanskrit: {
    id: 'sanskrit',
    title: 'Sanskrit Through Verses',
    titleHi: 'श्लोकों से संस्कृत',
    summary: 'Learn key Sanskrit words from verses, using word meanings and sandhi splits.',
    minutes: '10 min a session',
    href: '/learn/journeys/sanskrit-through-verses',
    steps: [
      { label: 'Dictionary of key terms', href: '/dictionary' },
      { label: 'Word meanings in Gita 2.47', href: '/scripture/bhagavadgita/chapter/2/verse/47' },
    ],
  },
  focus: {
    id: 'focus',
    title: 'Seven Days of Focus',
    titleHi: 'एकाग्रता के सात दिन',
    summary: 'Seven verses from the Gita on cultivating a steady, gathered mind.',
    minutes: '7 min a day',
    href: '/learn/journeys/seven-days-of-focus',
    steps: [
      { label: 'Day 1: A Resolved Intellect (BG 2.41)', href: '/learn/journeys/seven-days-of-focus' },
      { label: 'Wisdom: Focus', href: '/wisdom-for-life/focus' },
    ],
  },
};

const INTEREST_LABELS: Record<Interest, string> = {
  practical: 'practical wisdom',
  devotion: 'devotion and surrender',
  self_knowledge: 'self-knowledge',
  meditation: 'meditation and stillness',
  stories: 'stories and characters',
  sanskrit: 'learning Sanskrit',
  practice: 'daily practice',
};

const FAMILIARITY_LABELS: Record<Familiarity, string> = {
  new: 'are a new reader',
  some: 'have some familiarity',
  regular: 'are a regular reader',
  deep: 'engage in deep study',
};

const TIME_LABELS: Record<TimePref, string> = {
  '5': 'prefer 5-minute sessions',
  '10': 'prefer 10-minute lessons',
  '20': 'prefer 20-minute readings',
  deep: 'prefer longer deep study',
};

/**
 * Builds an explainable 5-part recommendation suite from user answers.
 */
export function buildRecommendations(a: DiscoverAnswers): RecommendationSuite {
  const reasonPrefix = `Recommended because you selected ${INTEREST_LABELS[a.interest] || 'practical wisdom'}, ${FAMILIARITY_LABELS[a.familiarity] || 'are a new reader'}, and ${TIME_LABELS[a.time] || 'prefer short lessons'}.`;

  // 1. Primary Reading Journey
  let primaryJourney: PathRecommendation;
  if (a.interest === 'sanskrit') {
    primaryJourney = {
      category: 'Primary Reading Journey',
      categoryHi: 'मुख्य अध्ययन यात्रा',
      id: 'sanskrit-journey',
      title: 'Sanskrit Through Verses',
      titleHi: 'श्लोकों से संस्कृत',
      summary: 'Learn root words, sandhi divisions, and declensions from foundational verses.',
      href: '/learn/journeys/sanskrit-through-verses',
      reason: reasonPrefix,
    };
  } else if (a.interest === 'devotion' || a.challenge === 'god') {
    primaryJourney = {
      category: 'Primary Reading Journey',
      categoryHi: 'मुख्य अध्ययन यात्रा',
      id: 'bhakti-journey',
      title: 'Introduction to Bhakti',
      titleHi: 'भक्ति का स्वरूप',
      summary: 'Explore verses on surrender, divine presence, and compassionate living.',
      href: '/learn/journeys/introduction-to-bhakti',
      reason: reasonPrefix,
    };
  } else if (a.interest === 'self_knowledge' || a.challenge === 'self') {
    primaryJourney = {
      category: 'Primary Reading Journey',
      categoryHi: 'मुख्य अध्ययन यात्रा',
      id: 'self-journey',
      title: 'Understanding the Self (Atman)',
      titleHi: 'आत्म-बोध यात्रा',
      summary: 'A guided pathway into the Upanishadic teachings on consciousness and the witness self.',
      href: '/learn/journeys/understanding-the-self',
      reason: reasonPrefix,
    };
  } else if (a.challenge === 'focus' || a.interest === 'meditation') {
    primaryJourney = {
      category: 'Primary Reading Journey',
      categoryHi: 'मुख्य अध्ययन यात्रा',
      id: 'focus-journey',
      title: 'Seven Days of Focus',
      titleHi: 'एकाग्रता के सात दिन',
      summary: 'Seven verses from the Gita on training attention and releasing mental scattering.',
      href: '/learn/journeys/seven-days-of-focus',
      reason: reasonPrefix,
    };
  } else {
    primaryJourney = {
      category: 'Primary Reading Journey',
      categoryHi: 'मुख्य अध्ययन यात्रा',
      id: 'gita-beginners',
      title: 'Bhagavad Gita for Beginners',
      titleHi: 'गीता: आरंभिक पाठ',
      summary: '18 serene steps exploring life, purpose, duty, and inner equanimity.',
      href: '/learn/journeys/bhagavad-gita-for-beginners',
      reason: reasonPrefix,
    };
  }

  // 2. Recommended Scripture
  let scripture: PathRecommendation;
  if (a.interest === 'self_knowledge' || a.familiarity === 'deep') {
    scripture = {
      category: 'Scripture',
      categoryHi: 'प्रारंभिक शास्त्र',
      id: 'isha-scripture',
      title: 'Isha Upanishad (ईशावास्योपनिषद्)',
      titleHi: 'ईशावास्योपनिषद्',
      summary: '18 essential mantras reconciling active worldly duty with contemplative stillness.',
      href: '/scripture/ishavasya',
      reason: `Connects with your interest in ${INTEREST_LABELS[a.interest]}.`,
    };
  } else if (a.interest === 'stories') {
    scripture = {
      category: 'Scripture',
      categoryHi: 'प्रारंभिक शास्त्र',
      id: 'ramayana-scripture',
      title: 'Valmiki Ramayana (वाल्मीकि रामायण)',
      titleHi: 'वाल्मीकि रामायण',
      summary: 'Epic narrative depicting noble character, ethical dilemmas, and selfless relationships.',
      href: '/scripture/ramayana',
      reason: 'Ideal narrative entry point featuring noble characters and philosophical dialogues.',
    };
  } else {
    scripture = {
      category: 'Scripture',
      categoryHi: 'प्रारंभिक शास्त्र',
      id: 'gita-scripture',
      title: 'Bhagavad Gita (श्रीमद्भगवद्गीता)',
      titleHi: 'श्रीमद्भगवद्गीता',
      summary: '700 canonical verses offering direct wisdom for duty, action, and peace of mind.',
      href: '/scripture/bhagavadgita',
      reason: 'Universal philosophical starting point addressing human crisis directly in dialogue.',
    };
  }

  // 3. Introductory Concept
  let concept: PathRecommendation;
  if (a.challenge === 'duty') {
    concept = {
      category: 'Introductory Concept',
      categoryHi: 'प्रारंभिक अवधारणा',
      id: 'concept-dharma',
      title: 'Dharma (धर्म · Order & Right Action)',
      titleHi: 'धर्म — कर्तव्य और व्यवस्था',
      summary: 'The cosmic and personal harmony upheld through righteous living and duty.',
      href: '/concepts/dharma',
      reason: 'Directly addresses your interest in understanding duty and life choices.',
    };
  } else if (a.challenge === 'uncertainty') {
    concept = {
      category: 'Introductory Concept',
      categoryHi: 'प्रारंभिक अवधारणा',
      id: 'concept-samatvam',
      title: 'Samatvam (समत्वम् · Equanimity)',
      titleHi: 'समत्वम् — चित्त की स्थिरता',
      summary: 'The art of maintaining balanced composure in success and adversity.',
      href: '/concepts/samatvam',
      reason: 'Provides foundational resilience when dealing with uncertain outcomes.',
    };
  } else if (a.interest === 'devotion' || a.challenge === 'god') {
    concept = {
      category: 'Introductory Concept',
      categoryHi: 'प्रारंभिक अवधारणा',
      id: 'concept-bhakti',
      title: 'Bhakti (भक्ति · Loving Surrender)',
      titleHi: 'भक्ति — समर्पण और प्रेम',
      summary: 'Devotional surrender that dissolves anxiety and ego-centered isolation.',
      href: '/concepts/bhakti',
      reason: 'Explores the philosophy of divine relationship and surrendered action.',
    };
  } else {
    concept = {
      category: 'Introductory Concept',
      categoryHi: 'प्रारंभिक अवधारणा',
      id: 'concept-karma-yoga',
      title: 'Karma Yoga (कर्मयोग · Detached Action)',
      titleHi: 'कर्मयोग — अनासक्त कर्म',
      summary: 'The wisdom of pouring total presence into action while relinquishing anxiety over results.',
      href: '/concepts/karma/',
      reason: 'The bedrock teaching of Bhagavad Gita Chapter 2 on purposeful living.',
    };
  }

  // 4. Daily Practice
  let dailyPractice: PathRecommendation;
  if (a.time === '5') {
    dailyPractice = {
      category: 'Daily Practice',
      categoryHi: 'दैनिक साधना',
      id: 'daily-five-minute',
      title: 'Five-Minute Daily Contemplation',
      titleHi: 'पाँच मिनट का दैनिक चिंतन',
      summary: 'One reviewed verse, pronunciation audio, and a 30-second modern reflection.',
      href: '/daily',
      reason: 'Fits naturally into a 5-minute morning or evening pause.',
    };
  } else if (a.interest === 'meditation') {
    dailyPractice = {
      category: 'Daily Practice',
      categoryHi: 'दैनिक साधना',
      id: 'daily-meditation',
      title: 'Quiet Meditation & Breath Timer',
      titleHi: 'ध्यान व श्वास साधना',
      summary: 'Gentle bell timer with tanpura acoustics and verse contemplation.',
      href: '/practice',
      reason: 'Designed for silent meditation without timers or commercial notifications.',
    };
  } else {
    dailyPractice = {
      category: 'Daily Practice',
      categoryHi: 'दैनिक साधना',
      id: 'daily-reflection',
      title: 'Evening Reflection & Gratitude',
      titleHi: 'सांध्य चिंतन व कृतज्ञता',
      summary: 'A private local journal to review your actions, intentions, and peaceful moments.',
      href: '/practice',
      reason: 'Supports steady, private reflection without streak pressure.',
    };
  }

  // 5. Alternative Path
  let alternativePath: PathRecommendation;
  if (primaryJourney.id === 'gita-beginners') {
    alternativePath = {
      category: 'Alternative Path',
      categoryHi: 'वैकल्पिक मार्ग',
      id: 'alt-wisdom-for-life',
      title: 'Wisdom for Life Situations',
      titleHi: 'जीवन की परिस्थितियों के लिए मार्गदर्शन',
      summary: 'Explore 13 thematic topics (Fear, Anger, Focus, Grief) with verified scriptural context.',
      href: '/wisdom-for-life',
      reason: 'A situation-first alternative if you prefer topical exploration over systematic chapter study.',
    };
  } else {
    alternativePath = {
      category: 'Alternative Path',
      categoryHi: 'वैकल्पिक मार्ग',
      id: 'alt-gita',
      title: 'Bhagavad Gita for Beginners',
      titleHi: 'गीता: आरंभिक पाठ',
      summary: 'A step-by-step introduction to the core philosophical dialogues of the Gita.',
      href: '/learn/journeys/bhagavad-gita-for-beginners',
      reason: 'A systematic foundational path if you wish to study the root philosophical text directly.',
    };
  }

  return {
    primaryJourney,
    scripture,
    concept,
    dailyPractice,
    alternativePath,
    explanationSummary: reasonPrefix,
  };
}

// Backwards compatibility for older recommend() call
export function recommend(a: DiscoverAnswers): JourneyPath[] {
  const suite = buildRecommendations(a);
  return [
    PATHS.gitaBeginners,
    PATHS.dailyWisdom,
    PATHS.upanishads,
  ];
}
