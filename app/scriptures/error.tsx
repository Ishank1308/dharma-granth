'use client';

import { useEffect } from 'react';
import { LoadFailure } from '@/app/components/library/LibraryStates';
import { isChunkLoadError, markNoindex, reloadOnceWithCacheBust } from '@/lib/error-recovery';

/** The library failed while rendering; offer a reload without losing the site chrome. */
export default function LibraryError({ error }: { error: Error & { digest?: string } }) {
  const chunk = isChunkLoadError(error);
  useEffect(() => {
    console.error('[dharma-granth] library error:', error);
    const unmark = markNoindex();
    if (chunk) reloadOnceWithCacheBust();
    return unmark;
  }, [error, chunk]);

  return (
    <main className="min-h-screen bg-dharma-bg">
      <meta name="robots" content="noindex, nofollow" />
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6">
        <LoadFailure onRetry={() => window.location.reload()} />
      </div>
    </main>
  );
}
