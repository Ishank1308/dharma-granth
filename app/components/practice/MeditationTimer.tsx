'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sliders,
  Wind,
  CheckCircle2,
  Sparkles,
  StopCircle,
} from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { ToolCard, localISODate } from './shared';
import { playSoundEffect, triggerHaptic } from '@/lib/haptics';

interface MeditationStats {
  /** Completed sessions, all time. */
  sessions: number;
  /** Total completed minutes, all time. */
  minutes: number;
  /** Log of completed sessions by date. */
  history?: Record<string, number>;
}

const PRESETS = [5, 10, 15, 20, 30];

const CONTEMPLATION_QUOTES = [
  { sa: 'शान्तं शिवमद्वैतम्', en: 'Peaceful, auspicious, and non-dual is the Self.', src: 'Mandukya Upanishad' },
  { sa: 'प्रशान्तमनसं ह्येनं योगिनं सुखमुत्तमम्', en: 'Supreme joy comes to the yogi whose mind is peaceful.', src: 'Bhagavad Gita 6.27' },
  { sa: 'यदा पञ्चावतिष्ठन्ते ज्ञानानि मनसा सह', en: 'When the five senses are quieted together with the mind, that is the highest state.', src: 'Katha Upanishad 2.3.10' },
  { sa: 'चित्तवृत्तिनिरोधः', en: 'Yoga is the settling of the mind into silence.', src: 'Yoga Sutras 1.2' },
];

/**
 * Peaceful countdown meditation timer with gentle beginning & ending sounds,
 * custom duration, breath guiding visualization, and session summary.
 */
export function MeditationTimer() {
  const [stats, setStats] = useLocalStorage<MeditationStats>('dharma.practice.meditation', {
    sessions: 0,
    minutes: 0,
  });
  const [soundEnabled, setSoundEnabled] = useLocalStorage<boolean>(
    'dharma.practice.meditation.sound',
    true,
  );
  const [reducedMotionManual, setReducedMotionManual] = useLocalStorage<boolean>(
    'dharma.practice.meditation.reduced_motion',
    false,
  );

  const [minutes, setMinutes] = useState(10);
  const [customMinutes, setCustomMinutes] = useState('12');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(10 * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [summaryQuote, setSummaryQuote] = useState(CONTEMPLATION_QUOTES[0]);

  const systemReduced = useReducedMotion();
  const isReducedMotion = systemReduced || reducedMotionManual;

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef<number | null>(null);

  // Tick while running; calculate delta timestamp so background tabs never drift.
  useEffect(() => {
    if (!running) {
      endTimeRef.current = null;
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    if (!endTimeRef.current) {
      endTimeRef.current = Date.now() + secondsLeft * 1000;
    }

    const checkTime = () => {
      if (!endTimeRef.current) return;
      const now = Date.now();
      const remaining = Math.max(0, Math.round((endTimeRef.current - now) / 1000));
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        setRunning(false);
        setDone(true);
        endTimeRef.current = null;
        const today = localISODate();
        if (soundEnabled) playSoundEffect('templeChime');
        triggerHaptic('success');
        setSummaryQuote(CONTEMPLATION_QUOTES[Math.floor(Math.random() * CONTEMPLATION_QUOTES.length)]);

        setStats((prev) => {
          const hist = { ...(prev.history ?? {}) };
          hist[today] = (hist[today] ?? 0) + minutes;
          return {
            sessions: prev.sessions + 1,
            minutes: prev.minutes + minutes,
            history: hist,
          };
        });
      }
    };

    intervalRef.current = setInterval(checkTime, 500);

    const handleVisibility = () => {
      if (!document.hidden && running) {
        checkTime();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [running, minutes, soundEnabled, setStats]);

  function pick(m: number) {
    setMinutes(m);
    setSecondsLeft(m * 60);
    endTimeRef.current = null;
    setRunning(false);
    setDone(false);
    setShowCustomInput(false);
  }

  function applyCustom() {
    const val = parseInt(customMinutes, 10);
    if (!isNaN(val) && val > 0 && val <= 180) {
      pick(val);
    }
  }

  function handleStart() {
    if (soundEnabled) playSoundEffect('omBowl');
    triggerHaptic('medium');
    endTimeRef.current = Date.now() + secondsLeft * 1000;
    setRunning(true);
  }

  function handlePause() {
    triggerHaptic('light');
    if (endTimeRef.current) {
      const rem = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
      setSecondsLeft(rem);
    }
    endTimeRef.current = null;
    setRunning(false);
  }

  function reset() {
    setSecondsLeft(minutes * 60);
    endTimeRef.current = null;
    setRunning(false);
    setDone(false);
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const pct = 100 - Math.round((secondsLeft / (minutes * 60)) * 100);

  return (
    <ToolCard
      icon={<Timer className="w-5 h-5 text-indigo-600" />}
      title="Meditation Timer"
      titleHindi="ध्यान साधना"
      accent="indigo"
    >
      <div className="flex flex-col items-center gap-4 h-full">
        {/* Controls Bar: Sound toggle, Custom duration, Motion */}
        <div className="flex items-center justify-between w-full px-2 py-1 bg-dharma-panel-muted rounded-xl border border-dharma-border/60 text-xs">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
              soundEnabled
                ? 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300'
                : 'text-dharma-muted hover:text-dharma-text'
            }`}
            title={soundEnabled ? 'घंटी ध्वनि चालू · Bell chime on' : 'मूक ध्यान · Silent mode'}
            aria-label={soundEnabled ? 'Disable sound' : 'Enable sound'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? 'घंटी चालू' : 'मूक ध्यान'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowCustomInput(!showCustomInput)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                showCustomInput
                  ? 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300'
                  : 'text-dharma-muted hover:text-dharma-text'
              }`}
              title="कस्टम समय सेट करें · Custom duration"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>कस्टम</span>
            </button>

            <button
              type="button"
              onClick={() => setReducedMotionManual(!reducedMotionManual)}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg font-medium transition ${
                isReducedMotion
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  : 'text-dharma-muted hover:text-dharma-text'
              }`}
              title="गति कम करें · Reduced motion"
            >
              <Wind className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isReducedMotion ? 'शांत' : 'गति'}</span>
            </button>
          </div>
        </div>

        {/* Custom duration input box */}
        <AnimatePresence>
          {showCustomInput && !running && !done && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full flex items-center justify-center gap-2 p-2 bg-indigo-50/60 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-900/40 text-xs"
            >
              <span className="text-dharma-muted">अवधि (मिनट):</span>
              <input
                type="number"
                min="1"
                max="180"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                className="w-16 px-2 py-1 rounded border border-dharma-border bg-white dark:bg-stone-900 text-center font-bold text-dharma-text text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                aria-label="Custom minutes"
              />
              <button
                type="button"
                onClick={applyCustom}
                className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                लागू करें · Set
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Presets */}
        {!running && !done && (
          <div className="flex flex-wrap justify-center gap-2">
            {PRESETS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => pick(m)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                  m === minutes && !showCustomInput
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'border-dharma-border text-dharma-muted hover:border-indigo-300 hover:text-indigo-700'
                }`}
              >
                {m} min
              </button>
            ))}
          </div>
        )}

        {/* Timer Display or Session Summary */}
        {done ? (
          /* Session Summary Card */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full py-5 px-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 text-center space-y-3"
          >
            <div className="flex items-center justify-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>सत्र पूर्ण · Session Complete</span>
            </div>

            <div className="py-1">
              <span lang="sa" className="font-devanagari text-2xl font-bold text-dharma-text block">
                {summaryQuote.sa}
              </span>
              <p className="text-xs text-dharma-muted mt-1 italic">
                “{summaryQuote.en}” — {summaryQuote.src}
              </p>
            </div>

            <div className="text-xs text-dharma-muted bg-white/70 dark:bg-stone-900/50 py-1.5 px-3 rounded-xl border border-indigo-100 dark:border-indigo-900/20 inline-block">
              आज ध्यान: <strong className="text-dharma-text font-bold">{minutes} मिनट</strong> · कुल सत्र: {stats.sessions}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> पुनः ध्यान करें · Meditate Again
              </button>
            </div>
          </motion.div>
        ) : (
          /* Active Countdown Display */
          <div className="relative flex flex-col items-center justify-center py-4 select-none">
            {/* Gentle breath pulse glow during meditation */}
            {running && !isReducedMotion && (
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.15, 0.35, 0.15],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute w-44 h-44 rounded-full bg-indigo-400/20 pointer-events-none blur-xl"
              />
            )}

            <span className="text-5xl md:text-6xl font-bold tabular-nums text-dharma-text tracking-tight relative z-10">
              {mm}:{ss}
            </span>

            {running && (
              <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 mt-2 tracking-wide flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                सांस पर ध्यान केंद्रित रखें · Gentle awareness
              </span>
            )}
          </div>
        )}

        {/* Progress bar */}
        {!done && (
          <div className="w-full h-1.5 rounded-full bg-dharma-border overflow-hidden" aria-hidden>
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-500 transition-[width] duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}

        {/* Actions: Start, Pause, Reset */}
        {!done && (
          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={running ? handlePause : handleStart}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-sm font-bold bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow hover:shadow-md transition active:scale-95"
            >
              {running ? (
                <>
                  <Pause className="w-4 h-4" /> विराम · Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> प्रारंभ · Start
                </>
              )}
            </button>

            {secondsLeft !== minutes * 60 && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold border border-dharma-border text-dharma-muted hover:text-indigo-700 hover:border-indigo-300 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> रीसेट · Reset
              </button>
            )}
          </div>
        )}

        {/* Stats summary footer */}
        <div className="mt-auto w-full pt-2 flex items-center justify-between text-xs text-dharma-muted border-t border-dharma-border/60">
          <span>कुल सत्र: <strong className="text-dharma-text">{stats.sessions}</strong></span>
          <span>कुल समय: <strong className="text-dharma-text">{stats.minutes} मिनट</strong></span>
        </div>
      </div>
    </ToolCard>
  );
}
