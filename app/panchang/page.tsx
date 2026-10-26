import React from 'react';
import Link from 'next/link';
import { BookOpen, Compass, HelpCircle } from 'lucide-react';
import { PanchangCalendar } from '@/app/components/PanchangCalendar';
import { PanchangCosmos } from '@/app/components/cosmos/PanchangCosmos';

export default function PanchangPage() {
  return (
    <main data-cosmos className="min-h-screen bg-dharma-bg">
      {/* ─── THE NIGHT SKY: Kāla-chakra and the five limbs of time ───────── */}
      <PanchangCosmos />

      {/* ─── MAIN CALENDAR INTERFACE ──────────────────────────────────────── */}
      <section className="relative mx-auto max-w-6xl px-5 sm:px-6 -mt-6 sm:-mt-8 pb-16 z-10">
        <PanchangCalendar />

        {/* ─── EDUCATIONAL PHILOSOPHY GUIDE ───────────────────────────────── */}
        <div className="mt-14 rounded-3xl border border-dharma-border bg-dharma-card p-7 sm:p-9 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400 mb-2">
              <BookOpen className="h-4 w-4" />
              <span>पञ्चाङ्ग तत्व दर्शन · The Vedic View of Time</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-dharma-text">
              Why We Learn the Five Limbs of Time
            </h2>
            <p className="mt-2 text-sm sm:text-base text-dharma-muted max-w-3xl leading-relaxed">
              In Vedic cosmology, time (Kāla) is not merely a quantitative ticker; it is an
              experiential rhythm mirroring the relationship between the Sun (universal vitality,
              <em>Prāṇa</em>) and the Moon (reflective awareness, <em>Manas</em>).
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-dharma-border bg-dharma-panel p-5">
              <div className="flex items-center gap-2 font-serif font-bold text-base text-dharma-text">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-saffron-500/15 text-saffron-700 text-xs">
                  1
                </span>
                <span>Self-Study (Svādhyāya)</span>
              </div>
              <p className="mt-2.5 text-xs sm:text-sm text-dharma-muted leading-relaxed">
                Just as nature cycles through seasons, the human intellect flows between outward
                active expansion (Shukla Paksha) and quiet assimilation (Krishna Paksha). Aligning
                reading plans with these rhythms brings natural focus.
              </p>
            </div>

            <div className="rounded-2xl border border-dharma-border bg-dharma-panel p-5">
              <div className="flex items-center gap-2 font-serif font-bold text-base text-dharma-text">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-saffron-500/15 text-saffron-700 text-xs">
                  2
                </span>
                <span>Contextualizing Scripture</span>
              </div>
              <p className="mt-2.5 text-xs sm:text-sm text-dharma-muted leading-relaxed">
                When the Mahabharata describes the battle at Kurukshetra or the Ramayana narrates
                the coronation of Rama, they cite Nakshatras, Tithis, and Muhurtas. Understanding
                the calendar makes ancient narratives vivid.
              </p>
            </div>

            <div className="rounded-2xl border border-dharma-border bg-dharma-panel p-5">
              <div className="flex items-center gap-2 font-serif font-bold text-base text-dharma-text">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-saffron-500/15 text-saffron-700 text-xs">
                  3
                </span>
                <span>Honesty Over Prediction</span>
              </div>
              <p className="mt-2.5 text-xs sm:text-sm text-dharma-muted leading-relaxed">
                We deliberately do not calculate strict karmakanda muhurtas or astrological fortune.
                Traditional ritual decisions require local family customs, temple sankalpas, and
                guidance from verified traditional pandits.
              </p>
            </div>
          </div>

          {/* Quick FAQ Strip */}
          <div className="border-t border-dharma-border/60 pt-6">
            <h3 className="font-serif text-lg font-bold text-dharma-text flex items-center gap-2 mb-4">
              <HelpCircle className="h-4 w-4 text-saffron-600" />
              <span>Frequently Asked Questions</span>
            </h3>

            <div className="space-y-4">
              <details className="group rounded-2xl border border-dharma-border bg-dharma-bg p-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-xs sm:text-sm text-dharma-text">
                  <span>Why does my local paper calendar show a different Tithi end time?</span>
                  <span className="ml-2 transition group-open:rotate-180">&darr;</span>
                </summary>
                <p className="mt-2 text-xs sm:text-sm text-dharma-muted leading-relaxed">
                  Paper almanacs (like Kalnirnay, Jagannath Panjika, or Kashi Vishwanath Panchang)
                  are printed for a single reference city (such as Mumbai, Varanasi, or Cuttack).
                  If you reside even 100 kilometers east or west, your local astronomical sunrise
                  differs by several minutes, which shifts the active tithi on days with tight
                  morning boundaries.
                </p>
              </details>

              <details className="group rounded-2xl border border-dharma-border bg-dharma-bg p-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-xs sm:text-sm text-dharma-text">
                  <span>What is Udaya Tithi and why does it define the day?</span>
                  <span className="ml-2 transition group-open:rotate-180">&darr;</span>
                </summary>
                <p className="mt-2 text-xs sm:text-sm text-dharma-muted leading-relaxed">
                  In classical Smarta tradition, the tithi that prevails when the upper limb of the
                  Sun crosses the local horizon (sunrise) is considered the governing tithi of that
                  solar day for devotional fasts and vrata observances, even if that tithi ends 10
                  minutes after sunrise.
                </p>
              </details>

              <details className="group rounded-2xl border border-dharma-border bg-dharma-bg p-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-xs sm:text-sm text-dharma-text">
                  <span>Why do sunrise times show &ldquo;Unavailable&rdquo; for some locations?</span>
                  <span className="ml-2 transition group-open:rotate-180">&darr;</span>
                </summary>
                <p className="mt-2 text-xs sm:text-sm text-dharma-muted leading-relaxed">
                  If an observer location does not have verified geographic coordinates (latitude and
                  longitude) or lies in extreme polar zones where the sun does not rise or set, we
                  refuse to show dummy or estimated clocks. Spiritual study thrives on truthfulness
                  (Satya), not fabricated precision.
                </p>
              </details>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-dharma-border/60">
            <div className="flex items-center gap-2 text-xs text-dharma-muted">
              <Compass className="h-4 w-4 text-saffron-600" />
              <span>Ready to dive deeper into festivals and practice?</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/festivals"
                className="tap-target inline-flex items-center text-xs font-bold text-saffron-700 dark:text-saffron-400 hover:underline"
              >
                Explore All Festivals &rarr;
              </Link>
              <span className="text-dharma-border">•</span>
              <Link
                href="/practice"
                className="tap-target inline-flex items-center text-xs font-bold text-saffron-700 dark:text-saffron-400 hover:underline"
              >
                Daily Sadhana Dashboard &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
