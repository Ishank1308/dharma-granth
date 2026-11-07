import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Hindu Temple Rituals & Practices (पूजा, आरती, अभिषेक, होम) — Meaning & Scriptural Basis',
  description:
    'Complete guide to Hindu temple and daily rituals: authentic scriptural meaning, symbolism, and step-by-step methods for Puja, Aarti, Abhisheka, Homa, and Sandhyavandana.',
  keywords: [
    'Hindu temple rituals explained',
    'Puja meaning and steps',
    'Aarti significance',
    'Abhisheka vidhi',
    'Homa and havan meaning',
    'Sandhyavandanam meaning',
    'मंदिर एवं अनुष्ठान विवरण',
    'dharma granth',
  ],
  alternates: { canonical: '/rituals/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'Hindu Temple Rituals & Practices (पूजा, आरती, अभिषेक, होम) — Meaning & Scriptural Basis',
    description:
      'Complete guide to Hindu temple and daily rituals: authentic scriptural meaning, symbolism, and step-by-step methods for Puja, Aarti, Abhisheka, Homa, and Sandhyavandana.',
    url: 'https://dharmagranth.dev/rituals/',
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';
const pageUrl = `${siteUrl}/rituals/`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: 'Hindu Temple Rituals & Practices (पूजा, आरती, अभिषेक, होम)',
      description:
        'Comprehensive guide to sacred Hindu temple rituals, scriptural origins and philosophical symbolism.',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Dharma Granth',
        url: `${siteUrl}/`,
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the significance and meaning of Puja (पूजा) in Hinduism?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Puja means reverent honoring and worship. It is a loving, hospitable communion where the Divine is welcomed, bathed, adorned, offered sacred food (naivedya), and celebrated with aarti and flowers.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is Aarti (आरती) and what does it symbolize?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Aarti (derived from "Aratrika" or "Nirajana") is the waving of lighted camphor or ghee wicks before the deity. It symbolizes the dispelling of darkness, ignorance, and ego by the radiant divine light.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is Abhisheka (अभिषेक) and why is it performed?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Abhisheka is the ritual bathing of a sacred murti or Shiva Linga with pure substances like water, milk, curd, honey, and ghee, accompanied by Vedic mantras (such as Rudram and Chamakam), signifying inner purification.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is Homa or Havan (होम/हवन)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Homa is a consecrated fire sacrifice derived from the Vedic Yajna tradition, where oblations of ghee, herbs, and grains are offered into Agni (the cosmic fire messenger) for ecological harmony and spiritual elevation.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is Sandhyavandana (संध्यावंदन)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sandhyavandana is the foundational daily Vedic spiritual practice performed at the dawn, noon, and dusk junctions (sandhi), incorporating pranayama, Gayatri mantra japa, and surya upasana.',
          },
        },
      ],
    },
  ],
};

export default function RitualsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
