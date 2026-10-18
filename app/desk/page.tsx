import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { DeskClient } from './DeskClient';

export const metadata: Metadata = {
  title: 'My Study Desk · मेरा अध्ययन-पटल',
  description: 'Your saved verses, notes, reading queue and journeys, kept privately in this browser.',
  alternates: { canonical: '/desk/' },
  openGraph: {
    title: 'My Study Desk · मेरा अध्ययन-पटल',
    description:
      'Your saved verses, notes, reading queue and journeys, kept privately in this browser.',
    url: '/desk/',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: false },
};

export default function DeskPage() {
  return <DeskClient />;
}
