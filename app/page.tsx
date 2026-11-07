import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { SplashScreen } from '@/app/components/SplashScreen';
import { HomeHero } from '@/app/components/home/HomeHero';
import { HomeTodayVerse } from '@/app/components/home/HomeTodayVerse';
import { ContinueReading } from '@/app/components/ContinueReading';
import { HomeLibrary } from '@/app/components/home/HomeLibrary';
import { HomeSanctuaryGateway } from '@/app/components/home/HomeSanctuaryGateway';
import { WisdomTicker } from '@/app/components/home/WisdomTicker';
import { HomeTrustStrip } from '@/app/components/HomeTrustStrip';

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
      <main className="min-h-screen bg-dharma-bg text-dharma-text">
        {/* Brand splash: CSS-only, once per session, hidden from assistive tech */}
        <SplashScreen />

        {/* 1. The promise, the way in, and search */}
        <HomeHero />

        {/* 2. Today's verse, then the reader's own place (nothing on a first visit) */}
        <div className="mx-auto flex max-w-content flex-col gap-4 px-5">
          <HomeTodayVerse />
          <ContinueReading />
        </div>

        {/* 3. The library as book tiles */}
        <HomeLibrary />

        {/* 4. Direct gateway to live Panchang, Wisdom Pathways, Sacred Mantras, and Daily Sadhana */}
        <HomeSanctuaryGateway />

        {/* 5. A slow band of Upaniṣadic sayings, each linked to its passage */}
        <WisdomTicker />

        {/* 6. Sourcing, methodology and the library's numbers */}
        <HomeTrustStrip />
      </main>
    </>
  );
}
