'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { LearningPath, LearningFormat } from '@/data/learning-paths';
import { learningPaths } from '@/data/learning-paths';
import { ManuscriptDivider, PalmLeafBorder } from '@/app/components/ManuscriptDivider';
import { CalmProgress } from '@/app/components/CalmProgress';
import { ConceptRelationshipGraph } from '@/app/components/ConceptRelationshipGraph';
import { FlashCard, type FlashCardData } from '@/app/components/FlashCard';
import { MindMap } from '@/app/components/MindMap';
import { Timeline } from '@/app/components/Timeline';
import { QuizRunner } from '@/app/components/QuizRunner';
import { useStudyProgress } from '@/lib/useStudyProgress';
import { CourseCertificate } from './CourseCertificate';
import {
  BookOpen,
  Brain,
  Clock,
  Sparkles,
  Trophy,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  HelpCircle,
  RotateCcw,
  BookMarked,
  Layers,
  ChevronRight,
  Bookmark,
  Share2,
  ListOrdered,
  KeyRound,
  FileText,
  Compass,
} from 'lucide-react';

interface CoursePageClientProps {
  course: LearningPath;
}

export function CoursePageClient({ course }: CoursePageClientProps) {
  const router = useRouter();
  const progress = useStudyProgress();

  // Active tab in Course View
  const [activeTab, setActiveTab] = useState<
    'overview' | 'concepts' | 'flashcards' | 'mindmap' | 'timeline' | 'quiz' | 'revision'
  >('overview');

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [deck, setDeck] = useState<FlashCardData[]>(course.flashcards);
  const [spacedMode, setSpacedMode] = useState(false);

  // Active selected lesson in overview
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    course.lessons[0]?.id || ''
  );

  // Course progress tracking via useStudyProgress
  const pathwayProgress = progress.getPathwayProgress(course.id);
  const completedSteps = pathwayProgress?.completedSteps ?? [];
  const completedCount = course.lessons.filter((lesson) => completedSteps.includes(lesson.id)).length;
  const isAllComplete = course.lessons.length > 0 && completedCount === course.lessons.length;

  const isLessonComplete = (lessonId: string) => completedSteps.includes(lessonId);

  const toggleLesson = (lessonId: string) => {
    const had = completedSteps.includes(lessonId);
    progress.togglePathwayStep(course.id, lessonId);
    if (!had) {
      const done = new Set(completedSteps);
      done.add(lessonId);
      if (course.lessons.every((lesson) => done.has(lesson.id))) {
        progress.completePathway(course.id);
      }
    }
  };

  useEffect(() => {
    if (!progress.hydrated || !isAllComplete || pathwayProgress?.completedAt) return;
    progress.completePathway(course.id);
  }, [progress.hydrated, isAllComplete, pathwayProgress?.completedAt, course.id, progress.completePathway]);

  const handleNextCard = () => {
    setCardIndex((prev) => (prev + 1) % deck.length);
  };

  const handlePreviousCard = () => {
    setCardIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const handleResetCards = () => {
    setCardIndex(0);
  };

  const handleShuffleCards = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCardIndex(0);
  };

  // ARIA tab keyboard pattern: roving focus, Arrow Left/Right and Home/End.
  const handleTabKeyDown = (event: React.KeyboardEvent, tab: typeof activeTab) => {
    const tabs: (typeof activeTab)[] = [
      'overview', 'concepts', 'flashcards', 'mindmap', 'timeline', 'quiz', 'revision',
    ];
    const current = tabs.indexOf(tab);
    let next = current;
    if (event.key === 'ArrowRight') next = (current + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    const nextTab = tabs[next];
    setActiveTab(nextTab);
    requestAnimationFrame(() => document.getElementById(`tab-${nextTab}`)?.focus());
  };

  const activeLesson =
    course.lessons.find((l) => l.id === selectedLessonId) || course.lessons[0];

  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text pb-20 selection:bg-saffron-200 selection:text-saffron-900">
      {/* ── Sacred Header Banner ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900/95 to-dharma-bg text-stone-100 pt-8 pb-12 border-b border-saffron-900/40">
        <PalmLeafBorder className="absolute top-0 inset-x-0 opacity-40" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Back to Hub Breadcrumb */}
          <div className="flex items-center justify-between gap-4 mb-6 text-xs">
            <Link
              href="/learn"
              className="inline-flex items-center gap-1.5 text-saffron-300/80 hover:text-saffron-200 transition font-serif"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Learning Hub (ज्ञान पीठ)</span>
            </Link>

            {/* Other Courses Switcher */}
            <div className="flex items-center gap-2 text-stone-400">
              <span className="hidden sm:inline">Pathways:</span>
              <select
                value={course.id}
                onChange={(e) => router.push(`/learn/${e.target.value}`)}
                className="bg-stone-800/90 border border-stone-700 text-stone-200 text-xs rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-saffron-500 font-serif"
                aria-label="Switch learning path"
              >
                {learningPaths.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5 mb-3 text-xs">
                <span className="px-2.5 py-0.5 rounded-full font-serif font-bold uppercase tracking-widest bg-saffron-500/20 text-saffron-300 border border-saffron-500/30">
                  {course.difficultySanskrit}
                </span>
                <span className="text-stone-300 flex items-center gap-1 font-serif">
                  <Clock className="w-3.5 h-3.5 text-saffron-400" />
                  {course.estimatedTime}
                </span>
                <span className="text-stone-300 flex items-center gap-1 font-serif">
                  <BookOpen className="w-3.5 h-3.5 text-saffron-400" />
                  {course.lessons.length} structured lessons
                </span>
              </div>

              {/* Title & Devanagari */}
              <p
                lang="sa"
                className="font-devanagari text-xl md:text-2xl text-saffron-400 mb-1 font-semibold tracking-wide"
              >
                {course.titleSanskrit}
              </p>
              <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-white mb-3">
                {course.title}
              </h1>
              <p className="text-base text-stone-300/90 font-serif max-w-2xl leading-relaxed mb-6">
                {course.subtitle}
              </p>

              {/* Mangalacharan / Invocatory Shloka */}
              <div className="rounded-xl border border-saffron-500/30 bg-stone-950/70 p-4 md:p-5 relative shadow-inner">
                <div className="flex items-center gap-2 text-saffron-400 text-xs font-serif font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>मङ्गलाचरणम् (Invocatory Verse)</span>
                  <span className="text-stone-400 font-normal">
                    — {course.overview.mangalCharan.source}
                  </span>
                </div>
                <p
                  lang="sa"
                  className="font-devanagari text-base md:text-lg text-saffron-200 leading-relaxed mb-1"
                >
                  {course.overview.mangalCharan.sanskrit}
                </p>
                <p className="text-xs font-serif text-stone-300 italic mb-2">
                  {course.overview.mangalCharan.transliteration}
                </p>
                <p className="text-xs text-stone-200/90 font-serif leading-relaxed border-t border-stone-800 pt-2">
                  &ldquo;{course.overview.mangalCharan.meaning}&rdquo;
                </p>
              </div>
            </div>

            {/* Right: Calm Progress & Course Summary Card */}
            <div className="lg:col-span-4 bg-stone-800/80 border border-stone-700/80 rounded-2xl p-5 shadow-lg">
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-saffron-300 block mb-3">
                Contemplative Progress (अध्ययन संस्थिति)
              </span>

              <CalmProgress
                completed={completedCount}
                total={course.lessons.length}
                variant="ring"
                size="md"
                label={course.titleSanskrit}
                className="mb-4"
              />

              <div className="space-y-2 text-xs border-t border-stone-700/60 pt-3">
                <div className="flex justify-between py-1">
                  <span className="text-stone-400">Included Formats:</span>
                  <span className="text-stone-200 font-semibold">
                    {course.includedFormats.length} study modes
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-400">Key Concepts:</span>
                  <span className="text-stone-200 font-semibold">
                    {course.keyConcepts.length} linked axioms
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-400">Flashcards in Deck:</span>
                  <span className="text-stone-200 font-semibold">
                    {course.flashcards.length} cards
                  </span>
                </div>
              </div>

              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset progress for this pathway?')) {
                      course.lessons.forEach((l) => {
                        if (completedSteps.includes(l.id)) {
                          progress.togglePathwayStep(course.id, l.id);
                        }
                      });
                    }
                  }}
                  className="w-full mt-4 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-[11px] font-serif text-stone-400 hover:text-saffron-300 hover:bg-stone-700/60 transition border border-stone-700"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Study Record</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {progress.hydrated && isAllComplete && (
        <CourseCertificate
          courseId={course.id}
          title={course.title}
          titleSanskrit={course.titleSanskrit}
          completedAt={pathwayProgress?.completedAt}
        />
      )}

      {/* ── Tabbed Navigation Bar ───────────────────────────────────────── */}
      <section className="sticky top-[52px] z-30 bg-dharma-card/95 backdrop-blur-md border-b border-dharma-border shadow-xs">
        <div className="max-w-6xl mx-auto px-6 overflow-x-auto scrollbar-none">
          <div
            role="tablist"
            aria-label="Course Sections"
            className="flex items-center gap-1 py-2 min-w-max"
          >
            {[
              {
                id: 'overview' as const,
                label: 'Overview & Lessons',
                labelHi: 'पाठ्यक्रम',
                icon: <ListOrdered className="w-4 h-4" />,
              },
              {
                id: 'concepts' as const,
                label: 'Key Concepts',
                labelHi: 'मूल तत्त्व',
                icon: <Brain className="w-4 h-4" />,
              },
              {
                id: 'flashcards' as const,
                label: 'Flashcards',
                labelHi: 'स्मृति पत्र',
                icon: <BookOpen className="w-4 h-4" />,
              },
              {
                id: 'mindmap' as const,
                label: 'Mind Map',
                labelHi: 'ज्ञान मानचित्र',
                icon: <Layers className="w-4 h-4" />,
              },
              {
                id: 'timeline' as const,
                label: 'Timeline',
                labelHi: 'कालक्रम',
                icon: <Clock className="w-4 h-4" />,
              },
              {
                id: 'quiz' as const,
                label: 'Knowledge Check',
                labelHi: 'ज्ञान परीक्षा',
                icon: <Trophy className="w-4 h-4" />,
              },
              {
                id: 'revision' as const,
                label: 'Revision',
                labelHi: 'पुनरावृत्ति',
                icon: <RotateCcw className="w-4 h-4" />,
              },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
                  className={`focus-ring flex min-h-[44px] items-center gap-2 px-4 py-2.5 rounded-xl font-serif text-xs md:text-sm transition-all select-none ${
                    isActive
                      ? 'bg-saffron-700 text-white font-bold shadow-xs'
                      : 'text-dharma-text hover:bg-dharma-card-soft hover:text-saffron-700'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-saffron-600'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  <span className="font-devanagari text-[11px] opacity-80 hidden sm:inline">
                    ({tab.labelHi})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Main Tab Content Panels ─────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        {/* TAB 1: OVERVIEW & LESSONS */}
        {activeTab === 'overview' && (
          <div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" className="space-y-10">
            {/* Philosophical Premise */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-dharma-text mb-2">
                    Philosophical Objective & Scope
                  </h2>
                  <p className="text-sm md:text-base text-dharma-text leading-relaxed font-serif">
                    {course.overview.philosophicalPremise}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-stone-900/60 border border-amber-200/60 dark:border-stone-800">
                  <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-saffron-800 dark:text-saffron-300 mb-1">
                    Scholarly Lineage & Canonical Context
                  </h3>
                  <p className="text-xs md:text-sm text-dharma-text font-serif leading-relaxed">
                    {course.overview.scholarlyContext}
                  </p>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-dharma-muted mb-2">
                    Core Learning Outcomes (प्राप्ति)
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm text-dharma-text font-serif">
                    {course.overview.learningOutcomes.map((outcome, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 p-2 rounded-lg bg-dharma-card border border-dharma-border/60"
                      >
                        <span className="text-saffron-600 font-bold mt-0.5">✦</span>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Study Method & Prerequisites Card */}
              <div className="lg:col-span-5 bg-gradient-to-b from-amber-50/70 to-orange-50/30 dark:from-stone-900/80 dark:to-stone-950/80 rounded-2xl border border-saffron-200/70 dark:border-stone-800 p-6 shadow-xs space-y-4">
                <div>
                  <span className="font-serif font-bold text-xs uppercase tracking-wider text-saffron-800 dark:text-saffron-300 block mb-1">
                    Contemplative Method (स्वाध्याय पद्धति)
                  </span>
                  <p className="text-xs text-dharma-text font-serif leading-relaxed">
                    {course.overview.studyMethodology}
                  </p>
                </div>

                <div className="border-t border-saffron-200/60 dark:border-stone-800 pt-3">
                  <span className="font-serif font-bold text-xs uppercase tracking-wider text-saffron-800 dark:text-saffron-300 block mb-1">
                    Prerequisites (पूर्व पीठिका)
                  </span>
                  <p className="text-xs text-dharma-muted font-serif">
                    {course.overview.prerequisites}
                  </p>
                </div>

                <div className="border-t border-saffron-200/60 dark:border-stone-800 pt-3">
                  <span className="font-serif font-bold text-xs uppercase tracking-wider text-saffron-800 dark:text-saffron-300 block mb-1">
                    Primary Objective
                  </span>
                  <p className="text-xs text-dharma-text font-serif leading-relaxed italic">
                    &ldquo;{course.learningObjective}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            <ManuscriptDivider label="Structured Lessons" labelSanskrit="पाठ्यक्रम सोपान" ornament="lotus" />

            {/* Interactive Lesson List */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-dharma-text">
                    Lessons in this Pathway ({course.lessons.length})
                  </h3>
                  <p className="text-xs text-dharma-muted font-serif">
                    Toggle completion as you read. Open any lesson to review key verses and concepts.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      course.lessons.forEach((l) => {
                        if (!completedSteps.includes(l.id)) {
                          progress.togglePathwayStep(course.id, l.id);
                        }
                      });
                    }}
                    className="text-xs font-serif font-semibold text-saffron-700 dark:text-saffron-400 hover:underline"
                  >
                    Mark All Completed
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {course.lessons.map((lesson) => {
                  const done = isLessonComplete(lesson.id);
                  const isSelected = selectedLessonId === lesson.id;

                  return (
                    <div
                      key={lesson.id}
                      className={`rounded-2xl border transition-all duration-200 ${
                        done
                          ? 'border-emerald-300/60 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/10'
                          : isSelected
                          ? 'border-saffron-400 bg-amber-50/40 dark:border-saffron-600 dark:bg-stone-900/60 shadow-sm'
                          : 'border-dharma-border bg-dharma-card hover:border-saffron-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <div className="p-4 md:p-5">
                        <div className="flex items-start gap-3.5">
                          {/* Completion Toggle Button */}
                          <button
                            type="button"
                            onClick={() => toggleLesson(lesson.id)}
                            className="mt-1 flex-shrink-0 focus:outline-hidden"
                            title={done ? 'Mark as incomplete' : 'Mark as complete'}
                            aria-label={`Mark lesson ${lesson.order} as ${done ? 'incomplete' : 'complete'}`}
                          >
                            {done ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-stone-400 hover:text-saffron-600 transition" />
                            )}
                          </button>

                          {/* Lesson Information */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-serif font-bold text-saffron-700 dark:text-saffron-400">
                                  Lesson {lesson.order}
                                </span>
                                {lesson.titleSanskrit && (
                                  <span
                                    lang="sa"
                                    className="font-devanagari text-xs text-saffron-600/90 dark:text-saffron-300/90"
                                  >
                                    • {lesson.titleSanskrit}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-dharma-muted flex items-center gap-1 font-serif">
                                <Clock className="w-3 h-3 text-saffron-600" />
                                {lesson.estimatedMinutes} mins
                              </span>
                            </div>

                            <h4 className="text-base font-serif font-bold text-dharma-text mb-1">
                              {lesson.title}
                            </h4>
                            <p className="text-xs md:text-sm text-dharma-muted font-serif leading-relaxed mb-3">
                              {lesson.description}
                            </p>

                            {/* Key Verse Quote (if provided) */}
                            {lesson.keyVerse && (
                              <div className="my-2.5 p-3 rounded-xl bg-amber-50/70 dark:bg-stone-900/80 border border-amber-200/50 dark:border-stone-800 text-xs font-serif">
                                <p
                                  lang="sa"
                                  className="font-devanagari text-xs md:text-sm text-saffron-900 dark:text-saffron-300 font-semibold mb-1"
                                >
                                  {lesson.keyVerse.sanskrit}
                                </p>
                                <p className="text-dharma-text/90 italic mb-1">
                                  &ldquo;{lesson.keyVerse.translation}&rdquo;
                                </p>
                                <span className="text-[10px] text-dharma-muted">
                                  — {lesson.keyVerse.reference}
                                </span>
                              </div>
                            )}

                            {/* Concepts & Action Links */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-dharma-border/40 text-xs">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[10px] text-dharma-muted font-serif">
                                  Focus:
                                </span>
                                {lesson.conceptsCovered.map((c, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-serif"
                                  >
                                    {c}
                                  </span>
                                ))}
                              </div>

                              <Link
                                href={lesson.scriptureHref}
                                className="inline-flex items-center gap-1 text-xs font-serif font-bold text-saffron-700 dark:text-saffron-400 hover:text-saffron-800 transition"
                              >
                                <span>Study in Scripture Reader</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KEY CONCEPTS & RELATED SCRIPTURES */}
        {activeTab === 'concepts' && (
          <div id="panel-concepts" role="tabpanel" aria-labelledby="tab-concepts" className="space-y-10">
            {/* Interactive Concept Relationship Graph */}
            <ConceptRelationshipGraph
              concepts={course.keyConcepts}
              title={`Concept Relationships: ${course.title}`}
            />

            <ManuscriptDivider label="Canonical Scriptures" labelSanskrit="सम्बद्ध शास्त्र" ornament="om" />

            {/* Related Scriptures Shelf */}
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-serif font-bold text-dharma-text">
                  Primary Textual Sources
                </h3>
                <p className="text-xs text-dharma-muted font-serif">
                  These authoritative scriptures form the textual foundation of this learning path. Read their full Sanskrit verses in Dharma Granth.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {course.relatedScriptures.map((scrip) => (
                  <div
                    key={scrip.id}
                    className="rounded-2xl border border-dharma-border bg-dharma-card p-6 hover:border-saffron-400 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p
                            lang="sa"
                            className="font-devanagari text-sm text-saffron-600 dark:text-saffron-400 font-semibold"
                          >
                            {scrip.titleSanskrit}
                          </p>
                          <h4 className="text-lg font-serif font-bold text-dharma-text">
                            {scrip.title}
                          </h4>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                          {scrip.category}
                        </span>
                      </div>

                      <p className="text-xs md:text-sm text-dharma-muted font-serif leading-relaxed mb-4">
                        {scrip.description}
                      </p>

                      {scrip.sampleVerse && (
                        <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-stone-900/80 border border-amber-200/50 dark:border-stone-800 text-xs font-serif mb-4">
                          <p
                            lang="sa"
                            className="font-devanagari text-xs md:text-sm text-saffron-900 dark:text-saffron-300 mb-1"
                          >
                            {scrip.sampleVerse.sanskrit}
                          </p>
                          <p className="text-dharma-text/90 italic">
                            &ldquo;{scrip.sampleVerse.translation}&rdquo;
                          </p>
                          <span className="text-[10px] text-dharma-muted mt-1 block">
                            — {scrip.sampleVerse.reference}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-dharma-border/60 flex items-center justify-between text-xs">
                      <span className="text-dharma-muted font-serif">
                        {scrip.totalChapters} Chapters • {scrip.totalVerses} Verses
                      </span>
                      <Link
                        href={scrip.href}
                        className="inline-flex items-center gap-1.5 font-serif font-bold text-saffron-700 dark:text-saffron-400 hover:underline"
                      >
                        <span>Open Scripture</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FLASHCARDS */}
        {activeTab === 'flashcards' && (
          <div id="panel-flashcards" role="tabpanel" aria-labelledby="tab-flashcards" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dharma-border/60 pb-3">
              <div>
                <h3 className="text-xl font-serif font-bold text-dharma-text">
                  Sacred Recall Flashcards ({deck.length} cards)
                </h3>
                <p className="text-xs text-dharma-muted font-serif">
                  Flip to inspect Sanskrit verses, transliterations, and core philosophical teachings.
                </p>
              </div>

              {/* Accessible Keyboard Controls Banner */}
              <div className="flex items-center gap-2 text-[11px] font-serif text-dharma-muted bg-amber-50/60 dark:bg-stone-800/80 px-3 py-1.5 rounded-lg border border-amber-200/50 dark:border-stone-700">
                <span className="font-bold text-saffron-700 dark:text-saffron-400">Controls:</span>
                <span>[Space] / [Enter] Flip</span>
                <span>•</span>
                <span>[←] [→] Navigate</span>
                <span>•</span>
                <span>[S] Shuffle</span>
              </div>
            </div>

            {deck.length > 0 ? (
              <div className="py-4">
                <FlashCard
                  data={deck[cardIndex]}
                  currentIndex={cardIndex}
                  total={deck.length}
                  onNext={handleNextCard}
                  onPrevious={handlePreviousCard}
                  onReset={handleResetCards}
                  onShuffle={handleShuffleCards}
                  spacedRepetitionMode={spacedMode}
                />
              </div>
            ) : (
              <p className="text-center py-12 text-dharma-muted">No flashcards found for this path.</p>
            )}
          </div>
        )}

        {/* TAB 4: MIND MAP */}
        {activeTab === 'mindmap' && (
          <div id="panel-mindmap" role="tabpanel" aria-labelledby="tab-mindmap" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dharma-border/60 pb-3">
              <div>
                <h3 className="text-xl font-serif font-bold text-dharma-text">
                  Hierarchical Philosophical Mind Map
                </h3>
                <p className="text-xs text-dharma-muted font-serif">
                  Explore how concepts, texts, and practices interconnect in this tradition.
                </p>
              </div>
            </div>

            <div className="bg-dharma-card rounded-2xl border border-dharma-border p-4 shadow-sm">
              <MindMap data={course.mindmap} />
            </div>
          </div>
        )}

        {/* TAB 5: TIMELINE */}
        {activeTab === 'timeline' && (
          <div id="panel-timeline" role="tabpanel" aria-labelledby="tab-timeline" className="space-y-6">
            <div className="border-b border-dharma-border/60 pb-3">
              <h3 className="text-xl font-serif font-bold text-dharma-text">
                Chronological & Narrative Lineage
              </h3>
              <p className="text-xs text-dharma-muted font-serif">
                Milestones across traditional epochs, textual revelations, and saintly lineages.
              </p>
            </div>

            <div className="bg-dharma-card rounded-2xl border border-dharma-border p-6 shadow-sm">
              <Timeline events={course.timeline} />
            </div>
          </div>
        )}

        {/* TAB 6: KNOWLEDGE CHECK */}
        {activeTab === 'quiz' && (
          <div id="panel-quiz" role="tabpanel" aria-labelledby="tab-quiz" className="space-y-6">
            <div className="border-b border-dharma-border/60 pb-3">
              <h3 className="text-xl font-serif font-bold text-dharma-text">
                Knowledge Check (ज्ञान परीक्षा)
              </h3>
              <p className="text-xs text-dharma-muted font-serif">
                Review your comprehension with instantaneous scholarly citations and explanations.
              </p>
            </div>

            <div className="bg-dharma-card rounded-2xl border border-dharma-border p-6 shadow-sm max-w-3xl mx-auto">
              <QuizRunner
                quiz={course.quiz}
                onComplete={(score, total) => {
                  progress.recordQuizResult(course.quiz.id, score, total);
                }}
              />
            </div>
          </div>
        )}

        {/* TAB 7: REVISION RECOMMENDATIONS */}
        {activeTab === 'revision' && (
          <div id="panel-revision" role="tabpanel" aria-labelledby="tab-revision" className="space-y-8">
            <div className="border-b border-dharma-border/60 pb-3">
              <h3 className="text-xl font-serif font-bold text-dharma-text">
                Spaced Revision & Contemplation Guide (मनन एवं निदिध्यासन)
              </h3>
              <p className="text-xs text-dharma-muted font-serif">
                Classical Indian study (Svādhyāya) emphasizes three stages: Śravaṇa (listening/reading), Manana (reflective pondering), and Nididhyāsana (deep meditative absorption).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contemplative Meditation Prompt */}
              <div className="rounded-2xl border border-saffron-300/70 bg-gradient-to-b from-amber-50/80 to-orange-50/30 dark:from-stone-900/80 dark:to-stone-950/80 p-6 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400 font-serif block mb-1">
                  Today&apos;s Contemplative Focus (निदिध्यासन सूत्र)
                </span>
                <p
                  lang="sa"
                  className="font-devanagari text-lg text-saffron-900 dark:text-saffron-300 font-semibold mb-2"
                >
                  {course.revisionRecommendations.contemplativeReflection.sanskritFocus}
                </p>
                <h4 className="text-base font-serif font-bold text-dharma-text mb-2">
                  {course.revisionRecommendations.contemplativeReflection.title}
                </h4>
                <p className="text-xs md:text-sm text-dharma-text/90 font-serif leading-relaxed mb-4">
                  {course.revisionRecommendations.contemplativeReflection.prompt}
                </p>
                <div className="p-3 rounded-xl bg-amber-100/60 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700 text-xs font-serif text-dharma-text">
                  <span className="font-bold text-saffron-800 dark:text-saffron-300">
                    Practical Application:
                  </span>{' '}
                  {course.revisionRecommendations.contemplativeReflection.practicalApplication}
                </div>
              </div>

              {/* Recommended Study Cadence & Recall Checklist */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6 shadow-xs">
                  <h4 className="font-serif font-bold text-sm text-dharma-text mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-saffron-600" />
                    <span>Recommended Rhythm</span>
                  </h4>
                  <p className="text-xs text-dharma-muted font-serif mb-3">
                    {course.revisionRecommendations.cadence}
                  </p>
                  <div className="space-y-1.5 text-xs font-serif">
                    <span className="font-semibold text-dharma-text block">
                      Recommended for review today:
                    </span>
                    {course.revisionRecommendations.recommendedReviewToday.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/50 dark:bg-stone-900/60 text-dharma-text"
                      >
                        <span className="text-saffron-600">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Recall Checklist */}
                <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6 shadow-xs">
                  <h4 className="font-serif font-bold text-sm text-dharma-text mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-saffron-600" />
                    <span>Active Recall Self-Assessment</span>
                  </h4>
                  <p className="text-xs text-dharma-muted font-serif mb-3">
                    Without looking at notes, can you answer these foundational questions?
                  </p>
                  <ul className="space-y-2 text-xs font-serif">
                    {course.revisionRecommendations.activeRecallChecklist.map((question, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 p-2.5 rounded-lg bg-dharma-card-soft border border-dharma-border/60 text-dharma-text"
                      >
                        <span className="text-saffron-600 font-bold">{i + 1}.</span>
                        <span>{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Core Verses to Memorize */}
            <div>
              <h4 className="font-serif font-bold text-lg text-dharma-text mb-3">
                Core Verses to Memorize (कण्ठस्थ श्लोक)
              </h4>
              <div className="space-y-3">
                {course.revisionRecommendations.coreVersesToMemorize.map((v, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-saffron-200/80 dark:border-stone-800 bg-dharma-card p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-serif font-bold text-saffron-700 dark:text-saffron-400">
                        {v.reference}
                      </span>
                      <span className="text-[11px] text-dharma-muted font-serif italic">
                        {v.philosophicalKey}
                      </span>
                    </div>
                    <p
                      lang="sa"
                      className="font-devanagari text-base md:text-lg text-saffron-900 dark:text-saffron-300 font-semibold mb-1"
                    >
                      {v.sanskrit}
                    </p>
                    <p className="text-xs text-stone-500 italic mb-2 font-serif">
                      {v.transliteration}
                    </p>
                    <p className="text-xs md:text-sm text-dharma-text font-serif leading-relaxed">
                      &ldquo;{v.translation}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
