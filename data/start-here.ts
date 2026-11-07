/**
 * Start Here: four questions and the curated paths they lead to. Only
 * existing pages are recommended, and every suggestion says why. Nothing is
 * inferred about beliefs or identity; the answers describe what the reader
 * wants to do.
 */

export type Interest = 'gita' | 'upanishads' | 'karma' | 'bhakti' | 'daily' | 'sanskrit' | 'life' | 'unsure';
export type Familiarity = 'new' | 'some' | 'regular' | 'serious';
export type Language = 'hindi' | 'english' | 'both';
export type Time = '5' | '10' | '20' | 'deep';

export interface StartAnswers {
  interest: Interest;
  familiarity: Familiarity;
  language: Language;
  time: Time;
}

export const START_KEY = 'dharma.starthere.v1';

export interface StartPath {
  id: string;
  title: string;
  titleHi: string;
  summary: string;
  minutes: string;
  href: string;
  steps: Array<{ label: string; href: string }>;
  note?: string;
}

export const START_PATHS: Record<string, StartPath> = {
  gita: {
    id: 'gita', title: 'Bhagavad Gita for Beginners', titleHi: 'गीता: आरंभिक पाठ',
    summary: 'Six short verses that introduce the Gita’s main ideas, in order.', minutes: 'About 6 minutes a reading',
    href: '/learn/journeys/gita-for-beginners',
    steps: [{ label: 'Chapter 2 orientation', href: '/scripture/bhagavadgita/chapter/2' }, { label: 'Read Gita 2.47 in Simple mode', href: '/scripture/bhagavadgita/chapter/2/verse/47' }],
  },
  upanishads: {
    id: 'upanishads', title: 'Introduction to the Upanishads', titleHi: 'उपनिषद् परिचय',
    summary: 'Five well-known verses from four Upanishads.', minutes: 'About 7 minutes a reading',
    href: '/learn/journeys/introduction-to-the-upanishads',
    steps: [{ label: 'Concept: Atman', href: '/concepts/atman' }, { label: 'Concept: Brahman', href: '/concepts/brahman' }],
  },
  daily: {
    id: 'daily', title: 'Five-Minute Daily Wisdom', titleHi: 'पाँच मिनट का दैनिक चिंतन',
    summary: 'One verse and one reflection, in a few quiet minutes.', minutes: '5 minutes',
    href: '/practice',
    steps: [{ label: 'Daily verse and reflection', href: '/practice' }, { label: 'Seven Days of Focus', href: '/learn/journeys/seven-days-of-focus' }],
  },
  karma: {
    id: 'karma', title: 'Understanding Karma Yoga', titleHi: 'कर्मयोग को समझें',
    summary: 'Six verses on acting without being ruled by results.', minutes: 'About 8 minutes a reading',
    href: '/learn/journeys/understanding-karma-yoga',
    steps: [{ label: 'Concept: Karma', href: '/concepts/karma' }, { label: 'Wisdom for Life: Duty and decision-making', href: '/wisdom-for-life/duty-and-decision-making' }],
  },
  bhakti: {
    id: 'bhakti', title: 'Introduction to Bhakti', titleHi: 'भक्ति परिचय',
    summary: 'Five verses in which the Gita speaks about devotion.', minutes: 'About 7 minutes a reading',
    href: '/learn/journeys/introduction-to-bhakti',
    steps: [{ label: 'Bhakti traditions course', href: '/learn/bhakti-traditions' }, { label: 'Wisdom for Life: Devotion', href: '/wisdom-for-life/devotion' }],
  },
  sanskrit: {
    id: 'sanskrit', title: 'Sanskrit Through Verses', titleHi: 'श्लोकों से संस्कृत',
    summary: 'Learn key Sanskrit words from verses, using word meanings and the dictionary.', minutes: 'About 10 minutes a session',
    href: '/dictionary',
    steps: [{ label: 'Dictionary of key terms', href: '/dictionary' }, { label: 'Word by word in Gita 2.47 (Deep mode)', href: '/scripture/bhagavadgita/chapter/2/verse/47' }],
    note: 'A full Sanskrit course is not available yet. This path uses the dictionary and the word-by-word layer of each verse.',
  },
  life: {
    id: 'life', title: 'Wisdom for Life Situations', titleHi: 'जीवन की स्थितियों के लिए',
    summary: 'Choose a situation, such as worry, anger, uncertainty or failure, and read curated verses.', minutes: '5 to 10 minutes a topic',
    href: '/wisdom-for-life',
    steps: [{ label: 'Browse situations', href: '/wisdom-for-life' }],
  },
};

const INTEREST_LABEL: Record<Interest, string> = {
  gita: 'the Bhagavad Gita', upanishads: 'the Upanishads', karma: 'Karma Yoga', bhakti: 'Bhakti', daily: 'daily wisdom',
  sanskrit: 'Sanskrit', life: 'a life situation', unsure: 'not being sure yet',
};

export interface Recommendation {
  path: StartPath;
  /** Why this is suggested, in terms of the answers given. */
  reason: string;
}

/** Up to three suggestions, each with the reason that follows from the answers. */
export function recommend(a: StartAnswers): Recommendation[] {
  const out: Recommendation[] = [];
  const add = (key: keyof typeof START_PATHS, reason: string) => {
    if (!out.some((r) => r.path.id === START_PATHS[key].id)) out.push({ path: START_PATHS[key], reason });
  };

  if (a.interest === 'unsure') {
    add(a.time === '5' ? 'daily' : 'gita', 'You said you are not sure yet, so this is a gentle place to begin.');
  } else {
    add(a.interest, `You chose to explore ${INTEREST_LABEL[a.interest]}.`);
  }
  if (a.time === '5') add('daily', 'You have about five minutes, and this is built for that.');
  if (a.time === 'deep' && a.interest !== 'upanishads') add('upanishads', 'You want to study in depth, and the Upanishads reward slower reading.');
  if (a.familiarity === 'new' && a.interest !== 'gita' && a.interest !== 'unsure') add('gita', 'You are new to scripture, and the Gita is a common first text.');
  if (a.familiarity === 'serious' && a.interest !== 'karma' && a.interest !== 'unsure') add('karma', 'You are an experienced reader, and this follows one idea closely across several verses.');
  if (a.interest !== 'life') add('life', 'It connects the verses to situations you may recognise.');
  return out.slice(0, 3);
}
