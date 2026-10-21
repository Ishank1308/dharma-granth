import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { HeroSection } from '@/app/components/HeroSection';
import { SplashScreen } from '@/app/components/SplashScreen';
import { ContinueReading } from '@/app/components/ContinueReading';
import { VerseOfTheDayCompact } from '@/app/components/VerseOfTheDayCompact';
import { LifeSituationsSection } from '@/app/components/LifeSituationsSection';
import { MoodCompass } from '@/app/components/MoodCompass';
import { getMoodCompass } from '@/lib/mood-compass';
import { FeaturedScripturesSection } from '@/app/components/FeaturedScripturesSection';
import { Experience3DSection } from '@/app/components/Experience3DSection';
import { CategoryExploreSection } from '@/app/components/CategoryExploreSection';
import { SadhanaPreviewSection } from '@/app/components/SadhanaPreviewSection';
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

        {/* 3. Make the scripture library the first clear browse destination */}
        <FeaturedScripturesSection />

        {/* 4. A short daily reading, followed by alternative discovery paths */}
        <VerseOfTheDayCompact />

        {/* 5. Mood compass: curated verses for how the reader feels right now */}
        <MoodCompass moods={getMoodCompass()} />

        {/* 6. Browse by scripture category */}
        <CategoryExploreSection />

        {/* 7. Browse by life situation */}
        <LifeSituationsSection />

        {/* 8. Touch & Contemplate: 3D Sacred Experience System */}
        <Experience3DSection gitaCountLabel="१८ अध्याय · ७०० श्लोक" />

        {/* 9. Practice tools preview */}
        <SadhanaPreviewSection />

        {/* 10. Trust, sourcing and methodology */}
        <HomeTrustStrip />
      </main>
      <SiteFooter />
    </>
  );
}
