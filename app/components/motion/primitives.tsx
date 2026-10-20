'use client';

import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from 'framer-motion';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Shared motion primitives for the Dharma Granth reader.
 *
 * Design goals:
 * - Calm, deliberate, ceremony-appropriate motion. No bouncy springs.
 *   Most easings here are `easeOut` over 400–700ms, biased toward
 *   "settling into place" rather than "popping in."
 * - Respects `prefers-reduced-motion`. Every primitive returns a no-op
 *   variant under that preference so the page is still readable.
 * - Composable: parent `Stagger` + child `StaggerItem` so a list of
 *   verse cards can rise one after the other without each card having
 *   its own timing.
 */

/** The site's settling curve (also `--ease-out-quint` in globals.css). */
export const EASE_OUT_QUINT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Spring presets for framer-motion. Calm by default: `settle` for layout and highlights (no overshoot),
 * `gentle` for things that drift into place, `tactile` for objects under the finger (mala beads, a pull cord)
 * that should feel weighted and come to rest quickly. Under reduced motion pass `{ duration: 0 }` instead.
 */
export const SPRINGS = {
  settle: { type: 'spring', stiffness: 380, damping: 38 },
  gentle: { type: 'spring', stiffness: 170, damping: 26 },
  tactile: { type: 'spring', stiffness: 520, damping: 30, mass: 0.7 },
} as const;

/**
 * Reveal sequence for a verse card: put `className={REVEAL_SEQUENCE}` on the card and `data-reveal="1" | "2" |
 * "3"` on the shloka, transliteration and meanings. It is CSS on the card's scroll timeline (globals.css), so the
 * server HTML is never hidden and nothing waits on hydration.
 */
export const REVEAL_SEQUENCE = 'reveal-seq';

const FADE_UP_DISTANCE = 24;
const FADE_DURATION = 0.55;

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: FADE_UP_DISTANCE },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: FADE_DURATION, ease: EASE_OUT_QUINT },
  },
};

const reducedVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Fade-up on mount. Use for hero headlines, single elements that should
 * settle in once on load. A CSS animation (`.fade-up-in` in globals.css),
 * not framer-motion: it plays from the server-rendered HTML, so above-the-
 * fold text never waits on hydration to become visible.
 */
export function FadeUp({
  children,
  delay = 0,
  className,
  style,
  ...rest
}: { children: ReactNode; delay?: number } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={className ? `fade-up-in ${className}` : 'fade-up-in'}
      style={delay ? { animationDelay: `${delay}s`, ...style } : style}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * Fade-up that fires when the element enters the viewport. Use for
 * sections far down the page that should "wake up" on scroll.
 */
export function FadeUpOnView({
  children,
  delay = 0,
  className,
  amount = 0.25,
  ...rest
}: { children: ReactNode; delay?: number; amount?: number } & HTMLMotionProps<'div'>) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={reduce ? reducedVariants : fadeUpVariants}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Wrap a list with `Stagger` and each list item with `StaggerItem` to get a
 * list of fade-ups.
 *
 * The `StaggerItem`s animate themselves on mount (see below) rather than
 * relying on this parent to orchestrate them, so `Stagger` is now just a
 * layout wrapper. `amount` is still accepted for call-site compatibility but
 * is unused — the reveal no longer depends on the parent reaching a
 * props-bearing "visible" variant (which framer would not fire when the
 * variant holds only a stagger transition), which left tall / below-the-fold
 * lists stuck at `opacity: 0`.
 */
export function Stagger({
  children,
  className,
  amount: _amount,
  ...rest
}: { children: ReactNode; amount?: 'some' | 'all' | number } & HTMLMotionProps<'div'>) {
  // A plain layout wrapper (motion.div with no animation) — it accepts the
  // motion prop types callers may pass, but the reveal is driven per-item.
  return (
    <motion.div className={className} {...rest}>
      {children}
    </motion.div>
  );
}

/**
 * A single list item that fades up on mount.
 *
 * Self-animating rather than inheriting from a `<Stagger>` parent: a parent
 * whose "visible" variant carries only `staggerChildren` did not reliably
 * propagate to tall / below-the-fold lists, leaving items stuck at
 * `opacity: 0`. Like `FadeUp`, this is the CSS `.fade-up-in` animation, so
 * server-rendered items are visible without waiting for hydration.
 */
export function StaggerItem({
  children,
  className,
  ...rest
}: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className ? `fade-up-in ${className}` : 'fade-up-in'} {...rest}>
      {children}
    </div>
  );
}
