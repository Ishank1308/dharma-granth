'use client';

import React, { useState, useEffect, useRef, useId, forwardRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, X, Clock, ArrowRight, BookOpen, Compass, Sparkles, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CommandItem {
  id: string;
  title: string;
  titleSanskrit?: string;
  subtitle?: string;
  category: 'scripture' | 'chapter' | 'concept' | 'situation' | 'recent';
  href: string;
  keywords?: string[];
}

export interface CommandGroup {
  name: string;
  nameHi: string;
  category: CommandItem['category'];
  items: CommandItem[];
}

export interface CommandSearchProps {
  open: boolean;
  onClose: () => void;
  onSelect: (item: CommandItem) => void;
  groups: CommandGroup[];
  recentSearches?: string[];
  onClearRecent?: () => void;
  onSearchRecent?: (term: string) => void;
  placeholder?: string;
}

export function CommandSearch({
  open,
  onClose,
  onSelect,
  groups,
  recentSearches = [],
  onClearRecent,
  onSearchRecent,
  placeholder = 'ग्रंथ, श्लोक, विषय अथवा जीवन-स्थिति खोजें...',
}: CommandSearchProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const reduceMotion = useReducedMotion();

  // Flatten currently visible items for single index arrow-key navigation
  const visibleItems = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const result: CommandItem[] = [];

    for (const group of groups) {
      for (const item of group.items) {
        if (!q) {
          result.push(item);
        } else {
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchTitleHi = item.titleSanskrit?.includes(q);
          const matchSub = item.subtitle?.toLowerCase().includes(q);
          const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));
          if (matchTitle || matchTitleHi || matchSub || matchKeywords) {
            result.push(item);
          }
        }
      }
    }
    return result.slice(0, 30);
  }, [groups, query]);

  // Reset active index when query or results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Focus management & Escape key
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1 < visibleItems.length ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : visibleItems.length - 1));
      } else if (e.key === 'Enter') {
        if (visibleItems[activeIndex]) {
          e.preventDefault();
          onSelect(visibleItems[activeIndex]);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, visibleItems, activeIndex, onSelect, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>('[data-active="true"]');
    activeEl?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!open) return null;

  const getCategoryIcon = (cat: CommandItem['category']) => {
    switch (cat) {
      case 'scripture':
        return <BookOpen className="h-4 w-4 text-amber-600" />;
      case 'chapter':
        return <Compass className="h-4 w-4 text-saffron-600" />;
      case 'concept':
        return <Sparkles className="h-4 w-4 text-rose-600" />;
      case 'situation':
        return <Flame className="h-4 w-4 text-emerald-600" />;
      case 'recent':
        return <Clock className="h-4 w-4 text-dharma-muted" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-12" role="dialog" aria-modal="true">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/55 backdrop-blur-xs"
          aria-hidden="true"
        />

        {/* Dialog Box */}
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -8 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-2xl rounded-[26px] border border-dharma-border bg-dharma-card shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Search Header */}
          <header className="flex items-center gap-3 px-4 py-3.5 border-b border-dharma-border/80 bg-dharma-card-soft/40">
            <Search className="h-5 w-5 text-saffron-600 shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={visibleItems.length > 0}
              aria-autocomplete="list"
              aria-controls={`${baseId}-results`}
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm sm:text-base text-dharma-text placeholder:text-dharma-muted focus:outline-none font-devanagari"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-dharma-muted hover:text-dharma-text transition cursor-pointer"
                aria-label="खोज साफ़ करें"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center rounded-lg border border-dharma-border bg-dharma-bg px-2 py-0.5 text-[10px] font-mono text-dharma-muted">
              ESC
            </kbd>
          </header>

          {/* Recent Searches Pills (When query is empty) */}
          {!query && recentSearches.length > 0 && (
            <div className="px-4 py-2.5 border-b border-dharma-border/60 bg-dharma-bg/40 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-[85%] scrollbar-none">
                <span className="text-[10px] uppercase font-bold text-dharma-muted tracking-wider shrink-0">
                  हालिया:
                </span>
                {recentSearches.slice(0, 5).map((term, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      onSearchRecent?.(term);
                    }}
                    className="inline-flex items-center gap-1 rounded-full border border-dharma-border bg-dharma-card px-2.5 py-0.5 text-xs text-dharma-text hover:border-saffron-400 hover:text-saffron-700 transition shrink-0 cursor-pointer"
                  >
                    <Clock className="h-3 w-3 text-dharma-muted" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>

              {onClearRecent && (
                <button
                  type="button"
                  onClick={onClearRecent}
                  className="text-[10px] text-dharma-muted hover:text-rose-600 transition shrink-0"
                >
                  हटाएँ
                </button>
              )}
            </div>
          )}

          {/* Results List */}
          <div
            id={`${baseId}-results`}
            ref={listRef}
            role="listbox"
            className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1 overscroll-contain"
          >
            {visibleItems.length > 0 ? (
              visibleItems.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <div
                    key={item.id}
                    role="option"
                    aria-selected={isActive}
                    data-active={isActive}
                    tabIndex={-1}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelect(item);
                        onClose();
                      }
                    }}
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                    className={cn(
                      'flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 transition cursor-pointer select-none',
                      isActive
                        ? 'bg-saffron-50 dark:bg-saffron-950/50 border border-saffron-300 dark:border-saffron-700 text-saffron-950 dark:text-saffron-100 shadow-2xs'
                        : 'hover:bg-dharma-card-soft text-dharma-text border border-transparent'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="p-1.5 rounded-lg bg-dharma-card border border-dharma-border shrink-0">
                        {getCategoryIcon(item.category)}
                      </span>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <p className="font-devanagari font-bold text-xs sm:text-sm truncate">
                            {item.titleSanskrit || item.title}
                          </p>
                          {item.titleSanskrit && item.title !== item.titleSanskrit && (
                            <span className="text-[11px] text-dharma-muted truncate">
                              ({item.title})
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="text-[11px] text-dharma-muted truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-semibold text-dharma-muted uppercase tracking-wider hidden sm:inline-block">
                        {item.category === 'scripture' && 'ग्रंथ'}
                        {item.category === 'chapter' && 'अध्याय'}
                        {item.category === 'concept' && 'संकल्पना'}
                        {item.category === 'situation' && 'मार्गदर्शन'}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-dharma-muted opacity-60" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <p className="text-sm font-devanagari text-dharma-muted">
                  &ldquo;{query}&rdquo; के लिए कोई परिणाम नहीं मिला
                </p>
                <p className="text-xs text-dharma-muted/70 mt-1">
                  कृपया किसी अन्य शब्द या ग्रंथ का नाम खोजें
                </p>
              </div>
            )}
          </div>

          {/* Footer Guide */}
          <footer className="px-4 py-2.5 border-t border-dharma-border/70 bg-dharma-bg/60 flex items-center justify-between text-[11px] text-dharma-muted">
            <div className="flex items-center gap-3">
              <span><kbd className="font-mono bg-dharma-card border border-dharma-border px-1.5 py-0.5 rounded">↑↓</kbd> चयन</span>
              <span><kbd className="font-mono bg-dharma-card border border-dharma-border px-1.5 py-0.5 rounded">↵</kbd> खोलें</span>
            </div>
            <span>धर्म ग्रंथ शांत खोज प्रणाली</span>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
