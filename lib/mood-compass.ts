/**
 * Mood Compass (मनोदशा दिशा-सूचक) for the homepage: a few everyday states of
 * mind, each pointing at the reviewed Wisdom-for-Life topics that speak to it.
 *
 * Only the mapping mood → topics lives here. Every verse, its full Sanskrit
 * and its translations come from data/wisdom-for-life.ts as-is (never
 * excerpted), and each card links to the topic page for the full context.
 * Resolved at build time on the server, so the client gets only the cards.
 */

import { getWisdomTopic } from '@/data/wisdom-for-life';

export interface MoodVerse {
  id: string;
  referenceHi: string;
  referenceEn: string;
  sanskrit: string;
  hindi: string;
  english: string;
  href: string;
  topicSlug: string;
  topicHi: string;
  topicEn: string;
}

export interface Mood {
  id: string;
  en: string;
  hi: string;
  verses: MoodVerse[];
}

const MOODS: Array<{ id: string; en: string; hi: string; topics: string[] }> = [
  { id: 'restless', en: 'Restless', hi: 'अशान्त मन', topics: ['stress-and-worry', 'uncertainty'] },
  { id: 'overthinking', en: 'Overthinking', hi: 'अति-चिंतन', topics: ['concentration', 'attachment'] },
  { id: 'torn', en: 'Torn', hi: 'दुविधा', topics: ['duty-and-decision-making'] },
  { id: 'discipline', en: 'Seeking Discipline', hi: 'अनुशासन की खोज', topics: ['discipline', 'self-control'] },
  { id: 'burnout', en: 'Burnout', hi: 'थकान व बोझ', topics: ['skill-in-work', 'detachment'] },
  { id: 'setback', en: 'After a Setback', hi: 'असफलता के बाद', topics: ['failure-and-setbacks'] },
  { id: 'letting-go', en: 'Letting Go', hi: 'छोड़ना सीखना', topics: ['grief-and-loss', 'detachment'] },
  { id: 'curious', en: 'Curious Beginner', hi: 'जिज्ञासु', topics: ['meaning-of-life', 'self-knowledge'] },
];

const MAX_VERSES_PER_MOOD = 3;

const withSlash = (href: string) => (href.endsWith('/') ? href : `${href}/`);

export function getMoodCompass(): Mood[] {
  return MOODS.map(({ id, en, hi, topics }) => {
    const verses: MoodVerse[] = [];
    for (const slug of topics) {
      const topic = getWisdomTopic(slug);
      if (!topic) continue;
      for (const ref of topic.verses) {
        if (verses.length >= MAX_VERSES_PER_MOOD) break;
        if (verses.some((v) => v.id === ref.id)) continue;
        verses.push({
          id: ref.id,
          referenceHi: ref.referenceDisplayHi,
          referenceEn: ref.referenceDisplay,
          sanskrit: ref.sanskritDevanagari,
          hindi: ref.literalTranslationHi,
          english: ref.literalTranslationEn,
          href: withSlash(ref.readerHref),
          topicSlug: topic.slug,
          topicHi: topic.titleHi,
          topicEn: topic.titleEn,
        });
      }
    }
    return { id, en, hi, verses };
  }).filter((m) => m.verses.length > 0);
}
