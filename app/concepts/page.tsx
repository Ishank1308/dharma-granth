import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Compass } from 'lucide-react';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { ConceptGraph } from '@/app/components/ConceptGraph';
import { FadeUp } from '@/app/components/motion/primitives';
import { concepts } from '@/data/concepts';
import { getAllConceptDetails, getConceptDetail } from '@/data/concept-details';
import { GRAPH_CONCEPTS } from '@/data/knowledge-graph';
import { graphConceptLink } from '@/lib/knowledge-graph';

export const metadata: Metadata = {
  title: 'अवधारणा ज्ञान ग्राफ (Concepts Knowledge Graph)',
  description:
    'वैदिक और हिंदू दर्शन की अवधारणाओं — आत्मन्, ब्रह्मन्, कर्म, धर्म, मोक्ष और अधिक — के अंतरसंबंधों का अन्वेषण करें।',
  alternates: { canonical: '/concepts/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'अवधारणा ज्ञान ग्राफ (Concepts Knowledge Graph) — Dharma Granth',
    description:
      'वैदिक और हिंदू दर्शन की अवधारणाओं — आत्मन्, ब्रह्मन्, कर्म, धर्म, मोक्ष और अधिक — के अंतरसंबंधों का अन्वेषण करें।',
    url: 'https://dharmagranth.dev/concepts',
  },
};

export default function ConceptsPage() {
  const listedIds = new Set(concepts.map((concept) => concept.id));
  const articleIds = getAllConceptDetails().map((detail) => detail.id);
  const cards = [
    ...concepts.map((concept) => ({
      id: concept.id,
      label: concept.label,
      sanskrit: concept.sanskrit,
      category: concept.category,
      description: concept.description,
      refs: concept.scriptureRefs?.slice(0, 2).join(', ') ?? '',
      hasPage: Boolean(getConceptDetail(concept.id)),
    })),
    ...getAllConceptDetails()
      .filter((detail) => !listedIds.has(detail.id))
      .map((detail) => ({
        id: detail.id,
        label: detail.label,
        sanskrit: detail.sanskrit,
        category: detail.category,
        description: detail.simpleDefinition.hi,
        refs: detail.verses.slice(0, 2).map((verse) => verse.referenceHi || verse.reference).join(', '),
        hasPage: true,
      })),
  ];
  const articleCount = cards.filter((card) => card.hasPage).length;

  return (
    <main className="min-h-screen bg-dharma-bg">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-saffron-900 via-saffron-800 to-amber-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 mandala-bg opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <FadeUp>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-saffron-200 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              तत्त्वमीमांसा — ज्ञान ग्राफ (Knowledge Graph)
            </p>
            <h1 className="text-5xl font-serif font-bold mb-4">
              अवधारणा ज्ञान ग्राफ (Concept Knowledge Graph)
            </h1>
            <p className="text-xl opacity-90 max-w-2xl">
              ग्राफ में {concepts.length} नाम हैं। चुनने पर संक्षिप्त विवरण और दर्ज संदर्भ खुलते हैं। अलग लेख केवल वहीं खुलता है जहाँ वह लिखा गया है।
            </p>
          </FadeUp>
        </div>
      </section>

      <nav aria-label="पच्चीस मूल अवधारणाएँ" className="max-w-6xl mx-auto px-6 pt-8">
        <h2 className="font-serif text-xl font-bold text-dharma-text">
          <span lang="hi" className="font-devanagari">पच्चीस मूल अवधारणाएँ</span>
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {GRAPH_CONCEPTS.map((concept) => {
            const link = graphConceptLink(concept.id);
            if (!link) return null;
            return (
              <li key={concept.id}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-[44px] items-center rounded-full border border-dharma-border bg-dharma-card px-3 text-sm text-dharma-text hover:border-saffron-400"
                >
                  <span lang="sa" className="font-devanagari">{concept.sanskrit}</span>
                  <span className="ml-2 text-dharma-muted">{concept.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Graph ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-10 pb-12">
        <div className="bg-dharma-card/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-dharma-border p-4 sm:p-6 md:p-8">
          <ConceptGraph articleIds={articleIds} />
        </div>
      </section>

      {/* ── Visual Learning Layer Feature Banner ─────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="rounded-3xl border border-saffron-500/40 bg-gradient-to-r from-amber-950/40 via-saffron-950/30 to-neutral-950 p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/10 text-saffron-700 dark:text-saffron-300 font-bold text-xs border border-saffron-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>चरण 10 · Interactive Visual Learning Layer</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-dharma-text">
              दृश्य ज्ञान दर्शन — 10 मूल तत्त्वों के पवित्र आरेख
            </h2>
            <p className="text-sm text-dharma-muted leading-relaxed">
              धर्म, कर्म, मोक्ष, आत्मन्, ब्रह्मन्, माया, योग, वेदान्त, भक्ति और संसार के पवित्र ज्यामितीय मण्डल,
              कारण-कार्य प्रवाह आरेख, और क्रमिक सोपान का जीवंत अन्वेषण करें।
            </p>
          </div>
          <Link
            href="/concepts/visuals"
            className="focus-ring inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-saffron-600 to-amber-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:from-saffron-700 hover:to-amber-700 transition-all shrink-0 min-h-[48px]"
          >
            <Compass className="w-4 h-4" />
            <span>दृश्य अन्वेषक खोलें (Open Visual Explorer)</span>
          </Link>
        </div>
      </section>

      {/* ── 12 Core Concepts Encyclopedia Directory ──────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-24 border-t border-dharma-border pt-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-saffron-700 dark:text-saffron-400 mb-2">
            शास्त्रीय तत्त्वकोश · Philosophical Encyclopedia
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-dharma-text mb-4">
            अवधारणा सूची
          </h2>
          <p className="text-dharma-muted text-base leading-relaxed">
            {cards.length} नाम। {articleCount} का लिखा लेख है। शेष पर केवल संक्षिप्त विवरण है, अलग पृष्ठ नहीं।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div
              key={c.id}
              className="group rounded-2xl border border-dharma-border bg-dharma-card p-6 shadow-sm hover:shadow-md hover:border-saffron-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-dharma-text group-hover:text-saffron-700 dark:group-hover:text-saffron-400 transition-colors flex items-baseline gap-2">
                      <span lang="sa" className="font-devanagari text-2xl text-saffron-600 dark:text-saffron-400">
                        {c.sanskrit}
                      </span>
                      <span className="font-serif text-lg font-semibold">{c.label}</span>
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-saffron-500/10 text-saffron-700 dark:text-saffron-300 border border-saffron-500/20">
                    {c.category}
                  </span>
                </div>
                <p className="text-sm text-dharma-muted leading-relaxed line-clamp-3 mb-4">
                  {c.description}
                </p>
              </div>

              <div className="pt-4 border-t border-dharma-border/60 flex items-center justify-between gap-3">
                <span className="text-xs text-dharma-muted font-medium">
                  {c.refs}
                </span>
                {c.hasPage ? (
                  <Link
                    href={`/concepts/${c.id}`}
                    className="inline-flex min-h-[44px] items-center gap-1 text-xs font-semibold text-saffron-800 underline-offset-2 hover:underline"
                  >
                    <span>गहन विश्लेषण</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <p className="inline-flex min-h-[44px] items-center text-xs font-medium text-dharma-muted">
                    इसका अलग लेख नहीं है
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-dharma-border bg-dharma-card p-5 text-left">
          <h2 className="font-serif text-2xl font-bold text-dharma-text">
            <span lang="hi" className="font-devanagari">वेदान्त</span>
          </h2>
          <p lang="hi" className="mt-2 text-sm leading-relaxed text-dharma-text">
            वेदान्त का लेख इस सूची में है। ये चार पृष्ठ भी उसी पढ़ने से जुड़े हैं।
          </p>
          <ul className="mt-3 flex flex-wrap gap-3 text-sm">
            <li><Link href="/concepts/vedanta" className="inline-flex min-h-[44px] items-center font-semibold text-saffron-800 underline underline-offset-2">वेदान्त</Link></li>
            <li><Link href="/concepts/brahman" className="inline-flex min-h-[44px] items-center font-semibold text-saffron-800 underline underline-offset-2">ब्रह्म</Link></li>
            <li><Link href="/concepts/atman" className="inline-flex min-h-[44px] items-center font-semibold text-saffron-800 underline underline-offset-2">आत्मा</Link></li>
            <li><Link href="/concepts/maya" className="inline-flex min-h-[44px] items-center font-semibold text-saffron-800 underline underline-offset-2">माया</Link></li>
            <li><Link href="/concepts/moksha" className="inline-flex min-h-[44px] items-center font-semibold text-saffron-800 underline underline-offset-2">मोक्ष</Link></li>
          </ul>
        </div>
      </section>
    </main>
  );
}
