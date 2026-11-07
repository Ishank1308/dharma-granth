'use client';

import { useEffect, useRef, useState, useCallback, type KeyboardEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from 'framer-motion';
import {
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import Link from 'next/link';
import type { ScriptureCategory } from '@/data/types';
import type { HiCommentaryFragment } from '@/data/hi-commentary/_types';
import { lookupCommentary, type CommentaryAmbiguities } from '@/lib/commentary-lookup';
import { resolveKeywordTarget } from '@/lib/keyword-links';
import { isTanpuraPlaying, toggleTanpura, subscribeTanpura } from '@/lib/tanpura-audio';
import {
  startSoundscape,
  stopSoundscape,
  setCurrentVerseContext,
  subscribeSoundscape,
  type SoundscapeState,
} from '@/lib/sacred-soundscape';
import { splitVerseLines, toAsciiDigits } from '@/lib/verse-format';
import { triggerTactileFeedback } from '@/lib/haptics';
import { useReaderSettings } from '@/lib/useReaderSettings';

export interface FocusVerse {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
  translationSource?: 'ai';
  hindi?: string;
  hindiSource?: 'ai';
  wordMeaning?: string;
  commentary?: string;
  explanation?: string;
  science?: string;
  lifeLesson?: string;
  keywords?: string[];
}

interface MobileFocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  verses: FocusVerse[];
  initialVerseIndex: number;
  scriptureId: string;
  scriptureTitle: string;
  chapterTitle: string;
  chapterId: number;
  category: ScriptureCategory;
  commentary?: HiCommentaryFragment;
  commentaryAmbiguity?: CommentaryAmbiguities;
  bookmarkedMap: Record<string, boolean>;
  onToggleBookmark: (verse: FocusVerse) => void;
  onVerseChange?: (verseNumber: number | string) => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 260 : -260,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring' as const, stiffness: 350, damping: 32 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -260 : 260,
    opacity: 0,
    scale: 0.96,
    transition: {
      x: { type: 'spring' as const, stiffness: 350, damping: 32 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 },
    },
  }),
};

const FOCUSABLE = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileFocusMode({
  isOpen,
  onClose,
  verses,
  initialVerseIndex,
  scriptureId,
  scriptureTitle,
  chapterTitle,
  chapterId,
  category,
  commentary,
  commentaryAmbiguity,
  bookmarkedMap,
  onToggleBookmark,
  onVerseChange,
}: MobileFocusModeProps) {
  const [currentIndex, setCurrentIndex] = useState(
    Math.max(0, Math.min(initialVerseIndex, verses.length - 1)),
  );
  const [direction, setDirection] = useState(0);
  const { settings, update } = useReaderSettings();
  const {
    sanskritSize,
    translationSize,
    lineSpacing,
    showTransliteration: showTranslit,
    showHindi,
    showEnglish,
    showCommentary,
  } = settings;
  const [showMenu, setShowMenu] = useState(false);

  const [tanpuraActive, setTanpuraActive] = useState(false);
  const [recitationActive, setRecitationActive] = useState(false);

  useEffect(() => {
    setTanpuraActive(isTanpuraPlaying());

    const unsubTanpura = subscribeTanpura((active) => {
      setTanpuraActive(active);
    });

    const unsubSoundscape = subscribeSoundscape((st: SoundscapeState) => {
      setRecitationActive(st.isPlaying && st.activeTrack === 'recitation');
    });

    return () => {
      unsubTanpura();
      unsubSoundscape();
    };
  }, []);

  const reduce = useReducedMotion();
  const cardScrollRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Sync index when initialVerseIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      const idx = Math.max(0, Math.min(initialVerseIndex, verses.length - 1));
      setCurrentIndex(idx);
      setDirection(0);
    }
  }, [isOpen, initialVerseIndex, verses.length]);

  // Keep keyboard focus inside this full-screen reader and return it to the opener.
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const trapTab = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((item) => item.offsetParent !== null);
      if (items.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', trapTab, true);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', trapTab, true);
      document.body.style.overflow = previousOverflow;
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const currentVerse: FocusVerse | undefined = verses[currentIndex];
  const verseKey = currentVerse ? currentVerse.sanskrit || currentVerse.hindi || currentVerse.translation || '' : '';

  // Update soundscape context on verse change if recitation is playing
  useEffect(() => {
    if (recitationActive && currentVerse?.sanskrit) {
      setCurrentVerseContext(
        currentVerse.sanskrit,
        `${scriptureTitle} ${chapterTitle}, श्लोक ${currentVerse.number}`
      );
    }
  }, [currentIndex, recitationActive, currentVerse, scriptureTitle, chapterTitle]);

  // Navigate to previous/next verse
  const goTo = useCallback(
    (newIndex: number, dir: number) => {
      if (newIndex < 0 || newIndex >= verses.length) return;
      setDirection(dir);
      setCurrentIndex(newIndex);
      triggerTactileFeedback('light', 'softTap');
      if (cardScrollRef.current) {
        cardScrollRef.current.scrollTop = 0;
      }
      onVerseChange?.(verses[newIndex].number);
    },
    [verses, onVerseChange],
  );

  const prev = useCallback(() => {
    if (currentIndex > 0) goTo(currentIndex - 1, -1);
  }, [currentIndex, goTo]);

  const next = useCallback(() => {
    if (currentIndex < verses.length - 1) goTo(currentIndex + 1, 1);
  }, [currentIndex, verses.length, goTo]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        next();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        prev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, next, prev, onClose]);

  // Gestures via PanInfo
  const handlePanEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { x, y } = info.offset;
    const SWIPE_THRESHOLD = 45;
    if (Math.abs(x) > Math.abs(y)) {
      if (x < -SWIPE_THRESHOLD) next();
      else if (x > SWIPE_THRESHOLD) prev();
    } else if (y > 75) {
      // Pull down to dismiss
      onClose();
    }
  };

  if (!isOpen || !currentVerse) return null;

  const totalVerses = verses.length;
  const progressPercent = totalVerses > 0 ? ((currentIndex + 1) / totalVerses) * 100 : 0;
  const verseLabel = String(currentVerse.number);
  const isBookmarked = Boolean(bookmarkedMap[verseLabel]);

  // Resolve commentary
  const comment = lookupCommentary(commentary, chapterId, currentVerse.number, commentaryAmbiguity);
  const explanation = comment?.explanation ?? currentVerse.explanation ?? currentVerse.commentary;
  const science = comment?.science ?? currentVerse.science;
  const lesson = comment?.lifeLesson ?? currentVerse.lifeLesson;

  const lines = currentVerse.sanskrit ? splitVerseLines(currentVerse.sanskrit) : [];

  const lineSpacingClass = {
    compact: 'leading-[1.7]',
    normal: 'leading-[1.85]',
    relaxed: 'leading-[2.05]',
    loose: 'leading-[2.35]',
  }[lineSpacing];
  const sanskritSizeClass = `${{
    sm: 'text-base md:text-lg',
    md: 'text-lg md:text-xl',
    lg: 'text-xl md:text-2xl',
    xl: 'text-2xl md:text-3xl',
  }[sanskritSize]} ${lineSpacingClass}`;
  const translationSizeClass = `${{
    sm: 'text-sm md:text-base',
    md: 'text-base md:text-lg',
    lg: 'text-lg md:text-xl',
    xl: 'text-xl md:text-2xl',
  }[translationSize]} ${lineSpacingClass}`;

  return (
    <AnimatePresence>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`एकाग्रता मोड · श्लोक ${verseLabel}`}
        tabIndex={-1}
        className="fixed inset-0 z-50 flex flex-col bg-stone-950/95 text-stone-100 backdrop-blur-xl touch-none select-none"
      >
        {/* Progress bar at the top */}
        <div className="h-1 w-full bg-stone-800">
          <motion.div
            className="h-full bg-gradient-to-r from-saffron-500 via-amber-400 to-saffron-400"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        </div>

        {/* ── Top Bar ────────────────────────────────────────── */}
        <header className="relative flex shrink-0 items-center justify-between border-b border-stone-800/80 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => {
                triggerTactileFeedback('light', 'softTap');
                onClose();
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:border-stone-700 transition"
              aria-label="एकाग्रता मोड बंद करें"
              title="बंद करें (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-saffron-400">
                {scriptureTitle} · {chapterTitle}
              </p>
              <p className="text-sm font-serif font-bold text-stone-200">
                श्लोक {toAsciiDigits(verseLabel)}{' '}
                <span className="text-xs font-sans text-stone-400 font-normal">
                  ({currentIndex + 1} / {totalVerses})
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Sanskrit Recitation Audio */}
            {currentVerse.sanskrit && (
              <button
                type="button"
                onClick={() => {
                  triggerTactileFeedback('selection', 'click');
                  if (recitationActive) {
                    stopSoundscape();
                  } else {
                    setCurrentVerseContext(
                      currentVerse.sanskrit,
                      `${scriptureTitle} ${chapterTitle}, श्लोक ${currentVerse.number}`
                    );
                    startSoundscape('recitation');
                  }
                }}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border transition ${
                  recitationActive
                    ? 'border-amber-400/80 bg-amber-500/20 text-amber-300 shadow-sm ring-1 ring-amber-400/40'
                    : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200'
                }`}
                title={recitationActive ? 'श्लोक उच्चारण रोकें' : 'श्लोक उच्चारण सुनें (Listen to Recitation)'}
                aria-pressed={recitationActive}
                aria-label="श्लोक उच्चारण"
              >
                <Volume2 className={`h-3 w-3 ${recitationActive ? 'text-amber-400 animate-pulse' : ''}`} />
                <span className="hidden sm:inline">उच्चारण</span>
              </button>
            )}

            {/* Tanpura Sacred Drone Ambience */}
            <button
              type="button"
              onClick={() => {
                triggerTactileFeedback('celestial', 'omBowl');
                toggleTanpura();
              }}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border transition ${
                tanpuraActive
                  ? 'border-amber-400/80 bg-amber-500/20 text-amber-300 shadow-sm ring-1 ring-amber-400/40'
                  : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200'
              }`}
              title={tanpuraActive ? 'तन्पूरा सक्रिय (Tanpura Active ॐ)' : 'तन्पूरा ध्यान नाद चालू करें (Tanpura Ambience)'}
              aria-pressed={tanpuraActive}
            >
              <Sparkles className={`h-3 w-3 ${tanpuraActive ? 'text-amber-400 animate-pulse' : ''}`} />
              <span className="hidden sm:inline">तन्पूरा ॐ</span>
            </button>

            {/* Bookmark button */}
            <button
              type="button"
              onClick={() => onToggleBookmark(currentVerse)}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition ${
                isBookmarked
                  ? 'border-saffron-400 bg-saffron-500/20 text-saffron-300'
                  : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200'
              }`}
              aria-label={isBookmarked ? 'बुकमार्क हटाएं' : 'बुकमार्क करें'}
              title={isBookmarked ? 'बुकमार्क हटाएं' : 'बुकमार्क करें'}
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-3.5 w-3.5 fill-current" />
              ) : (
                <Bookmark className="h-3.5 w-3.5" />
              )}
            </button>

            {/* Font size toggle */}
            <div className="hidden sm:inline-flex items-center rounded-full border border-stone-800 bg-stone-900 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => update('sanskritSize', 'sm')}
                className={`rounded-full px-2 py-0.5 transition ${
                  sanskritSize === 'sm' ? 'bg-saffron-600 text-white font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
                title="छोटे अक्षर"
                aria-pressed={sanskritSize === 'sm'}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => update('sanskritSize', 'md')}
                className={`rounded-full px-2 py-0.5 transition ${
                  sanskritSize === 'md' ? 'bg-saffron-600 text-white font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
                title="सामान्य अक्षर"
                aria-pressed={sanskritSize === 'md'}
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => update('sanskritSize', 'lg')}
                className={`rounded-full px-2 py-0.5 transition ${
                  sanskritSize === 'lg' ? 'bg-saffron-600 text-white font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
                title="बड़े अक्षर"
                aria-pressed={sanskritSize === 'lg'}
              >
                A++
              </button>
              <button
                type="button"
                onClick={() => update('sanskritSize', 'xl')}
                className={`rounded-full px-2 py-0.5 transition ${
                  sanskritSize === 'xl' ? 'bg-saffron-600 text-white font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
                title="विशाल अक्षर"
                aria-pressed={sanskritSize === 'xl'}
              >
                A+++
              </button>
            </div>

            {/* Layers popup toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu((o) => !o)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition ${
                  showMenu ? 'border-saffron-400 bg-saffron-500/20 text-saffron-300' : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200'
                }`}
                aria-label="दृश्य विकल्प"
                title="विकल्प"
                aria-expanded={showMenu}
                aria-controls="focus-reader-settings"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </button>

              {showMenu && (
                <div id="focus-reader-settings" className="absolute right-0 top-full mt-2 z-30 w-72 max-w-[calc(100vw-2rem)] max-h-[min(75vh,38rem)] overflow-y-auto rounded-2xl border border-stone-800 bg-stone-900 p-3 shadow-2xl space-y-3 text-xs">
                  <p className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    पठन विकल्प · Reading options
                  </p>
                  <fieldset className="rounded-xl border border-stone-800 p-2">
                    <legend className="px-1 font-semibold text-stone-200">Sanskrit size · संस्कृत आकार</legend>
                    <div className="grid grid-cols-4 gap-1">
                      {([
                        ['sm', 'A', 'Small'],
                        ['md', 'A+', 'Default'],
                        ['lg', 'A++', 'Large'],
                        ['xl', 'A+++', 'Largest'],
                      ] as const).map(([size, label, name]) => (
                        <button
                          key={size}
                          type="button"
                          aria-label={`${name} Sanskrit text`}
                          aria-pressed={sanskritSize === size}
                          onClick={() => update('sanskritSize', size)}
                          className={`min-h-9 rounded-lg border px-1 font-semibold ${sanskritSize === size ? 'border-amber-400 bg-amber-500 text-stone-950' : 'border-stone-700 text-stone-300 hover:border-stone-500'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className="rounded-xl border border-stone-800 p-2">
                    <legend className="px-1 font-semibold text-stone-200">Translation size · अनुवाद आकार</legend>
                    <div className="grid grid-cols-4 gap-1">
                      {([
                        ['sm', 'S'],
                        ['md', 'M'],
                        ['lg', 'L'],
                        ['xl', 'XL'],
                      ] as const).map(([size, label]) => (
                        <button
                          key={size}
                          type="button"
                          aria-label={`${label} translation text`}
                          aria-pressed={translationSize === size}
                          onClick={() => update('translationSize', size)}
                          className={`min-h-9 rounded-lg border px-1 font-semibold ${translationSize === size ? 'border-amber-400 bg-amber-500 text-stone-950' : 'border-stone-700 text-stone-300 hover:border-stone-500'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className="rounded-xl border border-stone-800 p-2">
                    <legend className="px-1 font-semibold text-stone-200">Line spacing · पंक्ति अंतराल</legend>
                    <div className="grid grid-cols-2 gap-1">
                      {([
                        ['compact', 'Compact'],
                        ['normal', 'Normal'],
                        ['relaxed', 'Relaxed'],
                        ['loose', 'Loose'],
                      ] as const).map(([spacing, label]) => (
                        <button
                          key={spacing}
                          type="button"
                          aria-pressed={lineSpacing === spacing}
                          onClick={() => update('lineSpacing', spacing)}
                          className={`min-h-9 rounded-lg border px-2 font-medium ${lineSpacing === spacing ? 'border-amber-400 bg-amber-500 text-stone-950' : 'border-stone-700 text-stone-300 hover:border-stone-500'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <label className="flex items-center gap-2 rounded-lg px-2 py-1 text-stone-200 hover:bg-stone-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showTranslit}
                      onChange={(e) => update('showTransliteration', e.target.checked)}
                      className="rounded text-saffron-600 focus:ring-0"
                    />
                    <span>लिप्यंतरण (Translit)</span>
                  </label>
                  <label className="flex items-center gap-2 rounded-lg px-2 py-1 text-stone-200 hover:bg-stone-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showHindi}
                      onChange={(e) => update('showHindi', e.target.checked)}
                      className="rounded text-saffron-600 focus:ring-0"
                    />
                    <span>हिन्दी अर्थ</span>
                  </label>
                  <label className="flex items-center gap-2 rounded-lg px-2 py-1 text-stone-200 hover:bg-stone-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showEnglish}
                      onChange={(e) => update('showEnglish', e.target.checked)}
                      className="rounded text-saffron-600 focus:ring-0"
                    />
                    <span>English Meaning</span>
                  </label>
                  <label className="flex items-center gap-2 rounded-lg px-2 py-1 text-stone-200 hover:bg-stone-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showCommentary}
                      onChange={(e) => update('showCommentary', e.target.checked)}
                      className="rounded text-saffron-600 focus:ring-0"
                    />
                    <span>व्याख्या व सीख</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Main Swipeable Content Container ───────────────── */}
        <div
          className="relative flex-1 overflow-hidden touch-pan-y"
          ref={cardScrollRef}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={reduce ? undefined : slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              onPanEnd={handlePanEnd}
              className="absolute inset-0 flex flex-col justify-start overflow-y-auto px-4 py-6 sm:px-8 md:px-16"
            >
              <div className="mx-auto w-full max-w-3xl space-y-6 pb-20">
                {/* ── Sanskrit Manuscript Leaf Card ── */}
                <div className="relative rounded-3xl border border-amber-500/20 bg-gradient-to-b from-stone-900 via-stone-900/90 to-stone-950 p-6 md:p-10 shadow-2xl text-center">
                  {/* Subtle lotus corner motifs */}
                  <span aria-hidden="true" className="absolute left-4 top-3 text-amber-500/20 text-lg">❁</span>
                  <span aria-hidden="true" className="absolute right-4 top-3 text-amber-500/20 text-lg">❁</span>

                  <div lang="hi" className="mb-4 inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-amber-500/20 to-saffron-500/30 text-amber-300 font-devanagari font-bold border border-amber-500/30">
                    {toAsciiDigits(verseLabel)}
                  </div>

                  {lines.length > 0 && (
                    <div lang="sa" className={`font-devanagari ${sanskritSizeClass} text-amber-50 space-y-2`}>
                      {lines.map((line, i) => {
                        const isLineSpeaking = false;
                        return (
                          <p
                            key={i}
                            className={`rounded-xl px-3 py-1 transition-all duration-300 ${
                              isLineSpeaking
                                ? 'bg-gradient-to-r from-saffron-500/30 via-amber-500/25 to-saffron-500/30 text-amber-200 font-bold shadow-md ring-1 ring-saffron-400/70 scale-[1.02]'
                                : ''
                            }`}
                          >
                            {line}
                          </p>
                        );
                      })}
                      <p className="mt-3 font-bold text-saffron-400">
                        ॥ {toAsciiDigits(verseLabel)} ॥
                      </p>
                    </div>
                  )}

                  {/* Transliteration */}
                  {showTranslit && currentVerse.transliteration && (
                    <p
                      lang="sa-Latn"
                      className="mx-auto mt-5 max-w-xl border-t border-stone-800/80 pt-4 text-sm md:text-base italic leading-relaxed text-stone-400 whitespace-pre-line"
                    >
                      {currentVerse.transliteration.replace(/[\s|।॥0-9.]+$/, '')}
                    </p>
                  )}
                </div>

                {/* ── Meanings ── */}
                <div
                  className={`rounded-2xl border border-stone-800/80 bg-stone-900/60 p-5 space-y-4 transition-all duration-300 ${
                    ''
                  }`}
                >
                  {showHindi && currentVerse.hindi && (
                    <div>
                      <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-saffron-400">
                        हिन्दी अर्थ
                      </p>
                      <p lang="hi" className={`font-devanagari ${translationSizeClass} text-stone-200`}>
                        {currentVerse.hindi}
                      </p>
                    </div>
                  )}

                  {showEnglish && currentVerse.translation && (
                    <div className={showHindi && currentVerse.hindi ? 'border-t border-stone-800/60 pt-3' : ''}>
                      <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                        English Meaning
                      </p>
                      <p lang="en" className={`${translationSizeClass} text-stone-300`}>
                        {currentVerse.translation}
                      </p>
                    </div>
                  )}
                </div>

                {/* ── Life Lesson / Commentary ── */}
                {showCommentary && lesson && (
                  <div className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 via-stone-900/70 to-transparent p-4">
                    <p lang="hi" className="mb-1 text-xs font-bold text-amber-300 flex items-center gap-1.5 font-devanagari">
                      <span>✨</span> आज की सीख (Life Insight)
                    </p>
                    <p lang="hi" className={`font-devanagari ${translationSizeClass} text-stone-200`}>
                      {lesson}
                    </p>
                  </div>
                )}

                {/* ── Keywords ── */}
                {currentVerse.keywords && currentVerse.keywords.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    <span className="text-[11px] font-medium text-stone-400 mr-1">संबंधित:</span>
                    {currentVerse.keywords.map((k) => {
                      const target = resolveKeywordTarget(k);
                      return (
                        <Link
                          key={k}
                          href={target.href}
                          onClick={() => {
                            onClose();
                          }}
                          className="inline-flex items-center gap-1 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-saffron-300 hover:bg-saffron-500/20 hover:border-saffron-400 transition"
                        >
                          #{k.replace(/^#+/, '')}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom Navigation Controls Bar ──────────────────── */}
        <footer className="relative flex shrink-0 items-center justify-between border-t border-stone-800/80 bg-stone-950/90 px-3 py-3 sm:px-8 backdrop-blur-md gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={currentIndex === 0}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              currentIndex === 0
                ? 'border-stone-800 text-stone-600 cursor-not-allowed opacity-50'
                : 'border-stone-800 bg-stone-900 text-stone-200 hover:border-stone-700 hover:bg-stone-850 active:scale-95'
            }`}
            aria-label="पिछला श्लोक"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden md:inline">पिछला</span>
          </button>

          <button
            type="button"
            onClick={next}
            disabled={currentIndex === verses.length - 1}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              currentIndex === verses.length - 1
                ? 'border-stone-800 text-stone-600 cursor-not-allowed opacity-50'
                : 'border-stone-800 bg-stone-900 text-stone-200 hover:border-stone-700 hover:bg-stone-850 active:scale-95'
            }`}
            aria-label="अगला श्लोक"
          >
            <span className="hidden md:inline">अगला</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </footer>
      </div>
    </AnimatePresence>
  );
}
