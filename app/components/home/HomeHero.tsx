/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookOpen, Compass } from 'lucide-react';
import { HeroSearchButton } from './HeroSearchButton';
import { HeroHalo } from './HeroHalo';
import { HomeInquiryChips } from './HomeInquiryChips';

/**
 * Editorial home introduction: warm 2-column split hero with serif typography,
 * an elevated scoped search panel, clear dark/amber CTAs, and an atmospheric
 * featured passage showcase card.
 *
 * Server-rendered by design (0 extra JS beyond HeroSearchButton).
 */
export function HomeHero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="hero-stage relative isolate overflow-x-clip px-5 pb-12 pt-8 text-left sm:px-6 sm:pb-16 sm:pt-14 lg:pt-16"
    >
      <HeroHalo />
      <div
        aria-hidden="true"
        className="hero-daylight pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(ellipse_at_75%_22%,rgba(221,146,68,0.12),transparent_52%)]"
      />

      <div className="relative mx-auto grid w-full max-w-[1180px] items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12 xl:gap-16">
        {/* Left Column: Editorial Heading, Elevated Search Card & Primary CTAs */}
        <div className="max-w-[640px]">
          <p className="daypart-greeting mb-2.5 font-devanagari text-footnote font-semibold text-dharma-muted" />
          <p className="inline-flex flex-wrap items-center gap-2 rounded-full border border-dharma-border/80 bg-dharma-card/85 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-dharma-muted shadow-xs backdrop-blur-md">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#d98a1c]" />
            <span>A living archive of Indian wisdom</span>
            <span aria-hidden="true" className="opacity-50">·</span>
            <span lang="hi" className="font-devanagari normal-case tracking-normal text-dharma-text">
              सनातन ग्रन्थ कोश
            </span>
          </p>

          <h1
            id="hero-title"
            className="mt-5 font-serif text-[clamp(1.6rem,11vw,3.1rem)] sm:text-[clamp(2.9rem,6vw,4.5rem)] lg:text-[clamp(3.1rem,4.8vw,4.4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-dharma-text"
          >
            Ancient words.
            <span className="mt-1 block text-[#9a4b25] dark:text-[#f0a56b]">Living wisdom.</span>
          </h1>

          <p
            lang="hi"
            className="mt-4 font-devanagari text-[clamp(1.2rem,2.2vw,1.7rem)] font-medium leading-[1.5] text-dharma-text/85"
          >
            शास्त्रों से संवाद, जीवन के साथ।
          </p>

          <p className="mt-3.5 max-w-[54ch] text-body leading-relaxed text-dharma-muted sm:text-[17px]">
            Read the Vedas, Upanishads, Gita, Itihāsas and Purāṇas. Explore original Sanskrit texts
            with Hindi and English meanings, crafted for undistracted contemplation.
          </p>

          {/* Elevated Search Card */}
          <div className="mt-6 w-full">
            <HeroSearchButton />
          </div>

          {/* Primary CTA Buttons */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/scriptures/"
              className="cta-primary focus-ring inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-[#1f1e1c] px-5 py-3 text-sm font-semibold text-[#fdfbf7] shadow-raised transition hover:bg-[#33302c] dark:bg-dharma-text dark:text-dharma-bg dark:hover:opacity-90"
            >
              <span>Explore the library</span>
              <span aria-hidden="true" className="opacity-60">·</span>
              <span lang="hi" className="font-devanagari">ग्रन्थालय देखें</span>
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href="/scripture/bhagavadgita/"
              className="chevron-nudge focus-ring inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-[#e39b1e] px-5 py-3 text-sm font-semibold text-[#1d1408] shadow-xs transition hover:bg-[#cf8a14]"
            >
              <BookOpen aria-hidden="true" className="h-4 w-4" />
              <span>Start with the Gita</span>
              <span aria-hidden="true" className="opacity-60">·</span>
              <span lang="hi" className="font-devanagari">भगवद्गीता</span>
            </Link>
          </div>

          <p className="mt-4 flex items-center gap-2 text-xs text-dharma-muted">
            <BookOpen aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-dharma-saffron" />
            Open access · No ads · No account required
          </p>
        </div>

        {/* Right Column: Atmospheric Featured Passage Card + Quick Paths */}
        <aside className="relative min-w-0" aria-label="Featured paths into the library">
          <Link
            href="/scripture/bhagavadgita/chapter/2/verse/47/"
            data-tilt="subtle"
            className="focus-ring group relative flex min-h-[390px] flex-col justify-end overflow-hidden rounded-[22px] border border-amber-200/25 bg-[#1a120c] p-6 text-[#fff9ef] shadow-[0_26px_64px_-28px_rgba(32,18,8,0.58)] transition-shadow hover:shadow-[0_32px_72px_-24px_rgba(32,18,8,0.68)] sm:min-h-[445px] sm:p-7"
          >
            {/* Atmospheric temple scholar artwork in the upper canvas */}
            <img
              src="/images/curated/scenes/home-hero-scholar.webp"
              alt=""
              aria-hidden="true"
              width={700}
              height={503}
              decoding="async"
              className="curated-scene-media pointer-events-none absolute inset-x-0 top-0 h-[76%] w-full object-cover object-top transition-transform duration-700 motion-safe:group-hover:scale-[1.03]"
            />
            {/* Retained local Itihāsa texture layer for graceful blending & Data Saver fallback */}
            <div
              aria-hidden="true"
              data-decorative
              className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.12]"
              style={{
                backgroundImage: "url('/verse-bg/itihasa.webp')",
              }}
            />
            {/* Smooth dark sandstone gradient scrim keeping text razor-crisp */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#16100b] via-[#16100b]/85 via-42% to-transparent"
            />

            {/* Top-right open indicator */}
            <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5">
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </span>

            {/* Bottom Editorial Featured Passage Overlay */}
            <div className="relative z-10 space-y-2.5 pt-44 sm:pt-52">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-[#e39b1e] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1c1306]">
                  Featured passage · 01
                </span>
                <span lang="hi" className="font-devanagari text-xs font-medium text-[#f5dec0]">
                  श्रीमद्भगवद्गीता · 2.47
                </span>
              </div>

              <h2
                lang="sa"
                className="font-devanagari text-[clamp(1.2rem,2.1vw,1.55rem)] font-bold leading-[1.65] text-[#fffaf2] drop-shadow-sm"
              >
                कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।
                <span className="mt-0.5 block text-[0.86em] font-semibold text-[#f3dfbe]">
                  मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥
                </span>
              </h2>

              <p className="text-xs sm:text-sm leading-relaxed text-[#e6d5bc]">
                Your right is to action alone, never to its fruits.
              </p>

              <div className="flex items-center justify-between border-t border-white/15 pt-3 text-xs">
                <span lang="hi" className="font-devanagari text-[#f2cfa0]">
                  कर्म, अपेक्षा और कर्तव्य पर एक विचार।
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-[#fff7e9]">
                  Read the verse <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </Link>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link
              href="/scripture/ishavasya/"
              className="apple-card focus-ring group flex min-h-[104px] flex-col justify-between rounded-2xl border border-dharma-border/80 bg-dharma-card/85 p-3.5 shadow-soft backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-dharma-saffron/45 sm:p-4"
            >
              <span className="flex items-center justify-between text-dharma-saffron">
                <Compass aria-hidden="true" className="h-4 w-4" />
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
              </span>
              <span>
                <strong lang="hi" className="block font-devanagari text-sm sm:text-base text-dharma-text">ईशावास्योपनिषद्</strong>
                <span className="mt-0.5 block text-xs text-dharma-muted">Discover the Upanishads</span>
              </span>
            </Link>
            <Link
              href="/daily-verse/"
              className="apple-card focus-ring group flex min-h-[104px] flex-col justify-between rounded-2xl border border-dharma-saffron/25 bg-dharma-saffron/10 p-3.5 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-dharma-saffron/50 sm:p-4"
            >
              <span className="flex items-center justify-between text-dharma-saffron">
                <BookOpen aria-hidden="true" className="h-4 w-4" />
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
              </span>
              <span>
                <strong lang="hi" className="block font-devanagari text-sm sm:text-base text-dharma-text">आज का श्लोक</strong>
                <span className="mt-0.5 block text-xs text-dharma-muted">A moment to reflect</span>
              </span>
            </Link>
          </div>
        </aside>
      </div>

      <div className="relative mx-auto mt-14 max-w-[1180px] border-t border-dharma-border/70 pt-8 sm:mt-16 sm:pt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-dharma-saffron">Begin with a question</p>
            <h2 className="mt-2 text-title-2 font-semibold text-dharma-text">Find your way into the texts</h2>
          </div>
          <p lang="hi" className="font-devanagari text-sm text-dharma-muted">ज्ञान और साधना के सरल प्रवेश-द्वार</p>
        </div>
        <HomeInquiryChips />
      </div>
    </section>
  );
}
