'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Share2 } from 'lucide-react';
import { PadaLine } from '@/app/components/PadaLine';
import { useEffect, useState, type CSSProperties } from 'react';
import { DAILY_WISDOM_REGISTRY, getTodayWisdom, type DailyWisdomItem } from '@/data/daily-wisdom-engine';
import { SITE_URL } from '@/lib/jsonld';
import { readHref } from '@/lib/verse-paths';
import type { vibeAttrs } from '@/lib/scripture-vibes';
import { cleanVerseField, verseLines } from '@/lib/verse-format';

const PatrikaShareStudioModal = dynamic(
  () => import('@/app/components/share/PatrikaShareStudioModal').then((m) => m.PatrikaShareStudioModal),
  { ssr: false }
);

/** Cover colours for each scripture the daily pool can pick, worked out on the server (see HomeTodayVerse)
 * so the browser never loads the whole scripture catalogue to colour one card. */
export type TodayVerseVibes = Record<string, ReturnType<typeof vibeAttrs>>;

export function TodayVerseCard({
  vibes = {},
  initialItem,
}: {
  vibes?: TodayVerseVibes;
  initialItem?: DailyWisdomItem;
}) {
  const [item, setItem] = useState<DailyWisdomItem>(initialItem ?? DAILY_WISDOM_REGISTRY[0]);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    setItem(getTodayWisdom());
  }, []);

  const attrs = vibes[item.scriptureId];
  const lines = verseLines(cleanVerseField(item.sanskrit));
  const verseHref = readHref(item.scriptureId, item.chapterId, item.verseId);

  return (
    <section
      aria-labelledby="today-verse-heading"
      className="reveal verse-card today-verse rounded-panel px-6 py-10 text-center shadow-raised sm:px-12 sm:py-14"
      data-scripture-id={item.scriptureId}
      data-material={attrs?.['data-material']}
      style={attrs?.style}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 text-left">
        <h2 id="today-verse-heading" className="text-sm font-semibold tracking-normal text-dharma-saffron">
          <span>Verse of the day</span> <span aria-hidden="true">·</span>{' '}
          <span lang="hi" className="font-devanagari">आज का श्लोक</span>
        </h2>
        <Link
          href={verseHref}
          className="verse-ref inline-flex min-h-[44px] items-center text-xs font-semibold tabular-nums"
          aria-label={`${item.scriptureTitle} ${item.chapterId}.${item.verseId}`}
        >
          <span>{item.scriptureTitle}</span>{' '}
          <span>{item.chapterId}.{item.verseId}</span>
        </Link>
      </div>

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

      <div
        className="verse-settle mt-6 flex flex-wrap items-center justify-center gap-3"
        style={{ '--i': lines.length + 3 } as CSSProperties}
      >
        <Link
          href={verseHref}
          className="chevron-nudge inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-dharma-saffron/30 bg-dharma-saffron/10 px-4 py-2 text-sm font-semibold text-dharma-saffron transition-colors hover:bg-dharma-saffron/15"
        >
          <span>Read in context</span> <span aria-hidden="true">›</span>
        </Link>
        <button
          type="button"
          onClick={() => setShareOpen(true)}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-card/80 px-4 py-2 text-sm font-medium text-dharma-text transition-colors hover:border-dharma-saffron/50 hover:text-dharma-saffron"
        >
          <Share2 className="h-4 w-4 text-dharma-saffron" aria-hidden="true" />
          <span>Share card</span>
          <span aria-hidden="true" className="text-dharma-muted">·</span>
          <span lang="hi" className="font-devanagari">साझा करें</span>
        </button>
      </div>

      {shareOpen && (
        <PatrikaShareStudioModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          data={{
            scriptureTitle: item.scriptureTitleSanskrit || item.scriptureTitle,
            chapterTitle: item.chapterTitle,
            reference: `${item.scriptureTitleSanskrit || item.scriptureTitle} ${item.chapterId}.${item.verseId}`,
            sanskrit: item.sanskrit,
            transliteration: item.transliteration,
            hindi: item.hindi,
            translation: item.translation,
            coreShift: item.practicalTeachingHi,
            url: `${SITE_URL}${verseHref}`,
          }}
        />
      )}
    </section>
  );
}
