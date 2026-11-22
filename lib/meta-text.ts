/** Search results cut descriptions at roughly this many characters. */
export const MAX_DESCRIPTION = 158;
export const MAX_TITLE = 70;

/** Length of text as serialized inside an HTML `<title>` element (`&`, `<`, `>` escaped). */
export function htmlTitleLength(text: string): number {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').length;
}

/** Length of text as serialized inside an HTML attribute (`&`, `"`, `'`, `<`, `>` escaped). */
export function htmlAttrLength(text: string): number {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').length;
}

/**
 * Pick the first candidate title whose HTML-serialized length is `<= max`.
 * Falls back to word-boundary clipping on the most compact candidate if needed.
 */
export function pickTitle(candidates: Array<string | undefined | null | false>, max = MAX_TITLE): string {
  const valid = candidates
    .filter((c): c is string => Boolean(c && c.trim()))
    .map((c) => c.replace(/\s+/g, ' ').trim());
  for (const candidate of valid) {
    if (htmlTitleLength(candidate) <= max) return candidate;
  }
  const fallback = valid[valid.length - 1] ?? 'Dharma Granth';
  const words = fallback.split(' ');
  let acc = '';
  for (const word of words) {
    const next = acc ? `${acc} ${word}` : word;
    if (htmlTitleLength(next) > max - 1) break;
    acc = next;
  }
  const base = (acc || Array.from(fallback).slice(0, Math.max(10, max - 8)).join('')).replace(/[\s,;:·|—-]+$/, '');
  return htmlTitleLength(base) < htmlTitleLength(fallback) ? `${base}…` : base;
}

/** Shorten text to `max` HTML-serialized characters at a word boundary, ending with an ellipsis. */
export function clipDescription(text: string, max = MAX_DESCRIPTION): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (htmlAttrLength(clean) <= max) return clean;
  const chars = Array.from(clean);
  let end = Math.min(chars.length, max - 1);
  while (end > 0 && htmlAttrLength(chars.slice(0, end).join('')) > max - 1) {
    end--;
  }
  const cut = chars.slice(0, end).join('');
  const atWord = cut.replace(/\s+\S*$/, '');
  return `${(atWord.length > max * 0.55 ? atWord : cut).replace(/[\s,;:—-]+$/, '')}…`;
}
