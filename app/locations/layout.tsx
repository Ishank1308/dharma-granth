import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Sacred Geography — Holy Places of Hindu Scripture',
  description:
    'Map of sacred places in Hindu scripture — Ayodhya, Kurukshetra, Vrindavan, Kashi and more — with the texts, stories, and pilgrimage significance of each site.',
  alternates: { canonical: '/locations/' },
  openGraph: {
    title: 'Sacred Geography — Holy Places of Hindu Scripture',
    description:
      'Map of sacred places in Hindu scripture — Ayodhya, Kurukshetra, Vrindavan, Kashi and more — with the texts, stories, and pilgrimage significance of each site.',
    url: '/locations/',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function LocationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
