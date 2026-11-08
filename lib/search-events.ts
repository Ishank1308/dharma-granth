/** Lets any component open the global search (owned by SiteNav), optionally prefilled. */
export const OPEN_SEARCH_EVENT = 'dharma:open-search';

export interface OpenSearchDetail {
  query?: string;
  anchor?: HTMLButtonElement;
}

export function openGlobalSearch(query?: string, anchor?: HTMLButtonElement): void {
  window.dispatchEvent(
    new CustomEvent<OpenSearchDetail>(OPEN_SEARCH_EVENT, { detail: { query, anchor } }),
  );
}
