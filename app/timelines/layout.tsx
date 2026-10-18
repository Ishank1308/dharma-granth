import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Timelines of Hindu Scriptures & Traditions',
  description:
    'Visual timelines of Hindu scripture and tradition — from the Vedic period through the Upanishads, epics, and Puranas — showing how the texts and schools relate.',
  alternates: { canonical: '/timelines/' },
  openGraph: {
    title: 'Timelines of Hindu Scriptures & Traditions',
    description:
      'Visual timelines of Hindu scripture and tradition — from the Vedic period through the Upanishads, epics, and Puranas — showing how the texts and schools relate.',
    url: '/timelines/',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function TimelinesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
