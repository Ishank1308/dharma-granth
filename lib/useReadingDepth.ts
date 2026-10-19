'use client';

import { useCallback, useEffect, useState } from 'react';

export type ReadingDepth = 'read' | 'understand' | 'study';

export const READING_DEPTH_KEY = 'dharma_reading_depth';
export const READING_DEPTH_EVENT = 'dharma:reading-depth';

export interface ReadingDepthOption {
  id: ReadingDepth;
  labelHi: string;
  labelEn: string;
  shortLabel: string;
  subHi: string;
  subEn: string;
  descriptionHi: string;
  descriptionEn: string;
}

export const READING_DEPTH_CONFIG: Record<ReadingDepth, ReadingDepthOption> = {
  read: {
    id: 'read',
    labelHi: 'पाठ',
    labelEn: 'Read',
    shortLabel: 'पाठ · Read',
    subHi: 'मूल श्लोक व अनुवाद',
    subEn: 'Scripture-first flow',
    descriptionHi: 'शांत व एकाग्र पठन — केवल मूल पाठ और सरल अनुवाद',
    descriptionEn: 'Calm, uninterrupted reading with original scripture and clear translation.',
  },
  understand: {
    id: 'understand',
    labelHi: 'बोध',
    labelEn: 'Understand',
    shortLabel: 'बोध · Understand',
    subHi: 'मर्म, भावार्थ व सीख',
    subEn: 'Core shift & insights',
    descriptionHi: 'सरल भावार्थ, मर्म (Core Shift) और जीवनोपयोगी सीख',
    descriptionEn: 'Clear explanation, Core Shift aphorism, and modern reflection.',
  },
  study: {
    id: 'study',
    labelHi: 'स्वाध्याय',
    labelEn: 'Study',
    shortLabel: 'स्वाध्याय · Study',
    subHi: 'पदच्छेद, भाष्य व शोध',
    subEn: 'Full scholarly apparatus',
    descriptionHi: 'पदच्छेद, संधि-विच्छेद, प्राचीन भाष्य, व्याकरण व शास्त्रीय संदर्भ',
    descriptionEn: 'Word-by-word padaccheda, traditional commentaries, and scholarly apparatus.',
  },
};

const VALID_DEPTHS: ReadingDepth[] = ['read', 'understand', 'study'];

function isValidDepth(val: unknown): val is ReadingDepth {
  return typeof val === 'string' && VALID_DEPTHS.includes(val as ReadingDepth);
}

/**
 * Hook for managing progressive reading depth across the application.
 * Defaults to 'read' (Scripture-first).
 * Automatically broadcasts changes across components and browser tabs.
 */
export function useReadingDepth() {
  const [depth, setDepthState] = useState<ReadingDepth>('read');

  useEffect(() => {
    // Read from localStorage on mount
    try {
      const stored = localStorage.getItem(READING_DEPTH_KEY);
      if (isValidDepth(stored)) {
        setDepthState(stored);
      }
    } catch {
      // Storage unavailable, stay with default 'read'
    }

    const handleSync = (e: Event) => {
      if (e instanceof CustomEvent && isValidDepth(e.detail)) {
        setDepthState(e.detail);
      } else {
        try {
          const stored = localStorage.getItem(READING_DEPTH_KEY);
          if (isValidDepth(stored)) {
            setDepthState(stored);
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener(READING_DEPTH_EVENT, handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener(READING_DEPTH_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const setReadingDepth = useCallback((newDepth: ReadingDepth) => {
    setDepthState(newDepth);
    try {
      localStorage.setItem(READING_DEPTH_KEY, newDepth);
    } catch {
      // ignore
    }
    // Broadcast to other components in the same window
    window.dispatchEvent(new CustomEvent(READING_DEPTH_EVENT, { detail: newDepth }));
  }, []);

  return {
    depth,
    setReadingDepth,
    isReadMode: depth === 'read',
    isUnderstandMode: depth === 'understand',
    isStudyMode: depth === 'study',
    config: READING_DEPTH_CONFIG[depth],
  };
}
