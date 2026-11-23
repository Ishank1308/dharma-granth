'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { triggerTactileFeedbackLazy as triggerTactileFeedback } from './haptics-lazy';

export interface SwipeGestureOptions {
  onSwipeNext?: () => void;
  onSwipePrev?: () => void;
  canNext?: boolean;
  canPrev?: boolean;
  threshold?: number;
  velocityThreshold?: number;
  disabled?: boolean;
}

export interface SwipeGestureState {
  isSwiping: boolean;
  deltaX: number;
  deltaY: number;
  direction: 'next' | 'prev' | null;
  thresholdMet: boolean;
  progress: number; // 0 to 1
}

const DEFAULT_THRESHOLD = 72; // pixels
const LOCK_AXIS_THRESHOLD = 12; // pixels before deciding vertical vs horizontal

/**
 * Universal Mobile Gesture Hook with Tactile Haptic Resistance
 *
 * Distinctive features:
 * - Direction-locking: vertical scrolling is NEVER hijacked; horizontal swipe is only engaged
 *   once horizontal movement is unambiguously dominant.
 * - Haptic "notch": triggers a crisp physical vibration right at the threshold moment,
 *   communicating to the seeker's thumb that release will trigger navigation.
 * - Elastic boundary resistance if previous or next verses do not exist.
 */
export function useSwipeGesture({
  onSwipeNext,
  onSwipePrev,
  canNext = true,
  canPrev = true,
  threshold = DEFAULT_THRESHOLD,
  disabled = false,
}: SwipeGestureOptions) {
  const [gestureState, setGestureState] = useState<SwipeGestureState>({
    isSwiping: false,
    deltaX: 0,
    deltaY: 0,
    direction: null,
    thresholdMet: false,
    progress: 0,
  });

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isHorizontalRef = useRef<boolean | null>(null);
  const thresholdPassedRef = useRef(false);

  const resetState = useCallback(() => {
    touchStartRef.current = null;
    isHorizontalRef.current = null;
    thresholdPassedRef.current = false;
    setGestureState({
      isSwiping: false,
      deltaX: 0,
      deltaY: 0,
      direction: null,
      thresholdMet: false,
      progress: 0,
    });
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent | TouchEvent) => {
      if (disabled || e.touches.length !== 1) return;
      // A tap on a control must not turn the page.
      const target = e.target;
      if (target instanceof Element && target.closest('a, button, input, textarea, select, label, [role="slider"]')) {
        return;
      }
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      isHorizontalRef.current = null;
      thresholdPassedRef.current = false;
    },
    [disabled],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent | TouchEvent) => {
      if (disabled || !touchStartRef.current || e.touches.length !== 1) return;

      const touch = e.touches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      // Determine axis lock if undecided
      if (isHorizontalRef.current === null) {
        if (absX > LOCK_AXIS_THRESHOLD || absY > LOCK_AXIS_THRESHOLD) {
          if (absX > absY * 1.3) {
            isHorizontalRef.current = true;
          } else {
            // Predominantly vertical scrolling — relinquish control to the browser
            isHorizontalRef.current = false;
            return;
          }
        } else {
          return;
        }
      }

      // If locked into vertical scroll, do not interfere
      if (!isHorizontalRef.current) return;

      // Determine intended navigation direction:
      // Swiping left (dx < 0) -> Next verse
      // Swiping right (dx > 0) -> Previous verse
      const dir: 'next' | 'prev' | null = dx < 0 ? 'next' : dx > 0 ? 'prev' : null;
      const isAllowed = (dir === 'next' && canNext) || (dir === 'prev' && canPrev);

      // Apply resistance if boundary reached (no next or no prev)
      const effectiveDx = isAllowed ? dx : dx * 0.28;
      const effectiveDist = Math.abs(effectiveDx);
      const isMet = effectiveDist >= threshold && isAllowed;
      const progress = Math.min(1, effectiveDist / threshold);

      // Trigger crisp tactile notch when crossing the threshold boundary
      if (isMet && !thresholdPassedRef.current) {
        thresholdPassedRef.current = true;
        triggerTactileFeedback('selection', 'click');
      } else if (!isMet && thresholdPassedRef.current) {
        thresholdPassedRef.current = false;
      }

      setGestureState({
        isSwiping: true,
        deltaX: effectiveDx,
        deltaY: dy,
        direction: dir,
        thresholdMet: isMet,
        progress,
      });
    },
    [canNext, canPrev, disabled, threshold],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent | TouchEvent) => {
      if (disabled || !touchStartRef.current || isHorizontalRef.current !== true) {
        resetState();
        return;
      }

      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dt = Math.max(1, Date.now() - touchStartRef.current.time);
      const velocityX = Math.abs(dx) / dt; // px/ms

      const dir = dx < 0 ? 'next' : 'prev';
      const isAllowed = (dir === 'next' && canNext) || (dir === 'prev' && canPrev);
      const dist = Math.abs(dx);

      // Either dragged past distance threshold OR flicked quickly (>0.45 px/ms with >35px distance)
      const passedByDistance = dist >= threshold;
      const passedByVelocity = velocityX > 0.65 && dist >= 64;

      if (isAllowed && (passedByDistance || passedByVelocity)) {
        triggerTactileFeedback('medium', 'softTap');
        if (dir === 'next' && onSwipeNext) {
          onSwipeNext();
        } else if (dir === 'prev' && onSwipePrev) {
          onSwipePrev();
        }
      }

      resetState();
    },
    [canNext, canPrev, disabled, onSwipeNext, onSwipePrev, resetState, threshold],
  );

  return {
    gestureState,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: resetState,
    },
  };
}
