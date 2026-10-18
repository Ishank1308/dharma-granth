import { clipDescription } from '@/lib/meta-text';
import { getLibraryFacts } from '@/lib/library-server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { JsonLd } from '@/app/components/JsonLd';
import { pageLd, articleLd, definedTermLd } from '@/lib/jsonld';
import {
  wisdomTopics,
  getWisdomTopic,
} from '@/data/wisdom-for-life';
import { TopicDetailClient } from './TopicDetailClient';
import { searchHeading } from '@/data/search-intent';

export function generateStaticParams() {
  return wisdomTopics.map((topic) => ({
    slug: topic.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const topic = getWisdomTopic(params.slug);
  if (!topic) {
    return {
      title: 'Topic Not Found',
    };
  }

  const heading = searchHeading(topic.slug, topic.verses);
  const title = heading
    ? `${heading.en} — ${topic.titleHi}`
    : `${topic.titleEn} (${topic.titleHi}) — Wisdom for Life`;
  const lead = topic.verses[0];
  const description = clipDescription(
    [lead?.sanskritDevanagari, lead?.literalTranslationHi || lead?.literalTranslationEn, topic.shortDescHi || topic.shortDescEn]
      .filter(Boolean)
      .join(' — '),
  );

  return {
    title,
    description,
    alternates: { canonical: `/wisdom-for-life/${topic.slug}/` },
    openGraph: {
      images: [DEFAULT_OG_IMAGE],
      title: `${title} — Dharma Granth`,
      description,
      url: `https://dharmagranth.in/wisdom-for-life/${topic.slug}/`,
    },
  };
}

export default function WisdomTopicPage({
  params,
}: {
  params: { slug: string };
}) {
  const topic = getWisdomTopic(params.slug);
  if (!topic) {
    notFound();
  }

  // Where each cited text's Sanskrit comes from, measured from the library's own data files.
  const libraryFacts: Record<string, { host?: string; fetched?: string }> = {};
  topic.verses.forEach((v) => {
    if (libraryFacts[v.scriptureId]) return;
    const facts = getLibraryFacts(v.scriptureId);
    libraryFacts[v.scriptureId] = { host: facts.sourceHost, fetched: facts.sourceFetched };
  });

  const heading = searchHeading(topic.slug, topic.verses);
  const currentIndex = wisdomTopics.findIndex((t) => t.slug === topic.slug);
  const prevTopic = currentIndex > 0 ? wisdomTopics[currentIndex - 1] : undefined;
  const nextTopic =
    currentIndex < wisdomTopics.length - 1 ? wisdomTopics[currentIndex + 1] : undefined;

  // SEO FAQPage & Article Structured Data
  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: heading
          ? heading.en
          : `What do Hindu scriptures teach about ${topic.titleEn} (${topic.titleHi})?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: topic.compassionateIntro.bodyEn || topic.shortDescEn,
        },
      },
      {
        '@type': 'Question',
        name: `Which verses from Bhagavad Gita or Upanishads guide us through ${topic.titleEn}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Key verses include ${topic.verses.map((v) => v.referenceDisplay).join(', ')}. For example, ${topic.verses[0]?.referenceDisplay}: "${topic.verses[0]?.literalTranslationEn}"`,
        },
      },
      {
        '@type': 'Question',
        name: `How to practically apply spiritual wisdom for ${topic.titleEn} in daily life?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            topic.reflections[0]?.dailyPractice ||
            topic.compassionateIntro.spiritualFoundationEn,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-dharma-bg">
      <JsonLd
        data={pageLd(
          [
            { name: 'Wisdom for Life', path: '/wisdom-for-life' },
            { name: topic.titleEn, path: `/wisdom-for-life/${topic.slug}` },
          ],
          articleLd({
            path: `/wisdom-for-life/${topic.slug}`,
            headline: `${topic.titleEn} (${topic.titleHi})`,
            description: topic.shortDescEn,
          }),
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <TopicDetailClient
        topic={topic}
        libraryFacts={libraryFacts}
        prevTopic={prevTopic}
        nextTopic={nextTopic}
        searchLine={heading}
      />
    </div>
  );
}
