import type { Metadata } from 'next';
import { CuriosityHubClient } from '@/app/components/curiosity/CuriosityHubClient';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { CURIOSITY_INQUIRIES } from '@/data/curiosity-inquiry';

export const metadata: Metadata = {
  title: 'जिज्ञासा एवं सहज शास्त्र-दर्शन — Curiosity-Driven Scripture Exploration | Dharma Granth',
  description:
    'Natural questions about courage, attention, duty, exams, and the soul answered with canonical Sanskrit verses and clear, non-dogmatic explanations for children, teenagers, parents, and beginners.',
  keywords: [
    'curious child questions on Gita',
    'scripture for teenagers',
    'teaching scripture to children without fear',
    'inquiry based dharma exploration',
    'bal jigyasa',
    'बाल जिज्ञासा',
    'कठोपनिषद् रथ रूपक',
    'गीता २.४७ सरल अर्थ',
    'Dharma Granth curiosity',
  ],
  alternates: { canonical: '/curiosity/' },
  openGraph: {
    type: 'website',
    locale: 'hi_IN',
    alternateLocale: ['en_US'],
    title: 'जिज्ञासा एवं सहज शास्त्र-दर्शन — Curiosity-Driven Scripture Exploration | Dharma Granth',
    description:
      'Curiosity opens the door. Scripture begins the conversation. Reflection deepens understanding. An inquiry-based exploration for children, teenagers, parents, and beginners.',
    url: 'https://dharmagranth.in/curiosity/',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'जिज्ञासा एवं सहज शास्त्र-दर्शन | Dharma Granth',
    description:
      'Natural questions that arise in children, teenagers, parents, and beginners, answered with authentic canonical verses.',
    images: [DEFAULT_OG_IMAGE.url],
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.in';

const curiosityJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}/curiosity/#webpage`,
      name: 'जिज्ञासा एवं सहज शास्त्र-दर्शन — Curiosity-Driven Scripture Exploration',
      url: `${siteUrl}/curiosity/`,
      description:
        'Inquiry-based exploration of Hindu scriptures for curious children, teenagers, parents, and beginners.',
      inLanguage: ['hi', 'sa', 'en'],
    },
    {
      '@type': 'FAQPage',
      '@id': `${siteUrl}/curiosity/#faq`,
      mainEntity: CURIOSITY_INQUIRIES.slice(0, 10).map((item) => ({
        '@type': 'Question',
        name: item.questionEn,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${item.simpleAnswerEn} (Canonical source: ${item.scriptureAnchor.scriptureTitle} ${item.scriptureAnchor.chapter}.${item.scriptureAnchor.verse})`,
        },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Curiosity & Inquiry', item: `${siteUrl}/curiosity/` },
      ],
    },
  ],
};

export default function CuriosityPage() {
  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(curiosityJsonLd) }}
      />
      <CuriosityHubClient />
    </main>
  );
}
