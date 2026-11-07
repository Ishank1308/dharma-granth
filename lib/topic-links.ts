/**
 * The old /topics/<id>/ pages were folded into /wisdom-for-life/. public/_redirects 301s each old URL; this map
 * mirrors those lines so internal links, search results and the sitemap point straight at the canonical page
 * instead of through a redirect.
 */
const TOPIC_TO_WISDOM: Record<string, string> = {
  'career-workplace-ethics': 'skill-in-work',
  'stress-anxiety': 'stress-and-worry',
  'relationships-marriage': 'relationships',
  parenting: 'family-responsibilities',
  'student-life': 'discipline',
  'social-media-addiction': 'self-control',
  'money-responsible-wealth': 'contentment',
  leadership: 'leadership',
  'environmental-responsibility': 'duty-and-decision-making',
  'anger-jealousy': 'anger',
  'grief-death': 'grief-and-loss',
  'discipline-habit-formation': 'discipline',
};

export const WISDOM_INDEX_HREF = '/wisdom-for-life/';

/** Canonical page for an old topic id (falls back to the same slug, as the catch-all redirect does). */
export function topicHref(id: string): string {
  return `/wisdom-for-life/${TOPIC_TO_WISDOM[id] ?? id}/`;
}

export function topicWisdomSlug(id: string): string {
  return TOPIC_TO_WISDOM[id] ?? id;
}
