import Link from 'next/link';
import type { StarterPathway } from '@/data/wisdom-pathway-starters';

/**
 * Starter pathway card (MISSION Phases 5 + 8).
 * Server-rendered only — no client JS. Mapped starters link to their
 * canonical /wisdom-pathways/ reading page; starters still waiting for a canonical pathway link to the
 * validated topics and questions instead (editorial links only).
 */
export function StarterCard({
  starter,
  topicLinks,
  questionLinks,
}: {
  starter: StarterPathway;
  topicLinks: Array<{ slug: string; href: string }>;
  questionLinks: Array<{ href: string; labelEn: string; labelHi: string }>;
}) {
  const mapped = starter.pathwaySlug !== null;
  const ensureSlash = (href: string) =>
    href.endsWith('/') || href.includes('#') || href.includes('?') ? href : `${href}/`;

  return (
    <article className="card-sacred flex flex-col justify-between rounded-2xl border border-dharma-border/80 bg-dharma-card/85 backdrop-blur-xl p-5 sm:p-6 shadow-soft transition hover:border-saffron-400/50 hover:shadow-md">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-dharma-saffron">{starter.questionEn}</p>
        <h3 className="mt-1.5 font-serif text-xl font-semibold text-dharma-text">
          {mapped ? (
            <Link href={`/wisdom-pathways/${starter.pathwaySlug}/`} className="hover:text-dharma-saffron hover:underline">
              {starter.titleEn}
            </Link>
          ) : (
            starter.titleEn
          )}
        </h3>
        <p lang="hi" className="mt-0.5 font-devanagari text-base text-dharma-muted">
          {starter.titleHi}
        </p>
        <p className="mt-2.5 text-sm leading-relaxed text-dharma-text-secondary">{starter.introductionEn}</p>
      </div>

      {mapped ? (
        <div className="mt-4 pt-3 border-t border-dharma-border/60">
          <Link
            href={`/wisdom-pathways/${starter.pathwaySlug}/`}
            className="liquid-pill focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-saffron-500/40 bg-saffron-500/10 backdrop-blur-md px-4 py-2 text-xs font-semibold text-saffron-800 dark:text-saffron-300 hover:bg-saffron-500/20 transition shadow-xs"
          >
            <span>Walk this path · मार्ग पर चलें</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      ) : (
        <div className="mt-4 pt-3 border-t border-dharma-border/60">
          <p className="text-xs text-dharma-muted">Begin directly with verified scripture passages:</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {topicLinks.map((t) => (
              <li key={t.slug}>
                <Link
                  href={ensureSlash(t.href)}
                  className="liquid-pill focus-ring inline-flex min-h-[44px] items-center rounded-full border border-dharma-border/80 bg-dharma-bg/70 backdrop-blur-sm px-3.5 py-2 text-xs font-medium capitalize text-dharma-text hover:border-saffron-400 transition"
                >
                  {t.slug.replace(/-/g, ' ')}
                </Link>
              </li>
            ))}
            {questionLinks.map((q) => (
              <li key={q.href}>
                <Link
                  href={ensureSlash(q.href)}
                  className="focus-ring inline-flex min-h-[44px] items-center rounded-full border border-dharma-border bg-dharma-bg px-3.5 py-2 text-xs font-medium text-dharma-text hover:border-saffron-400 transition"
                >
                  {q.labelEn}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
