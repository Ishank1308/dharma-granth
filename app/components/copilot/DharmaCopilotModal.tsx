'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  X,
  Compass,
  Lightbulb,
  Bot,
  Copy,
  Check,
  Flame,
  Quote,
  Volume2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { triggerTactileFeedback } from '@/lib/haptics';
import { answerQuestion, type CopilotAnswer } from '@/lib/copilot';

export interface CuratedQnA {
  id: string;
  question: string;
  questionHi: string;
  category: string;
  categoryHi: string;
  shlokaRef: string;
  sanskrit: string;
  hindi: string;
  english: string;
  genZSimplified: string;
  modernApplication: string;
  href: string;
}

export const CURATED_KNOWLEDGE_BASE: CuratedQnA[] = [
  {
    id: 'anxiety',
    question: 'How do I handle acute anxiety, overthinking, and fear of the future?',
    questionHi: 'अति-चिंतन, भविष्य का भय और मानसिक अशांति कैसे शांत करें?',
    category: 'Mental Peace & Calming',
    categoryHi: 'मानसिक शांति व चिंता',
    shlokaRef: 'Bhagavad Gita 2.56 & 6.35',
    sanskrit: 'दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः । वीतरागभयक्रोधः स्थितधीर्मुनिरुच्यते ॥',
    hindi: 'दुःखों की प्राप्ति होने पर जिसके मन में उद्वेग नहीं होता, सुखों की प्राप्ति में जो सर्वथा निस्पृह है तथा जिसके राग, भय और क्रोध नष्ट हो गये हैं, वह मुनि स्थिरबुद्धि कहा जाता है।',
    english: 'One whose mind is undisturbed amidst sorrow, indifferent in pleasure, and liberated from attachment, fear, and anger, is a person of settled contemplation.',
    genZSimplified: 'Stop letting external uncertainty rent free space in your mind. Anxiety comes from attaching your worth to outcomes you cannot control. Anchor yourself in the present effort.',
    modernApplication: '1. Take 3 deep diaphragmatic breaths and separate your effort from the outcome. 2. Write down what you control today vs what belongs to time/circumstance. 3. Practice detachment from results.',
    href: '/scripture/bhagavadgita/chapter/2/verse/56/',
  },
  {
    id: 'anger',
    question: 'How do I conquer sudden impulsive rage, resentment, and heated arguments?',
    questionHi: 'तीव्र क्रोध, आवेश और कटुता पर नियंत्रण कैसे पाएँ?',
    category: 'Emotional Mastery',
    categoryHi: 'क्रोध व संवेग नियंत्रण',
    shlokaRef: 'Bhagavad Gita 2.62-63',
    sanskrit: 'क्रोधाद्भवति संमोहः संमोहात्स्मृतिविभ्रमः । स्मृतिभ्रंशाद् बुद्धिनाशो बुद्धिनाशात्प्रणश्यति ॥',
    hindi: 'क्रोध से अत्यंत मूढ़भाव उत्पन्न होता है, मूढ़भाव से स्मृति भ्रमित होती है; स्मृति भ्रम से बुद्धि का नाश होता है और बुद्धि नष्ट होने से मनुष्य का पतन हो जाता है।',
    english: 'From anger arises utter delusion; from delusion comes loss of memory; from loss of memory is ruined the intellect; and by destruction of intellect, a person is utterly ruined.',
    genZSimplified: 'Anger is a temporary blinding fog. The second you act or speak in rage, your rational intellect is hijacked. The highest power move is taking a 90-second pause before replying.',
    modernApplication: '1. When provoked, institute an unconditional 90-second vow of silence. 2. Step outside or splash cold water on your face. 3. Address the problem rationally after the somatic surge passes.',
    href: '/scripture/bhagavadgita/chapter/2/verse/63/',
  },
  {
    id: 'burnout',
    question: 'How do I overcome career burnout, exhaustion, and chronic performance pressure?',
    questionHi: 'कर्म में थकान, कार्य-दबाव और परिणाम की चिंता से मुक्ति कैसे मिले?',
    category: 'Work & Nishkama Karma',
    categoryHi: 'कर्मयोग व कार्य-संतुलन',
    shlokaRef: 'Bhagavad Gita 2.47',
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
    hindi: 'तेरा कर्म करने में ही अधिकार है, उसके फलों में कभी नहीं। इसलिए तू कर्मों के फल का हेतु मत बन और तेरी कर्म न करने में भी प्रीति न हो।',
    english: 'You have a right to your prescribed duty alone, never to its fruits. Let not the fruits of action be your motive, nor let your attachment be to inaction.',
    genZSimplified: 'Burnout isn’t caused by hard work; it is caused by obsessive mental fixation on validation and rewards. Give 100% devotion to the craft today, and surrender the outcome to the universe.',
    modernApplication: '1. Treat work as an offering (Yajna) rather than an ego transaction. 2. Celebrate deep focus sessions instead of obsessing over immediate metrics. 3. Protect non-work rest windows ruthlessly.',
    href: '/scripture/bhagavadgita/chapter/2/verse/47/',
  },
  {
    id: 'leadership',
    question: 'What does scripture teach about genuine leadership and leading teams?',
    questionHi: 'सच्चे नेतृत्व, संगठन संचालन और आदर्श आचरण के नियम क्या हैं?',
    category: 'Leadership & Influence',
    categoryHi: 'नेतृत्व व आदर्श आचरण',
    shlokaRef: 'Bhagavad Gita 3.21',
    sanskrit: 'यद्यदाचरति श्रेष्ठस्तत्तदेवेतरो जनः । स यत्प्रमाणं कुरुते लोकस्तदनुवर्तते ॥',
    hindi: 'श्रेष्ठ पुरुष जो-जो आचरण करता है, अन्य पुरुष भी वैसा ही आचरण करते हैं। वह जो कुछ प्रमाण कर देता है, समस्त संसार उसी के अनुसार बरतने लगता है।',
    english: 'Whatever standard a great person sets by their own action, common people follow. Whatever standard they establish, the world pursues.',
    genZSimplified: 'Leadership isn’t about titles or corporate dominance—it is 100% leading by personal example. If you want a disciplined, honest, empathetic team, embody it first yourself.',
    modernApplication: 'Never ask a colleague to do something you wouldn’t do yourself. Your daily punctuality, calm tone under crisis, and selfless credit-sharing set the culture.',
    href: '/scripture/bhagavadgita/chapter/3/verse/21/',
  },
  {
    id: 'discipline',
    question: 'How do I build relentless daily discipline without burning out or quitting?',
    questionHi: 'बिना थके सतत दैनिक अनुशासन और नियमबद्ध जीवन कैसे बनाएँ?',
    category: 'Self-Mastery & Habit',
    categoryHi: 'अनुशासन व जीवन-संतुलन',
    shlokaRef: 'Bhagavad Gita 6.17',
    sanskrit: 'युक्ताहारविहारस्य युक्तचेष्टस्य कर्मसु । युक्तस्वप्नावबोधस्य योगो भवति दुःखहा ॥',
    hindi: 'जिसका खान-पान और विहार नियमित है, कर्मों में जिसकी चेष्टा संतुलित है, तथा जिसका शयन और जागरण नियमित है, उसका योग सब दुःखों का नाश करने वाला होता है।',
    english: 'For one who is regulated in food and recreation, balanced in effort in all duties, and temperate in sleep and wakefulness, spiritual practice destroys all sorrow.',
    genZSimplified: 'Real discipline is not extreme hustle culture; it is sustainable moderation. Balanced sleep + wholesome food + focused deep work = unstoppable lifelong consistency.',
    modernApplication: 'Set fixed sleep/wake cycles, take active pauses every 90 minutes of work, and avoid sensory overload (scrolling) 60 minutes before bedtime.',
    href: '/scripture/bhagavadgita/chapter/6/verse/17/',
  },
  {
    id: 'focus',
    question: 'How do I tame digital distraction and train single-pointed mental concentration?',
    questionHi: 'मन की चंचलता, भटकाव और डिजिटल व्याकुलता को एकाग्र कैसे करें?',
    category: 'Mindfulness & Concentration',
    categoryHi: 'एकाग्रता व ध्यान',
    shlokaRef: 'Bhagavad Gita 6.26',
    sanskrit: 'यतो यतो निश्चरति मनश्चञ्चलमस्थिरम् । ततस्ततो नियम्यैतदात्मन्येव वशं नयेत् ॥',
    hindi: 'यह चंचल और स्थिर न रहने वाला मन जिस-जिस विषय की ओर भागे, वहाँ-वहाँ से इसे रोककर बार-बार आत्मा में ही स्थिर करे।',
    english: 'From whatever reason this restless and unsteady mind wanders away, from that one should restrain it and bring it back under the control of the Self alone.',
    genZSimplified: 'Notice when your mind wanders without judging yourself. The repetition of noticing and gently bringing it back is the exact mental bicep curl that builds supreme focus.',
    modernApplication: '1. When reading or working, keep notifications muted. 2. Whenever your attention drifts to a tab or phone, gently bring it back without frustration. Repeat daily.',
    href: '/scripture/bhagavadgita/chapter/6/verse/26/',
  },
  {
    id: 'dharma',
    question: 'Where does Krishna define Dharma and how do I discover my Svadharma?',
    questionHi: 'धर्म का वास्तविक अर्थ क्या है और अपना स्वधर्म कैसे पहचानें?',
    category: 'Dharma & Life Calling',
    categoryHi: 'स्वधर्म व जीवन-लक्ष्य',
    shlokaRef: 'Bhagavad Gita 3.35 & 18.47',
    sanskrit: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात् । स्वधर्मे निधनं श्रेयः परधर्मो भयावहः ॥',
    hindi: 'अच्छी प्रकार आचरण किए हुए दूसरे के धर्म से गुणरहित भी अपना धर्म श्रेष्ठ है। अपने धर्म में तो मरना भी कल्याणकारक है और दूसरे का धर्म भय को देने वाला है।',
    english: 'Better is one’s own duty, though devoid of merit, than the duty of another well performed. Death in the discharge of one’s own duty is better; the duty of another brings fear.',
    genZSimplified: 'Stop copying someone else’s highlight reel. Your Svadharma is your unique authentic path where your natural inclinations, developed skills, and selfless duty converge.',
    modernApplication: 'Ask yourself: What difficult responsibility feels deeply meaningful to me? Lean into your authentic strengths and serve the world through that lens.',
    href: '/scripture/bhagavadgita/chapter/3/verse/35/',
  },
  {
    id: 'grief',
    question: 'How do I cope with deep grief, loss of a loved one, or sudden heartbreak?',
    questionHi: 'शोक, प्रियजन के वियोग और अपार दुख में हृदय को धैर्य कैसे मिले?',
    category: 'Grief & Healing',
    categoryHi: 'शोक व सांत्वना',
    shlokaRef: 'Bhagavad Gita 2.20 & 2.11',
    sanskrit: 'न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः । अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे ॥',
    hindi: 'यह आत्मा किसी काल में न तो जन्मता है और न मरता ही है; और न यह उत्पन्न होकर फिर होने वाला ही है; क्योंकि यह अजन्मा, नित्य, शाश्वत और पुरातन है, शरीर के मारे जाने पर भी नहीं मारा जाता।',
    english: 'The soul is never born, nor does it die at any time; nor having once been, does it ever cease to be. Unborn, eternal, ever-existing, and primeval, it is not slain when the body is slain.',
    genZSimplified: 'The body changes garments, but the conscious soul is eternal. Allow yourself to feel grief with deep reverence, while remembering that love and the divine spirit transcend physical form.',
    modernApplication: 'Honor the memory of departed souls through selfless acts of charity, reciting sacred verses, and caring for others with the love they gave you.',
    href: '/scripture/bhagavadgita/chapter/2/verse/20/',
  },
  {
    id: 'ego',
    question: 'How do I overcome pride, ego traps, and the fear of social judgment?',
    questionHi: 'अहंकार, लोकापवाद का भय और झूठी प्रतिष्ठा से मुक्ति कैसे पाएँ?',
    category: 'Humility & Freedom',
    categoryHi: 'अहंकार-मुक्ति व विनम्रता',
    shlokaRef: 'Bhagavad Gita 3.27 & 13.7',
    sanskrit: 'प्रकृतेः क्रियमाणानि गुणैः कर्माणि सर्वशः । अहंकारविमूढात्मा कर्ताहमिति मन्यते ॥',
    hindi: 'सम्पूर्ण कर्म सब प्रकार से प्रकृति के गुणों द्वारा ही किए जाते हैं, तो भी जिसका अंतःकरण अहंकार से मोहित हो रहा है, ऐसा अज्ञानी मनुष्य "मैं कर्ता हूँ"—ऐसा मान लेता है।',
    english: 'All actions are in all respects performed by the Gunas (modes) of nature. He whose mind is deluded by ego thinks: "I am the doer."',
    genZSimplified: 'Ego tells you that you are the sole center of the universe. Humility frees you: you are simply a conscious instrument in a magnificent cosmic tapestry.',
    modernApplication: 'Whenever you achieve something great, say inwardly: "Krishnarpanam" (Dedicated to the Divine). Whenever criticized, examine the feedback calmly without defensive fragility.',
    href: '/scripture/bhagavadgita/chapter/3/verse/27/',
  },
];

interface DharmaCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export function DharmaCopilotModal({ isOpen, onClose, initialQuery = '' }: DharmaCopilotModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCuratedId, setSelectedCuratedId] = useState<string>(CURATED_KNOWLEDGE_BASE[0].id);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize or reset when modal opens
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
        if (match) setSelectedCuratedId(match.id);
      }
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, initialQuery]);

  // Derive dynamic copilot answer if query doesn't match an exact curated category
  const dynamicAnswer: CopilotAnswer | null = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return null;
    return answerQuestion(trimmed);
  }, [query]);

  // Check if active search matches a curated item
  const activeCurated: CuratedQnA | undefined = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed) {
      const direct = CURATED_KNOWLEDGE_BASE.find(
        (c) =>
          c.id === trimmed ||
          c.question.toLowerCase().includes(trimmed) ||
          c.questionHi.includes(trimmed) ||
          c.category.toLowerCase().includes(trimmed) ||
          c.categoryHi.includes(trimmed)
      );
      if (direct) return direct;
    }
    return CURATED_KNOWLEDGE_BASE.find((c) => c.id === selectedCuratedId) || CURATED_KNOWLEDGE_BASE[0];
  }, [query, selectedCuratedId]);

  const handleSelectCurated = useCallback((item: CuratedQnA) => {
    triggerTactileFeedback('selection', 'softTap');
    setSelectedCuratedId(item.id);
    setQuery(item.question);
  }, []);

  const handleCopy = useCallback((textToCopy: string) => {
    triggerTactileFeedback('light', 'click');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const speakSanskrit = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    triggerTactileFeedback('selection', 'softTap');
    window.speechSynthesis.cancel();

    if (speaking) {
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.85;
    utterance.pitch = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const sanskritVoice =
      voices.find((v) => v.lang.includes('hi') || v.lang.includes('sa')) ||
      voices.find((v) => v.lang.includes('IN'));
    if (sanskritVoice) utterance.voice = sanskritVoice;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [speaking]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-950/85 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative z-10 flex h-[92vh] max-h-[820px] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-amber-300/40 bg-stone-900/95 shadow-2xl backdrop-blur-2xl text-stone-100"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-stone-800 px-5 sm:px-7 py-3.5 sm:py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 shadow-md">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2">
                    Dharma Copilot
                    <span className="text-xs font-normal text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      धर्म सारथी
                    </span>
                  </h2>
                  <p className="text-2xs sm:text-xs text-stone-400">
                    Offline AI-Guided Scripture Wisdom & Modern Life Protocols
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-stone-400 hover:bg-stone-800 hover:text-stone-200 transition"
                aria-label="Close Dharma Copilot"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Smart Search Input Bar */}
            <div className="border-b border-stone-800/80 bg-stone-950/40 px-5 sm:px-7 py-3">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 h-4 w-4 text-amber-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about anxiety, anger, burnout, focus, karma, grief, leadership, purpose..."
                  className="w-full rounded-2xl border border-stone-700/80 bg-stone-900/90 py-2.5 pl-10 pr-10 text-sm text-stone-100 placeholder:text-stone-500 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-3 text-stone-400 hover:text-stone-200"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Quick Topic Chips */}
              <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                <span className="text-2xs text-stone-400 shrink-0 font-medium mr-1">Top Dilemmas:</span>
                {CURATED_KNOWLEDGE_BASE.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectCurated(item)}
                    className={`rounded-full px-3 py-1 text-2xs font-medium whitespace-nowrap transition shrink-0 ${
                      activeCurated?.id === item.id
                        ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                        : 'border border-stone-700/80 bg-stone-800/60 text-stone-300 hover:border-amber-400/60 hover:text-white'
                    }`}
                  >
                    {item.categoryHi} · {item.category}
                  </button>
                ))}
              </div>
            </div>

            {/* Answer Body Showcase */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 space-y-6">
              {/* Dynamic Semantic Copilot Match (if searching custom question) */}
              {dynamicAnswer && dynamicAnswer.kind !== 'empty' && dynamicAnswer.verses.length > 0 ? (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* Topic Header Banner */}
                  <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xs font-bold uppercase tracking-widest text-amber-400">
                        Scripture Guidance · मार्गदर्शन
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> Canonical Match
                      </span>
                    </div>
                    <h3 className="mt-1 text-lg font-bold text-amber-100">
                      {dynamicAnswer.titleHi} <span className="opacity-80 font-normal">· {dynamicAnswer.titleEn}</span>
                    </h3>
                    <p className="mt-1 text-xs text-stone-300 leading-relaxed">
                      {dynamicAnswer.simpleHi || dynamicAnswer.simpleEn}
                    </p>
                  </div>

                  {/* Primary Scripture Verses */}
                  <div className="space-y-4">
                    {dynamicAnswer.verses.slice(0, 2).map((verse, idx) => (
                      <div key={idx} className="rounded-2xl border border-stone-800 bg-stone-950/60 p-5">
                        <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                            <Quote className="h-3.5 w-3.5" />
                            {verse.refHi || verse.refEn}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => speakSanskrit(verse.sanskrit)}
                              className="flex items-center gap-1 text-xs text-stone-400 hover:text-amber-300 transition"
                              title="श्लोक का उच्चारण सुनें"
                            >
                              <Volume2 className="h-3.5 w-3.5" />
                              <span className="text-2xs">उच्चारण</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(
                                  `« ${verse.sanskrit} »\n\n${verse.refHi}\n\n${verse.hindi}\n\n${verse.english}\n\nRead more at DharmaGranth.in`
                                )
                              }
                              className="flex items-center gap-1 text-xs text-stone-400 hover:text-amber-200 transition"
                            >
                              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                              <span className="text-2xs">{copied ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>

                        <p lang="sa" className="mt-3 font-devanagari text-lg sm:text-xl font-bold text-amber-100 leading-relaxed">
                          {verse.sanskrit}
                        </p>

                        {verse.hindi && (
                          <p lang="hi" className="mt-2 text-xs sm:text-sm text-stone-300 font-medium">
                            {verse.hindi}
                          </p>
                        )}

                        {verse.english && (
                          <p className="mt-1.5 text-xs italic text-stone-400">
                            “{verse.english}”
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 2-Column Insight Grid: Canonical Insight + Daily Life Protocol */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-amber-300/30 bg-stone-800/50 p-4">
                      <div className="flex items-center gap-1.5 text-amber-300 mb-1.5">
                        <Sparkles className="h-4 w-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Compassionate Insight</h4>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans">
                        {dynamicAnswer.applicationHi || dynamicAnswer.applicationEn}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                      <div className="flex items-center gap-1.5 text-emerald-400 mb-1.5">
                        <Lightbulb className="h-4 w-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Daily Action Protocol</h4>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                        {dynamicAnswer.dailyHi || dynamicAnswer.dailyEn}
                      </p>
                    </div>
                  </div>

                  {/* Navigation CTA */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-wrap gap-2 text-2xs text-stone-400">
                      {dynamicAnswer.related.slice(0, 2).map((rel, rIdx) => (
                        <Link
                          key={rIdx}
                          href={rel.href}
                          onClick={onClose}
                          className="hover:text-amber-300 underline underline-offset-2 flex items-center gap-1"
                        >
                          {rel.labelHi || rel.labelEn}
                          <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={dynamicAnswer.pageHref}
                      onClick={onClose}
                      className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-stone-950 shadow-md transition hover:bg-amber-300 active:scale-95"
                    >
                      <span>Study Full Wisdom Dimension</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : activeCurated ? (
                /* Curated High-Impact Dilemma Showcase */
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* Inquiry Question Banner */}
                  <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-2xs font-bold uppercase tracking-widest text-amber-400">
                        Inquiry · {activeCurated.categoryHi}
                      </p>
                      <span className="text-2xs text-amber-300/80 font-mono">
                        {activeCurated.shlokaRef}
                      </span>
                    </div>
                    <h3 className="mt-1 text-base sm:text-lg font-bold text-amber-100">
                      {activeCurated.question}
                    </h3>
                    <p lang="hi" className="mt-0.5 text-xs text-amber-200/80">
                      {activeCurated.questionHi}
                    </p>
                  </div>

                  {/* Sacred Sanskrit Mula */}
                  <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-5">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Quote className="h-3.5 w-3.5" />
                        {activeCurated.shlokaRef}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => speakSanskrit(activeCurated.sanskrit)}
                          className="flex items-center gap-1 text-xs text-stone-400 hover:text-amber-300 transition"
                          title="श्लोक का उच्चारण सुनें"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                          <span className="text-2xs">उच्चारण</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              `« ${activeCurated.sanskrit} »\n\n${activeCurated.shlokaRef}\n\n${activeCurated.hindi}\n\n${activeCurated.english}\n\n⚡ Modern Insight: ${activeCurated.genZSimplified}\n\nRead more at DharmaGranth.in`
                            )
                          }
                          className="flex items-center gap-1 text-xs text-stone-400 hover:text-amber-200 transition"
                        >
                          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          <span className="text-2xs">{copied ? 'Copied' : 'Copy Verse'}</span>
                        </button>
                      </div>
                    </div>

                    <p lang="sa" className="mt-3 font-devanagari text-lg sm:text-xl font-bold text-amber-100 leading-relaxed">
                      {activeCurated.sanskrit}
                    </p>

                    <p lang="hi" className="mt-2 text-xs sm:text-sm text-stone-300 font-medium">
                      {activeCurated.hindi}
                    </p>

                    <p className="mt-2 text-xs italic text-stone-400">
                      “{activeCurated.english}”
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
                        {activeCurated.genZSimplified}
                      </p>
                    </div>

                    {/* Actionable Protocol */}
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                      <div className="flex items-center gap-1.5 text-emerald-400 mb-1.5">
                        <Lightbulb className="h-4 w-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Daily Life Action Protocol</h4>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                        {activeCurated.modernApplication}
                      </p>
                    </div>
                  </div>

                  {/* Deep Reader Navigation CTA */}
                  <div className="flex justify-end pt-2">
                    <Link
                      href={activeCurated.href}
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
                  <p className="text-sm">
                    Type any inquiry or select a prompt above to receive verified scripture guidance.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
