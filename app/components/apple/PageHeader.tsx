import type { ReactNode } from 'react';

/**
 * The inner-page title in the Apple idiom used by the library page: a small eyebrow, one large
 * title, its Hindi line as a separate element and a short lead. A server component, so the whole
 * header is in the exported HTML. Sizes come from the type scale (app/styles/tokens.css).
 */
export function PageHeader({
  eyebrow,
  eyebrowHi,
  title,
  titleHi,
  titleLang = 'hi',
  lead,
  children,
  id,
}: {
  eyebrow: string;
  eyebrowHi?: string;
  title: ReactNode;
  titleHi?: string;
  /** `sa` when the second line is a Sanskrit phrase rather than Hindi. */
  titleLang?: 'hi' | 'sa';
  lead?: ReactNode;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <header className="mx-auto max-w-content px-gutter pb-2 pt-10 sm:pt-16">
      <Eyebrow text={eyebrow} hi={eyebrowHi} />
      <h1 id={id} className="mt-2 text-large-title font-semibold text-dharma-text">
        <span>{title}</span>
        {titleHi && (
          <>
            {' '}
            <span
              lang={titleLang}
              className={`mt-1 block text-title-2 font-normal text-dharma-muted ${titleLang === 'sa' ? 'font-sanskrit' : 'font-devanagari'}`}
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
export function Eyebrow({ text, hi, className = '' }: { text: string; hi?: string; className?: string }) {
  return (
    <p className={`text-footnote font-semibold text-dharma-saffron ${className}`}>
      <span>{text}</span>
      {hi && (
        <>
          {' '}
          <span aria-hidden="true">·</span>{' '}
          <span lang="hi" className="font-devanagari">
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
    <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div>
        {eyebrow && <Eyebrow text={eyebrow} hi={eyebrowHi} className="mb-1.5" />}
        <h2 id={id} className={`${size === 'title-1' ? 'text-title-1' : 'text-title-2'} font-semibold text-dharma-text`}>
          <span>{title}</span>
          {titleHi && (
            <>
              {' '}
              <span lang="hi" className="ml-1 font-devanagari text-title-3 font-normal text-dharma-muted">
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
