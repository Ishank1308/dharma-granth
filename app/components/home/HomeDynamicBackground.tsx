'use client';

import { useEffect, useRef } from 'react';

/**
 * Dynamic Fluid Sanctuary Background (प्राण धारा / Prana Flow Canvas)
 *
 * Renders an organic, fluid multi-layer ambient background:
 * 1. Three gently undulating, morphing celestial fluid blobs (Solar, Amrita, Sandalwood)
 * 2. Subtle fluid river wave shimmer (Ganga Stream) across the horizon
 * 3. Interactive fluid wake: a soft luminous node that smoothly tracks pointer movement with lerp inertia
 *
 * Fully hardware-accelerated, theme-reactive, zero layout reflows, and strictly quieted
 * under prefers-reduced-motion, low-power mode, and lite-mode.
 */
export function HomeDynamicBackground() {
  const pointerBlobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.documentElement;

    const isQuiet = () => {
      const d = root.dataset;
      return (
        !fine.matches ||
        reduce.matches ||
        d.lowPower === 'true' ||
        d.dataSaver === 'true' ||
        d.liteMode === 'true' ||
        d.readingLite === 'true'
      );
    };

    if (isQuiet()) return;

    let targetX = window.innerWidth / 2;
    let targetY = 320;
    let currentX = targetX;
    let currentY = targetY;
    let rafId: number | null = null;
    let isMoving = false;

    const updatePosition = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      // Lerp interpolation (damping factor 0.06 for silk-smooth fluid feel)
      currentX += dx * 0.06;
      currentY += dy * 0.06;

      if (pointerBlobRef.current) {
        pointerBlobRef.current.style.transform = `translate3d(${currentX - 200}px, ${currentY - 200}px, 0)`;
      }

      // If still moving, continue RAF loop
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        rafId = requestAnimationFrame(updatePosition);
      } else {
        isMoving = false;
        rafId = null;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      targetX = e.clientX;
      targetY = e.clientY + window.scrollY;

      if (!isMoving) {
        isMoving = true;
        rafId = requestAnimationFrame(updatePosition);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div className="prana-fluid-stage" aria-hidden="true" data-decorative>
      {/* Blob 1: Solar Prana / सौर्य तेज (Top-Left) */}
      <div
        className="prana-blob prana-blob-1 -left-28 -top-28 h-[540px] w-[580px] bg-gradient-to-tr from-amber-500/25 via-saffron-500/20 to-orange-400/15 dark:from-indigo-600/20 dark:via-purple-700/15 dark:to-blue-500/10"
        style={{ '--prana-opacity': '0.24' } as React.CSSProperties}
      />

      {/* Blob 2: Amrita Dawn / अमृत प्रवाह (Top-Right) */}
      <div
        className="prana-blob prana-blob-2 -right-24 -top-16 h-[580px] w-[620px] bg-gradient-to-br from-rose-400/20 via-amber-300/15 to-transparent dark:from-cyan-500/20 dark:via-blue-600/15 dark:to-transparent"
        style={{ '--prana-opacity': '0.22' } as React.CSSProperties}
      />

      {/* Blob 3: Central Sanctuary Glow / काल ज्योति (Mid-Page) */}
      <div
        className="prana-blob prana-blob-3 left-[15%] top-[40%] h-[680px] w-[720px] bg-gradient-to-r from-amber-400/15 via-saffron-600/15 to-yellow-500/10 dark:from-blue-700/15 dark:via-indigo-800/15 dark:to-teal-600/10"
        style={{ '--prana-opacity': '0.18' } as React.CSSProperties}
      />

      {/* Interactive Fluid Wake / स्पर्श तेज (Follows pointer smoothly) */}
      <div
        ref={pointerBlobRef}
        className="prana-blob pointer-events-none hidden h-[400px] w-[400px] bg-gradient-to-r from-dharma-saffron/15 to-amber-400/10 dark:from-cyan-400/15 dark:to-indigo-500/15 sm:block"
        style={{
          transform: 'translate3d(40vw, 280px, 0)',
          filter: 'blur(70px)',
          opacity: 0.16,
        }}
      />

      {/* Undulating River of Wisdom (Ganga Stream Wave) */}
      <div className="prana-wave-stream absolute -top-8 left-0 w-[120%] opacity-40 dark:opacity-20">
        <svg
          viewBox="0 0 1440 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-44 preserve-3d"
          preserveAspectRatio="none"
        >
          <path
            d="M0,64 C240,128 480,0 720,64 C960,128 1200,32 1440,64 L1440,0 L0,0 Z"
            fill="url(#prana-grad-1)"
          />
          <path
            d="M0,96 C320,16 640,128 960,48 C1280,-16 1360,80 1440,96 L1440,0 L0,0 Z"
            fill="url(#prana-grad-2)"
            opacity="0.5"
          />
          <defs>
            <linearGradient id="prana-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--dharma-saffron)" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.14" />
              <stop offset="100%" stopColor="var(--dharma-saffron)" stopOpacity="0.06" />
            </linearGradient>
            <linearGradient id="prana-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" stopOpacity="0.06" />
              <stop offset="70%" stopColor="#eab308" stopOpacity="0.09" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

