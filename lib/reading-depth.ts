'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ReaderModeTier } from '@/lib/useReaderSettings';

/**
 * How much of the explanation layer the reader wants beside the scripture.
 *   read        scripture, the chosen translations, previous/next. Nothing else.
 *   understand  adds the simple explanation, a hand-written core shift and common misreading when one exists, and one reflection.
 *   study       adds word-by-word meaning, the research note, key-term links and everything above.
 * The choice is kept on this device only.
 */
export type ReadingDepth = 'read' | 'understand' | 'study';

export const READING_DEPTHS: { id: ReadingDepth; en: string; hi: string; hint: string }[] = [
  { id: 'read', en: 'Read', hi: 'पढ़ें', hint: 'The shloka and its meaning, with the least explanation' },
  { id: 'understand', en: 'Understand', hi: 'समझें', hint: 'Adds a simple explanation' },
  { id: 'study', en: 'Study', hi: 'अध्ययन', hint: 'Adds word meanings, notes and terms' },
];

const KEY = 'dharma.readingDepth';
/** Same-tab broadcast when the choice changes; the verse reader's settings listen for it too. */
export const READING_DEPTH_EVENT = 'dharma-reading-depth';
const EVENT = READING_DEPTH_EVENT;
/**
 * New readers start with the original verse and selected meaning visible. The inline
 * व्याख्या remains one tap away on each card; readers who explicitly selected
 * Understand or Study keep their saved preference. This avoids auto-expanding
 * dozens of long explanations during initial chapter hydration.
 */
export const DEFAULT_DEPTH: ReadingDepth = 'read';
/**
 * The server render matches the initial compact reading view. A saved deeper preference
 * is restored after hydration, without increasing every exported chapter's HTML size.
 */
const SERVER_DEPTH: ReadingDepth = 'read';

/** The reader's own choice, or null when they have not made one (each page then keeps its own default). */
export function readStoredDepth(): ReadingDepth | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'read' || v === 'understand' || v === 'study' ? v : null;
  } catch {
    return null;
  }
}

function readStored(): ReadingDepth {
  return readStoredDepth() ?? DEFAULT_DEPTH;
}

/**
 * One depth choice for chapter and verse pages. The verse page keeps its own views
 * (lib/useReaderSettings readerMode): Read is its short view (the key message and a takeaway),
 * Understand its simple view, Study its deep view. A reader who chose the older Traditional
 * view keeps it under Study.
 */
export function depthForMode(mode: ReaderModeTier): ReadingDepth {
  return mode === 'quick' ? 'read' : mode === 'simple' ? 'understand' : 'study';
}

export function modeForDepth(depth: ReadingDepth, current: ReaderModeTier): ReaderModeTier {
  if (depth === 'read') return 'quick';
  if (depth === 'understand') return 'simple';
  return current === 'traditional' ? 'traditional' : 'deep';
}

export function saveReadingDepth(d: ReadingDepth | null) {
  try {
    if (d) localStorage.setItem(KEY, d);
    else localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: the choice still applies until the page is closed.
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Current reading depth, shared by every component on the page and across tabs. */
export function useReadingDepth(): [ReadingDepth, (d: ReadingDepth) => void] {
  const [depth, setDepthState] = useState<ReadingDepth>(SERVER_DEPTH);

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
    saveReadingDepth(d);
  }, []);

  return [depth, setDepth];
}
