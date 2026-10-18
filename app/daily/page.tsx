import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { DailyDharmaJourneySession } from '@/app/components/daily/DailyDharmaJourneySession';

export const metadata: Metadata = {
  title: 'Daily Dharma Journey · दैनिक धर्म यात्रा',
  description:
    'A calm daily session with one verse: original Sanskrit, slow pronunciation, plain meaning, a modern example and private reflection. No streaks.',
  alternates: { canonical: '/daily/' },
  openGraph: {
    title: 'Daily Dharma Journey · दैनिक धर्म यात्रा',
    description:
      'A calm daily session with one verse: original Sanskrit, slow pronunciation, plain meaning, a modern example and private reflection. No streaks.',
    url: '/daily/',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function DailyJourneyPage() {
  return (
    <main className="min-h-screen bg-dharma-bg">
      <DailyDharmaJourneySession />
    </main>
  );
}
