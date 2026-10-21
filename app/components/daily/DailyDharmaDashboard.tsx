'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Clock,
  Bookmark,
  Compass,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Pause,
  Play,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  HelpCircle,
  EyeOff,
  Sun,
  Moon,
  Sunset,
} from 'lucide-react';
import { readRecentChapters, type ChapterVisit } from '@/lib/reading-history';
import { SAMPLE_DAILY_JOURNEYS } from '@/data/daily-dharma-data';

interface DashboardPrefs {
  isHistoryPaused: boolean;
  recommendationsEnabled: boolean;
  clearedAt?: string | null;
}

const DASHBOARD_PREFS_KEY = 'dharma.dashboard.prefs.v1';
const SAVED_KEY = 'dharma.savedCollections.v1';
const JOURNEYS_KEY = 'dharma.journeys.v1';

export function DailyDharmaDashboard() {
  const [mounted, setMounted] = useState(false);
  const [recentChapter, setRecentChapter] = useState<ChapterVisit | null>(null);
  const [savedCount, setSavedCount] = useState<number>(0);
  const [journeyProgress, setJourneyProgress] = useState<{
    id: string;
    title: string;
    step: number;
    total: number;
  } | null>(null);

  const [prefs, setPrefs] = useState<DashboardPrefs>({
    isHistoryPaused: false,
    recommendationsEnabled: true,
    clearedAt: null,
  });

  const [statusMessage, setStatusMessage] = useState<string>('');
  const [activeWhyModal, setActiveWhyModal] = useState<string | null>(null);
  const [hiddenRecId, setHiddenRecId] = useState<string | null>(null);

  // Today's journey highlight
  const todaySession = SAMPLE_DAILY_JOURNEYS['gita-2-47'];

  useEffect(() => {
    setMounted(true);
    try {
      const storedPrefs = localStorage.getItem(DASHBOARD_PREFS_KEY);
      if (storedPrefs) setPrefs(JSON.parse(storedPrefs));

      const recent = readRecentChapters();
      if (recent && recent.length > 0) setRecentChapter(recent[0]);

      const rawSaved = localStorage.getItem(SAVED_KEY);
      if (rawSaved) {
        const parsed = JSON.parse(rawSaved);
        let count = 0;
        Object.values(parsed).forEach((list: any) => {
          if (Array.isArray(list)) count += list.length;
        });
        setSavedCount(count);
      }

      const rawJourneys = localStorage.getItem(JOURNEYS_KEY);
      if (rawJourneys) {
        const parsed = JSON.parse(rawJourneys);
        const keys = Object.keys(parsed);
        if (keys.length > 0) {
          const firstKey = keys[0];
          setJourneyProgress({
            id: firstKey,
            title: firstKey === 'understanding-karma-yoga' ? 'Understanding Karma Yoga' : 'Gita in 18 Lessons',
            step: (parsed[firstKey]?.length || 0) + 1,
            total: firstKey === 'understanding-karma-yoga' ? 7 : 18,
          });
        }
      }
    } catch {}
  }, []);

  const savePrefs = (next: DashboardPrefs) => {
    setPrefs(next);
    try {
      localStorage.setItem(DASHBOARD_PREFS_KEY, JSON.stringify(next));
    } catch {}
  };

  const handleTogglePause = () => {
    const next = { ...prefs, isHistoryPaused: !prefs.isHistoryPaused };
    savePrefs(next);
    showNotice(next.isHistoryPaused ? 'Reading history paused.' : 'Reading history resumed.');
  };

  const handleToggleRecs = () => {
    const next = { ...prefs, recommendationsEnabled: !prefs.recommendationsEnabled };
    savePrefs(next);
    showNotice(next.recommendationsEnabled ? 'Recommendations enabled.' : 'Recommendations disabled.');
  };

  const handleClearHistory = () => {
    if (!window.confirm('Clear your local reading history from this device? Your saved bookmarks will be preserved.')) return;
    try {
      localStorage.removeItem('dharma.recentChapters');
      localStorage.removeItem(JOURNEYS_KEY);
      setRecentChapter(null);
      setJourneyProgress(null);
      const next = { ...prefs, clearedAt: new Date().toISOString() };
      savePrefs(next);
      showNotice('Local reading history cleared.');
    } catch {}
  };

  const handleExportData = () => {
    try {
      const data = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        recent: localStorage.getItem('dharma.recentChapters'),
        saved: localStorage.getItem(SAVED_KEY),
        journeys: localStorage.getItem(JOURNEYS_KEY),
        reflections: localStorage.getItem('dharma.practice.reflections'),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dharma-granth-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotice('Private data exported successfully.');
    } catch {
      showNotice('Export failed.');
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.saved) localStorage.setItem(SAVED_KEY, json.saved);
        if (json.journeys) localStorage.setItem(JOURNEYS_KEY, json.journeys);
        if (json.recent) localStorage.setItem('dharma.recentChapters', json.recent);
        showNotice('Backup restored successfully.');
        window.location.reload();
      } catch {
        showNotice('Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };

  const showNotice = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const isReturningUser = mounted && Boolean(recentChapter || journeyProgress || savedCount > 0);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-fade-in text-dharma-text">
      {/* ── Top Privacy & Data Sovereignty Toolbar ─────────────────── */}
      <aside
        aria-label="Privacy and Local Data Controls"
        className="rounded-2xl border border-dharma-border bg-dharma-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
      >
        <div className="flex items-center gap-2 text-dharma-muted">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Local Data Only · No Account Required · Zero Tracking</span>
          {prefs.isHistoryPaused && (
            <span className="bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 px-2 py-0.5 rounded-full font-semibold">
              Paused
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleTogglePause}
            className="focus-ring inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dharma-border bg-dharma-bg hover:border-saffron-500 text-dharma-text transition-colors"
          >
            {prefs.isHistoryPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5 text-amber-600" />}
            {prefs.isHistoryPaused ? 'Resume History' : 'Pause History'}
          </button>

          <button
            type="button"
            onClick={handleToggleRecs}
            className="focus-ring inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dharma-border bg-dharma-bg hover:border-saffron-500 text-dharma-text transition-colors"
          >
            {prefs.recommendationsEnabled ? <EyeOff className="w-3.5 h-3.5 text-dharma-muted" /> : <Sparkles className="w-3.5 h-3.5 text-saffron-600" />}
            {prefs.recommendationsEnabled ? 'Disable Recs' : 'Enable Recs'}
          </button>

          <button
            type="button"
            onClick={handleExportData}
            className="focus-ring inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dharma-border bg-dharma-bg hover:border-saffron-500 text-dharma-text transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-dharma-muted" />
            Export
          </button>

          <label className="focus-ring inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dharma-border bg-dharma-bg hover:border-saffron-500 text-dharma-text transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-dharma-muted" />
            Import
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>

          <button
            type="button"
            onClick={handleClearHistory}
            className="focus-ring inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-red-800 hover:bg-red-50 dark:text-red-200 dark:hover:bg-red-950/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </aside>

      {/* Live Toast Notice */}
      {statusMessage && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl bg-saffron-50 dark:bg-saffron-950/40 border border-saffron-200 dark:border-saffron-900/50 p-3 text-xs text-saffron-900 dark:text-saffron-200 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-saffron-600" />
          {statusMessage}
        </div>
      )}

      {/* ── RETURNING USER VIEW: NO MORE THAN 5 PRIMARY CARDS ──────── */}
      {isReturningUser ? (
        <div className="space-y-6">
          <header className="pb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
              Welcome Back Seeker · स्वागतम्
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-dharma-text mt-1">
              Your Daily Study Sanctuary
            </h2>
            <p className="text-xs sm:text-sm text-dharma-muted mt-1">
              Continue whenever you are ready. Take a quiet breath before you read.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CARD 1: CONTINUE READING */}
            {recentChapter && (
              <article className="lg:col-span-2 rounded-3xl border border-dharma-border bg-gradient-to-br from-dharma-card to-dharma-bg p-6 sm:p-8 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between text-xs text-dharma-muted mb-3">
                    <span className="flex items-center gap-1.5 font-bold text-saffron-800 dark:text-saffron-300">
                      <BookOpen className="w-4 h-4" />
                      1. Continue Reading
                    </span>
                    <span>Last read {new Date(recentChapter.readAt).toLocaleDateString(undefined, { numberingSystem: 'latn' })}</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-dharma-text">
                    {recentChapter.scriptureTitle}
                  </h3>
                  <p className="text-sm sm:text-base text-dharma-muted mt-1">
                    Chapter {recentChapter.chapterId}{' '}
                    {recentChapter.verseId ? `· Verse ${recentChapter.verseId}` : ''}
                  </p>

                  <div className="mt-4 p-4 rounded-2xl bg-dharma-bg border border-dharma-border/80">
                    <p className="text-xs uppercase tracking-wider font-semibold text-dharma-muted mb-1">
                      Context Refresher
                    </p>
                    <p className="text-xs sm:text-sm text-dharma-text italic">
                      &quot;Pick up seamlessly at your exact reading location without losing philosophical narrative continuity.&quot;
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-dharma-border/60 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/scripture/${recentChapter.scriptureId}/chapter/${recentChapter.chapterId}${
                      recentChapter.verseId ? `/verse/${recentChapter.verseId}` : ''
                    }`}
                    className="focus-ring inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-sm transition-colors shadow-2xs"
                  >
                    Resume Reading
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href={`/scripture/${recentChapter.scriptureId}`}
                    className="focus-ring inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-dharma-border bg-dharma-card hover:border-saffron-400 text-xs font-semibold text-dharma-text transition-colors"
                  >
                    Explore Whole Scripture
                  </Link>
                </div>
              </article>
            )}

            {/* CARD 2: TODAY'S DHARMA JOURNEY */}
            <article className="rounded-3xl border border-dharma-border bg-dharma-card p-6 flex flex-col justify-between shadow-sm">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 mb-3">
                  <Clock className="w-4 h-4" />
                  2. Today’s Dharma Journey
                </span>

                <h3 className="font-serif text-lg font-bold text-dharma-text">
                  {todaySession.referenceDisplayEn}
                </h3>
                <p className="text-xs text-dharma-muted mt-1">
                  Lesson {todaySession.lessonIndex} of {todaySession.totalLessons} · ~{todaySession.estimatedMinutes} minutes
                </p>

                <div className="mt-4 p-3 rounded-xl bg-dharma-bg border border-dharma-border text-xs text-dharma-text">
                  &quot;{todaySession.thirtySecondCard.teaching}&quot;
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/daily"
                  className="focus-ring w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-xs transition-colors shadow-2xs"
                >
                  Begin Daily Session
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </article>

            {/* CARD 3: ACTIVE LEARNING PATH */}
            <article className="rounded-3xl border border-dharma-border bg-dharma-card p-6 flex flex-col justify-between shadow-sm">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-bold text-saffron-800 dark:text-saffron-300 mb-3">
                  <Compass className="w-4 h-4" />
                  3. Active Learning Path
                </span>

                <h3 className="font-serif text-lg font-bold text-dharma-text">
                  {journeyProgress ? journeyProgress.title : 'Bhagavad Gita for Beginners'}
                </h3>
                <p className="text-xs text-dharma-muted mt-1">
                  {journeyProgress
                    ? `Lesson ${journeyProgress.step} of ${journeyProgress.total} is ready`
                    : '18 serene steps exploring life, purpose, and inner stillness.'}
                </p>

                {/* Calm Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="w-full bg-dharma-bg h-2 rounded-full border border-dharma-border overflow-hidden">
                    <div
                      className="bg-saffron-600 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          journeyProgress
                            ? (journeyProgress.step / journeyProgress.total) * 100
                            : 20
                        }%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-dharma-muted">
                    {journeyProgress
                      ? `Calm progress: ${journeyProgress.step - 1} completed`
                      : 'Take as much time as you need'}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href={journeyProgress ? `/journeys/${journeyProgress.id}` : '/journeys'}
                  className="focus-ring w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dharma-border bg-dharma-bg hover:border-saffron-400 text-xs font-semibold text-dharma-text transition-colors"
                >
                  Continue Lesson
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </article>

            {/* CARD 4: SAVED FOR REVIEW */}
            <article className="rounded-3xl border border-dharma-border bg-dharma-card p-6 flex flex-col justify-between shadow-sm">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-400 mb-3">
                  <Bookmark className="w-4 h-4" />
                  4. Saved for Review
                </span>

                <h3 className="font-serif text-lg font-bold text-dharma-text">
                  Private Study Desk
                </h3>
                <p className="text-xs text-dharma-muted mt-1">
                  {savedCount} teachings and reflections organized in your local study desk.
                </p>

                <div className="mt-4 p-3 rounded-xl bg-dharma-bg border border-dharma-border text-xs text-dharma-muted">
                  Folders: Study Carefully, Daily Reflection, Favorites.
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/desk"
                  className="focus-ring w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dharma-border bg-dharma-bg hover:border-saffron-400 text-xs font-semibold text-dharma-text transition-colors"
                >
                  Open Study Desk
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </article>

            {/* CARD 5: RECOMMENDED NEXT TEACHING (Explainable) */}
            {prefs.recommendationsEnabled && hiddenRecId !== 'rec-isha-2' && (
              <article className="rounded-3xl border border-dharma-border bg-dharma-card p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                      <Sparkles className="w-4 h-4" />
                      5. Recommended Next Teaching
                    </span>
                    <button
                      type="button"
                      onClick={() => setHiddenRecId('rec-isha-2')}
                      className="text-dharma-muted hover:text-dharma-text text-[11px]"
                    >
                      Hide
                    </button>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-dharma-text">
                    Isha Upanishad Mantra 2
                  </h3>
                  <p className="text-xs text-dharma-muted mt-1">
                    &quot;Performing selfless action here, one may desire to live a hundred years.&quot;
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-[11px] text-emerald-900 dark:text-emerald-200">
                    <strong>Why this appears:</strong> This verse provides the Vedic root of Karma Yoga referenced in Bhagavad Gita 2.47.
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Link
                    href="/scripture/ishavasya/chapter/1/verse/2"
                    className="focus-ring w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dharma-border bg-dharma-bg hover:border-saffron-400 text-xs font-semibold text-dharma-text transition-colors"
                  >
                    Explore Passage
                    <ChevronRight className="w-4 h-4" />
                  </Link>

                  <div className="flex items-center justify-between text-[11px] text-dharma-muted pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveWhyModal(activeWhyModal === 'rec-isha-2' ? null : 'rec-isha-2')
                      }
                      className="hover:text-dharma-text underline"
                    >
                      Why am I seeing this?
                    </button>
                  </div>

                  {activeWhyModal === 'rec-isha-2' && (
                    <div className="p-2.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-[10px] text-sky-950 dark:text-sky-200">
                      Basis: Canonical cross-reference. Cites ancient Vedic mantra directly linked in classical commentaries. Zero third-party telemetry.
                    </div>
                  )}
                </div>
              </article>
            )}
          </div>
        </div>
      ) : (
        /* ── NEW VISITOR ONBOARDING DASHBOARD ───────────────────────── */
        <div className="rounded-3xl border border-dharma-border bg-dharma-card p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-8">
          <div className="w-16 h-16 rounded-full bg-saffron-100 dark:bg-saffron-950/60 text-saffron-700 dark:text-saffron-300 mx-auto flex items-center justify-center shadow-xs">
            <BookOpen className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider font-bold text-saffron-700 dark:text-saffron-400">
              Welcome to Dharma Granth · स्वागतम्
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-dharma-text">
              Begin Your Scripture Journey
            </h2>
            <p className="text-sm text-dharma-muted max-w-lg mx-auto leading-relaxed">
              No account required. All preferences, saved verses, and reading progress remain strictly on your device.
            </p>
          </div>

          {/* Five Curated Starting Points for New Visitors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <Link
              href="/scripture/bhagavadgita"
              className="p-5 rounded-2xl border border-dharma-border bg-dharma-bg hover:border-saffron-400 hover:shadow-xs transition-all focus-ring group"
            >
              <p className="font-bold text-sm text-dharma-text group-hover:text-saffron-700 transition-colors">
                1. Start with Bhagavad Gita
              </p>
              <p className="text-xs text-dharma-muted mt-1 leading-relaxed">
                Explore Chapter 1 in plain Hindi or English with verse-by-verse guidance.
              </p>
            </Link>

            <Link
              href="/daily"
              className="p-5 rounded-2xl border border-dharma-border bg-dharma-bg hover:border-saffron-400 hover:shadow-xs transition-all focus-ring group"
            >
              <p className="font-bold text-sm text-dharma-text group-hover:text-saffron-700 transition-colors">
                2. Try Five-Minute Wisdom
              </p>
              <p className="text-xs text-dharma-muted mt-1 leading-relaxed">
                A single reviewed verse, slow pronunciation, and 30-second modern context.
              </p>
            </Link>

            <Link
              href="/wisdom-for-life"
              className="p-5 rounded-2xl border border-dharma-border bg-dharma-bg hover:border-saffron-400 hover:shadow-xs transition-all focus-ring group"
            >
              <p className="font-bold text-sm text-dharma-text group-hover:text-saffron-700 transition-colors">
                3. Explore by Life Situation
              </p>
              <p className="text-xs text-dharma-muted mt-1 leading-relaxed">
                13 reviewed topics: Uncertainty, Duty, Focus, Grief, and Relationships.
              </p>
            </Link>

            <Link
              href="/collections"
              className="p-5 rounded-2xl border border-dharma-border bg-dharma-bg hover:border-saffron-400 hover:shadow-xs transition-all focus-ring group"
            >
              <p className="font-bold text-sm text-dharma-text group-hover:text-saffron-700 transition-colors">
                4. Browse Beginner Collections
              </p>
              <p className="text-xs text-dharma-muted mt-1 leading-relaxed">
                Core philosophical concepts explained simply: Karma, Dharma, Atman.
              </p>
            </Link>

            <Link
              href="/start"
              className="sm:col-span-2 p-5 rounded-2xl border border-saffron-300 dark:border-saffron-900/60 bg-saffron-50/50 dark:bg-saffron-950/20 hover:border-saffron-500 hover:shadow-xs transition-all focus-ring group flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-sm text-saffron-900 dark:text-saffron-200">
                  5. Discover Your Study Path (अध्ययन मार्ग)
                </p>
                <p className="text-xs text-saffron-900 dark:text-saffron-100 mt-1">
                  Answer 5 short questions to find a serene, non-intimidating starting point.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-saffron-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
