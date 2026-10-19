'use client';

import React, { createContext, useContext, useId, useRef, useEffect, forwardRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TabsContextValue {
  value: string;
  onValueChange: (val: string) => void;
  baseId: string;
  orientation?: 'horizontal' | 'vertical';
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs compound components must be used within <Tabs>');
  return ctx;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  children: React.ReactNode;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { value, onValueChange, orientation = 'horizontal', className, children, ...props },
  ref
) {
  const generatedId = useId();
  const baseId = props.id || generatedId;

  return (
    <TabsContext.Provider value={{ value, onValueChange, baseId, orientation }}>
      <div
        ref={ref}
        id={baseId}
        data-orientation={orientation}
        className={cn('w-full', className)}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
});

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, children, ...props },
  ref
) {
  const { orientation } = useTabsContext();
  const listRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const list = listRef.current;
    if (!list) return;

    const tabs = Array.from(
      list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')
    );
    if (!tabs.length) return;

    const activeIndex = tabs.findIndex((t) => t === document.activeElement);
    if (activeIndex === -1) return;

    let nextIndex = activeIndex;

    if (orientation === 'vertical') {
      if (e.key === 'ArrowDown') nextIndex = (activeIndex + 1) % tabs.length;
      else if (e.key === 'ArrowUp') nextIndex = (activeIndex - 1 + tabs.length) % tabs.length;
    } else {
      if (e.key === 'ArrowRight') nextIndex = (activeIndex + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') nextIndex = (activeIndex - 1 + tabs.length) % tabs.length;
    }

    if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = tabs.length - 1;

    if (nextIndex !== activeIndex) {
      e.preventDefault();
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    }
  };

  return (
    <div
      ref={(node) => {
        (listRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref && 'current' in ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      role="tablist"
      tabIndex={props.tabIndex ?? -1}
      aria-orientation={orientation}
      onKeyDown={handleKeyDown}
      className={cn(
        'inline-flex items-center rounded-2xl p-1 bg-dharma-panel-muted border border-dharma-border/80 shadow-2xs',
        orientation === 'vertical' ? 'flex-col' : 'flex-row',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { value, className, children, disabled, ...props },
  ref
) {
  const { value: selectedValue, onValueChange, baseId } = useTabsContext();
  const isSelected = selectedValue === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;
  const reduceMotion = useReducedMotion();

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={tabId}
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      onClick={() => onValueChange(value)}
      className={cn(
        'relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-1',
        'disabled:pointer-events-none disabled:opacity-40 select-none cursor-pointer',
        isSelected
          ? 'text-saffron-950 dark:text-saffron-100 font-bold'
          : 'text-dharma-muted hover:text-dharma-text',
        className
      )}
      {...props}
    >
      {isSelected && (
        <motion.span
          layoutId={reduceMotion ? undefined : `${baseId}-active-indicator`}
          transition={{ type: 'spring', bounce: 0.15, duration: 0.3 }}
          className="absolute inset-0 z-[-1] rounded-xl bg-dharma-card border border-dharma-border shadow-xs"
        />
      )}
      {children}
    </button>
  );
});

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(function TabsContent(
  { value, className, children, ...props },
  ref
) {
  const { value: selectedValue, baseId } = useTabsContext();
  const isSelected = selectedValue === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  if (!isSelected) return null;

  return (
    <div
      ref={ref}
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      tabIndex={0}
      className={cn(
        'mt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 rounded-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
