import { getConceptDetail } from '@/data/concept-details';
import { graphPageIds } from '@/data/knowledge-graph';

/** Concept ids that have a page at /concepts/<id>/ (the same list app/concepts/[id] exports). */
export function hasConceptPage(id: string): boolean {
  return Boolean(getConceptDetail(id)) || graphPageIds().includes(id);
}

/** The concept's page, or the concepts index when it has none yet. */
export function conceptPageHref(id: string): string {
  return hasConceptPage(id) ? `/concepts/${id}/` : '/concepts/';
}
