import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { JsonLd } from '@/app/components/JsonLd';
import { pageLd, articleLd, definedTermLd } from '@/lib/jsonld';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BookOpen,
  Sparkles,
  Lightbulb,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { FadeUp, FadeUpOnView } from '@/app/components/motion/primitives';
import { topics, getTopic, type Topic } from '@/data/topics';
import { clipDescription } from '@/lib/meta-text';
import { readHref } from '@/lib/verse-paths';
import { ShareChips } from '@/app/components/ShareChips';

export function generateStaticParams() {
  return topics.map((t) => ({ id: t.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const topic = getTopic(params.id);
  if (!topic) return { title: 'Topic Not Found' };

  const lead = topic.verses[0];
  const description = clipDescription(
    [lead?.sanskrit, lead?.translation, topic.shortDesc].filter(Boolean).join(' — '),
  );

  return {
    title: topic.title,
    description,
    alternates: { canonical: `/topics/${topic.id}/` },
    openGraph: {
      images: [DEFAULT_OG_IMAGE],
      title: `${topic.title} — Dharma Granth`,
      description,
      url: `https://dharmagranth.in/topics/${topic.id}/`,
    },
  };
}

export default function TopicPage({ params }: { params: { id: string } }) {
  const topic = getTopic(params.id);
  if (!topic) notFound();

  const relatedTopics = topics
    .filter((t) => t.id !== topic.id && t.category === topic.category)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-dharma-bg">
      <JsonLd
        data={pageLd(
          [
            { name: 'Topics', path: '/topics' },
            { name: topic.title, path: `/topics/${topic.id}` },
          ],
          articleLd({ path: `/topics/${topic.id}`, headline: topic.title, description: topic.shortDesc }),
        )}
      />
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className={`relative bg-gradient-to-br ${topic.gradient} text-white py-16 overflow-hidden`}>
        <div className="absolute inset-0 mandala-bg opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 relative">
          <FadeUp>
            <Link
              href="/topics"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              All Topics
            </Link>

            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
                {topic.icon}
              </div>
              <div>
                <h1 className="text-4xl font-serif font-bold mb-1">{topic.title}</h1>
                {topic.sanskrit && (
                  <p lang="sa" className="font-devanagari text-xl text-white/80">
                    {topic.sanskrit}
                  </p>
                )}
              </div>
            </div>

            <p className="text-lg opacity-90 max-w-2xl leading-relaxed">
              {topic.description}
            </p>
            <ShareChips tone="dark" className="mt-5" title={topic.title} summary={topic.shortDesc} path={`/topics/${topic.id}`} />
          </FadeUp>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 -mt-8 relative z-10 pb-20 space-y-12">
        {/* ── Verses ─────────────────────────────────────────────── */}
        <FadeUpOnView>
          <div className="rounded-2xl border border-dharma-border bg-dharma-card shadow-xl overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${topic.gradient}`} />
            <div className="p-6 md:p-8">
              <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-dharma-text mb-6">
                <BookOpen className="w-5 h-5 text-saffron-600" />
                Scriptural Verses
              </h2>

              <div className="space-y-6">
                {topic.verses.map((verse, i) => (
                  <VerseBlock key={i} verse={verse} index={i} />
                ))}
              </div>

              <p className="mt-6 text-xs text-dharma-muted leading-relaxed border-t border-dharma-border/60 pt-4">
                <span className="font-semibold text-dharma-text">Editorial Note · Not Scripture:</span> Canonical Sanskrit verses are drawn from verified digital archives. Translations and practical reflections are study aids drafted with AI assistance awaiting scholar peer review. For complete source provenance, see our{' '}
                <Link href="/methodology/" className="font-semibold text-saffron-700 dark:text-saffron-400 underline underline-offset-4 hover:text-saffron-800">
                  Methodology
                </Link>
                .
              </p>
            </div>
          </div>
        </FadeUpOnView>

        {/* ── Teachings ──────────────────────────────────────────── */}
        <FadeUpOnView>
          <div className="rounded-2xl border border-dharma-border bg-dharma-card shadow-xl overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${topic.gradient}`} />
            <div className="p-6 md:p-8">
              <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-dharma-text mb-6">
                <Sparkles className="w-5 h-5 text-saffron-600" />
                Key Teachings
              </h2>

              <div className="space-y-4">
                {topic.teachings.map((teaching, i) => (
                  <div key={i} className="flex gap-4">
                    <div
                      aria-hidden="true"
                      className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${topic.gradient} text-white text-sm font-bold flex items-center justify-center shadow-sm`}
                    >
                      {i + 1}
                    </div>
                    <p className="text-dharma-text leading-relaxed pt-1">
                      <span className="sr-only">{i + 1}. </span>
                      {teaching}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeUpOnView>

        {/* ── Practices ──────────────────────────────────────────── */}
        <FadeUpOnView>
          <div className="rounded-2xl border border-dharma-border bg-dharma-card shadow-xl overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${topic.gradient}`} />
            <div className="p-6 md:p-8">
              <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-dharma-text mb-6">
                <Lightbulb className="w-5 h-5 text-saffron-600" />
                Practical Applications
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {topic.practices.map((practice, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-dharma-border bg-dharma-bg/50 p-5 hover:border-saffron-200 transition"
                  >
                    <h3 className="font-serif font-bold text-dharma-text mb-2 flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={`w-6 h-6 rounded-md bg-gradient-to-br ${topic.gradient} text-white text-xs font-bold flex items-center justify-center`}
                      >
                        {i + 1}
                      </span>
                      <span className="sr-only">{i + 1}. </span>
                      <span>{practice.title}</span>
                    </h3>
                    <p className="text-sm text-dharma-muted leading-relaxed">
                      {practice.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeUpOnView>

        {/* ── Reflections ────────────────────────────────────────── */}
        <FadeUpOnView>
          <div className="rounded-2xl border border-dharma-border bg-dharma-card shadow-xl overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${topic.gradient}`} />
            <div className="p-6 md:p-8">
              <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-dharma-text mb-6">
                <HelpCircle className="w-5 h-5 text-saffron-600" />
                Reflections for Self-Inquiry
              </h2>

              <div className="space-y-6">
                {topic.reflections.map((ref, i) => (
                  <div key={i} className="border-l-4 border-saffron-300 pl-5">
                    <h3 className="font-serif font-bold text-lg text-dharma-text mb-2">
                      {ref.question}
                    </h3>
                    <p className="text-dharma-muted leading-relaxed italic">
                      {ref.prompt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeUpOnView>

        {/* ── Related Topics ─────────────────────────────────────── */}
        {relatedTopics.length > 0 && (
          <FadeUpOnView>
            <div>
              <h2 className="text-lg font-serif font-bold text-dharma-text mb-4">
                Related Topics
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedTopics.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/topics/${rel.id}`}
                    className="group rounded-xl border border-dharma-border bg-dharma-card p-5 hover:shadow-lg hover:border-saffron-300 transition"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{rel.icon}</span>
                      <h3 className="font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition">
                        {rel.title}
                      </h3>
                    </div>
                    <p className="text-sm text-dharma-muted leading-relaxed">
                      {rel.shortDesc}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </FadeUpOnView>
        )}

        {/* ── Navigation ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/topics"
            className="inline-flex items-center gap-2 text-sm font-semibold text-saffron-700 hover:text-saffron-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            All Topics
          </Link>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-sm font-semibold text-saffron-700 hover:text-saffron-800 transition"
          >
            Explore Learning Tools
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function VerseBlock({
  verse,
  index,
}: {
  verse: Topic['verses'][number];
  index: number;
}) {
  const verseUrl =
    verse.scriptureId && verse.chapterId && verse.verseId
      ? readHref(verse.scriptureId, verse.chapterId, verse.verseId)
      : verse.scriptureId
        ? `/scripture/${verse.scriptureId}`
        : null;

  return (
    <div className="relative rounded-xl border border-dharma-border bg-dharma-bg/40 p-5 hover:border-saffron-200 transition">
      {/* Verse number */}
      <div className="absolute -top-3 left-5 w-7 h-7 rounded-full bg-gradient-to-br from-saffron-500 to-amber-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
        {index + 1}
      </div>

      {/* Sanskrit */}
      <p lang="sa" className="font-devanagari text-lg text-dharma-text leading-relaxed mb-3 mt-1">
        {verse.sanskrit}
      </p>

      {/* Transliteration */}
      {verse.transliteration && (
        <p className="text-sm italic text-dharma-muted mb-3">
          {verse.transliteration}
        </p>
      )}

      {/* Translation */}
      <p className="text-dharma-text leading-relaxed mb-3">
        {verse.translation}
      </p>

      {/* Reference */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-saffron-700 uppercase tracking-wider">
          {verse.reference}
        </span>
        {verseUrl && (
          <Link
            href={verseUrl}
            className="text-xs font-semibold text-saffron-600 hover:text-saffron-800 transition inline-flex items-center gap-1"
          >
            Read in context →
          </Link>
        )}
      </div>
    </div>
  );
}
