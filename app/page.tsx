import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { HeroSection } from '@/app/components/HeroSection';
import { SplashScreen } from '@/app/components/SplashScreen';
import { VerseOfTheDayCompact } from '@/app/components/VerseOfTheDayCompact';
import { FeaturedScripturesSection } from '@/app/components/FeaturedScripturesSection';
import { SiteFooter } from '@/app/components/SiteFooter';

export const metadata: Metadata = {
  title: { absolute: 'Dharma Granth — Calm, Bilingual Digital Scripture Library' },
  description:
    'A tranquil, ad-free library of Hindu scriptures. Sanskrit, Hindi, and English appear where the published text includes them.',
  keywords: [
    'Bhagavad Gita',
    'Bhagavad Gita in Hindi',
    'भगवद्गीता हिन्दी अर्थ',
    'Upanishads',
    'उपनिषद',
    'Vedas',
    'वेद',
    'Ramayana',
    'Hindu scriptures online',
    'Dharma Granth',
    'Sanskrit verses with meaning',
    'Panchang',
    'सनातन धर्म',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Dharma Granth — Calm, Bilingual Digital Scripture Library',
    description:
      'A tranquil, ad-free library of Hindu scriptures. Sanskrit, Hindi, and English appear where the published text includes them.',
    url: '/',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function HomePage() {
  return (
    <>
      <main className="min-h-screen bg-dharma-bg text-dharma-text selection:bg-amber-200 selection:text-amber-900">
        {/* Brand splash: CSS-only, once per session, hidden from assistive tech */}
        <SplashScreen />

        {/* 1. What this is, and search */}
        <HeroSection />

        {/* 2. Today's contemplative verse & creator studio */}
        <VerseOfTheDayCompact />

        {/* 3. The library (the Grantha Mandala gateway).
            Home follows the motto order only (CLAUDE.md §6): hero → verse of the day → library.
            Continue reading and the trust strip were removed as clutter (2026-10-25); sourcing
            lives on /methodology/ and each verse's Sources card. */}
        <FeaturedScripturesSection />
      </main>
      <SiteFooter />
    </>
  );
}
