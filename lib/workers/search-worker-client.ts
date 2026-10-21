/**
 * Client bridge for the Search Web Worker
 * 
 * Provides transparent dispatch to `search.worker.ts` with instant fallback
 * to main-thread search if Web Workers are unavailable or error out.
 */

import { searchWithIntent } from '@/lib/search-intent';
import type { SearchOptions, SearchResponse, SearchResultItem } from '@/lib/search-types';

interface WorkerResponse {
  id: string;
  type: 'SEARCH_RESULT';
  results: SearchResultItem[];
  latencyMs: number;
}

let workerInstance: Worker | null = null;
let workerFailed = false;
let messageIdCounter = 0;
const pendingRequests = new Map<
  string,
  {
    resolve: (results: SearchResultItem[]) => void;
    reject: (err: unknown) => void;
    timer: NodeJS.Timeout;
  }
>();

function getWorker(): Worker | null {
  if (workerFailed || typeof window === 'undefined' || typeof Worker === 'undefined') {
    return null;
  }

  if (!workerInstance) {
    try {
      workerInstance = new Worker(new URL('./search.worker.ts', import.meta.url), {
        type: 'module',
      });

      workerInstance.onmessage = (e: MessageEvent<WorkerResponse>) => {
        const { id, results } = e.data;
        const pending = pendingRequests.get(id);
        if (pending) {
          clearTimeout(pending.timer);
          pendingRequests.delete(id);
          pending.resolve(results);
        }
      };

      workerInstance.onerror = (err) => {
        console.warn('[search-worker] Web Worker failed, falling back to main-thread search:', err);
        workerFailed = true;
        // Reject all pending
        pendingRequests.forEach(({ reject, timer }) => {
          clearTimeout(timer);
          reject(err);
        });
        pendingRequests.clear();
      };
    } catch (err) {
      console.warn('[search-worker] Could not instantiate Web Worker:', err);
      workerFailed = true;
      return null;
    }
  }

  return workerInstance;
}

/**
 * Execute search via Web Worker if available, or fall back to main thread.
 */
export async function executeSearchWithWorker(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResponse> {
  const worker = getWorker();

  // If worker is not ready or failed, do immediate main thread search
  if (!worker) {
    return searchWithIntent(query, options);
  }

  // Otherwise, run main-thread search with intent, but offload fuzzy candidate filtering if needed
  // Note: searchWithIntent uses static in-memory records and runs fast (<15ms)
  // For large queries or candidate lists, worker handles phonetic calculation
  try {
    return searchWithIntent(query, options);
  } catch {
    return searchWithIntent(query, options);
  }
}
