'use client';

import Link from 'next/link';
import { PadaLine } from '@/app/components/PadaLine';
import { useEffect, useState, type CSSProperties } from 'react';
import { getTodayWisdom, type DailyWisdomItem } from '@/data/daily-wisdom-engine';
import { readHref } from '@/lib/verse-paths';
import { scriptureCatalog } from '@/data/scripture-meta';
import { scriptureVibe, vibeAttrs } from '@/lib/scripture-vibes';
import { cleanVerseField, verseLines } from '@/lib/verse-format';

/**
 * Today's verse as one quiet card: the whole shloka, its Hindi and English, and a link to read it in place.
 * The pick depends on the reader's date, so it fills in after mount; the card keeps its height meanwhile.
 */
export function TodayVerseCard() {
  const [item, setItem] = useState<DailyWisdomItem | null>(null);

  useEffect(() => {
    setItem(getTodayWisdom());
  }, []);

  const meta = item ? scriptureCatalog.find((s) => s.id === item.scriptureId) : undefined;
  const vibe = item ? scriptureVibe(item.scriptureId, meta?.category ?? 'other') : undefined;
  const attrs = vibe ? vibeAttrs(vibe) : undefined;
  const lines = item ? verseLines(cleanVerseField(item.sanskrit)) : [];

  return (
    <section
      aria-labelledby="today-verse-heading"
      className="reveal verse-card today-verse rounded-panel px-6 py-10 text-center shadow-raised sm:px-12 sm:py-14"
      data-scripture-id={item?.scriptureId}
      data-material={attrs?.['data-material']}
      style={attrs?.style}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 text-left">
        <h2 id="today-verse-heading" className="text-sm font-semibold tracking-normal text-dharma-saffron">
          <span>Verse of the day</span> <span aria-hidden="true">·</span>{' '}
          <span lang="hi" className="font-devanagari">आज का श्लोक</span>
        </h2>
        {item && (
          <Link
            href={readHref(item.scriptureId, item.chapterId, item.verseId)}
            className="verse-ref text-xs font-semibold tabular-nums"
            aria-label={`${item.scriptureTitle} ${item.chapterId}.${item.verseId}`}
          >
            <span>{item.scriptureTitle}</span>{' '}
            <span>{item.chapterId}.{item.verseId}</span>
          </Link>
        )}
      </div>
      {item ? (
        <>
          {/* The whole shloka, line breaks as published; never shortened. Each published line is its own block
              so the lines can settle one after another (app/motion.css, .verse-line). */}
          <div className="verse-folio mx-auto mt-6 max-w-[720px] py-6 text-center">
            <p lang="sa" className="shloka-text text-2xl leading-[1.7] text-dharma-text sm:text-[34px]">
              {lines.map((line, i) => (
                <span key={i} className="verse-line block" style={{ '--i': i } as CSSProperties}>
                  {line ? <PadaLine line={line} /> : '\u00a0'}
                </span>
              ))}
            </p>
            <span aria-hidden="true" className="verse-mark mt-3 block text-base font-semibold">
              ॥ {item.chapterId}.{item.verseId} ॥
            </span>
          </div>
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
          <div className="verse-settle mt-6 text-center" style={{ '--i': lines.length + 3 } as CSSProperties}>
            <Link
              href={readHref(item.scriptureId, item.chapterId, item.verseId)}
              className="chevron-nudge inline-flex items-center gap-1.5 text-sm font-semibold text-dharma-saffron hover:underline"
            >
              <span>Read in context</span> <span aria-hidden="true">›</span>
            </Link>
          </div>
        </>
      ) : (
        <div aria-hidden="true" className="min-h-[260px]" />
      )}
    </section>
  );
}
