'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

type ParallaxProps = {
  children: ReactNode;
  /** Drift range in px across the full pass (default 48). Keep small. */
  range?: number;
  className?: string;
};

/**
 * Gentle scroll-linked vertical drift for decorative layers (hero ornaments,
 * watermark art). Scroll-linked — not time-based — so it never distracts
 * while reading, and it renders a plain static wrapper under
 * `prefers-reduced-motion`. Decorative only: never wrap text content.
 */
export function Parallax({ children, range = 48, className }: ParallaxProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const half = range / 2;
  const y = useTransform(scrollYProgress, [0, 1], [half, -half]);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div ref={ref} style={{ y }} className={className} aria-hidden="true">
      {children}
    </motion.div>
  );
}
