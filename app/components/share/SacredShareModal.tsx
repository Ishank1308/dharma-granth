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
  Monitor,
  Sparkles,
  Loader2,
  Palette,
  Layers,
} from 'lucide-react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

export type ShareFormat = 'story' | 'post' | 'landscape';
export type ShareTheme = 'swarna' | 'midnight' | 'ashram' | 'himalaya';
export type ContentMode = 'full' | 'bilingual' | 'hindi' | 'quote';

export interface SacredShareData {
  title: string;
  reference: string;
  sanskrit: string;
  transliteration?: string;
  translation: string;
  hindi?: string;
  quote?: string;
  url: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: SacredShareData;
}

const THEMES: Record<
  ShareTheme,
  {
    name: string;
    nameHi: string;
    bgGradient: string;
    cardBorder: string;
    omColor: string;
    omBorder: string;
    omBg: string;
    textColor: string;
    sanskritColor: string;
    accentColor: string;
    mutedColor: string;
    frameShadow: string;
    pillBg: string;
  }
> = {
  swarna: {
    name: 'Swarna Mandir',
    nameHi: 'स्वर्ण मंदिर',
    bgGradient:
      'radial-gradient(circle at 20% 12%, rgba(245, 158, 11, 0.28) 0%, transparent 50%), ' +
      'radial-gradient(circle at 80% 88%, rgba(217, 119, 6, 0.24) 0%, transparent 50%), ' +
      'linear-gradient(150deg, #fffcf2 0%, #fef3c7 45%, #fde68a 100%)',
    cardBorder: '1.5px solid rgba(180, 83, 9, 0.45)',
    omColor: '#b45309',
    omBorder: '1.5px solid rgba(180, 83, 9, 0.5)',
    omBg: 'rgba(255, 255, 255, 0.95)',
    textColor: '#361d0d',
    sanskritColor: '#78350f',
    accentColor: '#b45309',
    mutedColor: '#785b46',
    frameShadow: 'inset 0 0 0 6px rgba(255, 255, 255, 0.75), inset 0 0 0 8px rgba(180, 83, 9, 0.18)',
    pillBg: 'rgba(180, 83, 9, 0.12)',
  },
  midnight: {
    name: 'Cosmic Krishna',
    nameHi: 'कृष्ण अनंत',
    bgGradient:
      'radial-gradient(circle at 20% 15%, rgba(59, 130, 246, 0.22) 0%, transparent 45%), ' +
      'radial-gradient(circle at 80% 85%, rgba(139, 92, 246, 0.25) 0%, transparent 45%), ' +
      'linear-gradient(150deg, #090d16 0%, #0f172a 50%, #1e1b4b 100%)',
    cardBorder: '1.5px solid rgba(245, 158, 11, 0.4)',
    omColor: '#f59e0b',
    omBorder: '1.5px solid rgba(245, 158, 11, 0.6)',
    omBg: 'rgba(15, 23, 42, 0.95)',
    textColor: '#f8fafc',
    sanskritColor: '#fef08a',
    accentColor: '#f59e0b',
    mutedColor: '#94a3b8',
    frameShadow: 'inset 0 0 0 6px rgba(15, 23, 42, 0.8), inset 0 0 0 8px rgba(245, 158, 11, 0.15)',
    pillBg: 'rgba(245, 158, 11, 0.16)',
  },
  ashram: {
    name: 'Vedic Ashram',
    nameHi: 'तपोवन',
    bgGradient:
      'radial-gradient(circle at 15% 15%, rgba(16, 185, 129, 0.18) 0%, transparent 45%), ' +
      'radial-gradient(circle at 85% 85%, rgba(180, 83, 9, 0.16) 0%, transparent 45%), ' +
      'linear-gradient(150deg, #fbfbf8 0%, #f4f2ea 50%, #e8e2d2 100%)',
    cardBorder: '1.5px solid rgba(5, 150, 105, 0.4)',
    omColor: '#047857',
    omBorder: '1.5px solid rgba(5, 150, 105, 0.5)',
    omBg: 'rgba(255, 255, 255, 0.95)',
    textColor: '#1c2826',
    sanskritColor: '#064e3b',
    accentColor: '#047857',
    mutedColor: '#4b5563',
    frameShadow: 'inset 0 0 0 6px rgba(255, 255, 255, 0.75), inset 0 0 0 8px rgba(5, 150, 105, 0.15)',
    pillBg: 'rgba(5, 150, 105, 0.12)',
  },
  himalaya: {
    name: 'Himalayan Dawn',
    nameHi: 'कैलाश भोर',
    bgGradient:
      'radial-gradient(circle at 20% 10%, rgba(225, 29, 72, 0.14) 0%, transparent 45%), ' +
      'radial-gradient(circle at 80% 90%, rgba(244, 63, 94, 0.12) 0%, transparent 45%), ' +
      'linear-gradient(150deg, #ffffff 0%, #fff1f2 50%, #ffe4e6 100%)',
    cardBorder: '1.5px solid rgba(225, 29, 72, 0.4)',
    omColor: '#e11d48',
    omBorder: '1.5px solid rgba(225, 29, 72, 0.5)',
    omBg: 'rgba(255, 255, 255, 0.95)',
    textColor: '#1f2937',
    sanskritColor: '#9f1239',
    accentColor: '#e11d48',
    mutedColor: '#6b7280',
    frameShadow: 'inset 0 0 0 6px rgba(255, 255, 255, 0.75), inset 0 0 0 8px rgba(225, 29, 72, 0.12)',
    pillBg: 'rgba(225, 29, 72, 0.12)',
  },
};

export function SacredShareModal({ isOpen, onClose, data }: Props) {
  const [format, setFormat] = useState<ShareFormat>('story');
  const [theme, setTheme] = useState<ShareTheme>('swarna');
  const [contentMode, setContentMode] = useState<ContentMode>('full');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 22, mass: 0.55 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 22, mass: 0.55 });

  function handleCardPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType === 'touch') return;
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

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentTheme = THEMES[theme];

  // WhatsApp rich formatted text message
  const whatsappText = [
    `🕉️ *${data.title} · ${data.reference}*`,
    '',
    data.sanskrit ? data.sanskrit.trim() : '',
    '',
    data.hindi ? `✨ *भावार्थ (Hindi):* ${data.hindi}` : '',
    data.translation ? `📖 *Meaning (English):* ${data.translation}` : '',
    data.quote ? `💡 *सूत्र:* ${data.quote}` : '',
    '',
    `🔗 *पूरा पाठ एवं अध्ययन:* ${data.url}`,
    '— *Dharma Granth* (dharmagranth.dev)',
  ]
    .filter(Boolean)
    .join('\n');

  function openWhatsApp() {
    const encoded = encodeURIComponent(whatsappText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank', 'noopener,noreferrer');
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(whatsappText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  }

  async function downloadImage() {
    if (busy || !cardRef.current) return;
    setBusy(true);
    try {
      await document.fonts?.ready;
      const { toPng } = await import('html-to-image');
      const pixelRatio = format === 'story' ? 2.5 : 2;
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio });
      const a = document.createElement('a');
      a.href = dataUrl;
      const safeSlug = (data.reference || data.title).toLowerCase().replace(/[^a-z0-9]+/g, '-');
      a.download = `dharmagranth-${safeSlug}-${format}.png`;
      a.click();
    } catch (err) {
      console.error('Image capture failed:', err);
    } finally {
      setBusy(false);
    }
  }

  async function triggerNativeShare() {
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
          title: `${data.title} · ${data.reference}`,
          text: `${data.hindi || data.translation}\n${data.url}`,
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `${data.title} · ${data.reference}`,
          text: whatsappText,
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

  // Dimensions based on format
  const cardWidth = format === 'story' ? 440 : format === 'post' ? 440 : 580;
  const cardHeight = format === 'story' ? 780 : format === 'post' ? 440 : 326;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative z-10 w-full max-w-2xl rounded-3xl border border-dharma-border bg-dharma-card p-4 sm:p-6 shadow-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-dharma-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-saffron-500/10 text-saffron-700 dark:text-saffron-300">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-serif text-lg font-bold text-dharma-text">
                  Sacred Verse Card Generator
                </h3>
                <p className="text-2xs text-dharma-muted">
                  साझा करने हेतु सुंदर श्लोक चित्र बनाएं
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-dharma-muted hover:bg-dharma-panel hover:text-dharma-text transition"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Controls: Format, Theme, Content */}
          <div className="space-y-3 bg-dharma-panel/60 p-3.5 rounded-2xl border border-dharma-border/50 text-xs">
            {/* Aspect Ratio Format Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-dharma-muted flex items-center gap-1">
                <Smartphone className="h-3.5 w-3.5" />
                <span>Format:</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setFormat('story')}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    format === 'story'
                      ? 'bg-saffron-600 text-white shadow-2xs'
                      : 'border border-dharma-border bg-dharma-card text-dharma-muted hover:text-dharma-text'
                  }`}
                >
                  <Smartphone className="h-3 w-3" />
                  <span>9:16 WhatsApp / Story</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('post')}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    format === 'post'
                      ? 'bg-saffron-600 text-white shadow-2xs'
                      : 'border border-dharma-border bg-dharma-card text-dharma-muted hover:text-dharma-text'
                  }`}
                >
                  <Square className="h-3 w-3" />
                  <span>1:1 Square</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('landscape')}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    format === 'landscape'
                      ? 'bg-saffron-600 text-white shadow-2xs'
                      : 'border border-dharma-border bg-dharma-card text-dharma-muted hover:text-dharma-text'
                  }`}
                >
                  <Monitor className="h-3 w-3" />
                  <span>16:9 Banner</span>
                </button>
              </div>
            </div>

            {/* Aesthetic Theme Selection */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dharma-border/40 pt-2.5">
              <span className="font-bold text-dharma-muted flex items-center gap-1">
                <Palette className="h-3.5 w-3.5" />
                <span>Sacred Theme:</span>
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(Object.keys(THEMES) as ShareTheme[]).map((tKey) => {
                  const t = THEMES[tKey];
                  const isSelected = theme === tKey;
                  return (
                    <button
                      key={tKey}
                      type="button"
                      onClick={() => setTheme(tKey)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition ${
                        isSelected
                          ? 'border border-saffron-500 bg-saffron-500/15 text-saffron-900 dark:text-saffron-100 font-bold'
                          : 'border border-dharma-border bg-dharma-card text-dharma-muted hover:text-dharma-text'
                      }`}
                    >
                      <span>{t.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Display Mode */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dharma-border/40 pt-2.5">
              <span className="font-bold text-dharma-muted flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" />
                <span>Text Details:</span>
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => setContentMode('full')}
                  className={`rounded-lg px-2 py-0.5 text-2xs font-semibold transition ${
                    contentMode === 'full'
                      ? 'bg-dharma-text text-dharma-bg'
                      : 'text-dharma-muted hover:text-dharma-text'
                  }`}
                >
                  Full (All)
                </button>
                <button
                  type="button"
                  onClick={() => setContentMode('bilingual')}
                  className={`rounded-lg px-2 py-0.5 text-2xs font-semibold transition ${
                    contentMode === 'bilingual'
                      ? 'bg-dharma-text text-dharma-bg'
                      : 'text-dharma-muted hover:text-dharma-text'
                  }`}
                >
                  Sanskrit + English
                </button>
                <button
                  type="button"
                  onClick={() => setContentMode('hindi')}
                  className={`rounded-lg px-2 py-0.5 text-2xs font-semibold transition ${
                    contentMode === 'hindi'
                      ? 'bg-dharma-text text-dharma-bg'
                      : 'text-dharma-muted hover:text-dharma-text'
                  }`}
                >
                  Sanskrit + Hindi
                </button>
                {data.quote && (
                  <button
                    type="button"
                    onClick={() => setContentMode('quote')}
                    className={`rounded-lg px-2 py-0.5 text-2xs font-semibold transition ${
                      contentMode === 'quote'
                        ? 'bg-dharma-text text-dharma-bg'
                        : 'text-dharma-muted hover:text-dharma-text'
                    }`}
                  >
                    Quote Focus
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Live Preview Container with Auto Scaling */}
          <div className="flex items-center justify-center bg-stone-900/10 dark:bg-black/30 rounded-2xl p-4 overflow-hidden border border-dharma-border/50 min-h-[300px]">
            <div
              style={{
                transform: format === 'story' ? 'scale(0.55)' : format === 'post' ? 'scale(0.72)' : 'scale(0.65)',
                transformOrigin: 'center center',
                margin: format === 'story' ? '-140px 0' : format === 'post' ? '-50px 0' : '-40px 0',
              }}
            >
              {/* Tilt and sheen live outside the export node so PNGs stay flat and clean. */}
              <motion.div
                onPointerMove={handleCardPointerMove}
                onPointerLeave={resetCardPointer}
                style={{
                  position: 'relative',
                  width: cardWidth,
                  height: cardHeight,
                  perspective: 1000,
                  rotateX: reduceMotion ? 0 : rotateX,
                  rotateY: reduceMotion ? 0 : rotateY,
                  transformStyle: 'preserve-3d',
                }}
              >
              {/* THE RENDERED CARD (ALSO USED BY html-to-image) */}
              <div
                ref={cardRef}
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: format === 'story' ? '38px 28px' : format === 'post' ? '28px' : '28px 36px',
                  background: currentTheme.bgGradient,
                  color: currentTheme.textColor,
                  fontFamily: "'Noto Sans Devanagari', 'Merriweather', 'Inter', serif",
                  borderRadius: 24,
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
                }}
              >
                {/* Inner Ornamental Border Frame */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    border: currentTheme.cardBorder,
                    borderRadius: 20,
                    padding: format === 'story' ? '30px 24px 20px' : '20px 20px 16px',
                    boxShadow: currentTheme.frameShadow,
                    boxSizing: 'border-box',
                  }}
                >
                  {/* Sacred ॐ Medallion */}
                  <div
                    style={{
                      width: format === 'landscape' ? 44 : 50,
                      height: format === 'landscape' ? 44 : 50,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: format === 'landscape' ? 24 : 26,
                      color: currentTheme.omColor,
                      background: currentTheme.omBg,
                      border: currentTheme.omBorder,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    }}
                  >
                    ॐ
                  </div>

                  {/* Top Scripture Brand & Reference Pill */}
                  <div
                    style={{
                      marginTop: 12,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 12px',
                      borderRadius: 99,
                      background: currentTheme.pillBg,
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                      color: currentTheme.accentColor,
                    }}
                  >
                    <span>Dharma Granth</span>
                    <span>·</span>
                    <span>{data.reference}</span>
                  </div>

                  {/* Decorative Flourish */}
                  <div
                    style={{
                      margin: format === 'story' ? '18px 0 12px' : '10px 0 6px',
                      fontSize: 12,
                      letterSpacing: 4,
                      color: currentTheme.accentColor,
                    }}
                  >
                    ✦ ❁ ✦
                  </div>

                  {/* Main Verse Core Body */}
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    {contentMode !== 'quote' && data.sanskrit && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: format === 'story' ? 22 : format === 'post' ? 20 : 19,
                          lineHeight: format === 'story' ? '38px' : '34px',
                          fontWeight: 700,
                          whiteSpace: 'pre-line',
                          color: currentTheme.sanskritColor,
                        }}
                      >
                        {data.sanskrit.trim()}
                      </p>
                    )}

                    {contentMode !== 'quote' && data.transliteration && format === 'story' && (
                      <p
                        style={{
                          margin: '10px 0 0',
                          fontSize: 11,
                          lineHeight: '18px',
                          fontStyle: 'italic',
                          color: currentTheme.mutedColor,
                        }}
                      >
                        {data.transliteration.trim()}
                      </p>
                    )}

                    {/* Divider */}
                    <div
                      style={{
                        margin: format === 'story' ? '18px 0' : '10px 0',
                        width: 120,
                        height: 1,
                        background: `linear-gradient(90deg, transparent, ${currentTheme.accentColor}, transparent)`,
                        opacity: 0.6,
                      }}
                    />

                    {/* Translations according to ContentMode */}
                    {(contentMode === 'full' || contentMode === 'hindi') && data.hindi && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: format === 'story' ? 14 : 12.5,
                          lineHeight: format === 'story' ? '24px' : '20px',
                          fontWeight: 600,
                          color: currentTheme.textColor,
                        }}
                      >
                        {data.hindi}
                      </p>
                    )}

                    {(contentMode === 'full' || contentMode === 'bilingual') && data.translation && (
                      <p
                        style={{
                          margin: contentMode === 'full' ? '8px 0 0' : 0,
                          fontSize: format === 'story' ? 13 : 12,
                          lineHeight: format === 'story' ? '22px' : '19px',
                          fontFamily: 'serif',
                          color: currentTheme.textColor,
                          opacity: 0.9,
                        }}
                      >
                        “{data.translation}”
                      </p>
                    )}

                    {contentMode === 'quote' && data.quote && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: format === 'story' ? 18 : 16,
                          lineHeight: format === 'story' ? '30px' : '26px',
                          fontFamily: 'serif',
                          fontStyle: 'italic',
                          color: currentTheme.sanskritColor,
                          fontWeight: 600,
                        }}
                      >
                        “{data.quote}”
                      </p>
                    )}
                  </div>

                  {/* Bottom Flourish */}
                  <div
                    style={{
                      margin: format === 'story' ? '14px 0 4px' : '6px 0 0',
                      fontSize: 12,
                      letterSpacing: 4,
                      color: currentTheme.accentColor,
                    }}
                  >
                    ✦ ❁ ✦
                  </div>
                </div>

                {/* Footer Brand Strip */}
                <div
                  style={{
                    marginTop: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    fontSize: 11,
                    fontWeight: 800,
                    color: currentTheme.accentColor,
                  }}
                >
                  <span>dharmagranth.dev</span>
                  <span style={{ opacity: 0.5 }}>·</span>
                  <span style={{ fontWeight: 500, color: currentTheme.mutedColor }}>
                    सनातन ज्ञान का जीवित स्रोत
                  </span>
                </div>
              </div>
              {!reduceMotion && (
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 24,
                    pointerEvents: 'none',
                    background: 'radial-gradient(ellipse at var(--sheen-x, 50%) var(--sheen-y, 35%), rgba(255, 226, 160, 0.22), transparent 48%)',
                    mixBlendMode: 'screen',
                  }}
                />
              )}
              </motion.div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {/* 1-Click WhatsApp Button */}
            <button
              type="button"
              onClick={openWhatsApp}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 transition active:scale-[0.98]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.96.524 1.761.782 2.791.782 3.182 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.768-5.768-5.768zm7.393 5.766c.001 4.124-3.349 7.476-7.424 7.476-1.303 0-2.339-.337-3.414-.949l-4.586 1.203 1.226-4.469c-.687-1.15-1.05-2.227-1.05-3.261 0-4.124 3.35-7.476 7.424-7.476 4.075 0 7.424 3.352 7.424 7.476z" />
              </svg>
              <span>WhatsApp पर शेयर करें</span>
            </button>

            {/* Download HD Image Button */}
            <button
              type="button"
              onClick={downloadImage}
              disabled={busy}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-saffron-700/20 transition active:scale-[0.98] disabled:opacity-60"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>चित्र डाउनलोड करें (HD PNG)</span>
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-dharma-border/60">
            <button
              type="button"
              onClick={copyText}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-dharma-border bg-dharma-panel text-xs font-semibold text-dharma-text hover:border-saffron-300 transition"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">कॉपी हो गया!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-dharma-muted" />
                  <span>टेक्स्ट कॉपी करें</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={triggerNativeShare}
              disabled={busy}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-dharma-border bg-dharma-panel text-xs font-semibold text-dharma-text hover:border-saffron-300 transition"
            >
              <Share2 className="h-3.5 w-3.5 text-dharma-muted" />
              <span>अन्य ऍप्स में शेयर</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
