// Shared recovery helpers for the route-level and global error boundaries.

const CHUNK_RE = /ChunkLoadError|Loading chunk|Loading CSS chunk|Failed to fetch dynamically imported module|Importing a module script failed/i;
const RETRY_KEY = 'dharma.chunk-retry';
// A second reload within this window is treated as a failed retry, so we show the
// fallback instead of looping. After it, a later deploy can retry again.
const RETRY_WINDOW_MS = 60_000;

export const isChunkLoadError = (error: { name?: string; message?: string }): boolean =>
  CHUNK_RE.test(`${error.name ?? ''} ${error.message ?? ''}`);

/** Reloads once per minute with a cache-busting query so stale HTML or SW entries are bypassed. */
export function reloadOnceWithCacheBust(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RETRY_KEY) || 0);
    if (last && Date.now() - last < RETRY_WINDOW_MS) return false;
    sessionStorage.setItem(RETRY_KEY, String(Date.now()));
    const url = new URL(window.location.href);
    url.searchParams.set('_r', String(Date.now()));
    window.location.replace(url.toString());
    return true;
  } catch {
    return false;
  }
}

/** Keeps crawlers from indexing an error fallback served with a 200 status. */
export function markNoindex(): () => void {
  const meta = document.createElement('meta');
  meta.name = 'robots';
  meta.content = 'noindex, nofollow';
  meta.setAttribute('data-error-boundary', '');
  document.head.appendChild(meta);
  return () => meta.remove();
}
