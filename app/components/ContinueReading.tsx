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
      <article className="apple-card relative flex items-center gap-4 px-5 py-5 sm:gap-5 sm:px-7">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={latest.chapterId}
          aria-label={`अध्याय ${latest.chapterId} / ${total}`}
          className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full"
          style={{ background: `conic-gradient(var(--tint, var(--dharma-saffron)) ${percent}%, var(--fill-secondary) 0)` }}
        >
          <span
            className="grid h-[42px] w-[42px] place-items-center rounded-full text-xs font-semibold tabular-nums text-label-primary"
            style={{ backgroundColor: 'var(--surface-raised)' }}
          >
            {latest.chapterId}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-footnote text-label-secondary">
            <span>Continue reading</span> <span aria-hidden="true">·</span>{' '}
            <span lang="hi" className="font-devanagari">पढ़ना जारी रखें</span> <span aria-hidden="true">·</span>{' '}
            <span lang="hi" className="font-devanagari">{timeAgo(latest.readAt)}</span>
          </p>
          <p className="mt-0.5 truncate text-body font-semibold tracking-[-0.02em] text-label-primary sm:text-title-3">
            {latest.scriptureTitle} · {latest.chapterTitle}
          </p>
        </div>
        <Link
          href={resumeHref(latest)}
          className="apple-pill apple-pill-tinted hidden shrink-0 sm:inline-flex"
        >
          {latest.verseId ? `Verse ${latest.verseId} ›` : 'Resume ›'}
        </Link>
        <Link href={resumeHref(latest)} className="absolute inset-0 rounded-card sm:hidden" aria-label={`Resume ${latest.chapterTitle}`} />
        <button
          type="button"
          onClick={() => forgetScripture(latest.scriptureId)}
          className="apple-icon-button relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-label-tertiary transition hover:bg-fill-quaternary hover:text-label-primary"
          aria-label={`${latest.scriptureTitle} को इतिहास से हटाएँ (Remove from history)`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </article>

      {others.length > 0 && (
        <ul
          className="apple-group shadow-raised"
          aria-label="अन्य हाल के ग्रंथ (Other recent texts)"
        >
          {others.slice(0, 3).map((v) => (
            <li key={v.scriptureId}>
              <Link href={resumeHref(v)} className="apple-row">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-body font-medium text-label-primary">{v.scriptureTitle}</span>
                  <span className="block truncate text-footnote text-label-secondary">
                    अध्याय {v.chapterId} · {v.chapterTitle}
                  </span>
                </span>
                <span aria-hidden="true" className="apple-chevron">›</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
