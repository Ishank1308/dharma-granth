import Sanscript from '@indic-transliteration/sanscript';
import type { OcrCorrection } from './types';

const DEV_DIGITS = '०१२३४५६७८९';
const CONSONANT = /[\u0915-\u0939\u0958-\u095F]/;

export function devanagariToInt(raw: string): number | null {
  const digits = raw.replace(/[^\d०-९]/g, '');
  if (!digits) return null;
  const ascii = digits.replace(/[०-९]/g, (d) => String(DEV_DIGITS.indexOf(d)));
  const value = Number(ascii);
  return Number.isInteger(value) ? value : null;
}

/**
 * Legacy visual-order scans put ि before the consonant. Unicode stores it after.
 * This is the only automatic rewrite. Every swap is returned so it is not silent.
 * Look-alike pairs (घ/ध, भ/म, व/ब) are never substituted.
 */
export function fixPrebaseI(input: string): { text: string; corrections: OcrCorrection[] } {
  const chars = Array.from(input);
  const corrections: OcrCorrection[] = [];
  for (let i = 0; i < chars.length - 1; i += 1) {
    const sign = chars[i];
    const next = chars[i + 1];
    if (sign !== 'ि' || !next || !CONSONANT.test(next)) continue;
    if (i > 0 && CONSONANT.test(chars[i - 1] ?? '')) continue;
    chars[i] = next;
    chars[i + 1] = sign;
    corrections.push({ from: `${sign}${next}`, to: `${next}${sign}`, reason: 'prebase i-matra reordered to Unicode' });
    i += 1;
  }
  return { text: chars.join(''), corrections };
}

export function toIast(devanagari: string): string {
  if (!/[\u0900-\u097F]/.test(devanagari)) return '';
  return Sanscript.t(devanagari, 'devanagari', 'iast').replace(/।/g, '|').replace(/\s+/g, ' ').trim();
}

/** Flags only. The characters stay as read. */
export function suspicionFlags(text: string): string[] {
  const flags: string[] = [];
  if (/[\uE000-\uF8FF\uFFFD]/.test(text)) flags.push('private-use or replacement character');
  if (/[\u0900-\u097F]:\s*[\u0900-\u097F]/.test(text)) flags.push('possible visarga printed as colon');
  if (/[\u0900-\u097F]\s+[ेैोौृ]/.test(text)) flags.push('detached matra');
  if (/[घधभमवबयपतन्]/.test(text) && /[A-Za-z]{3,}/.test(text) && /[\u0900-\u097F]/.test(text)) {
    flags.push('mixed script on one verse');
  }
  return flags;
}
