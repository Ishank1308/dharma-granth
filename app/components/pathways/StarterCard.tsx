import Link from 'next/link';
import type { StarterPathway } from '@/data/wisdom-pathway-starters';

/**
 * Starter pathway card (MISSION Phases 5 + 8).
 * Server-rendered only — no client JS. Mapped starters link to their calm
 * reading page; starters still waiting for a canonical pathway link to the
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
  return (
    <article className="rounded-2xl border border-dharma-line bg-dharma-card p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted">{starter.questionEn}</p>
      <h2 className="mt-1 font-serif text-xl">
        {mapped ? (
          <Link href={`/pathways/${starter.slug}/`} className="hover:underline">
            {starter.titleEn}
          </Link>
        ) : (
          starter.titleEn
        )}
      </h2>
      <p lang="hi" className="mt-0.5 text-base text-dharma-muted">
        {starter.titleHi}
      </p>
      <p className="mt-2 text-sm leading-relaxed">{starter.introductionEn}</p>
      {mapped ? (
        <p className="mt-3">
          <Link
            href={`/pathways/${starter.slug}/`}
            className="inline-block min-h-[44px] rounded-full border border-dharma-line px-4 py-2 text-sm font-semibold"
          >
            Walk this path
          </Link>
        </p>
      ) : (
        <div className="mt-3">
          <p className="text-xs text-dharma-muted">This path is still being written. Begin here:</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {topicLinks.map((t) => (
              <li key={t.slug}>
                <Link
                  href={t.href}
                  className="inline-block min-h-[44px] rounded-full border border-dharma-line px-3 py-2 text-sm"
                >
                  {t.slug.replace(/-/g, ' ')}
                </Link>
              </li>
            ))}
            {questionLinks.map((q) => (
              <li key={q.href}>
                <Link
                  href={q.href}
                  className="inline-block min-h-[44px] rounded-full border border-dharma-line px-3 py-2 text-sm"
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
