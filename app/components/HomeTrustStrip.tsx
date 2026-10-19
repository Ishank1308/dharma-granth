import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

/** Short, honest statement of how the library is sourced, with links to the full pages. */
export function HomeTrustStrip() {
  return (
    <section aria-labelledby="trust-heading" className="border-t border-dharma-border bg-dharma-card-soft/40 py-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-5 text-center sm:px-6">
        <ShieldCheck className="h-6 w-6 text-saffron-700 dark:text-saffron-400" aria-hidden="true" />
        <h2 id="trust-heading" className="font-serif text-xl font-bold text-dharma-text sm:text-2xl">
          Where this text comes from
        </h2>
        <p className="text-sm leading-relaxed text-dharma-muted sm:text-base">
          Sanskrit and original-language text is kept apart from translation and commentary, and each page says what its
          source is. Machine-assisted material is labelled, and corrections are welcome.
        </p>
        <p className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm font-semibold">
          <Link href="/sources/" className="inline-flex min-h-[44px] items-center text-saffron-800 hover:underline dark:text-saffron-300">
            Sources
          </Link>
          <Link href="/methodology/" className="inline-flex min-h-[44px] items-center text-saffron-800 hover:underline dark:text-saffron-300">
            Methodology
          </Link>
        </p>
      </div>
    </section>
  );
}
