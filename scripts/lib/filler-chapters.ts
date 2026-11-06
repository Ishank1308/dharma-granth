/**
 * Filler chapters: the opening chapters of many Puranas, of the Mahabharata's first parvas and of the Manusmriti hold
 * the same few hand-picked verses (Matsya 1-3 each show verses 1, 2, 5, 8, 26 and 27; Mahabharata parvas 1-4 open with
 * a Vana Parva verse), not the chapter's own text. Publishing leaves their verses out, so the chapter shows its
 * "text being added" state and stays out of the sitemap; the source JSON keeps them.
 *
 * A chapter is filler when it belongs to the book's opening run of short chapters (each under 15 verses) and shares a
 * verse with another chapter, in a book that also has full chapters. Vedic samhitas (their repeats are genuine), books
 * with verse pages (their URLs must stay) and books that are a selection from start to finish (labelled as selected
 * verses instead) are left alone.
 */
import { VERSE_PAGE_SCRIPTURE_IDS } from '../../lib/verse-paths';

const VEDIC: ReadonlySet<string> = new Set(['rigveda', 'samaveda', 'atharvaveda', 'yajurveda']);
const VERSE_PAGES: ReadonlySet<string> = new Set(VERSE_PAGE_SCRIPTURE_IDS);
const SHORT = 15;

type Chapter = { number: number | string; verses?: unknown[] };

const letters = (s: unknown) => String(s ?? '').normalize('NFC').replace(/[^अ-हा-ौ]/g, '');

/** Chapter numbers whose verses are filler, for one book. */
export function fillerChapters(scriptureId: string, chapters: Chapter[]): Set<number> {
  const out = new Set<number>();
  if (VEDIC.has(scriptureId) || VERSE_PAGES.has(scriptureId)) return out;
  const verses = (c: Chapter) => (c.verses ?? []) as Array<{ sanskrit?: string }>;

  const where = new Map<string, Set<number>>();
  for (const c of chapters) {
    for (const v of verses(c)) {
      const key = letters(v.sanskrit);
      if (key.length < 16) continue;
      if (!where.has(key)) where.set(key, new Set());
      where.get(key)!.add(Number(c.number));
    }
  }
  const shares = (c: Chapter) => verses(c).some((v) => (where.get(letters(v.sanskrit))?.size ?? 0) > 1);

  for (const c of chapters) {
    const n = verses(c).length;
    if (n === 0 || n >= SHORT) break;
    if (shares(c)) out.add(Number(c.number));
  }
  // A book with no full chapter beyond the filler is a selection: keep it (it is labelled as selected verses).
  if (!chapters.some((c) => verses(c).length >= SHORT && !out.has(Number(c.number)))) out.clear();
  return out;
}
