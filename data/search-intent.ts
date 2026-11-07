/** Search metadata is derived from the same curated intents used by discovery. */
import { LIFE_DISCOVERY_SEO_INTENTS } from './life-discovery-intents';

export interface SearchIntent {
  slug: string;
  titleHi: string;
  /** Used when every verse on the topic is bhagavadgita. */
  gitaTitle: string;
  /** Used when the topic also cites another text. */
  libraryTitle: string;
}

export const SEARCH_INTENTS: SearchIntent[] = LIFE_DISCOVERY_SEO_INTENTS.map((intent) => ({
  slug: intent.slug,
  titleHi: intent.seo!.titleHi,
  gitaTitle: intent.seo!.gitaTitle,
  libraryTitle: intent.seo!.libraryTitle,
}));

export function searchHeading(
  slug: string,
  verses: ReadonlyArray<{ scriptureId: string }>,
): { hi: string; en: string } | null {
  const intent = SEARCH_INTENTS.find((item) => item.slug === slug);
  if (!intent) return null;
  const gitaOnly = verses.length > 0 && verses.every((verse) => verse.scriptureId === 'bhagavadgita');
  return { hi: intent.titleHi, en: gitaOnly ? intent.gitaTitle : intent.libraryTitle };
}
