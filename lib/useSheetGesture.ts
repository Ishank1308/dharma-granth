'use client';

import { useEffect, useState, useRef, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';
import { motionAllowed } from '@/lib/view-transition';

/** Phones get the sheet; from `sm` (640px) up the dialogs keep their panel or modal shape. */
const SHEET_QUERY = '(max-width: 639.98px)';

/** Dragged this far down (share of the sheet's height), or flicked this fast, the sheet closes. */
const CLOSE_SHARE = 0.28;
const CLOSE_VELOCITY = 600;

/**
 * A bottom sheet gesture handler that uses native pointer events instead of framer-motion (saving 42 KB gzip).
 * On phones, dragging down the handle or title area translates the sheet; releasing past the threshold
 * or flicking calls `onClose()`; letting go short of the line springs it back via CSS.
 */
export function useSheetGesture(
  onClose: () => void,
  panelRef: RefObject<HTMLElement | null>,
  sheetQuery = SHEET_QUERY,
) {
  const [sheet, setSheet] = useState(false);
  const startYRef = useRef<number | null>(null);
  const lastYRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia(sheetQuery);
    const sync = () => setSheet(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [sheetQuery]);

  const fluid = sheet && motionAllowed();

  const handlePointerDown = (e: ReactPointerEvent) => {
    if (!fluid || !panelRef.current) return;
    if ((e.target as Element).closest('button, a, input, select, textarea')) return;

    startYRef.current = e.clientY;
    lastYRef.current = e.clientY;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    isDraggingRef.current = true;

    try {
      (e.target as Element).setPointerCapture(e.pointerId);
    } catch {}

    panelRef.current.style.transition = 'none';
  };

  const handlePointerMove = (e: ReactPointerEvent) => {
    if (!isDraggingRef.current || startYRef.current === null || !panelRef.current) return;

    const currentY = e.clientY;
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      velocityRef.current = ((currentY - lastYRef.current) / dt) * 1000;
    }
    lastYRef.current = currentY;
    lastTimeRef.current = now;

    const dy = Math.max(0, currentY - startYRef.current);
    panelRef.current.style.transform = `translate3d(0, ${dy}px, 0)`;
  };

  const handlePointerUpOrCancel = (e: ReactPointerEvent) => {
    if (!isDraggingRef.current || startYRef.current === null || !panelRef.current) return;
    isDraggingRef.current = false;

    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {}

    const panel = panelRef.current;
    const currentY = e.clientY;
    const dy = Math.max(0, currentY - startYRef.current);
    const height = panel.offsetHeight || window.innerHeight * 0.6;
    const velocity = velocityRef.current;

    startYRef.current = null;

    if (dy > height * CLOSE_SHARE || velocity > CLOSE_VELOCITY) {
      panel.style.transition = 'transform var(--duration-fast) var(--ease-in)';
      panel.style.transform = 'translate3d(0, 100%, 0)';
      setTimeout(onClose, 180);
    } else {
      panel.style.transition = 'transform var(--duration-base) var(--motion-spring)';
      panel.style.transform = '';
      setTimeout(() => {
        if (panel) panel.style.transition = '';
      }, 300);
    }
  };

  const handle = fluid
    ? {
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUpOrCancel,
        onPointerCancel: handlePointerUpOrCancel,
        style: { touchAction: 'none' as const, cursor: 'grab' },
      }
    : {};

  return { fluid, panel: {}, handle };
}
