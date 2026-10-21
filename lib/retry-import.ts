export interface RetryImportOptions {
  /** Number of additional attempts after the initial load. */
  retries?: number;
  /** Base delay before the first retry, in milliseconds. */
  baseDelayMs?: number;
}

/** Retry a failed dynamic import with exponential backoff and a small random spread. */
export async function retryImport<T>(
  loader: () => Promise<T>,
  { retries = 3, baseDelayMs = 400 }: RetryImportOptions = {},
): Promise<T> {
  const retryCount = Number.isFinite(retries) ? Math.max(0, Math.floor(retries)) : 3;
  const baseDelay = Number.isFinite(baseDelayMs) ? Math.max(0, baseDelayMs) : 400;

  for (let attempt = 0; ; attempt += 1) {
    try {
      return await loader();
    } catch (error) {
      if (attempt >= retryCount) throw error;

      const exponentialDelay = baseDelay * 2 ** attempt;
      const jitter = exponentialDelay * 0.25 * Math.random();
      await new Promise<void>((resolve) => {
        setTimeout(resolve, exponentialDelay + jitter);
      });
    }
  }
}
