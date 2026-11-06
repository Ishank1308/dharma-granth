import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { PracticeDashboard } from './PracticeDashboard';
import { SITE_URL } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'साधना — Daily Practice',
  description:
    'A private daily practice dashboard: daily verse, reflection prompts, reading plans, japa counter, meditation timer and journals. Stays on your device.',
  alternates: { canonical: '/practice/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'साधना — Daily Practice — Dharma Granth',
    description:
      'A private daily practice dashboard: daily verse, reflection prompts, reading plans, japa counter, meditation timer, and journals.',
    url: `${SITE_URL}/practice/`,
  },
};

export default function PracticePage() {
  return <PracticeDashboard />;
}
