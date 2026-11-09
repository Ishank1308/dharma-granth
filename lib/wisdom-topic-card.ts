import type { WisdomTopic, ScriptureReference, wisdomCategories } from '@/data/wisdom-for-life';

/**
 * What the topic cards and the search read from each topic. The server page passes this slim form, so
 * the browser does not download every topic's full text (the import pulled about 90 KB gzip into the
 * wisdom index page and, through Next's shared chunk lists, into every topic page).
 */
export type WisdomTopicCard = Pick<
  WisdomTopic,
  | 'id' | 'slug' | 'titleEn' | 'titleHi' | 'sanskritSubtitle' | 'category' | 'categoryLabelEn'
  | 'shortDescEn' | 'shortDescHi' | 'colorGradient' | 'searchKeywords' | 'readingTimeMinutes'
> & {
  verses: Pick<ScriptureReference, 'id' | 'referenceDisplay' | 'scriptureName' | 'sanskritDevanagari' | 'literalTranslationEn' | 'literalTranslationHi'>[];
};
export type WisdomCategory = (typeof wisdomCategories)[number];

export function toTopicCard(t: WisdomTopic): WisdomTopicCard {
  return {
    id: t.id, slug: t.slug, titleEn: t.titleEn, titleHi: t.titleHi, sanskritSubtitle: t.sanskritSubtitle,
    category: t.category, categoryLabelEn: t.categoryLabelEn, shortDescEn: t.shortDescEn, shortDescHi: t.shortDescHi,
    colorGradient: t.colorGradient, searchKeywords: t.searchKeywords, readingTimeMinutes: t.readingTimeMinutes,
    verses: t.verses.map((v) => ({
      id: v.id, referenceDisplay: v.referenceDisplay, scriptureName: v.scriptureName,
      sanskritDevanagari: v.sanskritDevanagari, literalTranslationEn: v.literalTranslationEn, literalTranslationHi: v.literalTranslationHi,
    })),
  };
}
