import type { Metadata } from 'next';
import { clipDescription } from '@/lib/meta-text';
import { JsonLd } from '@/app/components/JsonLd';
import { articleLd, pageLd } from '@/lib/jsonld';
import { GitaSankalpaClient } from './GitaSankalpaClient';

const PAGE_DESCRIPTION = clipDescription(
  'Take a daily Bhagavad Gita reading vow (Sankalpa): 18-day sequential parayana, daily chapter pledge, Vedic invocation, streak tracker, and offline access.',
);

export const metadata: Metadata = {
  title: 'Bhagavad Gita Daily Sankalpa · गीता नित्य स्वाध्याय संकल्प',
  description: PAGE_DESCRIPTION,
  keywords: [
    'gita sankalpa',
    'bhagavad gita daily reading',
    'gita parayana',
    'गीता संकल्प',
    'भगवद्गीता पारायण',
    'gita streak tracker',
    'offline bhagavad gita',
    'gita 18 days challenge',
  ],
  alternates: { canonical: '/practice/gita-sankalpa/' },
  openGraph: {
    title: 'Bhagavad Gita Daily Sankalpa · श्रीमद्भगवद्गीता नित्य स्वाध्याय संकल्प',
    description: PAGE_DESCRIPTION,
    url: 'https://dharmagranth.dev/practice/gita-sankalpa/',
    type: 'article',
    images: [{ url: '/og/bhagavadgita.png', width: 1200, height: 630, alt: 'Bhagavad Gita Daily Sankalpa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bhagavad Gita Daily Sankalpa — Dharma Granth',
    description: PAGE_DESCRIPTION,
    images: ['/og/bhagavadgita.png'],
  },
};

export default function GitaSankalpaPage() {
  return (
    <>
      <JsonLd
        data={pageLd(
          [
            { name: 'Practice', path: '/practice/' },
            { name: 'Gita Sankalpa', path: '/practice/gita-sankalpa/' },
          ],
          articleLd({
            path: '/practice/gita-sankalpa/',
            headline: 'Bhagavad Gita Daily Sankalpa & Parayana · श्रीमद्भगवद्गीता नित्य स्वाध्याय संकल्प',
            description: PAGE_DESCRIPTION,
          }),
        )}
      />
      <main className="min-h-screen bg-dharma-bg">
        <GitaSankalpaClient />
      </main>
    </>
  );
}
