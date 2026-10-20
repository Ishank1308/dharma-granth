'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { canAttemptChunkReload, isChunkLoadError, reloadOnceWithCacheBust } from '@/lib/error-recovery';

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
    console.error(
      `[ErrorBoundary: ${this.props.name || 'Component'}] caught error:`,
      error,
      errorInfo.componentStack,
    );
    if (isChunkLoadError(error) && canAttemptChunkReload()) {
      reloadOnceWithCacheBust();
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
      if (this.props.fallback) {
        return (
          <>
            <meta name="robots" content="noindex, nofollow" />
            {this.props.fallback}
          </>
        );
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="my-4 rounded-2xl border border-amber-300/60 bg-amber-50/50 p-6 text-center text-dharma-text shadow-sm dark:border-amber-800/60 dark:bg-amber-950/20"
        >
          <meta name="robots" content="noindex, nofollow" />
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
            <AlertCircle className="h-5 w-5" aria-hidden="true" />
          </div>
          <h3 className="font-serif text-base font-bold text-dharma-text" lang="hi">
            यह घटक लोड नहीं हो सका
          </h3>
          <p className="mt-1 text-xs text-dharma-muted">
            {this.props.name ? `${this.props.name} घटक ` : 'घटक '}
            में अस्थाई समस्या आई है।
          </p>
          <p className="mt-0.5 text-[11px] text-dharma-muted/80" lang="en">
            An error occurred in this section. You can retry without reloading the entire page.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-amber-600 px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-amber-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>पुनः प्रयास करें (Retry)</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
