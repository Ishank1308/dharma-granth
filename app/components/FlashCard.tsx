'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ChevronRight, ChevronLeft, RotateCcw, Shuffle, Keyboard, BarChart3 } from 'lucide-react';
import { triggerTactileFeedback } from '@/lib/haptics';

export interface FlashCardData {
  front: {
    sanskrit?: string;
    transliteration?: string;
    question: string;
  };
  back: {
    hindi?: string;
    english: string;
    explanation?: string;
    keywords?: string[];
  };
  difficulty?: 'easy' | 'medium' | 'hard';
}

export function FlashCard({ data, onNext, onPrevious, onReset, currentIndex, total, onShuffle, spacedRepetitionMode = false }: {
  data: FlashCardData;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
  currentIndex: number;
  total: number;
  onShuffle?: () => void;
  spacedRepetitionMode?: boolean;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const rotateX = useTransform(x, [-200, 200], [15, -15]);

  const handleFlip = useCallback(() => {
    triggerTactileFeedback('medium', 'softTap');
    setIsFlipped(i => !i);
  }, []);

  const handleNext = useCallback(() => {
    triggerTactileFeedback('light', 'click');
    setIsFlipped(false);
    setShowHint(false);
    onNext();
  }, [onNext]);

  const handlePrevious = useCallback(() => {
    triggerTactileFeedback('light', 'click');
    setIsFlipped(false);
    setShowHint(false);
    onPrevious();
  }, [onPrevious]);

  const handleReset = useCallback(() => {
    triggerTactileFeedback('heavy', 'softTap');
    setIsFlipped(false);
    setShowHint(false);
    onReset();
  }, [onReset]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'r' || e.key === 'R') {
        handleReset();
      } else if (e.key === 's' || e.key === 'S') {
        onShuffle?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrevious, handleReset, onShuffle]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      handlePrevious();
    } else if (info.offset.x < -100) {
      handleNext();
    }
  };

  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2 text-sm text-dharma-muted">
          <span className="font-semibold">
            Card {currentIndex + 1} of {total}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-dharma-muted font-medium">
              {Math.round(progress)}% complete
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="tap-halo p-2 rounded-lg hover:bg-saffron-50 dark:hover:bg-saffron-950/40 transition"
                title="Reset to first card (R)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              {onShuffle && (
                <button
                  onClick={onShuffle}
                  className="tap-halo p-2 rounded-lg hover:bg-saffron-50 dark:hover:bg-saffron-950/40 transition"
                  title="Shuffle cards (S)"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="w-full h-2 bg-dharma-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-saffron-500 to-amber-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Keyboard hint */}
      <div className="flex items-center justify-center gap-4 mb-4 text-xs text-dharma-muted">
        <span className="flex items-center gap-1">
          <Keyboard className="w-3 h-3" />
          Space/Enter: Flip
        </span>
        <span className="flex items-center gap-1">
          <Keyboard className="w-3 h-3" />
          ← →: Navigate
        </span>
      </div>

      {/* Flash Card */}
      <motion.div
        ref={cardRef}
        className="relative w-full min-h-[450px] perspective-1200"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x, rotateX }}
      >
        <motion.div
          className="relative w-full h-full cursor-pointer"
          onClick={handleFlip}
          animate={reduce ? {} : { rotateY: isFlipped ? 180 : 0 }}
          transition={reduce ? {} : { duration: 0.7, type: 'spring', stiffness: 260, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
          role="button"
          tabIndex={0}
          aria-label={isFlipped ? 'Card showing answer - click to show question' : 'Card showing question - click to reveal answer'}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              handleFlip();
            }
          }}
        >
          {/* Front of card */}
          <motion.div
            className="absolute inset-0 backface-hidden bg-dharma-card rounded-3xl border border-dharma-border p-8 shadow-xl relative overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
            animate={reduce ? {} : { rotateY: isFlipped ? 180 : 0 }}
          >
            {/* Glassmorphism shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-saffron-500/5 to-transparent pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Decorative pattern */}
            <div className="absolute inset-0 mandala-bg opacity-5 pointer-events-none" />

            <div className="h-full flex flex-col justify-center items-center text-center relative z-10">
              {data.front.sanskrit && (
                <motion.p
                  lang="sa"
                  className="font-devanagari text-3xl md:text-4xl text-saffron-700 dark:text-saffron-400 mb-5 leading-relaxed font-bold"
                  initial={reduce ? {} : { scale: 0.9, opacity: 0 }}
                  animate={reduce ? {} : { scale: 1, opacity: 1 }}
                  transition={reduce ? {} : { delay: 0.1 }}
                >
                  {data.front.sanskrit}
                </motion.p>
              )}
              {data.front.transliteration && (
                <motion.p
                  className="text-base md:text-lg text-dharma-muted italic mb-6 font-medium"
                  initial={reduce ? {} : { y: 10, opacity: 0 }}
                  animate={reduce ? {} : { y: 0, opacity: 1 }}
                  transition={reduce ? {} : { delay: 0.2 }}
                >
                  {data.front.transliteration}
                </motion.p>
              )}
              <motion.p
                className="text-2xl font-serif font-bold text-dharma-text mb-5"
                initial={reduce ? {} : { y: 10, opacity: 0 }}
                animate={reduce ? {} : { y: 0, opacity: 1 }}
                transition={reduce ? {} : { delay: 0.3 }}
              >
                {data.front.question}
              </motion.p>
              <motion.div
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-dharma-bg/80 backdrop-blur-sm rounded-full border border-dharma-border shadow-sm"
                initial={reduce ? {} : { y: 10, opacity: 0 }}
                animate={reduce ? {} : { y: 0, opacity: 1 }}
                transition={reduce ? {} : { delay: 0.4 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <RotateCcw className="w-4 h-4 text-saffron-600" />
                </motion.div>
                <span className="text-sm font-semibold text-dharma-text">
                  Tap to reveal
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Back of card */}
          <motion.div
            className="absolute inset-0 backface-hidden bg-dharma-card rounded-3xl border border-dharma-border p-8 shadow-xl relative overflow-hidden"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            animate={reduce ? {} : { rotateY: isFlipped ? 0 : -180 }}
          >
            {/* Glassmorphism shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-saffron-500/5 to-transparent pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            <div className="h-full flex flex-col justify-center relative z-10 overflow-y-auto">
              {data.back.hindi && (
                <motion.p
                  lang="hi"
                  className="font-devanagari text-2xl md:text-3xl text-saffron-700 dark:text-saffron-400 mb-4 font-semibold leading-relaxed"
                  initial={reduce ? {} : { scale: 0.9, opacity: 0 }}
                  animate={reduce ? {} : { scale: 1, opacity: 1 }}
                  transition={reduce ? {} : { delay: 0.1 }}
                >
                  {data.back.hindi}
                </motion.p>
              )}
              <motion.p
                className="text-lg md:text-xl text-dharma-text mb-4 leading-relaxed font-medium"
                initial={reduce ? {} : { y: 10, opacity: 0 }}
                animate={reduce ? {} : { y: 0, opacity: 1 }}
                transition={reduce ? {} : { delay: 0.2 }}
              >
                {data.back.english}
              </motion.p>
              {data.back.explanation && (
                <motion.div
                  className="bg-dharma-bg/60 backdrop-blur-sm rounded-xl p-4 border border-dharma-border mb-4"
                  initial={reduce ? {} : { y: 10, opacity: 0 }}
                  animate={reduce ? {} : { y: 0, opacity: 1 }}
                  transition={reduce ? {} : { delay: 0.3 }}
                >
                  <p className="text-sm text-dharma-muted leading-relaxed">
                    {data.back.explanation}
                  </p>
                </motion.div>
              )}
              {data.back.keywords && data.back.keywords.length > 0 && (
                <motion.div
                  className="flex flex-wrap gap-2 mt-2"
                  initial={reduce ? {} : { y: 10, opacity: 0 }}
                  animate={reduce ? {} : { y: 0, opacity: 1 }}
                  transition={reduce ? {} : { delay: 0.4 }}
                >
                  {data.back.keywords.map((keyword, idx) => (
                    <motion.span
                      key={idx}
                      className="px-3 py-1.5 bg-saffron-500/10 text-saffron-700 dark:text-saffron-300 rounded-full text-xs font-semibold border border-saffron-500/20 shadow-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {keyword}
                    </motion.span>
                  ))}
                </motion.div>
              )}

              {/* Spaced repetition controls */}
              {spacedRepetitionMode && (
                <motion.div
                  className="mt-6 pt-5 border-t border-dharma-border"
                  initial={reduce ? {} : { y: 10, opacity: 0 }}
                  animate={reduce ? {} : { y: 0, opacity: 1 }}
                  transition={reduce ? {} : { delay: 0.5 }}
                >
                  <p className="text-xs text-dharma-muted mb-3 font-semibold uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 className="w-3 h-3" />
                    How well did you know this?
                  </p>
                  <div className="flex gap-2">
                    {(['easy', 'medium', 'hard'] as const).map((level) => (
                      <motion.button
                        key={level}
                        onClick={() => {
                          setDifficulty(level);
                          handleNext();
                        }}
                        className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold transition shadow-sm hover:shadow-md ${level === 'easy'
                          ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200 hover:from-emerald-200 hover:to-green-200'
                          : level === 'medium'
                            ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200 hover:from-amber-200 hover:to-yellow-200'
                            : 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border border-rose-200 hover:from-rose-200 hover:to-pink-200'
                          }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-6 py-3 bg-dharma-card border border-dharma-border text-dharma-text rounded-full font-semibold hover:bg-dharma-bg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === total - 1}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-saffron-600 to-amber-600 text-white rounded-full font-semibold hover:from-saffron-700 hover:to-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          aria-label="Next card"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile swipe hint */}
      <div className="text-center mt-4 text-xs text-dharma-muted md:hidden">
        Swipe left/right to navigate cards
      </div>
    </div>
  );
}
