import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPathway, wisdomPathways } from '@/data/wisdom-pathways';
import { resolvePathwayVerses, relatedPathways } from '@/lib/wisdom-pathways';
import { JsonLd } from '@/app/components/JsonLd';
import { PathwayDetailClient } from './PathwayDetailClient';

export function generateStaticParams() {
  return wisdomPathways.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const pathway = getPathway(params.slug);
  if (!pathway) return { title: 'Pathway Not Found' };
  const description = `${pathway.questionEn} ${pathway.introduction.en}`.slice(0, 155);
  return {
    title: `${pathway.titleEn} — ${pathway.titleHi}`,
    description,
    alternates: { canonical: `/wisdom-pathways/${pathway.slug}/` },
    openGraph: { title: `${pathway.titleEn} — Dharma Granth`, description, url: `https://dharmagranth.dev/wisdom-pathways/${pathway.slug}/` },
  };
}

export default async function WisdomPathwayPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const pathway = getPathway(params.slug);
  if (!pathway) notFound();
  const verses = resolvePathwayVerses(pathway);
  const related = relatedPathways(pathway.slug);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pathway.titleEn,
    inLanguage: ['en', 'hi'],
    about: pathway.questionEn,
  };
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: pathway.questionEn,
        acceptedAnswer: { '@type': 'Answer', text: pathway.scripturalFoundations.en },
      },
      {
        '@type': 'Question',
        name: 'How can I reflect on this teaching today?',
        acceptedAnswer: { '@type': 'Answer', text: pathway.contemplationPrompts.map((p) => p.en).join(' ') },
      },
    ],
  };
  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text">
      <JsonLd data={jsonLd} />
      <JsonLd data={faq} />
      <PathwayDetailClient
        pathway={pathway}
        verses={verses}
        related={related.map((r) => ({ slug: r.slug, titleEn: r.titleEn, titleHi: r.titleHi, questionEn: r.questionEn }))}
      />
    </main>
  );
}
