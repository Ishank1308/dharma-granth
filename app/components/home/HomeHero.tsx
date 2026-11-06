import Link from 'next/link';
import { HeroSearchButton } from './HeroSearchButton';

/**
 * Home hero in the Apple idiom: one large promise, one filled button, one text link and the search field.
 * A server component, so the whole hero is in the exported HTML; only the search button is a client island.
 */
export function HomeHero() {
  return (
    <section aria-labelledby="hero-title" className="px-5 pb-12 pt-16 text-center sm:pb-16 sm:pt-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold text-dharma-saffron">
          <span>Hindu scriptures, whole</span> <span aria-hidden="true">·</span>{' '}
          <span lang="hi" className="font-devanagari">सनातन ग्रन्थ कोश</span>
        </p>
        <h1
          id="hero-title"
          className="mt-3 text-[44px] font-semibold leading-[1.05] tracking-[-0.035em] text-dharma-text sm:text-7xl md:text-[80px]"
        >
          Every verse.
          <br />
          Complete.
        </h1>
        <p lang="hi" className="mt-2 font-devanagari text-2xl font-semibold text-dharma-muted sm:text-[34px] sm:leading-tight">
          हर श्लोक, सम्पूर्ण।
        </p>
        <p className="mx-auto mt-6 max-w-[640px] text-[17px] leading-[1.45] text-dharma-muted sm:text-[21px]">
          The Vedas, Upanishads, Gita, Itihāsas and Purāṇas in Sanskrit, with Hindi and English where the published text
          gives them. Free, quiet, and without ads.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-7">
          <Link
            href="/scripture/bhagavadgita/"
            className="inline-flex min-h-[44px] items-center rounded-full bg-dharma-saffron px-6 text-[17px] text-dharma-bg transition hover:opacity-90"
          >
            Begin the Bhagavad Gita
          </Link>
          <Link href="/scriptures/" className="inline-flex min-h-[44px] items-center text-[17px] text-dharma-saffron hover:underline">
            Browse the library <span aria-hidden="true">&nbsp;›</span>
          </Link>
        </div>
        <HeroSearchButton />
      </div>
    </section>
  );
}
