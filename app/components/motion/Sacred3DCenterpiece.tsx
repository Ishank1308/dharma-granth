'use client';

import { useRef, useState, type PointerEvent } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from 'framer-motion';
import { Sparkles, Flame, BookOpen, ArrowRight, Compass } from 'lucide-react';
import { triggerTactileFeedback } from '@/lib/haptics';

interface FeaturedBook {
  id: string;
  titleSa: string;
  titleEn: string;
  subTitle: string;
  verseCount: string;
  href: string;
  accentGradient: string;
  badge: string;
}

const FEATURED_BOOKS: FeaturedBook[] = [
  {
    id: 'gita',
    titleSa: 'श्रीमद्भगवद्गीता',
    titleEn: 'Bhagavad Gita',
    subTitle: 'The Song of Divine Wisdom',
    verseCount: '18 Chapters · 700 Verses',
    href: '/scripture/bhagavadgita',
    accentGradient: 'from-amber-600 via-saffron-600 to-amber-700',
    badge: 'स्मृति प्रस्थान',
  },
  {
    id: 'ashtavakra',
    titleSa: 'अष्टावक्र गीता',
    titleEn: 'Ashtavakra Gita',
    subTitle: 'The Dialogue of Pure Consciousness',
    verseCount: '20 Chapters · 298 Verses',
    href: '/ashtavakra',
    accentGradient: 'from-amber-700 via-orange-600 to-yellow-700',
    badge: 'अद्वैत वेदान्त',
  },
  {
    id: 'ishavasya',
    titleSa: 'ईशावास्योपनिषद्',
    titleEn: 'Ishavasya Upanishad',
    subTitle: 'All This is Pervaded by the Divine',
    verseCount: '1 Chapter · 18 Verses',
    href: '/scripture/ishavasya',
    accentGradient: 'from-orange-700 via-amber-600 to-stone-900',
    badge: 'शुक्ल यजुर्वेद',
  },
  {
    id: 'katha',
    titleSa: 'कठोपनिषद्',
    titleEn: 'Katha Upanishad',
    subTitle: 'The Mystery of Death & Immortality',
    verseCount: '2 Chapters · 119 Verses',
    href: '/scripture/katha',
    accentGradient: 'from-amber-800 via-red-800 to-stone-950',
    badge: 'कृष्ण यजुर्वेद',
  },
];

export function Sacred3DCenterpiece() {
  const reduce = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = FEATURED_BOOKS[activeIdx];

  // Normalized pointer coordinates (-0.5 to 0.5)
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);

  // Smooth organic physics
  const spring = { stiffness: 220, damping: 22, mass: 0.6 };
  const smoothX = useSpring(normX, spring);
  const smoothY = useSpring(normY, spring);

  // 3D rotations for the floating book
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);

  // Dynamic specular golden foil reflection
  const foilX = useTransform(smoothX, [-0.5, 0.5], ['-20%', '120%']);
  const foilY = useTransform(smoothY, [-0.5, 0.5], ['-20%', '120%']);
  const foilBackground = useTransform(
    [foilX, foilY],
    ([x, y]) =>
      `radial-gradient(circle 320px at ${x} ${y}, rgba(253, 224, 71, 0.45) 0%, rgba(245, 158, 11, 0.18) 35%, transparent 75%)`
  );

  // Dynamic shadow shifting
  const shadowX = useTransform(smoothX, [-0.5, 0.5], [20, -20]);
  const shadowY = useTransform(smoothY, [-0.5, 0.5], [30, 15]);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === 'touch') return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    normX.set((e.clientX - rect.left) / rect.width - 0.5);
    normY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    normX.set(0);
    normY.set(0);
  };

  const handleSelect = (idx: number) => {
    if (idx === activeIdx) return;
    setActiveIdx(idx);
    triggerTactileFeedback('selection', 'softTap');
  };

  return (
    <div className="relative mx-auto mt-10 mb-6 flex flex-col items-center justify-center">
      {/* 3D Scripture Stage */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative flex items-center justify-center perspective-[1400px] select-none py-6"
      >
        {/* Sacred Celestial Mandala Aura (Rotates behind the book) */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <motion.div
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
            className="size-[340px] sm:size-[420px] rounded-full border border-amber-300/20 opacity-40 [mask-image:radial-gradient(circle,black_50%,transparent_75%)]"
            style={{
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, rgba(245, 158, 11, 0.08) 45%, transparent 70%)',
            }}
          >
            {/* Concentric sacred circles */}
            <div className="absolute inset-6 rounded-full border border-dashed border-amber-300/30" />
            <div className="absolute inset-16 rounded-full border border-amber-300/20" />
            <div className="absolute inset-28 rounded-full border border-amber-300/30" />
          </motion.div>
        </div>

        {/* Floating 3D Book */}
        <Link
          href={current.href}
          className="group relative cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-amber-300/50 rounded-2xl"
          aria-label={`Read ${current.titleEn} (${current.titleSa})`}
        >
          <motion.div
            style={
              reduce
                ? undefined
                : {
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                  }
            }
            animate={
              reduce
                ? undefined
                : {
                    y: [-4, 4, -4],
                  }
            }
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            whileHover={reduce ? undefined : { scale: 1.04, y: -8 }}
            className="relative"
          >
            {/* Dynamic Cast Ambient Shadow */}
            <motion.div
              aria-hidden="true"
              className="absolute -bottom-8 left-6 right-6 h-12 rounded-full bg-black/55 blur-2xl transition-opacity duration-300 group-hover:bg-black/75"
              style={{ x: shadowX, y: shadowY }}
            />

            {/* 3D Book Container */}
            <div
              className="relative h-[22rem] w-[15.5rem] sm:h-[24rem] sm:w-[17rem] rounded-r-2xl rounded-l-md shadow-2xl transition-all duration-500"
              style={{
                transformStyle: 'preserve-3d',
                background: 'linear-gradient(135deg, #7c2d12 0%, #451a03 50%, #1c0a00 100%)',
                boxShadow: `
                  inset 4px 0 10px rgba(0,0,0,0.85),
                  inset 0 2px 4px rgba(251,191,36,0.35),
                  16px 20px 50px rgba(0,0,0,0.65)
                `,
              }}
            >
              {/* Spine with Gilded Ridges */}
              <div
                className="absolute left-0 top-0 bottom-0 w-6 rounded-l-md"
                style={{
                  background: 'linear-gradient(90deg, #1c0a00 0%, #7c2d12 50%, #451a03 90%, rgba(0,0,0,0.5) 100%)',
                  borderRight: '1px solid rgba(251, 191, 36, 0.25)',
                }}
              >
                <div className="absolute top-10 left-0 right-0 h-1 bg-amber-400/60 shadow-sm" />
                <div className="absolute top-12 left-0 right-0 h-0.5 bg-amber-200/50" />
                <div className="absolute bottom-10 left-0 right-0 h-1 bg-amber-400/60 shadow-sm" />
                <div className="absolute bottom-12 left-0 right-0 h-0.5 bg-amber-200/50" />
              </div>

              {/* Gilded Page Edges */}
              <div
                className="absolute right-0 top-2 bottom-2 w-3 rounded-r-sm"
                style={{
                  background: 'repeating-linear-gradient(0deg, #fef3c7 0px, #d97706 1px, #fef3c7 2px)',
                  boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.4)',
                  transform: 'translateX(6px) translateZ(-6px) rotateY(45deg)',
                }}
              />

              {/* Flowing Saffron Silk Bookmark */}
              <motion.div
                className="absolute -top-3 left-16 h-28 w-5 bg-gradient-to-b from-saffron-500 via-amber-400 to-saffron-600 shadow-lg"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 90%, 50% 100%, 0% 90%)',
                  transform: 'translateZ(18px)',
                }}
                animate={reduce ? undefined : { rotate: [0, 3, -2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Front Cover Plate */}
              <div
                className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-r-2xl py-4 pl-6 pr-4"
                style={{
                  transform: 'translateZ(12px)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Dynamic Specular Golden Light Overlay */}
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: foilBackground }}
                />

                {/* Embossed Gilded Border Filigree */}
                <div className="pointer-events-none absolute inset-2.5 rounded-xl border border-amber-400/40 p-1">
                  <div className="h-full w-full rounded-lg border border-amber-300/20" />
                </div>

                {/* Top Header Badge & Sacred OM */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-black/45 px-2.5 py-1 text-[11px] font-bold text-amber-200 backdrop-blur-md">
                    <Sparkles className="h-3 w-3 text-amber-300" />
                    <span>{current.badge}</span>
                  </div>
                  <span lang="sa" className="font-devanagari text-2xl font-bold text-amber-300/90 drop-shadow">
                    ॐ
                  </span>
                </div>

                {/* Center Book Details with Animated Transition */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="relative z-10 my-auto text-center"
                    style={{ transform: 'translateZ(24px)' }}
                  >
                    <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-600 font-bold text-stone-950 shadow-lg ring-2 ring-amber-300/50">
                      <Flame className="h-6 w-6 text-stone-950" />
                    </div>
                    <h3
                      lang="sa"
                      className="bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 bg-clip-text font-devanagari text-2xl font-extrabold tracking-wide text-transparent drop-shadow-[0_2px_12px_rgba(251,191,36,0.6)]"
                    >
                      {current.titleSa}
                    </h3>
                    <p lang="en" className="mt-1 font-serif text-base font-bold leading-tight text-amber-100 drop-shadow">
                      {current.titleEn}
                    </p>
                    <p className="mt-1 text-xs italic tracking-wide text-amber-200/90 font-serif">
                      {current.subTitle}
                    </p>
                    <div className="mx-auto mt-2 h-px w-12 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                  </motion.div>
                </AnimatePresence>

                {/* Bottom Action Hint */}
                <div className="relative z-10 flex items-center justify-between text-xs text-amber-200/90">
                  <span className="font-bold text-[11px] sm:text-xs">{current.verseCount}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                    <span>पढ़ें</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Scripture Selector Switcher Pills */}
      <div className="relative z-20 mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {FEATURED_BOOKS.map((b, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button
              key={b.id}
              onClick={() => handleSelect(idx)}
              className={`group relative rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'border border-amber-300/60 bg-amber-400/20 text-amber-200 shadow-[0_0_16px_rgba(251,191,36,0.3)] backdrop-blur-md'
                  : 'border border-white/10 bg-black/20 text-white/70 hover:border-amber-300/30 hover:bg-black/35 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span lang="sa" className="font-devanagari font-bold">{b.titleSa}</span>
                <span className="hidden sm:inline text-amber-300/60">·</span>
                <span className="hidden sm:inline text-[11px] opacity-80">{b.titleEn}</span>
              </span>
              {isActive && (
                <motion.div
                  layoutId="active-book-pill"
                  className="absolute inset-0 rounded-full border border-amber-300/70 pointer-events-none"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
