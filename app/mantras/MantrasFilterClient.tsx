'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { SacredMantra } from '@/data/mantras';
import { Copy, Check, MessageCircle, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { SITE_URL } from '@/lib/jsonld';

export function MantrasFilterClient({ mantras }: { mantras: SacredMantra[] }) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'vedic' | 'shanti' | 'stotra'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = activeCategory === 'all'
    ? mantras
    : mantras.filter((m) => m.category === activeCategory);

  const onCopy = async (m: SacredMantra) => {
    try {
      const text = `${m.titleHi} (${m.title})\n\n${m.sanskrit}\n\nअर्थ: ${m.hindiMeaning}\n\nEnglish: ${m.englishMeaning}\n\nस्त्रोत: ${m.sourceCoordinates}\n${SITE_URL}/mantras/${m.slug}/`;
      await navigator.clipboard.writeText(text);
      setCopiedId(m.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div>
      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8" role="tablist">
        {[
          { key: 'all', label: 'All Mantras (सभी मन्त्र)' },
          { key: 'vedic', label: 'Vedic Mahamantras (वैदिक मन्त्र)' },
          { key: 'shanti', label: 'Shanti Patha (शान्ति पाठ)' },
          { key: 'stotra', label: 'Stotras (स्तोत्र)' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeCategory === tab.key}
            onClick={() => setActiveCategory(tab.key as typeof activeCategory)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeCategory === tab.key
                ? 'bg-saffron-700 text-white shadow-sm'
                : 'border border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 sm:gap-8">
        {filtered.map((m) => {
          const whatsappText = `${m.titleHi} (${m.title})\n\n${m.sanskrit}\n\nअर्थ: ${m.hindiMeaning}\n\nEnglish: ${m.englishMeaning}\n\nस्त्रोत: ${m.sourceCoordinates}\n${SITE_URL}/mantras/${m.slug}/`;
          const whatsappHref = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
          const isCopied = copiedId === m.id;

          return (
            <article
              key={m.id}
              className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 shadow-sm transition-all hover:border-saffron-500/40 hover:shadow-md"
            >
              {/* Top row */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dharma-border/60 pb-4 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-saffron-800 dark:text-saffron-300">
                      {m.categoryLabelHi} · {m.categoryLabel}
                    </span>
                    <span className="text-xs text-dharma-muted font-medium">
                      {m.sourceCoordinates}
                    </span>
                  </div>
                  <h2 className="mt-2 font-serif text-xl sm:text-2xl font-bold text-dharma-text">
                    <Link href={`/mantras/${m.slug}/`} className="hover:text-saffron-700 dark:hover:text-saffron-300 transition-colors">
                      {m.title} <span lang="sa" className="font-devanagari font-normal text-dharma-muted">({m.titleHi})</span>
                    </Link>
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onCopy(m)}
                    aria-label={`Copy ${m.title}`}
                    className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-lg border border-dharma-border bg-dharma-bg px-3 text-xs font-semibold text-dharma-text hover:border-saffron-500 transition"
                  >
                    {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Share ${m.title} on WhatsApp`}
                    className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-lg border border-dharma-border bg-dharma-bg px-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:border-emerald-500 transition"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Sanskrit Shloka */}
              <div className="my-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 p-5 sm:p-6 text-center">
                <p lang="sa" className="font-devanagari text-xl sm:text-2xl font-bold leading-[2] text-amber-950 dark:text-amber-100">
                  {m.sanskrit}
                </p>
                <p className="mt-2 font-serif text-xs sm:text-sm italic text-dharma-muted">
                  {m.transliteration}
                </p>
              </div>

              {/* Meanings */}
              <div className="space-y-3 my-4">
                <div className="rounded-xl border border-dharma-border/80 bg-dharma-bg/60 p-4">
                  <span className="font-devanagari text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400 block mb-1">
                    हिन्दी भावार्थ
                  </span>
                  <p lang="hi" className="font-devanagari text-sm sm:text-base leading-relaxed text-dharma-text">
                    {m.hindiMeaning}
                  </p>
                </div>
                <div className="rounded-xl border border-dharma-border/80 bg-dharma-bg/60 p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-dharma-muted block mb-1">
                    English Translation
                  </span>
                  <p className="font-serif text-xs sm:text-sm italic leading-relaxed text-dharma-muted">
                    {m.englishMeaning}
                  </p>
                </div>
              </div>

              {/* Footer row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-dharma-border/60 text-xs text-dharma-muted">
                <div className="flex flex-wrap items-center gap-3">
                  {m.rishi && <span>ऋषि: <strong className="text-dharma-text font-normal">{m.rishi}</strong></span>}
                  {m.devata && <span>देवता: <strong className="text-dharma-text font-normal">{m.devata}</strong></span>}
                  {m.chhandas && <span>छन्द: <strong className="text-dharma-text font-normal">{m.chhandas}</strong></span>}
                </div>
                <Link
                  href={`/mantras/${m.slug}/`}
                  className="group inline-flex items-center gap-1.5 font-bold text-saffron-700 dark:text-saffron-400 hover:underline"
                >
                  <span>पदच्छेद व विस्तृत व्याख्या</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
