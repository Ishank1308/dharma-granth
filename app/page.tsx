import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { HeroSection } from '@/app/components/HeroSection';
import { SplashScreen } from '@/app/components/SplashScreen';
import { ContinueReading } from '@/app/components/ContinueReading';
import { VerseOfTheDaySection } from '@/app/components/VerseOfTheDaySection';
import { LifeSituationsSection } from '@/app/components/LifeSituationsSection';
import { FeaturedScripturesSection } from '@/app/components/FeaturedScripturesSection';
import { CategoryExploreSection } from '@/app/components/CategoryExploreSection';
import { SadhanaPreviewSection } from '@/app/components/SadhanaPreviewSection';
import { PanchangPreviewSection } from '@/app/components/PanchangPreviewSection';
import { Experience3DSection } from '@/app/components/Experience3DSection';
import { getLibraryCounts } from '@/data/scriptures';
import { formatCountDevanagari } from '@/lib/holdings-label';
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
  const gita = getLibraryCounts('bhagavadgita');
  const gitaCountLabel = `${formatCountDevanagari(gita.chapters)} अध्याय · ${formatCountDevanagari(gita.verses)} श्लोक`;
  return (
    <>
      <main className="min-h-screen bg-dharma-bg text-dharma-text selection:bg-amber-200 selection:text-amber-900">
      {/* Visual Splash / Orientation for first-time direct visitors */}
      <SplashScreen />

      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. CONTINUE READING / START HERE */}
      <ContinueReading />

      {/* 3. VERSE OF THE DAY */}
      <VerseOfTheDaySection />

      {/* 4. BROWSE BY LIFE SITUATION */}
      <LifeSituationsSection />

      {/* 5. FEATURED SCRIPTURES */}
      <FeaturedScripturesSection />

      {/* 6. EXPLORE BY CATEGORY */}
      <CategoryExploreSection />

      {/* 7. SADHANA PREVIEW */}
      <SadhanaPreviewSection />

      {/* 8. PANCHANG PREVIEW */}
      <PanchangPreviewSection />

      {/* 9. 3D EXPERIENCE */}
      <Experience3DSection gitaCountLabel={gitaCountLabel} />
    </main>
    {/* Site Footer with sources, methodology, and quiet contemplation */}
    <SiteFooter />
  </>
  );
}
