'use client';

import React from 'react';
import Link from 'next/link';
import { useTodayPanchang, type TodayPanchang } from '@/lib/useTodayPanchang';

/**
 * "Today" markers for the Panchang list pages.
 *
 * These pages are pre-rendered once per deploy, so the page itself cannot know
 * which tithi, nakshatra, yoga, karana or weekday is current. The cards render
 * unmarked, and these components mark the right one in the reader's browser.
 *
 * The today styling and the badge wording live here, not in the pages, so the
 * pre-rendered HTML does not carry a copy of them for every card.
 */
export type TodayLimb = 'tithi' | 'nakshatra' | 'yoga' | 'karana' | 'vara';

type LimbValue = number | string;

function currentValue(today: TodayPanchang, limb: TodayLimb): LimbValue {
  switch (limb) {
    case 'tithi':
      return today.tithiNumber;
    case 'nakshatra':
      return today.nakshatraIndex;
    case 'yoga':
      return today.yogaIndex;
    case 'karana':
      return today.karanaName;
    case 'vara':
      return today.weekdayIndex;
  }
}

const TODAY_CARD_CLASS =
  'border-saffron-500 bg-saffron-500/[0.04] shadow-md ring-2 ring-saffron-500/50 animate-prana-pulse';

const BADGE_LABEL: Record<TodayLimb, string> = {
  tithi: 'आज की तिथि · Active Today',
  nakshatra: 'आज का नक्षत्र · Active Today',
  yoga: 'आज का योग · Active Today',
  karana: 'आज का करण · Active Today',
  vara: 'आज का वार · Active Today',
};

function useIsToday(limb: TodayLimb, values: readonly LimbValue[]): boolean {
  const today = useTodayPanchang();
  return today !== null && values.includes(currentValue(today, limb));
}

interface TodayCardProps {
  limb: TodayLimb;
  /** The card is today's when the live value equals any of these. */
  values: readonly LimbValue[];
  /** With `href` the card is a link; without it, an `<article>`. */
  href?: string;
  /** Classes the card always has. */
  className: string;
  /** Border, background and hover classes for a card that is not today's. */
  otherClassName: string;
  children: React.ReactNode;
}

/**
 * A list card that takes the "today" styling when it matches. It also sets
 * `data-today`, so children can react with `group-data-[today=true]:` classes.
 */
export function TodayCard({
  limb,
  values,
  href,
  className,
  otherClassName,
  children,
}: TodayCardProps) {
  const isToday = useIsToday(limb, values);
  const classes = `${className} ${isToday ? TODAY_CARD_CLASS : otherClassName}`;
  const marker = isToday ? 'true' : undefined;

  if (href) {
    return (
      <Link href={href} className={classes} data-today={marker}>
        {children}
      </Link>
    );
  }
  return (
    <article className={classes} data-today={marker}>
      {children}
    </article>
  );
}

/** The "Active Today" pill, shown only on the card that is today's. */
export function TodayBadge({ limb, values }: { limb: TodayLimb; values: readonly LimbValue[] }) {
  if (!useIsToday(limb, values)) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron-500/15 border border-saffron-500/40 px-2.5 py-0.5 text-[11px] font-bold text-saffron-800 dark:text-saffron-200">
      <span className="size-1.5 rounded-full bg-saffron-600 animate-pulse" />
      {BADGE_LABEL[limb]}
    </span>
  );
}
