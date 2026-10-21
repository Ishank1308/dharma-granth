'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Wind, Play, Pause, RotateCcw, Smartphone, AlertTriangle } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { triggerHaptic } from '@/lib/haptics';
import { ToolCard, localISODate } from './shared';

type PhaseKey = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

interface Pattern {
  id: string;
  name: string;
  nameHi: string;
  note: string;
  /** Seconds for inhale, hold after inhale, exhale, hold after exhale. */
  secs: [number, number, number, number];
}

// Gentle, widely taught ratios. Retention stays short; nothing here asks for forced or prolonged holds.
const PATTERNS: Pattern[] = [
  { id: 'sama', name: 'Sama Vṛtti 4·4·4·4', nameHi: 'सम वृत्ति', note: 'Equal count in, hold, out, hold. A calm starting point.', secs: [4, 4, 4, 4] },
  { id: 'dirgha', name: 'Dīrgha 4·0·6·0', nameHi: 'दीर्घ श्वास', note: 'A longer exhale, with no holding. Settling and easy.', secs: [4, 0, 6, 0] },
  { id: 'soft', name: 'Soft hold 4·2·6·0', nameHi: 'मृदु विराम', note: 'A short pause after the inhale. Stop at any sign of strain.', secs: [4, 2, 6, 0] },
  { id: 'even', name: 'Even breath 5·0·5·0', nameHi: 'सम श्वास', note: 'Five in, five out: about six breaths a minute.', secs: [5, 0, 5, 0] },
];

const PHASES: Record<PhaseKey, { en: string; hi: string }> = {
  inhale: { en: 'Breathe in', hi: 'श्वास लें' },
  holdIn: { en: 'Hold gently', hi: 'हल्का विराम' },
  exhale: { en: 'Breathe out', hi: 'श्वास छोड़ें' },
  holdOut: { en: 'Rest', hi: 'विश्राम' },
};
const ORDER: PhaseKey[] = ['inhale', 'holdIn', 'exhale', 'holdOut'];

interface PranayamaState {
  patternId: string;
  /** Local ISO day the cycle count belongs to. */
  date: string;
  cyclesToday: number;
  lifetimeCycles: number;
}
const INITIAL: PranayamaState = { patternId: 'dirgha', date: '', cyclesToday: 0, lifetimeCycles: 0 };

/** Position within a cycle from elapsed ms. Skips zero-length phases. */
function locate(elapsedMs: number, secs: Pattern['secs']) {
  const total = secs.reduce((a, b) => a + b, 0) * 1000;
  const inCycle = elapsedMs % total;
  const cycles = Math.floor(elapsedMs / total);
  let acc = 0;
  for (let i = 0; i < 4; i++) {
    const len = secs[i] * 1000;
    if (len === 0) continue;
    if (inCycle < acc + len) return { phase: ORDER[i], phaseIndex: i, progress: (inCycle - acc) / len, remaining: Math.ceil((acc + len - inCycle) / 1000), cycles };
    acc += len;
  }
  return { phase: ORDER[0], phaseIndex: 0, progress: 0, remaining: secs[0], cycles };
}

/**
 * Pranayama breath pacer: a circle that swells on the inhale and settles on the exhale.
 * Timing comes from `Date.now()` deltas, so a hidden tab or a locked screen never makes it drift.
 * Retention is optional and short by design; this is a pacing aid, not medical or yoga instruction.
 */
export function PranayamaPacer() {
  const [state, setState] = useLocalStorage<PranayamaState>('dharma.practice.pranayama', INITIAL);
  const [vibrate, setVibrate] = useLocalStorage<boolean>('dharma.practice.pranayama.vibration', false);
  const reduce = useReducedMotion();

  const pattern = PATTERNS.find((p) => p.id === state.patternId) ?? PATTERNS[1];
  const [running, setRunning] = useState(false);
  const [view, setView] = useState({ phase: 'inhale' as PhaseKey, progress: 0, remaining: pattern.secs[0], cycles: 0 });

  const startRef = useRef(0);
  const countedRef = useRef(0);
  const lastPhaseRef = useRef<number>(-1);
  const rafRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    setRunning(false);
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now();
    countedRef.current = 0;
    lastPhaseRef.current = -1;
    const today = localISODate();
    const tick = () => {
      const at = locate(Date.now() - startRef.current, pattern.secs);
      setView({ phase: at.phase, progress: at.progress, remaining: at.remaining, cycles: at.cycles });
      if (at.phaseIndex !== lastPhaseRef.current) {
        lastPhaseRef.current = at.phaseIndex;
        if (vibrate) triggerHaptic('selection');
      }
      if (at.cycles > countedRef.current) {
        const gained = at.cycles - countedRef.current;
        countedRef.current = at.cycles;
        setState((prev) => ({
          ...prev,
          date: today,
          cyclesToday: (prev.date === today ? prev.cyclesToday : 0) + gained,
          lifetimeCycles: prev.lifetimeCycles + gained,
        }));
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // The pattern and vibration choice are fixed for a running session; changing them stops it (see choose()).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  function choose(id: string) {
    stop();
    setView({ phase: 'inhale', progress: 0, remaining: (PATTERNS.find((p) => p.id === id) ?? PATTERNS[1]).secs[0], cycles: 0 });
    setState((prev) => ({ ...prev, patternId: id }));
  }

  function reset() {
    stop();
    setView({ phase: 'inhale', progress: 0, remaining: pattern.secs[0], cycles: 0 });
  }

  // Circle size: grows through the inhale, stays full on the hold, shrinks through the exhale, stays small on the rest.
  const MIN = 0.58;
  const scale =
    view.phase === 'inhale' ? MIN + (1 - MIN) * view.progress
    : view.phase === 'holdIn' ? 1
    : view.phase === 'exhale' ? 1 - (1 - MIN) * view.progress
    : MIN;
  const label = PHASES[view.phase];
  const today = localISODate();
  const cyclesToday = state.date === today ? state.cyclesToday : 0;

  return (
    <ToolCard icon={<Wind className="w-5 h-5 text-emerald-600" />} title="Prāṇāyāma Breath Pacer" titleHindi="प्राणायाम · श्वास-गति" accent="emerald">
      <div className="flex flex-col items-center gap-5">
        <div role="radiogroup" aria-label="Breathing pattern" className="flex flex-wrap justify-center gap-2">
          {PATTERNS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={p.id === pattern.id}
              onClick={() => choose(p.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                p.id === pattern.id
                  ? 'border-emerald-400 bg-emerald-100 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200'
                  : 'border-dharma-border text-dharma-muted hover:border-emerald-300'
              }`}
            >
              <span lang="hi" className="font-devanagari">{p.nameHi}</span> · {p.name}
            </button>
          ))}
        </div>
        <p className="max-w-xs text-center text-xs text-dharma-muted">{pattern.note}</p>

        <div className="relative flex h-56 w-56 items-center justify-center" aria-hidden={!running}>
          <div className="absolute inset-0 rounded-full border border-dashed border-emerald-300/50" />
          <div
            className="absolute rounded-full bg-gradient-to-br from-emerald-300/70 via-teal-400/60 to-emerald-600/70 shadow-[0_0_36px_rgba(16,185,129,0.35)]"
            style={{
              width: '100%',
              height: '100%',
              transform: `scale(${reduce ? (view.phase === 'inhale' || view.phase === 'holdIn' ? 1 : MIN) : scale})`,
              transition: reduce ? 'transform 400ms ease' : 'none',
            }}
          />
          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="text-2xl font-bold tabular-nums text-emerald-950 dark:text-emerald-50">{running ? view.remaining : pattern.secs[0]}</span>
            <span className="text-sm font-semibold text-emerald-950 dark:text-emerald-50">{running ? label.en : 'Ready'}</span>
            <span lang="hi" className="font-devanagari text-xs text-emerald-900/80 dark:text-emerald-100/80">{running ? label.hi : 'तैयार'}</span>
          </div>
        </div>

        <p role="status" aria-live="polite" className="sr-only">
          {running ? `${label.en}, ${view.remaining} seconds` : 'Paused'}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => (running ? stop() : setRunning(true))}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-5 py-2 text-sm font-bold text-white transition hover:bg-emerald-800 active:scale-95"
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? 'Pause · रुकें' : 'Begin · आरंभ'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-full border border-dharma-border px-3.5 py-2 text-xs font-semibold text-dharma-muted transition hover:border-emerald-300 hover:text-emerald-800"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <button
            type="button"
            onClick={() => setVibrate(!vibrate)}
            aria-pressed={vibrate}
            className={`inline-flex items-center gap-1 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
              vibrate ? 'border-amber-300 bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200' : 'border-dharma-border text-dharma-muted'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" /> {vibrate ? 'कंपन' : 'स्थिर'}
          </button>
        </div>

        <div className="flex w-full items-center justify-between rounded-xl border border-dharma-border/60 bg-dharma-panel-muted px-3 py-2 text-xs text-dharma-muted">
          <span>
            आज: <strong className="font-bold text-dharma-text">{cyclesToday}</strong> चक्र · cycles
          </span>
          <span>
            कुल: <strong className="font-bold text-dharma-text">{state.lifetimeCycles}</strong>
          </span>
        </div>

        <p className="flex items-start gap-1.5 text-center text-[11px] leading-relaxed text-dharma-muted">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
          <span>
            A pacing aid, not medical advice. Breathe naturally and never strain or hold hard. Stop if you feel dizzy or uncomfortable, and
            check with a doctor first if you are pregnant or have a heart, lung or blood-pressure condition.
          </span>
        </p>
      </div>
    </ToolCard>
  );
}
