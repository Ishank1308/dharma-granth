import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { articleLd, pageLd } from '@/lib/jsonld';
import { EDITION_NAME } from '@/lib/editorial-terminology';
import { STUDY_LAYER_GUIDE } from '@/lib/study-layers';

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

/**
 * Transparency page (Phase 5): seven plain points in a humble tone, plus
 * the study-layer guide (Phase 6). States what is true today, not what is
 * intended. Keep it true in the same change that changes practice.
 */
const POINTS: { title: string; body: string }[] = [
  {
    title: '1. The scripture comes first',
    body: 'Every verse page opens with the original Sanskrit. It is the authority here; everything after it exists only to help you read it.',
  },
  {
    title: '2. Translations are reading aids',
    body: 'Hindi and English meanings help you follow the Sanskrit. Some were prepared with machine assistance and are flagged as study translations; none has been checked by a Sanskrit scholar yet.',
  },
  {
    title: '3. Explanations are editorial drafts',
    body: 'Simple expositions, reflections, and research notes were written for this site to help new readers. They are marked as editorial drafts, kept separate from the text, and await scholarly review.',
  },
  {
    title: '4. Traditions are named, not merged',
    body: 'Where classical commentators are summarised, they are named — Shankara, Ramanuja, Sridhara, and others. The summaries are short paraphrases, not quotations, and no single tradition is presented as the only view.',
  },
  {
    title: '5. Lineage shows how teachings travelled',
    body: 'Verses connect to scriptures, commentators, acharyas, and saints — rishis, bhakti masters, and Vedantic teachers — so you can see whose shoulders each teaching stands on.',
  },
  {
    title: '6. Review is recorded, not claimed',
    body: 'This site shows no “verified” or “reviewed” badges, because no systematic human review is recorded yet. When a named reviewer checks a text, the review will be recorded with name and date — and only then will a badge appear.',
  },
  {
    title: '7. Corrections are welcome',
    body: 'Every verse page has a way to report an error. Fixes are made in the open project repository, whose history is the record of what changed and when.',
  },
];

const h2 = 'mt-10 font-serif text-xl font-bold text-dharma-text';
const p = 'mt-3 leading-relaxed text-dharma-text';

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
    <main id="main" className="min-h-screen bg-dharma-bg">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-saffron-800 dark:text-saffron-300">
          {EDITION_NAME} · कार्यपद्धति
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-dharma-text sm:text-4xl">How Dharma Granth works</h1>
        <p className={p}>
          This library holds scripture with care and study aids with honesty. These seven points say what each part
          of a verse page is — and what it is not.
        </p>

        {POINTS.map((point) => (
          <section key={point.title}>
            <h2 className={h2}>{point.title}</h2>
            <p className={p}>{point.body}</p>
          </section>
        ))}

        <h2 id="layers" className={h2}>What each layer is</h2>
        <p className={p}>
          A verse page carries several layers. Each is labelled where it appears; here is what the labels mean.
        </p>
        <dl className="mt-4 space-y-4">
          {STUDY_LAYER_GUIDE.map((layer) => (
            <div key={layer.id} className="rounded-2xl border border-dharma-border bg-dharma-card p-4">
              <dt className="font-bold text-dharma-text">
                {layer.titleEn} <span lang="hi" className="font-devanagari font-semibold text-dharma-muted">· {layer.titleHi}</span>
              </dt>
              <dd className="mt-1.5 space-y-1 text-sm leading-relaxed text-dharma-muted">
                <p>{layer.what}</p>
                <p>{layer.notWhat}</p>
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-10 text-sm text-dharma-muted">
          For full detail — sources, machine assistance, and review practice — see{' '}
          <Link href="/methodology" className="font-semibold text-saffron-800 underline-offset-2 hover:underline dark:text-saffron-300">
            Methodology: how this site is made
          </Link>
          . Back to the{' '}
          <Link href="/scriptures" className="font-semibold text-saffron-800 underline-offset-2 hover:underline dark:text-saffron-300">
            scripture library
          </Link>
          .
        </p>
      </article>
    </main>
  );
}
