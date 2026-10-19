import type { TextRoute } from './types';

/**
 * Unicode Devanagari is usable as-is.
 * A legacy non-Unicode font (KrutiDev, Chanakya, APS) extracts as punctuation-heavy ASCII.
 * An image-only scan extracts almost nothing.
 */
export function triageText(text: string): TextRoute {
  const sample = text.replace(/\s+/g, ' ').trim();
  const dev = (sample.match(/[\u0900-\u097F]/g) ?? []).length;
  const latin = (sample.match(/[A-Za-z]/g) ?? []).length;
  const junk = (sample.match(/[~^@#$`\\]/g) ?? []).length;
  const pua = (sample.match(/[\uE000-\uF8FF\uFFFD\uFFFC]/g) ?? []).length;
  // A legacy font can still count as Devanagari code points via the private-use area.
  if (pua >= 4) return 'image';
  if (dev >= 40 && dev >= latin && pua === 0) return 'unicode';
  if (sample.length < 25) return 'image';
  if (junk >= 8 && dev < 15) return 'legacy-font';
  if (dev < 15) return 'image';
  return 'unicode';
}
