'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { plural } from '@/lib/library';
import { useSheetGesture } from '@/lib/useSheetGesture';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, summary, [tabindex]:not([tabindex="-1"])';

/**
 * Mobile bottom sheet for the filters. Modal: Escape and the backdrop close
 * it, Tab stays inside, the page behind does not scroll, and focus returns to
 * the button that opened it.
 */
export function FilterSheet({
  open,
  onClose,
  resultCount,
  activeCount,
  onClear,
  children,
}: {
  open: boolean;
  onClose: () => void;
  resultCount: number;
  activeCount: number;
  onClear: () => void;
  children: ReactNode;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const { panel, handle } = useSheetGesture(onClose, sheetRef, '(max-width: 1023.98px)');

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    sheetRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !sheetRef.current) return;
      const items = Array.from(sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === sheetRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Filter scriptures"
            tabIndex={-1}
            {...panel}
            className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-3xl border-t border-dharma-border bg-dharma-card shadow-2xl outline-none"
          >
            <div {...handle} className="shrink-0">
              <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-dharma-border" aria-hidden="true" />
              <div className="flex items-center justify-between px-5 pb-2 pt-3">
                <h2 className="font-serif text-xl font-bold text-dharma-text">
                  Filters{' '}
                  <span lang="hi" className="ml-1 font-devanagari text-base font-normal text-dharma-muted">
                    फ़िल्टर
                  </span>
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close filters"
                  className="focus-ring flex h-11 w-11 items-center justify-center rounded-full text-dharma-muted hover:text-dharma-text"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3">{children}</div>
            <div className="flex shrink-0 items-center gap-3 border-t border-dharma-border bg-dharma-card px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={onClear}
                disabled={activeCount === 0}
                className="focus-ring min-h-[48px] rounded-full px-4 text-sm font-semibold text-dharma-text underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={onClose}
                className="focus-ring min-h-[48px] flex-1 rounded-full bg-saffron-700 px-5 text-sm font-semibold text-white hover:bg-saffron-800"
              >
                Show {plural(resultCount, 'text')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
