'use client';

import Link from 'next/link';
import { PadaLine } from '@/app/components/PadaLine';
import { useEffect, useState } from 'react';
import { getTodayWisdom, type DailyWisdomItem } from '@/data/daily-wisdom-engine';
import { readHref } from '@/lib/verse-paths';

/**
 * Today's verse as one quiet card: the whole shloka, its Hindi and English, and a link to read it in place.
 * The pick depends on the reader's date, so it fills in after mount; the card keeps its height meanwhile.
 */
export function TodayVerseCard() {
  const [item, setItem] = useState<DailyWisdomItem | null>(null);

  useEffect(() => {
    setItem(getTodayWisdom());
  }, []);

  return (
    <section
      aria-labelledby="today-verse-heading"
      className="rounded-[28px] bg-dharma-card px-6 py-12 text-center shadow-[0_2px_6px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] sm:px-12 sm:py-16"
    >
      <h2 id="today-verse-heading" className="text-sm font-semibold tracking-normal text-dharma-saffron">
        <span>Verse of the day</span> <span aria-hidden="true">·</span>{' '}
        <span lang="hi" className="font-devanagari">आज का श्लोक</span>
      </h2>
      {item ? (
        <>
          {/* The whole shloka, line breaks as published; never shortened. */}
          <p lang="sa" className="shloka-text mx-auto mt-6 max-w-[680px] text-2xl leading-[1.7] text-dharma-text sm:text-[34px]">
            {item.sanskrit.trim().split(/\r?\n/).map((line, i) => (
              <span key={i} className="block">
                <PadaLine line={line} />
              </span>
            ))}
          </p>
          {item.hindi && (
            <p lang="hi" className="mx-auto mt-6 max-w-[620px] font-devanagari text-lg leading-[1.8] text-dharma-text/85 sm:text-xl">
              {item.hindi}
            </p>
          )}
          {item.translation && (
            <p className="mx-auto mt-3 max-w-[620px] font-serif text-lg leading-normal text-dharma-muted sm:text-[21px]">
              {item.translation}
            </p>
          )}
          <p className="mt-6 text-sm text-dharma-muted">
            <span>
              {item.scriptureTitle} {item.chapterId}.{item.verseId}
            </span>
            <span aria-hidden="true"> · </span>
            <Link href={readHref(item.scriptureId, item.chapterId, item.verseId)} className="text-dharma-saffron hover:underline">
              Read in context <span aria-hidden="true">›</span>
            </Link>
          </p>
        </>
      ) : (
        <div aria-hidden="true" className="min-h-[260px]" />
      )}
    </section>
  );
}
