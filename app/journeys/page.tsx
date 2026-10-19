import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { JourneysClient } from './JourneysClient';

export const metadata: Metadata = {
  title: 'Guided Learning Journeys · स्वाध्याय यात्राएँ',
  description: 'Structured spiritual learning pathways through Hindu scriptures: Gita, Upanishads, and Yoga paths with daily bite-sized lessons, reflection questions, and progress tracking.',
  alternates: { canonical: '/journeys/' },
  openGraph: {
    title: 'Guided Learning Journeys · स्वाध्याय यात्राएँ — Dharma Granth',
    description:
      'Structured spiritual learning pathways through Hindu scriptures: Gita, Upanishads, and Yoga paths with daily bite-sized lessons, reflection questions, and progress tracking.',
    url: '/journeys/',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function JourneysPage() {
  return <JourneysClient />;
}
