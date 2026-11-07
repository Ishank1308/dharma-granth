/**
 * Verse text formatting shared by the interactive VerseCard (client) and the
 * static VerseText (also rendered by Server Components, e.g. verse pages).
 * Kept out of VerseCard.tsx: functions exported from a 'use client' module
 * cannot be called on the server.
 */

const DEVANAGARI_DIGITS = '०१२३४५६७८९';

export function toDevanagari(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
}

export function toAsciiDigits(value: number | string): string {
  return String(value).replace(/[०-९]/g, (d) => String(DEVANAGARI_DIGITS.indexOf(d)));
}

/**
 * Split a verse into its pādas for line-by-line setting. Source text is
 * either newline-separated or uses | / । as half-verse markers. Any trailing
 * "॥ 28 ॥"-style terminator is dropped; the card draws its own.
 */
export function verseLines(sanskrit: string): string[] {
  const cleaned = sanskrit.replace(/[\s|।॥0-9०-९.]+$/, '').trim();
  const byNewline = cleaned.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  if (byNewline.length > 1) return byNewline;

  const lines: string[] = [];
  let current = '';
  for (const ch of cleaned) {
    current += ch;
    if (ch === '|' || ch === '।') {
      lines.push(current.trim());
      current = '';
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines.length ? lines : [cleaned];
}

/** More Devanagari than Latin letters means the block should be set as Hindi. */
export function isMostlyDevanagari(text: string | undefined): boolean {
  if (!text) return false;
  let deva = 0;
  let latin = 0;
  for (const ch of text) {
    if (ch >= 'ऀ' && ch <= 'ॿ') deva++;
    else if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) latin++;
  }
  return deva > latin;
}

/**
 * The reader shows a verse as श्लोक → अर्थ → व्याख्या → Commentary & Explanation.
 * Hindi exposition is the व्याख्या and English the commentary, whichever field
 * (Hindi commentary file, `explanation`, `commentary`) it was stored in.
 * A word-by-word gloss stored in a commentary field is skipped: the पदच्छेद
 * layer already shows it, and it is not an explanation.
 */
export function splitVyakhyaCommentary(
  candidates: Array<string | undefined>,
  wordMeaning?: string,
): { vyakhya?: string; commentary?: string } {
  let vyakhya: string | undefined;
  let commentary: string | undefined;
  const gloss = wordMeaning?.trim();
  for (const text of candidates) {
    if (!text || !text.trim()) continue;
    if ((gloss && text.trim() === gloss) || looksLikeWordGloss(text)) continue;
    if (isMostlyDevanagari(text)) vyakhya ??= text;
    else commentary ??= text;
  }
  return { vyakhya, commentary };
}

/** "pada—meaning; pada—meaning; …": a word gloss, not prose. */
export function looksLikeWordGloss(text: string): boolean {
  const parts = text.split(/;\s*/).filter((p) => p.trim());
  if (parts.length < 4) return false;
  const pairs = parts.filter((p) => /^[^—–:]{1,40}\s*[—–]\s*\S/.test(p.trim())).length;
  return pairs / parts.length > 0.7;
}

/** Drop source whitespace that shows up as a blank line under the verse. */
export function cleanVerseField(text: string | undefined): string {
  if (!text) return '';
  return text.replace(/\u00a0/g, ' ').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Split a verse into its pādas for line-by-line display.
 */
export function splitVerseLines(sanskrit?: string): string[] {
  if (!sanskrit || typeof sanskrit !== 'string') return [];
  const cleaned = sanskrit.replace(/[\s|।॥0-9०-९.]+$/, '').trim();
  if (!cleaned) return [];
  const byNewline = cleaned.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  if (byNewline.length > 1) return byNewline;

  // Normalize consecutive dandas (॥, ||) to a single delimiter
  const normalized = cleaned.replace(/॥+|\|\|+/g, '।');
  const lines: string[] = [];
  let current = '';
  for (const ch of normalized) {
    current += ch;
    if (ch === '|' || ch === '।') {
      const line = current.trim();
      if (line && !/^[\s|।॥0-9०-९.]+$/.test(line)) {
        lines.push(line);
      }
      current = '';
    }
  }
  const rem = current.trim();
  if (rem && !/^[\s|।॥0-9०-९.]+$/.test(rem)) {
    lines.push(rem);
  }
  return lines.length ? lines : [cleaned];
}

/**
 * The words every reader (chapter list, verse card, verse page) uses for the अर्थ slot, so a verse
 * always shows the same parts in the same order: Sanskrit, transliteration, Hindi, English. A
 * meaning that is not written yet says so in its place instead of leaving a gap.
 */
export const MEANING_COPY = {
  hiPending: 'हिन्दी अर्थ अभी उपलब्ध नहीं है।',
  enPending: 'English translation not yet available.',
  /** Both missing: one line instead of two. */
  bothPendingHi: 'अर्थ अभी उपलब्ध नहीं है',
  bothPendingEn: 'Translation not yet available',
  hiRange: (range: string) => `श्लोक ${toAsciiDigits(range.replace('-', '–'))} का हिन्दी अर्थ`,
  enRange: (range: string) => `English for verses ${range.replace('-', '–')}, translated together`,
  hiWith: (verse: number | string) => `इस श्लोक का हिन्दी अर्थ श्लोक ${toAsciiDigits(String(verse))} के साथ दिया गया है।`,
  enWith: (verse: number | string) => `Translated together with verse ${String(verse)}.`,
  hiReview: 'हिन्दी अर्थ स्रोत-संस्करण से सत्यापनाधीन है।',
  /** Hindi refilled from a printed edition and shown before it is proofread. */
  hiUnproofread: 'मुद्रित संस्करण से, प्रूफ़ जाँच शेष',
} as const;

/** A passage translation longer than this is folded under its label, in either language. */
export const LONG_PASSAGE_CHARS = 600;

export function isLongPassage(text: string | undefined): boolean {
  return (text?.length ?? 0) > LONG_PASSAGE_CHARS;
}

interface MeaningFields {
  hindi?: string;
  hindiReviewRequired?: boolean;
  hindiSeeVerse?: number | string;
  translation?: string;
  translationSeeVerse?: number | string;
}

/** What the अर्थ slot holds for each language: the text, a pointer to the verse that holds it, a review notice, or nothing yet. */
export function meaningState(v: MeaningFields): { hi: 'text' | 'with' | 'review' | 'pending'; en: 'text' | 'with' | 'pending' } {
  const hi = cleanVerseField(v.hindi) ? 'text' : v.hindiReviewRequired ? 'review' : v.hindiSeeVerse != null ? 'with' : 'pending';
  const en = cleanVerseField(v.translation) ? 'text' : v.translationSeeVerse != null ? 'with' : 'pending';
  return { hi, en };
}

interface PassageVerseLike extends MeaningFields {
  number?: number | string;
  hindiRange?: string;
  hindiSource?: string;
  translationRange?: string;
  translationSource?: string;
}

/**
 * For a page that shows one verse: a meaning stored once on the first verse of its passage is
 * shown on this verse too, under the passage's range label, instead of a link away.
 */
export function withPassageMeaning<T extends PassageVerseLike>(verses: readonly T[], verse: T): T {
  let out = verse;
  const head = (n: number | string) => verses.find((v) => String(v.number) === String(n));
  if (!cleanVerseField(verse.hindi) && verse.hindiSeeVerse != null) {
    const first = head(verse.hindiSeeVerse);
    if (first?.hindi) out = { ...out, hindi: first.hindi, hindiRange: first.hindiRange, hindiSource: first.hindiSource, hindiSeeVerse: undefined };
  }
  if (!cleanVerseField(verse.translation) && verse.translationSeeVerse != null) {
    const first = head(verse.translationSeeVerse);
    if (first?.translation) {
      out = { ...out, translation: first.translation, translationRange: first.translationRange, translationSource: first.translationSource, translationSeeVerse: undefined };
    }
  }
  return out;
}

/**
 * Texts whose stored verse numbers already carry the chapter ("1.13" in Durga Saptashati chapter 1,
 * "5.1" in Manusmriti chapter 5); a number that does is shown as it is, not prefixed again.
 */
const CHAPTER_IN_NUMBER = new Set(['durgasaptashati', 'brahmasutra', 'manusmriti', 'prashna']);
/** Texts whose stored verse numbers are the full traditional reference ("1.3.28"); library chapters are only a sequence. */
const FULL_REFERENCE_NUMBER = new Set(['chandogya', 'brihadaranyaka']);

/**
 * The one reference a verse is shown under, on chapter pages and verse pages alike:
 * Gita 2.47, Rig Veda 1.164.46, Durga Saptashati 1.13 (not 1.1.13), Chandogya 1.3.28.
 */
export function formatVerseRef(scriptureId: string | undefined, chapterId: number | string, verseNumber: number | string): string {
  const n = toAsciiDigits(String(verseNumber).trim());
  const ch = toAsciiDigits(String(chapterId));
  if (scriptureId && FULL_REFERENCE_NUMBER.has(scriptureId) && n.includes('.')) return n;
  if (scriptureId && CHAPTER_IN_NUMBER.has(scriptureId) && n.startsWith(`${ch}.`)) return n;
  return `${ch}.${n}`;
}

/** The verse's own number for the closing ॥ N ॥: the last part of its reference (॥ 47 ॥, ॥ 46 ॥). */
export function verseMarkNumber(verseNumber: number | string): string {
  const parts = toAsciiDigits(String(verseNumber).trim()).split('.');
  return parts[parts.length - 1] || toAsciiDigits(String(verseNumber));
}
