/**
 * Pure helpers for the verse reader: what gets copied, downloaded and reported,
 * plus the bookmark record shared with the rest of the app. No React, so the
 * text builders can be checked on their own.
 *
 * Everything here only states what the data says. Provenance lines come from
 * `ReaderProvenance`, which the page fills from each text's manifest; nothing
 * is assumed about editions, translators or reviewers.
 */

import { EDITORIAL_DRAFT_LABEL } from '@/lib/editorial-terminology';
import { formatVerseRef } from '@/lib/verse-format';
import { parseStored } from '@/lib/safe-stored';

export interface ReaderVerseText {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  wordMeaning?: string;
  hindi?: string;
  /** The Hindi translates a range of verses together ("15-17"). */
  hindiRange?: string;
  /** This verse's Hindi is stored on that verse (the first of its range). */
  hindiSeeVerse?: number | string;
  /** The Hindi meaning is withheld until it is checked against the printed edition. */
  hindiReviewRequired?: boolean;
  translation?: string;
  /** The English translates a range of verses together ("24-25"). */
  translationRange?: string;
  /** This verse's English is stored on that verse (the first of its range). */
  translationSeeVerse?: number | string;
  /** व्याख्या: the Hindi exposition. */
  explanation?: string;
  /** Commentary & Explanation: the English exposition, shown after the व्याख्या. */
  commentary?: string;
  reflection?: string;
  research?: string;
}

/** Who or what produced each layer, as far as the data records it. */
export interface ReaderProvenance {
  /** Host of the Sanskrit source (e.g. sanskritdocuments.org). */
  sourceHost?: string;
  sourceUrl?: string;
  sourceLicense?: string;
  /** ISO date the Sanskrit source was fetched. */
  sourceFetched?: string;
  /** Hindi / English text is machine-translated (flagged in the data). */
  hindiIsAi: boolean;
  englishIsAi: boolean;
  /** The explanation, reflection and research layers are AI-drafted and editor-approved (lib/ai-labels). */
  commentaryIsAi: boolean;
  /** The व्याख्या alone is an approved AI draft (also true when commentaryIsAi is). */
  explanationIsAi?: boolean;
  /** The research note alone is an approved AI rewrite (also true when commentaryIsAi is). */
  researchIsAi?: boolean;
  /** ISO date the text or its commentary last changed in the repository. */
  lastUpdated?: string;
  /** Who translated the Hindi and English layers, as recorded for the text. */
  translator?: string;
  /** Variant-reading note recorded for this text; absent when none is recorded. */
  variantNote?: string;
  /** The Sanskrit edition or archive, as recorded for the text. */
  edition?: string;
  /** Review of the translation: 'Not yet reviewed' or 'Reviewed <date>'. */
  translationReview?: string;
}

export interface ReaderRef {
  scriptureId: string;
  scriptureTitle: string;
  scriptureTitleSanskrit?: string;
  chapterId: number;
  chapterTitle: string;
  url: string;
}

const clean = (s?: string): string => (s ?? '').replace(/\s+\n/g, '\n').trim();

export const verseReference = (ref: ReaderRef, verse: ReaderVerseText): string =>
  `${ref.scriptureTitle} ${formatVerseRef(ref.scriptureId, ref.chapterId, verse.number)}`;

/** Human-readable layer labels used in copied and downloaded text. */
export function layerNote(p: ReaderProvenance, layer: 'hindi' | 'english'): string {
  const ai = layer === 'hindi' ? p.hindiIsAi : p.englishIsAi;
  return ai ? ' (study translation, AI-assisted draft — not a scholarly edition)' : '';
}

/** Text for "Copy with reference": only the layers the reader currently shows. */
export function buildCopyText(
  ref: ReaderRef,
  verse: ReaderVerseText,
  p: ReaderProvenance,
  show: { transliteration: boolean; hindi: boolean; english: boolean },
): string {
  const parts = [
    verse.sanskrit && `॥ ${clean(verse.sanskrit)} ॥`,
    show.transliteration && verse.transliteration && clean(verse.transliteration),
    show.hindi && verse.hindi && `हिन्दी${layerNote(p, 'hindi')}:\n${clean(verse.hindi)}`,
    show.english && verse.translation && `English${layerNote(p, 'english')}:\n${clean(verse.translation)}`,
    `— ${verseReference(ref, verse)}`,
    ref.url && `Dharma Granth: ${ref.url}`,
  ];
  return parts.filter(Boolean).join('\n\n');
}

/**
 * The downloadable verse card (Markdown). Layers without data are left out
 * rather than filled with placeholders, and AI-drafted layers say so.
 */
export function buildDownloadMarkdown(ref: ReaderRef, verse: ReaderVerseText, p: ReaderProvenance): string {
  const section = (title: string, body?: string) => (body && clean(body) ? `## ${title}\n\n${clean(body)}\n` : '');
  const aiNote = p.commentaryIsAi ? `\n_Editorial draft: ${EDITORIAL_DRAFT_LABEL.detail} Not part of the scripture._` : '';
  const lines = [
    `# ${verseReference(ref, verse)}`,
    `${ref.scriptureTitle}${ref.scriptureTitleSanskrit ? ` (${ref.scriptureTitleSanskrit})` : ''} · ${ref.chapterTitle}\n`,
    section('Sanskrit (source text)', verse.sanskrit),
    section('Transliteration (IAST)', verse.transliteration),
    section('Word-by-word', verse.wordMeaning),
    section(`Hindi translation${layerNote(p, 'hindi')}`, verse.hindi),
    section(`English translation${layerNote(p, 'english')}`, verse.translation),
    verse.explanation ? `${section('व्याख्या (Vyakhya)', verse.explanation)}${aiNote}\n` : '',
    verse.commentary ? `${section('Commentary & Explanation', verse.commentary)}${aiNote}\n` : '',
    verse.reflection ? `${section('Modern reflection', verse.reflection)}${aiNote}\n` : '',
    verse.research ? `${section('Research context', verse.research)}${aiNote}\n` : '',
    '## Source',
    '',
    `- Sanskrit text: ${p.sourceHost ?? 'not recorded'}${p.sourceFetched ? ` (fetched ${p.sourceFetched.slice(0, 10)})` : ''}`,
    p.sourceLicense ? `- Licence note: ${p.sourceLicense}` : '',
    `- Page: ${ref.url}`,
  ];
  return `${lines.filter((l) => l !== '').join('\n')}\n`;
}

/* ── Bookmarks (same record and key as the chapter reader and verse page) ── */

export const BOOKMARKS_KEY = 'dharma.bookmarkedVerses';

export interface SavedVerse {
  scriptureId: string;
  scriptureTitle: string;
  chapterId?: number;
  chapterTitle: string;
  verseId: number | string;
  sanskrit: string;
  translation: string;
  hindi?: string;
  timestamp: string;
}

const sameVerse = (b: SavedVerse, ref: ReaderRef, verse: ReaderVerseText): boolean =>
  b.scriptureId === ref.scriptureId && b.chapterId === ref.chapterId && String(b.verseId) === String(verse.number);

/** Keys older builds wrote verse bookmarks to (VerseBookmark, June 2026, and the first sync layer). */
const LEGACY_BOOKMARK_KEYS = ['verse-bookmarks', 'dharma-bookmarks-v1'];

/**
 * One-time fold of legacy bookmark lists into BOOKMARKS_KEY, so a reader's
 * older saves appear on /practice/bookmarks/. A legacy key is removed only
 * after the merged list is written; unreadable entries are left in place.
 */
export function migrateLegacyBookmarks(): void {
  try {
    for (const key of LEGACY_BOOKMARK_KEYS) {
      const raw = localStorage.getItem(key);
      if (raw === null) continue;
      const legacy: unknown = JSON.parse(raw);
      if (!Array.isArray(legacy)) continue;
      const current: SavedVerse[] = parseStored<SavedVerse[]>(localStorage.getItem(BOOKMARKS_KEY), []);
      const seen = new Set(current.map((b) => `${b.scriptureId}:${b.chapterId ?? ''}:${b.verseId}`));
      for (const item of legacy as Array<Record<string, unknown>>) {
        const scriptureId = typeof item.scriptureId === 'string' ? item.scriptureId : '';
        const verseId = (item.verseNumber ?? item.verse ?? item.verseId) as number | string | undefined;
        if (!scriptureId || verseId === undefined || verseId === '') continue;
        const chapterId = item.chapterId === undefined ? undefined : Number(item.chapterId);
        const id = `${scriptureId}:${chapterId ?? ''}:${verseId}`;
        if (seen.has(id)) continue;
        seen.add(id);
        current.push({
          scriptureId,
          scriptureTitle: typeof item.scriptureTitle === 'string' ? item.scriptureTitle : scriptureId,
          chapterId: Number.isFinite(chapterId) ? chapterId : undefined,
          chapterTitle: typeof item.chapterTitle === 'string' ? item.chapterTitle : chapterId ? `अध्याय ${chapterId}` : '',
          verseId,
          sanskrit: typeof item.sanskrit === 'string' ? item.sanskrit : '',
          translation: String(item.english ?? item.translation ?? item.hindi ?? ''),
          hindi: typeof item.hindi === 'string' ? item.hindi : undefined,
          timestamp: String(item.savedAt ?? item.timestamp ?? new Date().toISOString()),
        });
      }
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(current));
      localStorage.removeItem(key);
    }
  } catch {
    // Storage blocked or a malformed legacy value: keep everything as it was.
  }
}

export function readBookmarks(): SavedVerse[] {
  migrateLegacyBookmarks();
  try {
    return parseStored<SavedVerse[]>(localStorage.getItem(BOOKMARKS_KEY), []).filter(
      (b) => typeof b === 'object' && typeof b.scriptureId === 'string',
    );
  } catch {
    return [];
  }
}

export const isBookmarked = (ref: ReaderRef, verse: ReaderVerseText): boolean =>
  readBookmarks().some((b) => sameVerse(b, ref, verse));

/** Toggles the bookmark; returns the new state, or null if storage is unavailable. */
export function toggleBookmark(ref: ReaderRef, verse: ReaderVerseText): boolean | null {
  const list = readBookmarks();
  const saved = list.some((b) => sameVerse(b, ref, verse));
  const next = saved
    ? list.filter((b) => !sameVerse(b, ref, verse))
    : [
        {
          scriptureId: ref.scriptureId,
          scriptureTitle: ref.scriptureTitle,
          chapterId: ref.chapterId,
          chapterTitle: ref.chapterTitle,
          verseId: verse.number,
          sanskrit: verse.sanskrit ?? '',
          translation: verse.translation ?? verse.hindi ?? '',
          hindi: verse.hindi,
          timestamp: new Date().toISOString(),
        },
        ...list,
      ];
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
    return !saved;
  } catch {
    return null;
  }
}
