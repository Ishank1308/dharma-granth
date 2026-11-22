'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { ErrorRecoveryVerse } from './components/ErrorRecoveryVerse';
import {
  canAttemptChunkReload,
  isChunkLoadError,
  isChunkReloadInProgress,
  markNoindex,
  reloadOnceWithCacheBust,
} from '@/lib/error-recovery';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isChunkError = isChunkLoadError(error);

  useEffect(() => {
    if (!isChunkError) console.error('[dharma-granth] route error:', error);
    const unmark = markNoindex();
    if (isChunkError && !reloadOnceWithCacheBust() && !isChunkReloadInProgress()) {
      console.error('[dharma-granth] route chunk error after automatic recovery:', error);
    }
    return unmark;
  }, [error, isChunkError]);

  const retry = () => {
    if (isChunkError) {
      if (!reloadOnceWithCacheBust()) window.location.reload();
    } else reset();
  };

  // This is a transient state while the effect performs the one-time reload.
  if (isChunkError && (canAttemptChunkReload() || isChunkReloadInProgress())) {
    return (
      <main className="min-h-screen bg-dharma-bg flex items-center justify-center px-6 py-24">
        <meta name="robots" content="noindex, nofollow" />
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-saffron-100 dark:bg-saffron-950/60 text-saffron-700 dark:text-saffron-400 mb-4 animate-spin">
            <RotateCcw className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-dharma-text mb-1">
            नवीनतम संस्करण लोड हो रहा है...
          </p>
          <p className="text-xs text-dharma-muted">
            Updating Dharma Granth assets, please wait...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-dharma-bg flex items-center justify-center px-6 py-24">
      <meta name="robots" content="noindex, nofollow" />
      <div className="max-w-2xl w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-saffron-100 dark:bg-saffron-950/60 text-saffron-700 dark:text-saffron-400 mb-6 shadow-sm border border-saffron-300/40">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-saffron-700 dark:text-saffron-400 font-semibold mb-3">
          एक छोटा विराम · A quiet pause
        </p>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-dharma-text mb-2">
          पृष्ठ लोड नहीं हो सका
        </h1>
        <p className="mb-4 text-sm text-dharma-muted" lang="en">This page could not load.</p>
        <p className="text-base text-dharma-muted mb-2 max-w-lg mx-auto leading-relaxed">
          {isChunkError
            ? 'क्षमा करें, नेटवर्क में रुकावट या नए अपडेट के कारण पृष्ठ का कुछ भाग नहीं पहुँच सका। पृष्ठ फिर से खोलने पर प्रायः यह ठीक हो जाता है।'
            : 'क्षमा करें, एक तकनीकी अड़चन के कारण यह पृष्ठ रुक गया। कृपया एक बार फिर प्रयास करें, या मुख्य पृष्ठ पर लौट आएँ।'}
        </p>
        <p className="text-xs text-dharma-muted/70 mb-8 max-w-lg mx-auto" lang="en">
          {isChunkError
            ? 'Sorry, part of this page didn’t arrive, probably because the connection dropped. Reloading usually fixes it.'
            : 'Sorry, a temporary problem stopped this page. Please try again, or return home.'}
        </p>
        <ErrorRecoveryVerse />
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
            {isChunkError ? 'पृष्ठ पुनः खोलें (Reload)' : 'पुनः प्रयास करें (Try Again)'}
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
