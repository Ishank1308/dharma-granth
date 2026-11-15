import { getConceptDetail } from '@/data/concept-details';
import { graphPageIds } from '@/data/knowledge-graph';

const GRAPH_PAGES = new Set(graphPageIds());

/** True when /concepts/<id>/ is an exported page (a concept article or a knowledge-graph page). */
export function hasConceptPage(id: string): boolean {
  return Boolean(getConceptDetail(id)) || GRAPH_PAGES.has(id);
}

/**
 * The concept's own page when it has one, otherwise the concepts index, so a related-concept link
 * never lands on a 404 (Search Console counts every such link). Server-only: concept-details is large.
 */
export function conceptPageHref(id: string): string {
  return hasConceptPage(id) ? `/concepts/${id}/` : '/concepts/';
}
