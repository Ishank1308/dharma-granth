'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { ReaderRef, ReaderVerseText } from '@/lib/reader-actions';

const VerseCompletionInner = dynamic(
  () => import('./VerseCompletionInner').then((m) => m.VerseCompletionInner),
  { ssr: false },
);

/**
 * End-of-verse card (spec §17). Calm and non-competitive: no counts, streaks
 * or comparisons with other readers. Loads lazily after scroll/click/idle.
 */
export function VerseCompletion(props: {
  reference: string;
  readerRef: ReaderRef;
  verse: ReaderVerseText;
  nextHref?: string;
  chapterHref: string;
  conceptHref?: string;
}) {
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const onInteract = () => setHasInteracted(true);
    window.addEventListener('scroll', onInteract, { once: true, passive: true });
    window.addEventListener('keydown', onInteract, { once: true });
    window.addEventListener('click', onInteract, { once: true });
    const timer = setTimeout(() => setHasInteracted(true), 4000);

    return () => {
      window.removeEventListener('scroll', onInteract);
      window.removeEventListener('keydown', onInteract);
      window.removeEventListener('click', onInteract);
      clearTimeout(timer);
    };
  }, []);

  if (!hasInteracted) return null;
  return <VerseCompletionInner {...props} />;
}
