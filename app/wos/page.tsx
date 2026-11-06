import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { WisdomOperatingSystem } from '@/app/components/wos/WisdomOperatingSystem';
import { SITE_URL } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Wisdom Operating System (WOS) — प्रज्ञा व्यवस्था — Dharma Granth',
  description:
    'A contemplative digital wisdom ecosystem transforming sacred information into reflection, reflection into understanding, and understanding into practical action. Zero gamification, local-first privacy, and attention restoration.',
  alternates: { canonical: '/wos/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'Wisdom Operating System (WOS) — Dharma Granth',
    description:
      'Transform scripture into reflection, reflection into understanding, and understanding into action with question-first inquiry, emotional resonance, and mindful contemplation.',
    url: `${SITE_URL}/wos/`,
  },
};

export default function WisdomOperatingSystemPage() {
  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text">
      <WisdomOperatingSystem />
    </main>
  );
}
