'use client';

import type { CSSProperties, ReactNode } from 'react';

/**
 * Shared bits for the private practice dashboard tools.
 *
 * Every tool persists to localStorage under a `dharma.practice.*` key —
 * nothing ever leaves the device, there are no accounts and no rankings.
 */

/** Local-timezone ISO day (YYYY-MM-DD). Aligns with Indian Standard Time
 * (Asia/Kolkata) so sadhana and sankalpa roll over at IST midnight. */
export function localISODate(d: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(d);
  } catch {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }
}

/** Day-of-year (1..366), used to rotate daily prompts deterministically. */
export function dayOfYear(d: Date = new Date()): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86_400_000);
}

/** Offset an ISO date string (YYYY-MM-DD) by N days. */
export function offsetISODate(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return localISODate(date);
}

const HINDI_MONTHS = [
  'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर'
];

/** Return gentle English and Hindi labels for a date. */
export function formatDisplayDate(isoDate: string): { en: string; hi: string; isToday: boolean } {
  const today = localISODate();
  const [y, m, d] = isoDate.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const isToday = isoDate === today;

  const en = isToday
    ? 'Today'
    : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const hi = isToday
    ? 'आज'
    : `${d} ${HINDI_MONTHS[m - 1]} ${y}`;

  return { en, hi, isToday };
}

/** Consistent card shell so all practice tools read as one family. */
export function ToolCard({
  icon,
  title,
  titleHindi,
  children,
  accent = 'saffron',
}: {
  icon: ReactNode;
  title: string;
  titleHindi: string;
  children: ReactNode;
  accent?: 'saffron' | 'indigo' | 'emerald' | 'rose' | 'amber';
}) {
  // One plain tint per tool, as in iOS Settings: a white glyph on a small coloured square.
  const tints: Record<string, string> = {
    saffron: '#c2410c',
    indigo: '#4f46e5',
    emerald: '#15803d',
    rose: '#be123c',
    amber: '#b45309',
  };
  return (
    <section className="apple-card flex h-full flex-col p-5 sm:p-6" style={{ '--chip': tints[accent] } as CSSProperties}>
      <div className="mb-4 flex items-center gap-3">
        <div className="apple-tint-chip [&_svg]:!text-white" aria-hidden="true">
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-title-3 font-semibold leading-tight text-dharma-text">{title}</h3>
          <p lang="hi" className="font-devanagari text-footnote text-dharma-muted">{titleHindi}</p>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </section>
  );
}
