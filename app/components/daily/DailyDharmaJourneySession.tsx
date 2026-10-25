'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Share2,
  Copy,
  Check,
  ArrowRight,
  BookOpen,
  Sparkles,
  HelpCircle,
  Clock,
  Compass,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ShieldCheck,
  Eye,
  EyeOff,
  PenLine,
  Trash2,
  ExternalLink,
  Volume2,
  VolumeX,
  Radio,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import {
  type DailyDharmaSession,
  type SanskritWordAnalysis,
  SAMPLE_DAILY_JOURNEYS,
  buildDailySessionFromWisdom,
} from '@/data/daily-dharma-data';
import {
  DAILY_WISDOM_REGISTRY,
  getTodayWisdom,
  type DailyWisdomItem,
} from '@/data/daily-wisdom-engine';
import { readHref, shareVerseUrl } from '@/lib/verse-paths';
import { SITE_URL } from '@/lib/jsonld';
import {
  speakSanskritShloka,
  stopSanskritSpeech,
  startTanpuraDrone,
  stopTanpuraDrone,
} from '@/lib/sacred-audio';
import { recordSadhanaActivity, useSadhanaStreak } from '@/lib/sadhana-streak';
import { SacredShareModal } from '@/app/components/share/SacredShareModal';

type UnderstandingLevel = 'quick' | 'simple' | 'deep';

interface Props {
  session?: DailyDharmaSession;
  onFinish?: () => void;
}

export function DailyDharmaJourneySession({
  session: propSession,
  onFinish,
}: Props) {
  const [dayIndex, setDayIndex] = useState(() => {
    const today = getTodayWisdom();
    const idx = DAILY_WISDOM_REGISTRY.findIndex((dw) => dw.id === today.id);
    return idx >= 0 ? idx : 0;
  });

  const currentWisdom = DAILY_WISDOM_REGISTRY[dayIndex] || DAILY_WISDOM_REGISTRY[0];
  const session = propSession || buildDailySessionFromWisdom(currentWisdom, dayIndex + 1, DAILY_WISDOM_REGISTRY.length);
  const nextWisdom = DAILY_WISDOM_REGISTRY.length > 1
    ? DAILY_WISDOM_REGISTRY[(dayIndex + 1) % DAILY_WISDOM_REGISTRY.length]
    : undefined;

  // Audio & Drone state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isDroneOn, setIsDroneOn] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSadhanaCompleted, setIsSadhanaCompleted] = useState(false);
  const { streak } = useSadhanaStreak();

  // Mode selection (persisted locally)
  const [level, setLevel] = useState<UnderstandingLevel>('simple');
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [savedVerse, setSavedVerse] = useState(false);

  // Private local reflection notes
  const [reflectionText, setReflectionText] = useState('');
  const [isWritingReflection, setIsWritingReflection] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<'saved' | 'saving' | ''>('');
  const autosaveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Recommendation visibility
  const [hiddenRecIds, setHiddenRecIds] = useState<string[]>([]);
  const [activeWhyId, setActiveWhyId] = useState<string | null>(null);

  // Session completion
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);
  const [activeStage, setActiveStage] = useState<'reading' | 'completed'>('reading');

  // Time-of-day greeting
  const [greeting, setGreeting] = useState('Welcome Seeker');

  useEffect(() => {
    // 1. Determine respectful time greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning · सुप्रभातम्');
    else if (hour < 17) setGreeting('Good afternoon · शुभ मध्याह्न');
    else setGreeting('Good evening · शुभ संध्या');

    // 2. Load stored understanding level preference
    try {
      const storedLevel = localStorage.getItem('dharma.daily.level.v1');
      if (storedLevel === 'quick' || storedLevel === 'simple' || storedLevel === 'deep') {
        setLevel(storedLevel);
      }

      // 3. Check if verse is already saved
      const savedCollections = JSON.parse(
        localStorage.getItem('dharma.savedCollections.v1') || '{}'
      );
      const isSaved = Object.values(savedCollections).some((items: any) =>
        Array.isArray(items) && items.includes(session.referenceDisplayEn)
      );
      setSavedVerse(isSaved);

      // 4. Load prior reflection draft if exists
      const reflectionKey = `dharma.reflection.${session.id}.v1`;
      const savedNote = localStorage.getItem(reflectionKey);
      if (savedNote) {
        setReflectionText(savedNote);
        setIsWritingReflection(true);
      }
    } catch {
      // Storage access resilience
    }
  }, [session.id, session.referenceDisplayEn]);

  // Audio cleanup on unmount
  useEffect(() => {
    return () => {
      stopSanskritSpeech();
      stopTanpuraDrone();
    };
  }, []);

  // Check if sadhana challenge completed today
  useEffect(() => {
    try {
      const todayKey = `dharma.daily.challenge.${session.id}.${new Date().toISOString().slice(0, 10)}`;
      if (localStorage.getItem(todayKey)) {
        setIsSadhanaCompleted(true);
      } else {
        setIsSadhanaCompleted(false);
      }
    } catch {}
  }, [session.id]);

  const toggleAudio = () => {
    if (isPlayingAudio) {
      stopSanskritSpeech();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakSanskritShloka(
        session.sanskritDevanagari,
        0.85,
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false),
      );
    }
  };

  const toggleTanpura = () => {
    if (isDroneOn) {
      stopTanpuraDrone();
      setIsDroneOn(false);
    } else {
      const started = startTanpuraDrone(0.12);
      if (started) setIsDroneOn(true);
    }
  };

  const handleCompleteSadhana = () => {
    if (isSadhanaCompleted) return;
    setIsSadhanaCompleted(true);
    recordSadhanaActivity();
    try {
      const todayKey = `dharma.daily.challenge.${session.id}.${new Date().toISOString().slice(0, 10)}`;
      localStorage.setItem(todayKey, 'true');
    } catch {}
  };

  const handleLevelChange = (newLevel: UnderstandingLevel) => {
    setLevel(newLevel);
    try {
      localStorage.setItem('dharma.daily.level.v1', newLevel);
    } catch {}
  };

  const handleCopyCitation = () => {
    const textToCopy = `${session.referenceDisplayEn} (${session.referenceDisplayHi})\n\n${session.sanskritDevanagari}\n\n${session.sanskritTransliteration}\n\n[Literal English]: ${session.literalTranslationEn}\n\n[Hindi]: ${session.literalTranslationHi}\n\n— Via Dharma Granth (${shareVerseUrl(window.location.origin, session.scriptureId, session.chapterNumber, session.verseNumber)})`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2500);
    });
  };

  const handleToggleSaveVerse = () => {
    const nextSaved = !savedVerse;
    setSavedVerse(nextSaved);
    try {
      const SAVED_KEY = 'dharma.savedCollections.v1';
      const existing = JSON.parse(localStorage.getItem(SAVED_KEY) || '{}');
      const folder = existing['Daily Reflection'] || [];
      if (nextSaved) {
        existing['Daily Reflection'] = Array.from(new Set([...folder, session.referenceDisplayEn]));
      } else {
        existing['Daily Reflection'] = folder.filter((x: string) => x !== session.referenceDisplayEn);
      }
      localStorage.setItem(SAVED_KEY, JSON.stringify(existing));
    } catch {}
  };

  const handleReflectionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setReflectionText(val);
    setAutosaveStatus('saving');

    if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current);
    autosaveTimeout.current = setTimeout(() => {
      try {
        const key = `dharma.reflection.${session.id}.v1`;
        if (val.trim()) {
          localStorage.setItem(key, val);
        } else {
          localStorage.removeItem(key);
        }
        setAutosaveStatus('saved');
      } catch {}
    }, 600);
  };

  const handleClearReflection = () => {
    setReflectionText('');
    try {
      localStorage.removeItem(`dharma.reflection.${session.id}.v1`);
      setAutosaveStatus('');
      setIsWritingReflection(false);
    } catch {}
  };

  const handleCompleteSession = () => {
    setIsSessionCompleted(true);
    setActiveStage('completed');
    try {
      // Record completed lesson non-punitively
      const JOURNEYS_KEY = 'dharma.journeys.v1';
      const progress = JSON.parse(localStorage.getItem(JOURNEYS_KEY) || '{}');
      const existingLessons = progress[session.journeyId] || [];
      if (!existingLessons.includes(session.id)) {
        progress[session.journeyId] = [...existingLessons, session.id];
        localStorage.setItem(JOURNEYS_KEY, JSON.stringify(progress));
      }
    } catch {}
  };

  const visibleRecommendations = session.recommendations.filter(
    (r) => !hiddenRecIds.includes(r.id)
  );

  return (
    <article
      aria-labelledby="daily-session-title"
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-fade-in text-dharma-text"
    >
      {/* ── 0. DAY & DATE NAVIGATION BAR ─────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dharma-panel/80 p-3 sm:p-4 rounded-2xl border border-dharma-border/70 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setDayIndex((prev) => (prev - 1 + DAILY_WISDOM_REGISTRY.length) % DAILY_WISDOM_REGISTRY.length);
              stopSanskritSpeech();
              setIsPlayingAudio(false);
            }}
            className="focus-ring inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-dharma-border bg-dharma-card hover:border-saffron-400 text-xs font-semibold text-dharma-text transition"
            title="Previous Day's Wisdom"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>पिछला दिन (Prev)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const today = getTodayWisdom();
              const idx = DAILY_WISDOM_REGISTRY.findIndex((dw) => dw.id === today.id);
              setDayIndex(idx >= 0 ? idx : 0);
              stopSanskritSpeech();
              setIsPlayingAudio(false);
            }}
            className="focus-ring inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold transition shadow-2xs"
            title="Return to Today's Wisdom"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>आज (Today)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setDayIndex((prev) => (prev + 1) % DAILY_WISDOM_REGISTRY.length);
              stopSanskritSpeech();
              setIsPlayingAudio(false);
            }}
            className="focus-ring inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-dharma-border bg-dharma-card hover:border-saffron-400 text-xs font-semibold text-dharma-text transition"
            title="Next Day's Wisdom"
          >
            <span>अगला दिन (Next)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-dharma-muted font-medium hidden sm:inline">
            सूत्र {dayIndex + 1} / {DAILY_WISDOM_REGISTRY.length}
          </span>
          <button
            type="button"
            onClick={() => {
              const rand = Math.floor(Math.random() * DAILY_WISDOM_REGISTRY.length);
              setDayIndex(rand);
              stopSanskritSpeech();
              setIsPlayingAudio(false);
            }}
            className="focus-ring inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-dharma-border bg-dharma-card hover:border-saffron-400 text-xs font-semibold text-saffron-800 dark:text-saffron-300 transition"
            title="Pick a Random Teaching"
          >
            <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
            <span>अनपेक्षित सूत्र (Random)</span>
          </button>
        </div>
      </div>

      {/* ── 1. SESSION HEADER ────────────────────────────────────────── */}
      <header className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-saffron-700 dark:text-saffron-400">
            {greeting}
          </p>
          <h1
            id="daily-session-title"
            className="font-serif text-2xl sm:text-3xl font-bold text-dharma-text mt-1"
          >
            {session.journeyTitleEn}
          </h1>
          <p className="text-xs sm:text-sm text-dharma-muted mt-1 flex items-center gap-2">
            <span>
              Lesson {session.lessonIndex} of {session.totalLessons}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Approximately {session.estimatedMinutes} minutes
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <Link
            href="/practice/dashboard/"
            className="focus-ring inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-dharma-border bg-dharma-bg hover:border-saffron-400 text-xs font-semibold text-dharma-muted hover:text-dharma-text transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Finish Later
          </Link>
        </div>
      </header>

      {/* ── 2. ORIGINAL SCRIPTURE STAGE (Warm Paper Surface) ─────────── */}
      <section
        aria-label="Original Scripture Stage"
        className="relative rounded-3xl border border-[#E8DFD0] dark:border-[#382E24] bg-[#FAF7EE] dark:bg-[#1A1612] p-6 sm:p-10 shadow-sm space-y-6"
      >
        {/* Subtle Manuscript Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD0]/80 dark:border-[#382E24]/80 text-xs text-dharma-muted">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-saffron-600" />
            <span className="font-semibold text-dharma-text uppercase tracking-wider text-[11px]">
              Original Scripture · मूल शास्त्र पाठ
            </span>
          </div>
          <span className="font-serif font-medium">
            {session.referenceDisplayEn} ({session.referenceDisplayHi})
          </span>
        </div>

        {/* Sacred Sanskrit Display with Generous Line-Height */}
        <div className="text-center space-y-4 py-2">
          <p
            lang="sa"
            className="font-devanagari text-2xl sm:text-3xl md:text-4xl font-semibold text-stone-900 dark:text-stone-100 leading-relaxed sm:leading-[1.9] tracking-wide"
          >
            {session.sanskritDevanagari}
          </p>

          <p className="font-serif italic text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
            {session.sanskritTransliteration}
          </p>

          {session.meter && (
            <span className="inline-block text-[11px] font-medium text-stone-500 dark:text-stone-400 bg-[#F0E9DA] dark:bg-[#28221B] px-3 py-1 rounded-full">
              छन्द: {session.meter}
            </span>
          )}
        </div>

        {/* Reading & Study Action Tools */}
        <div className="pt-4 border-t border-[#E8DFD0]/80 dark:border-[#382E24]/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-xs text-dharma-muted">
            <span className="font-medium text-stone-600 dark:text-stone-400">
              मूल शास्त्र पाठ · Original Scripture Study
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Audio Recitation */}
            <button
              type="button"
              onClick={toggleAudio}
              className={`focus-ring inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                isPlayingAudio
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-white dark:bg-[#262019] border border-[#DDD3C1] dark:border-[#42372A] hover:border-saffron-500 text-stone-700 dark:text-stone-300'
              }`}
              title="Listen to Sanskrit Recitation"
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-saffron-600" />}
              <span>{isPlayingAudio ? 'रोकें · Pause' : 'सुनें · Listen'}</span>
            </button>

            {/* Tanpura Drone */}
            <button
              type="button"
              onClick={toggleTanpura}
              className={`focus-ring inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                isDroneOn
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-[#262019] border border-[#DDD3C1] dark:border-[#42372A] hover:border-saffron-500 text-stone-700 dark:text-stone-300'
              }`}
              title="Toggle Meditative Tanpura Acoustic Drone"
            >
              <Radio className={`w-3.5 h-3.5 ${isDroneOn ? 'animate-pulse text-white' : 'text-stone-500'}`} />
              <span>तानपुरा</span>
            </button>

            {/* Share Sacred Card */}
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="focus-ring inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold transition-all text-xs shadow-2xs"
              title="Share 9:16 WhatsApp Status Card"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>साझा करें (Share)</span>
            </button>

            <button
              type="button"
              onClick={handleToggleSaveVerse}
              className="focus-ring inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#262019] border border-[#DDD3C1] dark:border-[#42372A] hover:border-saffron-500 text-stone-700 dark:text-stone-300 transition-all text-xs"
            >
              <Bookmark
                className={`w-3.5 h-3.5 ${
                  savedVerse ? 'fill-saffron-600 text-saffron-600' : 'text-stone-500'
                }`}
              />
              {savedVerse ? 'Saved' : 'Save'}
            </button>

            <button
              type="button"
              onClick={handleCopyCitation}
              className="focus-ring inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#262019] border border-[#DDD3C1] dark:border-[#42372A] hover:border-saffron-500 text-stone-700 dark:text-stone-300 transition-all text-xs"
            >
              {copiedCitation ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-stone-500" />
              )}
              {copiedCitation ? 'Copied' : 'Copy'}
            </button>

            <Link
              href={readHref(session.scriptureId, session.chapterNumber, session.verseNumber)}
              className="focus-ring inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#262019] border border-[#DDD3C1] dark:border-[#42372A] hover:border-saffron-500 text-stone-700 dark:text-stone-300 transition-all text-xs"
              title="Read complete chapter in reader"
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-500" />
              Full Context
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. VERSE IN 30 SECONDS CARD ──────────────────────────────── */}
      <section
        aria-label="Verse in 30 Seconds Summary"
        className="rounded-3xl border border-saffron-200/80 dark:border-saffron-900/40 bg-saffron-50/40 dark:bg-saffron-950/20 p-6 sm:p-8 space-y-4 shadow-sm"
      >
        <div className="flex items-center justify-between pb-3 border-b border-saffron-200/60 dark:border-saffron-900/30">
          <span className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-saffron-800 dark:text-saffron-300">
            <Sparkles className="w-4 h-4 text-saffron-600" />
            Verse in 30 Seconds
          </span>
          <span className="text-[11px] font-medium text-dharma-muted bg-dharma-bg px-2.5 py-0.5 rounded-full border border-dharma-border">
            Simplified Editorial Explanation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-dharma-card border border-dharma-border space-y-1">
            <p className="font-bold uppercase tracking-wider text-[10px] text-dharma-muted">
              Situation Addressed
            </p>
            <p className="text-dharma-text leading-relaxed font-medium">
              {session.thirtySecondCard.situation}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-dharma-card border border-dharma-border space-y-1">
            <p className="font-bold uppercase tracking-wider text-[10px] text-emerald-700 dark:text-emerald-400">
              Core Teaching
            </p>
            <p className="text-dharma-text leading-relaxed font-medium">
              {session.thirtySecondCard.teaching}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-dharma-card border border-dharma-border space-y-1">
            <p className="font-bold uppercase tracking-wider text-[10px] text-amber-700 dark:text-amber-400">
              Clarification
            </p>
            <p className="text-dharma-text leading-relaxed">
              {session.thirtySecondCard.clarification}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-dharma-card border border-dharma-border space-y-1">
            <p className="font-bold uppercase tracking-wider text-[10px] text-saffron-700 dark:text-saffron-400">
              Try This Action
            </p>
            <p className="text-dharma-text leading-relaxed">
              {session.thirtySecondCard.quickAction}
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. UNDERSTANDING LEVELS SELECTOR [Quick | Simple | Deep] ── */}
      <section aria-label="Understanding Depth Selector" className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-dharma-border">
          <h2 className="font-serif text-lg font-bold text-dharma-text">
            Choose Your Reading Depth
          </h2>
          <div
            className="flex items-center p-1 rounded-2xl border border-dharma-border bg-dharma-card gap-1 text-xs"
            role="tablist"
          >
            {(['quick', 'simple', 'deep'] as const).map((l) => (
              <button
                key={l}
                role="tab"
                aria-selected={level === l}
                onClick={() => handleLevelChange(l)}
                className={`focus-ring px-4 py-1.5 rounded-xl font-semibold capitalize transition-all ${
                  level === l
                    ? 'bg-saffron-600 text-white shadow-2xs'
                    : 'text-dharma-muted hover:text-dharma-text'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* ── LEVEL A: QUICK MODE ────────────────────────────────────── */}
        {level === 'quick' && (
          <div className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 space-y-4 animate-fade-in text-sm">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-dharma-muted">
                One-Line Essence
              </p>
              <p className="font-serif text-lg sm:text-xl font-bold text-dharma-text mt-1 leading-relaxed">
                &quot;{session.thirtySecondCard.teaching}&quot;
              </p>
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold text-saffron-700 dark:text-saffron-400 uppercase tracking-wider">
                Practical Application
              </span>
              <p className="text-dharma-text mt-1 leading-relaxed">
                {session.modernExample.application}
              </p>
            </div>
          </div>
        )}

        {/* ── LEVEL B: SIMPLE MODE ───────────────────────────────────── */}
        {level === 'simple' && (
          <div className="space-y-6 animate-fade-in">
            {/* Bilingual Meaning Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-3xl border border-dharma-border bg-dharma-card p-6 space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-dharma-muted">
                  Plain English Explanation
                </span>
                <p className="text-sm sm:text-base text-dharma-text leading-relaxed">
                  {session.simpleMeaningEn}
                </p>
              </div>

              <div className="rounded-3xl border border-dharma-border bg-dharma-card p-6 space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-dharma-muted">
                  सरल हिन्दी भावार्थ
                </span>
                <p
                  lang="hi"
                  className="font-devanagari text-base sm:text-lg text-dharma-text leading-relaxed"
                >
                  {session.simpleMeaningHi}
                </p>
              </div>
            </div>

            {/* Key Sanskrit Terms */}
            <div className="rounded-3xl border border-dharma-border bg-dharma-card p-6 space-y-4">
              <h3 className="font-serif text-base font-bold text-dharma-text">
                Important Sanskrit Words in this Shloka
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {session.keyTerms.slice(0, 4).map((term) => (
                  <div
                    key={term.pada}
                    className="p-3.5 rounded-2xl border border-dharma-border bg-dharma-bg space-y-1"
                  >
                    <p className="font-bold text-saffron-800 dark:text-saffron-300 text-sm">
                      {term.pada}
                    </p>
                    <p className="text-dharma-muted italic text-[11px]">{term.iast}</p>
                    <p className="text-dharma-text mt-1">{term.meaningEn}</p>
                    <p lang="hi" className="font-devanagari text-dharma-muted text-[11px]">
                      {term.meaningHi}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── LEVEL C: DEEP MODE ─────────────────────────────────────── */}
        {level === 'deep' && (
          <div className="space-y-6 animate-fade-in text-xs">
            {/* Sandhi Split */}
            {session.sandhiSplit && (
              <div className="rounded-3xl border border-dharma-border bg-dharma-card p-6 space-y-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-dharma-muted">
                  पदच्छेद एवं सन्धि-विच्छेद (Word Division & Sandhi Analysis)
                </span>
                <p
                  lang="sa"
                  className="font-devanagari text-base font-semibold text-dharma-text leading-relaxed"
                >
                  {session.sandhiSplit}
                </p>
              </div>
            )}

            {/* Word-by-Word Grammatical Breakdown */}
            <div className="rounded-3xl border border-dharma-border bg-dharma-card p-6 space-y-4">
              <h3 className="font-serif text-sm font-bold text-dharma-text">
                Rigorous Word-by-Word Lexical Table
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-dharma-border text-dharma-muted text-[11px]">
                      <th className="py-2 pr-4 font-semibold">Word (पद)</th>
                      <th className="py-2 pr-4 font-semibold">Root (धातु/प्रातिपदिक)</th>
                      <th className="py-2 pr-4 font-semibold">Grammatical Form</th>
                      <th className="py-2 font-semibold">Contextual Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dharma-border/60">
                    {session.keyTerms.map((term) => (
                      <tr key={term.pada}>
                        <td className="py-2.5 pr-4 font-bold text-saffron-800 dark:text-saffron-300">
                          {term.pada}
                        </td>
                        <td className="py-2.5 pr-4 text-dharma-muted">{term.root}</td>
                        <td className="py-2.5 pr-4 text-dharma-muted">{term.grammar}</td>
                        <td className="py-2.5 text-dharma-text">{term.meaningEn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Classical Traditional Commentary */}
            <div className="rounded-3xl border border-dharma-border bg-dharma-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-dharma-border">
                <h3 className="font-serif text-sm font-bold text-dharma-text">
                  Classical Traditional Commentary (पारंपरिक भाष्य)
                </h3>
                <span className="text-[10px] text-dharma-muted bg-dharma-bg px-2.5 py-0.5 rounded-full border border-dharma-border">
                  Canonical Editions
                </span>
              </div>

              <div className="space-y-4">
                {session.traditionalCommentaries.map((c) => (
                  <div
                    key={c.author}
                    className="p-4 rounded-2xl border border-dharma-border bg-dharma-bg space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-dharma-text">{c.author}</span>
                      <span className="text-saffron-700 dark:text-saffron-400 font-medium">
                        {c.tradition}
                      </span>
                    </div>
                    <p className="text-dharma-text italic leading-relaxed">&quot;{c.excerptEn}&quot;</p>
                    <p lang="hi" className="font-devanagari text-dharma-muted text-[11px]">
                      &quot;{c.excerptHi}&quot;
                    </p>
                    <p className="text-[10px] text-dharma-muted pt-1">Source: {c.citation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── 5. MODERN EXAMPLE ────────────────────────────────────────── */}
      <section
        aria-label="Modern Real-World Example"
        className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 space-y-4 shadow-sm"
      >
        <div className="flex items-center justify-between pb-3 border-b border-dharma-border">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400">
              Modern Example · आधुनिक परिप्रेक्ष्य
            </span>
            <span className="text-[11px] font-semibold text-dharma-muted bg-dharma-bg px-2.5 py-0.5 rounded-full border border-dharma-border">
              {session.modernExample.contextLabelEn}
            </span>
          </div>
          <span className="text-[10px] text-dharma-muted">Modern Editorial Example</span>
        </div>

        <div className="space-y-3 text-sm leading-relaxed">
          <div className="p-4 rounded-2xl bg-dharma-bg border border-dharma-border space-y-1">
            <p className="text-xs uppercase tracking-wider font-bold text-dharma-muted">
              The Scenario
            </p>
            <p className="text-dharma-text">{session.modernExample.situation}</p>
          </div>

          <div className="p-4 rounded-2xl bg-dharma-bg border border-dharma-border space-y-1">
            <p className="text-xs uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400">
              How the Verse Applies
            </p>
            <p className="text-dharma-text">{session.modernExample.application}</p>
          </div>

          <p className="text-[11px] text-dharma-muted italic">
            * {session.modernExample.disclaimer}
          </p>
        </div>
      </section>

      {/* ── 6. COMMON MISUNDERSTANDING ───────────────────────────────── */}
      <section
        aria-label="Common Misunderstanding Clarification"
        className="rounded-3xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 p-6 sm:p-8 space-y-4 shadow-sm"
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 pb-2 border-b border-amber-200/80 dark:border-amber-900/40">
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span>Common Misunderstanding Clarified</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#1E1914] border border-amber-200/70 dark:border-amber-900/40 space-y-1">
            <span className="font-bold text-amber-900 dark:text-amber-300">
              The Common Misconception
            </span>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              {session.commonMisunderstanding.misconception}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#1E1914] border border-amber-200/70 dark:border-amber-900/40 space-y-1">
            <span className="font-bold text-emerald-800 dark:text-emerald-400">
              The Accurate Scriptural Understanding
            </span>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              {session.commonMisunderstanding.betterUnderstanding}
            </p>
          </div>
        </div>
      </section>

      {/* ── 7. REFLECTION ────────────────────────────────────────────── */}
      <section
        aria-label="Personal Reflection Question"
        className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 space-y-4 shadow-sm"
      >
        <div className="flex items-center justify-between pb-3 border-b border-dharma-border">
          <span className="text-xs uppercase tracking-wider font-bold text-saffron-700 dark:text-saffron-400">
            Quiet Reflection · आत्म-चिंतन
          </span>
          <span className="text-[11px] text-dharma-muted flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            100% Local · Never Transmitted
          </span>
        </div>

        <div className="space-y-3">
          <p className="font-serif text-lg font-bold text-dharma-text leading-relaxed">
            &quot;{session.reflectionPrompt.questionEn}&quot;
          </p>
          <p lang="hi" className="font-devanagari text-base text-dharma-muted leading-relaxed">
            &quot;{session.reflectionPrompt.questionHi}&quot;
          </p>
        </div>

        {/* Reflection Actions */}
        {!isWritingReflection ? (
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => setIsWritingReflection(true)}
              className="focus-ring inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-dharma-bg border border-dharma-border hover:border-saffron-500 font-semibold text-dharma-text transition-colors"
            >
              <PenLine className="w-3.5 h-3.5 text-saffron-600" />
              Write Reflection Privately
            </button>
            <span className="text-dharma-muted text-[11px]">
              or simply hold this thought quietly throughout your day.
            </span>
          </div>
        ) : (
          <div className="space-y-3 pt-2 animate-fade-in text-xs">
            <div className="relative">
              <textarea
                rows={4}
                value={reflectionText}
                onChange={handleReflectionChange}
                placeholder="Write your private reflection here... (Saved only in this browser)"
                className="w-full p-4 rounded-2xl border border-dharma-border bg-dharma-bg text-dharma-text focus-ring resize-none leading-relaxed"
              />
              {autosaveStatus && (
                <span className="absolute bottom-3 right-3 text-[11px] text-dharma-muted bg-dharma-card px-2 py-0.5 rounded-md border border-dharma-border">
                  {autosaveStatus === 'saving' ? 'Autosaving...' : 'Saved locally'}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleClearReflection}
                className="text-dharma-muted hover:text-red-600 text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Note
              </button>
              <button
                type="button"
                onClick={() => setIsWritingReflection(false)}
                className="text-xs text-dharma-muted hover:text-dharma-text"
              >
                Hide Writing Area
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── 8. PRACTICAL ACTION ──────────────────────────────────────── */}
      <section
        aria-label="Optional Practical Action"
        className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 space-y-4 shadow-sm"
      >
        <div className="flex items-center justify-between pb-3 border-b border-dharma-border">
          <span className="text-xs uppercase tracking-wider font-bold text-saffron-800 dark:text-saffron-300">
            Optional Practical Action · कर्म में प्रयोग
          </span>
          <span className="text-xs text-dharma-muted">
            ~{session.practicalAction.estimatedMinutes} Minutes
          </span>
        </div>

        <h3 className="font-serif text-lg font-bold text-dharma-text">
          {session.practicalAction.titleEn}
        </h3>

        <ol className="space-y-2 text-xs text-dharma-text leading-relaxed list-decimal list-inside">
          {session.practicalAction.steps.map((st, i) => (
            <li key={i}>{st}</li>
          ))}
        </ol>

        {session.practicalAction.controllableList && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
              <p className="font-bold text-emerald-800 dark:text-emerald-300">
                What I Can Influence
              </p>
              <ul className="list-disc list-inside text-stone-700 dark:text-stone-300 space-y-0.5">
                {session.practicalAction.controllableList.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-1">
              <p className="font-bold text-amber-800 dark:text-amber-300">
                What I Cannot Dictate
              </p>
              <ul className="list-disc list-inside text-stone-700 dark:text-stone-300 space-y-0.5">
                {session.practicalAction.uncontrollableList?.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Sadhana Challenge Completion */}
        <div className="pt-3 border-t border-dharma-border/60 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-dharma-muted">
            साधना अभ्यास: आज के कर्तव्य को पूर्ण करने पर संकल्प दर्ज करें।
          </span>

          <button
            type="button"
            onClick={handleCompleteSadhana}
            disabled={isSadhanaCompleted}
            className={`focus-ring inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-2xs ${
              isSadhanaCompleted
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isSadhanaCompleted
                ? `साधना संकल्प पूर्ण (Streak: ${streak.currentStreak} Days)`
                : 'आज का साधना संकल्प पूर्ण करें'}
            </span>
          </button>
        </div>
      </section>

      {/* ── 9. CONTEXTUAL NEXT STEPS (Max 3) ─────────────────────────── */}
      <section
        aria-label="Recommended Next Teachings"
        className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 space-y-6 shadow-sm"
      >
        <div className="flex items-center justify-between pb-3 border-b border-dharma-border">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-saffron-700 dark:text-saffron-400">
              Thoughtful Continuity · आगे क्या पढ़ें
            </span>
            <h3 className="font-serif text-lg font-bold text-dharma-text mt-0.5">
              Recommended Next Teachings
            </h3>
          </div>
          <span className="text-xs text-dharma-muted">Rule-based · Explains why</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visibleRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="rounded-2xl border border-dharma-border bg-dharma-bg p-4 flex flex-col justify-between hover:border-saffron-400 transition-colors"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-saffron-800 dark:text-saffron-300">
                  {rec.scriptureRef}
                </span>
                <h4 className="font-serif text-sm font-bold text-dharma-text mt-1">
                  {rec.title}
                </h4>
                <p className="text-xs text-dharma-muted mt-2 leading-relaxed">
                  <span className="font-semibold text-dharma-text">Why:</span> {rec.reason}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-dharma-border/60 space-y-2">
                <Link
                  href={rec.href}
                  className="focus-ring w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-medium text-xs transition-colors shadow-2xs"
                >
                  Continue
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center justify-between text-[11px] text-dharma-muted">
                  <button
                    type="button"
                    onClick={() => setActiveWhyId(activeWhyId === rec.id ? null : rec.id)}
                    className="hover:text-dharma-text underline"
                  >
                    Why this?
                  </button>
                  <button
                    type="button"
                    onClick={() => setHiddenRecIds([...hiddenRecIds, rec.id])}
                    className="hover:text-dharma-text"
                  >
                    Hide
                  </button>
                </div>

                {activeWhyId === rec.id && (
                  <div className="p-2.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-[10px] text-sky-950 dark:text-sky-200 mt-2">
                    Basis: {rec.basis}. Recommended purely through scholarly links. Nothing
                    leaves your device.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 10. COMPLETION EXPERIENCE (No Confetti, Pure Calm) ───────── */}
      <section
        aria-label="Session Completion"
        className="rounded-3xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 p-6 sm:p-10 text-center space-y-4 shadow-sm"
      >
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div>
          <h3 className="font-serif text-2xl font-bold text-dharma-text">
            You explored today&apos;s teaching.
          </h3>
          <p className="text-xs text-dharma-muted mt-1 max-w-md mx-auto leading-relaxed">
            Take this insight gently into your day. No streaks to defend. No points to collect.
          </p>
        </div>

        <div className="pt-3 flex flex-wrap items-center justify-center gap-3 text-xs">
          <button
            type="button"
            onClick={handleCompleteSession}
            className="focus-ring inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold transition-colors shadow-2xs"
          >
            Finish for Today
          </button>

          {nextWisdom && (
            <Link
              href={readHref(nextWisdom.scriptureId, nextWisdom.chapterId, nextWisdom.verseId)}
              className="focus-ring inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-dharma-border bg-dharma-card hover:border-saffron-400 font-semibold text-dharma-text transition-colors"
            >
              Continue to Next Teaching
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            type="button"
            onClick={handleToggleSaveVerse}
            className="focus-ring inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-dharma-border bg-dharma-card hover:border-saffron-400 font-semibold text-dharma-text transition-colors"
          >
            <Bookmark className={`w-3.5 h-3.5 ${savedVerse ? 'fill-saffron-600 text-saffron-600' : ''}`} />
            {savedVerse ? 'Saved in Study Desk' : 'Save for Later'}
          </button>
        </div>
      </section>

      {/* ── 11. SOURCES & PROVENANCE FOOTER ──────────────────────────── */}
      <footer className="pt-4 border-t border-dharma-border text-[11px] text-dharma-muted space-y-2">
        <p>
          <strong>Sources & Edition:</strong> {session.provenance.sourceScripture} ·{' '}
          {session.provenance.primaryEdition} · Reviewer: {session.provenance.editorialReviewer} ·{' '}
          Last reviewed: {session.provenance.lastReviewedDate}.
        </p>
        <p>
          Scripture text, literal translation, and editorial explanations are visibly distinguished
          to protect textual authenticity.
        </p>
      </footer>

      {/* Sacred Share Modal */}
      <SacredShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={{
          title: session.referenceDisplayEn,
          reference: session.referenceDisplayEn,
          sanskrit: session.sanskritDevanagari,
          transliteration: session.sanskritTransliteration,
          translation: session.simpleMeaningEn || session.literalTranslationEn,
          hindi: session.simpleMeaningHi || session.literalTranslationHi,
          quote: session.thirtySecondCard?.teaching,
          url: shareVerseUrl(
            typeof window !== 'undefined' ? window.location.origin : SITE_URL,
            session.scriptureId,
            session.chapterNumber,
            session.verseNumber,
          ),
        }}
      />
    </article>
  );
}
