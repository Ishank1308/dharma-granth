/**
 * How much commentary a chapter page carries in its HTML (docs/commentary-storage.md).
 *
 * Chapter pages render their verses' commentary at build time so crawlers and link previews see it.
 * Once every verse has a व्याख्या and modern context (~4.5 KB a verse), a long chapter would carry
 * megabytes, serialized twice (markup and hydration payload) and past the page-weight budget in
 * scripts/check-export.mjs. A page therefore carries its verses' commentary in reading order up to
 * INLINE_COMMENTARY_MAX_BYTES; the reader loads the rest from the published section files after the
 * page has rendered.
 */
import { commentaryUnitOf } from './commentary-units.mjs';
import { commentaryLookupKey, type CommentaryAmbiguities } from './commentary-lookup';

/**
 * Commentary JSON a page carries in its HTML. Measured 2026-11-22 over the 1,178 pages that had
 * commentary: seven pages were above this (the largest Maha Upanishad ch. 5, 1.39 MB), 26 above 600 KB.
 */
export const INLINE_COMMENTARY_MAX_BYTES = 1024 * 1024;

export interface BudgetedCommentary<T> {
  /** Commentary rendered into the page, keyed as published. */
  inline: Record<string, T> | undefined;
  /** Section files (lib/commentary-units.mjs) the reader loads for the page's other verses. */
  deferredUnits: string[];
}

/**
 * Split a page's commentary into what goes into the HTML and the section files the reader fetches
 * for the rest. `all` is the whole chapter's commentary; `numbers` are the page's verses in order.
 */
export function budgetPageCommentary<T>(
  all: Record<string, T> | undefined,
  chapterId: number,
  numbers: Array<number | string>,
  ambiguity: CommentaryAmbiguities,
  maxBytes = INLINE_COMMENTARY_MAX_BYTES,
): BudgetedCommentary<T> {
  if (!all) return { inline: undefined, deferredUnits: [] };
  const inline: Record<string, T> = {};
  const deferred = new Set<string>();
  let bytes = 0;
  let full = false;
  for (const n of numbers) {
    const key = commentaryLookupKey(all, chapterId, n, ambiguity);
    if (key === undefined || key in inline) continue;
    const size = Buffer.byteLength(JSON.stringify(all[key]));
    // Reading order: once one verse does not fit, later verses load in the browser too, so the
    // page never shows commentary on verse 40 but not on verse 39.
    if (!full && bytes + size <= maxBytes) {
      inline[key] = all[key];
      bytes += size;
      continue;
    }
    full = true;
    const unit = commentaryUnitOf(key);
    if (unit) deferred.add(unit);
  }
  return { inline: Object.keys(inline).length > 0 ? inline : undefined, deferredUnits: [...deferred] };
}
