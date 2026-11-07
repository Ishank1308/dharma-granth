'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sun,
  Sunrise,
  Sunset,
  Clock,
  Compass,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Volume2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { SOLAR_VRATAS, type SolarVrata } from '@/data/solar-vratas-data';
import { speakSanskritTerm } from '@/lib/sacred-soundscape';

interface SolarClientProps {
  initialSolarTimes: {
    sunrise: string;
    sunset: string;
    solarNoon: string;
    dayLength: string;
  };
}

export function SolarVratasClient({ initialSolarTimes }: SolarClientProps) {
  const [selectedVrataId, setSelectedVrataId] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [playingKey, setPlayingKey] = useState<string | null>(null);

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // ignore
    }
  };

  const playAudio = (sanskrit: string, key: string) => {
    setPlayingKey(key);
    speakSanskritTerm(sanskrit);
    setTimeout(() => setPlayingKey(null), 4000);
  };

  const displayedVratas = selectedVrataId === 'all'
    ? SOLAR_VRATAS
    : SOLAR_VRATAS.filter((v) => v.id === selectedVrataId);

  return (
    <div className="space-y-12">
      {/* ─── 1. REAL-TIME SOLAR ASTRONOMICAL DIAL ───────────────────────── */}
      <section
        aria-label="Solar Astronomical Parameters"
        className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent p-6 sm:p-8 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
              <Sun className="w-4 h-4 text-amber-600 animate-spin-slow" />
              <span>Surya Siddhanta Astronomical Coordinates · सौर स्थिति</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-dharma-text mt-1">
              Today’s Sacred Solar Arc &amp; Daylight Hours
            </h2>
          </div>

          <Link
            href="/panchang/varas/ravivara/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-800 dark:text-saffron-300 hover:underline shrink-0"
          >
            <span>Ravivara (Sunday) Vrata Guide</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-dharma-border bg-dharma-card/80 p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-dharma-muted">
              <Sunrise className="w-4 h-4 text-amber-600" />
              <span>सूर्योदय (Sunrise)</span>
            </div>
            <p className="font-serif text-xl sm:text-2xl font-extrabold text-dharma-text">
              {initialSolarTimes.sunrise}
            </p>
            <p className="text-[11px] text-dharma-muted">Udaya Arghya window</p>
          </div>

          <div className="rounded-2xl border border-dharma-border bg-dharma-card/80 p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-dharma-muted">
              <Sunset className="w-4 h-4 text-rose-600" />
              <span>सूर्यास्त (Sunset)</span>
            </div>
            <p className="font-serif text-xl sm:text-2xl font-extrabold text-dharma-text">
              {initialSolarTimes.sunset}
            </p>
            <p className="text-[11px] text-dharma-muted">Sandhya Arghya window</p>
          </div>

          <div className="rounded-2xl border border-dharma-border bg-dharma-card/80 p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-dharma-muted">
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>मध्याह्न (Solar Noon)</span>
            </div>
            <p className="font-serif text-xl sm:text-2xl font-extrabold text-dharma-text">
              {initialSolarTimes.solarNoon}
            </p>
            <p className="text-[11px] text-dharma-muted">Maximum solar altitude</p>
          </div>

          <div className="rounded-2xl border border-dharma-border bg-dharma-card/80 p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-dharma-muted">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>दिनमान (Day Length)</span>
            </div>
            <p className="font-serif text-xl sm:text-2xl font-extrabold text-dharma-text">
              {initialSolarTimes.dayLength}
            </p>
            <p className="text-[11px] text-dharma-muted">Surya active radiation</p>
          </div>
        </div>
      </section>

      {/* ─── 2. VRATAS FILTER PILLS ─────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
            Select Solar Observance · सौर व्रत चयन
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedVrataId('all')}
            className={`rounded-2xl px-4 py-2 text-xs font-bold transition ${
              selectedVrataId === 'all'
                ? 'bg-saffron-600 text-white shadow-xs'
                : 'border border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-400'
            }`}
          >
            All Solar Vratas (सम्पूर्ण)
          </button>
          {SOLAR_VRATAS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelectedVrataId(v.id)}
              className={`rounded-2xl px-4 py-2 text-xs font-bold transition ${
                selectedVrataId === v.id
                  ? 'bg-saffron-600 text-white shadow-xs'
                  : 'border border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-400'
              }`}
            >
              <span>{v.name.split(' (')[0]}</span>
              <span className="font-devanagari text-[11px] ml-1.5 opacity-90">({v.nameHi.split(' (')[0]})</span>
            </button>
          ))}
        </div>
      </section>

      {/* ─── 3. VRATAS LISTING ───────────────────────────────────────────── */}
      <section className="space-y-10">
        {displayedVratas.map((vrata) => (
          <article
            key={vrata.id}
            id={vrata.slug}
            className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 space-y-6 shadow-xs"
          >
            {/* Header */}
            <div className="border-b border-dharma-border pb-5 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-3 py-0.5 text-xs font-semibold text-saffron-800 dark:text-saffron-300">
                  {vrata.timing}
                </span>
                <span className="text-xs text-dharma-muted border border-dharma-border rounded-full px-3 py-0.5">
                  Deity: {vrata.deity}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-dharma-text">
                {vrata.name}
              </h3>
              <p lang="sa" className="font-devanagari text-lg sm:text-xl font-semibold text-saffron-800 dark:text-saffron-300">
                {vrata.nameHi}
              </p>
            </div>

            {/* Significance & Astronomy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-dharma-border bg-dharma-bg/60 p-4 sm:p-5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>धार्मिक व आध्यात्मिक रहस्य (Significance)</span>
                </div>
                <p lang="hi" className="font-devanagari text-sm text-dharma-text leading-relaxed">
                  {vrata.significanceHi}
                </p>
                <p className="text-xs text-dharma-muted italic leading-relaxed pt-1">
                  {vrata.significance}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                  <Compass className="w-3.5 h-3.5" />
                  <span>खगोलीय एवं वैज्ञानिक आधार (Astronomical Basis)</span>
                </div>
                <p lang="hi" className="font-devanagari text-sm text-dharma-text leading-relaxed">
                  {vrata.astronomyHi}
                </p>
                <p className="text-xs text-dharma-muted italic leading-relaxed pt-1">
                  {vrata.astronomy}
                </p>
              </div>
            </div>

            {/* 4-Day Timeline Stepper (if Chhath Puja) */}
            {vrata.days && (
              <div className="space-y-4 pt-2">
                <h4 className="font-serif text-lg font-bold text-dharma-text flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-saffron-600" />
                  <span>The 4-Day Sacred Chronology (चार दिवसीय अनुष्ठान क्रम)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vrata.days.map((day) => (
                    <div
                      key={day.dayNumber}
                      className="rounded-2xl border border-dharma-border bg-dharma-card p-4 sm:p-5 space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-saffron-500/20 text-xs font-bold text-saffron-800 dark:text-saffron-300">
                            {day.dayNumber}
                          </span>
                          <span className="text-[11px] font-medium text-dharma-muted">
                            {day.tithiHi}
                          </span>
                        </div>

                        <h5 className="font-serif text-base font-bold text-dharma-text">
                          Day {day.dayNumber}: {day.name}
                        </h5>
                        <p lang="hi" className="font-devanagari text-xs text-saffron-800 dark:text-saffron-300 font-semibold mb-2">
                          {day.nameHi}
                        </p>

                        <p lang="hi" className="font-devanagari text-xs text-dharma-text leading-relaxed mb-3">
                          {day.descriptionHi}
                        </p>

                        <ul className="space-y-1 text-xs text-dharma-muted border-t border-dharma-border/60 pt-2">
                          {day.ritualsHi.map((r, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-1.5">
                              <span className="text-saffron-600 font-bold">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-3 pt-2 border-t border-dharma-border/60 text-xs text-dharma-muted">
                        प्रसाद: <strong className="text-dharma-text font-medium">{day.prasadHi}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sacred Mantras */}
            <div className="space-y-4 pt-2">
              <h4 className="font-serif text-lg font-bold text-dharma-text flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-600" />
                <span>Sacred Arghya &amp; Dhyana Mantras (अर्घ्य एवं ध्यान मन्त्र)</span>
              </h4>

              <div className="space-y-3">
                {vrata.mantras.map((m, mIdx) => {
                  const mantraKey = `${vrata.id}-m-${mIdx}`;
                  const shareText = `${m.titleHi} (${m.title})\n\n${m.sanskrit}\n\nभावार्थ: ${m.hindi}\n\nEnglish: ${m.english}`;

                  return (
                    <div
                      key={mIdx}
                      className="rounded-2xl border border-amber-300/40 dark:border-amber-800/40 bg-amber-50/60 dark:bg-amber-950/20 p-5 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-amber-300/30 pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                          {m.titleHi} · {m.title}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => playAudio(m.sanskrit, mantraKey)}
                            className="inline-flex items-center gap-1 rounded-lg border border-amber-300/60 bg-amber-100/50 dark:bg-amber-900/40 px-2.5 py-1 text-[11px] font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-200/50"
                            aria-label={`Listen to ${m.title}`}
                          >
                            <Volume2 className={`w-3.5 h-3.5 ${playingKey === mantraKey ? 'animate-pulse text-saffron-600' : ''}`} />
                            <span>{playingKey === mantraKey ? 'Reciting…' : 'उच्चारण'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => copyText(shareText, mantraKey)}
                            className="inline-flex items-center gap-1 rounded-lg border border-amber-300/60 bg-amber-100/50 dark:bg-amber-900/40 px-2.5 py-1 text-[11px] font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-200/50"
                            aria-label={`Copy ${m.title}`}
                          >
                            {copiedKey === mantraKey ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <p
                        lang="sa"
                        className="font-devanagari text-base sm:text-lg font-bold text-amber-950 dark:text-amber-100 text-center whitespace-pre-line leading-relaxed"
                      >
                        {m.sanskrit}
                      </p>
                      <p className="font-serif text-xs italic text-dharma-muted text-center whitespace-pre-line">
                        {m.iast}
                      </p>

                      <div className="pt-2 border-t border-amber-300/30 text-xs sm:text-sm text-dharma-text space-y-1">
                        <p lang="hi" className="font-devanagari">
                          <strong>भावार्थ:</strong> {m.hindi}
                        </p>
                        <p className="font-serif text-xs text-dharma-muted italic">
                          <strong>English:</strong> {m.english}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Guidelines & Purity Rules */}
            <div className="rounded-2xl border border-dharma-border bg-dharma-bg/60 p-4 sm:p-5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dharma-muted">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>पवित्रता एवं व्रत नियम (Purity &amp; Liturgical Rules)</span>
              </div>
              <ul className="space-y-1 text-xs text-dharma-text">
                {vrata.guidelinesHi.map((g, gIdx) => (
                  <li key={gIdx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span lang="hi" className="font-devanagari">{g}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cross Links */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-dharma-border/60 text-xs">
              <span className="text-dharma-muted">Related Panchang &amp; Hymn Links:</span>
              <div className="flex flex-wrap items-center gap-3">
                {vrata.crossLinks.map((link, lIdx) => (
                  <Link
                    key={lIdx}
                    href={link.href}
                    className="inline-flex items-center gap-1 font-semibold text-saffron-800 dark:text-saffron-300 hover:underline"
                  >
                    <span>{link.labelHi}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
