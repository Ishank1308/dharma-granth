'use client';

import { useRef, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  Image as ImageIcon,
  Loader2,
  Share2,
  Smartphone,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { whatsappTagged } from '@/lib/whatsapp';

interface Props {
  scriptureTitle: string;
  chapterTitle: string;
  verseLabel: string;
  sanskrit?: string;
  transliteration?: string;
  hindi?: string;
  translation?: string;
  compact?: boolean;
  verseUrl?: string;
}

type CardFormat = 'story' | 'post';

/** Poll until `get` returns a value (the card commits to the DOM). */
function waitFor<T>(get: () => T | null): Promise<T> {
  return new Promise((resolve, reject) => {
    let tries = 0;
    const tick = () => {
      const value = get();
      if (value) return resolve(value);
      if (++tries > 40) return reject(new Error('share card never mounted'));
      setTimeout(tick, 25);
    };
    tick();
  });
}

/**
 * Universal Verse Share Modal & Card Generator.
 * Provides 1-click WhatsApp text sharing, 9:16 WhatsApp Status/Instagram Story image card export,
 * 2:3 Pinterest/Post card export, and native Web Share.
 */
export function ShareVerseButton(props: Props) {
  const {
    scriptureTitle,
    chapterTitle,
    verseLabel,
    sanskrit,
    transliteration,
    hindi,
    translation,
    compact = false,
    verseUrl,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<CardFormat>('story');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentUrl =
    verseUrl ||
    (typeof window !== 'undefined'
      ? window.location.href.split('#')[0]
      : 'https://dharmagranth.in');

  const meaning = (hindi || translation || '').trim();

  // WhatsApp formatted rich message with emojis & markdown bolding
  const whatsappMessage = [
    `🕉️ *${scriptureTitle} · ${chapterTitle}*`,
    `📖 *श्लोक ${verseLabel}*`,
    '',
    sanskrit ? sanskrit.trim() : '',
    '',
    meaning ? `✨ *सरल अर्थ:* ${meaning}` : '',
    '',
    `🔗 *भावार्थ सहित पढ़ें:*`,
    whatsappTagged(currentUrl),
    '',
    `— *Dharma Granth* (dharmagranth.in)`,
  ]
    .filter((line) => line !== null && line !== undefined)
    .join('\n');

  const plainText = [
    `${scriptureTitle} · ${chapterTitle} · श्लोक ${verseLabel}`,
    sanskrit?.trim(),
    transliteration?.trim(),
    meaning,
    '',
    currentUrl,
  ]
    .filter(Boolean)
    .join('\n\n');

  function openWhatsApp() {
    const encoded = encodeURIComponent(whatsappMessage);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  }

  async function downloadCard() {
    if (busy) return;
    setBusy(true);
    try {
      const node = await waitFor(() => cardRef.current);
      await document.fonts?.ready;
      const { toPng } = await import('html-to-image');
      const pixelRatio = format === 'story' ? 2.5 : 2;
      const dataUrl = await toPng(node, { cacheBust: true, pixelRatio });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `dharmagranth-${scriptureTitle.replace(/\s+/g, '-').toLowerCase()}-v${verseLabel}-${format}.png`;
      a.click();
    } catch (err) {
      console.error('Image capture failed', err);
    } finally {
      setBusy(false);
    }
  }

  async function nativeShare() {
    if (busy) return;
    setBusy(true);
    try {
      const node = await waitFor(() => cardRef.current);
      await document.fonts?.ready;
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File(
        [blob],
        `verse-${verseLabel}.png`,
        { type: 'image/png' },
      );

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${scriptureTitle} · श्लोक ${verseLabel}`,
          text: `${meaning}\n${currentUrl}`,
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `${scriptureTitle} · श्लोक ${verseLabel}`,
          text: plainText,
          url: currentUrl,
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

  return (
    <>
      {compact ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-dharma-border/60 bg-dharma-bg px-3 py-1 text-xs font-medium text-dharma-muted transition hover:border-saffron-400 hover:text-saffron-700 hover:bg-saffron-50/50"
          aria-label="साझा करें (Share verse)"
          title="Share on WhatsApp or download image card"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>साझा करें</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-dharma-border bg-dharma-card/80 text-dharma-muted transition hover:border-saffron-400 hover:text-saffron-700 hover:bg-saffron-50/50 shadow-sm"
          aria-label="साझा करें (Share verse)"
          title="Share on WhatsApp or download image card"
        >
          <Share2 className="h-4 w-4" />
        </button>
      )}

      {/* Share Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Modal Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="share-modal-title"
              className="relative w-full max-w-lg rounded-2xl border border-dharma-border bg-dharma-card p-5 sm:p-6 shadow-2xl z-10 my-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-dharma-border/50">
                <div>
                  <h3
                    id="share-modal-title"
                    className="text-lg font-serif font-bold text-dharma-text flex items-center gap-2"
                  >
                    <span>साझा करें (Share Verse)</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-saffron-100 dark:bg-saffron-950/50 text-saffron-700 dark:text-saffron-300 font-sans font-semibold">
                      श्लोक {verseLabel}
                    </span>
                  </h3>
                  <p className="text-xs text-dharma-muted mt-0.5">
                    {scriptureTitle} · {chapterTitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1.5 text-dharma-muted hover:text-dharma-text hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                  aria-label="बंद करें"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Format Switcher */}
              <div className="mt-4 flex items-center justify-between bg-stone-100 dark:bg-stone-900/60 p-1 rounded-xl border border-dharma-border/60">
                <button
                  type="button"
                  onClick={() => setFormat('story')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition ${
                    format === 'story'
                      ? 'bg-white dark:bg-stone-800 text-saffron-700 dark:text-saffron-300 shadow-sm border border-saffron-300/30'
                      : 'text-dharma-muted hover:text-dharma-text'
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>9:16 स्टेटस / स्टोरी</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('post')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition ${
                    format === 'post'
                      ? 'bg-white dark:bg-stone-800 text-saffron-700 dark:text-saffron-300 shadow-sm border border-saffron-300/30'
                      : 'text-dharma-muted hover:text-dharma-text'
                  }`}
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>2:3 पोस्ट कार्ड</span>
                </button>
              </div>

              {/* Mini Card Preview */}
              <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-900/40 rounded-xl border border-dharma-border/40 text-center flex flex-col items-center">
                <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
                  {scriptureTitle} · श्लोक {verseLabel}
                </div>
                {sanskrit && (
                  <p className="font-devanagari text-sm font-semibold text-dharma-text line-clamp-2 my-1 leading-relaxed">
                    {sanskrit}
                  </p>
                )}
                {meaning && (
                  <p className="text-xs text-dharma-muted line-clamp-2 mt-1">
                    {meaning}
                  </p>
                )}
                <div className="mt-2 text-[10px] text-amber-600/80 dark:text-amber-400/80 font-medium">
                  dharmagranth.in · {format === 'story' ? 'WhatsApp Status (9:16)' : 'Pinterest / Post (2:3)'}
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1-Click WhatsApp Button */}
                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-md shadow-emerald-700/20 transition active:scale-[0.98]"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.96.524 1.761.782 2.791.782 3.182 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.768-5.768-5.768zm7.393 5.766c.001 4.124-3.349 7.476-7.424 7.476-1.303 0-2.339-.337-3.414-.949l-4.586 1.203 1.226-4.469c-.687-1.15-1.05-2.227-1.05-3.261 0-4.124 3.35-7.476 7.424-7.476 4.075 0 7.424 3.352 7.424 7.476z"/>
                  </svg>
                  <span>WhatsApp पर भेजें</span>
                </button>

                {/* Download Image Card Button */}
                <button
                  type="button"
                  onClick={downloadCard}
                  disabled={busy}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-medium text-sm shadow-md shadow-saffron-700/20 transition active:scale-[0.98] disabled:opacity-60"
                >
                  {busy ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  <span>Download Image</span>
                </button>
              </div>

              {/* Secondary Actions */}
              <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-dharma-border/40">
                <button
                  type="button"
                  onClick={copyText}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-dharma-border bg-dharma-bg text-xs font-medium text-dharma-muted hover:text-dharma-text hover:border-saffron-300 transition"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">कॉपी हो गया!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>टेक्स्ट कॉपी करें</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={nativeShare}
                  disabled={busy}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-dharma-border bg-dharma-bg text-xs font-medium text-dharma-muted hover:text-dharma-text hover:border-saffron-300 transition"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>अन्य ऍप्स (Share)</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Off-screen Card Container for html-to-image capture */}
      {(isOpen || busy) && (
        <div
          aria-hidden
          style={{
            position: 'fixed',
            left: -9999,
            top: 0,
            pointerEvents: 'none',
          }}
        >
        <div
          ref={cardRef}
          style={{
            width: format === 'story' ? 450 : 420,
            height: format === 'story' ? 800 : undefined,
            minHeight: format === 'story' ? 800 : 630,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            padding: format === 'story' ? '36px 28px' : '26px',
            background:
              'radial-gradient(circle at 18% 8%, rgba(217,119,6,0.18) 0%, transparent 45%), ' +
              'radial-gradient(circle at 85% 92%, rgba(190,24,93,0.14) 0%, transparent 48%), ' +
              'linear-gradient(160deg, #fffdf7 0%, #fef5dc 55%, #f8e1ad 100%)',
            fontFamily: "'Noto Sans Devanagari', 'Merriweather', 'Inter', serif",
            color: '#3b2415',
          }}
        >
          {/* Inner frame */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              border: '1.5px solid rgba(180,83,9,0.38)',
              borderRadius: 20,
              padding: format === 'story' ? '36px 28px 24px' : '28px 24px 20px',
              boxShadow:
                'inset 0 0 0 5px rgba(255,253,247,0.7), inset 0 0 0 7px rgba(180,83,9,0.16)',
            }}
          >
            {/* Om Icon */}
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                color: '#b45309',
                background: 'rgba(255,253,247,0.95)',
                border: '1.5px solid rgba(180,83,9,0.45)',
                boxShadow: '0 4px 14px rgba(180,83,9,0.18)',
              }}
            >
              ॐ
            </div>

            <div
              style={{
                marginTop: 14,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 4,
                textTransform: 'uppercase',
                color: '#b45309',
              }}
            >
              Dharma Granth
            </div>

            <div
              style={{
                marginTop: 6,
                fontSize: 13,
                fontWeight: 700,
                color: '#92400e',
                opacity: 0.9,
              }}
            >
              {scriptureTitle} · {chapterTitle} · श्लोक {verseLabel}
            </div>

            <div
              style={{
                margin: format === 'story' ? '24px 0 16px' : '16px 0 8px',
                fontSize: 14,
                color: '#c2691a',
                letterSpacing: 6,
              }}
            >
              ✦ ❁ ✦
            </div>

            {/* Verse Sanskrit */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {sanskrit ? (
                <p
                  style={{
                    margin: 0,
                    fontSize: format === 'story' ? 24 : 22,
                    lineHeight: format === 'story' ? '42px' : '38px',
                    fontWeight: 700,
                    whiteSpace: 'pre-line',
                    color: '#7c2d12',
                    textShadow: '0 1px 0 rgba(255,255,255,0.6)',
                  }}
                >
                  {sanskrit.trim()}
                </p>
              ) : null}

              {transliteration ? (
                <p
                  style={{
                    margin: '14px 0 0',
                    fontSize: 12,
                    lineHeight: '19px',
                    fontStyle: 'italic',
                    whiteSpace: 'pre-line',
                    color: '#8a7360',
                  }}
                >
                  {transliteration.trim()}
                </p>
              ) : null}

              {meaning ? (
                <>
                  <div
                    style={{
                      margin: format === 'story' ? '24px 0' : '18px 0',
                      width: 140,
                      height: 1,
                      background:
                        'linear-gradient(90deg, transparent, rgba(180,83,9,0.55), transparent)',
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: format === 'story' ? 16 : 14,
                      lineHeight: format === 'story' ? '28px' : '24px',
                      color: '#57402a',
                      fontWeight: 500,
                    }}
                  >
                    {meaning}
                  </p>
                </>
              ) : null}
            </div>

            <div
              style={{
                margin: format === 'story' ? '18px 0 6px' : '12px 0 0',
                fontSize: 13,
                color: '#c2691a',
                letterSpacing: 6,
              }}
            >
              ✦ ❁ ✦
            </div>
          </div>

          {/* Brand strip */}
          <div
            style={{
              marginTop: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontSize: 12,
              fontWeight: 700,
              color: '#92400e',
            }}
          >
            <span>dharmagranth.in</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span style={{ fontWeight: 500, color: '#a8834f' }}>
              श्रीमद्भगवद्गीता व सनातन शास्त्र
            </span>
          </div>
        </div>
      </div>
      )}
    </>
  );
}
