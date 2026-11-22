'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MoonStar } from 'lucide-react';
import type { LocationConfig } from '@/lib/panchang';

interface LivePanchangSummary {
  cityHi: string;
  pakshaHi: string;
  isWaxing: boolean;
  illuminationPercent: number;
  tithiHi: string;
  nakshatraHi: string;
  nakshatraPada: number;
  yogaHi: string;
  varaHi: string;
  sunrise: string;
  sunset: string;
  rituHi: string;
}

export function HomeLivePanchang() {
  const [panchang, setPanchang] = useState<LivePanchangSummary | null>(null);

  useEffect(() => {
    let active = true;
    import('@/lib/panchang')
      .then(({ calculateEducationalPanchang, PRESET_LOCATIONS }) => {
        if (!active) return;
        let loc: LocationConfig = PRESET_LOCATIONS[0];
        try {
          const raw = window.localStorage.getItem('dharma.panchang.location');
          if (raw) {
            const parsed = JSON.parse(raw) as Partial<LocationConfig>;
            const match = PRESET_LOCATIONS.find((item) => item.id === parsed.id);
            if (match) loc = match;
          }
        } catch {
          // keep default location
        }

        const p = calculateEducationalPanchang(new Date(), loc);
        setPanchang({
          cityHi: loc.nameHi,
          pakshaHi: p.paksha.nameHi,
          isWaxing: p.paksha.isWaxing,
          illuminationPercent: Math.round(p.paksha.illuminationPercent),
          tithiHi: p.tithi.nameHi,
          nakshatraHi: p.nakshatra.nameHi,
          nakshatraPada: p.nakshatra.pada,
          yogaHi: p.yoga.nameHi,
          varaHi: p.dayOfWeekHi,
          sunrise: p.solarTimes.sunrise,
          sunset: p.solarTimes.sunset,
          rituHi: p.ritu.nameHi,
        });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-dharma-saffron">
          <MoonStar className="h-4 w-4" aria-hidden="true" />
          <span>Kāla-Darśana</span>
          <span aria-hidden="true">·</span>
          <span lang="hi" className="font-devanagari normal-case">वैदिक पंचांग</span>
        </span>
        {panchang && (
          <span lang="hi" className="rounded-full border border-dharma-border/80 bg-dharma-bg/65 px-2.5 py-0.5 font-devanagari text-xs font-medium text-dharma-muted backdrop-blur-sm">
            {panchang.cityHi} · {panchang.isWaxing ? '🌔' : '🌖'} {panchang.pakshaHi} ({panchang.illuminationPercent}%)
          </span>
        )}
      </div>

      <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-dharma-text sm:text-2xl">
        <Link href="/panchang/" className="hover:text-dharma-saffron transition-colors">
          <span>Today&apos;s Vedic Almanac</span>{' '}
          <span lang="hi" className="font-devanagari font-normal text-dharma-muted">
            · आज का पंचांग
          </span>
        </Link>
      </h3>

      {panchang ? (
        <div className="mt-2.5 space-y-2">
          <p lang="hi" className="rounded-xl border border-dharma-saffron/25 bg-dharma-saffron/8 px-3.5 py-2.5 font-devanagari text-sm font-medium text-dharma-text shadow-[inset_0_1px_0_var(--glass-specular-top)] backdrop-blur-sm">
            <strong>{panchang.tithiHi}</strong> · {panchang.nakshatraHi} नक्षत्र (पाद {panchang.nakshatraPada}) · {panchang.yogaHi} · {panchang.varaHi}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-dharma-muted">
            <span className="rounded-md bg-dharma-bg/65 px-2 py-0.5 border border-dharma-border/60 backdrop-blur-sm">
              🌅 सूर्योदय {panchang.sunrise}
            </span>
            <span className="rounded-md bg-dharma-bg/65 px-2 py-0.5 border border-dharma-border/60 backdrop-blur-sm">
              🌇 सूर्यास्त {panchang.sunset}
            </span>
            <span className="rounded-md bg-dharma-bg/65 px-2 py-0.5 border border-dharma-border/60 backdrop-blur-sm">
              🌿 {panchang.rituHi} ऋतु
            </span>
          </div>
        </div>
      ) : (
        <p className="mt-2.5 text-sm leading-relaxed text-dharma-muted">
          Live Udaya Tithi, Nakshatra, Yoga, Karana, Vrata dates, and classical Panchanga-Shuddhi study.
        </p>
      )}
    </>
  );
}
