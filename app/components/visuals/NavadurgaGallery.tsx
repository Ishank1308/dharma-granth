'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, ExternalLink, Share2, Sparkles, X, ZoomIn } from 'lucide-react';
import { NAVADURGA_CARDS, type NavadurgaCard } from '@/data/curated-visuals';

const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev').replace(/\/+$/, '');

function buildNavadurgaWhatsAppHref(card: NavadurgaCard): string {
  const pageUrl = `${SITE_ORIGIN}/festivals/navaratri/#navadurga-darshan`;
  const text = `🪔 *नवरात्रि दिवस ${card.day} — ${card.nameHi} (${card.nameEn})*\n${card.mantra}\n\n✨ ${card.themeHi}\n\n🔗 सभी 9 नवदुर्गा दर्शन व मंत्र देखें:\n${pageUrl}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

interface NavadurgaGalleryProps {
  id?: string;
  headingHi?: string;
  headingEn?: string;
  subtitleHi?: string;
}

export function NavadurgaGallery({
  id = 'navadurga-darshan',
  headingHi = 'नवदुर्गा दर्शन — नवरात्रि के 9 पवित्र स्वरूप',
  headingEn = 'Navadurga Darshan — The 9 Sacred Forms of Navratri',
  subtitleHi = 'दुर्गा सप्तशती (देवी कवच) के श्लोक, ध्यान मन्त्र, हिन्दी अर्थ और गहन चिन्तन सहित सभी 9 दिवसों के चित्र-दर्शन। किसी भी चित्र पर क्लिक कर पूरा रूप देखें।',
}: NavadurgaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active: NavadurgaCard | null = activeIndex !== null ? NAVADURGA_CARDS[activeIndex] : null;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const closeModal = () => {
    setActiveIndex(null);
    lastTriggerRef.current?.focus();
  };

  useEffect(() => {
    if (activeIndex === null) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveIndex(null);
        lastTriggerRef.current?.focus();
      } else if (event.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev === null ? null : (prev + 1) % NAVADURGA_CARDS.length));
      } else if (event.key === 'ArrowLeft') {
        setActiveIndex((prev) =>
          prev === null ? null : (prev - 1 + NAVADURGA_CARDS.length) % NAVADURGA_CARDS.length,
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex]);

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-24 rounded-3xl border border-saffron-400/35 bg-dharma-card/85 p-6 sm:p-8 shadow-soft backdrop-blur-xl space-y-6"
    >
      <div className="space-y-2">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          <span lang="hi" className="font-devanagari normal-case">दुर्गा सप्तशती · देवी कवच चित्र-माला</span>
          <span aria-hidden="true">·</span>
          <span>9-Day Visual Guide</span>
        </p>
        <h2 id={`${id}-heading`} className="font-serif text-xl sm:text-2xl font-bold text-dharma-text">
          <span lang="hi" className="font-devanagari">{headingHi}</span>
        </h2>
        <p className="text-xs sm:text-sm font-medium text-dharma-muted">{headingEn}</p>
        <p lang="hi" className="font-devanagari text-xs sm:text-sm text-dharma-muted leading-relaxed max-w-3xl">
          {subtitleHi}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {NAVADURGA_CARDS.map((card, idx) => (
          <figure
            key={card.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-dharma-border/80 bg-dharma-bg/70 shadow-xs transition-all hover:border-saffron-400/70 hover:shadow-raised"
          >
            <button
              type="button"
              onClick={(event) => {
                lastTriggerRef.current = event.currentTarget;
                setActiveIndex(idx);
              }}
              className="focus-ring relative block w-full overflow-hidden text-left"
              aria-label={`दिन ${card.day}: ${card.nameHi} (${card.nameEn}) — पूरा चित्र देखें`}
            >
              <img
                src={card.src}
                alt={card.alt}
                width={card.width}
                height={card.height}
                loading="lazy"
                decoding="async"
                className="h-auto w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
              />
              <span className="absolute left-3 top-3 inline-flex items-center rounded-full border border-white/30 bg-black/60 px-2.5 py-0.5 text-[11px] font-bold text-amber-200 backdrop-blur-md">
                Day {card.day} · दिवस {card.day}
              </span>
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white opacity-90 backdrop-blur-md transition group-hover:bg-saffron-700">
                <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
                <span>बड़ा देखें</span>
              </span>
            </button>
            <figcaption className="flex flex-1 flex-col justify-between gap-1.5 p-4">
              <div>
                <h3 className="font-serif text-base font-bold text-dharma-text">
                  <span lang="hi" className="font-devanagari">{card.nameHi}</span>{' '}
                  <span className="text-xs font-normal text-dharma-muted">({card.nameEn})</span>
                </h3>
                <p lang="hi" className="mt-1 font-devanagari text-xs text-dharma-muted leading-relaxed">
                  {card.themeHi}
                </p>
              </div>
              <p lang="sa" className="mt-1 border-t border-dharma-border/50 pt-2 font-devanagari text-xs font-semibold text-saffron-700 dark:text-saffron-300">
                {card.mantra}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Lightweight Accessible Lightbox Modal */}
      {active && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`दिन ${active.day} — ${active.nameHi}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
        >
          <button
            type="button"
            aria-label="पृष्ठभूमि पर क्लिक कर बन्द करें (Close lightbox)"
            onClick={closeModal}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm cursor-default"
          />
          <div
            className="relative z-10 flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-stone-950 text-white shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  Navratri Day {active.day} of 9 · नवरात्रि दिवस {active.day}
                </p>
                <p className="truncate font-serif text-base sm:text-lg font-bold">
                  <span lang="hi" className="font-devanagari">{active.nameHi}</span>{' '}
                  <span className="text-sm font-normal text-white/75">· {active.nameEn}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={active.src}
                  download={`dharma-granth-navratri-day-${active.day}-${active.id}.webp`}
                  aria-label={`दिन ${active.day} ${active.nameEn} डाउनलोड करें (Download)`}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Download</span>
                </a>
                <a
                  href={buildNavadurgaWhatsAppHref(active)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`दिन ${active.day} ${active.nameEn} WhatsApp पर शेयर करें (Share on WhatsApp)`}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-white transition"
                >
                  <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
                <a
                  href={active.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`दिन ${active.day} ${active.nameEn} मूल चित्र खोलें (Open original image)`}
                  className="inline-flex min-h-[38px] items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden md:inline">Original</span>
                </a>
                <button
                  ref={closeButtonRef}
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
                src={active.src}
                alt={active.alt}
                width={active.width}
                height={active.height}
                className="max-h-[72vh] w-auto rounded-xl object-contain shadow-xl"
              />
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3 sm:px-6">
              <button
                type="button"
                onClick={() =>
                  setActiveIndex((activeIndex - 1 + NAVADURGA_CARDS.length) % NAVADURGA_CARDS.length)
                }
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold hover:bg-white/20"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                <span>पिछला दिवस</span>
              </button>
              <p lang="sa" className="hidden sm:block font-devanagari text-sm font-semibold text-amber-200">
                {active.mantra}
              </p>
              <button
                type="button"
                onClick={() => setActiveIndex((activeIndex + 1) % NAVADURGA_CARDS.length)}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold hover:bg-white/20"
              >
                <span>अगला दिवस</span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
