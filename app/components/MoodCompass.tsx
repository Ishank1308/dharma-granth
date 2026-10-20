'use client';

/**
 * Homepage Mood Compass: a scrollable strip of states of mind; picking one
 * swaps the curated verses below in place (no navigation). The first mood is
 * selected on the server render, so crawlers and no-JS readers get real
 * verses, not an empty shell. Data: lib/mood-compass.ts.
 */

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';
import type { Mood } from '@/lib/mood-compass';
import { triggerTactileFeedback } from '@/lib/haptics';

export function MoodCompass({ moods }: { moods: Mood[] }) {
  const [activeId, setActiveId] = useState(moods[0]?.id);
  const active = moods.find((m) => m.id === activeId) ?? moods[0];
  if (!active) return null;

  return (
    <section aria-labelledby="mood-compass-heading" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-5">
        <p className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-saffron-800 dark:text-saffron-300">
          <Compass className="h-3.5 w-3.5" aria-hidden="true" />
          <span lang="hi">मनोदशा दिशा-सूचक</span>
          <span aria-hidden="true">·</span>
          <span lang="en">Mood Compass</span>
        </p>
        <h2 id="mood-compass-heading" className="font-serif text-2xl font-bold text-dharma-text sm:text-3xl">
          <span lang="en">How are you feeling right now?</span>{' '}
          <span lang="hi" className="block font-devanagari text-lg font-semibold text-dharma-muted sm:text-xl">
            आज मन कैसा है?
          </span>
        </h2>
      </div>

      <div
        role="group"
        aria-label="Choose a mood"
        className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:thin] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {moods.map((mood) => {
          const selected = mood.id === active.id;
          return (
            <button
              key={mood.id}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                triggerTactileFeedback('selection', 'softTap');
                setActiveId(mood.id);
              }}
              className={`inline-flex min-h-[44px] shrink-0 snap-start items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500/60 ${
                selected
                  ? 'border-saffron-600 bg-saffron-600 text-white shadow-md dark:border-saffron-500 dark:bg-saffron-500 dark:text-stone-950'
                  : 'border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-400'
              }`}
            >
              <span lang="en">{mood.en}</span>
              <span lang="hi" className={`font-devanagari text-xs ${selected ? 'opacity-90' : 'text-dharma-muted'}`}>
                {mood.hi}
              </span>
            </button>
          );
        })}
      </div>

      <ul aria-live="polite" className="mt-4 grid gap-4 md:grid-cols-3">
        {active.verses.map((v) => (
          <li key={`${active.id}-${v.id}`} className="flex flex-col rounded-3xl border border-dharma-border bg-dharma-card p-5 shadow-sm">
            <p className="mb-3 flex flex-wrap items-baseline justify-between gap-2 text-xs font-bold">
              <span lang="hi" className="font-devanagari text-saffron-800 dark:text-saffron-300">
                {v.referenceHi}
              </span>
              <span lang="en" className="text-dharma-muted">
                {v.referenceEn}
              </span>
            </p>
            <p lang="sa" className="whitespace-pre-line font-devanagari text-base leading-loose text-dharma-text">
              {v.sanskrit}
            </p>
            <p lang="hi" className="mt-3 border-t border-dharma-border/70 pt-3 font-devanagari text-sm leading-relaxed text-dharma-text">
              {v.hindi}
            </p>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4 text-xs font-semibold">
              <Link
                href={`/wisdom-for-life/${v.topicSlug}/`}
                className="rounded-full border border-indigo-200/80 bg-indigo-50/70 px-2.5 py-1 text-indigo-800 hover:border-indigo-400 dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-200"
              >
                <span lang="hi">{v.topicHi}</span>
              </Link>
              <Link href={v.href} className="inline-flex items-center gap-1 text-saffron-800 hover:underline dark:text-saffron-300">
                <span lang="hi">पूरा पढ़ें</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
