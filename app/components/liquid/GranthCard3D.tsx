'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { FOLLOW_SPRING, SPRING } from './motion';

export interface GranthCardData {
  href: string;
  /** Devanagari title, lifted toward the viewer. */
  titleSa: string;
  titleEn: string;
  /** "श्रुति · Śruti" or "स्मृति · Smṛti". */
  tradition: { hi: string; en: string };
  description: string;
  /** Short facts line, e.g. "18 chapters · 700 verses". */
  facts?: string;
  /** Two colours for the card's light, from the scripture palettes. */
  tint: [string, string];
  size: 'hero' | 'tall' | 'wide' | 'small';
}

const SIZE: Record<GranthCardData['size'], string> = {
  hero: 'col-span-2 row-span-2',
  tall: 'col-span-1 row-span-2',
  wide: 'col-span-2 row-span-1',
  small: 'col-span-1 row-span-1',
};

/**
 * An Apple TV-style card: it tilts up to 9° toward the pointer on springs,
 * a specular glare follows the cursor, and the Sanskrit title floats 45px
 * above the surface. Touch screens and reduced motion get a still card.
 */
export function GranthCard3D({ card }: { card: GranthCardData }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const [canHover, setCanHover] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, FOLLOW_SPRING);
  const sy = useSpring(my, FOLLOW_SPRING);
  const rotateX = useTransform(sy, [-0.5, 0.5], [9, -9]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const glareX = useTransform(sx, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(sy, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.22), transparent 55%)`;
  const glareOpacity = useSpring(0, FOLLOW_SPRING);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const tilt = canHover && !reduce;

  function onMove(e: PointerEvent<HTMLAnchorElement>) {
    if (!tilt || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
    glareOpacity.set(0);
  }

  const style = { '--c1': card.tint[0], '--c2': card.tint[1] } as CSSProperties;
  const big = card.size === 'hero';

  return (
    <motion.div
      className={`${SIZE[card.size]} [perspective:1100px]`}
      initial={reduce ? false : { y: 24 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={SPRING}
    >
      <motion.div
        className="h-full"
        style={tilt ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined}
        whileTap={reduce ? undefined : { scale: 0.98 }}
        transition={SPRING}
      >
        <Link
          ref={ref}
          href={card.href}
          onPointerMove={onMove}
          onPointerEnter={() => tilt && glareOpacity.set(1)}
          onPointerLeave={onLeave}
          style={{ ...style, transformStyle: tilt ? 'preserve-3d' : undefined }}
          className="granth-card group relative flex h-full flex-col justify-between overflow-hidden rounded-panel border p-5 sm:p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--dharma-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-dharma-bg"
        >
          {tilt && (
            <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]" style={{ background: glare, opacity: glareOpacity }} />
          )}

          <div className="flex items-start justify-between gap-3" style={tilt ? { transform: 'translateZ(20px)' } : undefined}>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-dharma-muted">
              <span lang="hi" className="font-devanagari normal-case tracking-normal">{card.tradition.hi}</span>
              <span aria-hidden="true"> · </span>
              <span>{card.tradition.en}</span>
            </p>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-dharma-muted transition group-hover:text-dharma-text" aria-hidden="true" />
          </div>

          <div style={tilt ? { transform: 'translateZ(45px)', transformStyle: 'preserve-3d' } : undefined}>
            <p
              lang="sa"
              className={`shloka-text text-[color:var(--dharma-text)] ${big ? 'text-4xl sm:text-5xl' : card.size === 'small' ? 'text-2xl' : 'text-3xl'}`}
            >
              {card.titleSa}
            </p>
            <h3 className={`mt-1 font-serif font-medium text-dharma-text ${big ? 'text-2xl sm:text-3xl' : 'text-lg'}`}>{card.titleEn}</h3>
            {card.size !== 'small' && (
              <p className={`mt-2 font-serif leading-relaxed text-dharma-muted ${big ? 'max-w-md text-base sm:text-lg' : 'text-sm'}`}>
                {card.description}
              </p>
            )}
            {card.facts && <p className="mt-3 text-xs font-medium text-dharma-muted">{card.facts}</p>}
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
