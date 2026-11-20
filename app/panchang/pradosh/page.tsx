import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { PageHeader, SectionTitle } from '@/app/components/apple/PageHeader';
import { PanchangLimbSwitcher } from '@/app/panchang/components/PanchangLimbSwitcher';
import { VrataDatesTable, type VrataDateItem } from '@/app/panchang/components/VrataDatesTable';
import { JsonLd } from '@/app/components/JsonLd';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'प्रदोष व्रत तिथियाँ 2026–2028 · Pradosh Vrat Dates & Shiva Mahatmya',
  description:
    'वर्ष 2026, 2027 एवं 2028 की समस्त प्रदोष व्रत तिथियाँ, प्रदोष काल समय, शिव पुराण के अनुसार व्रत विधि, मंत्र एवं महात्म्य।',
  keywords: [
    'प्रदोष व्रत',
    'Pradosh Vrat dates 2026',
    'Pradosh dates 2027',
    'Pradosh dates 2028',
    'सोम प्रदोष',
    'भौम प्रदोष',
    'शनि प्रदोष',
    'प्रदोष काल मुहूर्त',
    'Shiva Purana Pradosh',
    'Dharma Granth Panchang',
  ],
  alternates: { canonical: '/panchang/pradosh/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'प्रदोष व्रत तिथियाँ 2026–2028 · Pradosh Vrat Dates & Shiva Mahatmya — Dharma Granth',
    description:
      'त्रयोदशी तिथि पर पड़ने वाले प्रदोष व्रत की तिथियाँ, प्रदोष काल समय, शिव पुराण के अनुसार व्रत विधि, मंत्र एवं महात्म्य।',
    url: 'https://dharmagranth.dev/panchang/pradosh/',
  },
};

const PRADOSH_DATES: VrataDateItem[] = [
  // 2026
  { name: 'मार्गशीर्ष कृष्ण प्रदोष (सोम प्रदोष)', paksha: 'कृष्ण पक्ष', month: 'मार्गशीर्ष', date: '07 दिसंबर 2026', dateEn: '2026-12-07', highlight: true },
  { name: 'मार्गशीर्ष शुक्ल प्रदोष (सोम प्रदोष)', paksha: 'शुक्ल पक्ष', month: 'मार्गशीर्ष', date: '21 दिसंबर 2026', dateEn: '2026-12-21', highlight: true },

  // 2027
  { name: 'पौष कृष्ण प्रदोष (बुध प्रदोष)', paksha: 'कृष्ण पक्ष', month: 'पौष', date: '06 जनवरी 2027', dateEn: '2027-01-06' },
  { name: 'पौष शुक्ल प्रदोष (बुध प्रदोष)', paksha: 'शुक्ल पक्ष', month: 'पौष', date: '20 जनवरी 2027', dateEn: '2027-01-20' },
  { name: 'माघ कृष्ण प्रदोष (गुरु प्रदोष)', paksha: 'कृष्ण पक्ष', month: 'माघ', date: '04 फरवरी 2027', dateEn: '2027-02-04' },
  { name: 'माघ शुक्ल प्रदोष (भृगु प्रदोष)', paksha: 'शुक्ल पक्ष', month: 'माघ', date: '19 फरवरी 2027', dateEn: '2027-02-19' },
  { name: 'फाल्गुन कृष्ण प्रदोष (शनि प्रदोष / महाशिवरात्रि पूर्व)', paksha: 'कृष्ण पक्ष', month: 'फाल्गुन', date: '06 मार्च 2027', dateEn: '2027-03-06', highlight: true },
  { name: 'फाल्गुन शुक्ल प्रदोष (रवि प्रदोष)', paksha: 'शुक्ल पक्ष', month: 'फाल्गुन', date: '21 मार्च 2027', dateEn: '2027-03-21' },
  { name: 'चैत्र कृष्ण प्रदोष (सोम प्रदोष)', paksha: 'कृष्ण पक्ष', month: 'चैत्र', date: '05 अप्रैल 2027', dateEn: '2027-04-05', highlight: true },
  { name: 'चैत्र शुक्ल प्रदोष (सोम प्रदोष)', paksha: 'शुक्ल पक्ष', month: 'चैत्र', date: '19 अप्रैल 2027', dateEn: '2027-04-19', highlight: true },
  { name: 'वैशाख कृष्ण प्रदोष (भौम प्रदोष)', paksha: 'कृष्ण पक्ष', month: 'वैशाख', date: '04 मई 2027', dateEn: '2027-05-04', highlight: true },
  { name: 'वैशाख शुक्ल प्रदोष (भौम प्रदोष)', paksha: 'शुक्ल पक्ष', month: 'वैशाख', date: '18 मई 2027', dateEn: '2027-05-18', highlight: true },
  { name: 'ज्येष्ठ कृष्ण प्रदोष (बुध प्रदोष)', paksha: 'कृष्ण पक्ष', month: 'ज्येष्ठ', date: '02 जून 2027', dateEn: '2027-06-02' },
  { name: 'ज्येष्ठ शुक्ल प्रदोष (गुरु प्रदोष)', paksha: 'शुक्ल पक्ष', month: 'ज्येष्ठ', date: '17 जून 2027', dateEn: '2027-06-17' },
  { name: 'आषाढ़ कृष्ण प्रदोष (भृगु प्रदोष)', paksha: 'कृष्ण पक्ष', month: 'आषाढ़', date: '02 जुलाई 2027', dateEn: '2027-07-02' },
  { name: 'आषाढ़ शुक्ल प्रदोष (भृगु प्रदोष)', paksha: 'शुक्ल पक्ष', month: 'आषाढ़', date: '16 जुलाई 2027', dateEn: '2027-07-16' },
  { name: 'श्रावण कृष्ण प्रदोष (सावन शनि प्रदोष)', paksha: 'कृष्ण पक्ष', month: 'श्रावण', date: '31 जुलाई 2027', dateEn: '2027-07-31', highlight: true },
  { name: 'श्रावण शुक्ल प्रदोष (रवि प्रदोष)', paksha: 'शुक्ल पक्ष', month: 'श्रावण', date: '15 अगस्त 2027', dateEn: '2027-08-15' },
  { name: 'भाद्रपद कृष्ण प्रदोष (सोम प्रदोष)', paksha: 'कृष्ण पक्ष', month: 'भाद्रपद', date: '30 अगस्त 2027', dateEn: '2027-08-30', highlight: true },
  { name: 'भाद्रपद शुक्ल प्रदोष (सोम प्रदोष)', paksha: 'शुक्ल पक्ष', month: 'भाद्रपद', date: '13 सितंबर 2027', dateEn: '2027-09-13', highlight: true },
  { name: 'अश्विन कृष्ण प्रदोष (भौम प्रदोष)', paksha: 'कृष्ण पक्ष', month: 'अश्विन', date: '28 सितंबर 2027', dateEn: '2027-09-28', highlight: true },
  { name: 'अश्विन शुक्ल प्रदोष (बुध प्रदोष)', paksha: 'शुक्ल पक्ष', month: 'अश्विन', date: '13 अक्टूबर 2027', dateEn: '2027-10-13' },
  { name: 'कार्तिक कृष्ण प्रदोष (धनतेरस प्रदोष / भौम प्रदोष)', paksha: 'कृष्ण पक्ष', month: 'कार्तिक', date: '27 अक्टूबर 2027', dateEn: '2027-10-27', highlight: true },
  { name: 'कार्तिक शुक्ल प्रदोष (गुरु प्रदोष)', paksha: 'शुक्ल पक्ष', month: 'कार्तिक', date: '11 नवंबर 2027', dateEn: '2027-11-11' },
  { name: 'मार्गशीर्ष कृष्ण प्रदोष (भृगु प्रदोष)', paksha: 'कृष्ण पक्ष', month: 'मार्गशीर्ष', date: '26 नवंबर 2027', dateEn: '2027-11-26' },
  { name: 'मार्गशीर्ष शुक्ल प्रदोष (शनि प्रदोष)', paksha: 'शुक्ल पक्ष', month: 'मार्गशीर्ष', date: '11 दिसंबर 2027', dateEn: '2027-12-11', highlight: true },
  { name: 'पौष कृष्ण प्रदोष (शनि प्रदोष)', paksha: 'कृष्ण पक्ष', month: 'पौष', date: '25 दिसंबर 2027', dateEn: '2027-12-25', highlight: true },

  // 2028
  { name: 'पौष शुक्ल प्रदोष (रवि प्रदोष 2028)', paksha: 'शुक्ल पक्ष', month: 'पौष', date: '09 जनवरी 2028', dateEn: '2028-01-09' },
  { name: 'माघ कृष्ण प्रदोष (सोम प्रदोष 2028)', paksha: 'कृष्ण पक्ष', month: 'माघ', date: '24 जनवरी 2028', dateEn: '2028-01-24', highlight: true },
  { name: 'माघ शुक्ल प्रदोष (भौम प्रदोष 2028)', paksha: 'शुक्ल पक्ष', month: 'माघ', date: '08 फरवरी 2028', dateEn: '2028-02-08', highlight: true },
  { name: 'फाल्गुन कृष्ण प्रदोष (महाशिवरात्रि पूर्व प्रदोष)', paksha: 'कृष्ण पक्ष', month: 'फाल्गुन', date: '23 फरवरी 2028', dateEn: '2028-02-23', highlight: true },
  { name: 'फाल्गुन शुक्ल प्रदोष (बुध प्रदोष 2028)', paksha: 'शुक्ल पक्ष', month: 'फाल्गुन', date: '08 मार्च 2028', dateEn: '2028-03-08' },
  { name: 'चैत्र कृष्ण प्रदोष (गुरु प्रदोष 2028)', paksha: 'कृष्ण पक्ष', month: 'चैत्र', date: '23 मार्च 2028', dateEn: '2028-03-23' },
  { name: 'चैत्र शुक्ल प्रदोष (भृगु प्रदोष 2028)', paksha: 'शुक्ल पक्ष', month: 'चैत्र', date: '07 अप्रैल 2028', dateEn: '2028-04-07' },
  { name: 'वैशाख कृष्ण प्रदोष (शनि प्रदोष 2028)', paksha: 'कृष्ण पक्ष', month: 'वैशाख', date: '22 अप्रैल 2028', dateEn: '2028-04-22', highlight: true },
  { name: 'वैशाख शुक्ल प्रदोष (रवि प्रदोष 2028)', paksha: 'शुक्ल पक्ष', month: 'वैशाख', date: '07 मई 2028', dateEn: '2028-05-07' },
  { name: 'ज्येष्ठ कृष्ण प्रदोष (रवि प्रदोष 2028)', paksha: 'कृष्ण पक्ष', month: 'ज्येष्ठ', date: '21 मई 2028', dateEn: '2028-05-21' },
  { name: 'ज्येष्ठ शुक्ल प्रदोष (सोम प्रदोष 2028)', paksha: 'शुक्ल पक्ष', month: 'ज्येष्ठ', date: '05 जून 2028', dateEn: '2028-06-05', highlight: true },
  { name: 'आषाढ़ कृष्ण प्रदोष (भौम प्रदोष 2028)', paksha: 'कृष्ण पक्ष', month: 'आषाढ़', date: '20 जून 2028', dateEn: '2028-06-20', highlight: true },
  { name: 'आषाढ़ शुक्ल प्रदोष (बुध प्रदोष 2028)', paksha: 'शुक्ल पक्ष', month: 'आषाढ़', date: '05 जुलाई 2028', dateEn: '2028-07-05' },
  { name: 'श्रावण कृष्ण प्रदोष (सावन प्रदोष 2028)', paksha: 'कृष्ण पक्ष', month: 'श्रावण', date: '19 जुलाई 2028', dateEn: '2028-07-19', highlight: true },
  { name: 'श्रावण शुक्ल प्रदोष (गुरु प्रदोष 2028)', paksha: 'शुक्ल पक्ष', month: 'श्रावण', date: '03 अगस्त 2028', dateEn: '2028-08-03', highlight: true },
  { name: 'भाद्रपद कृष्ण प्रदोष (भृगु प्रदोष 2028)', paksha: 'कृष्ण पक्ष', month: 'भाद्रपद', date: '18 अगस्त 2028', dateEn: '2028-08-18' },
  { name: 'भाद्रपद शुक्ल प्रदोष (भृगु प्रदोष 2028)', paksha: 'शुक्ल पक्ष', month: 'भाद्रपद', date: '01 सितंबर 2028', dateEn: '2028-01-01' },
  { name: 'अश्विन कृष्ण प्रदोष (शनि प्रदोष 2028)', paksha: 'कृष्ण पक्ष', month: 'अश्विन', date: '16 सितंबर 2028', dateEn: '2028-09-16', highlight: true },
  { name: 'अश्विन शुक्ल प्रदोष (रवि प्रदोष 2028)', paksha: 'शुक्ल पक्ष', month: 'अश्विन', date: '01 अक्टूबर 2028', dateEn: '2028-10-01' },
  { name: 'कार्तिक कृष्ण प्रदोष (धनतेरस प्रदोष / सोम प्रदोष)', paksha: 'कृष्ण पक्ष', month: 'कार्तिक', date: '16 अक्टूबर 2028', dateEn: '2028-10-16', highlight: true },
  { name: 'कार्तिक शुक्ल प्रदोष (सोम प्रदोष 2028)', paksha: 'शुक्ल पक्ष', month: 'कार्तिक', date: '30 अक्टूबर 2028', dateEn: '2028-10-30', highlight: true },
  { name: 'मार्गशीर्ष कृष्ण प्रदोष (भौम प्रदोष 2028)', paksha: 'कृष्ण पक्ष', month: 'मार्गशीर्ष', date: '14 नवंबर 2028', dateEn: '2028-11-14', highlight: true },
  { name: 'मार्गशीर्ष शुक्ल प्रदोष (बुध प्रदोष 2028)', paksha: 'शुक्ल पक्ष', month: 'मार्गशीर्ष', date: '29 नवंबर 2028', dateEn: '2028-11-29' },
  { name: 'पौष कृष्ण प्रदोष (गुरु प्रदोष 2028)', paksha: 'कृष्ण पक्ष', month: 'पौष', date: '14 दिसंबर 2028', dateEn: '2028-12-14' },
  { name: 'पौष शुक्ल प्रदोष (गुरु प्रदोष 2028)', paksha: 'शुक्ल पक्ष', month: 'पौष', date: '28 दिसंबर 2028', dateEn: '2028-12-28' },
];

const FAQS = [
  {
    q: 'प्रदोष काल (Pradosha Kaala) किसे कहते हैं?',
    a: 'सूर्यास्त से लगभग 45 मिनट पूर्व और सूर्यास्त के 45 मिनट बाद (कुल लगभग डेढ़ घंटे या 3 मुहूर्त) की संध्या-बेला को "प्रदोष काल" कहा जाता है। शिव पुराण के अनुसार इसी समय भगवान शिव कैलाश पर आनंद तांडव करते हैं और समस्त देवता उनकी स्तुति करते हैं।',
  },
  {
    q: 'सोम, भौम और शनि प्रदोष का क्या विशेष फल है?',
    a: 'सोमवार को पड़ने वाला सोम प्रदोष शांति व आरोग्य देता है; मंगलवार का भौम प्रदोष ऋण-मुक्ति और संकट-निवारण के लिए प्रसिद्ध है; और शनिवार को पड़ने वाला शनि प्रदोष संतान-सुख व दीर्घायु की कामना हेतु विशेष रूप से फलदायी माना जाता है।',
  },
  {
    q: 'प्रदोष व्रत में क्या खाना चाहिए?',
    a: 'प्रदोष व्रत में दिनभर निराहार अथवा फलाहार रहा जाता है। प्रदोष काल में भगवान शिव की पूजा और जलाभिषेक के बाद सात्विक हविष्यान्न अथवा फलाहार ग्रहण किया जाता है।',
  },
];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://dharmagranth.dev/panchang/pradosh/#webpage',
      url: 'https://dharmagranth.dev/panchang/pradosh/',
      name: 'प्रदोष व्रत तिथियाँ 2026–2028 · Pradosh Vrat Dates & Shiva Mahatmya',
      description:
        'त्रयोदशी तिथि पर पड़ने वाले प्रदोष व्रत की तिथियाँ, प्रदोष काल समय, शिव पुराण के अनुसार व्रत विधि, मंत्र एवं महात्म्य।',
      inLanguage: ['hi', 'sa', 'en'],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://dharmagranth.dev/panchang/pradosh/#faq',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

export default function PradoshPage() {
  return (
    <main
      className="apple-scope panchang-scope panchang-limb relative min-h-screen bg-dharma-bg text-dharma-text pb-24 overflow-x-clip"
      data-limb="tithis"
    >
      <JsonLd data={JSON_LD} />

      {/* Twilight Shiva Sandhya Aura Backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-12 h-[560px] overflow-hidden select-none -z-10 opacity-70 dark:opacity-45"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-[780px] h-[420px] rounded-full bg-radial from-indigo-500/25 via-blue-600/12 to-transparent blur-3xl" />
        <div className="absolute right-[10%] top-20 w-[520px] h-[340px] rounded-full bg-radial from-cyan-500/18 via-indigo-600/10 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-gutter pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Panchang', href: '/panchang/' },
            { label: 'Pradosh Dates' },
          ]}
        />
      </div>

      <PageHeader
        eyebrow="Trayodashi & Shiva Sandhya"
        eyebrowHi="शिव सायुज्य एवं प्रदोष काल"
        title="Pradosh Vrat Dates (2026–2028)"
        titleHi="प्रदोष व्रत तिथियाँ व शिव महात्म्य"
        lead="शिव पुराण एवं स्कंद पुराण के अनुसार प्रत्येक पक्ष की त्रयोदशी तिथि का प्रदोष काल आशुतोष भगवान शिव की कृपा प्राप्त करने का सर्वश्रेष्ठ मुहूर्त है।"
        width="wide"
      />

      <PanchangLimbSwitcher activeLimb="tithis" />

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-10 space-y-12">
        {/* Core Principles Bento */}
        <section aria-labelledby="pradosh-meaning" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-sacred relative rounded-2xl border border-separator/80 bg-surface-elevated/85 p-5 backdrop-blur-xl shadow-xs transition hover:border-tint/40">
            <span className="text-2xl mb-2 block" aria-hidden="true">🌙</span>
            <h3 className="font-serif font-bold text-base text-label-primary">त्रयोदशी तिथि (13th Lunar Day)</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-label-secondary">
              पूर्णिमा और अमावस्या से दो दिन पूर्व, जब चित्त की वृत्तियों को शांत और अंतर्मुखी करना अत्यंत सहज होता है।
            </p>
          </div>
          <div className="card-sacred relative rounded-2xl border border-separator/80 bg-surface-elevated/85 p-5 backdrop-blur-xl shadow-xs transition hover:border-tint/40">
            <span className="text-2xl mb-2 block" aria-hidden="true">🔱</span>
            <h3 className="font-serif font-bold text-base text-label-primary">कैलाश तांडव (Divine Twilight)</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-label-secondary">
              संध्याकाल में शिवजी का आनंद नृत्य — समस्त नकारात्मक ऊर्जा व क्लेशों के भस्म होने की पावन बेला।
            </p>
          </div>
          <div className="card-sacred relative rounded-2xl border border-separator/80 bg-surface-elevated/85 p-5 backdrop-blur-xl shadow-xs transition hover:border-tint/40">
            <span className="text-2xl mb-2 block" aria-hidden="true">🔔</span>
            <h3 className="font-serif font-bold text-base text-label-primary">महामृत्युंजय साधना (Japa & Peace)</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-label-secondary">
              महामृत्युंजय मंत्र, रुद्राष्टकम् और शिव पंचाक्षर स्तोत्र के जप से अंतःकरण की शुद्धि व आरोग्य।
            </p>
          </div>
        </section>

        {/* Dates Table with Year Filter & ICS Download */}
        <VrataDatesTable
          dates={PRADOSH_DATES}
          title="प्रदोष व्रत तिथियाँ (2026–2028)"
          subtitle="सूर्यास्त समय अनुसार प्रदोष काल पूजा एवं शिव सायुज्य मुहूर्त"
          vrataType="pradosh"
        />

        {/* Sacred Mantra & Scriptural Citation */}
        <section
          aria-labelledby="mantra-heading"
          className="tadpatra-card relative rounded-3xl border border-separator/80 bg-surface-elevated/85 p-6 sm:p-8 backdrop-blur-xl shadow-soft overflow-hidden"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-tint mb-3">
            <BookOpen className="size-4" aria-hidden="true" />
            <span>शिव पुराण एवं महामृत्युंजय संदर्भ</span>
          </div>
          <p lang="sa" className="font-devanagari text-lg sm:text-2xl font-bold leading-relaxed text-label-primary text-center py-4">
            ॐ नमः शिवाय ॥<br />
            ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥
          </p>
          <p className="text-xs sm:text-sm text-center text-label-secondary max-w-xl mx-auto mt-2 leading-relaxed">
            शिव पुराण में महर्षि सूत कहते हैं: &quot;जो मनुष्य दोनों पक्षों की त्रयोदशी को प्रदोष काल में भगवान शिव की आराधना करता है, उसके समस्त पाप, व्याधियां और ऋण विनष्ट हो जाते हैं।&quot;
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
            href="/festivals/shivaratri/"
            className="liquid-pill inline-flex min-h-11 items-center gap-1.5 rounded-full border border-separator/80 bg-surface-raised hover:bg-fill-tertiary px-4 py-2 text-xs font-semibold text-label-primary shadow-xs transition"
          >
            महाशिवरात्रि दर्शन &rarr;
          </Link>
          <Link
            href="/panchang/ekadashi/"
            className="liquid-pill inline-flex min-h-11 items-center gap-1.5 rounded-full border border-separator/80 bg-surface-raised hover:bg-fill-tertiary px-4 py-2 text-xs font-semibold text-label-primary shadow-xs transition"
          >
            एकादशी व्रत तिथियाँ &rarr;
          </Link>
        </section>
      </div>
    </main>
  );
}
