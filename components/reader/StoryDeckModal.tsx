'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Sparkles,
  BookOpen,
  Bookmark,
  Check,
  Share2,
  Clock,
  HelpCircle,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { triggerTactileFeedback } from '@/lib/haptics';
import { speakSanskritShloka, stopSanskritSpeech } from '@/lib/sacred-audio';
import type { LiteraryVerseMeta } from '@/lib/literary-commentary';
import { saveJournalEntry } from '@/lib/study/storage';
import type { JournalEntry } from '@/lib/study/types';

export interface StoryDeckData {
  scriptureTitle: string;
  chapterTitle?: string;
  verseRef: string; // e.g. "भगवद्गीता २.४७" or "Bhagavad Gita 2.47"
  sanskrit: string;
  transliteration?: string;
  hindi?: string;
  english?: string;
  meta: LiteraryVerseMeta;
  chapterHref?: string;
  verseHref?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: StoryDeckData;
  onOpenShare?: () => void;
}

const TOTAL_CARDS = 5;

export function StoryDeckModal({ isOpen, onClose, data, onOpenShare }: Props) {
  const [currentCard, setCurrentCard] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [savedToJournal, setSavedToJournal] = useState(false);
  const reduce = useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Reset to first card when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentCard(0);
      setSavedToJournal(false);
      triggerTactileFeedback('selection', 'softTap');
    }
  }, [isOpen]);

  const handleNext = useCallback(() => {
    if (currentCard < TOTAL_CARDS - 1) {
      setCurrentCard((c) => c + 1);
      triggerTactileFeedback('selection', 'softTap');
    }
  }, [currentCard]);

  const handlePrev = useCallback(() => {
    if (currentCard > 0) {
      setCurrentCard((c) => c - 1);
      triggerTactileFeedback('selection', 'softTap');
    }
  }, [currentCard]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Touch Swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    // Detect horizontal swipe if larger than vertical scroll
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const playAudio = () => {
    if (!data.sanskrit || isPlayingAudio) return;
    setIsPlayingAudio(true);
    triggerTactileFeedback('light', 'softTap');
    try {
      const ok = speakSanskritShloka(
        data.sanskrit,
        0.85,
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
      if (!ok) setIsPlayingAudio(false);
    } catch {
      setIsPlayingAudio(false);
    }
  };

  const handleSaveToJournal = () => {
    triggerTactileFeedback('selection', 'softTap');
    try {
      const raw = localStorage.getItem('dharma.userMananaNotes') || '[]';
      const notes = JSON.parse(raw);
      notes.push({
        id: `story-note-${Date.now()}`,
        reference: data.verseRef,
        prompt: data.meta.microPracticeHi || data.meta.microPracticeEn,
        date: new Date().toISOString(),
      });
      localStorage.setItem('dharma.userMananaNotes', JSON.stringify(notes));
      setSavedToJournal(true);
      setTimeout(() => setSavedToJournal(false), 2500);
    } catch {
      setSavedToJournal(true);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`६०-सेकंड सार · ${data.verseRef}`}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md overflow-hidden"
      >
        <motion.div
          ref={modalRef}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative flex flex-col w-full max-w-lg h-[640px] max-h-[90vh] rounded-3xl border border-stone-700/60 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white shadow-2xl overflow-hidden"
        >
          {/* Header Progress Bars */}
          <div className="p-4 pb-2">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-saffron-500/20 text-saffron-300 text-[11px] font-bold tracking-wider uppercase border border-saffron-500/30">
                  <Clock className="w-3 h-3" /> ६०-सेकंड सार
                </span>
                <span className="text-xs text-stone-400 font-medium">
                  {data.verseRef}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="कथा डेक बंद करें"
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 5-Segment Story Progress Bar */}
            <div className="grid grid-cols-5 gap-1.5 h-1">
              {Array.from({ length: TOTAL_CARDS }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentCard(idx)}
                  aria-label={`कार्ड ${idx + 1} पर जाएँ`}
                  className={`h-full rounded-full transition-all duration-300 ${
                    idx === currentCard
                      ? 'bg-saffron-500 shadow-sm'
                      : idx < currentCard
                      ? 'bg-amber-400/60'
                      : 'bg-white/15'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Card Body Area */}
          <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
              {/* ── CARD 1: THE HUMAN QUESTION ── */}
              {currentCard === 0 && (
                <motion.div
                  key="card-1"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col justify-center space-y-6"
                >
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
                    <HelpCircle className="w-4 h-4" /> कार्ड १ · आधुनिक द्वंद्व (The Human Struggle)
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                    &ldquo;{data.meta.humanQuestionEn}&rdquo;
                  </h3>

                  <p lang="hi" className="font-devanagari text-lg sm:text-xl text-amber-100/90 leading-relaxed">
                    {data.meta.humanQuestionHi}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-3">
                    {data.meta.situationalMoments.map((m) => (
                      <span
                        key={m.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-stone-200 border border-white/10"
                      >
                        <span>{m.emoji}</span>
                        <span>{m.labelHi}</span>
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── CARD 2: THE SACRED VERSE ── */}
              {currentCard === 1 && (
                <motion.div
                  key="card-2"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col justify-center space-y-5 text-center"
                >
                  <div className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-saffron-400 uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5" /> कार्ड २ · मूल श्लोक (Canonical Sanskrit)
                  </div>

                  <div className="relative rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 sm:p-8 backdrop-blur-sm shadow-inner">
                    <p lang="sa" className="font-devanagari text-xl sm:text-2xl font-bold text-amber-100 leading-loose">
                      {data.sanskrit}
                    </p>
                    {data.transliteration && (
                      <p lang="sa-Latn" className="font-serif text-xs sm:text-sm text-stone-300/80 italic mt-3">
                        {data.transliteration}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-center pt-2">
                    <button
                      type="button"
                      onClick={playAudio}
                      disabled={isPlayingAudio}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saffron-600 hover:bg-saffron-500 text-white font-semibold text-xs transition shadow-lg cursor-pointer"
                    >
                      <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
                      <span>{isPlayingAudio ? 'उच्चारण हो रहा है...' : 'शुद्ध उच्चारण सुनें (Play Audio)'}</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── CARD 3: THE LITERARY MEANING ── */}
              {currentCard === 2 && (
                <motion.div
                  key="card-3"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col justify-center space-y-5"
                >
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
                    <BookOpen className="w-4 h-4" /> कार्ड ३ · साहित्यिक भावार्थ (Writerly Meaning)
                  </div>

                  {data.hindi && (
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-saffron-400 uppercase tracking-wider">
                        सरल हिंदी भावार्थ:
                      </p>
                      <p lang="hi" className="font-devanagari text-base sm:text-lg text-stone-100 leading-relaxed">
                        {data.hindi}
                      </p>
                    </div>
                  )}

                  {data.english && (
                    <div className="space-y-1 pt-1 border-t border-white/10">
                      <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                        English Translation:
                      </p>
                      <p className="font-serif text-sm sm:text-base text-stone-200 leading-relaxed">
                        {data.english}
                      </p>
                    </div>
                  )}

                  {data.meta.dhatuAnalysis && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-200">
                      <strong className="text-amber-300 font-devanagari">{data.meta.dhatuAnalysis.rootWord}:</strong>{' '}
                      {data.meta.dhatuAnalysis.breakdownHi || data.meta.dhatuAnalysis.breakdownEn}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── CARD 4: WHAT IT MEANS VS DOESN'T MEAN ── */}
              {currentCard === 3 && (
                <motion.div
                  key="card-4"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col justify-center space-y-4"
                >
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest">
                    <AlertCircle className="w-4 h-4" /> कार्ड ४ · भ्रम निवारण (Misreading vs Truth)
                  </div>

                  {/* Misreading Box */}
                  <div className="rounded-2xl border border-rose-500/30 bg-rose-950/30 p-4 space-y-1.5">
                    <p className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>❌</span> सामान्य भ्रम (What It Does NOT Mean)
                    </p>
                    <p lang="hi" className="font-devanagari text-sm text-stone-200 leading-relaxed">
                      {data.meta.misreadingHi}
                    </p>
                    <p className="text-xs text-stone-300/80 italic font-serif">
                      &ldquo;{data.meta.misreadingEn}&rdquo;
                    </p>
                  </div>

                  {/* Deeper Truth Box */}
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4 space-y-1.5">
                    <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>✓</span> वास्तविक दृष्टि (The Deeper Truth)
                    </p>
                    <p lang="hi" className="font-devanagari text-sm text-stone-100 leading-relaxed font-medium">
                      {data.meta.deeperTruthHi}
                    </p>
                    <p className="text-xs text-stone-300/90 font-serif">
                      {data.meta.deeperTruthEn}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ── CARD 5: TODAY'S MICRO-PRACTICE ── */}
              {currentCard === 4 && (
                <motion.div
                  key="card-5"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col justify-center space-y-6"
                >
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
                    <Lightbulb className="w-4 h-4" /> कार्ड ५ · आज का सूक्ष्म अभ्यास (Micro-Practice)
                  </div>

                  <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/15 via-saffron-500/10 to-transparent p-5 space-y-3">
                    <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      १-मिनट आत्म-चिंतन:
                    </p>
                    <p lang="hi" className="font-devanagari text-base sm:text-lg text-white font-medium leading-relaxed">
                      {data.meta.microPracticeHi}
                    </p>
                    <p className="font-serif text-xs sm:text-sm text-stone-300 leading-relaxed">
                      {data.meta.microPracticeEn}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={handleSaveToJournal}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-600 bg-stone-800 text-stone-100 hover:bg-stone-700 text-xs font-bold transition shadow"
                    >
                      {savedToJournal ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">चिंतन सहेजा गया!</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>डायरी में सहेजें (Save)</span>
                        </>
                      )}
                    </button>

                    {data.chapterHref && (
                      <a
                        href={data.chapterHref}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-500 text-white text-xs font-bold transition shadow"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>पूरा अध्याय पढ़ें</span>
                      </a>
                    )}

                    {onOpenShare && (
                      <button
                        type="button"
                        onClick={onOpenShare}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-stone-600 text-stone-200 hover:bg-white/10 text-xs font-bold transition"
                        title="पत्रिका कोट शेयर करें"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">पत्रिका</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Controls */}
          <div className="p-4 pt-2 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentCard === 0}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> पिछला
            </button>

            <span className="text-xs text-stone-400 font-mono">
              {currentCard + 1} / {TOTAL_CARDS}
            </span>

            {currentCard < TOTAL_CARDS - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition cursor-pointer"
              >
                आगे बढ़ें <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-500 text-white text-xs font-bold transition cursor-pointer"
              >
                समाप्त <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
