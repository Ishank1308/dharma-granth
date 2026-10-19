'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { getTodayWisdom, type DailyWisdomItem } from '@/data/daily-wisdom-engine';
import { readHref } from '@/lib/verse-paths';
import { formatIstLong } from '@/lib/ist';

/** First sentence, capped, so the home page shows a glimpse and the verse page carries the full explanation. */
function firstSentence(text: string, max = 180): string {
  const t = text.replace(/\s+/g, ' ').trim();
  const m = t.match(/^.*?[.!?।](?=\s|$)/);
  const s = m ? m[0] : t;
  return s.length > max ? `${s.slice(0, max).replace(/\s+\S*$/, '')}…` : s;
}

/**
 * Compact Verse of the Day for the home page: reference, the canonical verse, a one-line meaning, a short
 * reflection and a link to the full explanation. The day is the Indian calendar day, the same for everyone.
 * Rendered after mount because the day depends on the visitor's clock; a fixed-height placeholder avoids layout shift.
 */
export function VerseOfTheDayCompact() {
  const [item, setItem] = useState<DailyWisdomItem | null>(null);
  const [date, setDate] = useState('');

  useEffect(() => {
    setItem(getTodayWisdom());
    setDate(formatIstLong());
  }, []);

  return (
    <section aria-labelledby="votd-heading" className="border-b border-dharma-border bg-dharma-bg py-10 sm:py-12">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-saffron-700 dark:text-saffron-400">
          <span lang="hi" className="font-devanagari">आज का श्लोक</span> · Verse of the day
          {date ? <span className="ml-2 font-medium normal-case tracking-normal text-dharma-muted">{date}</span> : null}
        </p>
        <h2 id="votd-heading" className="sr-only">
          Verse of the day
        </h2>

        {item ? (
          <article className="mt-3 rounded-2xl border border-dharma-border bg-dharma-card p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold text-dharma-muted">
              {item.scriptureTitle} {item.chapterId}.{item.verseId}
            </p>
            <blockquote lang="sa" className="mt-3 whitespace-pre-line font-devanagari text-2xl leading-relaxed text-dharma-text sm:text-3xl">
              {item.sanskrit}
            </blockquote>
            <p className="mt-4 text-base leading-relaxed text-dharma-text">{item.translation}</p>
            <p className="mt-3 border-l-2 border-saffron-500/60 pl-3 text-sm leading-relaxed text-dharma-muted">
              {firstSentence(item.practicalTeaching)}
            </p>
            <Link
              href={readHref(item.scriptureId, item.chapterId, item.verseId)}
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 font-semibold text-saffron-800 hover:underline dark:text-saffron-300"
            >
              Read full explanation <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </article>
        ) : (
          <div className="mt-3 min-h-[22rem] rounded-2xl border border-dharma-border bg-dharma-card" aria-hidden="true" />
        )}
      </div>
    </section>
  );
}
