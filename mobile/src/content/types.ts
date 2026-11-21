export interface Verse {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  hindi?: string;
  hindiSource?: string;
  hindiRange?: string;
  hindiSeeVerse?: number | string;
  hindiReviewRequired?: boolean;
  translation?: string;
  translationSource?: string;
  translationRange?: string;
  translationSeeVerse?: number | string;
  wordMeaning?: string;
  commentary?: string;
  explanation?: string;
}

export interface BookChapter {
  number: number;
  verses: Verse[];
}

export interface Book {
  id: string;
  chapters: BookChapter[];
}

export interface CatalogChapter {
  number: number;
  title: string;
  titleSanskrit?: string;
  verseCount: number;
}

export interface CatalogEntry {
  id: string;
  title: string;
  titleSanskrit?: string;
  category: string;
  totalVerses: number;
  /** True when the verse text ships inside the app; otherwise the reader opens dharmagranth.dev. */
  bundled: boolean;
  chapters: CatalogChapter[];
}

/** One bundled book's verse search corpus (scripts/build-search-index.mjs). One line per verse. */
export interface SearchCorpus {
  /** Sanskrit | Hindi in the one-byte index alphabet (src/lib/verse-search.ts). */
  d: string;
  /** Transliteration, folded for matching. */
  t: string;
  /** English translation, ASCII. */
  e: string;
  /** [chapter number, verse count] in reading order. */
  c: [number, number][];
  /** Verse numbers, newline separated. */
  n: string;
}
