'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FadeUp, FadeUpOnView } from '@/app/components/motion/primitives';
import { Timeline } from '@/app/components/Timeline';
import { timelines, timelineTypeLabels, type TimelineType } from '@/data/timelines';

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
    <main className="min-h-screen bg-dharma-bg">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-blue-800 to-cyan-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 mandala-bg opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <FadeUp>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-200 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              कालरेखा — शास्त्रीय कालखंड (Scriptural Timelines)
            </p>
            <h1 className="text-5xl font-serif font-bold mb-4">
              कालखंड एवं परंपरा (Timelines & Traditions)
            </h1>
            <p className="text-xl opacity-90 max-w-2xl">
              कथा-क्रम, पारंपरिक कालगणना, ऐतिहासिक-शैक्षणिक दिनांक, टीका-परंपरा का विकास, प्रमुख आचार्यों और संतों का काल, और पांडुलिपियों का इतिहास — सभी अलग-अलग कालखंडों में। पारंपरिक पवित्र कालगणना और ऐतिहासिक-शैक्षणिक दिनांक अलग-अलग प्रस्तुत किए गए हैं, एकाकृत नहीं।
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-10 pb-20">
        {/* ── Important Notice ────────────────────────────────────── */}
        <FadeUp>
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 mb-6">
            <p className="text-sm text-amber-900 leading-relaxed">
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
                  className="font-semibold text-saffron-600 underline underline-offset-2"
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
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                activeType === 'all'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                  : 'bg-dharma-card text-dharma-text border border-dharma-border hover:border-indigo-300'
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
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    activeType === type
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                      : 'bg-dharma-card text-dharma-text border border-dharma-border hover:border-indigo-300'
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
                  <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-blue-600" />
                  <div className="p-6 md:p-8">
                    {/* Timeline header */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-serif font-bold text-dharma-text">
                          {timeline.title}
                        </h2>
                        {timeline.sanskrit && (
                          <span lang="sa" className="font-devanagari text-base text-saffron-600">
                            {timeline.sanskrit}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-dharma-muted leading-relaxed">
                        {timeline.description}
                      </p>
                    </div>

                    {/* Timeline events */}
                    <div className="relative pl-6 border-l-2 border-indigo-200 space-y-5">
                      {timeline.events.map((event) => (
                        <div key={event.id} className="relative">
                          {/* Dot */}
                          <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 border-2 border-white shadow-sm" />

                          {/* Content */}
                          <div className="rounded-xl border border-dharma-border bg-dharma-bg/40 p-4 hover:border-indigo-200 transition">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <h3 className="font-serif font-bold text-dharma-text">
                                {event.title}
                                {event.sanskrit && (
                                  <span lang="sa" className="font-devanagari text-sm text-saffron-700 dark:text-saffron-400 ml-2">
                                    {event.sanskrit}
                                  </span>
                                )}
                              </h3>
                              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full whitespace-nowrap border border-indigo-200">
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
                                  <span key={text} className="text-[10px] font-semibold text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded-full border border-saffron-200">
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
                                    href={`/characters/${fig}`}
                                    className="text-[10px] font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200 hover:bg-violet-100 transition"
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
