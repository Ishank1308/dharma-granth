'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BookOpen, Sparkles, Filter } from 'lucide-react';
import { dictionary, termCategories, type DictionaryTerm, type TermCategory } from '@/data/dictionary';
import { plural, verseCount } from '@/lib/format';

export function DictionaryClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TermCategory | 'all'>('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const q = new URLSearchParams(window.location.search).get('q');
      if (q) setSearchQuery(q);
    }
  }, []);

  const filteredTerms = useMemo(() => {
    let list = dictionary;

    if (selectedCategory !== 'all') {
      list = list.filter((t) => t.category === selectedCategory);
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((t) => {
        const text = `${t.term} ${t.sanskrit} ${t.transliteration} ${t.shortDef} ${t.etymology}`.toLowerCase();
        return text.includes(q);
      });
    }

    return list;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Controls Bar: Search & Category Filter */}
      <div className="rounded-2xl border border-dharma-border bg-dharma-card p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-dharma-muted" />
            <input
              type="text"
              aria-label="Search dictionary terms"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts e.g. Dharma, Atman, Moksha, कर्म..."
              className="w-full rounded-xl border border-dharma-border/80 bg-dharma-bg pl-10 pr-9 py-2 text-xs sm:text-sm text-dharma-text placeholder:text-dharma-muted/70 outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/20 transition shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-dharma-muted hover:text-dharma-text"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Matches Counter */}
          <div className="flex items-center gap-2 text-xs font-medium text-dharma-muted shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
            <span>
              Showing <span className="font-bold text-dharma-text">{filteredTerms.length}</span> of {dictionary.length} terms
            </span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 min-h-[44px] rounded-full px-3 py-1 text-xs font-semibold transition ${
              selectedCategory === 'all'
                ? 'bg-saffron-600 text-white shadow-sm'
                : 'border border-dharma-border bg-dharma-bg text-dharma-muted hover:border-saffron-300 hover:text-dharma-text'
            }`}
          >
            All Terms ({dictionary.length})
          </button>
          {termCategories.map((cat) => {
            const count = dictionary.filter((t) => t.category === cat.key).length;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`shrink-0 inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-saffron-600 text-white shadow-sm'
                    : 'border border-dharma-border bg-dharma-bg text-dharma-muted hover:border-saffron-300 hover:text-dharma-text'
                }`}
              >
                <span>{cat.label}</span>
                <span lang="sa" className="font-devanagari text-[11px]">
                  ({cat.sanskrit})
                </span>
                <span className="text-[10px] opacity-75">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Grid */}
      {filteredTerms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-dharma-border bg-dharma-card p-12 text-center max-w-lg mx-auto">
          <BookOpen className="w-10 h-10 text-saffron-500 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-serif font-bold text-dharma-text mb-1">
            No terms found matching &ldquo;{searchQuery}&rdquo;
          </h3>
          <p className="text-xs text-dharma-muted mb-4">
            Try checking for spelling or switch to all categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-600 text-white text-xs font-semibold hover:bg-saffron-700 shadow-sm transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* initial={false}: terms are server-rendered visible; only later filter changes animate. */}
          <AnimatePresence initial={false}>
            {filteredTerms.map((term) => {
              const catMeta = termCategories.find((c) => c.key === term.category);
              return (
                <motion.div
                  key={term.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <Link
                    href={`/dictionary/${term.id}`}
                    className="group relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-dharma-border bg-dharma-card p-6 hover:shadow-xl hover:border-saffron-300 transition-all duration-300"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${catMeta?.gradient || 'from-saffron-500 to-amber-600'}`} />

                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition">
                            {term.term}
                          </h3>
                          <p lang="sa" className="font-devanagari text-base text-saffron-600 font-medium">
                            {term.sanskrit}
                          </p>
                        </div>
                        <span className="text-xs text-dharma-muted italic mt-1 font-mono">
                          {term.transliteration}
                        </span>
                      </div>

                      <p className="text-xs md:text-sm text-dharma-muted leading-relaxed line-clamp-3 mb-4">
                        {term.shortDef}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-dharma-border/60 flex items-center justify-between text-xs text-dharma-muted mt-auto">
                      <span className="text-[11px]">
                        {term.crossTradition.length} {plural(term.crossTradition.length, 'tradition')} · {verseCount(term.verses.length)}
                      </span>
                      <span className="font-semibold text-saffron-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Explore →
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
