import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { StartJourney } from './StartJourney';

export const metadata: Metadata = {
  title: 'Discover Your Path · अपना अध्ययन मार्ग खोजें',
  description:
    'Answer five short questions to find a serene, non-intimidating starting point through Hindu scriptures. No account required; your choices stay on your device.',
  alternates: { canonical: '/learn/start/' },
  openGraph: {
    title: 'Discover Your Path · अपना अध्ययन मार्ग खोजें',
    description:
      'Answer five short questions to find a serene, non-intimidating starting point through Hindu scriptures. No account required; your choices stay on your device.',
    url: '/learn/start/',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function StartPage() {
  return <StartJourney />;
}
