import React from 'react';
import Link from 'next/link';
import { PanchangCalendar } from '@/app/components/PanchangCalendar';
import { PanchangCosmos } from '@/app/components/cosmos/PanchangCosmos';
import { SectionTitle } from '@/app/components/apple/PageHeader';
import { Star, ArrowRight, Moon, Sun, Layers, Calendar, Clock } from 'lucide-react';

const WHY = [
  {
    title: 'Self-study',
    text: 'The mind moves between outward growth in the bright fortnight (Śukla) and quiet taking-in during the dark one (Kṛṣṇa). Reading plans that follow these rhythms come easier.',
  },
  {
    title: 'Scripture in context',
    text: 'The Mahabharata and the Ramayana name nakṣatras, tithis and muhūrtas for their great events. Knowing the calendar makes those passages vivid.',
  },
  {
    title: 'Honesty over prediction',
    text: 'We do not calculate ritual muhūrtas or fortunes. Ritual decisions belong to family custom, the temple and a trusted pandit.',
  },
];

const FAQ = [
  {
    q: 'Why does my paper calendar show a different tithi end time?',
    a: 'Printed almanacs such as Kalnirnay or the Jagannath Panjika are set for one city. A hundred kilometres east or west, sunrise moves by minutes, which can change the tithi on days with a tight morning boundary.',
  },
  {
    q: 'What is udaya tithi, and why does it name the day?',
    a: 'In the Smārta tradition the tithi current at local sunrise governs that solar day for fasts and vratas, even if it ends ten minutes later.',
  },
  {
    q: 'Why does sunrise say “Unavailable” for some places?',
    a: 'Without verified coordinates, or in polar regions where the sun does not rise or set, we show nothing rather than an invented time. Study rests on truthfulness (satya), not false precision.',
  },
];

export default function PanchangPage() {
  return (
    <main data-cosmos className="apple-scope min-h-screen bg-dharma-bg">
      {/* ─── THE NIGHT SKY: Kāla-chakra and the five limbs of time ───────── */}
      <PanchangCosmos />

      {/* ─── MAIN CALENDAR INTERFACE ──────────────────────────────────────── */}
      <section className="relative mx-auto max-w-6xl px-gutter -mt-6 sm:-mt-8 pb-16 z-10">
        <PanchangCalendar />

        {/* ─── FULL MONTHLY FESTIVAL CALENDAR BANNER ─────────────────────── */}
        <div className="mt-8 rounded-2xl border-2 border-saffron-400/40 bg-gradient-to-r from-saffron-500/10 via-amber-500/10 to-orange-500/10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-caption-1 font-bold uppercase tracking-wider text-dharma-saffron">
              <Calendar className="w-4 h-4" />
              <span>मासिक पंचांग व पर्व कैलेंडर · 2026–2028</span>
            </span>
            <h3 className="text-title-2 font-bold text-dharma-text">
              Interactive Solar & Lunar Festival Calendar
            </h3>
            <p className="text-footnote text-dharma-muted leading-relaxed">
              Explore month-by-month calendar grids for 2026, 2027, and 2028 with daily Udaya Tithis, Nakshatras, sacred Ekadashis, Pradosha fasts, Purnima, Amavasya, and major Hindu festivals.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/panchang/calendar/"
              className="inline-flex items-center gap-2 rounded-xl bg-dharma-saffron hover:bg-saffron-700 text-white px-5 py-3 text-footnote font-semibold shadow-md transition-all hover:scale-[1.02]"
            >
              <span>मासिक कैलेंडर खोलें</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ─── SACRED LUNAR OBSERVANCES & VRATAS ──────────────────────────── */}
        <section aria-labelledby="panchang-vratas" className="mt-16">
          <SectionTitle
            id="panchang-vratas"
            size="title-2"
            eyebrow="Tithi & Vrata Observances"
            eyebrowHi="पवित्र तिथियाँ व व्रत"
            title="Sacred Lunar Observances"
          />
          <p className="max-w-text text-body leading-relaxed text-dharma-muted">
            Classical scriptural guidelines, authentic astronomical dates, and spiritual contemplation for key lunar days.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                href: '/panchang/ekadashi/',
                title: 'एकादशी व्रत (Ekadashi)',
                titleEn: '11th Lunar Day',
                desc: 'पद्म पुराण अनुसार मन व इंद्रिय शुद्धि — 2026–2028 की समस्त तिथियाँ व पारण समय।',
                icon: '🌿',
                badge: 'हरि-वासर',
              },
              {
                href: '/panchang/pradosh/',
                title: 'प्रदोष व्रत (Pradosh Vrat)',
                titleEn: '13th Twilight Japa',
                desc: 'त्रयोदशी तिथि पर शिव-पूजा — सोम, भौम व शनि प्रदोष के शुभ मुहूर्त व महात्म्य।',
                icon: '🔱',
                badge: 'शिव सायुज्य',
              },
              {
                href: '/panchang/purnima/',
                title: 'पूर्णिमा तिथियाँ (Purnima)',
                titleEn: 'Full Moon Calendar',
                desc: 'सत्यनारायण व्रत, शरद व कार्तिक पूर्णिमा, व्यास पूजा एवं चंद्र दर्शन की तिथियाँ।',
                icon: '🌕',
                badge: 'पूर्ण चंद्र',
              },
              {
                href: '/panchang/amavasya/',
                title: 'अमावस्या तिथियाँ (Amavasya)',
                titleEn: 'New Moon Calendar',
                desc: 'पितृ तर्पण, मौनी व सोमवती अमावस्या, और अंतर्मुखी आत्म-चिंतन का विधान।',
                icon: '🌑',
                badge: 'पितृ कार्य',
              },
            ].map((v) => (
              <Link
                key={v.href}
                href={v.href}
                className="group flex flex-col justify-between rounded-2xl border border-dharma-border bg-dharma-card p-5 transition-all hover:border-saffron-400 hover:shadow-md hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between text-2xs mb-3">
                    <span className="text-xl">{v.icon}</span>
                    <span className="rounded-full bg-saffron-100/80 px-2 py-0.5 font-bold text-saffron-800 dark:bg-saffron-900/40 dark:text-saffron-300">
                      {v.badge}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-dharma-text group-hover:text-saffron-700 transition">
                    {v.title}
                  </h3>
                  <p className="text-2xs text-saffron-700 dark:text-saffron-400 font-semibold mb-1.5">
                    {v.titleEn}
                  </p>
                  <p className="text-xs text-dharma-muted leading-relaxed">
                    {v.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-end text-xs font-semibold text-saffron-700 group-hover:translate-x-1 transition-transform">
                  तिथियाँ देखें &rarr;
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* 1. 16 Tithis Master Directory Banner */}
            <div className="rounded-2xl border border-dharma-border bg-gradient-to-br from-amber-950/20 via-saffron-950/15 to-transparent p-5 flex flex-col justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                  <Moon className="w-3.5 h-3.5" />
                  <span>१. तिथि · 16 Lunar Days</span>
                </span>
                <h3 className="font-serif text-lg font-bold text-dharma-text">
                  16 Tithis (पंच-तिथि वर्ग)
                </h3>
                <p className="text-xs text-dharma-muted">
                  Pratipada to Purnima &amp; Amavasya — Nanda, Bhadra, Jaya, Rikta, and Poorna classes.
                </p>
              </div>
              <div>
                <Link
                  href="/panchang/tithis/"
                  className="inline-flex items-center gap-2 rounded-xl bg-saffron-700 hover:bg-saffron-800 text-white px-3.5 py-2 text-xs font-semibold transition"
                >
                  <span>Explore Tithis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 2. 7 Varas Master Directory Banner */}
            <div className="rounded-2xl border border-dharma-border bg-gradient-to-br from-orange-950/20 via-saffron-950/15 to-transparent p-5 flex flex-col justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>२. वार · 7 Weekdays</span>
                </span>
                <h3 className="font-serif text-lg font-bold text-dharma-text">
                  7 Varas (सप्त वासर)
                </h3>
                <p className="text-xs text-dharma-muted">
                  Ravivara to Shanivara — presiding Graha lords, Hora cycles, elements, and sacred fasts.
                </p>
              </div>
              <div>
                <Link
                  href="/panchang/varas/"
                  className="inline-flex items-center gap-2 rounded-xl bg-saffron-700 hover:bg-saffron-800 text-white px-3.5 py-2 text-xs font-semibold transition"
                >
                  <span>Explore Varas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 3. 27 Nakshatras Master Directory Banner */}
            <div className="rounded-2xl border border-dharma-border bg-gradient-to-br from-indigo-950/20 via-saffron-950/15 to-transparent p-5 flex flex-col justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                  <Star className="w-3.5 h-3.5" />
                  <span>३. नक्षत्र · 27 Asterisms</span>
                </span>
                <h3 className="font-serif text-lg font-bold text-dharma-text">
                  27 Nakshatras (२७ नक्षत्र)
                </h3>
                <p className="text-xs text-dharma-muted">
                  From Ashwini to Revati — presiding Vedic deities, Sukta citations, and contemplation.
                </p>
              </div>
              <div>
                <Link
                  href="/panchang/nakshatras/"
                  className="inline-flex items-center gap-2 rounded-xl bg-saffron-700 hover:bg-saffron-800 text-white px-3.5 py-2 text-xs font-semibold transition"
                >
                  <span>Explore Nakshatras</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 4. 27 Nitya Yogas Master Directory Banner */}
            <div className="rounded-2xl border border-dharma-border bg-gradient-to-br from-emerald-950/20 via-saffron-950/15 to-transparent p-5 flex flex-col justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                  <Sun className="w-3.5 h-3.5" />
                  <span>४. योग · 27 Nitya Yogas</span>
                </span>
                <h3 className="font-serif text-lg font-bold text-dharma-text">
                  27 Yogas (२७ नित्य योग)
                </h3>
                <p className="text-xs text-dharma-muted">
                  Additive solar-lunar arcs (Vishkambha to Vaidhriti) — auspicious and reflective states.
                </p>
              </div>
              <div>
                <Link
                  href="/panchang/yogas/"
                  className="inline-flex items-center gap-2 rounded-xl bg-saffron-700 hover:bg-saffron-800 text-white px-3.5 py-2 text-xs font-semibold transition"
                >
                  <span>Explore Yogas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 5. 11 Karanas Master Directory Banner */}
            <div className="rounded-2xl border border-dharma-border bg-gradient-to-br from-rose-950/20 via-saffron-950/15 to-transparent p-5 flex flex-col justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                  <Layers className="w-3.5 h-3.5" />
                  <span>५. करण · 11 Half-Tithis</span>
                </span>
                <h3 className="font-serif text-lg font-bold text-dharma-text">
                  11 Karanas (११ करण)
                </h3>
                <p className="text-xs text-dharma-muted">
                  7 Movable (Chara) &amp; 4 Fixed (Sthira) half-tithis, including the rules of Vishti (Bhadra).
                </p>
              </div>
              <div>
                <Link
                  href="/panchang/karanas/"
                  className="inline-flex items-center gap-2 rounded-xl bg-saffron-700 hover:bg-saffron-800 text-white px-3.5 py-2 text-xs font-semibold transition"
                >
                  <span>Explore Karanas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* ─── SOLAR VRATAS & SAURAMANA FEATURE CARD ─────────────────────── */}
          <div className="mt-8 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/20 px-3 py-0.5 text-xs font-bold text-amber-900 dark:text-amber-200">
                  <Sun className="w-3.5 h-3.5" />
                  <span>Sauramana Liturgy · सौर व्रत एवं अर्घ्य विधान</span>
                </span>
                <span className="text-xs text-dharma-muted">
                  Chhath Puja · Ratha Saptami · Makar Sankranti · Bhanu Saptami
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-dharma-text">
                Sacred Solar Vratas &amp; Arghya Vidhi
              </h3>
              <p className="text-xs sm:text-sm text-dharma-muted max-w-2xl leading-relaxed">
                Explore liturgical guides, Vedic Arghya mantras, and astronomical coordinates for the Sun-god’s greatest festivals, including the four-day Chhath Puja sequence.
              </p>
            </div>
            <div className="shrink-0 self-start md:self-center">
              <Link
                href="/panchang/solar-vratas/"
                className="inline-flex items-center gap-2 rounded-2xl bg-saffron-600 hover:bg-saffron-700 text-white px-5 py-3 text-sm font-bold transition shadow-xs"
              >
                <span>Explore Solar Vratas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── WHY THE FIVE LIMBS ─────────────────────────────────────────── */}
        <section aria-labelledby="panchang-why" className="mt-20">
          <SectionTitle
            id="panchang-why"
            size="title-1"
            eyebrow="The Vedic view of time"
            eyebrowHi="पञ्चाङ्ग तत्त्व दर्शन"
            title="Why learn the five limbs of time"
          />
          <p className="max-w-text text-body leading-relaxed text-dharma-muted">
            In Vedic thought time (<em>Kāla</em>) is a rhythm, not a ticker: the play between the Sun (vitality,{' '}
            <em>Prāṇa</em>) and the Moon (reflective mind, <em>Manas</em>).
          </p>

          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {WHY.map((w, i) => (
              <li key={w.title}>
                <p className="text-footnote tabular-nums text-dharma-muted">{i + 1}</p>
                <h3 className="mt-1 text-title-3 font-semibold text-dharma-text">{w.title}</h3>
                <p className="mt-1.5 text-subhead leading-relaxed text-dharma-muted">{w.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ─── QUESTIONS ───────────────────────────────────────────────────── */}
        <section aria-labelledby="panchang-faq" className="mt-20">
          <SectionTitle id="panchang-faq" title="Questions" titleHi="जिज्ञासा" />
          <div className="apple-group">
            {FAQ.map((f) => (
              <details key={f.q} className="apple-row group block !py-0 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex min-h-[52px] cursor-pointer items-center justify-between gap-3 text-callout text-dharma-text">
                  <span>{f.q}</span>
                  <span aria-hidden="true" className="apple-chevron transition group-open:rotate-90">›</span>
                </summary>
                <p className="pb-4 text-subhead leading-relaxed text-dharma-muted">{f.a}</p>
              </details>
            ))}
          </div>

          <p className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-body">
            <Link href="/festivals/" className="inline-flex min-h-11 items-center text-dharma-saffron hover:underline">
              <span>Festivals</span>&nbsp;<span lang="hi" className="font-devanagari">उत्सव</span>&nbsp;<span aria-hidden="true">›</span>
            </Link>
            <Link href="/panchang/solar-vratas/" className="inline-flex min-h-11 items-center text-dharma-saffron hover:underline">
              <span>Solar Vratas</span>&nbsp;<span lang="hi" className="font-devanagari">सौर व्रत</span>&nbsp;<span aria-hidden="true">›</span>
            </Link>
            <Link href="/practice/" className="inline-flex min-h-11 items-center text-dharma-saffron hover:underline">
              <span>Daily practice</span>&nbsp;<span lang="hi" className="font-devanagari">साधना</span>&nbsp;<span aria-hidden="true">›</span>
            </Link>
          </p>
        </section>
      </section>
    </main>
  );
}
