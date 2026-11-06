'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { isBookmarked, toggleBookmark, type ReaderRef, type ReaderVerseText } from '@/lib/reader-actions';

/**
 * End-of-verse card (spec §17). Calm and non-competitive: no counts, streaks
 * or comparisons with other readers.
 */
export function VerseCompletion({
  reference,
  readerRef,
  verse,
  nextHref,
  chapterHref,
  conceptHref = '/concepts',
}: {
  reference: string;
  readerRef: ReaderRef;
  verse: ReaderVerseText;
  nextHref?: string;
  chapterHref: string;
  conceptHref?: string;
}) {
  const [saved, setSaved] = useState(false);
  const [note, setNote] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(readerRef, verse));
    // Reveal completion banner only after client-side reading interaction
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
  }, [readerRef, verse]);

  if (!hasInteracted) return null;

  const save = () => {
    const state = toggleBookmark(readerRef, verse);
    if (state === null) return setNote('Could not save: browser storage is unavailable.');
    setSaved(state);
    setNote(state ? 'Saved for later.' : 'Removed from saved verses.');
  };

  const item = 'focus-ring inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition';
  const plain = `${item} border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-400`;

  return (
    <section aria-labelledby="completion-h" className="understand-fade mt-8 rounded-2xl border border-dharma-border bg-dharma-card p-5 text-center sm:p-6">
      <h2 id="completion-h" className="font-serif text-lg font-bold text-dharma-text">
        You have explored {reference}.
      </h2>
      <p lang="hi" className="mt-1 font-devanagari text-sm text-dharma-muted">आपने इस श्लोक का अध्ययन किया।</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
        {nextHref && (
          <Link href={nextHref} className={`${item} border-saffron-700 bg-saffron-700 text-white hover:bg-saffron-800`}>
            Continue to next verse
          </Link>
        )}
        <Link href={chapterHref} className={plain}>Read the full passage</Link>
        <Link href={conceptHref} className={plain}>Explore related ideas</Link>
        <button type="button" onClick={save} aria-pressed={saved} className={plain}>
          {saved ? <BookmarkCheck className="h-4 w-4" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
          {saved ? 'Saved' : 'Save for later'}
        </button>
        <Link href="/learn/plans/" className={plain}>Add to a reading plan</Link>
      </div>
      <p role="status" aria-live="polite" className="mt-2 min-h-[1.25rem] text-sm text-dharma-muted">{note}</p>
    </section>
  );
}
