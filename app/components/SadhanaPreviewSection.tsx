'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Lock,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { triggerTactileFeedback } from '@/lib/haptics';

export function SadhanaPreviewSection() {
  // 1. Mini Japa State
  const [japaCount, setJapaCount] = useState(27);
  const JAPA_TARGET = 108;

  function handleJapaIncrement() {
    triggerTactileFeedback('malaBead', 'softTap');
    setJapaCount((prev) => (prev >= JAPA_TARGET ? 1 : prev + 1));
  }

  function handleJapaReset() {
    triggerTactileFeedback('light', 'click');
    setJapaCount(0);
  }

  // 2. Mini Meditation Timer State
  const [meditationMinutes, setMeditationMinutes] = useState(10);
  const [secondsRemaining, setSecondsRemaining] = useState(600);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            triggerTactileFeedback('celestial', 'omBowl');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, secondsRemaining]);

  function handleToggleTimer() {
    triggerTactileFeedback('medium', timerRunning ? 'softTap' : 'click');
    if (secondsRemaining === 0) {
      setSecondsRemaining(meditationMinutes * 60);
      setTimerRunning(true);
      return;
    }
    setTimerRunning(!timerRunning);
  }

  function handleSetPreset(mins: number) {
    triggerTactileFeedback('light', 'softTap');
    setTimerRunning(false);
    setMeditationMinutes(mins);
    setSecondsRemaining(mins * 60);
  }

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section
      aria-labelledby="sadhana-preview-heading"
      className="border-b border-dharma-border bg-gradient-to-b from-dharma-bg via-dharma-card/40 to-dharma-bg py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="size-2 rounded-full bg-saffron-600 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-saffron-700 dark:text-saffron-400">
                साधना · Daily Practice
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                <Lock className="h-3 w-3" />
                Local-first (No accounts)
              </span>
            </div>
            <h2
              id="sadhana-preview-heading"
              className="font-serif text-3xl font-bold text-dharma-text sm:text-4xl"
            >
              Quiet Sādhanā Preview
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-dharma-muted sm:text-base">
              Integrate contemplative practice into your daily rhythm — an intentional verse, steady reading, mindful japa, and quiet meditation.
            </p>
          </div>

          <Link
            href="/practice"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-dharma-border bg-dharma-card px-5 py-2.5 text-xs font-bold text-dharma-text transition hover:border-saffron-300 hover:text-saffron-700 shadow-sm"
          >
            <span>Open Practice Dashboard</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Today's Verse / Daily Chant */}
          <div className="flex flex-col justify-between rounded-2xl border border-dharma-border bg-dharma-card p-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-saffron-700 dark:text-saffron-400">
                  <Sparkles className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  दैनिक श्लोक
                </span>
              </div>
              <h3 className="font-serif text-base font-bold text-dharma-text">
                Today’s Verse
              </h3>
              <p lang="sa" className="mt-2 font-devanagari text-sm text-saffron-800 dark:text-saffron-300 line-clamp-2">
                कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।
              </p>
              <p className="mt-1 text-xs text-dharma-muted italic line-clamp-2">
                &ldquo;You have a right only to work, never to the fruits thereof.&rdquo;
              </p>
            </div>

            <div className="mt-5 border-t border-dharma-border/60 pt-3">
              <Link
                href="/scripture/bhagavadgita/chapter/2#verse-47"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-700 dark:text-saffron-400 hover:underline"
              >
                <span>Read Shloka 2.47</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Card 2: Reading Plan Preview */}
          <div className="flex flex-col justify-between rounded-2xl border border-dharma-border bg-dharma-card p-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-saffron-700 dark:text-saffron-400">
                  <BookOpen className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  पठन योजना
                </span>
              </div>
              <h3 className="font-serif text-base font-bold text-dharma-text">
                Reading Plan
              </h3>
              <p className="mt-1 text-xs font-semibold text-dharma-text">
                Bhagavad Gita 30-Day Path
              </p>
              <div className="mt-3">
                <div className="flex justify-between text-[11px] font-medium text-dharma-muted mb-1">
                  <span>Day 12 of 30</span>
                  <span>40%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-amber-500/15">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-saffron-500 to-amber-500"
                    style={{ width: '40%' }}
                  />
                </div>
              </div>
              <p className="mt-2 text-[11px] text-dharma-muted">
                Today: Chapter 6 (Dhyana Yoga)
              </p>
            </div>

            <div className="mt-5 border-t border-dharma-border/60 pt-3">
              <Link
                href="/practice"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-700 dark:text-saffron-400 hover:underline"
              >
                <span>Continue Plan</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Card 3: Interactive Japa Counter */}
          <div className="flex flex-col justify-between rounded-2xl border border-amber-300/80 bg-dharma-card p-5 shadow-sm dark:border-amber-900/60">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-saffron-700 dark:text-saffron-400">
                  <Sparkles className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  जप माला · Mala
                </span>
              </div>
              <h3 className="font-serif text-base font-bold text-dharma-text">
                Japa Counter
              </h3>

              <div className="my-3 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleJapaIncrement}
                  aria-label="Increment Japa bead"
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-saffron-600 to-amber-600 text-white font-serif text-lg font-bold shadow-md hover:from-saffron-700 hover:to-amber-700 transition active:scale-95 cursor-pointer"
                >
                  {japaCount}
                </button>
                <div className="text-left">
                  <p className="text-xs font-bold text-dharma-text">
                    / {JAPA_TARGET} beads
                  </p>
                  <p className="text-[10px] text-dharma-muted">
                    Tap circle to count
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-dharma-border/60 pt-3">
              <button
                type="button"
                onClick={handleJapaReset}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-dharma-muted hover:text-dharma-text"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
              <Link
                href="/practice"
                className="text-xs font-bold text-saffron-700 dark:text-saffron-400 hover:underline"
              >
                Full Mala →
              </Link>
            </div>
          </div>

          {/* Card 4: Meditation Timer */}
          <div className="flex flex-col justify-between rounded-2xl border border-dharma-border bg-dharma-card p-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-saffron-700 dark:text-saffron-400">
                  <Clock className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  ध्यान · Timer
                </span>
              </div>
              <h3 className="font-serif text-base font-bold text-dharma-text">
                Meditation
              </h3>

              <div className="my-2 text-center">
                <p className="font-mono text-2xl font-bold tracking-wider text-dharma-text">
                  {formatTimer(secondsRemaining)}
                </p>
                <div className="mt-2 flex justify-center gap-1.5">
                  {[5, 10, 15].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleSetPreset(m)}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition ${
                        meditationMinutes === m
                          ? 'bg-saffron-600 text-white'
                          : 'bg-dharma-bg text-dharma-muted hover:text-dharma-text'
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-dharma-border/60 pt-3">
              <button
                type="button"
                onClick={handleToggleTimer}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition shadow-sm ${
                  timerRunning
                    ? 'bg-amber-600 text-white'
                    : 'bg-gradient-to-r from-saffron-600 to-amber-600 text-white'
                }`}
              >
                {timerRunning ? (
                  <>
                    <Pause className="h-3 w-3" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3" />
                    <span>Start</span>
                  </>
                )}
              </button>
              <Link
                href="/practice"
                className="text-xs font-bold text-saffron-700 dark:text-saffron-400 hover:underline"
              >
                Full Timer →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
