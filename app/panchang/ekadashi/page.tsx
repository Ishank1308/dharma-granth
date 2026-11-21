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
  title: 'एकादशी व्रत तिथियाँ 2026–2028 · Ekadashi Dates & Vrata Mahatmya',
  description:
    'वर्ष 2026, 2027 एवं 2028 की समस्त एकादशी तिथियाँ, पारण समय, उपवास नियम, और पद्म पुराण एवं विष्णु पुराण के अनुसार एकादशी व्रत का शास्त्रीय माहात्म्य।',
  keywords: [
    'एकादशी व्रत',
    'Ekadashi dates 2026',
    'Ekadashi dates 2027',
    'Ekadashi dates 2028',
    'आज कौन सी एकादशी है',
    'मोक्षदा एकादशी',
    'निर्जला एकादशी',
    'देवशयनी एकादशी',
    'एकादशी पारण समय',
    'Padma Purana Ekadashi',
    'Dharma Granth Panchang',
  ],
  alternates: { canonical: '/panchang/ekadashi/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'एकादशी व्रत तिथियाँ 2026–2028 · Ekadashi Dates & Vrata Mahatmya — Dharma Granth',
    description:
      'वर्ष 2026, 2027 एवं 2028 की समस्त एकादशी तिथियाँ, पारण समय, और पद्म पुराण व विष्णु पुराण के अनुसार एकादशी का शास्त्रीय माहात्म्य।',
    url: 'https://dharmagranth.dev/panchang/ekadashi/',
  },
};

const EKADASHI_DATES: VrataDateItem[] = [
  // 2026
  { name: 'उत्पन्ना एकादशी (Utpanna Ekadashi)', paksha: 'कृष्ण पक्ष', month: 'मार्गशीर्ष', date: '05 दिसंबर 2026', dateEn: '2026-12-05' },
  { name: 'मोक्षदा एकादशी (Mokshada / गीता जयंती)', paksha: 'शुक्ल पक्ष', month: 'मार्गशीर्ष', date: '20 दिसंबर 2026', dateEn: '2026-12-20', highlight: true },

  // 2027
  { name: 'सफला एकादशी (Saphala Ekadashi)', paksha: 'कृष्ण पक्ष', month: 'पौष', date: '04 जनवरी 2027', dateEn: '2027-01-04' },
  { name: 'पुत्रदा एकादशी (Pausha Putrada)', paksha: 'शुक्ल पक्ष', month: 'पौष', date: '18 जनवरी 2027', dateEn: '2027-01-18' },
  { name: 'षट्तिला एकादशी (Shattila Ekadashi)', paksha: 'कृष्ण पक्ष', month: 'माघ', date: '02 फरवरी 2027', dateEn: '2027-02-02' },
  { name: 'जया एकादशी (Jaya Ekadashi)', paksha: 'शुक्ल पक्ष', month: 'माघ', date: '17 फरवरी 2027', dateEn: '2027-02-17' },
  { name: 'विजया एकादशी (Vijaya Ekadashi)', paksha: 'कृष्ण पक्ष', month: 'फाल्गुन', date: '04 मार्च 2027', dateEn: '2027-03-04' },
  { name: 'आमलकी एकादशी (Amalaki Ekadashi)', paksha: 'शुक्ल पक्ष', month: 'फाल्गुन', date: '19 मार्च 2027', dateEn: '2027-03-19', highlight: true },
  { name: 'पापमोचिनी एकादशी (Papmochini)', paksha: 'कृष्ण पक्ष', month: 'चैत्र', date: '03 अप्रैल 2027', dateEn: '2027-04-03' },
  { name: 'कामदा एकादशी (Kamada Ekadashi)', paksha: 'शुक्ल पक्ष', month: 'चैत्र', date: '17 अप्रैल 2027', dateEn: '2027-04-17' },
  { name: 'वरूथिनी एकादशी (Varuthini Ekadashi)', paksha: 'कृष्ण पक्ष', month: 'वैशाख', date: '02 मई 2027', dateEn: '2027-05-02' },
  { name: 'मोहिनी एकादशी (Mohini Ekadashi)', paksha: 'शुक्ल पक्ष', month: 'वैशाख', date: '16 मई 2027', dateEn: '2027-05-16' },
  { name: 'अपरा एकादशी (Apara Ekadashi)', paksha: 'कृष्ण पक्ष', month: 'ज्येष्ठ', date: '31 मई 2027', dateEn: '2027-05-31' },
  { name: 'निर्जला एकादशी (Nirjala / भीमसेनी)', paksha: 'शुक्ल पक्ष', month: 'ज्येष्ठ', date: '15 जून 2027', dateEn: '2027-06-15', highlight: true },
  { name: 'योगिनी एकादशी (Yogini Ekadashi)', paksha: 'कृष्ण पक्ष', month: 'आषाढ़', date: '30 जून 2027', dateEn: '2027-06-30' },
  { name: 'देवशयनी एकादशी (Devshayani / चातुर्मास आरंभ)', paksha: 'शुक्ल पक्ष', month: 'आषाढ़', date: '15 जुलाई 2027', dateEn: '2027-07-15', highlight: true },
  { name: 'कामिका एकादशी (Kamika Ekadashi)', paksha: 'कृष्ण पक्ष', month: 'श्रावण', date: '29 जुलाई 2027', dateEn: '2027-07-29' },
  { name: 'श्रावण पुत्रदा एकादशी (Pavitropana)', paksha: 'शुक्ल पक्ष', month: 'श्रावण', date: '13 अगस्त 2027', dateEn: '2027-08-13' },
  { name: 'अजा एकादशी (Aja Ekadashi)', paksha: 'कृष्ण पक्ष', month: 'भाद्रपद', date: '28 अगस्त 2027', dateEn: '2027-08-28' },
  { name: 'परिवर्तिनी एकादशी (Parivartini / वामन जयंती)', paksha: 'शुक्ल पक्ष', month: 'भाद्रपद', date: '11 सितंबर 2027', dateEn: '2027-09-11', highlight: true },
  { name: 'इन्दिरा एकादशी (Indira Ekadashi / पितृ पक्ष)', paksha: 'कृष्ण पक्ष', month: 'अश्विन', date: '26 सितंबर 2027', dateEn: '2027-09-26' },
  { name: 'पापांकुशा एकादशी (Papankusha)', paksha: 'शुक्ल पक्ष', month: 'अश्विन', date: '11 अक्टूबर 2027', dateEn: '2027-10-11' },
  { name: 'रमा एकादशी (Rama Ekadashi)', paksha: 'कृष्ण पक्ष', month: 'कार्तिक', date: '26 अक्टूबर 2027', dateEn: '2027-10-26' },
  { name: 'देवउठनी एकादशी (Prabodhini / तुलसी विवाह)', paksha: 'शुक्ल पक्ष', month: 'कार्तिक', date: '09 नवंबर 2027', dateEn: '2027-11-09', highlight: true },
  { name: 'उत्पन्ना एकादशी (Utpanna Ekadashi 2027)', paksha: 'कृष्ण पक्ष', month: 'मार्गशीर्ष', date: '24 नवंबर 2027', dateEn: '2027-11-24' },
  { name: 'मोक्षदा एकादशी (Mokshada / गीता जयंती 2027)', paksha: 'शुक्ल पक्ष', month: 'मार्गशीर्ष', date: '09 दिसंबर 2027', dateEn: '2027-12-09', highlight: true },
  { name: 'सफला एकादशी (Saphala Ekadashi 2027)', paksha: 'कृष्ण पक्ष', month: 'पौष', date: '24 दिसंबर 2027', dateEn: '2027-12-24' },

  // 2028
  { name: 'पौष पुत्रदा एकादशी (Putrada Ekadashi 2028)', paksha: 'शुक्ल पक्ष', month: 'पौष', date: '07 जनवरी 2028', dateEn: '2028-01-07' },
  { name: 'षट्तिला एकादशी (Shattila Ekadashi 2028)', paksha: 'कृष्ण पक्ष', month: 'माघ', date: '22 जनवरी 2028', dateEn: '2028-01-22' },
  { name: 'जया एकादशी (Jaya Ekadashi 2028)', paksha: 'शुक्ल पक्ष', month: 'माघ', date: '06 फरवरी 2028', dateEn: '2028-02-06' },
  { name: 'विजया एकादशी (Vijaya Ekadashi 2028)', paksha: 'कृष्ण पक्ष', month: 'फाल्गुन', date: '21 फरवरी 2028', dateEn: '2028-02-21' },
  { name: 'आमलकी एकादशी (Amalaki Ekadashi 2028)', paksha: 'शुक्ल पक्ष', month: 'फाल्गुन', date: '06 मार्च 2028', dateEn: '2028-03-06', highlight: true },
  { name: 'पापमोचिनी एकादशी (Papmochini 2028)', paksha: 'कृष्ण पक्ष', month: 'चैत्र', date: '21 मार्च 2028', dateEn: '2028-03-21' },
  { name: 'कामदा एकादशी (Kamada Ekadashi 2028)', paksha: 'शुक्ल पक्ष', month: 'चैत्र', date: '05 अप्रैल 2028', dateEn: '2028-04-05' },
  { name: 'वरूथिनी एकादशी (Varuthini Ekadashi 2028)', paksha: 'कृष्ण पक्ष', month: 'वैशाख', date: '20 अप्रैल 2028', dateEn: '2028-04-20' },
  { name: 'मोहिनी एकादशी (Mohini Ekadashi 2028)', paksha: 'शुक्ल पक्ष', month: 'वैशाख', date: '05 मई 2028', dateEn: '2028-05-05' },
  { name: 'अपरा एकादशी (Apara Ekadashi 2028)', paksha: 'कृष्ण पक्ष', month: 'ज्येष्ठ', date: '20 मई 2028', dateEn: '2028-05-20' },
  { name: 'निर्जला एकादशी (Nirjala Ekadashi 2028)', paksha: 'शुक्ल पक्ष', month: 'ज्येष्ठ', date: '03 जून 2028', dateEn: '2028-06-03', highlight: true },
  { name: 'योगिनी एकादशी (Yogini Ekadashi 2028)', paksha: 'कृष्ण पक्ष', month: 'आषाढ़', date: '18 जून 2028', dateEn: '2028-06-18' },
  { name: 'देवशयनी एकादशी (Devshayani 2028)', paksha: 'शुक्ल पक्ष', month: 'आषाढ़', date: '03 जुलाई 2028', dateEn: '2028-07-03', highlight: true },
  { name: 'कामिका एकादशी (Kamika Ekadashi 2028)', paksha: 'कृष्ण पक्ष', month: 'श्रावण', date: '18 जुलाई 2028', dateEn: '2028-07-18' },
  { name: 'श्रावण पुत्रदा एकादशी (Pavitra 2028)', paksha: 'शुक्ल पक्ष', month: 'श्रावण', date: '01 अगस्त 2028', dateEn: '2028-08-01' },
  { name: 'अजा एकादशी (Aja Ekadashi 2028)', paksha: 'कृष्ण पक्ष', month: 'भाद्रपद', date: '16 अगस्त 2028', dateEn: '2028-08-16' },
  { name: 'परिवर्तिनी एकादशी (Parivartini 2028)', paksha: 'शुक्ल पक्ष', month: 'भाद्रपद', date: '30 अगस्त 2028', dateEn: '2028-08-30', highlight: true },
  { name: 'इन्दिरा एकादशी (Indira Ekadashi 2028)', paksha: 'कृष्ण पक्ष', month: 'अश्विन', date: '15 सितंबर 2028', dateEn: '2028-09-15' },
  { name: 'पापांकुशा एकादशी (Papankusha 2028)', paksha: 'शुक्ल पक्ष', month: 'अश्विन', date: '29 सितंबर 2028', dateEn: '2028-09-29' },
  { name: 'रमा एकादशी (Rama Ekadashi 2028)', paksha: 'कृष्ण पक्ष', month: 'कार्तिक', date: '14 अक्टूबर 2028', dateEn: '2028-10-14' },
  { name: 'देवउठनी एकादशी (Prabodhini 2028)', paksha: 'शुक्ल पक्ष', month: 'कार्तिक', date: '28 अक्टूबर 2028', dateEn: '2028-10-28', highlight: true },
  { name: 'उत्पन्ना एकादशी (Utpanna 2028)', paksha: 'कृष्ण पक्ष', month: 'मार्गशीर्ष', date: '13 नवंबर 2028', dateEn: '2028-11-13' },
  { name: 'मोक्षदा एकादशी (Mokshada / गीता जयंती 2028)', paksha: 'शुक्ल पक्ष', month: 'मार्गशीर्ष', date: '27 नवंबर 2028', dateEn: '2028-11-27', highlight: true },
  { name: 'सफला एकादशी (Saphala Ekadashi 2028)', paksha: 'कृष्ण पक्ष', month: 'पौष', date: '13 दिसंबर 2028', dateEn: '2028-12-13' },
  { name: 'पौष पुत्रदा एकादशी (Putrada 2028)', paksha: 'शुक्ल पक्ष', month: 'पौष', date: '27 दिसंबर 2028', dateEn: '2028-12-27' },
];

const FAQS = [
  {
    q: 'एकादशी व्रत का शास्त्रीय और आध्यात्मिक उद्देश्य क्या है?',
    a: 'पद्म पुराण और विष्णु पुराण के अनुसार चंद्रमा की ग्यारहवीं कला (एकादशी) पर मन और जल-तत्त्व का विशेष प्रभाव रहता है। इस दिन अन्न का त्याग कर इंद्रियों को अंतर्मुखी करने से मन में सात्विकता बढ़ती है और चित्त शुद्ध होता है। यह केवल भूखे रहने का नाम नहीं, बल्कि भगवान के समीप निवास (उप-वास) करने का विज्ञान है।',
  },
  {
    q: 'पारण (Parana) क्या है और इसका क्या नियम है?',
    a: 'एकादशी के अगले दिन (द्वादशी तिथि) को सूर्योदय के बाद व्रत खोलने को "पारण" कहते हैं। द्वादशी समाप्त होने से पूर्व और "हरिवासर" (द्वादशी के प्रथम चतुर्थांश) के बीत जाने के बाद पारण करना शास्त्र-सम्मत है।',
  },
  {
    q: 'स्मार्त और वैष्णव एकादशी में क्या अंतर होता है?',
    a: 'स्मार्त परंपरा "अरुणोदय" अथवा सूर्योदय-व्यापिनी एकादशी को स्वीकार करती है, जबकि वैष्णव परंपरा "शुद्धा एकादशी" (जो दशमी से विद्ध न हो) को मानते हैं। यदि दशमी का लेशमात्र भी अंश सूर्योदय से पूर्व हो, तो वैष्णव अगले दिन व्रत करते हैं।',
  },
];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://dharmagranth.dev/panchang/ekadashi/#webpage',
      url: 'https://dharmagranth.dev/panchang/ekadashi/',
      name: 'एकादशी व्रत तिथियाँ 2026–2028 · Ekadashi Dates & Vrata Mahatmya',
      description:
        'वर्ष 2026, 2027 एवं 2028 की समस्त एकादशी तिथियाँ, पारण समय, और पद्म पुराण व विष्णु पुराण के अनुसार एकादशी का शास्त्रीय माहात्म्य।',
      inLanguage: ['hi', 'sa', 'en'],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://dharmagranth.dev/panchang/ekadashi/#faq',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

export default function EkadashiPage() {
  return (
    <main
      className="apple-scope panchang-scope panchang-limb relative min-h-screen bg-dharma-bg text-dharma-text pb-24 overflow-x-clip"
      data-limb="tithis"
    >
      <JsonLd data={JSON_LD} />

      {/* Luminous Hari-Vasara Aura / वैकुण्ठ पावन आभा Backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-12 h-[560px] overflow-hidden select-none -z-10 opacity-70 dark:opacity-45"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-[760px] h-[420px] rounded-full bg-radial from-amber-400/28 via-saffron-500/14 to-transparent blur-3xl" />
        <div className="absolute right-[10%] top-20 w-[520px] h-[340px] rounded-full bg-radial from-emerald-500/18 via-teal-500/10 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-gutter pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Panchang', href: '/panchang/' },
            { label: 'Ekadashi Dates' },
          ]}
        />
      </div>

      <PageHeader
        eyebrow="Hari-Vasara & Vrata Mahatmya"
        eyebrowHi="हरि-वासर एवं व्रत दर्शन"
        title="Ekadashi Vrata Dates (2026–2028)"
        titleHi="एकादशी व्रत तिथियाँ व माहात्म्य"
        lead="पद्म पुराण एवं विष्णु पुराण के अनुसार प्रत्येक मास के शुक्ल व कृष्ण पक्ष की एकादशी तिथि मन, प्राण और इंद्रियों के शुद्धिकरण का परम साधन है।"
        width="wide"
      />

      <PanchangLimbSwitcher activeLimb="tithis" />

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-10 space-y-12">
        {/* Core Principles Bento */}
        <section aria-labelledby="ekadashi-meaning" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-sacred relative rounded-2xl border border-separator/80 bg-surface-elevated/85 p-5 backdrop-blur-xl shadow-xs transition hover:border-tint/40">
            <span className="text-2xl mb-2 block" aria-hidden="true">🌿</span>
            <h3 className="font-serif font-bold text-base text-label-primary">कायिक शुद्धि (Metabolic Alignment)</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-label-secondary">
              चंद्रमा के गुरुत्वाकर्षण और शरीर के जलीय संतुलन को साधने के लिए अन्न का त्याग और सात्विक फलाहार।
            </p>
          </div>
          <div className="card-sacred relative rounded-2xl border border-separator/80 bg-surface-elevated/85 p-5 backdrop-blur-xl shadow-xs transition hover:border-tint/40">
            <span className="text-2xl mb-2 block" aria-hidden="true">📿</span>
            <h3 className="font-serif font-bold text-base text-label-primary">मानसिक एकाग्रता (Mental Sattva)</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-label-secondary">
              दस इंद्रियां और ग्यारहवां मन — इन ग्यारहों को परमात्मा के चिंतन और स्वाध्याय में लगाने का संकल्प।
            </p>
          </div>
          <div className="card-sacred relative rounded-2xl border border-separator/80 bg-surface-elevated/85 p-5 backdrop-blur-xl shadow-xs transition hover:border-tint/40">
            <span className="text-2xl mb-2 block" aria-hidden="true">📖</span>
            <h3 className="font-serif font-bold text-base text-label-primary">शास्त्रीय स्वाध्याय (Scriptural Study)</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-label-secondary">
              श्रीमद्भगवद्गीता के 18 अध्यायों का पाठ, विष्णु सहस्रनाम और नारायण सूक्त का जप।
            </p>
          </div>
        </section>

        {/* Dates Table with Year Filter & ICS Download */}
        <VrataDatesTable
          dates={EKADASHI_DATES}
          title="एकादशी व्रत तिथियाँ (2026–2028)"
          subtitle="भारतीय मानक समय (IST) एवं स्मार्त पञ्चाङ्ग गणना अनुसार"
          vrataType="ekadashi"
        />

        {/* Sacred Mantra & Scriptural Citation */}
        <section
          aria-labelledby="mantra-heading"
          className="tadpatra-card relative rounded-3xl border border-separator/80 bg-surface-elevated/85 p-6 sm:p-8 backdrop-blur-xl shadow-soft overflow-hidden"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-tint mb-3">
            <BookOpen className="size-4" aria-hidden="true" />
            <span>पद्म पुराण एवं विष्णु माहात्म्य</span>
          </div>
          <p lang="sa" className="font-devanagari text-lg sm:text-2xl font-bold leading-relaxed text-label-primary text-center py-4">
            ॐ नमो भगवते वासुदेवाय ॥<br />
            शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं विश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम् ।
          </p>
          <p className="text-xs sm:text-sm text-center text-label-secondary max-w-xl mx-auto mt-2 leading-relaxed">
            पद्म पुराण में श्रीकृष्ण युधिष्ठिर से कहते हैं: &quot;हे राजन्! न गंगा, न काशी, न गया और न ही पुष्कर एकादशी के समान पापनाशक हैं। जो प्राणी श्रद्धापूर्वक एकादशी व्रत करता है, वह परम पद को प्राप्त होता है।&quot;
          </p>
        </section>

        {/* FAQ Accordion */}
        <section aria-labelledby="faq-heading">
          <SectionTitle id="faq-heading" title="FAQ" titleHi="जिज्ञासा एवं समाधान" />
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
            href="/festivals/gita-jayanti/"
            className="liquid-pill inline-flex min-h-11 items-center gap-1.5 rounded-full border border-saffron-600/40 bg-saffron-500/10 hover:bg-saffron-500/20 px-4 py-2 text-xs font-semibold text-saffron-800 dark:text-saffron-300 shadow-xs transition"
          >
            गीता जयंती दर्शन &rarr;
          </Link>
          <Link
            href="/panchang/pradosh/"
            className="liquid-pill inline-flex min-h-11 items-center gap-1.5 rounded-full border border-separator/80 bg-surface-raised hover:bg-fill-tertiary px-4 py-2 text-xs font-semibold text-label-primary shadow-xs transition"
          >
            प्रदोष व्रत तिथियाँ &rarr;
          </Link>
        </section>
      </div>
    </main>
  );
}
