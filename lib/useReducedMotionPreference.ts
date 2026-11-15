'use client';

import { useEffect, useState } from 'react';

/**
 * The device's reduce-motion preference, following changes. A dependency-free stand-in for framer-motion's
 * useReducedMotion, for components that otherwise do not need framer (so their pages do not download it).
 * False on the server and until mount.
 */
export function useReducedMotionPreference(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);
  return reduce;
}
