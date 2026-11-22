import { S, type Msg } from '@/i18n/strings';

/**
 * A place in a bundled book, as the reader's route takes it (verse is the verse's own number). Without a
 * chapter it opens the book's contents.
 */
export interface Passage {
  id: string;
  chapter?: number;
  verse?: string;
}

/** The featured passage at the top of Home: the same verse the website's hero features (Gita 2.47). */
export const FEATURED: Passage = { id: 'bhagavadgita', chapter: 2, verse: '47' };

/** Books on Home's shelf, in this order. Only bundled books, so every tile opens without a download. */
export const SHELF = ['bhagavadgita', 'ramcharitmanas', 'katha', 'ishavasya', 'yogasutra', 'durgasaptashati', 'vivekchudamani', 'mundaka'];

export interface Saying extends Passage {
  chapter: number;
  sa: string;
  gloss: Msg;
  cite: Msg;
}

/**
 * The Upanishadic sayings from the website's home page (app/components/home/WisdomTicker.tsx), each linked
 * to its passage in the bundled book. Every one is a whole sentence of prose, not part of a metrical verse,
 * so nothing here cuts a shloka short; the full passage and its printed translation are one tap away.
 * The English glosses are the website's; the Hindi glosses are plain renderings of the same sentence.
 */
export const SAYINGS: Saying[] = [
  { sa: 'प्रज्ञानं ब्रह्म', gloss: { en: 'Consciousness is Brahman', hi: 'चेतना ही ब्रह्म है' }, cite: { en: 'Aitareya 3.3', hi: 'ऐतरेय 3.3' }, id: 'aitareya', chapter: 5, verse: '3' },
  { sa: 'अहं ब्रह्मास्मि', gloss: { en: 'I am Brahman', hi: 'मैं ब्रह्म हूँ' }, cite: { en: 'Brihadaranyaka 1.4.10', hi: 'बृहदारण्यक 1.4.10' }, id: 'brihadaranyaka', chapter: 4, verse: '1.4.10' },
  { sa: 'तत्त्वमसि', gloss: { en: 'Thou art That', hi: 'वह तुम ही हो' }, cite: { en: 'Chandogya 6.8.7', hi: 'छान्दोग्य 6.8.7' }, id: 'chandogya', chapter: 105, verse: '6.8.7' },
  { sa: 'अयमात्मा ब्रह्म', gloss: { en: 'This Self is Brahman', hi: 'यह आत्मा ब्रह्म है' }, cite: { en: 'Mandukya 2', hi: 'माण्डूक्य 2' }, id: 'mandukya', chapter: 1, verse: '2' },
  { sa: 'सर्वं खल्विदं ब्रह्म', gloss: { en: 'All this is Brahman', hi: 'यह सब कुछ ब्रह्म ही है' }, cite: { en: 'Chandogya 3.14.1', hi: 'छान्दोग्य 3.14.1' }, id: 'chandogya', chapter: 51, verse: '3.14.1' },
  { sa: 'सत्यं वद । धर्मं चर ।', gloss: { en: 'Speak the truth. Walk in dharma.', hi: 'सत्य बोलो, धर्म पर चलो।' }, cite: { en: 'Taittiriya 1.11', hi: 'तैत्तिरीय 1.11' }, id: 'taittiriya', chapter: 1, verse: '11' },
  {
    sa: 'असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मामृतं गमय ।',
    gloss: {
      en: 'Lead me from the unreal to the real, from darkness to light, from death to immortality.',
      hi: 'असत्य से सत्य की ओर, अंधकार से प्रकाश की ओर, मृत्यु से अमरता की ओर ले चलो।',
    },
    cite: { en: 'Brihadaranyaka 1.3.28', hi: 'बृहदारण्यक 1.3.28' },
    id: 'brihadaranyaka',
    chapter: 3,
    verse: '1.3.28',
  },
  { sa: 'आनन्दो ब्रह्मेति व्यजानात्', gloss: { en: 'He knew that bliss is Brahman', hi: 'उसने जाना कि आनन्द ही ब्रह्म है' }, cite: { en: 'Taittiriya 3.6', hi: 'तैत्तिरीय 3.6' }, id: 'taittiriya', chapter: 3, verse: '6' },
];

export interface Guide {
  icon: 'leaf-outline' | 'scale-outline' | 'flower-outline' | 'sparkles-outline' | 'sunny-outline' | 'flame-outline' | 'musical-notes-outline' | 'body-outline';
  label: Msg;
  /** A passage in a bundled book, or an app route such as a Wisdom for life topic. */
  to: Passage | string;
}

/**
 * "Find your way in", after the website's home guides (HomeInquiryChips.tsx). The life questions open the
 * same Wisdom for life topics as on the website (src/app/wisdom), which lead into their verses.
 */
export const LIFE_GUIDES: Guide[] = [
  { icon: 'leaf-outline', label: S.homeTopicWorry, to: '/wisdom/stress-and-worry' },
  { icon: 'scale-outline', label: S.homeTopicDuty, to: '/wisdom/duty-and-decision-making' },
  { icon: 'flower-outline', label: S.homeTopicGrief, to: '/wisdom/grief-and-loss' },
  { icon: 'sparkles-outline', label: S.homeTopicSelf, to: '/wisdom/self-knowledge' },
];

/** Wisdom for life topics shown as tiles on Home, by the website's slugs. Missing ids are skipped. */
export const WISDOM_PICKS = ['fear-and-courage', 'anger', 'discipline', 'relationships', 'concentration', 'devotion'];

export const PRACTICE_GUIDES: Guide[] = [
  { icon: 'sunny-outline', label: S.homeTopicNitya, to: { id: 'nityakarmakriya', chapter: 1 } },
  { icon: 'flame-outline', label: S.homeTopicDevi, to: { id: 'durgasaptashati' } },
  { icon: 'musical-notes-outline', label: S.homeTopicVinaya, to: { id: 'vinayapatrika' } },
  { icon: 'body-outline', label: S.homeTopicYoga, to: { id: 'yogasutra', chapter: 1, verse: '2' } },
];
