import type { ReactNode } from 'react';

/**
 * The inner-page title in the Apple idiom used by the library page: a small eyebrow, one large
 * title, its Hindi line as a separate element and a short lead. A server component, so the whole
 * header is in the exported HTML.
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
    <header className="mx-auto max-w-[980px] px-5 pb-2 pt-10 sm:px-6 sm:pt-16">
      <p className="text-[13px] font-semibold text-dharma-saffron">
        <span>{eyebrow}</span>
        {eyebrowHi && (
          <>
            {' '}
            <span aria-hidden="true">·</span>{' '}
            <span lang="hi" className="font-devanagari">
              {eyebrowHi}
            </span>
          </>
        )}
      </p>
      <h1 id={id} className="mt-2 text-[34px] font-semibold leading-[1.08] tracking-[-0.03em] text-dharma-text sm:text-5xl">
        <span>{title}</span>
        {titleHi && (
          <>
            {' '}
            <span
              lang={titleLang}
              className={`mt-1 block text-2xl font-normal tracking-normal text-dharma-muted sm:text-[30px] ${titleLang === 'sa' ? 'font-sanskrit' : 'font-devanagari'}`}
            >
              {titleHi}
            </span>
          </>
        )}
      </h1>
      {lead && <div className="mt-4 max-w-2xl text-[17px] leading-relaxed text-dharma-muted">{lead}</div>}
      {children}
    </header>
  );
}

/** A section heading with an optional Hindi line and a trailing link, as on the home page. */
export function SectionTitle({
  id,
  title,
  titleHi,
  sub,
  action,
}: {
  id?: string;
  title: string;
  titleHi?: string;
  sub?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div>
        <h2 id={id} className="text-[24px] font-semibold tracking-[-0.025em] text-dharma-text sm:text-[32px]">
          <span>{title}</span>
          {titleHi && (
            <>
              {' '}
              <span lang="hi" className="ml-1 font-devanagari text-base font-normal tracking-normal text-dharma-muted sm:text-[20px]">
                {titleHi}
              </span>
            </>
          )}
        </h2>
        {sub && <p className="mt-1 text-[15px] text-dharma-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
