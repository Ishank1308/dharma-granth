import Link from 'next/link';
import { Compass, Sparkles, Flame } from 'lucide-react';
import { SectionTitle } from '@/app/components/apple/PageHeader';
import { HomeLivePanchang } from './HomeLivePanchang';

export function HomeSanctuaryGateway() {
  return (
    <section aria-labelledby="home-sanctuary-heading" className="mx-auto max-w-content px-5 pb-20">
      <SectionTitle
        id="home-sanctuary-heading"
        size="title-1"
        title="Living sanctuary"
        titleHi="पंचांग, साधना व जीवन-दर्शन"
      />

      <p className="mb-6 mt-2 max-w-[62ch] text-sm leading-relaxed text-dharma-muted sm:text-base">
        A little reading, reflection or practice — choose a doorway into the living traditions.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12 sm:gap-5">
        {/* 1. Live Panchang & Muhurta */}
        <article className="apple-card group relative isolate flex min-h-[295px] flex-col justify-between overflow-hidden rounded-panel border border-dharma-saffron/35 bg-dharma-card/75 bg-gradient-to-br from-dharma-saffron/12 via-dharma-card/70 to-dharma-card/80 p-6 shadow-raised backdrop-blur-xl motion-safe:transition-transform motion-safe:duration-base motion-safe:hover:-translate-y-1 md:col-span-2 xl:col-span-7 sm:p-7">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full border border-dharma-saffron/15" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-12 size-52 rounded-full border border-dharma-saffron/10" />
          <div>
            <HomeLivePanchang />
          </div>

          <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-dharma-border/60">
            <Link
              href="/panchang/"
              className="inline-flex min-h-[44px] items-center gap-1 rounded-full bg-dharma-saffron px-4 py-2 text-xs font-semibold text-dharma-bg transition-opacity hover:opacity-90"
            >
              <span lang="hi" className="font-devanagari">दैनिक पंचांग</span>
              <span aria-hidden="true">›</span>
            </Link>
            <Link
              href="/panchang/calendar/"
              className="inline-flex min-h-[44px] items-center gap-1 rounded-full border border-dharma-border/80 bg-dharma-bg/65 px-3.5 py-2 text-xs font-medium text-dharma-text backdrop-blur-sm transition-colors hover:border-dharma-saffron/50 hover:text-dharma-saffron"
            >
              <span lang="hi" className="font-devanagari">मासिक कैलेंडर</span>
            </Link>
            <Link
              href="/panchang/muhurta/"
              className="inline-flex min-h-[44px] items-center gap-1 rounded-full border border-dharma-border/80 bg-dharma-bg/65 px-3.5 py-2 text-xs font-medium text-dharma-text backdrop-blur-sm transition-colors hover:border-dharma-saffron/50 hover:text-dharma-saffron"
            >
              <span lang="hi" className="font-devanagari">मुहूर्त तालिका</span>
            </Link>
          </div>
        </article>

        {/* 2. Wisdom Pathways & Life Guidance */}
        <article className="apple-card group relative isolate flex min-h-[295px] flex-col justify-between overflow-hidden rounded-panel border border-dharma-border/80 bg-dharma-card/75 bg-gradient-to-br from-dharma-card/80 via-dharma-card/70 to-dharma-maroon/12 p-6 shadow-raised backdrop-blur-xl motion-safe:transition-transform motion-safe:duration-base motion-safe:hover:-translate-y-1 md:col-span-2 xl:col-span-5 sm:p-7">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -bottom-16 size-52 rounded-full border border-dharma-maroon/15" />
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-dharma-saffron">
              <Compass className="h-4 w-4" aria-hidden="true" />
              <span>Guided Inquiry</span>
              <span aria-hidden="true">·</span>
              <span lang="hi" className="font-devanagari normal-case">ज्ञान मार्ग</span>
            </span>

            <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-dharma-text sm:text-2xl">
              <Link href="/wisdom-pathways/" className="hover:text-dharma-saffron transition-colors">
                <span>Wisdom Pathways</span>{' '}
                <span lang="hi" className="font-devanagari font-normal text-dharma-muted">
                  · जीवन-मार्गदर्शन
                </span>
              </Link>
            </h3>

            <p lang="hi" className="mt-2.5 font-devanagari text-sm leading-relaxed text-dharma-muted">
              मानसिक तनाव, कर्तव्य-संकट, शोक, अहंकार और आत्म-जिज्ञासा — जीवन की वास्तविक परिस्थितियों से जुड़कर शास्त्रों का क्रमिक अध्ययन करें।
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-dharma-border/60">
            <Link
              href="/wisdom-pathways/"
              className="inline-flex min-h-[44px] items-center gap-1 rounded-full bg-dharma-saffron px-4 py-2 text-xs font-semibold text-dharma-bg transition-opacity hover:opacity-90"
            >
              <span lang="hi" className="font-devanagari">ज्ञान मार्ग चुनें</span>
              <span aria-hidden="true">›</span>
            </Link>
            <Link
              href="/wisdom-for-life/"
              className="inline-flex min-h-[44px] items-center gap-1 rounded-full border border-dharma-border/80 bg-dharma-bg/65 px-3.5 py-2 text-xs font-medium text-dharma-text backdrop-blur-sm transition-colors hover:border-dharma-saffron/50 hover:text-dharma-saffron"
            >
              <span lang="hi" className="font-devanagari">जीवन-समस्या समाधान</span>
            </Link>
            <Link
              href="/ask/"
              className="inline-flex min-h-[44px] items-center gap-1 rounded-full border border-dharma-border/80 bg-dharma-bg/65 px-3.5 py-2 text-xs font-medium text-dharma-text backdrop-blur-sm transition-colors hover:border-dharma-saffron/50 hover:text-dharma-saffron"
            >
              <span lang="hi" className="font-devanagari">धर्म जिज्ञासा</span>
            </Link>
          </div>
        </article>

        {/* 3. Sacred Mantras & Pilgrimage */}
        <article className="apple-card group relative isolate flex min-h-[245px] flex-col justify-between overflow-hidden rounded-panel border border-dharma-border/80 bg-dharma-card/75 bg-gradient-to-br from-dharma-card/80 to-dharma-saffron/12 p-6 shadow-raised backdrop-blur-xl motion-safe:transition-transform motion-safe:duration-base motion-safe:hover:-translate-y-1 xl:col-span-6 sm:p-7">
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 size-44 rounded-full border border-dharma-saffron/15" />
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-dharma-saffron">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>Vedic Chants</span>
              <span aria-hidden="true">·</span>
              <span lang="hi" className="font-devanagari normal-case">मन्त्र व तीर्थ</span>
            </span>

            <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-dharma-text sm:text-2xl">
              <Link href="/mantras/" className="hover:text-dharma-saffron transition-colors">
                <span>Sacred Mantras</span>{' '}
                <span lang="hi" className="font-devanagari font-normal text-dharma-muted">
                  · मन्त्र व शान्ति पाठ
                </span>
              </Link>
            </h3>

            <p lang="hi" className="mt-2.5 font-devanagari text-sm leading-relaxed text-dharma-muted">
              गायत्री, महामृत्युंजय एवं औपनिषद शान्ति मन्त्रों का शुद्ध संस्कृत पाठ, पदच्छेद, ऋषि-छन्द परिचय और सरल हिन्दी भावार्थ।
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-dharma-border/60">
            <Link
              href="/mantras/"
              className="inline-flex min-h-[44px] items-center gap-1 rounded-full bg-dharma-saffron px-4 py-2 text-xs font-semibold text-dharma-bg transition-opacity hover:opacity-90"
            >
              <span lang="hi" className="font-devanagari">मन्त्र संग्रह खोलें</span>
              <span aria-hidden="true">›</span>
            </Link>
            <Link
              href="/locations/"
              className="inline-flex min-h-[44px] items-center gap-1 rounded-full border border-dharma-border/80 bg-dharma-bg/65 px-3.5 py-2 text-xs font-medium text-dharma-text backdrop-blur-sm transition-colors hover:border-dharma-saffron/50 hover:text-dharma-saffron"
            >
              <span lang="hi" className="font-devanagari">पवित्र स्थान</span>
            </Link>
          </div>
        </article>

        {/* 4. Daily Sadhana & Puja Vidhi */}
        <article className="apple-card group relative isolate flex min-h-[245px] flex-col justify-between overflow-hidden rounded-panel border border-dharma-border/80 bg-dharma-card/75 bg-gradient-to-br from-dharma-card/80 to-dharma-gold/12 p-6 shadow-raised backdrop-blur-xl motion-safe:transition-transform motion-safe:duration-base motion-safe:hover:-translate-y-1 xl:col-span-6 sm:p-7">
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 -bottom-14 size-44 rounded-full border border-dharma-gold/15" />
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-dharma-saffron">
              <Flame className="h-4 w-4" aria-hidden="true" />
              <span>Daily Practice</span>
              <span aria-hidden="true">·</span>
              <span lang="hi" className="font-devanagari normal-case">दैनिक साधना</span>
            </span>

            <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-dharma-text sm:text-2xl">
              <Link href="/practice/" className="hover:text-dharma-saffron transition-colors">
                <span>Sadhana &amp; Rituals</span>{' '}
                <span lang="hi" className="font-devanagari font-normal text-dharma-muted">
                  · जप, ध्यान व पूजा विधि
                </span>
              </Link>
            </h3>

            <p lang="hi" className="mt-2.5 font-devanagari text-sm leading-relaxed text-dharma-muted">
              शांत 108-मनका जप माला, प्राणायाम श्वास-लय, 365-दिवसीय गीता स्वाध्याय संकल्प और पारम्परिक वैदिक पूजा विधान।
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-dharma-border/60">
            <Link
              href="/practice/"
              className="inline-flex min-h-[44px] items-center gap-1 rounded-full bg-dharma-saffron px-4 py-2 text-xs font-semibold text-dharma-bg transition-opacity hover:opacity-90"
            >
              <span lang="hi" className="font-devanagari">साधना कक्ष</span>
              <span aria-hidden="true">›</span>
            </Link>
            <Link
              href="/practice/gita-sankalpa/"
              className="inline-flex min-h-[44px] items-center gap-1 rounded-full border border-dharma-border bg-dharma-bg px-3.5 py-2 text-xs font-medium text-dharma-text transition-colors hover:border-dharma-saffron/50 hover:text-dharma-saffron"
            >
              <span lang="hi" className="font-devanagari">गीता संकल्प (365 दिन)</span>
            </Link>
            <Link
              href="/rituals/"
              className="inline-flex min-h-[44px] items-center gap-1 rounded-full border border-dharma-border bg-dharma-bg px-3.5 py-2 text-xs font-medium text-dharma-text transition-colors hover:border-dharma-saffron/50 hover:text-dharma-saffron"
            >
              <span lang="hi" className="font-devanagari">पूजा व संस्कार</span>
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
