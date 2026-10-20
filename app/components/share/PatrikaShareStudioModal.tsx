'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Smartphone,
  Square,
  Layers,
  Sparkles,
  Loader2,
  Palette,
  CheckSquare,
} from 'lucide-react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { triggerTactileFeedback } from '@/lib/haptics';

export type AspectRatio = 'story' | 'portrait' | 'square';
export type PatrikaTemplate = 'kashi' | 'tamrapatra' | 'shunya' | 'typographic';

export interface PatrikaShareData {
  scriptureTitle: string;
  chapterTitle?: string;
  reference: string; // e.g. "भगवद्गीता २.४७"
  sanskrit: string;
  transliteration?: string;
  hindi?: string;
  translation?: string;
  coreShift?: string;
  url: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: PatrikaShareData;
}

interface LayerOptions {
  sanskrit: boolean;
  transliteration: boolean;
  hindi: boolean;
  translation: boolean;
  coreShift: boolean;
}

export function PatrikaShareStudioModal({ isOpen, onClose, data }: Props) {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('story');
  const [template, setTemplate] = useState<PatrikaTemplate>('kashi');
  const [busy, setBusy] = useState(false);
  const [exportError, setExportError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 22, mass: 0.55 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 22, mass: 0.55 });

  function handleCardPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    rotateX.set((0.5 - y) * 12);
    rotateY.set((x - 0.5) * 12);
    event.currentTarget.style.setProperty('--sheen-x', `${x * 100}%`);
    event.currentTarget.style.setProperty('--sheen-y', `${y * 100}%`);
  }

  function resetCardPointer(event: React.PointerEvent<HTMLDivElement>) {
    rotateX.set(0);
    rotateY.set(0);
    event.currentTarget.style.setProperty('--sheen-x', '50%');
    event.currentTarget.style.setProperty('--sheen-y', '35%');
  }

  const [layers, setLayers] = useState<LayerOptions>({
    sanskrit: true,
    transliteration: false,
    hindi: true,
    translation: true,
    coreShift: true,
  });

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Move focus into the dialog, lock page scroll behind it, and give focus back on close.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>('button')?.focus(), 60);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleLayer = (key: keyof LayerOptions) => {
    triggerTactileFeedback('selection', 'softTap');
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const whatsappMessage = [
    `🕉️ *${data.scriptureTitle} · ${data.reference}*`,
    '',
    layers.sanskrit && data.sanskrit ? data.sanskrit.trim() : '',
    '',
    layers.hindi && data.hindi ? `✨ *भावार्थ (Hindi):* ${data.hindi}` : '',
    layers.translation && data.translation ? `📖 *Meaning (English):* ${data.translation}` : '',
    layers.coreShift && data.coreShift ? `💡 *मर्म:* ${data.coreShift}` : '',
    '',
    `🔗 *पूरा पाठ एवं अध्ययन:* ${data.url}`,
    '— *Dharma Granth* (dharmagranth.in)',
  ]
    .filter(Boolean)
    .join('\n');

  async function copyText() {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      setCopied(true);
      triggerTactileFeedback('light', 'softTap');
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  }

  async function downloadPatrikaPng() {
    if (busy || !cardRef.current) return;
    setBusy(true);
    setExportError('');
    triggerTactileFeedback('selection', 'softTap');
    try {
      await document.fonts?.ready;
      const { toPng } = await import('html-to-image');
      const pixelRatio = 2.5; // High-resolution retina capture
      // A capture that never finishes would leave the button disabled; give up after 20 seconds.
      const dataUrl = await Promise.race([
        toPng(cardRef.current, { cacheBust: true, pixelRatio }),
        new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error('timeout')), 20000)),
      ]);

      const a = document.createElement('a');
      a.href = dataUrl;
      const safeSlug = (data.reference || data.scriptureTitle)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
      a.download = `patrika-${safeSlug}-${aspectRatio}.png`;
      a.click();
    } catch (err) {
      console.error('Patrikā capture failed:', err);
      setExportError('चित्र नहीं बन सका। पुनः प्रयास करें, या "टेक्स्ट कॉपी" चुनें। (Could not create the image. Try again, or copy the text.)');
    } finally {
      setBusy(false);
    }
  }

  async function triggerShare() {
    if (busy || !cardRef.current) return;
    setBusy(true);
    try {
      await document.fonts?.ready;
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `${data.reference || 'verse'}.png`, { type: 'image/png' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${data.scriptureTitle} · ${data.reference}`,
          text: `${data.hindi || data.translation}\n${data.url}`,
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `${data.scriptureTitle} · ${data.reference}`,
          text: whatsappMessage,
          url: data.url,
        });
      } else {
        await copyText();
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        await copyText();
      }
    } finally {
      setBusy(false);
    }
  }

  // Dimension scaling for preview
  const previewDimensions =
    aspectRatio === 'story'
      ? { width: 340, height: 604 } // 9:16
      : aspectRatio === 'portrait'
      ? { width: 360, height: 450 } // 4:5
      : { width: 380, height: 380 }; // 1:1

  // Template styles
  const templateConfig = {
    kashi: {
      name: 'काशी आइवरी (Kāśī Ivory)',
      bg: 'bg-[#faf7f0]',
      border: 'border-[#dfd8ca]',
      headerText: 'text-[#8b5a2b]',
      sanskritText: 'text-[#1c1917]',
      hindiText: 'text-[#292524]',
      englishText: 'text-[#44403c]',
      quoteBg: 'bg-[#f4eee1]',
      colophonText: 'text-[#a89f91]',
      accentRule: 'border-[#c29b68]/40',
      seal: '❁',
      sealColor: 'text-[#991b1b]',
    },
    tamrapatra: {
      name: 'ताम्रपत्र (Tāmrapatra)',
      bg: 'bg-gradient-to-br from-[#2a1309] via-[#1f0c05] to-[#120703]',
      border: 'border-[#92400e]/50',
      headerText: 'text-[#f59e0b]',
      sanskritText: 'text-[#fef3c7]',
      hindiText: 'text-[#fed7aa]',
      englishText: 'text-[#fdba74]/90',
      quoteBg: 'bg-[#7c2d12]/30',
      colophonText: 'text-[#d97706]/70',
      accentRule: 'border-[#d97706]/30',
      seal: 'ॐ',
      sealColor: 'text-[#f59e0b]',
    },
    shunya: {
      name: 'शून्य ब्लैक (Śūnya Obsidian)',
      bg: 'bg-[#0c0d10]',
      border: 'border-stone-800',
      headerText: 'text-stone-400',
      sanskritText: 'text-[#fafafa]',
      hindiText: 'text-stone-200',
      englishText: 'text-stone-400',
      quoteBg: 'bg-stone-900/80',
      colophonText: 'text-stone-600',
      accentRule: 'border-stone-800',
      seal: '✦',
      sealColor: 'text-amber-400',
    },
    typographic: {
      name: 'संपादकीय मिनिमल (Minimalist)',
      bg: 'bg-white',
      border: 'border-stone-200',
      headerText: 'text-stone-500',
      sanskritText: 'text-stone-800',
      hindiText: 'text-stone-900 font-bold',
      englishText: 'text-stone-700',
      quoteBg: 'bg-amber-50/70',
      colophonText: 'text-stone-400',
      accentRule: 'border-amber-400/40',
      seal: '“',
      sealColor: 'text-amber-600',
    },
  }[template];

  return (
    <AnimatePresence>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="पत्रिका कोट स्टूडियो"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/80 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          className="relative flex flex-col lg:flex-row w-full max-w-4xl max-h-[92vh] rounded-3xl border border-stone-700/60 bg-stone-900 text-stone-100 shadow-2xl overflow-hidden"
        >
          {/* Left / Top Studio Canvas Workspace */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-stone-950/60 overflow-y-auto">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>पत्रिका पूर्वावलोकन (Live 2x Preview)</span>
            </div>

            {/* Scaled Preview Frame */}
            <motion.div
              onPointerMove={handleCardPointerMove}
              onPointerLeave={resetCardPointer}
              style={{
                position: 'relative',
                width: previewDimensions.width,
                height: previewDimensions.height,
                perspective: 1000,
                rotateX: reduce ? 0 : rotateX,
                rotateY: reduce ? 0 : rotateY,
                transformStyle: 'preserve-3d',
              }}
            >
            <div
              ref={cardRef}
              style={{
                width: previewDimensions.width,
                height: previewDimensions.height,
              }}
              className={`relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl border ${templateConfig.border} ${templateConfig.bg} shadow-2xl transition-all duration-300 overflow-hidden select-none`}
            >
              {/* Paper texture overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"
                aria-hidden="true"
              />

              {/* Card Header */}
              <div className="relative z-10 flex items-center justify-between border-b pb-3.5" style={{ borderColor: 'rgba(150, 150, 150, 0.15)' }}>
                <div>
                  <p className={`font-mono text-[10px] uppercase tracking-widest font-bold ${templateConfig.headerText}`}>
                    {data.scriptureTitle}
                  </p>
                  <p className={`font-serif text-xs font-semibold ${templateConfig.headerText}`}>
                    {data.reference}
                  </p>
                </div>
                <span className={`text-xl font-serif ${templateConfig.sealColor}`} aria-hidden="true">
                  {templateConfig.seal}
                </span>
              </div>

              {/* Card Core Content */}
              <div className="relative z-10 flex-1 flex flex-col justify-center my-3 space-y-3.5 text-center">
                {/* Sanskrit */}
                {layers.sanskrit && data.sanskrit && (
                  <p
                    lang="sa"
                    className={`font-devanagari font-bold leading-loose ${
                      aspectRatio === 'story'
                        ? 'text-lg sm:text-xl'
                        : 'text-base sm:text-lg'
                    } ${templateConfig.sanskritText}`}
                  >
                    {data.sanskrit}
                  </p>
                )}

                {/* Transliteration */}
                {layers.transliteration && data.transliteration && (
                  <p lang="sa-Latn" className="font-serif text-xs italic opacity-75 text-stone-400">
                    {data.transliteration}
                  </p>
                )}

                {/* Core Shift Aphorism Callout */}
                {layers.coreShift && data.coreShift && (
                  <div className={`p-3 rounded-xl ${templateConfig.quoteBg} border border-dashed border-amber-500/20`}>
                    <p className="font-serif italic text-xs sm:text-sm font-medium leading-relaxed text-amber-300 dark:text-amber-200">
                      &ldquo;{data.coreShift}&rdquo;
                    </p>
                  </div>
                )}

                {/* Hindi Meaning */}
                {layers.hindi && data.hindi && (
                  <p
                    lang="hi"
                    className={`font-devanagari text-xs sm:text-sm leading-relaxed ${templateConfig.hindiText}`}
                  >
                    {data.hindi}
                  </p>
                )}

                {/* English Translation */}
                {layers.translation && data.translation && (
                  <p
                    className={`font-serif text-[11px] sm:text-xs leading-relaxed ${templateConfig.englishText}`}
                  >
                    {data.translation}
                  </p>
                )}
              </div>

              {/* Card Footer Colophon */}
              <div className="relative z-10 flex items-center justify-between border-t pt-3" style={{ borderColor: 'rgba(150, 150, 150, 0.15)' }}>
                <span className={`font-mono text-[9px] uppercase tracking-widest ${templateConfig.colophonText}`}>
                  dharmagranth.in · धर्म ग्रंथ
                </span>
                <span className={`text-[10px] font-devanagari ${templateConfig.colophonText}`}>
                  सत्यमेव जयते
                </span>
              </div>
            </div>
            {!reduce && (
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 16,
                  pointerEvents: 'none',
                  background: 'radial-gradient(ellipse at var(--sheen-x, 50%) var(--sheen-y, 35%), rgba(255, 226, 160, 0.2), transparent 48%)',
                  mixBlendMode: 'screen',
                }}
              />
            )}
            </motion.div>
          </div>

          {/* Right / Bottom Studio Control Panel */}
          <div className="w-full lg:w-80 p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-stone-800 bg-stone-900/90 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-saffron-500" />
                  <span>पत्रिका कोट स्टूडियो</span>
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="स्टूडियो बंद करें"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 1. Aspect Ratio Selector */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                  आकार (Aspect Ratio):
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('story')}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl text-xs font-semibold border transition ${
                      aspectRatio === 'story'
                        ? 'border-saffron-500 bg-saffron-500/15 text-white'
                        : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>9:16 Story</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAspectRatio('portrait')}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl text-xs font-semibold border transition ${
                      aspectRatio === 'portrait'
                        ? 'border-saffron-500 bg-saffron-500/15 text-white'
                        : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>4:5 Portrait</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAspectRatio('square')}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl text-xs font-semibold border transition ${
                      aspectRatio === 'square'
                        ? 'border-saffron-500 bg-saffron-500/15 text-white'
                        : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Square className="w-4 h-4" />
                    <span>1:1 Square</span>
                  </button>
                </div>
              </div>

              {/* 2. Minimalist Editorial Templates */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                  थीम (Minimalist Style):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'kashi', label: 'काशी आइवरी', swatch: 'bg-[#faf7f0] border-[#dfd8ca] text-stone-900' },
                      { id: 'tamrapatra', label: 'ताम्रपत्र', swatch: 'bg-[#2a1309] border-[#92400e] text-amber-200' },
                      { id: 'shunya', label: 'शून्य ब्लैक', swatch: 'bg-[#0c0d10] border-stone-700 text-stone-100' },
                      { id: 'typographic', label: 'संपादकीय', swatch: 'bg-white border-amber-300 text-stone-800' },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTemplate(t.id)}
                      className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium border transition ${t.swatch} ${
                        template === t.id ? 'ring-2 ring-saffron-500 font-bold' : 'opacity-85'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-current" />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Layer Toggles */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                  सामग्री परतें (Layer Controls):
                </span>
                <div className="space-y-1.5">
                  {(
                    [
                      { key: 'sanskrit', label: 'संस्कृत श्लोक (Sanskrit)' },
                      { key: 'transliteration', label: 'IAST रोमन लिपि' },
                      { key: 'coreShift', label: 'मर्म सूत्र (Core Shift)' },
                      { key: 'hindi', label: 'सरल हिंदी भावार्थ' },
                      { key: 'translation', label: 'English Meaning' },
                    ] as const
                  ).map((layer) => (
                    <button
                      key={layer.key}
                      type="button"
                      onClick={() => toggleLayer(layer.key)}
                      className="w-full flex items-center justify-between p-2 rounded-lg bg-stone-950/70 border border-stone-800 text-xs text-stone-300 hover:text-white transition"
                    >
                      <span>{layer.label}</span>
                      <CheckSquare
                        className={`w-4 h-4 ${
                          layers[layer.key] ? 'text-saffron-500' : 'text-stone-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Export Actions */}
            <div className="pt-6 space-y-2 border-t border-stone-800">
              <button
                type="button"
                onClick={downloadPatrikaPng}
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-saffron-600 hover:bg-saffron-500 text-white font-bold text-xs shadow-lg transition cursor-pointer disabled:opacity-50"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>उच्च-गुणवत्ता PNG डाउनलोड करें (2x Retina)</span>
              </button>
              {exportError ? (
                <p role="alert" className="text-xs text-amber-300">
                  {exportError}
                </p>
              ) : null}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={triggerShare}
                  disabled={busy}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>शेयर करें</span>
                </button>

                <button
                  type="button"
                  onClick={copyText}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'कॉपी हुआ!' : 'टेक्स्ट कॉपी'}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
