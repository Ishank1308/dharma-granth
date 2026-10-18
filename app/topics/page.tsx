import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import Link from 'next/link';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { FadeUp, FadeUpOnView } from '@/app/components/motion/primitives';
import { topics, topicCategories, type Topic } from '@/data/topics';
import { verseCount } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Modern-Life Application',
  description:
    'How the Bhagavad Gita, Upanishads and other Hindu scriptures speak to modern challenges: career, stress, relationships, parenting, money and leadership.',
  alternates: { canonical: '/topics/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'Modern-Life Application — Dharma Granth',
    description:
      'Discover how the Bhagavad Gita, Upanishads, and other Hindu scriptures speak to contemporary challenges.',
    url: 'https://dharmagranth.in/topics',
  },
};

export default function TopicsPage() {
  return (
    <main className="min-h-screen bg-dharma-bg">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-saffron-900 via-saffron-800 to-amber-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 mandala-bg opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <FadeUp>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-saffron-200 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              जीवनयोग — Scripture for Modern Life
            </p>
            <h1 className="text-5xl font-serif font-bold mb-4">
              Modern-Life Application
            </h1>
            <p className="text-xl opacity-90 max-w-2xl">
              The wisdom of the Gita, Upanishads, and Vedas is not confined to ancient battlefields or forest hermitages. Explore how timeless principles speak directly to the challenges you face today — at work, at home, and within.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Topics Grid ──────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-10 pb-20">
        {/* Wisdom for Life Feature Spotlight */}
        <FadeUpOnView className="mb-12">
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-saffron-500/10 to-orange-500/10 p-6 sm:p-8 backdrop-blur-sm shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-2xl space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-300 bg-saffron-500/10 px-3 py-1 rounded-full border border-saffron-500/20">
                  <Compass className="w-3.5 h-3.5" />
                  <span>नया अनुभाग • New Section</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-dharma-text">
                  Wisdom for Life — जीवन के लिए शास्त्रीय मार्गदर्शन
                </h2>
                <p className="text-sm sm:text-base text-dharma-muted leading-relaxed">
                  Looking for guidance on stress, fear, anger, decision-making, discipline, or purpose without needing to know specific scripture names or verse numbers? Explore 12 deeply curated life dimensions.
                </p>
              </div>

              <Link
                href="/wisdom-for-life"
                className="inline-flex items-center gap-2 rounded-full bg-saffron-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl hover:bg-saffron-700 transition shrink-0 group"
              >
                <span>Explore Wisdom for Life</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </FadeUpOnView>
        {topicCategories.map((cat) => {
          const catTopics = topics.filter((t) => t.category === cat.key);
          if (catTopics.length === 0) return null;

          return (
            <FadeUpOnView key={cat.key} className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${cat.gradient}`} />
                <h2 className="text-lg font-serif font-bold text-dharma-text">{cat.label}</h2>
                <span className="text-sm text-dharma-muted">({catTopics.length})</span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catTopics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </div>
            </FadeUpOnView>
          );
        })}

        {/* ── Disclaimer ─────────────────────────────────────────── */}
        <FadeUpOnView className="mt-12">
          <div className="rounded-2xl border border-dharma-border bg-dharma-card/60 p-6 text-center">
            <p className="text-sm text-dharma-muted leading-relaxed max-w-3xl mx-auto">
              These reflections offer philosophical perspectives from Hindu scriptures for contemplation and personal growth. They are not a substitute for professional mental health care, financial advice, or counseling. If you are struggling, please reach out to a qualified professional.
            </p>
          </div>
        </FadeUpOnView>
      </section>
    </main>
  );
}

function TopicCard({ topic }: { topic: Topic }) {
  return (
    <Link
      href={`/topics/${topic.id}`}
      className="group relative overflow-hidden rounded-2xl border border-dharma-border bg-dharma-card p-6 hover:shadow-xl hover:border-saffron-300 transition-all duration-300"
    >
      {/* Gradient accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${topic.gradient}`} />

      {/* Icon + Sanskrit */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.gradient} flex items-center justify-center text-2xl shadow-md`}>
          {topic.icon}
        </div>
        {topic.sanskrit && (
          <p lang="sa" className="font-devanagari text-lg text-saffron-600">
            {topic.sanskrit}
          </p>
        )}
      </div>

      {/* Title + Description */}
      <h3 className="text-base font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition mb-2">
        {topic.title}
      </h3>
      <p className="text-sm text-dharma-muted leading-relaxed mb-4">
        {topic.shortDesc}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-dharma-muted">
        <span>{verseCount(topic.verses.length)}</span>
        <span className="font-semibold text-saffron-700 group-hover:translate-x-1 transition-transform">
          Explore →
        </span>
      </div>
    </Link>
  );
}
