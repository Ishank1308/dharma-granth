import Link from 'next/link';
import type { AshtavakraVerse } from '@/lib/ashtavakra';
import { keepDanda, verseHref } from '@/lib/ashtavakra';
import { ConceptVisual } from './visuals';
import { ReadFlag } from './VerseBits';
import { ConnectedFlow, SacredSection } from '@/app/components/reader/SacredReadingFlow';
import { ReflectionBody } from '@/app/components/ModernContextBlock';

/** Splits blank-line separated text into paragraphs; keeps single line breaks. */
export function Paras({ text, className = '' }: { text: string; className?: string }) {
  if (!text) return null;
  return (
    <div className={className}>
      {text.split(/\n\n+/).map((p, i) => (
        <p key={i} style={{ whiteSpace: 'pre-line' }}>{p}</p>
      ))}
    </div>
  );
}

/** Verification state in words and an icon, never colour alone. */
export function VerificationBadge({ status }: { status: AshtavakraVerse['verificationStatus'] }) {
  const ok = status === 'verified';
  return (
    <span
      className={`inline-flex min-h-[32px] items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${
        ok
          ? 'border-emerald-600/40 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200'
          : 'border-amber-600/40 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200'
      }`}
    >
      <span aria-hidden="true">{ok ? '✓' : '⚠'}</span>
      {ok ? 'सत्यापित' : 'समीक्षा आवश्यक'}
    </span>
  );
}

/** Picks one concept picture for a verse from its themes, or none. */
function conceptFor(themes: string[]) {
  if (themes.includes('साक्षीभाव')) return 'sakshi' as const;
  if (themes.includes('अकर्तापन')) return 'akarta' as const;
  if (themes.includes('अहंकार')) return 'ahankara' as const;
  if (themes.includes('वैराग्य')) return 'vairagya' as const;
  if (themes.includes('अद्वैत') || themes.includes('चेतना')) return 'ocean' as const;
  return null;
}

/** Compact card for a chapter's verse list. Full text stays on the verse page. */
export function VerseCompact({ v }: { v: AshtavakraVerse }) {
  const num = v.verseNumber.split('.')[1];
  return (
    <article
      className="scroll-mt-24 rounded-3xl border border-dharma-border bg-dharma-card p-5 shadow-sm sm:p-6"
      aria-labelledby={`vc-${v.verseNumber}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id={`vc-${v.verseNumber}`} lang="hi" className="font-devanagari text-xs font-bold uppercase tracking-[0.14em] text-saffron-700 dark:text-saffron-400">
          श्लोक {v.verseNumber}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <ReadFlag id={v.verseNumber} />
          <VerificationBadge status={v.verificationStatus} />
        </div>
      </div>
      <p lang="sa" className="mt-3 text-center font-devanagari text-xl font-bold leading-loose text-dharma-text" style={{ whiteSpace: 'pre-line' }}>
        {keepDanda(v.sanskrit)}
      </p>
      <p lang="hi" className="mt-2 text-center font-devanagari text-sm text-dharma-muted">
        {v.oneLineSummaryHindi}
      </p>
      <div className="mt-4 text-center">
        <Link
          href={verseHref(v.verseNumber)}
          aria-label={`श्लोक ${num} की पूरी व्याख्या पढ़ें`}
          className="inline-flex min-h-[44px] items-center rounded-xl border border-dharma-border bg-dharma-card px-4 py-2 text-sm font-semibold text-dharma-text transition hover:border-saffron-400"
        >
          पूरी व्याख्या पढ़ें <span aria-hidden="true" className="ml-1">→</span>
        </Link>
      </div>
    </article>
  );
}

const proseHi = 'font-devanagari text-sm leading-loose text-dharma-text md:text-base';
const proseRelaxedHi = 'font-devanagari text-sm leading-relaxed text-dharma-text md:text-base';

/**
 * The full verse in the single sacred reading order
 * (lib/sacred-reading-order.ts): Verse, Arth, Vyakhya, Modern Context,
 * Reflection, Related Wisdom — the same sections, order and design language
 * as every other scripture. All content fields, word meanings and
 * verification honesty are preserved; only the parallel shell is gone.
 */
export function VerseFull({ v }: { v: AshtavakraVerse }) {
  const concept = conceptFor(v.themes);
  const review = v.verificationStatus !== 'verified';
  const id = `ash-${v.verseNumber.replace(/\./g, '-')}`;
  return (
    <div className="sacred-flow-wrap">
      {/* ── Verse: scripture first, reading aids folded beneath it ── */}
      <SacredSection id={`${id}-verse`} section="verse">
        <div className="verse-leaf relative rounded-2xl px-5 py-6 text-center md:px-10 md:py-8">
          <span aria-hidden="true" className="verse-leaf-ornament left-3 top-2">❁</span>
          <span aria-hidden="true" className="verse-leaf-ornament right-3 top-2">❁</span>
          <p className="mb-3 text-xs font-semibold text-dharma-muted">वक्ता: {v.speaker}</p>
          <p lang="sa" className="font-devanagari text-2xl font-bold leading-loose text-dharma-text sm:text-3xl" style={{ whiteSpace: 'pre-line' }}>
            {keepDanda(v.sanskrit)}
          </p>
          {v.iast && (
            <p lang="sa-Latn" className="mx-auto mt-4 max-w-2xl whitespace-pre-line border-t border-amber-700/15 pt-4 font-serif text-sm italic leading-relaxed text-dharma-muted">
              {v.iast}
            </p>
          )}
          {v.simplePronunciation && (
            <p className="mt-2 text-xs text-dharma-muted">
              <strong>सरल उच्चारण:</strong> {v.simplePronunciation}
            </p>
          )}
        </div>
        {review && (
          <p role="note" className="rounded-xl border border-amber-600/40 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
            <strong>[पृष्ठ से सत्यापन आवश्यक]</strong> पुस्तक के छपे पाठ में भेद मिला है; नीचे “स्रोत और सत्यापन” देखें। पाठ को पुस्तक में जैसा छपा है वैसा ही रखा गया है।
          </p>
        )}
        {v.wordMeanings && v.wordMeanings.length > 0 && (
          <details className="rounded-2xl border border-dharma-border bg-dharma-card">
            <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold text-dharma-text transition hover:bg-dharma-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-saffron-500 [&::-webkit-details-marker]:hidden">
              <span><span lang="hi" className="font-devanagari">पदच्छेद और प्रमुख शब्दार्थ</span> <span className="font-normal text-dharma-muted">· Word-by-word</span></span>
              <span className="shrink-0 text-xs font-medium text-dharma-muted">{v.wordMeanings.length} शब्द</span>
            </summary>
            <div className="space-y-3 border-t border-dharma-border/60 p-4">
              {v.padaccheda && (
                <p lang="sa" className="border-b border-dharma-border/60 pb-2 font-devanagari text-sm font-semibold text-dharma-text">
                  {v.padaccheda}
                </p>
              )}
              <dl className="grid gap-2 sm:grid-cols-2">
                {v.wordMeanings.map((w) => (
                  <div key={w.sanskrit} className="rounded-xl border border-dharma-border/70 bg-dharma-bg/60 p-2.5 text-sm">
                    <dt lang="sa" className="font-devanagari font-bold text-dharma-text">{w.sanskrit}</dt>
                    <dd lang="hi" className="mt-0.5 font-devanagari text-xs text-dharma-muted">{w.hindi}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-right text-xs">
                <Link href="/ashtavakra/words/" className="font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-300">
                  शब्द-अन्वेषण कोश देखें →
                </Link>
              </p>
            </div>
          </details>
        )}
      </SacredSection>

      {/* ── Arth: what it says, literally ── */}
      <SacredSection id={`${id}-arth`} section="arth">
        <div className="rounded-2xl border border-dharma-border/70 bg-dharma-card-soft/70 p-4 shadow-2xs sm:p-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
            शाब्दिक हिन्दी अर्थ · Literal Hindi Meaning
          </p>
          <p lang="hi" className="font-devanagari text-base leading-relaxed text-dharma-text sm:text-lg">
            {v.literalHindiMeaning}
          </p>
        </div>
        {v.englishTranslation && (
          <div className="rounded-2xl border border-dharma-border/70 bg-dharma-card/70 p-4 shadow-2xs sm:p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-dharma-muted">
              English Translation
            </p>
            <p lang="en" className="font-serif text-sm leading-relaxed text-dharma-text sm:text-base">
              {v.englishTranslation}
            </p>
          </div>
        )}
      </SacredSection>

      {/* ── Vyakhya → Modern Context → Reflection: one connected flow ── */}
      <ConnectedFlow label="व्याख्या से आधुनिक जीवन तक · From explanation to modern life">
        <SacredSection id={`${id}-vyakhya`} section="vyakhya">
          {v.bookBasedHindiExplanation && (
            <div className="rounded-2xl border border-dharma-border/70 bg-dharma-card/70 p-4 shadow-2xs sm:p-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-300">
                पुस्तकानुसार हिन्दी भावार्थ · Commentary
              </p>
              <p className="mb-2 text-[11px] leading-relaxed text-dharma-muted">पुस्तक की भाषा-टीका का मौलिक पुनर्कथन, शब्दशः प्रति नहीं।</p>
              <Paras text={v.bookBasedHindiExplanation} className={proseHi} />
            </div>
          )}
          {v.simpleHindiExplanation && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-dharma-muted">
                सरल हिन्दी में समझें · In simple Hindi
              </p>
              <Paras text={v.simpleHindiExplanation} className={proseRelaxedHi} />
            </div>
          )}
          {v.simpleEnglishExplanation && (
            <p lang="en" className="font-serif text-sm leading-relaxed text-dharma-text">
              <span className="font-semibold">In simple English: </span>{v.simpleEnglishExplanation}
            </p>
          )}
          {v.philosophicalExplanationHindi && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-dharma-muted">
                गहरी दार्शनिक व्याख्या · Deep philosophical insight
              </p>
              <Paras text={v.philosophicalExplanationHindi} className={proseRelaxedHi} />
              {v.analogyHindi && (
                <p lang="hi" className="mt-3 rounded-xl border border-dharma-border bg-dharma-card-soft p-3 font-devanagari text-sm leading-relaxed text-dharma-text">
                  <span className="font-bold">उदाहरण से समझें:</span> {v.analogyHindi}
                </p>
              )}
            </div>
          )}
          {v.commonMisunderstandingHindi && (
            <div className="rounded-2xl border border-rose-200/80 bg-rose-50/60 p-4 dark:border-rose-900/40 dark:bg-rose-950/20">
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
                सामान्य भ्रम निवारण · What it does NOT mean
              </p>
              <p lang="hi" className="font-devanagari text-sm leading-relaxed text-rose-950 dark:text-rose-100">
                {v.commonMisunderstandingHindi}
              </p>
            </div>
          )}
          {concept && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-dharma-muted">
                प्रतीकात्मक चित्र-व्याख्या · Symbolic visual
              </p>
              <p className="mb-2 text-[11px] leading-relaxed text-dharma-muted">संपादकीय सहायक चित्र; यह श्लोक का शाब्दिक अर्थ नहीं है।</p>
              <ConceptVisual id={concept} />
            </div>
          )}
        </SacredSection>

        <SacredSection id={`${id}-modern`} section="modern">
          <p className="text-[11px] leading-relaxed text-dharma-muted">यह एक आधुनिक संपादकीय उदाहरण है, श्लोक का अर्थ या अनुवाद नहीं।</p>
          {v.modernExampleHindi && (
            <p lang="hi" className={proseRelaxedHi}>{v.modernExampleHindi}</p>
          )}
          {v.messageForTodayHindi && (
            <p lang="hi" className={proseRelaxedHi}>
              <span className="font-bold">आज की पीढ़ी के लिए संदेश:</span> {v.messageForTodayHindi}
            </p>
          )}
          {v.practicalApplicationHindi && (
            <div className="rounded-xl border border-dharma-border bg-dharma-card-soft p-4 sm:p-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-dharma-muted">
                आज के जीवन में प्रयोग · Practical application
              </p>
              <p lang="hi" className="font-devanagari text-sm font-medium leading-relaxed text-dharma-text/95 md:text-base">
                {v.practicalApplicationHindi}
              </p>
            </div>
          )}
        </SacredSection>

        <SacredSection id={`${id}-reflection`} section="reflection">
          {v.reflectionQuestionHindi && (
            <ReflectionBody question={v.reflectionQuestionHindi} lang="hi" />
          )}
          {v.shortPracticeHindi && (
            <p lang="hi" className={proseRelaxedHi}>
              <span className="font-bold">छोटा अभ्यास:</span> {v.shortPracticeHindi}
            </p>
          )}
          <p className="text-[11px] leading-relaxed text-dharma-muted">यह चिंतन-अभ्यास है, कोई चिकित्सा या उपचार नहीं। असुविधा हो तो रुकिए और किसी विश्वसनीय व्यक्ति से बात कीजिए।</p>
          {v.oneLineSummaryHindi && (
            <p lang="hi" className="font-devanagari text-sm font-bold leading-relaxed text-dharma-text">
              एक पंक्ति में सार: {v.oneLineSummaryHindi}
            </p>
          )}
        </SacredSection>
      </ConnectedFlow>

      {/* ── Related Wisdom ── */}
      <SacredSection id={`${id}-related`} section="related">
        <ul className="flex flex-wrap gap-2" aria-label="विषय">
          {v.themes.map((t) => (
            <li key={t} className="rounded-full border border-dharma-border/70 bg-dharma-bg/70 px-3 py-1 text-xs font-medium text-dharma-text">
              {t}
            </li>
          ))}
        </ul>
        {v.relatedVerses.length > 0 && (
          <div>
            <p lang="hi" className="mb-2 text-[11px] leading-relaxed text-dharma-muted">ये उसी अष्टावक्र गीता के भीतर के संपादकीय संबंध हैं।</p>
            <ul className="grid gap-2" aria-label="संबंधित श्लोक">
              {v.relatedVerses.map((r) => (
                <li key={r.id} className="text-sm text-dharma-text">
                  <Link href={verseHref(r.id)} className="font-bold text-saffron-800 underline underline-offset-2 dark:text-saffron-300">
                    श्लोक {r.id}
                  </Link>
                  <span lang="hi">: {r.reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </SacredSection>

      {/* ── Sources and verification: provenance footer, quiet by design ── */}
      <section aria-labelledby={`${id}-sources`} className="sacred-section rounded-2xl border border-dharma-border/70 bg-dharma-card/60 p-4 sm:p-5">
        <h3 id={`${id}-sources`} className="mb-2.5 flex flex-wrap items-baseline gap-x-2">
          <span lang="hi" className="font-devanagari text-subhead font-bold text-dharma-text">स्रोत और सत्यापन</span>
          <span lang="en" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-dharma-muted">Sources</span>
        </h3>
        <p className="flex flex-wrap items-center gap-2">
          <VerificationBadge status={v.verificationStatus} />
          <span className="text-xs text-dharma-muted">{v.sourcePage}</span>
        </p>
        {v.editorialNotes && (
          <p lang="hi" className="mt-2 font-devanagari text-sm leading-relaxed text-dharma-text">
            <span className="font-bold">संपादकीय टिप्पणी:</span> {v.editorialNotes}
          </p>
        )}
      </section>
    </div>
  );
}
