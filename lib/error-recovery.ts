// Shared recovery helpers for the route-level and global error boundaries.

const CHUNK_RE =
  /ChunkLoadError|Loading (?:CSS )?chunk|Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Failed to load module script|module script failed/i;
const RETRY_KEY = 'dharma.chunk-reload-attempted';
let chunkReloadStarted = false;

export const isChunkLoadError = (
  error: { name?: string; message?: string; stack?: string } | null | undefined,
): boolean => {
  if (!error) return false;
  return CHUNK_RE.test(`${error.name ?? ''} ${error.message ?? ''} ${error.stack ?? ''}`);
};

/** Allow one silent cache-busting reload per tab session, preventing reload loops. */
export function canAttemptChunkReload(): boolean {
  if (typeof window === 'undefined' || chunkReloadStarted) return false;
  try {
    if (new URL(window.location.href).searchParams.has('_r')) return false;
    return sessionStorage.getItem(RETRY_KEY) !== '1';
  } catch {
    return !new URL(window.location.href).searchParams.has('_r');
  }
}

/** Suppress the fallback while a cache-busting navigation has been initiated but not completed. */
export function isChunkReloadInProgress(): boolean {
  if (typeof window === 'undefined') return false;
  if (chunkReloadStarted) return !new URL(window.location.href).searchParams.has('_r');
  try {
    const url = new URL(window.location.href);
    return !url.searchParams.has('_r') && sessionStorage.getItem(RETRY_KEY) === '1';
  } catch {
    return false;
  }
}

/** Reloads once with a cache-busting query so stale HTML or SW entries are bypassed. */
export function reloadOnceWithCacheBust(): boolean {
  if (!canAttemptChunkReload()) return false;
  const url = new URL(window.location.href);
  url.searchParams.set('_r', String(Date.now()));
  chunkReloadStarted = true;
  try { sessionStorage.setItem(RETRY_KEY, '1'); } catch { /* query marker still prevents a loop */ }
  try {
    window.location.replace(url.toString());
    return true;
  } catch {
    chunkReloadStarted = false;
    try { sessionStorage.removeItem(RETRY_KEY); } catch { /* storage is unavailable */ }
    return false;
  }
}

/** Keeps crawlers from indexing an error fallback served with a 200 status. */
export function markNoindex(): () => void {
  if (typeof document === 'undefined') return () => {};
  const meta = document.createElement('meta');
  meta.name = 'robots';
  meta.content = 'noindex, nofollow';
  meta.setAttribute('data-error-boundary', '');
  document.head.appendChild(meta);
  return () => meta.remove();
}
