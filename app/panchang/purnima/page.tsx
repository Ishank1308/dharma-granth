import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { SectionTitle } from '@/app/components/apple/PageHeader';
import { JsonLd } from '@/app/components/JsonLd';
import { BookOpen, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'पूर्णिमा तिथियाँ २०२६–२०२८ · Purnima Dates & Satyanarayan Vrata',
  description:
    'वर्ष २०२६, २०२७ एवं २०२८ की समस्त पूर्णिमा तिथियाँ, सत्यनारायण कथा, चंद्र दर्शन एवं वैदिक पूर्णिमा व्रत का शास्त्रीय महत्व।',
  keywords: [
    'पूर्णिमा तिथियाँ',
    'Purnima dates 2026',
    'Purnima dates 2027',
    'आज पूर्णिमा कब है',
    'सत्यनारायण व्रत',
    'कार्तिक पूर्णिमा',
    'शरद पूर्णिमा',
    'गुरु पूर्णिमा',
    'Dharma Granth Panchang',
  ],
  alternates: { canonical: '/panchang/purnima/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'पूर्णिमा तिथियाँ २०२६–२०२८ · Purnima Dates & Satyanarayan Vrata — Dharma Granth',
    description:
      'समस्त पूर्णिमा तिथियाँ, सत्यनारायण कथा, चंद्र दर्शन एवं वैदिक पूर्णिमा व्रत का शास्त्रीय महत्व।',
    url: 'https://dharmagranth.dev/panchang/purnima/',
  },
};

const PURNIMA_DATES = [
  { name: 'कार्तिक पूर्णिमा (त्रिपुरारी पूर्णिमा / देव दीपावली)', month: 'कार्तिक', date: '२४ नवंबर २०२६', dateEn: '2026-11-24', highlight: true },
  { name: 'मार्गशीर्ष पूर्णिमा (दत्तात्रेय जयंती)', month: 'मार्गशीर्ष', date: '२३ दिसंबर २०२६', dateEn: '2026-12-23' },
  { name: 'पौष पूर्णिमा (शाकंभरी पूर्णिमा)', month: 'पौष', date: '२२ जनवरी २०२७', dateEn: '2027-01-22' },
  { name: 'माघ पूर्णिमा (माघी पूर्णिमा)', month: 'माघ', date: '२० फरवरी २०२७', dateEn: '2027-02-20' },
  { name: 'फाल्गुन पूर्णिमा (होलिका दहन)', month: 'फाल्गुन', date: '२२ मार्च २०२७', dateEn: '2027-03-22', highlight: true },
  { name: 'चैत्र पूर्णिमा (हनुमान जयंती)', month: 'चैत्र', date: '२१ अप्रैल २०२७', dateEn: '2027-04-21', highlight: true },
  { name: 'वैशाख पूर्णिमा (बुद्ध पूर्णिमा / कूर्म जयंती)', month: 'वैशाख', date: '२० मई २०२७', dateEn: '2027-05-20', highlight: true },
  { name: 'ज्येष्ठ पूर्णिमा (वट पूर्णिमा)', month: 'ज्येष्ठ', date: '१९ जून २०२७', dateEn: '2027-06-19' },
  { name: 'आषाढ़ पूर्णिमा (गुरु पूर्णिमा / व्यास पूर्णिमा)', month: 'आषाढ़', date: '१८ जुलाई २०२७', dateEn: '2027-07-18', highlight: true },
  { name: 'श्रावण पूर्णिमा (रक्षाबंधन / संस्कृत दिवस)', month: 'श्रावण', date: '१७ अगस्त २०२७', dateEn: '2027-08-17', highlight: true },
  { name: 'भाद्रपद पूर्णिमा (श्राद्ध पूर्णिमा)', month: 'भाद्रपद', date: '१५ सितंबर २०२७', dateEn: '2027-09-15' },
  { name: 'अश्विन पूर्णिमा (शरद पूर्णिमा / कोजागरी)', month: 'अश्विन', date: '१४ अक्टूबर २०२७', dateEn: '2027-10-14', highlight: true },
];

const FAQS = [
  {
    q: 'पूर्णिमा व्रत और सत्यनारायण पूजा का क्या महत्व है?',
    a: 'स्कंद पुराण के रेवा खंड के अनुसार पूर्णिमा के दिन भगवान श्री सत्यनारायण (विष्णु) की कथा व पूजन से मनुष्य के समस्त क्लेश दूर होते हैं। पूर्णिमा पर चंद्रमा अपनी समस्त सोलह कलाओं से पूर्ण होता है, जिससे मन और जल-तत्त्व में पूर्ण सात्विकता और शांति का संचार होता है।',
  },
  {
    q: 'शरद पूर्णिमा और कार्तिक पूर्णिमा में क्या विशेषता है?',
    a: 'शरद पूर्णिमा पर चंद्रमा से अमृत-तुल्य किरणों का वर्षण माना जाता है, इसलिए रात्रि में खीर रखने का विधान है। कार्तिक पूर्णिमा पर भगवान शिव ने त्रिपुरासुर का वध किया था, जिसे "त्रिपुरारी पूर्णिमा" और "देव दीपावली" के रूप में काशी में दीपदान करके मनाया जाता है।',
  },
];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://dharmagranth.dev/panchang/purnima/#webpage',
      url: 'https://dharmagranth.dev/panchang/purnima/',
      name: 'पूर्णिमा तिथियाँ २०२६–२०२८ · Purnima Dates & Satyanarayan Vrata',
      description:
        'समस्त पूर्णिमा तिथियाँ, सत्यनारायण कथा, चंद्र दर्शन एवं वैदिक पूर्णिमा व्रत का शास्त्रीय महत्व।',
      inLanguage: ['hi', 'sa', 'en'],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://dharmagranth.dev/panchang/purnima/#faq',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

export default function PurnimaPage() {
  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text pb-20">
      <JsonLd data={JSON_LD} />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Panchang', href: '/panchang/' },
          { label: 'Purnima Dates' },
        ]}
      />

      {/* Hero Header */}
      <section className="border-b border-dharma-border bg-gradient-to-b from-amber-50/60 via-dharma-card to-dharma-bg py-12 px-4 sm:px-6 dark:from-amber-950/20">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100/80 px-3.5 py-1.5 rounded-full dark:bg-amber-900/40 dark:text-amber-300 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>पूर्ण चंद्र एवं सत्यनारायण व्रत</span>
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-dharma-text">
            पूर्णिमा तिथियाँ व सत्यनारायण माहात्म्य
          </h1>
          <p className="mt-2 text-base sm:text-lg text-amber-800 dark:text-amber-300 font-serif">
            Purnima Calendar: Full Moon Dates, Katha Vidhi &amp; Lunar Wisdom
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-dharma-muted">
            उपनिषदों में चंद्रमा को मन का अधिष्ठाता देव (चन्द्रमा मनसो जातः) कहा गया है। पूर्णिमा के पूर्ण चंद्र का दर्शन आत्म-शांति व कृतज्ञता का पावन अवसर है।
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
                आगामी पूर्णिमा तिथियाँ (२०२६–२०२७)
              </h2>
              <p className="text-xs text-dharma-muted mt-0.5">
                सत्यनारायण व्रत, दीपदान व चंद्र दर्शन
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
            {PURNIMA_DATES.map((item) => (
              <div
                key={item.dateEn}
                className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition hover:bg-amber-50/30 dark:hover:bg-amber-950/20 ${
                  item.highlight ? 'bg-amber-50/40 dark:bg-amber-950/30' : ''
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm sm:text-base text-dharma-text">
                      {item.name}
                    </span>
                    {item.highlight && (
                      <span className="text-2xs rounded-full bg-amber-100 px-2 py-0.5 font-bold text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                        प्रमुख
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-dharma-muted mt-0.5">
                    {item.month} मास पूर्णिमा
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="font-mono text-sm font-semibold text-amber-800 dark:text-amber-300 block">
                    {item.date}
                  </span>
                  <span className="text-2xs text-dharma-muted">{item.dateEn}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sacred Shloka */}
        <section aria-labelledby="mantra-heading" className="rounded-2xl border border-dharma-border bg-gradient-to-br from-amber-50/50 via-dharma-card to-dharma-bg p-6 dark:from-amber-950/20 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-3">
            <BookOpen className="h-4 w-4" />
            <span>ऋग्वेद एवं पुरुष सूक्त संदर्भ</span>
          </div>
          <p lang="sa" className="font-devanagari text-lg sm:text-xl font-bold leading-relaxed text-dharma-text text-center py-3">
            चन्द्रमा मनसो जातश्चक्षोः सूर्यो अजायत ।<br />
            मुखादिन्द्रश्चाग्निश्च प्राणाद्वायुरजायत ॥
          </p>
          <p className="text-xs text-center text-dharma-muted max-w-xl mx-auto mt-2 leading-relaxed">
            पुरुष सूक्त (ऋग्वेद १०.९०): विराट पुरुष के मन से चंद्रमा का प्रादुर्भाव हुआ। इसीलिए पूर्णिमा तिथि पर अंतःकरण की शांति और मन की निर्मलता के लिए विशेष ध्यान का विधान है।
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
            href="/festivals/guru-purnima/"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-amber-600/40 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition dark:bg-amber-950/40 dark:text-amber-300"
          >
            गुरु पूर्णिमा दर्शन &rarr;
          </Link>
        </section>
      </div>
    </main>
  );
}
