import type { HiCommentaryEntry } from '@/data/hi-commentary/_types';
import { readChapterCommentary, readSeededChapter, readSeededChapterNumbers } from '@/lib/read-seeded-chapters';
import { cleanVerseField } from '@/lib/verse-format';
import { hasVersePage, VERSE_PAGE_SCRIPTURE_IDS, verseSlug } from '@/lib/verse-paths';
import type { VerseIndexFile, VerseRow } from '@/lib/search-verse-index';

/**
 * Build-time verse index for global search. It covers exactly the verses that
 * have their own page (see hasVersePage in lib/verse-paths), so every hit opens a page
 * that exists, and every excerpt is the library's text: nothing is written by
 * hand here. Server-only; the browser loads the result from /search-index/verses.json.
 */

interface SeedVerse {
  number?: number | string;
  sanskrit?: string;
  transliteration?: string;
  hindi?: string;
  translation?: string;
  explanation?: string;
  commentary?: string;
  hindiSource?: 'ai';
  translationSource?: 'ai';
}

const EXCERPT = 240;

function excerpt(text: string | undefined, max = EXCERPT): string {
  const flat = cleanVerseField(text).replace(/\s+/g, ' ').trim();
  if (flat.length <= max) return flat;
  // Cut at a word boundary so an excerpt never ends mid-word (or mid-conjunct).
  const cut = flat.slice(0, max);
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).trimEnd()}…`;
}

let cached: VerseIndexFile | null = null;

export function buildVerseIndex(): VerseIndexFile {
  if (cached) return cached;
  const scriptures: string[] = [];
  const rows: VerseRow[] = [];

  for (const id of VERSE_PAGE_SCRIPTURE_IDS) {
    const sIdx = scriptures.push(id) - 1;
    for (const chapterId of readSeededChapterNumbers(id)) {
      const seeded = readSeededChapter(id, chapterId);
      if (!seeded) continue;
      const commentary = readChapterCommentary<HiCommentaryEntry>(id, chapterId);
      const seen = new Set<string>();
      for (const verse of seeded.chapter.verses as SeedVerse[]) {
        const slug = verseSlug(verse.number);
        if (!slug || seen.has(slug) || !hasVersePage(id, chapterId, slug)) continue;
        seen.add(slug);

        const comment = commentary?.[`${chapterId}:${slug}`] ?? commentary?.[`${chapterId}:${Number(slug)}`];
        const explanation = comment?.explanation ?? verse.explanation ?? verse.commentary;
        // bit 1: explanation is AI-drafted, bit 2: Hindi is machine-translated, bit 4: English is
        const flags = (comment?.ai ? 1 : 0) | (verse.hindiSource === 'ai' ? 2 : 0) | (verse.translationSource === 'ai' ? 4 : 0);

        rows.push([
          sIdx,
          chapterId,
          slug,
          cleanVerseField(verse.sanskrit),
          cleanVerseField(verse.transliteration).replace(/[\s|।॥0-9.]+$/, ''),
          excerpt(verse.hindi),
          excerpt(verse.translation),
          excerpt(explanation, 260),
          flags,
        ]);
      }
    }
  }

  cached = { v: 1, scriptures, rows };
  return cached;
}
