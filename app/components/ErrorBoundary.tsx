'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { canAttemptChunkReload, isChunkLoadError, isChunkReloadInProgress, reloadOnceWithCacheBust } from '@/lib/error-recovery';
import { ErrorRecoveryVerse } from './ErrorRecoveryVerse';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (isChunkLoadError(error)) {
      if (!reloadOnceWithCacheBust() && !isChunkReloadInProgress()) {
        console.error(`[ErrorBoundary: ${this.props.name || 'Component'}] chunk error after automatic recovery:`, error, errorInfo.componentStack);
      }
    } else {
      console.error(
        `[ErrorBoundary: ${this.props.name || 'Component'}] caught error:`,
        error,
        errorInfo.componentStack,
      );
    }
  }

  handleReset = () => {
    if (isChunkLoadError(this.state.error)) {
      if (!reloadOnceWithCacheBust()) {
        window.location.reload();
      }
      return;
    }
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (isChunkLoadError(this.state.error) && (canAttemptChunkReload() || isChunkReloadInProgress())) {
        return (
          <section role="status" aria-live="polite" className="my-4 mx-auto max-w-lg rounded-2xl border border-saffron-200 bg-dharma-bg p-5 text-center text-dharma-text">
            <p className="font-semibold" lang="hi">नवीनतम पृष्ठ लोड हो रहा है…</p>
            <p className="mt-1 text-sm text-dharma-muted" lang="en">Refreshing the latest site assets…</p>
          </section>
        );
      }
      if (this.props.fallback) {
        return (
          <>
            <meta name="robots" content="noindex, nofollow" />
            {this.props.fallback}
          </>
        );
      }

      return (
        <>
          <meta name="robots" content="noindex, nofollow" />
          <section
            role="alert"
            aria-live="assertive"
            className="my-4 mx-auto max-w-2xl rounded-3xl border border-dharma-border bg-dharma-bg p-5 text-center text-dharma-text shadow-sm sm:p-8"
          >
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-saffron-100 text-saffron-700 dark:bg-saffron-950/50 dark:text-saffron-300">
              <AlertCircle className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-saffron-700 dark:text-saffron-400">
              A quiet pause · Dharma Granth
            </p>
            <h2 className="mt-2 font-serif text-xl font-bold text-dharma-text" lang="hi">
              पृष्ठ लोड नहीं हो सका
            </h2>
            <p className="mt-1 text-sm text-dharma-muted" lang="en">
              This part of the page could not load. Your reading can continue after a retry.
            </p>
            <ErrorRecoveryVerse />
            <button
              type="button"
              onClick={this.handleReset}
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-saffron-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-saffron-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>पुनः प्रयास करें · Try again</span>
            </button>
          </section>
        </>
      );
    }

    return this.props.children;
  }
}
