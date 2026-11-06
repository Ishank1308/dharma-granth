'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
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

/**
 * Home-page "continue reading" row: the latest chapter with a progress ring and a resume link, and up to three other
 * recent texts. Renders nothing for a first visit; the hero already offers the way in.
 */
export function ContinueReading() {
  const visits = useRecentChapters();
  if (!visits || visits.length === 0) return null;

  const [latest, ...others] = visits;
  const total = Math.max(latest.totalChapters, latest.chapterId);
  const percent = Math.round((latest.chapterId / total) * 100);

  return (
    <section aria-labelledby="continue-reading-heading" className="reveal flex flex-col gap-3">
      <h2 id="continue-reading-heading" className="sr-only">
        <span lang="hi">पढ़ना जारी रखें</span> · <span>Continue reading</span>
      </h2>
      <article className="relative flex items-center gap-4 rounded-[22px] bg-dharma-card px-5 py-5 shadow-[0_2px_6px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] sm:gap-5 sm:px-7">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={latest.chapterId}
          aria-label={`अध्याय ${latest.chapterId} / ${total}`}
          className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full"
          style={{ background: `conic-gradient(var(--dharma-saffron) ${percent}%, color-mix(in srgb, var(--dharma-text) 10%, transparent) 0)` }}
        >
          <span className="grid h-[42px] w-[42px] place-items-center rounded-full bg-dharma-card text-xs font-semibold tabular-nums text-dharma-text">
            {latest.chapterId}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] text-dharma-muted">
            <span>Continue reading</span> <span aria-hidden="true">·</span>{' '}
            <span lang="hi" className="font-devanagari">पढ़ना जारी रखें</span> <span aria-hidden="true">·</span>{' '}
            <span lang="hi" className="font-devanagari">{timeAgo(latest.readAt)}</span>
          </p>
          <p className="mt-0.5 truncate text-[17px] font-semibold tracking-[-0.02em] text-dharma-text sm:text-[19px]">
            {latest.scriptureTitle} · {latest.chapterTitle}
          </p>
        </div>
        <Link href={resumeHref(latest)} className="hidden shrink-0 text-[17px] text-dharma-saffron hover:underline sm:inline">
          {latest.verseId ? `Resume at verse ${latest.verseId}` : 'Resume'} <span aria-hidden="true">›</span>
        </Link>
        <Link href={resumeHref(latest)} className="absolute inset-0 rounded-[22px] sm:hidden" aria-label={`Resume ${latest.chapterTitle}`} />
        <button
          type="button"
          onClick={() => forgetScripture(latest.scriptureId)}
          className="apple-icon-button relative h-9 w-9 shrink-0 text-dharma-muted"
          aria-label={`${latest.scriptureTitle} को इतिहास से हटाएँ (Remove from history)`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </article>

      {others.length > 0 && (
        <ul
          className="overflow-hidden rounded-[14px] bg-dharma-card"
          aria-label="अन्य हाल के ग्रंथ (Other recent texts)"
        >
          {others.slice(0, 3).map((v) => (
            <li key={v.scriptureId} className="border-b border-dharma-text/10 last:border-0">
              <Link href={resumeHref(v)} className="flex items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-dharma-text/[0.03]">
                <span className="min-w-0">
                  <span className="block truncate text-[17px] text-dharma-text">{v.scriptureTitle}</span>
                  <span className="block truncate text-[13px] text-dharma-muted">
                    अध्याय {v.chapterId} · {v.chapterTitle}
                  </span>
                </span>
                <span aria-hidden="true" className="text-xl text-dharma-muted/60">›</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
