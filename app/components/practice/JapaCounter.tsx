'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  CircleDot,
  RotateCcw,
  Minus,
  Volume2,
  VolumeX,
  Smartphone,
  Eye,
  AlertTriangle,
  X,
  Check,
} from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { ToolCard, localISODate } from './shared';
import { triggerTactileFeedback, playSoundEffect, triggerHaptic } from '@/lib/haptics';
import { playBeadTick, strikeTempleBell } from '@/lib/sacred-soundscape';

interface JapaState {
  /** Local ISO day the count belongs to. */
  date: string;
  /** Beads counted within the current mala (0..107). */
  count: number;
  /** Completed malas (108 beads) today. */
  rounds: number;
  /** All-time completed malas, across days. */
  lifetimeRounds: number;
  /** Optional mantra label, purely for the user's own reference. */
  mantra: string;
}

const INITIAL: JapaState = { date: '', count: 0, rounds: 0, lifetimeRounds: 0, mantra: '' };
const MALA = 108;

const RING_R = 112;
const BEAD_STEP = 360 / MALA;

/**
 * SVG ring of all 108 beads. Bead 0 is the Sumeru (guru) bead, then 107 Rudraksha beads. `count` beads are done;
 * the ring rotates so the bead being counted sits under the pointer at the top (after the 107th, the next tap reaches the Sumeru and completes the mala).
 */
function MalaRing({ count, reduce, celebrating }: { count: number; reduce: boolean; celebrating: boolean }) {
  const rotation = -(count + 1) * BEAD_STEP;
  return (
    <svg viewBox="0 0 260 260" className="pointer-events-none absolute inset-0 h-full w-full" role="img" aria-label={`Mala: ${count} of ${MALA} beads counted`}>
      <defs>
        <radialGradient id="rud-bead" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#b9854a" />
          <stop offset="55%" stopColor="#7a4a1c" />
          <stop offset="100%" stopColor="#3b1f08" />
        </radialGradient>
        <radialGradient id="rud-done" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="55%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#92400e" />
        </radialGradient>
        <radialGradient id="rud-now" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
        <radialGradient id="rud-sumeru" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fff7ed" />
          <stop offset="50%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#7c2d12" />
        </radialGradient>
      </defs>
      <circle cx="130" cy="130" r={RING_R} fill="none" stroke="rgba(120,53,15,0.35)" strokeWidth="1" />
      <g
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: '130px 130px',
          transition: reduce ? 'none' : 'transform 260ms cubic-bezier(0.34, 1.4, 0.64, 1)',
        }}
      >
        {Array.from({ length: MALA }).map((_, i) => {
          const ang = ((i * BEAD_STEP - 90) * Math.PI) / 180;
          // Rounded: server and browser Math.cos/sin can differ in the last digit, which breaks hydration.
          const cx = Math.round((130 + Math.cos(ang) * RING_R) * 100) / 100;
          const cy = Math.round((130 + Math.sin(ang) * RING_R) * 100) / 100;
          if (i === 0) {
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r={7.5} fill="url(#rud-sumeru)" stroke="#fed7aa" strokeWidth="0.8" />
                <path d={`M ${cx - 3} ${cy + 6} L ${cx} ${cy + 15} L ${cx + 3} ${cy + 6} Z`} fill="#ea580c" opacity="0.85" transform={`rotate(${i * BEAD_STEP} ${cx} ${cy})`} />
              </g>
            );
          }
          // Beads 1..count are done; the bead after them is the one being counted.
          const done = i <= count;
          const current = i === count + 1;
          const quarter = i % 27 === 0;
          const r = current ? 4.9 : quarter ? 4.5 : 3.7;
          return (
            <g key={i}>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={current ? 'url(#rud-now)' : done ? 'url(#rud-done)' : 'url(#rud-bead)'}
                stroke={done ? 'rgba(146,64,14,0.55)' : 'rgba(40,20,6,0.6)'}
                strokeWidth="0.5"
              />
              {current && <circle cx={cx} cy={cy} r={r + 3.2} fill="none" stroke="rgba(251,191,36,0.55)" strokeWidth="1.2" />}
            </g>
          );
        })}
      </g>
      {/* Pointer at 12 o'clock */}
      <path d="M 130 11 L 124 0 L 136 0 Z" fill="#c2410c" />
      {celebrating && <circle cx="130" cy="130" r={RING_R + 8} fill="none" stroke="rgba(251,191,36,0.7)" strokeWidth="3" />}
    </svg>
  );
}

/**
 * Japa counter with a full 108-bead Rudraksha ring (gold for counted beads, a glowing current bead, a Sumeru guru bead),
 * tactile haptics, bead clicks, screen wake-lock, and a temple bell on completing a mala.
 */
export function JapaCounter() {
  const [state, setState] = useLocalStorage<JapaState>('dharma.practice.japa', INITIAL);
  const [vibrationEnabled, setVibrationEnabled] = useLocalStorage<boolean>(
    'dharma.practice.japa.vibration',
    true,
  );
  const [soundEnabled, setSoundEnabled] = useLocalStorage<boolean>(
    'dharma.practice.japa.sound',
    true,
  );
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [wakeLockSupported, setWakeLockSupported] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [celebration, setCelebration] = useState(false);
  const reduce = useReducedMotion();

  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const today = localISODate();
  const isToday = state.date === today;
  const count = isToday ? state.count : 0;
  const rounds = isToday ? state.rounds : 0;

  // Detect and manage WakeLock API
  useEffect(() => {
    if (typeof window !== 'undefined' && 'wakeLock' in navigator) {
      setWakeLockSupported(true);
    }
  }, []);

  async function toggleWakeLock() {
    if (!wakeLockSupported) return;
    if (wakeLockActive && wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        setWakeLockActive(false);
      } catch {}
    } else {
      try {
        const sentinel = await navigator.wakeLock.request('screen');
        wakeLockRef.current = sentinel;
        setWakeLockActive(true);
        sentinel.addEventListener('release', () => {
          setWakeLockActive(false);
        });
      } catch {
        setWakeLockActive(false);
      }
    }
  }

  // Release wake lock on unmount
  useEffect(() => {
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
      }
    };
  }, []);

  function tap() {
    setState((prev) => {
      const isSameDay = prev.date === today;
      const c = isSameDay ? prev.count : 0;
      const r = isSameDay ? prev.rounds : 0;
      const isComplete = c + 1 >= MALA;

      if (isComplete) {
        // Mala Completed! Celestial Chime + Celebratory vibration pattern
        if (soundEnabled) strikeTempleBell(1);
        if (vibrationEnabled) triggerHaptic('celestial');
        setCelebration(true);
        setTimeout(() => setCelebration(false), 2400);
        return {
          ...prev,
          date: today,
          count: 0,
          rounds: r + 1,
          lifetimeRounds: prev.lifetimeRounds + 1,
        };
      }

      // Standard bead tap: physical bead click + haptic bump
      if (soundEnabled) playBeadTick();
      if (vibrationEnabled) triggerHaptic('malaBead');
      return { ...prev, date: today, count: c + 1, rounds: r };
    });
  }

  function undo() {
    if (vibrationEnabled) triggerHaptic('light');
    if (soundEnabled) playSoundEffect('softTap');
    setState((prev) => {
      const isSameDay = prev.date === today;
      const c = isSameDay ? prev.count : 0;
      const r = isSameDay ? prev.rounds : 0;
      if (c === 0 && r === 0) return prev;
      return c === 0
        ? {
            ...prev,
            date: today,
            count: MALA - 1,
            rounds: r - 1,
            lifetimeRounds: Math.max(0, prev.lifetimeRounds - 1),
          }
        : { ...prev, date: today, count: c - 1, rounds: r };
    });
  }

  function executeResetToday() {
    if (vibrationEnabled) triggerHaptic('heavy');
    if (soundEnabled) playSoundEffect('click');
    setState((prev) => {
      const isSameDay = prev.date === today;
      const r = isSameDay ? prev.rounds : 0;
      return {
        ...prev,
        date: today,
        count: 0,
        rounds: 0,
        lifetimeRounds: Math.max(0, prev.lifetimeRounds - r),
      };
    });
    setConfirmResetOpen(false);
  }

  const pct = Math.round((count / MALA) * 100);

  return (
    <ToolCard
      icon={<CircleDot className="w-5 h-5 text-saffron-600" />}
      title="108-Bead Rudraksha Mala"
      titleHindi="जप साधना"
      accent="saffron"
    >
      <div className="flex flex-col items-center gap-5">
        {/* Settings Bar: Vibration, Sound, Screen Wake */}
        <div className="flex items-center justify-between w-full px-2 py-1 bg-dharma-panel-muted rounded-xl border border-dharma-border/60 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                soundEnabled
                  ? 'bg-saffron-100 dark:bg-saffron-950/40 text-saffron-800 dark:text-saffron-300'
                  : 'text-dharma-muted hover:text-dharma-text'
              }`}
              title={soundEnabled ? 'ध्वनि चालू · Sound on' : 'ध्वनि बंद · Sound muted'}
              aria-label={soundEnabled ? 'Disable sound' : 'Enable sound'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? 'ध्वनि' : 'मूक'}</span>
            </button>

            <button
              type="button"
              onClick={() => setVibrationEnabled(!vibrationEnabled)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                vibrationEnabled
                  ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                  : 'text-dharma-muted hover:text-dharma-text'
              }`}
              title={vibrationEnabled ? 'कंपन चालू · Vibration on' : 'कंपन बंद · Vibration off'}
              aria-label={vibrationEnabled ? 'Disable vibration' : 'Enable vibration'}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{vibrationEnabled ? 'कंपन' : 'स्थिर'}</span>
            </button>
          </div>

          {wakeLockSupported && (
            <button
              type="button"
              onClick={toggleWakeLock}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
                wakeLockActive
                  ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40'
                  : 'text-dharma-muted hover:text-dharma-text'
              }`}
              title="स्क्रीन चालू रखें · Keep screen awake"
              aria-label="Keep screen awake during japa"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{wakeLockActive ? 'स्क्रीन जाग्रत' : 'स्क्रीन सामान्य'}</span>
            </button>
          )}
        </div>

        {/* Mantra Label input */}
        <input
          type="text"
          value={state.mantra}
          onChange={(e) => setState({ ...state, mantra: e.target.value })}
          placeholder="मंत्र (optional) — e.g. ॐ नमः शिवाय"
          className="w-full text-center font-devanagari text-base bg-transparent border-b border-dharma-border focus:border-saffron-500 outline-none py-1.5 text-dharma-text placeholder:text-dharma-muted transition"
          aria-label="Mantra label"
        />

        {/* 108-bead Rudraksha mala. The ring slides so the bead being counted stays at the top. */}
        <div className="relative flex h-64 w-64 select-none items-center justify-center">
          <MalaRing count={count} reduce={Boolean(reduce)} celebrating={celebration} />

          {/* Central 3D Tactile Tap Button */}
          <motion.button
            type="button"
            onClick={tap}
            whileHover={reduce ? undefined : { scale: 1.04 }}
            whileTap={reduce ? undefined : { scale: 0.92, y: 3 }}
            className="relative z-10 w-32 h-32 rounded-full text-white flex flex-col items-center justify-center select-none shadow-[0_12px_32px_rgba(194,65,12,0.45)] transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-saffron-500/30"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #ea580c 0%, #c2410c 45%, #7c2d12 100%)',
              boxShadow: `
                inset 0 2px 4px rgba(255, 255, 255, 0.4),
                inset 0 -4px 6px rgba(0, 0, 0, 0.4),
                0 16px 36px -8px rgba(124, 45, 18, 0.5)
              `,
            }}
            aria-label="Tap to count prayer bead"
          >
            {/* Shimmer ring */}
            <div className="absolute inset-1 rounded-full border border-amber-300/30 pointer-events-none" />

            <AnimatePresence mode="popLayout">
              <motion.span
                key={count}
                initial={{ opacity: 0, scale: 0.8, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.2, y: 4 }}
                transition={{ duration: 0.12 }}
                className="text-4xl font-extrabold tabular-nums tracking-tight drop-shadow-md"
              >
                {count}
              </motion.span>
            </AnimatePresence>
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-200/90 mt-0.5">
              of {MALA}
            </span>

            {/* Completion Golden Halo Burst */}
            {celebration && (
              <motion.div
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border-4 border-amber-400 bg-amber-400/20 pointer-events-none"
              />
            )}
          </motion.button>
        </div>

        {/* Progress bar with percentage */}
        <div className="w-full space-y-1.5">
          <div className="flex justify-between text-xs text-dharma-muted">
            <span>प्रगति: {pct}%</span>
            <span>{MALA - count} शेष · remaining</span>
          </div>
          <div className="w-full h-2 rounded-full bg-dharma-border overflow-hidden p-0.5" aria-hidden>
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-saffron-500 via-amber-400 to-amber-600 shadow-sm"
              style={{ width: `${pct}%` }}
              animate={{ width: `${pct}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          </div>
        </div>

        {/* Stats Summary */}
        <div className="flex items-center justify-between w-full text-xs text-dharma-muted px-3 py-2 bg-dharma-panel-muted rounded-xl border border-dharma-border/60">
          <span>
            आज: <strong className="text-dharma-text font-bold">{rounds}</strong> माला (
            {rounds * MALA + count} जप)
          </span>
          <span>
            कुल: <strong className="text-dharma-text font-bold">{state.lifetimeRounds}</strong> माला
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={undo}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-dharma-border text-dharma-muted hover:text-saffron-700 hover:border-saffron-300 transition active:scale-95"
          >
            <Minus className="w-3.5 h-3.5" /> Undo
          </button>
          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-dharma-border text-dharma-muted hover:text-rose-700 hover:border-rose-300 transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset today
          </button>
        </div>

        {/* Reset Confirmation Dialog */}
        <AnimatePresence>
          {confirmResetOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="w-full rounded-xl border border-rose-300 dark:border-rose-900/50 bg-rose-50/90 dark:bg-rose-950/30 p-3.5 text-center space-y-2.5"
            >
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>आज का जप रीसेट करें? · Reset today?</span>
              </div>
              <p className="text-xs text-rose-700/80 dark:text-rose-300/80">
                आज के {rounds} माला और {count} जप शून्य हो जाएंगे।
              </p>
              <div className="flex justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmResetOpen(false)}
                  className="px-3 py-1 rounded-lg border border-dharma-border bg-white dark:bg-stone-900 text-xs font-medium text-dharma-text hover:bg-stone-50"
                >
                  रद्द करें · Cancel
                </button>
                <button
                  type="button"
                  onClick={executeResetToday}
                  className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition"
                >
                  हाँ, रीसेट करें · Confirm
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToolCard>
  );
}
