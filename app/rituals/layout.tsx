import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Temple Rituals & Practices Explained',
  description:
    'Temple and ritual explainer: what Hindu rituals mean, how they are performed, and where they come from in scripture — puja, aarti, sandhya, nitya karma and more.',
  alternates: { canonical: '/rituals/' },
  openGraph: {
    title: 'Temple Rituals & Practices Explained',
    description:
      'Temple and ritual explainer: what Hindu rituals mean, how they are performed, and where they come from in scripture — puja, aarti, sandhya, nitya karma and more.',
    url: '/rituals/',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RitualsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
