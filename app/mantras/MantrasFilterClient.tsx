'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { SacredMantra } from '@/data/mantras';
import {
  Copy,
  Check,
  MessageCircle,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Volume2,
  Search,
  X,
  HelpCircle,
} from 'lucide-react';
import { SITE_URL } from '@/lib/jsonld';
import { speakSanskritTerm } from '@/lib/sacred-soundscape';
import { NavagrahaMandalam } from './NavagrahaMandalam';

type CategoryKey = 'all' | 'vedic' | 'shanti' | 'stotra';

export function MantrasFilterClient({ mantras }: { mantras: SacredMantra[] }) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [expandedSlugs, setExpandedSlugs] = useState<Set<string>>(() => new Set());

  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const toggleBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Support #slug or ?mantra=slug deep links without redirecting away from /mantras/
  useEffect(() => {
    const syncFromUrl = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const fromQuery = params.get('mantra');
        const fromHash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
        const target = fromQuery || fromHash;
        if (!target) return;
        const matched = mantras.find((m) => m.slug === target || m.id === target);
        if (matched) {
          setActiveCategory('all');
          setExpandedSlugs((prev) => {
            const next = new Set(prev);
            next.add(matched.slug);
            return next;
          });
          requestAnimationFrame(() => {
            cardRefs.current[matched.slug]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }
      } catch {
        // ignore
      }
    };

    syncFromUrl();
    window.addEventListener('hashchange', syncFromUrl);
    return () => window.removeEventListener('hashchange', syncFromUrl);
  }, [mantras]);

  const counts = useMemo(() => {
    return {
      all: mantras.length,
      vedic: mantras.filter((m) => m.category === 'vedic').length,
      shanti: mantras.filter((m) => m.category === 'shanti').length,
      stotra: mantras.filter((m) => m.category === 'stotra').length,
    };
  }, [mantras]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mantras.filter((m) => {
      if (activeCategory !== 'all' && m.category !== activeCategory) return false;
      if (!q) return true;
      return (
        m.title.toLowerCase().includes(q) ||
        m.titleHi.toLowerCase().includes(q) ||
        m.sanskrit.toLowerCase().includes(q) ||
        m.transliteration.toLowerCase().includes(q) ||
        m.hindiMeaning.toLowerCase().includes(q) ||
        m.englishMeaning.toLowerCase().includes(q) ||
        m.sourceCoordinates.toLowerCase().includes(q) ||
        (m.rishi?.toLowerCase().includes(q) ?? false) ||
        (m.devata?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [mantras, activeCategory, query]);

  const toggleExpanded = (slug: string) => {
    setExpandedSlugs((prev) => {
      const next = new Set(prev);
      const opening = !next.has(slug);
      if (opening) {
        next.add(slug);
        try {
          const url = new URL(window.location.href);
          url.hash = slug;
          window.history.replaceState(null, '', url.toString());
        } catch {
          // ignore
        }
      } else {
        next.delete(slug);
      }
      return next;
    });
  };

  const collapseFromBottom = (slug: string) => {
    setExpandedSlugs((prev) => {
      const next = new Set(prev);
      next.delete(slug);
      return next;
    });
    requestAnimationFrame(() => {
      toggleBtnRefs.current[slug]?.focus({ preventScroll: true });
      cardRefs.current[slug]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  const onCopy = async (m: SacredMantra) => {
    try {
      const text = `${m.titleHi} (${m.title})\n\n${m.sanskrit}\n\nभावार्थ: ${m.hindiMeaning}\n\nEnglish: ${m.englishMeaning}\n\nस्रोत: ${m.sourceCoordinates}\n${SITE_URL}/mantras/#${m.slug}`;
      await navigator.clipboard.writeText(text);
      setCopiedId(m.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  const onPlayAudio = (text: string, key: string, rate?: number) => {
    setPlayingKey(key);
    speakSanskritTerm(text, rate);
    setTimeout(() => {
      setPlayingKey((curr) => (curr === key ? null : curr));
    }, 3500);
  };

  const categories: Array<{ key: CategoryKey; label: string }> = [
    { key: 'all', label: `All Mantras · सभी मन्त्र (${counts.all})` },
    { key: 'vedic', label: `Vedic Mahamantras · वैदिक मन्त्र (${counts.vedic})` },
    { key: 'shanti', label: `Shanti Patha · शान्ति पाठ (${counts.shanti})` },
    { key: 'stotra', label: `Stotras · स्तोत्र (${counts.stotra})` },
  ];

  return (
    <div>
      {/* Search + Category Filter Controls */}
      <div className="mb-8 space-y-4">
        <div className="relative max-w-xl mx-auto">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dharma-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="मन्त्र खोजें — गायत्री, महामृत्युंजय, शान्ति पाठ, हनुमान चालीसा…"
            aria-label="मन्त्र खोजें (Search sacred mantras)"
            className="focus-ring w-full min-h-[44px] rounded-2xl border border-dharma-border bg-dharma-card pl-11 pr-10 py-2.5 text-sm text-dharma-text placeholder:text-dharma-muted transition-colors hover:border-saffron-500/50"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="खोज साफ़ करें (Clear search)"
              className="focus-ring absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full text-dharma-muted hover:bg-dharma-bg hover:text-dharma-text"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div
          className="flex flex-wrap items-center justify-center gap-2"
          role="group"
          aria-label="मन्त्र श्रेणियाँ (Mantra categories)"
        >
          {categories.map((tab) => {
            const active = activeCategory === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveCategory(tab.key)}
                className={`focus-ring inline-flex min-h-[44px] items-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  active
                    ? 'bg-dharma-saffron text-dharma-bg shadow-sm'
                    : 'border border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-400'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dharma-border bg-dharma-card p-10 text-center space-y-3">
          <p lang="hi" className="font-devanagari text-base font-semibold text-dharma-text">
            इस खोज से मेल खाता कोई मन्त्र नहीं मिला।
          </p>
          <p className="text-xs text-dharma-muted">
            No mantras matched &ldquo;{query}&rdquo;. Try clearing the search or switching categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setActiveCategory('all');
            }}
            className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-dharma-saffron px-4 py-2 text-xs font-semibold text-dharma-bg"
          >
            सभी मन्त्र दिखाएँ · Show all mantras
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:gap-8">
          {filtered.map((m) => {
            const whatsappText = `${m.titleHi} (${m.title})\n\n${m.sanskrit}\n\nभावार्थ: ${m.hindiMeaning}\n\nEnglish: ${m.englishMeaning}\n\nस्रोत: ${m.sourceCoordinates}\n${SITE_URL}/mantras/#${m.slug}`;
            const whatsappHref = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
            const isCopied = copiedId === m.id;
            const isPlaying = playingKey === `full-${m.id}`;
            const isExpanded = expandedSlugs.has(m.slug);
            const detailId = `mantra-detail-${m.slug}`;
            const headingId = `mantra-heading-${m.slug}`;

            return (
              <article
                key={m.id}
                id={m.slug}
                ref={(el) => {
                  cardRefs.current[m.slug] = el;
                }}
                className="scroll-mt-24 rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 shadow-sm transition-all hover:border-saffron-500/40 hover:shadow-md"
              >
                {/* Top row */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-dharma-border/60 pb-4 mb-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-saffron-800 dark:text-saffron-300">
                        {m.categoryLabelHi} · {m.categoryLabel}
                      </span>
                      <span className="text-xs text-dharma-muted font-medium">
                        {m.sourceCoordinates}
                      </span>
                    </div>
                    <h2 id={headingId} className="mt-2 font-serif text-xl sm:text-2xl font-bold text-dharma-text">
                      <button
                        type="button"
                        onClick={() => toggleExpanded(m.slug)}
                        aria-expanded={isExpanded}
                        aria-controls={detailId}
                        className="focus-ring rounded-lg text-left hover:text-saffron-800 dark:hover:text-saffron-300 transition-colors"
                      >
                        <span>{m.title}</span>{' '}
                        <span lang="sa" className="font-devanagari font-normal text-dharma-muted">
                          ({m.titleHi})
                        </span>
                      </button>
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onPlayAudio(m.sanskrit, `full-${m.id}`)}
                      aria-label={`उच्चारण सुनें: ${m.title}`}
                      className={`focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-dharma-border bg-dharma-bg px-3.5 py-2 text-xs font-semibold text-dharma-text hover:border-saffron-500 transition ${
                        isPlaying ? '!border-saffron-500 text-saffron-800 dark:text-saffron-300' : ''
                      }`}
                    >
                      <Volume2 className={`h-3.5 w-3.5 ${isPlaying ? 'animate-pulse text-saffron-600' : ''}`} />
                      <span lang="hi" className="font-devanagari">
                        {isPlaying ? 'पाठ जारी…' : 'उच्चारण'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onCopy(m)}
                      aria-label={`Copy ${m.title}`}
                      className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-dharma-border bg-dharma-bg px-3.5 py-2 text-xs font-semibold text-dharma-text hover:border-saffron-500 transition"
                    >
                      {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Share ${m.title} on WhatsApp`}
                      className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-dharma-border bg-dharma-bg px-3.5 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:border-emerald-500 transition"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Sanskrit Shloka */}
                <div className="verse-leaf my-5 rounded-2xl border border-dharma-border bg-dharma-bg/70 p-5 sm:p-6 text-center">
                  <p
                    lang="sa"
                    className="shloka-text font-sanskrit text-xl sm:text-2xl font-normal leading-[2] text-dharma-text whitespace-pre-line"
                  >
                    {m.sanskrit}
                  </p>
                  <p className="mt-2 font-serif text-xs sm:text-sm italic text-dharma-muted whitespace-pre-line">
                    {m.transliteration}
                  </p>
                </div>

                {/* Meanings */}
                <div className="space-y-3 my-4">
                  <div className="rounded-xl border border-dharma-border/80 bg-dharma-bg/60 p-4">
                    <span className="font-devanagari text-xs font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-300 block mb-1">
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

                {/* Footer row — inline toggle (zero page redirection) */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-dharma-border/60 text-xs text-dharma-muted">
                  <div className="flex flex-wrap items-center gap-3">
                    {m.rishi && (
                      <span>
                        ऋषि: <strong className="text-dharma-text font-normal">{m.rishi}</strong>
                      </span>
                    )}
                    {m.devata && (
                      <span>
                        देवता: <strong className="text-dharma-text font-normal">{m.devata}</strong>
                      </span>
                    )}
                    {m.chhandas && (
                      <span>
                        छन्द: <strong className="text-dharma-text font-normal">{m.chhandas}</strong>
                      </span>
                    )}
                  </div>

                  <button
                    ref={(el) => {
                      toggleBtnRefs.current[m.slug] = el;
                    }}
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={detailId}
                    onClick={() => toggleExpanded(m.slug)}
                    className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-saffron-500/35 bg-saffron-500/10 px-4 py-2 text-xs font-bold text-saffron-800 dark:text-saffron-300 transition hover:bg-saffron-500/15"
                  >
                    <span lang="hi" className="font-devanagari">
                      {isExpanded ? 'विस्तृत व्याख्या समेटें' : 'पदच्छेद व विस्तृत व्याख्या देखें'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span lang="en">{isExpanded ? 'Hide Explanation' : 'Detailed Explanation'}</span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 shrink-0" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
                    )}
                  </button>
                </div>

                {/* Inline Detailed Explanation (Padaccheda, Word-by-Word, Significance, FAQs) */}
                {isExpanded && (
                  <div
                    id={detailId}
                    role="region"
                    aria-labelledby={headingId}
                    className="liquid-reveal mt-6 space-y-8 border-t border-dharma-border pt-6"
                  >
                    {/* 1. Padaccheda & Word-by-Word Meaning */}
                    {m.wordMeanings.length > 0 && (
                      <section aria-label={`पदच्छेद एवं शब्दार्थ — ${m.title}`}>
                        <div className="flex items-center gap-2 mb-4">
                          <BookOpen className="h-5 w-5 text-saffron-700 dark:text-saffron-300 shrink-0" aria-hidden="true" />
                          <h3 className="font-serif text-lg sm:text-xl font-bold text-dharma-text">
                            <span lang="hi" className="font-devanagari">
                              पदच्छेद, अन्वय एवं शब्दार्थ
                            </span>{' '}
                            <span className="text-sm font-normal text-dharma-muted">· Word-by-Word Meaning</span>
                          </h3>
                        </div>

                        {/* Mobile stacked word cards */}
                        <div className="grid gap-2.5 sm:hidden">
                          {m.wordMeanings.map((w, idx) => {
                            const wordKey = `word-${m.id}-${idx}`;
                            const wordPlaying = playingKey === wordKey;
                            return (
                              <div
                                key={idx}
                                className="rounded-2xl border border-dharma-border/80 bg-dharma-bg/60 p-3.5 space-y-1.5"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex flex-wrap items-baseline gap-2">
                                    <span
                                      lang="sa"
                                      className="font-devanagari text-base font-bold text-saffron-900 dark:text-saffron-200"
                                    >
                                      {w.sanskrit}
                                    </span>
                                    <span className="font-serif text-xs italic text-dharma-muted">{w.iast}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => onPlayAudio(w.sanskrit, wordKey, 0.85)}
                                    aria-label={`उच्चारण सुनें: ${w.sanskrit}`}
                                    className="focus-ring inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-dharma-border bg-dharma-card text-dharma-muted hover:text-dharma-text"
                                  >
                                    <Volume2 className={`h-3.5 w-3.5 ${wordPlaying ? 'animate-pulse text-saffron-600' : ''}`} />
                                  </button>
                                </div>
                                <p lang="hi" className="font-devanagari text-sm text-dharma-text leading-relaxed">
                                  {w.hindi}
                                </p>
                                <p className="font-serif text-xs text-dharma-muted leading-relaxed">{w.english}</p>
                              </div>
                            );
                          })}
                        </div>

                        {/* Tablet & Desktop 4-column table */}
                        <div className="hidden sm:block overflow-x-auto rounded-2xl border border-dharma-border shadow-xs">
                          <table className="w-full text-left text-sm">
                            <thead className="border-b border-dharma-border bg-dharma-bg/80 text-xs font-bold uppercase tracking-wider text-dharma-muted">
                              <tr>
                                <th scope="col" className="p-3.5 sm:px-4">पद (Sanskrit)</th>
                                <th scope="col" className="p-3.5 sm:px-4">IAST</th>
                                <th scope="col" className="p-3.5 sm:px-4">हिन्दी अर्थ</th>
                                <th scope="col" className="p-3.5 sm:px-4">English Meaning</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-dharma-border/60 bg-dharma-bg/30">
                              {m.wordMeanings.map((w, idx) => {
                                const wordKey = `word-${m.id}-${idx}`;
                                const wordPlaying = playingKey === wordKey;
                                return (
                                  <tr key={idx} className="hover:bg-dharma-bg/70 transition-colors">
                                    <td className="p-3.5 sm:px-4 whitespace-nowrap">
                                      <div className="flex items-center gap-2">
                                        <span
                                          lang="sa"
                                          className="font-devanagari font-bold text-saffron-900 dark:text-saffron-200"
                                        >
                                          {w.sanskrit}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => onPlayAudio(w.sanskrit, wordKey, 0.85)}
                                          aria-label={`उच्चारण सुनें: ${w.sanskrit}`}
                                          title="उच्चारण सुनें (Pronounce)"
                                          className="focus-ring inline-flex h-7 w-7 items-center justify-center rounded-md border border-dharma-border/70 bg-dharma-card text-dharma-muted hover:border-saffron-400 hover:text-dharma-text transition"
                                        >
                                          <Volume2
                                            className={`h-3 w-3 ${wordPlaying ? 'animate-pulse text-saffron-600' : ''}`}
                                          />
                                        </button>
                                      </div>
                                    </td>
                                    <td className="p-3.5 sm:px-4 font-serif text-xs italic text-dharma-muted">
                                      {w.iast}
                                    </td>
                                    <td lang="hi" className="p-3.5 sm:px-4 font-devanagari text-dharma-text">
                                      {w.hindi}
                                    </td>
                                    <td className="p-3.5 sm:px-4 font-serif text-xs text-dharma-muted">
                                      {w.english}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </section>
                    )}

                    {/* 2. Dedicated Navagraha Mandalam inline for Navagraha Stotram */}
                    {m.slug === 'navagraha-stotram' && <NavagrahaMandalam inlineOnly />}

                    {/* 3. Spiritual Significance & Contemplation */}
                    <section
                      aria-label={`दार्शनिक रहस्य एवं साधना-महत्त्व — ${m.title}`}
                      className="rounded-2xl border border-dharma-border bg-dharma-bg/60 p-5 sm:p-6 space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-amber-600 shrink-0" aria-hidden="true" />
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-dharma-text">
                          <span lang="hi" className="font-devanagari">
                            दार्शनिक रहस्य एवं साधना-महत्त्व
                          </span>{' '}
                          <span className="text-sm font-normal text-dharma-muted">· Spiritual Significance</span>
                        </h3>
                      </div>
                      <p lang="hi" className="font-devanagari text-sm sm:text-base leading-relaxed text-dharma-text">
                        {m.significanceHi}
                      </p>
                      <p className="font-serif text-xs sm:text-sm italic leading-relaxed text-dharma-muted border-t border-dharma-border/60 pt-3">
                        {m.significance}
                      </p>
                    </section>

                    {/* 4. Frequently Asked Questions */}
                    {m.faqs.length > 0 && (
                      <section aria-label={`जिज्ञासा समाधान — ${m.title}`} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="h-5 w-5 text-saffron-700 dark:text-saffron-300 shrink-0" aria-hidden="true" />
                          <h3 className="font-serif text-lg sm:text-xl font-bold text-dharma-text">
                            <span lang="hi" className="font-devanagari">
                              जिज्ञासा समाधान
                            </span>{' '}
                            <span className="text-sm font-normal text-dharma-muted">· Frequently Asked Questions</span>
                          </h3>
                        </div>
                        <div className="space-y-2.5">
                          {m.faqs.map((f, idx) => (
                            <details
                              key={idx}
                              className="group rounded-2xl border border-dharma-border bg-dharma-bg/50 p-4 transition-all"
                            >
                              <summary className="focus-ring rounded-lg font-serif text-sm sm:text-base font-bold text-dharma-text cursor-pointer list-none flex items-center justify-between gap-3">
                                <span>{f.question}</span>
                                <span
                                  aria-hidden="true"
                                  className="text-saffron-700 dark:text-saffron-300 text-lg font-bold shrink-0 transition-transform group-open:rotate-45"
                                >
                                  +
                                </span>
                              </summary>
                              <p className="mt-3 text-sm leading-relaxed text-dharma-muted border-t border-dharma-border/50 pt-3">
                                {f.answer}
                              </p>
                            </details>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Bottom Collapse Control */}
                    <div className="flex justify-center border-t border-dharma-border/50 pt-4">
                      <button
                        type="button"
                        onClick={() => collapseFromBottom(m.slug)}
                        className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-full border border-dharma-border bg-dharma-bg px-4 py-2 text-xs font-semibold text-dharma-muted transition-colors hover:border-saffron-400 hover:text-dharma-text"
                      >
                        <ChevronUp className="h-4 w-4" aria-hidden="true" />
                        <span lang="hi" className="font-devanagari">
                          विस्तृत व्याख्या समेटें
                        </span>
                        <span aria-hidden="true">·</span>
                        <span lang="en">Close detailed explanation</span>
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
