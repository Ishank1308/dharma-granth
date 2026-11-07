import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { SectionTitle } from '@/app/components/apple/PageHeader';
import { JsonLd } from '@/app/components/JsonLd';
import { BookOpen, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'अमावस्या तिथियाँ 2026–2028 · Amavasya Dates, Pitru Tarpan & Shanti',
  description:
    'समस्त अमावस्या तिथियाँ, पितृ तर्पण, मौनी अमावस्या, शनिश्चरी अमावस्या एवं आत्म-चिंतन का शास्त्रीय विधान।',
  keywords: [
    'अमावस्या तिथियाँ',
    'Amavasya dates 2026',
    'Amavasya dates 2027',
    'आज अमावस्या कब है',
    'सोमवती अमावस्या',
    'मौनी अमावस्या',
    'पितृ तर्पण',
    'सर्वपितृ अमावस्या',
    'Dharma Granth Panchang',
  ],
  alternates: { canonical: '/panchang/amavasya/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'अमावस्या तिथियाँ 2026–2028 · Amavasya Dates, Pitru Tarpan & Shanti — Dharma Granth',
    description:
      'समस्त अमावस्या तिथियाँ, पितृ तर्पण, मौनी अमावस्या, शनिश्चरी अमावस्या एवं आत्म-चिंतन का शास्त्रीय विधान।',
    url: 'https://dharmagranth.dev/panchang/amavasya/',
  },
};

const AMAVASYA_DATES = [
  { name: 'कार्तिक अमावस्या (दीपावली / लक्ष्मी पूजन)', month: 'कार्तिक', date: '08 नवंबर 2026', dateEn: '2026-11-08', highlight: true },
  { name: 'मार्गशीर्ष अमावस्या (भौमवती अमावस्या)', month: 'मार्गशीर्ष', date: '08 दिसंबर 2026', dateEn: '2026-12-08' },
  { name: 'पौष अमावस्या (पितृ श्राद्ध अमावस्या)', month: 'पौष', date: '07 जनवरी 2027', dateEn: '2027-01-07' },
  { name: 'माघ अमावस्या (मौनी अमावस्या / कुंभ स्नान)', month: 'माघ', date: '05 फरवरी 2027', dateEn: '2027-02-05', highlight: true },
  { name: 'फाल्गुन अमावस्या (महाशिवरात्रि के पूर्व)', month: 'फाल्गुन', date: '07 मार्च 2027', dateEn: '2027-03-07' },
  { name: 'चैत्र अमावस्या (चैत्र नवरात्रि पूर्व)', month: 'चैत्र', date: '06 अप्रैल 2027', dateEn: '2027-04-06' },
  { name: 'वैशाख अमावस्या (शनि जयंती)', month: 'वैशाख', date: '05 मई 2027', dateEn: '2027-05-05', highlight: true },
  { name: 'ज्येष्ठ अमावस्या (वट सावित्री अमावस्या)', month: 'ज्येष्ठ', date: '04 जून 2027', dateEn: '2027-06-04' },
  { name: 'आषाढ़ अमावस्या (हलहारिणी अमावस्या)', month: 'आषाढ़', date: '03 जुलाई 2027', dateEn: '2027-07-03' },
  { name: 'श्रावण अमावस्या (हरियाली अमावस्या)', month: 'श्रावण', date: '02 अगस्त 2027', dateEn: '2027-08-02', highlight: true },
  { name: 'भाद्रपद अमावस्या (कुशोत्पाटिनी अमावस्या)', month: 'भाद्रपद', date: '31 अगस्त 2027', dateEn: '2027-08-31' },
  { name: 'अश्विन अमावस्या (सर्वपितृ अमावस्या / महालया)', month: 'अश्विन', date: '29 सितंबर 2027', dateEn: '2027-09-29', highlight: true },
];

const FAQS = [
  {
    q: 'अमावस्या तिथि पर पितृ तर्पण और दान का क्या शास्त्रीय महत्व है?',
    a: 'गरुड़ पुराण और मनुस्मृति के अनुसार अमावस्या तिथि पितृलोक के अधिपति अर्यमा और पूर्वजों को समर्पित है। इस दिन तर्पण, जलदान और ब्राह्मण/निर्धन को अन्नदान करने से पूर्वज तृप्त होते हैं और परिवार में शांति व समृद्धि का वास होता है।',
  },
  {
    q: 'मौनी अमावस्या और सोमवती अमावस्या की क्या विशेषता है?',
    a: 'माघ मास की मौनी अमावस्या पर वाणी पर संयम रखकर मौन व्रत और पवित्र संगम/गंगा में स्नान का विधान है। जब अमावस्या सोमवार को पड़ती है, तो उसे "सोमवती अमावस्या" कहा जाता है, जो अश्वत्थ (पीपल) वृक्ष की परिक्रमा और अखंड सौभाग्य के लिए विशेष फलदायी है।',
  },
];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://dharmagranth.dev/panchang/amavasya/#webpage',
      url: 'https://dharmagranth.dev/panchang/amavasya/',
      name: 'अमावस्या तिथियाँ 2026–2028 · Amavasya Dates, Pitru Tarpan & Shanti',
      description:
        'समस्त अमावस्या तिथियाँ, पितृ तर्पण, मौनी अमावस्या, शनिश्चरी अमावस्या एवं आत्म-चिंतन का शास्त्रीय विधान।',
      inLanguage: ['hi', 'sa', 'en'],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://dharmagranth.dev/panchang/amavasya/#faq',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

export default function AmavasyaPage() {
  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text pb-20">
      <JsonLd data={JSON_LD} />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Panchang', href: '/panchang/' },
          { label: 'Amavasya Dates' },
        ]}
      />

      {/* Hero Header */}
      <section className="border-b border-dharma-border bg-gradient-to-b from-stone-100/70 via-dharma-card to-dharma-bg py-12 px-4 sm:px-6 dark:from-stone-900/40">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-stone-700 bg-stone-200/80 px-3.5 py-1.5 rounded-full dark:bg-stone-800 dark:text-stone-300 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>पितृ तर्पण एवं मौन साधना</span>
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-dharma-text">
            अमावस्या तिथियाँ व पितृ तर्पण माहात्म्य
          </h1>
          <p className="mt-2 text-base sm:text-lg text-stone-700 dark:text-stone-300 font-serif">
            Amavasya Calendar: New Moon Dates, Ancestral Tarpan &amp; Silence
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-dharma-muted">
            अमावस्या वह तिथि है जब सूर्य और चंद्रमा एक ही राशि में स्थित होते हैं। यह बाह्य चकाचौंध से हटकर अंतर्मुखी होने और पूर्वजों के प्रति कृतज्ञता ज्ञापित करने का पावन दिन है।
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-10 space-y-12">
        {/* Dates Table */}
        <section aria-labelledby="dates-heading" className="rounded-2xl border border-dharma-border bg-dharma-card overflow-hidden shadow-xs">
          <div className="p-5 sm:p-6 border-b border-dharma-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 id="dates-heading" className="font-serif text-xl font-bold text-dharma-text">
                आगामी अमावस्या तिथियाँ (2026–2027)
              </h2>
              <p className="text-xs text-dharma-muted mt-0.5">
                पितृ श्राद्ध, तर्पण एवं स्नान-दान पर्व
              </p>
            </div>
            <Link
              href="/panchang/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-saffron-700 hover:text-saffron-800 dark:text-saffron-300"
            >
              दैनिक पंचांग देखें &rarr;
            </Link>
          </div>

          <div className="divide-y divide-dharma-border/60">
            {AMAVASYA_DATES.map((item) => (
              <div
                key={item.dateEn}
                className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition hover:bg-stone-50/50 dark:hover:bg-stone-900/30 ${
                  item.highlight ? 'bg-stone-50/60 dark:bg-stone-900/40' : ''
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm sm:text-base text-dharma-text">
                      {item.name}
                    </span>
                    {item.highlight && (
                      <span className="text-2xs rounded-full bg-stone-200 px-2 py-0.5 font-bold text-stone-800 dark:bg-stone-800 dark:text-stone-300">
                        प्रमुख
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-dharma-muted mt-0.5">
                    {item.month} मास अमावस्या
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="font-mono text-sm font-semibold text-stone-800 dark:text-stone-300 block">
                    {item.date}
                  </span>
                  <span className="text-2xs text-dharma-muted">{item.dateEn}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sacred Shloka */}
        <section aria-labelledby="mantra-heading" className="rounded-2xl border border-dharma-border bg-gradient-to-br from-stone-50/50 via-dharma-card to-dharma-bg p-6 dark:from-stone-900/30 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-400 mb-3">
            <BookOpen className="h-4 w-4" />
            <span>पितृ गायत्री एवं तर्पण मंत्र</span>
          </div>
          <p lang="sa" className="font-devanagari text-lg sm:text-xl font-bold leading-relaxed text-dharma-text text-center py-3">
            ॐ देवताभ्यः पितृभ्यश्च महायोगिभ्य एव च ।<br />
            नमः स्वधायै स्वाहायै नित्यमेव नमो नमः ॥
          </p>
          <p className="text-xs text-center text-dharma-muted max-w-xl mx-auto mt-2 leading-relaxed">
            गरुड़ पुराण: &quot;जो प्राणी अमावस्या पर देवताओं, पितरों और महायोगियों को नमन करते हुए जल-तिल से तर्पण करते हैं, उनके कुल में पितृ दोष की शांति होती है।&quot;
          </p>
        </section>

        {/* FAQ Accordion */}
        <section aria-labelledby="faq-heading">
          <SectionTitle id="faq-heading" title="जिज्ञासा एवं समाधान" titleHi="FAQ" />
          <div className="apple-group mt-6">
            {FAQS.map((f) => (
              <details key={f.q} className="apple-row group block !py-0 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex min-h-[52px] cursor-pointer items-center justify-between gap-3 text-callout font-medium text-dharma-text">
                  <span>{f.q}</span>
                  <span aria-hidden="true" className="apple-chevron transition group-open:rotate-90">›</span>
                </summary>
                <p className="pb-4 text-subhead leading-relaxed text-dharma-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related Hub Navigation */}
        <section className="flex flex-wrap gap-4 pt-6 border-t border-dharma-border">
          <Link
            href="/panchang/"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-card px-4 py-2 text-xs font-semibold text-dharma-text hover:border-saffron-400 transition"
          >
            &larr; मुख्य पंचांग
          </Link>
          <Link
            href="/festivals/diwali/"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-amber-600/40 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition dark:bg-amber-950/40 dark:text-amber-300"
          >
            दीपावली (कार्तिक अमावस्या) दर्शन &rarr;
          </Link>
        </section>
      </div>
    </main>
  );
}
