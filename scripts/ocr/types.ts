/** Checkpoint types for the granth OCR pipeline. Import maps these onto the live shard fields. */

export type TextRoute = 'unicode' | 'legacy-font' | 'image';
export type OcrConfidence = 'ok' | 'needs_review';

export interface OcrCorrection {
  from: string;
  to: string;
  reason: string;
}

export interface OcrVerse {
  verse_number_raw: string;
  chapter: number | null;
  verse: number | null;
  /** Text as read, before the one mechanical i-matra reorder. */
  sanskrit_raw: string;
  sanskrit_devanagari: string;
  sanskrit_iast: string;
  padaccheda: string;
  word_meanings: string;
  bhashya_hi: string;
  english: string;
  ocr_confidence: OcrConfidence;
  flags: string[];
  corrections: OcrCorrection[];
  continues_from_previous_page?: boolean;
}

export interface OcrPage {
  source_pdf: string;
  pdf_page: number;
  text_route: TextRoute;
  adhyaya_or_khanda: { number: number | null; title: string } | null;
  raw_text: string;
  mean_confidence: number | null;
  trailing_fragment: string;
  verses: OcrVerse[];
}

/** Live scriptures-full verse. Matches the fields the reader already stores. */
export interface LibraryVerse {
  number: number;
  sanskrit: string;
  transliteration: string;
  translation: string;
  hindi: string;
  commentary: string;
  wordMeaning: string;
}
