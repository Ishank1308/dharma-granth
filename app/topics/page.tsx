import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { wisdomTopics } from '@/data/wisdom-for-life';

export const metadata: Metadata = {
  title: 'Scripture Topics · शास्त्रीय विषय',
  description: 'Browse scripture-based guides by topic, from steadiness and work to relationships and self-knowledge.',
  alternates: { canonical: '/topics/' },
};

export default function TopicsPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-6 lg:py-16">
      <header className="mb-10 max-w-3xl">
        <p lang="hi" className="font-devanagari text-sm font-semibold tracking-wide text-saffron-700 dark:text-saffron-300">जीवन के विषयों पर शास्त्रीय दृष्टि</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-dharma-text sm:text-4xl">Explore by topic</h1>
        <p className="mt-3 leading-relaxed text-dharma-muted">A calm index of practical guides grounded in Hindu scripture. Each guide connects a life question with source verses and traditional context.</p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wisdomTopics.map((topic) => (
          <li key={topic.slug}>
            <Link href={`/wisdom-for-life/${topic.slug}/`} className="group flex h-full flex-col rounded-2xl border border-dharma-border bg-dharma-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-saffron-400 hover:shadow-md">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-saffron-100 text-saffron-800 dark:bg-saffron-950/50 dark:text-saffron-300"><BookOpen className="size-5" aria-hidden="true" /></span>
              <span lang="hi" className="mt-4 font-devanagari text-lg font-bold text-dharma-text">{topic.titleHi}</span>
              <span className="mt-1 font-serif text-base font-semibold text-dharma-text">{topic.titleEn}</span>
              <span className="mt-3 flex-1 text-sm leading-relaxed text-dharma-muted">{topic.shortDescEn}</span>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-saffron-700 group-hover:text-saffron-800 dark:text-saffron-300">Read guide <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
