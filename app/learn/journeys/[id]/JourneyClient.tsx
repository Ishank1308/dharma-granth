'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Share2,
  ArrowLeft,
  ArrowRight,
  Flame,
  Sparkles,
  Trophy,
  CheckCircle2,
  BookOpen,
  Clock,
  Compass,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import { REVIEW_LABEL } from '@/data/study-content';
import type { JourneyLesson, ReadingJourney } from '@/data/reading-journeys';
import { cleanVerseField, verseLines } from '@/lib/verse-format';
import { useJourneyProgress } from '../JourneyProgress';
import { useSadhanaStreak } from '@/lib/sadhana-streak';

export interface LessonView extends JourneyLesson {
  reference: string;
  href: string;
  sanskrit: string;
  translation: string;
  translationIsAi: boolean;
}

export function JourneyClient({ journey, lessons }: { journey: ReadingJourney; lessons: LessonView[] }) {
  const { progress, ready, toggle, reset } = useJourneyProgress();
  const { streak } = useSadhanaStreak();
  const done = progress[journey.id] ?? [];
  const next = lessons.find((l) => !done.includes(l.id));
  const isAllComplete = done.length >= lessons.length && lessons.length > 0;
  const percentComplete = Math.round((done.length / lessons.length) * 100);

  const [copied, setCopied] = useState(false);

  const shareText = encodeURIComponent(
    `🕉️ *${journey.title} (${journey.titleHi})*\n${journey.objective}\n\n📖 Read with me on Dharma Granth:\nhttps://dharmagranth.in/learn/journeys/${journey.id}/`
  );

  return (
    <main id="main" className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 space-y-8">
      {/* ─── TOP BREADCRUMB & SHARE ────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-dharma-border/60 pb-4">
        <Link
          href="/learn/journeys/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-dharma-muted hover:text-saffron-800 dark:hover:text-saffron-300 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>All Journeys · सभी यात्राएँ</span>
        </Link>

        <a
          href={`https://api.whatsapp.com/send?text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white transition shadow-2xs"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>Share</span>
        </a>
      </div>

      {/* ─── JOURNEY HEADER CARD ───────────────────────────────────────────── */}
      <section className="space-y-4 rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{journey.icon || '📜'}</span>
              <span className="rounded-full bg-saffron-500/10 px-3 py-0.5 text-2xs font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-300">
                {journey.category || 'Spiritual Pathway'}
              </span>
              {journey.difficulty && (
                <span className="rounded-full bg-dharma-panel px-2.5 py-0.5 text-2xs font-bold uppercase tracking-wider text-dharma-muted">
                  {journey.difficulty}
                </span>
              )}
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-dharma-text">
              {journey.title}
            </h1>
            <p lang="hi" className="font-devanagari text-base sm:text-lg text-dharma-muted">
              {journey.titleHi}
            </p>
          </div>

          {streak.currentStreak > 0 && (
            <div className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-900 dark:text-amber-200 self-start sm:self-center">
              <Flame className="h-4 w-4 text-amber-600" />
              <span>{streak.currentStreak} Day Streak</span>
            </div>
          )}
        </div>

        <p className="text-sm sm:text-base text-dharma-text leading-relaxed">
          {journey.objective}
        </p>

        {/* Progress Bar & Milestone Summary */}
        <div className="space-y-2 pt-2 border-t border-dharma-border/60">
          <div className="flex items-center justify-between text-xs font-semibold text-dharma-muted">
            <span>
              {!ready
                ? 'Loading...'
                : isAllComplete
                ? 'All readings completed! 🎉'
                : `Progress: ${done.length} of ${lessons.length} readings (${percentComplete}%)`}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>~{journey.minutesPerLesson} min / reading</span>
            </span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-dharma-border/60">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isAllComplete ? 'bg-emerald-600' : 'bg-saffron-600'
              }`}
              style={{ width: `${percentComplete}%` }}
            />
          </div>

          {/* Duolingo-style Milestone Stepper */}
          <div className="flex items-center justify-between gap-1 pt-2 overflow-x-auto no-scrollbar">
            {lessons.map((l, idx) => {
              const isDone = done.includes(l.id);
              const isCurrent = next?.id === l.id;
              return (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-2xs font-semibold whitespace-nowrap transition ${
                    isDone
                      ? 'border-emerald-600/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200'
                      : isCurrent
                      ? 'border-saffron-500 bg-saffron-600 text-white shadow-2xs'
                      : 'border-dharma-border bg-dharma-panel text-dharma-muted hover:border-saffron-300'
                  }`}
                >
                  {isDone ? (
                    <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                  <span>Reading {idx + 1}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── ALL COMPLETE CELEBRATION CARD ─────────────────────────────────── */}
      {isAllComplete && (
        <section className="rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            <Trophy className="h-4 w-4" />
            <span>स्वाध्याय सिद्धि · Pathway Completed</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-dharma-text">
            Congratulations! You have completed {journey.title}.
          </h2>
          <p className="text-sm text-dharma-text max-w-2xl leading-relaxed">
            You have walked this pathway of wisdom verse by verse. These teachings are living companions—return to
            them anytime you seek clarity, courage, or calm.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/learn/journeys/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 px-4 py-2 text-xs font-bold text-white transition shadow-xs"
            >
              <span>Explore Next Journey</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => reset(journey.id)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-dharma-border bg-dharma-card px-4 py-2 text-xs font-bold text-dharma-muted hover:text-dharma-text transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset & Read Again</span>
            </button>
          </div>
        </section>
      )}

      {/* ─── LESSONS LIST ──────────────────────────────────────────────────── */}
      <ol className="space-y-6">
        {lessons.map((l, i) => {
          const isDone = done.includes(l.id);
          const isCurrent = next?.id === l.id;

          return (
            <li
              key={l.id}
              id={l.id}
              className={`scroll-mt-24 rounded-3xl border bg-dharma-card p-6 sm:p-8 transition space-y-4 shadow-xs ${
                isDone
                  ? 'border-emerald-500/30'
                  : isCurrent
                  ? 'border-saffron-500/60 ring-2 ring-saffron-500/20'
                  : 'border-dharma-border'
              }`}
            >
              {/* Lesson Card Header */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-dharma-border/60 pb-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-saffron-500/10 px-2.5 py-0.5 text-2xs font-bold text-saffron-800 dark:text-saffron-300">
                      Reading {i + 1} of {lessons.length}
                    </span>
                    {isDone && (
                      <span className="inline-flex items-center gap-1 text-2xs font-bold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-dharma-text">
                    <Link
                      href={l.href}
                      className="hover:underline text-saffron-800 dark:text-saffron-300"
                    >
                      {l.reference}
                    </Link>
                  </h2>
                </div>

                <Link
                  href={l.href}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-dharma-muted hover:text-saffron-800 dark:hover:text-saffron-300 transition"
                >
                  <span>Open 12-Layer Verse Experience</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Original Sanskrit Figure */}
              {l.sanskrit ? (
                <figure className="rounded-2xl border-2 border-amber-700/35 bg-amber-50/70 p-5 dark:border-amber-500/30 dark:bg-amber-950/25 space-y-2">
                  <figcaption className="text-2xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                    मूल श्लोक (Original Sanskrit)
                  </figcaption>
                  <p
                    lang="sa"
                    className="text-center font-devanagari text-xl sm:text-2xl font-semibold leading-[2.1] text-amber-950 dark:text-amber-100"
                  >
                    {verseLines(cleanVerseField(l.sanskrit)).map((line, k) => (
                      <span key={k} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                  {l.translation && (
                    <p
                      lang="en"
                      className="mt-3 border-t border-amber-700/20 pt-2 font-serif text-sm sm:text-base text-dharma-text leading-relaxed"
                    >
                      <span className="mr-2 text-2xs font-bold uppercase tracking-wider text-dharma-muted">
                        Literal Translation
                      </span>
                      {cleanVerseField(l.translation)}
                    </p>
                  )}
                </figure>
              ) : (
                <p className="text-sm text-dharma-muted">
                  The verse text could not be loaded here; open the verse page.
                </p>
              )}

              {/* Study Breakdown Sections */}
              <div className="grid gap-3.5 sm:grid-cols-2 text-xs sm:text-sm pt-1">
                <section className="rounded-2xl border border-dharma-border bg-dharma-panel p-4 space-y-1">
                  <h3 className="font-bold uppercase tracking-wider text-2xs text-dharma-muted">
                    Context (प्रसंग)
                  </h3>
                  <p className="text-dharma-text leading-relaxed">{l.context}</p>
                </section>

                <section className="rounded-2xl border border-sky-500/30 bg-sky-50/50 dark:bg-sky-950/20 p-4 space-y-1">
                  <h3 className="font-bold uppercase tracking-wider text-2xs text-sky-800 dark:text-sky-300">
                    Simple Explanation (सरल अर्थ)
                  </h3>
                  <p className="text-dharma-text leading-relaxed">{l.explanation}</p>
                </section>

                <section className="rounded-2xl border border-saffron-500/30 bg-saffron-500/5 p-4 space-y-1 sm:col-span-2">
                  <h3 className="font-bold uppercase tracking-wider text-2xs text-saffron-800 dark:text-saffron-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Pause and Think (आत्म-चिंतन)</span>
                  </h3>
                  <p className="font-serif text-sm sm:text-base font-semibold text-dharma-text leading-relaxed">
                    &ldquo;{l.reflection}&rdquo;
                  </p>
                </section>

                {l.activity && (
                  <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-1 sm:col-span-2">
                    <h3 className="font-bold uppercase tracking-wider text-2xs text-emerald-800 dark:text-emerald-300">
                      Optional Action Step (दैनिक अभ्यास)
                    </h3>
                    <p className="text-dharma-text leading-relaxed">{l.activity}</p>
                  </section>
                )}
              </div>

              {/* Mark Complete Button */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggle(journey.id, l.id)}
                  aria-pressed={isDone}
                  className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-5 text-xs sm:text-sm font-bold transition shadow-2xs ${
                    isDone
                      ? 'border border-emerald-700 bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'border border-saffron-500 bg-saffron-600 text-white hover:bg-saffron-700'
                  }`}
                >
                  <Check className="h-4 w-4" />
                  <span>{isDone ? 'Reading Completed (पठन पूर्ण)' : 'Mark as Read & Done'}</span>
                </button>

                {i < lessons.length - 1 && (
                  <a
                    href={`#${lessons[i + 1].id}`}
                    className="text-xs text-dharma-muted hover:text-saffron-800 dark:hover:text-saffron-300 flex items-center gap-1"
                  >
                    <span>Next reading</span>
                    <ArrowRight className="h-3 w-3" />
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* ─── FOOTER SOURCES & RELATED READING ──────────────────────────────── */}
      <section aria-labelledby="jr-rel" className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 space-y-4 text-xs sm:text-sm">
        <h2 id="jr-rel" className="font-serif text-lg font-bold text-dharma-text">
          Related Reading & Exploration
        </h2>
        <ul className="flex flex-wrap gap-2">
          {journey.related.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="inline-flex items-center gap-1 rounded-xl border border-dharma-border bg-dharma-panel px-3.5 py-2 text-xs font-semibold text-dharma-text hover:border-saffron-400 transition"
              >
                <span>{r.label}</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-t border-dharma-border/60 pt-4 space-y-1 text-2xs text-dharma-muted">
          <p className="font-semibold text-dharma-text">Sources & Transparency:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            {journey.sources.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
