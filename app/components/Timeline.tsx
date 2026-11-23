'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { Layout, LayoutList, Filter, Search } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  sanskrit?: string;
  icon?: React.ReactNode;
  category?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function Timeline({ events, className = '' }: TimelineProps) {
  const reduce = useReducedMotion();
  const [viewMode, setViewMode] = useState<'vertical' | 'horizontal'>('vertical');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(events.map(e => e.category).filter(Boolean)))];

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.sanskrit?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`timeline-container ${className}`}>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('vertical')}
            className={`flex min-h-[44px] items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              viewMode === 'vertical'
                ? 'bg-gradient-to-r from-saffron-600 to-amber-600 text-white'
                : 'bg-dharma-card border border-dharma-border hover:bg-saffron-500/10'
            }`}
          >
            <Layout className="w-4 h-4" />
            Vertical
          </button>
          <button
            onClick={() => setViewMode('horizontal')}
            className={`flex min-h-[44px] items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              viewMode === 'horizontal'
                ? 'bg-gradient-to-r from-saffron-600 to-amber-600 text-white'
                : 'bg-dharma-card border border-dharma-border hover:bg-saffron-500/10'
            }`}
          >
            <LayoutList className="w-4 h-4" />
            Horizontal
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dharma-muted" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-h-[44px] pl-10 pr-4 py-2 border border-dharma-border rounded-lg text-sm text-dharma-text focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-dharma-card"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dharma-muted" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="min-h-[44px] pl-10 pr-8 py-2 border border-dharma-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-dharma-card text-dharma-text"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {viewMode === 'vertical' ? (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-saffron-500 via-amber-500 to-emerald-500" />

          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={reduce ? {} : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={reduce ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={reduce ? {} : { duration: 0.5, delay: index * 0.1 }}
              className={`relative flex items-center mb-8 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Content */}
              <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} pl-20 md:pl-0`}>
                <motion.div
                  whileHover={reduce ? {} : { scale: 1.02 }}
                  className="bg-dharma-card rounded-2xl border border-dharma-border p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-3 mb-3 md:justify-end">
                    {event.icon && (
                      <div className="p-2 bg-saffron-100 rounded-lg text-saffron-700 dark:bg-saffron-500/15 dark:text-saffron-300">
                        {event.icon}
                      </div>
                    )}
                    <span className="text-sm font-bold text-saffron-700 bg-saffron-500/10 px-3 py-1 rounded-full dark:text-saffron-300">
                      {event.year}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-dharma-text mb-2">
                    {event.title}
                  </h3>
                  {event.sanskrit && (
                    <p lang="sa" className="font-devanagari text-lg text-saffron-700 dark:text-saffron-300 mb-2">
                      {event.sanskrit}
                    </p>
                  )}
                  <p className="text-sm text-dharma-muted leading-relaxed">
                    {event.description}
                  </p>
                </motion.div>
              </div>

              {/* Dot on timeline */}
              <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-saffron-600 rounded-full border-4 border-dharma-card shadow-lg transform -translate-x-1/2 z-10" />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="relative overflow-x-auto pb-8">
          {/* Horizontal line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-saffron-500 via-amber-500 to-emerald-500" />

          <div className="flex items-start pt-4 gap-8 min-w-max">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={reduce ? {} : { opacity: 0, y: 30 }}
                whileInView={reduce ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={reduce ? {} : { duration: 0.5, delay: index * 0.1 }}
                className="relative flex-shrink-0 w-80"
              >
                {/* Dot on timeline */}
                <div className="absolute top-4 left-1/2 w-4 h-4 bg-saffron-600 rounded-full border-4 border-dharma-card shadow-lg transform -translate-x-1/2 z-10" />

                {/* Content */}
                <motion.div
                  whileHover={reduce ? {} : { scale: 1.02 }}
                  className="bg-dharma-card rounded-2xl border border-dharma-border p-6 shadow-lg hover:shadow-xl transition-all mt-12"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {event.icon && (
                      <div className="p-2 bg-saffron-100 rounded-lg text-saffron-700 dark:bg-saffron-500/15 dark:text-saffron-300">
                        {event.icon}
                      </div>
                    )}
                    <span className="text-sm font-bold text-saffron-700 bg-saffron-50 px-3 py-1 rounded-full dark:bg-saffron-500/10 dark:text-saffron-300">
                      {event.year}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-dharma-text mb-2">
                    {event.title}
                  </h3>
                  {event.sanskrit && (
                    <p lang="sa" className="font-devanagari text-lg text-saffron-700 dark:text-saffron-300 mb-2">
                      {event.sanskrit}
                    </p>
                  )}
                  <p className="text-sm text-dharma-muted leading-relaxed">
                    {event.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 text-dharma-muted">
          No events match your search criteria
        </div>
      )}
    </div>
  );
}
