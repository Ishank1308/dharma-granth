'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Flame, BookOpen, Bookmark, Award, ArrowRight, TrendingUp, FolderOpen, Highlighter, StickyNote } from 'lucide-react';
import { useStudyProgress } from '@/lib/useStudyProgress';
import { BackupRestore } from '@/app/components/BackupRestore';
import { PATHWAY_SUMMARIES, TOTAL_QUIZZES_COUNT } from '@/data/pathways-meta';
import type { VerseHighlight } from '@/lib/useStudyProgress';
import { chapterVerseHref } from '@/lib/verse-paths';

// Loaded after the dashboard shell so they stay out of the first-load script
// budget (300 KB gzip). Backup restore stays in the shell; the smoke test
// clicks it as soon as the page opens.
const DailyDharmaDashboard = dynamic(
  () => import('@/app/components/daily/DailyDharmaDashboard').then((m) => m.DailyDharmaDashboard),
  { ssr: false },
);
const DailyVerse = dynamic(
  () => import('@/app/components/DailyVerse').then((m) => m.DailyVerse),
  { ssr: false },
);
const PinterestWisdom = dynamic(
  () => import('@/app/components/PinterestWisdom').then((m) => m.PinterestWisdom),
  { ssr: false },
);
const DailyPracticePreview = dynamic(
  () => import('@/app/components/DailyPracticePreview').then((m) => m.DailyPracticePreview),
  { ssr: false },
);
const SpiritualProgressCard = dynamic(
  () => import('@/app/components/dashboard/SpiritualProgressCard').then((m) => m.SpiritualProgressCard),
  { ssr: false },
);
const ScriptureCompletionCard = dynamic(
  () => import('@/app/components/dashboard/ScriptureCompletionCard').then((m) => m.ScriptureCompletionCard),
  { ssr: false },
);
const RecentActivityFeed = dynamic(
  () => import('@/app/components/dashboard/RecentActivityFeed').then((m) => m.RecentActivityFeed),
  { ssr: false },
);

import { readRecentChapters, type ChapterVisit } from '@/lib/reading-history';
import { readActivity } from '@/lib/activity-log';
import type { UserSadhanaStats } from '@/lib/spiritual-levels';

// Literal class strings so Tailwind keeps them (matches VerseCard's palette).
const HIGHLIGHT_SWATCH: Record<VerseHighlight['color'], string> = {
  saffron: 'bg-saffron-500',
  amber: 'bg-amber-400',
  rose: 'bg-rose-500',
  emerald: 'bg-emerald-500',
  indigo: 'bg-indigo-500',
};

export function DashboardClient({ titles }: { titles: Record<string, string> }) {
  const progress = useStudyProgress();
  const [bookmarkCount, setBookmarkCount] = useState<number>(0);
  const [recentChapters, setRecentChapters] = useState<ChapterVisit[]>([]);
  const [recordedVerseCount, setRecordedVerseCount] = useState<number>(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dharma.bookmarkedVerses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setBookmarkCount(parsed.length);
        }
      }
      const chapters = readRecentChapters();
      setRecentChapters(chapters);
      const acts = readActivity();
      const verseRefs = new Set(acts.filter((a) => a.kind === 'verse').map((a) => a.ref));
      setRecordedVerseCount(verseRefs.size);
    } catch {}
  }, []);

  // The header is static, so it renders (and is exported) straight away; only
  // the personal stats below wait for localStorage.
  const header = (
    <section className="bg-gradient-to-br from-saffron-900 via-saffron-800 to-amber-900 text-white py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="fade-up-in">
          <p className="text-xs font-semibold uppercase tracking-widest text-saffron-200 mb-2">
            Your Study Dashboard
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">
            Welcome back, seeker 🙏
          </h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Continue your learning pathways and revisit your saved verses. Everything here stays in this browser.
          </p>
        </div>
      </div>
    </section>
  );

  if (!progress.hydrated) {
    return (
      <main className="min-h-screen bg-dharma-bg">
        {header}
        <DailyDharmaDashboard />
        <div className="flex min-h-[300px] items-center justify-center" aria-busy="true">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-saffron-200 border-t-saffron-600" />
        </div>
      </main>
    );
  }

  const { streak, collections, notes, highlights, pathwayProgress, quizResults } = progress;

  // Calculate pathway completion stats
  const pathwayStats = PATHWAY_SUMMARIES.map((p) => {
    const pp = pathwayProgress.find((pp) => pp.pathwayId === p.id);
    const completed = pp?.completedSteps.length ?? 0;
    const total = p.stepsCount;
    const pct = Math.round((completed / total) * 100);
    const isComplete = pct === 100;
    return { ...p, completed, total, pct, isComplete };
  });

  // Notes and highlights, merged per verse, newest first.
  const marks = new Map<
    string,
    { scriptureId: string; chapterId: number; verseId: string; note?: string; color?: VerseHighlight['color']; at: string }
  >();
  for (const n of notes) {
    const key = `${n.scriptureId}:${n.chapterId}:${n.verseId}`;
    marks.set(key, { scriptureId: n.scriptureId, chapterId: n.chapterId, verseId: String(n.verseId), note: n.text, at: n.updatedAt });
  }
  for (const h of highlights) {
    const key = `${h.scriptureId}:${h.chapterId}:${h.verseId}`;
    const existing = marks.get(key);
    if (existing) {
      existing.color = h.color;
      if (h.createdAt > existing.at) existing.at = h.createdAt;
    } else {
      marks.set(key, { scriptureId: h.scriptureId, chapterId: h.chapterId, verseId: String(h.verseId), color: h.color, at: h.createdAt });
    }
  }
  const recentMarks = Array.from(marks.values())
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 8);

  const completedPathways = pathwayStats.filter((p) => p.isComplete).length;
  const inProgressPathways = pathwayStats.filter((p) => p.completed > 0 && !p.isComplete).length;

  const sadhanaStats: UserSadhanaStats = {
    versesReadCount: recordedVerseCount,
    totalDaysRead: streak.totalDaysRead,
    notesCount: notes.length,
    highlightsCount: highlights.length,
    bookmarksCount: bookmarkCount,
    pathwaysCompleted: completedPathways,
  };

  return (
    <main className="min-h-screen bg-dharma-bg">
      {header}

      {/* Daily Dharma Journey Dashboard Hub (5 Primary Cards & Privacy Controls) */}
      <DailyDharmaDashboard />

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-10">
        {/* Stats Row */}
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Streak */}
            <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-saffron-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-saffron-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-saffron-700">Last read</span>
              </div>
              <p className="text-xl font-bold text-dharma-text">{streak.lastReadDate ? new Date(streak.lastReadDate).toLocaleDateString(undefined, { numberingSystem: 'latn' }) : 'Not yet'}</p>
              <p className="text-xs text-dharma-muted">Return whenever you like</p>
            </div>

            {/* Total Days Read */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Days read</span>
              </div>
              <p className="text-3xl font-bold text-dharma-text">{streak.totalDaysRead}</p>
              <p className="text-xs text-dharma-muted">{streak.totalDaysRead === 1 ? 'day' : 'days'} with some reading</p>
            </div>

            {/* Bookmarks */}
            <Link href="/practice/bookmarks/" className="rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 p-5 shadow-sm hover:shadow-md transition group">
              <div className="flex items-center gap-2 mb-2">
                <Bookmark className="w-5 h-5 text-rose-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Bookmarks</span>
              </div>
              <p className="text-3xl font-bold text-dharma-text">
                {bookmarkCount > 0
                  ? bookmarkCount
                  : collections.reduce((acc, c) => acc + c.verseRefs.length, 0) > 0
                  ? collections.reduce((acc, c) => acc + c.verseRefs.length, 0)
                  : '0'}
              </p>
              <p className="text-xs text-dharma-muted group-hover:text-rose-600 transition">saved verses</p>
            </Link>

            {/* Notes */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <StickyNote className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Notes</span>
              </div>
              <p className="text-3xl font-bold text-dharma-text">{notes.length}</p>
              <p className="text-xs text-dharma-muted">personal reflections</p>
            </div>
          </div>
        </>

        {/* Spiritual Progress Levels (आत्मिक सोपान · Seed to Scholar) */}
        <>
          <SpiritualProgressCard stats={sadhanaStats} />
        </>

        {/* Honest local reading activity and recent chapter positions */}
        <>
          <ScriptureCompletionCard
            recordedVerseCount={sadhanaStats.versesReadCount}
            recentChapters={recentChapters}
          />
        </>

        {/* Recent Activity Feed (स्वाध्याय क्रम) */}
        <>
          <RecentActivityFeed
            recentChapters={recentChapters}
            notes={notes}
            highlights={highlights}
            titles={titles}
          />
        </>

        {/* Daily Verse */}
        <DailyVerse />

        {/* Pinterest Wisdom */}
        <PinterestWisdom />

        {/* Learning Pathways */}
        <>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-serif font-bold text-dharma-text mb-1">
                Your Learning Pathways
              </h2>
              <p className="text-sm text-dharma-muted">
                {completedPathways} completed • {inProgressPathways} in progress • {PATHWAY_SUMMARIES.length - completedPathways - inProgressPathways} not started
              </p>
            </div>
            <Link
              href="/learn/pathways"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-saffron-700 hover:text-saffron-800 transition"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {pathwayStats.slice(0, 4).map((p) => (
              <div key={p.id} className="fade-up-in">
                <Link
                  href="/learn/pathways"
                  className="block rounded-2xl border border-dharma-border bg-dharma-card p-5 hover:shadow-lg hover:border-saffron-300 transition group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{p.icon}</span>
                      <div>
                        <h3 className="text-base font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition">
                          {p.title}
                        </h3>
                        {p.titleSanskrit && (
                          <p lang="sa" className="font-devanagari text-sm text-saffron-600">
                            {p.titleSanskrit}
                          </p>
                        )}
                      </div>
                    </div>
                    {p.isComplete && (
                      <Award className="w-5 h-5 text-saffron-500 flex-shrink-0" />
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-dharma-border rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full bg-gradient-to-r ${p.gradient} transition-all`}
                      style={{ width: `${p.pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-dharma-muted">
                    <span>{p.completed} / {p.total} steps</span>
                    <span className="font-semibold">{p.pct}%</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </>

        {/* Quick Access Row */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Collections */}
          <>
            <Link href="/collections" className="block rounded-2xl border border-dharma-border bg-dharma-card p-6 hover:shadow-lg hover:border-saffron-300 transition group h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-100 to-amber-100 text-saffron-700 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition">
                    Study Collections
                  </h3>
                  <p className="text-xs text-dharma-muted">{collections.length} collections</p>
                </div>
              </div>
              <p className="text-sm text-dharma-muted leading-relaxed">
                Organize your saved verses into thematic collections for easy reference and deeper study.
              </p>
            </Link>
          </>

          {/* Highlights */}
          <>
            <Link href="/collections" className="block rounded-2xl border border-dharma-border bg-dharma-card p-6 hover:shadow-lg hover:border-saffron-300 transition group h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 text-amber-700 flex items-center justify-center">
                  <Highlighter className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition">
                    Highlights
                  </h3>
                  <p className="text-xs text-dharma-muted">{highlights.length} highlighted verses</p>
                </div>
              </div>
              <p className="text-sm text-dharma-muted leading-relaxed">
                Color-code verses that resonate with you. Quickly find them across all scriptures.
              </p>
            </Link>
          </>

          {/* Quizzes */}
          <>
            <Link href="/learn" className="block rounded-2xl border border-dharma-border bg-dharma-card p-6 hover:shadow-lg hover:border-saffron-300 transition group h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition">
                    Quizzes
                  </h3>
                  <p className="text-xs text-dharma-muted">{quizResults.length} taken • {TOTAL_QUIZZES_COUNT} available</p>
                </div>
              </div>
              <p className="text-sm text-dharma-muted leading-relaxed">
                Test your knowledge with interactive quizzes on the Gita, Upanishads, Dharma, and Yoga.
              </p>
            </Link>
          </>
        </div>

        {/* Daily Sadhana Practice Preview */}
        <>
          <DailyPracticePreview />
        </>

        <BackupRestore />
      </div>
    </main>
  );
}
