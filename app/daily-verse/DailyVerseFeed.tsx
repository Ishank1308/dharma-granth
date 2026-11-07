'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, Copy, MessageCircle, Code2 } from 'lucide-react';
import { SITE_URL } from '@/lib/jsonld';
import { channelMessage, channelUrl, dailyVersePool, dayNumber, verseForDay, type DailyVerse } from '@/lib/daily-verse';

const UPCOMING_DAYS = 7;

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function messageFor(verse: DailyVerse): string {
  return channelMessage(verse, channelUrl(SITE_URL, verse));
}

function CopyButton({ text, label, primary = false }: { text: string; label: string; primary?: boolean }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch {
      setState('failed');
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 2500);
  };
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={`focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${
          primary
            ? 'bg-saffron-700 text-white hover:bg-saffron-800'
            : 'border border-dharma-border bg-dharma-bg text-dharma-text hover:border-saffron-400'
        }`}
      >
        {state === 'copied' ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
        {state === 'copied' ? 'Copied' : label}
      </button>
      <span role="status" className="text-xs text-dharma-muted">
        {state === 'copied' ? 'Message copied. Paste it into WhatsApp.' : state === 'failed' ? 'Could not copy: select the text and copy it.' : ''}
      </span>
    </>
  );
}

export function DailyVerseFeed() {
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);

  const pool = useMemo(() => dailyVersePool(), []);
  const days = useMemo(() => {
    if (!today) return [];
    const start = dayNumber(today);
    return Array.from({ length: UPCOMING_DAYS + 1 }, (_, i) => {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      return { date, verse: verseForDay(pool, start + i) };
    });
  }, [today, pool]);

  if (!today) {
    return (
      <p className="mx-auto max-w-3xl px-5 pt-10 text-sm text-dharma-muted sm:px-8">
        Loading today&apos;s verse… (This page needs JavaScript to pick the verse for your date.)
      </p>
    );
  }

  const [first, ...upcoming] = days;
  const message = messageFor(first.verse);
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(message)}`;

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-5 pt-8 sm:px-8">
      <article aria-labelledby="today-heading" className="rounded-3xl border border-dharma-border bg-dharma-card p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
          Today · {formatDate(first.date)}
        </p>
        <h2 id="today-heading" className="mt-1 font-serif text-2xl font-bold">
          {first.verse.reference}
        </h2>
        <p className="text-sm text-dharma-muted">{first.verse.topic}</p>

        <p lang="sa" className="mt-5 whitespace-pre-line font-devanagari text-xl font-semibold leading-[1.9] text-dharma-text">
          {first.verse.sanskrit}
        </p>
        <p lang="hi" className="mt-3 font-devanagari text-base leading-relaxed text-dharma-text/90">
          {first.verse.hindi}
        </p>
        <p className="mt-3 text-sm italic leading-relaxed text-dharma-muted">{first.verse.english}</p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <CopyButton text={message} label="Copy WhatsApp message" primary />
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-dharma-border bg-dharma-bg px-4 text-sm font-semibold text-dharma-text transition hover:border-green-500"
          >
            <MessageCircle className="h-4 w-4 text-green-600" aria-hidden="true" />
            Send on WhatsApp
          </a>
          <Link
            href={first.verse.href}
            className="focus-ring inline-flex min-h-[44px] items-center rounded-xl px-3 text-sm font-semibold text-saffron-800 underline-offset-2 hover:underline dark:text-saffron-300"
          >
            Read the verse
          </Link>
        </div>

        <label htmlFor="today-message" className="mt-6 block text-xs font-bold uppercase tracking-wider text-dharma-muted">
          What you will send
        </label>
        <textarea
          id="today-message"
          readOnly
          rows={11}
          value={message}
          onFocus={(e) => e.currentTarget.select()}
          className="mt-1 w-full resize-y rounded-xl border border-dharma-border bg-dharma-bg p-3 text-sm leading-relaxed text-dharma-text"
        />
      </article>

      <section aria-labelledby="embed-heading" className="rounded-3xl border border-dharma-border bg-dharma-card p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-saffron-600" />
          <h2 id="embed-heading" className="font-serif text-xl font-bold">
            Embed on your website · अपनी वेबसाइट पर जोड़ें
          </h2>
        </div>
        <p className="mt-2 text-sm text-dharma-muted">
          Add today&apos;s sacred verse widget to your blog, temple, or community website. It automatically updates daily with the shloka, Hindi meaning, and English translation.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
                1. Responsive iframe (Recommended)
              </span>
              <CopyButton text={`<iframe src="${SITE_URL}/embed/verse-of-the-day/" width="100%" height="340" style="border:none;border-radius:16px;box-shadow:0 4px 20px -2px rgba(0,0,0,0.06);" loading="lazy" title="Daily Sacred Verse"></iframe>`} label="Copy iframe code" />
            </div>
            <pre className="overflow-x-auto rounded-xl border border-dharma-border bg-dharma-bg p-3 text-xs font-mono text-dharma-muted">
              {`<iframe src="${SITE_URL}/embed/verse-of-the-day/" width="100%" height="340" style="border:none;border-radius:16px;" loading="lazy"></iframe>`}
            </pre>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
                2. Lightweight Script (Drop-in)
              </span>
              <CopyButton text={`<div id="dharma-verse-widget"></div>\n<script src="${SITE_URL}/embed.js" async></script>`} label="Copy script code" />
            </div>
            <pre className="overflow-x-auto rounded-xl border border-dharma-border bg-dharma-bg p-3 text-xs font-mono text-dharma-muted">
              {`<div id="dharma-verse-widget"></div>\n<script src="${SITE_URL}/embed.js" async></script>`}
            </pre>
          </div>
        </div>
      </section>

      <section aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading" className="font-serif text-xl font-bold">
          The week ahead
        </h2>
        <p className="mt-1 text-sm text-dharma-muted">Copy these in advance to schedule your posts.</p>
        <ul className="mt-4 space-y-3">
          {upcoming.map(({ date, verse }) => (
            <li key={date.toISOString()} className="rounded-2xl border border-dharma-border bg-dharma-card p-4 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted">{formatDate(date)}</p>
              <p className="mt-0.5 font-serif text-lg font-bold">{verse.reference}</p>
              <p lang="hi" className="mt-1 font-devanagari text-sm leading-relaxed text-dharma-muted">
                {verse.hindi}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <CopyButton text={messageFor(verse)} label="Copy message" />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
