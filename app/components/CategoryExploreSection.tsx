'use client';

import Link from 'next/link';
import {
  BookOpen,
  Clock,
  Compass,
  Flame,
  Heart,
  Scale,
  Scroll,
  Sparkles,
  TreePine,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { scriptureCatalog } from '@/data/scripture-meta';

interface CategoryTile {
  id: string;
  href: string;
  titleEn: string;
  titleHi: string;
  description: string;
  icon: ReactNode;
  tag: string;
}

const CATEGORIES: CategoryTile[] = [
  {
    id: 'veda',
    href: '/scriptures#veda',
    titleEn: 'Vedas',
    titleHi: 'वेद',
    description: 'The foundational Śruti revelations — Rigveda, Samaveda, Yajurveda, and Atharvaveda.',
    icon: <Flame className="h-5 w-5" aria-hidden="true" />,
    tag: 'श्रुति · Foundational',
  },
  {
    id: 'upanishad',
    href: '/scriptures#upanishad',
    titleEn: 'Upanishads',
    titleHi: 'उपनिषद्',
    description: 'Philosophical dialogues exploring the nature of Brahman (Absolute) and Atman (Self).',
    icon: <BookOpen className="h-5 w-5" aria-hidden="true" />,
    tag: 'ज्ञान काण्ड · Philosophy',
  },
  {
    id: 'itihasa',
    href: '/scriptures#itihasa',
    titleEn: 'Itihasa',
    titleHi: 'इतिहास',
    description: 'The monumental historical epics — Mahabharata, Ramayana, and the Bhagavad Gita.',
    icon: <Scroll className="h-5 w-5" aria-hidden="true" />,
    tag: 'महाकाव्य · Epics',
  },
  {
    id: 'purana',
    href: '/scriptures#purana',
    titleEn: 'Puranas',
    titleHi: 'पुराण',
    description: 'Cosmic history, sacred geography, genealogies, divine parables, and timeless traditions.',
    icon: <TreePine className="h-5 w-5" aria-hidden="true" />,
    tag: 'आख्यान · Ancient Lore',
  },
  {
    id: 'smriti',
    href: '/scriptures#smriti',
    titleEn: 'Smritis',
    titleHi: 'स्मृति',
    description: 'Codes of ethical duty, righteousness (Dharma), and guidance for balanced societal living.',
    icon: <Scale className="h-5 w-5" aria-hidden="true" />,
    tag: 'धर्मशास्त्र · Conduct',
  },
  {
    id: 'bhakti',
    href: '/collections#bhakti',
    titleEn: 'Bhakti',
    titleHi: 'भक्ति',
    description: 'Devotional literature, stotras, divine songs of surrender, and love for the infinite.',
    icon: <Heart className="h-5 w-5" aria-hidden="true" />,
    tag: 'समर्पण · Devotion',
  },
  {
    id: 'vedanta',
    href: '/concepts',
    titleEn: 'Vedanta',
    titleHi: 'वेदान्त',
    description: 'Core metaphysical concepts: Maya, Moksha, Karma, Prakriti, and Non-dual realization.',
    icon: <Sparkles className="h-5 w-5" aria-hidden="true" />,
    tag: 'अद्वैत · Metaphysics',
  },
  {
    id: 'daily-practice',
    href: '/practice',
    titleEn: 'Daily Practice',
    titleHi: 'नित्य कर्म',
    description: 'Sandhya Vandana, morning meditation, Japa, and quiet daily spiritual routines.',
    icon: <Clock className="h-5 w-5" aria-hidden="true" />,
    tag: 'साधना · Daily Routine',
  },
];

export function CategoryExploreSection() {
  const allScriptures = scriptureCatalog;

  function getCount(catId: string): string {
    if (catId === 'veda') {
      const c = allScriptures.filter((s: { category: string }) => s.category === 'veda').length;
      return `${c} texts`;
    }
    if (catId === 'upanishad') {
      const c = allScriptures.filter((s: { category: string }) => s.category === 'upanishad').length;
      return `${c} texts`;
    }
    if (catId === 'itihasa') {
      const c = allScriptures.filter((s: { category: string }) => s.category === 'itihasa').length;
      return `${c} texts`;
    }
    if (catId === 'purana') {
      const c = allScriptures.filter((s: { category: string }) => s.category === 'purana').length;
      return `${c} texts`;
    }
    if (catId === 'smriti') {
      const c = allScriptures.filter((s: { category: string }) => s.category === 'smriti').length;
      return `${c} texts`;
    }
    if (catId === 'bhakti') {
      return 'Stotras & Hymns';
    }
    if (catId === 'vedanta') {
      return '25+ Concepts';
    }
    return 'Daily Rituals';
  }

  return (
    <section
      aria-labelledby="explore-categories-heading"
      className="border-b border-dharma-border bg-gradient-to-b from-dharma-card/30 to-dharma-bg py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Section Header */}
        <div className="mb-10">
          <div className="mb-2 flex items-center gap-2">
            <span className="size-2 rounded-full bg-saffron-600 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-saffron-700 dark:text-saffron-400">
              परंपरा अन्वेषण · Explore the Tradition
            </p>
          </div>
          <h2
            id="explore-categories-heading"
            className="font-serif text-3xl font-bold text-dharma-text sm:text-4xl"
          >
            Explore by Category
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-dharma-muted sm:text-base">
            Journey through the eight branches of sacred Hindu literature, from foundational Vedic chants to daily practices.
          </p>
        </div>

        {/* 8 Category Tiles Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat, index) => (
            <Link
              key={cat.id}
              href={cat.href}
              className={`${index >= 4 ? 'hidden sm:flex ' : ''}group relative flex flex-col justify-between rounded-2xl border border-dharma-border bg-dharma-card p-5 transition-all hover:-translate-y-1 hover:border-amber-400/80 hover:shadow-lg dark:hover:border-amber-700/60`}
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-saffron-700 dark:text-saffron-400 transition group-hover:bg-saffron-600 group-hover:text-white">
                    {cat.icon}
                  </span>
                  <span className="text-[11px] font-semibold text-dharma-muted group-hover:text-saffron-700 transition">
                    {getCount(cat.id)}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <h3 className="font-serif text-lg font-bold text-dharma-text group-hover:text-saffron-700 transition">
                    {cat.titleEn}
                  </h3>
                  <span lang="sa" className="font-devanagari text-sm font-semibold text-saffron-700 dark:text-saffron-400">
                    {cat.titleHi}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-dharma-muted line-clamp-3">
                  {cat.description}
                </p>
              </div>

              <div className="mt-5 border-t border-dharma-border/60 pt-3">
                <span className="text-[11px] font-semibold text-dharma-muted group-hover:text-dharma-text">
                  {cat.tag}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
