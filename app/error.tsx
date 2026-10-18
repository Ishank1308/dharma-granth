'use client';

import { useLayoutEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { isChunkLoadError, markNoindex, reloadOnceWithCacheBust } from '@/lib/error-recovery';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // A failed JS chunk (new deploy, flaky or lost connection) is not fixed by
  // re-rendering; only a full reload fetches the fresh assets.
  const isChunkError = isChunkLoadError(error);

  useLayoutEffect(() => {
    console.error('[dharma-granth] route error:', error);
    const unmark = markNoindex();
    if (isChunkError) reloadOnceWithCacheBust();
    return unmark;
  }, [error, isChunkError]);
  const retry = () => {
    if (isChunkError) {
      if (!reloadOnceWithCacheBust()) window.location.reload();
    } else reset();
  };

  return (
    <main className="min-h-screen bg-dharma-bg flex items-center justify-center px-6 py-24">
      <meta name="robots" content="noindex, nofollow" />
      <div className="max-w-2xl w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-saffron-100 dark:bg-saffron-950/60 text-saffron-700 dark:text-saffron-400 mb-6 shadow-sm border border-saffron-300/40">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-saffron-700 dark:text-saffron-400 font-semibold mb-3">
          त्रुटि निवारण · Error Recovery
        </p>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-dharma-text mb-4">
          पृष्ठ लोड नहीं हो सका
        </h1>
        <p className="text-base text-dharma-muted mb-2 max-w-lg mx-auto leading-relaxed">
          {isChunkError
            ? 'नेटवर्क रुकावट या नए अपडेट के कारण पृष्ठ का कुछ भाग लोड नहीं हो सका। कृपया पुनः प्रयास करें।'
            : 'तकनीकी समस्या के कारण यह पृष्ठ बाधित हुआ है। कृपया पुनः प्रयास करें अथवा मुख्य पुस्तकालय पर लौटें।'}
        </p>
        <p className="text-xs text-dharma-muted/70 mb-8 max-w-lg mx-auto" lang="en">
          {isChunkError
            ? 'Part of the page failed to download (likely a dropped connection). Please reload.'
            : 'A temporary error occurred while rendering this page.'}
        </p>
        {error.digest && (
          <p className="text-xs text-dharma-muted/70 mb-8 font-mono bg-stone-100 dark:bg-stone-900 inline-block px-3 py-1 rounded-full border border-dharma-border">
            ref: {error.digest}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={retry}
            className="inline-flex items-center gap-2 bg-saffron-600 hover:bg-saffron-700 text-white px-6 py-3 rounded-full font-semibold transition shadow-md active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            {isChunkError ? 'पृष्ठ रीलोड करें (Reload)' : 'पुनः प्रयास करें (Try Again)'}
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-dharma-card border border-dharma-border text-dharma-text px-6 py-3 rounded-full font-semibold hover:bg-dharma-bg transition active:scale-95"
          >
            <Home className="w-4 h-4" />
            मुख्य पृष्ठ (Home)
          </Link>
        </div>
      </div>
    </main>
  );
}
