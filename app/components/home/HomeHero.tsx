import Link from 'next/link';
import type { CSSProperties } from 'react';
import { HeroSearchButton } from './HeroSearchButton';
import { HeroHalo } from './HeroHalo';
import { HomeInquiryChips } from './HomeInquiryChips';

/** Stagger index for the hero's entrance (app/motion.css, .hero-rise). */
const step = (i: number) => ({ '--i': i }) as CSSProperties;

/**
 * Home hero in the Apple idiom: one large promise, filled action buttons, search field,
 * and life inquiry quick chips.
 * A server component, so the whole hero is in the exported HTML; search is a client island.
 * Motion is CSS only: lines come into focus in turn, kāla-chakra halo turns slowly behind them.
 */
export function HomeHero() {
  return (
    <section aria-labelledby="hero-title" className="hero-stage overflow-x-clip px-4 pb-10 pt-10 text-center sm:px-5 sm:pb-16 sm:pt-24">
      <HeroHalo />
      <div className="hero-content hero-rise mx-auto max-w-4xl">
        {/* Sacred Trust Eyebrow Pill */}
        {/* On a phone the two phrases sit on two whole lines instead of breaking word by word. */}
        <div style={step(0)} className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 rounded-2xl border border-dharma-saffron/30 bg-dharma-saffron/10 px-4 py-1.5 text-xs font-semibold text-dharma-saffron shadow-xs backdrop-blur-xs sm:rounded-full">
          <span className="whitespace-nowrap"><span aria-hidden="true">ॐ</span> <span>Hindu Scriptures, Whole</span></span>
          <span aria-hidden="true" className="hidden opacity-60 sm:inline">·</span>
          <span lang="hi" className="whitespace-nowrap font-devanagari">सनातन ग्रन्थ कोश (67 ग्रन्थ · 1,32,000+ श्लोक)</span>
        </div>

        <h1
          id="hero-title"
          style={step(1)}
          className="mt-4 text-display font-semibold text-dharma-text"
        >
          Every verse.
          <br />
          Complete.
        </h1>
        <p lang="hi" style={step(2)} className="mt-2 font-devanagari text-2xl font-semibold text-dharma-muted sm:text-[34px] sm:leading-tight">
          हर श्लोक, सम्पूर्ण।
        </p>
        <p style={step(3)} className="mx-auto mt-4 max-w-[640px] sm:mt-6 text-body leading-[1.45] text-dharma-muted sm:text-[21px]">
          The Vedas, Upanishads, Gita, Itihāsas and Purāṇas in Sanskrit, with Hindi and English where the published text
          gives them. Free, quiet, and without ads.
        </p>

        {/* Primary Call to Actions */}
        <div style={step(4)} className="mt-6 flex flex-col items-center justify-center gap-2 sm:mt-8 sm:flex-row sm:gap-7">
          <Link
            href="/scripture/bhagavadgita/"
            className="cta-primary inline-flex min-h-[44px] items-center rounded-full bg-dharma-saffron px-6 text-body font-medium text-dharma-bg shadow-sm transition-transform hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]"
          >
            Begin the Bhagavad Gita
          </Link>
          <Link href="/scriptures/" className="chevron-nudge inline-flex min-h-[44px] items-center text-body font-medium text-dharma-saffron hover:underline">
            Browse the library <span aria-hidden="true">&nbsp;›</span>
          </Link>
        </div>

        {/* Global Search Button */}
        <div style={step(5)}>
          <HeroSearchButton />
        </div>

        {/* Life Inquiries & Quick Dilemma Chips */}
        <div style={step(6)}>
          <HomeInquiryChips />
        </div>
      </div>
    </section>
  );
}
