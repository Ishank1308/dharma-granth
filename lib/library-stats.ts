import { getAllScriptures } from '@/data/scriptures';
import { getSiteShellData } from '@/lib/site-shell-data';

/**
 * The library's headline numbers, from the same published datasets the header counts.
 * `texts` adds the Ashtavakra Gita, which has its own reader outside the seeded catalogue,
 * as the library page does.
 */
export function getLibraryStats() {
  const all = getAllScriptures();
  return {
    texts: all.length + (all.some((s) => s.id === 'ashtavakra') ? 0 : 1),
    verses: getSiteShellData().libraryVerses,
  };
}
