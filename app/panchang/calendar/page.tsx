import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { PageHeader, SectionTitle } from '@/app/components/apple/PageHeader';
import { JsonLd } from '@/app/components/JsonLd';
import { CalendarClient } from './CalendarClient';
import {
  Calendar,
  Clock,
  Compass,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Moon,
  Sun,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hindu Festival Calendar 2026–2028 · Daily Panchang, Ekadashi & Vratas',
  description:
    'Comprehensive monthly Vedic lunisolar calendar for 2026, 2027, and 2028. Explore daily Udaya Tithi, Nakshatra, Yoga, Karana, sacred Ekadashi fasts, Pradosha twilights, Purnima, Amavasya, and major Hindu festivals.',
  keywords: [
    'Hindu calendar 2026 2027 2028',
    'panchang calendar',
    'hindu festival calendar',
    'ekadashi calendar 2026',
    'pradosh vrat dates',
    'purnima amavasya dates',
    'vedic lunar calendar',
    'udaya tithi panchang',
    'Dharma Granth Panchang',
  ],
  alternates: { canonical: '/panchang/calendar/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'Hindu Festival Calendar 2026–2028 · Daily Panchang, Ekadashi & Vratas — Dharma Granth',
    description:
      'Comprehensive monthly Vedic lunisolar calendar for 2026, 2027, and 2028. Daily Udaya Tithi, Nakshatra, Yoga, Karana, Ekadashi vratas, Pradosha, Purnima, Amavasya, and major festivals.',
    url: 'https://dharmagranth.dev/panchang/calendar/',
  },
};

const FAQS = [
  {
    q: 'पंचांग कैलेंडर में तिथि और अंग्रेजी कैलेंडर की तारीख में क्या अंतर होता है?',
    a: 'ग्रेगोरियन कैलेंडर का दिन मध्यरात्रि (12:00 AM) से शुरू होता है, जबकि वैदिक पंचांग का दिन स्थानीय सूर्योदय (उदय तिथि) से निर्धारित होता है। तिथि सूर्य और चंद्रमा के बीच के 12 अंश के अंतर पर निर्भर करती है, जिसके कारण एक तिथि किसी भी समय शुरू या समाप्त हो सकती है।',
  },
  {
    q: 'उदय तिथि (Udaya Tithi) का व्रत और त्योहारों में क्या महत्व है?',
    a: 'स्मार्त और पौराणिक परंपरा में जिस दिन सूर्योदय के समय जो तिथि उपस्थित होती है, उसी तिथि को उस पूरे सौर दिन का नियामक माना जाता है। समस्त व्रत, उपवास और दैनिक अध्ययन का संकल्प उदय तिथि पर ही आधारित होता है।',
  },
  {
    q: 'एकादशी, प्रदोष और पूर्णिमा-अमावस्या के व्रत का क्या क्रम है?',
    a: 'प्रत्येक मास में दो पक्ष होते हैं — शुक्ल पक्ष (बढ़ता चंद्रमा) और कृष्ण पक्ष (घटता चंद्रमा)। दोनों पक्षों में 11वीं तिथि को एकादशी (विष्णु आराधना), 13वीं तिथि की संध्या को प्रदोष (शिव आराधना), 15वीं तिथि को पूर्णिमा (सत्यनारायण पूजन) और 30वीं तिथि को अमावस्या (पितृ तर्पण) का विधान है।',
  },
  {
    q: 'क्या अलग-अलग शहरों में त्योहार की तारीख बदल सकती है?',
    a: 'हाँ, सूर्योदय और चंद्रोदय का समय प्रत्येक नगर के अक्षांश (latitude) और रेखांश (longitude) पर निर्भर करता है। जब कोई तिथि सूर्योदय के ठीक समय बदल रही हो, तो 100 किमी की दूरी पर भी स्थानीय सूर्योदय के अंतर से उदय तिथि बदल सकती है। इसलिए स्थानीय पंचांग और ज्योतिर्विद् से परामर्श लेना शास्त्र-सम्मत है।',
  },
];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://dharmagranth.dev/panchang/calendar/#webpage',
      url: 'https://dharmagranth.dev/panchang/calendar/',
      name: 'Hindu Festival Calendar 2026–2028 · Daily Panchang, Ekadashi & Vratas',
      description:
        'Comprehensive monthly Vedic lunisolar calendar for 2026, 2027, and 2028. Daily Udaya Tithi, Nakshatra, Yoga, Karana, sacred Ekadashi vratas, Pradosha, Purnima, Amavasya, and major festivals.',
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
          name: 'Festival Calendar (2026–2028)',
          item: 'https://dharmagranth.dev/panchang/calendar/',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://dharmagranth.dev/panchang/calendar/#faq',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

export default function PanchangCalendarPage() {
  return (
    <main className="apple-scope min-h-screen bg-dharma-bg">
      <JsonLd data={JSON_LD} />

      <div className="mx-auto max-w-7xl px-gutter pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Panchang', href: '/panchang/' },
            { label: 'Festival Calendar (2026–2028)' },
          ]}
        />
      </div>

      <PageHeader
        eyebrow="Vedic Lunisolar Calendar · 2026–2028"
        eyebrowHi="वैदिक सौर-चान्द्र पंचांग कैलेंडर"
        title="Solar & Lunar Festival Calendar"
        titleHi="दैनिक तिथि, नक्षत्र एवं प्रमुख पर्व पंचांग (2026–2028)"
        lead="Explore day-by-day Udaya Tithis, Nakshatras, sacred Ekadashi vratas, Pradosha twilights, Purnima and Amavasya cycles, and major Hindu festivals across 2026, 2027, and 2028 with astronomical precision and Gita Press scriptural context."
        width="wide"
      />

      {/* ─── MAIN INTERACTIVE CALENDAR ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-gutter pt-8 pb-16">
        <CalendarClient />

        {/* ─── EDUCATIONAL FOUNDATIONS ──────────────────────────────────── */}
        <section className="mt-20 border-t border-dharma-border pt-12 space-y-12">
          <div>
            <SectionTitle
              id="calendar-principles"
              size="title-2"
              eyebrow="Cosmic Timekeeping Principles"
              eyebrowHi="काल-गणना के शास्त्रीय सिद्धांत"
              title="The Architecture of the Lunisolar Calendar"
            />
            <p className="mt-2 max-w-3xl text-body leading-relaxed text-dharma-muted">
              The Vedic calendar harmonizes the independent celestial movements of the Sun (Sauramana) and the Moon (Chandramana). Rather than forcing a solar-only or lunar-only count, it measures cosmic time through five foundational limbs (Pancha-Anga).
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6">
                <div className="apple-tint-chip mb-4 !h-10 !w-10" style={{ '--chip': 'var(--hue-gold)' } as React.CSSProperties}>
                  <Sun className="h-5 w-5" />
                </div>
                <h3 className="text-subhead font-bold text-dharma-text">सौर मास (Solar Month / Sankranti)</h3>
                <p className="mt-2 text-footnote text-dharma-muted leading-relaxed">
                  Calculated from the Sun’s ingress into one of the 12 sidereal zodiac signs (Rāśi). Governs seasons (Ṛtus), agricultural cycles, and equinoctial shifts (Ayana).
                </p>
              </div>

              <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6">
                <div className="apple-tint-chip mb-4 !h-10 !w-10" style={{ '--chip': 'var(--hue-indigo)' } as React.CSSProperties}>
                  <Moon className="h-5 w-5" />
                </div>
                <h3 className="text-subhead font-bold text-dharma-text">चान्द्र मास (Lunar Month / Paksha)</h3>
                <p className="mt-2 text-footnote text-dharma-muted leading-relaxed">
                  Begins either from Amavasya (Amanta tradition in Western and Southern India) or Purnima (Purnimanta in Northern India). Governs religious fasts, vratas, and devotional celebrations.
                </p>
              </div>

              <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6">
                <div className="apple-tint-chip mb-4 !h-10 !w-10" style={{ '--chip': 'var(--hue-tulsi)' } as React.CSSProperties}>
                  <Compass className="h-5 w-5" />
                </div>
                <h3 className="text-subhead font-bold text-dharma-text">उदय तिथि नियम (Udaya Tithi Rule)</h3>
                <p className="mt-2 text-footnote text-dharma-muted leading-relaxed">
                  The lunar day current at local sunrise governs that civil solar day for fasts, temple worship, and ritual observance, even if the tithi changes minutes after dawn.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Hub Navigation Cards */}
          <div>
            <SectionTitle
              id="panchang-limbs"
              size="title-2"
              eyebrow="Explore Panchang Limbs"
              eyebrowHi="पंचांग के पाँच अंगों का विस्तृत अध्ययन"
              title="Dedicated Reference Guides"
            />
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/panchang/tithis/"
                className="group rounded-2xl border border-dharma-border bg-dharma-card p-5 hover:border-dharma-saffron hover:shadow-md transition-all"
              >
                <span className="apple-tint-chip mb-3 !h-10 !w-10" style={{ '--chip': 'var(--hue-indigo)' } as React.CSSProperties}><Moon className="h-5 w-5" aria-hidden="true" /></span>
                <h4 className="text-subhead font-bold text-dharma-text group-hover:text-dharma-saffron transition-colors">
                  16 वैदिक तिथियाँ (Tithis)
                </h4>
                <p className="mt-1 text-caption-1 text-dharma-muted">
                  प्रतिपदा से पूर्णिमा व अमावस्या — नन्दा, भद्रा, जया, रिक्ता, पूर्णा वर्गीकरण।
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-caption-2 font-semibold text-dharma-saffron">
                  <span>विस्तृत तालिका देखें</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>

              <Link
                href="/panchang/nakshatras/"
                className="group rounded-2xl border border-dharma-border bg-dharma-card p-5 hover:border-dharma-saffron hover:shadow-md transition-all"
              >
                <span className="apple-tint-chip mb-3 !h-10 !w-10" style={{ '--chip': 'var(--hue-peacock)' } as React.CSSProperties}><Sparkles className="h-5 w-5" aria-hidden="true" /></span>
                <h4 className="text-subhead font-bold text-dharma-text group-hover:text-dharma-saffron transition-colors">
                  27 नक्षत्र (Nakshatras)
                </h4>
                <p className="mt-1 text-caption-1 text-dharma-muted">
                  अश्विनी से रेवती — अधिष्ठाता देवता, ग्रह स्वामी और स्वाध्याय हेतु मार्गदर्शन।
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-caption-2 font-semibold text-dharma-saffron">
                  <span>विस्तृत तालिका देखें</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>

              <Link
                href="/panchang/yogas/"
                className="group rounded-2xl border border-dharma-border bg-dharma-card p-5 hover:border-dharma-saffron hover:shadow-md transition-all"
              >
                <span className="apple-tint-chip mb-3 !h-10 !w-10" style={{ '--chip': 'var(--hue-lotus)' } as React.CSSProperties}><Sun className="h-5 w-5" aria-hidden="true" /></span>
                <h4 className="text-subhead font-bold text-dharma-text group-hover:text-dharma-saffron transition-colors">
                  27 नित्य योग (Yogas)
                </h4>
                <p className="mt-1 text-caption-1 text-dharma-muted">
                  विष्कम्भ से वैधृति — सौर-चान्द्र संयोग, शुभ व विचारणीय योगों का विवेक।
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-caption-2 font-semibold text-dharma-saffron">
                  <span>विस्तृत तालिका देखें</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>

              <Link
                href="/panchang/karanas/"
                className="group rounded-2xl border border-dharma-border bg-dharma-card p-5 hover:border-dharma-saffron hover:shadow-md transition-all"
              >
                <span className="apple-tint-chip mb-3 !h-10 !w-10" style={{ '--chip': 'var(--hue-tulsi)' } as React.CSSProperties}><Clock className="h-5 w-5" aria-hidden="true" /></span>
                <h4 className="text-subhead font-bold text-dharma-text group-hover:text-dharma-saffron transition-colors">
                  11 करण (Karanas)
                </h4>
                <p className="mt-1 text-caption-1 text-dharma-muted">
                  7 चर व 4 स्थिर करण — विष्टि (भद्रा) के नियम और दैनिक कर्म शुद्धि।
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-caption-2 font-semibold text-dharma-saffron">
                  <span>विस्तृत तालिका देखें</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </div>
          </div>

          {/* ─── FREQUENTLY ASKED QUESTIONS ─────────────────────────────── */}
          <div>
            <SectionTitle
              id="calendar-faq"
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
