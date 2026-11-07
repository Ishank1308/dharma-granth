import Link from 'next/link';
import { CountUp } from '@/app/components/motion/CountUp';
import { getLibraryStats } from '@/lib/library-stats';

/**
 * Short, honest statement of how the library is sourced, with links to the full pages, and the
 * library's numbers. The numbers are in the exported HTML at their true values; they count up once
 * when they scroll into view (CountUp).
 */
export function HomeTrustStrip() {
  const { texts, verses } = getLibraryStats();
  const stats = [
    { value: <CountUp value={verses} />, label: 'verses', hi: 'श्लोक' },
    { value: <CountUp value={texts} />, label: 'texts', hi: 'ग्रन्थ' },
    { value: <span className="apple-stat">3</span>, label: 'languages', hi: 'भाषाएँ' },
    { value: <span className="apple-stat">0</span>, label: 'ads or accounts', hi: 'विज्ञापन, खाते' },
  ];

  return (
    <section aria-labelledby="trust-heading" className="border-t border-[color:var(--separator)] px-5 py-section">
      <div className="mx-auto flex max-w-text flex-col items-center gap-3 text-center">
        <h2 id="trust-heading" className="text-title-3 font-semibold text-dharma-text sm:text-title-2">
          Where this text comes from
        </h2>
        <p className="text-subhead leading-relaxed text-dharma-muted sm:text-body">
          Sanskrit and original-language text is kept apart from translation and commentary, and each page says what its
          source is. Machine-assisted material is labelled, and corrections are welcome.
        </p>
        <p className="flex flex-wrap justify-center gap-x-6 text-subhead sm:text-body">
          <Link href="/sources/" className="chevron-nudge inline-flex min-h-tap items-center text-dharma-saffron hover:underline">
            Sources <span aria-hidden="true">&nbsp;›</span>
          </Link>
          <Link href="/methodology/" className="chevron-nudge inline-flex min-h-tap items-center text-dharma-saffron hover:underline">
            Methodology <span aria-hidden="true">&nbsp;›</span>
          </Link>
          <Link href="/how-dharma-granth-works/" className="chevron-nudge inline-flex min-h-tap items-center text-dharma-saffron hover:underline">
            How this library works <span aria-hidden="true">&nbsp;›</span>
          </Link>
        </p>
      </div>
      <dl className="reveal-grid mx-auto mt-10 grid max-w-content grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
        {stats.map((s) => (
          <div key={s.label} className="apple-card flex flex-col-reverse items-center px-4 py-6 text-center">
            <dt className="mt-1 text-footnote text-dharma-muted">
              <span>{s.label}</span> <span lang="hi" className="font-devanagari">{s.hi}</span>
            </dt>
            <dd className="text-title-1 font-semibold text-dharma-text">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
