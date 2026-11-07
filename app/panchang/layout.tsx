import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { JsonLd } from '@/app/components/JsonLd';

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
    images: [
      {
        url: '/og/panchang.png',
        width: 1200,
        height: 630,
        alt: 'दैनिक वैदिक पञ्चाङ्ग (Vedic Panchang) — Dharma Granth',
      },
    ],
    title: 'पञ्चाङ्ग · आज का पंचांग व दैनिक काल दर्शन (Vedic Panchang) — Dharma Granth',
    description:
      'दैनिक पञ्चाङ्ग: तिथि, पक्ष, नक्षत्र, योग, करण, ऋतु, सूर्योदय और सूर्यास्त समय। A clear, authentic educational Panchang for daily contemplation and study.',
    url: 'https://dharmagranth.dev/panchang/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'पञ्चाङ्ग · आज का पंचांग व दैनिक काल दर्शन (Vedic Panchang) — Dharma Granth',
    description:
      'दैनिक पञ्चाङ्ग: तिथि, पक्ष, नक्षत्र, योग, करण, ऋतु, सूर्योदय और सूर्यास्त समय। A clear, authentic educational Panchang for daily contemplation and study.',
    images: ['/og/panchang.png'],
  },
};

const PANCHANG_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://dharmagranth.dev/panchang/#webpage',
      url: 'https://dharmagranth.dev/panchang/',
      name: 'पञ्चाङ्ग · आज का पंचांग व दैनिक काल दर्शन (Vedic Panchang)',
      description:
        'दैनिक पञ्चाङ्ग: तिथि, पक्ष, नक्षत्र, योग, करण, ऋतु, सूर्योदय और सूर्यास्त समय। A clear, authentic educational Panchang for daily contemplation and study.',
      inLanguage: ['hi', 'sa', 'en'],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://dharmagranth.dev/panchang/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'पञ्चाङ्ग के पाँच अंग क्या हैं (What are the five limbs of Panchang)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'पञ्चाङ्ग के पाँच अंग हैं: (१) तिथि (Lunar Day), (२) वार (Solar Day), (३) नक्षत्र (Lunar Mansion), (४) योग (Soli-Lunar Angle), और (५) करण (Half-Tithi)।',
          },
        },
        {
          '@type': 'Question',
          name: 'उदया तिथि क्या है और इसका क्या महत्व है (What is Udaya Tithi)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'स्मार्त परम्परा में स्थानीय सूर्योदय के समय जो तिथि उपस्थित होती है, वही उस पूरे दिन के व्रत, पर्व और उपासना के लिए मान्य होती है, भले ही वह कुछ समय बाद समाप्त हो जाए।',
          },
        },
        {
          '@type': 'Question',
          name: 'अलग-अलग पंचांगों में समय का अंतर क्यों होता है?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'मुद्रित पंचांग किसी एक नगर के देशांतर (Longitude) और अक्षांश के अनुसार बनते हैं। स्थान बदलने पर सूर्योदय और ग्रहों की स्थिति में मिनटों का भेद आ जाता है।',
          },
        },
      ],
    },
  ],
};

export default function PanchangLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={PANCHANG_JSON_LD} />
      {children}
    </>
  );
}
