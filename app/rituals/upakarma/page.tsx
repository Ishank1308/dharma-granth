import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Sparkles, ShieldCheck, ChevronRight, Layers, Sun } from 'lucide-react';
import { UPAKARMA_STEPS, UPAKARMA_FAQS } from '@/data/upakarma-data';
import { UpakarmaClient } from './UpakarmaClient';

export const metadata: Metadata = {
  title: 'उपाकर्म एवं यज्ञोपवीत संस्कार विधान · Upakarma & Sacred Thread Guide | Dharma Granth',
  description:
    'ऋग्वेदीय एवं यजुर्वेदीय श्रावणी उपाकर्म (आवनि अवित्तम) की प्रामाणिक वैदिक विधि — कामोऽकार्षीत् प्रायश्चित्त जप, ब्रह्म-यज्ञ, नूतन यज्ञोपवीत धारण एवं विसर्जन मन्त्र, नौ तन्तुओं का रहस्य और वेद-आरम्भ।',
  alternates: {
    canonical: 'https://dharmagranth.in/rituals/upakarma/',
  },
  openGraph: {
    title: 'उपाकर्म एवं यज्ञोपवीत संस्कार विधान · Vedic Upakarma Guide',
    description:
      'श्रावणी उपाकर्म एवं यज्ञोपवीत धारण-विसर्जन विधि — मन्त्र, अर्थ, १०८ जप एवं ९ तन्तुओं का आध्यात्मिक रहस्य।',
    url: 'https://dharmagranth.in/rituals/upakarma/',
    siteName: 'Dharma Granth',
    images: [
      {
        url: 'https://dharmagranth.in/og/upakarma.png',
        width: 1200,
        height: 630,
        alt: 'Vedic Upakarma & Yajnopavita Sanskara Guide',
      },
    ],
    locale: 'hi_IN',
    type: 'article',
  },
};

export default function UpakarmaPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://dharmagranth.in/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Rituals & Sanskaras',
            item: 'https://dharmagranth.in/rituals/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Upakarma & Yajnopavita',
            item: 'https://dharmagranth.in/rituals/upakarma/',
          },
        ],
      },
      {
        '@type': 'HowTo',
        name: 'Vedic Upakarma & Yajnopavita Renewal Procedure',
        description: 'Complete 5-stage ritual sequence for annual sacred thread investiture and resumption of Vedic study.',
        step: UPAKARMA_STEPS.map((s) => ({
          '@type': 'HowToStep',
          position: s.stepNumber,
          name: s.name,
          text: s.description,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: UPAKARMA_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.questionHi,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answerHi,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-dharma-bg text-dharma-text pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-dharma-border bg-gradient-to-b from-amber-500/15 via-saffron-500/5 to-transparent pt-10 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-dharma-muted mb-4">
            <Link href="/" className="hover:text-saffron-600 transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/rituals/" className="hover:text-saffron-600 transition">
              अनुष्ठान (Rituals)
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-dharma-text font-medium">उपाकर्म विधान (Upakarma Guide)</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-xs font-semibold text-saffron-700 dark:text-saffron-300 mb-3">
              <Sun className="w-3.5 h-3.5" />
              <span>श्रावणी पूर्णिमा · Shravani Upakarma & Avani Avittam</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-dharma-text tracking-tight leading-tight mb-4">
              उपाकर्म एवं यज्ञोपवीत संस्कार विधान
              <span className="block text-xl sm:text-2xl font-serif text-saffron-700 dark:text-saffron-400 font-normal mt-1">
                Canonical Upakarma Liturgy, Mantras & Sacred Symbolism
              </span>
            </h1>

            <p className="text-sm sm:text-base text-dharma-muted leading-relaxed mb-6">
              तैत्तिरीय आरण्यक और गृह्यसूत्रों पर आधारित श्रावणी उपाकर्म की समग्र वैदिक दर्शिका। जानिए वर्ष भर के प्रमादों के निष्कासन हेतु कामोऽकार्षीत् प्रायश्चित्त जप (108 आवर्तन), ब्रह्म-यज्ञ, नूतन यज्ञोपवीत धारण-विसर्जन मन्त्र और जनेऊ के नौ तन्तुओं का गूढ़ आध्यात्मिक रहस्य।
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-dharma-muted">
              <span className="inline-flex items-center gap-1.5 bg-dharma-card px-3 py-1.5 rounded-lg border border-dharma-border">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>५ प्रामाणिक सोपान</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-dharma-card px-3 py-1.5 rounded-lg border border-dharma-border">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>108 प्रायश्चित्त जप गणक</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-dharma-card px-3 py-1.5 rounded-lg border border-dharma-border">
                <Layers className="w-4 h-4 text-blue-500" />
                <span>यज्ञोपवीत के ९ तन्तु</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Guide */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <UpakarmaClient />

        {/* Cross Links */}
        <div className="mt-12 pt-8 border-t border-dharma-border">
          <h4 className="text-sm font-serif font-bold text-dharma-text mb-3">
            सम्बन्धित वैदिक मन्त्र एवं पञ्चाङ्ग दर्शिकाएँ:
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <Link
              href="/mantras/gayatri-mantra/"
              className="p-3 rounded-xl border border-dharma-border bg-dharma-card hover:border-saffron-500/50 transition text-center"
            >
              <strong className="block text-dharma-text">गायत्री मन्त्र</strong>
              <span className="text-dharma-muted text-[11px]">Daily Sandhyavandana Core</span>
            </Link>
            <Link
              href="/panchang/purnima/"
              className="p-3 rounded-xl border border-dharma-border bg-dharma-card hover:border-saffron-500/50 transition text-center"
            >
              <strong className="block text-dharma-text">पूर्णिमा तिथियाँ</strong>
              <span className="text-dharma-muted text-[11px]">Shravana Purnima Observance</span>
            </Link>
            <Link
              href="/panchang/varas/guruvara/"
              className="p-3 rounded-xl border border-dharma-border bg-dharma-card hover:border-saffron-500/50 transition text-center"
            >
              <strong className="block text-dharma-text">गुरुवार विवरण</strong>
              <span className="text-dharma-muted text-[11px]">Brihaspati &amp; Veda Study</span>
            </Link>
            <Link
              href="/rituals/"
              className="p-3 rounded-xl border border-dharma-border bg-dharma-card hover:border-saffron-500/50 transition text-center"
            >
              <strong className="block text-dharma-text">सम्पूर्ण अनुष्ठान</strong>
              <span className="text-dharma-muted text-[11px]">Temple &amp; Vedic Explainer</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
