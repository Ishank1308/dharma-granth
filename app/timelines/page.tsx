'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FadeUp, FadeUpOnView } from '@/app/components/motion/primitives';
import { Timeline } from '@/app/components/Timeline';
import { timelines, timelineTypeLabels, type TimelineType } from '@/data/timelines';
import '@/app/styles/long-read.css';

const ERA_INDEX = [
  { id: 'academic-chronology', hi: 'वैदिक और उपनिषद् काल', en: 'Vedic and Upanishadic estimates', kind: 'इतिहास का अनुमान' },
  { id: 'ramayana-narrative', hi: 'रामायण', en: 'Ramayana', kind: 'कथा' },
  { id: 'mahabharata-narrative', hi: 'महाभारत', en: 'Mahabharata', kind: 'कथा' },
  { id: 'commentarial-tradition', hi: 'वेदान्त की टीका-परंपरा', en: 'Vedantic commentarial tradition', kind: 'परंपरा' },
  { id: 'acharyas-saints', hi: 'भक्ति और बाद के आचार्य', en: 'Bhakti and later teachers', kind: 'परंपरा' },
];

export default function TimelinesPage() {
  const [activeType, setActiveType] = useState<TimelineType | 'all'>('all');
  const [pendingEra, setPendingEra] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingEra || activeType !== 'all') return;
    document.getElementById(pendingEra)?.scrollIntoView({ block: 'start' });
    setPendingEra(null);
  }, [pendingEra, activeType]);

  const filteredTimelines =
    activeType === 'all' ? timelines : timelines.filter((t) => t.type === activeType);

  const availableTypes = Array.from(new Set(timelines.map((t) => t.type)));

  return (
    <main className="long-read long-read-hi min-h-screen bg-dharma-bg">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-dharma-border bg-gradient-to-b from-amber-50/70 via-dharma-card to-dharma-bg py-12 text-dharma-text dark:from-amber-950/20 sm:py-16">
        <div className="relative mx-auto max-w-6xl px-6">
          <FadeUp>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-saffron-500/25 bg-saffron-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-saffron-800 dark:text-saffron-300">
              कालरेखा — शास्त्रीय कालखंड (Scriptural Timelines)
            </p>
            <h1 className="mb-4 font-serif text-4xl font-bold text-dharma-text sm:text-5xl">
              <span lang="hi" data-bi="hi">कालखंड एवं परंपरा</span><span data-bi="sep"> (</span><span data-bi="en">Timelines &amp; Traditions</span><span data-bi="sep">)</span>
            </h1>
            <p className="max-w-2xl text-lg text-dharma-muted sm:text-xl">
              कथा-क्रम, पारंपरिक कालगणना, ऐतिहासिक-शैक्षणिक दिनांक, टीका-परंपरा का विकास, प्रमुख आचार्यों और संतों का काल, और पांडुलिपियों का इतिहास — सभी अलग-अलग कालखंडों में। पारंपरिक पवित्र कालगणना और ऐतिहासिक-शैक्षणिक दिनांक अलग-अलग प्रस्तुत किए गए हैं, एकाकृत नहीं।
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-8 pb-20">
        {/* ── Important Notice ────────────────────────────────────── */}
        <FadeUp>
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 mb-6 dark:border-amber-500/35 dark:bg-amber-950/30">
            <p className="text-sm text-amber-950 dark:text-amber-200 leading-relaxed">
              <strong>महत्वपूर्ण:</strong> पारंपरिक पवित्र कालगणना (युग प्रणाली और पुराणिक स्रोतों पर आधारित) और ऐतिहासिक-शैक्षणिक दिनांक (पुरातत्व और भाषाविज्ञान पर आधारित) मौलिक रूप से भिन्न दृष्टिकोण हैं। ये यहाँ अलग-अलग कालखंडों में प्रस्तुत हैं और इन्हें एकाकृत या मिश्रित नहीं किया जाना चाहिए।
            </p>
          </div>
        </FadeUp>

        <nav aria-label="कथा और इतिहास" className="mb-8 rounded-2xl border border-dharma-border bg-dharma-card p-4">
          <h2 className="font-serif text-lg font-bold text-dharma-text">
            <span lang="hi" className="font-devanagari">कथा और इतिहास अलग हैं</span>
          </h2>
          <p lang="hi" className="mt-2 text-sm leading-relaxed text-dharma-text">
            कथा या परंपरा ऐतिहासिक दिनांक नहीं है। शैक्षणिक काल अनुमान है। नई तिथि नहीं जोड़ी गई।
          </p>
          <ul className="mt-3 space-y-2">
            {ERA_INDEX.map((era) => (
              <li key={era.id}>
                <a
                  href={`#${era.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    setActiveType('all');
                    setPendingEra(era.id);
                  }}
                  className="font-semibold text-saffron-800 dark:text-saffron-300 underline underline-offset-2"
                >
                  <span lang="hi" className="font-devanagari">{era.hi}</span>
                  <span className="font-normal text-dharma-text-secondary"> · {era.en}</span>
                </a>
                <span className="ml-2 text-sm text-dharma-text-secondary">{era.kind}</span>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Filter Bar ──────────────────────────────────────────── */}
        <FadeUp>
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveType('all')}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold transition ${
                activeType === 'all'
                  ? 'bg-saffron-700 text-white shadow-sm'
                  : 'bg-dharma-card text-dharma-text border border-dharma-border hover:border-saffron-400'
              }`}
            >
              सभी कालखंड ({timelines.length})
            </button>
            {availableTypes.map((type) => {
              const meta = timelineTypeLabels[type];
              const count = timelines.filter((t) => t.type === type).length;
              return (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    activeType === type
                      ? 'bg-saffron-700 text-white shadow-sm'
                      : 'bg-dharma-card text-dharma-text border border-dharma-border hover:border-saffron-400'
                  }`}
                >
                  {meta.label.split('(')[0].trim()} ({count})
                </button>
              );
            })}
          </div>
        </FadeUp>

        {/* ── Timeline Sections ───────────────────────────────────── */}
        <div className="space-y-12">
          {filteredTimelines.map((timeline) => {
            const meta = timelineTypeLabels[timeline.type];
            return (
              <FadeUpOnView key={timeline.id}>
                <div id={timeline.id} className="scroll-mt-24 rounded-2xl border border-dharma-border bg-dharma-card shadow-xl overflow-hidden">
                  <div className="h-1.5 bg-gradient-to-r from-saffron-500 to-amber-600" />
                  <div className="p-6 md:p-8">
                    {/* Timeline header */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-serif font-bold text-dharma-text">
                          {timeline.title}
                        </h2>
                        {timeline.sanskrit && (
                          <span lang="sa" className="font-devanagari text-base text-saffron-700 dark:text-saffron-300">
                            {timeline.sanskrit}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-dharma-muted leading-relaxed">
                        {timeline.description}
                      </p>
                    </div>

                    {/* Timeline events */}
                    <div className="relative pl-6 border-l-2 border-saffron-300/70 dark:border-saffron-500/30 space-y-5">
                      {timeline.events.map((event) => (
                        <div key={event.id} className="relative">
                          {/* Dot */}
                          <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-saffron-600 border-2 border-dharma-card shadow-sm" />

                          {/* Content */}
                          <div className="rounded-xl border border-dharma-border bg-dharma-bg/40 p-4 hover:border-saffron-300 dark:hover:border-saffron-500/40 transition">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <h3 className="font-serif font-bold text-dharma-text">
                                {event.title}
                                {event.sanskrit && (
                                  <span lang="sa" className="font-devanagari text-sm text-saffron-700 dark:text-saffron-300 ml-2">
                                    {event.sanskrit}
                                  </span>
                                )}
                              </h3>
                              <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-full whitespace-nowrap border border-indigo-200 dark:text-indigo-200 dark:bg-indigo-950/50 dark:border-indigo-500/30">
                                {event.date}
                              </span>
                            </div>
                            <p className="text-sm text-dharma-text leading-relaxed mb-2">
                              {event.description}
                            </p>
                            <p className="text-xs text-dharma-muted italic">
                              <strong>महत्व:</strong> {event.significance}
                            </p>
                            {event.relatedTexts && event.relatedTexts.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {event.relatedTexts.map((text) => (
                                  <span key={text} className="text-[10px] font-semibold text-saffron-800 bg-saffron-50 px-2 py-0.5 rounded-full border border-saffron-200 dark:text-saffron-200 dark:bg-saffron-950/40 dark:border-saffron-500/30">
                                    {text}
                                  </span>
                                ))}
                              </div>
                            )}
                            {event.relatedFigures && event.relatedFigures.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {event.relatedFigures.map((fig) => (
                                  <Link
                                    key={fig}
                                    href={`/characters/${fig}/`}
                                    className="text-[10px] font-semibold text-violet-800 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200 hover:bg-violet-100 dark:text-violet-200 dark:bg-violet-950/50 dark:border-violet-500/30 dark:hover:bg-violet-900/50 transition"
                                  >
                                    {fig}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeUpOnView>
            );
          })}
        </div>
      </section>
    </main>
  );
}
