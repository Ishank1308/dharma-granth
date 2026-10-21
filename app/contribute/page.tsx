import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { ContributeClient } from './ContributeClient';
import { SiteFooter } from '@/app/components/SiteFooter';

export const metadata: Metadata = {
  title: 'ऐच्छिक सहयोग व सेवा · Voluntary Contribution',
  description:
    'धर्म ग्रंथ के निःशुल्क, विज्ञापन-मुक्त और डिजिटल शास्त्र संरक्षण के लिए प्रत्यक्ष UPI व सत्यापित QR द्वारा ऐच्छिक सहयोग। Direct UPI and verified QR for supporting Dharma Granth.',
  alternates: { canonical: '/contribute/' },
  openGraph: {
    title: 'ऐच्छिक सहयोग व सेवा · Voluntary Contribution — Dharma Granth',
    description:
      'धर्म ग्रंथ के निःशुल्क, विज्ञापन-मुक्त और डिजिटल शास्त्र संरक्षण के लिए प्रत्यक्ष UPI व सत्यापित QR द्वारा ऐच्छिक सहयोग। Direct UPI and verified QR for supporting Dharma Granth.',
    url: '/contribute/',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ऐच्छिक सहयोग व सेवा · Voluntary Contribution — Dharma Granth',
    description:
      'धर्म ग्रंथ के निःशुल्क, विज्ञापन-मुक्त और डिजिटल शास्त्र संरक्षण के लिए प्रत्यक्ष UPI व सत्यापित QR द्वारा ऐच्छिक सहयोग।',
  },
};

const contributeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'ऐच्छिक सहयोग व सेवा · Voluntary Contribution — Dharma Granth',
  url: 'https://dharmagranth.in/contribute/',
  description:
    'Voluntary, zero-commission, direct UPI and verified QR contribution system for sustaining Dharma Granth free and ad-free scripture library.',
  inLanguage: ['hi', 'sa', 'en'],
  publisher: {
    '@type': 'Organization',
    name: 'Dharma Granth',
    url: 'https://dharmagranth.in/',
  },
};

export default function ContributePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contributeJsonLd) }}
      />
      <main className="min-h-screen bg-dharma-bg text-dharma-text pb-20 selection:bg-amber-200 selection:text-amber-900">
        <ContributeClient />
      </main>
      <SiteFooter />
    </>
  );
}
