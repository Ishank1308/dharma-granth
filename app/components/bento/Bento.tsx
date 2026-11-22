import type { ReactNode } from 'react';
import '@/app/styles/bento.css';

/**
 * The bento opening of a hub page: one large tile for the reader's next step beside two or
 * three smaller ones (app/styles/bento.css). Plain markup with no hooks, so it renders in
 * server and client pages alike and the whole opening is in the exported HTML.
 *
 * A tile is an `.apple-card` with `.bento-tile` on it: a link card (`<a>`) for a tile with one
 * destination, or a `<div>` whose title link carries `.bento-link` when the tile also holds
 * other links.
 */
export function Bento({
  children,
  lead = 'start',
  className = '',
}: {
  children: ReactNode;
  /** `end` puts the lead tile on the right from 768px, so stacked groups alternate. */
  lead?: 'start' | 'end';
  className?: string;
}) {
  return (
    <ul className={`bento reveal-grid ${className}`.trim()} data-lead={lead === 'end' ? 'end' : undefined}>
      {children}
    </ul>
  );
}

/** One cell of the grid. `lead` is 2 × 2, `wide` 2 × 1, `tall` 1 × 2; none is 1 × 1. */
export function BentoCell({ tile, children }: { tile?: 'lead' | 'wide' | 'tall'; children: ReactNode }) {
  return <li data-tile={tile}>{children}</li>;
}

/**
 * A label in English and Hindi as two elements, marked so the reader's language choice shows
 * one of them (see "Two-language labels" in app/styles/components.css).
 */
export function Bi({ en, hi, sep = ' · ' }: { en: ReactNode; hi: ReactNode; sep?: string }) {
  return (
    <>
      <span data-bi="en">{en}</span>
      <span data-bi="sep" aria-hidden="true">{sep}</span>
      <span lang="hi" data-bi="hi" className="font-devanagari">{hi}</span>
    </>
  );
}
