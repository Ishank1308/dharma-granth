/**
 * Verse formatting shared with the website. Mirrors the parts of lib/verse-format.ts at the repo root
 * that the reader needs, so a verse reads the same in the app and on dharmagranth.dev.
 * Keep the copy (MEANING_COPY) and reference rules in step with that file.
 */
const DEVANAGARI_DIGITS = '०१२३४५६७८९';

export function toDevanagari(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
}

export function toAsciiDigits(value: number | string): string {
  return String(value).replace(/[०-९]/g, (d) => String(DEVANAGARI_DIGITS.indexOf(d)));
}

/** Drop source whitespace that shows up as a blank line under the verse. */
export function cleanVerseField(text: string | undefined): string {
  if (!text) return '';
  return text.replace(/\u00a0/g, ' ').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * The complete Sanskrit text of a verse, line by line. Every line is kept: a verse is never cut short
 * (CLAUDE.md rule 4), only blank lines and the trailing ॥ N ॥ marker are tidied, and the card draws its own marker.
 */
export function sanskritLines(sanskrit?: string): string[] {
  const cleaned = cleanVerseField(sanskrit)
    .replace(/[\s|।॥0-9०-९.]+$/u, '')
    .trim();
  if (!cleaned) return [];
  const glued = splitGluedSpeaker(cleaned);
  if (glued) return [glued.speaker, ...sanskritLines(glued.verse)];
  const byNewline = cleaned
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (byNewline.length > 1) return byNewline;

  // One long line: break after each half-verse danda, as the website does (splitVerseLines).
  const normalized = cleaned.replace(/॥+|\|\|+/g, '।');
  const lines: string[] = [];
  let current = '';
  for (const ch of normalized) {
    current += ch;
    if (ch === '|' || ch === '।') {
      if (!/^[\s|।॥0-9०-९.]+$/u.test(current)) lines.push(current.trim());
      current = '';
    }
  }
  if (current.trim() && !/^[\s|।॥0-9०-९.]+$/u.test(current)) lines.push(current.trim());
  return lines.length ? lines : [cleaned];
}

// Speaker phrase at the very start, run straight into the next word: "अर्जुन उवाचएवं सततयुक्ता…"
// (Bhagavad Gita 12 to 18 store most verses this way). Same rule as splitGluedSpeaker in lib/verse-format.ts:
// उवाच never compounds, so a consonant or independent vowel right after it means the line break was lost.
const GLUED_SPEAKER = /^\s*((?:श्री\s*)?(?:\S+\s+उवाच|भगवानुवाच))(?=[अ-ह])/;

/** Splits "अर्जुन उवाचएवं…" into the speaker and the verse; null when the text has no such join. */
export function splitGluedSpeaker(sanskrit: string): { speaker: string; verse: string } | null {
  const match = GLUED_SPEAKER.exec(sanskrit);
  return match && isSpeakerLine(match[1]) ? { speaker: match[1], verse: sanskrit.slice(match[0].length).trim() } : null;
}

/** "श्रीभगवानुवाच", "अर्जुन उवाच", "सञ्जय उवाच", "ऋषय ऊचुः": mirrors isSpeakerLine on the website. */
export function isSpeakerLine(line: string): boolean {
  const stripped = line.replace(/[|।॥:;—–-]+$/, '').trim();
  if (!stripped || stripped.length > 22) return false;
  if (/[|।॥]/.test(stripped)) return false;
  const words = stripped.split(/\s+/);
  const maxWords = words[0] === 'श्री' ? 3 : 2;
  if (words.length > maxWords) return false;
  if (/^(?:स|सा|तम्|तं|तत|ततः|तस्मै|तेन|अथ|अथैनं|एवम्|इति|पुनर्)(?:\s|$)/u.test(stripped)) return false;
  if (/(?:प्रत्युवाच|होवाच)$/u.test(stripped)) return false;
  return /(?:^|\s)उवाच$|(?:नुवाच|दुवाच|युवाच|ोवाच)$|(?:^|\s)ऊचुः$/u.test(stripped);
}

export const MEANING_COPY = {
  hiPending: 'हिन्दी अर्थ अभी उपलब्ध नहीं है।',
  enPending: 'English translation not yet available.',
  hiRange: (range: string) => `श्लोक ${toAsciiDigits(range.replace('-', '–'))} का हिन्दी अर्थ`,
  enRange: (range: string) => `English for verses ${range.replace('-', '–')}, translated together`,
  hiWith: (verse: number | string) => `इस श्लोक का हिन्दी अर्थ श्लोक ${toAsciiDigits(String(verse))} के साथ दिया गया है।`,
  enWith: (verse: number | string) => `Translated together with verse ${String(verse)}.`,
  hiReview: 'हिन्दी अर्थ स्रोत-संस्करण से सत्यापनाधीन है।',
  aiLabelEn: 'AI-assisted',
  aiLabelHi: 'AI-सहायता से',
} as const;

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

const CHAPTER_IN_NUMBER = new Set(['durgasaptashati', 'brahmasutra', 'manusmriti', 'prashna']);
const FULL_REFERENCE_NUMBER = new Set(['chandogya', 'brihadaranyaka']);

/** Gita 2.47, Durga Saptashati 1.13 (not 1.1.13), Chandogya 1.3.28: the same reference the website shows. */
export function formatVerseRef(scriptureId: string | undefined, chapterId: number | string, verseNumber: number | string): string {
  const n = toAsciiDigits(String(verseNumber).trim());
  const ch = toAsciiDigits(String(chapterId));
  if (scriptureId && FULL_REFERENCE_NUMBER.has(scriptureId) && n.includes('.')) return n;
  if (scriptureId && CHAPTER_IN_NUMBER.has(scriptureId) && n.startsWith(`${ch}.`)) return n;
  return `${ch}.${n}`;
}

/** The verse's own number for the closing ॥ N ॥. */
export function verseMarkNumber(verseNumber: number | string): string {
  const parts = toAsciiDigits(String(verseNumber).trim()).split('.');
  return parts[parts.length - 1] || toAsciiDigits(String(verseNumber));
}

/** More Devanagari than Latin letters means the block should be set as Hindi. Mirrors lib/verse-format.ts. */
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

/** "pada—meaning; pada—meaning; …": a word gloss, not prose. */
export function looksLikeWordGloss(text: string): boolean {
  const parts = text.split(/;\s*/).filter((p) => p.trim());
  if (parts.length < 4) return false;
  const pairs = parts.filter((p) => /^[^—–:]{1,40}\s*[—–]\s*\S/.test(p.trim())).length;
  return pairs / parts.length > 0.7;
}

/**
 * As on the website (lib/verse-format.ts): a verse reads श्लोक → अर्थ → व्याख्या → Commentary.
 * Hindi exposition is the व्याख्या and English the commentary, whichever field it was stored in
 * (downloaded Hindi commentary, `explanation`, `commentary`). A word gloss stored in a commentary
 * field is skipped, because the word-meaning note already shows it.
 */
export function splitVyakhyaCommentary(
  candidates: (string | undefined)[],
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
