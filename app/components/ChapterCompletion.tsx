'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Flame, X } from 'lucide-react';
import { triggerTactileFeedback } from '@/lib/haptics';
import {
  isChapterCompleted,
  markChapterCompleted,
  readActiveStreak,
} from '@/lib/reading-history';
import { PushpaVrishti } from '@/app/components/motion/PushpaVrishti';

interface Props {
  scriptureId: string;
  chapterId: number;
  chapterTitle: string;
  totalChapters: number;
  nextHref?: string;
  nextLabel?: string;
}

/** Visible reading time before reaching the end counts as "read". */
const MIN_READ_MS = 20_000;
/** Share of the scrollable page the reader must have passed through. */
const MIN_SCROLL_DEPTH = 0.6;
const TOAST_MS = 12_000;

/**
 * Marks the chapter complete when the reader genuinely reaches its end, then
 * marks the moment the way a pothi does: a soft पुष्पवृष्टि (flowers falling from
 * above), a lit diya, a success haptic, and a toast with the streak,
 * book progress and a one-tap "next chapter". Fires once per chapter.
 * Render with a `key` per chapter so state resets on client navigation.
 */
export function ChapterCompletion({
  scriptureId,
  chapterId,
  chapterTitle,
  totalChapters,
  nextHref,
  nextLabel,
}: Props) {
  const reduce = useReducedMotion();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [celebration, setCelebration] = useState<{ streak: number; done: number } | null>(null);
  const [petals, setPetals] = useState(false);

  useEffect(() => {
    if (isChapterCompleted(scriptureId, chapterId)) {
      setAlreadyDone(true);
      return;
    }

    let visibleMs = 0;
    let lastTick = performance.now();
    let maxDepth = 0;
    let atEnd = false;
    let fired = false;

    const measureDepth = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      // Short pages that barely scroll count as fully seen.
      const depth = scrollable <= 200 ? 1 : window.scrollY / scrollable;
      maxDepth = Math.max(maxDepth, depth);
    };

    const tryFire = () => {
      if (fired || !atEnd || visibleMs < MIN_READ_MS || maxDepth < MIN_SCROLL_DEPTH) return;
      fired = true;
      const done = markChapterCompleted(scriptureId, chapterId);
      const streak = readActiveStreak();
      window.dispatchEvent(new Event('dharma:streak-change'));
      triggerTactileFeedback('success', 'success');
      setAlreadyDone(true);
      setCelebration({ streak, done });
      const root = document.documentElement;
      const quiet =
        root.hasAttribute('data-lite-mode') ||
        root.hasAttribute('data-low-power') ||
        root.hasAttribute('data-data-saver');
      if (!reduce && !quiet) setPetals(true);
    };

    // Count reading time only while the tab is actually visible.
    const timer = window.setInterval(() => {
      const now = performance.now();
      if (!document.hidden) visibleMs += now - lastTick;
      lastTick = now;
      tryFire();
    }, 1000);

    const onScroll = () => {
      measureDepth();
      tryFire();
    };
    measureDepth();
    window.addEventListener('scroll', onScroll, { passive: true });

    const observer = new IntersectionObserver(([entry]) => {
      atEnd = entry.isIntersecting;
      tryFire();
    });
    if (sentinelRef.current) observer.observe(sentinelRef.current);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [scriptureId, chapterId, reduce]);

  // Auto-dismiss the toast.
  useEffect(() => {
    if (!celebration) return;
    const t = window.setTimeout(() => setCelebration(null), TOAST_MS);
    return () => window.clearTimeout(t);
  }, [celebration]);

  const percent = celebration
    ? Math.min(100, Math.round((celebration.done / Math.max(1, totalChapters)) * 100))
    : 0;

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />

      {alreadyDone && !celebration && (
        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          यह अध्याय पूर्ण हो चुका है
        </p>
      )}

      {petals && <PushpaVrishti onDone={() => setPetals(false)} />}

      <AnimatePresence>
        {celebration && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: reduce ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 bottom-24 z-[65] mx-auto max-w-md overflow-hidden rounded-3xl border border-amber-300/50 bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 p-5 text-white shadow-[0_24px_80px_rgba(234,88,12,0.45)]"
          >
            {/* Slow golden sheen across the card */}
            {!reduce && (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-amber-200/15 to-transparent"
                animate={{ x: ['0%', '400%'] }}
                transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.3 }}
              />
            )}

            <button
              type="button"
              onClick={() => setCelebration(null)}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label="बंद करें (Close)"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 ring-1 ring-amber-300/30">
                <CompletionDiya />
              </div>
              <div className="min-w-0 pr-6">
                <p className="text-amber-300">
                  <span lang="hi" className="block text-sm font-bold">॥ अध्याय सम्पूर्ण ॥</span>
                  <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-amber-300/80">
                    Chapter complete
                  </span>
                </p>
                <p className="mt-1 truncate font-serif text-lg font-bold">
                  {chapterId}. {chapterTitle}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm">
              {celebration.streak > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 px-3 py-1 font-bold text-amber-200 ring-1 ring-orange-400/30">
                  <Flame className="flame-flicker h-4 w-4 text-orange-400" aria-hidden="true" />
                  {celebration.streak} दिन
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex justify-between text-xs text-white/70">
                  <span>ग्रंथ प्रगति</span>
                  <span>
                    {celebration.done} / {totalChapters}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: reduce ? 0 : 1, ease: 'easeOut', delay: 0.3 }}
                  />
                </div>
              </div>
            </div>

            {nextHref && (
              <Link
                href={nextHref}
                onClick={() => setCelebration(null)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-saffron-600 to-amber-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:from-saffron-500 hover:to-amber-400"
              >
                अगला अध्याय {chapterId + 1}
                {nextLabel ? ` · ${nextLabel}` : ''}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** A small clay diya whose flame flickers (still under reduced motion and the quiet modes). */
function CompletionDiya() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9" aria-hidden="true">
      <defs>
        <radialGradient id="cc-diya-glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cc-diya-flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="55%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#fffbeb" />
        </linearGradient>
        <linearGradient id="cc-diya-clay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c2410c" />
          <stop offset="100%" stopColor="#7c2d12" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="20" r="16" fill="url(#cc-diya-glow)" />
      <g className="flame-flicker" style={{ transformOrigin: '24px 30px' }}>
        <path d="M24 9c3.6 5 5.4 8.6 5.4 12a5.4 5.4 0 0 1-10.8 0c0-3.4 1.8-7 5.4-12z" fill="url(#cc-diya-flame)" />
        <path d="M24 17c1.5 2.2 2.2 3.8 2.2 5.2a2.2 2.2 0 0 1-4.4 0c0-1.4.7-3 2.2-5.2z" fill="#fffbeb" />
      </g>
      <path d="M6 29c4 0 6.5 1.2 18 1.2S38 29 42 29c-1.6 6.6-8.6 10.5-18 10.5S7.6 35.6 6 29z" fill="url(#cc-diya-clay)" />
      <path d="M8 29.4c5 1.6 27 1.6 32 0" stroke="#fdba74" strokeOpacity="0.55" strokeWidth="1" fill="none" />
    </svg>
  );
}
