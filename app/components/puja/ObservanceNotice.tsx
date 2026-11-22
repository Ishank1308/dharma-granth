'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarHeart, X } from 'lucide-react';
import { FESTIVAL_DATES } from '@/data/festival-dates';
import { EKADASHI_DATES } from '@/data/ekadashi-dates';

/**
 * One quiet line the day before (and on the day of) a festival or ekadashi, on Practice and
 * Panchang. It is worked out in the browser from the reader's own calendar day, so the static
 * export never freezes it at the build date. No permission prompt, no push, nothing sent
 * anywhere: dismissing it is remembered on this device only, for that one date.
 */

export interface Observance {
  key: string;
  date: string;
  hi: string;
  en: string;
  href: string;
  kind: 'festival' | 'ekadashi';
}

const DISMISS_KEY = 'dharma.notice.dismissed';

function isoDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** "उत्पन्ना एकादशी (Utpanna Ekadashi)" → Hindi and English halves. */
function splitBilingual(name: string): { hi: string; en: string } {
  const m = name.match(/^(.*?)\s*\((.*)\)\s*$/);
  return m ? { hi: m[1], en: m[2] } : { hi: name, en: name };
}

/** Festivals and ekadashis on a given ISO day, festivals first. */
export function observancesOn(day: string): Observance[] {
  const festivals: Observance[] = FESTIVAL_DATES.filter((f) => f.date === day).map((f) => ({
    key: `${day}:f:${f.name}`,
    date: day,
    hi: f.nameHindi ?? f.name,
    en: f.name,
    href: f.festivalId ? `/festivals/${f.festivalId}/#steps` : '/panchang/calendar/',
    kind: 'festival',
  }));
  const ekadashis: Observance[] = EKADASHI_DATES.filter((e) => e.dateEn === day).map((e) => {
    const { hi, en } = splitBilingual(e.name);
    return { key: `${day}:e`, date: day, hi, en, href: '/panchang/ekadashi/', kind: 'ekadashi' };
  });
  // An ekadashi that is also a listed festival (Gita Jayanti on Mokshada) shows once, as the festival.
  return festivals.length > 0 ? festivals : ekadashis;
}

function readDismissed(): string[] {
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    const list = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(list) ? list.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function ObservanceNotice({ className = '' }: { className?: string }) {
  const [notice, setNotice] = useState<{ when: 'today' | 'tomorrow'; items: Observance[] } | null>(null);

  useEffect(() => {
    const compute = () => {
      const now = new Date();
      const today = isoDay(now);
      const tomorrow = isoDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));
      const dismissed = new Set(readDismissed());
      const todayItems = observancesOn(today).filter((o) => !dismissed.has(o.key));
      if (todayItems.length > 0) return setNotice({ when: 'today', items: todayItems });
      const tomorrowItems = observancesOn(tomorrow).filter((o) => !dismissed.has(o.key));
      setNotice(tomorrowItems.length > 0 ? { when: 'tomorrow', items: tomorrowItems } : null);
    };
    compute();
    // A tab left open overnight picks up the new day when the reader comes back to it.
    const onVisible = () => {
      if (document.visibilityState === 'visible') compute();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  if (!notice) return null;

  const dismiss = () => {
    try {
      const keep = readDismissed().slice(-30);
      for (const o of notice.items) if (!keep.includes(o.key)) keep.push(o.key);
      window.localStorage.setItem(DISMISS_KEY, JSON.stringify(keep));
    } catch {
      // Storage blocked: it simply hides for this visit.
    }
    setNotice(null);
  };

  const first = notice.items[0];
  const hasGuide = first.href !== '/panchang/calendar/';
  const whenHi = notice.when === 'today' ? 'आज' : 'कल';
  const whenEn = notice.when === 'today' ? 'Today' : 'Tomorrow';

  return (
    <aside
      aria-label="आने वाला पर्व (Upcoming observance)"
      data-observance-notice={notice.when}
      className={`flex items-center gap-3 rounded-card border border-saffron-500/30 bg-saffron-500/[0.07] py-2 pl-3 pr-1.5 text-dharma-text ${className}`}
    >
      <CalendarHeart className="h-4 w-4 shrink-0 text-dharma-saffron" aria-hidden="true" />
      <p className="min-w-0 flex-1 text-footnote leading-snug">
        <span className="font-semibold">
          <span lang="hi" data-bi="hi" className="font-devanagari">
            {whenHi} {notice.items.map((o) => o.hi).join(' · ')}
          </span>
          <span data-bi="sep"> · </span>
          <span data-bi="en">
            {whenEn}: {notice.items.map((o) => o.en).join(' · ')}
          </span>
        </span>{' '}
        <Link href={first.href} className="focus-ring tap-target font-semibold text-dharma-saffron underline underline-offset-4">
          {hasGuide ? (
            <>
              <span lang="hi" data-bi="hi" className="font-devanagari">विधि देखें</span>
              <span data-bi="sep"> · </span>
              <span data-bi="en">How to observe</span>
            </>
          ) : (
            <>
              <span lang="hi" data-bi="hi" className="font-devanagari">पंचांग</span>
              <span data-bi="sep"> · </span>
              <span data-bi="en">Calendar</span>
            </>
          )}
        </Link>
        <span className="block text-caption-1 text-dharma-muted">
          <span lang="hi" data-bi="hi" className="font-devanagari">तिथि अपने स्थानीय पंचांग से मिला लें।</span>
          <span data-bi="sep"> · </span>
          <span data-bi="en">Confirm the date with your local panchang.</span>
        </span>
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="सूचना हटाएँ (Dismiss)"
        className="focus-ring inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-dharma-muted hover:text-dharma-text"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </aside>
  );
}
