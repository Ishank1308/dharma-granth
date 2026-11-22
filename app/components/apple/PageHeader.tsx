import type { ReactNode } from 'react';

/**
 * The inner-page title in the Apple idiom used by the library page: a small eyebrow, one large
 * title, its Hindi line as a separate element and a short lead. A server component, so the whole
 * header is in the exported HTML. Sizes come from the type scale (app/styles/tokens.css).
 *
 * English and Hindi halves carry data-bi, so the reader's language choice shows one of them
 * (app/styles/components.css, "Two-language labels"). A Sanskrit phrase is not a translation of
 * the English beside it, so it is left unmarked and always shows.
 */
export function PageHeader({
  eyebrow,
  eyebrowHi,
  eyebrowLang = 'hi',
  title,
  titleHi,
  titleLang = 'hi',
  lead,
  cover,
  children,
  id,
  width = 'content',
}: {
  eyebrow: string;
  eyebrowHi?: string;
  /** `sa` when the eyebrow's second part is a Sanskrit phrase. */
  eyebrowLang?: 'hi' | 'sa';
  title: ReactNode;
  titleHi?: string;
  /** `sa` when the second line is a Sanskrit phrase rather than Hindi. */
  titleLang?: 'hi' | 'sa';
  lead?: ReactNode;
  /** A picture above the eyebrow (`<PageCover />`, app/components/PagePhoto.tsx). */
  cover?: ReactNode;
  children?: ReactNode;
  id?: string;
  /** `wide` lines the header up with a full-width grid below it (the library). */
  width?: 'content' | 'wide';
}) {
  const bi = Boolean(titleHi) && titleLang === 'hi';
  return (
    <header className={`relative mx-auto min-w-0 ${width === 'wide' ? 'max-w-7xl' : 'max-w-content'} px-gutter pb-2 ${cover ? 'pt-6 sm:pt-10' : 'pt-10 sm:pt-16'}`}>
      <div className="aura-header pointer-events-none absolute -top-10 left-1/2 -z-10 h-64 w-[90%] -translate-x-1/2 rounded-full opacity-60 blur-3xl transition-opacity duration-700" aria-hidden="true" />
      {cover}
      <Eyebrow text={eyebrow} hi={eyebrowHi} lang={eyebrowLang} className="eyebrow-capsule" />
      <h1 id={id} className="mt-3 min-w-0 text-large-title leading-tight font-semibold text-dharma-text [overflow-wrap:anywhere]">
        <span className="ink-dawn" data-bi={bi ? 'en' : undefined}>{title}</span>
        {titleHi && (
          <>
            {' '}
            <span
              lang={titleLang}
              data-bi={bi ? 'hi' : undefined}
              data-bi-lead={bi ? '' : undefined}
              className={`mt-1 block max-w-full text-title-2 font-normal leading-snug text-dharma-muted [overflow-wrap:anywhere] ${titleLang === 'sa' ? 'font-sanskrit' : 'font-devanagari'}`}
            >
              {titleHi}
            </span>
          </>
        )}
      </h1>
      {lead && <div className="mt-4 max-w-2xl text-body leading-relaxed text-dharma-muted">{lead}</div>}
      {children}
    </header>
  );
}

/** The small tinted line above a title: English, then its Hindi as a separate element. */
export function Eyebrow({
  text,
  hi,
  lang = 'hi',
  className = '',
}: {
  text: string;
  hi?: string;
  lang?: 'hi' | 'sa';
  className?: string;
}) {
  const bi = Boolean(hi) && lang === 'hi';
  return (
    <p className={`min-w-0 text-footnote font-semibold text-dharma-saffron [overflow-wrap:anywhere] ${className}`}>
      <span data-bi={bi ? 'en' : undefined}>{text}</span>
      {hi && (
        <>
          {' '}
          <span aria-hidden="true" data-bi={bi ? 'sep' : undefined}>·</span>{' '}
          <span lang={lang} data-bi={bi ? 'hi' : undefined} className={lang === 'sa' ? 'font-sanskrit' : 'font-devanagari'}>
            {hi}
          </span>
        </>
      )}
    </p>
  );
}

/**
 * The section heading every page shares, so each section opens in the same rhythm: an optional
 * eyebrow, the title with its Hindi line, an optional sub line, a trailing link, and a short
 * tinted rule that draws itself in as the section scrolls into view (motion.css, section 9).
 */
export function SectionTitle({
  id,
  title,
  titleHi,
  eyebrow,
  eyebrowHi,
  sub,
  action,
  size = 'title-2',
  rule = true,
}: {
  id?: string;
  title: string;
  titleHi?: string;
  eyebrow?: string;
  eyebrowHi?: string;
  sub?: ReactNode;
  action?: ReactNode;
  /** `title-1` for a page's main sections (the home library), `title-2` otherwise. */
  size?: 'title-1' | 'title-2';
  rule?: boolean;
}) {
  return (
    <div className="mb-5 flex min-w-0 flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div className="min-w-0 max-w-full">
        {eyebrow && <Eyebrow text={eyebrow} hi={eyebrowHi} className="mb-1.5" />}
        <h2 id={id} className={`${size === 'title-1' ? 'text-title-1' : 'text-title-2'} min-w-0 font-semibold text-dharma-text [overflow-wrap:anywhere]`}>
          <span data-bi={titleHi ? 'en' : undefined}>{title}</span>
          {titleHi && (
            <>
              {' '}
              <span lang="hi" data-bi="hi" data-bi-lead className="ml-1 font-devanagari text-title-3 font-normal text-dharma-muted">
                {titleHi}
              </span>
            </>
          )}
        </h2>
        {sub && <p className="mt-1 text-subhead text-dharma-muted">{sub}</p>}
        {rule && <span aria-hidden="true" className="section-rule" />}
      </div>
      {action}
    </div>
  );
}
