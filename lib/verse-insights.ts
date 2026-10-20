/**
 * Per-verse editorial insights for the reader: the मर्म ("core shift")
 * one-liner and the जीवन प्रसंग (life-situation) chips.
 *
 * Both come from content that already exists and is reviewed elsewhere on
 * the site; nothing here is generated:
 *   - मर्म = the one-sentence `teaching` of an *approved* modern-scenario set
 *     (data/modern-scenarios.ts). Drafts are never shown.
 *   - situations = the Wisdom-for-Life topics that cite this verse
 *     (data/wisdom-for-life.ts), linking to the topic page.
 *
 * Server-only: the chapter page resolves the few entries for its verses and
 * passes them down, so the wisdom data never ships in the reader bundle.
 */

import { MODERN_SCENARIOS } from '@/data/modern-scenarios';
import { getAllWisdomTopics } from '@/data/wisdom-for-life';

export interface VerseSituation {
  slug: string;
  en: string;
  hi: string;
}

export interface VerseInsight {
  marma?: string;
  situations: VerseSituation[];
}

const key = (scriptureId: string, chapter: number | string, verse: number | string) =>
  `${scriptureId}:${chapter}:${verse}`;

let index: Map<string, VerseInsight> | null = null;

function buildIndex(): Map<string, VerseInsight> {
  const map = new Map<string, VerseInsight>();
  const entry = (k: string) => {
    let e = map.get(k);
    if (!e) {
      e = { situations: [] };
      map.set(k, e);
    }
    return e;
  };

  for (const set of MODERN_SCENARIOS) {
    if (set.review !== 'approved') continue;
    entry(key(set.scriptureId, set.chapter, set.verse)).marma = set.teaching;
  }

  for (const topic of getAllWisdomTopics()) {
    for (const ref of topic.verses) {
      // Library numbering, which is what the reader's chapter/verse ids use.
      const chapter = ref.libraryRef?.chapter ?? ref.chapterNumber;
      const verse = ref.libraryRef?.verse ?? ref.verseNumber;
      const e = entry(key(ref.scriptureId, chapter, verse));
      if (!e.situations.some((s) => s.slug === topic.slug)) {
        e.situations.push({ slug: topic.slug, en: topic.titleEn, hi: topic.titleHi });
      }
    }
  }
  return map;
}

export function getVerseInsight(
  scriptureId: string,
  chapter: number | string,
  verse: number | string,
): VerseInsight | undefined {
  index ??= buildIndex();
  return index.get(key(scriptureId, chapter, verse));
}

/** Insights for one chapter's verses, keyed by verse number; undefined when none apply. */
export function getChapterInsights(
  scriptureId: string,
  chapter: number,
  verseNumbers: Array<number | string>,
): Record<string, VerseInsight> | undefined {
  const out: Record<string, VerseInsight> = {};
  for (const n of verseNumbers) {
    const insight = getVerseInsight(scriptureId, chapter, n);
    if (insight) out[String(n)] = insight;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}
