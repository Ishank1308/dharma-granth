import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { PageHeader, SectionTitle } from '@/app/components/apple/PageHeader';
import { PanchangLimbSwitcher } from '@/app/panchang/components/PanchangLimbSwitcher';
import { VrataDatesTable, type VrataDateItem } from '@/app/panchang/components/VrataDatesTable';
import { JsonLd } from '@/app/components/JsonLd';
import { BookOpen, Sparkles, HeartHandshake, Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'अमावस्या तिथियाँ 2026–2028 · Amavasya Dates, Pitru Tarpan & Shanti',
  description:
    'वर्ष 2026, 2027 एवं 2028 की समस्त अमावस्या तिथियाँ, पितृ तर्पण, मौनी अमावस्या, सोमवती अमावस्या एवं आत्म-चिंतन का शास्त्रीय विधान।',
  keywords: [
    'अमावस्या तिथियाँ',
    'Amavasya dates 2026',
    'Amavasya dates 2027',
    'Amavasya dates 2028',
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
      'वर्ष 2026, 2027 एवं 2028 की समस्त अमावस्या तिथियाँ, पितृ तर्पण, मौनी अमावस्या, सोमवती अमावस्या एवं आत्म-चिंतन का शास्त्रीय विधान।',
    url: 'https://dharmagranth.dev/panchang/amavasya/',
  },
};

const AMAVASYA_DATES: VrataDateItem[] = [
  // 2026
  { name: 'कार्तिक अमावस्या (दीपावली / महालक्ष्मी पूजन)', month: 'कार्तिक', date: '08 नवंबर 2026', dateEn: '2026-11-08', highlight: true },
  { name: 'मार्गशीर्ष अमावस्या (भौमवती अमावस्या)', month: 'मार्गशीर्ष', date: '08 दिसंबर 2026', dateEn: '2026-12-08' },
  // 2027
  { name: 'पौष अमावस्या (पितृ श्राद्ध अमावस्या)', month: 'पौष', date: '07 जनवरी 2027', dateEn: '2027-01-07' },
  { name: 'माघ अमावस्या (मौनी अमावस्या / कुंभ स्नान)', month: 'माघ', date: '05 फरवरी 2027', dateEn: '2027-02-05', highlight: true },
  { name: 'फाल्गुन अमावस्या (महाशिवरात्रि पूर्व)', month: 'फाल्गुन', date: '07 मार्च 2027', dateEn: '2027-03-07' },
  { name: 'चैत्र अमावस्या (चैत्र नवरात्रि पूर्व)', month: 'चैत्र', date: '06 अप्रैल 2027', dateEn: '2027-04-06' },
  { name: 'वैशाख अमावस्या (शनि जयंती / वट सावित्री आरंभ)', month: 'वैशाख', date: '05 मई 2027', dateEn: '2027-05-05', highlight: true },
  { name: 'ज्येष्ठ अमावस्या (वट सावित्री अमावस्या)', month: 'ज्येष्ठ', date: '04 जून 2027', dateEn: '2027-06-04' },
  { name: 'आषाढ़ अमावस्या (हलहारिणी अमावस्या)', month: 'आषाढ़', date: '03 जुलाई 2027', dateEn: '2027-07-03' },
  { name: 'श्रावण अमावस्या (हरियाली अमावस्या / सोमवती)', month: 'श्रावण', date: '02 अगस्त 2027', dateEn: '2027-08-02', highlight: true },
  { name: 'भाद्रपद अमावस्या (कुशोत्पाटिनी / पिथौरी अमावस्या)', month: 'भाद्रपद', date: '31 अगस्त 2027', dateEn: '2027-08-31' },
  { name: 'अश्विन अमावस्या (सर्वपितृ अमावस्या / महालया)', month: 'अश्विन', date: '29 सितंबर 2027', dateEn: '2027-09-29', highlight: true },
  { name: 'कार्तिक अमावस्या (दीपावली पूजन 2027)', month: 'कार्तिक', date: '29 अक्टूबर 2027', dateEn: '2027-10-29', highlight: true },
  { name: 'मार्गशीर्ष अमावस्या (दर्श अमावस्या)', month: 'मार्गशीर्ष', date: '28 नवंबर 2027', dateEn: '2027-11-28' },
  { name: 'पौष अमावस्या (पौष पितृ अमावस्या)', month: 'पौष', date: '28 दिसंबर 2027', dateEn: '2027-12-28' },
  // 2028
  { name: 'माघ अमावस्या (मौनी अमावस्या 2028)', month: 'माघ', date: '26 जनवरी 2028', dateEn: '2028-01-26', highlight: true },
  { name: 'फाल्गुन अमावस्या (फाल्गुनी तर्पण)', month: 'फाल्गुन', date: '25 फरवरी 2028', dateEn: '2028-02-25' },
  { name: 'चैत्र अमावस्या (नव संवत्सर पूर्व)', month: 'चैत्र', date: '26 मार्च 2028', dateEn: '2028-03-26' },
  { name: 'वैशाख अमावस्या (शनि जयंती 2028)', month: 'वैशाख', date: '24 अप्रैल 2028', dateEn: '2028-04-24', highlight: true },
  { name: 'ज्येष्ठ अमावस्या (वट सावित्री 2028)', month: 'ज्येष्ठ', date: '24 मई 2028', dateEn: '2028-05-24' },
  { name: 'आषाढ़ अमावस्या (आषाढ़ी अमावस्या)', month: 'आषाढ़', date: '22 जून 2028', dateEn: '2028-06-22' },
  { name: 'श्रावण अमावस्या (हरियाली अमावस्या 2028)', month: 'श्रावण', date: '22 जुलाई 2028', dateEn: '2028-07-22', highlight: true },
  { name: 'भाद्रपद अमावस्या (कुशोत्पाटिनी 2028)', month: 'भाद्रपद', date: '20 अगस्त 2028', dateEn: '2028-08-20' },
  { name: 'अश्विन अमावस्या (सर्वपितृ अमावस्या 2028)', month: 'अश्विन', date: '19 सितंबर 2028', dateEn: '2028-09-19', highlight: true },
  { name: 'कार्तिक अमावस्या (दीपावली पूजन 2028)', month: 'कार्तिक', date: '17 अक्टूबर 2028', dateEn: '2028-10-17', highlight: true },
  { name: 'मार्गशीर्ष अमावस्या (दर्श अमावस्या 2028)', month: 'मार्गशीर्ष', date: '16 नवंबर 2028', dateEn: '2028-11-16' },
  { name: 'पौष अमावस्या (पौष पितृ अमावस्या 2028)', month: 'पौष', date: '15 दिसंबर 2028', dateEn: '2028-12-15' },
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
  {
    q: 'सर्वपितृ अमावस्या पर श्राद्ध न कर पाने पर क्या विकल्प है?',
    a: 'अश्विन कृष्ण अमावस्या को सर्वपितृ अमावस्या या महालया कहते हैं। यदि वर्ष भर किसी पूर्वज की तिथि ज्ञात न हो, तो इस दिन किया गया तर्पण, तिल-जल समर्पण और पंचबलि (गाय, कुत्ता, कौवा, देव और चींटी को भोजन) समस्त पितरों को तृप्त करता है।',
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
        'वर्ष 2026, 2027 एवं 2028 की समस्त अमावस्या तिथियाँ, पितृ तर्पण, मौनी अमावस्या, सोमवती अमावस्या एवं आत्म-चिंतन का शास्त्रीय विधान।',
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
    <main
      className="apple-scope panchang-scope panchang-limb relative min-h-screen bg-dharma-bg text-dharma-text pb-24 overflow-x-clip"
      data-limb="tithis"
    >
      <JsonLd data={JSON_LD} />

      {/* Luminous Mystic Aura / अमावस्या शांत आभा Backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-12 h-[560px] overflow-hidden select-none -z-10 opacity-70 dark:opacity-40"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-[780px] h-[420px] rounded-full bg-radial from-stone-400/25 via-indigo-500/12 to-transparent blur-3xl" />
        <div className="absolute right-[12%] top-24 w-[520px] h-[340px] rounded-full bg-radial from-indigo-500/20 via-purple-600/12 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-gutter pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Panchang', href: '/panchang/' },
            { label: 'Amavasya Dates' },
          ]}
        />
      </div>

      <PageHeader
        eyebrow="New Moon & Pitru Tarpan"
        eyebrowHi="पितृ तर्पण एवं मौन साधना"
        title="Amavasya Calendar (2026–2028)"
        titleHi="अमावस्या तिथियाँ व पितृ तर्पण माहात्म्य"
        lead="अमावस्या वह तिथि है जब सूर्य और चंद्रमा एक ही राशि में स्थित होते हैं। यह बाह्य चकाचौंध से हटकर अंतर्मुखी होने, मौन साधना करने और पूर्वजों के प्रति कृतज्ञता ज्ञापित करने का पावन दिन है।"
        width="wide"
      />

      <PanchangLimbSwitcher activeLimb="tithis" />

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-10 space-y-12">
        {/* Core Principles Bento */}
        <section aria-labelledby="amavasya-pillars" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-sacred relative rounded-2xl border border-separator/80 bg-surface-elevated/85 p-5 backdrop-blur-xl shadow-xs transition hover:border-tint/40">
            <span className="text-2xl mb-2 block" aria-hidden="true">🌑</span>
            <h3 className="font-serif font-bold text-base text-label-primary">आत्म-चिंतन व मौन</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-label-secondary">
              सूर्य-चंद्र की युति पर बाह्य विक्षेपों से दूर रहकर मौन व्रत, ध्यान और अंतर्मुखी चेतना की शुद्धि।
            </p>
          </div>

          <div className="card-sacred relative rounded-2xl border border-separator/80 bg-surface-elevated/85 p-5 backdrop-blur-xl shadow-xs transition hover:border-tint/40">
            <span className="text-2xl mb-2 block" aria-hidden="true">🕊️</span>
            <h3 className="font-serif font-bold text-base text-label-primary">पितृ तर्पण व कृतज्ञता</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-label-secondary">
              अर्यमा देव और पूर्वजों के प्रति तिल-जल से तर्पण, जिससे कुल में शांति और आत्म-संतोष का संचार होता है।
            </p>
          </div>

          <div className="card-sacred relative rounded-2xl border border-separator/80 bg-surface-elevated/85 p-5 backdrop-blur-xl shadow-xs transition hover:border-tint/40">
            <span className="text-2xl mb-2 block" aria-hidden="true">🌾</span>
            <h3 className="font-serif font-bold text-base text-label-primary">अन्नदान व पंचबलि</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-label-secondary">
              दीन-दुखियों को अन्नदान तथा गौ, श्वान, काक और चींटियों को भोजन समर्पण से पाप-क्षय और पुण्य-संचय।
            </p>
          </div>
        </section>

        {/* Dates Table with Year Filter & ICS Download */}
        <VrataDatesTable
          dates={AMAVASYA_DATES}
          title="अमावस्या व्रत एवं पितृ तर्पण तिथियाँ (2026–2028)"
          subtitle="पितृ श्राद्ध, तर्पण, दीपदान एवं स्नान-दान पर्व"
          vrataType="amavasya"
        />

        {/* Sacred Shloka Card */}
        <section
          aria-labelledby="mantra-heading"
          className="tadpatra-card relative rounded-3xl border border-separator/80 bg-surface-elevated/85 p-6 sm:p-8 backdrop-blur-xl shadow-soft overflow-hidden"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-tint mb-3">
            <BookOpen className="size-4" aria-hidden="true" />
            <span>पितृ गायत्री एवं तर्पण मंत्र</span>
          </div>
          <p lang="sa" className="font-devanagari text-lg sm:text-2xl font-bold leading-relaxed text-label-primary text-center py-4">
            ॐ देवताभ्यः पितृभ्यश्च महायोगिभ्य एव च ।<br />
            नमः स्वधायै स्वाहायै नित्यमेव नमो नमः ॥
          </p>
          <p className="text-xs sm:text-sm text-center text-label-secondary max-w-xl mx-auto mt-2 leading-relaxed">
            गरुड़ पुराण: &quot;जो प्राणी अमावस्या पर देवताओं, पितरों और महायोगियों को नमन करते हुए जल-तिल से तर्पण करते हैं, उनके कुल में पितृ दोष की शांति होती है।&quot;
          </p>
        </section>

        {/* FAQ Accordion */}
        <section aria-labelledby="faq-heading">
          <SectionTitle id="faq-heading" title="जिज्ञासा एवं समाधान" titleHi="FAQ" />
          <div className="apple-group mt-6">
            {FAQS.map((f) => (
              <details key={f.q} className="apple-row group block !py-0 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex min-h-[52px] cursor-pointer items-center justify-between gap-3 text-callout font-medium text-label-primary">
                  <span>{f.q}</span>
                  <span aria-hidden="true" className="apple-chevron transition group-open:rotate-90">›</span>
                </summary>
                <p className="pb-4 text-subhead leading-relaxed text-label-secondary">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related Hub Navigation */}
        <section className="flex flex-wrap gap-4 pt-6 border-t border-separator/80">
          <Link
            href="/panchang/"
            className="liquid-pill inline-flex min-h-11 items-center gap-1.5 rounded-full border border-separator/80 bg-surface-raised hover:bg-fill-tertiary px-4 py-2 text-xs font-semibold text-label-primary shadow-xs transition"
          >
            &larr; मुख्य पंचांग
          </Link>
          <Link
            href="/panchang/purnima/"
            className="liquid-pill inline-flex min-h-11 items-center gap-1.5 rounded-full border border-separator/80 bg-surface-raised hover:bg-fill-tertiary px-4 py-2 text-xs font-semibold text-label-primary shadow-xs transition"
          >
            पूर्णिमा तिथियाँ देखें &rarr;
          </Link>
          <Link
            href="/festivals/diwali/"
            className="liquid-pill inline-flex min-h-11 items-center gap-1.5 rounded-full border border-amber-600/40 bg-amber-500/10 hover:bg-amber-500/20 px-4 py-2 text-xs font-semibold text-amber-800 dark:text-amber-300 shadow-xs transition"
          >
            दीपावली (कार्तिक अमावस्या) दर्शन &rarr;
          </Link>
        </section>
      </div>
    </main>
  );
}
