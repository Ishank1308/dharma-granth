'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Flame,
  Download,
  Calendar,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Check,
  Loader2,
  HardDriveDownload,
  ScrollText,
  Volume2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  GITA_CHAPTERS,
  type GitaChapterMeta,
  type GitaSankalpaState,
  type SankalpaMode,
  loadSankalpaState,
  saveSankalpaState,
  getTodayISODate,
  getTodayAssignment,
  fulfillTodayAssignment,
  toggleChapterInCycle,
  getTraditionalSankalpaInvocation,
} from '@/lib/gita-sankalpa';
import { triggerHaptic } from '@/lib/haptics';
import {
  formatBytes,
  offlineSupported,
  readManifest,
  removeScripture,
  saveScripture,
  type OfflineEntry,
} from '@/lib/offline-scriptures';

export function GitaSankalpaClient() {
  const [state, setState] = useState<GitaSankalpaState | null>(null);
  const [showInvocation, setShowInvocation] = useState(false);
  const [selectedMode, setSelectedMode] = useState<SankalpaMode>('18-days');
  const [targetChapter, setTargetChapter] = useState(12); // default Ch 12 Bhakti Yoga
  const [celebrate, setCelebrate] = useState(false);

  // Offline Gita caching state
  const [offlineEntry, setOfflineEntry] = useState<OfflineEntry | null>(null);
  const [savingOffline, setSavingOffline] = useState<{ done: number; total: number } | null>(null);
  const [offlineError, setOfflineError] = useState('');
  const [canOffline, setCanOffline] = useState(false);

  const todayStr = useMemo(() => getTodayISODate(), []);

  useEffect(() => {
    setState(loadSankalpaState());
    setCanOffline(offlineSupported());
    const refreshOffline = () => {
      setOfflineEntry(readManifest()['bhagavadgita'] ?? null);
    };
    refreshOffline();
    window.addEventListener('dharma-offline-changed', refreshOffline);
    return () => window.removeEventListener('dharma-offline-changed', refreshOffline);
  }, []);

  if (!state) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-8 text-dharma-muted">
        <Loader2 className="h-6 w-6 animate-spin text-saffron-600" />
      </div>
    );
  }

  const { chapters: todayChapters, isFulfilledToday, dayIndexInCycle } = getTodayAssignment(state, todayStr);
  const activeChapter = todayChapters[0] ?? GITA_CHAPTERS[0];

  const handleStartSankalpa = () => {
    triggerHaptic('medium');
    const nextState: GitaSankalpaState = {
      ...state,
      isActive: true,
      mode: selectedMode,
      targetChapter,
      startDate: todayStr,
      currentCycle: 1,
      cycleChapters: [],
      completedDates: [],
      currentStreak: 0,
    };
    setState(nextState);
    saveSankalpaState(nextState);
  };

  const handleMarkFulfilled = () => {
    triggerHaptic('success');
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 3000);
    const nextState = fulfillTodayAssignment(state, todayStr);
    setState(nextState);
  };

  const handleToggleChapter = (chapterNum: number) => {
    triggerHaptic('light');
    const nextState = toggleChapterInCycle(state, chapterNum, todayStr);
    setState(nextState);
  };

  const handleResetSankalpa = () => {
    if (!window.confirm('क्या आप संकल्प को पुनः आरम्भ (Reset) करना चाहते हैं? Your completed history will be kept, but the current cycle will restart.')) {
      return;
    }
    triggerHaptic('medium');
    const nextState: GitaSankalpaState = {
      ...state,
      isActive: false,
      cycleChapters: [],
    };
    setState(nextState);
    saveSankalpaState(nextState);
  };

  const handleSaveGitaOffline = async () => {
    setOfflineError('');
    try {
      if (offlineEntry) {
        await removeScripture('bhagavadgita');
        setOfflineEntry(null);
      } else {
        setSavingOffline({ done: 0, total: 1 });
        const entry = await saveScripture('bhagavadgita', 'Bhagavad Gita', (done, total) => {
          setSavingOffline({ done, total });
        });
        setOfflineEntry(entry);
      }
    } catch (err) {
      setOfflineError(err instanceof Error ? err.message : 'ऑफ़लाइन सहेजने में त्रुटि हुई।');
    } finally {
      setSavingOffline(null);
    }
  };

  const invocation = getTraditionalSankalpaInvocation('अद्य', 'पावन तिथौ', activeChapter.nameHi);

  // Group chapters by Shatka
  const karmaChapters = GITA_CHAPTERS.slice(0, 6);
  const bhaktiChapters = GITA_CHAPTERS.slice(6, 12);
  const jnanaChapters = GITA_CHAPTERS.slice(12, 18);

  const cycleProgressPercent = Math.round((state.cycleChapters.length / 18) * 100);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-dharma-muted">
          <li>
            <Link href="/" className="hover:text-saffron-700">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/practice/" className="hover:text-saffron-700">साधना (Practice)</Link>
          </li>
          <li>/</li>
          <li className="text-saffron-700 dark:text-saffron-400">गीता संकल्प</li>
        </ol>
      </nav>

      {/* ── Sacred Header ── */}
      <div className="relative overflow-hidden rounded-3xl border border-saffron-500/30 bg-gradient-to-br from-saffron-500/15 via-amber-500/10 to-transparent p-6 sm:p-10 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-saffron-500/40 bg-saffron-500/20 px-3 py-1 text-xs font-bold text-saffron-900 dark:text-saffron-200">
              <ScrollText className="h-3.5 w-3.5" />
              <span>नित्य स्वाध्याय एवं पारायण संकल्प</span>
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-dharma-text tracking-tight">
              श्रीमद्भगवद्गीता संकल्प
            </h1>
            <p className="font-serif text-base text-dharma-muted">
              Bhagavad Gita Daily Recitation &amp; Contemplation Pledge
            </p>
          </div>

          {/* Streak Badge */}
          {state.isActive && (
            <div className="flex items-center gap-3 rounded-2xl border border-amber-500/40 bg-dharma-card/80 p-3 sm:px-5 shadow-sm backdrop-blur-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-xs">
                <Flame className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-dharma-text">{state.currentStreak}</span>
                  <span className="text-xs font-semibold text-dharma-muted">दिन अखंड</span>
                </div>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                  श्रेष्ठ: {state.bestStreak} दिन · चक्र {state.currentCycle}
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="mt-4 max-w-2xl text-xs sm:text-sm text-dharma-muted leading-relaxed">
          भगवद्गीता का नित्य पठन अन्तःकरण की शुद्धि, मानसिक शान्ति और कर्मयोग की प्रतिष्ठा करता है। यहाँ अपना नित्य संकल्प चुनें, प्रगति देखें, और पूर्ण गीता को ऑफ़लाइन सहेजकर बिना इंटरनेट कभी भी पाठ करें।
        </p>
      </div>

      {/* ── NOT ACTIVE: SANKALPA INTAKE CARD ── */}
      {!state.isActive ? (
        <section aria-label="Sankalpa Selection" className="mt-8 rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 shadow-xs">
          <h2 className="font-serif text-2xl font-bold text-dharma-text flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-saffron-600" />
            <span>अपना पावन स्वाध्याय संकल्प चुनें</span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-dharma-muted">
            Choose your daily commitment. You can complete the 18 chapters sequentially, recite a daily favorite chapter, or read 3 chapters daily.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {/* Mode 1: 18-Day Sequential */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                setSelectedMode('18-days');
              }}
              className={`rounded-2xl border p-5 text-left transition ${
                selectedMode === '18-days'
                  ? 'border-saffron-600 bg-saffron-500/10 ring-2 ring-saffron-500/30'
                  : 'border-dharma-border bg-dharma-card hover:border-saffron-400/50'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">अनुशंसित (Recommended)</span>
              <h3 className="mt-1 font-serif text-lg font-bold text-dharma-text">18-दिवसीय पारायण</h3>
              <p className="text-xs text-dharma-muted mt-0.5">18-Day Sequential Parayana</p>
              <p className="mt-3 text-xs leading-relaxed text-dharma-muted">
                प्रतिदिन 1 अध्याय का सम्पूर्ण पाठ। 18 दिनों में सम्पूर्ण गीता सम्पन्न होती है।
              </p>
            </button>

            {/* Mode 2: Daily Chapter */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                setSelectedMode('daily-chapter');
              }}
              className={`rounded-2xl border p-5 text-left transition ${
                selectedMode === 'daily-chapter'
                  ? 'border-saffron-600 bg-saffron-500/10 ring-2 ring-saffron-500/30'
                  : 'border-dharma-border bg-dharma-card hover:border-saffron-400/50'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">नित्य नियम (Daily Chapter)</span>
              <h3 className="mt-1 font-serif text-lg font-bold text-dharma-text">नित्य प्रिय अध्याय</h3>
              <p className="text-xs text-dharma-muted mt-0.5">Single Chapter Daily</p>
              <p className="mt-3 text-xs leading-relaxed text-dharma-muted">
                एक विशिष्ट अध्याय (जैसे द्वादश भक्तियोग या पञ्चदश पुरुषोत्तमयोग) का प्रतिदिन पठन।
              </p>
            </button>

            {/* Mode 3: Weekly Parayana */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                setSelectedMode('weekly-parayana');
              }}
              className={`rounded-2xl border p-5 text-left transition ${
                selectedMode === 'weekly-parayana'
                  ? 'border-saffron-600 bg-saffron-500/10 ring-2 ring-saffron-500/30'
                  : 'border-dharma-border bg-dharma-card hover:border-saffron-400/50'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">सप्ताहिक (Weekly)</span>
              <h3 className="mt-1 font-serif text-lg font-bold text-dharma-text">सप्ताहिक पारायण</h3>
              <p className="text-xs text-dharma-muted mt-0.5">3 Chapters / Day</p>
              <p className="mt-3 text-xs leading-relaxed text-dharma-muted">
                सोमवार से शनिवार प्रतिदिन 3 अध्याय, रविवार को मनन व पुनरावलोकन।
              </p>
            </button>
          </div>

          {/* If daily-chapter chosen, chapter picker dropdown */}
          {selectedMode === 'daily-chapter' && (
            <div className="mt-6 rounded-2xl border border-dharma-border bg-dharma-panel p-4">
              <label htmlFor="target-chapter-select" className="block text-xs font-semibold text-dharma-text mb-2">
                नित्य पाठ के लिए अध्याय चुनें (Select Your Daily Chapter):
              </label>
              <select
                id="target-chapter-select"
                value={targetChapter}
                onChange={(e) => setTargetChapter(Number(e.target.value))}
                className="w-full rounded-xl border border-dharma-border bg-dharma-card px-4 py-2.5 text-sm text-dharma-text outline-none focus:border-saffron-600 focus:ring-2 focus:ring-saffron-600/20"
              >
                {GITA_CHAPTERS.map((c) => (
                  <option key={c.number} value={c.number}>
                    अध्याय {c.number}: {c.nameHi} ({c.name}) — {c.verses} श्लोक
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={handleStartSankalpa}
              className="inline-flex items-center gap-2 rounded-2xl bg-saffron-600 hover:bg-saffron-700 text-white px-8 py-3.5 text-sm font-bold shadow-xs transition"
            >
              <span>संकल्प आरम्भ करें · Begin Daily Sankalpa</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      ) : (
        /* ── ACTIVE SANKALPA DASHBOARD ── */
        <div className="mt-8 space-y-8">
          {/* 1. Today's Assignment Card */}
          <section aria-labelledby="today-assignment-h" className="relative overflow-hidden rounded-3xl border border-saffron-500/40 bg-dharma-card p-6 sm:p-8 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dharma-border pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-saffron-600" />
                <h2 id="today-assignment-h" className="font-serif text-lg font-bold text-dharma-text">
                  आज का स्वाध्याय · Today’s Reading
                </h2>
              </div>
              <span className="rounded-full bg-saffron-500/10 px-3 py-1 text-xs font-bold text-saffron-700 dark:text-saffron-300">
                {state.mode === '18-days'
                  ? `चक्र ${state.currentCycle} · दिवस ${dayIndexInCycle} of 18`
                  : state.mode === 'weekly-parayana'
                  ? `सप्ताहिक पारायण दिवस ${dayIndexInCycle}`
                  : 'नित्य अध्याय संकल्प'}
              </span>
            </div>

            <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                  {activeChapter.shatkaHi} ({activeChapter.shatka} Shatka)
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-dharma-text">
                  अध्याय {activeChapter.number}: {activeChapter.nameHi}
                </h3>
                <p className="font-serif text-sm italic text-dharma-muted">
                  {activeChapter.name} · {activeChapter.verses} श्लोक
                </p>
                <p className="text-xs sm:text-sm text-dharma-muted max-w-xl leading-relaxed mt-1">
                  {activeChapter.themeHi}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                <Link
                  href={`/scripture/bhagavadgita/chapter/${activeChapter.number}/`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-saffron-600 hover:bg-saffron-700 text-white px-6 py-3.5 text-sm font-bold shadow-xs transition"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>अध्याय पढ़ें · Read Chapter</span>
                </Link>

                <button
                  type="button"
                  onClick={handleMarkFulfilled}
                  disabled={isFulfilledToday}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold transition border ${
                    isFulfilledToday
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 cursor-default'
                      : 'border-dharma-border bg-dharma-panel hover:bg-emerald-500/10 hover:border-emerald-500/40 text-dharma-text'
                  }`}
                >
                  {isFulfilledToday ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>आज का पाठ सम्पन्न · Done Today</span>
                    </>
                  ) : (
                    <>
                      <Circle className="h-4 w-4 text-dharma-muted" />
                      <span>पाठ पूर्ण हुआ चिह्नित करें</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Celebration banner */}
            {celebrate && (
              <div className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-4 text-center text-sm font-bold text-emerald-900 dark:text-emerald-200 animate-in fade-in duration-300">
                🎉 साधु! आज का गीता स्वाध्याय सम्पन्न हुआ। भगवान् श्रीकृष्ण की कृपा आप पर बनी रहे।
              </div>
            )}
          </section>

          {/* 2. Traditional Sankalpa Invocation Panel (Expandable) */}
          <section aria-labelledby="invocation-h" className="rounded-3xl border border-dharma-border bg-dharma-card overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                setShowInvocation(!showInvocation);
              }}
              className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-dharma-panel transition"
            >
              <div className="flex items-center gap-2.5">
                <ScrollText className="h-5 w-5 text-saffron-600" />
                <div>
                  <h3 id="invocation-h" className="font-serif text-base sm:text-lg font-bold text-dharma-text">
                    पारम्परिक संकल्प मन्त्र एवं पाठ विधि
                  </h3>
                  <p className="text-xs text-dharma-muted">
                    Traditional Vedic &amp; Puranic Sankalpa Invocation Text
                  </p>
                </div>
              </div>
              {showInvocation ? <ChevronUp className="h-5 w-5 text-dharma-muted" /> : <ChevronDown className="h-5 w-5 text-dharma-muted" />}
            </button>

            {showInvocation && (
              <div className="border-t border-dharma-border p-5 sm:p-6 bg-dharma-panel/40 space-y-4">
                <div className="rounded-2xl border border-saffron-500/30 bg-dharma-card p-4 sm:p-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                    संस्कृत मूल संकल्प
                  </span>
                  <p className="font-devanagari text-base sm:text-lg leading-relaxed text-dharma-text mt-2 whitespace-pre-line font-medium">
                    {invocation.sanskrit}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-dharma-border bg-dharma-card p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-dharma-muted">
                      हिंदी भावार्थ
                    </span>
                    <p className="text-xs sm:text-sm text-dharma-text leading-relaxed mt-1">
                      {invocation.hindi}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-dharma-border bg-dharma-card p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-dharma-muted">
                      English Contemplation
                    </span>
                    <p className="text-xs sm:text-sm text-dharma-text leading-relaxed mt-1">
                      {invocation.english}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* 3. 18-Chapter Bead Mala / Progress Wheel */}
          <section aria-labelledby="parayana-mala-h" className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dharma-border pb-4">
              <div>
                <h3 id="parayana-mala-h" className="font-serif text-xl font-bold text-dharma-text">
                  अष्टादश अध्याय माला (18 Chapters Mala)
                </h3>
                <p className="text-xs text-dharma-muted mt-0.5">
                  Tap any chapter to read or check off in your active cycle.
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-saffron-600">
                  {state.cycleChapters.length} / 18 अध्याय ({cycleProgressPercent}%)
                </span>
                <div className="w-36 h-2 rounded-full bg-dharma-border mt-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-saffron-500 to-amber-500 transition-all duration-500"
                    style={{ width: `${cycleProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Shatka 1: Karma */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-200">
                  कर्म षट्क (Karma Shatka) · Chapters 1–6
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {karmaChapters.map((ch) => {
                  const done = state.cycleChapters.includes(ch.number);
                  return (
                    <button
                      key={ch.number}
                      type="button"
                      onClick={() => handleToggleChapter(ch.number)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${
                        done
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
                          : 'border-dharma-border bg-dharma-panel/60 text-dharma-text hover:border-saffron-400/50'
                      }`}
                    >
                      <span className="text-xs font-bold">Adhyaya {ch.number}</span>
                      <span className="font-devanagari text-xs truncate max-w-full mt-0.5">{ch.nameHi}</span>
                      {done ? <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-1" /> : <Circle className="h-4 w-4 text-dharma-muted mt-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shatka 2: Bhakti */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-saffron-500/15 px-2 py-0.5 text-xs font-bold text-saffron-800 dark:text-saffron-200">
                  भक्ति षट्क (Bhakti Shatka) · Chapters 7–12
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {bhaktiChapters.map((ch) => {
                  const done = state.cycleChapters.includes(ch.number);
                  return (
                    <button
                      key={ch.number}
                      type="button"
                      onClick={() => handleToggleChapter(ch.number)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${
                        done
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
                          : 'border-dharma-border bg-dharma-panel/60 text-dharma-text hover:border-saffron-400/50'
                      }`}
                    >
                      <span className="text-xs font-bold">Adhyaya {ch.number}</span>
                      <span className="font-devanagari text-xs truncate max-w-full mt-0.5">{ch.nameHi}</span>
                      {done ? <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-1" /> : <Circle className="h-4 w-4 text-dharma-muted mt-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shatka 3: Jnana */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-purple-500/15 px-2 py-0.5 text-xs font-bold text-purple-800 dark:text-purple-200">
                  ज्ञान षट्क (Jnana Shatka) · Chapters 13–18
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {jnanaChapters.map((ch) => {
                  const done = state.cycleChapters.includes(ch.number);
                  return (
                    <button
                      key={ch.number}
                      type="button"
                      onClick={() => handleToggleChapter(ch.number)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${
                        done
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
                          : 'border-dharma-border bg-dharma-panel/60 text-dharma-text hover:border-saffron-400/50'
                      }`}
                    >
                      <span className="text-xs font-bold">Adhyaya {ch.number}</span>
                      <span className="font-devanagari text-xs truncate max-w-full mt-0.5">{ch.nameHi}</span>
                      {done ? <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-1" /> : <Circle className="h-4 w-4 text-dharma-muted mt-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 4. Offline Bhagavad Gita Download & Storage */}
          <section aria-labelledby="offline-gita-h" className="rounded-3xl border border-dharma-border bg-gradient-to-br from-amber-500/10 via-dharma-card to-transparent p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <HardDriveDownload className="h-5 w-5 text-saffron-600" />
                  <h3 id="offline-gita-h" className="font-serif text-xl font-bold text-dharma-text">
                    सम्पूर्ण गीता ऑफ़लाइन सुरक्षित करें
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-dharma-muted max-w-xl leading-relaxed">
                  Download all 18 chapters with Sanskrit shlokas, padaccheda, Hindi and English meanings to your device cache for reading during travel, in flights, or at temples without internet.
                </p>
              </div>

              {canOffline && (
                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={handleSaveGitaOffline}
                    disabled={Boolean(savingOffline)}
                    className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold shadow-xs transition ${
                      savingOffline
                        ? 'bg-dharma-border text-dharma-muted cursor-wait'
                        : offlineEntry
                        ? 'border border-emerald-500/40 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-500/25'
                        : 'bg-saffron-600 hover:bg-saffron-700 text-white'
                    }`}
                  >
                    {savingOffline ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>सहेजा जा रहा है {Math.round((savingOffline.done / savingOffline.total) * 100)}%</span>
                      </>
                    ) : offlineEntry ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span>ऑफ़लाइन सुरक्षित ({formatBytes(offlineEntry.bytes)}) · हटाएं</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>संपूर्ण 18 अध्याय सहेजें (Save Offline)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {offlineError && (
              <p className="mt-3 text-xs text-rose-600 dark:text-rose-400 font-semibold">{offlineError}</p>
            )}
          </section>

          {/* 5. Reset & Cycle Statistics */}
          <section className="rounded-3xl border border-dharma-border bg-dharma-card p-6 flex flex-wrap items-center justify-between gap-4 text-xs text-dharma-muted">
            <div className="flex flex-wrap items-center gap-4">
              <span>आरम्भ तिथि: <strong className="text-dharma-text">{state.startDate}</strong></span>
              <span>•</span>
              <span>कुल पूर्ण अध्याय: <strong className="text-dharma-text">{state.totalChaptersRead}</strong></span>
              <span>•</span>
              <span>पूर्ण चक्र: <strong className="text-dharma-text">{state.cyclesCompleted}</strong></span>
            </div>

            <button
              type="button"
              onClick={handleResetSankalpa}
              className="inline-flex items-center gap-1.5 text-dharma-muted hover:text-rose-600 transition font-medium"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>नया संकल्प चुनें (Reset)</span>
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
