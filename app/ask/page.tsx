import type { Metadata } from 'next';
import Link from 'next/link';
import { AskDharmaClient } from '@/app/components/AskDharmaClient';
import { ANSWER_THEMES, GRANTH_ANSWERS, granthAnswersByTheme } from '@/data/granth-answers';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { PageHeader, SectionTitle } from '@/app/components/apple/PageHeader';

export const metadata: Metadata = {
  title: {
    absolute: 'धर्म सहायक — पुस्तकालय से जीवन के प्रश्न | Dharma Granth',
  },
  description:
    'Ask about worry, anger, grief, duty or God in your own words. Fifty answer pages give a one-line answer, verses from the Gita and Upanishads, a story and one step for today.',
  keywords: [
    'Dharma guide',
    'Bhagavad Gita on anxiety',
    'Bhagavad Gita on anger',
    'karma yoga',
    'गीता मार्गदर्शन',
  ],
  alternates: { canonical: '/ask/' },
  openGraph: {
    type: 'website',
    locale: 'hi_IN',
    alternateLocale: ['en_US'],
    title: 'धर्म सहायक — पुस्तकालय से जीवन के प्रश्न | Dharma Granth',
    description:
      'Questions about anxiety, anger, duty, and Karma Yoga, answered from verses already in the library.',
    url: 'https://dharmagranth.dev/ask/',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'धर्म सहायक — पुस्तकालय से जीवन के प्रश्न | Dharma Granth',
    description:
      'Sanskrit verses, Hindi meaning, and the library note already published for that topic.',
    images: [DEFAULT_OG_IMAGE.url],
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}/ask/#webpage`,
      name: 'धर्म सहायक — Scripture guide',
      url: `${siteUrl}/ask/`,
      description:
        'Ask questions about anxiety, anger, karma, life purpose, and mental focus grounded in Hindu scriptures.',
      inLanguage: ['hi', 'sa', 'en'],
    },
    {
      '@type': 'FAQPage',
      '@id': `${siteUrl}/ask/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What does the Bhagavad Gita teach about anxiety and stress?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Gita teaches that anxiety stems from attachment to results outside our control (2.47). By dedicating all effort to the present action without mental obsessing over the fruit, the mind settles into calm composure (Samatvam).',
          },
        },
        {
          '@type': 'Question',
          name: 'How should one control anger according to the Bhagavad Gita?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'In Gita 2.62-63, Krishna explains the psychological chain: attachment produces desire, frustrated desire produces anger, anger leads to clouded judgment, loss of memory, and intellectual ruin. Practicing detachment breaks this chain before anger arises.',
          },
        },
        {
          '@type': 'Question',
          name: 'How can one discover life purpose (Swadharma)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Gita emphasizes that fulfilling one’s own duty, aligned with one’s natural tendencies (Swabhava), is superior to imitating another’s path (3.35). Purpose is discovered through dedicated selfless service rather than external validation.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does Hindu philosophy teach mind control?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Arjuna asks Krishna how to restrain a mind as turbulent as the wind (6.34). Krishna responds that through persistent practice (Abhyasa) and dispassion toward distractions (Vairagya), the mind is gradually mastered (6.35).',
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'धर्म सहायक', item: `${siteUrl}/ask/` },
      ],
    },
  ],
};

// Only what the matcher needs goes to the browser; the answer pages are static.
const questionBank = GRANTH_ANSWERS.map(({ slug, questionHi, questionEn, sarHi, terms }) => ({ slug, questionHi, questionEn, sarHi, terms }));

export default function AskDharmaPage() {
  return (
    <main className="min-h-screen bg-dharma-bg pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHeader
        eyebrow="Ask"
        eyebrowHi="धर्म सहायक"
        title="Ask the scriptures"
        titleHi="जीवन के प्रश्न, शास्त्रों के प्रकाश में"
        lead={
          <>
            <span lang="hi" className="font-devanagari">
              अपने शब्दों में पूछें: चिन्ता, क्रोध, दुःख, कर्तव्य या ईश्वर। उत्तर-पृष्ठ के श्लोक और अर्थ पुस्तकालय से हैं; सार, दृष्टान्त और अभ्यास सम्पादकीय टिप्पणियाँ हैं।
            </span>{' '}
            <span>Ask in your own words. The verses come from the library; the summary, story and practice are editorial notes.</span>
          </>
        }
      />

      <section className="mx-auto mt-8 max-w-content px-gutter">
        <AskDharmaClient questionBank={questionBank} />
      </section>

      <section className="mx-auto mt-16 max-w-content px-gutter" aria-labelledby="granth-questions">
        <SectionTitle
          id="granth-questions"
          title="Questions people ask"
          titleHi="ग्रन्थ से पूछिए"
          sub={
            <>
              <span>{GRANTH_ANSWERS.length} questions, each answered with verses from several texts, a story and one step for today.</span>{' '}
              <span lang="hi" className="font-devanagari">{GRANTH_ANSWERS.length} प्रश्न, श्लोक, दृष्टान्त और आज के एक अभ्यास के साथ।</span>
            </>
          }
        />
        <div className="grid gap-x-6 gap-y-8 md:grid-cols-2">
          {ANSWER_THEMES.map((theme) => (
            <div key={theme.id}>
              <h3 className="mb-2 px-1 text-footnote text-dharma-muted">
                <span lang="hi" className="font-devanagari text-subhead font-semibold text-dharma-text">{theme.titleHi}</span>{' '}
                <span>{theme.titleEn}</span>
              </h3>
              <ul className="apple-group">
                {granthAnswersByTheme(theme.id).map((a) => (
                  <li key={a.slug}>
                    <Link href={`/ask/${a.slug}/`} className="apple-row">
                      <span className="min-w-0">
                        <span lang="hi" className="block font-devanagari text-callout leading-snug text-dharma-text">{a.questionHi}</span>{' '}
                        <span className="block text-footnote leading-snug text-dharma-muted">{a.questionEn}</span>
                      </span>
                      <span aria-hidden="true" className="apple-chevron">›</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
