import type { CSSProperties } from 'react';

/** Where the blossoms sit, as % of the viewport, with their size, turn and the moment each one opens. */
const AMBIENT: Array<{ x: number; y: number; s: number; r: number; d: number }> = [
  { x: 4, y: 14, s: 1, r: -12, d: 0.4 },
  { x: 9, y: 22, s: 0.7, r: 24, d: 1.1 },
  { x: 92, y: 9, s: 0.85, r: 18, d: 0.8 },
  { x: 95, y: 18, s: 0.6, r: -30, d: 1.6 },
  { x: 88, y: 78, s: 0.9, r: 40, d: 1.3 },
  { x: 6, y: 86, s: 0.75, r: -40, d: 2 },
  { x: 12, y: 80, s: 0.55, r: 8, d: 2.4 },
];

const HERO: Array<{ x: number; y: number; s: number; r: number; d: number }> = [
  { x: 14, y: 22, s: 1.4, r: -18, d: 0.5 },
  { x: 20, y: 30, s: 1, r: 22, d: 0.9 },
  { x: 11, y: 34, s: 0.8, r: 50, d: 1.3 },
  { x: 84, y: 64, s: 1.3, r: 14, d: 0.7 },
  { x: 90, y: 56, s: 0.9, r: -26, d: 1.1 },
  { x: 80, y: 72, s: 0.7, r: 36, d: 1.6 },
];

/**
 * Rāt-rānī (night jasmine, Cestrum nocturnum): a slender green tube that opens
 * into a five-pointed white star. Each blossom opens once, slowly, then
 * breathes with a faint glow, brighter at night like the real flower.
 */
function Blossom() {
  return (
    <svg viewBox="-24 -24 48 60" className="rr-flower" aria-hidden="true" focusable="false">
      <path className="rr-tube" d="M0 2c.6 9 1.6 18 3 30" />
      <g className="rr-petals">
        {[0, 72, 144, 216, 288].map((a) => (
          <path key={a} className="rr-petal" transform={`rotate(${a})`} d="M0 0C4-5 4.5-12 0-17C-4.5-12-4-5 0 0Z" />
        ))}
      </g>
      <circle className="rr-heart" r="2.2" />
    </svg>
  );
}

export function RaatRani({ variant = 'ambient' }: { variant?: 'ambient' | 'hero' }) {
  const spots = variant === 'hero' ? HERO : AMBIENT;
  return (
    <div aria-hidden="true" className={`rr rr-${variant}`}>
      {spots.map((p, i) => (
        <span
          key={i}
          className="rr-spot"
          style={{ left: `${p.x}%`, top: `${p.y}%`, '--rr-s': p.s, '--rr-r': `${p.r}deg`, '--rr-d': `${p.d}s` } as CSSProperties}
        >
          <Blossom />
          <span className="rr-scent" />
        </span>
      ))}
    </div>
  );
}
