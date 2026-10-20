'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type PanInfo,
} from 'framer-motion';
import { CircleDot, Eye, RotateCcw, Smartphone, Undo2, Volume2, VolumeX } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { ToolCard, localISODate } from './shared';

/*
 * A physical japa mala: a strand of rudraksha beads on a curved thread. Roll the next bead down with the thumb
 * (drag or flick downward), tap it, or press Space / ArrowDown. Bead 108 is the Sumeru (guru bead, with its
 * tassel); the strand never crosses it. Reaching it completes the mala, the strand turns back to bead 0.
 *
 * - The count is committed the moment a bead is counted; the spring only follows it, so fast japa never loses a
 *   bead to an animation in flight.
 * - Same storage as the previous counter (dharma.practice.japa and its sound / vibration preferences), so the
 *   day's count, malas and backups carry over.
 * - Sound is synthesised with the Web Audio API (no audio files); vibration no-ops where unsupported.
 */

interface JapaState {
  /** Local ISO day the count belongs to. */
  date: string;
  /** Beads counted within the current mala (0..107). */
  count: number;
  /** Completed malas today. */
  rounds: number;
  /** All-time completed malas, across days. */
  lifetimeRounds: number;
  /** Optional mantra label, for the user's own reference. */
  mantra: string;
}

const INITIAL: JapaState = { date: '', count: 0, rounds: 0, lifetimeRounds: 0, mantra: '' };
const MALA = 108;
/** Bead index of the Sumeru: the 108 counted beads are 0..107. */
const SUMERU = MALA;
/** Vertical distance between bead centres along the thread, px. */
const STEP = 40;
/** Beads drawn either side of the focus bead. */
const WINDOW = 6;
const BEAD = 30;
const SUMERU_SIZE = 38;
/** Drag past this share of a step, or flick faster than FLICK px/s, and the bead is counted. */
const COMMIT_SHARE = 0.45;
const FLICK = 380;
const BEAD_SPRING = { type: 'spring', stiffness: 520, damping: 30, mass: 0.7 } as const;
const BPM_SAMPLES = 5;

/** Horizontal sweep of the strand: a gentle C-curve, the thumb rest at its apex. */
const curveX = (t: number) => 64 * (1 - Math.cos(t * 0.27));
/** Rubber-band the thumb's travel: easy for one bead, firmer beyond, stiff upward. */
const rubber = (dy: number) => (dy >= 0 ? STEP * 1.35 * (1 - Math.exp(-dy / (STEP * 1.35))) : dy * 0.18);

// ── Procedural audio ─────────────────────────────────────────────────────────

interface MalaAudio {
  ctx: AudioContext;
  noise: AudioBuffer;
}

function createMalaAudio(): MalaAudio | null {
  const Ctor =
    typeof window === 'undefined'
      ? undefined
      : window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  const ctx = new Ctor();
  const noise = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.06), ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return { ctx, noise };
}

/** Two dry rudraksha seeds touching: a noise impulse through a woody band-pass, gone in ~55 ms. */
function playClack({ ctx, noise }: MalaAudio) {
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const body = ctx.createBiquadFilter();
  body.type = 'bandpass';
  body.frequency.value = 900 + Math.random() * 300;
  body.Q.value = 7;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.7, t + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
  src.connect(body).connect(gain).connect(ctx.destination);
  src.start(t);
  src.stop(t + 0.06);
}

/** A small bronze bowl at 528 Hz: inharmonic partials, a slow vibrato, a 2.6 s fade. */
function playBowl({ ctx }: MalaAudio) {
  const t = ctx.currentTime;
  const out = ctx.createGain();
  out.gain.value = 0.45;
  out.connect(ctx.destination);
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 4.6;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 1.6;
  lfo.connect(lfoDepth);
  const partials: Array<[number, number]> = [
    [528, 1],
    [528 * 2.71, 0.34],
    [528 * 5.15, 0.12],
  ];
  for (const [freq, amp] of partials) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    lfoDepth.connect(osc.frequency);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(amp * 0.32, t + 0.02);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
    osc.connect(env).connect(out);
    osc.start(t);
    osc.stop(t + 2.7);
  }
  lfo.start(t);
  lfo.stop(t + 2.7);
}

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') navigator.vibrate(pattern);
}

// ── Beads ────────────────────────────────────────────────────────────────────

/** One bead on the thread; its place follows `pos` (the strand's position, in beads). */
function Bead({ index, pos }: { index: number; pos: MotionValue<number> }) {
  const sumeru = index === SUMERU;
  const size = sumeru ? SUMERU_SIZE : BEAD;
  // t: beads above the thumb rest (positive = still to count, negative = counted).
  const t = useTransform(pos, (p) => index - p);
  const x = useTransform(t, (v) => curveX(v) - size / 2);
  const y = useTransform(t, (v) => -v * STEP - size / 2);
  const scale = useTransform(t, (v) => Math.max(0.62, (Math.abs(v) < 0.5 ? 1.14 : 1.06) - Math.abs(v) * 0.05));
  const opacity = useTransform(t, (v) => Math.max(0, Math.min(1, 1 - (Math.abs(v) - 3.6) * 0.42)));

  return (
    <motion.div
      aria-hidden="true"
      className="absolute left-0 top-0"
      style={{ x, y, scale, opacity, width: size, height: size }}
    >
      <div
        className="h-full w-full rounded-full"
        style={{
          background: sumeru
            ? 'radial-gradient(circle at 34% 30%, #f5ebe0 0%, #e0a27a 22%, #c86d44 52%, #6e2f17 100%)'
            : 'repeating-conic-gradient(from 8deg, rgba(0,0,0,0.22) 0deg 3deg, transparent 3deg 36deg), radial-gradient(circle at 34% 30%, #b97a4d 0%, #7a3f1f 40%, #4a2312 72%, #24110a 100%)',
          boxShadow: sumeru
            ? '0 0 18px rgba(224,122,95,0.45), inset -3px -4px 8px rgba(0,0,0,0.45), inset 2px 2px 5px rgba(255,236,214,0.35)'
            : 'inset -3px -4px 7px rgba(0,0,0,0.55), inset 2px 2px 4px rgba(255,214,170,0.22), 0 3px 6px rgba(0,0,0,0.45)',
        }}
      />
      {sumeru && (
        // The tassel falls from the guru bead away from the strand (the Sumeru is its last bead).
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 rotate-180">
          <div className="mx-auto h-2 w-3 rounded-b-sm bg-[#c86d44]" />
          <div
            className="mx-auto h-12 w-6 rounded-b-[45%]"
            style={{
              background:
                'repeating-linear-gradient(90deg, #e07a5f 0 2px, #c86d44 2px 4px), linear-gradient(#c86d44, #8a3a1f)',
              maskImage: 'linear-gradient(to bottom, black 70%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent)',
            }}
          />
        </div>
      )}
    </motion.div>
  );
}

/** The thread the beads slide along, sampled from the same curve. */
const THREAD_PATH = (() => {
  const pts: string[] = [];
  for (let t = WINDOW + 0.6; t >= -WINDOW - 0.6; t -= 0.25) pts.push(`${curveX(t).toFixed(1)},${(-t * STEP).toFixed(1)}`);
  return `M${pts.join(' L')}`;
})();

// ── Component ────────────────────────────────────────────────────────────────

export function JapaMala() {
  const [state, setState] = useLocalStorage<JapaState>('dharma.practice.japa', INITIAL);
  const [soundEnabled, setSoundEnabled] = useLocalStorage<boolean>('dharma.practice.japa.sound', true);
  const [vibrationEnabled, setVibrationEnabled] = useLocalStorage<boolean>('dharma.practice.japa.vibration', true);
  const reduce = useReducedMotion();

  const today = localISODate();
  const isToday = state.date === today;
  const count = isToday ? state.count : 0;
  const rounds = isToday ? state.rounds : 0;

  // The live count and malas, updated the instant a bead is counted. Rapid taps can arrive before React
  // re-renders; reading `count` from the last render would count the same bead twice and lose one.
  const countRef = useRef(count);
  const roundsRef = useRef(rounds);
  useEffect(() => {
    countRef.current = count;
    roundsRef.current = rounds;
  }, [count, rounds]);

  // The strand's position in beads: equals `count` at rest, fractional while the thumb rolls a bead.
  const pos = useMotionValue(count);
  const [anchor, setAnchor] = useState(count);
  useMotionValueEvent(pos, 'change', (p) => setAnchor(Math.round(p)));

  const audioRef = useRef<MalaAudio | null>(null);
  const motionRef = useRef<ReturnType<typeof animate> | null>(null);
  const turningRef = useRef(false);
  const stampsRef = useRef<number[]>([]);
  const [bpm, setBpm] = useState<number | null>(null);
  const [bloom, setBloom] = useState(0);
  const [turning, setTurning] = useState(false);
  const [announce, setAnnounce] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [wakeLockSupported, setWakeLockSupported] = useState(false);

  // Follow the stored count when it changes from outside (another tab, a backup restore, a new day).
  useEffect(() => {
    if (!turningRef.current && Math.round(pos.get()) !== count) pos.set(count);
  }, [count, pos]);

  useEffect(() => {
    setWakeLockSupported(typeof navigator !== 'undefined' && 'wakeLock' in navigator);
  }, []);

  useEffect(
    () => () => {
      motionRef.current?.stop();
      audioRef.current?.ctx.close().catch(() => {});
      audioRef.current = null;
    },
    [],
  );

  useEffect(() => () => void wakeLock?.release().catch(() => {}), [wakeLock]);

  /** The audio context is created on the first gesture (browsers require one) and resumed if suspended. */
  const audio = useCallback((): MalaAudio | null => {
    if (!soundEnabled) return null;
    if (!audioRef.current) audioRef.current = createMalaAudio();
    if (audioRef.current?.ctx.state === 'suspended') audioRef.current.ctx.resume().catch(() => {});
    return audioRef.current;
  }, [soundEnabled]);

  const glideTo = useCallback(
    (target: number, onComplete?: () => void) => {
      motionRef.current?.stop();
      if (reduce) {
        pos.set(target);
        onComplete?.();
        return;
      }
      motionRef.current = animate(pos, target, { ...BEAD_SPRING, onComplete });
    },
    [pos, reduce],
  );

  const recordPace = useCallback(() => {
    const now = performance.now();
    const stamps = [...stampsRef.current, now].slice(-BPM_SAMPLES);
    stampsRef.current = stamps;
    if (stamps.length >= 2) {
      const span = stamps[stamps.length - 1] - stamps[0];
      if (span > 0) setBpm(Math.round(((stamps.length - 1) / span) * 60000));
    }
  }, []);

  /** Count the next bead. The count is saved now; the strand springs after it. */
  const advance = useCallback(() => {
    if (turningRef.current) return;
    const next = countRef.current + 1;
    recordPace();
    const sound = audio();

    if (next >= MALA) {
      countRef.current = 0;
      roundsRef.current += 1;
      // The Sumeru reaches the thumb: the mala is complete and the strand turns back to bead 0.
      setState((prev) => {
        const same = prev.date === today;
        return {
          ...prev,
          date: today,
          count: 0,
          rounds: (same ? prev.rounds : 0) + 1,
          lifetimeRounds: prev.lifetimeRounds + 1,
        };
      });
      if (sound) playBowl(sound);
      if (vibrationEnabled) vibrate([40, 60, 100]);
      setAnnounce(`माला पूर्ण · Mala ${roundsRef.current} complete`);
      setBloom((b) => b + 1);
      turningRef.current = true;
      setTurning(true);
      glideTo(SUMERU, () => {
        window.setTimeout(
          () => {
            pos.set(0);
            turningRef.current = false;
            setTurning(false);
          },
          reduce ? 0 : 520,
        );
      });
      return;
    }

    countRef.current = next;
    setState((prev) => ({ ...prev, date: today, count: next, rounds: prev.date === today ? prev.rounds : 0 }));
    if (sound) playClack(sound);
    if (vibrationEnabled) vibrate(12);
    glideTo(next);
  }, [audio, glideTo, pos, recordPace, reduce, setState, today, vibrationEnabled]);

  const undo = useCallback(() => {
    const c = countRef.current;
    const r = roundsRef.current;
    if (turningRef.current || (c === 0 && r === 0)) return;
    if (c === 0) {
      countRef.current = MALA - 1;
      roundsRef.current = r - 1;
      setState((prev) => ({
        ...prev,
        date: today,
        count: MALA - 1,
        rounds: r - 1,
        lifetimeRounds: Math.max(0, prev.lifetimeRounds - 1),
      }));
      pos.set(MALA - 1);
    } else {
      countRef.current = c - 1;
      setState((prev) => ({ ...prev, date: today, count: c - 1, rounds: r }));
      glideTo(c - 1);
    }
    if (vibrationEnabled) vibrate(8);
  }, [glideTo, pos, setState, today, vibrationEnabled]);

  const resetRound = useCallback(() => {
    if (turningRef.current) return;
    countRef.current = 0;
    setState((prev) => ({ ...prev, date: today, count: 0, rounds: prev.date === today ? prev.rounds : 0 }));
    glideTo(0);
    stampsRef.current = [];
    setBpm(null);
  }, [glideTo, setState, today]);

  const resetToday = useCallback(() => {
    countRef.current = 0;
    roundsRef.current = 0;
    setState((prev) => {
      const r = prev.date === today ? prev.rounds : 0;
      return { ...prev, date: today, count: 0, rounds: 0, lifetimeRounds: Math.max(0, prev.lifetimeRounds - r) };
    });
    pos.set(0);
    stampsRef.current = [];
    setBpm(null);
    setConfirmReset(false);
  }, [pos, setState, today]);

  async function toggleWakeLock() {
    if (wakeLock) {
      await wakeLock.release().catch(() => {});
      setWakeLock(null);
      return;
    }
    try {
      const sentinel = await navigator.wakeLock.request('screen');
      sentinel.addEventListener('release', () => setWakeLock(null));
      setWakeLock(sentinel);
    } catch {
      setWakeLock(null);
    }
  }

  // ── Thumb gestures ──
  // framer can report a tap at the end of a short pan; once the thumb has panned, the release belongs to the
  // pan alone (a drag that stops short must spring back, not count).
  const pannedRef = useRef(false);
  const onTapStart = () => {
    pannedRef.current = false;
  };
  const onTap = () => {
    if (!pannedRef.current) advance();
  };
  const onPanStart = () => {
    pannedRef.current = true;
  };
  const onPan = (_: PointerEvent, info: PanInfo) => {
    if (turningRef.current) return;
    motionRef.current?.stop();
    // Never roll past the Sumeru, never behind bead 0.
    const frac = Math.max(-0.25, Math.min(1.3, rubber(info.offset.y) / STEP));
    pos.set(Math.max(0, countRef.current + frac));
  };
  const onPanEnd = (_: PointerEvent, info: PanInfo) => {
    if (turningRef.current) return;
    const frac = pos.get() - countRef.current;
    // A flick must still travel a quarter bead, so a jittery thumb never counts by accident.
    if (frac >= COMMIT_SHARE || (info.velocity.y > FLICK && frac >= 0.25)) advance();
    else glideTo(countRef.current);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault();
      advance();
    } else if (e.key === 'ArrowUp' || e.key === 'Backspace') {
      e.preventDefault();
      undo();
    }
  };

  const shown = (n: number) => String(n);
  const beads: number[] = [];
  for (let i = anchor - WINDOW; i <= anchor + WINDOW; i++) if (i >= 0 && i <= SUMERU) beads.push(i);

  const pill =
    'inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-[#f5ebe0]/15 px-3 text-xs font-semibold text-[#f5ebe0]/85 transition hover:border-[#e07a5f]/60 hover:text-[#f5ebe0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e07a5f]';

  return (
    <ToolCard icon={<CircleDot className="h-5 w-5 text-saffron-600" />} title="108-Bead Rudraksha Mala" titleHindi="जप साधना" accent="saffron">
      <div className="overflow-hidden rounded-3xl bg-[#12100e] p-4 text-[#f5ebe0] shadow-inner sm:p-6">
        {/* Preferences */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={pill}
              aria-pressed={!soundEnabled}
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'ध्वनि चालू · Sound on' : 'ध्वनि बंद · Sound muted'}
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" aria-hidden="true" /> : <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />}
              <span>{soundEnabled ? 'Mute sound' : 'Sound off'}</span>
            </button>
            <button
              type="button"
              className={pill}
              aria-pressed={vibrationEnabled}
              onClick={() => setVibrationEnabled(!vibrationEnabled)}
              title={vibrationEnabled ? 'कंपन चालू · Vibration on' : 'कंपन बंद · Vibration off'}
            >
              <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{vibrationEnabled ? 'Vibration on' : 'Vibration off'}</span>
            </button>
            {wakeLockSupported && (
              <button
                type="button"
                className={pill}
                aria-pressed={Boolean(wakeLock)}
                onClick={toggleWakeLock}
                title="स्क्रीन चालू रखें · Keep screen awake"
              >
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{wakeLock ? 'Screen stays on' : 'Keep screen on'}</span>
              </button>
            )}
          </div>
        </div>

        <label className="mt-4 block">
          <span className="sr-only">Mantra label</span>
          <input
            value={state.mantra}
            onChange={(e) => setState({ ...state, mantra: e.target.value })}
            placeholder="मन्त्र (वैकल्पिक) · Mantra (optional)"
            maxLength={80}
            className="w-full rounded-xl border border-[#f5ebe0]/12 bg-[#f5ebe0]/[0.04] px-3 py-2 text-center font-devanagari text-sm text-[#f5ebe0] placeholder:text-[#f5ebe0]/40 focus:border-[#e07a5f]/60 focus:outline-none"
          />
        </label>

        <div className="mt-4 grid items-center gap-4 sm:grid-cols-[1fr_auto]">
          {/* The strand: roll a bead down with the thumb, tap it, or press Space / ArrowDown. */}
          <motion.div
            role="button"
            tabIndex={0}
            aria-label={`अगला मनका गिनें · Count the next bead. ${count} of ${MALA}.`}
            aria-describedby="japa-mala-help"
            onKeyDown={onKeyDown}
            onTapStart={onTapStart}
            onTap={onTap}
            onPanStart={onPanStart}
            onPan={onPan}
            onPanEnd={onPanEnd}
            className="relative mx-auto h-[340px] w-full max-w-[260px] cursor-grab touch-none select-none overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#e07a5f] active:cursor-grabbing"
          >
            {/* Ambient warmth and the completion bloom */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_42%_62%,rgba(200,109,68,0.16),transparent_62%)]" />
            {bloom > 0 && !reduce && (
              <div
                key={bloom}
                aria-hidden="true"
                className="japa-bloom pointer-events-none absolute left-[42%] top-[62%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(224,122,95,0.55),rgba(245,235,224,0.12)_45%,transparent_70%)]"
              />
            )}
            {/* The thumb rest sits at 62% of the zone's height, the strand's apex. */}
            <div
              className="absolute left-[30%] top-[62%] transition-opacity duration-300"
              style={{ opacity: turning ? 0.35 : 1 }}
            >
              <svg aria-hidden="true" className="pointer-events-none absolute left-0 top-0 overflow-visible" width="1" height="1">
                <path d={THREAD_PATH} fill="none" stroke="#c86d44" strokeOpacity="0.45" strokeWidth="1.5" />
              </svg>
              <div aria-hidden="true" className="pointer-events-none absolute -left-[22px] -top-[22px] h-11 w-11 rounded-full border border-[#e07a5f]/45" />
              {beads.map((i) => (
                <Bead key={i} index={i} pos={pos} />
              ))}
            </div>
          </motion.div>

          {/* Count, malas, pace */}
          <div className="text-center sm:min-w-[150px] sm:text-left">
            <p className="font-devanagari text-6xl font-bold leading-tight tabular-nums text-[#f5ebe0]" aria-hidden="true">
              {shown(count)}
              <span className="text-2xl font-semibold text-[#f5ebe0]/45"> / {shown(MALA)}</span>
            </p>
            <p className="mt-2 font-devanagari text-lg text-[#e07a5f]" lang="hi">
              माला: {shown(rounds)}
            </p>
            <p className="text-xs text-[#f5ebe0]/55">
              Lifetime malas {shown(state.lifetimeRounds)}
            </p>
            <p className="mt-3 text-xs uppercase tracking-widest text-[#f5ebe0]/55">
              Pace <span className="ml-1 font-mono text-sm normal-case tracking-normal text-[#f5ebe0]">{bpm === null ? '—' : `${bpm} beads/min`}</span>
            </p>
          </div>
        </div>

        <p id="japa-mala-help" className="mt-3 text-center text-xs text-[#f5ebe0]/55">
          <span lang="hi">अँगूठे से मनका नीचे खिसकाएँ या स्पर्श करें</span> · Roll a bead down with your thumb, tap it, or press Space.
          ArrowUp undoes.
        </p>
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button type="button" className={pill} onClick={undo} disabled={count === 0 && rounds === 0}>
            <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Undo</span>
          </button>
          <button type="button" className={pill} onClick={resetRound} disabled={count === 0}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reset round</span>
          </button>
          {confirmReset ? (
            <span className="inline-flex items-center gap-2 text-xs">
              <span>Clear today&apos;s count and malas?</span>
              <button type="button" className={`${pill} border-[#e07a5f]/70 text-[#e07a5f]`} onClick={resetToday}>
                Clear today
              </button>
              <button type="button" className={pill} onClick={() => setConfirmReset(false)}>
                Keep
              </button>
            </span>
          ) : (
            <button type="button" className={pill} onClick={() => setConfirmReset(true)} disabled={count === 0 && rounds === 0}>
              <span>Reset today</span>
            </button>
          )}
        </div>
      </div>
    </ToolCard>
  );
}
