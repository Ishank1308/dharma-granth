'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Calendar,
  Compass,
  Info,
  MapPin,
  Moon,
  Sparkles,
  Sun,
} from 'lucide-react';

const MS_PER_DAY = 86_400_000;
const SYNODIC_MONTH = 29.530588861;
const SIDEREAL_MONTH = 27.321661;
const NEW_MOON_EPOCH = Date.UTC(2000, 0, 6, 18, 14);
const J2000 = Date.UTC(2000, 0, 1, 12);

const tithiNames = [
  'Pratipada',
  'Dvitiya',
  'Tritiya',
  'Chaturthi',
  'Panchami',
  'Shashthi',
  'Saptami',
  'Ashtami',
  'Navami',
  'Dashami',
  'Ekadashi',
  'Dwadashi',
  'Trayodashi',
  'Chaturdashi',
  'Purnima',
];

const tithiNamesHi = [
  'प्रतिपदा',
  'द्वितीया',
  'तृतीया',
  'चतुर्थी',
  'पंचमी',
  'षष्ठी',
  'सप्तमी',
  'अष्टमी',
  'नवमी',
  'दशमी',
  'एकादशी',
  'द्वादशी',
  'त्रयोदशी',
  'चतुर्दशी',
  'पूर्णिमा',
];

const nakshatras = [
  'Ashwini',
  'Bharani',
  'Krittika',
  'Rohini',
  'Mrigashira',
  'Ardra',
  'Punarvasu',
  'Pushya',
  'Ashlesha',
  'Magha',
  'Purva Phalguni',
  'Uttara Phalguni',
  'Hasta',
  'Chitra',
  'Swati',
  'Vishakha',
  'Anuradha',
  'Jyeshtha',
  'Mula',
  'Purva Ashadha',
  'Uttara Ashadha',
  'Shravana',
  'Dhanishta',
  'Shatabhisha',
  'Purva Bhadrapada',
  'Uttara Bhadrapada',
  'Revati',
];

const nakshatrasHi = [
  'अश्विनी',
  'भरणी',
  'कृत्तिका',
  'रोहिणी',
  'मृगशिरा',
  'आर्द्रा',
  'पुनर्वसु',
  'पुष्य',
  'आश्लेषा',
  'मघा',
  'पूर्व फाल्गुनी',
  'उत्तर फाल्गुनी',
  'हस्त',
  'चित्रा',
  'स्वाती',
  'विशाखा',
  'अनुराधा',
  'ज्येष्ठा',
  'मूल',
  'पूर्वाषाढ़ा',
  'उत्तराषाढ़ा',
  'श्रवण',
  'धनिष्ठा',
  'शतभिषा',
  'पूर्व भाद्रपद',
  'उत्तर भाद्रपद',
  'रेवती',
];

const LOCATIONS = [
  { city: 'New Delhi', country: 'India', offset: 0 },
  { city: 'Varanasi', country: 'India', offset: 0 },
  { city: 'Mumbai', country: 'India', offset: 0 },
  { city: 'Bengaluru', country: 'India', offset: 0 },
  { city: 'London', country: 'UK', offset: -5.5 },
  { city: 'New York', country: 'USA', offset: -10.5 },
];

function positiveModulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

function calculatePanchang(date: Date) {
  const daysFromNewMoon = (date.getTime() - NEW_MOON_EPOCH) / MS_PER_DAY;
  const lunarAge = positiveModulo(daysFromNewMoon, SYNODIC_MONTH);
  const tithiExact = (lunarAge / SYNODIC_MONTH) * 30;
  const tithiNumber = Math.floor(tithiExact) + 1;
  const paksha = tithiNumber <= 15 ? 'Shukla Paksha' : 'Krishna Paksha';
  const pakshaHi = tithiNumber <= 15 ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';
  const tithiIndex = tithiNumber <= 15 ? tithiNumber - 1 : tithiNumber - 16;
  const tithiName =
    tithiNumber === 30 ? 'Amavasya' : tithiNames[tithiIndex] ?? 'Pratipada';
  const tithiNameHi =
    tithiNumber === 30 ? 'अमावस्या' : tithiNamesHi[tithiIndex] ?? 'प्रतिपदा';

  const daysFromJ2000 = (date.getTime() - J2000) / MS_PER_DAY;
  const moonLongitude = positiveModulo(
    218.316 + (daysFromJ2000 / SIDEREAL_MONTH) * 360,
    360,
  );
  const nakshatraIndex = Math.floor(moonLongitude / (360 / 27));

  return {
    tithiNumber,
    tithiName,
    tithiNameHi,
    paksha,
    pakshaHi,
    nakshatraName: nakshatras[nakshatraIndex] ?? 'Ashwini',
    nakshatraNameHi: nakshatrasHi[nakshatraIndex] ?? 'अश्विनी',
  };
}

export function PanchangPreviewSection() {
  const [selectedLoc, setSelectedLoc] = useState(LOCATIONS[0]);
  const [dateStr, setDateStr] = useState('');
  const [dateHiStr, setDateHiStr] = useState('');

  useEffect(() => {
    const today = new Date();
    setDateStr(
      today.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    );
    try {
      setDateHiStr(
        today.toLocaleDateString('hi-IN', { numberingSystem: 'latn',
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      );
    } catch {
      setDateHiStr(dateStr);
    }
  }, [dateStr]);

  // Computed after mount: the page is pre-rendered at build time, so a value from
  // the build's clock would not match the reader's day and break hydration.
  const [panchang, setPanchang] = useState<ReturnType<typeof calculatePanchang> | null>(null);
  useEffect(() => {
    setPanchang(calculatePanchang(new Date()));
  }, []);

  return (
    <section
      aria-labelledby="panchang-preview-heading"
      className="border-b border-dharma-border bg-gradient-to-b from-dharma-card/30 to-dharma-bg py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-gutter">
        {/* Section Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="size-2 rounded-full bg-saffron-600 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-saffron-700 dark:text-saffron-400">
                वैदिक पंचांग · Lunar Calendar
              </p>
            </div>
            <h2
              id="panchang-preview-heading"
              className="font-serif text-3xl font-bold text-dharma-text sm:text-4xl"
            >
              Daily Panchang Preview
            </h2>
            <p className="mt-1 text-sm text-dharma-muted">
              Astronomical cues for daily contemplation and study alignment.
            </p>
          </div>

          <Link
            href="/panchang"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-dharma-border bg-dharma-card px-5 py-2.5 text-xs font-bold text-dharma-text transition hover:border-saffron-300 hover:text-saffron-700 shadow-sm"
          >
            <span>View Full Panchang</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Main Panchang Container */}
        <div className="overflow-hidden rounded-3xl border border-amber-200/90 bg-dharma-card p-6 shadow-sm dark:border-amber-900/60 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-dharma-border/60 pb-6">
            {/* Date Display */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                Today’s Date · आज की तिथि
              </p>
              <h3 className="font-serif text-2xl font-bold text-dharma-text mt-1" suppressHydrationWarning>
                {dateStr}
              </h3>
              <p lang="hi" className="font-devanagari text-sm text-dharma-muted mt-0.5" suppressHydrationWarning>
                {dateHiStr}
              </p>
            </div>

            {/* Selected Location Switcher */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-dharma-muted">
                <MapPin className="h-4 w-4 text-saffron-600" />
                <span>Selected Location:</span>
              </div>
              <label htmlFor="panchang-location-select" className="sr-only">
                Choose Location
              </label>
              <select
                id="panchang-location-select"
                value={selectedLoc.city}
                onChange={(e) => {
                  const found = LOCATIONS.find((l) => l.city === e.target.value);
                  if (found) setSelectedLoc(found);
                }}
                className="rounded-xl border border-dharma-border bg-dharma-bg px-3 py-2 text-xs font-bold text-dharma-text outline-none focus:ring-2 focus:ring-saffron-500/20"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.city} value={loc.city}>
                    {loc.city}, {loc.country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4 Core Pillars: Tithi, Paksha, Nakshatra, Location */}
          <div className="my-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {/* Tithi */}
            <div className="rounded-2xl border border-dharma-border/70 bg-dharma-bg/80 p-4">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Moon className="h-4 w-4" />
                <span>Tithi (तिथि)</span>
              </div>
              <p className="mt-2 font-serif text-lg font-bold text-dharma-text">
                {panchang?.tithiName ?? '—'}
              </p>
              <p lang="hi" className="font-devanagari text-xs font-semibold text-saffron-700 dark:text-saffron-400">
                {panchang ? `${panchang.tithiNameHi} (${panchang.tithiNumber})` : '—'}
              </p>
            </div>

            {/* Paksha */}
            <div className="rounded-2xl border border-dharma-border/70 bg-dharma-bg/80 p-4">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>Paksha (पक्ष)</span>
              </div>
              <p className="mt-2 font-serif text-lg font-bold text-dharma-text">
                {panchang?.paksha ?? '—'}
              </p>
              <p lang="hi" className="font-devanagari text-xs font-semibold text-saffron-700 dark:text-saffron-400">
                {panchang?.pakshaHi ?? '—'}
              </p>
            </div>

            {/* Nakshatra */}
            <div className="rounded-2xl border border-dharma-border/70 bg-dharma-bg/80 p-4">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Compass className="h-4 w-4" />
                <span>Nakshatra (नक्षत्र)</span>
              </div>
              <p className="mt-2 font-serif text-lg font-bold text-dharma-text">
                {panchang?.nakshatraName ?? '—'}
              </p>
              <p lang="hi" className="font-devanagari text-xs font-semibold text-saffron-700 dark:text-saffron-400">
                {panchang?.nakshatraNameHi ?? '—'}
              </p>
            </div>

            {/* Solar Rhythm */}
            <div className="rounded-2xl border border-dharma-border/70 bg-dharma-bg/80 p-4">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Sun className="h-4 w-4" />
                <span>Solar Rhythm</span>
              </div>
              <p className="mt-2 font-serif text-lg font-bold text-dharma-text">
                Sandhyā Period
              </p>
              <p lang="hi" className="font-devanagari text-xs font-semibold text-saffron-700 dark:text-saffron-400">
                संध्या व सूर्योपासना
              </p>
            </div>
          </div>

          {/* Educational Accuracy Notice */}
          <div className="flex items-start gap-3 rounded-2xl border border-dashed border-amber-300/70 bg-amber-500/5 p-4 text-xs text-dharma-muted dark:border-amber-900/50">
            <Info className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-dharma-text">Educational Accuracy Notice:</strong> This Panchang approximation is calculated using standardized astronomical formulas for educational study and visual guidance. Traditional ritual observances may vary according to precise local horizon sunrise, regional ayanamsha, and temple sampradayas.
            </p>
          </div>

          {/* Action CTA */}
          <div className="mt-6 flex justify-end">
            <Link
              href="/panchang"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron-600 to-amber-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:from-saffron-700 hover:to-amber-700"
            >
              <span>View Full Panchang</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
