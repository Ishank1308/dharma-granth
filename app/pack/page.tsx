import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { PackClient } from './PackClient';

export const metadata: Metadata = {
  title: 'Study Pack · अध्ययन-पत्र',
  description: 'Choose verses and layers, then print or save a clean study sheet with references and sources.',
  alternates: { canonical: '/pack/' },
  openGraph: {
    title: 'Study Pack · अध्ययन-पत्र',
    description:
      'Choose verses and layers, then print or save a clean study sheet with references and sources.',
    url: '/pack/',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: false },
};

export default function PackPage() {
  return <PackClient />;
}
