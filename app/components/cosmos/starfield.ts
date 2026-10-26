/** A fixed, seeded star map, so the server HTML and the browser draw the same sky. */
export interface Star {
  x: number;
  y: number;
  r: number;
  o: number;
  /** Twinkle delay in seconds; undefined for stars that hold still. */
  twinkle?: number;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeStars(count: number, seed: number): Star[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => {
    const size = rand();
    return {
      x: +(rand() * 100).toFixed(2),
      y: +(rand() * 100).toFixed(2),
      r: +(size > 0.97 ? 1.6 : size > 0.85 ? 1.1 : 0.6 + rand() * 0.3).toFixed(2),
      o: +(0.35 + rand() * 0.65).toFixed(2),
      twinkle: rand() > 0.72 ? +(rand() * 6).toFixed(2) : undefined,
    };
  });
}
