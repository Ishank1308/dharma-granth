'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Flame, Search, Sparkles } from 'lucide-react';
import { FadeUp } from '@/app/components/motion/primitives';
import { MagneticButton } from '@/app/components/motion/MagneticButton';
import { SurpriseVerseButton } from '@/app/components/SurpriseVerseButton';
import { openGlobalSearch } from '@/lib/search-events';
import { triggerTactileFeedback } from '@/lib/haptics';

function CelestialParticles({ active }: { active: boolean }) {
  // Positions use Math.random(), which differs between the server and client
  // render and would trip a hydration mismatch. Generate them only after
  // mount so the server emits an empty layer and the client fills it in.
  const [particles, setParticles] = useState<
    {
      id: number;
      x: number;
      y: number;
      size: number;
      delay: number;
      duration: number;
      opacity: number;
      drift: number;
    }[]
  >([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }
    setParticles(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 6,
        opacity: Math.random() * 0.5 + 0.2,
        drift: (Math.random() - 0.5) * 20,
      })),
    );
  }, [active]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, p.drift, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function MandalaRing({ active, size, duration, reverse = false, className = '' }: { active: boolean, size: string, duration: number, reverse?: boolean, className?: string }) {
  return (
    <motion.div
      className={`absolute rounded-full border border-white/10 ${className}`}
      style={{ width: size, height: size }}
      animate={active ? { rotate: reverse ? -360 : 360 } : undefined}
      transition={active ? { duration, repeat: Infinity, ease: "linear" } : undefined}
    />
  );
}

function ScripturePlane({
  active,
  children,
  className = '',
  baseRotate = 0,
  delay = 0,
}: {
  active: boolean;
  children: string;
  className?: string;
  baseRotate?: number;
  delay?: number;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute hidden md:flex h-24 w-48 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] px-6 text-center shadow-2xl backdrop-blur-md ${className}`}
      initial={{ rotate: baseRotate }}
      animate={
        !active
          ? { rotate: baseRotate }
          : { y: [0, -10, 0], rotate: [baseRotate, baseRotate + 1.5, baseRotate] }
      }
      transition={
        !active
          ? undefined
          : { duration: 7, delay, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      <span lang="sa" className="font-devanagari text-2xl text-saffron-100/75 drop-shadow">
        {children}
      </span>
    </motion.div>
  );
}

export function HeroSection() {
  const reduce = useReducedMotion();
  const [ambientMotion, setAmbientMotion] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Normalised pointer position across the hero: -0.5 … 0.5.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 120, damping: 20, mass: 0.6 };

  // Background layers drift gently against the cursor for depth parallax.
  const bgX = useSpring(useTransform(mx, [-0.5, 0.5], [-22, 22]), spring);
  const bgY = useSpring(useTransform(my, [-0.5, 0.5], [-14, 14]), spring);
  const bgScrollY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const contentScrollY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0.18]);
  const nearPlaneX = useSpring(useTransform(mx, [-0.5, 0.5], [-38, 38]), spring);
  const nearPlaneY = useSpring(useTransform(my, [-0.5, 0.5], [-30, 30]), spring);
  const farPlaneX = useSpring(useTransform(mx, [-0.5, 0.5], [24, -24]), spring);
  const farPlaneY = useSpring(useTransform(my, [-0.5, 0.5], [18, -18]), spring);
  // The OM medallion tilts toward the cursor in 3D.
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), spring);
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), spring);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px) and (pointer: fine)');
    const update = () => setAmbientMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const animateAmbient = !reduce && ambientMotion;

  function handleMove(e: PointerEvent<HTMLElement>) {
    if (!animateAmbient) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <section
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="relative min-h-[620px] overflow-hidden bg-[linear-gradient(135deg,var(--dharma-hero-start),var(--dharma-hero-mid),var(--dharma-hero-end))] text-white"
      style={{ perspective: '1200px' }}
    >
      {/* Enhanced celestial background — drifts against the cursor for depth */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={animateAmbient ? { y: bgScrollY } : undefined}
      >
        <motion.div
          className="absolute inset-[-5%]"
          style={animateAmbient ? { x: bgX, y: bgY } : undefined}
        >
          {/* A restrained set of mandala rings keeps the background atmospheric. */}
          <MandalaRing active={animateAmbient} size="24rem" duration={60} className="-top-32 -left-32" />
          <MandalaRing active={animateAmbient} size="18rem" duration={45} reverse className="-top-20 -left-20" />
          <MandalaRing active={animateAmbient} size="24rem" duration={55} className="-bottom-32 -right-32" />
          <MandalaRing active={animateAmbient} size="18rem" duration={40} reverse className="-bottom-20 -right-20" />

          <motion.div
            className="absolute inset-0"
            style={animateAmbient ? { x: farPlaneX, y: farPlaneY } : undefined}
          >
            <ScripturePlane active={animateAmbient} className="left-[8%] top-[24%]" baseRotate={-10} delay={0.6}>
              तत्त्वमसि
            </ScripturePlane>
            <ScripturePlane active={animateAmbient} className="right-[9%] top-[20%]" baseRotate={9} delay={1.2}>
              सत्यमेव जयते
            </ScripturePlane>
          </motion.div>

          <motion.div
            className="absolute inset-0"
            style={animateAmbient ? { x: nearPlaneX, y: nearPlaneY } : undefined}
          >
            <ScripturePlane active={animateAmbient} className="left-[16%] bottom-[18%]" baseRotate={7} delay={0.2}>
              योगः कर्मसु कौशलम्
            </ScripturePlane>
            <ScripturePlane active={animateAmbient} className="right-[16%] bottom-[20%]" baseRotate={-8} delay={1.8}>
              अहं ब्रह्मास्मि
            </ScripturePlane>
          </motion.div>

          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-10 mandala-bg" />

          {/* Multiple gradient overlays for realistic depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25" />

          {/* Radial gradient for spotlight effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.2),transparent_60%)]" />

          {/* Animated particles */}
          <CelestialParticles active={animateAmbient} />
        </motion.div>
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-10 text-center sm:px-6 sm:pb-24 sm:pt-14 md:py-24"
        style={
          !animateAmbient
            ? { transformStyle: 'preserve-3d' }
            : { y: contentScrollY, opacity: contentOpacity, transformStyle: 'preserve-3d' }
        }
      >
        {/* Interactive OM medallion with celestial sound resonance, 3D tilt, and tactile feedback */}
        <FadeUp>
          <motion.button
            type="button"
            onClick={() => triggerTactileFeedback('celestial', 'omBowl')}
            whileHover={!animateAmbient ? undefined : { scale: 1.12 }}
            whileTap={{ scale: 0.92, y: 2 }}
            title="ॐ पवित्र नाद — Tap for Cosmic Om Resonance & Chime"
            aria-label="Sound sacred Om"
            className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/15 shadow-2xl backdrop-blur-md md:h-20 md:w-20 cursor-pointer transition-all active:ring-4 active:ring-amber-300/40"
            style={animateAmbient ? { rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' } : undefined}
            animate={
              !animateAmbient
                ? undefined
                : {
                    scale: [1, 1.06, 1],
                    boxShadow: [
                      '0 0 30px rgba(251, 191, 36, 0.4)',
                      '0 0 60px rgba(251, 191, 36, 0.7)',
                      '0 0 30px rgba(251, 191, 36, 0.4)',
                    ],
                  }
            }
            transition={animateAmbient ? { duration: 3, repeat: Infinity } : undefined}
          >
            <motion.span lang="sa"
              className="font-devanagari text-4xl leading-none text-saffron-100 drop-shadow-[0_2px_12px_rgba(251,191,36,0.8)] md:text-5xl select-none"
              animate={animateAmbient ? { rotate: [0, 4, -4, 0] } : undefined}
              transition={animateAmbient ? { duration: 4, repeat: Infinity } : undefined}
            >
              ॐ
            </motion.span>
          </motion.button>
        </FadeUp>

        <FadeUp delay={0.08}>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-saffron-100/90 sm:text-sm">
            सनातन ज्ञान · Timeless Sacred Wisdom
          </p>
          <h1 className="mb-2 bg-gradient-to-r from-white via-saffron-100 to-amber-100 bg-clip-text font-serif text-4xl font-bold tracking-normal text-transparent drop-shadow-2xl sm:text-6xl md:text-7xl">
            Dharma Granth
          </h1>
        </FadeUp>

        <FadeUp delay={0.14}>
          <p lang="hi" className="mb-4 font-devanagari text-2xl font-bold text-saffron-100 drop-shadow-md md:text-3xl">
            धर्म ग्रंथ
          </p>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="mx-auto mb-3 max-w-2xl text-lg font-medium leading-relaxed opacity-95 drop-shadow-sm sm:text-xl md:text-2xl">
            A calm, bilingual digital library of Indian spiritual scriptures.
          </p>
          <p lang="hi" className="mx-auto mb-3 max-w-2xl font-devanagari text-base text-amber-100/90 md:text-lg">
            प्रमाणिक संस्कृत श्लोक — सरल व गंभीर हिंदी भावार्थ — विशुद्ध अंग्रेजी अनुवाद
          </p>
          <p className="mx-auto mb-6 max-w-xl text-xs font-medium tracking-wide text-white/80 sm:text-sm">
            Beginners discovering where to start · Returning readers continuing study · Inquiries into life situations
          </p>
        </FadeUp>

        <FadeUp delay={0.26}>
          {/* Large Multilingual Scripture Search Bar */}
          <form
            action={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/scriptures/`}
            method="get"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              const input = event.currentTarget.elements.namedItem('q');
              const query = input instanceof HTMLInputElement ? input.value.trim() : '';
              openGlobalSearch(query);
            }}
            className="mx-auto mb-3 flex max-w-2xl items-center rounded-2xl border border-white/25 bg-white/95 p-1.5 text-left shadow-2xl backdrop-blur-md focus-within:ring-4 focus-within:ring-white/20"
          >
            <Search className="ml-3 h-5 w-5 shrink-0 text-saffron-700" aria-hidden="true" />
            <label htmlFor="hero-scripture-search" className="sr-only">
              Search scriptures, chapters, verses, and spiritual concepts
            </label>
            <input
              id="hero-scripture-search"
              name="q"
              type="search"
              placeholder="Search Gita 2.47, कर्म, fear, Tat Tvam Asi, meditation…"
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-500 sm:text-base"
            />
            <button
              type="submit"
              aria-label="Search"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-saffron-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-saffron-800 sm:px-5"
            >
              <span className="hidden sm:inline">Search</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          {/* Search Examples Pills */}
          <div className="mx-auto mb-7 flex max-w-2xl flex-wrap items-center justify-center gap-2 px-2 text-xs">
            <span className="text-white/70 font-medium">Try searching:</span>
            {[
              { label: 'Gita 2.47', query: 'Gita 2.47' },
              { label: 'कर्म (Karma)', query: 'कर्म' },
              { label: 'fear (अभय)', query: 'fear' },
              { label: 'Tat Tvam Asi (तत्त्वमसि)', query: 'Tat Tvam Asi' },
              { label: 'verses about anger (क्रोध)', query: 'verses about anger' },
            ].map((ex) => (
              <button
                key={ex.query}
                type="button"
                onClick={() => openGlobalSearch(ex.query)}
                className="inline-flex min-h-[44px] items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 font-medium text-white/95 backdrop-blur-sm transition hover:border-amber-300 hover:bg-white/20 hover:text-white"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.32} className="flex flex-wrap justify-center gap-3">
          <div>
            <MagneticButton
              href="/scripture/bhagavadgita"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3.5 font-bold text-saffron-800 shadow-xl transition-all hover:bg-saffron-50 sm:gap-2.5 sm:px-7 shine-sweep"
              strength={28}
              tilt={12}
            >
              <Flame className="w-5 h-5 text-saffron-600" />
              <span>Start with Bhagavad Gita</span>
              <span lang="hi" className="font-devanagari text-xs text-saffron-800 hidden md:inline">
                (भगवद्गीता पढ़ें)
              </span>
            </MagneticButton>
          </div>
          <div>
            <MagneticButton
              href="/scriptures"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-5 py-3.5 font-semibold text-white shadow-xl backdrop-blur-md transition-all hover:bg-white/25 sm:gap-2.5 sm:px-6 shine-sweep"
              strength={24}
              tilt={10}
            >
              <BookOpen className="w-5 h-5" />
              <span>Browse All Scriptures</span>
              <span lang="hi" className="font-devanagari text-xs text-amber-200/80 hidden md:inline">
                (संपूर्ण ग्रंथालय)
              </span>
            </MagneticButton>
          </div>
          <div>
            <SurpriseVerseButton className="hidden items-center gap-2.5 rounded-full border border-white/20 px-4 py-3.5 font-semibold text-white/90 transition hover:border-white/40 hover:bg-white/10 sm:inline-flex" />
          </div>
        </FadeUp>

        <FadeUp delay={0.38}>
          <nav aria-label="Choose a starting point" className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-2 text-xs">
            <span className="mr-1 font-medium text-white/65">Choose a path:</span>
            <Link href="/scriptures" className="rounded-full border border-white/20 bg-white/10 px-3.5 py-2 font-semibold text-white/90 backdrop-blur-sm transition hover:border-amber-300 hover:bg-white/20">
              Explore scriptures
            </Link>
            <Link href="/concepts" className="rounded-full border border-white/20 bg-white/10 px-3.5 py-2 font-semibold text-white/90 backdrop-blur-sm transition hover:border-amber-300 hover:bg-white/20">
              Understand a concept
            </Link>
            <Link href="/practice" className="rounded-full border border-white/20 bg-white/10 px-3.5 py-2 font-semibold text-white/90 backdrop-blur-sm transition hover:border-amber-300 hover:bg-white/20">
              Begin a practice
            </Link>
          </nav>
        </FadeUp>
      </motion.div>

      {/* Bottom gradient transition */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-20 bg-gradient-to-b from-transparent to-dharma-bg" />
    </section>
  );
}
