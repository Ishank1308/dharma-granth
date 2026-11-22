/* eslint-disable @next/next/no-img-element */
import { Download, ExternalLink, Share2, Sparkles } from 'lucide-react';
import { buildPosterWhatsAppHref, type WisdomPoster } from '@/data/curated-visuals';

/**
 * Pure Server Component (0 KB client JS) for illustrated verse contemplation cards.
 * Kept separate from client lightbox components so verse pages never pull any extra JS chunks.
 */
export function VersePosterSpotlight({ poster }: { poster: WisdomPoster }) {
  const downloadName = `dharma-granth-${poster.id}.webp`;
  const whatsappHref = buildPosterWhatsAppHref(poster);

  return (
    <section
      aria-labelledby={`verse-poster-${poster.id}`}
      className="mt-8 rounded-3xl border border-saffron-400/35 bg-dharma-card/85 p-5 sm:p-7 shadow-soft"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span lang="hi" className="font-devanagari normal-case">चित्र-दर्शन</span>
            <span aria-hidden="true">·</span>
            <span>Illustrated Contemplation</span>
          </p>
          <h2 id={`verse-poster-${poster.id}`} className="mt-1 font-serif text-xl font-bold text-dharma-text">
            <span lang="hi" className="font-devanagari">{poster.titleHi}</span>
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={poster.src}
            download={downloadName}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-bg px-3.5 py-1.5 text-xs font-semibold text-dharma-text hover:border-saffron-400"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span lang="hi" className="font-devanagari">डाउनलोड</span>
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 px-3.5 py-1.5 text-xs font-semibold text-white transition"
          >
            <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>WhatsApp</span>
          </a>
          <a
            href={poster.src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-bg px-3.5 py-1.5 text-xs font-semibold text-dharma-text hover:border-saffron-400"
          >
            <span lang="hi" className="font-devanagari">पूर्ण चित्र</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="grid items-center gap-6 md:grid-cols-[minmax(0,280px)_1fr]">
        <a
          href={poster.src}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto block w-full max-w-[280px] overflow-hidden rounded-2xl border border-dharma-border shadow-md transition-transform hover:scale-[1.015]"
        >
          <img
            src={poster.src}
            alt={poster.alt}
            width={poster.width}
            height={poster.height}
            loading="lazy"
            decoding="async"
            className="h-auto w-full object-cover"
          />
        </a>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-dharma-muted">
            {poster.referenceHi} · {poster.referenceEn}
          </p>
          <p lang="hi" className="font-devanagari text-base leading-relaxed text-dharma-text">
            {poster.captionHi}
          </p>
          <p className="text-sm leading-relaxed text-dharma-muted">{poster.captionEn}</p>
        </div>
      </div>
    </section>
  );
}
