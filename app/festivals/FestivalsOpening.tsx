'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { CalendarDays, Circle, Moon } from 'lucide-react';
import { Bento, BentoCell, Bi } from '@/app/components/bento/Bento';
import { upcomingFestivals, type UpcomingFestival } from '@/data/festival-dates';
import { festivals } from '@/data/festivals';

/**
 * The opening of /festivals/: the next festival, large, beside the recurring vratas.
 *
 * The site is a static export, so "today" is only known in the reader's browser. The exported
 * HTML carries the tile as a way into the year's calendar; once the page has loaded, the tile
 * names the next festival, how far off it is and the two after it. Both states share one fixed
 * height, so the list below does not move.
 */

const VRATAS = [
  { tile: 'wide', href: '/panchang/ekadashi/', en: 'Ekadashi', hi: 'एकादशी व्रत', sub: 'Every fast day of the year, with parana times', Icon: CalendarDays, chip: '#15803d' },
  { tile: undefined, href: '/panchang/purnima/', en: 'Purnima', hi: 'पूर्णिमा', sub: 'Full-moon days', Icon: Circle, chip: '#b45309' },
  { tile: undefined, href: '/panchang/amavasya/', en: 'Amavasya', hi: 'अमावस्या', sub: 'New-moon days', Icon: Moon, chip: '#1f4e8c' },
] as const;

const HINDI_MONTHS = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर'];

function parts(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return { date: new Date(y, m - 1, d), m, d };
}
const longDate = (iso: string) => parts(iso).date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
const shortDate = (iso: string) => parts(iso).date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
const hindiDate = (iso: string) => `${parts(iso).d} ${HINDI_MONTHS[parts(iso).m - 1]}`;

function away(days: number): { en: string; hi: string } {
  if (days === 0) return { en: 'Today', hi: 'आज' };
  if (days === 1) return { en: 'Tomorrow', hi: 'कल' };
  return { en: `In ${days} days`, hi: `${days} दिन शेष` };
}

const pageFor = (f: UpcomingFestival) => (f.festivalId ? `/festivals/${f.festivalId}/` : '/panchang/calendar/');

export function FestivalsOpening() {
  // null in the exported HTML and until the browser has read today's date.
  const [coming, setComing] = useState<UpcomingFestival[] | null>(null);
  useEffect(() => {
    setComing(upcomingFestivals(3));
  }, []);

  const next = coming?.[0];
  const later = coming?.slice(1) ?? [];
  const detail = next?.festivalId ? festivals.find((f) => f.id === next.festivalId) : undefined;
  const when = next ? away(next.daysAway) : null;

  return (
    <section aria-labelledby="festivals-coming-heading" className="relative z-10 mx-auto max-w-7xl px-gutter pt-8">
      <h2 id="festivals-coming-heading" className="sr-only">
        <span data-bi="en">Coming up</span> <span lang="hi" data-bi="hi">आगामी पर्व</span>
      </h2>
      <Bento>
        <BentoCell tile="lead">
          <div
            className="apple-card bento-tile bento-lead"
            data-festival-lead={next ? 'next' : 'calendar'}
            style={{ '--chip': '#b45309', '--bento-lead-min': '24rem' } as CSSProperties}
          >
            {next && when ? (
              <>
                {detail && <span className="bento-glyph" aria-hidden="true">{detail.icon}</span>}
                <p className="bento-kicker">
                  {next.daysAway === 0 ? <Bi en="Today" hi="आज का पर्व" /> : <Bi en="Next festival" hi="आगामी पर्व" />}
                </p>
                <h3 className="max-w-[18ch] text-title-2 font-semibold leading-tight text-dharma-text [overflow-wrap:anywhere]">
                  <Link href={pageFor(next)} className="bento-link">
                    <span>{next.name}</span>
                    {next.nameHindi && (
                      <>
                        {' '}
                        <span lang="hi" className="mt-1 block font-devanagari text-title-3 font-normal text-dharma-muted">{next.nameHindi}</span>
                      </>
                    )}
                  </Link>
                </h3>
                <p className="text-subhead leading-snug text-dharma-text">
                  <time dateTime={next.date}>{longDate(next.date)}</time>
                  {next.daysAway > 0 && (
                    <>
                      <span aria-hidden="true"> · </span>
                      <span data-bi="en">{when.en}</span>
                      <span data-bi="sep" aria-hidden="true"> · </span>
                      <span lang="hi" data-bi="hi" className="font-devanagari">{when.hi}</span>
                    </>
                  )}
                </p>
                {later.length > 0 && (
                  <ul className="bento-rows" aria-label="After that">
                    {later.map((f) => (
                      <li key={`${f.name}-${f.date}`}>
                        <Link href={pageFor(f)} className="bento-row">
                          <span className="bento-row-label min-w-0">
                            <span>{f.name}</span>
                            {f.nameHindi && <>{' '}<span lang="hi" className="font-devanagari text-dharma-muted">{f.nameHindi}</span></>}
                          </span>
                          <time dateTime={f.date} className="bento-row-state">
                            <span data-bi="en">{shortDate(f.date)}</span>
                            <span lang="hi" data-bi="hi" className="hidden font-devanagari">{hindiDate(f.date)}</span>
                          </time>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="bento-actions">
                  <span className="apple-pill" aria-hidden="true">{detail ? 'Story and rituals' : 'Open the calendar'}</span>
                  {detail && (
                    <Link href="/panchang/calendar/" className="bento-aside">
                      <span>Full calendar</span>&nbsp;<span aria-hidden="true">›</span>
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="bento-kicker"><Bi en="Festival calendar" hi="पर्व पंचांग" /></p>
                <h3 className="max-w-[18ch] text-title-2 font-semibold leading-tight text-dharma-text">
                  <Link href="/panchang/calendar/" className="bento-link">
                    <span>This year&rsquo;s festival dates</span>{' '}
                    <span lang="hi" className="mt-1 block font-devanagari text-title-3 font-normal text-dharma-muted">इस वर्ष के पर्व और तिथियाँ</span>
                  </Link>
                </h3>
                <p className="max-w-[36ch] text-subhead leading-snug text-dharma-muted">
                  Diwali, Holi, Navaratri and the days between them, each with its tithi.
                </p>
                <div className="bento-actions">
                  <span className="apple-pill" aria-hidden="true">Open the calendar</span>
                </div>
              </>
            )}
          </div>
        </BentoCell>

        {VRATAS.map(({ tile, href, en, hi, sub, Icon, chip }) => (
          <BentoCell key={href} tile={tile}>
            <Link href={href} style={{ '--chip': chip } as CSSProperties} className="apple-card bento-tile">
              <span className="apple-tint-chip" aria-hidden="true">
                <Icon className="h-4 w-4" />
              </span>
              <span className="mt-auto min-w-0 pt-2 leading-tight">
                <span className="block text-subhead font-semibold tracking-[-0.01em] text-dharma-text sm:text-body">{en}</span>{' '}
                <span lang="hi" className="block font-devanagari text-footnote text-dharma-muted">{hi}</span>{' '}
                <span className={`mt-1 text-[14px] leading-snug text-dharma-muted ${tile === 'wide' ? 'block' : 'hidden sm:block'}`}>{sub}</span>
              </span>
            </Link>
          </BentoCell>
        ))}
      </Bento>
      <p className="mt-3 text-footnote text-dharma-muted">
        <span>Dates are the widely published ones for India. Your local panchang may differ by a day.</span>{' '}
        <span lang="hi" className="font-devanagari">तिथियाँ स्थानीय पंचांग से मिला लें।</span>
      </p>
    </section>
  );
}
