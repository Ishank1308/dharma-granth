'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { BookExplanation } from '@/data/book-explanations';
import type { ScriptureMeta } from '@/data/types';
import { catalogueNote, formatCount, hindiCatalogueNote } from '@/lib/holdings-label';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Compass,
  Languages,
  Layers,
  PenLine,
  Sparkles,
} from 'lucide-react';

type Language = 'hi' | 'en';
type StepKey = 'overview' | 'focus' | 'chapters' | 'reflect';

interface ChapterPreview {
  id: number;
  title: string;
  titleSanskrit?: string;
  summary?: string;
  verseCount: number;
}

interface BookLearningClientProps {
  meta: ScriptureMeta;
  explanation?: BookExplanation;
  chapters: ChapterPreview[];
  /** Catalogue figure. Shown only as a note when it differs from the chapter list. */
  catalogueVerses?: number;
  catalogueChapters?: number;
}

const CATEGORY_NAMES: Record<string, string> = {
  itihasa: 'Itihāsa · इतिहास',
  upanishad: 'Upaniṣad · उपनिषद्',
  veda: 'Veda · वेद',
  purana: 'Purāṇa · पुराण',
  smriti: 'Smṛti · स्मृति',
  tantra: 'Tantra · तन्त्र',
  stotra: 'Stotra · स्तोत्र',
  other: 'Other · अन्य',
};

const copy = {
  hi: {
    guided: 'मार्गदर्शित अध्ययन',
    progress: 'प्रगति',
    overview: 'मुख्य अर्थ',
    focus: 'कैसे पढ़ें',
    chapters: 'अध्याय',
    reflect: 'मनन',
    complete: 'पूर्ण करें',
    completed: 'पूर्ण',
    start: 'पढ़ना शुरू करें',
    continue: 'अध्याय खोलें',
    cataloged: 'यह ग्रंथ अभी सूचीबद्ध है। श्लोक-दर-श्लोक अध्ययन तैयार किया जा रहा है।',
    reflectionPrompt: 'इस ग्रंथ से आज के जीवन के लिए कौन सी एक बात अपनाई जा सकती है?',
    reflectionPlaceholder: 'अपना छोटा मनन लिखें...',
    tags: 'विषय',
    chaptersLabel: 'अध्याय',
    versesLabel: 'श्लोक',
    available: 'श्लोक पाठ पुस्तकालय में',
    preparing: 'श्लोक पाठ अभी नहीं',
  },
  en: {
    guided: 'Guided Study',
    progress: 'Progress',
    overview: 'Core Meaning',
    focus: 'How To Read',
    chapters: 'Chapters',
    reflect: 'Reflect',
    complete: 'Complete',
    completed: 'Completed',
    start: 'Start Reading',
    continue: 'Open Chapter',
    cataloged: 'This scripture is cataloged. Verse-by-verse learning is being prepared.',
    reflectionPrompt: 'What is one lesson from this text that can be practiced today?',
    reflectionPlaceholder: 'Write a short reflection...',
    tags: 'Themes',
    chaptersLabel: 'Chapters',
    versesLabel: 'Verses',
    available: 'Verse text in the library',
    preparing: 'Verse text not in the library yet',
  },
};

const steps: StepKey[] = ['overview', 'focus', 'chapters', 'reflect'];

export function BookLearningClient({
  meta,
  explanation,
  chapters,
  catalogueVerses,
  catalogueChapters,
}: BookLearningClientProps) {
  const [language, setLanguage] = useState<Language>('hi');
  const [activeStep, setActiveStep] = useState<StepKey>('overview');
  const [completedSteps, setCompletedSteps] = useState<StepKey[]>([]);
  const [reflection, setReflection] = useState('');
  const reduce = useReducedMotion();

  const labels = copy[language];
  const completedSet = useMemo(() => new Set(completedSteps), [completedSteps]);
  const progress = Math.round((completedSet.size / steps.length) * 100);
  const firstReadableChapter = chapters.find(chapter => chapter.verseCount > 0) ?? chapters[0];
  const inLibraryChapters = chapters.filter((chapter) => chapter.verseCount > 0).length;
  const inLibraryVerses = chapters.reduce((sum, chapter) => sum + chapter.verseCount, 0);
  const noteFor = language === 'hi' ? hindiCatalogueNote : catalogueNote;
  const chapterNote = noteFor(inLibraryChapters, catalogueChapters, 'chapter');
  const verseNote = noteFor(inLibraryVerses, catalogueVerses, 'verse');
  const overview = explanation?.overview[language] ?? meta.description;
  const focus = explanation?.focus[language] ?? labels.cataloged;

  function completeStep(step: StepKey) {
    setCompletedSteps(current => (current.includes(step) ? current : [...current, step]));
  }

  function renderStepContent() {
    if (activeStep === 'overview') {
      return (
        <div className="space-y-4">
          <p
            lang={language}
            className={`leading-relaxed text-dharma-text ${language === 'hi' ? 'font-devanagari text-lg' : 'text-base'}`}
          >
            {overview}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-dharma-border bg-dharma-bg p-4">
              <p className="text-2xl font-bold text-saffron-700">{formatCount(inLibraryChapters)}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-dharma-muted">{labels.chaptersLabel}</p>
              {chapterNote && <p className="mt-1 text-xs leading-snug text-dharma-muted">{chapterNote}</p>}
            </div>
            <div className="rounded-lg border border-dharma-border bg-dharma-bg p-4">
              <p className="text-2xl font-bold text-saffron-700">{formatCount(inLibraryVerses)}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-dharma-muted">{labels.versesLabel}</p>
              {verseNote && <p className="mt-1 text-xs leading-snug text-dharma-muted">{verseNote}</p>}
            </div>
            <div className="rounded-lg border border-dharma-border bg-dharma-bg p-4">
              <p className="text-base font-bold text-saffron-700">{inLibraryVerses > 0 ? labels.available : labels.preparing}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-dharma-muted">{CATEGORY_NAMES[meta.category] || meta.category}</p>
            </div>
          </div>
        </div>
      );
    }

    if (activeStep === 'focus') {
      return (
        <div className="space-y-5">
          <p
            lang={language}
            className={`leading-relaxed text-dharma-text ${language === 'hi' ? 'font-devanagari text-lg' : 'text-base'}`}
          >
            {focus}
          </p>
          {meta.tags.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-dharma-muted">{labels.tags}</p>
              <div className="flex flex-wrap gap-2">
                {meta.tags.map(tag => (
                  <span key={tag} className="rounded-full bg-saffron-50 px-3 py-1 text-xs font-semibold text-saffron-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeStep === 'chapters') {
      if (chapters.length === 0) {
        return (
          <div className="rounded-lg border border-dharma-border bg-dharma-bg p-5">
            <p lang="hi" className={`leading-relaxed text-dharma-text ${language === 'hi' ? 'font-devanagari text-lg' : 'text-base'}`}>
              {labels.cataloged}
            </p>
          </div>
        );
      }

      return (
        <div className="grid gap-3">
          {chapters.map(chapter => (
            <Link
              key={chapter.id}
              href={`/scripture/${meta.id}/chapter/${chapter.id}`}
              className="group flex items-start gap-4 rounded-lg border border-dharma-border bg-dharma-card p-4 transition hover:border-saffron-300 hover:bg-saffron-500/10"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-saffron-100 text-sm font-bold text-saffron-800">
                {chapter.id}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-serif text-lg font-bold text-dharma-text group-hover:text-saffron-700">
                  {chapter.title}
                </span>
                {chapter.titleSanskrit && (
                  <span lang="sa" className="mt-1 block font-devanagari text-sm text-dharma-muted">{chapter.titleSanskrit}</span>
                )}
                {chapter.summary && <span className="mt-2 block text-sm text-dharma-muted line-clamp-2">{chapter.summary}</span>}
                <span className="mt-2 block text-xs font-semibold text-dharma-muted">
                  {chapter.verseCount.toLocaleString(undefined, { numberingSystem: 'latn' })} {labels.versesLabel}
                </span>
              </span>
              <ChevronRight className="mt-2 h-5 w-5 flex-shrink-0 text-dharma-muted group-hover:text-saffron-700" />
            </Link>
          ))}
        </div>
      );
    }

    return (
      <div className="rounded-lg border border-dharma-border bg-dharma-bg p-5">
        <p lang="hi" className={`mb-4 leading-relaxed text-dharma-text ${language === 'hi' ? 'font-devanagari text-lg' : 'text-base'}`}>
          {labels.reflectionPrompt}
        </p>
        <textarea
          value={reflection}
          onChange={event => setReflection(event.target.value)}
          placeholder={labels.reflectionPlaceholder}
          className="min-h-28 w-full resize-y rounded-lg border border-dharma-border bg-dharma-card p-3 text-sm leading-relaxed text-dharma-text outline-none transition focus:border-saffron-500 focus:ring-2 focus:ring-saffron-100/20"
        />
      </div>
    );
  }

  return (
    <section className="rounded-lg border border-dharma-border bg-dharma-card shadow-sm">
      <div className="border-b border-dharma-border p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-saffron-700">{labels.guided}</p>
            <h2 className="mt-1 text-2xl font-serif font-bold text-dharma-text">{meta.title}</h2>
            <p lang="sa" className="font-devanagari text-sm text-dharma-muted">{meta.titleSanskrit}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1 rounded-lg border border-dharma-border bg-dharma-bg p-1">
              <Languages className="ml-2 h-4 w-4 text-dharma-muted" />
              {(['hi', 'en'] as const).map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setLanguage(option)}
                  className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                    language === option ? 'bg-dharma-bg text-saffron-800 shadow-sm' : 'text-dharma-muted hover:text-dharma-text'
                  }`}
                >
                  {option === 'hi' ? 'हिन्दी' : 'English'}
                </button>
              ))}
            </div>
            <div className="w-36">
              <div className="mb-1 flex items-center justify-between text-xs text-dharma-muted">
                <span>{labels.progress}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-saffron-100">
                <div className="h-2 rounded-full bg-saffron-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[240px_1fr]">
        <nav className="border-b border-dharma-border p-4 lg:border-b-0 lg:border-r">
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {steps.map(step => {
              const isActive = activeStep === step;
              const isComplete = completedSet.has(step);
              const Icon = step === 'overview' ? Sparkles : step === 'focus' ? Compass : step === 'chapters' ? Layers : PenLine;
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => setActiveStep(step)}
                  className={`flex min-h-12 items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-sm font-semibold transition ${
                    isActive
                      ? 'border-saffron-500 bg-saffron-500/10 text-saffron-800'
                      : 'border-dharma-border text-dharma-text hover:border-saffron-300 hover:bg-saffron-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {labels[step]}
                  </span>
                  {isComplete && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="space-y-5 p-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeStep}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dharma-border pt-5">
            <button
              type="button"
              onClick={() => completeStep(activeStep)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                completedSet.has(activeStep)
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-saffron-600 text-white hover:bg-saffron-700'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              {completedSet.has(activeStep) ? labels.completed : labels.complete}
            </button>
            {firstReadableChapter && (
              <Link
                href={`/scripture/${meta.id}/chapter/${firstReadableChapter.id}`}
                className="inline-flex items-center gap-2 rounded-lg border border-dharma-border bg-dharma-card px-4 py-2 text-sm font-semibold text-dharma-text transition hover:bg-saffron-500/10"
              >
                <BookOpen className="h-4 w-4" />
                {labels.start}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
