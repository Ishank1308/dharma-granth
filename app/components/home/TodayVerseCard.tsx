'use client';

import Link from 'next/link';
import { PadaLine } from '@/app/components/PadaLine';
import { useEffect, useState, type CSSProperties } from 'react';
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

  const lines = item ? item.sanskrit.trim().split(/\r?\n/) : [];

  return (
    <section
      aria-labelledby="today-verse-heading"
      className="reveal rounded-[28px] bg-dharma-card px-6 py-12 text-center shadow-[0_2px_6px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] sm:px-12 sm:py-16"
    >
      <h2 id="today-verse-heading" className="text-sm font-semibold tracking-normal text-dharma-saffron">
        <span>Verse of the day</span> <span aria-hidden="true">·</span>{' '}
        <span lang="hi" className="font-devanagari">आज का श्लोक</span>
      </h2>
      {item ? (
        <>
          {/* The whole shloka, line breaks as published; never shortened. Each published line is its own block
              so the lines can settle one after another (app/motion.css, .verse-line). */}
          <p lang="sa" className="shloka-text mx-auto mt-6 max-w-[680px] text-2xl leading-[1.7] text-dharma-text sm:text-[34px]">
            {lines.map((line, i) => (
              <span key={i} className="verse-line" style={{ '--i': i } as CSSProperties}>
                {line ? <PadaLine line={line} /> : '\u00a0'}
              </span>
            ))}
          </p>
          {item.hindi && (
            <p
              lang="hi"
              className="verse-settle mx-auto mt-6 max-w-[620px] font-devanagari text-lg leading-[1.8] text-dharma-text/85 sm:text-xl"
              style={{ '--i': lines.length + 1 } as CSSProperties}
            >
              {item.hindi}
            </p>
          )}
          {item.translation && (
            <p
              className="verse-settle mx-auto mt-3 max-w-[620px] font-serif text-lg leading-normal text-dharma-muted sm:text-[21px]"
              style={{ '--i': lines.length + 2 } as CSSProperties}
            >
              {item.translation}
            </p>
          )}
          <p className="verse-settle mt-6 text-sm text-dharma-muted" style={{ '--i': lines.length + 3 } as CSSProperties}>
            <span>
              {item.scriptureTitle} {item.chapterId}.{item.verseId}
            </span>
            <span aria-hidden="true"> · </span>
            <Link href={readHref(item.scriptureId, item.chapterId, item.verseId)} className="chevron-nudge text-dharma-saffron hover:underline">
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
