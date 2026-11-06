import type { ReactNode } from 'react';

type SectionHeadingProps = {
  /** Heading id (used by the section's aria-labelledby). */
  id: string;
  /** Small Sanskrit kicker, e.g. "प्रमुख ग्रंथ". */
  kickerSa: string;
  /** English kicker shown after the Sanskrit one. */
  kickerEn: string;
  /** Main heading text. */
  title: string;
  /** Optional supporting line under the heading. */
  description?: string;
  /** Optional right-side content (link, date pill). */
  aside?: ReactNode;
  /** Override for the title size when a section needs more presence. */
  titleClassName?: string;
  /** Language of the Sanskrit/Hindi kicker (default Sanskrit). */
  kickerLang?: 'sa' | 'hi';
};

/**
 * The site's standard section header: live-dot kicker, serif title, a rule
 * that grows as the section scrolls in (CSS scroll timeline, SSR-safe), and
 * an optional right-side slot. Keeps every section opening in one shared
 * rhythm instead of drifting per page.
 */
export function SectionHeading({ id, kickerSa, kickerEn, title, description, aside, titleClassName, kickerLang = 'sa' }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2.5 flex items-center gap-2">
          <span className="size-2 rounded-full bg-saffron-600 animate-pulse ring-4 ring-saffron-500/20" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-saffron-700 dark:text-saffron-400">
            <span lang={kickerLang} className="font-devanagari">
              {kickerSa}
            </span>{' '}
            · {kickerEn}
          </p>
        </div>
        <h2 id={id} className={titleClassName ?? 'font-serif text-2xl font-bold text-dharma-text sm:text-3xl'}>
          {title}
        </h2>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-dharma-muted">{description}</p>
        ) : null}
        <span aria-hidden="true" className="rule-grow mt-4 block h-px w-24 bg-gradient-to-r from-saffron-600 via-amber-400 to-transparent" />
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  );
}
