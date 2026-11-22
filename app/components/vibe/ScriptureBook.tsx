import type { CSSProperties } from 'react';
import Link from 'next/link';
import type { ScriptureVibe } from '@/lib/scripture-vibes';
import type { PhotoId } from '@/lib/scene-photos';
import { Motif } from './Motif';
import './book-cover.css';

/**
 * The scripture as a bound devotional edition (book-cover.css). The closed cover shows first:
 * a leather spine with raised bands, cloth or silk boards in the text's colours, a foil-stamped
 * border with corner ornaments, the emblem in a lotus medallion and the title in gold. A glint
 * crosses the foil, the cover swings open on its spine and two leaves turn after it. The spread
 * then shows a frontispiece picture (the text's own painting or photograph, lib/book-covers.ts)
 * facing the title page with its epigraph, gilt page edges and a silk ribbon.
 *
 * Pure CSS, so it plays from the static HTML without waiting for JavaScript and adds no script.
 * Reduce Motion shows the book already open; Data Saver, print and forced colours show the
 * emblem in place of the picture.
 */
export function ScriptureBook({
  vibe,
  titleSa,
  titleEn,
  picture,
  className = '',
}: {
  vibe: ScriptureVibe;
  titleSa: string;
  titleEn: string;
  picture?: PhotoId;
  className?: string;
}) {
  const style = {
    '--cover-1': vibe.cover[0],
    '--cover-2': vibe.cover[1],
    '--cover-3': vibe.cover[2],
    '--foil': vibe.foil,
  } as CSSProperties;

  return (
    <div data-vt-hero className={`sbook-wrap ${className}`} style={style}>
      <div className="sbook-stage">
        <div className="sbook">
          <div className="sbook-body">
            {/* The block of pages, gilt at the fore-edge, and the title page inside */}
            <div className="sbook-block" aria-hidden="true" />
            <div className="sbook-titlepage">
              <div className="sbook-titlepage-frame">
                <Motif id={vibe.motif} className="sbook-titlepage-motif" />
                {vibe.epigraph ? (
                  <figure className="sbook-epigraph">
                    <blockquote lang="sa" className="shloka-text">
                      {vibe.epigraph.sa}
                    </blockquote>
                    <figcaption lang="hi" className="font-devanagari">
                      {vibe.epigraph.source}
                    </figcaption>
                  </figure>
                ) : (
                  <p lang="sa" className="shloka-text sbook-epigraph sbook-epigraph-title">
                    {titleSa}
                  </p>
                )}
                <span aria-hidden="true" className="sbook-shrih font-sanskrit">
                  ॥ श्रीः ॥
                </span>
              </div>
            </div>
            <span className="sbook-ribbon" aria-hidden="true" />

            {/* Leaves that turn after the cover; the top one carries the frontispiece on its back */}
            <div className="sbook-leaf sbook-leaf-2" aria-hidden="true">
              <div className="sbook-frontis">
                <div className="sbook-frontis-window">
                  <Motif id={vibe.motif} className="sbook-frontis-motif" />
                  {picture && <span className="sbook-frontis-art" data-photo={picture} />}
                </div>
                <FoilRule className="sbook-frontis-rule" />
              </div>
            </div>
            <div className="sbook-leaf sbook-leaf-1" aria-hidden="true" />

            {/* The cover */}
            <div className={`sbook-cover sbook-${vibe.material}`} aria-hidden="true">
              <div className="sbook-cover-front">
                <span className="sbook-spine" />
                <div className="sbook-frame">
                  <Corner className="sbook-corner sbook-corner-tl" />
                  <Corner className="sbook-corner sbook-corner-tr" />
                  <Corner className="sbook-corner sbook-corner-bl" />
                  <Corner className="sbook-corner sbook-corner-br" />
                  <FoilRule className="sbook-cover-rule" />
                  <div className="sbook-medallion">
                    <Rosette />
                    <Motif id={vibe.motif} className="sbook-medallion-motif" />
                  </div>
                  <p lang="sa" className="shloka-text sbook-cover-title">
                    {titleSa}
                  </p>
                  <p className="sbook-cover-subtitle font-serif">{titleEn}</p>
                  <FoilRule className="sbook-cover-rule" />
                </div>
                <span className="sbook-glint" />
              </div>
              <div className="sbook-cover-back" />
            </div>
          </div>
        </div>
      </div>
      {picture && (
        <p className="sbook-credit text-dharma-muted">
          <Link href="/sources/#picture-credits" className="focus-ring rounded">
            <span data-bi="en">Picture credit</span>{' '}
            <span data-bi="sep">· </span>
            <span lang="hi" data-bi="hi" className="font-devanagari">
              चित्र-श्रेय
            </span>
          </Link>
        </p>
      )}
    </div>
  );
}

/** A foil corner: a double rule bent round the corner, with a small lotus bud on the diagonal. */
function Corner({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 37V3h34" strokeWidth="1.6" />
      <path d="M8 37V8h29" strokeWidth="0.8" />
      <path d="M8 8c3 9 9 13 18 13M8 8c9 3 13 9 13 18" strokeWidth="1" />
      <path d="M13 13c5-1 8 2 8 8-6 0-9-3-8-8Z" strokeWidth="1.1" />
      <circle cx="26" cy="26" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="33" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="33" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const PETALS = Array.from({ length: 16 }, (_, i) => i * 22.5);

/** The medallion: two rings with sixteen lotus petals between them and a ring of dots inside. */
function Rosette() {
  return (
    <svg viewBox="0 0 120 120" className="sbook-rosette" aria-hidden="true" focusable="false" fill="none" stroke="currentColor">
      <circle cx="60" cy="60" r="57" strokeWidth="1.4" />
      <circle cx="60" cy="60" r="54" strokeWidth="0.6" />
      {PETALS.map((angle) => (
        <path key={angle} d="M60 7c4 4 5 9 0 14-5-5-4-10 0-14Z" strokeWidth="0.9" transform={`rotate(${angle} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="38" strokeWidth="1.2" />
      <circle cx="60" cy="60" r="35" strokeWidth="0.5" strokeDasharray="0.1 3.4" strokeLinecap="round" />
    </svg>
  );
}

/** A short foil rule: two lines meeting at a diamond. */
function FoilRule({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 80 8" className={className} aria-hidden="true" focusable="false" fill="none" stroke="currentColor">
      <path d="M2 4h30M48 4h30" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M40 0.8 43.2 4 40 7.2 36.8 4Z" fill="currentColor" stroke="none" />
      <circle cx="34" cy="4" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="46" cy="4" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
