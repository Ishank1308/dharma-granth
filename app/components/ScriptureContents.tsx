'use client';

import { useMemo, useState } from 'react';
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

  const [query, setQuery] = useState('');
  const [rangeStart, setRangeStart] = useState<number | null>(null);

  const readableChapters = chapters.filter((chapter) => chapter.verseCount > 0);
  const firstChapter = readableChapters[0] ?? chapters[0];
  const chapterTotal = totalChapters || chapters.length;
  const progress = visit ? Math.min(100, Math.round((visit.chapterId / Math.max(chapterTotal, visit.chapterId)) * 100)) : 0;

  const showNavigator = chapters.length > 18;
  const ranges = useMemo(() => {
    if (!showNavigator) return [];
    const out: Array<{ start: number; end: number; label: string }> = [];
    for (let i = 0; i < chapters.length; i += RANGE_SIZE) {
      const slice = chapters.slice(i, i + RANGE_SIZE);
      const start = slice[0].id;
      const end = slice[slice.length - 1].id;
      out.push({ start, end, label: `${start}–${end}` });
    }
    return out;
  }, [chapters, showNavigator]);

  const visibleChapters = useMemo(() => {
    const q = query.trim().toLowerCase();
    return chapters.filter((ch) => {
      if (rangeStart !== null && !q) {
        const group = ranges.find((r) => r.start === rangeStart);
        if (group && (ch.id < group.start || ch.id > group.end)) return false;
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
              <h2 className="mt-2 truncate font-serif text-xl font-bold text-dharma-text">{visit.chapterTitle}</h2>
              <p className="mt-1 text-sm text-dharma-muted">Adhyay {visit.chapterId} of {chapterTotal} · {progress}% through this text</p>
              <div className="mt-3 h-1.5 max-w-sm overflow-hidden rounded-full bg-saffron-500/15" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label={`Reading progress ${progress}%`}>
                <div className="h-full rounded-full bg-gradient-to-r from-saffron-500 to-amber-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <Link href={resumeHref(visit)} className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-full bg-saffron-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-saffron-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Resume reading
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      <section aria-labelledby="contents-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="editorial-section-eyebrow">पाठ संरचना · Reading structure</p>
            <h2 id="contents-heading" className="editorial-section-title mt-2">Adhyay / Sections</h2>
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
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5" role="group" aria-label="Chapter range filter">
              <button
                type="button"
                aria-pressed={rangeStart === null}
                onClick={() => setRangeStart(null)}
                className={`focus-ring inline-flex min-h-[36px] shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold transition ${rangeStart === null
                  ? 'border-saffron-600 bg-dharma-saffron text-dharma-bg'
                  : 'border-dharma-border bg-dharma-bg text-dharma-muted hover:text-dharma-text'
                  }`}
              >
                All ({chapters.length})
              </button>
              {ranges.map((r) => {
                const active = rangeStart === r.start;
                return (
                  <button
                    key={r.start}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setRangeStart(active ? null : r.start)}
                    className={`focus-ring inline-flex min-h-[36px] shrink-0 items-center rounded-full border px-3 py-1 font-mono text-xs font-semibold transition ${active
                      ? 'border-saffron-600 bg-dharma-saffron text-dharma-bg'
                      : 'border-dharma-border bg-dharma-bg text-dharma-muted hover:text-dharma-text'
                      }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dharma-muted" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="अध्याय क्रमांक या नाम खोजें…"
                aria-label="Filter chapters by number or title"
                className="focus-ring min-h-[38px] w-full rounded-full border border-dharma-border bg-dharma-bg pl-8 pr-8 py-1.5 text-xs text-dharma-text placeholder:text-dharma-muted"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear chapter filter"
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-dharma-muted hover:text-dharma-text"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Chapters rise in as they scroll into view and lean toward the pointer: CSS only (app/motion.css),
            so a long contents list costs no script per item. */}
        {visibleChapters.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-dharma-border bg-dharma-card p-6 text-center text-sm text-dharma-muted">
            कोई अध्याय नहीं मिला।{' '}
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setRangeStart(null);
              }}
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
                <li key={chapter.id}>
                  <Link
                    href={chapterHref(scriptureId, chapter.id)}
                    data-tilt
                    className={`vibe-card group relative flex min-h-[104px] items-center gap-4 rounded-2xl border bg-dharma-card p-4 hover:border-saffron-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2 ${isLastRead ? 'border-saffron-400/70' : 'border-dharma-border'
                      }`}
                  >
                    <span className="vibe-num flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-saffron-500/10 font-serif text-lg font-bold text-saffron-700 dark:text-saffron-300">
                      {chapter.id}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif text-lg font-bold text-dharma-text group-hover:text-saffron-700 dark:group-hover:text-saffron-300">
                        {chapter.title}
                      </span>
                      {chapter.titleSanskrit && (
                        <span lang="sa" className="mt-0.5 block truncate font-devanagari text-sm text-dharma-muted">
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
        <Link href="/sources/" className="font-semibold text-saffron-700 underline decoration-saffron-300 underline-offset-4 hover:text-saffron-900 dark:text-saffron-300">View sources</Link>
        <Link href="/methodology/" className="font-semibold text-saffron-700 underline decoration-saffron-300 underline-offset-4 hover:text-saffron-900 dark:text-saffron-300">How this edition is prepared</Link>
      </div>
    </div>
  );
}
