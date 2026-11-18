'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, History, Search, X } from 'lucide-react';
import { useRecentChapters, type ChapterVisit } from '@/lib/reading-history';
import type { ChapterPreview } from '@/lib/read-seeded-chapters';

function chapterHref(scriptureId: string, chapterId: number): string {
  return `/scripture/${scriptureId}/chapter/${chapterId}/`;
}

function resumeHref(visit: ChapterVisit): string {
  return `${chapterHref(visit.scriptureId, visit.chapterId)}${visit.verseId ? `#verse-${visit.verseId}` : ''}`;
}

interface ScriptureContentsProps {
  scriptureId: string;
  chapters: ChapterPreview[];
  totalChapters: number;
}

const RANGE_SIZE = 20;

export function ScriptureContents({ scriptureId, chapters, totalChapters }: ScriptureContentsProps) {
  const visits = useRecentChapters();
  const visit = visits?.find((item) => item.scriptureId === scriptureId);
  const visitedIds = useMemo(
    () => new Set((visits ?? []).filter((v) => v.scriptureId === scriptureId).map((v) => v.chapterId)),
    [visits, scriptureId],
  );

  const lastReadLinkRef = useRef<HTMLAnchorElement>(null);
  const [query, setQuery] = useState('');
  // Large editions should not expand hundreds of chapter cards on first paint.
  // Readers can still switch to All or search across the entire published book.
  const defaultRangeStart = chapters.length > 60 ? chapters[0]?.id ?? null : null;
  const [rangeStart, setRangeStart] = useState<number | null>(defaultRangeStart);

  // Picking a range must clear the global search, otherwise the selected
  // range pill looks active while the search results still span every range.
  function chooseRange(next: number | null) {
    setQuery('');
    setRangeStart(next);
  }

  const readableChapters = chapters.filter((chapter) => chapter.verseCount > 0);
  const firstChapter = readableChapters[0];
  const chapterTotal = totalChapters || chapters.length;
  // A visited chapter tells us where reading last stopped, not how much was completed.
  // Use its position in the actual contents list, rather than treating its ID as a completion count.
  const lastPosition = visit ? chapters.findIndex((chapter) => chapter.id === visit.chapterId) : -1;
  const positionPercent = lastPosition >= 0 ? Math.round(((lastPosition + 1) / chapters.length) * 100) : 0;

  const showNavigator = chapters.length > 18;
  const ranges = useMemo(() => {
    if (!showNavigator) return [];
    const out: Array<{ start: number; end: number; startIndex: number; endIndex: number; label: string }> = [];
    for (let i = 0; i < chapters.length; i += RANGE_SIZE) {
      const slice = chapters.slice(i, i + RANGE_SIZE);
      const start = slice[0].id;
      const end = slice[slice.length - 1].id;
      out.push({ start, end, startIndex: i, endIndex: i + slice.length, label: `${start}–${end}` });
    }
    return out;
  }, [chapters, showNavigator]);

  const visibleChapters = useMemo(() => {
    const q = query.trim().toLowerCase();
    const selectedRange = rangeStart === null ? null : ranges.find((r) => r.start === rangeStart);
    return chapters.filter((ch, index) => {
      if (selectedRange && !q && (index < selectedRange.startIndex || index >= selectedRange.endIndex)) {
        return false;
      }
      if (!q) return true;
      return (
        String(ch.id) === q ||
        String(ch.id).includes(q) ||
        ch.title.toLowerCase().includes(q) ||
        (ch.titleSanskrit?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [chapters, query, rangeStart, ranges]);

  // A long book initially shows only its first 20 chapters. A reader who
  // returns to chapter 50 (for example) needs a direct route to that card,
  // not just a separate resume link into the chapter itself.
  function locateLastRead() {
    if (!visit || lastPosition < 0) return;
    const matchingRange = ranges.find((range) =>
      lastPosition >= range.startIndex && lastPosition < range.endIndex,
    );
    chooseRange(matchingRange?.start ?? null);

    // The new range is rendered after the click. Focus the actual chapter
    // link so keyboard/screen reader users land on the item they requested.
    window.requestAnimationFrame(() => {
      const link = lastReadLinkRef.current;
      if (!link) return;
      link.focus({ preventScroll: true });
      link.scrollIntoView({
        block: 'center',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    });
  }

  return (
    <div className="space-y-7">
      {visit && (
        <section aria-labelledby="continue-reading-heading" className="rounded-3xl border border-saffron-200/80 bg-gradient-to-br from-saffron-50 to-amber-50 p-5 shadow-sm dark:border-saffron-900/50 dark:from-saffron-950/30 dark:to-amber-950/20 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p id="continue-reading-heading" className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-saffron-700 dark:text-saffron-300">
                <History className="h-4 w-4" aria-hidden="true" />
                Continue reading
              </p>
              <h2 className="mt-2 line-clamp-2 break-words font-serif text-xl font-bold text-dharma-text">{visit.chapterTitle}</h2>
              <p className="mt-1 text-sm text-dharma-muted">Adhyay {visit.chapterId} of {chapterTotal} · last opened, not completion</p>
              {lastPosition >= 0 && (
                <div className="mt-3" aria-label={`Chapter position ${lastPosition + 1} of ${chapters.length}; this does not indicate completion`} role="img">
                  <div className="h-1.5 max-w-sm overflow-hidden rounded-full bg-saffron-500/15" aria-hidden="true">
                    <div className="h-full rounded-full bg-gradient-to-r from-saffron-500 to-amber-500" style={{ width: `${positionPercent}%` }} />
                  </div>
                </div>
              )}
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {showNavigator && chapters.length > 60 && lastPosition >= 0 && (
                <button
                  type="button"
                  onClick={locateLastRead}
                  aria-label={`Find chapter ${visit.chapterId} in contents`}
                  className="focus-ring inline-flex min-h-11 items-center justify-center rounded-full border border-dharma-border bg-dharma-card px-4 py-2 text-sm font-semibold text-dharma-text hover:border-dharma-saffron"
                >
                  सूची में देखें · Find in contents
                </button>
              )}
              <Link href={resumeHref(visit)} className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-full bg-saffron-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-saffron-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Resume reading
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="contents-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="editorial-section-eyebrow">पाठ संरचना · Reading structure</p>
            <h2 id="contents-heading" className="editorial-section-title mt-2 scroll-mt-24">Adhyay / Sections</h2>
          </div>
          {firstChapter && (
            <Link href={chapterHref(scriptureId, firstChapter.id)} className="vibe-cta cta-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-saffron-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-saffron-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Start reading
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>

        {/* Range Jump & Instant Filter for Long Scriptures (>18 chapters) */}
        {showNavigator && (
          <div className="mt-4 flex flex-col gap-2.5 rounded-2xl border border-dharma-border/80 bg-dharma-card p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-1.5" role="group" aria-label="Chapter range filter">
              <button
                type="button"
                aria-pressed={rangeStart === null}
                onClick={() => chooseRange(null)}
                className={`focus-ring inline-flex min-h-11 shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold transition ${rangeStart === null
                  ? 'border-saffron-600 bg-dharma-saffron text-dharma-bg'
                  : 'border-dharma-border bg-dharma-bg text-dharma-muted hover:text-dharma-text'
                  }`}
              >
                All ({chapters.length})
              </button>
              {ranges.length > 6 ? (
                <select
                  aria-label="Choose chapter range"
                  value={rangeStart === null ? '' : String(rangeStart)}
                  onChange={(event) => chooseRange(event.target.value ? Number(event.target.value) : null)}
                  className="focus-ring min-h-11 min-w-0 max-w-full rounded-full border border-dharma-border bg-dharma-bg px-3 text-sm font-semibold text-dharma-text"
                >
                  <option value="">Choose range</option>
                  {ranges.map((r) => <option key={r.start} value={r.start}>{r.label}</option>)}
                </select>
              ) : (
                <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto pb-0.5">
                  {ranges.map((r) => {
                    const active = rangeStart === r.start;
                    return (
                      <button
                        key={r.start}
                        type="button"
                        aria-pressed={active}
                        onClick={() => chooseRange(active ? null : r.start)}
                        className={`focus-ring inline-flex min-h-11 shrink-0 items-center rounded-full border px-3 py-1 font-mono text-xs font-semibold transition ${active
                          ? 'border-saffron-600 bg-dharma-saffron text-dharma-bg'
                          : 'border-dharma-border bg-dharma-bg text-dharma-muted hover:text-dharma-text'
                        }`}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dharma-muted" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.trim()) setRangeStart(null);
                }}
                placeholder="अध्याय क्रमांक या नाम खोजें…"
                aria-label="Filter chapters by number or title"
                className="focus-ring min-h-11 w-full rounded-full border border-dharma-border bg-dharma-bg pl-8 pr-12 py-1.5 text-xs text-dharma-text placeholder:text-dharma-muted"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setRangeStart(defaultRangeStart);
                  }}
                  aria-label="Clear chapter filter"
                  className="absolute right-0 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full text-dharma-muted hover:text-dharma-text"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {showNavigator && (
          <p role="status" aria-live="polite" className="mt-3 text-xs text-dharma-muted">
            {visibleChapters.length.toLocaleString('en-IN')} of {chapters.length.toLocaleString('en-IN')} sections shown
            {rangeStart !== null && !query.trim() && chapters.length > 60 ? ' · चुनें या सभी अध्याय देखें · Select a range or show all' : ''}
          </p>
        )}

        {/* Chapters rise in as they scroll into view and lean toward the pointer: CSS only (app/motion.css),
            so a long contents list costs no script per item. */}
        {visibleChapters.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-dharma-border bg-dharma-card p-6 text-center text-sm text-dharma-muted">
            कोई अध्याय नहीं मिला।{' '}
            <button
              type="button"
              onClick={() => chooseRange(null)}
              className="font-semibold text-dharma-saffron underline"
            >
              सभी अध्याय दिखाएँ
            </button>
          </div>
        ) : (
          <ol className="reveal-grid mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {visibleChapters.map((chapter) => {
              const isLastRead = visit?.chapterId === chapter.id;
              const isVisited = visitedIds.has(chapter.id);
              return (
                <li key={chapter.id} className="scroll-mt-24">
                  <Link
                    href={chapterHref(scriptureId, chapter.id)}
                    ref={isLastRead ? lastReadLinkRef : undefined}
                    data-tilt
                    className={`vibe-card group relative flex min-h-[104px] items-center gap-4 rounded-2xl border bg-dharma-card p-4 hover:border-saffron-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2 ${isLastRead ? 'border-saffron-400/70' : 'border-dharma-border'
                      }`}
                  >
                    <span className="vibe-num flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-saffron-500/10 font-serif text-lg font-bold text-saffron-700 dark:text-saffron-300">
                      {chapter.id}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block break-words font-serif text-lg font-bold text-dharma-text group-hover:text-saffron-700 dark:group-hover:text-saffron-300">
                        {chapter.title}
                      </span>
                      {chapter.titleSanskrit && (
                        <span lang="sa" className="mt-0.5 block line-clamp-2 break-words font-devanagari text-sm text-dharma-muted">
                          {chapter.titleSanskrit}
                        </span>
                      )}
                      <span className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-dharma-muted">
                        <span>{chapter.verseCount > 0 ? `${chapter.verseCount} verses` : 'Coming soon'}</span>
                        {isLastRead ? (
                          <span className="rounded-full bg-saffron-500/15 px-2 py-0.5 text-[10px] font-bold text-saffron-800 dark:text-saffron-300">
                            अंतिम पठित
                          </span>
                        ) : isVisited ? (
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" title="Visited" />
                        ) : null}
                      </span>
                    </span>
                    <ArrowRight className="h-5 w-5 shrink-0 text-dharma-muted transition group-hover:translate-x-1 group-hover:text-saffron-600" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-dharma-border pt-5 text-sm text-dharma-muted">
        <span>Sources and methodology</span>
        <Link href="/sources/" className="inline-flex min-h-[44px] items-center font-semibold text-saffron-700 underline decoration-saffron-300 underline-offset-4 hover:text-saffron-900 dark:text-saffron-300">View sources</Link>
        <Link href="/methodology/" className="inline-flex min-h-[44px] items-center font-semibold text-saffron-700 underline decoration-saffron-300 underline-offset-4 hover:text-saffron-900 dark:text-saffron-300">How this edition is prepared</Link>
      </div>
    </div>
  );
}
