import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { SolarVratasClient } from './SolarVratasClient';
import { SOLAR_VRATAS } from '@/data/solar-vratas-data';
import { calculateEducationalPanchang } from '@/lib/panchang';
import { Sun, Compass, ExternalLink, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solar Vratas & Observances: Chhath Puja, Ratha Saptami, Makar Sankranti · सौर व्रत एवं अर्घ्य विधि — Dharma Granth',
  description:
    'Comprehensive guide to sacred Sauramana solar observances: 4-day Chhath Puja sequence, Ratha Saptami (Surya Jayanti), Makar Sankranti, and Bhanu Saptami with Vedic Arghya mantras and astronomical timings.',
  keywords: [
    'chhath puja vidhi',
    'chhath puja 4 days sequence nahay khay kharna arghya',
    'ratha saptami surya jayanti',
    'makar sankranti uttarayana snana',
    'bhanu saptami ravivara vrata',
    'surya arghya mantra in hindi',
    'छठ पूजा विधि अर्घ्य मन्त्र',
    'रथ सप्तमी माघ शुक्ल सप्तमी',
    'dharma granth panchang',
  ],
  alternates: {
    canonical: '/panchang/solar-vratas/',
  },
  openGraph: {
    type: 'article',
    locale: 'hi_IN',
    alternateLocale: ['en_US'],
    title: 'Solar Vratas & Observances: Chhath Puja, Ratha Saptami, Makar Sankranti — Dharma Granth',
    description:
      'Comprehensive guide to sacred Sauramana solar observances: 4-day Chhath Puja, Ratha Saptami, Makar Sankranti, and Bhanu Saptami with Vedic Arghya mantras.',
    url: 'https://dharmagranth.dev/panchang/solar-vratas/',
    images: [
      {
        url: '/og/solar-vratas.png',
        width: 1200,
        height: 630,
        alt: 'Sacred Solar Vratas & Sauramana Observances — Dharma Granth',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Vratas & Observances: Chhath Puja, Ratha Saptami, Makar Sankranti',
    description: 'Astronomical & liturgical guides for classical Hindu solar vratas and Arghya vidhi.',
    images: ['/og/solar-vratas.png'],
  },
};

export default function SolarVratasPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';
  const pageUrl = `${siteUrl}/panchang/solar-vratas/`;

  // Compute live solar parameters
  const panchangNow = calculateEducationalPanchang(new Date());
  const initialSolarTimes = {
    sunrise: panchangNow.solarTimes.sunrise,
    sunset: panchangNow.solarTimes.sunset,
    solarNoon: panchangNow.solarTimes.solarNoon,
    dayLength: panchangNow.solarTimes.dayLength,
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: 'Sacred Solar Vratas & Sauramana Observances in Sanatana Dharma',
        description:
          'Comprehensive liturgical guide to Chhath Puja (4-day sequence), Ratha Saptami (Surya Jayanti), Makar Sankranti, and Bhanu Saptami with Vedic Arghya mantras.',
        inLanguage: ['en', 'hi', 'sa'],
        isAccessibleForFree: true,
        publisher: {
          '@type': 'Organization',
          name: 'Dharma Granth',
          url: siteUrl,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Panchang', item: `${siteUrl}/panchang/` },
          { '@type': 'ListItem', position: 3, name: 'Solar Vratas', item: pageUrl },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text pb-24">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Panchang', href: '/panchang/' },
          { label: 'Solar Observances (सौर व्रत)' },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-10">
        {/* Sacred Header */}
        <header className="space-y-4 border-b border-dharma-border pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-3 py-1 text-xs font-semibold text-saffron-800 dark:text-saffron-300">
              <Sun className="w-3.5 h-3.5" />
              <span>Sauramana Liturgy · सौर व्रत एवं अर्घ्य विधान</span>
            </span>
            <span className="text-xs text-dharma-muted font-medium border border-dharma-border rounded-full px-3 py-1">
              Chhath Puja · Ratha Saptami · Makar Sankranti · Bhanu Saptami
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-dharma-text tracking-tight">
            Sacred Solar Vratas &amp; Arghya Vidhi
          </h1>
          <p lang="hi" className="font-devanagari text-2xl sm:text-3xl text-saffron-800 dark:text-saffron-300 font-semibold">
            प्रमुख सौर व्रत, अर्घ्य मन्त्र एवं खगोलीय विधान
          </p>

          <p className="text-sm sm:text-base text-dharma-muted leading-relaxed max-w-3xl">
            In Vedic wisdom, Lord Surya is the visible manifestation of the Divine (<em>Pratyaksha Devata</em>) and the soul of the cosmos (<em>Surya Atma Jagatas Tasthushashcha</em>). Explore the liturgical disciplines, sacred timings, and Vedic Arghya mantras for Sanatana Dharma’s premier solar vratas.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <Link
              href="/panchang/varas/ravivara/"
              className="inline-flex items-center gap-1.5 font-bold text-saffron-800 dark:text-saffron-300 hover:underline"
            >
              <Sun className="w-4 h-4" />
              <span>Explore Ravivara (Sunday) 7th Limb Guide</span>
            </Link>
            <span className="text-dharma-border">•</span>
            <Link
              href="/mantras/aditya-hridaya-stotra/"
              className="inline-flex items-center gap-1 text-dharma-muted hover:text-dharma-text"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Aditya Hridaya Stotra</span>
            </Link>
          </div>
        </header>

        {/* Client Interactive Component */}
        <SolarVratasClient initialSolarTimes={initialSolarTimes} />
      </div>
    </main>
  );
}
