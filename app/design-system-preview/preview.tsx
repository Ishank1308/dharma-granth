'use client';

import { useEffect, useState } from 'react';
import { scriptureVibe, vibeAttrs } from '@/lib/scripture-vibes';
import type { ScriptureCategory } from '@/data/types';

const THEMES = [
  { id: 'day', label: 'Usha' },
  { id: 'sunset', label: 'Sandhyā' },
  { id: 'paper', label: 'Bhojpatra' },
  { id: 'night', label: 'Rātri' },
] as const;

const SAMPLES: { id: string; name: string; category: ScriptureCategory }[] = [
  { id: 'rigveda', name: 'Veda · Palm leaf', category: 'veda' },
  { id: 'ishavasya', name: 'Upaniṣad · Bark', category: 'upanishad' },
  { id: 'bhagavatapurana', name: 'Purāṇa · Silk', category: 'purana' },
  { id: 'durgasaptashati', name: 'Śākta · Velvet', category: 'shakta' },
  { id: 'brahmasutra', name: 'Vedānta · Cloth', category: 'vedanta' },
];

export function DesignSystemPreview() {
  const [theme, setTheme] = useState<(typeof THEMES)[number]['id']>('day');
  const [largeText, setLargeText] = useState(false);
  const [expandedSample, setExpandedSample] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    let previousTheme: string | null = null;
    let captured = false;
    // The site theme provider applies the saved preference on mount.
    const frame = window.requestAnimationFrame(() => {
      previousTheme = root.getAttribute('data-theme');
      captured = true;
      if (THEMES.some((item) => item.id === previousTheme)) {
        setTheme(previousTheme as (typeof THEMES)[number]['id']);
      }
    });
    return () => {
      window.cancelAnimationFrame(frame);
      if (captured) {
        if (previousTheme) root.setAttribute('data-theme', previousTheme);
        else root.removeAttribute('data-theme');
      }
    };
  }, []);

  function selectTheme(next: (typeof THEMES)[number]['id']) {
    document.documentElement.setAttribute('data-theme', next);
    setTheme(next);
  }

  return (
    <main data-reader-size={largeText ? 'xl' : undefined} className="apple-scope min-h-screen bg-dharma-bg pb-20 text-dharma-text">
      <div className="mx-auto max-w-content px-gutter pt-10 sm:pt-16">
        <p className="text-footnote font-semibold text-dharma-saffron">
          <span>Design system</span> <span aria-hidden="true">·</span> <span lang="hi" className="font-devanagari">रूप-विधान</span>
        </p>
        <h1 className="mt-2 text-large-title font-semibold text-dharma-text">
          <span>Scripture cards</span> <span lang="hi" className="mt-1 block text-title-2 font-normal text-dharma-muted">ग्रन्थ-पत्र</span>
        </h1>
        <p className="mt-4 max-w-2xl text-body leading-relaxed text-dharma-muted">
          Review the shared verse-card styling across themes and cover materials. This preview is excluded from search indexing.
        </p>
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Preview theme">
          {THEMES.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={theme === item.id}
              onClick={() => selectTheme(item.id)}
              className={`focus-ring min-h-tap rounded-pill border border-dharma-border px-4 text-sm font-medium transition-colors ${theme === item.id ? 'bg-dharma-text text-dharma-bg' : 'text-dharma-text hover:bg-dharma-card'}`}
              data-testid={`preview-theme-${item.id}`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={largeText}
            onClick={() => setLargeText((current) => !current)}
            className={`focus-ring min-h-tap rounded-pill border border-dharma-border px-4 text-sm font-medium transition-colors ${largeText ? 'bg-dharma-text text-dharma-bg' : 'text-dharma-text hover:bg-dharma-card'}`}
            data-testid="preview-large-text"
          >
            Larger text <span lang="hi">बड़े अक्षर</span>
          </button>
        </div>
      </div>

      <section className="mx-auto mt-8 grid max-w-content gap-5 px-gutter md:grid-cols-2" aria-label="Scripture cover samples">
        {SAMPLES.map((sample, index) => {
          const vibe = scriptureVibe(sample.id, sample.category);
          return (
            <div key={sample.id} {...vibeAttrs(vibe)}>
              <article className="verse-card book-verse" data-testid={`preview-card-${sample.id}`}>
                <header className="mb-3 flex items-center justify-between gap-3">
                  <p className="verse-ref">Verse {index + 1}</p>
                  <span className="text-footnote text-dharma-muted">{sample.name}</span>
                </header>
                <div className="verse-folio">
                  <p lang="sa" className="text-center font-sanskrit text-title-3 leading-relaxed text-dharma-text">
                    धर्मः शान्तिः सत्यं करुणा ज्ञानं सेवा समत्वम्
                  </p>
                  <span className="verse-mark mt-2 block text-center" aria-hidden="true">॥ {index + 1} ॥</span>
                </div>
                <div className="sacred-flow-wrap">
                  <p lang="hi" className="text-body leading-relaxed text-dharma-text">यह नमूना पाठ है; वास्तविक ग्रन्थ-पाठ अपने प्रमाणित स्रोत से ही लिया जाता है।</p>
                  <button
                    type="button"
                    aria-expanded={expandedSample === sample.id ? 'true' : 'false'}
                    aria-controls={`preview-study-${sample.id}`}
                    onClick={() => setExpandedSample((current) => current === sample.id ? null : sample.id)}
                    className="focus-ring apple-pill apple-pill-tinted mt-4 min-h-tap"
                  >
                    Verse study <span lang="hi">व्याख्या</span>
                  </button>
                  <div id={`preview-study-${sample.id}`} hidden={expandedSample !== sample.id} className="mt-4 rounded-control bg-dharma-bg p-4 text-sm text-dharma-text">
                    <p><span lang="hi">संपादकीय नमूना</span> · Editorial specimen</p>
                    <p lang="hi" className="mt-2">यह विवरण केवल अध्ययन नियंत्रण के प्रदर्शन के लिए है।</p>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
      </section>
    </main>
  );
}
