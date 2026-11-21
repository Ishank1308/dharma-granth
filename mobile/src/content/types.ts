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
