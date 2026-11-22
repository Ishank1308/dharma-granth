/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Download, Share2 } from 'lucide-react';
import { buildPosterWhatsAppHref, type EditorialScene, type WisdomPoster } from '@/data/curated-visuals';
import { WisdomPosterLightbox } from './WisdomPosterLightbox';

/**
 * Curated visual showcase components.
 * - EditorialSceneBanner & VersePosterSpotlight stay 0 KB client JS.
 * - WisdomPosterCard delegates modal zoom + Download/WhatsApp actions to WisdomPosterLightbox.
 * - Decorative scene banners carry `.curated-scene-media` so Data Saver & print hide them cleanly.
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
      className={`curated-scene-media group relative overflow-hidden rounded-3xl border border-dharma-border/80 bg-dharma-card shadow-soft ${className}`}
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
  const downloadName = `dharma-granth-${poster.id}.webp`;
  const whatsappHref = buildPosterWhatsAppHref(poster);

  return (
    <figure
      className={`group flex flex-col overflow-hidden rounded-3xl border border-dharma-border/80 bg-dharma-card shadow-soft transition-all hover:border-saffron-400/60 hover:shadow-raised ${className}`}
    >
      <WisdomPosterLightbox poster={poster} showLink={showLink} />
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
          <div className="flex items-center gap-2">
            <a
              href={poster.src}
              download={downloadName}
              aria-label={`${poster.titleEn} डाउनलोड करें`}
              className="inline-flex min-h-[36px] items-center gap-1 rounded-full border border-dharma-border bg-dharma-bg px-2.5 py-1 text-dharma-text hover:border-saffron-400"
            >
              <Download className="h-3 w-3" aria-hidden="true" />
              <span>Save</span>
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${poster.titleEn} WhatsApp पर शेयर करें`}
              className="inline-flex min-h-[36px] items-center gap-1 rounded-full bg-emerald-700 px-2.5 py-1 font-semibold text-white hover:bg-emerald-800 transition"
            >
              <Share2 className="h-3 w-3" aria-hidden="true" />
              <span>Share</span>
            </a>
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

