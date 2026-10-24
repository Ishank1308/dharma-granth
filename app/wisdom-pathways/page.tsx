import type { Metadata } from 'next';
import Link from 'next/link';
import { wisdomPathways } from '@/data/wisdom-pathways';
import { pathwayDiscovery } from '@/lib/wisdom-pathways';
import { JsonLd } from '@/app/components/JsonLd';

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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted">Wisdom from the Masters</p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl">Wisdom Pathways</h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-dharma-muted">
          Not topic pages. Each pathway begins with a real human challenge and guides you through scriptural
          teachings, the sages who transmitted them, and quiet reflection. The scripture is the authority; this site
          is only the bridge.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {wisdomPathways.map((p) => (
            <Link
              key={p.slug}
              href={`/wisdom-pathways/${p.slug}/`}
              className="rounded-2xl border border-dharma-line bg-dharma-card p-5 hover:border-amber-400/60"
            >
              <p className="font-serif text-lg">{p.titleEn}</p>
              <p lang="hi" className="mt-0.5 text-base text-dharma-muted">{p.titleHi}</p>
              <p className="mt-2 text-sm text-dharma-muted">{p.questionEn}</p>
              <p className="mt-2 text-xs text-dharma-muted">{p.mastersFocusEn}</p>
            </Link>
          ))}
        </div>
        <h2 className="mt-12 font-serif text-2xl">Discovery paths</h2>
        <p className="mt-2 text-sm text-dharma-muted">
          Start where you are — an emotion, a challenge, a question, a scripture, a saint, a concept — and arrive at
          the same wisdom.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {groups.map((g) => (
            <section key={g.key} className="rounded-2xl border border-dharma-line bg-dharma-card p-5">
              <h3 className="font-semibold">{g.labelEn}</h3>
              <p lang="hi" className="text-sm text-dharma-muted">{g.labelHi}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {g.entries.slice(0, 12).map((e) => (
                  <li key={`${g.key}-${e.label}`}>
                    <Link href={e.href} className="rounded-full border border-dharma-line px-3 py-1 text-sm">
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
