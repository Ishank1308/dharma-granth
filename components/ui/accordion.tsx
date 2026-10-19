'use client';

import React, { createContext, useContext, useState, useId, forwardRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type AccordionType = 'single' | 'multiple';

interface AccordionContextValue {
  type: AccordionType;
  value: string[];
  toggleItem: (itemValue: string) => void;
  baseId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('AccordionItem must be used within <Accordion>');
  return ctx;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AccordionType;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children: React.ReactNode;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  {
    type = 'single',
    value: controlledValue,
    defaultValue,
    onValueChange,
    className,
    children,
    ...props
  },
  ref
) {
  const baseId = useId();
  const initValue = (): string[] => {
    if (defaultValue === undefined) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  };

  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(initValue);

  const isControlled = controlledValue !== undefined;
  const currentValues = isControlled
    ? Array.isArray(controlledValue)
      ? controlledValue
      : controlledValue ? [controlledValue] : []
    : uncontrolledValue;

  const toggleItem = (itemValue: string) => {
    let next: string[];
    if (type === 'single') {
      next = currentValues.includes(itemValue) ? [] : [itemValue];
    } else {
      next = currentValues.includes(itemValue)
        ? currentValues.filter((v) => v !== itemValue)
        : [...currentValues, itemValue];
    }

    if (!isControlled) setUncontrolledValue(next);
    onValueChange?.(type === 'single' ? next[0] ?? '' : next);
  };

  return (
    <AccordionContext.Provider value={{ type, value: currentValues, toggleItem, baseId }}>
      <div ref={ref} className={cn('w-full space-y-2', className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
});

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  headerId: string;
  panelId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionItem() {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) throw new Error('Accordion subcomponents must be used within <AccordionItem>');
  return ctx;
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { value, className, children, ...props },
  ref
) {
  const { value: openValues, baseId } = useAccordion();
  const isOpen = openValues.includes(value);
  const headerId = `${baseId}-header-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  return (
    <AccordionItemContext.Provider value={{ value, isOpen, headerId, panelId }}>
      <div
        ref={ref}
        data-state={isOpen ? 'open' : 'closed'}
        className={cn(
          'rounded-2xl border border-dharma-border/80 bg-dharma-card overflow-hidden transition-all shadow-2xs',
          isOpen && 'ring-1 ring-saffron-500/20 shadow-xs',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
});

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ className, children, icon, badge, ...props }, ref) {
    const { toggleItem } = useAccordion();
    const { value, isOpen, headerId, panelId } = useAccordionItem();

    return (
      <button
        ref={ref}
        type="button"
        id={headerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => toggleItem(value)}
        className={cn(
          'flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-semibold text-dharma-text transition select-none cursor-pointer',
          'hover:bg-dharma-card-soft/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {icon && <span className="shrink-0 text-saffron-600 dark:text-saffron-400">{icon}</span>}
          <span className="truncate text-sm md:text-base font-medium">{children}</span>
          {badge && <span className="shrink-0 ml-auto">{badge}</span>}
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-dharma-muted transition-transform duration-200',
            isOpen && 'rotate-180 text-saffron-600'
          )}
          aria-hidden="true"
        />
      </button>
    );
  }
);

export interface AccordionContentProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  children: React.ReactNode;
}

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent({ className, children, ...props }, ref) {
    const { isOpen, panelId, headerId } = useAccordionItem();
    const reduceMotion = useReducedMotion();

    return (
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            ref={ref}
            role="region"
            aria-labelledby={headerId}
            initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={cn('overflow-hidden border-t border-dharma-border/60 bg-dharma-bg/40', className)}
            {...props}
          >
            <div className="p-4 sm:p-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
