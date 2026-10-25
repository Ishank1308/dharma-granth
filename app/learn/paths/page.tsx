'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  HelpCircle,
  Lightbulb,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { GUIDED_READING_PATHS, type GuidedReadingPath } from '@/data/guided-reading-paths';
import { ShareLinkButtons } from '@/app/components/ShareLinkButtons';
import { StudyPlans } from './StudyPlans';
import { readHref } from '@/lib/verse-paths';

type CategoryFilter = 'all' | GuidedReadingPath['category'];

const CATEGORIES: Array<{ id: CategoryFilter; label: string; labelHi: string }> = [
  { id: 'all', label: 'All Paths', labelHi: 'सभी मार्ग' },
  { id: 'life-questions', label: 'Life Questions', labelHi: 'जीवन के प्रश्न' },
  { id: 'philosophical-themes', label: 'Philosophical Themes', labelHi: 'दार्शनिक विषय' },
  { id: 'beginner-sequences', label: 'Beginner Sequences', labelHi: 'आरंभिक क्रम' },
  { id: 'character-studies', label: 'Character Studies', labelHi: 'चरित्र अध्ययन' },
  { id: 'decision-making', label: 'Decision Dilemmas', labelHi: 'धर्म-संकट' },
];

export default function GuidedReadingPathsPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [expandedAnswers, setExpandedAnswers] = useState<Record<string, boolean>>({});

  const filteredPaths =
    selectedCategory === 'all'
      ? GUIDED_READING_PATHS
      : GUIDED_READING_PATHS.filter((p) => p.category === selectedCategory);

  const toggleAnswer = (id: string) => {
    setExpandedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text pb-20">
      {/* Top Banner */}
      <section className="border-b border-dharma-border bg-gradient-to-b from-amber-50/60 via-dharma-card to-dharma-bg dark:from-amber-950/20 py-12 px-5 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/learn"
            className="focus-ring inline-flex items-center gap-1.5 text-xs font-semibold text-dharma-muted hover:text-dharma-text transition mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Learning Hub · अध्ययन केंद्र</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-saffron-500/15 text-saffron-800 dark:text-saffron-300">
              <Compass className="h-4.5 w-4.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-saffron-700 dark:text-saffron-400">
              Text-First Curriculum · निर्देशित स्वाध्याय
            </span>
          </div>

          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-dharma-text">
            <span lang="hi" className="font-devanagari">स्वाध्याय मार्ग</span>
            <span className="font-normal text-dharma-text-secondary"> · Reading paths</span>
          </h1>

          <p lang="hi" className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-dharma-text">
            पहले ग्यारह पढ़ने के क्रम हैं। फिर पाँच निर्देशित स्वाध्याय। अपनी गति से पढ़ें।
          </p>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-dharma-text-secondary">
            Eleven study orders come first. Five guided readings follow. Read at your own pace.
          </p>
        </div>
      </section>

      <StudyPlans />

      {/* Path List */}
      <section className="mx-auto max-w-5xl px-5 sm:px-8 mt-10 space-y-8">
        <h2 className="font-serif text-2xl font-bold text-dharma-text">
          <span lang="hi" className="font-devanagari">निर्देशित स्वाध्याय</span>
          <span className="font-normal text-dharma-text-secondary"> · Guided readings</span>
        </h2>
        <div
          role="tablist"
          aria-label="Filter guided paths by category"
          className="flex flex-wrap gap-2"
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(cat.id)}
                className={`focus-ring min-h-[44px] rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  active
                    ? 'bg-saffron-600 text-white shadow-xs'
                    : 'border border-dharma-border bg-dharma-card text-dharma-muted hover:border-saffron-400 hover:text-dharma-text'
                }`}
              >
                <span lang="hi" className="font-devanagari mr-1.5 font-normal">{cat.labelHi}</span>
                <span>· {cat.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-dharma-muted">
          Showing {filteredPaths.length} guided pathways:
        </p>

        {filteredPaths.map((path) => {
          const isAnswerOpen = Boolean(expandedAnswers[path.id]);

          return (
            <article
              key={path.id}
              id={path.id}
              className="scroll-mt-24 rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 shadow-sm transition hover:border-saffron-500/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-dharma-border pb-4">
                <div>
                  <span className="rounded-full bg-saffron-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-300">
                    {path.category.replace('-', ' ')}
                  </span>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-dharma-text">
                    {path.title}{' '}
                    <span lang="hi" className="font-devanagari font-normal text-xl text-dharma-muted">
                      · {path.titleHi}
                    </span>
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-bg px-3.5 py-1.5 text-xs text-dharma-muted">
                  <Clock className="h-3.5 w-3.5 text-saffron-600" />
                  <span>About {path.estimatedMinutes} min study</span>
                </div>
              </div>

              <ShareLinkButtons
                className="mt-4"
                heading={path.title}
                lines={[path.purpose, `About ${path.estimatedMinutes} min study`]}
                path={`/learn/paths/#${path.id}`}
                label={path.title}
              />

              {/* Purpose & Prerequisites */}
              <div className="mt-5 grid gap-4 sm:grid-cols-3 text-sm">
                <div className="sm:col-span-2 rounded-2xl border border-amber-300/60 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20 p-4">
                  <p className="font-semibold text-xs uppercase tracking-wide text-amber-900 dark:text-amber-200">
                    Purpose & Learning Objective
                  </p>
                  <p className="mt-1.5 text-sm text-dharma-text leading-relaxed">
                    {path.purpose}
                  </p>
                  <p lang="hi" className="mt-1 font-devanagari text-xs text-dharma-muted leading-relaxed">
                    {path.purposeHi}
                  </p>
                </div>

                <div className="rounded-2xl border border-dharma-border bg-dharma-bg p-4 text-xs">
                  <p className="font-bold uppercase tracking-wide text-dharma-muted">
                    Prerequisites
                  </p>
                  <ul className="mt-2 space-y-1 list-disc list-inside text-dharma-text/90">
                    {path.prerequisites.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sequence of Verses */}
              <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-dharma-muted flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-saffron-600" />
                  <span>Curated Verse Progression ({path.verses.length} Verses)</span>
                </h3>

                <ol className="mt-3 space-y-3">
                  {path.verses.map((v, idx) => (
                    <li
                      key={idx}
                      className="rounded-2xl border border-dharma-border bg-dharma-bg/80 p-4 transition hover:border-saffron-400"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-dharma-border/60 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-saffron-600 text-[11px] font-bold text-white">
                            {idx + 1}
                          </span>
                          <h4 className="font-semibold text-sm text-dharma-text">
                            {v.title} <span lang="hi" className="font-devanagari font-normal text-xs text-dharma-muted">({v.titleHi})</span>
                          </h4>
                        </div>

                        <Link
                          href={readHref(v.scriptureId, v.chapter, v.verse)}
                          className="focus-ring inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-saffron-600/30 bg-saffron-50 dark:bg-saffron-950/30 px-3 py-1 text-xs font-bold text-saffron-800 dark:text-saffron-300 hover:border-saffron-600 transition"
                        >
                          <span>श्लोक {v.chapter}.{v.verse} पढ़ें</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>

                      {!/(?:\.{3}|…)\s*$/.test(v.sanskritSnippet.trim()) && (
                        <p lang="sa" className="mt-2 font-devanagari text-xs font-semibold text-amber-900 dark:text-amber-200">
                          {v.sanskritSnippet}
                        </p>
                      )}

                      <p className="mt-1 text-xs sm:text-sm text-dharma-text leading-relaxed">
                        <strong>Takeaway:</strong> {v.takeaway}
                      </p>
                      <p lang="hi" className="mt-0.5 font-devanagari text-xs text-dharma-muted">
                        {v.takeawayHi}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Core Insight & Practical Reflection */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:border-emerald-500/20 dark:bg-emerald-950/20 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-900 dark:text-emerald-200">
                    <Lightbulb className="h-4 w-4 text-emerald-600" />
                    <span>Core Insight · मुख्य बोध</span>
                  </div>
                  <p className="mt-2 font-serif text-sm leading-relaxed text-dharma-text">
                    {path.coreInsight}
                  </p>
                  <p lang="hi" className="mt-1 font-devanagari text-xs text-dharma-muted leading-relaxed">
                    {path.coreInsightHi}
                  </p>
                </div>

                <div className="rounded-2xl border border-sky-500/30 bg-sky-50/40 dark:border-sky-500/20 dark:bg-sky-950/20 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-sky-900 dark:text-sky-200">
                    <Compass className="h-4 w-4 text-sky-600" />
                    <span>Practical Reflection · दैनिक आचरण</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-dharma-text">
                    {path.practicalReflection}
                  </p>
                  <p lang="hi" className="mt-1 font-devanagari text-xs text-dharma-muted leading-relaxed">
                    {path.practicalReflectionHi}
                  </p>
                </div>
              </div>

              {/* Self-Check Question Accordion */}
              <div className="mt-5 rounded-2xl border border-dharma-border bg-dharma-bg p-4 text-xs sm:text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-saffron-600 shrink-0" />
                    <span className="font-bold text-dharma-text">Self-Check Reflection:</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleAnswer(path.id)}
                    aria-expanded={isAnswerOpen}
                    className="focus-ring inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-dharma-border bg-dharma-card px-3 py-1 text-xs font-semibold text-dharma-muted hover:text-dharma-text transition"
                  >
                    <span>{isAnswerOpen ? 'Hide Reflection Guide' : 'Reveal Reflection Guide'}</span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isAnswerOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                <p className="mt-2 italic font-serif text-dharma-text leading-relaxed">
                  &ldquo;{path.selfCheckQuestion}&rdquo;
                </p>
                <p lang="hi" className="mt-0.5 font-devanagari text-xs text-dharma-muted">
                  &ldquo;{path.selfCheckQuestionHi}&rdquo;
                </p>

                {isAnswerOpen && (
                  <div className="mt-3 border-t border-dharma-border/60 pt-3 text-xs leading-relaxed text-dharma-text/90">
                    <p className="font-semibold text-emerald-800 dark:text-emerald-300">Pedagogical Pointer:</p>
                    <p className="mt-1">{path.suggestedAnswer}</p>
                    <p lang="hi" className="mt-1 font-devanagari text-dharma-muted">{path.suggestedAnswerHi}</p>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
