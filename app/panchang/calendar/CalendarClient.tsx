'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  MapPin,
  Moon,
  Sun,
  Sparkles,
  ArrowRight,
  BookOpen,
  Info,
  Clock,
  ExternalLink,
  Flame,
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

function getMoonPhaseGlyph(tithiNumber: number): string {
  if (tithiNumber === 30) return '🌑';
  if (tithiNumber === 15) return '🌕';
  if (tithiNumber >= 1 && tithiNumber <= 3) return '🌒';
  if (tithiNumber >= 4 && tithiNumber <= 8) return '🌓';
  if (tithiNumber >= 9 && tithiNumber <= 14) return '🌔';
  if (tithiNumber >= 16 && tithiNumber <= 20) return '🌖';
  if (tithiNumber >= 21 && tithiNumber <= 25) return '🌗';
  return '🌘';
}

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
  moonGlyph: string;
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
        moonGlyph: getMoonPhaseGlyph(tithiNum),
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

  return (
    <div className="space-y-8">
      {/* ─── CONTROLS: Year, Month, Location, & Quick Jumps ──────────────── */}
      <div className="rounded-2xl border border-dharma-border bg-dharma-card p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Year selector & Month navigation */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Year Selector */}
            <div className="flex rounded-xl bg-dharma-bg border border-dharma-border p-1">
              {[2026, 2027, 2028].map((y) => (
                <button
                  key={y}
                  onClick={() => {
                    triggerTactileFeedback('selection', 'softTap');
                    setYear(y);
                    setSelectedDateIso(`${y}-${String(month + 1).padStart(2, '0')}-01`);
                  }}
                  className={`rounded-lg min-h-[44px] px-3.5 py-2 text-footnote font-semibold transition-all ${
                    year === y
                      ? 'bg-dharma-saffron text-white shadow-sm'
                      : 'text-dharma-muted hover:text-dharma-text'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>

            {/* Prev / Next Month */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                disabled={year === 2026 && month === 0}
                aria-label="Previous Month"
                className="flex h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-dharma-border bg-dharma-card text-dharma-text hover:bg-dharma-bg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="min-w-[120px] text-center">
                <span className="text-body font-semibold text-dharma-text block">
                  {MONTH_NAMES[month].hi} {year}
                </span>
                <span className="text-caption-2 text-dharma-muted">
                  {MONTH_NAMES[month].en} · {MONTH_NAMES[month].masa}
                </span>
              </div>
              <button
                onClick={handleNextMonth}
                disabled={year === 2028 && month === 11}
                aria-label="Next Month"
                className="flex h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-dharma-border bg-dharma-card text-dharma-text hover:bg-dharma-bg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <button
              onClick={handleJumpToday}
              className="rounded-xl min-h-[44px] border border-dharma-border bg-dharma-card px-3.5 py-2 text-footnote font-medium text-dharma-text hover:bg-dharma-bg transition-colors"
            >
              आज (Today)
            </button>
          </div>

          {/* Location picker */}
          <div className="flex items-center gap-2 max-w-full">
            <MapPin className="h-4 w-4 text-dharma-saffron flex-shrink-0" />
            <span className="text-footnote text-dharma-muted hidden sm:inline">स्थान (Location):</span>
            <select
              value={location.id}
              onChange={(e) => {
                const found = PRESET_LOCATIONS.find((loc) => loc.id === e.target.value);
                if (found) setLocation(found);
              }}
              style={{ maxWidth: '200px' }}
              className="rounded-xl min-h-[44px] w-48 truncate border border-dharma-border bg-dharma-bg px-3 py-2 text-footnote font-medium text-dharma-text focus:outline-none focus:ring-2 focus:ring-dharma-saffron sm:w-auto"
            >
              {PRESET_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-dharma-card text-dharma-text">
                  {loc.nameHi} ({loc.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ─── FILTER CHIPS ──────────────────────────────────────────────── */}
        <div className="mt-4 pt-4 border-t border-dharma-border/60 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-caption-1 font-medium text-dharma-muted mr-1">
            <Filter className="h-3.5 w-3.5" />
            <span>फ़िल्टर (Filter):</span>
          </div>

          {[
            { id: 'all', label: 'सभी दिन (All)', badge: '' },
            { id: 'ekadashi', label: 'एकादशी व्रत', badge: '🌿' },
            { id: 'pradosha', label: 'प्रदोष व्रत', badge: '🔱' },
            { id: 'purnima-amavasya', label: 'पूर्णिमा व अमावस्या', badge: '🌕/🌑' },
            { id: 'festivals', label: 'प्रमुख पर्व व त्यौहार', badge: '🎉' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                triggerTactileFeedback('selection', 'softTap');
                setActiveFilter(item.id as CalendarFilter);
              }}
              className={`rounded-full min-h-[44px] px-3.5 py-2 text-caption-1 font-medium transition-all flex items-center gap-1.5 ${
                activeFilter === item.id
                  ? 'bg-dharma-saffron text-white shadow-sm'
                  : 'bg-dharma-bg border border-dharma-border text-dharma-muted hover:text-dharma-text hover:border-dharma-border-strong'
              }`}
            >
              {item.badge && <span>{item.badge}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── CALENDAR GRID ─────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-dharma-border bg-dharma-card overflow-hidden shadow-sm">
        <div className="w-full">
          {/* Weekday Headers */}
          <div
            className="grid grid-cols-7 border-b border-dharma-border bg-dharma-bg/60 text-center"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
          >
            {WEEKDAYS.map((wd, i) => (
              <div key={wd.shortEn} className={`py-2 px-0.5 sm:py-2.5 sm:px-2 ${i === 0 ? 'text-rose-600 dark:text-rose-400' : 'text-dharma-text'}`}>
                <div className="text-[11px] sm:text-caption-1 font-semibold">{wd.shortHi}</div>
                <div className="text-[10px] text-dharma-muted uppercase tracking-wider hidden sm:block">{wd.shortEn}</div>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div
            className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-dharma-border/60 bg-dharma-border/30"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
          >
          {/* Empty cells before month starts */}
          {Array.from({ length: firstDayWeekday }).map((_, i) => (
            <div key={`blank-${i}`} className="bg-dharma-bg/30 min-h-[76px] sm:min-h-[110px]" />
          ))}

          {/* Actual days of month */}
          {monthDays.map((day) => {
            const isSelected = day.dateIso === selectedDateIso;
            const matchesFilter = isDayMatchingFilter(day);

            return (
              <button
                key={day.dateIso}
                onClick={() => {
                  triggerTactileFeedback('selection', 'softTap');
                  setSelectedDateIso(day.dateIso);
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    window.requestAnimationFrame(() => {
                      inspectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    });
                  }
                }}
                aria-pressed={isSelected}
                aria-label={`${day.dayNumber} ${MONTH_NAMES[month].hi}, ${day.panchang.tithi.nameHi}, ${day.panchang.nakshatra.nameHi}`}
                className={`relative flex w-full !min-w-0 flex-col justify-between overflow-hidden p-1 sm:p-2.5 text-left transition-all min-h-[76px] sm:min-h-[110px] ${
                  isSelected
                    ? 'bg-saffron-50/70 dark:bg-saffron-950/30 ring-2 ring-inset ring-dharma-saffron z-10'
                    : 'bg-dharma-card hover:bg-dharma-bg/80'
                } ${!matchesFilter ? 'opacity-35 grayscale-[50%]' : 'opacity-100'}`}
              >
                {/* Top row: Date Number & Moon Phase */}
                <div className="flex items-center justify-between w-full gap-0.5">
                  <span
                    className={`inline-flex items-center justify-center text-[11px] font-bold sm:text-body rounded-full h-5 w-5 sm:h-7 sm:w-7 shrink-0 ${
                      isSelected
                        ? 'bg-dharma-saffron text-white'
                        : day.dayOfWeek === 0
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-dharma-text'
                    }`}
                  >
                    {day.dayNumber}
                  </span>
                  <span className="text-[10px] sm:text-sm select-none leading-none" title={day.panchang.tithi.paksha}>
                    {day.moonGlyph}
                  </span>
                </div>

                {/* Middle row: Tithi & Nakshatra */}
                <div className="mt-0.5 sm:mt-1 space-y-0.5 overflow-hidden w-full">
                  <div className="text-[10px] sm:text-xs font-semibold text-dharma-text truncate leading-tight">
                    {day.panchang.tithi.nameHi}
                  </div>
                  <div className="text-[10px] text-dharma-muted truncate leading-tight hidden sm:block">
                    {day.panchang.nakshatra.nameHi}
                  </div>
                </div>

                {/* Bottom row: Sacred Badges */}
                <div className="mt-0.5 sm:mt-1 flex flex-wrap gap-0.5 sm:gap-1">
                  {day.isEkadashi && (
                    <span className="inline-flex items-center gap-0.5 rounded px-1 py-0.2 text-[9px] sm:text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                      <span aria-hidden="true">🌿</span>
                      <span className="hidden sm:inline">एकादशी</span>
                    </span>
                  )}
                  {day.isPradosha && !day.isEkadashi && (
                    <span className="inline-flex items-center gap-0.5 rounded px-1 py-0.2 text-[9px] sm:text-[10px] font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300">
                      <span aria-hidden="true">🔱</span>
                      <span className="hidden sm:inline">प्रदोष</span>
                    </span>
                  )}
                  {day.isPurnima && (
                    <span className="inline-flex items-center gap-0.5 rounded px-1 py-0.2 text-[9px] sm:text-[10px] font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200">
                      <span aria-hidden="true">🌕</span>
                      <span className="hidden sm:inline">पूर्णिमा</span>
                    </span>
                  )}
                  {day.isAmavasya && (
                    <span className="inline-flex items-center gap-0.5 rounded px-1 py-0.2 text-[9px] sm:text-[10px] font-semibold bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                      <span aria-hidden="true">🌑</span>
                      <span className="hidden sm:inline">अमावस्या</span>
                    </span>
                  )}
                  {day.festivals.length > 0 && (
                    <span className="inline-flex items-center gap-0.5 rounded px-1 py-0.2 text-[9px] sm:text-[10px] font-semibold bg-saffron-100 text-saffron-900 dark:bg-saffron-950/70 dark:text-saffron-200 truncate max-w-full">
                      <span aria-hidden="true">🎉</span>
                      <span className="hidden sm:inline truncate">{day.festivals[0].nameHindi || day.festivals[0].name}</span>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        </div>
        <div className="border-t border-dharma-border/60 bg-dharma-bg/50 px-3 py-2 text-center text-[11px] text-dharma-muted sm:hidden">
          🌿 एकादशी · 🔱 प्रदोष · 🌕 पूर्णिमा · 🌑 अमावस्या · 🎉 पर्व — विवरण हेतु किसी भी तिथि को चुनें
        </div>
      </div>

      {/* ─── DAY INSPECTOR PANEL ───────────────────────────────────────────── */}
      {selectedDay && (
        <section
          ref={inspectorRef}
          aria-labelledby="day-inspector-title"
          className="scroll-mt-20 rounded-2xl border-2 border-dharma-saffron/40 bg-dharma-card p-5 sm:p-7 shadow-md transition-all"
        >
          {/* Header of Inspector */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-dharma-border pb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl sm:text-2xl">{selectedDay.moonGlyph}</span>
                <h2 id="day-inspector-title" className="text-title-2 font-bold text-dharma-text">
                  {selectedDay.dayNumber} {MONTH_NAMES[month].hi} {year} · {WEEKDAYS[selectedDay.dayOfWeek].fullHi}
                </h2>
                <Link
                href={`/panchang/muhurta/?date=${selectedDay.dateIso}`}
                className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-dharma-saffron/40 bg-dharma-bg px-4 py-2 text-footnote font-semibold text-dharma-text hover:border-dharma-saffron hover:text-dharma-saffron"
              >
                <span>इस दिन का मुहूर्त · Muhurta</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
              <p className="text-footnote text-dharma-muted mt-0.5">
                {selectedDay.dateIso} ({WEEKDAYS[selectedDay.dayOfWeek].fullEn}) · {selectedDay.panchang.ritu.nameHi} ऋतु ({selectedDay.panchang.ritu.seasonEn}) · स्थान: {location.nameHi}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/panchang/?date=${selectedDay.dateIso}`}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-dharma-border bg-dharma-bg px-4 py-2 text-footnote font-semibold text-dharma-text hover:border-dharma-saffron hover:text-dharma-saffron transition-all"
              >
                <span>दैनिक पंचांग खोलें</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Festival Banner if present */}
          {selectedDay.festivals.length > 0 && (
            <div className="mt-5 rounded-xl bg-gradient-to-r from-saffron-500/10 via-amber-500/10 to-orange-500/10 border border-saffron-400/40 p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🪔</span>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-subhead font-bold text-dharma-text">
                      {selectedDay.festivals[0].nameHindi || selectedDay.festivals[0].name}
                    </span>
                    <span className="text-caption-1 text-dharma-muted">
                      ({selectedDay.festivals[0].name})
                    </span>
                  </div>
                  {selectedDay.festivals[0].note && (
                    <p className="text-footnote text-dharma-muted">
                      {selectedDay.festivals[0].note}
                    </p>
                  )}
                  {selectedDay.festivals[0].festivalId && (
                    <div className="pt-1">
                      <Link
                        href={`/festivals/${selectedDay.festivals[0].festivalId}/`}
                        className="inline-flex items-center gap-1 text-caption-1 font-semibold text-dharma-saffron hover:underline"
                      >
                        <span>पर्व की शास्त्रीय कथा व परंपरा पढ़ें</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4 Limbs Grid: Tithi, Nakshatra, Yoga, Karana */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. TITHI */}
            <div className="rounded-xl border border-dharma-border bg-dharma-bg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-caption-2 uppercase tracking-wider text-dharma-muted">
                  <span>तिथि (Tithi)</span>
                  <span>{selectedDay.panchang.tithi.paksha}</span>
                </div>
                <div className="mt-1 text-headline font-bold text-dharma-text">
                  {selectedDay.panchang.tithi.nameHi}
                </div>
                <div className="text-caption-1 text-dharma-saffron font-medium">
                  {selectedDay.panchang.tithi.transliteration}
                </div>
                <p className="mt-2 text-caption-1 text-dharma-muted line-clamp-3">
                  {selectedDay.panchang.tithi.meta.explanation}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-dharma-border/60">
                <Link
                  href={`/panchang/tithis/${selectedDay.tithiSlug}/`}
                  className="inline-flex items-center gap-1 text-caption-2 font-semibold text-dharma-saffron hover:underline"
                >
                  <span>{selectedDay.panchang.tithi.nameHi} परिचय</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* 2. NAKSHATRA */}
            <div className="rounded-xl border border-dharma-border bg-dharma-bg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-caption-2 uppercase tracking-wider text-dharma-muted">
                  <span>नक्षत्र (Nakshatra)</span>
                  <span>चरण {selectedDay.panchang.nakshatra.pada}</span>
                </div>
                <div className="mt-1 text-headline font-bold text-dharma-text">
                  {selectedDay.panchang.nakshatra.nameHi}
                </div>
                <div className="text-caption-1 text-dharma-saffron font-medium">
                  {selectedDay.panchang.nakshatra.transliteration}
                </div>
                <p className="mt-2 text-caption-1 text-dharma-muted line-clamp-3">
                  देवता: {selectedDay.panchang.nakshatra.deity} · स्वामी: {selectedDay.panchang.nakshatra.rulingPlanet}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-dharma-border/60">
                <Link
                  href={`/panchang/nakshatras/${selectedDay.nakshatraSlug}/`}
                  className="inline-flex items-center gap-1 text-caption-2 font-semibold text-dharma-saffron hover:underline"
                >
                  <span>{selectedDay.panchang.nakshatra.nameHi} नक्षत्र</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* 3. YOGA */}
            <div className="rounded-xl border border-dharma-border bg-dharma-bg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-caption-2 uppercase tracking-wider text-dharma-muted">
                  <span>योग (Yoga)</span>
                  <span>{selectedDay.panchang.yoga.nature}</span>
                </div>
                <div className="mt-1 text-headline font-bold text-dharma-text">
                  {selectedDay.panchang.yoga.nameHi}
                </div>
                <div className="text-caption-1 text-dharma-saffron font-medium">
                  {selectedDay.panchang.yoga.transliteration}
                </div>
                <p className="mt-2 text-caption-1 text-dharma-muted line-clamp-3">
                  {selectedDay.panchang.yoga.explanation}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-dharma-border/60">
                <Link
                  href={`/panchang/yogas/${selectedDay.yogaSlug}/`}
                  className="inline-flex items-center gap-1 text-caption-2 font-semibold text-dharma-saffron hover:underline"
                >
                  <span>{selectedDay.panchang.yoga.nameHi} योग</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* 4. KARANA */}
            <div className="rounded-xl border border-dharma-border bg-dharma-bg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-caption-2 uppercase tracking-wider text-dharma-muted">
                  <span>करण (Karana)</span>
                  <span>{selectedDay.panchang.karana.nature}</span>
                </div>
                <div className="mt-1 text-headline font-bold text-dharma-text">
                  {selectedDay.panchang.karana.nameHi}
                </div>
                <div className="text-caption-1 text-dharma-saffron font-medium">
                  {selectedDay.panchang.karana.transliteration}
                </div>
                <p className="mt-2 text-caption-1 text-dharma-muted line-clamp-3">
                  {selectedDay.panchang.karana.explanation}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-dharma-border/60">
                <Link
                  href={`/panchang/karanas/${selectedDay.karanaSlug}/`}
                  className="inline-flex items-center gap-1 text-caption-2 font-semibold text-dharma-saffron hover:underline"
                >
                  <span>{selectedDay.panchang.karana.nameHi} करण</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Solar Times Row */}
          <div className="mt-5 rounded-xl border border-dharma-border/80 bg-dharma-bg/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-caption-1">
              <div className="flex items-center gap-1.5 text-dharma-text">
                <Sun className="h-4 w-4 text-amber-500" />
                <span>सूर्योदय: <strong>{selectedDay.panchang.solarTimes.sunrise}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-dharma-text">
                <Moon className="h-4 w-4 text-indigo-400" />
                <span>सूर्यास्त: <strong>{selectedDay.panchang.solarTimes.sunset}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-dharma-muted">
                <Clock className="h-4 w-4 text-rose-400" />
                <span>मध्याह्न: <strong>{selectedDay.panchang.solarTimes.solarNoon}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-dharma-muted">
                <Clock className="h-4 w-4 text-sky-400" />
                <span>दिनमान: <strong>{selectedDay.panchang.solarTimes.dayLength}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-dharma-muted">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>चंद्र प्रकाश: <strong>{selectedDay.panchang.paksha.illuminationPercent}%</strong></span>
              </div>
            </div>
          </div>

          {/* Contextual Vrata Guide Shortcuts */}
          <div className="mt-5 pt-4 border-t border-dharma-border flex flex-wrap gap-2">
            {selectedDay.isEkadashi && (
              <Link
                href="/panchang/ekadashi/"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-caption-1 font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-colors"
              >
                <span>🌿 एकादशी व्रत पारण व माहात्म्य गाइड पढ़ें</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
            {selectedDay.isPradosha && (
              <Link
                href="/panchang/pradosh/"
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 text-caption-1 font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/20 transition-colors"
              >
                <span>🔱 प्रदोष व्रत शिव-पूजा विधान व समय</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
            {selectedDay.isPurnima && (
              <Link
                href="/panchang/purnima/"
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-caption-1 font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 transition-colors"
              >
                <span>🌕 पूर्णिमा व्रत व सत्यनारायण पूजन</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
            {selectedDay.isAmavasya && (
              <Link
                href="/panchang/amavasya/"
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-500/10 border border-slate-500/30 px-3 py-1.5 text-caption-1 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-500/20 transition-colors"
              >
                <span>🌑 अमावस्या श्राद्ध व पितृ तर्पण विधि</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
