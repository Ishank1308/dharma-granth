'use client';

import { useEffect, useMemo, useState } from 'react';
import { dailyVersePool, dayNumber, verseForDay, type DailyVerse } from '@/lib/daily-verse';
import { SITE_URL } from '@/lib/jsonld';
import { ExternalLink, Copy, Check } from 'lucide-react';

export function EmbedCard() {
  const pool = useMemo(() => dailyVersePool(), []);
  // Initial fallback for SSR and static export
  const [verse, setVerse] = useState<DailyVerse>(() => verseForDay(pool, 0));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-embed', '');
    document.documentElement.setAttribute('data-reader', '');
    return () => {
      document.documentElement.removeAttribute('data-embed');
      document.documentElement.removeAttribute('data-reader');
    };
  }, []);

  useEffect(() => {
    const today = new Date();
    const day = dayNumber(today);
    setVerse(verseForDay(pool, day));
  }, [pool]);

  const targetHref = `${SITE_URL}${verse.href.endsWith('/') ? verse.href : `${verse.href}/`}`;

  const onCopy = async () => {
    try {
      const text = `${verse.sanskrit}\n\n${verse.hindi}\n\n${verse.english}\n\n— ${verse.reference}\n${targetHref}`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <article className="mx-auto flex h-full min-h-[300px] w-full max-w-2xl flex-col justify-between rounded-2xl border border-stone-200 bg-stone-50/90 p-5 text-stone-900 shadow-sm transition dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200/80 pb-3 dark:border-stone-800/80">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            दैनिक श्लोक · Daily Verse
          </span>
          <h2 className="font-serif text-lg font-bold sm:text-xl text-stone-900 dark:text-stone-100">
            {verse.reference}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCopy}
          aria-label="Copy verse text"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-stone-300/70 bg-white px-2.5 text-xs font-semibold text-stone-700 shadow-xs transition hover:border-amber-600 hover:text-amber-800 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-amber-500 dark:hover:text-amber-300"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Body */}
      <div className="my-4 space-y-3">
        <p lang="sa" className="font-devanagari text-base font-semibold leading-relaxed text-amber-950 dark:text-amber-100 sm:text-lg">
          {verse.sanskrit}
        </p>
        <p lang="hi" className="font-devanagari text-sm leading-relaxed text-stone-800 dark:text-stone-200">
          <span className="font-semibold text-stone-600 dark:text-stone-400">अर्थ: </span>
          {verse.hindi}
        </p>
        <p className="font-serif text-xs italic leading-relaxed text-stone-600 dark:text-stone-400">
          &ldquo;{verse.english}&rdquo;
        </p>
      </div>

      {/* Footer / Canonical Backlink */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-200/80 pt-3 dark:border-stone-800/80">
        <span className="text-[11px] text-stone-500 dark:text-stone-400">
          विषय: {verse.topic}
        </span>
        <a
          href={targetHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300 underline underline-offset-2 decoration-amber-600/40 hover:decoration-amber-600"
        >
          <span>Read on Dharma Granth</span>
          <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </article>
  );
}
