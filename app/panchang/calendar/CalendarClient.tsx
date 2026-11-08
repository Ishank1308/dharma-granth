'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sunrise,
  Sunset,
  Sun,
  Hourglass,
  MoonStar,
  ArrowRight,
  Flame,
  ChevronDown,
} from 'lucide-react';
import {
  calculateEducationalPanchang,
  PRESET_LOCATIONS,
  type LocationConfig,
  type PanchangDayData,
  nakshatraSlug,
  YOGA_DATA,
  getAllKaranas,
} from '@/lib/panchang';
import { FESTIVAL_DATES, type FestivalDate } from '@/data/festival-dates';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { triggerTactileFeedback } from '@/lib/haptics';
import '@/app/styles/festival-calendar.css';

export type CalendarFilter = 'all' | 'ekadashi' | 'pradosha' | 'purnima-amavasya' | 'festivals';

const MONTH_NAMES = [
  { en: 'January', hi: 'जनवरी', masa: 'पौष – माघ' },
  { en: 'February', hi: 'फ़रवरी', masa: 'माघ – फाल्गुन' },
  { en: 'March', hi: 'मार्च', masa: 'फाल्गुन – चैत्र' },
  { en: 'April', hi: 'अप्रैल', masa: 'चैत्र – वैशाख' },
  { en: 'May', hi: 'मई', masa: 'वैशाख – ज्येष्ठ' },
  { en: 'June', hi: 'जून', masa: 'ज्येष्ठ – आषाढ़' },
  { en: 'July', hi: 'जुलाई', masa: 'आषाढ़ – श्रावण' },
  { en: 'August', hi: 'अगस्त', masa: 'श्रावण – भाद्रपद' },
  { en: 'September', hi: 'सितंबर', masa: 'भाद्रपद – आश्विन' },
  { en: 'October', hi: 'अक्टूबर', masa: 'आश्विन – कार्तिक' },
  { en: 'November', hi: 'नवंबर', masa: 'कार्तिक – मार्गशीर्ष' },
  { en: 'December', hi: 'दिसंबर', masa: 'मार्गशीर्ष – पौष' },
];

const WEEKDAYS = [
  { shortEn: 'Sun', shortHi: 'रवि', fullHi: 'रविवार', fullEn: 'Sunday' },
  { shortEn: 'Mon', shortHi: 'सोम', fullHi: 'सोमवार', fullEn: 'Monday' },
  { shortEn: 'Tue', shortHi: 'मंगल', fullHi: 'मंगलवार', fullEn: 'Tuesday' },
  { shortEn: 'Wed', shortHi: 'बुध', fullHi: 'बुधवार', fullEn: 'Wednesday' },
  { shortEn: 'Thu', shortHi: 'गुरु', fullHi: 'गुरुवार', fullEn: 'Thursday' },
  { shortEn: 'Fri', shortHi: 'शुक्र', fullHi: 'शुक्रवार', fullEn: 'Friday' },
  { shortEn: 'Sat', shortHi: 'शनि', fullHi: 'शनिवार', fullEn: 'Saturday' },
];

function getTithiSlug(tithiNumber: number): string {
  if (tithiNumber === 15) return 'purnima';
  if (tithiNumber === 30) return 'amavasya';
  const index = ((tithiNumber - 1) % 15) + 1;
  const slugs: Record<number, string> = {
    1: 'pratipada',
    2: 'dvitiya',
    3: 'tritiya',
    4: 'chaturthi',
    5: 'panchami',
    6: 'shashthi',
    7: 'saptami',
    8: 'ashtami',
    9: 'navami',
    10: 'dashami',
    11: 'ekadashi',
    12: 'dwadashi',
    13: 'trayodashi',
    14: 'chaturdashi',
  };
  return slugs[index] || 'pratipada';
}

/**
 * The moon for a tithi, drawn rather than an emoji so it takes the theme's colours.
 * Tithi 1–15 wax (lit on the right), 16–30 wane (lit on the left); 15 is full, 30 new.
 */
function MoonPhase({ tithi, size = 16, label }: { tithi: number; size?: number; label?: string }) {
  const r = 7;
  const c = 8;
  const theta = (2 * Math.PI * tithi) / 30;
  const lit = (1 - Math.cos(theta)) / 2; // 0 new → 1 full
  const waxing = tithi < 15;
  const rx = Math.abs(1 - 2 * lit) * r;
  const outerSweep = waxing ? 1 : 0;
  const innerSweep = lit < 0.5 ? (waxing ? 0 : 1) : waxing ? 1 : 0;
  const top = `${c},${c - r}`;
  const bottom = `${c},${c + r}`;
  const path = `M${top} A${r},${r} 0 0 ${outerSweep} ${bottom} A${rx.toFixed(3)},${r} 0 0 ${innerSweep} ${top} Z`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className="shrink-0"
    >
      <circle cx={c} cy={c} r={r} className="fc-moon-dark" />
      {tithi === 15 ? (
        <circle cx={c} cy={c} r={r} className="fc-moon-lit" />
      ) : tithi !== 30 && lit > 0.02 ? (
        <path d={path} className="fc-moon-lit" />
      ) : null}
      <circle cx={c} cy={c} r={r} className="fc-moon-rim" />
    </svg>
  );
}

const MARKERS = {
  ekadashi: { hi: 'एकादशी', en: 'Ekadashi', hue: 'var(--fc-ekadashi)' },
  pradosha: { hi: 'प्रदोष', en: 'Pradosh', hue: 'var(--fc-pradosha)' },
  purnima: { hi: 'पूर्णिमा', en: 'Purnima', hue: 'var(--fc-purnima)' },
  amavasya: { hi: 'अमावस्या', en: 'Amavasya', hue: 'var(--fc-amavasya)' },
  festival: { hi: 'पर्व', en: 'Festival', hue: 'var(--fc-festival)' },
} as const;
type MarkerKind = keyof typeof MARKERS;

function Dot({ kind }: { kind: MarkerKind }) {
  return (
    <span
      className="fc-dot"
      data-kind={kind}
      style={{ '--dot': MARKERS[kind].hue } as React.CSSProperties}
      aria-hidden="true"
    />
  );
}

function dayMarkers(day: ComputedDay): MarkerKind[] {
  const out: MarkerKind[] = [];
  if (day.festivals.length > 0) out.push('festival');
  if (day.isEkadashi) out.push('ekadashi');
  if (day.isPradosha && !day.isEkadashi) out.push('pradosha');
  if (day.isPurnima) out.push('purnima');
  if (day.isAmavasya) out.push('amavasya');
  return out;
}

const FILTERS: { id: CalendarFilter; hi: string; en: string; kind?: MarkerKind; kinds?: MarkerKind[] }[] = [
  { id: 'all', hi: 'सभी दिन', en: 'All days' },
  { id: 'festivals', hi: 'पर्व व त्यौहार', en: 'Festivals', kind: 'festival' },
  { id: 'ekadashi', hi: 'एकादशी', en: 'Ekadashi', kind: 'ekadashi' },
  { id: 'pradosha', hi: 'प्रदोष', en: 'Pradosh', kind: 'pradosha' },
  { id: 'purnima-amavasya', hi: 'पूर्णिमा व अमावस्या', en: 'Full & new moon', kinds: ['purnima', 'amavasya'] },
];

interface ComputedDay {
  dayNumber: number;
  dateIso: string;
  dateObj: Date;
  dayOfWeek: number;
  panchang: PanchangDayData;
  festivals: FestivalDate[];
  isEkadashi: boolean;
  isPradosha: boolean;
  isPurnima: boolean;
  isAmavasya: boolean;
  isShivaratri: boolean;
  tithiSlug: string;
  nakshatraSlug: string;
  yogaSlug: string;
  karanaSlug: string;
}

export function CalendarClient() {
  const [year, setYear] = useState<number>(2026);
  const [month, setMonth] = useState<number>(10); // 10 = November
  const [activeFilter, setActiveFilter] = useState<CalendarFilter>('all');
  const [selectedDateIso, setSelectedDateIso] = useState<string>('2026-11-08'); // Default to Diwali 2026

  const [location, setLocation] = useLocalStorage<LocationConfig>(
    'dharma.panchang.location',
    PRESET_LOCATIONS[0],
  );

  const [urlParamsChecked, setUrlParamsChecked] = useState(false);

  // Sync state from URL query parameters on mount (?year=2026&month=11&date=2026-11-08)
  useEffect(() => {
    if (urlParamsChecked) return;
    setUrlParamsChecked(true);
    try {
      const sp = new URLSearchParams(window.location.search);
      const rawDate = sp.get('date');
      const mDate = rawDate && /^(\d{4})-(\d{2})-(\d{2})$/.exec(rawDate);
      if (mDate) {
        const y = Number(mDate[1]);
        const m = Number(mDate[2]) - 1;
        if (y >= 2026 && y <= 2028 && m >= 0 && m <= 11) {
          setYear(y);
          setMonth(m);
          setSelectedDateIso(rawDate);
          return;
        }
      }
      const rawYear = Number(sp.get('year'));
      const rawMonth = Number(sp.get('month'));
      if (rawYear >= 2026 && rawYear <= 2028) setYear(rawYear);
      if (rawMonth >= 1 && rawMonth <= 12) setMonth(rawMonth - 1);
    } catch {
      // Ignore in non-browser env
    }
  }, [urlParamsChecked]);

  // Keep address bar in sync with selected month/year/date
  useEffect(() => {
    if (!urlParamsChecked) return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('year', String(year));
      url.searchParams.set('month', String(month + 1));
      if (selectedDateIso) url.searchParams.set('date', selectedDateIso);
      window.history.replaceState(null, '', url.toString());
    } catch {
      // Ignore
    }
  }, [year, month, selectedDateIso, urlParamsChecked]);

  // Group festivals by ISO date
  const festivalsMap = useMemo(() => {
    const map = new Map<string, FestivalDate[]>();
    for (const f of FESTIVAL_DATES) {
      const list = map.get(f.date) || [];
      list.push(f);
      map.set(f.date, list);
    }
    return map;
  }, []);

  // Compute all days in the currently viewed month
  const monthDays = useMemo<ComputedDay[]>(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const list: ComputedDay[] = [];
    const allKaranas = getAllKaranas();

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d, 6, 0, 0); // 6:00 AM IST approx udaya
      const dateIso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const panchang = calculateEducationalPanchang(dateObj, location);
      const festivals = festivalsMap.get(dateIso) || [];

      const tithiNum = panchang.tithi.number;
      const isEkadashi = tithiNum === 11 || tithiNum === 26;
      const isPradosha = tithiNum === 13 || tithiNum === 28;
      const isPurnima = tithiNum === 15;
      const isAmavasya = tithiNum === 30;
      const isShivaratri = tithiNum === 29;

      const tSlug = getTithiSlug(tithiNum);
      const nSlug = nakshatraSlug(panchang.nakshatra.name);
      const ySlug = YOGA_DATA[panchang.yoga.index]?.slug || 'vishkambha';
      const kSlug = allKaranas.find((k) => k.name === panchang.karana.name)?.slug || 'bava';

      list.push({
        dayNumber: d,
        dateIso,
        dateObj,
        dayOfWeek: dateObj.getDay(),
        panchang,
        festivals,
        isEkadashi,
        isPradosha,
        isPurnima,
        isAmavasya,
        isShivaratri,
        tithiSlug: tSlug,
        nakshatraSlug: nSlug,
        yogaSlug: ySlug,
        karanaSlug: kSlug,
      });
    }

    return list;
  }, [year, month, location, festivalsMap]);

  // Leading empty blanks for the 1st of the month
  const firstDayWeekday = useMemo(() => {
    return new Date(year, month, 1).getDay();
  }, [year, month]);

  // Selected day object
  const selectedDay = useMemo(() => {
    return monthDays.find((d) => d.dateIso === selectedDateIso) || monthDays[0] || null;
  }, [monthDays, selectedDateIso]);

  // Navigate months
  const handlePrevMonth = useCallback(() => {
    triggerTactileFeedback('selection', 'softTap');
    if (month === 0) {
      if (year > 2026) {
        setYear(year - 1);
        setMonth(11);
        setSelectedDateIso(`${year - 1}-12-01`);
      }
    } else {
      setMonth(month - 1);
      setSelectedDateIso(`${year}-${String(month).padStart(2, '0')}-01`);
    }
  }, [month, year]);

  const handleNextMonth = useCallback(() => {
    triggerTactileFeedback('selection', 'softTap');
    if (month === 11) {
      if (year < 2028) {
        setYear(year + 1);
        setMonth(0);
        setSelectedDateIso(`${year + 1}-01-01`);
      }
    } else {
      setMonth(month + 1);
      setSelectedDateIso(`${year}-${String(month + 2).padStart(2, '0')}-01`);
    }
  }, [month, year]);

  const handleJumpToday = () => {
    triggerTactileFeedback('selection', 'softTap');
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    const curDay = now.getDate();
    const validYear = Math.max(2026, Math.min(2028, curYear));
    setYear(validYear);
    setMonth(curMonth);
    setSelectedDateIso(`${validYear}-${String(curMonth + 1).padStart(2, '0')}-${String(curDay).padStart(2, '0')}`);
  };

  // Keyboard arrow navigation between days
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')) return;

      const curDayIndex = monthDays.findIndex((d) => d.dateIso === selectedDateIso);
      if (curDayIndex === -1) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (curDayIndex > 0) {
          triggerTactileFeedback('selection', 'softTap');
          setSelectedDateIso(monthDays[curDayIndex - 1].dateIso);
        } else {
          handlePrevMonth();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (curDayIndex < monthDays.length - 1) {
          triggerTactileFeedback('selection', 'softTap');
          setSelectedDateIso(monthDays[curDayIndex + 1].dateIso);
        } else {
          handleNextMonth();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (curDayIndex >= 7) {
          triggerTactileFeedback('selection', 'softTap');
          setSelectedDateIso(monthDays[curDayIndex - 7].dateIso);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (curDayIndex + 7 < monthDays.length) {
          triggerTactileFeedback('selection', 'softTap');
          setSelectedDateIso(monthDays[curDayIndex + 7].dateIso);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [monthDays, selectedDateIso, handlePrevMonth, handleNextMonth]);

  const inspectorRef = useRef<HTMLElement>(null);

  const isDayMatchingFilter = (day: ComputedDay) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'ekadashi') return day.isEkadashi;
    if (activeFilter === 'pradosha') return day.isPradosha;
    if (activeFilter === 'purnima-amavasya') return day.isPurnima || day.isAmavasya;
    if (activeFilter === 'festivals') return day.festivals.length > 0;
    return true;
  };

  // Today is read after hydration, so the exported HTML never disagrees with the client.
  const [todayIso, setTodayIso] = useState<string>('');
  useEffect(() => {
    const now = new Date();
    setTodayIso(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
    );
  }, []);

  const trailingBlanks = (7 - ((firstDayWeekday + monthDays.length) % 7)) % 7;
  const monthFestivals = monthDays.filter((d) => d.festivals.length > 0);

  const selectDay = (iso: string) => {
    triggerTactileFeedback('selection', 'softTap');
    setSelectedDateIso(iso);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      window.requestAnimationFrame(() => {
        inspectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  return (
    <div className="fc-root space-y-6 sm:space-y-8">
      {/* ─── TOOLBAR: month, navigation, year, place, filters ─────────────── */}
      <div className="apple-card p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-title-2 font-semibold leading-tight text-label-primary" aria-live="polite">
              <span lang="hi">{MONTH_NAMES[month].hi}</span> <span className="apple-stat">{year}</span>
            </h2>
            <p className="mt-1 text-footnote text-label-secondary">
              <span>{MONTH_NAMES[month].en}</span> · <span lang="hi">{MONTH_NAMES[month].masa}</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={year === 2026 && month === 0}
              aria-label="Previous month"
              className="fc-icon-btn"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={handleJumpToday} className="apple-pill apple-pill-tinted !px-4 font-semibold">
              <span lang="hi">आज</span> <span className="hidden sm:inline">Today</span>
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              disabled={year === 2028 && month === 11}
              aria-label="Next month"
              className="fc-icon-btn"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="apple-segmented self-start" role="group" aria-label="Year">
            {[2026, 2027, 2028].map((y) => (
              <button
                key={y}
                type="button"
                aria-pressed={year === y}
                className="apple-stat min-w-[4.25rem]"
                onClick={() => {
                  triggerTactileFeedback('selection', 'softTap');
                  setYear(y);
                  setSelectedDateIso(`${y}-${String(month + 1).padStart(2, '0')}-01`);
                }}
              >
                {y}
              </button>
            ))}
          </div>

          <label className="relative block sm:w-72">
            <span className="sr-only">Location</span>
            <MapPin
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tint"
              aria-hidden="true"
            />
            <select
              value={location.id}
              onChange={(e) => {
                const found = PRESET_LOCATIONS.find((loc) => loc.id === e.target.value);
                if (found) setLocation(found);
              }}
              className="fc-select w-full"
            >
              {PRESET_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.nameHi} · {loc.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-label-tertiary"
              aria-hidden="true"
            />
          </label>
        </div>

        <div className="mt-4 border-t border-separator pt-4">
          <div className="fc-chips" role="group" aria-label="Show">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={activeFilter === f.id}
                className="fc-chip"
                style={f.kind ? ({ '--chip-hue': MARKERS[f.kind].hue } as React.CSSProperties) : undefined}
                onClick={() => {
                  triggerTactileFeedback('selection', 'softTap');
                  setActiveFilter(f.id);
                }}
              >
                {f.kind && <Dot kind={f.kind} />}
                {f.kinds && (
                  <span className="inline-flex gap-1" aria-hidden="true">
                    {f.kinds.map((k) => (
                      <Dot key={k} kind={k} />
                    ))}
                  </span>
                )}
                <span lang="hi">{f.hi}</span>
                <span className="text-label-tertiary">{f.en}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── MONTH GRID ───────────────────────────────────────────────────── */}
      <div className="apple-card p-2 sm:p-4">
        <div className="fc-weekdays" aria-hidden="true">
          {WEEKDAYS.map((wd, i) => (
            <div key={wd.shortEn} className="fc-weekday" data-sunday={i === 0 ? '' : undefined}>
              <div lang="hi" className="text-footnote font-semibold">
                {wd.shortHi}
              </div>
              <div className="hidden text-caption sm:block">{wd.shortEn}</div>
            </div>
          ))}
        </div>

        <div className="fc-grid mt-1">
          {Array.from({ length: firstDayWeekday }).map((_, i) => (
            <div key={`lead-${i}`} className="fc-blank" aria-hidden="true" />
          ))}

          {monthDays.map((day) => {
            const isSelected = day.dateIso === selectedDateIso;
            const marks = dayMarkers(day);
            const festival = day.festivals[0];
            return (
              <button
                key={day.dateIso}
                type="button"
                onClick={() => selectDay(day.dateIso)}
                aria-pressed={isSelected}
                aria-current={day.dateIso === todayIso ? 'date' : undefined}
                aria-label={`${day.dayNumber} ${MONTH_NAMES[month].en} ${year}, ${day.panchang.tithi.nameHi}, ${day.panchang.nakshatra.nameHi}${
                  festival ? `, ${festival.nameHindi || festival.name}` : ''
                }`}
                className="fc-day"
                data-sunday={day.dayOfWeek === 0 ? '' : undefined}
                data-today={day.dateIso === todayIso ? '' : undefined}
                data-festival={day.festivals.length > 0 ? '' : undefined}
                data-dim={isDayMatchingFilter(day) ? undefined : ''}
              >
                <span className="fc-day-head">
                  <span className="fc-num">{day.dayNumber}</span>
                  <span className="fc-moon-sm">
                    <MoonPhase tithi={day.panchang.tithi.number} size={18} />
                  </span>
                </span>
                <span lang="hi" className="fc-tithi">
                  {day.panchang.tithi.nameHi}
                </span>
                <span lang="hi" className="fc-nak">
                  {day.panchang.nakshatra.nameHi}
                </span>

                <span className="fc-marks" aria-hidden="true">
                  {marks.map((k) => (
                    <Dot key={k} kind={k} />
                  ))}
                </span>
                <span className="fc-tags" aria-hidden="true">
                  {marks.map((k) => (
                    <span key={k} className="fc-tag" style={{ '--tag': MARKERS[k].hue } as React.CSSProperties}>
                      <Dot kind={k} />
                      <span lang="hi">
                        {k === 'festival' && festival ? festival.nameHindi || festival.name : MARKERS[k].hi}
                      </span>
                    </span>
                  ))}
                </span>
              </button>
            );
          })}

          {Array.from({ length: trailingBlanks }).map((_, i) => (
            <div key={`trail-${i}`} className="fc-blank" aria-hidden="true" />
          ))}
        </div>

        <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-separator px-2 pt-3 text-caption text-label-secondary">
          {(Object.keys(MARKERS) as MarkerKind[]).map((k) => (
            <li key={k} className="inline-flex items-center gap-1.5">
              <Dot kind={k} />
              <span lang="hi">{MARKERS[k].hi}</span>
            </li>
          ))}
          <li className="inline-flex items-center gap-1.5">
            <MoonPhase tithi={8} size={14} />
            <span lang="hi">चन्द्र कला</span>
          </li>
        </ul>
      </div>

      {/* This month's festivals, as a quick list to jump from */}
      {monthFestivals.length > 0 && (
        <div>
          <h3 className="px-1 text-footnote font-semibold text-label-secondary">
            <span lang="hi">इस मास के पर्व</span> · <span>Festivals this month</span>
          </h3>
          <ul className="apple-group mt-2">
            {monthFestivals.map((d) =>
              d.festivals.map((f) => (
                <li key={`${d.dateIso}-${f.name}`}>
                  <button
                    type="button"
                    onClick={() => selectDay(d.dateIso)}
                    className="apple-row w-full text-left hover:bg-fill-quaternary"
                    aria-pressed={d.dateIso === selectedDateIso}
                  >
                    <span
                      className="apple-tint-chip apple-stat !h-10 !w-10 flex-col !gap-0 text-caption font-semibold leading-none"
                      style={{ '--chip': 'var(--hue-saffron)' } as React.CSSProperties}
                    >
                      <span className="text-[15px]">{d.dayNumber}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span lang="hi" className="block truncate text-subhead font-semibold text-label-primary">
                        {f.nameHindi || f.name}
                      </span>
                      <span className="block truncate text-caption text-label-secondary">
                        <span>{f.name}</span> · <span lang="hi">{WEEKDAYS[d.dayOfWeek].fullHi}</span> ·{' '}
                        <span lang="hi">{d.panchang.tithi.nameHi}</span>
                      </span>
                    </span>
                    <span className="apple-chevron" aria-hidden="true">
                      ›
                    </span>
                  </button>
                </li>
              )),
            )}
          </ul>
        </div>
      )}

      {/* ─── SELECTED DAY ─────────────────────────────────────────────────── */}
      {selectedDay && (
        <section
          ref={inspectorRef}
          aria-labelledby="day-inspector-title"
          className="apple-card scroll-mt-24 p-5 sm:p-7"
        >
          <div key={selectedDay.dateIso} className="fc-detail-body">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <MoonPhase
                  tithi={selectedDay.panchang.tithi.number}
                  size={44}
                  label={`${selectedDay.panchang.paksha.illuminationPercent}% lit`}
                />
                <div className="min-w-0">
                  <h2 id="day-inspector-title" className="text-title-2 font-semibold leading-tight text-label-primary">
                    <span className="apple-stat">{selectedDay.dayNumber}</span> <span lang="hi">{MONTH_NAMES[month].hi}</span>{' '}
                    <span className="apple-stat">{year}</span>
                  </h2>
                  <p className="mt-1 text-subhead text-label-secondary">
                    <span lang="hi">{WEEKDAYS[selectedDay.dayOfWeek].fullHi}</span> ·{' '}
                    <span>{WEEKDAYS[selectedDay.dayOfWeek].fullEn}</span> ·{' '}
                    <span lang="hi">{selectedDay.panchang.ritu.nameHi} ऋतु</span>{' '}
                    <span>({selectedDay.panchang.ritu.seasonEn})</span> · <span lang="hi">{location.nameHi}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/panchang/?date=${selectedDay.dateIso}`} className="apple-pill apple-pill-tinted font-semibold">
                  <span lang="hi">दैनिक पंचांग</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href={`/panchang/muhurta/?date=${selectedDay.dateIso}`}
                  className="apple-pill apple-pill-tinted font-semibold"
                >
                  <span lang="hi">मुहूर्त</span> <span>Muhurta</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {selectedDay.festivals.length > 0 && (
              <div className="mt-5 space-y-3">
                {selectedDay.festivals.map((f) => (
                  <div key={f.name} className="fc-festival flex items-start gap-3">
                    <span className="apple-tint-chip !h-10 !w-10" style={{ '--chip': 'var(--hue-saffron)' } as React.CSSProperties}>
                      <Flame className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 space-y-1">
                      <p className="text-title-3 font-semibold leading-snug text-label-primary">
                        <span lang="hi">{f.nameHindi || f.name}</span>{' '}
                        {f.nameHindi && <span className="text-subhead font-normal text-label-secondary">{f.name}</span>}
                      </p>
                      {f.note && <p className="text-subhead text-label-secondary">{f.note}</p>}
                      {f.festivalId && (
                        <Link
                          href={`/festivals/${f.festivalId}/`}
                          className="fc-limb-link fc-hue-text"
                          style={{ '--hue': 'var(--hue-saffron)' } as React.CSSProperties}
                        >
                          <span lang="hi">पर्व की कथा व परंपरा पढ़ें</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* The four limbs of the day */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  limb: 'tithi',
                  hi: 'तिथि',
                  en: 'Tithi',
                  meta: selectedDay.panchang.tithi.paksha,
                  name: selectedDay.panchang.tithi.nameHi,
                  translit: selectedDay.panchang.tithi.transliteration,
                  text: selectedDay.panchang.tithi.meta.explanation,
                  href: `/panchang/tithis/${selectedDay.tithiSlug}/`,
                  link: `${selectedDay.panchang.tithi.nameHi} परिचय`,
                },
                {
                  limb: 'nakshatra',
                  hi: 'नक्षत्र',
                  en: 'Nakshatra',
                  meta: `चरण ${selectedDay.panchang.nakshatra.pada}`,
                  name: selectedDay.panchang.nakshatra.nameHi,
                  translit: selectedDay.panchang.nakshatra.transliteration,
                  text: `देवता: ${selectedDay.panchang.nakshatra.deity} · स्वामी: ${selectedDay.panchang.nakshatra.rulingPlanet}`,
                  href: `/panchang/nakshatras/${selectedDay.nakshatraSlug}/`,
                  link: `${selectedDay.panchang.nakshatra.nameHi} नक्षत्र`,
                },
                {
                  limb: 'yoga',
                  hi: 'योग',
                  en: 'Yoga',
                  meta: selectedDay.panchang.yoga.nature,
                  name: selectedDay.panchang.yoga.nameHi,
                  translit: selectedDay.panchang.yoga.transliteration,
                  text: selectedDay.panchang.yoga.explanation,
                  href: `/panchang/yogas/${selectedDay.yogaSlug}/`,
                  link: `${selectedDay.panchang.yoga.nameHi} योग`,
                },
                {
                  limb: 'karana',
                  hi: 'करण',
                  en: 'Karana',
                  meta: selectedDay.panchang.karana.nature,
                  name: selectedDay.panchang.karana.nameHi,
                  translit: selectedDay.panchang.karana.transliteration,
                  text: selectedDay.panchang.karana.explanation,
                  href: `/panchang/karanas/${selectedDay.karanaSlug}/`,
                  link: `${selectedDay.panchang.karana.nameHi} करण`,
                },
              ].map((l) => (
                <div key={l.limb} className="fc-limb" data-limb={l.limb}>
                  <div className="flex items-center justify-between gap-2 text-footnote">
                    <span className="fc-hue-text font-semibold">
                      <span lang="hi">{l.hi}</span> <span>{l.en}</span>
                    </span>
                    <span className="truncate text-label-tertiary">{l.meta}</span>
                  </div>
                  <p lang="hi" className="mt-2 text-title-3 font-semibold leading-snug text-label-primary">
                    {l.name}
                  </p>
                  <p className="text-footnote text-label-secondary">{l.translit}</p>
                  <p className="mt-2 line-clamp-3 text-footnote leading-relaxed text-label-secondary">{l.text}</p>
                  <Link href={l.href} className="fc-limb-link fc-hue-text mt-auto pt-2">
                    <span lang="hi">{l.link}</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              ))}
            </div>

            {/* Sun and moon */}
            <dl className="fc-stats mt-4">
              {[
                { icon: Sunrise, hi: 'सूर्योदय', en: 'Sunrise', v: selectedDay.panchang.solarTimes.sunrise, hue: 'var(--hue-gold)' },
                { icon: Sunset, hi: 'सूर्यास्त', en: 'Sunset', v: selectedDay.panchang.solarTimes.sunset, hue: 'var(--hue-vermilion)' },
                { icon: Sun, hi: 'मध्याह्न', en: 'Noon', v: selectedDay.panchang.solarTimes.solarNoon, hue: 'var(--hue-saffron)' },
                { icon: Hourglass, hi: 'दिनमान', en: 'Day length', v: selectedDay.panchang.solarTimes.dayLength, hue: 'var(--hue-peacock)' },
                {
                  icon: MoonStar,
                  hi: 'चन्द्र प्रकाश',
                  en: 'Moonlight',
                  v: `${selectedDay.panchang.paksha.illuminationPercent}%`,
                  hue: 'var(--hue-indigo)',
                },
              ].map(({ icon: Icon, ...s }) => (
                <div key={s.en} className="fc-stat" style={{ '--hue': s.hue } as React.CSSProperties}>
                  <dt className="flex items-center gap-1.5 text-caption text-label-secondary">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    <span lang="hi">{s.hi}</span> <span className="hidden sm:inline">{s.en}</span>
                  </dt>
                  <dd className="apple-stat text-callout font-semibold text-label-primary">{s.v}</dd>
                </div>
              ))}
            </dl>

            {/* Guides for the day's vrata */}
            {(selectedDay.isEkadashi || selectedDay.isPradosha || selectedDay.isPurnima || selectedDay.isAmavasya) && (
              <div className="mt-5 flex flex-wrap gap-2 border-t border-separator pt-4">
                {selectedDay.isEkadashi && (
                  <Link href="/panchang/ekadashi/" className="fc-vrata" style={{ '--hue': MARKERS.ekadashi.hue } as React.CSSProperties}>
                    <Dot kind="ekadashi" />
                    <span lang="hi">एकादशी व्रत, पारण व माहात्म्य</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                )}
                {selectedDay.isPradosha && (
                  <Link href="/panchang/pradosh/" className="fc-vrata" style={{ '--hue': MARKERS.pradosha.hue } as React.CSSProperties}>
                    <Dot kind="pradosha" />
                    <span lang="hi">प्रदोष व्रत व शिव-पूजा विधान</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                )}
                {selectedDay.isPurnima && (
                  <Link href="/panchang/purnima/" className="fc-vrata" style={{ '--hue': MARKERS.purnima.hue } as React.CSSProperties}>
                    <Dot kind="purnima" />
                    <span lang="hi">पूर्णिमा व्रत व सत्यनारायण पूजन</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                )}
                {selectedDay.isAmavasya && (
                  <Link href="/panchang/amavasya/" className="fc-vrata" style={{ '--hue': MARKERS.amavasya.hue } as React.CSSProperties}>
                    <Dot kind="amavasya" />
                    <span lang="hi">अमावस्या श्राद्ध व पितृ तर्पण</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
