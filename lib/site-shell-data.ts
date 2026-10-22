import { getLibraryCounts, getRealVerseCount } from '@/data/scriptures';
import { publishedTotals } from '@/lib/ashtavakra';

/** All shared header counters are derived once from the same published datasets. */
export function getSiteShellData() {
  const ashtavakra = publishedTotals();
  return {
    libraryVerses: getRealVerseCount() + ashtavakra.verses,
    gita: getLibraryCounts('bhagavadgita'),
    ashtavakra,
  };
}
