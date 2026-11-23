'use client';

/**
 * The shloka kept beside its commentary. Once the verse has scrolled off the top of the verse
 * page, the whole shloka (never a clipped line of it) stays in reach while the अर्थ and व्याख्या
 * are read: on wide screens it appears in the sidebar by itself; on phones and tablets a small
 * button offers it, and a reader who takes it keeps it pinned under the header from then on.
 * The preference stays on the device.
 *
 * Loaded the first time the verse scrolls away (VerseReader), so the page's first load is unchanged.
 */

import { useEffect, useState } from 'react';
import { ArrowUp, ChevronDown, X } from 'lucide-react';
import { PadaLine } from '@/app/components/PadaLine';
import { cleanVerseField, formatVerseRef, verseLines, verseMarkNumber } from '@/lib/verse-format';

const PIN_KEY = 'dharma.pinShloka';

const iconBtn =
  'focus-ring inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-label-secondary transition hover:bg-fill-quaternary hover:text-label-primary';

export function PinnedShloka({
  variant,
  away,
  scriptureId,
  chapterId,
  number,
  sanskrit,
  smooth,
}: {
  /** `aside`: the wide-screen sidebar. `bar`: under the header, below the sidebar's breakpoint. */
  variant: 'aside' | 'bar';
  /** The verse itself has scrolled off the top of the screen. */
  away: boolean;
  scriptureId: string;
  chapterId: number;
  number: number | string;
  sanskrit?: string;
  /** False when the reader has asked for reduced motion. */
  smooth: boolean;
}) {
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    try {
      setPinned(localStorage.getItem(PIN_KEY) === '1');
    } catch {
      // Private mode: the choice lasts for this page.
    }
  }, []);
  const choose = (next: boolean) => {
    setPinned(next);
    try {
      if (next) localStorage.setItem(PIN_KEY, '1');
      else localStorage.removeItem(PIN_KEY);
    } catch {
      // ignore
    }
  };

  const lines = sanskrit ? verseLines(cleanVerseField(sanskrit)) : [];
  if (!away || lines.length === 0) return null;

  const reference = formatVerseRef(scriptureId, chapterId, number);
  const toVerse = () => window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
  const back = (
    <button type="button" onClick={toVerse} aria-label="Back to the verse · मूल श्लोक पर जाएँ" title="मूल श्लोक पर जाएँ · Back to the verse" className={iconBtn}>
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </button>
  );
  const shloka = (size: string) => (
    <p lang="sa" className={`text-center font-devanagari font-semibold text-dharma-text ${size}`}>
      {lines.map((line, i) => (
        <span key={i} className="block">
          <PadaLine line={line} />
        </span>
      ))}
      <span aria-hidden="true" className="verse-mark mt-1 block text-xs font-semibold">
        ॥ {verseMarkNumber(number)} ॥
      </span>
    </p>
  );
  const name = `श्लोक ${reference} का मूल पाठ · The verse being read`;

  if (variant === 'aside') {
    return (
      <div className="pinned-shloka-open mb-4">
        <section data-pinned-shloka="aside" aria-label={name} className="min-h-0 overflow-hidden rounded-card border border-separator/70 bg-surface-raised/80 shadow-xs">
          <div className="flex items-center justify-between pl-3">
            <span className="verse-ref font-serif text-xs font-semibold tabular-nums">{reference}</span>
            {back}
          </div>
          <div className="px-3 pb-3">{shloka('text-[0.95rem] leading-[1.95]')}</div>
        </section>
      </div>
    );
  }

  return (
    <div data-focus-hide className="pointer-events-none sticky top-[5.25rem] z-20 -mx-4 h-0 sm:top-16 lg:hidden">
      {pinned ? (
        <section
          data-pinned-shloka="bar"
          aria-label={name}
          className="chrome-fade pointer-events-auto mx-2 max-h-[40vh] overflow-y-auto rounded-card border border-separator/70 bg-surface-elevated/95 shadow-raised backdrop-blur-md sm:mx-auto sm:max-w-xl"
        >
          <div className="flex items-center pl-3.5">
            <span className="verse-ref mr-auto font-serif text-xs font-semibold tabular-nums">{reference}</span>
            {back}
            <button type="button" onClick={() => choose(false)} aria-label="Unpin the verse · श्लोक हटाएँ" title="श्लोक हटाएँ · Unpin the verse" className={iconBtn}>
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="px-3 pb-3">{shloka('text-base leading-[1.9]')}</div>
        </section>
      ) : (
        <div className="flex justify-end px-3">
          <button
            type="button"
            onClick={() => choose(true)}
            aria-expanded={false}
            className="chrome-fade focus-ring pointer-events-auto inline-flex min-h-[44px] items-center gap-1.5 rounded-pill border border-separator/70 bg-surface-elevated/95 px-3.5 text-footnote font-semibold text-label-primary shadow-raised backdrop-blur-md"
          >
            <span lang="hi" data-bi="hi" className="font-devanagari">श्लोक देखें</span>
            <span data-bi="sep" aria-hidden="true">·</span>
            <span data-bi="en">Show verse</span>
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
