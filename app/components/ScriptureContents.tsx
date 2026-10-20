'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BookOpen, History } from 'lucide-react';
import { useRecentChapters, type ChapterVisit } from '@/lib/reading-history';
import type { ChapterPreview } from '@/lib/read-seeded-chapters';

function chapterHref(scriptureId: string, chapterId: number): string {
  return `/scripture/${scriptureId}/chapter/${chapterId}`;
}

function resumeHref(visit: ChapterVisit): string {
  return `${chapterHref(visit.scriptureId, visit.chapterId)}${visit.verseId ? `#verse-${visit.verseId}` : ''}`;
}

interface ScriptureContentsProps {
  scriptureId: string;
  chapters: ChapterPreview[];
  totalChapters: number;
}

export function ScriptureContents({ scriptureId, chapters, totalChapters }: ScriptureContentsProps) {
  const reduceMotion = useReducedMotion();
  const visits = useRecentChapters();
  const visit = visits?.find((item) => item.scriptureId === scriptureId);
  const readableChapters = chapters.filter((chapter) => chapter.verseCount > 0);
  const firstChapter = readableChapters[0] ?? chapters[0];
  const chapterTotal = totalChapters || chapters.length;
  const progress = visit ? Math.min(100, Math.round((visit.chapterId / Math.max(chapterTotal, visit.chapterId)) * 100)) : 0;

  return (
    <div className="space-y-10">
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
            <Link href={resumeHref(visit)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-saffron-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-saffron-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2">
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
            <p className="mt-2 max-w-xl text-sm text-dharma-muted">Choose a traditional section to begin reading. Explanations and verse-level study open inside each section.</p>
          </div>
          {firstChapter && (
            <Link href={chapterHref(scriptureId, firstChapter.id)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-saffron-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-saffron-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Start reading
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>

        <ol className="mt-6 grid gap-3 sm:grid-cols-2">
          {chapters.map((chapter, index) => (
            <motion.li
              key={chapter.id}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.32, delay: Math.min(index * 0.035, 0.28), ease: 'easeOut' }}
              whileHover={reduceMotion ? undefined : { y: -3 }}
              whileTap={reduceMotion ? undefined : { scale: 0.995 }}
            >
              <Link href={chapterHref(scriptureId, chapter.id)} className="group flex min-h-[104px] items-center gap-4 rounded-2xl border border-dharma-border bg-dharma-card p-4 transition duration-200 hover:-translate-y-0.5 hover:border-saffron-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-saffron-500/10 font-serif text-lg font-bold text-saffron-700 dark:text-saffron-300">{chapter.id}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-lg font-bold text-dharma-text group-hover:text-saffron-700 dark:group-hover:text-saffron-300">{chapter.title}</span>
                  {chapter.titleSanskrit && <span lang="sa" className="mt-0.5 block truncate font-devanagari text-sm text-dharma-muted">{chapter.titleSanskrit}</span>}
                  <span className="mt-2 block text-xs font-semibold text-dharma-muted">{chapter.verseCount > 0 ? `${chapter.verseCount} verses` : 'Coming soon'}</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-dharma-muted transition group-hover:translate-x-1 group-hover:text-saffron-600" aria-hidden="true" />
              </Link>
            </motion.li>
          ))}
        </ol>
      </section>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-dharma-border pt-5 text-sm text-dharma-muted">
        <span>Sources and methodology</span>
        <Link href="/sources/" className="font-semibold text-saffron-700 underline decoration-saffron-300 underline-offset-4 hover:text-saffron-900 dark:text-saffron-300">View sources</Link>
        <Link href="/methodology/" className="font-semibold text-saffron-700 underline decoration-saffron-300 underline-offset-4 hover:text-saffron-900 dark:text-saffron-300">How this edition is prepared</Link>
      </div>
    </div>
  );
}
