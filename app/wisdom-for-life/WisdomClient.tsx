'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Clock,
  Compass,
  Filter,
  Layers,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  wisdomTopics,
  wisdomCategories,
  type WisdomTopic,
} from '@/data/wisdom-for-life';
import { lifeProblemIndex } from '@/data/wisdom-life-problems';
import { TopicIllustration } from './TopicIllustrations';
import { FadeUp } from '@/app/components/motion/primitives';

export function WisdomClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFeeling, setActiveFeeling] = useState<string | null>(null);

  // Quick feelings to immediately jump to scriptural answers
  const quickFeelings = [
    { label: 'Anxious / Overthinking', labelHi: 'व्याकुल / अशान्त', topicId: 'stress-and-worry' },
    { label: 'Afraid of the Future', labelHi: 'भविष्य का भय', topicId: 'fear-and-courage' },
    { label: 'Burning with Frustration', labelHi: 'क्रोध / अशांति', topicId: 'anger' },
    { label: 'Heartbroken / Bereaved', labelHi: 'शोक / वियोग', topicId: 'grief-and-loss' },
    { label: 'Paralyzed by Choices', labelHi: 'अनिर्णय / द्वंद्व', topicId: 'duty-and-decision-making' },
    { label: 'Lacking Willpower', labelHi: 'आलस्य / संकल्प की कमी', topicId: 'discipline' },
    { label: 'Distracted & Scattered', labelHi: 'मन का भटकाव', topicId: 'concentration' },
    { label: 'Burdened by Leadership', labelHi: 'नेतृत्व का भार', topicId: 'leadership' },
    { label: 'Family Friction', labelHi: 'पारिवारिक तनाव', topicId: 'family-responsibilities' },
    { label: 'Strained Relationships', labelHi: 'सम्बन्धों में तनाव / संवेदनशीलता', topicId: 'relationships' },
    { label: 'Spiritually Exhausted', labelHi: 'अहंकार की थकान', topicId: 'devotion' },
    { label: 'Who Am I Really?', labelHi: 'सच्चा आत्म-स्वरूप', topicId: 'self-knowledge' },
    { label: 'What is My Purpose?', labelHi: 'जीवन का परम लक्ष्य', topicId: 'meaning-of-life' },
  ];

  const filteredTopics = useMemo(() => {
    return wisdomTopics.filter((topic) => {
      // Category filter
      if (selectedCategory !== 'all' && topic.category !== selectedCategory) {
        return false;
      }

      // Quick feeling filter
      if (activeFeeling && topic.id !== activeFeeling) {
        return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchTitle =
        topic.titleEn.toLowerCase().includes(q) ||
        topic.titleHi.includes(q) ||
        topic.sanskritSubtitle.toLowerCase().includes(q);
      const matchDesc =
        topic.shortDescEn.toLowerCase().includes(q) ||
        topic.shortDescHi.includes(q);
      const matchKeywords = topic.searchKeywords.some((k) =>
        k.toLowerCase().includes(q)
      );
      const matchVerses = topic.verses.some(
        (v) =>
          v.scriptureName.toLowerCase().includes(q) ||
          v.sanskritDevanagari.includes(q) ||
          v.literalTranslationEn.toLowerCase().includes(q) ||
          v.literalTranslationHi.includes(q)
      );

      return matchTitle || matchDesc || matchKeywords || matchVerses;
    });
  }, [selectedCategory, searchQuery, activeFeeling]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setActiveFeeling(null);
  };

  return (
    <div className="relative">
      {/* ── Search & Emotional Compass Bar ────────────────────────── */}
      <section className="relative -mt-10 z-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-dharma-border bg-dharma-card/95 backdrop-blur-xl p-5 sm:p-7 shadow-2xl transition-all">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            {/* Live Search Input */}
            <div className="relative flex-1">
              <label htmlFor="wisdom-search" className="sr-only">
                Search scriptures by life challenge or feeling
              </label>
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dharma-muted pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="wisdom-search"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeFeeling) setActiveFeeling(null);
                }}
                placeholder="What are you experiencing right now? (e.g., anxiety, anger, fear of loss, purpose...)"
                className="w-full rounded-2xl border border-dharma-border bg-dharma-bg/80 pl-12 pr-10 py-3.5 text-sm sm:text-base text-dharma-text placeholder:text-dharma-muted focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/20 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-dharma-muted hover:text-dharma-text hover:bg-black/5 dark:hover:bg-white/10 transition"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick stats counter */}
            <div className="flex items-center justify-between md:justify-end gap-3 px-1 text-xs sm:text-sm text-dharma-muted font-medium">
              <span className="flex items-center gap-1.5 bg-saffron-500/10 text-saffron-700 dark:text-saffron-300 px-3 py-1.5 rounded-full border border-saffron-500/20">
                <Compass className="w-3.5 h-3.5" />
                <span>{wisdomTopics.length} जीवन-विषय</span>
              </span>
              <span>
                Showing <strong className="text-dharma-text">{filteredTopics.length}</strong> of {wisdomTopics.length}
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-dharma-border">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-dharma-muted" lang="hi">
              जीवन की समस्या से श्लोक तक
            </p>
            <div className="flex flex-wrap gap-2">
              {lifeProblemIndex.map((item) => (
                <Link
                  key={item.en}
                  href={`/wisdom-for-life/${item.slug}/`}
                  className="inline-flex min-h-11 items-center rounded-xl border border-dharma-border bg-dharma-bg/60 px-3 text-sm text-dharma-text"
                >
                  <span>{item.en}</span>
                  <span className="ml-1.5 text-dharma-text-secondary" lang="hi">({item.hi})</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Emotional Quick Selectors ("I am experiencing...") */}
          <div className="mt-5 pt-4 border-t border-dharma-border">
            <div className="flex items-center gap-2 mb-2.5">
              <HeartHandshake className="w-4 h-4 text-saffron-600" />
              <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
                What are you experiencing right now? / आप इस समय क्या अनुभव कर रहे हैं?
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickFeelings.map((f) => {
                const isSelected = activeFeeling === f.topicId;
                return (
                  <button
                    key={f.topicId}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setActiveFeeling(null);
                      } else {
                        setActiveFeeling(f.topicId);
                        setSearchQuery('');
                      }
                    }}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'border-saffron-600 bg-saffron-600 text-white shadow-md'
                        : 'border-dharma-border bg-dharma-bg/60 text-dharma-text hover:border-saffron-400 hover:bg-saffron-500/5'
                    }`}
                  >
                    <span>{f.label}</span>
                    <span className="text-[10px] opacity-75 font-devanagari">({f.labelHi})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Filters ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-saffron-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-dharma-muted">
              Filter by Life Domain (विषय वर्ग)
            </h2>
          </div>

          {(selectedCategory !== 'all' || searchQuery || activeFeeling) && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-saffron-600 dark:text-saffron-400 hover:underline font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Reset all filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {wisdomCategories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.key);
                  setActiveFeeling(null);
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium border transition-all ${
                  isSelected
                    ? 'border-saffron-600 bg-saffron-600 text-white shadow-md'
                    : 'border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-300 hover:bg-dharma-card/80'
                }`}
              >
                <span>{cat.labelEn}</span>
                {/* No dimming on the selected saffron chip: at 80% it fell to 3.52:1. */}
                <span lang="hi" className={`ml-1.5 font-devanagari text-xs ${isSelected ? '' : 'opacity-80'}`}>
                  {cat.labelHi}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Topic Cards Grid ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        {filteredTopics.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-dharma-border bg-dharma-card/60 p-12 text-center max-w-xl mx-auto my-8">
            <Sparkles className="w-10 h-10 text-saffron-500 mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-dharma-text mb-1">
              No matching life topics found
            </h3>
            <p className="text-sm text-dharma-muted mb-5 leading-relaxed">
              Try searching with simpler terms such as &ldquo;peace&rdquo;, &ldquo;duty&rdquo;, &ldquo;fear&rdquo;, or reset the active filter.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-saffron-600 text-white text-xs font-bold shadow-md hover:bg-saffron-700 transition"
            >
              {`Show all ${wisdomTopics.length} topics`}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {filteredTopics.map((topic, index) => {
              const isFeatured = index % 4 === 0;
              return (
                <WisdomTopicCard
                  key={topic.id}
                  topic={topic}
                  isFeatured={isFeatured}
                  className={isFeatured ? 'md:col-span-8' : 'md:col-span-4'}
                />
              );
            })}
          </div>
        )}

        {/* ── Mandatory Medical & Contextual Disclaimer ─────────────── */}
        <div className="mt-16 rounded-3xl hairline-warm-border bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 backdrop-blur-sm manuscript-surface">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-serif font-bold text-dharma-text flex items-center gap-2">
                <span>शास्त्रीय मार्गदर्शन एवं संदर्भ सूचना</span>
                <span className="editorial-meta-pill text-amber-800 dark:text-amber-400 bg-amber-500/10 border-amber-500/20">
                  Important Contextual Note
                </span>
              </h3>
              <p className="text-sm text-dharma-muted leading-relaxed">
                The teachings curated in <em>Wisdom for Life</em> provide philosophical contemplation, ethical grounding, and reflective clarity from Hindu scriptures (Bhagavad Gita, Upanishads, Mahabharata, and Bhakti Sutras).
              </p>
              <ul className="text-xs sm:text-sm text-dharma-muted space-y-1 list-disc list-inside pt-1">
                <li>
                  <strong className="text-dharma-text">Do not diagnose health conditions:</strong> These insights address spiritual and philosophical discernment, not clinical pathologies.
                </li>
                <li>
                  <strong className="text-dharma-text">Not a medical replacement:</strong> Scripture is not a substitute for licensed psychiatric, psychological, or medical treatment. If you are experiencing clinical depression, severe anxiety, trauma, or emotional crisis, please seek immediate help from qualified healthcare professionals.
                </li>
                <li>
                  <strong className="text-dharma-text">Verified citations only:</strong> All reflections are grounded in authentic cited verses from the primary Sanskrit canon, avoiding ungrounded claims.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function WisdomTopicCard({
  topic,
  isFeatured = false,
  className = '',
}: {
  topic: WisdomTopic;
  isFeatured?: boolean;
  className?: string;
}) {
  return (
    <article
      id={`topic-card-${topic.slug}`}
      className={`group relative flex flex-col rounded-3xl hairline-warm-border bg-dharma-card manuscript-surface hover:border-saffron-400/60 dark:hover:border-saffron-500/50 hover:shadow-2xl transition-all duration-300 overflow-hidden ${className}`}
    >
      {/* Top accent gradient bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${topic.colorGradient}`} />

      {/* Main card body */}
      <div className={`p-6 sm:p-7 flex flex-col flex-grow ${isFeatured ? 'md:grid md:grid-cols-12 md:gap-8 md:items-start' : ''}`}>
        <div className={isFeatured ? 'md:col-span-4 flex flex-col items-start' : ''}>
          <div className="flex items-start justify-between w-full gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-stone-100/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800/80 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
              <TopicIllustration topicId={topic.id} size={isFeatured ? 96 : 80} />
            </div>

            <div className="text-right">
              <span className="editorial-meta-pill text-saffron-800 dark:text-saffron-300 bg-saffron-500/10 border-saffron-500/20 mb-1.5">
                {topic.categoryLabelEn}
              </span>
              <div className="flex items-center justify-end gap-1 font-mono text-[11px] text-dharma-muted">
                <Clock className="w-3 h-3" />
                <span>{topic.readingTimeMinutes} min</span>
              </div>
            </div>
          </div>

          {isFeatured && (
            <div className="hidden md:flex items-center gap-1.5 text-xs text-saffron-700 dark:text-saffron-400 font-medium pt-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Editorial Spotlight</span>
            </div>
          )}
        </div>

        {/* Content column */}
        <div className={`flex flex-col flex-grow ${isFeatured ? 'md:col-span-8' : ''}`}>
          {/* Titles */}
          <div className="mb-3">
            <h3 className={`font-serif font-bold text-dharma-text group-hover:text-saffron-700 dark:group-hover:text-saffron-400 transition-colors ${isFeatured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
              {topic.titleEn}
            </h3>
            <p lang="hi" className="text-base sm:text-lg font-devanagari font-semibold text-rose-700 dark:text-rose-400 mt-0.5">
              {topic.titleHi}
            </p>
            <p lang="sa" className="text-xs font-devanagari text-dharma-muted italic mt-1 line-clamp-1">
              {topic.sanskritSubtitle}
            </p>
          </div>

          {/* Short Premise */}
          <p className="text-sm text-dharma-muted leading-relaxed line-clamp-3 mb-4">
            {topic.shortDescEn}
          </p>

          {/* Scripture Citation Preview Badges */}
          <div className="mt-auto pt-3 border-t border-stone-200/70 dark:border-stone-800/70">
            <p className="font-mono text-[10px] uppercase tracking-wider font-semibold text-dharma-muted mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-saffron-600" />
              <span>Curated Verses ({topic.verses.length})</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {topic.verses.map((verse) => (
                <span
                  key={verse.id}
                  className="editorial-meta-pill bg-stone-100/90 dark:bg-stone-900/90 border-stone-300/70 dark:border-stone-800 text-stone-700 dark:text-stone-300"
                >
                  {verse.referenceDisplay}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Action */}
      <div className="px-6 py-3.5 bg-stone-50/60 dark:bg-stone-900/60 border-t border-stone-200/70 dark:border-stone-800/70 flex items-center justify-between">
        <span className="text-xs text-dharma-muted font-devanagari font-medium">
          सम्पूर्ण शास्त्रीय समाधान
        </span>
        <Link
          href={`/wisdom-for-life/${topic.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-700 dark:text-saffron-400 hover:text-saffron-800 dark:hover:text-saffron-300 transition-colors group-hover:translate-x-1 duration-200"
          aria-label={`Explore scriptural guidance for ${topic.titleEn}`}
        >
          <span>Explore Teachings</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
