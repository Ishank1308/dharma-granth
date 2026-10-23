import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { JourneysClient } from './JourneysClient';
import { READING_JOURNEYS, isJourneyIndexable } from '@/data/reading-journeys';

export const metadata: Metadata = {
  title: 'Guided Learning Journeys · स्वाध्याय यात्राएँ',
  description: 'Short, optional reading paths through scripture passages with context, reflection questions, and source notes.',
  alternates: { canonical: '/learn/journeys/' },
  robots: { index: READING_JOURNEYS.some(isJourneyIndexable), follow: true },
  openGraph: {
    title: 'Guided Learning Journeys · स्वाध्याय यात्राएँ — Dharma Granth',
    description:
      'Short, optional reading paths through scripture passages with context, reflection questions, and source notes.',
    url: '/learn/journeys/',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function JourneysPage() {
  return <JourneysClient />;
}
