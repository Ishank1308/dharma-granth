import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { SITE_URL } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'पञ्चाङ्ग · आज का पंचांग व दैनिक काल दर्शन (Vedic Panchang)',
  description:
    'दैनिक पञ्चाङ्ग: तिथि, पक्ष, नक्षत्र, योग, करण, ऋतु, सूर्योदय और सूर्यास्त समय। A clear, authentic educational Panchang for daily contemplation and study.',
  keywords: [
    'आज का पंचांग',
    'पंचांग',
    'Panchang',
    'Today Panchang',
    'Vedic Calendar',
    'तिथि',
    'नक्षत्र',
    'शुभ मुहूर्त',
    'Dharma Granth Panchang',
  ],
  alternates: { canonical: '/panchang/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'पञ्चाङ्ग · आज का पंचांग व दैनिक काल दर्शन (Vedic Panchang) — Dharma Granth',
    description:
      'दैनिक पञ्चाङ्ग: तिथि, पक्ष, नक्षत्र, योग, करण, ऋतु, सूर्योदय और सूर्यास्त समय। A clear, authentic educational Panchang for daily contemplation and study.',
    url: `${SITE_URL}/panchang/`,
  },
};

export default function PanchangLayout({ children }: { children: React.ReactNode }) {
  return children;
}
