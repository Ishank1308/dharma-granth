'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X,
  ChevronUp,
  ChevronDown,
  Search,
  Music,
  Wind,
  Waves,
  Bell,
  Check,
  Bookmark,
  Target,
  BookOpen,
  Timer,
  CircleDot,
  RotateCcw,
  Languages,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import {
  subscribePranaCapsule,
  getPranaCapsuleState,
  dismissPranaToast,
  closeSabdaPeek,
  setPranaCapsuleExpanded,
  type PranaCapsuleState,
  type PranaCapsuleMode,
} from '@/lib/prana-capsule-store';
import {
  subscribeSoundscape,
  getSoundscapeState,
  toggleSoundscape,
  setSoundscapeTrack,
  setParayanaCadenceMode,
  speakSanskritTerm,
  SOUNDSCAPE_TRACKS,
  type SoundscapeState,
  type SoundscapeTrackId,
  type ParayanaCadenceMode,
} from '@/lib/sacred-soundscape';
import { openGlobalSearch } from '@/lib/search-events';
import { triggerTactileFeedback, triggerHaptic } from '@/lib/haptics';

const DRONE_TRACKS: Array<{ id: SoundscapeTrackId; label: string; icon: React.ReactNode }> = [
  { id: 'tanpura', label: 'Tanpura', icon: <Music className="w-3.5 h-3.5" /> },
  { id: 'om', label: 'Om 108Hz', icon: <Wind className="w-3.5 h-3.5" /> },
  { id: 'flute', label: 'Flute', icon: <Waves className="w-3.5 h-3.5" /> },
  { id: 'temple_bell', label: 'Bell', icon: <Bell className="w-3.5 h-3.5" /> },
];

export function PranaCapsule() {
  const pathname = usePathname();
  const isChapterReader = pathname?.startsWith('/scripture/') && pathname.includes('/chapter/');
  const isAutoHideRoute = pathname === '/scriptures' || pathname?.startsWith('/scriptures/') || pathname?.startsWith('/scripture/');
  const [capsuleState, setCapsuleState] = useState<PranaCapsuleState>(getPranaCapsuleState);
  const [soundState, setSoundState] = useState<SoundscapeState>(getSoundscapeState);
  const [activePadaLine, setActivePadaLine] = useState<string | null>(null);
  const [isBreathInterval, setIsBreathInterval] = useState(false);
  const [breathCountdown, setBreathCountdown] = useState(2.5);
  const [ekagrataActive, setEkagrataActive] = useState(false);
  const [isScrollHidden, setIsScrollHidden] = useState(false);
  const [isCapsuleFocused, setIsCapsuleFocused] = useState(false);

  const reduceMotion = useReducedMotion();
  const pillRef = useRef<HTMLButtonElement>(null);
  const islandRef = useRef<HTMLDivElement>(null);

  // Tuck the persistent island away while readers browse down long scripture pages.
  // Scrolling back up or returning near the top makes it available again.
  useEffect(() => {
    setIsScrollHidden(false);
    if (!isAutoHideRoute) return;

    let lastScrollY = window.scrollY;
    let accumulatedDelta = 0;
    const handleScroll = () => {
      const currentScrollY = Math.max(0, window.scrollY);
      accumulatedDelta += currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      if (currentScrollY <= 72) {
        accumulatedDelta = 0;
        setIsScrollHidden(false);
        return;
      }

      if (accumulatedDelta >= 16) {
        accumulatedDelta = 0;
        setIsScrollHidden(true);
      } else if (accumulatedDelta <= -12) {
        accumulatedDelta = 0;
        setIsScrollHidden(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAutoHideRoute, pathname]);

  // Sync with Prāṇa Capsule State Machine
  useEffect(() => {
    const unsub = subscribePranaCapsule((st) => setCapsuleState(st));
    return unsub;
  }, []);

  // Sync with Sacred Soundscape Engine
  useEffect(() => {
    const unsub = subscribeSoundscape((st) => setSoundState(st));
    return unsub;
  }, []);

  // Listen to live pāda recitation events and breath intervals
  useEffect(() => {
    const handleRecitationChunk = (e: Event) => {
      const custom = e as CustomEvent<{
        verseNumber?: number | string;
        chunkIndex?: number;
        chunkType?: 'sanskrit_pada' | 'hindi_meaning' | 'english_meaning';
        text?: string;
      }>;
      if (custom.detail?.text) {
        setActivePadaLine(custom.detail.text);
        setIsBreathInterval(false);
      }
    };

    const handleRecitationEnded = () => {
      setIsBreathInterval(true);
      setBreathCountdown(2.5);
      const start = Date.now();
      const interval = setInterval(() => {
        const elapsed = (Date.now() - start) / 1000;
        const left = Math.max(0, 2.5 - elapsed);
        setBreathCountdown(Number(left.toFixed(1)));
        if (left <= 0) {
          clearInterval(interval);
          setIsBreathInterval(false);
        }
      }, 100);
    };

    const handleEkagrataChange = (e: Event) => {
      const custom = e as CustomEvent<{ active: boolean }>;
      if (custom.detail) setEkagrataActive(custom.detail.active);
    };

    window.addEventListener('dharma:recitation-chunk', handleRecitationChunk as EventListener);
    window.addEventListener('dharma:recitation-ended', handleRecitationEnded);
    window.addEventListener('dharma:ekagrata-toggle', handleEkagrataChange as EventListener);

    return () => {
      window.removeEventListener('dharma:recitation-chunk', handleRecitationChunk as EventListener);
      window.removeEventListener('dharma:recitation-ended', handleRecitationEnded);
      window.removeEventListener('dharma:ekagrata-toggle', handleEkagrataChange as EventListener);
    };
  }, []);

  // Keyboard navigation: Escape closes expanded island and restores focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && capsuleState.isExpanded) {
        e.preventDefault();
        setPranaCapsuleExpanded(false);
        pillRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [capsuleState.isExpanded]);

  const toggleExpand = useCallback(() => {
    triggerTactileFeedback('light', 'softTap');
    setPranaCapsuleExpanded(!capsuleState.isExpanded);
  }, [capsuleState.isExpanded]);

  const handlePrevVerse = () => {
    triggerTactileFeedback('medium', 'click');
    window.dispatchEvent(new CustomEvent('dharma:verse-prev'));
  };

  const handleNextVerse = () => {
    triggerTactileFeedback('medium', 'click');
    window.dispatchEvent(new CustomEvent('dharma:verse-next'));
  };

  const handleToggleSound = () => {
    triggerTactileFeedback('medium', 'click');
    toggleSoundscape();
  };

  const handleSelectCadence = (mode: ParayanaCadenceMode) => {
    triggerTactileFeedback('light', 'softTap');
    setParayanaCadenceMode(mode);
  };

  const handleToggleEkagrata = () => {
    const next = !ekagrataActive;
    setEkagrataActive(next);
    triggerTactileFeedback('medium', 'softTap');
    window.dispatchEvent(new CustomEvent('dharma:ekagrata-toggle', { detail: { active: next } }));
    try {
      localStorage.setItem('dharma_ekagrata_mode', JSON.stringify(next));
    } catch {}
  };

  // Determine current active mode
  const mode = capsuleState.activeMode;
  const isParayanaActive = soundState.isPlaying || soundState.continuousParayana;
  const isIslandPinned =
    capsuleState.isExpanded || isParayanaActive || mode === 'toast' || mode === 'sabda-peek' || mode === 'sadhana';
  const shouldShowIsland = !isAutoHideRoute || !isScrollHidden || isIslandPinned || isCapsuleFocused;

  return (
    <>
      {/* Screen Reader Announcement Live Region */}
      <div className="sr-only" role="status" aria-live="polite">
        {capsuleState.toast?.message ||
          (isParayanaActive ? `Pārāyaṇa active: ${soundState.currentVerseReference || 'recitation'}` : '')}
      </div>

      {/* Scroll-aware Floating Island Container */}
      <motion.aside
        initial={false}
        animate={
          shouldShowIsland
            ? reduceMotion
              ? { opacity: 1 }
              : { opacity: 1, y: 0, scale: 1 }
            : reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 12, scale: 0.98 }
        }
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        // Keep it above the reader's one-thumb controls on chapter pages, and above the mobile nav elsewhere.
        className={`fixed ${isChapterReader ? 'bottom-[calc(10rem+env(safe-area-inset-bottom))]' : 'bottom-[calc(4.25rem+env(safe-area-inset-bottom))]'} lg:bottom-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center`}
        aria-label="Prāṇa Sūtra Active Island"
        data-hide-during-chapter-reading
        aria-hidden={!shouldShowIsland}
        inert={!shouldShowIsland}
        onFocusCapture={() => setIsCapsuleFocused(true)}
        onBlurCapture={(event) => {
          if (!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget as Node)) {
            setIsCapsuleFocused(false);
          }
        }}
      >
        <AnimatePresence mode="wait">
          {capsuleState.isExpanded ? (
            /* ── Expanded Island Surface ── */
            <motion.div
              ref={islandRef}
              key="prana-expanded"
              role="dialog"
              aria-modal="false"
              aria-label="Prāṇa Activity Center"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 15 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto w-[min(94vw,440px)] rounded-3xl border border-amber-500/35 bg-stone-950/95 p-4 sm:p-5 text-amber-50 shadow-2xl backdrop-blur-2xl ring-1 ring-amber-400/20"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-300 text-xs font-serif font-bold">
                    ॐ
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-300/90 font-devanagari">
                    {mode === 'audio-parayana'
                      ? 'पवित्र अध्याय पारायण · Audio'
                      : mode === 'sabda-peek'
                      ? 'शब्दार्थ दर्शन · Śabda-Peek'
                      : mode === 'sadhana'
                      ? 'दैनिक साधना · Sadhana'
                      : 'धर्म ग्रन्थ · स्वाध्याय'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      triggerTactileFeedback('light', 'softTap');
                      openGlobalSearch();
                    }}
                    className="p-1.5 rounded-full text-amber-300/70 hover:text-amber-200 hover:bg-amber-500/10 transition"
                    title="खोजें · Search (Ctrl+K)"
                    aria-label="Open Omnibar Search"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPranaCapsuleExpanded(false)}
                    className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition"
                    title="संक्षिप्त करें · Collapse (Escape)"
                    aria-label="Collapse Prāṇa Island"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ── EXPANDED CONTENT BY MODE ── */}
              <div className="py-3 space-y-4">
                {/* 1. Śabda-Peek (Word meaning lookup) */}
                {mode === 'sabda-peek' && capsuleState.sabdaPeek ? (
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-devanagari text-2xl font-bold text-amber-200 leading-snug">
                          {capsuleState.sabdaPeek.wordDevanagari || capsuleState.sabdaPeek.word}
                        </h4>
                        {capsuleState.sabdaPeek.transliteration && (
                          <p className="text-xs italic text-amber-400/80 font-serif">
                            {capsuleState.sabdaPeek.transliteration}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          triggerTactileFeedback('medium', 'softTap');
                          speakSanskritTerm(capsuleState.sabdaPeek!.word, 0.85);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-semibold hover:bg-amber-500/30 transition"
                        aria-label={`Pronounce ${capsuleState.sabdaPeek.word}`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>उच्चारण (0.85x)</span>
                      </button>
                    </div>

                    {capsuleState.sabdaPeek.root && (
                      <p className="text-2xs text-stone-400 font-mono">
                        मूल / विच्छेद: <span className="text-amber-300">{capsuleState.sabdaPeek.root}</span>
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {capsuleState.sabdaPeek.meaningHi && (
                        <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/20">
                          <p className="text-2xs font-semibold uppercase text-amber-400/80 mb-0.5">हिंदी अर्थ</p>
                          <p className="font-devanagari text-amber-100">{capsuleState.sabdaPeek.meaningHi}</p>
                        </div>
                      )}
                      {capsuleState.sabdaPeek.meaningEn && (
                        <div className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800">
                          <p className="text-2xs font-semibold uppercase text-stone-400 mb-0.5">English</p>
                          <p className="text-stone-200">{capsuleState.sabdaPeek.meaningEn}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* 2. Audio Pārāyaṇa & Soundscape Controls */}
                {(mode === 'audio-parayana' || isParayanaActive) && (
                  <div className="space-y-3">
                    {/* Active Verse & Pāda line */}
                    <div>
                      <div className="flex items-center justify-between text-2xs text-amber-400/80">
                        <span>{soundState.currentVerseReference || 'श्रीमद्भगवद्गीता'}</span>
                        {isBreathInterval ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 animate-pulse font-mono font-bold">
                            ✦ श्वास विराम ({breathCountdown}s)
                          </span>
                        ) : (
                          <span className="text-stone-400">सस्वर वाचन</span>
                        )}
                      </div>

                      {activePadaLine && (
                        <p className="mt-1 font-devanagari text-base font-bold text-amber-100 leading-relaxed bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                          {activePadaLine}
                        </p>
                      )}
                    </div>

                    {/* Cadence Mode Switcher */}
                    <div>
                      <span className="text-2xs font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">
                        पारायण पाठ प्रकार · Cadence Mode
                      </span>
                      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-stone-900 border border-stone-800 text-xs text-center font-medium">
                        {(
                          [
                            { id: 'sanskrit_only', label: 'संस्कृत मात्र', sub: 'Canonical' },
                            { id: 'sanskrit_hindi', label: 'संस्कृत + हिन्दी', sub: 'Meaning' },
                            { id: 'sanskrit_english', label: 'संस्कृत + English', sub: 'Bilingual' },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectCadence(opt.id)}
                            className={`py-1.5 px-1 rounded-lg transition ${
                              soundState.parayanaCadenceMode === opt.id
                                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                                : 'text-stone-300 hover:text-white hover:bg-stone-800'
                            }`}
                          >
                            <span className="block text-2xs leading-tight">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Playback Transport Buttons */}
                    <div className="flex items-center justify-center gap-4 pt-1">
                      <button
                        type="button"
                        onClick={handlePrevVerse}
                        className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition"
                        title="पिछला श्लोक · Previous Verse"
                        aria-label="Previous Verse"
                      >
                        <SkipBack className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={handleToggleSound}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition"
                        aria-label={soundState.isPlaying ? 'Pause recitation' : 'Resume recitation'}
                      >
                        {soundState.isPlaying ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleNextVerse}
                        className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition"
                        title="अगला श्लोक · Next Verse"
                        aria-label="Next Verse"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Ambient Drone Quick Toggles */}
                    <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-2xs">
                      <span className="text-stone-400">पृष्ठभूमि नाद:</span>
                      <div className="flex items-center gap-1.5">
                        {DRONE_TRACKS.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              triggerTactileFeedback('light', 'softTap');
                              setSoundscapeTrack(t.id);
                            }}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-2xs font-semibold transition ${
                              soundState.activeTrack === t.id
                                ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                                : 'text-stone-400 hover:text-white hover:bg-stone-800'
                            }`}
                          >
                            {t.icon}
                            <span>{t.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Sadhana Session (Meditation or Japa) */}
                {mode === 'sadhana' && capsuleState.sadhana && (
                  <div className="space-y-3 text-center">
                    <p className="text-xs font-semibold text-amber-400/90 uppercase tracking-wider">
                      {capsuleState.sadhana.title}
                    </p>
                    <div className="text-3xl font-mono font-bold text-amber-200">
                      {capsuleState.sadhana.formattedTime || capsuleState.sadhana.value}
                    </div>
                    {capsuleState.sadhana.type === 'meditation' && (
                      <p className="text-xs text-stone-400 font-devanagari">
                        श्वास-प्रश्वास पर ध्यान केंद्रित करें · Breathe in awareness
                      </p>
                    )}
                  </div>
                )}

                {/* 4. Reader Features: Ekāgratā Spotlight & Jump */}
                <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleToggleEkagrata}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                      ekagrataActive
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-stone-900 text-amber-200 border border-amber-500/30 hover:bg-stone-800'
                    }`}
                    aria-pressed={ekagrataActive}
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>{ekagrataActive ? 'एकाग्रता चालू · Spotlight On' : 'एकाग्रता मोड · Spotlight'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerTactileFeedback('light', 'softTap');
                      openGlobalSearch('>');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-amber-400/80 hover:text-amber-200"
                  >
                    <span>पवित्र क्रियाएँ (Omnibar)</span>
                    <span className="font-mono text-2xs bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800">
                      &gt;
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ── Compact Pill Surface ── */
            <motion.button
              ref={pillRef}
              key="prana-compact"
              type="button"
              onClick={toggleExpand}
              aria-label="Open Prāṇa Live Island"
              aria-expanded={false}
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto group inline-flex h-11 items-center gap-2.5 rounded-full border border-amber-500/40 bg-stone-950/95 px-4 text-amber-50 shadow-2xl backdrop-blur-xl ring-1 ring-amber-400/20 hover:border-amber-400 transition"
            >
              {/* Left Indicator Icon */}
              {mode === 'toast' ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                  {capsuleState.toast?.icon || <Check className="w-3.5 h-3.5" />}
                </span>
              ) : mode === 'sabda-peek' ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-amber-300 text-xs font-serif font-bold">
                  पद
                </span>
              ) : isParayanaActive ? (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
                </span>
              ) : mode === 'sadhana' ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-amber-300 text-xs">
                  <Timer className="w-3.5 h-3.5" />
                </span>
              ) : (
                <span className="text-amber-400 font-serif font-bold text-sm">ॐ</span>
              )}

              {/* Compact Center Content */}
              <div className="max-w-[240px] sm:max-w-[300px] truncate text-left text-xs font-medium">
                {mode === 'toast' && capsuleState.toast ? (
                  <span className="text-emerald-200 font-semibold">{capsuleState.toast.message}</span>
                ) : mode === 'sabda-peek' && capsuleState.sabdaPeek ? (
                  <span>
                    <strong className="text-amber-200 font-devanagari">{capsuleState.sabdaPeek.word}:</strong>{' '}
                    <span className="text-stone-300">{capsuleState.sabdaPeek.meaningHi || capsuleState.sabdaPeek.meaningEn}</span>
                  </span>
                ) : isParayanaActive ? (
                  <span>
                    <strong className="text-amber-300">{soundState.currentVerseReference || 'अध्याय पारायण'}</strong>
                    {isBreathInterval ? (
                      <span className="text-emerald-300 ml-1.5">✦ {breathCountdown}s श्वास</span>
                    ) : (
                      <span className="text-stone-400 ml-1.5">· वाचन चालू</span>
                    )}
                  </span>
                ) : mode === 'sadhana' && capsuleState.sadhana ? (
                  <span>
                    <strong className="text-amber-300">{capsuleState.sadhana.title}:</strong>{' '}
                    <span className="font-mono text-stone-200">
                      {capsuleState.sadhana.formattedTime || capsuleState.sadhana.value}
                    </span>
                  </span>
                ) : capsuleState.readerScroll && capsuleState.readerScroll.verseNumber > 0 ? (
                  <span>
                    <span className="text-amber-200 font-devanagari">
                      श्लोक {capsuleState.readerScroll.verseNumber} / {capsuleState.readerScroll.totalVerses}
                    </span>{' '}
                    <span className="text-stone-400">({capsuleState.readerScroll.percent}%)</span>
                  </span>
                ) : (
                  <span className="text-stone-300">
                    धर्म ग्रन्थ <span className="text-amber-400/80">· Ctrl+K खोजें</span>
                  </span>
                )}
              </div>

              {/* Expand Hint Indicator */}
              <ChevronUp className="w-3.5 h-3.5 text-amber-400/70 group-hover:text-amber-200 transition" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.aside>
    </>
  );
}
