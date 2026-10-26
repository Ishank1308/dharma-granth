'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { learningPaths, type LearningPath, type LearningFormat } from '@/data/learning-paths';
import { useStudyProgress } from '@/lib/useStudyProgress';
import { ManuscriptDivider, PalmLeafBorder } from '@/app/components/ManuscriptDivider';
import { CalmProgress } from '@/app/components/CalmProgress';
import { SadhanaPortability } from '@/app/components/SadhanaPortability';
import { BackupRestore } from '@/app/components/BackupRestore';
import { FadeUp } from '@/app/components/motion/primitives';
import { JsonLd } from '@/app/components/JsonLd';
import { courseListLd, pageLd } from '@/lib/jsonld';
import {
  BookOpen,
  Brain,
  Clock,
  Sparkles,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Circle,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Compass,
  GraduationCap,
  Sparkle,
  Library,
  Flame,
} from 'lucide-react';

// Format icon & badge helper
function FormatBadge({ format }: { format: LearningFormat | 'slides' }) {
  switch (format) {
    case 'flashcards':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-serif bg-amber-50 dark:bg-stone-800 text-amber-900 dark:text-amber-200 border border-amber-200/60 dark:border-stone-700">
          <BookOpen className="w-3 h-3 text-amber-600" />
          <span>Flashcards</span>
        </span>
      );
    case 'slides':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-serif bg-orange-50 dark:bg-stone-800 text-orange-900 dark:text-orange-200 border border-orange-200/60 dark:border-stone-700">
          <Sparkles className="w-3 h-3 text-orange-600" />
          <span>Slides</span>
        </span>
      );
    case 'mindmap':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-serif bg-emerald-50 dark:bg-stone-800 text-emerald-900 dark:text-emerald-200 border border-emerald-200/60 dark:border-stone-700">
          <Layers className="w-3 h-3 text-emerald-600" />
          <span>Mind Map</span>
        </span>
      );
    case 'timeline':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-serif bg-indigo-50 dark:bg-stone-800 text-indigo-900 dark:text-indigo-200 border border-indigo-200/60 dark:border-stone-700">
          <Clock className="w-3 h-3 text-indigo-600" />
          <span>Timeline</span>
        </span>
      );
    case 'quizzes':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-serif bg-rose-50 dark:bg-stone-800 text-rose-900 dark:text-rose-200 border border-rose-200/60 dark:border-stone-700">
          <Trophy className="w-3 h-3 text-rose-600" />
          <span>Quiz</span>
        </span>
      );
  }
}

// Course list for search engines. Lives here, not in learn/layout.tsx, because
// the layout also wraps every /learn/* sub-page. Each course's full Course data
// is on its own /learn/<id> page.
const LEARN_JSON_LD = pageLd(
  [{ name: 'Learn', path: '/learn' }],
  courseListLd({
    path: '/learn',
    name: 'Learn Hindu Scriptures — Flashcards, Timelines & Mind Maps',
    description:
      'Interactive ways to study Hindu scriptures: flashcards, slide decks, mind maps, quizzes, and timelines covering the Vedas, Upanishads, Bhagavad Gita, and the epics.',
    courses: learningPaths.map((c) => ({ path: `/learn/${c.id}`, name: c.title })),
  }),
);

export default function LearnPage() {
  const progress = useStudyProgress();

  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  // Filter courses based on difficulty, search, and format
  const filteredCourses = useMemo(() => {
    return learningPaths.filter((course) => {
      const matchesDifficulty =
        selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;

      const matchesFormat =
        selectedFormat === 'all' ||
        course.includedFormats.includes(selectedFormat as LearningFormat);

      const matchesSearch =
        !searchQuery ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.titleSanskrit.includes(searchQuery) ||
        course.learningObjective.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDifficulty && matchesFormat && matchesSearch;
    });
  }, [selectedDifficulty, selectedFormat, searchQuery]);

  // Overall statistics
  const totalCompletedLessons = useMemo(() => {
    return learningPaths.reduce((acc, course) => {
      const p = progress.getPathwayProgress(course.id);
      return acc + (p?.completedSteps?.length ?? 0);
    }, 0);
  }, [progress]);

  const totalLessons = useMemo(() => {
    return learningPaths.reduce((acc, c) => acc + c.lessons.length, 0);
  }, []);

  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text pb-24 selection:bg-saffron-200 selection:text-saffron-900">
      <JsonLd data={LEARN_JSON_LD} />
      {/* ── Scholarly Hero Banner ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900/95 to-dharma-bg text-stone-100 pt-12 pb-16 border-b border-saffron-900/40">
        <PalmLeafBorder className="absolute top-0 inset-x-0 opacity-40" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <FadeUp>
            <div className="flex items-center gap-2 mb-3 text-saffron-400 text-xs md:text-sm font-serif uppercase tracking-widest font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>स्वाध्यायान्मा प्रमदः — Never Neglect Sacred Study</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-white mb-3">
              Dharma Granth Learning Hub
            </h1>

            <p
              lang="sa"
              className="font-devanagari text-lg md:text-xl text-saffron-300 font-semibold mb-3 tracking-wide"
            >
              शास्त्र स्वाध्याय एवं ज्ञान पीठ
            </p>

            <p className="text-base md:text-lg text-stone-300/90 font-serif max-w-2xl leading-relaxed mb-3">
              Structured study of Hindu scriptures organized into guided learning paths.
              Delve into primary texts with interactive flashcards, illuminated slides, concept mind maps, chronological timelines, and knowledge checks.
            </p>
            <p className="mb-6 text-sm">
              <Link href="/learn/academy" className="font-semibold text-saffron-300 underline underline-offset-2">
                धर्म अकादमी · course levels
              </Link>
            </p>

            {/* Calm, Meditative Overview Strip */}
            <div className="inline-flex flex-wrap items-center gap-4 md:gap-8 p-3 px-5 rounded-2xl bg-stone-950/70 border border-saffron-500/30 text-xs md:text-sm font-serif">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-saffron-400" />
                <span className="text-stone-300">8 Guided Pathways</span>
              </div>
              <div className="hidden sm:block text-stone-600">•</div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-saffron-400" />
                <span className="text-stone-300">
                  {totalCompletedLessons} of {totalLessons} Lessons Contemplated
                </span>
              </div>
              <div className="hidden sm:block text-stone-600">•</div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-saffron-400" />
                <span className="text-saffron-300 font-semibold">
                  5 Classical Learning Formats
                </span>
              </div>
            </div>

            {/* Quick Portals Strip: /learn/ is the one hub for starting points, journeys, plans and courses */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Link
                href="/learn/start/"
                className="group p-4 rounded-xl bg-stone-950/80 border border-saffron-500/30 hover:border-saffron-400 transition"
              >
                <div className="flex items-center gap-2 text-saffron-400 font-serif text-xs font-semibold">
                  <Sparkle className="w-4 h-4" />
                  <span>आरम्भ</span>
                </div>
                <h3 className="mt-1 font-serif text-sm font-bold text-white group-hover:text-saffron-300 transition">
                  Find Your Starting Point →
                </h3>
                <p className="mt-0.5 text-[11px] text-stone-400 font-serif">
                  Five short questions, a calm first step
                </p>
              </Link>
              <Link
                href="/learn/journeys/"
                className="group p-4 rounded-xl bg-stone-950/80 border border-saffron-500/30 hover:border-saffron-400 transition"
              >
                <div className="flex items-center gap-2 text-saffron-400 font-serif text-xs font-semibold">
                  <Flame className="w-4 h-4" />
                  <span>स्वाध्याय यात्राएँ</span>
                </div>
                <h3 className="mt-1 font-serif text-sm font-bold text-white group-hover:text-saffron-300 transition">
                  Guided Journeys →
                </h3>
                <p className="mt-0.5 text-[11px] text-stone-400 font-serif">
                  Daily lessons with reflection and progress
                </p>
              </Link>
              <Link
                href="/wisdom-pathways/"
                className="group p-4 rounded-xl bg-stone-950/80 border border-saffron-500/30 hover:border-saffron-400 transition"
              >
                <div className="flex items-center gap-2 text-saffron-400 font-serif text-xs font-semibold">
                  <Compass className="w-4 h-4" />
                  <span>ज्ञान मार्ग</span>
                </div>
                <h3 className="mt-1 font-serif text-sm font-bold text-white group-hover:text-saffron-300 transition">
                  Wisdom Pathways →
                </h3>
                <p className="mt-0.5 text-[11px] text-stone-400 font-serif">
                  Begin from fear, anger, grief or purpose
                </p>
              </Link>
              <Link
                href="/learn/plans/"
                className="group p-4 rounded-xl bg-stone-950/80 border border-saffron-500/30 hover:border-saffron-400 transition"
              >
                <div className="flex items-center gap-2 text-saffron-400 font-serif text-xs font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>स्वाध्याय योजना</span>
                </div>
                <h3 className="mt-1 font-serif text-sm font-bold text-white group-hover:text-saffron-300 transition">
                  Reading Plans →
                </h3>
                <p className="mt-0.5 text-[11px] text-stone-400 font-serif">
                  Day-by-day schedules, study orders, guided readings
                </p>
              </Link>
              <Link
                href="/learn/faq"
                className="group p-4 rounded-xl bg-stone-950/80 border border-saffron-500/30 hover:border-saffron-400 transition"
              >
                <div className="flex items-center gap-2 text-saffron-400 font-serif text-xs font-semibold">
                  <GraduationCap className="w-4 h-4" />
                  <span>जिज्ञासा समाधान</span>
                </div>
                <h3 className="mt-1 font-serif text-sm font-bold text-white group-hover:text-saffron-300 transition">
                  Scripture FAQs →
                </h3>
                <p className="mt-0.5 text-[11px] text-stone-400 font-serif">
                  Canon, ethics, philosophical schools & clarity
                </p>
              </Link>
              <Link
                href="/sources"
                className="group p-4 rounded-xl bg-stone-950/80 border border-saffron-500/30 hover:border-saffron-400 transition"
              >
                <div className="flex items-center gap-2 text-saffron-400 font-serif text-xs font-semibold">
                  <Library className="w-4 h-4" />
                  <span>स्रोत पारदर्शिता</span>
                </div>
                <h3 className="mt-1 font-serif text-sm font-bold text-white group-hover:text-saffron-300 transition">
                  Source Library →
                </h3>
                <p className="mt-0.5 text-[11px] text-stone-400 font-serif">
                  Critical editions, recensions, and methodology
                </p>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Filters & Controls Bar ───────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-dharma-card rounded-2xl border border-dharma-border p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Difficulty Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Pathways (सभी मार्ग)', count: learningPaths.length },
                { id: 'beginner', label: 'Beginner (प्रारम्भिक)', count: 3 },
                { id: 'intermediate', label: 'Intermediate (मध्यम)', count: 3 },
                { id: 'advanced', label: 'Advanced (उन्नत)', count: 2 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedDifficulty(tab.id as typeof selectedDifficulty)}
                  className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all ${
                    selectedDifficulty === tab.id
                      ? 'bg-saffron-700 text-white shadow-xs'
                      : 'bg-dharma-card-soft text-dharma-text hover:bg-saffron-50 dark:hover:bg-stone-800 border border-dharma-border/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-dharma-muted" />
              <input
                type="text"
                aria-label="Search scripture or concept"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scripture or concept..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs font-serif bg-dharma-bg border border-dharma-border text-dharma-text focus:outline-hidden focus:ring-1 focus:ring-saffron-500"
              />
            </div>
          </div>

          {/* Secondary Format Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-dharma-border/40 text-xs">
            <span className="text-dharma-muted font-serif flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-saffron-600" />
              Filter by Format:
            </span>
            {[
              { id: 'all', icon: null, text: 'All Formats' },
              { id: 'flashcards', icon: '📇', text: 'Flashcards' },
              { id: 'mindmap', icon: '🕸️', text: 'Mind Map' },
              { id: 'timeline', icon: '⏳', text: 'Timeline' },
              { id: 'quizzes', icon: '🎯', text: 'Quizzes' },
            ].map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setSelectedFormat(fmt.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-serif transition ${
                  selectedFormat === fmt.id
                    ? 'bg-amber-100 dark:bg-stone-800 text-saffron-800 dark:text-saffron-300 font-bold border border-saffron-300'
                    : 'text-dharma-muted hover:text-dharma-text hover:bg-dharma-bg'
                }`}
              >
                {fmt.icon && <span aria-hidden="true" className="mr-1">{fmt.icon}</span>}
                {fmt.text}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Guided Learning Pathways Grid (also the target of the /learn/pathways/ 301) ── */}
      <section id="courses" className="max-w-6xl mx-auto px-6 scroll-mt-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-serif font-bold text-dharma-text">
              Curated Scripture Pathways ({filteredCourses.length})
            </h2>
            <p className="text-xs text-dharma-muted font-serif">
              Step-by-step pathways designed for steady, lifelong contemplation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => {
            const pathwayProgress = progress.getPathwayProgress(course.id);
            const completedCount = pathwayProgress?.completedSteps?.length ?? 0;
            const totalCount = course.lessons.length;
            const pct = Math.min(Math.round((completedCount / totalCount) * 100), 100);
            const isFinished = pct === 100;
            const isExpanded = expandedCourseId === course.id;

            return (
              <article
                key={course.id}
                className="rounded-2xl border border-dharma-border bg-dharma-card hover:border-saffron-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6">
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-stone-800/80 border border-saffron-200 dark:border-stone-700 flex items-center justify-center text-2xl shadow-xs">
                        {course.icon}
                      </div>
                      <div>
                        <span
                          lang="sa"
                          className="font-devanagari text-xs text-saffron-600 dark:text-saffron-400 font-semibold block"
                        >
                          {course.titleSanskrit}
                        </span>
                        <h3 className="font-serif font-bold text-lg text-dharma-text leading-tight">
                          {course.title}
                        </h3>
                      </div>
                    </div>

                    {isFinished && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                        <Award className="w-3 h-3" />
                        Complete
                      </span>
                    )}
                  </div>

                  {/* Learning Objective (Prominently Shown) */}
                  <div className="my-3 p-3.5 rounded-xl bg-amber-50/50 dark:bg-stone-900/50 border border-amber-200/50 dark:border-stone-800">
                    <span className="text-[10px] font-serif font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-300 block mb-1">
                      Learning Objective (अध्ययन लक्ष्य)
                    </span>
                    <p className="text-xs md:text-sm text-dharma-text font-serif leading-relaxed line-clamp-3">
                      {course.learningObjective}
                    </p>
                  </div>

                  {/* Course Metadata Stats */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-dharma-border/50 text-xs font-serif mb-4">
                    <div>
                      <span className="text-[10px] text-dharma-muted block">Difficulty: </span>
                      <span
                        className={`font-semibold ${
                          course.difficulty === 'beginner'
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : course.difficulty === 'intermediate'
                            ? 'text-amber-700 dark:text-amber-400'
                            : 'text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {course.difficultySanskrit}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-dharma-muted block">Lessons: </span>
                      <span className="text-dharma-text font-semibold">
                        {course.lessons.length} lessons
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-dharma-muted block">Study Time: </span>
                      <span className="text-dharma-text font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-saffron-600" />
                        {course.estimatedTime}
                      </span>
                    </div>
                  </div>

                  {/* Included Formats Badges */}
                  <div className="mb-4">
                    <span className="text-[10px] font-serif uppercase tracking-wider text-dharma-muted block mb-1.5">
                      Included Learning Formats:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {course.includedFormats.map((fmt) => (
                        <FormatBadge key={fmt} format={fmt} />
                      ))}
                    </div>
                  </div>

                  {/* Calm Progress Indicator */}
                  <div className="mb-2">
                    <CalmProgress
                      completed={completedCount}
                      total={totalCount}
                      variant="linear"
                      showPercentage={true}
                      label="Your Progress"
                    />
                  </div>

                  {/* Quick Lesson Preview Drawer Accordion */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-dharma-border/60 space-y-2">
                      <span className="text-[11px] font-serif font-bold text-dharma-muted block">
                        Lesson Breakdown:
                      </span>
                      {course.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between text-xs font-serif p-2 rounded-lg bg-dharma-card-soft"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-saffron-600 font-bold">{lesson.order}.</span>
                            <span className="text-dharma-text">{lesson.title}</span>
                          </div>
                          <span className="text-dharma-muted">{lesson.estimatedMinutes}m</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer with Continue Button & Preview Toggle */}
                <div className="px-6 py-3.5 bg-dharma-card-soft/60 border-t border-dharma-border flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                    className="text-xs font-serif text-dharma-muted hover:text-saffron-700 flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'Hide Lessons' : 'View Lessons'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <Link
                    href={`/learn/${course.id}`}
                    className="tap-target inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-serif font-bold bg-saffron-700 text-white hover:bg-saffron-800 transition shadow-xs"
                  >
                    <span>
                      {completedCount === 0
                        ? 'Begin Journey'
                        : isFinished
                        ? 'Review Course'
                        : 'Continue Study'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16 bg-dharma-card rounded-2xl border border-dharma-border">
            <p className="font-serif text-dharma-muted">No pathways found matching your filters.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedDifficulty('all');
                setSelectedFormat('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-serif font-bold text-saffron-700 underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </section>

      <ManuscriptDivider label="Classical Study Methodology" labelSanskrit="स्वाध्याय त्रिपदी" ornament="shree" />

      {/* ── Classical Contemplative Study Guide ───────────────────────── */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="rounded-2xl border border-saffron-300/70 bg-gradient-to-b from-amber-50/80 via-orange-50/30 to-amber-50/20 dark:from-stone-900/80 dark:to-stone-950/80 p-8 shadow-xs">
          <div className="max-w-2xl mb-6">
            <span className="text-xs font-serif font-bold uppercase tracking-widest text-saffron-800 dark:text-saffron-300 block mb-1">
              Sacred Learning Principles
            </span>
            <h3 className="text-2xl font-serif font-bold text-dharma-text mb-2">
              The Three Pillars of Indian Svādhyāya
            </h3>
            <p className="text-xs md:text-sm text-dharma-muted font-serif leading-relaxed">
              Unlike modern corporate metrics, classical scripture study measures progress not in certificates, but in inner serenity, clarity of intellect, and selfless duty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-white/80 dark:bg-stone-800/80 border border-saffron-200 dark:border-stone-700">
              <span className="font-devanagari text-lg text-saffron-700 dark:text-saffron-300 font-bold block mb-1">
                1. श्रवण (Śravaṇa)
              </span>
              <h4 className="font-serif font-bold text-sm text-dharma-text mb-1">
                Receptive Hearing & Reading
              </h4>
              <p className="text-xs text-dharma-muted font-serif leading-relaxed">
                Approaching the text with reverence and full attention, listening to the authentic verses and words of the Rishis.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/80 dark:bg-stone-800/80 border border-saffron-200 dark:border-stone-700">
              <span className="font-devanagari text-lg text-saffron-700 dark:text-saffron-300 font-bold block mb-1">
                2. मनन (Manana)
              </span>
              <h4 className="font-serif font-bold text-sm text-dharma-text mb-1">
                Reflective Pondering & Analysis
              </h4>
              <p className="text-xs text-dharma-muted font-serif leading-relaxed">
                Clearing doubts through intellectual inquiry, testing the concepts with reason, mind maps, and flashcard recall.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/80 dark:bg-stone-800/80 border border-saffron-200 dark:border-stone-700">
              <span className="font-devanagari text-lg text-saffron-700 dark:text-saffron-300 font-bold block mb-1">
                3. निदिध्यासन (Nididhyāsana)
              </span>
              <h4 className="font-serif font-bold text-sm text-dharma-text mb-1">
                Deep Meditative Assimilation
              </h4>
              <p className="text-xs text-dharma-muted font-serif leading-relaxed">
                Absorbing the realized truth into daily consciousness until your actions naturally radiate peace and equanimity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-16">
        <SadhanaPortability />
        <BackupRestore />
      </div>
    </main>
  );
}
