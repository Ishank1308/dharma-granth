'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Compass,
  Brain,
  Shield,
  HelpCircle,
  HeartHandshake,
  Scale,
  Sun,
  Search,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Share2,
  RefreshCw,
  Lightbulb,
  Check,
  Feather,
} from 'lucide-react';
import {
  CURIOSITY_INQUIRIES,
  AUDIENCE_CONFIG,
  INQUIRY_CATEGORIES,
  type InquiryAudience,
  type InquiryCategory,
  type InquiryItem,
} from '@/data/curiosity-inquiry';
import { triggerTactileFeedback } from '@/lib/haptics';

const CATEGORY_ICONS: Record<InquiryCategory, typeof Brain> = {
  'mind-focus': Brain,
  'duty-results': Compass,
  'fear-courage': Shield,
  'identity-soul': Sparkles,
  'questions-tradition': HelpCircle,
  'emotions-balance': HeartHandshake,
  'truth-ethics': Scale,
  'oneness-diversity': Sun,
};

export function CuriosityHubClient() {
  const [selectedAudience, setSelectedAudience] = useState<InquiryAudience>('child');
  const [selectedCategory, setSelectedCategory] = useState<InquiryCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedInquiryId, setExpandedInquiryId] = useState<string | null>(
    CURIOSITY_INQUIRIES[0]?.id || null
  );
  const [showParentGuide, setShowParentGuide] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const audienceInfo = AUDIENCE_CONFIG[selectedAudience];

  const filteredInquiries = useMemo(() => {
    return CURIOSITY_INQUIRIES.filter((item) => {
      if (item.audience !== selectedAudience) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const haystack = `${item.questionEn} ${item.questionHi} ${item.wonderPromptEn} ${item.wonderPromptHi} ${item.simpleAnswerEn} ${item.simpleAnswerHi} ${item.scriptureAnchor.scriptureTitle} ${item.categoryLabelEn} ${item.categoryLabelHi}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [selectedAudience, selectedCategory, searchQuery]);

  const handleAudienceChange = (aud: InquiryAudience) => {
    setSelectedAudience(aud);
    setSelectedCategory('all');
    triggerTactileFeedback('selection', 'softTap');
    const firstForAudience = CURIOSITY_INQUIRIES.find((i) => i.audience === aud);
    if (firstForAudience) setExpandedInquiryId(firstForAudience.id);
  };

  const handleRandomPick = () => {
    const list = filteredInquiries.length > 0 ? filteredInquiries : CURIOSITY_INQUIRIES;
    const random = list[Math.floor(Math.random() * list.length)];
    if (random) {
      setSelectedAudience(random.audience);
      setExpandedInquiryId(random.id);
      triggerTactileFeedback('medium', 'click');
      setTimeout(() => {
        const el = document.getElementById(`inquiry-${random.id}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const handleCopyShare = async (item: InquiryItem) => {
    const text = `*${item.questionHi}*\n${item.questionEn}\n\n${item.simpleAnswerHi}\n\n📖 श्लोक: ${item.scriptureAnchor.scriptureTitleHi} ${item.scriptureAnchor.chapter}.${item.scriptureAnchor.verse}\n${siteUrl}/curiosity/#inquiry-${item.id}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      triggerTactileFeedback('light', 'softTap');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://dharmagranth.in';

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header Banner */}
      <header className="relative mb-8 overflow-hidden rounded-3xl border border-dharma-border bg-gradient-to-b from-amber-500/10 via-dharma-card to-dharma-card p-6 shadow-sm sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-saffron-300/40 bg-saffron-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-300">
            <Feather className="h-3.5 w-3.5" />
            <span>जिज्ञासा एवं सहज शास्त्र-दर्शन</span>
          </div>

          <button
            type="button"
            onClick={handleRandomPick}
            className="inline-flex items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-bg px-3.5 py-1.5 text-xs font-semibold text-dharma-text shadow-2xs transition hover:border-saffron-400 hover:text-saffron-700"
            title="कोई भी प्रश्न चुनें"
          >
            <RefreshCw className="h-3.5 w-3.5 text-saffron-600 dark:text-saffron-400" />
            <span>एक प्रश्न चुनें (Random Inquiry)</span>
          </button>
        </div>

        <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-dharma-text sm:text-4xl lg:text-5xl">
          Curiosity Opens the Door
        </h1>
        <p className="mt-1 font-devanagari text-xl font-medium text-saffron-700 dark:text-saffron-400 sm:text-2xl">
          जिज्ञासा द्वार खोलती है · शास्त्र संवाद शुरू करता है · चिंतन समझ को गहरा करता है
        </p>

        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-dharma-muted sm:text-base">
          Scriptures are not rigid lectures meant for blind compliance. They were born in lively,
          courageous dialogues between curious seekers, troubled warriors, and thoughtful teachers.
          Explore the questions that naturally arise in a child, teenager, parent, or first-time
          explorer.
        </p>

        {/* 7-Step Cycle Visualizer Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-dharma-border/60 text-[11px] font-semibold text-dharma-muted">
          <span className="text-saffron-700 dark:text-saffron-400 font-bold uppercase tracking-wider">
            Inquiry Cycle:
          </span>
          <span className="rounded-md bg-dharma-bg px-2 py-0.5">1. Wonder (कौतूहल)</span>
          <span>→</span>
          <span className="rounded-md bg-dharma-bg px-2 py-0.5">2. Ask (जिज्ञासा)</span>
          <span>→</span>
          <span className="rounded-md bg-dharma-bg px-2 py-0.5">3. Scripture (मूल श्लोक)</span>
          <span>→</span>
          <span className="rounded-md bg-dharma-bg px-2 py-0.5">4. Understand (सरल अर्थ)</span>
          <span>→</span>
          <span className="rounded-md bg-dharma-bg px-2 py-0.5">5. Think (स्वयं चिंतन)</span>
          <span>→</span>
          <span className="rounded-md bg-dharma-bg px-2 py-0.5">6. Reflect (अनुभव)</span>
          <span>→</span>
          <span className="rounded-md bg-dharma-bg px-2 py-0.5">7. Next Question (अगली जिज्ञासा)</span>
        </div>
      </header>

      {/* Primary Audience Perspective Switcher */}
      <section aria-label="Perspective selector" className="mb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-dharma-muted">
          दृष्टिकोण चुनें · Select Perspective:
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(Object.keys(AUDIENCE_CONFIG) as InquiryAudience[]).map((audKey) => {
            const config = AUDIENCE_CONFIG[audKey];
            const isSelected = selectedAudience === audKey;
            return (
              <button
                key={audKey}
                type="button"
                onClick={() => handleAudienceChange(audKey)}
                aria-pressed={isSelected}
                className={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all ${
                  isSelected
                    ? 'border-saffron-500 bg-saffron-50/70 dark:bg-saffron-950/30 ring-2 ring-saffron-400/40 shadow-xs'
                    : 'border-dharma-border bg-dharma-card hover:border-saffron-300 hover:bg-dharma-bg'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl" aria-hidden="true">
                    {config.emoji}
                  </span>
                  <span className="text-sm font-bold text-dharma-text">{config.labelHi}</span>
                </div>
                <span className="mt-1 text-xs font-medium text-dharma-muted">{config.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Audience Context Banner */}
        <div className="mt-3 rounded-2xl border border-dharma-border/80 bg-dharma-card/60 px-4 py-2.5 text-xs text-dharma-muted flex items-center justify-between">
          <div>
            <span className="font-semibold text-dharma-text">{audienceInfo.taglineHi}</span>
            <span className="hidden sm:inline"> — {audienceInfo.descriptionHi}</span>
          </div>
          <span className="shrink-0 font-mono text-[11px] font-bold text-saffron-700 dark:text-saffron-400">
            {filteredInquiries.length} {filteredInquiries.length === 1 ? 'Inquiry' : 'Inquiries'}
          </span>
        </div>
      </section>

      {/* Category Pills & Search Row */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5" role="toolbar" aria-label="Category filters">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              selectedCategory === 'all'
                ? 'bg-saffron-600 text-white shadow-xs'
                : 'border border-dharma-border bg-dharma-card text-dharma-muted hover:border-saffron-300 hover:text-dharma-text'
            }`}
          >
            सभी विषय (All)
          </button>
          {INQUIRY_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id];
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-saffron-600 text-white shadow-xs'
                    : 'border border-dharma-border bg-dharma-card text-dharma-muted hover:border-saffron-300 hover:text-dharma-text'
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{cat.labelHi}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Search */}
        <div className="relative min-w-[200px] max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dharma-muted" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="खोजें (Search inquiries)..."
            className="w-full rounded-full border border-dharma-border bg-dharma-card pl-8 pr-3 py-1.5 text-xs text-dharma-text placeholder:text-dharma-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
          />
        </div>
      </div>

      {/* Inquiry Accordion / Stepper Stream */}
      <div className="space-y-6">
        {filteredInquiries.length === 0 ? (
          <div className="rounded-3xl border border-dharma-border bg-dharma-card p-10 text-center">
            <HelpCircle className="mx-auto h-8 w-8 text-dharma-muted" />
            <h3 className="mt-3 font-serif text-lg font-bold text-dharma-text">
              कोई प्रश्न नहीं मिला · No inquiries found
            </h3>
            <p className="mt-1 text-xs text-dharma-muted">
              अन्य श्रेणी चुनें या खोज शब्द बदलें।
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 rounded-full bg-saffron-600 px-4 py-1.5 text-xs font-semibold text-white"
            >
              सभी प्रश्न देखें
            </button>
          </div>
        ) : (
          filteredInquiries.map((item, index) => {
            const isExpanded = expandedInquiryId === item.id;
            const CategoryIcon = CATEGORY_ICONS[item.category] || HelpCircle;
            const hasParentGuide = Boolean(item.parentGuideHi || item.parentGuideEn);
            const isGuideOpen = showParentGuide[item.id] ?? false;

            return (
              <article
                key={item.id}
                id={`inquiry-${item.id}`}
                className={`overflow-hidden rounded-3xl border transition-all duration-200 ${
                  isExpanded
                    ? 'border-saffron-400/80 bg-dharma-card shadow-md ring-1 ring-saffron-400/20'
                    : 'border-dharma-border bg-dharma-card/80 hover:border-saffron-300'
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  type="button"
                  onClick={() => {
                    setExpandedInquiryId(isExpanded ? null : item.id);
                    triggerTactileFeedback('selection', 'softTap');
                  }}
                  aria-expanded={isExpanded}
                  className="flex w-full items-start justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer"
                >
                  <div className="space-y-2">
                    {/* Badge line */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-dharma-border bg-dharma-bg px-2.5 py-0.5 text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                        <CategoryIcon className="h-3 w-3 text-saffron-600 dark:text-saffron-400" />
                        <span>{item.categoryLabelHi}</span>
                        <span className="text-stone-600 dark:text-stone-400">({item.categoryLabelEn})</span>
                      </span>

                      <span className="text-[11px] font-bold text-saffron-800 dark:text-saffron-300">
                        {item.scriptureAnchor.scriptureTitleHi} {item.scriptureAnchor.chapter}.{item.scriptureAnchor.verse}
                      </span>
                    </div>

                    {/* Question Heading */}
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-dharma-text leading-snug">
                      {item.questionHi}
                    </h2>
                    <p className="text-xs sm:text-sm text-dharma-muted font-normal">
                      {item.questionEn}
                    </p>
                  </div>

                  <div className="shrink-0 pt-1">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-dharma-border bg-dharma-bg text-dharma-muted transition">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                </button>

                {/* Expanded 7-Step Cycle Content */}
                {isExpanded && (
                  <div className="border-t border-dharma-border/60 bg-dharma-card px-5 pb-6 pt-4 sm:px-8 sm:pb-8 space-y-6">
                    {/* Step 1: Wonder (Notice something interesting...) */}
                    <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 dark:border-amber-900/40 dark:bg-amber-950/20 p-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1">
                        <Lightbulb className="h-3.5 w-3.5" />
                        <span>चरण १: कौतूहल · Step 1: Notice Something Interesting</span>
                      </div>
                      <p className="font-devanagari text-sm leading-relaxed text-stone-800 dark:text-stone-200">
                        {item.wonderPromptHi}
                      </p>
                      <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">
                        {item.wonderPromptEn}
                      </p>
                    </div>

                    {/* Step 3: Canonical Scripture Anchor */}
                    <div className="rounded-2xl border border-saffron-300/80 bg-saffron-50/50 dark:border-saffron-900/50 dark:bg-saffron-950/30 p-5 space-y-3">
                      <div className="flex items-center justify-between gap-2 border-b border-saffron-200/80 dark:border-saffron-900/40 pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-300 flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>चरण ३: मूल शास्त्र दर्शन · Canonical Scripture</span>
                        </span>
                        <span className="font-mono text-xs font-bold text-saffron-900 dark:text-saffron-200">
                          {item.scriptureAnchor.scriptureTitle} {item.scriptureAnchor.chapter}.{item.scriptureAnchor.verse}
                        </span>
                      </div>

                      {/* Sanskrit Mulapatha */}
                      <p
                        lang="sa"
                        className="font-devanagari whitespace-pre-line text-lg sm:text-xl font-bold leading-relaxed text-stone-900 dark:text-amber-100"
                      >
                        {item.scriptureAnchor.sanskrit}
                      </p>

                      {/* IAST Transliteration */}
                      <p className="font-serif text-xs italic text-stone-600 dark:text-stone-400 leading-relaxed">
                        {item.scriptureAnchor.transliteration}
                      </p>

                      {/* Direct Meanings */}
                      <div className="border-t border-saffron-200/60 dark:border-saffron-900/40 pt-2 space-y-1">
                        <p className="font-devanagari text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                          <strong className="text-saffron-800 dark:text-saffron-300">सीधा अर्थ: </strong>
                          {item.scriptureAnchor.arthaHi}
                        </p>
                        <p className="text-xs text-stone-600 dark:text-stone-400">
                          <strong>Direct Meaning: </strong>
                          {item.scriptureAnchor.arthaEn}
                        </p>
                      </div>

                      <div className="pt-1">
                        <Link
                          href={item.scriptureAnchor.href}
                          className="inline-flex items-center gap-1 text-xs font-bold text-saffron-800 dark:text-saffron-300 hover:underline"
                        >
                          <span>श्लोक का पूर्ण संदर्भ देखें (Read Verse in Reader)</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>

                    {/* Step 4: Simple Answer (Clear, warm, respectful) */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
                        चरण ४: सहज उत्तर · Step 4: Simple, Dignified Answer
                      </div>
                      <p className="font-devanagari text-base leading-relaxed text-dharma-text font-normal">
                        {item.simpleAnswerHi}
                      </p>
                      <p className="text-xs sm:text-sm text-dharma-muted leading-relaxed">
                        {item.simpleAnswerEn}
                      </p>
                    </div>

                    {/* Step 5: Guidance for Parents & Teachers (Collapsible) */}
                    {hasParentGuide && (
                      <div className="rounded-2xl border border-dharma-border bg-dharma-panel-muted/60 p-4">
                        <button
                          type="button"
                          onClick={() =>
                            setShowParentGuide((prev) => ({
                              ...prev,
                              [item.id]: !prev[item.id],
                            }))
                          }
                          aria-expanded={isGuideOpen}
                          className="flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-dharma-text hover:text-saffron-700 cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <HeartHandshake className="h-4 w-4 text-saffron-600 dark:text-saffron-400" />
                            <span>अभिभावक व शिक्षक के लिए सुझाव · Parent & Teacher Guide</span>
                          </span>
                          <span className="text-xs text-saffron-700 dark:text-saffron-400">
                            {isGuideOpen ? 'छिपाएं (Hide)' : 'देखें (Expand)'}
                          </span>
                        </button>

                        {isGuideOpen && (
                          <div className="mt-3 space-y-2 border-t border-dharma-border/60 pt-3 text-xs leading-relaxed text-dharma-muted">
                            <p className="font-devanagari text-stone-700 dark:text-stone-300">
                              {item.parentGuideHi}
                            </p>
                            <p>{item.parentGuideEn}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 6: Think Independently & Reflect */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* Step 6a: Thinking Prompt */}
                      <div className="rounded-2xl border border-dharma-border bg-dharma-card p-4 space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                          चरण ५: स्वयं चिंतन · Think For Yourself
                        </span>
                        <p className="font-devanagari text-xs sm:text-sm text-dharma-text leading-relaxed">
                          {item.thinkingPromptHi}
                        </p>
                        <p className="text-xs text-dharma-muted">
                          {item.thinkingPromptEn}
                        </p>
                      </div>

                      {/* Step 6b: Contemplative Exercise */}
                      <div className="rounded-2xl border border-dharma-border bg-dharma-card p-4 space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                          चरण ६: अनुभव से जोड़ें · Practical Reflection
                        </span>
                        <p className="font-devanagari text-xs sm:text-sm text-dharma-text leading-relaxed">
                          {item.reflectionExerciseHi}
                        </p>
                        <p className="text-xs text-dharma-muted">
                          {item.reflectionExerciseEn}
                        </p>
                      </div>
                    </div>

                    {/* Step 7: The Next Deeper Question & Related Passages */}
                    <div className="rounded-2xl border border-dharma-border bg-dharma-bg p-4 space-y-3">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-dharma-muted">
                          चरण ७: अगली जिज्ञासा · The Next Question
                        </span>
                        <p className="mt-1 font-devanagari text-sm font-semibold text-dharma-text">
                          {item.nextDeeperQuestionHi}
                        </p>
                        <p className="text-xs text-dharma-muted">
                          {item.nextDeeperQuestionEn}
                        </p>
                      </div>

                      {item.relatedPassages.length > 0 && (
                        <div className="border-t border-dharma-border/60 pt-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-dharma-muted block mb-1.5">
                            संबंधित शास्त्र संदर्भ · Explore Related Passages:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {item.relatedPassages.map((rel) => (
                              <Link
                                key={rel.href}
                                href={rel.href}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-dharma-border bg-dharma-card px-3 py-1.5 text-xs font-semibold text-dharma-text transition hover:border-saffron-400 hover:text-saffron-700"
                              >
                                <span>{rel.labelHi}</span>
                                <ArrowRight className="h-3 w-3 text-dharma-muted" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Epistemic Transparency Footnote & Share Button */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-dharma-border/40 text-[11px] text-dharma-muted">
                      <span>
                        स्रोत: {item.epistemicNote.canonicalSource} · मूल पाठ अक्षुण्ण सुरक्षित
                      </span>

                      <button
                        type="button"
                        onClick={() => handleCopyShare(item)}
                        className="inline-flex items-center gap-1 rounded-full border border-dharma-border px-2.5 py-1 text-xs font-semibold hover:bg-dharma-bg transition"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span className="text-emerald-600">कॉपी हो गया!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="h-3 w-3" />
                            <span>साझा करें (Share)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Footer Discovery Doorways */}
      <footer className="mt-12 rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 text-center space-y-4">
        <h3 className="font-serif text-xl font-bold text-dharma-text">
          स्वाध्याय जारी रखें · Continue Exploring
        </h3>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-dharma-muted">
          Every verse in Dharma Granth is accompanied by direct meaning, contextual exposition,
          and analytical perspectives. Begin a progressive reading journey or browse the library.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/journeys"
            className="rounded-full bg-saffron-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-saffron-700 transition"
          >
            स्वाध्याय यात्राएँ (Guided Journeys)
          </Link>
          <Link
            href="/scriptures"
            className="rounded-full border border-dharma-border bg-dharma-bg px-5 py-2 text-xs font-semibold text-dharma-text hover:border-saffron-300 transition"
          >
            सम्पूर्ण ग्रंथालय (All 65 Scriptures)
          </Link>
          <Link
            href="/ask"
            className="rounded-full border border-dharma-border bg-dharma-bg px-5 py-2 text-xs font-semibold text-dharma-text hover:border-saffron-300 transition"
          >
            शास्त्रीय मार्गदर्शन (Ask Scripture Guide)
          </Link>
        </div>
      </footer>
    </div>
  );
}
