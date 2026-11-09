'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { CheckCircle2 } from 'lucide-react';
import { triggerTactileFeedback } from '@/lib/haptics';
import {
  isChapterCompleted,
  markChapterCompleted,
  readActiveStreak,
} from '@/lib/reading-history';
import { PushpaVrishti } from '@/app/components/motion/PushpaVrishti';
import { useReducedMotionPreference } from '@/lib/useReducedMotionPreference';

// The toast (and the framer-motion it animates with) loads only when a chapter is finished.
const ChapterCelebrationToast = dynamic(() => import('./ChapterCelebrationToast').then((m) => m.ChapterCelebrationToast), { ssr: false });

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
  const reduce = useReducedMotionPreference();
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

      {celebration && (
        <ChapterCelebrationToast
          celebration={celebration}
          percent={percent}
          onClose={() => setCelebration(null)}
          chapterId={chapterId}
          chapterTitle={chapterTitle}
          totalChapters={totalChapters}
          nextHref={nextHref}
          nextLabel={nextLabel}
          reduce={reduce}
        />
      )}
    </>
  );
}
