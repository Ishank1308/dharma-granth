import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { JsonLd } from '@/app/components/JsonLd';
import { pageLd, articleLd, definedTermLd } from '@/lib/jsonld';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GitBranch,
  Languages,
  Link2,
  ScrollText,
} from 'lucide-react';
import { FadeUp, FadeUpOnView } from '@/app/components/motion/primitives';
import { dictionary, getTerm, termCategories, type DictionaryTerm } from '@/data/dictionary';
import { ShareChips } from '@/app/components/ShareChips';

export function generateStaticParams() {
  return dictionary.map((t) => ({ id: t.id }));
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const term = getTerm(params.id);
  if (!term) return { title: 'Term Not Found' };

  return {
    title: `${term.term} (${term.sanskrit}) — Dictionary`,
    description: term.shortDef,
    alternates: { canonical: `/dictionary/${term.id}/` },
    openGraph: {
      images: [DEFAULT_OG_IMAGE],
      title: `${term.term} (${term.sanskrit}) — Dharma Granth Dictionary`,
      description: term.shortDef,
      url: `https://dharmagranth.dev/dictionary/${term.id}/`,
    },
  };
}

export default async function TermPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const term = getTerm(params.id);
  if (!term) notFound();

  const cat = termCategories.find((c) => c.key === term.category);
  const relatedTerms = term.relatedTerms
    .map((id) => getTerm(id))
    .filter((t): t is DictionaryTerm => t !== undefined);

  return (
    <main className="min-h-screen bg-dharma-bg">
      <JsonLd
        data={pageLd(
          [
            { name: 'Dictionary', path: '/dictionary' },
            { name: term.term, path: `/dictionary/${term.id}` },
          ],
          definedTermLd({
            path: `/dictionary/${term.id}`,
            name: term.term,
            alt: [term.sanskrit, term.transliteration].filter(Boolean),
            description: term.shortDef,
            setPath: '/dictionary',
            setName: 'Dharma Granth Dictionary',
          }),
        )}
      />
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className={`relative bg-gradient-to-br ${cat?.gradient ?? 'from-saffron-500 to-amber-600'} text-white py-16 overflow-hidden`}>
        <div className="absolute inset-0 mandala-bg opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 relative">
          <FadeUp>
            <Link
              href="/dictionary"
              className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              All Terms
            </Link>

            <div className="flex items-start gap-4 mb-4">
              <div>
                <h1 className="text-5xl font-serif font-bold mb-2">{term.term}</h1>
                <p lang="sa" className="font-devanagari text-2xl text-white/80">
                  {term.sanskrit}
                </p>
                <p className="text-sm italic text-white/60 mt-1">{term.transliteration}</p>
              </div>
            </div>

            <p className="text-lg opacity-90 max-w-2xl leading-relaxed">
              {term.shortDef}
            </p>
            <ShareChips tone="dark" className="mt-5" title={`${term.term} (${term.sanskrit})`} summary={term.shortDef} path={`/dictionary/${term.id}`} />
          </FadeUp>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 -mt-8 relative z-10 pb-20 space-y-12">
        {/* ── Definition ──────────────────────────────────────────── */}
        <FadeUpOnView>
          <div className="rounded-2xl border border-dharma-border bg-dharma-card shadow-xl overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${cat?.gradient}`} />
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-serif font-bold text-dharma-text mb-4">
                Definition
              </h2>
              <p className="text-dharma-text leading-relaxed">
                {term.definition}
              </p>
            </div>
          </div>
        </FadeUpOnView>

        {/* ── Etymology ──────────────────────────────────────────── */}
        <FadeUpOnView>
          <div className="rounded-2xl border border-dharma-border bg-dharma-card shadow-xl overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${cat?.gradient}`} />
            <div className="p-6 md:p-8">
              <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-dharma-text mb-4">
                <Languages className="w-5 h-5 text-saffron-600" />
                Etymology
              </h2>
              <p className="text-dharma-text leading-relaxed italic">
                {term.etymology}
              </p>
            </div>
          </div>
        </FadeUpOnView>

        {/* ── Key Texts ──────────────────────────────────────────── */}
        <FadeUpOnView>
          <div className="rounded-2xl border border-dharma-border bg-dharma-card shadow-xl overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${cat?.gradient}`} />
            <div className="p-6 md:p-8">
              <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-dharma-text mb-4">
                <ScrollText className="w-5 h-5 text-saffron-600" />
                Key Texts
              </h2>
              <div className="flex flex-wrap gap-2">
                {term.keyTexts.map((text) => (
                  <span
                    key={text}
                    className="px-3 py-1.5 bg-saffron-50 text-saffron-800 rounded-full text-sm font-semibold border border-saffron-200"
                  >
                    {text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </FadeUpOnView>

        {/* ── Related Verses ─────────────────────────────────────── */}
        {term.verses.length > 0 && (
          <FadeUpOnView>
            <div className="rounded-2xl border border-dharma-border bg-dharma-card shadow-xl overflow-hidden">
              <div className={`h-1.5 bg-gradient-to-r ${cat?.gradient}`} />
              <div className="p-6 md:p-8">
                <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-dharma-text mb-6">
                  <BookOpen className="w-5 h-5 text-saffron-600" />
                  Related Verses
                </h2>
                <div className="space-y-4">
                  {term.verses.map((verse, i) => (
                    <div key={i} className="relative rounded-xl border border-dharma-border bg-dharma-bg/40 p-5">
                      <div className="absolute -top-2.5 left-4 w-5 h-5 rounded-full bg-gradient-to-br from-saffron-500 to-amber-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                        {i + 1}
                      </div>
                      <p lang="sa" className="font-devanagari text-base text-dharma-text leading-relaxed mb-2 mt-1">
                        {verse.sanskrit}
                      </p>
                      {verse.transliteration && (
                        <p className="text-xs italic text-dharma-muted mb-2">
                          {verse.transliteration}
                        </p>
                      )}
                      <p className="text-sm text-dharma-text leading-relaxed mb-2">
                        {verse.translation}
                      </p>
                      <span className="text-[10px] font-bold text-saffron-700 uppercase tracking-wider">
                        {verse.reference}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUpOnView>
        )}

        {/* ── Cross-Tradition Interpretations ────────────────────── */}
        {term.crossTradition.length > 0 && (
          <FadeUpOnView>
            <div className="rounded-2xl border border-dharma-border bg-dharma-card shadow-xl overflow-hidden">
              <div className={`h-1.5 bg-gradient-to-r ${cat?.gradient}`} />
              <div className="p-6 md:p-8">
                <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-dharma-text mb-6">
                  <GitBranch className="w-5 h-5 text-saffron-600" />
                  Interpretations Across Traditions
                </h2>
                <div className="space-y-4">
                  {term.crossTradition.map((interp, i) => (
                    <div key={i} className="rounded-xl border border-dharma-border bg-dharma-bg/40 p-5">
                      <h3 className="font-serif font-bold text-saffron-700 mb-2">
                        {interp.tradition}
                      </h3>
                      <p className="text-sm text-dharma-text leading-relaxed">
                        {interp.view}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUpOnView>
        )}

        {/* ── Related Terms ──────────────────────────────────────── */}
        {relatedTerms.length > 0 && (
          <FadeUpOnView>
            <div>
              <h2 className="flex items-center gap-2 text-lg font-serif font-bold text-dharma-text mb-4">
                <Link2 className="w-4 h-4 text-saffron-600" />
                Related Terms
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedTerms.map((rel) => {
                  const relCat = termCategories.find((c) => c.key === rel.category);
                  return (
                    <Link
                      key={rel.id}
                      href={`/dictionary/${rel.id}`}
                      className="group rounded-xl border border-dharma-border bg-dharma-card p-5 hover:shadow-lg hover:border-saffron-300 transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition">
                            {rel.term}
                          </h3>
                          <p lang="sa" className="font-devanagari text-sm text-saffron-600">
                            {rel.sanskrit}
                          </p>
                        </div>
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${relCat?.gradient} mt-2`} />
                      </div>
                      <p className="text-sm text-dharma-muted leading-relaxed">
                        {rel.shortDef}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </FadeUpOnView>
        )}

        {/* ── Navigation ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/dictionary"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-saffron-700 hover:text-saffron-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            All Terms
          </Link>
          <Link
            href="/concepts"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-saffron-700 hover:text-saffron-800 transition"
          >
            Concept Graph
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
