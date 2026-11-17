import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookOpen, Compass, Sparkles } from 'lucide-react';
import { HeroSearchButton } from './HeroSearchButton';
import { HeroHalo } from './HeroHalo';
import { HomeInquiryChips } from './HomeInquiryChips';

/**
 * Editorial home introduction: a type-led museum-style layout with a real, complete
 * featured verse, useful reading entrances, and an immediately available search.
 *
 * Server-rendered by design. Visual depth uses CSS only; no new client bundle,
 * image request or auto-playing media is introduced.
 */
export function HomeHero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="hero-stage relative isolate overflow-x-clip px-5 pb-12 pt-10 text-left sm:px-6 sm:pb-16 sm:pt-20 lg:pt-24"
    >
      <HeroHalo />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[580px] bg-[radial-gradient(ellipse_at_78%_24%,rgba(221,146,68,0.11),transparent_48%)]"
      />

      <div className="relative mx-auto grid w-full max-w-[1180px] items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        <div className="max-w-[660px]">
          <p className="inline-flex flex-wrap items-center gap-2 rounded-full border border-dharma-saffron/25 bg-dharma-saffron/10 px-3.5 py-2 text-xs font-semibold text-dharma-saffron">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-dharma-saffron" />
            <span>A living archive of Indian wisdom</span>
            <span aria-hidden="true" className="opacity-50">·</span>
            <span lang="hi" className="font-devanagari">सनातन ग्रन्थ कोश</span>
          </p>

          <h1
            id="hero-title"
            className="mt-6 max-w-[13ch] text-[clamp(2.9rem,6.5vw,5.8rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-dharma-text"
          >
            Ancient words.
            <span className="ink-dawn mt-1 block">Living wisdom.</span>
          </h1>
          <p
            lang="hi"
            className="mt-5 font-devanagari text-[clamp(1.25rem,2.35vw,1.9rem)] font-semibold leading-[1.5] text-dharma-text"
          >
            शास्त्रों से संवाद, जीवन के साथ।
          </p>
          <p className="mt-4 max-w-[53ch] text-body leading-relaxed text-dharma-muted sm:text-lg">
            Read the Vedas, Upanishads, Gita, Itihāsas and Purāṇas. Explore original texts,
            with Hindi and English meanings and carefully identified explanations where available.
          </p>

          <div className="mt-6 w-full [&>button]:!mx-0 [&>button]:!max-w-full">
            <HeroSearchButton />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href="/scriptures/"
              className="cta-primary focus-ring inline-flex min-h-[48px] items-center gap-2 rounded-full bg-dharma-saffron px-5 py-3 text-sm font-semibold text-dharma-bg shadow-raised motion-safe:transition-transform motion-safe:hover:-translate-y-0.5"
            >
              Explore the library <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href="/scripture/bhagavadgita/"
              className="chevron-nudge focus-ring inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-dharma-saffron hover:underline"
            >
              Start with the Gita <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-5 flex items-center gap-2 text-xs text-dharma-muted">
            <BookOpen aria-hidden="true" className="h-4 w-4 shrink-0 text-dharma-saffron" />
            Open access · No ads · No account required
          </p>
        </div>

        <aside className="relative min-w-0" aria-label="Featured paths into the library">
          <div className="pointer-events-none absolute -inset-3 rounded-[38px] border border-dharma-saffron/10 sm:-inset-4" aria-hidden="true" />
          <Link
            href="/scripture/bhagavadgita/chapter/2/verse/47/"
            data-tilt="subtle"
            className="focus-ring group relative flex min-h-[355px] flex-col justify-between overflow-hidden rounded-[30px] border border-amber-200/25 bg-[#321c27] p-6 text-[#fff7e9] shadow-[0_28px_68px_-36px_rgba(58,29,15,0.6)] motion-safe:hover:shadow-[0_34px_74px_-30px_rgba(58,29,15,0.65)] sm:min-h-[400px] sm:p-9"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_25%,rgba(245,189,100,0.21),transparent_42%),linear-gradient(140deg,rgba(181,88,53,0.13),transparent_65%)]" aria-hidden="true" />
            {/* Existing local Itihāsa artwork: contextual depth, not an illustration of this specific verse. */}
            <div
              aria-hidden="true"
              data-decorative
              className="pointer-events-none absolute inset-y-0 right-0 w-[72%] bg-cover bg-center opacity-[0.18]"
              style={{
                backgroundImage: "url('/verse-bg/itihasa.webp')",
                maskImage: 'linear-gradient(to right, transparent, black 55%)',
              }}
            />
            <div data-depth="4" className="pointer-events-none absolute -right-24 top-12 size-[310px] rounded-full border border-amber-200/15 sm:size-[370px]" aria-hidden="true" />
            <div data-depth="8" className="pointer-events-none absolute -right-12 top-24 size-[235px] rounded-full border border-amber-200/20 sm:size-[275px]" aria-hidden="true" />
            <div data-depth="4" className="pointer-events-none absolute -right-4 top-32 size-[165px] rounded-full border border-amber-200/15 sm:size-[200px]" aria-hidden="true" />

            <div className="relative flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#f4d39a]">
                  Featured passage · 01
                </p>
                <p lang="hi" className="mt-1 font-devanagari text-sm text-[#fbe6c4]">
                  श्रीमद्भगवद्गीता · अध्याय 2, श्लोक 47
                </p>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-full border border-amber-100/25 bg-white/10 text-[#fff7e9] motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5">
                <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
              </span>
            </div>

            <div className="relative my-8">
              <span className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-[#f4d39a]">
                <Sparkles aria-hidden="true" className="h-4 w-4" />
                Action &amp; intention
              </span>
              <h2 lang="sa" className="max-w-[21ch] font-devanagari text-[clamp(1.35rem,2.5vw,2rem)] font-semibold leading-[1.85] text-[#fffaf0]">
                कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।
                <br />
                मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥
              </h2>
            </div>

            <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-amber-100/20 pt-5">
              <p lang="hi" className="max-w-[27ch] font-devanagari text-sm leading-relaxed text-[#f8ddad]">
                कर्म, अपेक्षा और कर्तव्य पर एक विचार।
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#fff7e9]">
                Read the verse <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </div>
          </Link>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-4">
            <Link
              href="/scripture/ishavasya/"
              className="focus-ring group flex min-h-[138px] flex-col justify-between rounded-[22px] border border-dharma-border bg-dharma-card/95 p-4 shadow-raised motion-safe:transition-[transform,border-color] motion-safe:duration-base motion-safe:hover:-translate-y-1 hover:border-dharma-saffron/45 sm:p-5"
            >
              <span className="flex items-center justify-between text-dharma-saffron">
                <Compass aria-hidden="true" className="h-5 w-5" />
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
              </span>
              <span>
                <strong lang="hi" className="block font-devanagari text-base text-dharma-text">ईशावास्योपनिषद्</strong>
                <span className="mt-1 block text-xs text-dharma-muted">Discover the Upanishads</span>
              </span>
            </Link>
            <Link
              href="/daily-verse/"
              className="focus-ring group flex min-h-[138px] flex-col justify-between rounded-[22px] border border-dharma-saffron/20 bg-dharma-saffron/10 p-4 motion-safe:transition-[transform,border-color] motion-safe:duration-base motion-safe:hover:-translate-y-1 hover:border-dharma-saffron/50 sm:p-5"
            >
              <span className="flex items-center justify-between text-dharma-saffron">
                <BookOpen aria-hidden="true" className="h-5 w-5" />
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
              </span>
              <span>
                <strong lang="hi" className="block font-devanagari text-base text-dharma-text">आज का श्लोक</strong>
                <span className="mt-1 block text-xs text-dharma-muted">A moment to reflect</span>
              </span>
            </Link>
          </div>
        </aside>
      </div>

      <div className="relative mx-auto mt-16 max-w-[1180px] border-t border-dharma-border/70 pt-8 sm:mt-20 sm:pt-10">
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
