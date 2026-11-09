'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useSheetGesture } from '@/lib/useSheetGesture';
import { useReaderSettings } from '@/lib/useReaderSettings';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

/**
 * The reader's one dialog. On phones it is a bottom sheet; from `sm` up it is
 * a side panel (`side`) or a centred modal (`modal`). The phone sheet rises on a
 * spring and can be pulled down by its title bar to close (lib/useSheetGesture). Modal behaviour is
 * complete: Escape and the backdrop close it, Tab stays inside, the page
 * behind does not scroll, and focus returns to whatever opened it.
 */
export function ReaderDialog({
  open,
  onClose,
  title,
  titleHi,
  icon,
  variant = 'modal',
  footer,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  titleHi?: string;
  icon?: ReactNode;
  variant?: 'side' | 'modal';
  footer?: ReactNode;
  children: ReactNode;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const { panel, handle } = useSheetGesture(onClose, panelRef);
  const { reducedMotion } = useReaderSettings();

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Focus the panel itself first so a screen reader announces the title.
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = previousOverflow;
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  const placement =
    variant === 'side'
      ? 'inset-x-0 bottom-0 max-h-[88dvh] rounded-t-3xl sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-full sm:max-w-md sm:rounded-none sm:rounded-l-3xl'
      : 'inset-x-0 bottom-0 max-h-[88dvh] rounded-t-3xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:max-h-[calc(100dvh-1.5rem)] sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl';

  return (
    // The reader's own reduce-motion setting, as well as the device's (this dialog loads on its own chunk).
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            aria-hidden="true"
            className="absolute inset-0 bg-stone-950/55 backdrop-blur-[2px]"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            {...panel}
            className={`absolute flex flex-col overflow-hidden border border-dharma-border bg-dharma-card shadow-2xl outline-none ${placement}`}
          >
            <div {...handle} className="shrink-0">
              <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-dharma-border sm:hidden" aria-hidden="true" />
              <div className="flex items-start justify-between gap-3 border-b border-dharma-border/70 px-5 pb-3 pt-3 sm:pt-5">
                <h2 id={titleId} className="flex min-w-0 items-center gap-2.5 font-serif text-lg font-bold text-dharma-text">
                  {icon}
                  <span className="min-w-0">
                    {title}
                    {titleHi && (
                      <span lang="hi" className="ml-2 inline-block font-devanagari text-base font-normal text-dharma-muted">
                        {titleHi}
                      </span>
                    )}
                  </span>
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="focus-ring -mr-2 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-dharma-muted transition hover:text-dharma-text"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>
            {footer && <div className="border-t border-dharma-border/70 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </MotionConfig>
  );
}
