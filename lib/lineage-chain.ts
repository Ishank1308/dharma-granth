/**
 * Lineage architecture (Phase 9): Verse → Scripture → Commentator →
 * Acharya → Saint → Teachings, assembled only from recorded data.
 *
 * - Verse and scripture come from the caller (the page already holds them).
 * - The commentator comes from the sources registry's recorded traditional
 *   commentary author — never invented.
 * - Acharyas and saints come from wisdom pathways whose discovery lists
 *   this scripture, resolved through data/wisdom-lineage masters.
 * - Teachings are the masters' own recorded one-line teachings.
 * Client-safe; no invented masters, dates, or initiations.
 */

import { getScriptureSourceMeta } from '@/data/sources-registry';
import { lineageMasters, type LineageMaster } from '@/data/wisdom-lineage';
import { wisdomPathways } from '@/data/wisdom-pathways';

export interface LineageChain {
  verseRef: string;
  scriptureTitle: string;
  /** Recorded traditional commentator, or null when none is recorded. */
  commentator: string | null;
  acharyas: LineageMaster[];
  saints: LineageMaster[];
}

const ACHARYA_KINDS = new Set(['rishi', 'acharya', 'commentator', 'vedantic']);
const SAINT_KINDS = new Set(['saint', 'bhakti']);

export function buildLineageChain(opts: {
  verseRef: string;
  scriptureId: string;
  scriptureTitle: string;
  scriptureTitleSanskrit?: string;
}): LineageChain {
  const meta = getScriptureSourceMeta(opts.scriptureId, opts.scriptureTitle, opts.scriptureTitleSanskrit);
  const rawCommentator = meta.traditionalCommentaryAuthor;
  const commentator = rawCommentator && !/^not recorded/i.test(rawCommentator) ? rawCommentator : null;

  const masterIds = new Set<string>();
  for (const pathway of wisdomPathways) {
    if (!pathway.discovery.scriptures.includes(opts.scriptureId)) continue;
    for (const id of pathway.lineageIds) masterIds.add(id);
  }
  const byId = new Map(lineageMasters.map((m) => [m.id, m]));
  const masters = Array.from(masterIds).flatMap((id) => {
    const m = byId.get(id);
    return m ? [m] : [];
  });
  return {
    verseRef: opts.verseRef,
    scriptureTitle: opts.scriptureTitle,
    commentator,
    acharyas: masters.filter((m) => ACHARYA_KINDS.has(m.kind)).slice(0, 4),
    saints: masters.filter((m) => SAINT_KINDS.has(m.kind)).slice(0, 4),
  };
}
