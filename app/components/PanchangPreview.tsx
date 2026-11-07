'use client';

import Link from 'next/link';
import { ArrowRight, Calendar, Compass, Moon, Sparkles, Sun } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { calculateEducationalPanchang, PRESET_LOCATIONS } from '@/lib/panchang';

export function PanchangPreview({ compact = false }: { compact?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState<Date>(() => new Date());

  useEffect(() => {
    setMounted(true);
    setToday(new Date());
  }, []);

  const panchang = useMemo(() => {
    return calculateEducationalPanchang(today, PRESET_LOCATIONS[0]);
  }, [today]);

  if (compact) {
    return (
      <div className="flex h-full min-h-[208px] flex-col justify-between rounded-xl bg-dharma-card p-4 sm:p-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span lang="hi">दैनिक पञ्चाङ्ग</span><span aria-hidden="true"> · </span><span>Panchang</span>
          </div>
          <h3 className="mt-3 font-serif text-lg font-bold text-dharma-text">
            {mounted ? panchang.fullDateEnglish : 'Today’s calendar'}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-dharma-muted">
            {mounted
              ? `${panchang.tithi.transliteration} (${panchang.tithi.nameHi}) · ${panchang.nakshatra.nameHi} नक्षत्र`
              : 'तिथि, पक्ष और नक्षत्र का शैक्षणिक परिचय'}
          </p>
        </div>
        <Link
          href="/panchang/"
          className="mt-4 inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-saffron-700 hover:text-saffron-800 dark:text-saffron-300"
        >
          <span>Explore Panchang</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300">
            <Calendar className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                दैनिक पञ्चाङ्ग · Educational Calendar
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="rounded bg-amber-500/15 px-1.5 py-0.2 text-[10px] font-semibold text-amber-800 dark:text-amber-200">
                Non-Ritual Study Standard
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-dharma-text mt-0.5">
              {mounted ? panchang.fullDateEnglish : 'दैनिक वैदिक पञ्चाङ्ग'}
            </h3>
            <p className="text-xs text-dharma-muted">
              {mounted
                ? `${panchang.tithi.transliteration} (${panchang.tithi.nameHi}) · ${panchang.nakshatra.name} नक्षत्र · ${panchang.ritu.nameHi} ऋतु`
                : 'तिथि, पक्ष, नक्षत्र, योग, करण एवं ऋतु का शैक्षणिक दर्शन'}
            </p>
          </div>
        </div>

        <Link
          href="/panchang"
          className="inline-flex items-center gap-2 rounded-xl border border-dharma-border bg-dharma-panel px-4 py-2.5 text-xs font-bold text-dharma-text transition hover:border-saffron-300 hover:text-saffron-700 shrink-0 shadow-sm"
        >
          <span>सम्पूर्ण शैक्षणिक पंचांग देखें</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-dharma-border/60 pt-4 sm:grid-cols-4">
        {/* Tithi */}
        <div className="rounded-xl bg-dharma-bg/80 p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-dharma-muted">
            <Moon className="h-3.5 w-3.5 text-indigo-400" />
            <span>तिथि (Tithi)</span>
          </div>
          <p className="mt-1 font-devanagari text-sm font-semibold text-dharma-text">
            {mounted ? `${panchang.tithi.nameHi} (#${panchang.tithi.number})` : 'चन्द्र तिथि'}
          </p>
          <p className="text-[10px] text-dharma-muted">
            {mounted ? panchang.tithi.transliteration : 'Lunar Day'}
          </p>
        </div>

        {/* Paksha */}
        <div className="rounded-xl bg-dharma-bg/80 p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-dharma-muted">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>पक्ष (Paksha)</span>
          </div>
          <p className="mt-1 font-devanagari text-sm font-semibold text-dharma-text">
            {mounted ? panchang.paksha.nameHi : 'शुक्ल / कृष्ण'}
          </p>
          <p className="text-[10px] text-dharma-muted">
            {mounted ? `${panchang.paksha.illuminationPercent}% Illum.` : 'Lunar Phase'}
          </p>
        </div>

        {/* Nakshatra */}
        <div className="rounded-xl bg-dharma-bg/80 p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-dharma-muted">
            <Compass className="h-3.5 w-3.5 text-saffron-500" />
            <span>नक्षत्र (Nakshatra)</span>
          </div>
          <p className="mt-1 font-devanagari text-sm font-semibold text-dharma-text">
            {mounted ? panchang.nakshatra.nameHi : 'चन्द्र नक्षत्र'}
          </p>
          <p className="text-[10px] text-dharma-muted">
            {mounted ? `${panchang.nakshatra.name} (P${panchang.nakshatra.pada})` : 'Lunar Mansion'}
          </p>
        </div>

        {/* Ritu */}
        <div className="rounded-xl bg-dharma-bg/80 p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-dharma-muted">
            <Sun className="h-3.5 w-3.5 text-rose-500" />
            <span>ऋतु (Ritu)</span>
          </div>
          <p className="mt-1 font-devanagari text-sm font-semibold text-dharma-text">
            {mounted ? `${panchang.ritu.nameHi} ऋतु` : 'वैदिक ऋतु'}
          </p>
          <p className="text-[10px] text-dharma-muted">
            {mounted ? panchang.ritu.seasonEn : 'Season'}
          </p>
        </div>
      </div>
    </div>
  );
}
