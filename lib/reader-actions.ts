/**
 * Pure helpers for the verse reader: what gets copied, downloaded and reported,
 * plus the bookmark record shared with the rest of the app. No React, so the
 * text builders can be checked on their own.
 *
 * Everything here only states what the data says. Provenance lines come from
 * `ReaderProvenance`, which the page fills from each text's manifest; nothing
 * is assumed about editions, translators or reviewers.
 */

import { AI_COMMENTARY_LABEL } from '@/lib/ai-labels';

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
  translation?: string;
  explanation?: string;
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
  `${ref.scriptureTitle} ${ref.chapterId}.${verse.number}`;

/** Human-readable layer labels used in copied and downloaded text. */
export function layerNote(p: ReaderProvenance, layer: 'hindi' | 'english'): string {
  const ai = layer === 'hindi' ? p.hindiIsAi : p.englishIsAi;
  return ai ? ' (AI translation, not a scholarly edition)' : '';
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
  const aiNote = p.commentaryIsAi ? `\n_${AI_COMMENTARY_LABEL.detail} Not part of the scripture._` : '';
  const lines = [
    `# ${verseReference(ref, verse)}`,
    `${ref.scriptureTitle}${ref.scriptureTitleSanskrit ? ` (${ref.scriptureTitleSanskrit})` : ''} · ${ref.chapterTitle}\n`,
    section('Sanskrit (source text)', verse.sanskrit),
    section('Transliteration (IAST)', verse.transliteration),
    section('Word-by-word', verse.wordMeaning),
    section(`Hindi translation${layerNote(p, 'hindi')}`, verse.hindi),
    section(`English translation${layerNote(p, 'english')}`, verse.translation),
    verse.explanation ? `${section('Explanation', verse.explanation)}${aiNote}\n` : '',
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

export const REPORT_KINDS = [
  { id: 'sanskrit', label: 'Sanskrit spelling or sandhi', hi: 'संस्कृत वर्तनी / संधि' },
  { id: 'transliteration', label: 'Transliteration (IAST)', hi: 'लिप्यन्तरण' },
  { id: 'hindi', label: 'Hindi translation', hi: 'हिन्दी अनुवाद' },
  { id: 'english', label: 'English translation', hi: 'अंग्रेज़ी अनुवाद' },
  { id: 'wordmeaning', label: 'Word-by-word meaning', hi: 'पदच्छेद / शब्दार्थ' },
  { id: 'order', label: 'Verse order or missing text', hi: 'श्लोक क्रम / छूटा पाठ' },
  { id: 'other', label: 'Something else', hi: 'अन्य' },
] as const;

export type ReportKind = (typeof REPORT_KINDS)[number]['id'];

export const ISSUES_REPO = 'https://github.com/Ishank567/dharma-granth';

/**
 * A prefilled GitHub issue. The report is sent only when the reader presses
 * "Create issue" on GitHub: nothing is stored or transmitted by this site.
 */
export function buildIssueUrl(ref: ReaderRef, verse: ReaderVerseText, kind: ReportKind, details: string): string {
  const label = REPORT_KINDS.find((k) => k.id === kind)?.label ?? kind;
  const title = `Text issue: ${verseReference(ref, verse)} — ${label}`;
  const body = [
    `**Verse:** ${verseReference(ref, verse)}`,
    `**Page:** ${ref.url}`,
    `**Type:** ${label}`,
    '',
    '**What is wrong, and what should it be?**',
    clean(details) || '(please describe)',
  ].join('\n');
  return `${ISSUES_REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
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

export function readBookmarks(): SavedVerse[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) ?? '[]');
    return Array.isArray(parsed) ? (parsed as SavedVerse[]) : [];
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
