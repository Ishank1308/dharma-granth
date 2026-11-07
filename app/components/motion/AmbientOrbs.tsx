'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Slow-drifting gradient orbs that sit behind the chapter content as a
 * subtle ambient layer. Each orb is a blurred radial gradient that
 * moves on a long cycle — too slow to be distracting, fast enough that
 * a scrolling reader notices movement at the periphery.
 *
 * Decorative only. Pointer-events disabled. Respects reduced-motion.
 */
export function AmbientOrbs() {
  const reduce = useReducedMotion();
  // Reading pages stay still on phones and tablets: three blurred, always-moving layers cost
  // battery and pull the eye from the verse. Desktop keeps them unless reduced motion is set.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const update = () => setWide(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  if (!wide || reduce) return null;

  const orbs = [
    {
      size: 480,
      from: 'rgba(254, 215, 170, 0.5)', // saffron-200
      to: 'rgba(254, 215, 170, 0)',
      left: '-10%',
      top: '5%',
      drift: { x: [0, 60, -20, 0], y: [0, 40, 80, 0] },
      duration: 38,
    },
    {
      size: 380,
      from: 'rgba(254, 205, 211, 0.4)', // rose-200
      to: 'rgba(254, 205, 211, 0)',
      left: '70%',
      top: '20%',
      drift: { x: [0, -50, 30, 0], y: [0, 60, -20, 0] },
      duration: 42,
    },
    {
      size: 420,
      from: 'rgba(199, 210, 254, 0.35)', // indigo-200
      to: 'rgba(199, 210, 254, 0)',
      left: '15%',
      top: '55%',
      drift: { x: [0, 70, -40, 0], y: [0, -50, 30, 0] },
      duration: 46,
    },
    {
      size: 360,
      from: 'rgba(187, 247, 208, 0.35)', // emerald-200
      to: 'rgba(187, 247, 208, 0)',
      left: '65%',
      top: '70%',
      drift: { x: [0, -60, 20, 0], y: [0, 50, -30, 0] },
      duration: 40,
    },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.from} 0%, ${orb.to} 70%)`,
            filter: 'blur(40px)',
          }}
          animate={reduce ? {} : { x: orb.drift.x, y: orb.drift.y }}
          transition={
            reduce
              ? {}
              : {
                  duration: orb.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 1.5,
                }
          }
        />
      ))}
    </div>
  );
}
