'use client';

import { useEffect } from 'react';

/**
 * Drives the 3D tilt on every `[data-tilt]` card (styles in app/motion.css). One passive pointermove
 * listener on the document, at most one style write per animation frame, and only for a fine pointer
 * (mouse or trackpad) without reduced motion or a lite mode. Cards rendered later, after client-side
 * navigation, work without registering anything.
 */
export function MotionLayer() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.documentElement;

    let active: HTMLElement | null = null;
    let rect: DOMRect | null = null;
    let frame = 0;
    let px = 0;
    let py = 0;

    const quiet = () => {
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

    const release = () => {
      if (!active) return;
      active.removeAttribute('data-tilting');
      active.style.removeProperty('--tilt-x');
      active.style.removeProperty('--tilt-y');
      active = null;
      rect = null;
    };

    const apply = () => {
      frame = 0;
      if (!active || !rect) return;
      const x = Math.min(1, Math.max(-1, ((px - rect.left) / rect.width) * 2 - 1));
      const y = Math.min(1, Math.max(-1, ((py - rect.top) / rect.height) * 2 - 1));
      active.style.setProperty('--tilt-x', x.toFixed(3));
      active.style.setProperty('--tilt-y', y.toFixed(3));
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || quiet()) {
        release();
        return;
      }
      const target = e.target instanceof Element ? (e.target.closest('[data-tilt]') as HTMLElement | null) : null;
      if (target !== active) {
        release();
        if (!target) return;
        active = target;
        // Measured once on entry, before the card leans, so the lean never feeds back into the maths.
        rect = target.getBoundingClientRect();
        target.setAttribute('data-tilting', '');
      }
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => release();

    document.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerleave', onLeave);
    window.addEventListener('scroll', onLeave, { passive: true });
    window.addEventListener('blur', onLeave);
    return () => {
      document.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onLeave);
      window.removeEventListener('blur', onLeave);
      if (frame) cancelAnimationFrame(frame);
      release();
    };
  }, []);

  return null;
}
