import type { Metadata } from 'next';
import Link from 'next/link';
import { wisdomPathways } from '@/data/wisdom-pathways';
import { STARTER_PATHWAYS } from '@/data/wisdom-pathway-starters';
import { pathwayDiscovery, questionsForStarter, topicsForStarter } from '@/lib/wisdom-pathways';
import { StarterCard } from '@/components/pathways/StarterCard';
import { PageHeader, SectionTitle } from '@/app/components/apple/PageHeader';
import { JsonLd } from '@/app/components/JsonLd';
import { BookOpen, Clock, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wisdom Pathways — From Life to Scripture',
  description:
    'Begin from an emotion, challenge, question, scripture, saint, or concept and arrive at authentic scriptural wisdom with lineage and reflection.',
  alternates: { canonical: '/wisdom-pathways/' },
};

export default function WisdomPathwaysPage() {
  const groups = pathwayDiscovery();
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: wisdomPathways.slice(0, 7).map((p) => ({
      '@type': 'Question',
      name: p.questionEn,
      acceptedAnswer: { '@type': 'Answer', text: `${p.titleEn}. ${p.introduction.en}` },
    })),
  };

  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text">
      <JsonLd data={faq} />

      <PageHeader
        eyebrow="Wisdom from the Masters"
        eyebrowHi="ज्ञान मार्ग"
        title="Wisdom Pathways"
        titleHi="जीवन के प्रश्नों से शास्त्र तक"
        lead={
          <>
            <span>
              Each pathway begins with a real human challenge and guides you through scriptural teachings, the sages who transmitted them, and quiet reflection. The scripture is the authority; this site is only the bridge.
            </span>
            <span lang="hi" className="mt-1.5 block font-devanagari text-subhead">
              प्रत्येक मार्ग आपके किसी वास्तविक जीवन-प्रश्न से आरम्भ होकर प्रमाणित श्लोकों, आचार्य-परम्परा और शान्त आत्म-चिन्तन तक ले जाता है।
            </span>
          </>
        }
      />

      <div className="mx-auto max-w-content px-gutter pb-20 pt-6 space-y-14">
        {/* Core Canonical Pathways */}
        <section aria-labelledby="canonical-pathways-heading">
          <SectionTitle
            id="canonical-pathways-heading"
            eyebrow="Guided Contemplations"
            eyebrowHi="प्रमुख साधना पथ"
            title="Walk a complete pathway"
            titleHi="पूर्ण स्वाध्याय मार्ग"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {wisdomPathways.map((p) => (
              <Link
                key={p.slug}
                href={`/wisdom-pathways/${p.slug}/`}
                className="apple-card group flex flex-col justify-between rounded-card border border-dharma-border bg-dharma-card p-6 hover:border-saffron-500/50 hover:shadow-raised transition-all"
              >
                <div>
                  <p className="text-caption font-semibold uppercase tracking-wider text-dharma-saffron">
                    {p.questionEn}
                  </p>
                  <h3 className="mt-1.5 font-serif text-title-3 font-semibold text-dharma-text group-hover:text-dharma-saffron transition">
                    {p.titleEn}
                  </h3>
                  <p lang="hi" className="mt-0.5 font-devanagari text-base text-dharma-text-secondary">
                    {p.titleHi}
                  </p>
                  {p.sanskritSubtitle && (
                    <p lang="sa" className="mt-1 font-sanskrit text-sm text-dharma-muted">
                      {p.sanskritSubtitle}
                    </p>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-dharma-muted line-clamp-2">
                    {p.introduction.en}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-dharma-border/60 pt-3.5 text-xs text-dharma-muted">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-dharma-saffron" aria-hidden="true" />
                      <span>{p.verseLenses.length} verses</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-dharma-saffron" aria-hidden="true" />
                      <span>{p.lineageIds.length} masters</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-dharma-saffron" aria-hidden="true" />
                      <span>{p.readingTimeMinutes} min</span>
                    </span>
                  </div>
                  <span className="font-semibold text-saffron-700 dark:text-saffron-300 group-hover:translate-x-0.5 transition-transform">
                    प्रवेश करें &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Life-question starters */}
        <section aria-labelledby="starter-pathways-heading">
          <SectionTitle
            id="starter-pathways-heading"
            eyebrow="Life Situations"
            eyebrowHi="जीवन-स्थितियाँ"
            title="Begin from a life question"
            titleHi="अपने प्रश्न से आरम्भ करें"
            sub="Fear, anger, stress, distraction, failure, purpose, karma, the restless mind, devotion, leadership, grief — each leads directly into verified scripture."
          />
          <div className="grid gap-4 md:grid-cols-2">
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
        </section>

        {/* Discovery paths */}
        <section aria-labelledby="discovery-paths-heading">
          <SectionTitle
            id="discovery-paths-heading"
            eyebrow="Six Doors In"
            eyebrowHi="षड्-द्वार अन्वेषण"
            title="Discovery paths"
            titleHi="भाव, सन्त, ग्रन्थ व सिद्धान्त से खोजें"
            sub="Start where you are — an emotion, a challenge, a question, a scripture, a saint, or a concept — and arrive at the same timeless teaching."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {groups.map((g) => (
              <section
                key={g.key}
                className="apple-card rounded-card border border-dharma-border bg-dharma-card p-5 sm:p-6"
              >
                <h3 className="text-base font-semibold text-dharma-text">{g.labelEn}</h3>
                <p lang="hi" className="font-devanagari text-sm text-dharma-muted">
                  {g.labelHi}
                </p>
                <ul className="mt-3.5 flex flex-wrap gap-2">
                  {g.entries.slice(0, 12).map((e) => (
                    <li key={`${g.key}-${e.label}`}>
                      <Link
                        href={e.href.endsWith('/') || e.href.includes('#') || e.href.includes('?') ? e.href : `${e.href}/`}
                        className="focus-ring inline-flex min-h-[40px] items-center rounded-full border border-dharma-border bg-dharma-bg px-3.5 py-1.5 text-xs font-medium text-dharma-text hover:border-saffron-400 hover:text-dharma-saffron transition"
                      >
                        {e.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
