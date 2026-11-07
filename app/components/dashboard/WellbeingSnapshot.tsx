'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BookOpen, Check, Clock3, Pause, Play, RotateCcw, ShieldCheck } from 'lucide-react';
import {
  readWellbeingSnapshot,
  recordStudySession,
  WELLBEING_UPDATED_EVENT,
  type WellbeingSnapshot as WellbeingSnapshotData,
} from '@/lib/wellbeing-ledger';

const DURATIONS = [5, 10, 20] as const;

function clockLabel(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

function minutesLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours} hr ${remainder} min` : `${hours} hr`;
}

const metrics = (snapshot: WellbeingSnapshotData) => [
  {
    label: 'Reading days',
    hindi: 'पठन के दिन',
    value: snapshot.readingDays,
    detail: `in the last ${snapshot.windowDays} days · इसी अवधि में`,
  },
  {
    label: 'Reflection days',
    hindi: 'चिंतन के दिन',
    value: snapshot.reflectionDays,
    detail: `private entries with words · निजी प्रविष्टियाँ`,
  },
  {
    label: 'Wisdom sessions',
    hindi: 'स्वाध्याय सत्र',
    value: snapshot.wisdomSessions,
    detail: 'you chose to time · आपके चुने हुए',
  },
  {
    label: 'Study time',
    hindi: 'अध्ययन समय',
    value: minutesLabel(snapshot.studyMinutes),
    detail: 'only from completed timer sessions · केवल पूर्ण सत्र',
  },
];

/** A small, local-only wellbeing review and voluntary reading timer. */
export function WellbeingSnapshot() {
  const [snapshot, setSnapshot] = useState<WellbeingSnapshotData | null>(null);
  const [duration, setDuration] = useState<number>(10);
  const [secondsLeft, setSecondsLeft] = useState(10 * 60);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('');
  const endAt = useRef<number | null>(null);

  const refreshSnapshot = useCallback(() => {
    setSnapshot(readWellbeingSnapshot());
  }, []);

  const saveSession = useCallback((minutes: number) => {
    const saved = recordStudySession(minutes);
    if (!saved) {
      setStatus('This session could not be saved. Your reading itself is not affected.');
      return;
    }
    window.dispatchEvent(new Event(WELLBEING_UPDATED_EVENT));
    setSnapshot(readWellbeingSnapshot());
    setStatus(`${minutesLabel(minutes)} saved on this device. Take the time you need between sessions.`);
  }, []);

  useEffect(() => {
    refreshSnapshot();
    const onStorage = (event: StorageEvent) => {
      if (!event.key || event.key.startsWith('dharma.')) refreshSnapshot();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refreshSnapshot();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', refreshSnapshot);
    window.addEventListener(WELLBEING_UPDATED_EVENT, refreshSnapshot);
    window.addEventListener('dharma-study-updated', refreshSnapshot);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', refreshSnapshot);
      window.removeEventListener(WELLBEING_UPDATED_EVENT, refreshSnapshot);
      window.removeEventListener('dharma-study-updated', refreshSnapshot);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [refreshSnapshot]);

  useEffect(() => {
    if (!running || endAt.current === null) return;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((endAt.current! - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) {
        endAt.current = null;
        setRunning(false);
        saveSession(duration);
        setSecondsLeft(duration * 60);
      }
    };
    const interval = window.setInterval(tick, 250);
    tick();
    return () => window.clearInterval(interval);
  }, [duration, running, saveSession]);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.visibilityState !== 'hidden' || endAt.current === null) return;
      const remaining = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      endAt.current = null;
      setSecondsLeft(remaining);
      setRunning(false);
      setStatus('Timer paused when this page went out of view. Resume whenever you are ready.');
    };
    document.addEventListener('visibilitychange', pauseWhenHidden);
    return () => document.removeEventListener('visibilitychange', pauseWhenHidden);
  }, []);

  const start = () => {
    const remaining = secondsLeft <= 0 ? duration * 60 : secondsLeft;
    setSecondsLeft(remaining);
    endAt.current = Date.now() + remaining * 1000;
    setStatus('');
    setRunning(true);
  };

  const pause = () => {
    if (endAt.current !== null) {
      setSecondsLeft(Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000)));
      endAt.current = null;
    }
    setRunning(false);
    setStatus('Paused. Continue or end the session whenever you choose.');
  };

  const finish = () => {
    const elapsedMinutes = Math.floor((duration * 60 - secondsLeft) / 60);
    endAt.current = null;
    setRunning(false);
    setSecondsLeft(duration * 60);
    if (elapsedMinutes > 0) saveSession(elapsedMinutes);
    else setStatus('No full minute to record; nothing was saved.');
  };

  const selectDuration = (next: number) => {
    if (running) return;
    setDuration(next);
    setSecondsLeft(next * 60);
    setStatus('');
  };

  return (
    <section aria-labelledby="wellbeing-snapshot-heading" className="rounded-3xl border border-dharma-border bg-dharma-card p-5 shadow-sm sm:p-7">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-saffron-700 dark:text-saffron-300">
          A gentle look back · सहज आत्मावलोकन
        </p>
        <h2 id="wellbeing-snapshot-heading" className="mt-2 font-serif text-2xl font-bold text-dharma-text sm:text-3xl">
          Your practice, without a score
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-dharma-muted">
          These four measures help you notice your own rhythm. There is no target, streak, ranking, or comparison.
          Your reflections are counted locally; their words are never shown here.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(250px,0.85fr)_minmax(0,1.5fr)]">
        <div className="rounded-2xl border border-saffron-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 dark:border-saffron-900/60 dark:from-saffron-950/50 dark:to-stone-900 sm:p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-dharma-text">
            <BookOpen className="h-4 w-4 text-saffron-700 dark:text-saffron-300" aria-hidden="true" />
            Quiet reading · मौन पठन
          </div>
          <p className="mt-1 text-xs leading-relaxed text-dharma-muted">
            Choose a little time for one passage. The timer pauses when you leave this page.
          </p>

          <fieldset className="mt-4">
            <legend className="mb-2 text-xs font-medium text-dharma-muted">Session length · अवधि</legend>
            <div className="grid grid-cols-3 gap-2">
              {DURATIONS.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={duration === value}
                  disabled={running}
                  onClick={() => selectDuration(value)}
                  className={`min-h-11 rounded-xl border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 disabled:cursor-not-allowed disabled:opacity-60 ${
                    duration === value
                      ? 'border-saffron-700 bg-saffron-700 text-white dark:border-saffron-500 dark:bg-saffron-600'
                      : 'border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-400'
                  }`}
                >
                  {value} min
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-4 flex items-end justify-between gap-4">
            <output aria-label={`Time remaining ${clockLabel(secondsLeft)}`} className="font-mono text-4xl font-semibold tabular-nums tracking-tight text-dharma-text">
              {clockLabel(secondsLeft)}
            </output>
            <Clock3 className="mb-2 h-5 w-5 text-saffron-700 dark:text-saffron-300" aria-hidden="true" />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {running ? (
              <>
                <button type="button" onClick={pause} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-dharma-border bg-dharma-card px-4 text-sm font-semibold text-dharma-text hover:border-saffron-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500">
                  <Pause className="h-4 w-4" aria-hidden="true" /> Pause
                </button>
                <button type="button" onClick={finish} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-dharma-border bg-dharma-card px-3 text-sm font-medium text-dharma-text hover:border-saffron-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500">
                  <Check className="h-4 w-4" aria-hidden="true" /> Finish &amp; save
                </button>
              </>
            ) : (
              <button type="button" onClick={start} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-saffron-700 px-4 text-sm font-semibold text-white hover:bg-saffron-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2">
                <Play className="h-4 w-4" aria-hidden="true" /> {secondsLeft < duration * 60 ? 'Resume' : 'Begin quietly'}
              </button>
            )}
            {!running && secondsLeft < duration * 60 && (
              <button type="button" onClick={finish} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-dharma-border bg-dharma-card px-3 text-sm font-medium text-dharma-text hover:border-saffron-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500">
                <Check className="h-4 w-4" aria-hidden="true" /> Finish &amp; save
              </button>
            )}
            {!running && secondsLeft < duration * 60 && (
              <button type="button" onClick={() => { endAt.current = null; setSecondsLeft(duration * 60); setStatus(''); }} aria-label="Reset timer" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <p role="status" aria-live="polite" className="mt-3 min-h-5 text-xs leading-relaxed text-dharma-muted">
            {status}
          </p>
        </div>

        <div className="grid content-start grid-cols-1 gap-3 sm:grid-cols-2">
          {(snapshot ? metrics(snapshot) : []).map((metric) => (
            <article key={metric.label} className="rounded-2xl border border-dharma-border bg-dharma-bg/70 p-4 sm:p-5">
              <p className="text-xs font-medium text-dharma-muted">
                {metric.label} <span aria-hidden="true">·</span> <span lang="hi" className="font-devanagari">{metric.hindi}</span>
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-dharma-text">{metric.value}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-dharma-muted">{metric.detail}</p>
            </article>
          ))}
          {!snapshot && (
            <div aria-hidden="true" className="col-span-full grid grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl border border-dharma-border bg-dharma-bg/70" />)}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-dharma-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-dharma-muted">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
          Counts stay in this browser. Timer sessions store only the date and minutes you choose to save.
        </p>
        <Link href="/practice/journal/" className="min-h-11 shrink-0 self-start rounded-xl border border-dharma-border px-4 py-2.5 text-sm font-semibold text-dharma-text hover:border-saffron-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 sm:self-auto">
          Open private reflections
        </Link>
      </div>
    </section>
  );
}
