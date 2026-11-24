import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Layers, ScrollText } from 'lucide-react';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { articleLd, pageLd } from '@/lib/jsonld';
import { EDITION_NAME } from '@/lib/editorial-terminology';
import { STUDY_LAYER_GUIDE } from '@/lib/study-layers';
import { OnThisPage } from '@/app/components/OnThisPage';
import { PageHeader, SectionTitle } from '@/app/components/apple/PageHeader';
import { PageCover } from '@/app/components/PagePhoto';

export const metadata: Metadata = {
  title: 'How Dharma Granth works',
  description:
    'Scripture first, study aids second: where the Sanskrit comes from, what translations and notes are, and what has not been reviewed yet.',
  alternates: { canonical: '/how-dharma-granth-works/' },
  openGraph: {
    title: 'How Dharma Granth works',
    description:
      'Scripture first, study aids second: where the Sanskrit comes from, what translations and notes are, and what has not been reviewed yet.',
    url: '/how-dharma-granth-works/',
    images: [DEFAULT_OG_IMAGE],
  },
};

const POINTS: { title: string; hi: string; body: string }[] = [
  {
    title: '1. The scripture comes first',
    hi: 'मूल शास्त्र सर्वप्रथम',
    body: 'Every verse page opens with the original Sanskrit. It is the authority here; everything after it exists only to help you read it.',
  },
  {
    title: '2. Translations are reading aids',
    hi: 'अनुवाद पठन-सहायक हैं',
    body: 'Hindi and English meanings help you follow the Sanskrit. Some were prepared with machine assistance and are flagged as study translations; none has been checked by a Sanskrit scholar yet.',
  },
  {
    title: '3. Explanations are editorial drafts',
    hi: 'व्याख्या संपादकीय प्रारूप है',
    body: 'Simple expositions, reflections, and research notes were written for this site to help new readers. They are marked as editorial drafts, kept separate from the text, and await scholarly review.',
  },
  {
    title: '4. Traditions are named, not merged',
    hi: 'सम्प्रदायों का स्पष्ट नामोल्लेख',
    body: 'Where classical commentators are summarised, they are named — Shankara, Ramanuja, Sridhara, and others. The summaries are short paraphrases, not quotations, and no single tradition is presented as the only view.',
  },
  {
    title: '5. Lineage shows how teachings travelled',
    hi: 'आचार्य एवं ऋषि परम्परा',
    body: 'Verses connect to scriptures, commentators, acharyas, and saints — rishis, bhakti masters, and Vedantic teachers — so you can see whose shoulders each teaching stands on.',
  },
  {
    title: '6. Review is recorded, not claimed',
    hi: 'सत्यापन का पारदर्शी लेखा',
    body: 'This site shows no “verified” or “reviewed” badges unless a named reviewer checks a text with recorded date and attribution.',
  },
  {
    title: '7. Corrections are welcome',
    hi: 'सुधार सदैव स्वागतयोग्य',
    body: 'Every verse page has a way to report an error. Fixes are made in the open project repository, whose history is the record of what changed and when.',
  },
];

export default function HowDharmaGranthWorksPage() {
  const jsonLd = pageLd(
    [{ name: 'How Dharma Granth works', path: '/how-dharma-granth-works/' }],
    articleLd({
      path: '/how-dharma-granth-works/',
      headline: 'How Dharma Granth works',
      description:
        'Scripture first, study aids second: where the Sanskrit comes from, what translations and notes are, and what has not been reviewed yet.',
    }),
  );
  return (
    <main id="main" className="apple-scope long-read min-h-screen bg-dharma-bg pb-24 text-dharma-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div data-vt-hero>
        <PageHeader
          eyebrow={EDITION_NAME}
          eyebrowHi="पठन संरचना"
          title="How Dharma Granth works"
          titleHi="शास्त्र प्रथम, अध्ययन-सहायक द्वितीय"
          cover={<PageCover photo="corridor" />}
          lead={
            <p>
              This library holds scripture with care and study aids with honesty. These seven principles explain what each layer of a verse page is — and what it is not.
            </p>
          }
        />
      </div>

      <div className="mx-auto max-w-content px-gutter">
        <OnThisPage
          className="mb-8"
          items={[
            ...POINTS.map((point, i) => ({
              id: `point-${i + 1}`,
              en: point.title.replace(/^\d+\.\s*/, ''),
              hi: point.hi,
            })),
            { id: 'layers', en: 'What each layer is', hi: 'पठन के स्तर' },
          ]}
        />

        <div className="reveal-grid fluid-grid-md">
          {POINTS.map((point, i) => (
            <section key={point.title} className="apple-card flex flex-col justify-between p-5 sm:p-6">
              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-field bg-dharma-saffron/12 text-dharma-saffron">
                    <ScrollText className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="apple-stat rounded-pill border border-separator bg-fill-quaternary px-2.5 py-0.5 font-mono text-caption font-semibold text-label-secondary">
                    0{i + 1}
                  </span>
                </div>
                <h2 id={`point-${i + 1}`} className="scroll-mt-24 text-title-3 font-semibold text-dharma-text">
                  <span>{point.title}</span>{' '}
                  <span lang="hi" className="mt-0.5 block font-devanagari text-sm font-normal text-dharma-muted">
                    {point.hi}
                  </span>
                </h2>
                <p className="mt-2.5 text-subhead leading-relaxed text-dharma-text-secondary">{point.body}</p>
              </div>
            </section>
          ))}
        </div>

        <section aria-labelledby="layers" className="pt-14 sm:pt-16">
          <SectionTitle
            id="layers"
            title="What each layer is"
            titleHi="श्लोक पृष्ठ की प्रत्येक परत का परिचय"
            sub="A verse page separates canonical Sanskrit, translation, traditional paraphrase, and modern reflection into distinct visual frames."
          />
          <dl className="reveal-grid fluid-grid-md mt-6">
            {STUDY_LAYER_GUIDE.map((layer) => (
              <div key={layer.id} className="apple-card p-5 sm:p-6">
                <dt className="flex items-center gap-2 text-title-3 font-semibold text-dharma-text">
                  <Layers className="h-4 w-4 shrink-0 text-dharma-saffron" aria-hidden="true" />
                  <span>{layer.titleEn}</span>{' '}
                  <span lang="hi" className="font-devanagari text-sm font-normal text-dharma-muted">
                    · {layer.titleHi}
                  </span>
                </dt>
                <dd className="mt-3 space-y-2 text-subhead leading-relaxed text-dharma-text-secondary">
                  <p>{layer.what}</p>
                  <p className="border-t border-separator pt-2 text-footnote text-dharma-muted">{layer.notWhat}</p>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-card border border-separator bg-surface-raised p-5 sm:p-6">
          <p className="text-subhead text-dharma-muted">
            For full archival detail, machine-assistance disclosures, and review policy:
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/methodology/" data-vt="open" className="focus-ring inline-flex min-h-tap items-center rounded-pill border border-separator-strong px-4 text-subhead font-semibold text-dharma-text hover:border-dharma-saffron/50">
              Methodology
            </Link>
            <Link href="/scriptures/" data-vt="open" className="apple-pill">
              <span>Explore Scriptures</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
