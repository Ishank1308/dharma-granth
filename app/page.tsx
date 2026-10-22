import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { HeroSection } from '@/app/components/HeroSection';
import { SplashScreen } from '@/app/components/SplashScreen';
import { ContinueReading } from '@/app/components/ContinueReading';
import { VerseOfTheDayCompact } from '@/app/components/VerseOfTheDayCompact';
import { FeaturedScripturesSection } from '@/app/components/FeaturedScripturesSection';
import { HomeTrustStrip } from '@/app/components/HomeTrustStrip';
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

        {/* 2. Continue reading, or a beginner path when there is no history */}
        <ContinueReading />

        {/* 3. Today's verse, shown once */}
        <VerseOfTheDayCompact />

        {/* 4. The library */}
        <FeaturedScripturesSection />

        {/* 5. Trust, sourcing and methodology.
            Cut from Home (audit 2026-10-22, P0): HomeDiscoveryBento repeated the daily verse and the resume card;
            MoodCompass and LifeSituationsSection repeated the hero's "Where are you right now?" picker;
            CategoryExploreSection was a second library; the Sadhana preview is reachable from the nav. */}
        <HomeTrustStrip />
      </main>
      <SiteFooter />
    </>
  );
}
