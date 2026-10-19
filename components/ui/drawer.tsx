'use client';

import React, { useEffect, useRef, forwardRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  position?: 'bottom' | 'right' | 'left';
  showCloseButton?: boolean;
  className?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  position = 'bottom',
  showCloseButton = true,
  className,
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  // Scroll locking & Focus trap & Escape dismissal
  useEffect(() => {
    if (!open) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Initial focus into drawer
    const timer = setTimeout(() => {
      if (drawerRef.current) {
        const firstFocusable = drawerRef.current.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [open, onClose]);

  const slideVariants = {
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
    },
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            ref={drawerRef}
            initial={reduceMotion ? { opacity: 0 } : slideVariants[position].initial}
            animate={reduceMotion ? { opacity: 1 } : slideVariants[position].animate}
            exit={reduceMotion ? { opacity: 0 } : slideVariants[position].exit}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={cn(
              'relative z-50 flex flex-col bg-dharma-card border-dharma-border shadow-2xl',
              position === 'bottom' &&
                'mt-auto w-full max-h-[85vh] rounded-t-[28px] border-t pb-[env(safe-area-inset-bottom,16px)]',
              position === 'right' &&
                'ml-auto h-full w-full max-w-md border-l',
              position === 'left' &&
                'mr-auto h-full w-full max-w-md border-r',
              className
            )}
          >
            {/* Grab handle for bottom drawer */}
            {position === 'bottom' && (
              <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-dharma-border/80 shrink-0" />
            )}

            {/* Header */}
            {(title || showCloseButton) && (
              <header className="flex items-center justify-between gap-3 px-5 pt-4 pb-3 border-b border-dharma-border/60 shrink-0">
                <div>
                  {title && (
                    <h2 className="text-base sm:text-lg font-bold font-devanagari text-dharma-text">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-xs text-dharma-muted mt-0.5">{description}</p>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-dharma-border text-dharma-muted hover:text-dharma-text hover:bg-dharma-card-soft transition cursor-pointer"
                    aria-label="बंद करें (Close)"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </header>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 overscroll-contain">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
