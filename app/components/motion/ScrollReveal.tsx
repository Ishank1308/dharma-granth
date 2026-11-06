import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

/**
 * Scroll-linked stagger reveal for groups of cards.
 *
 * `StaggerGroup` wraps the grid; each child gets `StaggerReveal` with its
 * `index` (0–11, clamped). The cascade is pure CSS on each item's own scroll
 * timeline (globals.css `.reveal-stagger-item`): items already on screen at
 * load render in their final state, unsupported browsers show everything, and
 * `prefers-reduced-motion` disables it — so this file stays a server-safe
 * module with no client JavaScript.
 *
 * Do NOT use framer-motion `whileInView` here: it server-renders at
 * opacity 0 until hydration (see motion/primitives.tsx).
 */

const MAX_STAGGER_INDEX = 11;

type StaggerGroupProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export function StaggerGroup({ children, className, ...rest }: StaggerGroupProps) {
  return (
    <div className={className ? `reveal-stagger ${className}` : 'reveal-stagger'} {...rest}>
      {children}
    </div>
  );
}

type StaggerRevealProps = {
  children: ReactNode;
  /** Position in the cascade (0-based). Clamped to 0–11. */
  index?: number;
} & HTMLAttributes<HTMLDivElement>;

export function StaggerReveal({ children, index = 0, className, style, ...rest }: StaggerRevealProps) {
  const clamped = Math.max(0, Math.min(MAX_STAGGER_INDEX, Math.floor(index)));
  const merged: CSSProperties = { '--reveal-i': clamped, ...style } as CSSProperties;
  return (
    <div
      className={className ? `reveal-stagger-item ${className}` : 'reveal-stagger-item'}
      style={merged}
      {...rest}
    >
      {children}
    </div>
  );
}
