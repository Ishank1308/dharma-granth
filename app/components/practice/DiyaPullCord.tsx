'use client';

import { useRef } from 'react';
import '@/app/styles/sadhana-objects.css';
import { motion, useMotionValue, useReducedMotion, useTransform, type PanInfo } from 'framer-motion';

/** How far the cord must be pulled before release lights (or dims) the lamp, px. */
const PULL = 48;
const MAX_PULL = 72;
const CORD = 46;

/**
 * A clay diya above a pull cord. Pull the cord down and let go (it springs back), or press it like a
 * button, and `onPull` runs: the meditation timer uses it to light the lamp and begin, or pause. `lit` shows the
 * flame. The visible Start/Pause button stays; this is an additional, tactile way in.
 */
export function DiyaPullCord({
  lit,
  onPull,
  label,
  still = false,
}: {
  lit: boolean;
  /** Hold the flame still (the timer's own calm-motion switch); the system setting is handled in CSS. */
  still?: boolean;
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
      {/* The lamp: a hand-thrown clay diya, its rolled rim, ghee or oil with a sheen, a cotton wick and, when lit,
          a layered flame that flickers, breathes warm light around it and now and then lets an ember rise. All
          motion is CSS (sadhana-objects.css) and stops under reduced motion and the quiet modes. */}
      <div className={`diya relative h-28 w-36${lit ? ' diya-lit' : ''}${still ? ' diya-still' : ''}`} aria-hidden="true">
        {lit && (
          <>
            <div className="diya-halo pointer-events-none absolute" />
            <div className="diya-embers pointer-events-none absolute">
              <span />
              <span />
              <span />
            </div>
          </>
        )}
        <svg viewBox="0 0 144 112" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id="diya-clay" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#c96a3a" />
              <stop offset="0.48" stopColor="#a44821" />
              <stop offset="1" stopColor="#4f1d0b" />
            </linearGradient>
            <linearGradient id="diya-clay-side" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#1a0702" stopOpacity="0.55" />
              <stop offset="0.3" stopColor="#1a0702" stopOpacity="0" />
              <stop offset="0.72" stopColor="#1a0702" stopOpacity="0" />
              <stop offset="1" stopColor="#1a0702" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="diya-rim" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#e9a172" />
              <stop offset="0.5" stopColor="#c46a3b" />
              <stop offset="1" stopColor="#8e3c19" />
            </linearGradient>
            <radialGradient id="diya-well" cx="55%" cy="35%" r="70%">
              <stop offset="0" stopColor="#5a2410" />
              <stop offset="1" stopColor="#2a0d04" />
            </radialGradient>
            <linearGradient id="diya-oil" x1="0" x2="1" y1="0" y2="0.3">
              <stop offset="0" stopColor="#3b2205" />
              <stop offset="0.55" stopColor="#8a5714" />
              <stop offset="1" stopColor="#d79b38" />
            </linearGradient>
            <radialGradient id="diya-warmth" cx="88%" cy="20%" r="70%">
              <stop offset="0" stopColor="#ffb347" stopOpacity="0.55" />
              <stop offset="0.5" stopColor="#ff8a2a" stopOpacity="0.14" />
              <stop offset="1" stopColor="#ff8a2a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="diya-flame-outer" cx="50%" cy="78%" r="70%">
              <stop offset="0" stopColor="#ffd27a" />
              <stop offset="0.55" stopColor="#ff8f1f" stopOpacity="0.9" />
              <stop offset="1" stopColor="#e2451a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="diya-flame-mid" cx="50%" cy="80%" r="62%">
              <stop offset="0" stopColor="#fff6d8" />
              <stop offset="0.5" stopColor="#ffd25a" />
              <stop offset="1" stopColor="#ffa31f" stopOpacity="0.6" />
            </radialGradient>
            <radialGradient id="diya-flame-core" cx="50%" cy="72%" r="60%">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.7" stopColor="#fff3c4" />
              <stop offset="1" stopColor="#ffe08a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="diya-flame-base" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#5b8cff" stopOpacity="0.75" />
              <stop offset="1" stopColor="#3a5fd9" stopOpacity="0" />
            </radialGradient>
            <filter id="diya-soft" x="-40%" y="-30%" width="180%" height="160%">
              <feGaussianBlur stdDeviation="1.6" />
            </filter>
            <filter id="diya-grain" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n" />
              <feDiffuseLighting in="n" surfaceScale="0.45" diffuseConstant="1.2" lightingColor="#ffffff" result="lit">
                <feDistantLight azimuth="235" elevation="58" />
              </feDiffuseLighting>
              <feComposite in="lit" in2="SourceGraphic" operator="arithmetic" k1="0.5" k2="0" k3="0.56" k4="0" result="clay" />
              <feComposite in="clay" in2="SourceAlpha" operator="in" />
            </filter>
          </defs>

          {/* Soft shadow under the lamp */}
          <ellipse cx="66" cy="99" rx="40" ry="4.5" fill="#1a0a04" opacity="0.22" filter="url(#diya-soft)" />

          {/* Clay body and the pinched spout; an incised line runs round it */}
          <g filter="url(#diya-grain)">
            <path d="M17 60 C 19 84, 45 97, 66 97 C 90 97, 110 82, 124 55 L 118 53 C 100 60, 40 60, 17 60 Z" fill="url(#diya-clay)" />
            <path d="M17 60 C 19 84, 45 97, 66 97 C 90 97, 110 82, 124 55 L 118 53 C 100 60, 40 60, 17 60 Z" fill="url(#diya-clay-side)" />
            <path d="M23 73 C 40 83, 88 84, 112 69" fill="none" stroke="#3a1206" strokeOpacity="0.55" strokeWidth="1.2" />
            <path d="M23 74.6 C 40 84.6, 88 85.6, 112 70.6" fill="none" stroke="#f0a676" strokeOpacity="0.28" strokeWidth="0.8" />
            {/* Rolled rim, with the spout drawn out to the right */}
            <path
              d="M16 59 C 16 48, 40 44, 64 44 C 82 44, 98 46, 108 50 C 115 48, 123 45, 131 43 C 127 52, 118 61, 108 65 C 97 71, 82 73, 64 73 C 40 73, 16 70, 16 59 Z"
              fill="url(#diya-rim)"
            />
          </g>
          {/* The well, and the oil in it */}
          <path
            d="M24 59 C 24 51, 43 48.5, 64 48.5 C 81 48.5, 96 50.5, 105 53.5 C 111 52, 118 50, 124 48.5 C 120 54, 113 59, 105 62 C 95 66.5, 81 68.5, 64 68.5 C 43 68.5, 24 66, 24 59 Z"
            fill="url(#diya-well)"
          />
          <path
            d="M28 60.5 C 32 55.5, 48 54, 64 54 C 80 54, 96 55.5, 106 57.5 C 99 62.5, 83 65.5, 64 65.5 C 46 65.5, 30 63.8, 28 60.5 Z"
            fill="url(#diya-oil)"
          />
          {/* Oil sheen: a long soft highlight, and a glint of the flame when lit */}
          <path d="M40 57.4 C 52 55.6, 74 55.4, 92 56.6" fill="none" stroke="#fff4dc" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" filter="url(#diya-soft)" />
          <ellipse cx="54" cy="57.4" rx="7" ry="0.9" fill="#ffffff" opacity="0.6" />
          {lit && <ellipse className="diya-glint" cx="100" cy="58.6" rx="6" ry="1.6" fill="#ffd27a" opacity="0.85" filter="url(#diya-soft)" />}
          {/* Highlight along the front of the rim */}
          <path d="M20 62 C 26 68, 46 71, 66 71 C 84 71, 98 68, 108 63" fill="none" stroke="#ffd2ad" strokeOpacity="0.45" strokeWidth="1" strokeLinecap="round" />
          {/* Cotton wick: lies in the oil and rises at the spout; the tip is charred */}
          <path d="M92 58.5 C 104 57, 114 52, 121 45.5" fill="none" stroke="#efe4cc" strokeWidth="3" strokeLinecap="round" />
          <path d="M92 58.5 C 104 57, 114 52, 121 45.5" fill="none" stroke="#c9b48c" strokeWidth="3" strokeDasharray="1.2 1.8" strokeOpacity="0.45" />
          <path d="M119.6 47 L 122.8 42.6" stroke="#1f140c" strokeWidth="3.2" strokeLinecap="round" />
          {/* Light of the flame falling on the rim and spout */}
          {lit && <path className="diya-warmth" d="M16 59 C 16 48, 40 44, 64 44 C 82 44, 98 46, 108 50 C 115 48, 123 45, 131 43 C 127 52, 118 61, 108 65 C 97 71, 82 73, 64 73 C 40 73, 16 70, 16 59 Z" fill="url(#diya-warmth)" />}

          {/* The flame: outer veil, bright body, white core and a blue root at the wick */}
          {lit && (
            <g className="diya-flame-sway">
              <path className="diya-flame-outer" d="M123 46 C 111 41, 111 27, 116 17 C 119 11, 122 6, 123.5 -2 C 127 8, 134 19, 134 30 C 134 40, 130 46, 123 46 Z" fill="url(#diya-flame-outer)" filter="url(#diya-soft)" />
              <path className="diya-flame-mid" d="M123 45 C 115 41, 115 31, 118.5 23 C 120.5 18, 122.5 13, 123.5 7 C 126 14, 130.5 22, 130.5 31 C 130.5 39.5, 128 45, 123 45 Z" fill="url(#diya-flame-mid)" />
              <path className="diya-flame-core" d="M123.4 44 C 119.5 41.5, 119.5 35, 121.5 30 C 122.4 27.5, 123.2 25, 123.7 22 C 125 26, 127.2 31, 127.2 36 C 127.2 41, 125.8 44, 123.4 44 Z" fill="url(#diya-flame-core)" />
              <ellipse cx="123.2" cy="43.6" rx="3.4" ry="2.4" fill="url(#diya-flame-base)" />
              <circle cx="122.4" cy="43.6" r="1.2" fill="#ff5a1a" />
            </g>
          )}
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
