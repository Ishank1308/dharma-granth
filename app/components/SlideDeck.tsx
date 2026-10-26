'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Volume2, Clock, FileText, Play, Pause } from 'lucide-react';

export interface SlideData {
  id: string;
  sanskrit?: string;
  transliteration?: string;
  hindi?: string;
  english: string;
  explanation?: string;
  keywords?: string[];
  science?: string;
  presenterNotes?: string;
}

interface SlideDeckProps {
  slides: SlideData[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function SlideDeck({ slides, className = '', autoPlay = false, autoPlayInterval = 5000 }: SlideDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [elapsed, setElapsed] = useState(0);
  const reduce = useReducedMotion();

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const previousSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(i => !i);
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsPlaying(i => !i);
  }, []);

  // Timer for auto-play
  useEffect(() => {
    if (!isPlaying) {
      setElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= autoPlayInterval) {
          nextSlide();
          return 0;
        }
        return prev + 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, autoPlayInterval, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        toggleAutoPlay();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setShowNotes(!showNotes);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, previousSlide, toggleFullscreen, toggleAutoPlay, showNotes]);

  const currentSlide = slides[currentIndex];
  const progress = (elapsed / autoPlayInterval) * 100;

  return (
    <div className={`slide-deck ${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-dharma-bg' : ''}`}>
      <div className="relative w-full">
        {/* Timer bar */}
        {isPlaying && (
          <div className="w-full h-1 bg-dharma-border rounded-full mb-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-saffron-500 to-amber-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        )}

        {/* Main slide area */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-saffron-500/10 via-saffron-500/5 to-amber-500/10 border-2 border-saffron-200 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={reduce ? {} : { opacity: 0, x: 50 }}
              animate={reduce ? {} : { opacity: 1, x: 0 }}
              exit={reduce ? {} : { opacity: 0, x: -50 }}
              transition={reduce ? {} : { duration: 0.5, ease: 'easeInOut' }}
              className="p-8 md:p-12"
            >
              {/* Slide content */}
              <div className="max-w-4xl mx-auto">
                {/* Sanskrit verse */}
                {currentSlide.sanskrit && (
                  <motion.div
                    initial={reduce ? {} : { opacity: 0, y: 20 }}
                    animate={reduce ? {} : { opacity: 1, y: 0 }}
                    transition={reduce ? {} : { delay: 0.2 }}
                    className="text-center mb-8"
                  >
                    <p
                      lang="sa"
                      className="font-devanagari text-4xl md:text-5xl text-saffron-800 leading-relaxed"
                    >
                      {currentSlide.sanskrit}
                    </p>
                    {currentSlide.transliteration && (
                      <p className="text-lg text-saffron-600 italic mt-4">
                        {currentSlide.transliteration}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Hindi meaning */}
                {currentSlide.hindi && (
                  <motion.div
                    initial={reduce ? {} : { opacity: 0, y: 20 }}
                    animate={reduce ? {} : { opacity: 1, y: 0 }}
                    transition={reduce ? {} : { delay: 0.3 }}
                    className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 rounded-2xl p-6 mb-6 border border-rose-200"
                  >
                    <p
                      lang="hi"
                      className="font-devanagari text-2xl text-rose-800 font-semibold text-center leading-relaxed"
                    >
                      {currentSlide.hindi}
                    </p>
                  </motion.div>
                )}

                {/* English translation */}
                <motion.div
                  initial={reduce ? {} : { opacity: 0, y: 20 }}
                  animate={reduce ? {} : { opacity: 1, y: 0 }}
                  transition={reduce ? {} : { delay: 0.4 }}
                  className="bg-dharma-card rounded-2xl p-6 mb-6 border border-dharma-border shadow-lg"
                >
                  <p className="text-xl text-dharma-text text-center leading-relaxed">
                    {currentSlide.english}
                  </p>
                </motion.div>

                {/* Explanation */}
                {currentSlide.explanation && (
                  <motion.div
                    initial={reduce ? {} : { opacity: 0, y: 20 }}
                    animate={reduce ? {} : { opacity: 1, y: 0 }}
                    transition={reduce ? {} : { delay: 0.5 }}
                    className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl p-6 mb-6 border border-emerald-200"
                  >
                    <p className="text-dharma-muted text-center leading-relaxed">
                      {currentSlide.explanation}
                    </p>
                  </motion.div>
                )}

                {/* Science connection */}
                {currentSlide.science && (
                  <motion.div
                    initial={reduce ? {} : { opacity: 0, y: 20 }}
                    animate={reduce ? {} : { opacity: 1, y: 0 }}
                    transition={reduce ? {} : { delay: 0.6 }}
                    className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-2xl p-6 mb-6 border border-indigo-200"
                  >
                    <p className="text-dharma-muted text-center leading-relaxed">
                      <span className="font-bold text-indigo-700">Science: </span>
                      {currentSlide.science}
                    </p>
                  </motion.div>
                )}

                {/* Keywords */}
                {currentSlide.keywords && currentSlide.keywords.length > 0 && (
                  <motion.div
                    initial={reduce ? {} : { opacity: 0, y: 20 }}
                    animate={reduce ? {} : { opacity: 1, y: 0 }}
                    transition={reduce ? {} : { delay: 0.7 }}
                    className="flex flex-wrap justify-center gap-2"
                  >
                    {currentSlide.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-saffron-500/10 text-saffron-800 rounded-full text-sm font-semibold border border-saffron-200"
                      >
                        {keyword}
                      </span>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Presenter Notes Panel */}
        <AnimatePresence>
          {showNotes && currentSlide.presenterNotes && (
            <motion.div
              initial={reduce ? {} : { opacity: 0, height: 0 }}
              animate={reduce ? {} : { opacity: 1, height: 'auto' }}
              exit={reduce ? {} : { opacity: 0, height: 0 }}
              transition={reduce ? {} : { duration: 0.3 }}
              className="mt-4 bg-gradient-to-r from-slate-500/10 to-gray-500/10 rounded-2xl p-6 border border-slate-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-slate-600" />
                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Presenter Notes</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {currentSlide.presenterNotes}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation controls */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={previousSlide}
              className="flex items-center gap-2 px-6 py-3 bg-dharma-card border border-dharma-border rounded-full font-semibold hover:bg-saffron-500/10 transition shadow-sm hover:shadow-md"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={toggleAutoPlay}
              className={`flex items-center gap-2 px-4 py-3 rounded-full font-semibold transition shadow-sm hover:shadow-md ${
                isPlaying
                  ? 'bg-gradient-to-r from-saffron-600 to-amber-600 text-white'
                  : 'bg-dharma-card border border-dharma-border hover:bg-saffron-500/10'
              }`}
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? `${Math.round((autoPlayInterval - elapsed) / 1000)}s` : 'Auto'}
            </button>
            {currentSlide.presenterNotes && (
              <button
                onClick={() => setShowNotes(!showNotes)}
                className={`flex items-center gap-2 px-4 py-3 rounded-full font-semibold transition shadow-sm hover:shadow-md ${
                  showNotes
                    ? 'bg-gradient-to-r from-saffron-600 to-amber-600 text-white'
                    : 'bg-dharma-card border border-dharma-border hover:bg-saffron-500/10'
                }`}
                aria-label="Toggle presenter notes"
              >
                <FileText className="w-4 h-4" />
                Notes
              </button>
            )}
          </div>

          {/* Slide indicators */}
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`tap-exempt w-3 h-3 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-saffron-600 w-8'
                    : 'bg-dharma-border hover:bg-saffron-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-3 bg-dharma-card border border-dharma-border rounded-full hover:bg-saffron-500/10 transition shadow-sm hover:shadow-md"
              title={isFullscreen ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)'}
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={nextSlide}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-saffron-600 to-amber-600 text-white rounded-full font-semibold hover:from-saffron-700 hover:to-amber-700 transition shadow-md hover:shadow-lg"
              aria-label="Next slide"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide counter */}
        <div className="text-center mt-4 text-sm text-dharma-muted">
          Slide {currentIndex + 1} of {slides.length}
        </div>

        {/* Keyboard hints */}
        <div className="text-center mt-2 text-xs text-dharma-muted">
          <span className="hidden md:inline">Keyboard: ← → navigate | F fullscreen | P auto-play | N notes</span>
        </div>
      </div>
    </div>
  );
}
