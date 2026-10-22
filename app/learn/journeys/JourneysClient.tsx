'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Flame,
  Sparkles,
  BookOpen,
  Clock,
  Compass,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Play,
  Trophy,
  Heart,
  Shield,
  RotateCcw,
  Sun,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { READING_JOURNEYS, type ReadingJourney, type JourneyCategory } from '@/data/reading-journeys';
import { useJourneyProgress } from './JourneyProgress';
import { useSadhanaStreak } from '@/lib/sadhana-streak';

export function JourneysClient() {
  const { progress, ready } = useJourneyProgress();
  const { streak, ready: streakReady } = useSadhanaStreak();
  const [selectedCategory, setSelectedCategory] = useState<JourneyCategory | 'all'>('all');

  // Filter journeys by category
  const filteredJourneys = useMemo(() => {
    if (selectedCategory === 'all') return READING_JOURNEYS;
    return READING_JOURNEYS.filter((j) => j.category === selectedCategory);
  }, [selectedCategory]);

  // Find active / in-progress journeys for "Resume Learning"
  const activeJourney = useMemo(() => {
    if (!ready) return null;
    for (const j of READING_JOURNEYS) {
      const done = progress[j.id] ?? [];
      if (done.length > 0 && done.length < j.lessons.length) {
        const nextLessonIndex = j.lessons.findIndex((l) => !done.includes(l.id));
        return {
          journey: j,
          completedCount: done.length,
          totalCount: j.lessons.length,
          percent: Math.round((done.length / j.lessons.length) * 100),
          nextLesson: nextLessonIndex >= 0 ? j.lessons[nextLessonIndex] : j.lessons[0],
          nextLessonIndex: nextLessonIndex >= 0 ? nextLessonIndex + 1 : 1,
        };
      }
    }
    return null;
  }, [progress, ready]);

  // Total lessons completed across all journeys
  const totalCompletedLessons = useMemo(() => {
    if (!ready) return 0;
    return Object.values(progress).reduce((acc, curr) => acc + (curr?.length || 0), 0);
  }, [progress, ready]);

  // Next recommendation based on completed/active journeys
  const recommendation = useMemo(() => {
    if (!ready) return READING_JOURNEYS[0];
    const completedIds = Object.keys(progress).filter(
      (k) => (progress[k]?.length || 0) >= (READING_JOURNEYS.find((j) => j.id === k)?.lessons.length || 99)
    );
    if (!completedIds.includes('beginner-spirituality')) {
      return READING_JOURNEYS.find((j) => j.id === 'beginner-spirituality') ?? READING_JOURNEYS[0];
    }
    if (!completedIds.includes('bhagavad-gita-foundations')) {
      return READING_JOURNEYS.find((j) => j.id === 'bhagavad-gita-foundations') ?? READING_JOURNEYS[1];
    }
    if (!completedIds.includes('karma-yoga')) {
      return READING_JOURNEYS.find((j) => j.id === 'karma-yoga') ?? READING_JOURNEYS[3];
    }
    if (!completedIds.includes('meditation-journey')) {
      return READING_JOURNEYS.find((j) => j.id === 'meditation-journey') ?? READING_JOURNEYS[6];
    }
    return READING_JOURNEYS.find((j) => j.id === 'stress-and-anxiety-relief') ?? READING_JOURNEYS[9];
  }, [progress, ready]);

  return (
    <main id="main" className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 space-y-8">
      {/* ─── SACRED HERO HEADER ────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-300">
              <Compass className="h-3.5 w-3.5 text-saffron-600" />
              <span>Structured Spiritual Pathways · स्वाध्याय पथ</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-dharma-text tracking-tight">
              Guided Learning Journeys
            </h1>
            <p lang="hi" className="font-devanagari text-lg sm:text-xl text-dharma-muted">
              दैनिक जीवन में ज्ञान, समत्व और साधना का क्रमिक मार्ग
            </p>
          </div>

          {/* Sadhana Streak & Stats Header Card */}
          <div className="flex items-center gap-3 rounded-2xl border border-dharma-border bg-dharma-card p-3.5 sm:p-4 shadow-xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Flame className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold text-dharma-text">
                  {streakReady && streak.currentStreak > 0 ? `${streak.currentStreak} Day Streak` : 'Daily Sadhana'}
                </span>
                {streakReady && streak.currentStreak > 0 && (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-2xs font-bold text-amber-800 dark:text-amber-300">
                    🔥 Active
                  </span>
                )}
              </div>
              <p className="text-2xs text-dharma-muted">
                {totalCompletedLessons} readings completed · Private to this browser
              </p>
            </div>
          </div>
        </div>

        <p className="max-w-3xl text-sm sm:text-base text-dharma-muted leading-relaxed">
          A learning journey is an orderly, bite-sized study through authentic scripture. Each lesson brings one verse,
          clear context, a plain explanation, and an actionable reflection question. Progress is calm and non-judgmental:
          a missed day is simply a quiet day.
        </p>
      </section>

      {/* ─── RESUME LEARNING HERO CARD ────────────────────────────────────── */}
      {activeJourney && (
        <section
          aria-labelledby="resume-heading"
          className="rounded-3xl border-2 border-saffron-500/40 bg-gradient-to-br from-saffron-500/15 via-amber-500/10 to-transparent p-5 sm:p-7 shadow-sm transition"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-300">
                <Play className="h-3.5 w-3.5 fill-current" />
                <span id="resume-heading">Resume Where You Left Off · अध्ययन जारी रखें</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeJourney.journey.icon || '📖'}</span>
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-dharma-text">
                    {activeJourney.journey.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-dharma-muted">
                    Next: Reading {activeJourney.nextLessonIndex} of {activeJourney.totalCount}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-md pt-1 space-y-1">
                <div className="flex justify-between text-2xs font-semibold text-dharma-muted">
                  <span>{activeJourney.percent}% Completed</span>
                  <span>{activeJourney.completedCount} / {activeJourney.totalCount} Verses</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-dharma-border/60">
                  <div
                    className="h-full rounded-full bg-saffron-600 transition-all duration-500"
                    style={{ width: `${activeJourney.percent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="self-start sm:self-center">
              <Link
                href={`/learn/journeys/${activeJourney.journey.id}/#${activeJourney.nextLesson.id}`}
                className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-saffron-600 hover:bg-saffron-700 px-5 py-3 text-sm font-bold text-white transition shadow-sm"
              >
                <span>Continue Reading</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── CATEGORY FILTER PILLS ────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
            Explore by Spiritual Focus ({filteredJourneys.length} Pathways)
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Pathways', labelHi: 'सभी यात्राएँ', icon: Layers },
            { id: 'foundations', label: 'Foundations', labelHi: 'मूल आधार', icon: BookOpen },
            { id: 'yoga', label: 'Yoga Paths', labelHi: 'योग मार्ग', icon: Sun },
            { id: 'life', label: 'Life & Students', labelHi: 'जीवन व एकाग्रता', icon: GraduationCap },
            { id: 'healing', label: 'Peace & Healing', labelHi: 'शांति व संबल', icon: Heart },
          ].map((cat) => {
            const active = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as JourneyCategory | 'all')}
                className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-semibold transition ${
                  active
                    ? 'border-saffron-500 bg-saffron-600 text-white shadow-xs'
                    : 'border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{cat.label}</span>
                <span className={active ? 'text-white/80' : 'text-dharma-muted font-devanagari text-2xs'}>
                  · {cat.labelHi}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── JOURNEY CARDS GRID ───────────────────────────────────────────── */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredJourneys.map((j) => {
          const done = ready ? (progress[j.id] ?? []).length : 0;
          const total = j.lessons.length;
          const percent = total > 0 ? Math.round((done / total) * 100) : 0;
          const isComplete = done >= total && total > 0;
          const inProgress = done > 0 && done < total;

          return (
            <article
              key={j.id}
              className={`flex flex-col justify-between rounded-3xl border bg-dharma-card p-5 sm:p-6 transition hover:border-saffron-400 hover:shadow-sm ${
                isComplete
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : inProgress
                  ? 'border-saffron-500/40 bg-saffron-500/5'
                  : 'border-dharma-border'
              }`}
            >
              <div className="space-y-3">
                {/* Card Top: Icon, Difficulty, Time */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-2xl">{j.icon || '📜'}</span>
                  <div className="flex items-center gap-1.5">
                    {j.difficulty && (
                      <span className="rounded-full bg-dharma-panel px-2.5 py-0.5 text-2xs font-bold uppercase tracking-wider text-dharma-muted">
                        {j.difficulty}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-2xs text-dharma-muted">
                      <Clock className="h-3 w-3" />
                      <span>{j.minutesPerLesson}m / day</span>
                    </span>
                  </div>
                </div>

                {/* Card Title & Objective */}
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-dharma-text leading-snug">
                    <Link href={`/learn/journeys/${j.id}`} className="hover:underline">
                      {j.title}
                    </Link>
                  </h2>
                  <p lang="hi" className="font-devanagari text-xs sm:text-sm text-dharma-muted">
                    {j.titleHi}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-dharma-muted leading-relaxed line-clamp-2">
                  {j.objective}
                </p>

                {/* Duolingo-style Lesson Milestone Dots */}
                <div className="pt-2">
                  <div className="flex items-center gap-1.5">
                    {j.lessons.slice(0, 8).map((l, idx) => {
                      const stepDone = ready && (progress[j.id] ?? []).includes(l.id);
                      return (
                        <div
                          key={l.id}
                          title={`Reading ${idx + 1}: ${l.expect}`}
                          className={`h-2 flex-1 rounded-full transition-all ${
                            stepDone
                              ? 'bg-emerald-600'
                              : 'bg-dharma-border/80'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Card Footer: Progress & Action Button */}
              <div className="mt-5 pt-4 border-t border-dharma-border/60 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-2xs font-semibold text-dharma-muted">
                    {isComplete ? (
                      <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : inProgress ? (
                      <span>{percent}% ({done}/{total})</span>
                    ) : (
                      <span>{total} readings</span>
                    )}
                  </p>
                </div>

                <Link
                  href={`/learn/journeys/${j.id}`}
                  className={`inline-flex items-center gap-1 rounded-xl px-3.5 py-1.5 text-xs font-bold transition shadow-2xs ${
                    isComplete
                      ? 'border border-emerald-600 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100/50'
                      : inProgress
                      ? 'bg-saffron-600 text-white hover:bg-saffron-700'
                      : 'border border-dharma-border bg-dharma-panel text-dharma-text hover:border-saffron-400'
                  }`}
                >
                  <span>{isComplete ? 'Revisit' : inProgress ? 'Resume' : 'Start'}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      {/* ─── PERSONALIZED NEXT RECOMMENDATION ─────────────────────────────── */}
      <section
        aria-labelledby="rec-heading"
        className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 space-y-4 shadow-xs"
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
          <Sparkles className="h-4 w-4" />
          <span id="rec-heading">Personalized Next Step · अनुशंसित स्वाध्याय</span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-dharma-text">
              {recommendation.title} ({recommendation.titleHi})
            </h3>
            <p className="text-xs sm:text-sm text-dharma-muted max-w-2xl">
              {recommendation.objective}
            </p>
          </div>

          <Link
            href={`/learn/journeys/${recommendation.id}`}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition shadow-xs self-start sm:self-center"
          >
            <span>Start This Journey</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
