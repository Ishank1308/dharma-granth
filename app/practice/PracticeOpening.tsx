'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { Bookmark, NotebookPen, ScrollText } from 'lucide-react';
import { Bento, BentoCell, Bi } from '@/app/components/bento/Bento';
import { localISODate } from '@/app/components/practice/shared';
import { parseStored } from '@/lib/safe-stored';

/**
 * The opening of /practice/: today's sadhana, large, beside the reader's own three spaces.
 *
 * The lead tile lists the practices the reader keeps active, each a link down to its tool.
 * Once the page has loaded it shows what was already done today, read from the same
 * localStorage keys the tools write (this device only; nothing is sent anywhere). The exported
 * HTML and a first visit show the same rows without a state, so nothing moves when it fills in.
 */

export type TodayPracticeId = 'japa' | 'meditation' | 'pranayama' | 'reflection';

const PRACTICES: Array<{ id: TodayPracticeId; en: string; hi: string }> = [
  { id: 'japa', en: 'Japa', hi: 'जप' },
  { id: 'meditation', en: 'Meditation', hi: 'ध्यान' },
  { id: 'pranayama', en: 'Pranayama', hi: 'प्राणायाम' },
  { id: 'reflection', en: 'Reflection', hi: 'चिन्तन' },
];

const MY_SPACE = [
  { tile: 'wide', href: '/practice/gita-sankalpa/', hi: 'गीता संकल्प', en: 'Gita Sankalpa', sub: 'A resolve to read the Gita, kept day by day', Icon: ScrollText },
  { tile: undefined, href: '/practice/bookmarks/', hi: 'सुरक्षित श्लोक', en: 'Saved verses', sub: '', Icon: Bookmark },
  { tile: undefined, href: '/practice/journal/', hi: 'स्वाध्याय डायरी', en: 'Journal', sub: '', Icon: NotebookPen },
] as const;

interface Today {
  /** What each practice shows on the right of its row; empty when not done today. */
  done: Record<TodayPracticeId, string>;
  saved: number;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Any text the reader wrote in a reflection entry (a plain string in older saves). */
function hasText(entry: unknown): boolean {
  if (typeof entry === 'string') return entry.trim().length > 0;
  if (entry && typeof entry === 'object') return Object.values(entry).some((v) => typeof v === 'string' && v.trim().length > 0);
  return false;
}

function readToday(): Today {
  const day = localISODate();
  const get = (key: string) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };
  const japa = parseStored(get('dharma.practice.japa'), { date: '', count: 0, rounds: 0 });
  const meditation = parseStored<{ history?: Record<string, number> }>(get('dharma.practice.meditation'), {});
  const pranayama = parseStored(get('dharma.practice.pranayama'), { date: '', cyclesToday: 0 });
  const reflections = parseStored<Record<string, unknown>>(get('dharma.practice.reflections'), {});
  const saved = parseStored<unknown[]>(get('dharma.bookmarkedVerses'), []);

  const beads = japa.date === day ? japa.count : 0;
  const malas = japa.date === day ? japa.rounds : 0;
  const minutes = Number(meditation.history?.[day]) || 0;
  const breaths = pranayama.date === day ? pranayama.cyclesToday : 0;

  return {
    done: {
      japa: malas > 0 ? plural(malas, 'mala', 'malas') : beads > 0 ? `${beads} of 108` : '',
      meditation: minutes > 0 ? `${minutes} min` : '',
      pranayama: breaths > 0 ? plural(breaths, 'round', 'rounds') : '',
      reflection: hasText(reflections[day]) ? 'Written' : '',
    },
    saved: saved.length,
  };
}

export function PracticeOpening({ active }: { active: (id: TodayPracticeId) => boolean }) {
  const [today, setToday] = useState<Today | null>(null);
  const tile = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const read = () => setToday(readToday());
    read();
    // The tools further down save as the reader practises, and a save in this tab sends no
    // storage event. Read again each time the tile scrolls back into view.
    const seen = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) read();
    });
    if (tile.current) seen.observe(tile.current);
    window.addEventListener('storage', read);
    return () => {
      seen.disconnect();
      window.removeEventListener('storage', read);
    };
  }, []);

  const rows = PRACTICES.filter((p) => active(p.id));
  const doneCount = today ? rows.filter((p) => today.done[p.id]).length : 0;

  return (
    <Bento>
      <BentoCell tile="lead">
        <div
          ref={tile}
          className="apple-card bento-tile bento-lead"
          style={{ '--chip': '#c2410c', '--bento-lead-min': '19.5rem' } as CSSProperties}
        >
          <p className="bento-kicker"><Bi en="Today" hi="आज" /></p>
          <h2 id="practice-today-heading" className="text-title-2 font-semibold leading-tight text-dharma-text">
            <span data-bi="en">Today&rsquo;s sadhana</span>{' '}
            <span lang="hi" data-bi="hi" data-bi-lead className="mt-1 block font-devanagari text-title-3 font-normal text-dharma-muted">आज की साधना</span>
          </h2>
          {rows.length > 0 ? (
            <ul className="bento-rows" aria-labelledby="practice-today-heading">
              {rows.map((p) => {
                const state = today?.done[p.id] ?? '';
                return (
                  <li key={p.id}>
                    <a href={`#practice-${p.id}`} className="bento-row">
                      <span className="bento-row-label min-w-0">
                        <span className="bento-mark" data-done={state ? 'true' : 'false'} aria-hidden="true" />
                        <span>{p.en}</span>{' '}
                        <span lang="hi" className="font-devanagari text-dharma-muted">{p.hi}</span>
                      </span>
                      <span className="bento-row-state" data-practice-state={p.id}>
                        {state ? <span>{state}<span className="sr-only"> today</span></span> : today ? <span>Not yet<span className="sr-only"> today</span></span> : null}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-subhead leading-snug text-dharma-muted">
              <a href="#practice-tools-heading" className="bento-aside">Choose the practices to keep active&nbsp;<span aria-hidden="true">›</span></a>
            </p>
          )}
          <p className="mt-auto min-h-[1.25rem] text-footnote text-dharma-muted">
            {today && rows.length > 0 && (
              doneCount === 0 ? (
                <span>Begin with any one. Five quiet minutes count.</span>
              ) : doneCount === rows.length ? (
                <span><span>Complete for today.</span> <span lang="hi" className="font-devanagari">आज की साधना पूर्ण।</span></span>
              ) : (
                <span><span>Well begun.</span> <span lang="hi" className="font-devanagari">शुभारम्भ।</span></span>
              )
            )}
          </p>
        </div>
      </BentoCell>

      {MY_SPACE.map(({ tile: size, href, hi, en, sub, Icon }) => (
        <BentoCell key={href} tile={size}>
          <Link href={href} className="apple-card bento-tile">
            <span className="apple-tint-chip" aria-hidden="true">
              <Icon className="h-4 w-4" />
            </span>
            <span className="mt-auto min-w-0 pt-2 leading-tight">
              <span className="block text-subhead font-semibold tracking-[-0.01em] text-dharma-text sm:text-body">{en}</span>{' '}
              <span lang="hi" className="block font-devanagari text-footnote text-dharma-muted">{hi}</span>
              {sub && <>{' '}<span className="mt-1 block text-[14px] leading-snug text-dharma-muted">{sub}</span></>}
              {href === '/practice/bookmarks/' && (
                <>{' '}<span className="mt-1 block min-h-[1.125rem] text-footnote tabular-nums text-dharma-muted" data-saved-count>{today && today.saved > 0 ? `${today.saved} saved` : ''}</span></>
              )}
            </span>
          </Link>
        </BentoCell>
      ))}
    </Bento>
  );
}
