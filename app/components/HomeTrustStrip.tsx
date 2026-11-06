import Link from 'next/link';

/** Short, honest statement of how the library is sourced, with links to the full pages. */
export function HomeTrustStrip() {
  return (
    <section aria-labelledby="trust-heading" className="border-t border-dharma-text/10 px-5 py-14">
      <div className="mx-auto flex max-w-[680px] flex-col items-center gap-3 text-center">
        <h2 id="trust-heading" className="text-[21px] font-semibold text-dharma-text sm:text-2xl">
          Where this text comes from
        </h2>
        <p className="text-[15px] leading-relaxed text-dharma-muted sm:text-[17px]">
          Sanskrit and original-language text is kept apart from translation and commentary, and each page says what its
          source is. Machine-assisted material is labelled, and corrections are welcome.
        </p>
        <p className="flex flex-wrap justify-center gap-x-6 text-[15px] sm:text-[17px]">
          <Link href="/sources/" className="inline-flex min-h-[44px] items-center text-dharma-saffron hover:underline">
            Sources <span aria-hidden="true">&nbsp;›</span>
          </Link>
          <Link href="/methodology/" className="inline-flex min-h-[44px] items-center text-dharma-saffron hover:underline">
            Methodology <span aria-hidden="true">&nbsp;›</span>
          </Link>
          <Link href="/how-dharma-granth-works/" className="inline-flex min-h-[44px] items-center text-dharma-saffron hover:underline">
            How this library works <span aria-hidden="true">&nbsp;›</span>
          </Link>
        </p>
      </div>
    </section>
  );
}
