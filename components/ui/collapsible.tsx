'use client';

import React, { createContext, useContext, useId, useState, forwardRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsible() {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) throw new Error('Collapsible subcomponents must be used inside <Collapsible>');
  return ctx;
}

export interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(function Collapsible(
  { open: controlledOpen, defaultOpen = false, onOpenChange, className, children, ...props },
  ref
) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const contentId = useId();

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  return (
    <CollapsibleContext.Provider value={{ open, onOpenChange: handleOpenChange, contentId }}>
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
});

export interface CollapsibleTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  showChevron?: boolean;
}

export const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  function CollapsibleTrigger({ className, children, showChevron = true, ...props }, ref) {
    const { open, onOpenChange, contentId } = useCollapsible();

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => onOpenChange(!open)}
        className={cn(
          'flex w-full items-center justify-between gap-3 text-left transition select-none cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 rounded-xl',
          className
        )}
        {...props}
      >
        <span className="flex-1">{children}</span>
        {showChevron && (
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-dharma-muted transition-transform duration-200',
              open && 'rotate-180 text-saffron-600'
            )}
            aria-hidden="true"
          />
        )}
      </button>
    );
  }
);

export interface CollapsibleContentProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  children: React.ReactNode;
  /** Keep mounted in DOM even when collapsed (useful for SEO or pre-hydration) */
  forceMount?: boolean;
}

export const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(
  function CollapsibleContent({ className, children, forceMount = false, ...props }, ref) {
    const { open, contentId } = useCollapsible();
    const reduceMotion = useReducedMotion();

    if (!open && !forceMount) return null;

    return (
      <AnimatePresence initial={false}>
        {(open || forceMount) && (
          <motion.div
            id={contentId}
            ref={ref}
            role="region"
            aria-hidden={!open}
            initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduceMotion ? { opacity: open ? 1 : 0 } : { height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={cn('overflow-hidden', !open && 'hidden', className)}
            {...props}
          >
            <div className="pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
