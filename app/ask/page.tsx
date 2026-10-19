import type { Metadata } from 'next';
import Link from 'next/link';
import { AskDharmaClient } from '@/app/components/AskDharmaClient';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { Sparkles, Compass, Shield, BookOpen, Sun, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: {
    absolute: 'शास्त्रीय मार्गदर्शन — पुस्तकालय से जीवन के प्रश्न | Dharma Granth',
  },
  description:
    'Questions about anxiety, anger, duty, and Karma Yoga, answered with verses and notes already published in the Dharma Granth library. No generated commentary.',
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
    title: 'शास्त्रीय मार्गदर्शन — पुस्तकालय से जीवन के प्रश्न | Dharma Granth',
    description:
      'Questions about anxiety, anger, duty, and Karma Yoga, answered from verses already in the library.',
    url: 'https://dharmagranth.in/ask/',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'शास्त्रीय मार्गदर्शन — पुस्तकालय से जीवन के प्रश्न | Dharma Granth',
    description:
      'Sanskrit verses, Hindi meaning, and the library note already published for that topic.',
    images: [DEFAULT_OG_IMAGE.url],
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.in';

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}/ask/#webpage`,
      name: 'शास्त्रीय मार्गदर्शन — Scripture guide',
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
        { '@type': 'ListItem', position: 2, name: 'शास्त्रीय मार्गदर्शन', item: `${siteUrl}/ask/` },
      ],
    },
  ],
};

export default function AskDharmaPage() {
  return (
    <main className="min-h-screen bg-dharma-bg pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-950 via-saffron-950 to-stone-900 text-white py-14 sm:py-20">
        <div className="absolute inset-0 mandala-bg opacity-15 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-dharma-bg via-transparent to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-5 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-xs sm:text-sm font-semibold mb-6 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>मुखपृष्ठ (Home)</span>
          </Link>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-200 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>शास्त्रीय मार्गदर्शन · पुस्तकालय से</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              जीवन के प्रश्नों का समाधान — शास्त्रों के पावन प्रकाश में
            </h1>

            <p className="text-base sm:text-lg text-amber-100/90 leading-relaxed font-devanagari">
              चिंता, क्रोध, धर्म या कर्मयोग पूछें। उत्तर उन्हीं श्लोकों और विषय-पृष्ठों से आता है जो पुस्तकालय में पहले से लिखे हैं। नई टीका नहीं लिखी जाती।
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-amber-200/80">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-amber-400" /> १००% शास्त्र-आधारित
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-amber-400" /> निष्पक्ष व प्रामाणिक
              </span>
              <span className="flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-amber-400" /> आधुनिक जीवन में उपयोगी
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Interface */}
      <section className="relative mx-auto max-w-5xl px-5 sm:px-6 -mt-6 sm:-mt-8 z-10">
        <AskDharmaClient />
      </section>
    </main>
  );
}
