'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FadeUp, FadeUpOnView } from '@/app/components/motion/primitives';
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
  const [selectedTimelineId, setSelectedTimelineId] = useState<string>(timelines[0]?.id ?? 'ramayana-narrative');
  const [activeEventIndex, setActiveEventIndex] = useState<number>(0);

  useEffect(() => {
    if (!pendingEra || activeType !== 'all') return;
    document.getElementById(pendingEra)?.scrollIntoView({ block: 'start' });
    setPendingEra(null);
  }, [pendingEra, activeType]);

  const filteredTimelines =
    activeType === 'all' ? timelines : timelines.filter((t) => t.type === activeType);

  const availableTypes = Array.from(new Set(timelines.map((t) => t.type)));

  const activeTimeline =
    filteredTimelines.find((t) => t.id === selectedTimelineId) ?? filteredTimelines[0] ?? timelines[0];
  const activeEvents = activeTimeline ? activeTimeline.events : [];
  const safeEventIndex = Math.min(activeEventIndex, Math.max(0, activeEvents.length - 1));
  const activeEvent = activeEvents[safeEventIndex];
  const activeTypeMeta = activeTimeline ? timelineTypeLabels[activeTimeline.type] : null;

  const handleSelectTimeline = (timelineId: string) => {
    setSelectedTimelineId(timelineId);
    setActiveEventIndex(0);
  };

  const stepEvent = (delta: -1 | 1) => {
    if (activeEvents.length <= 1) return;
    const next = (safeEventIndex + delta + activeEvents.length) % activeEvents.length;
    setActiveEventIndex(next);
  };

  return (
    <main className="long-read long-read-hi min-h-screen bg-dharma-bg">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-dharma-border bg-gradient-to-b from-amber-50/70 via-dharma-card to-dharma-bg py-12 text-dharma-text dark:from-amber-950/20 sm:py-16">
        <div className="relative mx-auto max-w-6xl px-6">
          <FadeUp>
            <p className="mb-4 inline-flex flex-wrap items-center gap-1 rounded-full border border-saffron-500/25 bg-saffron-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-saffron-800 dark:text-saffron-300">
              <span lang="hi" data-bi="hi">कालरेखा — शास्त्रीय कालखंड</span><span data-bi="sep"> (</span><span data-bi="en">Scriptural Timelines</span><span data-bi="sep">)</span>
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
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20">
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
                    setSelectedTimelineId(era.id);
                    setActiveEventIndex(0);
                    setPendingEra(era.id);
                  }}
                  className="focus-ring rounded font-semibold text-saffron-800 dark:text-saffron-300 underline underline-offset-2"
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
          <div role="group" aria-label="कालखंड श्रेणी फ़िल्टर · Timeline category filter" className="flex flex-wrap gap-2 mb-8">
            <button
              type="button"
              aria-pressed={activeType === 'all'}
              onClick={() => {
                setActiveType('all');
                setActiveEventIndex(0);
              }}
              className={`focus-ring min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold transition ${
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
                  type="button"
                  aria-pressed={activeType === type}
                  onClick={() => {
                    setActiveType(type);
                    const firstInType = timelines.find((t) => t.type === type);
                    if (firstInType) {
                      setSelectedTimelineId(firstInType.id);
                    }
                    setActiveEventIndex(0);
                  }}
                  className={`focus-ring min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold transition ${
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

        {/* ── Interactive Chronology Explorer Card ────────────────── */}
        {activeTimeline && activeEvent && (
          <FadeUp>
            <section
              aria-labelledby="chronology-explorer-heading"
              className="mb-10 bg-dharma-card border border-dharma-border rounded-card p-5 shadow-raised overflow-hidden"
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                <div className="min-w-0">
                  <h2
                    id="chronology-explorer-heading"
                    className="font-serif text-lg sm:text-xl font-bold text-dharma-text"
                  >
                    <span lang="hi" data-bi="hi" className="font-devanagari">संवादात्मक कालक्रम अन्वेषक</span>
                    <span data-bi="sep" aria-hidden="true"> · </span>
                    <span data-bi="en">Interactive Chronology Explorer</span>
                  </h2>
                  <p lang="hi" className="mt-1 text-xs sm:text-sm text-dharma-muted font-devanagari">
                    कालखंड चुनें और नीचे स्लाइडर या बटनों से प्रत्येक पड़ाव का क्रमशः अवलोकन करें।
                  </p>
                </div>
                {activeTypeMeta && (
                  <span className="inline-flex max-w-full items-center rounded-full border border-saffron-500/30 bg-saffron-500/10 px-3 py-1 text-xs font-bold text-saffron-900 dark:text-saffron-200">
                    {activeTypeMeta.label.split('(')[0].trim()}
                  </span>
                )}
              </div>

              {/* Timeline Selector Pills (matching filteredTimelines) */}
              <div
                role="group"
                aria-label="कालखंड चयन · Select timeline"
                className="flex flex-wrap gap-2 mb-5"
              >
                {filteredTimelines.map((tl) => {
                  const selected = tl.id === activeTimeline.id;
                  const shortTitle = tl.title.split('(')[0].trim();
                  return (
                    <button
                      key={tl.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => handleSelectTimeline(tl.id)}
                      className={`focus-ring min-h-[44px] max-w-full rounded-xl px-3.5 py-2 text-left text-xs sm:text-sm font-semibold leading-snug transition ${
                        selected
                          ? 'bg-saffron-700 text-white shadow-sm'
                          : 'bg-dharma-bg/70 text-dharma-text border border-dharma-border hover:border-saffron-400'
                      }`}
                    >
                      <span className="break-words">{shortTitle}</span>
                    </button>
                  );
                })}
              </div>

              {/* Event Scrubber + Step Controls */}
              <div className="rounded-xl border border-dharma-border bg-dharma-bg/55 p-3.5 sm:p-4 mb-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <label
                    htmlFor="timeline-event-scrubber"
                    className="text-xs sm:text-sm font-semibold text-dharma-text"
                  >
                    <span lang="hi" data-bi="hi" className="font-devanagari">घटना क्रम स्लाइडर</span>
                    <span data-bi="sep" aria-hidden="true"> · </span>
                    <span data-bi="en">Event Scrubber</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => stepEvent(-1)}
                      disabled={activeEvents.length <= 1}
                      aria-label="पिछली घटना · Previous event"
                      className="focus-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-dharma-border bg-dharma-card px-3 text-sm font-bold text-dharma-text hover:border-saffron-400 disabled:opacity-40 transition"
                    >
                      ◀
                    </button>

                    <span
                      aria-live="polite"
                      className="tabular-nums min-w-[3.5rem] text-center text-sm font-bold text-dharma-text"
                    >
                      {safeEventIndex + 1} / {activeEvents.length}
                    </span>

                    <button
                      type="button"
                      onClick={() => stepEvent(1)}
                      disabled={activeEvents.length <= 1}
                      aria-label="अगली घटना · Next event"
                      className="focus-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-dharma-border bg-dharma-card px-3 text-sm font-bold text-dharma-text hover:border-saffron-400 disabled:opacity-40 transition"
                    >
                      ▶
                    </button>
                  </div>
                </div>

                <input
                  id="timeline-event-scrubber"
                  type="range"
                  min={0}
                  max={Math.max(0, activeEvents.length - 1)}
                  step={1}
                  value={safeEventIndex}
                  aria-valuetext={`${safeEventIndex + 1} / ${activeEvents.length}: ${activeEvent.title} (${activeEvent.date})`}
                  onChange={(e) => setActiveEventIndex(Number(e.target.value))}
                  className="focus-ring w-full h-2.5 cursor-pointer rounded-lg accent-saffron-600"
                />

                <div className="mt-2 flex items-center justify-between gap-2 text-xs text-dharma-muted">
                  <span className="truncate max-w-[48%]">{activeEvents[0]?.title}</span>
                  <span className="truncate max-w-[48%] text-right">
                    {activeEvents[activeEvents.length - 1]?.title}
                  </span>
                </div>
              </div>

              {/* Live Event Spotlight Panel */}
              <div className="rounded-2xl border border-saffron-500/35 bg-gradient-to-br from-saffron-500/[0.06] via-dharma-card to-amber-500/[0.05] p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-dharma-muted mb-1 break-words">
                      {activeTimeline.title.split('(')[0].trim()}
                    </p>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-dharma-text break-words">
                      {activeEvent.title}
                      {activeEvent.sanskrit && (
                        <span
                          lang="sa"
                          className="font-devanagari text-sm sm:text-base text-saffron-700 dark:text-saffron-300 ml-2"
                        >
                          {activeEvent.sanskrit}
                        </span>
                      )}
                    </h3>
                  </div>

                  <span className="inline-flex max-w-full items-center text-xs font-bold text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 dark:text-indigo-200 dark:bg-indigo-950/60 dark:border-indigo-500/35 break-words">
                    {activeEvent.date}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-dharma-text leading-relaxed mb-3">
                  {activeEvent.description}
                </p>

                <div className="rounded-xl border border-saffron-500/25 bg-dharma-bg/65 px-3.5 py-2.5 mb-3">
                  <p className="text-xs sm:text-sm text-dharma-text leading-relaxed">
                    <strong>महत्व:</strong> {activeEvent.significance}
                  </p>
                </div>

                {activeEvent.relatedTexts && activeEvent.relatedTexts.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    <span className="text-xs font-semibold text-dharma-muted mr-1">संबंधित ग्रंथ:</span>
                    {activeEvent.relatedTexts.map((text) => (
                      <span
                        key={text}
                        className="text-xs font-semibold text-saffron-900 bg-saffron-50 px-2.5 py-0.5 rounded-full border border-saffron-200 dark:text-saffron-200 dark:bg-saffron-950/40 dark:border-saffron-500/30"
                      >
                        {text}
                      </span>
                    ))}
                  </div>
                )}

                {activeEvent.relatedFigures && activeEvent.relatedFigures.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-dharma-muted">प्रमुख व्यक्तित्व:</span>
                    {activeEvent.relatedFigures.map((fig) => (
                      <Link
                        key={fig}
                        href={`/characters/${fig}/`}
                        className="focus-ring inline-flex min-h-[36px] items-center text-xs font-semibold text-violet-900 bg-violet-50 px-3 py-1 rounded-full border border-violet-200 hover:bg-violet-100 dark:text-violet-200 dark:bg-violet-950/50 dark:border-violet-500/30 dark:hover:bg-violet-900/50 transition"
                      >
                        {fig}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-dharma-border/70 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-dharma-muted">
                    {activeTypeMeta?.description}
                  </span>
                  <a
                    href={`#${activeTimeline.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      const eventEl = document.getElementById(`event-${activeTimeline.id}-${activeEvent.id}`);
                      const cardEl = document.getElementById(activeTimeline.id);
                      (eventEl ?? cardEl)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="focus-ring inline-flex min-h-[44px] items-center rounded-xl border border-saffron-500/35 bg-saffron-500/10 px-3.5 py-2 text-xs sm:text-sm font-bold text-saffron-900 hover:bg-saffron-500/20 dark:text-saffron-200 transition"
                  >
                    सूची में देखें ↓
                  </a>
                </div>
              </div>
            </section>
          </FadeUp>
        )}

        {/* ── Timeline Sections ───────────────────────────────────── */}
        <div className="space-y-12">
          {filteredTimelines.map((timeline) => {
            const meta = timelineTypeLabels[timeline.type];
            return (
              <FadeUpOnView key={timeline.id}>
                <div id={timeline.id} className="scroll-mt-24 card-sacred rounded-card border border-dharma-border bg-dharma-card shadow-raised overflow-hidden">
                  <div className="h-1.5 bg-gradient-to-r from-saffron-500 to-amber-600" />
                  <div className="p-5 sm:p-6 md:p-8">
                    {/* Timeline header */}
                    <div className="mb-6">
                      <div className="flex flex-wrap items-center gap-2.5 mb-2">
                        <h2 className="text-xl font-serif font-bold text-dharma-text break-words">
                          {timeline.title}
                        </h2>
                        {timeline.sanskrit && (
                          <span lang="sa" className="font-devanagari text-base text-saffron-700 dark:text-saffron-300">
                            {timeline.sanskrit}
                          </span>
                        )}
                        <span className="inline-flex max-w-full items-center rounded-full border border-saffron-500/25 bg-saffron-500/10 px-2.5 py-0.5 text-xs font-semibold text-saffron-900 dark:text-saffron-200">
                          {meta.label.split('(')[0].trim()}
                        </span>
                      </div>
                      <p className="text-sm text-dharma-muted leading-relaxed">
                        {timeline.description}
                      </p>
                    </div>

                    {/* Timeline events */}
                    <div className="relative pl-6 border-l-2 border-saffron-300/70 dark:border-saffron-500/30 space-y-5">
                      {timeline.events.map((event) => {
                        const isSpotlighted =
                          activeTimeline?.id === timeline.id && activeEvent?.id === event.id;
                        return (
                          <div
                            key={event.id}
                            id={`event-${timeline.id}-${event.id}`}
                            className="relative scroll-mt-28"
                          >
                            {/* Dot */}
                            <div
                              className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-dharma-card shadow-sm ${
                                isSpotlighted ? 'bg-amber-500 ring-2 ring-saffron-500/40' : 'bg-saffron-600'
                              }`}
                            />

                            {/* Content */}
                            <div
                              className={`rounded-xl border p-4 transition ${
                                isSpotlighted
                                  ? 'border-saffron-500/70 bg-saffron-500/[0.06]'
                                  : 'border-dharma-border bg-dharma-bg/40 hover:border-saffron-300 dark:hover:border-saffron-500/40'
                              }`}
                            >
                              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                <h3 className="font-serif font-bold text-dharma-text break-words">
                                  {event.title}
                                  {event.sanskrit && (
                                    <span lang="sa" className="font-devanagari text-sm text-saffron-700 dark:text-saffron-300 ml-2">
                                      {event.sanskrit}
                                    </span>
                                  )}
                                </h3>
                                <span className="max-w-full break-words text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 dark:text-indigo-200 dark:bg-indigo-950/50 dark:border-indigo-500/30">
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
                                      className="focus-ring inline-flex min-h-[32px] items-center text-xs font-semibold text-violet-800 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-200 hover:bg-violet-100 dark:text-violet-200 dark:bg-violet-950/50 dark:border-violet-500/30 dark:hover:bg-violet-900/50 transition"
                                    >
                                      {fig}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
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
