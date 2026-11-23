'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, ListFilter } from 'lucide-react';
import { toAsciiDigits } from '@/lib/verse-format';
import { VerseRouteLink } from './VerseRouteLink';
import { LITE_COMPAT, RAIL_CARD } from './verse-rail-styles';

export interface NavigatorVerseItem {
  number: number | string;
  href: string;
  preview?: string;
}

export interface ChapterNavigatorRailProps {
  scriptureTitle: string;
  scriptureTitleSanskrit?: string;
  chapterId: number;
  chapterTitle: string;
  currentVerseNumber: number | string;
  verses: NavigatorVerseItem[];
  savedInChapter: ReadonlySet<string>;
  onOpenChapters: () => void;
  onOpenVerses: () => void;
  pinnedShlokaAside?: ReactNode;
}

const cardSurface = `p-3.5 ${RAIL_CARD}`;

/**
 * Compact mobile bar (< lg) giving 1-tap access to the chapter switcher and verse jump sheet.
 */
export function MobileChapterNavigatorBar({
  chapterId,
  chapterTitle,
  currentVerseNumber,
  totalVerses,
  onOpenChapters,
  onOpenVerses,
}: {
  chapterId: number;
  chapterTitle: string;
  currentVerseNumber: number | string;
  totalVerses: number;
  onOpenChapters: () => void;
  onOpenVerses: () => void;
}) {
  const asciiCh = toAsciiDigits(chapterId);
  const asciiVerse = toAsciiDigits(currentVerseNumber);
  return (
    <div className={`flex items-center justify-between gap-2 ${RAIL_CARD} px-3 py-1.5`}>
      <button
        type="button"
        onClick={onOpenChapters}
        aria-haspopup="dialog"
        className={`focus-ring inline-flex min-h-[44px] min-w-0 flex-1 items-center gap-1.5 rounded-xl px-1.5 text-left text-xs font-semibold text-dharma-text transition hover:text-amber-900 dark:hover:text-amber-200 ${LITE_COMPAT}`}
      >
        <span className="truncate">
          Ch. {asciiCh} · {chapterTitle}
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-dharma-muted" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onOpenVerses}
        aria-haspopup="dialog"
        className={`focus-ring inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl border border-amber-700/25 bg-amber-50/70 dark:border-amber-500/30 dark:bg-amber-950/30 px-3 text-xs font-semibold tabular-nums text-amber-950 dark:text-amber-100 transition hover:border-amber-600/50 ${LITE_COMPAT}`}
      >
        <span>{asciiCh}.{asciiVerse}</span>
        <span className="text-dharma-muted font-normal">/ {toAsciiDigits(totalVerses)}</span>
      </button>
    </div>
  );
}

/**
 * Left sticky rail (`lg:col-span-3`) for chapter switching, pinned shloka reference,
 * and scrollable verse list (`2.47`, `2.48`...) with active indicator and theme preview.
 */
export function ChapterNavigatorRail({
  scriptureTitle,
  scriptureTitleSanskrit,
  chapterId,
  chapterTitle,
  currentVerseNumber,
  verses,
  savedInChapter,
  onOpenChapters,
  pinnedShlokaAside,
}: ChapterNavigatorRailProps) {
  const [query, setQuery] = useState('');
  const activeItemRef = useRef<HTMLAnchorElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const sanskritName = scriptureTitleSanskrit ?? scriptureTitle;
  const asciiChapter = toAsciiDigits(chapterId);

  useEffect(() => {
    const el = activeItemRef.current;
    const container = listRef.current;
    if (!el || !container) return;
    const elTop = el.offsetTop;
    const viewTop = container.scrollTop;
    const viewBottom = viewTop + container.clientHeight;
    if (elTop < viewTop + 40 || elTop > viewBottom - 60) {
      container.scrollTo({ top: Math.max(0, elTop - container.clientHeight / 3), behavior: 'auto' });
    }
  }, [currentVerseNumber]);

  const filteredVerses = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return verses;
    return verses.filter((v) => {
      const ref = `${asciiChapter}.${toAsciiDigits(v.number)}`.toLowerCase();
      return (
        String(v.number).toLowerCase().includes(q) ||
        ref.includes(q) ||
        (v.preview ? v.preview.toLowerCase().includes(q) : false)
      );
    });
  }, [verses, query, asciiChapter]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3.5">
      <div className={`${cardSurface} shrink-0`}>
        <p lang="sa" className="truncate font-devanagari text-sm font-semibold text-dharma-text">
          {sanskritName}
        </p>
        <button
          type="button"
          onClick={onOpenChapters}
          aria-haspopup="dialog"
          className="focus-ring mt-1 flex min-h-[44px] w-full items-center justify-between gap-2 rounded-xl border border-stone-300/60 dark:border-stone-700/80 bg-stone-100/70 dark:bg-stone-900/50 px-3 py-2 text-left text-xs font-semibold text-dharma-text transition hover:border-amber-600/50 hover:text-amber-900 dark:hover:text-amber-200 [[data-lite=true]_&]:transition-none"
        >
          <span className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-dharma-muted">
              Chapter {asciiChapter} · अध्याय {asciiChapter}
            </span>
            <span className="mt-0.5 block truncate text-xs font-semibold text-dharma-text">
              {chapterTitle}
            </span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-dharma-muted" aria-hidden="true" />
        </button>
      </div>

      {pinnedShlokaAside && <div className="shrink-0">{pinnedShlokaAside}</div>}

      <nav aria-label="Verses in this chapter" className={`${cardSurface} flex min-h-0 flex-1 flex-col overflow-hidden`}>
        <div className="mb-2.5 flex shrink-0 items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
            <span>Verses</span>{' '}
            <span aria-hidden="true">·</span>{' '}
            <span lang="hi" className="font-devanagari normal-case tracking-normal">श्लोक सूची</span>
          </span>
          <span className="rounded-full bg-stone-200/70 dark:bg-stone-800 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-dharma-muted">
            {toAsciiDigits(verses.length)}
          </span>
        </div>

        {verses.length > 12 && (
          <label className="relative mb-2.5 block shrink-0">
            <span className="sr-only">Filter verses in chapter {asciiChapter}</span>
            <ListFilter className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dharma-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Filter (e.g. ${asciiChapter}.1)…`}
              className="min-h-[38px] w-full rounded-xl border border-stone-300/60 dark:border-stone-700/80 bg-dharma-bg/80 pl-8 pr-2.5 text-xs text-dharma-text outline-none transition placeholder:text-dharma-muted focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 [[data-lite=true]_&]:transition-none"
            />
          </label>
        )}

        <ul ref={listRef} className="relative min-h-0 flex-1 space-y-1 overflow-y-auto pr-0.5">
          {filteredVerses.map((v) => {
            const current = String(v.number) === String(currentVerseNumber);
            const isSaved = savedInChapter.has(String(v.number));
            const asciiNum = toAsciiDigits(v.number);
            const fullRef = `${asciiChapter}.${asciiNum}`;
            return (
              <li key={String(v.number)}>
                <VerseRouteLink
                  ref={current ? activeItemRef : undefined}
                  href={v.href}
                  aria-current={current ? 'true' : undefined}
                  aria-label={isSaved ? `Verse ${asciiNum}, saved` : `Verse ${asciiNum}`}
                  className={`focus-ring group relative flex min-h-[44px] items-center justify-between gap-2 rounded-xl border px-2.5 py-1.5 text-left transition [[data-lite=true]_&]:transition-none ${
                    current
                      ? 'border-amber-700/45 bg-amber-100/85 text-amber-950 shadow-2xs dark:border-amber-400/45 dark:bg-amber-900/40 dark:text-amber-100'
                      : 'border-transparent text-dharma-text hover:border-stone-300/60 hover:bg-stone-100/70 dark:hover:border-stone-700/70 dark:hover:bg-stone-800/50'
                  }`}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`h-5 w-1 shrink-0 rounded-full ${
                        current ? 'bg-amber-700 dark:bg-amber-300' : 'bg-transparent group-hover:bg-stone-400/50'
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold tabular-nums">
                          {fullRef}
                        </span>
                        {isSaved && (
                          <span
                            aria-hidden="true"
                            data-saved-dot
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                              current ? 'bg-amber-800 dark:bg-amber-200' : 'bg-dharma-saffron'
                            }`}
                          />
                        )}
                      </span>
                      {v.preview && (
                        <span className="block truncate text-[11px] leading-snug text-dharma-muted">
                          {v.preview}
                        </span>
                      )}
                    </span>
                  </span>
                </VerseRouteLink>
              </li>
            );
          })}
        </ul>

        {filteredVerses.length === 0 && (
          <p className="shrink-0 py-3 text-center text-xs text-dharma-muted">
            No verse matches “{query.trim()}”.
          </p>
        )}

        {savedInChapter.size > 0 && (
          <p className="mt-2.5 flex shrink-0 items-center gap-1.5 border-t border-stone-300/40 dark:border-stone-800 pt-2 text-caption-1 text-dharma-muted">
            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-dharma-saffron" />
            <span>
              <span lang="hi" data-bi="hi" className="font-devanagari">सहेजे गए श्लोक</span>
              <span data-bi="sep"> · </span>
              <span data-bi="en">Saved verses</span>
            </span>
          </p>
        )}
      </nav>
    </div>
  );
}
