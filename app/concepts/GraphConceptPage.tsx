import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { GraphLink, GraphPageModel, GraphVerseLink } from '@/lib/knowledge-graph';

function LinkList({ items }: { items: GraphLink[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-dharma-muted">दर्ज संबंध अभी नहीं है।</p>;
  }
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="inline-flex min-h-[44px] items-center text-sm text-saffron-800 underline decoration-saffron-800/30 underline-offset-4 dark:text-saffron-300"
          >
            {item.sanskrit ? <span lang="sa" className="mr-2 font-devanagari">{item.sanskrit}</span> : null}
            <span lang="hi" className="font-devanagari">{item.labelHi}</span>
            {item.labelEn !== item.labelHi ? <span className="ml-2 text-dharma-muted">{item.labelEn}</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function VerseList({ items }: { items: GraphVerseLink[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-dharma-muted">दर्ज श्लोक अभी नहीं है।</p>;
  }
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.href} className="rounded-xl border border-dharma-border bg-dharma-card px-4 py-3">
          {item.sanskrit ? (
            <p lang="sa" className="font-devanagari text-base leading-relaxed text-dharma-text">{item.sanskrit}</p>
          ) : null}
          <Link
            href={item.href}
            className="mt-1 inline-flex min-h-[44px] items-center text-sm font-semibold text-saffron-800 underline decoration-saffron-800/30 underline-offset-4 dark:text-saffron-300"
          >
            {item.reference}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function GraphConceptSections({ model }: { model: GraphPageModel }) {
  return (
    <div className="space-y-10">
      <section aria-labelledby="kg-overview">
        <h2 id="kg-overview" className="font-serif text-2xl font-bold text-dharma-text">
          <span lang="hi" data-bi="hi" className="font-devanagari">परिचय</span>
          <span data-bi="en" data-bi-lead className="ml-2 text-base font-medium text-dharma-muted">Overview</span>
        </h2>
        <p lang="hi" className="mt-3 font-devanagari text-base leading-relaxed text-dharma-text">{model.overviewHi}</p>
        {model.overviewEn ? <p className="mt-2 text-sm leading-relaxed text-dharma-muted">{model.overviewEn}</p> : null}
        {model.fullerArticleHref ? (
          <p className="mt-3">
            <Link href={model.fullerArticleHref} className="inline-flex min-h-[44px] items-center text-sm font-semibold text-saffron-800 underline underline-offset-4 dark:text-saffron-300">
              पूरा लेख पढ़ें
            </Link>
          </p>
        ) : null}
      </section>
      <section aria-labelledby="kg-verses">
        <h2 id="kg-verses" className="font-serif text-2xl font-bold text-dharma-text">
          <span lang="hi" data-bi="hi" className="font-devanagari">संबंधित श्लोक</span>
          <span data-bi="en" data-bi-lead className="ml-2 text-base font-medium text-dharma-muted">Related verses</span>
        </h2>
        <div className="mt-3"><VerseList items={model.verses} /></div>
      </section>
      <section aria-labelledby="kg-teachings">
        <h2 id="kg-teachings" className="font-serif text-2xl font-bold text-dharma-text">
          <span lang="hi" data-bi="hi" className="font-devanagari">संबंधित उपदेश</span>
          <span data-bi="en" data-bi-lead className="ml-2 text-base font-medium text-dharma-muted">Related teachings</span>
        </h2>
        <div className="mt-3"><LinkList items={model.teachings} /></div>
      </section>
      <section aria-labelledby="kg-applications">
        <h2 id="kg-applications" className="font-serif text-2xl font-bold text-dharma-text">
          <span lang="hi" data-bi="hi" className="font-devanagari">आधुनिक प्रयोग</span>
          <span data-bi="en" data-bi-lead className="ml-2 text-base font-medium text-dharma-muted">Modern applications</span>
        </h2>
        <div className="mt-3"><LinkList items={model.applications} /></div>
      </section>
      <section aria-labelledby="kg-concepts">
        <h2 id="kg-concepts" className="font-serif text-2xl font-bold text-dharma-text">
          <span lang="hi" data-bi="hi" className="font-devanagari">संबंधित अवधारणाएँ</span>
          <span data-bi="en" data-bi-lead className="ml-2 text-base font-medium text-dharma-muted">Related concepts</span>
        </h2>
        <div className="mt-3"><LinkList items={model.concepts} /></div>
      </section>
    </div>
  );
}

export function GraphConceptPage({ model }: { model: GraphPageModel }) {
  return (
    <main className="long-read min-h-screen bg-dharma-bg pb-24 text-dharma-text">
      <header className="sticky top-[52px] z-20 border-b border-dharma-border bg-dharma-card/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-3 text-xs sm:text-sm text-dharma-muted sm:px-6">
          <Link href="/concepts/" className="inline-flex min-h-[44px] items-center gap-1.5 font-medium hover:text-saffron-800 dark:hover:text-saffron-300 transition-colors">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>ज्ञान ग्राफ (All Concepts)</span>
          </Link>
          <span className="opacity-40" aria-hidden="true">/</span>
          <span className="font-semibold text-dharma-text">{model.label}</span>
        </div>
      </header>
      <section data-vt-hero className="relative overflow-hidden border-b border-dharma-border bg-gradient-to-b from-saffron-950/20 via-transparent to-transparent pt-10 pb-10 sm:pt-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mb-4 flex items-center justify-center gap-6">
            <div aria-hidden="true" data-decor className="hidden md:flex flex-col items-center gap-2 select-none text-dharma-saffron/40">
              <span className="h-9 w-px bg-gradient-to-b from-transparent via-dharma-saffron/45 to-transparent" />
              <span className="text-base">☸</span>
              <span className="h-9 w-px bg-gradient-to-b from-transparent via-dharma-saffron/45 to-transparent" />
            </div>
            <h1 className="inline-flex flex-col items-center font-normal">
              <span lang="sa" className="block py-1 font-devanagari text-5xl font-bold tracking-normal leading-[1.45] text-dharma-saffron sm:text-6xl">
                {model.sanskrit}
              </span>{' '}
              <span className="mt-1.5 block font-serif text-sm sm:text-base uppercase tracking-widest text-dharma-muted">
                {model.transliteration && model.transliteration.trim().toLowerCase() !== model.label.trim().toLowerCase()
                  ? `${model.transliteration} · ${model.label}`
                  : model.label}
              </span>
            </h1>
            <div aria-hidden="true" data-decor className="hidden md:flex flex-col items-center gap-2 select-none text-dharma-saffron/40">
              <span className="h-9 w-px bg-gradient-to-b from-transparent via-dharma-saffron/45 to-transparent" />
              <span className="text-base">❁</span>
              <span className="h-9 w-px bg-gradient-to-b from-transparent via-dharma-saffron/45 to-transparent" />
            </div>
          </div>
          <p className="mx-auto max-w-xl text-center text-xs leading-relaxed text-dharma-muted">
            यह पृष्ठ पहले से दर्ज लेख, श्लोक और विषय-पृष्ठों को जोड़ता है। नया भाष्य नहीं लिखा गया।
          </p>
        </div>
      </section>
      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-dharma-border/80 bg-dharma-card/85 p-6 sm:p-8 shadow-raised backdrop-blur-xl shadow-[inset_0_1px_0_var(--glass-specular-top)]">
          <GraphConceptSections model={model} />
        </div>
      </article>
    </main>
  );
}
