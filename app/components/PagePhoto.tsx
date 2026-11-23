import type { CoverPhoto } from '@/lib/page-photos';

/**
 * A picture at the top of a page outside the reader (lib/page-photos.ts). Plain markup with no
 * state, so it renders the same on the server and works inside client pages. The picture is a CSS
 * background (app/styles/page-photos.css) with an isolated compositor cinemagraph layer
 * (.cinemagraph-fx) so the still frame stays anchored while only one localized element (a diya
 * flame, water glint, valley mist, or sunbeam) breathes smoothly. Data Saver loads none, and
 * Reduce Motion, low-power, print and forced colours keep it completely still.
 */
function Credit({ photo, className }: { photo: CoverPhoto; className: string }) {
  return (
    <a href={`/sources/#picture-${photo}`} className={`page-photo-credit focus-ring text-caption-1 ${className}`}>
      {/* One wrapper, so the link's flex box keeps the spaces between the two languages. */}
      <span>
        <span data-bi="en">Picture credit</span> <span aria-hidden="true" data-bi="sep">·</span>{' '}
        <span lang="hi" data-bi="hi" className="font-devanagari">
          चित्र-श्रेय
        </span>
      </span>
    </a>
  );
}

/** A wide picture with rounded corners above a page's title, with an isolated cinemagraph layer. */
export function PageCover({ photo, className = '' }: { photo: CoverPhoto; className?: string }) {
  return (
    <div className={`page-cover ${className}`} data-photo={photo}>
      <span className="page-cover-art" aria-hidden="true">
        <span className="cinemagraph-fx" />
      </span>
      <Credit photo={photo} className="page-cover-credit" />
    </div>
  );
}

/**
 * The picture under a coloured page hero (festival and character pages). Put it first inside the
 * hero, which must be `relative` and `isolate`: the hero keeps its own colour over the picture,
 * and its white text sits on a shade of it.
 */
export function HeroPhoto({ photo }: { photo: CoverPhoto }) {
  return (
    <>
      <span className="hero-photo" data-photo={photo} aria-hidden="true">
        <span className="cinemagraph-fx" />
      </span>
      <Credit photo={photo} className="hero-photo-credit" />
    </>
  );
}
