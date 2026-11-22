import type { Metadata } from 'next';
import { clipDescription } from '@/lib/meta-text';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { WisdomOperatingSystem } from '@/app/components/wos/WisdomOperatingSystem';
import { PageHeader } from '@/app/components/apple/PageHeader';

const WOS_DESC = clipDescription(
  'Contemplative scripture study turning sacred verses into reflection, understanding, and daily ethical action with local-first privacy.',
);

export const metadata: Metadata = {
  title: 'Wisdom Operating System (WOS) · प्रज्ञा व्यवस्था',
  description: WOS_DESC,
  alternates: { canonical: '/wos/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'Wisdom Operating System (WOS) — Dharma Granth',
    description: WOS_DESC,
    url: 'https://dharmagranth.dev/wos/',
  },
};

export default function WisdomOperatingSystemPage() {
  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text">
      <PageHeader eyebrow="Reflect" eyebrowHi="मनन" title="Wisdom Operating System" titleHi="प्रज्ञा व्यवस्था" />
      <WisdomOperatingSystem />
    </main>
  );
}
