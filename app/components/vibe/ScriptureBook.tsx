import type { CSSProperties } from 'react';
import type { ScriptureVibe } from '@/lib/scripture-vibes';
import { Motif } from './Motif';

/**
 * The scripture opening like a book: the cover swings open on its spine, two
 * leaves flutter after it and settle, and the title page shows the text's
 * epigraph. Pure CSS (globals.css .sbook-*), so it plays from the static
 * HTML without waiting for JavaScript and replays on each visit. Reduced
 * motion shows the book already open.
 */
export function ScriptureBook({
  vibe,
  titleSa,
  titleEn,
  className = '',
}: {
  vibe: ScriptureVibe;
  titleSa: string;
  titleEn: string;
  className?: string;
}) {
  const style = {
    '--cover-1': vibe.cover[0],
    '--cover-2': vibe.cover[1],
    '--cover-3': vibe.cover[2],
    '--foil': vibe.foil,
  } as CSSProperties;

  return (
    <div className={`sbook-stage ${className}`} style={style}>
      <div className="sbook">
        <div className="sbook-body">
          {/* The block of pages and the title page inside */}
          <div className="sbook-block" aria-hidden="true" />
          <div className="sbook-titlepage">
            <Motif id={vibe.motif} className="h-9 w-9 text-[color:var(--cover-2)] opacity-70" />
            {vibe.epigraph ? (
              <figure className="mt-3">
                <blockquote lang="sa" className="shloka-text text-subhead text-[#3b2a1a] sm:text-base">
                  {vibe.epigraph.sa}
                </blockquote>
                <figcaption lang="hi" className="mt-2 font-devanagari text-[11px] text-[#7a6248]">
                  {vibe.epigraph.source}
                </figcaption>
              </figure>
            ) : (
              <p lang="sa" className="shloka-text mt-3 text-xl text-[#3b2a1a]">
                {titleSa}
              </p>
            )}
            <span aria-hidden="true" className="mt-3 block font-sanskrit text-sm text-[color:var(--cover-2)]">
              ॥ श्रीः ॥
            </span>
          </div>

          {/* Leaves that turn after the cover */}
          <div className="sbook-leaf sbook-leaf-2" aria-hidden="true" />
          <div className="sbook-leaf sbook-leaf-1" aria-hidden="true" />

          {/* The cover */}
          <div className={`sbook-cover sbook-${vibe.material}`} aria-hidden="true">
            <div className="sbook-cover-front">
              <div className="sbook-frame">
                <Motif id={vibe.motif} className="h-16 w-16 text-[color:var(--foil)] sm:h-20 sm:w-20" />
                <p lang="sa" className="shloka-text mt-3 text-center text-xl text-[color:var(--foil)] sm:text-2xl">
                  {titleSa}
                </p>
                <p className="mt-1 text-center font-serif text-xs uppercase tracking-[0.2em] text-[color:var(--foil)] opacity-80">{titleEn}</p>
              </div>
            </div>
            <div className="sbook-cover-back" />
          </div>
        </div>
      </div>
    </div>
  );
}
