'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Layers, LayoutGrid, Maximize2, MoveRight, Smartphone, Sparkles, Tablet } from 'lucide-react';
import { PageCover } from '@/app/components/PagePhoto';
import type { CoverPhoto } from '@/lib/page-photos';
import { scriptureVibe, vibeAttrs } from '@/lib/scripture-vibes';
import type { ScriptureCategory } from '@/data/types';

const THEMES = [
  { id: 'sunset', label: 'Light' },
  { id: 'night', label: 'Dark' },
] as const;

const STAGE_WIDTHS = [
  { id: 'full', label: 'Fluid 100%', px: undefined, icon: Maximize2 },
  { id: 'tablet', label: '768px Tablet', px: 768, icon: Tablet },
  { id: 'phone', label: '390px Phone', px: 390, icon: Smartphone },
  { id: 'compact', label: '320px Compact', px: 320, icon: Smartphone },
] as const;

const MOTION_VECTORS = [
  {
    kind: 'open',
    label: 'Open · Shared Hero Morph',
    hi: 'प्रवेश (गहराई में खुलना)',
    spec: 'Hub card → Book / Verse folio (`verse-hero`, 520ms `--motion-spring`)',
    href: '/scripture/bhagavadgita/',
  },
  {
    kind: 'back',
    label: 'Back · Spatial Zoom-Out',
    hi: 'प्रत्यावर्तन (मूल पटल पर वापसी)',
    spec: 'Child detail contracts (`scale(0.975)`) while parent container settles forward',
    href: '/scriptures/',
  },
  {
    kind: 'next',
    label: 'Next / Prev · Leaf Turn',
    hi: 'पृष्ठ-परिवर्तन (अगला/पिछला श्लोक)',
    spec: 'Sequential sibling slide (`±38% → 0`, 580ms `--motion-spring`)',
    href: '/scripture/bhagavadgita/chapter/2/verse/47/',
  },
  {
    kind: 'nav-next',
    label: 'Rail Glide · Primary Nav',
    hi: 'मुख्य पट्टिका प्रवाह',
    spec: 'Pinned header & dock (`site-chrome-*`) while stage glides laterally (`±32px`)',
    href: '/learn/',
  },
] as const;

const SAMPLES: { id: string; name: string; category: ScriptureCategory }[] = [
  { id: 'rigveda', name: 'Veda · Palm leaf', category: 'veda' },
  { id: 'ishavasya', name: 'Upaniṣad · Bark', category: 'upanishad' },
  { id: 'bhagavatapurana', name: 'Purāṇa · Silk', category: 'purana' },
  { id: 'durgasaptashati', name: 'Śākta · Velvet', category: 'shakta' },
  { id: 'brahmasutra', name: 'Vedānta · Cloth', category: 'vedanta' },
];

export function DesignSystemPreview() {
  const [theme, setTheme] = useState<(typeof THEMES)[number]['id']>('sunset');
  const [largeText, setLargeText] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [stageWidth, setStageWidth] = useState<(typeof STAGE_WIDTHS)[number]['id']>('full');
  const [activeMotion, setActiveMotion] = useState<(typeof MOTION_VECTORS)[number]['kind']>('open');
  const [cgPhoto, setCgPhoto] = useState<CoverPhoto>('lamp');
  const [expandedSample, setExpandedSample] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    let previousTheme: string | null = null;
    let captured = false;
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

  const activeStage = STAGE_WIDTHS.find((s) => s.id === stageWidth) ?? STAGE_WIDTHS[0];

  return (
    <main
      data-verse-size={largeText ? 'xl' : 'lg'}
      data-wireframe={wireframe ? 'true' : undefined}
      className="apple-scope min-h-screen bg-dharma-bg pb-24 text-dharma-text"
    >
      <div className="mx-auto max-w-content px-gutter pt-10 sm:pt-16">
        <p className="text-footnote font-semibold text-dharma-saffron">
          <span>Design system &amp; Rapid Prototype Lab</span>{' '}
          <span aria-hidden="true">·</span>{' '}
          <span lang="hi" className="font-devanagari">उच्च-निष्ठा रूप-विधान एवं प्रोटोटाइप प्रयोगशाला</span>
        </p>
        <h1 className="mt-2 text-large-title font-semibold text-dharma-text">
          <span>Scripture cards &amp; Fluid UX</span>{' '}
          <span lang="hi" className="mt-1 block text-title-2 font-normal text-dharma-muted">
            ग्रन्थ-पत्र, तरल ग्रिड व गति-संरचना
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-body leading-relaxed text-dharma-muted">
          Interactive high-fidelity wireframe and rapid prototyping studio: inspect shared verse-card palettes, intrinsic fluid grid breakpoints, and structural screen-to-screen View Transitions. Excluded from search indexing.
        </p>

        {/* Control Deck: Theme + Text Scale + Wireframe Blueprint + Responsive Stage Width */}
        <div className="mt-6 flex flex-wrap items-center gap-2" role="group" aria-label="Preview theme">
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
          <button
            type="button"
            aria-pressed={wireframe}
            onClick={() => setWireframe((current) => !current)}
            className={`focus-ring inline-flex min-h-tap items-center gap-1.5 rounded-pill border border-dharma-border px-4 text-sm font-medium transition-colors ${wireframe ? 'bg-dharma-saffron text-dharma-bg border-dharma-saffron' : 'text-dharma-text hover:bg-dharma-card'}`}
            data-testid="preview-wireframe-toggle"
          >
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            <span>Wireframe blueprint</span>
          </button>
        </div>

        {/* Rapid Viewport Prototyping Bar */}
        <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Fluid viewport simulator">
          <span className="mr-1 text-caption font-semibold uppercase tracking-wider text-dharma-muted">
            Fluid stage:
          </span>
          {STAGE_WIDTHS.map((sw) => {
            const Icon = sw.icon;
            const active = stageWidth === sw.id;
            return (
              <button
                key={sw.id}
                type="button"
                aria-pressed={active}
                onClick={() => setStageWidth(sw.id)}
                className={`focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-pill border px-3.5 text-xs font-semibold transition ${
                  active
                    ? 'border-dharma-saffron bg-dharma-saffron/15 text-dharma-saffron'
                    : 'border-dharma-border bg-dharma-card/60 text-dharma-muted hover:text-dharma-text'
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{sw.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resizable Fluid Grid Stage */}
      <div
        className="mx-auto mt-8 px-gutter transition-[max-width] duration-base ease-spring"
        style={activeStage.px ? { maxWidth: `${activeStage.px + 40}px` } : { maxWidth: 'var(--width-content)' }}
      >
        <section className="fluid-grid-lg" aria-label="Scripture cover samples">
          {SAMPLES.map((sample, index) => {
            const vibe = scriptureVibe(sample.id, sample.category);
            return (
              <div key={sample.id} className="fluid-cq" {...vibeAttrs(vibe)}>
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

        {/* Structural Motion Architecture Prototype Matrix */}
        <section aria-labelledby="motion-topology-heading" className="mt-14">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-1.5 text-footnote font-semibold text-dharma-saffron">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>Structural Screen-to-Screen Motion</span>
              </p>
              <h2 id="motion-topology-heading" className="mt-1 text-title-2 font-semibold text-dharma-text">
                <span>Spatial Navigation Vectors</span>{' '}
                <span lang="hi" className="font-devanagari text-title-3 font-normal text-dharma-muted">· स्थानिक गति-सूत्र</span>
              </h2>
            </div>
            <span className="text-caption text-dharma-muted">View Transitions API + CSS `--motion-spring`</span>
          </div>

          <div className="fluid-grid-sm">
            {MOTION_VECTORS.map((vec) => {
              const selected = activeMotion === vec.kind;
              return (
                <div
                  key={vec.kind}
                  data-wf-box
                  className={`apple-card flex flex-col justify-between p-5 transition ${
                    selected ? 'ring-2 ring-dharma-saffron/60' : ''
                  }`}
                >
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <code className="rounded-chip bg-fill-tertiary px-2 py-0.5 font-mono text-caption font-semibold text-dharma-saffron">
                        data-vt=&quot;{vec.kind}&quot;
                      </code>
                      <Layers className="h-4 w-4 text-dharma-muted" aria-hidden="true" />
                    </div>
                    <h3 className="text-title-3 font-semibold text-dharma-text">{vec.label}</h3>
                    <p lang="hi" className="mt-0.5 font-devanagari text-footnote text-dharma-muted">
                      {vec.hi}
                    </p>
                    <p className="mt-2.5 text-footnote leading-relaxed text-dharma-text-secondary">
                      {vec.spec}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-separator pt-3">
                    <button
                      type="button"
                      onClick={() => setActiveMotion(vec.kind)}
                      aria-pressed={selected}
                      className="focus-ring inline-flex min-h-[44px] items-center gap-1 rounded-pill px-3 text-xs font-semibold text-dharma-muted hover:text-dharma-text"
                    >
                      <MoveRight className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Inspect vector</span>
                    </button>
                    <Link
                      href={vec.href}
                      data-vt={vec.kind === 'back' ? 'back' : vec.kind === 'open' ? 'open' : undefined}
                      className="focus-ring inline-flex min-h-[44px] items-center gap-1 rounded-pill bg-dharma-saffron/15 px-3.5 text-xs font-semibold text-dharma-saffron hover:bg-dharma-saffron/25"
                    >
                      <span>Test live</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Isolated Cinemagraph Specimen */}
        <section aria-labelledby="cinemagraph-heading" className="mt-14">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-1.5 text-footnote font-semibold text-dharma-saffron">
                <Flame className="h-4 w-4" aria-hidden="true" />
                <span>Isolated Cinemagraphs</span>
              </p>
              <h2 id="cinemagraph-heading" className="mt-1 text-title-2 font-semibold text-dharma-text">
                <span>Still Frame, Living Element</span>{' '}
                <span lang="hi" className="font-devanagari text-title-3 font-normal text-dharma-muted">· स्थिर चित्र में सूक्ष्म प्राण</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Cinemagraph scene">
              {(
                [
                  ['lamp', 'Diya Flame · दीपशिखा'],
                  ['ganga', 'Water Glint · जल-तरंग'],
                  ['ashram', 'Valley Mist · आश्रम कुहासा'],
                  ['manuscript', 'Sunbeam · पाण्डुलिपि रश्मि'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={cgPhoto === id}
                  onClick={() => setCgPhoto(id)}
                  className={`focus-ring min-h-[44px] rounded-pill border px-3.5 text-xs font-semibold transition ${
                    cgPhoto === id
                      ? 'border-dharma-saffron bg-dharma-saffron text-dharma-bg'
                      : 'border-dharma-border bg-dharma-card text-dharma-muted hover:text-dharma-text'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <PageCover photo={cgPhoto} />
        </section>
      </div>
    </main>
  );
}
