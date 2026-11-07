'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Share2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { PadaLine } from '@/app/components/PadaLine';
import { useEffect, useState, type CSSProperties } from 'react';
import { DAILY_WISDOM_REGISTRY, getTodayWisdom, type DailyWisdomItem } from '@/data/daily-wisdom-engine';
import { SITE_URL } from '@/lib/jsonld';
import { readHref } from '@/lib/verse-paths';
import type { vibeAttrs } from '@/lib/scripture-vibes';
import { cleanVerseField, verseLines } from '@/lib/verse-format';
import { triggerTactileFeedback } from '@/lib/haptics';

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
  const [showPractice, setShowPractice] = useState(false);

  useEffect(() => {
    setItem(getTodayWisdom());
  }, []);

  const attrs = vibes[item.scriptureId];
  const lines = verseLines(cleanVerseField(item.sanskrit));
  const verseHref = readHref(item.scriptureId, item.chapterId, item.verseId);

  const togglePractice = () => {
    triggerTactileFeedback('selection', 'softTap');
    setShowPractice((prev) => !prev);
  };

  const handleShareClick = () => {
    triggerTactileFeedback('selection', 'softTap');
    setShareOpen(true);
  };

  return (
    <section
      aria-labelledby="today-verse-heading"
      className="reveal verse-card today-verse relative overflow-hidden rounded-panel border border-amber-500/25 bg-dharma-card/95 px-6 py-10 text-center shadow-raised backdrop-blur-md sm:px-12 sm:py-14"
      data-scripture-id={item.scriptureId}
      data-material={attrs?.['data-material']}
      style={attrs?.style}
    >
      {/* Classical Manuscript Corner Accents */}
      <span aria-hidden="true" className="pointer-events-none absolute left-3 top-2.5 font-serif text-sm text-dharma-saffron/40 select-none">
        𑁍
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute right-3 top-2.5 font-serif text-sm text-dharma-saffron/40 select-none">
        𑁍
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 left-3 font-serif text-sm text-dharma-saffron/40 select-none">
        𑁍
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 right-3 font-serif text-sm text-dharma-saffron/40 select-none">
        𑁍
      </span>

      <div className="flex flex-wrap items-center justify-between gap-3 text-left">
        <h2 id="today-verse-heading" className="text-sm font-semibold tracking-normal text-dharma-saffron">
          <span>Verse of the day</span> <span aria-hidden="true">·</span>{' '}
          <span lang="hi" className="font-devanagari">आज का श्लोक</span>
        </h2>
        <Link
          href={verseHref}
          className="verse-ref inline-flex min-h-[44px] items-center text-xs font-semibold tabular-nums hover:text-dharma-saffron focus-ring"
          aria-label={`${item.scriptureTitle} ${item.chapterId}.${item.verseId}`}
        >
          <span>{item.scriptureTitle}</span>{' '}
          <span>{item.chapterId}.{item.verseId}</span>
        </Link>
      </div>

      {/* The whole shloka, line breaks as published; never shortened. */}
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
          className="verse-settle mx-auto mt-6 max-w-[620px] font-devanagari text-lg leading-[1.8] text-dharma-text/90 sm:text-xl"
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

      {/* Expandable Daily Practical Micro-Shift Folio */}
      {item.practicalTeachingHi && (
        <div
          className="verse-settle mx-auto mt-6 max-w-[620px] text-left"
          style={{ '--i': lines.length + 3 } as CSSProperties}
        >
          <div className="overflow-hidden rounded-xl border border-dharma-saffron/25 bg-dharma-saffron/5 shadow-xs transition-all">
            <button
              type="button"
              onClick={togglePractice}
              aria-expanded={showPractice}
              className="flex w-full min-h-[44px] items-center justify-between px-4 py-3 text-left focus-ring hover:bg-dharma-saffron/10 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-dharma-saffron">
                <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>जीवन में प्रयोग</span>
                <span aria-hidden="true" className="opacity-60">·</span>
                <span className="font-normal normal-case text-dharma-muted">Daily Practical Micro-Shift</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-dharma-saffron font-medium">
                <span>{showPractice ? 'संक्षेप करें' : 'पढ़ें'}</span>
                {showPractice ? (
                  <ChevronUp className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                )}
              </div>
            </button>

            {showPractice && (
              <div className="border-t border-dharma-saffron/20 px-4 py-3.5 space-y-2.5 animate-fadeIn">
                <p lang="hi" className="font-devanagari text-sm leading-relaxed text-dharma-text">
                  {item.practicalTeachingHi}
                </p>
                {item.reflectionPromptHi && (
                  <div className="rounded-lg bg-dharma-bg/70 p-2.5 text-xs text-dharma-muted font-devanagari">
                    <strong className="text-dharma-saffron">आज का मनन:</strong> {item.reflectionPromptHi}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Folio Action Strip */}
      <div
        className="verse-settle mt-6 flex flex-wrap items-center justify-center gap-3"
        style={{ '--i': lines.length + 4 } as CSSProperties}
      >
        <Link
          href={verseHref}
          className="chevron-nudge inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-dharma-saffron/30 bg-dharma-saffron/10 px-5 py-2.5 text-sm font-semibold text-dharma-saffron transition-all hover:bg-dharma-saffron/20 focus-ring"
        >
          <span>Read in context</span> <span aria-hidden="true">›</span>
        </Link>
        <button
          type="button"
          onClick={handleShareClick}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-card/90 px-5 py-2.5 text-sm font-medium text-dharma-text transition-all hover:border-dharma-saffron/50 hover:text-dharma-saffron focus-ring"
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
