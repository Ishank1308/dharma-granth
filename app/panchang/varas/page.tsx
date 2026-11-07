import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { VARA_DATA, type VaraMeta } from '@/lib/panchang';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { PageHeader, SectionTitle } from '@/app/components/apple/PageHeader';
import { JsonLd } from '@/app/components/JsonLd';
import {
  Sun,
  Moon,
  Sparkles,
  Compass,
  ArrowRight,
  BookOpen,
  Calendar,
  Layers,
  HelpCircle,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export const metadata: Metadata = {
  title: '7 Vedic Varas (सप्त वासर) — Planetary Weekdays, Lords & Observances',
  description:
    'Comprehensive guide to the 7 Vedic planetary weekdays (Varas) of Panchang — Ravivara to Shanivara. Ruling Graha lords, Maha-Bhoota elements, Hora sequence, sacred fasts, and spiritual study.',
  keywords: [
    '7 varas in vedic astrology',
    'vedic weekdays',
    'sapta vara panchang',
    'ravivara somavara mangalavara budhavara guruvara shukravara shanivara',
    'graha lords weekdays',
    'hora system vedic astronomy',
    'somvar vrat importance',
    'shanivar vrat rules',
    'Dharma Granth Panchang',
  ],
  alternates: { canonical: '/panchang/varas/' },
  openGraph: {
    images: [
      {
        url: '/og/varas.png',
        width: 1200,
        height: 630,
        alt: '7 Vedic Varas — Planetary Weekdays of Panchang',
      },
    ],
    title: '7 Vedic Varas (सप्त वासर) — Planetary Weekdays, Lords & Observances — Dharma Granth',
    description:
      'Comprehensive guide to the 7 Vedic planetary weekdays (Varas) of Panchang — Ravivara to Shanivara. Ruling Graha lords, Maha-Bhoota elements, Hora sequence, sacred fasts, and spiritual study.',
    url: 'https://dharmagranth.dev/panchang/varas/',
  },
};

const FAQS = [
  {
    q: 'पंचांग में वार (Vara) का क्या महत्व है?',
    a: 'पंचांग के पांच अंगों में वार दूसरा प्रमुख अंग है। शास्त्रीय मान्यता के अनुसार वार का प्रभाव व्यक्ति की आयु (दीर्घायु) और शारीरिक ऊर्जा पर होता है ("वारादायुरुवाप्नोति")। प्रत्येक वार का एक अधिपति ग्रह होता है, जो उस दिन के प्राकृतिक स्वभाव और अनुष्ठान को दिशा देता है।',
  },
  {
    q: 'सप्ताह के सात दिनों का क्रम (रविवार से शनिवार) कैसे निर्धारित हुआ?',
    a: 'सूर्य सिद्धांत और बृहत्संहिता के अनुसार यह क्रम "होरा" (Hora — अहोरात्र का २४वां भाग) पर आधारित है। मंद गति वाले ग्रहों से तीव्र गति वाले ग्रहों के क्रम (शनि, गुरु, मंगल, सूर्य, शुक्र, बुध, चंद्र) में प्रत्येक घंटे का एक स्वामी होता है। सूर्योदय के समय जिस ग्रह की होरा होती है, वही उस पूरे दिन (वार) का अधिपति कहलाता है।',
  },
  {
    q: 'वैदिक वार का आरंभ किस समय माना जाता है?',
    a: 'ग्रेगोरियन कैलेंडर का दिन मध्यरात्रि (12:00 AM) से शुरू होता है, जबकि वैदिक परंपरा में दिन का आरंभ स्थानीय सूर्योदय से अगले सूर्योदय तक माना जाता है। इसे "सावन दिन" या "वार" कहते हैं।',
  },
  {
    q: 'क्या प्रत्येक वार के लिए विशेष व्रत और स्तोत्र निर्धारित हैं?',
    a: 'हाँ, प्रत्येक वार के अधिष्ठाता देवता और ग्रह के अनुरूप व्रत विधान हैं — जैसे सोमवार को शिव आराधना व सोलह सोमवार व्रत, मंगलवार को हनुमान जी व भौम व्रत, गुरुवार को देवगुरु व विष्णु आराधना, और शनिवार को शनि व भैरव शांति।',
  },
];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://dharmagranth.dev/panchang/varas/#webpage',
      url: 'https://dharmagranth.dev/panchang/varas/',
      name: '7 Vedic Varas (सप्त वासर) — Planetary Weekdays, Lords & Observances',
      description:
        'Comprehensive guide to the 7 Vedic planetary weekdays (Varas) of Panchang — Ravivara to Shanivara. Ruling Graha lords, Maha-Bhoota elements, Hora sequence, sacred fasts, and spiritual study.',
      inLanguage: ['hi', 'sa', 'en'],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://dharmagranth.dev/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Panchang',
          item: 'https://dharmagranth.dev/panchang/',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: '7 Vedic Varas (सप्त वासर)',
          item: 'https://dharmagranth.dev/panchang/varas/',
        },
      ],
    },
    {
      '@type': 'ItemList',
      itemListElement: VARA_DATA.map((v, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `${v.name} (${v.nameHi})`,
        url: `https://dharmagranth.dev/panchang/varas/${v.slug}/`,
      })),
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://dharmagranth.dev/panchang/varas/#faq',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

export default function VarasDirectoryPage() {
  return (
    <main className="apple-scope min-h-screen bg-dharma-bg">
      <JsonLd data={JSON_LD} />

      <div className="mx-auto max-w-7xl px-gutter pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Panchang', href: '/panchang/' },
            { label: '7 Vedic Varas (सप्त वासर)' },
          ]}
        />
      </div>

      <PageHeader
        eyebrow="The 5 Limbs of Panchanga · Limb 2"
        eyebrowHi="पंचांग का द्वितीय अंग · वार (वासर)"
        title="7 Vedic Varas"
        titleHi="सप्त वासर — ग्रह अधिपति, तत्त्व एवं शास्त्रीय साधना"
        lead="Explore the seven planetary solar weekdays of Vedic astronomy and the classical Hora system. Understand their celestial lords, cosmic elements (Maha-Bhootas), traditional fasts, and spiritual study guidelines."
        width="wide"
      />

      <section className="mx-auto max-w-7xl px-gutter pt-8 pb-16 space-y-16">
        {/* ─── 7 VARAS MASTER GRID ────────────────────────────────────────── */}
        <div>
          <SectionTitle
            id="varas-grid"
            size="title-2"
            eyebrow="Planetary Weekdays Directory"
            eyebrowHi="सातों वारों का शास्त्रीय परिचय"
            title="The Seven Planetary Days"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VARA_DATA.map((vara) => (
              <Link
                key={vara.slug}
                href={`/panchang/varas/${vara.slug}/`}
                className="group rounded-2xl border border-dharma-border bg-dharma-card p-6 flex flex-col justify-between hover:border-dharma-saffron hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <div>
                  {/* Top Bar: Index & Planetary Lord */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-dharma-saffron/10 text-dharma-saffron font-bold text-footnote">
                      {vara.index + 1}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-dharma-bg border border-dharma-border px-3 py-1 text-caption-1 font-semibold text-dharma-text">
                      {vara.grahaLordHi}
                    </span>
                  </div>

                  {/* Name & Title */}
                  <div className="mt-4">
                    <h3 className="text-title-2 font-bold text-dharma-text group-hover:text-dharma-saffron transition-colors">
                      {vara.nameHi}
                    </h3>
                    <div className="text-footnote font-medium text-dharma-muted">
                      {vara.name} · {vara.transliteration}
                    </div>
                  </div>

                  {/* Badges: Element & Guna */}
                  <div className="mt-3 flex flex-wrap gap-2 text-caption-2">
                    <span className="rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 px-2 py-0.5 font-medium">
                      तत्त्व: {vara.elementHi}
                    </span>
                    <span className="rounded-md bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 font-medium">
                      गुण: {vara.gunaHi}
                    </span>
                    <span className="rounded-md bg-slate-500/10 text-slate-800 dark:text-slate-300 px-2 py-0.5 font-medium">
                      रत्न: {vara.gemstoneHi}
                    </span>
                  </div>

                  {/* Explanation */}
                  <p className="mt-4 text-footnote text-dharma-muted leading-relaxed line-clamp-3">
                    {vara.explanation}
                  </p>

                  {/* Sacred Fasts Preview */}
                  <div className="mt-4 pt-3 border-t border-dharma-border/60">
                    <div className="text-[11px] font-semibold text-dharma-text uppercase tracking-wider mb-1">
                      प्रमुख व्रत व पर्व
                    </div>
                    <div className="text-caption-1 text-dharma-muted truncate">
                      {vara.sacredFasts.join(' · ')}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-5 pt-3 border-t border-dharma-border flex items-center justify-between text-caption-1 font-semibold text-dharma-saffron">
                  <span>पूर्ण विवरण व स्तोत्र पढ़ें</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ─── CANONICAL FOUNDATIONS OF VARA ─────────────────────────────── */}
        <section className="border-t border-dharma-border pt-12 space-y-12">
          <div>
            <SectionTitle
              id="vara-astronomy"
              size="title-2"
              eyebrow="Astronomical & Scriptural Foundation"
              eyebrowHi="होरा चक्र और वार-गणना का विज्ञान"
              title="The Cosmic Science of Planetary Days"
            />
            <p className="mt-2 max-w-3xl text-body leading-relaxed text-dharma-muted">
              In Vedic cosmology, time is not an arbitrary mechanical progression. It is a living, rhythmic interaction between planetary fields of consciousness and the human psycho-physical organism.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="text-subhead font-bold text-dharma-text">होरा चक्र (The 24 Horas)</h3>
                <p className="mt-2 text-footnote text-dharma-muted leading-relaxed">
                  A solar day is divided into 24 Horas. Planets rule successive hours ordered by orbital speed: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon. The planet governing the sunrise hour commands the day.
                </p>
              </div>

              <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-4">
                  <Sun className="h-5 w-5" />
                </div>
                <h3 className="text-subhead font-bold text-dharma-text">सावन दिन (Sunrise to Sunrise)</h3>
                <p className="mt-2 text-footnote text-dharma-muted leading-relaxed">
                  Unlike midnight-to-midnight civil dates, a Vedic Vāra endures from one local sunrise to the next. The ruling planet’s vibration permeates all activities throughout that period.
                </p>
              </div>

              <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-subhead font-bold text-dharma-text">वारादायुरुवाप्नोति (Longevity & Vitality)</h3>
                <p className="mt-2 text-footnote text-dharma-muted leading-relaxed">
                  Classical Jyotisha treatises affirm that aligning daily actions with the day’s planetary lord preserves physical vitality, enhances immunity, and grants long life (*Ayush*).
                </p>
              </div>
            </div>
          </div>

          {/* Quick Limbs Directory Cross-links */}
          <div>
            <SectionTitle
              id="all-limbs"
              size="title-2"
              eyebrow="Explore All 5 Limbs"
              eyebrowHi="पंचांग के पाँचों अंग"
              title="The Complete Panchanga System"
            />
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/panchang/tithis/"
                className="group rounded-2xl border border-dharma-border bg-dharma-card p-5 hover:border-dharma-saffron hover:shadow-md transition-all"
              >
                <div className="text-2xl mb-2">🌓</div>
                <h4 className="text-subhead font-bold text-dharma-text group-hover:text-dharma-saffron transition-colors">
                  १. तिथि (16 Tithis)
                </h4>
                <p className="mt-1 text-caption-1 text-dharma-muted">
                  प्रतिपदा से पूर्णिमा व अमावस्या — नन्दा, भद्रा, जया, रिक्ता, पूर्णा वर्ग।
                </p>
              </Link>

              <Link
                href="/panchang/nakshatras/"
                className="group rounded-2xl border border-dharma-border bg-dharma-card p-5 hover:border-dharma-saffron hover:shadow-md transition-all"
              >
                <div className="text-2xl mb-2">✨</div>
                <h4 className="text-subhead font-bold text-dharma-text group-hover:text-dharma-saffron transition-colors">
                  ३. नक्षत्र (27 Nakshatras)
                </h4>
                <p className="mt-1 text-caption-1 text-dharma-muted">
                  अश्विनी से रेवती — २७ चंद्र नक्षत्र, अधिष्ठाता देवता व ग्रह स्वामी।
                </p>
              </Link>

              <Link
                href="/panchang/yogas/"
                className="group rounded-2xl border border-dharma-border bg-dharma-card p-5 hover:border-dharma-saffron hover:shadow-md transition-all"
              >
                <div className="text-2xl mb-2">☀️</div>
                <h4 className="text-subhead font-bold text-dharma-text group-hover:text-dharma-saffron transition-colors">
                  ४. योग (27 Yogas)
                </h4>
                <p className="mt-1 text-caption-1 text-dharma-muted">
                  विष्कम्भ से वैधृति — सौर-चान्द्र संयोग और चित्त शुद्धि के नियम।
                </p>
              </Link>

              <Link
                href="/panchang/karanas/"
                className="group rounded-2xl border border-dharma-border bg-dharma-card p-5 hover:border-dharma-saffron hover:shadow-md transition-all"
              >
                <div className="text-2xl mb-2">⏳</div>
                <h4 className="text-subhead font-bold text-dharma-text group-hover:text-dharma-saffron transition-colors">
                  ५. करण (11 Karanas)
                </h4>
                <p className="mt-1 text-caption-1 text-dharma-muted">
                  ७ चर व ४ स्थिर करण — विष्टि (भद्रा) और कर्म शुद्धि का विधान।
                </p>
              </Link>
            </div>
          </div>

          {/* ─── FAQ SECTION ────────────────────────────────────────────── */}
          <div>
            <SectionTitle
              id="varas-faq"
              size="title-2"
              eyebrow="Clarifications & Traditions"
              eyebrowHi="प्रायः पूछे जाने वाले प्रश्न"
              title="Frequently Asked Questions"
            />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-dharma-border bg-dharma-card p-6 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start gap-2.5">
                      <HelpCircle className="h-5 w-5 text-dharma-saffron flex-shrink-0 mt-0.5" />
                      <h4 className="text-subhead font-bold text-dharma-text">
                        {faq.q}
                      </h4>
                    </div>
                    <p className="text-footnote text-dharma-muted leading-relaxed pl-7">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
