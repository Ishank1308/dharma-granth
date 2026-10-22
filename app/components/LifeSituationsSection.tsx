'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Compass,
  Flame,
  Heart,
  Scale,
  Shield,
  Sparkles,
  Target,
  Users,
  Wind,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { triggerTactileFeedback } from '@/lib/haptics';

interface LifeSituation {
  id: string;
  topicHref: string;
  category: 'peace' | 'duty' | 'harmony';
  titleHi: string;
  titleEn: string;
  sanskrit: string;
  prompt: string;
  scriptureRef: string;
  icon: ReactNode;
}

const situations: LifeSituation[] = [
  {
    id: 'stress',
    topicHref: '/wisdom-for-life/stress-and-worry/',
    category: 'peace',
    titleHi: 'उद्वेग व चिन्ता',
    titleEn: 'Stress and worry',
    sanskrit: 'शमः व समत्वम्',
    prompt: 'Release anxiety over outcomes you cannot control; center awareness on the present duty with an even mind.',
    scriptureRef: 'गीता 2.48 (समत्वं योग उच्यते)',
    icon: <Wind className="h-5 w-5" aria-hidden="true" />,
  },
  {
    id: 'fear',
    topicHref: '/wisdom-for-life/stress-and-worry/',
    category: 'peace',
    titleHi: 'भय व असुरक्षा',
    titleEn: 'Fear',
    sanskrit: 'अभयम्',
    prompt: 'Awaken the realization of the eternal, indestructible Self (Atman) which cannot be shaken by outward turbulence.',
    scriptureRef: 'गीता 2.20 व 16.1 (न जायते म्रियते वा)',
    icon: <Shield className="h-5 w-5" aria-hidden="true" />,
  },
  {
    id: 'anger',
    topicHref: '/wisdom-for-life/anger/',
    category: 'peace',
    titleHi: 'क्रोध व आवेश',
    titleEn: 'Anger',
    sanskrit: 'क्रोध-संयमः',
    prompt: 'Trace anger to frustrated desire; observe the impulse and pause before reaction clouds discrimination.',
    scriptureRef: 'गीता 2.63 (क्रोधाद्भवति संमोहः)',
    icon: <Flame className="h-5 w-5" aria-hidden="true" />,
  },
  {
    id: 'grief',
    topicHref: '/wisdom-for-life/grief-and-loss/',
    category: 'harmony',
    titleHi: 'शोक व विछोह',
    titleEn: 'Grief',
    sanskrit: 'अनित्यता व शोक-मुक्ति',
    prompt: 'Hold personal grief within the vast perspective of the eternal soul — bodies change like garments, but spirit abides.',
    scriptureRef: 'गीता 2.22 (वासांसि जीर्णानि यथा विहाय)',
    icon: <Heart className="h-5 w-5" aria-hidden="true" />,
  },
  {
    id: 'duty',
    topicHref: '/wisdom-for-life/skill-in-work/',
    category: 'duty',
    titleHi: 'कर्तव्य व धर्मसंकट',
    titleEn: 'Duty',
    sanskrit: 'स्वधर्मः',
    prompt: 'Engage with your authentic calling wholeheartedly, performing actions as a dedicated offering rather than for ego.',
    scriptureRef: 'गीता 3.35 व 2.47 (श्रेयान्स्वधर्मो विगुणः)',
    icon: <Scale className="h-5 w-5" aria-hidden="true" />,
  },
  {
    id: 'self-control',
    topicHref: '/wisdom-for-life/discipline/',
    category: 'duty',
    titleHi: 'आत्म-संयम व नियम',
    titleEn: 'Self-control',
    sanskrit: 'दमः व तपः',
    prompt: 'Walk the golden middle path of moderation in food, recreation, and sleep to cultivate sustainable clarity.',
    scriptureRef: 'गीता 6.16 व 6.24 (नात्यश्नतस्तु योगोऽस्ति)',
    icon: <Compass className="h-5 w-5" aria-hidden="true" />,
  },
  {
    id: 'focus',
    topicHref: '/wisdom-for-life/discipline/',
    category: 'duty',
    titleHi: 'एकाग्रता व ध्यान',
    titleEn: 'Focus',
    sanskrit: 'अभ्यासः व धारणा',
    prompt: 'Train the wandering mind through patient repetition (abhyāsa) and gentle dispassion (vairāgya).',
    scriptureRef: 'गीता 6.35 (अभ्यासेन तु कौन्तेय)',
    icon: <Target className="h-5 w-5" aria-hidden="true" />,
  },
  {
    id: 'devotion',
    topicHref: '/wisdom-for-life/relationships/',
    category: 'harmony',
    titleHi: 'भक्ति व समर्पण',
    titleEn: 'Devotion',
    sanskrit: 'भक्ति-योगः',
    prompt: 'Transform ordinary daily activities into loving devotion by offering every thought and deed to the divine.',
    scriptureRef: 'गीता 9.26 (पत्रं पुष्पं फलं तोयम्)',
    icon: <Sparkles className="h-5 w-5" aria-hidden="true" />,
  },
  {
    id: 'knowledge',
    topicHref: '/wisdom-for-life/discipline/',
    category: 'harmony',
    titleHi: 'ज्ञान व विवेक',
    titleEn: 'Knowledge',
    sanskrit: 'ज्ञानम् व विवेकः',
    prompt: 'Discern the permanent truth from transient appearances; nothing in this world purifies like wisdom.',
    scriptureRef: 'गीता 4.38 (न हि ज्ञानेन सदृशं पवित्रम्)',
    icon: <BookOpen className="h-5 w-5" aria-hidden="true" />,
  },
  {
    id: 'relationships',
    topicHref: '/wisdom-for-life/relationships/',
    category: 'harmony',
    titleHi: 'संबंध व सद्भाव',
    titleEn: 'Relationships',
    sanskrit: 'सर्वभूतहिते रताः',
    prompt: 'See the identical divine presence in all individuals, cultivating harmony through truthful speech and non-possessive love.',
    scriptureRef: 'गीता 6.29 (सर्वभूतस्थमात्मानं)',
    icon: <Users className="h-5 w-5" aria-hidden="true" />,
  },
];

type CategoryFilter = 'all' | 'peace' | 'duty' | 'harmony';

const FILTER_TABS: Array<{ id: CategoryFilter; label: string; sub: string }> = [
  { id: 'all', label: 'All Dimensions', sub: 'सभी 10 विषय' },
  { id: 'peace', label: 'Inner Peace', sub: 'शांति व धैर्य' },
  { id: 'duty', label: 'Duty & Purpose', sub: 'कर्म व एकाग्रता' },
  { id: 'harmony', label: 'Solace & Connection', sub: 'सद्भाव व प्रेम' },
];

export function LifeSituationsSection() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [showAllMobile, setShowAllMobile] = useState(false);

  const filteredSituations = situations.filter((sit) => {
    if (activeFilter === 'all') return true;
    return sit.category === activeFilter;
  });

  return (
    <section
      id="life-situations"
      aria-labelledby="life-situations-heading"
      className="border-b border-dharma-border bg-gradient-to-b from-dharma-bg via-dharma-card/30 to-dharma-bg py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Section Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="size-2 rounded-full bg-saffron-600 animate-pulse" />
              <p lang="hi" className="text-xs font-bold uppercase tracking-[0.2em] text-saffron-700 dark:text-saffron-400 font-devanagari">
                जीवन के लिए शास्त्रीय मार्गदर्शन · Canonical Guidance
              </p>
            </div>
            <h2
              id="life-situations-heading"
              className="font-serif text-3xl font-bold text-dharma-text sm:text-4xl"
            >
              Wisdom for Life
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-dharma-muted sm:text-base">
              Turn to timeless scriptural perspectives for inner balance, purpose, and peace amid life’s everyday experiences — stress, fear, duty, relationships, grief, and self-knowledge.
            </p>
          </div>

          <Link
            href="/wisdom-for-life"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-dharma-border bg-dharma-card px-5 py-2.5 text-xs font-bold text-dharma-text transition hover:border-saffron-300 hover:text-saffron-700 shadow-xs"
          >
            <span>Explore All 13 Dimensions</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Life situation filters">
          {FILTER_TABS.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  triggerTactileFeedback('light', 'softTap');
                  setActiveFilter(tab.id);
                }}
                className={`flex min-h-[40px] items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition active:scale-95 ${
                  isSelected
                    ? 'bg-saffron-600 text-white shadow-sm'
                    : 'border border-dharma-border bg-dharma-card text-dharma-muted hover:border-saffron-300 hover:text-dharma-text'
                }`}
              >
                <span>{tab.label}</span>
                {/* White on the selected saffron (#cf440a) is 4.68:1; amber-200 was 3.76. */}
                <span lang="hi" className={`text-[10px] ${isSelected ? 'text-white' : 'text-dharma-muted'}`}>
                  {tab.sub}
                </span>
              </button>
            );
          })}
        </div>

        {/* Topic Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {filteredSituations.map((sit, index) => {
            const isHiddenOnMobile = activeFilter === 'all' && !showAllMobile && index >= 4;
            return (
              <Link
                key={sit.id}
                href={sit.topicHref}
                onClick={() => triggerTactileFeedback('light', 'softTap')}
                aria-label={`Scriptural perspective on ${sit.titleEn} (${sit.titleHi})`}
                className={`${
                  isHiddenOnMobile ? 'hidden sm:flex ' : 'flex '
                }group flex-col justify-between rounded-2xl border border-dharma-border bg-dharma-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/60 hover:shadow-lg dark:hover:border-amber-700/50`}
              >
                <div>
                  {/* Header with simple line icon & Sanskrit tag */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-saffron-700 dark:text-saffron-400 transition group-hover:bg-saffron-600 group-hover:text-white">
                      {sit.icon}
                    </span>
                    <span lang="sa" className="font-devanagari text-[11px] font-medium text-dharma-muted">
                      {sit.sanskrit}
                    </span>
                  </div>

                  {/* Titles */}
                  <h3 className="font-serif text-base font-bold text-dharma-text group-hover:text-saffron-700 transition">
                    {sit.titleEn}
                  </h3>
                  <p lang="hi" className="font-devanagari text-xs font-semibold text-saffron-800 dark:text-saffron-200 mt-0.5">
                    {sit.titleHi}
                  </p>

                  {/* Prompt */}
                  <p className="mt-2.5 text-xs leading-relaxed text-dharma-muted line-clamp-3">
                    {sit.prompt}
                  </p>
                </div>

                {/* Scripture Reference Tag */}
                <div className="mt-5 border-t border-dharma-border/60 pt-3 flex items-center justify-between">
                  <span className="block truncate text-[11px] font-semibold text-dharma-muted group-hover:text-dharma-text transition">
                    {sit.scriptureRef}
                  </span>
                  <span className="text-xs font-bold text-saffron-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile Expand / Collapse Button (shown when viewing all on small screens) */}
        {activeFilter === 'all' && (
          <div className="mt-6 text-center sm:hidden">
            <button
              type="button"
              onClick={() => {
                triggerTactileFeedback('light', 'softTap');
                setShowAllMobile(!showAllMobile);
              }}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-dharma-border bg-dharma-card px-5 py-2.5 text-xs font-bold text-dharma-text shadow-xs active:scale-95"
              aria-expanded={showAllMobile}
            >
              <span>{showAllMobile ? 'कम विषय दिखाएं (Show Less)' : 'सभी 10 विषय देखें (Show All 10)'}</span>
              {showAllMobile ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        )}

        {/* Responsible Educational Notice (Avoiding Medical Claims) */}
        <div className="mt-8 rounded-2xl border border-dashed border-amber-300/60 bg-amber-500/5 p-4 text-xs text-dharma-muted dark:border-amber-900/50">
          <p className="leading-relaxed">
            <strong className="text-dharma-text">Contemplative Notice:</strong> The verses and guidance curated here offer philosophical inquiries, ethical reflections, and classical perspectives from Hindu sacred texts. They are intended for personal contemplation and study, and do not constitute clinical, psychological, or medical counsel.
          </p>
        </div>
      </div>
    </section>
  );
}
