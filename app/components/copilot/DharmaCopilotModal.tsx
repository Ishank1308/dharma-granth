'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  X,
  Compass,
  MessageCircle,
  Lightbulb,
  HeartHandshake,
  Bot,
  Copy,
  Check,
  Flame,
  Brain,
  Quote,
} from 'lucide-react';
import { triggerTactileFeedback } from '@/lib/haptics';
import { SEMANTIC_THEMES } from '@/lib/search-intent';

interface CuratedQnA {
  id: string;
  question: string;
  category: string;
  shlokaRef: string;
  sanskrit: string;
  hindi: string;
  english: string;
  genZSimplified: string;
  modernApplication: string;
  href: string;
}

const CURATED_KNOWLEDGE_BASE: CuratedQnA[] = [
  {
    id: 'anxiety',
    question: 'How do I handle acute anxiety, overthinking, and fear of the future?',
    category: 'Mental Peace & Calming',
    shlokaRef: 'Bhagavad Gita 2.56 & 6.35',
    sanskrit: 'दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः । वीतरागभयक्रोधः स्थितधीर्मुनिरुच्यते ॥',
    hindi: 'दुःखों की प्राप्ति होने पर जिसके मन में उद्वेग नहीं होता, सुखों की प्राप्ति में जो सर्वथा निस्पृह है तथा जिसके राग, भय और क्रोध नष्ट हो गये हैं, वह मुनि स्थिरबुद्धि कहा जाता है।',
    english: 'One whose mind is undisturbed amidst sorrow, indifferent in pleasure, and liberated from attachment, fear, and anger, is a person of settled contemplation.',
    genZSimplified: 'Stop letting the external chaos rent free space in your mind. Anxiety comes from attaching your worth to outcomes you can’t control. Anchor yourself in the present action.',
    modernApplication: '1. Take 3 deep breaths and separate your effort from the outcome. 2. Write down what you control today vs what belongs to time/circumstance. 3. Practice detachment from results.',
    href: '/scripture/bhagavadgita/chapter/2/verse/56',
  },
  {
    id: 'leadership',
    question: 'What does scripture teach about genuine leadership and leading teams?',
    category: 'Leadership & Influence',
    shlokaRef: 'Bhagavad Gita 3.21',
    sanskrit: 'यद्यदाचरति श्रेष्ठस्तत्तदेवेतरो जनः । स यत्प्रमाणं कुरुते लोकस्तदनुवर्तते ॥',
    hindi: 'श्रेष्ठ पुरुष जो-जो आचरण करता है, अन्य पुरुष भी वैसा ही आचरण करते हैं। वह जो कुछ प्रमाण कर देता है, समस्त संसार उसी के अनुसार बरतने लगता है।',
    english: 'Whatever standard a great person sets by their own action, common people follow. Whatever standard they establish, the world pursues.',
    genZSimplified: 'Leadership isn’t about authority or status—it is 100% leading by example. If you want a disciplined, honest, empathetic team, embody it first yourself.',
    modernApplication: 'Never ask a subordinate to do something you wouldn’t do yourself. Your daily integrity, punctual habits, and calm tone under crisis set the culture.',
    href: '/scripture/bhagavadgita/chapter/3/verse/21',
  },
  {
    id: 'discipline',
    question: 'How do I build relentless daily discipline without burning out?',
    category: 'Self-Mastery & Habit',
    shlokaRef: 'Bhagavad Gita 6.17',
    sanskrit: 'युक्ताहारविहारस्य युक्तचेष्टस्य कर्मसु । युक्तस्वप्नावबोधस्य योगो भवति दुःखहा ॥',
    hindi: 'जिसका खान-पान और विहार नियमित है, कर्मों में जिसकी चेष्टा संतुलित है, तथा जिसका शयन और जागरण नियमित है, उसका योग सब दुःखों का नाश करने वाला होता है।',
    english: 'For one who is regulated in food and recreation, balanced in effort in all duties, and temperate in sleep and wakefulness, spiritual practice destroys all sorrow.',
    genZSimplified: 'Real discipline is not extreme hustle culture; it is sustainable moderation. Balanced sleep + balanced fuel + focused deep work = unstoppable consistency.',
    modernApplication: 'Set fixed sleep/wake cycles, take active pauses every 90 minutes of work, and avoid sensory overload (scrolling) before sleep.',
    href: '/scripture/bhagavadgita/chapter/6/verse/17',
  },
  {
    id: 'dharma',
    question: 'Where does Krishna define Dharma and how do I discover my Svadharma?',
    category: 'Dharma & Life Purpose',
    shlokaRef: 'Bhagavad Gita 4.7-8 & 18.66',
    sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत । अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥',
    hindi: 'हे भारत! जब-जब धर्म की हानि और अधर्म की वृद्धि होती है, तब-तब मैं अपने रूप को रचता हूँ अर्थात प्रकट करता हूँ।',
    english: 'Whenever and wherever there is a decline in Dharma (cosmic righteousness) and an uprising of Adharma, at that time I manifest Myself.',
    genZSimplified: 'Dharma is your true cosmic alignment—the unique duty that sustains your soul, your society, and the universe. Doing your own messy duty beats copying someone else’s perfect path.',
    modernApplication: 'Align your natural inclinations, your learned skills, and the genuine needs of the world. What you do with love and selfless service is your Svadharma.',
    href: '/scripture/bhagavadgita/chapter/4/verse/7',
  },
];

interface DharmaCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export function DharmaCopilotModal({ isOpen, onClose, initialQuery = '' }: DharmaCopilotModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeItem, setActiveItem] = useState<CuratedQnA | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialQuery) {
        setQuery(initialQuery);
        const match = CURATED_KNOWLEDGE_BASE.find(
          (k) =>
            k.id.includes(initialQuery.toLowerCase()) ||
            initialQuery.toLowerCase().includes(k.id) ||
            k.question.toLowerCase().includes(initialQuery.toLowerCase())
        );
        if (match) setActiveItem(match);
        else setActiveItem(CURATED_KNOWLEDGE_BASE[0]);
      } else if (!activeItem) {
        setActiveItem(CURATED_KNOWLEDGE_BASE[0]);
      }
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, initialQuery]);

  const handleSelectCurated = (item: CuratedQnA) => {
    triggerTactileFeedback('selection', 'softTap');
    setActiveItem(item);
    setQuery(item.question);
  };

  const handleCopy = () => {
    if (!activeItem) return;
    triggerTactileFeedback('light', 'click');
    const text = `« ${activeItem.sanskrit} »\n\n${activeItem.shlokaRef}\n\n${activeItem.english}\n\n⚡ Modern Insight: ${activeItem.genZSimplified}\n\nRead more at DharmaGranth.in`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-950/80 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative z-10 flex h-[90vh] max-h-[780px] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-amber-300/40 bg-stone-900/95 shadow-2xl backdrop-blur-2xl text-stone-100"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-stone-800 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 shadow-md">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-amber-100">Dharma Copilot · धर्म सारथी</h2>
                  <p className="text-xs text-stone-400">AI-Native Scripture Insights & Modern Applications</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-200 transition"
                aria-label="Close Dharma Copilot"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Input Bar (Perplexity style) */}
            <div className="border-b border-stone-800/80 bg-stone-950/40 px-6 py-3">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 h-4 w-4 text-amber-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a question about anxiety, leadership, discipline, karma, relationships..."
                  className="w-full rounded-2xl border border-stone-700/80 bg-stone-900/80 py-2.5 pl-10 pr-4 text-sm text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                />
              </div>

              {/* Quick Prompt Chips */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {CURATED_KNOWLEDGE_BASE.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectCurated(item)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      activeItem?.id === item.id
                        ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                        : 'border border-stone-700 bg-stone-800/70 text-stone-300 hover:border-amber-400/60 hover:text-white'
                    }`}
                  >
                    {item.category}
                  </button>
                ))}
              </div>
            </div>

            {/* Answer & Verse Showcase Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeItem ? (
                <div className="space-y-6">
                  {/* Question Banner */}
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                    <p className="text-2xs font-bold uppercase tracking-widest text-amber-400">Inquiry · प्रश्न</p>
                    <h3 className="mt-1 text-lg font-bold text-amber-100">{activeItem.question}</h3>
                  </div>

                  {/* Sacred Sanskrit Mula */}
                  <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-5">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Quote className="h-3.5 w-3.5" />
                        {activeItem.shlokaRef}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="flex items-center gap-1 text-xs text-stone-400 hover:text-amber-200 transition"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy Verse'}</span>
                      </button>
                    </div>

                    <p lang="sa" className="mt-3 font-devanagari text-xl font-bold text-amber-100 leading-relaxed">
                      {activeItem.sanskrit}
                    </p>

                    <p lang="hi" className="mt-2 text-sm text-stone-300 font-medium">
                      {activeItem.hindi}
                    </p>

                    <p className="mt-2 text-xs italic text-stone-400">
                      “{activeItem.english}”
                    </p>
                  </div>

                  {/* 2-Column Insight Grid: Gen-Z Simplified + Modern Life Application */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Gen-Z Simplified Meaning */}
                    <div className="rounded-2xl border border-amber-300/30 bg-stone-800/50 p-4">
                      <div className="flex items-center gap-1.5 text-amber-300 mb-1.5">
                        <Sparkles className="h-4 w-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Modern Simplified Breakdown</h4>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans">
                        {activeItem.genZSimplified}
                      </p>
                    </div>

                    {/* Actionable Protocol */}
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                      <div className="flex items-center gap-1.5 text-emerald-400 mb-1.5">
                        <Lightbulb className="h-4 w-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Daily Life Protocol</h4>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                        {activeItem.modernApplication}
                      </p>
                    </div>
                  </div>

                  {/* Deep Reader Navigation CTA */}
                  <div className="flex justify-end pt-2">
                    <Link
                      href={activeItem.href}
                      onClick={onClose}
                      className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-stone-950 shadow-md transition hover:bg-amber-300 active:scale-95"
                    >
                      <span>Study Full Chapter & Commentary</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-stone-400">
                  <Bot className="mx-auto h-12 w-12 text-stone-600 mb-3" />
                  <p className="text-sm">Type any inquiry or select a prompt above to receive verified scripture guidance.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
