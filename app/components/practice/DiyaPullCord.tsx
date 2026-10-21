'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useTransform, type PanInfo } from 'framer-motion';

/** How far the cord must be pulled before release lights (or dims) the lamp, px. */
const PULL = 48;
const MAX_PULL = 72;
const CORD = 46;

/**
 * A brass diya hanging from a pull cord. Pull the cord down and let go (it springs back), or press it like a
 * button, and `onPull` runs: the meditation timer uses it to light the lamp and begin, or pause. `lit` shows the
 * flame. The visible Start/Pause button stays; this is an additional, tactile way in.
 */
export function DiyaPullCord({
  lit,
  onPull,
  label,
}: {
  lit: boolean;
  onPull: () => void;
  /** Accessible name, e.g. "Light the diya and begin". */
  label: string;
}) {
  const reduce = useReducedMotion();
  const y = useMotionValue(0);
  const cordHeight = useTransform(y, (v) => CORD + Math.max(0, v));
  // When the last drag ended: the browser fires a click for that same gesture, which must not count twice.
  // Time-based, so a later keyboard press (no pointer-down) always works.
  const dragEndedAtRef = useRef(0);

  const onDragEnd = (_: PointerEvent, info: PanInfo) => {
    dragEndedAtRef.current = performance.now();
    if (info.offset.y >= PULL) {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') navigator.vibrate(10);
      onPull();
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* The lamp */}
      <div className="relative h-20 w-28" aria-hidden="true">
        {lit && (
          <div className="pointer-events-none absolute left-1/2 top-2 h-20 w-20 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.45),rgba(234,88,12,0.12)_45%,transparent_70%)] blur-sm" />
        )}
        <svg viewBox="0 0 112 80" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="diya-brass" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#e9b86a" />
              <stop offset="0.55" stopColor="#b7792f" />
              <stop offset="1" stopColor="#6e3f16" />
            </linearGradient>
            <radialGradient id="diya-flame" cx="50%" cy="70%" r="65%">
              <stop offset="0" stopColor="#fff7d6" />
              <stop offset="0.45" stopColor="#fbbf24" />
              <stop offset="1" stopColor="#ea580c" stopOpacity="0.85" />
            </radialGradient>
          </defs>
          {/* Wick */}
          <path d="M70 46 q4 -4 6 -9" stroke="#3b2414" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Flame: only when lit */}
          {lit && (
            <path
              className={reduce ? undefined : 'diya-flame'}
              d="M76 37 C 70 29, 74 18, 78 10 C 82 18, 86 29, 80 37 Z"
              fill="url(#diya-flame)"
            />
          )}
          {/* Bowl with its spout */}
          <path d="M14 46 Q 56 40 92 44 L 104 40 Q 100 50 88 54 Q 56 70 24 58 Q 12 54 14 46 Z" fill="url(#diya-brass)" />
          <ellipse cx="54" cy="46" rx="40" ry="5" fill="#3b2414" opacity="0.55" />
          <path d="M22 50 Q 54 62 86 51" stroke="#f3d39a" strokeOpacity="0.45" strokeWidth="1.5" fill="none" />
          {/* Foot */}
          <path d="M44 64 L 66 64 L 70 72 L 40 72 Z" fill="url(#diya-brass)" />
        </svg>
      </div>

      {/* The cord: stretches as the knob is pulled, springs back on release. */}
      <motion.div aria-hidden="true" className="w-px bg-gradient-to-b from-amber-700/70 to-amber-600/40" style={{ height: cordHeight }} />
      <motion.button
        type="button"
        aria-label={label}
        aria-pressed={lit}
        drag="y"
        dragConstraints={{ top: 0, bottom: MAX_PULL }}
        dragElastic={0.12}
        dragSnapToOrigin
        dragTransition={reduce ? { bounceStiffness: 1000, bounceDamping: 100 } : { bounceStiffness: 520, bounceDamping: 16 }}
        style={{ y }}
        onDragEnd={onDragEnd}
        onClick={() => {
          if (performance.now() - dragEndedAtRef.current > 300) onPull();
        }}
        className="-mt-px flex h-11 w-11 cursor-grab touch-none items-start justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 active:cursor-grabbing"
      >
        <span className="mt-0.5 block h-5 w-3.5 rounded-b-full rounded-t-sm bg-gradient-to-b from-amber-400 to-amber-700 shadow-md" />
      </motion.button>
      <p className="mt-1 text-[11px] text-dharma-muted">
        <span lang="hi">{lit ? 'डोरी खींचें · विराम' : 'डोरी खींचें · दीप जलाएँ'}</span>
        <span className="sr-only">. </span>
        <span className="ml-1">{lit ? 'Pull to pause' : 'Pull to light and begin'}</span>
      </p>
    </div>
  );
}
