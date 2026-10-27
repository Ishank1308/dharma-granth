import { readSeededChapter, readSeededChapterNumbers } from '@/lib/read-seeded-chapters';
import { VERSE_PAGE_SCRIPTURE_IDS, hasVersePage, verseSlug } from '@/lib/verse-paths';

// Build time only: reads the scripture files. Client components import the
// URL helpers from lib/verse-paths instead.
export { hasVersePages, versePageHref, verseSlug, VERSE_PAGE_SCRIPTURE_IDS } from '@/lib/verse-paths';

export interface VerseStaticParam {
  id: string;
  chapterId: string;
  verseId: string;
}

/** Every verse URL this build will emit. */
export function verseStaticParams(): VerseStaticParam[] {
  const params: VerseStaticParam[] = [];
  for (const id of VERSE_PAGE_SCRIPTURE_IDS) {
    for (const chapterId of readSeededChapterNumbers(id)) {
      const seeded = readSeededChapter(id, chapterId);
      if (!seeded) continue;
      const seen = new Set<string>();
      for (const verse of seeded.chapter.verses as Array<{ number?: number | string }>) {
        const slug = verseSlug(verse.number);
        if (!slug || seen.has(slug) || !hasVersePage(id, chapterId, slug)) continue;
        seen.add(slug);
        params.push({ id, chapterId: String(chapterId), verseId: slug });
      }
    }
  }
  return params;
}
