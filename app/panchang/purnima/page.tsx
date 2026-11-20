import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { PageHeader, SectionTitle } from '@/app/components/apple/PageHeader';
import { PanchangLimbSwitcher } from '@/app/panchang/components/PanchangLimbSwitcher';
import { JsonLd } from '@/app/components/JsonLd';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'पूर्णिमा तिथियाँ 2026–2028 · Purnima Dates & Satyanarayan Vrata',
  description:
    'वर्ष 2026, 2027 एवं 2028 की समस्त पूर्णिमा तिथियाँ, सत्यनारायण कथा, चंद्र दर्शन एवं वैदिक पूर्णिमा व्रत का शास्त्रीय महत्व।',
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
    title: 'पूर्णिमा तिथियाँ 2026–2028 · Purnima Dates & Satyanarayan Vrata — Dharma Granth',
    description:
      'समस्त पूर्णिमा तिथियाँ, सत्यनारायण कथा, चंद्र दर्शन एवं वैदिक पूर्णिमा व्रत का शास्त्रीय महत्व।',
    url: 'https://dharmagranth.dev/panchang/purnima/',
  },
};

const PURNIMA_DATES = [
  { name: 'कार्तिक पूर्णिमा (त्रिपुरारी पूर्णिमा / देव दीपावली)', month: 'कार्तिक', date: '24 नवंबर 2026', dateEn: '2026-11-24', highlight: true },
  { name: 'मार्गशीर्ष पूर्णिमा (दत्तात्रेय जयंती)', month: 'मार्गशीर्ष', date: '23 दिसंबर 2026', dateEn: '2026-12-23' },
  { name: 'पौष पूर्णिमा (शाकंभरी पूर्णिमा)', month: 'पौष', date: '22 जनवरी 2027', dateEn: '2027-01-22' },
  { name: 'माघ पूर्णिमा (माघी पूर्णिमा)', month: 'माघ', date: '20 फरवरी 2027', dateEn: '2027-02-20' },
  { name: 'फाल्गुन पूर्णिमा (होलिका दहन)', month: 'फाल्गुन', date: '22 मार्च 2027', dateEn: '2027-03-22', highlight: true },
  { name: 'चैत्र पूर्णिमा (हनुमान जयंती)', month: 'चैत्र', date: '21 अप्रैल 2027', dateEn: '2027-04-21', highlight: true },
  { name: 'वैशाख पूर्णिमा (बुद्ध पूर्णिमा / कूर्म जयंती)', month: 'वैशाख', date: '20 मई 2027', dateEn: '2027-05-20', highlight: true },
  { name: 'ज्येष्ठ पूर्णिमा (वट पूर्णिमा)', month: 'ज्येष्ठ', date: '19 जून 2027', dateEn: '2027-06-19' },
  { name: 'आषाढ़ पूर्णिमा (गुरु पूर्णिमा / व्यास पूर्णिमा)', month: 'आषाढ़', date: '18 जुलाई 2027', dateEn: '2027-07-18', highlight: true },
  { name: 'श्रावण पूर्णिमा (रक्षाबंधन / संस्कृत दिवस)', month: 'श्रावण', date: '17 अगस्त 2027', dateEn: '2027-08-17', highlight: true },
  { name: 'भाद्रपद पूर्णिमा (श्राद्ध पूर्णिमा)', month: 'भाद्रपद', date: '15 सितंबर 2027', dateEn: '2027-09-15' },
  { name: 'अश्विन पूर्णिमा (शरद पूर्णिमा / कोजागरी)', month: 'अश्विन', date: '14 अक्टूबर 2027', dateEn: '2027-10-14', highlight: true },
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
      name: 'पूर्णिमा तिथियाँ 2026–2028 · Purnima Dates & Satyanarayan Vrata',
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

function getIstTodayIso(): string {
  const ist = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  return `${ist.getFullYear()}-${String(ist.getMonth() + 1).padStart(2, '0')}-${String(ist.getDate()).padStart(2, '0')}`;
}

export default function PurnimaPage() {
  const todayIso = getIstTodayIso();
  const nextUpcomingDateEn = PURNIMA_DATES.find((d) => d.dateEn >= todayIso)?.dateEn;

  return (
    <main
      className="apple-scope panchang-scope panchang-limb relative min-h-screen bg-dharma-bg text-dharma-text pb-20 overflow-x-clip"
      data-limb="tithis"
    >
      <JsonLd data={JSON_LD} />

      {/* Luminous Lunar Aura / पूर्ण चंद्र आभा Backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-12 h-[540px] overflow-hidden select-none -z-10 opacity-70 dark:opacity-45"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-[740px] h-[420px] rounded-full bg-radial from-amber-400/25 via-saffron-500/12 to-transparent blur-3xl" />
        <div className="absolute right-[10%] top-20 w-[500px] h-[340px] rounded-full bg-radial from-indigo-500/22 via-lotus-400/12 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-gutter pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Panchang', href: '/panchang/' },
            { label: 'Purnima Dates' },
          ]}
        />
      </div>

      <PageHeader
        eyebrow="Full Moon & Satyanarayan Vrata"
        eyebrowHi="पूर्ण चंद्र एवं सत्यनारायण व्रत"
        title="Purnima Calendar (2026–2027)"
        titleHi="पूर्णिमा तिथियाँ व सत्यनारायण माहात्म्य"
        lead="उपनिषदों में चंद्रमा को मन का अधिष्ठाता देव (चन्द्रमा मनसो जातः) कहा गया है। पूर्णिमा के पूर्ण चंद्र का दर्शन आत्म-शांति व कृतज्ञता का पावन अवसर है।"
        width="wide"
      />

      <PanchangLimbSwitcher activeLimb="tithis" />

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-10 space-y-12">
        {/* Dates Table */}
        <section
          aria-labelledby="dates-heading"
          className="card-sacred relative rounded-2xl border border-dharma-border/80 bg-dharma-card/85 backdrop-blur-xl overflow-hidden shadow-xs"
        >
          <div className="p-5 sm:p-6 border-b border-dharma-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 id="dates-heading" className="font-serif text-xl font-bold text-dharma-text">
                आगामी पूर्णिमा तिथियाँ (2026–2027)
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
            {PURNIMA_DATES.map((item) => {
              const isNextUpcoming = item.dateEn === nextUpcomingDateEn;
              return (
                <div
                  key={item.dateEn}
                  className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition duration-200 hover:bg-surface-elevated/70 ${
                    isNextUpcoming
                      ? 'border-l-4 border-l-saffron-500 bg-saffron-500/[0.08] dark:bg-saffron-500/[0.14]'
                      : item.highlight
                        ? 'bg-amber-500/[0.04] dark:bg-amber-500/[0.08]'
                        : ''
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif font-bold text-sm sm:text-base text-dharma-text">
                        {item.name}
                      </span>
                      {isNextUpcoming && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron-500/15 border border-saffron-500/40 px-2.5 py-0.5 text-[11px] font-bold text-saffron-800 dark:text-saffron-200 shadow-xs">
                          <span className="relative flex size-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-saffron-400 opacity-75" />
                            <span className="relative inline-flex size-2 rounded-full bg-saffron-500" />
                          </span>
                          आगामी व्रत · Next Upcoming
                        </span>
                      )}
                      {item.highlight && (
                        <span className="text-2xs rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 font-bold text-amber-800 dark:text-amber-300">
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
              );
            })}
          </div>
        </section>

        {/* Sacred Shloka */}
        <section
          aria-labelledby="mantra-heading"
          className="card-sacred relative rounded-2xl border border-dharma-border/80 bg-gradient-to-br from-amber-50/40 via-dharma-card/80 to-dharma-bg/60 p-6 dark:from-amber-950/20 backdrop-blur-xl shadow-xs overflow-hidden"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-3">
            <BookOpen className="h-4 w-4" />
            <span>ऋग्वेद एवं पुरुष सूक्त संदर्भ</span>
          </div>
          <p lang="sa" className="font-devanagari text-lg sm:text-xl font-bold leading-relaxed text-dharma-text text-center py-3">
            चन्द्रमा मनसो जातश्चक्षोः सूर्यो अजायत ।<br />
            मुखादिन्द्रश्चाग्निश्च प्राणाद्वायुरजायत ॥
          </p>
          <p className="text-xs text-center text-dharma-muted max-w-xl mx-auto mt-2 leading-relaxed">
            पुरुष सूक्त (ऋग्वेद 10.90): विराट पुरुष के मन से चंद्रमा का प्रादुर्भाव हुआ। इसीलिए पूर्णिमा तिथि पर अंतःकरण की शांति और मन की निर्मलता के लिए विशेष ध्यान का विधान है।
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
            className="liquid-pill inline-flex min-h-11 items-center gap-1.5 rounded-full border border-dharma-border/80 bg-dharma-card/70 backdrop-blur-md px-4 py-2 text-xs font-semibold text-dharma-text hover:border-saffron-400 hover:text-saffron-700 transition"
          >
            &larr; मुख्य पंचांग
          </Link>
          <Link
            href="/festivals/guru-purnima/"
            className="liquid-pill inline-flex min-h-11 items-center gap-1.5 rounded-full border border-amber-600/40 bg-amber-500/10 backdrop-blur-md px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-500/20 transition dark:text-amber-300"
          >
            गुरु पूर्णिमा दर्शन &rarr;
          </Link>
        </section>
      </div>
    </main>
  );
}
