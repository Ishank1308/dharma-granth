import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Study Collections — Curated Verse Sets by Theme',
  description:
    'Curated collections of scripture verses grouped by theme — karma, peace of mind, courage, devotion — drawn from the Bhagavad Gita, Upanishads, and other Hindu texts.',
  alternates: { canonical: '/collections/' },
  openGraph: {
    title: 'Study Collections — Curated Verse Sets by Theme',
    description:
      'Curated collections of scripture verses grouped by theme — karma, peace of mind, courage, devotion — drawn from the Bhagavad Gita, Upanishads, and other Hindu texts.',
    url: '/collections/',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
