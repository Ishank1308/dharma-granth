'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * How much of the explanation layer the reader wants beside the scripture.
 *   read        scripture, the chosen translations, previous/next. Nothing else.
 *   understand  adds the simple explanation, a hand-written core shift and common misreading when one exists, and one reflection.
 *   study       adds word-by-word meaning, the research note, key-term links and everything above.
 * The choice is kept on this device only.
 */
export type ReadingDepth = 'read' | 'understand' | 'study';

export const READING_DEPTHS: { id: ReadingDepth; en: string; hi: string; hint: string }[] = [
  { id: 'read', en: 'Read', hi: 'पढ़ें', hint: 'Scripture and translation only' },
  { id: 'understand', en: 'Understand', hi: 'समझें', hint: 'Adds a simple explanation' },
  { id: 'study', en: 'Study', hi: 'अध्ययन', hint: 'Adds word meanings, notes and terms' },
];

const KEY = 'dharma.readingDepth';
const EVENT = 'dharma-reading-depth';
export const DEFAULT_DEPTH: ReadingDepth = 'read';

function readStored(): ReadingDepth {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'read' || v === 'understand' || v === 'study' ? v : DEFAULT_DEPTH;
  } catch {
    return DEFAULT_DEPTH;
  }
}

/** Current reading depth, shared by every component on the page and across tabs. */
export function useReadingDepth(): [ReadingDepth, (d: ReadingDepth) => void] {
  const [depth, setDepthState] = useState<ReadingDepth>(DEFAULT_DEPTH);

  useEffect(() => {
    setDepthState(readStored());
    const sync = () => setDepthState(readStored());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const setDepth = useCallback((d: ReadingDepth) => {
    setDepthState(d);
    try {
      localStorage.setItem(KEY, d);
    } catch {
      // Storage blocked: the choice still applies until the page is closed.
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return [depth, setDepth];
}
