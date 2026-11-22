/**
 * Why a download stopped, and whether it is worth trying again. Kept free of native modules so the
 * Node tests (scripts/download-errors.test.mjs) can import it.
 */

/**
 * A code the screen turns into a sentence in the reader's language (downloadErrorText in
 * src/components/download-card.tsx).
 */
export type DownloadErrorCode = 'offline' | 'server' | 'space' | 'damaged' | 'incomplete' | 'unavailable' | 'update' | 'failed';

export class DownloadError extends Error {
  readonly code: DownloadErrorCode;

  constructor(code: DownloadErrorCode) {
    super(code);
    this.name = 'DownloadError';
    this.code = code;
  }
}

/**
 * Sorts a thrown error into a code. fetch() and the native downloader report a lost connection in
 * different words ("Network request failed", "Unable to resolve host", "timeout", "connection reset").
 */
export function downloadErrorCode(e: unknown): DownloadErrorCode {
  if (e instanceof DownloadError) return e.code;
  const text = e instanceof Error ? `${e.name} ${e.message}` : String(e);
  if (/space|ENOSPC|disk full|storage full/i.test(text)) return 'space';
  if (/network|internet|offline|resolve host|unreachable|timed? ?out|connect|socket|ssl|reset|EAI_|ENOTFOUND|ECONN/i.test(text)) return 'offline';
  if (/JSON|Unexpected (token|end)|parse/i.test(text)) return 'damaged';
  if (/\b(4\d\d|5\d\d)\b/.test(text)) return 'server';
  return 'failed';
}

/** Codes worth a quiet second try: a dropped connection or a half-written file usually works the next time. */
export const RETRYABLE: ReadonlySet<DownloadErrorCode> = new Set<DownloadErrorCode>(['offline', 'server', 'damaged', 'failed']);

/** Waits between tries of one part. Budget phones often sit on patchy mobile data, so three tries in all. */
export const RETRY_DELAYS_MS = [1500, 4000];
