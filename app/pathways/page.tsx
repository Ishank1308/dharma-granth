import type { Metadata } from 'next';
import Link from 'next/link';
import { STARTER_PATHWAYS } from '@/data/wisdom-pathway-starters';
import { pathwayDiscovery, questionsForStarter, topicsForStarter } from '@/lib/wisdom-pathways';
import { StarterCard } from '@/app/components/pathways/StarterCard';
import { JsonLd } from '@/app/components/JsonLd';

export const metadata: Metadata = {
  title: 'Pathways — From Life to Scripture',
  description:
    'Twelve starting points — fear, anger, stress, distraction, failure, purpose, karma, mind, self, devotion, leadership, grief — each leading to authentic scriptural wisdom with lineage and quiet reflection.',
  alternates: { canonical: '/pathways/' },
};

export default function PathwaysIndexPage() {
  const groups = pathwayDiscovery();
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: STARTER_PATHWAYS.map((s) => ({
      '@type': 'Question',
      name: s.questionEn,
      acceptedAnswer: {
        '@type': 'Answer',
        text: s.pathwaySlug
          ? `${s.titleEn}. ${s.introductionEn}`
          : `${s.titleEn}. ${s.introductionEn} This path is still being written; begin with the linked topics and questions.`,
      },
    })),
  };
  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text">
      <JsonLd data={faq} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted">Wisdom from the Masters</p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl">Pathways</h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-dharma-muted">
          Begin where you are — with fear, anger, stress, distraction, failure, purpose, karma, the restless mind,
          the search for self, devotion, leadership, or grief — and let scripture do the teaching. Each path is a map,
          not the authority; the verses, the sages, and your own quiet reflection carry the weight.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {STARTER_PATHWAYS.map((s) => (
            <StarterCard
              key={s.slug}
              starter={s}
              topicLinks={topicsForStarter(s)}
              questionLinks={questionsForStarter(s).map((q) => ({
                href: q.href,
                labelEn: q.question.questionEn,
                labelHi: q.question.questionHi,
              }))}
            />
          ))}
        </div>
        <h2 className="mt-12 font-serif text-2xl">Start from anywhere</h2>
        <p className="mt-2 text-sm text-dharma-muted">
          An emotion, a challenge, a question, a scripture, a saint, a concept — every entrance below leads to the
          same canonical pathways.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {groups.map((g) => (
            <section key={g.key} className="rounded-2xl border border-dharma-line bg-dharma-card p-5">
              <h3 className="font-semibold">{g.labelEn}</h3>
              <p lang="hi" className="text-sm text-dharma-muted">
                {g.labelHi}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {g.entries.slice(0, 12).map((e) => (
                  <li key={`${g.key}-${e.label}`}>
                    <Link
                      href={e.href}
                      className="inline-block min-h-[44px] rounded-full border border-dharma-line px-3 py-2 text-sm"
                    >
                      {e.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
