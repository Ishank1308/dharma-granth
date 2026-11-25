import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { PageHeader, SectionTitle } from '@/app/components/apple/PageHeader';
import { PageCover } from '@/app/components/PagePhoto';
import { PanchangLimbSwitcher } from '@/app/panchang/components/PanchangLimbSwitcher';
import { VrataDatesTable } from '@/app/panchang/components/VrataDatesTable';
import { EKADASHI_DATES } from '@/data/ekadashi-dates';
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
        cover={<PageCover photo="vishnu" />}
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
            <h3 className="font-serif font-bold text-base text-label-primary"><span lang="hi" data-bi="hi">शास्त्रीय स्वाध्याय</span><span data-bi="sep"> (</span><span data-bi="en">Scriptural Study</span><span data-bi="sep">)</span></h3>
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
