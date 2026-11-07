'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { usePerformanceMode } from '@/lib/performance-mode';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { StaticDharmachakra } from './StaticDharmachakra';

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

/**
 * Below-the-fold 3D codex and chakra.
 * Under Low-Power mode, Data-Saver mode, or prefers-reduced-motion,
 * mounts an immediate high-fidelity static 3D fallback (StaticDharmachakra + Codex cover),
 * avoiding all heavy WebGL canvas scripts and 60fps physics computation.
 */
export function SacredSpace() {
  const sectionRef = useRef<HTMLElement>(null);
  const [Granth, setGranth] = useState<ComponentType<GranthProps> | null>(null);
  const [Chakra, setChakra] = useState<ComponentType<ChakraProps> | null>(null);
  const { isLiteMode, isLowPower, isDataSaver } = usePerformanceMode();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (isLiteMode) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || cancelled) return;
        observer.disconnect();
        void Promise.all([
          import('./Realistic3DGranth'),
          import('./SacredChakra3D'),
        ]).then(([granth, chakra]) => {
          if (cancelled) return;
          setGranth(() => granth.Realistic3DGranth);
          setChakra(() => chakra.SacredChakra3D);
        });
      },
      { rootMargin: '240px' },
    );
    observer.observe(section);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [isLiteMode]);

  const has3D = !isLiteMode && Granth && Chakra;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="sacred-space-heading"
      className="relative overflow-hidden border-b border-dharma-border bg-gradient-to-b from-dharma-card/60 via-amber-500/5 to-dharma-bg py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-gutter">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-saffron-500/20 bg-saffron-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-saffron-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
            <span>
              {isDataSaver
                ? 'डेटा-बचत मोड · Lite Experience'
                : isLowPower
                ? 'कम ऊर्जा मोड · Power Saver'
                : 'Realistic 3D Experience · त्रिविमीय दर्शन'}
            </span>
          </span>
          <h2 id="sacred-space-heading" className="mt-3 font-serif text-3xl font-bold text-dharma-text sm:text-4xl lg:text-5xl">
            Touch and Explore the Sacred
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-dharma-muted sm:text-lg">
            {has3D
              ? 'Move cursor or tilt to interact with the codex in 3D. The Dharmachakra spins freely or with arrow keys.'
              : 'Direct access to canonical scripture with instant, zero-latency graphic rendering optimized for speed and battery.'}
          </p>
        </div>

        <ErrorBoundary name="Sacred Space Visuals">
          <div className="grid items-center justify-items-center gap-12 lg:grid-cols-2">
            {/* Bhagavad Gita Codex Card */}
            <div className="flex flex-col items-center text-center w-full max-w-sm">
              {Granth && !isLiteMode ? (
                <Granth
                  title="श्रीमद्भगवद्गीता"
                  subTitle="The Song of Eternal Truth"
                  verseCount="700 श्लोक · 18 अध्याय"
                  href="/scripture/bhagavadgita"
                />
              ) : (
                <Link
                  href="/scripture/bhagavadgita"
                  className="group block w-full overflow-hidden rounded-3xl border border-saffron-300/50 bg-dharma-card shadow-lg transition hover:border-saffron-500 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
                  aria-label="श्रीमद्भगवद्गीता पढ़ें (Read Bhagavad Gita)"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-saffron-900 to-amber-950">
                    <Image
                      src="/og/bhagavadgita.png"
                      alt="श्रीमद्भगवद्गीता — ग्रन्थ मुखपृष्ठ"
                      fill
                      sizes="(max-width: 640px) 100vw, 384px"
                      priority={false}
                      loading="lazy"
                      className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                    <span
                      lang="sa"
                      className="absolute bottom-3 left-4 font-devanagari text-xl font-bold text-amber-200 drop-shadow-md"
                    >
                      श्रीमद्भगवद्गीता
                    </span>
                  </div>
                  <div className="p-5 flex items-center justify-between text-left">
                    <div>
                      <p className="text-sm font-bold text-dharma-text group-hover:text-saffron-700 transition">
                        The Song of Eternal Truth
                      </p>
                      <p className="text-xs text-dharma-muted">700 श्लोक · 18 अध्याय</p>
                    </div>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-saffron-500/10 text-saffron-700 group-hover:bg-saffron-600 group-hover:text-white transition">
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              )}
              <p className="mt-4 text-xs font-semibold text-dharma-muted">
                {Granth && !isLiteMode
                  ? 'Move cursor or tilt phone to rotate in 3D · Click to open'
                  : 'Opens the complete Bhagavad Gita'}
              </p>
            </div>

            {/* Sacred Dharmachakra (3D or Static High-Definition SVG Fallback) */}
            <div className="flex flex-col items-center text-center w-full max-w-sm">
              {Chakra && !isLiteMode ? (
                <Chakra size={400} interactive />
              ) : (
                <div className="flex aspect-square w-full max-w-sm items-center justify-center rounded-full border border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent p-6 shadow-inner">
                  <StaticDharmachakra size={340} />
                </div>
              )}
              <p className="mt-4 text-xs font-semibold text-dharma-muted">
                {Chakra && !isLiteMode
                  ? '3D Dharmachakra — drag, or focus it and use the arrow keys'
                  : '24 अरों वाला धर्मचक्र · Symbol of Truth and Cosmic Order'}
              </p>
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </section>
  );
}
