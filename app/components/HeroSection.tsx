'use client';

import Link from 'next/link';
import { useState, useRef, type PointerEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  Clock,
  Compass,
  Dices,
  Flame,
  Heart,
  Loader2,
  Search,
  Shield,
  Sparkles,
  Target,
  Wind,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { openGlobalSearch } from '@/lib/search-events';
import { FadeUp } from '@/app/components/motion/primitives';
import { MagneticButton } from '@/app/components/motion/MagneticButton';
import { Parallax } from '@/app/components/motion/Parallax';
import { StaggerGroup, StaggerReveal } from '@/app/components/motion/ScrollReveal';
import { triggerTactileFeedback } from '@/lib/haptics';
import { Sacred3DCenterpiece } from '@/app/components/motion/Sacred3DCenterpiece';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Quick search pills for rapid access */
/**
 * 9 Curated Gen Z Entry Points: Dignified, contemporary, and grounded in canonical topics.
 */
interface GenZPathway {
  id: string;
  labelEn: string;
  labelHi: string;
  sanskrit: string;
  href?: string;
  icon: typeof Wind;
  isSurprise?: boolean;
}

const GEN_Z_PATHWAYS: GenZPathway[] = [
  {
    id: 'stressed',
    labelEn: 'I feel stressed',
    labelHi: 'उद्वेग व अशान्ति',
    sanskrit: 'शमः',
    href: '/wisdom-for-life/stress-and-worry/',
    icon: Wind,
  },
  {
    id: 'focus',
    labelEn: 'I need focus',
    labelHi: 'एकाग्रता व ध्यान',
    sanskrit: 'अभ्यासः',
    href: '/wisdom-for-life/discipline/',
    icon: Target,
  },
  {
    id: 'fear',
    labelEn: 'I fear failure',
    labelHi: 'पराजय का भय',
    sanskrit: 'अभयम्',
    href: '/wisdom-for-life/stress-and-worry/',
    icon: Shield,
  },
  {
    id: 'anger',
    labelEn: 'I feel angry',
    labelHi: 'क्रोध व आवेश',
    sanskrit: 'संयमः',
    href: '/wisdom-for-life/anger/',
    icon: Flame,
  },
  {
    id: 'grieving',
    labelEn: 'I am grieving',
    labelHi: 'शोक व विछोह',
    sanskrit: 'अनित्यता',
    href: '/wisdom-for-life/grief-and-loss/',
    icon: Heart,
  },
  {
    id: 'direction',
    labelEn: 'I need direction',
    labelHi: 'स्वधर्म व कर्तव्य',
    sanskrit: 'स्वधर्मः',
    href: '/wisdom-for-life/skill-in-work/',
    icon: Compass,
  },
  {
    id: 'gita',
    labelEn: 'Start with the Gita',
    labelHi: 'श्रीमद्भगवद्गीता',
    sanskrit: 'गीता प्रवेश',
    href: '/scripture/bhagavadgita',
    icon: BookOpen,
  },
  {
    id: 'creator-studio',
    labelEn: 'Create & Share 9:16',
    labelHi: 'श्लोक चित्र बनाएं (9:16 व 1:1)',
    sanskrit: 'लोकसंग्रहः',
    href: '/daily-verse',
    icon: Sparkles,
  },
  {
    id: 'surprise',
    labelEn: 'Surprise me with a verse',
    labelHi: 'कोई भी श्लोक',
    sanskrit: 'अकस्मात् दर्शन',
    isSurprise: true,
    icon: Dices,
  },
];

interface ChapterIndexEntry {
  id: number;
  verseCount: number;
}
type ChaptersIndex = Record<string, ChapterIndexEntry[]>;
let chaptersIndexRequest: Promise<ChaptersIndex> | null = null;

function ensureChaptersIndex(): Promise<ChaptersIndex> {
  if (!chaptersIndexRequest) {
    chaptersIndexRequest = fetch(`${BASE_PATH}/data/chapters.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ChaptersIndex>;
      })
      .catch((err) => {
        chaptersIndexRequest = null;
        throw err;
      });
  }
  return chaptersIndexRequest;
}

export function HeroSection() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const [surpriseLoading, setSurpriseLoading] = useState(false);

  // Subtle interactive light tracking across hero
  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType === 'touch') return;
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--hero-light-x', `${x}%`);
    el.style.setProperty('--hero-light-y', `${y}%`);
  };

  const handleSurpriseVerse = async () => {
    if (surpriseLoading) return;
    setSurpriseLoading(true);
    triggerTactileFeedback('medium', 'templeChime');
    try {
      const index = await ensureChaptersIndex();
      const ids = Object.keys(index).filter((k) => (index[k]?.length ?? 0) > 0);
      if (ids.length === 0) return;
      const scriptureId = ids[Math.floor(Math.random() * ids.length)];
      const withVerses = index[scriptureId].filter((c) => c.verseCount > 0);
      const pool = withVerses.length > 0 ? withVerses : index[scriptureId];
      const chapter = pool[Math.floor(Math.random() * pool.length)];
      router.push(`/scripture/${scriptureId}/chapter/${chapter.id}/`);
    } catch {
      setSurpriseLoading(false);
    }
  };

  return (
    <section
      ref={heroRef}
      onPointerMove={handlePointerMove}
      aria-labelledby="home-hero-heading"
      className="relative w-full max-w-none overflow-hidden bg-[linear-gradient(145deg,var(--dharma-hero-start,#451a03),var(--dharma-hero-mid,#7c2d12),var(--dharma-hero-end,#c2410c))] text-white transition-colors duration-300"
      style={
        {
          '--hero-light-x': '50%',
          '--hero-light-y': '25%',
        } as React.CSSProperties
      }
    >
      {/* 1. Restrained Luminous Horizon Aura (Device & pointer responsive) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen transition-opacity duration-700"
        style={{
          background:
            'radial-gradient(circle 600px at var(--hero-light-x) var(--hero-light-y), rgba(251, 191, 36, 0.45) 0%, rgba(249, 115, 22, 0.15) 50%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      {/* 2. Sacred Traditional Manuscript Margin Lines */}
      <div className="pointer-events-none absolute inset-x-6 top-3 bottom-3 sm:inset-x-10 sm:top-5 sm:bottom-5 rounded-3xl border border-amber-300/15" aria-hidden="true">
        <div className="absolute top-2 left-2 size-2 border-t-2 border-l-2 border-amber-300/40" />
        <div className="absolute top-2 right-2 size-2 border-t-2 border-r-2 border-amber-300/40" />
        <div className="absolute bottom-2 left-2 size-2 border-b-2 border-l-2 border-amber-300/40" />
        <div className="absolute bottom-2 right-2 size-2 border-b-2 border-r-2 border-amber-300/40" />
      </div>

      {/* Subtle sacred mandala watermark, drifting gently with scroll */}
      <Parallax range={64} className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute inset-0 mandala-bg" aria-hidden="true" />
      </Parallax>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-14 pt-8 sm:px-8 sm:pb-20 sm:pt-16 text-center">
        {/* Purpose Badge */}
        <FadeUp>
          <div className="mb-3 inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-amber-300/30 bg-black/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 backdrop-blur-md shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
            <span>सनातन ज्ञान कोश</span>
            <span className="text-amber-300/50">·</span>
            <span>Timeless Digital Sanctuary</span>
          </div>
        </FadeUp>

        {/* Hero Title */}
        <FadeUp>
          <h1
            id="home-hero-heading"
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-md"
          >
            <span lang="en">Dharma Granth</span>{' '}
            <span lang="sa" className="mt-2 block font-devanagari text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 bg-clip-text text-transparent">
              धर्म ग्रंथ
            </span>
          </h1>
        </FadeUp>

        {/* Clear Value Statement */}
        <FadeUp delay={0.08}>
          <p className="mx-auto mt-3 max-w-2xl text-base sm:mt-4 sm:text-lg lg:text-xl font-normal leading-relaxed text-amber-50/95">
            A calm, ad-free scripture library with Sanskrit texts, Hindi and English translations where available, and clearly labeled explanations with source notes.
          </p>
        </FadeUp>

        {/* Prominent Semantic Scripture Search */}
        <FadeUp delay={0.16}>
          <form
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              const input = event.currentTarget.elements.namedItem('q');
              const query = input instanceof HTMLInputElement ? input.value.trim() : '';
              openGlobalSearch(query);
            }}
            className="mx-auto mt-6 flex max-w-2xl items-center rounded-2xl border border-amber-200/40 bg-white/95 p-1.5 text-left shadow-[0_12px_36px_rgba(0,0,0,0.35)] backdrop-blur-xl focus-within:ring-4 focus-within:ring-amber-400/40 transition-all sm:mt-8"
          >
            <Search className="ml-3 h-5 w-5 shrink-0 text-saffron-700" aria-hidden="true" />
            <label htmlFor="hero-scripture-search" className="sr-only">
              Search scriptures, chapters, verses and philosophical concepts
            </label>
            <input
              id="hero-scripture-search"
              name="q"
              type="search"
              autoComplete="off"
              placeholder="Search a verse, keyword or question (e.g. Gita 2.47, कर्म, fear, Tat Tvam Asi)"
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-500 sm:text-base"
            />
            <button
              type="submit"
              aria-label="Search"
              onClick={() => triggerTactileFeedback('light', 'softTap')}
              className="btn-sheen inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-saffron-700 to-amber-700 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:from-saffron-800 hover:to-amber-800 active:scale-95 sm:px-6"
            >
              <span className="hidden sm:inline">Search</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </FadeUp>

        {/* One primary CTA. The share-card studio lives on the verse of the day below (CLAUDE.md §6);
            quick-search chips, extra buttons and the guide link were removed as clutter (2026-10-25). */}
        <FadeUp delay={0.24}>
        <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:mt-8 sm:flex-row sm:gap-3">
          <MagneticButton href="/scripture/bhagavadgita" strength={14} tilt={6} depth={24} className="w-full max-w-md sm:w-auto">
            <span className="btn-sheen inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-full bg-white px-5 py-3 text-sm font-bold text-stone-950 shadow-xl transition hover:bg-amber-50 active:scale-98 sm:w-auto sm:px-7">
              <BookOpen className="h-4 w-4 text-saffron-700" aria-hidden="true" />
              <span>Start with the Bhagavad Gita</span>
            </span>
          </MagneticButton>
        </div>
        </FadeUp>

        {/* ── Interactive 3D Sacred Folio Centerpiece ──────────────────── */}
        <FadeUp delay={0.32}>
          <Sacred3DCenterpiece />
        </FadeUp>

        {/* ── Gen Z Direct Discovery Pathways ────────────────────────── */}
        <div className="mt-8 pt-8 border-t border-amber-300/20 text-left">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
                वर्तमान स्थिति · Where are you right now?
              </p>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                Find scripture guidance for your state of mind
              </h2>
            </div>
            <span className="text-xs text-amber-200/70 hidden sm:inline">
              9 Thoughtful Pathways
            </span>
          </div>

          <StaggerGroup className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {GEN_Z_PATHWAYS.map((p, i) => {
              const Icon = p.icon;
              if (p.isSurprise) {
                return (
                  <StaggerReveal key={p.id} index={i} className="col-span-2 sm:col-span-1">
                  <motion.button
                    type="button"
                    onClick={handleSurpriseVerse}
                    disabled={surpriseLoading}
                    whileHover={reduce ? undefined : { y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="group relative flex flex-col justify-between rounded-2xl border border-amber-300/50 bg-gradient-to-br from-amber-500/25 to-saffron-600/35 p-3.5 text-left backdrop-blur-md transition-shadow hover:border-amber-300 hover:shadow-[0_8px_24px_rgba(251,191,36,0.3)] shadow-sm cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/25 text-amber-200 group-hover:scale-110 transition-transform">
                        {surpriseLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin text-amber-300" />
                        ) : (
                          <Icon className="h-4 w-4 text-amber-300" />
                        )}
                      </span>
                      <span lang="sa" className="font-devanagari text-[10px] font-semibold text-amber-200/90">
                        {p.sanskrit}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-200 transition-colors">
                        {p.labelEn}
                      </p>
                      <p lang="hi" className="font-devanagari text-[11px] text-amber-200/80 mt-0.5">
                        {p.labelHi}
                      </p>
                    </div>
                  </motion.button>
                  </StaggerReveal>
                );
              }

              return (
                <StaggerReveal key={p.id} index={i} className="rounded-2xl">
                <motion.div
                  whileHover={reduce ? undefined : { y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                >
                  <Link
                    href={p.href!}
                    onClick={() => triggerTactileFeedback('light', 'softTap')}
                    className="group relative flex h-full flex-col justify-between rounded-2xl border border-white/20 bg-black/30 p-3.5 text-left backdrop-blur-md transition-all hover:border-amber-300/80 hover:bg-white/15 hover:shadow-[0_8px_24px_rgba(251,191,36,0.22)] shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-amber-200 group-hover:bg-amber-400/25 transition">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span lang="sa" className="font-devanagari text-[10px] font-semibold text-amber-200/80">
                        {p.sanskrit}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-200 transition-colors">
                        {p.labelEn}
                      </p>
                      <p lang="hi" className="font-devanagari text-[11px] text-amber-100/80 mt-0.5">
                        {p.labelHi}
                      </p>
                    </div>
                  </Link>
                </motion.div>
                </StaggerReveal>
              );
            })}
          </StaggerGroup>
        </div>
      </div>

    </section>
  );
}
