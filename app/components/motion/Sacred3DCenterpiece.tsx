'use client';

import { useRef, useState, type PointerEvent } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from 'framer-motion';
import {
  Sparkles,
  Flame,
  BookOpen,
  ArrowRight,
  Scroll,
  Layers,
  CircleDot,
  Eye,
  BookMarked,
} from 'lucide-react';
import { triggerTactileFeedback } from '@/lib/haptics';

export type PresentationMode = 'granth' | 'talapatra' | 'mandala';

interface FeaturedBook {
  id: string;
  titleSa: string;
  titleEn: string;
  subTitle: string;
  verseCount: string;
  href: string;
  accentGradient: string;
  badge: string;
  iconicShlokaSa: string;
  iconicShlokaEn: string;
  iconicShlokaHi: string;
  citation: string;
}

const FEATURED_BOOKS: FeaturedBook[] = [
  {
    id: 'gita',
    titleSa: 'श्रीमद्भगवद्गीता',
    titleEn: 'Bhagavad Gita',
    subTitle: 'The Song of Divine Wisdom',
    verseCount: '18 Chapters · 700 Verses',
    href: '/scripture/bhagavadgita',
    accentGradient: 'from-amber-600 via-saffron-600 to-amber-700',
    badge: 'स्मृति प्रस्थान',
    iconicShlokaSa: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
    iconicShlokaEn: 'You have a right only to action, never to its fruits. Let not the fruit of action be your motive, nor let your attachment be to inaction.',
    iconicShlokaHi: 'कर्म करने में ही आपका अधिकार है, उसके फलों में कभी नहीं। कर्मफल के हेतु मत बनिए और न ही अकर्मण्यता में आसक्त होइए।',
    citation: 'अध्याय 2, श्लोक 47 · Chapter 2, Verse 47',
  },
  {
    id: 'ashtavakra',
    titleSa: 'अष्टावक्र गीता',
    titleEn: 'Ashtavakra Gita',
    subTitle: 'The Dialogue of Pure Consciousness',
    verseCount: '20 Chapters · 298 Verses',
    href: '/ashtavakra',
    accentGradient: 'from-amber-700 via-orange-600 to-yellow-700',
    badge: 'अद्वैत वेदान्त',
    iconicShlokaSa: 'यदा नाहं तदा मोक्षो यदाहं बन्धनं तदा ।\nमत्वेति सर्वभावेन किञ्चिन्मा गृहाण मा मुञ्च ॥',
    iconicShlokaEn: 'When there is no "I", there is liberation; when there is "I", there is bondage. Realizing this completely, neither cling to anything nor reject anything.',
    iconicShlokaHi: 'जब तक ‘अहं’ है तब तक बंधन है, जब ‘अहं’ नहीं रहता तब मुक्ति है। ऐसा जानकर किसी भी भाव को न पकड़िए, न त्यागिए।',
    citation: 'प्रकरण 8, श्लोक 4 · Chapter 8, Verse 4',
  },
  {
    id: 'ishavasya',
    titleSa: 'ईशावास्योपनिषद्',
    titleEn: 'Ishavasya Upanishad',
    subTitle: 'All This is Pervaded by the Divine',
    verseCount: '1 Chapter · 18 Verses',
    href: '/scripture/ishavasya',
    accentGradient: 'from-orange-700 via-amber-600 to-stone-900',
    badge: 'शुक्ल यजुर्वेद',
    iconicShlokaSa: 'ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् ।\nतेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ॥',
    iconicShlokaEn: 'All this, whatever moves in this changing universe, is enveloped by the Divine. Protect yourself through selfless detachment; do not covet anyone’s wealth.',
    iconicShlokaHi: 'इस सम्पूर्ण चराचर ब्रह्माण्ड में जो कुछ भी है, वह सब ईश्वर से व्याप्त है। त्यागपूर्वक उसका अनुभव करें, किसी के धन का लोभ न करें।',
    citation: 'मन्त्र 1 · Verse 1',
  },
  {
    id: 'katha',
    titleSa: 'कठोपनिषद्',
    titleEn: 'Katha Upanishad',
    subTitle: 'The Mystery of Death & Immortality',
    verseCount: '2 Chapters · 119 Verses',
    href: '/scripture/katha',
    accentGradient: 'from-amber-800 via-red-800 to-stone-950',
    badge: 'कृष्ण यजुर्वेद',
    iconicShlokaSa: 'उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत ।\nक्षुरस्य धारा निशिता दुरत्यया दुर्गं पथस्तत्कवयो वदन्ति ॥',
    iconicShlokaEn: 'Arise, awake, and learn having approached the exalted teachers. Like the sharp edge of a razor, difficult to tread, is that path, say the wise.',
    iconicShlokaHi: 'उठिए, जागिए और श्रेष्ठ तत्वदर्शी ज्ञानियों के समीप जाकर आत्मज्ञान प्राप्त कीजिए। यह मार्ग छुरे की तीक्ष्ण धार के समान अति दुर्गम है।',
    citation: 'अध्याय 1, वल्ली 3, मन्त्र 14 · Chapter 1.3.14',
  },
];

export function Sacred3DCenterpiece() {
  const reduce = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const [mode, setMode] = useState<PresentationMode>('granth');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = FEATURED_BOOKS[activeIdx];

  // Normalized pointer coordinates (-0.5 to 0.5)
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);

  // Smooth organic physics
  const spring = { stiffness: 220, damping: 22, mass: 0.6 };
  const smoothX = useSpring(normX, spring);
  const smoothY = useSpring(normY, spring);

  // 3D rotations for the floating centerpiece
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-16, 16]);

  // Specular golden foil reflection
  const foilX = useTransform(smoothX, [-0.5, 0.5], ['-10%', '110%']);
  const foilY = useTransform(smoothY, [-0.5, 0.5], ['-10%', '110%']);
  const foilBackground = useTransform(
    [foilX, foilY],
    ([x, y]) =>
      `radial-gradient(circle 340px at ${x} ${y}, rgba(253, 224, 71, 0.42) 0%, rgba(245, 158, 11, 0.16) 35%, transparent 75%)`
  );

  // Dynamic shadow shifting
  const shadowX = useTransform(smoothX, [-0.5, 0.5], [18, -18]);
  const shadowY = useTransform(smoothY, [-0.5, 0.5], [26, 12]);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === 'touch') return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    normX.set((e.clientX - rect.left) / rect.width - 0.5);
    normY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    normX.set(0);
    normY.set(0);
  };

  const handleSelectBook = (idx: number) => {
    if (idx === activeIdx) return;
    setActiveIdx(idx);
    triggerTactileFeedback('selection', 'softTap');
  };

  const handleModeChange = (newMode: PresentationMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    triggerTactileFeedback('selection', 'softTap');
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    triggerTactileFeedback('medium', 'templeChime');
  };

  return (
    <div className="relative mx-auto mt-8 mb-6 flex flex-col items-center justify-center">
      {/* ── Sacred Mode Switcher (Granth Codex / Talapatra Folio / Sri Yantra) ── */}
      <div className="relative z-30 mb-5 inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-black/40 p-1 backdrop-blur-xl shadow-lg">
        <button
          type="button"
          onClick={() => handleModeChange('granth')}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
            mode === 'granth'
              ? 'bg-gradient-to-r from-amber-400 to-saffron-500 text-stone-950 shadow-md font-bold'
              : 'text-amber-200/80 hover:text-white hover:bg-white/10'
          }`}
          aria-label="3D Bound Granth View"
        >
          <BookMarked className="h-3.5 w-3.5" />
          <span>स्वर्ण ग्रन्थ</span>
          <span className="hidden sm:inline text-[10px] opacity-75">· Codex</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange('talapatra')}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
            mode === 'talapatra'
              ? 'bg-gradient-to-r from-amber-400 to-saffron-500 text-stone-950 shadow-md font-bold'
              : 'text-amber-200/80 hover:text-white hover:bg-white/10'
          }`}
          aria-label="Palm-leaf manuscript view"
        >
          <Scroll className="h-3.5 w-3.5" />
          <span>तालपत्र</span>
          <span className="hidden sm:inline text-[10px] opacity-75">· Palm Leaf</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange('mandala')}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
            mode === 'mandala'
              ? 'bg-gradient-to-r from-amber-400 to-saffron-500 text-stone-950 shadow-md font-bold'
              : 'text-amber-200/80 hover:text-white hover:bg-white/10'
          }`}
          aria-label="Sacred Yantra view"
        >
          <CircleDot className="h-3.5 w-3.5" />
          <span>श्रीयन्त्र</span>
          <span className="hidden sm:inline text-[10px] opacity-75">· Yantra</span>
        </button>
      </div>

      {/* ── 3D Interactive Spatial Display Stage ───────────────────────── */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative flex items-center justify-center perspective-[1600px] select-none py-4 px-2"
      >
        {/* Sacred Celestial Mandala Aura (Rotates gently behind the object) */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <motion.div
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            className="size-[360px] sm:size-[460px] rounded-full border border-amber-300/20 opacity-40 [mask-image:radial-gradient(circle,black_50%,transparent_75%)]"
            style={{
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.28) 0%, rgba(245, 158, 11, 0.08) 45%, transparent 70%)',
            }}
          >
            <div className="absolute inset-8 rounded-full border border-dashed border-amber-300/30" />
            <div className="absolute inset-20 rounded-full border border-amber-300/20" />
            <div className="absolute inset-32 rounded-full border border-dashed border-amber-300/35" />
          </motion.div>
        </div>

        {/* ── Mode 1: 3D Gilded Bound Granth (Codex) ────────────────────── */}
        {mode === 'granth' && (
          <motion.div
            style={
              reduce
                ? undefined
                : {
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                  }
            }
            animate={
              reduce
                ? undefined
                : {
                    y: [-4, 4, -4],
                  }
            }
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative"
          >
            {/* Dynamic Cast Ambient Shadow */}
            <motion.div
              aria-hidden="true"
              className="absolute -bottom-8 left-6 right-6 h-12 rounded-full bg-black/60 blur-2xl transition-opacity duration-300"
              style={{ x: shadowX, y: shadowY }}
            />

            {/* The 3D Book Shell */}
            <div
              className={`relative ${
                isOpen ? 'w-[19rem] sm:w-[25rem]' : 'w-[16rem] sm:w-[17.5rem]'
              } h-[23rem] sm:h-[25rem] rounded-r-2xl rounded-l-md shadow-2xl transition-all duration-700`}
              style={{
                transformStyle: 'preserve-3d',
                background: 'linear-gradient(135deg, #7c2d12 0%, #451a03 50%, #1c0a00 100%)',
                boxShadow: `
                  inset 4px 0 10px rgba(0,0,0,0.85),
                  inset 0 2px 4px rgba(251,191,36,0.35),
                  18px 24px 60px rgba(0,0,0,0.7)
                `,
              }}
            >
              {/* Spine with Gilded Ridges */}
              <div
                className="absolute left-0 top-0 bottom-0 w-6 rounded-l-md z-30"
                style={{
                  background: 'linear-gradient(90deg, #1c0a00 0%, #7c2d12 50%, #451a03 90%, rgba(0,0,0,0.5) 100%)',
                  borderRight: '1px solid rgba(251, 191, 36, 0.25)',
                }}
              >
                <div className="absolute top-10 left-0 right-0 h-1 bg-amber-400/60 shadow-sm" />
                <div className="absolute top-12 left-0 right-0 h-0.5 bg-amber-200/50" />
                <div className="absolute bottom-10 left-0 right-0 h-1 bg-amber-400/60 shadow-sm" />
                <div className="absolute bottom-12 left-0 right-0 h-0.5 bg-amber-200/50" />
              </div>

              {/* Gilded Page Edges */}
              <div
                className="absolute right-0 top-2 bottom-2 w-3 rounded-r-sm z-10"
                style={{
                  background: 'repeating-linear-gradient(0deg, #fef3c7 0px, #d97706 1px, #fef3c7 2px)',
                  boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.4)',
                  transform: 'translateX(6px) translateZ(-6px) rotateY(45deg)',
                }}
              />

              {/* Flowing Saffron Silk Bookmark */}
              <motion.div
                className="absolute -top-3 left-16 h-28 w-5 bg-gradient-to-b from-saffron-500 via-amber-400 to-saffron-600 shadow-lg z-20"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 90%, 50% 100%, 0% 90%)',
                  transform: 'translateZ(18px)',
                }}
                animate={reduce ? undefined : { rotate: [0, 3, -2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* ── When Book is OPEN: Revealed Inner Manuscript ────────── */}
              {isOpen ? (
                <div
                  className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-r-2xl py-5 pl-8 pr-5 text-stone-900 bg-[#fefcf7]"
                  style={{
                    transform: 'translateZ(14px)',
                    backgroundImage: 'radial-gradient(#e5d8b8 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                  }}
                >
                  <div className="flex items-center justify-between border-b border-amber-900/15 pb-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 uppercase tracking-widest">
                      <Sparkles className="h-3 w-3 text-saffron-600" />
                      <span>{current.titleSa}</span>
                    </span>
                    <button
                      type="button"
                      onClick={toggleOpen}
                      className="text-xs font-bold text-amber-900 hover:text-saffron-700 underline underline-offset-2"
                    >
                      पुनः बन्द करें ✕
                    </button>
                  </div>

                  <div className="my-auto py-2 text-center">
                    <p lang="sa" className="font-devanagari text-lg sm:text-xl font-bold leading-relaxed text-amber-950 whitespace-pre-line drop-shadow-xs">
                      {current.iconicShlokaSa}
                    </p>
                    <div className="mx-auto my-2.5 h-0.5 w-16 bg-gradient-to-r from-transparent via-amber-600/50 to-transparent" />
                    <p lang="hi" className="font-devanagari text-xs sm:text-sm font-medium leading-relaxed text-stone-800 line-clamp-3">
                      {current.iconicShlokaHi}
                    </p>
                    <p className="mt-2 text-[11px] font-semibold text-amber-900/80">
                      {current.citation}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-amber-900/15 pt-3">
                    <Link
                      href={current.href}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-saffron-700 to-amber-700 px-4 py-2 text-xs font-bold text-white shadow hover:from-saffron-800 hover:to-amber-800"
                    >
                      <span>अध्ययन आरम्भ करें</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <span className="text-[11px] font-bold text-amber-900/70">{current.verseCount}</span>
                  </div>
                </div>
              ) : (
                /* ── When Book is CLOSED: Front Cover Plate ────────────── */
                <div
                  className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-r-2xl py-4 pl-7 pr-4 group"
                  style={{
                    transform: 'translateZ(14px)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Dynamic Specular Golden Light Overlay */}
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: foilBackground }}
                  />

                  {/* Embossed Gilded Border Filigree */}
                  <div className="pointer-events-none absolute inset-2.5 rounded-xl border border-amber-400/40 p-1">
                    <div className="h-full w-full rounded-lg border border-amber-300/20" />
                  </div>

                  {/* Top Header Badge & Sacred OM */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-black/45 px-2.5 py-1 text-[11px] font-bold text-amber-200 backdrop-blur-md">
                      <Sparkles className="h-3 w-3 text-amber-300" />
                      <span>{current.badge}</span>
                    </div>
                    <span lang="sa" className="font-devanagari text-2xl font-bold text-amber-300/90 drop-shadow">
                      ॐ
                    </span>
                  </div>

                  {/* Center Book Details */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.id}
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="relative z-10 my-auto text-center"
                      style={{ transform: 'translateZ(24px)' }}
                    >
                      <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-600 font-bold text-stone-950 shadow-lg ring-2 ring-amber-300/50">
                        <Flame className="h-6 w-6 text-stone-950" />
                      </div>
                      <h3
                        lang="sa"
                        className="bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 bg-clip-text font-devanagari text-2xl sm:text-3xl font-extrabold tracking-wide text-transparent drop-shadow-[0_2px_12px_rgba(251,191,36,0.6)]"
                      >
                        {current.titleSa}
                      </h3>
                      <p lang="en" className="mt-1 font-serif text-base font-bold leading-tight text-amber-100 drop-shadow">
                        {current.titleEn}
                      </p>
                      <p className="mt-1 text-xs italic tracking-wide text-amber-200/90 font-serif">
                        {current.subTitle}
                      </p>
                      <div className="mx-auto mt-2 h-px w-12 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                    </motion.div>
                  </AnimatePresence>

                  {/* Bottom Action Controls */}
                  <div className="relative z-10 flex items-center justify-between text-xs text-amber-200/90">
                    <button
                      type="button"
                      onClick={toggleOpen}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300/40 bg-black/40 px-2.5 py-1 text-[11px] font-bold text-amber-200 hover:bg-amber-400/20 transition backdrop-blur-xs"
                    >
                      <Eye className="h-3 w-3 text-amber-300" />
                      <span>श्लोक उद्घाटित करें</span>
                    </button>
                    <Link
                      href={current.href}
                      className="inline-flex items-center gap-1 font-bold text-amber-300 hover:text-white transition group-hover:translate-x-1"
                    >
                      <span>पढ़ें</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Mode 2: 3D Talapatra Palm-Leaf Manuscript ─────────────────── */}
        {mode === 'talapatra' && (
          <motion.div
            style={
              reduce
                ? undefined
                : {
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                  }
            }
            animate={
              reduce
                ? undefined
                : {
                    y: [-4, 4, -4],
                  }
            }
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative"
          >
            {/* Ambient Shadow */}
            <motion.div
              aria-hidden="true"
              className="absolute -bottom-8 left-4 right-4 h-12 rounded-full bg-black/65 blur-2xl"
              style={{ x: shadowX, y: shadowY }}
            />

            {/* Horizontal Palm Leaf Stack */}
            <div
              className="relative w-[19rem] sm:w-[28rem] rounded-2xl border border-amber-600/40 p-4 sm:p-6 shadow-2xl backdrop-blur-md"
              style={{
                transformStyle: 'preserve-3d',
                background: 'linear-gradient(180deg, #f7ecd2 0%, #ecd9b3 100%)',
                color: '#2a1a0c',
                boxShadow: '0 20px 50px rgba(0,0,0,0.65), inset 0 1px 2px rgba(255,255,255,0.4)',
              }}
            >
              {/* Top Wooden Binding Plank (काष्ठ फलक) Accent */}
              <div
                className="absolute -top-3 left-4 right-4 h-3 rounded-t-md border-t border-l border-r border-amber-900/50"
                style={{
                  background: 'linear-gradient(90deg, #5c2c10 0%, #8a4518 50%, #5c2c10 100%)',
                  transform: 'translateZ(-8px)',
                }}
              />

              {/* Silk Cord Binding Holes with brass grommet style */}
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 sm:left-4">
                <span className="size-3.5 rounded-full border border-amber-900/60 bg-amber-950 shadow-inner" />
                <span className="h-10 w-0.5 bg-red-700 shadow-sm" />
                <span className="size-3.5 rounded-full border border-amber-900/60 bg-amber-950 shadow-inner" />
              </div>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 sm:right-4">
                <span className="size-3.5 rounded-full border border-amber-900/60 bg-amber-950 shadow-inner" />
                <span className="h-10 w-0.5 bg-red-700 shadow-sm" />
                <span className="size-3.5 rounded-full border border-amber-900/60 bg-amber-950 shadow-inner" />
              </div>

              {/* Mangala Shloka Header */}
              <div className="text-center">
                <span className="font-manuscript text-xs font-bold text-red-800 tracking-wider">
                  ॥ श्रीः ॥ {current.titleSa}
                </span>
              </div>

              {/* Palm Leaf Sacred Verse Body */}
              <div className="my-4 px-6 sm:px-8 text-center" style={{ transform: 'translateZ(18px)' }}>
                <p
                  lang="sa"
                  className="font-manuscript text-base sm:text-xl font-bold leading-relaxed text-stone-950 whitespace-pre-line"
                >
                  {current.iconicShlokaSa.split(/([।॥]+)/).map((part, i) =>
                    /^[।॥]+$/.test(part) ? (
                      <span key={i} className="text-red-800 px-0.5 font-bold">
                        {part}
                      </span>
                    ) : (
                      part
                    )
                  )}
                </p>
                <div className="mx-auto my-2.5 h-0.5 w-16 bg-gradient-to-r from-transparent via-amber-800/40 to-transparent" />
                <p lang="hi" className="font-devanagari text-xs sm:text-sm font-semibold leading-relaxed text-stone-800">
                  {current.iconicShlokaHi}
                </p>
                <p className="mt-1 text-[11px] font-bold text-amber-950/80">
                  {current.citation}
                </p>
              </div>

              {/* Bottom Palm Leaf Action */}
              <div className="flex items-center justify-between border-t border-amber-900/20 pt-3 px-2">
                <span className="text-xs font-bold text-amber-950/80">
                  तालपत्र पाण्डुलिपि स्वरूप
                </span>
                <Link
                  href={current.href}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-800 to-amber-900 px-4 py-1.5 text-xs font-bold text-amber-100 shadow hover:brightness-110"
                >
                  <span>ग्रन्थ में प्रवेश करें</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Mode 3: 3D Sacred Sri Yantra / Cosmic Mandala ─────────────── */}
        {mode === 'mandala' && (
          <motion.div
            style={
              reduce
                ? undefined
                : {
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                  }
            }
            className="relative flex items-center justify-center py-4"
          >
            {/* Ambient Backing Glow */}
            <div
              className="absolute size-[280px] sm:size-[360px] rounded-full blur-3xl opacity-35"
              style={{
                background: 'radial-gradient(circle, #f59e0b 0%, #d97706 40%, transparent 70%)',
              }}
            />

            {/* Concentric Rotating 3D Golden Sacred Geometry Rings */}
            <div
              className="relative size-[280px] sm:size-[340px] flex items-center justify-center rounded-full border-2 border-amber-300/40 bg-black/40 backdrop-blur-md shadow-2xl p-4"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Outer Counter-Rotating 16-Lotus Ring */}
              <motion.div
                animate={reduce ? undefined : { rotate: -360 }}
                transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-2 rounded-full border border-dashed border-amber-300/50"
              />

              {/* Inner Rotating 8-Lotus Ring */}
              <motion.div
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-8 rounded-full border border-amber-300/40"
              >
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <span
                    key={deg}
                    className="absolute top-0 left-1/2 -ml-1 size-2 rounded-full bg-amber-300/80 shadow-[0_0_8px_#f59e0b]"
                    style={{ transform: `rotate(${deg}deg) translateY(-2px)` }}
                  />
                ))}
              </motion.div>

              {/* Interlocking Triangles & Sacred Bindu at Center */}
              <div
                className="relative flex flex-col items-center justify-center text-center p-4 z-20"
                style={{ transform: 'translateZ(28px)' }}
              >
                <motion.div
                  animate={reduce ? undefined : { scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="mb-2 size-12 rounded-full bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 flex items-center justify-center shadow-[0_0_24px_rgba(251,191,36,0.8)]"
                >
                  <span lang="sa" className="font-devanagari text-2xl font-black text-stone-950">
                    ॐ
                  </span>
                </motion.div>

                <h4 lang="sa" className="font-devanagari text-xl sm:text-2xl font-extrabold text-amber-100 drop-shadow">
                  {current.titleSa}
                </h4>
                <p className="font-serif text-xs font-bold text-amber-200/90 mt-0.5">
                  {current.titleEn}
                </p>
                <p className="mt-2 max-w-[220px] text-[11px] leading-relaxed text-amber-200/80 italic font-serif">
                  &ldquo;{current.iconicShlokaEn}&rdquo;
                </p>

                <Link
                  href={current.href}
                  className="mt-3 inline-flex items-center gap-1 rounded-full bg-amber-400 px-3.5 py-1 text-xs font-bold text-stone-950 shadow hover:bg-amber-300 transition"
                >
                  <span>अन्तर्ध्यान करें</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Scripture Switcher Pills ──────────────────────────────────── */}
      <div className="relative z-30 mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {FEATURED_BOOKS.map((b, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button
              key={b.id}
              onClick={() => handleSelectBook(idx)}
              className={`group relative rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'border border-amber-300/70 bg-amber-400/25 text-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.35)] backdrop-blur-md'
                  : 'border border-white/15 bg-black/25 text-white/70 hover:border-amber-300/40 hover:bg-black/40 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span lang="sa" className="font-devanagari font-bold">{b.titleSa}</span>
                <span className="hidden sm:inline text-amber-300/60">·</span>
                <span className="hidden sm:inline text-[11px] opacity-80">{b.titleEn}</span>
              </span>
              {isActive && (
                <motion.div
                  layoutId="active-book-pill"
                  className="absolute inset-0 rounded-full border border-amber-300/80 pointer-events-none"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
