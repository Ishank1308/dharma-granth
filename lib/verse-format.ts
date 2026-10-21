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
