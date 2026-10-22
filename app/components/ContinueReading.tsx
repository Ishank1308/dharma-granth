'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, History, X } from 'lucide-react';
import { forgetScripture, useRecentChapters, type ChapterVisit } from '@/lib/reading-history';

function chapterHref(v: ChapterVisit, chapterId = v.chapterId): string {
  return `/scripture/${v.scriptureId}/chapter/${chapterId}`;
}

/** Resume in the chapter at the saved verse (not the single-verse page). */
function resumeHref(v: ChapterVisit): string {
  return `${chapterHref(v)}${v.verseId ? `#verse-${v.verseId}` : ''}`;
}

function timeAgo(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (!Number.isFinite(minutes) || minutes < 1) return 'अभी';
  if (minutes < 60) return `${minutes} मिनट पहले`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} घंटे पहले`;
  const days = Math.round(hours / 24);
  return days === 1 ? 'कल' : `${days} दिन पहले`;
}

/** Home-page "continue reading" strip; renders a beginner-friendly Start Here card when no history exists. */
export function ContinueReading() {
  const visits = useRecentChapters();

  // If no visits recorded yet, render the beginner-friendly Start Here card.
  if (!visits || visits.length === 0) {
    return (
      <section
        aria-labelledby="start-here-heading"
        className="border-b border-dharma-border bg-gradient-to-b from-dharma-card-soft/60 to-dharma-bg py-10 sm:py-12"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-amber-200/80 bg-dharma-card p-6 shadow-sm dark:border-amber-900/40 sm:p-8 md:p-10">
            {/* Subtle mandala watermark */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-amber-500/10 opacity-30 mandala-bg" />

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-2 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-saffron-600 animate-pulse" />
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-saffron-700 dark:text-saffron-400">
                    पहला कदम · New to Dharma Granth?
                  </p>
                </div>
                <h2
                  id="start-here-heading"
                  className="font-serif text-2xl font-bold text-dharma-text sm:text-3xl"
                >
                  Start Here — Recommended Paths for Beginners
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-dharma-muted sm:text-base">
                  Sacred literature can feel vast. We recommend starting with one of these three gentle, profound doorways into the wisdom tradition:
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <Link
                    href="/scripture/bhagavadgita/chapter/2"
                    className="group rounded-2xl border border-dharma-border bg-dharma-bg/70 p-4 transition hover:border-saffron-400 hover:bg-dharma-card"
                  >
                    <span className="block text-xs font-bold uppercase tracking-wider text-saffron-700">
                      The Foundation
                    </span>
                    <h3 className="mt-1 font-serif text-base font-bold text-dharma-text group-hover:text-saffron-700">
                      Gita — Chapter 2
                    </h3>
                    <p className="mt-1 text-xs text-dharma-muted line-clamp-2">
                      Sankhya Yoga: The eternal soul, selfless action, and mental equanimity.
                    </p>
                  </Link>

                  <Link
                    href="/scripture/ishavasya"
                    className="group rounded-2xl border border-dharma-border bg-dharma-bg/70 p-4 transition hover:border-saffron-400 hover:bg-dharma-card"
                  >
                    <span className="block text-xs font-bold uppercase tracking-wider text-amber-700">
                      Concise Wisdom
                    </span>
                    <h3 className="mt-1 font-serif text-base font-bold text-dharma-text group-hover:text-saffron-700">
                      Isha Upanishad
                    </h3>
                    <p className="mt-1 text-xs text-dharma-muted line-clamp-2">
                      Universal oneness and contentment across just 18 poetic verses.
                    </p>
                  </Link>

                  <a
                    href="#life-situations"
                    className="group rounded-2xl border border-dharma-border bg-dharma-bg/70 p-4 transition hover:border-saffron-400 hover:bg-dharma-card"
                  >
                    <span className="block text-xs font-bold uppercase tracking-wider text-rose-700">
                      Practical Need
                    </span>
                    <h3 className="mt-1 font-serif text-base font-bold text-dharma-text group-hover:text-saffron-700">
                      Life Situations
                    </h3>
                    <p className="mt-1 text-xs text-dharma-muted line-clamp-2">
                      Ancient insights on stress, fear, duty, relationships, and grief.
                    </p>
                  </a>
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/scripture/bhagavadgita/chapter/2"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-saffron-600 to-amber-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:from-saffron-700 hover:to-amber-700"
                >
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  <span>Begin with Gita Ch. 2</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/scriptures"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-dharma-border bg-dharma-card px-6 py-3 text-sm font-semibold text-dharma-text transition hover:border-saffron-300 hover:text-saffron-700"
                >
                  <span>Browse Full Library</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const [latest, ...others] = visits;
  const total = Math.max(latest.totalChapters, latest.chapterId);
  const percent = Math.round((latest.chapterId / total) * 100);
  const hasNext = latest.chapterId < total;

  return (
    <section
      aria-labelledby="continue-reading-heading"
      className="border-b border-dharma-border bg-dharma-card/60 py-8"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <h2
          id="continue-reading-heading"
          className="mb-4 flex items-center gap-2 text-xs font-bold text-saffron-700"
        >
          <History className="h-4 w-4" aria-hidden="true" />
          {/* Letter-spacing on the Latin half only; it breaks Devanagari. */}
          पढ़ना जारी रखें ·{' '}
          <span className="uppercase tracking-[0.2em]">Continue reading</span>
        </h2>

        {/* grid-cols-1 (minmax(0,1fr)), not the implicit auto track: otherwise a
            long nowrap title widens the track past the viewport on phones. */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <article className="relative rounded-2xl border border-saffron-200 bg-dharma-card p-5 shadow-sm sm:p-6">
            <button
              type="button"
              onClick={() => forgetScripture(latest.scriptureId)}
              className="absolute right-0.5 top-0.5 rounded-lg p-3.5 text-dharma-muted transition hover:bg-dharma-bg hover:text-dharma-text"
              aria-label={`${latest.scriptureTitle} को इतिहास से हटाएँ (Remove from history)`}
            >
              <X className="h-4 w-4" />
            </button>
            <p className="pr-9 text-sm font-semibold text-dharma-muted">
              {latest.scriptureTitle}
              {latest.scriptureTitleSanskrit && (
                <span lang="sa" className="ml-2 font-devanagari">
                  {latest.scriptureTitleSanskrit}
                </span>
              )}
            </p>
            <h3 className="mt-1 font-serif text-2xl font-bold text-dharma-text">
              {latest.chapterTitle}
            </h3>
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-xs font-semibold text-dharma-muted">
                <span>
                  अध्याय {latest.chapterId} / {total}
                </span>
                <span>{timeAgo(latest.readAt)}</span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-saffron-500/15"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={latest.chapterId}
                aria-label={`अध्याय ${latest.chapterId} / ${total}`}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-saffron-500 to-amber-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={resumeHref(latest)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-r from-saffron-600 to-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:from-saffron-700 hover:to-amber-700"
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                {latest.verseId ? `श्लोक ${latest.verseId} से जारी रखें` : 'जारी रखें'}
              </Link>
              {hasNext && (
                <Link
                  href={chapterHref(latest, latest.chapterId + 1)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-dharma-border px-5 py-2.5 text-sm font-semibold text-dharma-text transition hover:border-saffron-300 hover:text-saffron-700"
                >
                  अगला अध्याय {latest.chapterId + 1}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
            </div>
          </article>

          {others.length > 0 && (
            <ul className="grid grid-cols-1 content-start gap-2" aria-label="अन्य हाल के ग्रंथ (Other recent texts)">
              {others.slice(0, 3).map((v) => (
                <li key={v.scriptureId}>
                  <Link
                    href={resumeHref(v)}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-dharma-border bg-dharma-card px-4 py-3 transition hover:border-saffron-300"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-dharma-text group-hover:text-saffron-700">
                        {v.scriptureTitle}
                      </span>
                      <span className="block truncate text-xs text-dharma-muted">
                        अध्याय {v.chapterId} · {v.chapterTitle}
                      </span>
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-dharma-muted transition group-hover:translate-x-0.5 group-hover:text-saffron-600"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
