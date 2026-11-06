'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Eye, EyeOff, Sparkles, Zap } from 'lucide-react';
import { triggerTactileFeedback } from '@/lib/haptics';
import { usePerformanceMode } from '@/lib/performance-mode';
import { StaticDharmachakra } from './motion/StaticDharmachakra';

type GranthProps = {
  title: string;
  subTitle: string;
  verseCount: string;
  href: string;
};

type ChakraProps = {
  size: number;
  interactive: boolean;
};

export function Experience3DSection({ gitaCountLabel }: { gitaCountLabel: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { isLiteMode, isLowPower, isDataSaver } = usePerformanceMode();
  const [is3DEnabled, setIs3DEnabled] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [Granth, setGranth] = useState<ComponentType<GranthProps> | null>(null);
  const [Chakra, setChakra] = useState<ComponentType<ChakraProps> | null>(null);
  const [isIntersected, setIsIntersected] = useState(false);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Lazy-load 3D components only when in viewport and motion/3D is enabled
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReducedMotion || !is3DEnabled || isLiteMode) return;

    let cancelled = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || cancelled) return;
        setIsIntersected(true);
        observer.disconnect();

        void Promise.all([
          import('./motion/Realistic3DGranth'),
          import('./motion/SacredChakra3D'),
        ])
          .then(([granth, chakra]) => {
            if (cancelled) return;
            setGranth(() => granth.Realistic3DGranth);
            setChakra(() => chakra.SacredChakra3D);
          })
          .catch((err) => {
            console.warn('[Experience3DSection] Optional 3D chunks failed to load:', err);
          });
      },
      { rootMargin: '200px' },
    );

    observer.observe(section);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [prefersReducedMotion, is3DEnabled, isLiteMode]);

  const showInteractive3D = is3DEnabled && !prefersReducedMotion && !isLiteMode;

  function toggle3DMode() {
    triggerTactileFeedback('selection', 'softTap');
    setIs3DEnabled((prev) => !prev);
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="experience-3d-heading"
      className="relative overflow-hidden border-b border-dharma-border bg-gradient-to-b from-dharma-card/60 via-amber-500/5 to-dharma-bg py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-gutter">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-800/40 bg-amber-50 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-saffron-900 dark:border-amber-700/50 dark:bg-amber-950 dark:text-amber-100">
              <Sparkles className="h-3.5 w-3.5 text-saffron-800 dark:text-amber-200" aria-hidden="true" />
              त्रिविमीय दर्शन · 3D Experience
            </span>

            {/* Optional User Toggle Switch */}
            <button
              type="button"
              onClick={toggle3DMode}
              className="inline-flex items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-card px-3 py-1 text-xs font-semibold text-dharma-muted transition hover:border-saffron-300 hover:text-dharma-text shadow-sm"
              aria-pressed={is3DEnabled}
            >
              {is3DEnabled ? (
                <>
                  <Eye className="h-3 w-3 text-emerald-600" />
                  <span>3D Visualizer: On</span>
                </>
              ) : (
                <>
                  <EyeOff className="h-3 w-3 text-dharma-muted" />
                  <span>3D Visualizer: Off (Static Mode)</span>
                </>
              )}
            </button>
          </div>

          <h2
            id="experience-3d-heading"
            className="mt-4 font-serif text-3xl font-bold text-dharma-text sm:text-4xl lg:text-5xl"
          >
            Touch & Contemplate the Sacred
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-dharma-muted sm:text-base">
            An optional, contemplative tactile visualizer. Tilt, rotate, or observe the sacred Bhagavad Gita manuscript codex and the Dharmachakra in 3D space.
          </p>

          {prefersReducedMotion && (
            <p className="mt-2 text-xs font-medium text-amber-700 dark:text-amber-400">
              Reduced-motion preference detected. Showing the static manuscript view.
            </p>
          )}

          {isLiteMode && (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-amber-300/60 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300">
              <Zap className="h-3 w-3" />
              {isLowPower ? 'लो-पावर मोड सक्रिय · Low-Power Static Visuals' : 'डेटा-सेवर मोड सक्रिय · Data-Saver Static Visuals'}
            </p>
          )}
        </div>

        {/* 3D Visualizer vs Static Fallback */}
        <div className="grid items-center justify-items-center gap-10 lg:grid-cols-2">
          {/* Item 1: Granth Codex (3D or Static) */}
          <div className="flex w-full max-w-sm flex-col items-center text-center">
            {showInteractive3D && Granth ? (
              <Granth
                title="श्रीमद्भगवद्गीता"
                subTitle="The Song of Eternal Truth"
                verseCount={gitaCountLabel}
                href="/scripture/bhagavadgita"
              />
            ) : (
              /* Static Fallback Manuscript Card */
              <Link
                href="/scripture/bhagavadgita"
                className="group block w-full overflow-hidden rounded-3xl border border-amber-200/90 bg-dharma-card p-6 shadow-sm transition hover:border-saffron-400 hover:shadow-md dark:border-amber-900/50"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-stone-800 dark:to-stone-900 flex items-center justify-center p-4">
                  <div className="pointer-events-none absolute inset-0 mandala-bg opacity-15" />
                  <div className="relative z-10 text-center">
                    <span className="font-devanagari text-4xl font-bold text-saffron-800 dark:text-saffron-300 drop-shadow-sm">
                      ॐ
                    </span>
                    <p lang="sa" className="font-devanagari text-lg font-bold text-dharma-text mt-2">
                      श्रीमद्भगवद्गीता
                    </p>
                    <p className="text-xs text-dharma-muted">The Divine Song</p>
                  </div>
                </div>

                <div className="mt-4 text-left">
                  <h3 className="font-serif text-lg font-bold text-dharma-text group-hover:text-saffron-700 transition">
                    Bhagavad Gita Codex
                  </h3>
                  <p className="text-xs text-dharma-muted mt-0.5">
                    {gitaCountLabel}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-dharma-border/60 pt-3 text-xs font-bold text-saffron-700 dark:text-saffron-400">
                  <span>Open Sacred Scripture</span>
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </div>
              </Link>
            )}
            <p className="mt-4 text-xs font-semibold text-dharma-muted">
              {showInteractive3D && Granth
                ? 'Drag or tilt cursor to rotate in 3D · Click to read'
                : 'Static Fallback · Click to open the Bhagavad Gita'}
            </p>
          </div>

          {/* Item 2: Dharmachakra (3D or Static) */}
          <div className="flex w-full max-w-sm flex-col items-center text-center">
            {showInteractive3D && Chakra ? (
              <Chakra size={380} interactive />
            ) : (
              /* Static Fallback Wheel of Dharma */
              <div className="flex w-full max-w-sm flex-col items-center justify-center rounded-3xl border border-amber-200/80 bg-dharma-card/80 p-6 text-center shadow-sm dark:border-amber-900/60">
                <StaticDharmachakra size={240} className="mx-auto" />
                <h3 className="mt-4 font-serif text-lg font-bold text-dharma-text">
                  Dharmachakra (धर्मचक्र)
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-dharma-muted">
                  The wheel of eternal righteousness, duty, and spiritual order. Accessible vector emblem with 24 sacred spokes.
                </p>
                <Link
                  href="/concepts"
                  className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold text-saffron-700 dark:text-saffron-400 hover:underline"
                >
                  <span>Explore Concepts</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
            <p className="mt-4 text-xs font-semibold text-dharma-muted">
              {showInteractive3D && Chakra
                ? '3D Dharmachakra — drag with mouse or use arrow keys'
                : 'Static Vector Symbol of Dharma · Accessible & Low-Power'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
