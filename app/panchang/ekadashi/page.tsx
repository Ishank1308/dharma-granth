import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { SectionTitle } from '@/app/components/apple/PageHeader';
import { JsonLd } from '@/app/components/JsonLd';
import { Calendar, Clock, BookOpen, CheckCircle2, ChevronRight, HelpCircle, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'एकादशी व्रत तिथियाँ २०२६–२०२८ · Ekadashi Dates & Vrata Mahatmya',
  description:
    'वर्ष २०२६, २०२७ एवं २०२८ की समस्त एकादशी तिथियाँ, पारण समय, उपवास नियम, और पद्म पुराण एवं विष्णु पुराण के अनुसार एकादशी व्रत का शास्त्रीय माहात्म्य।',
  keywords: [
    'एकादशी व्रत',
    'Ekadashi dates 2026',
    'Ekadashi dates 2027',
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
    title: 'एकादशी व्रत तिथियाँ २०२६–२०२८ · Ekadashi Dates & Vrata Mahatmya — Dharma Granth',
    description:
      'वर्ष २०२६, २०२७ एवं २०२८ की समस्त एकादशी तिथियाँ, पारण समय, और पद्म पुराण व विष्णु पुराण के अनुसार एकादशी का शास्त्रीय माहात्म्य।',
    url: 'https://dharmagranth.dev/panchang/ekadashi/',
  },
};

const EKADASHI_DATES = [
  { name: 'उत्पन्ना एकादशी (Utpanna)', paksha: 'कृष्ण पक्ष', month: 'मार्गशीर्ष', date: '०५ दिसंबर २०२६', dateEn: '2026-12-05' },
  { name: 'मोक्षदा एकादशी (Mokshada / गीता जयंती)', paksha: 'शुक्ल पक्ष', month: 'मार्गशीर्ष', date: '२० दिसंबर २०२६', dateEn: '2026-12-20', highlight: true },
  { name: 'सफला एकादशी (Saphala)', paksha: 'कृष्ण पक्ष', month: 'पौष', date: '०४ जनवरी २०२७', dateEn: '2027-01-04' },
  { name: 'पुत्रदा एकादशी (Putrada)', paksha: 'शुक्ल पक्ष', month: 'पौष', date: '१८ जनवरी २०२७', dateEn: '2027-01-18' },
  { name: 'षट्तिला एकादशी (Shattila)', paksha: 'कृष्ण पक्ष', month: 'माघ', date: '०२ फरवरी २०२७', dateEn: '2027-02-02' },
  { name: 'जया एकादशी (Jaya)', paksha: 'शुक्ल पक्ष', month: 'माघ', date: '१७ फरवरी २०२७', dateEn: '2027-02-17' },
  { name: 'विजया एकादशी (Vijaya)', paksha: 'कृष्ण पक्ष', month: 'फाल्गुन', date: '०४ मार्च २०२७', dateEn: '2027-03-04' },
  { name: 'आमलकी एकादशी (Amalaki)', paksha: 'शुक्ल पक्ष', month: 'फाल्गुन', date: '१९ मार्च २०२७', dateEn: '2027-03-19' },
  { name: 'पापमोचिनी एकादशी (Papmochini)', paksha: 'कृष्ण पक्ष', month: 'चैत्र', date: '०३ अप्रैल २०२७', dateEn: '2027-04-03' },
  { name: 'कामदा एकादशी (Kamada)', paksha: 'शुक्ल पक्ष', month: 'चैत्र', date: '१७ अप्रैल २०२७', dateEn: '2027-04-17' },
  { name: 'वरूथिनी एकादशी (Varuthini)', paksha: 'कृष्ण पक्ष', month: 'वैशाख', date: '०२ मई २०२७', dateEn: '2027-05-02' },
  { name: 'मोहिनी एकादशी (Mohini)', paksha: 'शुक्ल पक्ष', month: 'वैशाख', date: '१६ मई २०२७', dateEn: '2027-05-16' },
  { name: 'अपरा एकादशी (Apara)', paksha: 'कृष्ण पक्ष', month: 'ज्येष्ठ', date: '३१ मई २०२७', dateEn: '2027-05-31' },
  { name: 'निर्जला एकादशी (Nirjala)', paksha: 'शुक्ल पक्ष', month: 'ज्येष्ठ', date: '१५ जून २०२७', dateEn: '2027-06-15', highlight: true },
  { name: 'योगिनी एकादशी (Yogini)', paksha: 'कृष्ण पक्ष', month: 'आषाढ़', date: '३० जून २०२७', dateEn: '2027-06-30' },
  { name: 'देवशयनी एकादशी (Devshayani / चातुर्मास)', paksha: 'शुक्ल पक्ष', month: 'आषाढ़', date: '१५ जुलाई २०२७', dateEn: '2027-07-15', highlight: true },
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
      name: 'एकादशी व्रत तिथियाँ २०२६–२०२८ · Ekadashi Dates & Vrata Mahatmya',
      description:
        'वर्ष २०२६, २०२७ एवं २०२८ की समस्त एकादशी तिथियाँ, पारण समय, और पद्म पुराण व विष्णु पुराण के अनुसार एकादशी का शास्त्रीय माहात्म्य।',
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
    <main className="min-h-screen bg-dharma-bg text-dharma-text pb-20">
      <JsonLd data={JSON_LD} />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Panchang', href: '/panchang/' },
          { label: 'Ekadashi Dates' },
        ]}
      />

      {/* Hero Header */}
      <section className="border-b border-dharma-border bg-gradient-to-b from-amber-50/70 via-dharma-card to-dharma-bg py-12 px-4 sm:px-6 dark:from-amber-950/20">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-saffron-700 bg-saffron-100/80 px-3.5 py-1.5 rounded-full dark:bg-saffron-900/40 dark:text-saffron-300 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>हरि-वासर एवं व्रत दर्शन</span>
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-dharma-text">
            एकादशी व्रत तिथियाँ व माहात्म्य
          </h1>
          <p className="mt-2 text-base sm:text-lg text-saffron-800 dark:text-saffron-300 font-serif">
            Ekadashi Vrata: Classical Dates, Parana Rules &amp; Scriptural Wisdom
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-dharma-muted">
            पद्म पुराण एवं विष्णु पुराण के अनुसार प्रत्येक मास के शुक्ल व कृष्ण पक्ष की एकादशी तिथि मन, प्राण और इंद्रियों के शुद्धिकरण का परम साधन है।
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-10 space-y-12">
        {/* Core Principles Bento */}
        <section aria-labelledby="ekadashi-meaning" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-dharma-border bg-dharma-card p-5 shadow-xs">
            <span className="text-2xl mb-2 block">🌿</span>
            <h3 className="font-serif font-bold text-base text-dharma-text">कायिक शुद्धि (Metabolic Alignment)</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-dharma-muted">
              चंद्रमा के गुरुत्वाकर्षण और शरीर के जलीय संतुलन को साधने के लिए अन्न का त्याग और सात्विक फलाहार।
            </p>
          </div>
          <div className="rounded-2xl border border-dharma-border bg-dharma-card p-5 shadow-xs">
            <span className="text-2xl mb-2 block">📿</span>
            <h3 className="font-serif font-bold text-base text-dharma-text">मानसिक एकाग्रता (Mental Sattva)</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-dharma-muted">
              दस इंद्रियां और ग्यारहवां मन — इन ग्यारहों को परमात्मा के चिंतन और स्वाध्याय में लगाने का संकल्प।
            </p>
          </div>
          <div className="rounded-2xl border border-dharma-border bg-dharma-card p-5 shadow-xs">
            <span className="text-2xl mb-2 block">📖</span>
            <h3 className="font-serif font-bold text-base text-dharma-text">शास्त्रीय स्वाध्याय (Scriptural Study)</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-dharma-muted">
              श्रीमद्भगवद्गीता के १८ अध्यायों का पाठ, विष्णु सहस्रनाम और नारायण सूक्त का जप।
            </p>
          </div>
        </section>

        {/* Dates Table */}
        <section aria-labelledby="dates-heading" className="rounded-2xl border border-dharma-border bg-dharma-card overflow-hidden shadow-xs">
          <div className="p-5 sm:p-6 border-b border-dharma-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 id="dates-heading" className="font-serif text-xl font-bold text-dharma-text">
                आगामी एकादशी व्रत तिथियाँ (२०२६–२०२७)
              </h2>
              <p className="text-xs text-dharma-muted mt-0.5">
                भारतीय मानक समय (IST) एवं स्मार्त पञ्चाङ्ग गणना अनुसार
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
            {EKADASHI_DATES.map((item) => (
              <div
                key={item.dateEn}
                className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition hover:bg-saffron-50/40 dark:hover:bg-saffron-950/20 ${
                  item.highlight ? 'bg-amber-50/50 dark:bg-amber-950/30' : ''
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm sm:text-base text-dharma-text">
                      {item.name}
                    </span>
                    {item.highlight && (
                      <span className="text-2xs rounded-full bg-saffron-100 px-2 py-0.5 font-bold text-saffron-800 dark:bg-saffron-900/60 dark:text-saffron-300">
                        महापर्व
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-dharma-muted mt-0.5">
                    {item.month} मास · {item.paksha}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="font-mono text-sm font-semibold text-saffron-800 dark:text-saffron-300 block">
                    {item.date}
                  </span>
                  <span className="text-2xs text-dharma-muted">{item.dateEn}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sacred Mantra & Scriptural Citation */}
        <section aria-labelledby="mantra-heading" className="rounded-2xl border border-dharma-border bg-gradient-to-br from-amber-50/50 via-dharma-card to-dharma-bg p-6 dark:from-amber-950/20 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400 mb-3">
            <BookOpen className="h-4 w-4" />
            <span>शास्त्रीय श्लोक व जप</span>
          </div>
          <p lang="sa" className="font-devanagari text-lg sm:text-xl font-bold leading-relaxed text-dharma-text text-center py-3">
            ॐ नमो भगवते वासुदेवाय ॥<br />
            शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं विश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम् ।
          </p>
          <p className="text-xs text-center text-dharma-muted max-w-xl mx-auto mt-2 leading-relaxed">
            पद्म पुराण में श्रीकृष्ण युधिष्ठिर से कहते हैं: "हे राजन्! न गंगा, न काशी, न गया और न ही पुष्कर एकादशी के समान पापनाशक हैं। जो प्राणी श्रद्धापूर्वक एकादशी व्रत करता है, वह परम पद को प्राप्त होता है।"
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
            href="/festivals/gita-jayanti/"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-saffron-600/40 bg-saffron-50 px-4 py-2 text-xs font-semibold text-saffron-800 hover:bg-saffron-100 transition dark:bg-saffron-950/40 dark:text-saffron-300"
          >
            गीता जयंती दर्शन &rarr;
          </Link>
        </section>
      </div>
    </main>
  );
}
