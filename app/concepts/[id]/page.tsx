import { clipDescription } from '@/lib/meta-text';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllConceptDetails,
  getConceptDetail,
} from '@/data/concept-details';
import { graphPageIds } from '@/data/knowledge-graph';
import { buildGraphPage } from '@/lib/knowledge-graph';
import { GraphConceptPage, GraphConceptSections } from '../GraphConceptPage';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { JsonLd } from '@/app/components/JsonLd';
import { pageLd, articleLd, definedTermLd } from '@/lib/jsonld';
import { ShareCardButton } from '@/app/components/understand/ShareCard';
import {
  ArrowLeft,
  BookOpen,
  Compass,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Layers,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { ConceptRelations } from '../ConceptRelations';
import { SaveConceptButton } from '../SaveConceptButton';
import { ShareChips } from '@/app/components/ShareChips';
import { InteractiveVisualLayer } from '@/app/components/visuals/InteractiveVisualLayer';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const detailIds = getAllConceptDetails().map((c) => c.id);
  const ids = detailIds.concat(graphPageIds().filter((id) => detailIds.indexOf(id) === -1));
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const concept = getConceptDetail(resolved.id);
  const graph = buildGraphPage(resolved.id);
  if (!concept) {
    if (!graph) return { title: 'अवधारणा नहीं मिली (Concept Not Found)' };
    const title = `${graph.label} (${graph.sanskrit}) Meaning in Hindi & English — शास्त्रीय दर्शन`;
    const description = clipDescription(
      [graph.overviewHi, graph.overviewEn].filter(Boolean).join(' — ') || graph.label,
    );
    const keywords = [
      graph.label,
      graph.sanskrit,
      `${graph.label} meaning in hindi`,
      `${graph.label} in hinduism`,
      `${graph.sanskrit} का अर्थ`,
      'dharma granth',
    ];
    return {
      title,
      description,
      keywords,
      alternates: { canonical: `/concepts/${graph.id}/` },
      openGraph: {
        type: 'article',
        locale: 'hi_IN',
        alternateLocale: ['en_US'],
        title: `${title} — Dharma Granth`,
        description,
        url: `https://dharmagranth.dev/concepts/${graph.id}/`,
        images: [DEFAULT_OG_IMAGE],
      },
      twitter: { card: 'summary_large_image', title, description, images: [DEFAULT_OG_IMAGE.url] },
    };
  }

  const title = `${concept.label} (${concept.sanskrit}) Meaning in Hindi & English — शास्त्रीय अर्थ`;
  const description = clipDescription(
    `${concept.sanskrit} (${concept.label}): ${concept.simpleDefinition.hi} ${concept.simpleDefinition.en}`,
  );
  const keywords = [
    concept.label,
    concept.sanskrit,
    `${concept.label} meaning in hindi`,
    `${concept.label} in hindi`,
    `${concept.sanskrit} का अर्थ`,
    `what is ${concept.label}`,
    `${concept.label} in hinduism`,
    `${concept.label} definition`,
    `${concept.label} etymology`,
    'hindu philosophy',
    'dharma granth',
  ];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/concepts/${concept.id}/` },
    openGraph: {
      type: 'article',
      locale: 'hi_IN',
      alternateLocale: ['en_US'],
      title: `${title} — Dharma Granth`,
      description,
      url: `https://dharmagranth.dev/concepts/${concept.id}/`,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: { card: 'summary_large_image', title, description, images: [DEFAULT_OG_IMAGE.url] },
  };
}

export default async function ConceptDetailPage({ params }: PageProps) {
  const resolved = await params;
  const concept = getConceptDetail(resolved.id);
  const graph = buildGraphPage(resolved.id);

  if (!concept) {
    if (!graph) notFound();
    return <GraphConceptPage model={graph} />;
  }

  const categoryLabels: Record<string, { en: string; hi: string }> = {
    core: { en: 'Core Principle', hi: 'मूल तत्त्व' },
    metaphysics: { en: 'Metaphysics', hi: 'तत्त्वमीमांसा' },
    practice: { en: 'Spiritual Practice', hi: 'साधना एवं आचरण' },
    psychology: { en: 'Mind & Consciousness', hi: 'मानस व चेतना' },
    cosmology: { en: 'Cosmic Order', hi: 'सृष्टि विज्ञान' },
  };

  const cat = categoryLabels[concept.category] || { en: 'Philosophy', hi: 'दर्शन' };

  const faqQuestions = [
    {
      '@type': 'Question',
      name: `What is ${concept.label} (${concept.sanskrit}) in Hindu philosophy?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: concept.simpleDefinition.en,
      },
    },
    {
      '@type': 'Question',
      name: `${concept.sanskrit} (${concept.label}) का वास्तविक शास्त्रीय अर्थ क्या है?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: concept.simpleDefinition.hi,
      },
    },
    concept.derivation && {
      '@type': 'Question',
      name: `What is the Sanskrit etymology and root of the word ${concept.label}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Root: ${concept.derivation.root} (${concept.derivation.rootMeaning} / ${concept.derivation.rootMeaningHi}). ${concept.derivation.etymologyEn || concept.derivation.etymologyHi}`,
      },
    },
    concept.misunderstandings?.length > 0 && {
      '@type': 'Question',
      name: `What is a common misconception about ${concept.label}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Misconception: ${concept.misunderstandings[0].myth}\nClassical Clarification: ${concept.misunderstandings[0].correction}`,
      },
    },
  ].filter(Boolean);

  const jsonLdFaq = faqQuestions.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqQuestions,
  } : null;

  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text pb-24">
      <JsonLd
        data={pageLd(
          [
            { name: 'Concepts', path: '/concepts' },
            { name: concept.label, path: `/concepts/${concept.id}` },
          ],
          definedTermLd({
            path: `/concepts/${concept.id}`,
            name: concept.label,
            alt: [concept.sanskrit].filter(Boolean),
            description: `${concept.simpleDefinition.en} ${concept.simpleDefinition.hi}`,
            setPath: '/concepts',
            setName: 'Dharma Granth Concepts',
          }),
        )}
      />
      {jsonLdFaq && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      )}
      {/* ── Breadcrumb & Navigation Header ─────────────────────────────────── */}
      <header className="border-b border-dharma-border bg-dharma-card/60 backdrop-blur-md sticky top-16 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs sm:text-sm text-dharma-muted">
          <div className="flex items-center gap-2">
            <Link
              href="/concepts"
              className="inline-flex items-center gap-1.5 hover:text-saffron-700 dark:hover:text-saffron-300 transition-colors font-medium min-h-[44px] items-center"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ज्ञान ग्राफ (All Concepts)</span>
            </Link>
            <span className="opacity-40">/</span>
            <span className="text-dharma-text font-semibold">{concept.label}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-saffron-500/10 text-saffron-700 dark:text-saffron-300 border border-saffron-500/20">
              {cat.hi} · {cat.en}
            </span>
          </div>
        </div>
      </header>

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-saffron-950/20 via-transparent to-transparent pt-10 sm:pt-14 pb-12 border-b border-dharma-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          {/* Sanskrit Calligraphy Badge: the page's one H1 (term, then transliteration and English label) */}
          <h1 className="inline-flex flex-col items-center mb-6 font-normal">
            <span
              lang="sa"
              className="block font-devanagari text-6xl sm:text-7xl md:text-8xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-saffron-600 via-amber-600 to-saffron-800 dark:from-saffron-400 dark:via-amber-300 dark:to-saffron-500 leading-tight drop-shadow-sm"
            >
              {concept.sanskrit}
            </span>
            <span className="block text-base sm:text-lg text-dharma-muted tracking-widest uppercase font-serif mt-1">
              {concept.transliteration} · {concept.label}
            </span>
          </h1>

          {/* Simple Definitions (Dual Language) */}
          <div className="bg-dharma-card/80 border border-dharma-border rounded-2xl p-6 sm:p-8 shadow-sm text-left max-w-3xl mx-auto space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
              <Sparkles className="w-4 h-4" />
              <span>सरल परिभाषा · Plain Definition</span>
            </div>
            <p className="text-lg sm:text-xl text-dharma-text font-serif leading-relaxed">
              {concept.simpleDefinition.en}
            </p>
            <p
              lang="hi"
              className="text-base sm:text-lg text-dharma-muted font-devanagari leading-relaxed border-t border-dharma-border/60 pt-3"
            >
              {concept.simpleDefinition.hi}
            </p>
            <SaveConceptButton conceptId={concept.id} label={concept.label} />
            <ShareCardButton
              reference={concept.label}
              concept={{ term: concept.sanskrit, transliteration: concept.transliteration, definition: concept.simpleDefinition.en }}
              url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev'}/concepts/${concept.id}`}
            />
            <ShareChips
              title={`${concept.label} (${concept.sanskrit})`}
              summary={concept.simpleDefinition.en}
              path={`/concepts/${concept.id}`}
            />
          </div>
        </div>
      </section>

      {/* ── Main Content Container ────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 space-y-16">
        {/* ── Section 1: Sanskrit Derivation (व्युत्पत्ति) ────────────────────── */}
        <section aria-labelledby="derivation-heading" className="space-y-6">
          <div className="border-l-4 border-saffron-600 pl-4">
            <p className="text-xs font-bold uppercase tracking-widest text-saffron-700 dark:text-saffron-400">
              Etymology & Derivation
            </p>
            <h2 id="derivation-heading" className="text-2xl sm:text-3xl font-serif font-bold text-dharma-text">
              शब्द व्युत्पत्ति व व्याकरण
            </h2>
          </div>

          <div className="bg-dharma-card border border-dharma-border rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
                मूल धातु (Verbal Root):
              </span>
              <span
                lang="sa"
                className="font-devanagari text-lg font-bold px-3 py-1 rounded-lg bg-saffron-500/10 text-saffron-800 dark:text-saffron-300 border border-saffron-500/20"
              >
                {concept.derivation.root}
              </span>
              <span className="text-sm text-dharma-muted">
                ({concept.derivation.rootMeaning} — {concept.derivation.rootMeaningHi})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-dharma-bg/60 border border-dharma-border/80">
                <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted mb-1.5">
                  English Analysis
                </p>
                <p className="text-sm text-dharma-text leading-relaxed">
                  {concept.derivation.etymologyEn}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-dharma-bg/60 border border-dharma-border/80">
                <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted mb-1.5">
                  शास्त्रीय व्याख्या
                </p>
                <p lang="hi" className="font-devanagari text-sm text-dharma-text leading-relaxed">
                  {concept.derivation.etymologyHi}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section: Interactive Sacred Visual Model (दृश्य ज्ञान दर्शन) ──────── */}
        <section aria-labelledby="visual-model-heading" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-l-4 border-saffron-600 pl-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-saffron-700 dark:text-saffron-400">
                Interactive Visual Learning Layer · चरण 10
              </p>
              <h2 id="visual-model-heading" className="text-2xl sm:text-3xl font-serif font-bold text-dharma-text">
                दृश्य ज्ञान दर्शन (Sacred Visual Model)
              </h2>
            </div>
            <Link
              href="/concepts/visuals"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-saffron-700 dark:text-saffron-400 hover:underline min-h-[44px]"
            >
              <span>10 मूल तत्त्वों का सम्पूर्ण दृश्य अन्वेषक</span>
              <Compass className="w-4 h-4" />
            </Link>
          </div>
          <InteractiveVisualLayer conceptId={concept.id} />
        </section>

        {/* ── Section 2: Contextual Meanings (विभिन्न संदर्भ) ───────────────── */}
        <section aria-labelledby="contexts-heading" className="space-y-6">
          <div className="border-l-4 border-amber-600 pl-4">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
              Shades of Meaning
            </p>
            <h2 id="contexts-heading" className="text-2xl sm:text-3xl font-serif font-bold text-dharma-text">
              विभिन्न सन्दर्भों में अर्थ
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {concept.contextualMeanings.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-dharma-card border border-dharma-border hover:border-saffron-400/50 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-dharma-text text-base flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-saffron-500/10 text-saffron-700 dark:text-saffron-300 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    {item.context}
                  </h3>
                  <span lang="hi" className="text-xs font-devanagari text-dharma-muted">
                    {item.contextHi}
                  </span>
                </div>
                <p className="text-sm text-dharma-text/90 leading-relaxed">{item.meaningEn}</p>
                <p lang="hi" className="font-devanagari text-xs text-dharma-muted leading-relaxed">
                  {item.meaningHi}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: Foundational Scriptural Verses (प्रमाण श्लोक) ───────── */}
        <section aria-labelledby="verses-heading" className="space-y-6">
          <div className="border-l-4 border-saffron-600 pl-4">
            <p className="text-xs font-bold uppercase tracking-widest text-saffron-700 dark:text-saffron-400">
              Canonical Citations
            </p>
            <h2 id="verses-heading" className="text-2xl sm:text-3xl font-serif font-bold text-dharma-text">
              शास्त्रीय प्रमाण श्लोक ({concept.verses.length})
            </h2>
          </div>

          <div className="space-y-6">
            {concept.verses.map((v, idx) => (
              <article
                key={idx}
                className="rounded-2xl border border-dharma-border bg-dharma-card overflow-hidden shadow-sm"
              >
                {/* Verse Header Banner */}
                <div className="bg-saffron-500/5 dark:bg-saffron-950/20 px-6 py-3 border-b border-dharma-border flex items-center justify-between text-xs">
                  <span className="font-bold text-saffron-700 dark:text-saffron-300 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    प्रमाण #{idx + 1} — {v.referenceHi}
                  </span>
                  <span className="text-dharma-muted font-medium">{v.reference}</span>
                </div>

                <div className="p-6 sm:p-7 space-y-4">
                  {/* Sanskrit original */}
                  <p
                    lang="sa"
                    className="font-devanagari text-xl sm:text-2xl text-dharma-text font-semibold leading-relaxed text-center sm:text-left whitespace-pre-line"
                  >
                    {v.sanskrit}
                  </p>

                  {/* Transliteration */}
                  <p className="text-xs sm:text-sm italic text-dharma-muted leading-relaxed font-serif whitespace-pre-line">
                    {v.transliteration}
                  </p>

                  <div className="pt-2 border-t border-dharma-border/60 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Hindi Translation */}
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-dharma-muted">
                        हिन्दी अनुवाद
                      </p>
                      <p lang="hi" className="font-devanagari text-sm text-dharma-text leading-relaxed">
                        {v.translationHi}
                      </p>
                    </div>

                    {/* English Translation */}
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-dharma-muted">
                        English Translation
                      </p>
                      <p className="text-sm text-dharma-text leading-relaxed">
                        {v.translationEn}
                      </p>
                    </div>
                  </div>

                  {v.href && (
                    <div className="pt-2 flex justify-end">
                      <Link
                        href={v.href}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-saffron-700 dark:text-saffron-400 hover:underline min-h-[44px]"
                      >
                        <span>मूल ग्रन्थ में पूरा प्रसंग पढ़ें (Read in context)</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Section 4: Traditions Comparison (विभिन्न दर्शन) ───────────────── */}
        <section aria-labelledby="traditions-heading" className="space-y-6">
          <div className="border-l-4 border-rose-600 pl-4">
            <p className="text-xs font-bold uppercase tracking-widest text-rose-700 dark:text-rose-400">
              Philosophical Diversity
            </p>
            <h2 id="traditions-heading" className="text-2xl sm:text-3xl font-serif font-bold text-dharma-text">
              विभिन्न दर्शनों में दृष्टिकोण
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {concept.traditions.map((t, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-dharma-card border border-dharma-border space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-dharma-border/60 pb-2">
                  <h3 className="font-semibold text-dharma-text text-sm sm:text-base">
                    {t.tradition}
                  </h3>
                  <span lang="hi" className="font-devanagari text-xs text-saffron-700 dark:text-saffron-400 font-medium">
                    {t.traditionHi}
                  </span>
                </div>
                <p className="text-sm text-dharma-text leading-relaxed">{t.viewEn}</p>
                <p lang="hi" className="font-devanagari text-xs text-dharma-muted leading-relaxed">
                  {t.viewHi}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 5: Misunderstandings vs Truth (भ्रांतियाँ व सत्य) ─────── */}
        <section aria-labelledby="myths-heading" className="space-y-6">
          <div className="border-l-4 border-amber-600 pl-4">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
              Clarifications & Debunking
            </p>
            <h2 id="myths-heading" className="text-2xl sm:text-3xl font-serif font-bold text-dharma-text">
              सामान्य भ्रांतियाँ और शास्त्रीय सत्य
            </h2>
          </div>

          <div className="space-y-4">
            {concept.misunderstandings.map((m, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-dharma-border bg-dharma-card overflow-hidden"
              >
                {/* Myth */}
                <div className="p-5 bg-rose-500/5 border-b border-dharma-border space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                    <HelpCircle className="w-4 h-4" />
                    <span>प्रचलित भ्रम · Common Misunderstanding</span>
                  </div>
                  <p className="text-sm sm:text-base text-dharma-text font-medium leading-relaxed">
                    &ldquo;{m.myth}&rdquo;
                  </p>
                  <p lang="hi" className="font-devanagari text-xs text-dharma-muted">
                    &ldquo;{m.mythHi}&rdquo;
                  </p>
                </div>

                {/* Correction */}
                <div className="p-5 bg-emerald-500/5 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>शास्त्रीय स्पष्टीकरण · Scriptural Clarification</span>
                  </div>
                  <p className="text-sm sm:text-base text-dharma-text leading-relaxed">
                    {m.correction}
                  </p>
                  <p lang="hi" className="font-devanagari text-xs text-dharma-muted leading-relaxed">
                    {m.correctionHi}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <ConceptRelations conceptId={concept.id} />

        <section aria-labelledby="faq-heading" className="space-y-3">
          <h2 id="faq-heading" className="text-xl font-serif font-bold text-dharma-text">
            <span lang="hi" className="font-devanagari">प्रश्न</span>
          </h2>
          <h3 lang="hi" className="font-devanagari text-lg font-semibold text-dharma-text">
            {concept.sanskrit} क्या है?
          </h3>
          <p lang="hi" className="font-devanagari text-sm leading-relaxed text-dharma-text">{concept.simpleDefinition.hi}</p>
          <p className="text-sm leading-relaxed text-dharma-text-secondary">{concept.simpleDefinition.en}</p>
          <p lang="hi" className="text-sm text-dharma-text-secondary">
            यह वही परिभाषा है जो इस पृष्ठ के आरंभ में है। अलग प्रश्न-लेख नहीं लिखा गया।
          </p>
        </section>

        {/* ── Section 6: Related Concepts (संबंधित अवधारणाएँ) ──────────────── */}
        {concept.relatedConceptIds.length > 0 && (
          <section aria-labelledby="related-heading" className="space-y-4">
            <h2 id="related-heading" className="text-xl font-serif font-bold text-dharma-text">
              संबंधित अन्य अवधारणाएँ (Related Concepts)
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {concept.relatedConceptIds.map((relId) => {
                const relConcept = getConceptDetail(relId);
                return (
                  <Link
                    key={relId}
                    href={`/concepts/${relId}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-dharma-card border border-dharma-border hover:border-saffron-500 hover:text-saffron-700 dark:hover:text-saffron-300 transition-colors text-sm font-medium min-h-[44px]"
                  >
                    <span lang="sa" className="font-devanagari font-bold">
                      {relConcept ? relConcept.sanskrit : relId}
                    </span>
                    <span className="text-dharma-muted text-xs">
                      ({relConcept ? relConcept.label : relId})
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-dharma-muted" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {graph ? <GraphConceptSections model={graph} /> : null}

        {/* ── Section 7: Sources & Academic Citations ───────────────────────── */}
        <section aria-labelledby="sources-heading" className="p-6 rounded-2xl bg-dharma-card/50 border border-dharma-border space-y-3">
          <h2 id="sources-heading" className="text-sm font-bold uppercase tracking-wider text-dharma-muted flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>शास्त्रीय संदर्भ व आधार (Canonical Sources)</span>
          </h2>
          <ul className="text-xs sm:text-sm text-dharma-muted space-y-1 list-disc pl-5">
            {concept.sources.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
          <p className="text-[11px] text-dharma-muted/80 pt-2 border-t border-dharma-border/60">
            धर्म ग्रन्थ संपादकीय नीति: सभी परिभाषाएँ और तुलनाएँ प्रस्थानत्रयी (उपनिषद्, भगवद्गीता, ब्रह्मसूत्र) और दर्शनग्रंथों के मूल भाष्यों पर आधारित हैं।
          </p>
        </section>
      </div>
    </main>
  );
}
