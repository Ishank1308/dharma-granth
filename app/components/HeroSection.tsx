'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, BookOpen, Search, Sparkles } from 'lucide-react';
import { openGlobalSearch } from '@/lib/search-events';
import { DharmaCopilotModal } from '@/app/components/copilot/DharmaCopilotModal';

/** Quick starts: a reference, a Sanskrit phrase and a life situation, so both kinds of reader have an obvious way in. */
const QUICK_SEARCHES = ['Gita 2.47', 'कर्म', 'fear', 'Tat Tvam Asi'];

/**
 * Home-page hero. It answers four things in the first screen: what this is, what to do here, where a beginner
 * starts, and how an experienced reader finds a text fast. One search field, one primary action and one
 * secondary action; no animated background, so it stays calm and cheap on low-power phones.
 */
export function HeroSection() {
  const [copilotOpen, setCopilotOpen] = useState(false);

  return (
    <section
      aria-labelledby="home-hero-heading"
      className="relative overflow-hidden bg-[linear-gradient(135deg,var(--dharma-hero-start),var(--dharma-hero-mid),var(--dharma-hero-end))] text-white"
    >
      <div className="pointer-events-none absolute inset-0 opacity-10 mandala-bg" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(251,191,36,0.18),transparent_60%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-5 pb-14 pt-12 text-center sm:px-6 sm:pb-16 sm:pt-16">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-saffron-100/90 sm:text-sm">
          <span lang="hi" className="font-devanagari">सनातन ज्ञान</span> <span>Timeless wisdom</span>
        </p>
        <h1
          id="home-hero-heading"
          className="font-serif text-4xl font-bold tracking-normal text-white drop-shadow sm:text-6xl"
        >
          Dharma Granth <span lang="hi" className="mt-1 block font-devanagari text-3xl text-saffron-100 sm:text-4xl">धर्म ग्रंथ</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/95 sm:text-xl">
          A calm, ad-free library of Hindu scriptures: the original Sanskrit with Hindi and English meaning, and sources
          you can check.
        </p>

        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            const input = event.currentTarget.elements.namedItem('q');
            const query = input instanceof HTMLInputElement ? input.value.trim() : '';
            openGlobalSearch(query);
          }}
          className="mx-auto mt-7 flex max-w-2xl items-center rounded-2xl border border-white/25 bg-white/95 p-1.5 text-left shadow-xl focus-within:ring-4 focus-within:ring-white/25"
        >
          <Search className="ml-3 h-5 w-5 shrink-0 text-saffron-700" aria-hidden="true" />
          <label htmlFor="hero-scripture-search" className="sr-only">
            Search scriptures, chapters, verses and ideas
          </label>
          <input
            id="hero-scripture-search"
            name="q"
            type="search"
            autoComplete="off"
            placeholder="Search a verse, a word or a question, e.g. Gita 2.47, fear, कर्म"
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-500 sm:text-base"
          />
          <button
            type="submit"
            aria-label="Search"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-saffron-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-saffron-800 sm:px-5"
          >
            <span className="hidden sm:inline">Search</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>

        <ul className="mx-auto mt-3 flex max-w-2xl flex-wrap items-center justify-center gap-2 text-xs" aria-label="Quick searches">
          {QUICK_SEARCHES.map((q) => (
            <li key={q}>
              <button
                type="button"
                onClick={() => openGlobalSearch(q)}
                className="inline-flex min-h-[44px] items-center rounded-full border border-white/25 bg-white/10 px-4 font-medium text-white/95 transition hover:border-amber-300 hover:bg-white/20"
              >
                {q}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/scripture/bhagavadgita"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-saffron-800 shadow-lg transition hover:bg-saffron-50"
          >
            <BookOpen className="h-5 w-5 text-saffron-600" aria-hidden="true" />
            Start with the Bhagavad Gita
          </Link>
          <Link
            href="/scriptures"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/15"
          >
            Browse all scriptures
          </Link>
        </div>

        <p className="mt-5 text-sm text-white/80">
          <button
            type="button"
            onClick={() => setCopilotOpen(true)}
            className="inline-flex min-h-[44px] items-center gap-1.5 underline decoration-white/40 underline-offset-4 hover:decoration-white"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Not sure where to begin? Ask the guide
          </button>
        </p>
      </div>

      <DharmaCopilotModal isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} initialQuery="" />
    </section>
  );
}
