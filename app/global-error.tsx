'use client';

import { useEffect } from 'react';
import { isChunkLoadError, markNoindex, reloadOnceWithCacheBust } from '@/lib/error-recovery';
import { ERROR_RECOVERY_VERSE } from '@/lib/error-recovery-verse';

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
            A quiet pause · Dharma Granth
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
          <p lang="hi" style={{ color: '#6b6560', marginBottom: 8 }}>
            पृष्ठ लोड नहीं हो सका। पुनः प्रयास करें या मुख्य पृष्ठ पर लौटें।
          </p>
          <p lang="en" style={{ color: '#6b6560', marginBottom: 24 }}>
            A temporary error interrupted the page. Try again, or return home.
          </p>
          <section
            aria-label="Bhagavad Gita 2.47"
            style={{
              textAlign: 'left',
              background: '#fffdf8',
              border: '1px solid #e8e3db',
              borderRadius: 20,
              padding: '20px 24px',
              margin: '0 0 24px',
            }}
          >
            <p style={{ color: '#9a3412', fontSize: 11, letterSpacing: '0.16em', fontWeight: 600 }}>
              {ERROR_RECOVERY_VERSE.reference} · A moment of steadiness
            </p>
            <p lang="sa" style={{ whiteSpace: 'pre-line', fontFamily: 'Noto Sans Devanagari, serif', fontSize: 18, lineHeight: 1.9 }}>
              {ERROR_RECOVERY_VERSE.sanskrit}
            </p>
            <p lang="hi" style={{ whiteSpace: 'pre-line', color: '#6b6560', lineHeight: 1.7 }}>
              {ERROR_RECOVERY_VERSE.hindi}
            </p>
            <p lang="en" style={{ color: '#6b6560', lineHeight: 1.7, marginBottom: 0 }}>
              {ERROR_RECOVERY_VERSE.english}
            </p>
          </section>
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
