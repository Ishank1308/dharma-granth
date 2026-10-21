'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { SwipeGestureState } from '@/lib/useSwipeGesture';
import { toAsciiDigits } from '@/lib/verse-format';

interface MobileSwipeIndicatorProps {
  gestureState: SwipeGestureState;
  prevNumber?: number | string;
  nextNumber?: number | string;
}

export function MobileSwipeIndicator({
  gestureState,
  prevNumber,
  nextNumber,
}: MobileSwipeIndicatorProps) {
  const { isSwiping, direction, thresholdMet, progress } = gestureState;

  if (!isSwiping || !direction) return null;

  const isNext = direction === 'next';
  const targetNumber = isNext ? nextNumber : prevNumber;

  if (!targetNumber) {
    // Boundary resistance cue
    return (
      <aside
        aria-hidden="true"
        className={`pointer-events-none fixed inset-y-0 z-50 flex items-center px-3 transition-opacity ${
          isNext ? 'right-0' : 'left-0'
        }`}
        style={{ opacity: Math.min(progress, 0.45) }}
      >
        <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-950/80 px-3.5 py-1.5 text-xs font-semibold text-amber-200 shadow-xl backdrop-blur-md">
          <span>{isNext ? 'अध्याय का अंतिम श्लोक' : 'अध्याय का प्रथम श्लोक'}</span>
        </div>
      </aside>
    );
  }

  return (
    <aside
      aria-hidden="true"
      className={`pointer-events-none fixed inset-y-0 z-50 flex items-center px-4 transition-transform ${
        isNext ? 'right-0 justify-end' : 'left-0 justify-start'
      }`}
      style={{
        transform: `translateX(${isNext ? (1 - progress) * 20 : -(1 - progress) * 20}px)`,
        opacity: Math.max(0.2, progress),
      }}
    >
      <div
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-2xl backdrop-blur-lg transition-all ${
          thresholdMet
            ? 'scale-110 border-saffron-500 bg-gradient-to-r from-saffron-600 to-amber-600 text-white ring-4 ring-saffron-500/20'
            : 'border-dharma-border/80 bg-dharma-card/95 text-dharma-text'
        }`}
      >
        {!isNext && <ArrowLeft className="h-4 w-4 shrink-0 animate-pulse text-current" />}
        <span className="font-devanagari">
          {isNext ? 'अगला श्लोक' : 'पिछला श्लोक'}{' '}
          <strong className="font-bold underline decoration-saffron-300">
            {toAsciiDigits(targetNumber)}
          </strong>
        </span>
        {isNext && <ArrowRight className="h-4 w-4 shrink-0 animate-pulse text-current" />}
      </div>
    </aside>
  );
}
