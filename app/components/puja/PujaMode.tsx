'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, RotateCcw, Sun, X } from 'lucide-react';
import { useAccessibleModal } from '@/lib/useAccessibleModal';
import { splitStep } from './steps';
import styles from './PujaMode.module.css';

/**
 * Puja mode: a ritual's steps one at a time, in large type, with big Back and Next buttons
 * in the thumb zone and the screen kept awake (Screen Wake Lock) while it is open. Made for
 * doing the puja with busy hands: swipe, the arrow keys or Space also move between steps.
 *
 * Where it stopped is kept on this device only (localStorage), so a puja interrupted by the
 * doorbell opens again at the same step. Nothing leaves the device.
 *
 */

export interface PujaModeProps {
  /** Hindi title of the puja, shown at the top. */
  title: string;
  /** English title, a separate element so the language choice can hide either one. */
  titleEn?: string;
  steps: string[];
  /** Key for the saved step, e.g. "ritual:puja" or "festival:diwali". */
  storageKey: string;
  onClose: () => void;
}

type WakeState = 'pending' | 'on' | 'off' | 'unsupported';

const STORE_PREFIX = 'dharma.pujaMode.';

function readSaved(key: string, count: number): number {
  try {
    const raw = window.localStorage.getItem(STORE_PREFIX + key);
    const n = raw == null ? 0 : Number.parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 && n < count ? n : 0;
  } catch {
    return 0;
  }
}

function writeSaved(key: string, index: number | null) {
  try {
    if (index == null || index <= 0) window.localStorage.removeItem(STORE_PREFIX + key);
    else window.localStorage.setItem(STORE_PREFIX + key, String(index));
  } catch {
    // Private mode or storage blocked: the puja still works, it just will not resume.
  }
}

function useScreenWakeLock(active: boolean): WakeState {
  const [state, setState] = useState<WakeState>('pending');
  useEffect(() => {
    if (!active) return;
    const nav = navigator as Navigator & { wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinel> } };
    if (!nav.wakeLock) {
      setState('unsupported');
      return;
    }
    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;
    const request = async () => {
      try {
        const next = await nav.wakeLock!.request('screen');
        if (cancelled) {
          next.release().catch(() => {});
          return;
        }
        sentinel = next;
        setState('on');
        next.addEventListener('release', () => {
          if (!cancelled) setState('off');
        });
      } catch {
        if (!cancelled) setState('off');
      }
    };
    // The browser drops the lock when the tab is hidden; take it again on return.
    const onVisible = () => {
      if (document.visibilityState === 'visible' && (!sentinel || sentinel.released)) void request();
    };
    void request();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisible);
      sentinel?.release().catch(() => {});
    };
  }, [active]);
  return state;
}

export function PujaMode({ title, titleEn, steps, storageKey, onClose }: PujaModeProps) {
  const total = steps.length;
  const [index, setIndex] = useState(0);
  const [resumed, setResumed] = useState(false);
  const [done, setDone] = useState(false);
  const [dir, setDir] = useState<'next' | 'prev'>('next');
  const dialogRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const pointer = useRef<{ x: number; y: number; id: number } | null>(null);
  const wake = useScreenWakeLock(true);

  useEffect(() => {
    const saved = readSaved(storageKey, total);
    if (saved > 0) {
      setIndex(saved);
      setResumed(true);
    }
  }, [storageKey, total]);

  useAccessibleModal(true, dialogRef, onClose, nextRef);

  const go = useCallback(
    (delta: 1 | -1) => {
      if (done) {
        if (delta === -1) setDone(false);
        return;
      }
      const target = index + delta;
      if (target < 0) return;
      setResumed(false);
      setDir(delta === 1 ? 'next' : 'prev');
      if (target >= total) {
        setDone(true);
        writeSaved(storageKey, null);
      } else {
        setIndex(target);
        writeSaved(storageKey, target);
      }
      if (typeof navigator.vibrate === 'function' && window.matchMedia?.('(pointer: coarse)').matches) {
        try {
          navigator.vibrate(8);
        } catch {
          // ignore
        }
      }
    },
    [done, index, total, storageKey],
  );

  const restart = () => {
    setDone(false);
    setResumed(false);
    setDir('prev');
    setIndex(0);
    writeSaved(storageKey, null);
    window.requestAnimationFrame(() => nextRef.current?.focus({ preventScroll: true }));
  };

  // Arrow keys, Page keys and Space move between steps. Escape is handled by useAccessibleModal.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const t = event.target as HTMLElement | null;
      if (t && t.tagName === 'BUTTON' && (event.key === ' ' || event.key === 'Enter')) return;
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        go(1);
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        go(-1);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [go]);

  // A horizontal swipe on the step moves to the next or previous one. Vertical moves are left
  // to scrolling, so a long step can still be read.
  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType === 'mouse') return;
    pointer.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    const start = pointer.current;
    pointer.current = null;
    if (!start || start.id !== e.pointerId) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    go(dx < 0 ? 1 : -1);
  };

  const step = splitStep(steps[Math.min(index, total - 1)] ?? '');
  const position = done ? total : index + 1;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="puja-mode-title"
      tabIndex={-1}
      data-puja-mode
      className={`${styles.screen} fixed inset-0 z-[80] flex flex-col bg-dharma-bg text-dharma-text`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`${styles.glow} absolute left-1/2 top-[38%] h-[min(80vw,520px)] w-[min(80vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial from-amber-400/20 via-saffron-500/8 to-transparent blur-2xl`}
        />
      </div>

      {/* Top bar: title, position, screen state and close. */}
      <header className="relative flex items-start gap-3 px-gutter pt-[max(env(safe-area-inset-top),0.75rem)] pb-3">
        <div className="min-w-0 flex-1">
          <h2 id="puja-mode-title" className="truncate text-callout font-semibold">
            <span lang="hi" data-bi="hi" className="font-devanagari">{title}</span>
            {titleEn && (
              <>
                <span data-bi="sep" className="text-dharma-muted"> · </span>
                <span data-bi="en">{titleEn}</span>
              </>
            )}
          </h2>
          <p className="mt-0.5 text-footnote text-dharma-muted">
            <span lang="hi" data-bi="hi" className="font-devanagari">चरण {position} / {total}</span>
            <span data-bi="sep"> · </span>
            <span data-bi="en">Step {position} of {total}</span>
            {wake === 'on' && (
              <span className="ml-2 inline-flex items-center gap-1 text-dharma-saffron">
                <Sun className="h-3.5 w-3.5" aria-hidden="true" />
                <span lang="hi" data-bi="hi" className="font-devanagari">स्क्रीन जागृत</span>
                <span data-bi="sep"> · </span>
                <span data-bi="en">Screen stays on</span>
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="पूजा मोड बंद करें (Close puja mode)"
          className="focus-ring inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-400"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      {/* Progress: one segment per step. */}
      <div className="relative px-gutter" aria-hidden="true">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-dharma-border/60">
          <div
            className={`${styles.fill} h-full w-full rounded-full bg-dharma-saffron`}
            style={{ transform: `scaleX(${position / total})` }}
          />
        </div>
      </div>

      {/* The step itself. */}
      <div
        className="relative flex flex-1 touch-pan-y flex-col overflow-y-auto px-gutter"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          pointer.current = null;
        }}
      >
        <div className="mx-auto my-auto w-full max-w-reading py-8">
          {done ? (
            <div key="done" className={`${styles.stepNext} text-center`} aria-live="polite">
              <p aria-hidden="true" className="text-5xl">🪔</p>
              <p className="mt-4 text-title-1 font-semibold">
                <span lang="hi" data-bi="hi" className="font-devanagari">पूजा सम्पन्न हुई</span>
                <span data-bi="sep"> · </span>
                <span data-bi="en">Puja complete</span>
              </p>
              <p lang="sa" className="mt-4 font-devanagari text-title-2 text-saffron-800 dark:text-saffron-300">
                ॐ शान्तिः शान्तिः शान्तिः
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={restart}
                  className="focus-ring inline-flex min-h-[48px] items-center gap-2 rounded-full border border-dharma-border bg-dharma-card px-5 text-subhead font-semibold"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  <span lang="hi" data-bi="hi" className="font-devanagari">फिर से आरम्भ</span>
                  <span data-bi="sep"> · </span>
                  <span data-bi="en">Start again</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="focus-ring inline-flex min-h-[48px] items-center gap-2 rounded-full bg-dharma-saffron px-6 text-subhead font-semibold text-dharma-bg"
                >
                  <span lang="hi" data-bi="hi" className="font-devanagari">बंद करें</span>
                  <span data-bi="sep"> · </span>
                  <span data-bi="en">Close</span>
                </button>
              </div>
            </div>
          ) : (
            <div key={index} className={dir === 'next' ? styles.stepNext : styles.stepPrev} aria-live="polite">
              {resumed && (
                <p className="mb-4 text-footnote text-dharma-muted">
                  <span lang="hi" data-bi="hi" className="font-devanagari">आप पिछली बार यहीं रुके थे।</span>
                  <span data-bi="sep"> · </span>
                  <span data-bi="en">You stopped here last time.</span>{' '}
                  <button type="button" onClick={restart} className="focus-ring tap-target font-semibold text-dharma-saffron underline underline-offset-4">
                    <span lang="hi" data-bi="hi" className="font-devanagari">पहले चरण से</span>
                    <span data-bi="sep"> · </span>
                    <span data-bi="en">From step 1</span>
                  </button>
                </p>
              )}
              <p className="text-caption-1 font-bold uppercase tracking-wider text-dharma-saffron">
                <span lang="hi" data-bi="hi" className="font-devanagari">चरण {index + 1}</span>
                <span data-bi="sep"> · </span>
                <span data-bi="en">Step {index + 1}</span>
              </p>
              <p lang="hi" className="mt-2 font-devanagari text-large-title font-bold leading-snug [overflow-wrap:anywhere]">
                {step.title}
              </p>
              {step.detail && (
                <p lang="hi" className="mt-5 font-devanagari text-title-3 font-normal leading-relaxed text-dharma-text [overflow-wrap:anywhere]">
                  {step.detail}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Back and Next, in the thumb zone. */}
      <nav
        aria-label="चरण (Steps)"
        className="relative grid grid-cols-[auto_1fr] gap-3 border-t border-dharma-border/70 bg-dharma-card/80 px-gutter pt-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur-md"
      >
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={!done && index === 0}
          className="focus-ring inline-flex min-h-[56px] items-center justify-center gap-1.5 rounded-control border border-dharma-border bg-dharma-bg px-5 text-callout font-semibold disabled:opacity-40"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          <span lang="hi" data-bi="hi" className="font-devanagari">पीछे</span>
          <span data-bi="sep"> · </span>
          <span data-bi="en">Back</span>
        </button>
        <button
          ref={nextRef}
          type="button"
          onClick={() => (done ? onClose() : go(1))}
          className="focus-ring inline-flex min-h-[56px] items-center justify-center gap-1.5 rounded-control bg-dharma-saffron px-5 text-callout font-semibold text-dharma-bg shadow-raised"
        >
          {done ? (
            <>
              <span lang="hi" data-bi="hi" className="font-devanagari">बंद करें</span>
              <span data-bi="sep"> · </span>
              <span data-bi="en">Close</span>
            </>
          ) : index === total - 1 ? (
            <>
              <span lang="hi" data-bi="hi" className="font-devanagari">सम्पन्न</span>
              <span data-bi="sep"> · </span>
              <span data-bi="en">Finish</span>
            </>
          ) : (
            <>
              <span lang="hi" data-bi="hi" className="font-devanagari">आगे</span>
              <span data-bi="sep"> · </span>
              <span data-bi="en">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </>
          )}
        </button>
      </nav>
    </div>,
    document.body,
  );
}
