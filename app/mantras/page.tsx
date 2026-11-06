import type { Metadata } from 'next';
import Link from 'next/link';
import { SACRED_MANTRAS } from '@/data/mantras';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { Sparkles, BookOpen, Share2, Copy, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { MantrasFilterClient } from './MantrasFilterClient';

export const metadata: Metadata = {
  title: 'Sacred Mantras & Shanti Suktas (वैदिक मन्त्र व शान्ति पाठ) — Meaning & Source',
  description:
    'Complete collection of classical Vedic and Upanishadic mantras with original Sanskrit, IAST, padaccheda, Hindi meaning, English translation, and scriptural coordinates — Gayatri, Mahamrityunjaya, Asato Ma Sadgamaya, Purnamadah, and more.',
  keywords: [
    'Gayatri Mantra lyrics and meaning in hindi',
    'Maha Mrityunjaya Mantra meaning',
    'Asato Ma Sadgamaya meaning in hindi',
    'Purnamadah Purnamidam meaning',
    'Om Sahana Vavatu meaning',
    'Sarve Bhavantu Sukhinah shlok with meaning',
    'Shanti Mantras collection',
    'Vedic suktas in hindi',
    'वैदिक मन्त्र एवं शान्ति पाठ',
    'dharma granth',
  ],
  alternates: { canonical: '/mantras/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'Sacred Mantras & Shanti Suktas (वैदिक मन्त्र व शान्ति पाठ) — Dharma Granth',
    description:
      'Complete collection of classical Vedic and Upanishadic mantras with original Sanskrit, IAST, padaccheda, Hindi meaning, English translation, and scriptural coordinates.',
    url: 'https://dharmagranth.dev/mantras/',
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';
const pageUrl = `${siteUrl}/mantras/`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${pageUrl}#page`,
      url: pageUrl,
      name: 'Sacred Mantras & Shanti Suktas (वैदिक मन्त्र व शान्ति पाठ)',
      description:
        'Complete collection of classical Vedic and Upanishadic mantras with original Sanskrit, IAST, padaccheda, Hindi meaning and English translation.',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Dharma Granth',
        url: `${siteUrl}/`,
      },
    },
    {
      '@type': 'ItemList',
      itemListElement: SACRED_MANTRAS.map((m, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `${m.title} (${m.titleHi})`,
        url: `${siteUrl}/mantras/${m.slug}/`,
      })),
    },
    {
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the Gayatri Mantra and what does it mean?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Gayatri Mantra (Rigveda 3.62.10) is the supreme prayer for intellectual and spiritual illumination: "We meditate upon the supreme divine radiance of Savita; may that Divine Being illuminate our intellect."',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the significance of the Maha Mrityunjaya Mantra?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Maha Mrityunjaya Mantra (Rigveda 7.59.12) is the great life-nourishing prayer addressed to Lord Shiva, praying for liberation from the bondage of mortality without tearing, like a ripe cucumber naturally releasing from its vine.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are the principal Shanti Mantras of the Upanishads?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Key Shanti Mantras include Asato Ma Sadgamaya (Brihadaranyaka 1.3.28), Purnamadah Purnamidam (Isha & Brihadaranyaka 5.1.1), Sahana Vavatu (Taittiriya & Katha), and Sarve Bhavantu Sukhinah.',
          },
        },
      ],
    },
  ],
};

export default function MantrasPage() {
  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text pb-24">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-950/25 via-saffron-950/15 to-transparent pt-12 pb-14 border-b border-dharma-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-saffron-500/10 text-saffron-700 dark:text-saffron-300 border border-saffron-500/20 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>शाश्वत मन्त्र कोश · Eternal Vedic Chants</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-dharma-text mb-4">
            Sacred Mantras & Shanti Suktas
          </h1>
          <p lang="sa" className="font-devanagari text-lg sm:text-xl text-saffron-800 dark:text-saffron-300 font-semibold mb-4">
            वैदिक मन्त्र, उपनिषद् शान्ति पाठ एवं स्तोत्र
          </p>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-dharma-muted leading-relaxed">
            Every mantra presented with original Devanagari, IAST transliteration, word-by-word meaning (पदच्छेद), dignified Hindi, English translation, and scriptural source coordinates.
          </p>
        </div>
      </section>

      {/* Client Filter & Interactive Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        <MantrasFilterClient mantras={SACRED_MANTRAS} />
      </section>
    </main>
  );
}

