import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Compass, Eye, ArrowLeft, Layers } from 'lucide-react';
import { VisualExplorerClient } from './VisualExplorerClient';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { JsonLd } from '@/app/components/JsonLd';
import { pageLd, articleLd } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'दृश्य ज्ञान दर्शन — 10 वैदिक अवधारणाओं के इंटरैक्टिव आरेख | Dharma Granth',
  description:
    'धर्म, कर्म, मोक्ष, आत्मन्, ब्रह्मन्, माया, योग, वेदान्त, भक्ति और संसार के पवित्र ज्यामितीय मण्डल, प्रवाह आरेख, और ज्ञान मानचित्र। Interactive sacred visual learning layer.',
  keywords: [
    'Dharma visual diagrams',
    'Karma flowchart',
    'Moksha stages',
    'Atman pancha kosha diagram',
    'Brahman mandala',
    'Maya veiling',
    'Ashtanga yoga limbs visual',
    'Vedanta prasthanatrayi',
    'Bhakti navadha lotus',
    'Samsara wheel of rebirth',
  ],
  alternates: { canonical: '/concepts/visuals/' },
  openGraph: {
    title: 'दृश्य ज्ञान दर्शन — 10 वैदिक अवधारणाओं के इंटरैक्टिव आरेख | Dharma Granth',
    description:
      'Explore interactive sacred geometry, flowcharts, knowledge maps, and stages for the 10 foundational concepts of Hindu philosophy.',
    url: 'https://dharmagranth.dev/concepts/visuals/',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'दृश्य ज्ञान दर्शन — Interactive Visual Learning Layer | Dharma Granth',
    description:
      'Sacred geometry, flowcharts, and knowledge maps for Dharma, Karma, Moksha, Atman, Brahman, Maya, Yoga, Vedanta, Bhakti, Samsara.',
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function VisualConceptsHubPage() {
  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text pb-24">
      <JsonLd
        data={pageLd(
          [
            { name: 'Concepts', path: '/concepts' },
            { name: 'Visual Learning Layer', path: '/concepts/visuals' },
          ],
          articleLd({
            path: '/concepts/visuals',
            headline: 'दृश्य ज्ञान दर्शन — 10 वैदिक अवधारणाओं के इंटरैक्टिव आरेख',
            description:
              'धर्म, कर्म, मोक्ष, आत्मन्, ब्रह्मन्, माया, योग, वेदान्त, भक्ति और संसार के पवित्र ज्यामितीय मण्डल, प्रवाह आरेख, और ज्ञान मानचित्र।',
          }),
        )}
      />

      {/* ── Top Header & Breadcrumb ────────────────────────────────────────── */}
      <header className="border-b border-dharma-border bg-dharma-card/60 backdrop-blur-md sticky top-16 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs sm:text-sm text-dharma-muted">
          <div className="flex items-center gap-2">
            <Link
              href="/concepts/"
              className="inline-flex items-center gap-1.5 hover:text-dharma-text transition-colors min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>अवधारणाएँ (Concepts)</span>
            </Link>
            <span>/</span>
            <span className="text-dharma-text font-semibold">दृश्य ज्ञान दर्शन</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/10 text-saffron-700 dark:text-saffron-300 font-medium text-xs border border-saffron-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>चरण 10 · Visual Learning Layer</span>
          </span>
        </div>
      </header>

      {/* ── Hero Banner ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-dharma-border bg-gradient-to-b from-amber-500/10 via-saffron-500/5 to-transparent py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-saffron-500/30 bg-saffron-500/10 text-xs font-semibold text-saffron-800 dark:text-saffron-300">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span className="font-devanagari">परम दार्शनिक तत्त्वों का जीवंत दृश्य निरूपण</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-dharma-text tracking-tight">
            <span className="font-devanagari">दृश्य ज्ञान दर्शन</span>
          </h1>
          <p className="font-serif text-lg sm:text-xl text-saffron-700 dark:text-saffron-400">
            Sacred Visual Learning Layer for 10 Foundational Vedic Concepts
          </p>
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-dharma-muted leading-relaxed">
            धर्म, कर्म, मोक्ष, आत्मन्, ब्रह्मन्, माया, योग, वेदान्त, भक्ति और संसार — इन दस मूल तत्त्वों को
            पवित्र ज्यामिति, कारण-कार्य प्रवाह आरेख, और ज्ञान मानचित्र द्वारा गहराई से समझें।
          </p>
        </div>
      </section>

      {/* ── Interactive Visual Explorer ────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <VisualExplorerClient />
      </div>
    </main>
  );
}
