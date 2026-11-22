/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { ExternalLink, Sparkles } from 'lucide-react';
import type { EditorialScene, WisdomPoster } from '@/data/curated-visuals';

/**
 * Pure server-renderable visual showcase components (0 KB client JS).
 * Respects accessible alt text, explicit width/height for zero CLS, and trailing-slash internal links.
 */

export function EditorialSceneBanner({
  scene,
  className = '',
  compact = false,
  eyebrowHi,
  eyebrowEn,
}: {
  scene: EditorialScene;
  className?: string;
  compact?: boolean;
  eyebrowHi?: string;
  eyebrowEn?: string;
}) {
  return (
    <figure
      className={`group relative overflow-hidden rounded-3xl border border-dharma-border/80 bg-dharma-card shadow-soft ${className}`}
    >
      <div className={`relative w-full overflow-hidden ${compact ? 'aspect-[16/9]' : 'aspect-[16/9] sm:aspect-[21/9]'}`}>
        <img
          src={scene.src}
          alt={scene.alt}
          width={scene.width}
          height={scene.height}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center transition-transform duration-700 motion-safe:group-hover:scale-[1.03]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5"
        />
        <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-white">
          {(eyebrowHi || eyebrowEn) && (
            <p className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/35 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-amber-200 backdrop-blur-sm">
              {eyebrowHi && <span lang="hi" className="font-devanagari">{eyebrowHi}</span>}
              {eyebrowHi && eyebrowEn && <span aria-hidden="true">·</span>}
              {eyebrowEn && <span>{eyebrowEn}</span>}
            </p>
          )}
          <p className="font-serif text-lg sm:text-xl font-bold leading-snug tracking-tight drop-shadow-sm">
            <span lang="hi" className="font-devanagari">{scene.titleHi}</span>
            <span className="ml-2 text-sm font-normal text-white/80 hidden sm:inline">· {scene.titleEn}</span>
          </p>
          <p lang="hi" className="mt-1 max-w-2xl font-devanagari text-xs sm:text-sm text-white/90 leading-relaxed line-clamp-2">
            {scene.captionHi}
          </p>
        </figcaption>
      </div>
    </figure>
  );
}

export function WisdomPosterCard({
  poster,
  showLink = true,
  className = '',
}: {
  poster: WisdomPoster;
  showLink?: boolean;
  className?: string;
}) {
  return (
    <figure
      className={`group flex flex-col overflow-hidden rounded-3xl border border-dharma-border/80 bg-dharma-card shadow-soft transition-all hover:border-saffron-400/60 hover:shadow-raised ${className}`}
    >
      <a
        href={poster.src}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block overflow-hidden bg-stone-950/5"
        title={`${poster.titleEn} — पूरा चित्र खोलें`}
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
        <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
          <span>बड़ा देखें</span>
        </span>
      </a>
      <figcaption className="flex flex-1 flex-col justify-between gap-3 p-4 sm:p-5">
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
            <span lang="hi" className="font-devanagari normal-case">{poster.referenceHi}</span>
            <span aria-hidden="true"> · </span>
            <span>{poster.referenceEn}</span>
          </p>
          <h3 className="font-serif text-base sm:text-lg font-bold text-dharma-text leading-snug">
            <span lang="hi" className="font-devanagari">{poster.titleHi}</span>
          </h3>
          <p lang="hi" className="font-devanagari text-xs sm:text-sm text-dharma-muted leading-relaxed">
            {poster.captionHi}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dharma-border/60 pt-3 text-xs">
          {showLink ? (
            <Link
              href={poster.href}
              className="inline-flex min-h-[36px] items-center gap-1 font-semibold text-saffron-700 dark:text-saffron-300 hover:underline"
            >
              <span lang="hi" className="font-devanagari">शास्त्र / व्याख्या पढ़ें</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          ) : (
            <span className="text-dharma-muted">{poster.titleEn}</span>
          )}
          <a
            href={poster.src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[36px] items-center gap-1 text-dharma-muted hover:text-dharma-text"
          >
            <span>Full image</span>
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </figcaption>
    </figure>
  );
}

export function VersePosterSpotlight({ poster }: { poster: WisdomPoster }) {
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
        <a
          href={poster.src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-bg px-3.5 py-1.5 text-xs font-semibold text-dharma-text hover:border-saffron-400"
        >
          <span lang="hi" className="font-devanagari">पूर्ण चित्र खोलें</span>
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
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
