'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Download, ExternalLink, Share2, X, ZoomIn } from 'lucide-react';
import { buildPosterWhatsAppHref, type WisdomPoster } from '@/data/curated-visuals';

export function WisdomPosterLightbox({
  poster,
  showLink = true,
}: {
  poster: WisdomPoster;
  showLink?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const closeModal = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const downloadName = `dharma-granth-${poster.id}.webp`;
  const whatsappHref = buildPosterWhatsAppHref(poster);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="focus-ring relative block w-full overflow-hidden bg-stone-950/5 text-left"
        aria-label={`${poster.titleHi} (${poster.titleEn}) — पूरा चित्र देखें`}
      >
        <img
          src={poster.src}
          alt={poster.alt}
          width={poster.width}
          height={poster.height}
          loading="lazy"
          decoding="async"
          className="h-auto w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
        />
        <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white opacity-90 backdrop-blur-md transition group-hover:bg-saffron-700">
          <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
          <span>बड़ा देखें</span>
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${poster.titleHi} — ${poster.referenceEn}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
        >
          <button
            type="button"
            aria-label="पृष्ठभूमि पर क्लिक कर बन्द करें (Close lightbox)"
            onClick={closeModal}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm cursor-default"
          />
          <div className="relative z-10 flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-stone-950 text-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  <span lang="hi" className="font-devanagari normal-case">{poster.referenceHi}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{poster.referenceEn}</span>
                </p>
                <p className="truncate font-serif text-base sm:text-lg font-bold">
                  <span lang="hi" className="font-devanagari">{poster.titleHi}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={poster.src}
                  download={downloadName}
                  aria-label={`${poster.titleEn} डाउनलोड करें (Download)`}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Download</span>
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${poster.titleEn} WhatsApp पर शेयर करें (Share on WhatsApp)`}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-white transition"
                >
                  <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={closeModal}
                  aria-label="बन्द करें (Close)"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Image Container */}
            <div className="relative flex flex-1 items-center justify-center overflow-y-auto p-3 sm:p-5">
              <img
                src={poster.src}
                alt={poster.alt}
                width={poster.width}
                height={poster.height}
                className="max-h-[72vh] w-auto rounded-xl object-contain shadow-xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3 sm:px-6 text-xs">
              <p lang="hi" className="font-devanagari text-white/85 max-w-xl leading-relaxed">
                {poster.captionHi}
              </p>
              <div className="flex items-center gap-2 shrink-0">
                {showLink && (
                  <Link
                    href={poster.href}
                    onClick={() => setOpen(false)}
                    className="inline-flex min-h-[38px] items-center gap-1 rounded-full bg-saffron-600 hover:bg-saffron-700 px-3.5 py-1.5 font-semibold text-white transition"
                  >
                    <span lang="hi" className="font-devanagari">व्याख्या पढ़ें</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                )}
                <a
                  href={poster.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[38px] items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-semibold text-white hover:bg-white/20"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Original</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
