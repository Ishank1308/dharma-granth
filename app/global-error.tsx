'use client';

import { useEffect } from 'react';
import { isChunkLoadError, markNoindex, reloadOnceWithCacheBust } from '@/lib/error-recovery';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[dharma-granth] global error:', error);
    const unmark = markNoindex();
    if (isChunkLoadError(error)) reloadOnceWithCacheBust();
    return unmark;
  }, [error]);

  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body
        style={{
          fontFamily:
            'Merriweather, Georgia, serif',
          backgroundColor: '#fdfbf7',
          color: '#2d2a26',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
          padding: '4rem 1.5rem',
        }}
      >
        <div style={{ maxWidth: 560, textAlign: 'center' }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#c2410c',
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            Something Broke
          </p>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              margin: '0 0 1rem',
            }}
          >
            The site couldn’t load this page.
          </h1>
          <p style={{ color: '#6b6560', marginBottom: 24 }}>
            A critical error interrupted the page. Try again, or return home.
          </p>
          {error.digest && (
            <p
              style={{
                fontSize: 12,
                color: '#6b6560',
                fontFamily: 'ui-monospace, monospace',
                marginBottom: 24,
              }}
            >
              ref: {error.digest}
            </p>
          )}
          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                background: '#ea580c',
                color: 'white',
                padding: '12px 20px',
                borderRadius: 999,
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{
                background: 'white',
                color: '#2d2a26',
                padding: '12px 20px',
                borderRadius: 999,
                border: '1px solid #e8e3db',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
