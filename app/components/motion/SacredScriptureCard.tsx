'use client';

import { useRef, type PointerEvent, type ReactNode } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { triggerTactileFeedback } from '@/lib/haptics';

export interface SacredScriptureCardProps {
  href: string;
  titleEn: string;
  titleSa: string;
  category: string;
  description: string;
  holdingLabel: string;
  watermarkSa?: string;
  languages?: Array<{ id: string; label: string; percent?: number }>;
  isSeparateReading?: boolean;
  className?: string;
}

export function SacredScriptureCard({
  href,
  titleEn,
  titleSa,
  category,
  description,
  holdingLabel,
  watermarkSa,
  languages = [],
  isSeparateReading = false,
  className = '',
}: SacredScriptureCardProps) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  // Normalized pointer coordinates (-0.5 to 0.5)
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);

  const spring = { stiffness: 260, damping: 24, mass: 0.6 };
  const smoothX = useSpring(normX, spring);
  const smoothY = useSpring(normY, spring);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);

  // Specular golden reflection
  const glareX = useTransform(smoothX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ['0%', '100%']);
  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(circle 320px at ${x} ${y}, rgba(251, 191, 36, 0.16) 0%, rgba(245, 158, 11, 0.04) 40%, transparent 70%)`
  );

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === 'touch') return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    normX.set((e.clientX - rect.left) / rect.width - 0.5);
    normY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    normX.set(0);
    normY.set(0);
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative perspective-[1200px] select-none ${className}`}
    >
      <Link href={href} className="block outline-none focus-visible:ring-4 focus-visible:ring-amber-400/40 rounded-2xl">
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
          whileHover={
            reduce
              ? undefined
              : {
                  scale: 1.02,
                  y: -6,
                }
          }
          onClick={() => triggerTactileFeedback('selection', 'softTap')}
          className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-dharma-border/80 bg-gradient-to-br from-dharma-card via-dharma-card to-dharma-card-soft/60 p-6 shadow-sm transition-shadow duration-300 hover:border-amber-400/80 hover:shadow-[0_16px_36px_rgba(245,158,11,0.14)] dark:hover:border-amber-500/60 dark:hover:shadow-[0_16px_36px_rgba(0,0,0,0.45)]"
        >
          {/* Dynamic Specular Golden Light Overlay */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: glareBackground }}
          />

          {/* Gilded Calligraphic Sanskrit Watermark */}
          {watermarkSa && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-6 -right-4 z-0 select-none font-devanagari text-8xl font-black text-amber-500/[0.04] transition-transform duration-500 group-hover:scale-110 group-hover:text-amber-500/[0.08] dark:text-amber-300/[0.03] dark:group-hover:text-amber-300/[0.07]"
            >
              {watermarkSa}
            </div>
          )}

          {/* Top Row: Category Pill & Chevron */}
          <div className="relative z-10 mb-4 flex items-center justify-between">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider border shadow-xs ${
                isSeparateReading
                  ? 'border-saffron-500/30 bg-saffron-500/10 text-saffron-800 dark:text-saffron-200'
                  : 'border-amber-500/25 bg-amber-500/10 text-saffron-700 dark:text-saffron-400'
              }`}
            >
              {category}
            </span>
            <span className="flex size-7 items-center justify-center rounded-full bg-dharma-border/40 text-dharma-muted transition-all duration-300 group-hover:translate-x-1 group-hover:bg-saffron-600 group-hover:text-white shadow-xs">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>

          {/* Middle: Titles and Description */}
          <div className="relative z-10">
            <h3 className="font-serif text-xl font-bold text-dharma-text transition-colors duration-200 group-hover:text-saffron-700 dark:group-hover:text-amber-300">
              {titleEn}
            </h3>
            <p lang="sa" className="mt-1 font-devanagari text-sm font-semibold text-saffron-800 dark:text-saffron-300">
              {titleSa}
            </p>
            <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-dharma-muted">
              {description}
            </p>

            {/* Language badges */}
            {languages.length > 0 && (
              <ul
                aria-label="Language availability"
                className="mt-4 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-dharma-muted"
              >
                {languages.map((l) => (
                  <li
                    key={l.id}
                    className="inline-flex items-center gap-1 rounded-md border border-dharma-border/80 bg-dharma-panel-muted/70 px-2 py-0.5"
                  >
                    <span>{l.label}</span>
                    {l.percent !== undefined && (
                      <span className="font-mono text-[10px] text-dharma-muted/80">{l.percent}%</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Bottom Bar: Stats and CTA */}
          <div className="relative z-10 mt-6 flex items-center justify-between border-t border-dharma-border/60 pt-4 text-xs font-semibold text-dharma-muted">
            <span className="text-[11px] sm:text-xs text-dharma-muted/90">{holdingLabel}</span>
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-saffron-700 to-amber-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all duration-200 group-hover:from-saffron-800 group-hover:to-amber-800 group-hover:shadow-md">
              <span>अध्ययन आरम्भ</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}
