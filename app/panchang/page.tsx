import React from 'react';
import Link from 'next/link';
import { PanchangCalendar } from '@/app/components/PanchangCalendar';
import { PanchangCosmos } from '@/app/components/cosmos/PanchangCosmos';
import { SectionTitle } from '@/app/components/apple/PageHeader';

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
            <Link href="/practice/" className="inline-flex min-h-11 items-center text-dharma-saffron hover:underline">
              <span>Daily practice</span>&nbsp;<span lang="hi" className="font-devanagari">साधना</span>&nbsp;<span aria-hidden="true">›</span>
            </Link>
          </p>
        </section>
      </section>
    </main>
  );
}
