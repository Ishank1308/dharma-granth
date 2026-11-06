'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Database,
  ExternalLink,
  Flame,
  Globe,
  HelpCircle,
  Info,
  MapPin,
  Moon,
  RotateCcw,
  Sliders,
  Sparkles,
  Sun,
  Sunset,
} from 'lucide-react';
import {
  LocationConfig,
  PRESET_LOCATIONS,
  calculateEducationalPanchang,
  todayForLocation,
  type PanchangDayData,
} from '@/lib/panchang';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { MoonPhaseGraphic } from './panchang/MoonPhaseGraphic';
import { AccuracyNotice } from './panchang/AccuracyNotice';
import { LocationSettingsModal } from './panchang/LocationSettingsModal';
import { DataSourceModal } from './panchang/DataSourceModal';

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function PanchangCalendar() {
  // Null until the browser applies today's civil date at the chosen place.
  // A build-time Date would freeze the UTC runner's day into the static HTML.
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateWasPicked, setDateWasPicked] = useState(false);
  const [activeView, setActiveView] = useState<'day' | 'week'>('day');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(false);

  // User location preference stored in localStorage, defaulting to Varanasi
  const [location, setLocation] = useLocalStorage<LocationConfig>(
    'dharma.panchang.location',
    PRESET_LOCATIONS[0],
  );

  // Panchang calculations for the selected date and location
  const [retryKey, setRetryKey] = useState(0);
  const panchang = useMemo<PanchangDayData | null>(() => {
    // retryKey forces a fresh attempt; a failed calculation never falls back to stale values
    void retryKey;
    if (!selectedDate) return null;
    try {
      return calculateEducationalPanchang(selectedDate, location);
    } catch (err) {
      console.error('[Panchang] calculation failed', err);
      return null;
    }
  }, [selectedDate, location, retryKey]);

  // Week view calculation: 7 days centered or starting around selected date
  const weekDays = useMemo(() => {
    if (!panchang || !selectedDate) return [];
    try {
      return Array.from({ length: 7 }, (_, i) => {
        const day = addDays(selectedDate, i - 3);
        return {
          date: day,
          iso: toIsoDate(day),
          panchang: calculateEducationalPanchang(day, location),
        };
      });
    } catch {
      return [];
    }
  }, [selectedDate, location, panchang]);

  // A ?date=YYYY-MM-DD in the URL wins on first load; otherwise resolve to today at the location.
  const [urlDateChecked, setUrlDateChecked] = useState(false);
  useEffect(() => {
    if (urlDateChecked) return;
    setUrlDateChecked(true);
    try {
      const raw = new URLSearchParams(window.location.search).get('date');
      const m = raw && /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
      if (m) {
        setDateWasPicked(true);
        setSelectedDate(new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0));
      }
    } catch {
      // Ignore a malformed URL.
    }
  }, [urlDateChecked]);

  useEffect(() => {
    if (!urlDateChecked) return;
    if (!dateWasPicked) setSelectedDate(todayForLocation(location));
  }, [location, dateWasPicked, urlDateChecked]);

  // Keep the address bar in step with a picked date so the page can be shared or bookmarked.
  useEffect(() => {
    if (!urlDateChecked || !selectedDate) return;
    try {
      const url = new URL(window.location.href);
      if (dateWasPicked) url.searchParams.set('date', toIsoDate(selectedDate));
      else url.searchParams.delete('date');
      window.history.replaceState(null, '', url.toString());
    } catch {
      // History can be unavailable in embedded views.
    }
  }, [selectedDate, dateWasPicked, urlDateChecked]);

  const handlePrevDay = () => {
    setDateWasPicked(true);
    setSelectedDate((d) => (d ? addDays(d, -1) : d));
  };
  const handleNextDay = () => {
    setDateWasPicked(true);
    setSelectedDate((d) => (d ? addDays(d, 1) : d));
  };
  const handleToday = () => {
    setDateWasPicked(false);
    setSelectedDate(todayForLocation(location));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const [year, month, day] = e.target.value.split('-').map(Number);
    if (year && month && day) {
      setDateWasPicked(true);
      setSelectedDate(new Date(year, month - 1, day, 12, 0, 0));
    }
  };

  const isToday = selectedDate != null && toIsoDate(selectedDate) === toIsoDate(todayForLocation(location));

  if (!selectedDate) {
    return (
      <p role="status" className="apple-card p-6 text-center text-sm text-dharma-muted">
        <span lang="hi" className="font-devanagari">आज की तिथि खुल रही है।</span>
        <span className="mt-1 block">Opening today’s date.</span>
      </p>
    );
  }

  if (!panchang) {
    return (
      <div className="space-y-6">
        <section
          role="alert"
          className="apple-card p-6 text-center"
        >
          <h2 className="font-serif text-xl font-bold text-dharma-text">
            Panchang information is temporarily unavailable.
          </h2>
          <p lang="hi" className="font-devanagari mt-1 text-sm text-dharma-muted">
            पंचांग की जानकारी अभी उपलब्ध नहीं है।
          </p>
          <p className="mt-3 text-sm text-dharma-muted">
            No saved or placeholder values are shown in its place. Selected place: {location.name}.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => setRetryKey((k) => k + 1)} className="apple-pill">
              Retry
            </button>
            <button type="button" onClick={() => setIsLocationModalOpen(true)} className="min-h-[44px] rounded-full bg-dharma-text/[0.04] px-5 text-sm text-dharma-text hover:bg-dharma-text/[0.1]">
              Change location
            </button>
            <button type="button" onClick={() => setIsDataSourceModalOpen(true)} className="min-h-[44px] rounded-full bg-dharma-text/[0.04] px-5 text-sm text-dharma-text hover:bg-dharma-text/[0.1]">
              View data source
            </button>
          </div>
        </section>
        <LocationSettingsModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} currentLocation={location} onSelectLocation={(loc) => setLocation(loc)} />
        <DataSourceModal isOpen={isDataSourceModalOpen} onClose={() => setIsDataSourceModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── 1. HEADER ──────────────────────────────────────────────────────── */}
      <header
        aria-label="Panchang controls and active date"
        className="apple-card p-5 sm:p-7 space-y-5"
      >
        {/* Top line: Location control, Timezone, and Sources link */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dharma-text/10 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Selected Location Pill */}
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="group inline-flex items-center gap-2 rounded-full bg-dharma-text/[0.04] px-3 py-1.5 text-xs font-semibold text-dharma-text hover:text-saffron-700 dark:hover:text-saffron-400 transition"
              title="Click to change location or enter custom coordinates"
            >
              <MapPin className="h-3.5 w-3.5 text-saffron-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-dharma-text-secondary">स्थान:</span>
              <span className="font-bold">{location.name}</span>
              <span className="ml-1 text-[12px] text-dharma-saffron underline underline-offset-2">
                बदलें (Change)
              </span>
            </button>

            {/* Timezone Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-dharma-text/[0.04] px-3 py-1.5 text-xs text-dharma-text-secondary">
              <Clock className="h-3.5 w-3.5" />
              <span className="tabular-nums font-medium text-dharma-text">
                {location.timezone} (UTC{location.utcOffsetHours >= 0 ? `+${location.utcOffsetHours}` : location.utcOffsetHours})
              </span>
            </span>

            {!location.hasReliableCoordinates && (
              <span className="inline-flex items-center gap-1 rounded-xl bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold text-amber-800 dark:text-amber-200">
                <AlertTriangle className="h-3 w-3" />
                <span>Coordinates unverified</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDataSourceModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-dharma-text/[0.04] px-3 py-1.5 text-xs font-medium text-dharma-text-secondary hover:text-dharma-text transition"
            >
              <Database className="h-3.5 w-3.5" />
              <span>डेटा स्रोत (Data Sources)</span>
            </button>
          </div>
        </div>

        {/* Date Display and Day Navigation */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
              <span>{panchang.dayOfWeek} · {panchang.dayOfWeekHi}</span>
              <span>•</span>
              <span>{panchang.ritu.nameHi} ऋतु ({panchang.ritu.seasonEn})</span>
            </div>
            <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-dharma-text">
              {panchang.fullDateEnglish}
            </h2>
            <p lang="hi" className="text-sm sm:text-base font-devanagari text-dharma-muted">
              {panchang.fullDateHindi} · {panchang.tithi.nameHi} ({panchang.paksha.nameHi})
            </p>
          </div>

          {/* Previous / Today / Next / Date Picker */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-full bg-dharma-text/[0.04] p-1">
              <button
                type="button"
                onClick={handlePrevDay}
                aria-label="Previous day"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-dharma-text hover:bg-dharma-card transition"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous Day</span>
              </button>

              <button
                type="button"
                onClick={handleToday}
                disabled={isToday}
                aria-label="Jump to today"
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                  isToday
                    ? 'bg-saffron-600 text-white shadow-sm'
                    : 'text-dharma-text hover:bg-dharma-card'
                }`}
              >
                Today
              </button>

              <button
                type="button"
                onClick={handleNextDay}
                aria-label="Next day"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-dharma-text hover:bg-dharma-card transition"
              >
                <span>Next Day</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Direct Date Picker */}
            <div className="relative">
              <input
                type="date"
                value={panchang.isoDate}
                onChange={handleDateChange}
                aria-label="Select custom date"
                className="rounded-full bg-dharma-text/[0.04] px-3 py-2 text-xs font-semibold text-dharma-text focus:ring-2 focus:ring-dharma-saffron focus:outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* View Switcher: Day View vs Week View */}
        <div className="flex items-center justify-between border-t border-dharma-text/10 pt-4">
          <div className="apple-segmented">
            <button
              type="button"
              onClick={() => setActiveView('day')}
              aria-pressed={activeView === 'day'}
              className="flex items-center gap-2"
            >
              <Calendar className="h-3.5 w-3.5 text-saffron-600" />
              <span>Day View (दैनिक दर्शन)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('week')}
              aria-pressed={activeView === 'week'}
              className="flex items-center gap-2"
            >
              <CalendarDays className="h-3.5 w-3.5 text-indigo-500" />
              <span>Week View (साप्ताहिक प्रवाह)</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-dharma-muted">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Standard: Chitra Paksha (Lahiri) Ayanamsha</span>
          </div>
        </div>
      </header>

      {/* ─── 2. ACCURACY NOTICE ─────────────────────────────────────────────── */}
      <AccuracyNotice
        onOpenDataSourceModal={() => setIsDataSourceModalOpen(true)}
      />

      {/* ─── 3. WEEK VIEW ───────────────────────────────────────────────────── */}
      {activeView === 'week' && (
        <section aria-labelledby="week-view-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="week-view-heading" className="font-serif text-xl font-bold text-dharma-text">
                साप्ताहिक चंद्र प्रवाह · 7-Day Lunar Rhythm
              </h2>
              <p className="text-xs text-dharma-muted">
                Select any day to inspect full educational details and scriptural contemplation
              </p>
            </div>
            <button
              type="button"
              onClick={handleToday}
              className="text-xs font-semibold text-saffron-700 dark:text-saffron-400 hover:underline"
            >
              Back to Today &rarr;
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3" role="grid" aria-label="7-Day Panchang view">
            {weekDays.map(({ date, iso, panchang: dayPanchang }) => {
              const isSelected = iso === panchang.isoDate;
              const isTodayDay = iso === toIsoDate(new Date());
              const isEkadashi = dayPanchang.tithi.number === 11 || dayPanchang.tithi.number === 26;
              const isPurnima = dayPanchang.tithi.number === 15;
              const isAmavasya = dayPanchang.tithi.number === 30;

              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  aria-pressed={isSelected}
                  className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-saffron-600 bg-saffron-600/10 ring-2 ring-saffron-500/30 shadow-md'
                      : 'border-dharma-border bg-dharma-card hover:border-saffron-300 hover:bg-dharma-panel'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold uppercase tracking-wider ${isSelected ? 'text-saffron-700 dark:text-saffron-400' : 'text-dharma-muted'}`}>
                        {dayPanchang.dayOfWeek.slice(0, 3)}
                      </span>
                      {isTodayDay && (
                        <span className="rounded-full bg-saffron-600 px-1.5 py-0.2 text-[9px] font-bold text-white uppercase">
                          Today
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="font-serif text-2xl font-bold text-dharma-text">
                        {date.getDate()}
                      </span>
                      <span className="text-xs text-dharma-muted">
                        {date.toLocaleString('en-IN', { month: 'short' })}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1">
                      <div className="font-serif text-xs font-bold text-dharma-text truncate">
                        {dayPanchang.tithi.name}
                      </div>
                      <div lang="hi" className="font-devanagari text-[11px] text-saffron-700 dark:text-saffron-400 truncate">
                        {dayPanchang.tithi.nameHi}
                      </div>
                      <div className="text-[10px] text-dharma-muted truncate">
                        {dayPanchang.nakshatra.name}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-dharma-text/10 flex flex-wrap gap-1">
                    {isEkadashi && (
                      <span className="rounded bg-purple-500/15 px-1.5 py-0.5 text-[9px] font-bold text-purple-700 dark:text-purple-300">
                        एकादशी
                      </span>
                    )}
                    {isPurnima && (
                      <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 dark:text-amber-200">
                        पूर्णिमा
                      </span>
                    )}
                    {isAmavasya && (
                      <span className="rounded bg-stone-500/20 px-1.5 py-0.5 text-[9px] font-bold text-stone-700 dark:text-stone-300">
                        अमावस्या
                      </span>
                    )}
                    <span className="text-[10px] text-dharma-muted">
                      {dayPanchang.paksha.isWaxing ? 'शुक्ल' : 'कृष्ण'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── 4. DAY VIEW: LUNAR SUMMARY ROW ─────────────────────────────────── */}
      <section aria-label="Lunar Phase Overview" className="apple-card p-6">
        <div className="grid gap-6 lg:grid-cols-[auto_1fr_auto] items-center">
          {/* Minimalist Vector Moon Graphic */}
          <div className="flex items-center gap-4">
            <MoonPhaseGraphic
              illuminationPercent={panchang.paksha.illuminationPercent}
              isWaxing={panchang.paksha.isWaxing}
              size={68}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                  {panchang.paksha.transliteration}
                </span>
                <span className="rounded-full bg-saffron-500/10 px-2 py-0.5 text-[10px] font-bold text-saffron-700 dark:text-saffron-400">
                  {panchang.paksha.illuminationPercent}% Illumination
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-dharma-text">
                {panchang.tithi.transliteration} ({panchang.tithi.nameHi})
              </h2>
              <p className="text-xs text-dharma-muted mt-0.5">
                {panchang.tithi.paksha} Fortnight · Lunar Day #{panchang.tithi.number}
              </p>
            </div>
          </div>

          {/* Tithi Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-dharma-muted">Tithi Progression:</span>
              <span className="tabular-nums font-semibold text-dharma-text">
                {panchang.tithi.progressPercent}% · {panchang.tithi.approxSpan}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-dharma-bg border border-dharma-border">
              <div
                className="h-full rounded-full bg-gradient-to-r from-saffron-600 to-amber-500 transition-all duration-500"
                style={{ width: `${panchang.tithi.progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-dharma-muted italic">
              Estimated local completion. Exact tithi ending boundaries depend on local Udaya Tithi reckoning.
            </p>
          </div>

          {/* Spiritual Focus Pill */}
          <div className="rounded-group bg-dharma-text/[0.04] p-3.5 max-w-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold text-dharma-text">
              <Sparkles className="h-3.5 w-3.5 text-saffron-600" />
              <span>साधना संकेत · Day Focus</span>
            </div>
            <p className="mt-1 text-xs text-dharma-muted leading-relaxed">
              {panchang.tithi.meta.spiritualFocus}
            </p>
          </div>
        </div>
      </section>

      {/* ─── 5. PRIMARY DETAILS: THE 5 ANGAS + RITU (Every value with Devanagari, IAST, Explanation, Time) ─── */}
      <section aria-labelledby="primary-panchang-angas">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 id="primary-panchang-angas" className="font-serif text-xl font-bold text-dharma-text">
              पञ्चाङ्ग मुख्य विवरण · Primary Limbs & Season
            </h2>
            <p className="text-xs text-dharma-muted">
              Every anga with Sanskrit name, transliteration, educational explanation, and time range
            </p>
          </div>
          <span className="text-xs text-dharma-muted">
            स्थान: {location.name}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* 1. TITHI CARD */}
          <div className="apple-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                1. Tithi · तिथि
              </span>
              <span className="rounded-full bg-saffron-500/10 px-2 py-0.5 text-[10px] font-semibold text-saffron-800 dark:text-saffron-300">
                Lunar Day
              </span>
            </div>

            <div className="mt-3">
              <h3 className="font-serif text-2xl font-bold text-dharma-text">
                {panchang.tithi.transliteration}
              </h3>
              <p lang="hi" className="font-devanagari text-lg text-saffron-700 dark:text-saffron-400 font-semibold">
                {panchang.tithi.nameHi} (तिथि #{panchang.tithi.number})
              </p>
            </div>

            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-dharma-panel px-2.5 py-1 text-xs tabular-nums text-dharma-muted">
              <Clock className="h-3 w-3" />
              <span>{panchang.tithi.approxSpan}</span>
            </div>

            <p className="mt-3 text-xs text-dharma-muted leading-relaxed">
              {panchang.tithi.meta.explanation}
            </p>
          </div>

          {/* 2. PAKSHA CARD */}
          <div className="apple-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                2. Paksha · पक्ष
              </span>
              <span className="rounded-full bg-saffron-500/10 px-2 py-0.5 text-[10px] font-semibold text-saffron-800 dark:text-saffron-300">
                {panchang.paksha.isWaxing ? 'Waxing' : 'Waning'}
              </span>
            </div>

            <div className="mt-3">
              <h3 className="font-serif text-2xl font-bold text-dharma-text">
                {panchang.paksha.transliteration}
              </h3>
              <p lang="hi" className="font-devanagari text-lg text-saffron-700 dark:text-saffron-400 font-semibold">
                {panchang.paksha.nameHi}
              </p>
            </div>

            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-dharma-panel px-2.5 py-1 text-xs tabular-nums text-dharma-muted">
              <Moon className="h-3 w-3" />
              <span>{panchang.paksha.illuminationPercent}% Illumination</span>
            </div>

            <p className="mt-3 text-xs text-dharma-muted leading-relaxed">
              {panchang.paksha.explanation}
            </p>
          </div>

          {/* 3. NAKSHATRA CARD */}
          <div className="apple-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                3. Nakshatra · नक्षत्र
              </span>
              <span className="rounded-full bg-saffron-500/10 px-2 py-0.5 text-[10px] font-semibold text-saffron-800 dark:text-saffron-300">
                Pada {panchang.nakshatra.pada} of 4
              </span>
            </div>

            <div className="mt-3">
              <h3 className="font-serif text-2xl font-bold text-dharma-text">
                {panchang.nakshatra.transliteration}
              </h3>
              <p lang="hi" className="font-devanagari text-lg text-saffron-700 dark:text-saffron-400 font-semibold">
                {panchang.nakshatra.nameHi}
              </p>
            </div>

            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-dharma-panel px-2.5 py-1 text-xs tabular-nums text-dharma-muted">
              <Clock className="h-3 w-3" />
              <span>{panchang.nakshatra.approxSpan}</span>
            </div>

            <div className="mt-2 text-[11px] text-dharma-muted flex items-center gap-2">
              <span><strong>Deity:</strong> {panchang.nakshatra.deity}</span>
              <span>•</span>
              <span><strong>Lord:</strong> {panchang.nakshatra.rulingPlanet}</span>
            </div>

            <p className="mt-2 text-xs text-dharma-muted leading-relaxed">
              {panchang.nakshatra.explanation}
            </p>
          </div>

          {/* 4. YOGA CARD */}
          <div className="apple-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                4. Yoga · योग
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  panchang.yoga.nature === 'Auspicious'
                    ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                    : panchang.yoga.nature === 'Neutral'
                    ? 'bg-blue-500/15 text-blue-800 dark:text-blue-300'
                    : 'bg-amber-500/15 text-amber-800 dark:text-amber-300'
                }`}
              >
                {panchang.yoga.nature}
              </span>
            </div>

            <div className="mt-3">
              <h3 className="font-serif text-2xl font-bold text-dharma-text">
                {panchang.yoga.transliteration}
              </h3>
              <p lang="hi" className="font-devanagari text-lg text-saffron-700 dark:text-saffron-400 font-semibold">
                {panchang.yoga.nameHi} (योग #{panchang.yoga.index + 1})
              </p>
            </div>

            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-dharma-panel px-2.5 py-1 text-xs tabular-nums text-dharma-muted">
              <Clock className="h-3 w-3" />
              <span>{panchang.yoga.approxSpan}</span>
            </div>

            <p className="mt-3 text-xs text-dharma-muted leading-relaxed">
              {panchang.yoga.explanation}
            </p>
          </div>

          {/* 5. KARANA CARD */}
          <div className="apple-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                5. Karana · करण
              </span>
              <span className="rounded-full bg-saffron-500/10 px-2 py-0.5 text-[10px] font-semibold text-saffron-800 dark:text-saffron-300">
                {panchang.karana.nature}
              </span>
            </div>

            <div className="mt-3">
              <h3 className="font-serif text-2xl font-bold text-dharma-text">
                {panchang.karana.transliteration}
              </h3>
              <p lang="hi" className="font-devanagari text-lg text-saffron-700 dark:text-saffron-400 font-semibold">
                {panchang.karana.nameHi}
              </p>
            </div>

            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-dharma-panel px-2.5 py-1 text-xs tabular-nums text-dharma-muted">
              <Clock className="h-3 w-3" />
              <span>{panchang.karana.approxSpan}</span>
            </div>

            <p className="mt-3 text-xs text-dharma-muted leading-relaxed">
              {panchang.karana.explanation}
            </p>
          </div>

          {/* 6. RITU (SEASON) CARD */}
          <div className="apple-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                6. Ritu · वैदिक ऋतु
              </span>
              <span className="rounded-full bg-saffron-500/10 px-2 py-0.5 text-[10px] font-semibold text-saffron-800 dark:text-saffron-300">
                {panchang.ritu.seasonEn}
              </span>
            </div>

            <div className="mt-3">
              <h3 className="font-serif text-2xl font-bold text-dharma-text">
                {panchang.ritu.transliteration}
              </h3>
              <p lang="hi" className="font-devanagari text-lg text-saffron-700 dark:text-saffron-400 font-semibold">
                {panchang.ritu.nameHi} ऋतु
              </p>
            </div>

            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-dharma-panel px-2.5 py-1 text-xs text-dharma-muted">
              <Compass className="h-3 w-3 text-saffron-600" />
              <span>{panchang.ritu.months}</span>
            </div>

            <p className="mt-3 text-xs text-dharma-muted leading-relaxed">
              {panchang.ritu.explanation} Focus: {panchang.ritu.spiritualFocus}
            </p>
          </div>
        </div>
      </section>

      {/* ─── 6. SUNRISE AND SUNSET: ONLY WHEN RELIABLE DATA IS AVAILABLE ────── */}
      <section aria-labelledby="solar-timings-heading" className="apple-card p-6">
        <div className="flex items-center justify-between border-b border-dharma-text/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
              <Sun className="h-4 w-4" />
            </div>
            <div>
              <h2 id="solar-timings-heading" className="font-serif text-lg font-bold text-dharma-text">
                सौर काल एवं सूर्योदय/सूर्यास्त · Solar Day & Horizon Timings
              </h2>
              <p className="text-xs text-dharma-muted">
                Observed local astronomical transit times for {location.name}
              </p>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-dharma-muted">
            {panchang.solarTimes.isReliable ? 'Verified Horizon Algorithm' : 'Pending Verification'}
          </span>
        </div>

        {panchang.solarTimes.isReliable ? (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-group bg-dharma-text/[0.04] p-4">
                <div className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300 font-semibold">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span>सूर्योदय · Sunrise</span>
                </div>
                <p className="mt-2 tabular-nums text-xl sm:text-2xl font-bold text-dharma-text">
                  {panchang.solarTimes.sunrise}
                </p>
                <p className="mt-1 text-[11px] text-dharma-muted">
                  Udaya Tithi determination anchor
                </p>
              </div>

              <div className="rounded-group bg-dharma-text/[0.04] p-4">
                <div className="flex items-center gap-1.5 text-xs text-orange-700 dark:text-orange-300 font-semibold">
                  <Sunset className="h-4 w-4 text-orange-500" />
                  <span>सूर्यास्त · Sunset</span>
                </div>
                <p className="mt-2 tabular-nums text-xl sm:text-2xl font-bold text-dharma-text">
                  {panchang.solarTimes.sunset}
                </p>
                <p className="mt-1 text-[11px] text-dharma-muted">
                  Pradosha kala initiation
                </p>
              </div>

              <div className="rounded-group bg-dharma-text/[0.04] p-4">
                <div className="flex items-center gap-1.5 text-xs text-indigo-700 dark:text-indigo-300 font-semibold">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  <span>दिन मान · Day Length</span>
                </div>
                <p className="mt-2 tabular-nums text-xl sm:text-2xl font-bold text-dharma-text">
                  {panchang.solarTimes.dayLength}
                </p>
                <p className="mt-1 text-[11px] text-dharma-muted">
                  Total daylight span (Dina Māna)
                </p>
              </div>

              <div className="rounded-group bg-dharma-text/[0.04] p-4">
                <div className="flex items-center gap-1.5 text-xs text-purple-700 dark:text-purple-300 font-semibold">
                  <Compass className="h-4 w-4 text-purple-500" />
                  <span>मध्याह्न · Solar Noon</span>
                </div>
                <p className="mt-2 tabular-nums text-xl sm:text-2xl font-bold text-dharma-text">
                  {panchang.solarTimes.solarNoon}
                </p>
                <p className="mt-1 text-[11px] text-dharma-muted">
                  Meridian crossing / Abhijit center
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-dharma-muted leading-relaxed">
              * Note: Times are computed using standard astronomical refraction (-0.833° horizon zenith).
              Topographical obstructions such as hills, local buildings, and temperature inversions may shift apparent
              horizon emergence by 1–3 minutes.
            </p>
          </div>
        ) : (
          /* Graceful Unavailable State */
          <div className="rounded-group bg-dharma-text/[0.04] p-5 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-dharma-text">
                  सूर्योदय व सूर्यास्त समय अनुपलब्ध · Solar Timings Unavailable
                </h3>
                <p className="mt-1 text-xs text-dharma-muted max-w-xl leading-relaxed">
                  {panchang.solarTimes.unreliableReason ||
                    'Reliable sunrise and sunset calculations strictly require verified geographic coordinates and local horizon parameters. We deliberately refrain from displaying estimated or generic placeholder clocks to prevent ritual inaccuracies.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="apple-pill mt-3 shrink-0 sm:mt-0"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>स्थान निर्देशांक सेट करें (Set Coordinates)</span>
            </button>
          </div>
        )}
      </section>

      {/* ─── 7. STUDY SUGGESTION (स्वाध्याय प्रेरणा) ───────────────────────── */}
      <section aria-labelledby="study-suggestion-heading" className="apple-card p-6">
        <div className="flex items-center justify-between border-b border-dharma-text/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-saffron-500/15 text-saffron-700 dark:text-saffron-400">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h2 id="study-suggestion-heading" className="font-serif text-lg font-bold text-dharma-text">
                आज का स्वाध्याय · Curated Study Suggestion
              </h2>
              <p className="text-xs text-dharma-muted">
                Scriptural reflection paired with today&apos;s lunar quality and seasonal mood
              </p>
            </div>
          </div>

          <span className="rounded-full bg-saffron-500/10 px-2.5 py-0.5 text-xs font-semibold text-saffron-700 dark:text-saffron-400">
            {panchang.studySuggestion.scriptureTitle} {panchang.studySuggestion.verseRef}
          </span>
        </div>

        <div className="rounded-group bg-dharma-text/[0.04] p-5 sm:p-6 space-y-4">
          <div>
            <p lang="sa" className="text-xl leading-relaxed text-dharma-text sm:text-2xl">
              {panchang.studySuggestion.sanskrit}
            </p>
            <p className="mt-2 text-xs sm:text-sm tabular-nums text-dharma-muted leading-relaxed">
              {panchang.studySuggestion.transliteration}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-dharma-text/10 text-xs sm:text-sm">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-dharma-muted">
                English Translation
              </span>
              <p className="mt-1 text-dharma-text leading-relaxed">
                &ldquo;{panchang.studySuggestion.english}&rdquo;
              </p>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-dharma-muted">
                हिन्दी भावार्थ
              </span>
              <p lang="hi" className="mt-1 font-devanagari text-dharma-text leading-relaxed">
                {panchang.studySuggestion.hindi}
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-dharma-text/10">
            <div className="text-xs text-saffron-800 dark:text-saffron-300 font-medium">
              <strong>चिंतन बिंदु (Contemplation):</strong> {panchang.studySuggestion.contemplationPrompt}
            </div>

            <Link
              href={`/scripture/${panchang.studySuggestion.scriptureId}`}
              className="inline-flex min-h-11 items-center gap-1.5 shrink-0 text-[14px] text-dharma-saffron hover:underline"
            >
              <span>ग्रंथालय में अध्ययन करें (Study in Library)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 8. FESTIVAL PREVIEW ────────────────────────────────────────────── */}
      <section aria-labelledby="festival-preview-heading" className="apple-card p-6">
        <div className="flex items-center justify-between border-b border-dharma-text/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/15 text-rose-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 id="festival-preview-heading" className="font-serif text-lg font-bold text-dharma-text">
                आगामी पर्व व उत्सव · Festival Preview
              </h2>
              <p className="text-xs text-dharma-muted">
                Upcoming sacred observances and tithi requirements with educational context
              </p>
            </div>
          </div>

          <Link
            href="/festivals"
            className="text-xs font-bold text-saffron-700 dark:text-saffron-400 hover:underline inline-flex items-center gap-1"
          >
            <span>सभी पर्व देखें (All Festivals)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {panchang.upcomingFestivalsPreview.map((fest) => (
            <div
              key={fest.id}
              className="flex flex-col justify-between rounded-group bg-dharma-text/[0.04] p-4 transition"
            >
              <div>
                <span className="rounded bg-dharma-card px-2 py-0.5 text-[10px] font-bold text-saffron-700 dark:text-saffron-400">
                  {fest.category}
                </span>

                <h3 className="mt-2 font-serif text-base font-bold text-dharma-text">
                  {fest.name}
                </h3>
                <p lang="hi" className="font-devanagari text-xs text-saffron-700 dark:text-saffron-400 font-semibold">
                  {fest.nameHi}
                </p>

                <div className="mt-2 text-[11px] text-dharma-muted">
                  <strong>Tithi Rule:</strong> {fest.tithiRule}
                </div>

                <p className="mt-2 text-xs text-dharma-muted leading-relaxed">
                  {fest.synopsis}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-dharma-text/10 flex items-center justify-between text-xs">
                <span className="text-dharma-muted">{fest.dateStr}</span>
                <Link
                  href="/festivals"
                  className="tap-target inline-flex items-center font-semibold text-saffron-700 dark:text-saffron-400 hover:underline"
                >
                  विवरण &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 9. LOCATION & DATA SOURCE MODALS ───────────────────────────────── */}
      <LocationSettingsModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={location}
        onSelectLocation={(loc) => setLocation(loc)}
      />

      <DataSourceModal
        isOpen={isDataSourceModalOpen}
        onClose={() => setIsDataSourceModalOpen(false)}
      />
    </div>
  );
}
