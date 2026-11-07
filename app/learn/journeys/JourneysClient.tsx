'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Clock,
  Compass,
  ChevronRight,
  ArrowRight,
  Play,
  Heart,
  Sun,
  Layers,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { READING_JOURNEYS, type ReadingJourney, type JourneyCategory } from '@/data/reading-journeys';
import { REVIEW_LABEL } from '@/data/study-content';
import type { ReviewStatus } from '@/data/study-content';
import { useJourneyProgress } from './JourneyProgress';

const REVIEW_LABEL_HI: Record<ReviewStatus, string> = {
  draft: 'प्रारूप · समीक्षा शेष',
  'editorial-review': 'संपादकीय समीक्षा में',
  'source-review': 'स्रोत-समीक्षा में',
  approved: 'समीक्षित',
};

export function JourneysClient() {
  const { progress, ready } = useJourneyProgress();
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
          nextLesson: nextLessonIndex >= 0 ? j.lessons[nextLessonIndex] : j.lessons[0],
        };
      }
    }
    return null;
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

        </div>

        <p className="max-w-3xl text-sm sm:text-base text-dharma-muted leading-relaxed">
          Choose a short reading path or open any lesson directly. You can pause at any point; optional reading markers stay on this device.
        </p>
      </section>

      {/* ─── FLAGSHIP GITA JOURNEY SPOTLIGHT ─────────────────────────────── */}
      <section
        aria-labelledby="gita-spotlight-heading"
        className="rounded-3xl border-2 border-saffron-500/50 bg-gradient-to-br from-amber-500/15 via-saffron-500/10 to-indigo-500/10 p-6 sm:p-8 shadow-sm transition hover:border-saffron-500"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-saffron-500/40 bg-saffron-500/20 px-3 py-1 text-xs font-bold text-saffron-900 dark:text-saffron-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Interactive Roadmap · तत्त्वमसि</span>
              </span>
              <span className="text-xs font-semibold text-dharma-muted">
                18 Chapters · 3 Classical Shatkas
              </span>
            </div>

            <h2 id="gita-spotlight-heading" className="font-serif text-2xl sm:text-3xl font-bold text-dharma-text">
              Bhagavad Gita 18 Adhyayas: The Dilemma Compass
            </h2>
            <p lang="hi" className="font-devanagari text-sm sm:text-base font-medium text-saffron-800 dark:text-saffron-300">
              अर्जुन के विषाद से श्रीकृष्ण के परम समाधान तक — कर्म, भक्ति व ज्ञान षटक
            </p>
            <p className="text-xs sm:text-sm text-dharma-muted max-w-2xl leading-relaxed">
              Navigate all 18 chapters of Srimad Bhagavad Gita mapped to real-life psychological dilemmas, centerpiece Mahavakyas, and progress tracking.
            </p>
          </div>

          <div className="shrink-0 self-start md:self-center">
            <Link
              href="/learn/journeys/gita/"
              className="focus-ring inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-saffron-600 hover:bg-saffron-700 px-6 py-3 text-sm font-bold text-white transition shadow-sm"
            >
              <span>Explore 18 Chapters</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
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
                    Continue at the next unread passage
                  </p>
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
            { id: 'healing', label: 'Reflection', labelHi: 'मनन और संबल', icon: Heart },
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
                <span className={active ? 'font-normal text-white' : 'text-dharma-muted font-devanagari text-2xs'}>
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
          const isComplete = done >= total && total > 0;
          const inProgress = done > 0 && done < total;
          const nextLesson = j.lessons.find((lesson) => !(progress[j.id] ?? []).includes(lesson.id));

          return (
            <article
              key={j.id}
              className={`flex flex-col justify-between rounded-3xl border bg-dharma-card p-5 sm:p-6 transition hover:border-saffron-400 hover:shadow-sm ${
                inProgress
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
                      <span>~{j.minutesPerLesson} min / reading</span>
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
                <p aria-label="Editorial status" className="inline-flex flex-wrap gap-x-1 rounded-lg border border-amber-700/20 bg-amber-500/5 px-2.5 py-1 text-2xs text-dharma-muted">
                  <span>{REVIEW_LABEL[j.review]}</span>
                  <span aria-hidden="true">·</span>
                  <span lang="hi" className="font-devanagari">{REVIEW_LABEL_HI[j.review]}</span>
                </p>
              </div>

              {/* Card Footer: Progress & Action Button */}
              <div className="mt-5 pt-4 border-t border-dharma-border/60 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-2xs font-semibold text-dharma-muted">
                    {inProgress ? (
                      <span>Reading markers stay on this device</span>
                    ) : (
                      <span>{total} selected readings</span>
                    )}
                  </p>
                </div>

                <Link
                  href={inProgress && nextLesson ? `/learn/journeys/${j.id}/#${nextLesson.id}` : `/learn/journeys/${j.id}`}
                  className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-dharma-border bg-dharma-panel px-3.5 text-xs font-bold text-dharma-text transition hover:border-saffron-400"
                >
                  <span>{inProgress ? 'Continue reading' : isComplete ? 'Read again' : 'Open study'}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          );
        })}
      </section>

    </main>
  );
}
