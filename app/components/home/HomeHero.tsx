import Link from 'next/link';
import type { CSSProperties } from 'react';
import { HeroSearchButton } from './HeroSearchButton';
import { HeroHalo } from './HeroHalo';

/** Stagger index for the hero's entrance (app/motion.css, .hero-rise). */
const step = (i: number) => ({ '--i': i }) as CSSProperties;

/**
 * Home hero in the Apple idiom: one large promise, one filled button, one text link and the search field.
 * A server component, so the whole hero is in the exported HTML; only the search button is a client island.
 * Motion is CSS only: the lines come into focus in turn, a kāla-chakra halo turns slowly behind them in
 * perspective, and the hero recedes as the page scrolls. Text is painted from the first frame.
 */
export function HomeHero() {
  return (
    <section aria-labelledby="hero-title" className="hero-stage overflow-x-clip px-5 pb-12 pt-16 text-center sm:pb-16 sm:pt-24">
      <HeroHalo />
      <div className="hero-content hero-rise mx-auto max-w-3xl">
        <p className="text-sm font-semibold text-dharma-saffron" style={step(0)}>
          <span>Hindu scriptures, whole</span> <span aria-hidden="true">·</span>{' '}
          <span lang="hi" className="font-devanagari">सनातन ग्रन्थ कोश</span>
        </p>
        <h1
          id="hero-title"
          style={step(1)}
          className="mt-3 text-[44px] font-semibold leading-[1.05] tracking-[-0.035em] text-dharma-text sm:text-7xl md:text-[80px]"
        >
          Every verse.
          <br />
          Complete.
        </h1>
        <p lang="hi" style={step(2)} className="mt-2 font-devanagari text-2xl font-semibold text-dharma-muted sm:text-[34px] sm:leading-tight">
          हर श्लोक, सम्पूर्ण।
        </p>
        <p style={step(3)} className="mx-auto mt-6 max-w-[640px] text-[17px] leading-[1.45] text-dharma-muted sm:text-[21px]">
          The Vedas, Upanishads, Gita, Itihāsas and Purāṇas in Sanskrit, with Hindi and English where the published text
          gives them. Free, quiet, and without ads.
        </p>
        <div style={step(4)} className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-7">
          <Link
            href="/scripture/bhagavadgita/"
            className="cta-primary inline-flex min-h-[44px] items-center rounded-full bg-dharma-saffron px-6 text-[17px] text-dharma-bg hover:opacity-95"
          >
            Begin the Bhagavad Gita
          </Link>
          <Link href="/scriptures/" className="chevron-nudge inline-flex min-h-[44px] items-center text-[17px] text-dharma-saffron hover:underline">
            Browse the library <span aria-hidden="true">&nbsp;›</span>
          </Link>
        </div>
        <div style={step(5)}>
          <HeroSearchButton />
        </div>
      </div>
    </section>
  );
}
