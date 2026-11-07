'use client';

import { useState, useMemo, type CSSProperties } from 'react';
import Link from 'next/link';
import { PageHeader, SectionTitle } from '@/app/components/apple/PageHeader';
import { learningPaths, type LearningPath, type LearningFormat } from '@/data/learning-paths';
import { useStudyProgress } from '@/lib/useStudyProgress';
import { CalmProgress } from '@/app/components/CalmProgress';
import { SadhanaPortability } from '@/app/components/SadhanaPortability';
import { BackupRestore } from '@/app/components/BackupRestore';
import { JsonLd } from '@/app/components/JsonLd';
import { courseListLd, pageLd } from '@/lib/jsonld';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  GraduationCap,
  Library,
  Search,
  Sparkle,
} from 'lucide-react';

const FORMAT_NAMES: Record<string, string> = {
  flashcards: 'flashcards',
  slides: 'slides',
  mindmap: 'mind map',
  timeline: 'timeline',
  quizzes: 'quiz',
};

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

  const PORTALS = [
    { href: '/learn/start/', en: 'Find your starting point', hi: 'आरम्भ', sub: 'Five short questions, one calm first step', Icon: Sparkle, chip: '#c2410c' },
    { href: '/learn/journeys/', en: 'Guided journeys', hi: 'स्वाध्याय यात्राएँ', sub: 'Daily lessons with a reflection', Icon: Flame, chip: '#b45309' },
    { href: '/wisdom-pathways/', en: 'Wisdom pathways', hi: 'ज्ञान मार्ग', sub: 'Begin from fear, anger, grief or purpose', Icon: Compass, chip: '#15803d' },
    { href: '/learn/plans/', en: 'Reading plans', hi: 'स्वाध्याय योजना', sub: 'Day-by-day schedules and study orders', Icon: Clock, chip: '#1f4e8c' },
    { href: '/learn/faq/', en: 'Scripture FAQs', hi: 'जिज्ञासा समाधान', sub: 'Canon, schools of thought and ethics', Icon: GraduationCap, chip: '#6b3fa0' },
    { href: '/sources/', en: 'Sources and editions', hi: 'स्रोत पारदर्शिता', sub: 'Critical editions, recensions and method', Icon: Library, chip: '#57534e' },
  ];

  const PILLARS = [
    { sa: 'श्रवण', iast: 'Śravaṇa', en: 'Hear and read', text: 'Come to the text with full attention, and read the verse itself before any explanation.' },
    { sa: 'मनन', iast: 'Manana', en: 'Reflect', text: 'Turn it over with reason. Flashcards, mind maps and questions clear the doubts that remain.' },
    { sa: 'निदिध्यासन', iast: 'Nididhyāsana', en: 'Live with it', text: 'Let what is understood settle into the day, until it shows in how you act.' },
  ];

  return (
    <main className="apple-scope min-h-screen bg-dharma-bg pb-24 text-dharma-text">
      <JsonLd data={LEARN_JSON_LD} />
      <PageHeader
        eyebrow="Learn"
        eyebrowHi="स्वाध्यायान्मा प्रमदः"
        eyebrowLang="sa"
        title="Study the scriptures"
        titleHi="शास्त्र स्वाध्याय"
        lead={
          <p>
            Guided paths through the Vedas, Upanishads, Gita and the epics, with flashcards, mind maps, timelines and short
            questions. Go at your own pace; your progress stays on this device.
          </p>
        }
      >
        <p className="mt-3 text-subhead text-dharma-muted">
          <span>
            {learningPaths.length} paths · {totalLessons} lessons
            {totalCompletedLessons > 0 ? ` · ${totalCompletedLessons} read` : ''}
          </span>
          <span aria-hidden="true"> · </span>
          <Link href="/learn/academy/" className="text-dharma-saffron hover:underline">
            <span>Course levels</span> <span lang="hi" className="font-devanagari">धर्म अकादमी</span>{' '}
            <span aria-hidden="true">›</span>
          </Link>
        </p>
      </PageHeader>

      {/* ── Where to begin: one hub for starting points, journeys, plans and courses ── */}
      <section aria-labelledby="learn-start-heading" className="mx-auto max-w-content px-gutter pt-10">
        <h2 id="learn-start-heading" className="sr-only">Where to begin</h2>
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {PORTALS.map(({ href, en, hi, sub, Icon, chip }) => (
            <li key={href}>
              <Link href={href} style={{ '--chip': chip } as CSSProperties} className="apple-card flex h-full flex-col items-start gap-2 p-4 sm:flex-row sm:gap-3 sm:p-5">
                <span className="apple-tint-chip mt-0.5" aria-hidden="true">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-subhead font-semibold leading-snug tracking-[-0.02em] text-dharma-text sm:text-body">{en}</span>{' '}
                  <span lang="hi" className="block font-devanagari text-footnote text-dharma-muted">{hi}</span>{' '}
                  <span className="mt-1 hidden text-[14px] leading-snug text-dharma-muted sm:block">{sub}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Guided Learning Pathways (also the target of the /learn/pathways/ 301) ── */}
      <section id="courses" aria-labelledby="courses-heading" className="mx-auto max-w-content scroll-mt-24 px-gutter pt-16">
        <SectionTitle
          id="courses-heading"
          title="Learning paths"
          titleHi="अध्ययन मार्ग"
          sub="Step-by-step paths for steady, lifelong study."
        />

        {/* Filters: a segmented control, a filled search field and quiet format pills */}
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="apple-segmented self-start" role="group" aria-label="Level">
              {[
                { id: 'all', en: 'All', hi: 'सभी' },
                { id: 'beginner', en: 'Beginner', hi: 'प्रारम्भिक' },
                { id: 'intermediate', en: 'Intermediate', hi: 'मध्यम' },
                { id: 'advanced', en: 'Advanced', hi: 'उन्नत' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={selectedDifficulty === tab.id}
                  onClick={() => setSelectedDifficulty(tab.id as typeof selectedDifficulty)}
                >
                  <span>{tab.en}</span> <span lang="hi" className="sr-only">{tab.hi}</span>
                </button>
              ))}
            </div>
            <div className="relative md:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dharma-muted" aria-hidden="true" />
              <input
                type="search"
                aria-label="Search scripture or concept"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="apple-field !pl-9"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Format">
            {[
              { id: 'all', text: 'All formats' },
              { id: 'flashcards', text: 'Flashcards' },
              { id: 'mindmap', text: 'Mind maps' },
              { id: 'timeline', text: 'Timelines' },
              { id: 'quizzes', text: 'Quizzes' },
            ].map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                aria-pressed={selectedFormat === fmt.id}
                onClick={() => setSelectedFormat(fmt.id)}
                className={`min-h-9 rounded-full px-3.5 text-footnote transition ${
                  selectedFormat === fmt.id
                    ? 'bg-dharma-text text-dharma-bg'
                    : 'bg-dharma-text/[0.06] text-dharma-text hover:bg-dharma-text/[0.1]'
                }`}
              >
                {fmt.text}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredCourses.map((course) => {
            const pathwayProgress = progress.getPathwayProgress(course.id);
            const completedCount = pathwayProgress?.completedSteps?.length ?? 0;
            const totalCount = course.lessons.length;
            const pct = Math.min(Math.round((completedCount / totalCount) * 100), 100);
            const isFinished = pct === 100;
            const isExpanded = expandedCourseId === course.id;
            const level = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }[course.difficulty] ?? course.difficulty;

            return (
              <article key={course.id} className="apple-card flex flex-col overflow-hidden">
                <div className="flex-1 p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-field bg-dharma-text/[0.05] text-2xl">
                      {course.icon}
                    </span>
                    <div className="min-w-0">
                      <span lang="sa" className="block text-subhead leading-snug text-dharma-saffron">{course.titleSanskrit}</span>
                      <h3 className="text-title-3 font-semibold leading-tight text-dharma-text">{course.title}</h3>
                    </div>
                    {isFinished && (
                      <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-footnote text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Complete
                      </span>
                    )}
                  </div>

                  <p className="mt-3 line-clamp-3 text-subhead leading-relaxed text-dharma-text-secondary">{course.learningObjective}</p>

                  <p className="mt-3 text-footnote text-dharma-muted">
                    <span>{level}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{course.lessons.length} lessons</span>
                    <span aria-hidden="true"> · </span>
                    <span>{course.estimatedTime}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{course.includedFormats.map((f) => FORMAT_NAMES[f] ?? f).join(', ')}</span>
                  </p>

                  {completedCount > 0 && (
                    <div className="mt-4">
                      <CalmProgress completed={completedCount} total={totalCount} variant="linear" showPercentage={true} label="Your progress" />
                    </div>
                  )}

                  {isExpanded && (
                    <ol className="apple-group mt-4 bg-dharma-text/[0.04]">
                      {course.lessons.map((lesson) => (
                        <li key={lesson.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-[14px]">
                          <span className="min-w-0">
                            <span className="mr-2 tabular-nums text-dharma-muted">{lesson.order}</span>
                            <span className="text-dharma-text">{lesson.title}</span>
                          </span>
                          <span className="shrink-0 tabular-nums text-dharma-muted">{lesson.estimatedMinutes} min</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-dharma-text/10 px-5 py-3 sm:px-6">
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                    className="inline-flex min-h-11 items-center gap-1 text-subhead text-dharma-saffron"
                  >
                    <span>{isExpanded ? 'Hide lessons' : 'Show lessons'}</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
                  </button>
                  <Link href={`/learn/${course.id}`} className="apple-pill tap-target">
                    <span>{completedCount === 0 ? 'Begin' : isFinished ? 'Review' : 'Continue'}</span>
                    <span className="sr-only"> {course.title}</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="apple-card py-14 text-center">
            <p className="text-dharma-muted">No paths match these filters.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedDifficulty('all');
                setSelectedFormat('all');
                setSearchQuery('');
              }}
              className="mt-2 min-h-11 text-subhead text-dharma-saffron"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* ── The three steps of svādhyāya ── */}
      <section aria-labelledby="pillars-heading" className="mx-auto max-w-content px-gutter pt-20">
        <SectionTitle
          id="pillars-heading"
          title="How to study"
          titleHi="स्वाध्याय त्रिपदी"
          sub="Progress here is measured in clarity and calm, not certificates."
        />
        <ol className="mt-8 grid gap-8 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <li key={p.iast}>
              <p className="text-footnote tabular-nums text-dharma-muted">{i + 1}</p>
              <p lang="sa" className="mt-1 text-[30px] leading-tight text-dharma-text">{p.sa}</p>
              <h3 className="mt-1 text-body font-semibold tracking-[-0.02em] text-dharma-text">
                <span>{p.en}</span> <span className="font-normal text-dharma-muted">· {p.iast}</span>
              </h3>
              <p className="mt-1 text-subhead leading-relaxed text-dharma-muted">{p.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="mx-auto max-w-content space-y-4 px-gutter pb-8 pt-16">
        <SadhanaPortability />
        <BackupRestore />
      </div>
    </main>
  );
}
