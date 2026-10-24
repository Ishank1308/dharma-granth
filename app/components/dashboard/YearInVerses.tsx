'use client';

import { useEffect, useState } from 'react';
import { readReadingDays } from '@/lib/reading-history';

interface Summary {
  year: number;
  days: number;
  chapters: number;
  texts: number;
  months: number[];
  topText: string | null;
}

/** Counts only; built from the dates and chapters this browser recorded. Nothing is sent anywhere. */
function summarise(titles: Record<string, string>): Summary {
  const year = new Date().getFullYear();
  const all = readReadingDays();
  const chapters = new Set<string>();
  const perText = new Map<string, number>();
  const months = Array<number>(12).fill(0);
  let days = 0;
  for (const [day, list] of Object.entries(all)) {
    if (!day.startsWith(`${year}-`) || list.length === 0) continue;
    days++;
    months[Number(day.slice(5, 7)) - 1]++;
    for (const key of list) {
      chapters.add(key);
      const text = key.split(':')[0];
      perText.set(text, (perText.get(text) ?? 0) + 1);
    }
  }
  const top = Array.from(perText.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
  return { year, days, chapters: chapters.size, texts: perText.size, months, topText: top ? (titles[top] ?? top) : null };
}

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export function YearInVerses({ titles }: { titles: Record<string, string> }) {
  const [s, setS] = useState<Summary | null>(null);
  useEffect(() => setS(summarise(titles)), [titles]);
  if (!s) return null;
  const peak = Math.max(1, ...s.months);

  return (
    <section aria-labelledby="year-in-verses" className="rounded-2xl border border-dharma-border bg-dharma-card p-5 shadow-sm">
      <h2 id="year-in-verses" className="font-serif text-xl font-bold text-dharma-text">
        <span lang="hi" className="font-devanagari">{s.year} में आपका स्वाध्याय</span>
        <span aria-hidden="true" className="mx-2 text-dharma-muted">·</span>
        <span lang="en">Your {s.year} in verses</span>
      </h2>
      {s.days === 0 ? (
        <p className="mt-2 text-sm text-dharma-muted">
          Nothing recorded for {s.year} yet. Chapters you open are noted here, on this device only, so you can look back at the year.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm leading-relaxed text-dharma-muted">
            You read on <strong className="text-dharma-text">{s.days}</strong> {s.days === 1 ? 'day' : 'days'}, opening{' '}
            <strong className="text-dharma-text">{s.chapters}</strong> {s.chapters === 1 ? 'chapter' : 'chapters'} across{' '}
            <strong className="text-dharma-text">{s.texts}</strong> {s.texts === 1 ? 'text' : 'texts'}
            {s.topText ? <>, most often <strong className="text-dharma-text">{s.topText}</strong></> : null}.
          </p>
          <ul aria-label="Reading days by month" className="mt-4 flex items-end gap-1.5">
            {s.months.map((n, i) => (
              <li key={i} className="flex flex-1 flex-col items-center gap-1" title={`${n} reading ${n === 1 ? 'day' : 'days'}`}>
                <span
                  aria-hidden="true"
                  className="w-full rounded-t bg-saffron-500/80"
                  style={{ height: `${Math.max(n ? 6 : 2, Math.round((n / peak) * 56))}px`, opacity: n ? 1 : 0.25 }}
                />
                <span className="text-[11px] text-dharma-muted">{MONTHS[i]}</span>
                <span className="sr-only">{n} reading days</span>
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="mt-3 text-xs text-dharma-muted">No streak and no score: only a look back. Included in your backup file.</p>
    </section>
  );
}
