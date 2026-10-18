import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Source Library & Text Transparency · स्रोत एवं संस्करण',
  alternates: { canonical: '/sources/' },
  openGraph: {
    title: 'Source Library & Text Transparency · स्रोत एवं संस्करण',
    description:
      'Authoritative provenance, Sanskrit editions, manuscript recensions, primary translators, and traditional commentary attribution for scriptures in Dharma Granth.',
    url: '/sources/',
    images: [DEFAULT_OG_IMAGE],
  },
  description:
    'Authoritative provenance, Sanskrit editions, manuscript recensions, primary translators, and traditional commentary attribution for scriptures in Dharma Granth.',
};

export default function SourcesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
