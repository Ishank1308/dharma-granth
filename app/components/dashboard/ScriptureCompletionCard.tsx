'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, Compass } from 'lucide-react';
import type { ChapterVisit } from '@/lib/reading-history';

interface Props {
  recordedVerseCount: number;
  recentChapters: ChapterVisit[];
}

export function ScriptureCompletionCard({ recordedVerseCount, recentChapters }: Props) {
  return (
    <section aria-labelledby="reading-overview-heading" className="w-full">
      <div className="rounded-3xl border border-dharma-border bg-dharma-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-dharma-border/60 pb-4">
          <div>
            <div className="mb-1 flex items-center gap-2 text-saffron-700 dark:text-saffron-300">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-wider">Reading overview</span>
            </div>
            <h2 id="reading-overview-heading" className="font-serif text-2xl font-bold text-dharma-text">
              Recent reading · हाल का स्वाध्याय
            </h2>
            <p className="mt-1 text-sm text-dharma-muted">
              {recordedVerseCount > 0
                ? `${recordedVerseCount} distinct verses in your recent activity log.`
                : 'No individual verse pages are recorded yet; your last-opened chapters still appear below.'}{' '}
              Activity stays in this browser and is kept for up to 120 days.
            </p>
          </div>
          <Link
            href="/scriptures"
            className="inline-flex min-h-11 items-center gap-1 rounded-full border border-dharma-border px-4 text-sm font-semibold text-dharma-text hover:border-saffron-300 hover:text-saffron-700"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            Browse scriptures
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {recentChapters.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-dharma-border p-5 text-sm text-dharma-muted">
            Chapters you open will appear here so you can return to them.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {recentChapters.map((visit) => {
              const verseHref = `/scripture/${visit.scriptureId}/chapter/${visit.chapterId}${visit.verseId ? `#verse-${visit.verseId}` : ''}`;
              return (
                <li key={visit.scriptureId}>
                  <Link
                    href={verseHref}
                    className="group flex min-h-20 items-center justify-between gap-3 rounded-2xl border border-dharma-border bg-dharma-panel/40 p-4 transition hover:border-saffron-300 hover:bg-dharma-card"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-serif font-bold text-dharma-text group-hover:text-saffron-700">
                        {visit.scriptureTitle}
                      </span>
                      <span className="block truncate text-sm text-dharma-muted">
                        {visit.chapterTitle}{visit.verseId ? ` · Verse ${visit.verseId}` : ''}
                      </span>
                      <time dateTime={visit.readAt} className="mt-1 block text-xs text-dharma-muted">
                        Last opened {new Date(visit.readAt).toLocaleDateString(undefined, { numberingSystem: 'latn' })}
                      </time>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-dharma-muted group-hover:text-saffron-600" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
