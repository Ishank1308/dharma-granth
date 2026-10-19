/**
 * Grantha Verse Parser & Cross-Page Fragment Stitcher
 * Separates Sanskrit Mula, Hindi Bhashya/Anuvada, Padaccheda, and English translations.
 */
import Sanscript from '@indic-transliteration/sanscript';

export interface ExtractedVerse {
  chapter: number;
  number: number;
  sanskrit: string;
  transliteration: string;
  hindi?: string;
  translation?: string;
  wordMeaning?: string;
  commentary?: string;
  sourcePage: number;
  confidence: 'high' | 'medium' | 'needs_review';
  warnings?: string[];
}

export interface ExtractedChapter {
  number: number;
  title: string;
  titleSanskrit?: string;
  verses: ExtractedVerse[];
}

export interface PageExtractionResult {
  pageNumber: number;
  chapterTitle?: string;
  chapterNumber?: number;
  verses: ExtractedVerse[];
  unresolvedTrailingVerse?: {
    chapter: number;
    number?: number;
    lines: string[];
    sourcePage: number;
  };
  rawText: string;
}

const DEVANAGARI_DIGITS = '०१२३४५६७८९';

export function devanagariToInt(str: string): number {
  let res = '';
  for (const ch of str) {
    const idx = DEVANAGARI_DIGITS.indexOf(ch);
    if (idx !== -1) {
      res += idx.toString();
    } else if (/\d/.test(ch)) {
      res += ch;
    }
  }
  return res ? parseInt(res, 10) : 0;
}

/**
 * Checks if a line is predominantly Sanskrit Devanagari verse text
 * (contains Devanagari characters, dandas, and verse cadences).
 */
export function isSanskritVerseLine(line: string): boolean {
  const devanagariChars = (line.match(/[ऀ-ॿ]/g) || []).length;
  if (devanagariChars < 8) return false;

  // Not a heading or editorial label
  if (/^(अर्थ|भावार्थ|टीका|व्याख्या|पदच्छेद|अन्वय|शब्दार्थ|अनुवाद|विशेष|अध्याय|खण्ड|वल्ली|सर्ग)\s*[:\-\—]/i.test(line)) {
    return false;
  }
  if (/^(Translation|Meaning|Purport|Explanation|Chapter|Note)\s*[:\-\—]/i.test(line)) {
    return false;
  }

  // Contains danda, double danda, or verse cadence
  return /[।॥|]/.test(line) || devanagariChars > 15;
}

/**
 * Parses a single normalized page text into structured verses,
 * capturing any trailing unfinished verse at the bottom of the page.
 */
export function parsePageVerses(
  normalizedText: string,
  pageNumber: number,
  currentChapter = 1,
): PageExtractionResult {
  const lines = normalizedText.split('\n').map((l) => l.trim()).filter(Boolean);
  const verses: ExtractedVerse[] = [];
  let detectedChapter = currentChapter;
  let chapterTitle: string | undefined;

  let currentSanskritLines: string[] = [];
  let currentHindiLines: string[] = [];
  let currentEnglishLines: string[] = [];
  let currentWordMeanings: string[] = [];
  let currentVerseNum: number | undefined;

  let state: 'IDLE' | 'SANSKRIT' | 'HINDI' | 'ENGLISH' | 'WORD_MEANING' = 'IDLE';

  function flushVerse() {
    if (currentSanskritLines.length === 0) return;

    const sanskritText = currentSanskritLines.join(' ').replace(/\s+/g, ' ').trim();
    if (!sanskritText) return;

    // Deterministic IAST generation via Sanscript
    let iast = '';
    try {
      iast = Sanscript.t(sanskritText, 'devanagari', 'iast');
    } catch {
      iast = '';
    }

    const verseNum = currentVerseNum ?? (verses.length > 0 ? verses[verses.length - 1].number + 1 : 1);
    const hasDanda = /[।॥]/.test(sanskritText);

    verses.push({
      chapter: detectedChapter,
      number: verseNum,
      sanskrit: sanskritText,
      transliteration: iast,
      hindi: currentHindiLines.length > 0 ? currentHindiLines.join('\n').trim() : undefined,
      translation: currentEnglishLines.length > 0 ? currentEnglishLines.join('\n').trim() : undefined,
      wordMeaning: currentWordMeanings.length > 0 ? currentWordMeanings.join('\n').trim() : undefined,
      sourcePage: pageNumber,
      confidence: hasDanda ? 'high' : 'medium',
      warnings: !hasDanda ? ['Verse did not end with canonical danda (॥)'] : [],
    });

    currentSanskritLines = [];
    currentHindiLines = [];
    currentEnglishLines = [];
    currentWordMeanings = [];
    currentVerseNum = undefined;
    state = 'IDLE';
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect Chapter Headings: e.g. "॥ प्रथमोऽध्यायः ॥" or "अध्याय १"
    const chMatch = line.match(/(?:अध्याय|खण्ड|वल्ली|सर्ग|प्रकरण)\s*([०-९\d]+)?/i);
    if (chMatch && line.length < 50) {
      if (chMatch[1]) {
        detectedChapter = devanagariToInt(chMatch[1]) || detectedChapter;
      }
      chapterTitle = line;
      continue;
    }

    // Check for Section / Commentary / Meaning prefix markers
    if (/^(पदच्छेद|शब्दार्थ)\s*[:\-\—]/i.test(line)) {
      state = 'WORD_MEANING';
      currentWordMeanings.push(line.replace(/^(पदच्छेद|शब्दार्थ)\s*[:\-\—]\s*/i, ''));
      continue;
    }

    if (/^(अर्थ|भावार्थ|टीका|व्याख्या|अनुवाद)\s*[:\-\—]/i.test(line)) {
      state = 'HINDI';
      currentHindiLines.push(line.replace(/^(अर्थ|भावार्थ|टीका|व्याख्या|अनुवाद)\s*[:\-\—]\s*/i, ''));
      continue;
    }

    if (/^(Translation|Meaning|Purport|Explanation)\s*[:\-\—]/i.test(line)) {
      state = 'ENGLISH';
      currentEnglishLines.push(line.replace(/^(Translation|Meaning|Purport|Explanation)\s*[:\-\—]\s*/i, ''));
      continue;
    }

    // Check if line contains double danda and verse number: e.g. "॥ १ ॥" or "॥ १-२३ ॥"
    const verseNumRegex = /(॥\s*[०-९\d]+(?:\s*[-–]\s*[०-९\d]+)?\s*॥)/;

    if (isSanskritVerseLine(line)) {
      if (state !== 'SANSKRIT' && (currentHindiLines.length > 0 || currentEnglishLines.length > 0)) {
        // We have started a new verse after previous verse commentary
        flushVerse();
      }
      state = 'SANSKRIT';

      // If line contains one or more verse ending markers, segment them
      if (verseNumRegex.test(line)) {
        const segments = line.split(/(॥\s*[०-९\d]+(?:\s*[-–]\s*[०-९\d]+)?\s*॥)/);
        for (let s = 0; s < segments.length; s++) {
          const seg = segments[s].trim();
          if (!seg) continue;

          const numMatch = seg.match(/^॥\s*([०-९\d]+)(?:\s*[-–]\s*([०-९\d]+))?\s*॥$/);
          if (numMatch) {
            currentSanskritLines.push(seg);
            currentVerseNum = devanagariToInt(numMatch[1]);
            flushVerse();
          } else {
            currentSanskritLines.push(seg);
          }
        }
      } else {
        currentSanskritLines.push(line);
      }
    } else if (state === 'WORD_MEANING') {
      currentWordMeanings.push(line);
    } else if (state === 'ENGLISH' || /^[A-Za-z]/.test(line)) {
      currentEnglishLines.push(line);
    } else if (state === 'HINDI' || (currentSanskritLines.length === 0 && /[ऀ-ॿ]/.test(line))) {
      currentHindiLines.push(line);
    } else {
      currentHindiLines.push(line);
    }
  }

  // Check if there is an unresolved trailing verse at page boundary (e.g. Sanskrit started but no closing double danda)
  let unresolved: PageExtractionResult['unresolvedTrailingVerse'];
  if (currentSanskritLines.length > 0) {
    unresolved = {
      chapter: detectedChapter,
      number: currentVerseNum,
      lines: currentSanskritLines,
      sourcePage: pageNumber,
    };
  } else {
    flushVerse();
  }

  return {
    pageNumber,
    chapterTitle,
    chapterNumber: detectedChapter,
    verses,
    unresolvedTrailingVerse: unresolved,
    rawText: normalizedText,
  };
}

/**
 * Stitches multi-page extraction results, resolving verses that cross page boundaries.
 */
export function stitchPages(pages: PageExtractionResult[]): ExtractedVerse[] {
  const allVerses: ExtractedVerse[] = [];
  let pendingFragment: {
    chapter: number;
    number?: number;
    lines: string[];
    sourcePage: number;
  } | null = null;

  for (const page of pages) {
    if (pendingFragment) {
      if (page.verses.length > 0) {
        // Prepend pending fragment to the first verse on this page if it continues it
        const first = page.verses[0];
        first.sanskrit = `${pendingFragment.lines.join(' ')} ${first.sanskrit}`.replace(/\s+/g, ' ').trim();
        first.transliteration = Sanscript.t(first.sanskrit, 'devanagari', 'iast');
        pendingFragment = null;
      } else if (page.unresolvedTrailingVerse) {
        // The fragment spans across this entire page as well
        page.unresolvedTrailingVerse.lines = [...pendingFragment.lines, ...page.unresolvedTrailingVerse.lines];
        pendingFragment = page.unresolvedTrailingVerse;
        continue;
      }
    }

    allVerses.push(...page.verses);

    if (page.unresolvedTrailingVerse) {
      pendingFragment = page.unresolvedTrailingVerse;
    }
  }

  // If a pending fragment remains at the very end of the book, finalize it
  if (pendingFragment && pendingFragment.lines.length > 0) {
    const sanskrit = pendingFragment.lines.join(' ').replace(/\s+/g, ' ').trim();
    allVerses.push({
      chapter: pendingFragment.chapter,
      number: pendingFragment.number ?? (allVerses.length + 1),
      sanskrit,
      transliteration: Sanscript.t(sanskrit, 'devanagari', 'iast'),
      sourcePage: pendingFragment.sourcePage,
      confidence: 'medium',
      warnings: ['Verse completed at end of document without trailing danda'],
    });
  }

  return allVerses;
}
