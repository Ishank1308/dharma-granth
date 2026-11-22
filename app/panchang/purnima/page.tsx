import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { PageHeader, SectionTitle } from '@/app/components/apple/PageHeader';
import { PanchangLimbSwitcher } from '@/app/panchang/components/PanchangLimbSwitcher';
import { VrataDatesTable, type VrataDateItem } from '@/app/panchang/components/VrataDatesTable';
import { JsonLd } from '@/app/components/JsonLd';
import { BookOpen, Moon, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'पूर्णिमा तिथियाँ 2026–2028 · Purnima Dates & Satyanarayan Vrata',
  description:
    'वर्ष 2026, 2027 एवं 2028 की समस्त पूर्णिमा तिथियाँ, सत्यनारायण कथा, चंद्र दर्शन एवं वैदिक पूर्णिमा व्रत का शास्त्रीय महत्व।',
  keywords: [
    'पूर्णिमा तिथियाँ',
    'Purnima dates 2026',
    'Purnima dates 2027',
    'Purnima dates 2028',
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
      'वर्ष 2026, 2027 एवं 2028 की समस्त पूर्णिमा तिथियाँ, सत्यनारायण कथा, चंद्र दर्शन एवं वैदिक पूर्णिमा व्रत का शास्त्रीय महत्व।',
    url: 'https://dharmagranth.dev/panchang/purnima/',
  },
};

const PURNIMA_DATES: VrataDateItem[] = [
  // 2026
  { name: 'कार्तिक पूर्णिमा (त्रिपुरारी पूर्णिमा / देव दीपावली)', month: 'कार्तिक', date: '24 नवंबर 2026', dateEn: '2026-11-24', highlight: true },
  { name: 'मार्गशीर्ष पूर्णिमा (दत्तात्रेय जयंती)', month: 'मार्गशीर्ष', date: '23 दिसंबर 2026', dateEn: '2026-12-23' },
  // 2027
  { name: 'पौष पूर्णिमा (शाकंभरी पूर्णिमा / माघ स्नान आरंभ)', month: 'पौष', date: '22 जनवरी 2027', dateEn: '2027-01-22' },
  { name: 'माघ पूर्णिमा (माघी पूर्णिमा / कुंभ पर्व स्नान)', month: 'माघ', date: '20 फरवरी 2027', dateEn: '2027-02-20', highlight: true },
  { name: 'फाल्गुन पूर्णिमा (होलिका दहन / लक्ष्मी जयंती)', month: 'फाल्गुन', date: '22 मार्च 2027', dateEn: '2027-03-22', highlight: true },
  { name: 'चैत्र पूर्णिमा (हनुमान जयंती / चैत्री पूर्णिमा)', month: 'चैत्र', date: '21 अप्रैल 2027', dateEn: '2027-04-21', highlight: true },
  { name: 'वैशाख पूर्णिमा (बुद्ध पूर्णिमा / कूर्म जयंती)', month: 'वैशाख', date: '20 मई 2027', dateEn: '2027-05-20', highlight: true },
  { name: 'ज्येष्ठ पूर्णिमा (वट पूर्णिमा / कबीर जयंती)', month: 'ज्येष्ठ', date: '19 जून 2027', dateEn: '2027-06-19' },
  { name: 'आषाढ़ पूर्णिमा (गुरु पूर्णिमा / वेदव्यास जयंती)', month: 'आषाढ़', date: '18 जुलाई 2027', dateEn: '2027-07-18', highlight: true },
  { name: 'श्रावण पूर्णिमा (रक्षाबंधन / हयग्रीव जयंती / संस्कृत दिवस)', month: 'श्रावण', date: '17 अगस्त 2027', dateEn: '2027-08-17', highlight: true },
  { name: 'भाद्रपद पूर्णिमा (श्राद्ध पूर्णिमा / उमा महेश्वर व्रत)', month: 'भाद्रपद', date: '15 सितंबर 2027', dateEn: '2027-09-15' },
  { name: 'अश्विन पूर्णिमा (शरद पूर्णिमा / कोजागरी लक्ष्मी पूजा)', month: 'अश्विन', date: '14 अक्टूबर 2027', dateEn: '2027-10-14', highlight: true },
  { name: 'कार्तिक पूर्णिमा (देव दीपावली 2027)', month: 'कार्तिक', date: '13 नवंबर 2027', dateEn: '2027-11-13', highlight: true },
  { name: 'मार्गशीर्ष पूर्णिमा (दत्तात्रेय जयंती 2027)', month: 'मार्गशीर्ष', date: '13 दिसंबर 2027', dateEn: '2027-12-13' },
  // 2028
  { name: 'पौष पूर्णिमा (शाकंभरी जयंती 2028)', month: 'पौष', date: '12 जनवरी 2028', dateEn: '2028-01-12' },
  { name: 'माघ पूर्णिमा (माघी पूर्णिमा 2028)', month: 'माघ', date: '10 फरवरी 2028', dateEn: '2028-02-10', highlight: true },
  { name: 'फाल्गुन पूर्णिमा (होलिका दहन 2028)', month: 'फाल्गुन', date: '11 मार्च 2028', dateEn: '2028-03-11', highlight: true },
  { name: 'चैत्र पूर्णिमा (हनुमान जयंती 2028)', month: 'चैत्र', date: '09 अप्रैल 2028', dateEn: '2028-04-09', highlight: true },
  { name: 'वैशाख पूर्णिमा (बुद्ध पूर्णिमा 2028)', month: 'वैशाख', date: '09 मई 2028', dateEn: '2028-05-09', highlight: true },
  { name: 'ज्येष्ठ पूर्णिमा (वट पूर्णिमा 2028)', month: 'ज्येष्ठ', date: '07 जून 2028', dateEn: '2028-06-07' },
  { name: 'आषाढ़ पूर्णिमा (गुरु पूर्णिमा 2028)', month: 'आषाढ़', date: '07 जुलाई 2028', dateEn: '2028-07-07', highlight: true },
  { name: 'श्रावण पूर्णिमा (रक्षाबंधन 2028)', month: 'श्रावण', date: '05 अगस्त 2028', dateEn: '2028-08-05', highlight: true },
  { name: 'भाद्रपद पूर्णिमा (श्राद्ध पूर्णिमा 2028)', month: 'भाद्रपद', date: '03 सितंबर 2028', dateEn: '2028-09-03' },
  { name: 'अश्विन पूर्णिमा (शरद पूर्णिमा 2028)', month: 'अश्विन', date: '03 अक्टूबर 2028', dateEn: '2028-10-03', highlight: true },
  { name: 'कार्तिक पूर्णिमा (देव दीपावली 2028)', month: 'कार्तिक', date: '01 नवंबर 2028', dateEn: '2028-11-01', highlight: true },
  { name: 'मार्गशीर्ष पूर्णिमा (दत्तात्रेय जयंती 2028)', month: 'मार्गशीर्ष', date: '01 दिसंबर 2028', dateEn: '2028-12-01' },
  { name: 'पौष पूर्णिमा (शाकंभरी जयंती 2028)', month: 'पौष', date: '31 दिसंबर 2028', dateEn: '2028-12-31', highlight: true },
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
  {
    q: 'पूर्णिमा पर चंद्र दर्शन एवं अर्घ्य देने का शास्त्रीय नियम क्या है?',
    a: 'सूर्यास्त के उपरांत जब चंद्रोदय हो, तब तांबे या चांदी के पात्र में जल, दूध, श्वेत पुष्प और अक्षत लेकर "ॐ सों सोमाय नमः" अथवा "ॐ क्षीरपुत्राय विद्महे अमृततत्त्वाय धीमहि तन्नो चन्द्रः प्रचोदयात्" मंत्र से चंद्रमा को अर्घ्य दिया जाता है। यह मानसिक शांति और नेत्र-ज्योति के लिए अत्यंत मंगलकारी माना गया है।',
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
        'वर्ष 2026, 2027 एवं 2028 की समस्त पूर्णिमा तिथियाँ, सत्यनारायण कथा, चंद्र दर्शन एवं वैदिक पूर्णिमा व्रत का शास्त्रीय महत्व।',
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
    <main
      className="apple-scope panchang-scope panchang-limb relative min-h-screen bg-dharma-bg text-dharma-text pb-24 overflow-x-clip"
      data-limb="tithis"
    >
      <JsonLd data={JSON_LD} />

      {/* Luminous Lunar Aura / पूर्णिमा चंद्र-आभा Backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-12 h-[560px] overflow-hidden select-none -z-10 opacity-70 dark:opacity-40"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-[780px] h-[420px] rounded-full bg-radial from-amber-300/25 via-saffron-400/12 to-transparent blur-3xl" />
        <div className="absolute right-[12%] top-24 w-[520px] h-[340px] rounded-full bg-radial from-amber-400/20 via-orange-400/10 to-transparent blur-3xl" />
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
        eyebrow="Full Moon & Sacred Vrata"
        eyebrowHi="सत्यनारायण व्रत व चंद्र दर्शन"
        title="Purnima Calendar (2026–2028)"
        titleHi="पूर्णिमा तिथियाँ व सत्यनारायण व्रत माहात्म्य"
        lead="पूर्णिमा वह तिथि है जब चंद्रमा अपनी समस्त सोलह कलाओं से परिपूर्ण होकर आकाश को अमृतमयी चाँदनी से आलोकित करता है। यह श्री सत्यनारायण भगवान की कथा, उपवास, गंगा स्नान और दीपदान का परम पावन दिन है।"
        width="wide"
      />

      <PanchangLimbSwitcher activeLimb="tithis" />

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-10 space-y-12">
        {/* Core Principles Bento */}
        <section aria-labelledby="purnima-pillars" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-sacred relative rounded-2xl border border-separator/80 bg-surface-elevated/85 p-5 backdrop-blur-xl shadow-xs transition hover:border-tint/40">
            <span className="text-2xl mb-2 block" aria-hidden="true">🌕</span>
            <h3 className="font-serif font-bold text-base text-label-primary">पूर्ण कला व मनःशांति</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-label-secondary">
              चंद्रमा के मनस्-तत्त्व से जुड़े होने के कारण पूर्णिमा पर ध्यान व उपवास अंतःकरण को सात्विक शीतलता प्रदान करता है।
            </p>
          </div>

          <div className="card-sacred relative rounded-2xl border border-separator/80 bg-surface-elevated/85 p-5 backdrop-blur-xl shadow-xs transition hover:border-tint/40">
            <span className="text-2xl mb-2 block" aria-hidden="true">🪔</span>
            <h3 className="font-serif font-bold text-base text-label-primary">सत्यनारायण व्रत व कथा</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-label-secondary">
              स्कंद पुराण के अनुसार सत्यनारायण भगवान की कथा व पंचामृत-पंजीरी प्रसाद से सांसारिक क्लेशों का शमन होता है।
            </p>
          </div>

          <div className="card-sacred relative rounded-2xl border border-separator/80 bg-surface-elevated/85 p-5 backdrop-blur-xl shadow-xs transition hover:border-tint/40">
            <span className="text-2xl mb-2 block" aria-hidden="true">🌊</span>
            <h3 className="font-serif font-bold text-base text-label-primary">तीर्थ स्नान व दीपदान</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-label-secondary">
              पवित्र नदियों (गंगा, नर्मदा, यमुना) में स्नान और सायंकाल जलाशयों व मंदिरों में दीपदान से असीम पुण्य लाभ।
            </p>
          </div>
        </section>

        {/* Dates Table with Year Filter & ICS Download */}
        <VrataDatesTable
          dates={PURNIMA_DATES}
          title="पूर्णिमा व्रत एवं उत्सव तिथियाँ (2026–2028)"
          subtitle="सत्यनारायण कथा, चंद्र अर्घ्य, देव दीपावली व पावन स्नान पर्व"
          vrataType="purnima"
        />

        {/* Sacred Shloka Card */}
        <section
          aria-labelledby="mantra-heading"
          className="tadpatra-card relative rounded-3xl border border-separator/80 bg-surface-elevated/85 p-6 sm:p-8 backdrop-blur-xl shadow-soft overflow-hidden"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-tint mb-3">
            <BookOpen className="size-4" aria-hidden="true" />
            <span>ऋग्वेद एवं पुरुष सूक्त संदर्भ</span>
          </div>
          <p lang="sa" className="font-devanagari text-lg sm:text-2xl font-bold leading-relaxed text-label-primary text-center py-4">
            चन्द्रमा मनसो जातश्चक्षोः सूर्यो अजायत ।<br />
            मुखादिन्द्रश्चाग्निश्च प्राणाद्वायुरजायत ॥
          </p>
          <p className="text-xs sm:text-sm text-center text-label-secondary max-w-xl mx-auto mt-2 leading-relaxed">
            पुरुष सूक्त (ऋग्वेद 10.90): विराट परमेश्वर के मन से चंद्रमा का प्रादुर्भाव हुआ। इसीलिए पूर्णिमा तिथि पर अंतःकरण की शुद्धि और मन की निर्मलता के लिए विशेष ध्यान का विधान है।
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
            href="/panchang/amavasya/"
            className="liquid-pill inline-flex min-h-11 items-center gap-1.5 rounded-full border border-separator/80 bg-surface-raised hover:bg-fill-tertiary px-4 py-2 text-xs font-semibold text-label-primary shadow-xs transition"
          >
            अमावस्या तिथियाँ देखें &rarr;
          </Link>
          <Link
            href="/festivals/guru-purnima/"
            className="liquid-pill inline-flex min-h-11 items-center gap-1.5 rounded-full border border-amber-600/40 bg-amber-500/10 hover:bg-amber-500/20 px-4 py-2 text-xs font-semibold text-amber-800 dark:text-amber-300 shadow-xs transition"
          >
            गुरु पूर्णिमा दर्शन &rarr;
          </Link>
        </section>
      </div>
    </main>
  );
}
