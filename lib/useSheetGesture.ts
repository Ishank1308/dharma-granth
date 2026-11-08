'use client';

import { useEffect, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';
import { useDragControls, type PanInfo } from 'framer-motion';
import { motionAllowed } from '@/lib/view-transition';
import { SPRINGS } from '@/app/components/motion/primitives';

/** Phones get the sheet; from `sm` (640px) up the dialogs keep their panel or modal shape. */
const SHEET_QUERY = '(max-width: 639.98px)';

/** Dragged this far down (share of the sheet's height), or flicked this fast, the sheet closes. */
const CLOSE_SHARE = 0.28;
const CLOSE_VELOCITY = 600;

/** The sheet follows the finger downward one to one; upward it barely gives, like a sheet at its full height. */
const DRAG_ELASTIC = { top: 0.06, bottom: 1 };

/**
 * A bottom sheet that behaves like one: on phones it rises from the bottom edge on the site's
 * spring, and it can be pulled down by its grabber or title bar to close. Let go short of the
 * line and it springs back. Spread `panel` on the sheet's motion.div and `handle` on the
 * grabber and title area (not on the scrolling content, so lists still scroll).
 *
 * Under reduced motion and the quiet modes it stays the plain fade it was, with no drag; Escape,
 * the backdrop and the close button always work, so the gesture is never the only way out.
 */
export function useSheetGesture(
  onClose: () => void,
  panelRef: RefObject<HTMLElement | null>,
  /** Widths at which the panel is a bottom sheet; the reader's dialogs become modals from `sm`. */
  sheetQuery = SHEET_QUERY,
) {
  const controls = useDragControls();
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(sheetQuery);
    const sync = () => setSheet(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [sheetQuery]);

  // Read at render, so turning on a quiet mode takes effect the next time a sheet opens.
  const fluid = sheet && motionAllowed();

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const height = panelRef.current?.offsetHeight ?? window.innerHeight * 0.6;
    if (info.offset.y > height * CLOSE_SHARE || info.velocity.y > CLOSE_VELOCITY) onClose();
  };

  const panel = fluid
    ? {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%', transition: { duration: 0.24, ease: [0.4, 0, 1, 1] as const } },
        transition: SPRINGS.settle,
        drag: 'y' as const,
        dragListener: false,
        dragControls: controls,
        dragConstraints: { top: 0, bottom: 0 },
        dragElastic: DRAG_ELASTIC,
        dragMomentum: false,
        dragTransition: { bounceStiffness: 420, bounceDamping: 36 },
        onDragEnd,
      }
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 24 },
        transition: { duration: 0.2 },
      };

  const handle = fluid
    ? {
        onPointerDown: (e: ReactPointerEvent) => {
          // The close button sits in the title bar; a tap on it should stay a tap.
          if ((e.target as Element).closest('button, a, input, select, textarea')) return;
          controls.start(e);
        },
        style: { touchAction: 'none' as const, cursor: 'grab' },
      }
    : {};

  return { fluid, panel, handle };
}
