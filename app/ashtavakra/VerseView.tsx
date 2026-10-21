import Link from 'next/link';
import type { AshtavakraVerse } from '@/lib/ashtavakra';
import { keepDanda, verseHref } from '@/lib/ashtavakra';
import { ConceptVisual } from './visuals';
import { ReadFlag } from './VerseBits';

/** Splits blank-line separated text into paragraphs; keeps single line breaks. */
export function Paras({ text, className = '' }: { text: string; className?: string }) {
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
    <span className="ash-chip" style={{ fontWeight: 700, borderColor: ok ? 'var(--ash-teal)' : 'var(--ash-accent)' }}>
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
    <article className="ash-card ash-reveal" aria-labelledby={`vc-${v.verseNumber}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id={`vc-${v.verseNumber}`} className="ash-eyebrow">श्लोक {v.verseNumber}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <ReadFlag id={v.verseNumber} />
          <VerificationBadge status={v.verificationStatus} />
        </div>
      </div>
      <p lang="sa" className="ash-sanskrit mt-2" style={{ whiteSpace: 'pre-line' }}>{keepDanda(v.sanskrit)}</p>
      <p lang="hi" className="ash-hindi mt-1">{v.oneLineSummaryHindi}</p>
      <Link href={verseHref(v.verseNumber)} className="ash-btn mt-3" aria-label={`श्लोक ${num} की पूरी व्याख्या पढ़ें`}>
        पूरी व्याख्या पढ़ें
      </Link>
    </article>
  );
}

function Section({ id, title, children, tone }: { id: string; title: string; children: React.ReactNode; tone?: 'soft' }) {
  return (
    <section aria-labelledby={id} className={`ash-card ${tone === 'soft' ? '' : ''}`}>
      <h2 id={id} className="font-bold" style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>{title}</h2>
      {children}
    </section>
  );
}

/** The full verse, in the order the brief specifies. All text is plain HTML. */
export function VerseFull({ v }: { v: AshtavakraVerse }) {
  const concept = conceptFor(v.themes);
  const review = v.verificationStatus !== 'verified';
  return (
    <div className="grid gap-5">
      {/* 4 Sanskrit (the strongest element) */}
      <section aria-labelledby="sk" className="ash-card" style={{ textAlign: 'center' }}>
        <h2 id="sk" className="ash-eyebrow">मूल संस्कृत</h2>
        <p className="ash-meta mt-1">वक्ता: {v.speaker}</p>
        <p lang="sa" className="ash-sanskrit mt-3" style={{ whiteSpace: 'pre-line' }}>{keepDanda(v.sanskrit)}</p>
        {review && (
          <p role="note" className="mt-3 ash-meta" style={{ borderTop: '1px solid var(--ash-line)', paddingTop: '0.75rem' }}>
            <strong>[पृष्ठ से सत्यापन आवश्यक]</strong> पुस्तक के छपे पाठ में भेद मिला है; नीचे “स्रोत और सत्यापन” देखें। पाठ को पुस्तक में जैसा छपा है वैसा ही रखा गया है।
          </p>
        )}
      </section>

      <Section id="iast" title="IAST लिप्यंतरण">
        <p lang="sa-Latn" className="ash-en" style={{ whiteSpace: 'pre-line', fontStyle: 'italic' }}>{v.iast}</p>
        <p className="ash-meta mt-3"><strong>सरल उच्चारण:</strong> {v.simplePronunciation}</p>
      </Section>

      <Section id="wm" title="पदच्छेद और प्रमुख शब्दार्थ">
        <p lang="sa" className="ash-hindi">{v.padaccheda}</p>
        <dl className="mt-3 grid gap-x-6 gap-y-2" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
          {v.wordMeanings.map((w) => (
            <div key={w.sanskrit} className="grid gap-1 sm:grid-cols-[minmax(0,12rem)_1fr]">
              <dt lang="sa" className="font-bold">{w.sanskrit}</dt>
              <dd lang="hi">{w.hindi}</dd>
            </div>
          ))}
        </dl>
        <p className="ash-meta mt-3">
          <Link href="/ashtavakra/words/" className="ash-link underline">शब्द-अन्वेषण</Link>: सत्यापित श्लोकों के सभी प्रमुख शब्दार्थ एक जगह।
        </p>
      </Section>

      <Section id="lit" title="शाब्दिक हिन्दी अर्थ">
        <p lang="hi" className="ash-hindi">{v.literalHindiMeaning}</p>
      </Section>

      <Section id="book" title="पुस्तकानुसार हिन्दी भावार्थ">
        <p className="ash-meta mb-2">पुस्तक की भाषा-टीका का मौलिक पुनर्कथन, शब्दशः प्रति नहीं।</p>
        <Paras text={v.bookBasedHindiExplanation} className="ash-hindi" />
      </Section>

      <Section id="simple" title="सरल हिन्दी में समझें">
        <Paras text={v.simpleHindiExplanation} className="ash-hindi" />
      </Section>

      <Section id="deep" title="गहरी दार्शनिक व्याख्या">
        <Paras text={v.philosophicalExplanationHindi} className="ash-prose" />
        <p className="ash-prose mt-4"><strong>उदाहरण से समझें:</strong> {v.analogyHindi}</p>
      </Section>

      {concept && (
        <section aria-labelledby="visual" className="grid gap-2">
          <h2 id="visual" className="font-bold" style={{ fontSize: '1.2rem' }}>प्रतीकात्मक चित्र-व्याख्या</h2>
          <p className="ash-meta">संपादकीय सहायक चित्र; यह श्लोक का शाब्दिक अर्थ नहीं है।</p>
          <ConceptVisual id={concept} />
        </section>
      )}

      <Section id="modern" title="आज के जीवन से उदाहरण">
        <p className="ash-meta mb-2">यह एक आधुनिक संपादकीय उदाहरण है, श्लोक का अर्थ या अनुवाद नहीं।</p>
        <p lang="hi" className="ash-hindi">{v.modernExampleHindi}</p>
        <p lang="hi" className="ash-hindi mt-3"><strong>आज की पीढ़ी के लिए संदेश:</strong> {v.messageForTodayHindi}</p>
      </Section>

      <section aria-labelledby="mis" className="ash-card" style={{ borderColor: 'var(--ash-accent)' }}>
        <h2 id="mis" className="font-bold" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>सामान्य गलतफहमी</h2>
        <p lang="hi" className="ash-hindi">{v.commonMisunderstandingHindi}</p>
      </section>

      <Section id="apply" title="जीवन में प्रयोग, आत्मचिंतन और छोटा अभ्यास">
        <p lang="hi" className="ash-hindi"><strong>जीवन में प्रयोग:</strong> {v.practicalApplicationHindi}</p>
        <p lang="hi" className="ash-hindi mt-3"><strong>आत्मचिंतन प्रश्न:</strong> {v.reflectionQuestionHindi}</p>
        <p lang="hi" className="ash-hindi mt-3"><strong>छोटा अभ्यास:</strong> {v.shortPracticeHindi}</p>
        <p className="ash-meta mt-3">यह चिंतन-अभ्यास है, कोई चिकित्सा या उपचार नहीं। असुविधा हो तो रुकिए और किसी विश्वसनीय व्यक्ति से बात कीजिए।</p>
        <p lang="hi" className="mt-3 font-bold">एक पंक्ति में सार: {v.oneLineSummaryHindi}</p>
      </Section>

      <Section id="en" title="English">
        <p lang="en" className="ash-en"><strong>Translation:</strong> {v.englishTranslation}</p>
        <p lang="en" className="ash-en mt-2"><strong>Simple explanation:</strong> {v.simpleEnglishExplanation}</p>
      </Section>

      <Section id="tags" title="विषय और संबंधित श्लोक">
        <ul className="flex flex-wrap gap-2" aria-label="विषय">
          {v.themes.map((t) => <li key={t} className="ash-chip">{t}</li>)}
        </ul>
        {v.relatedVerses.length > 0 && (
          <ul className="mt-3 grid gap-2" aria-label="संबंधित श्लोक">
            <li lang="hi" className="ash-meta">ये उसी अष्टावक्र गीता के भीतर के संपादकीय संबंध हैं।</li>
            {v.relatedVerses.map((r) => (
              <li key={r.id}>
                <Link href={verseHref(r.id)} className="ash-link font-bold underline" style={{ color: 'var(--ash-accent)' }}>श्लोक {r.id}</Link>
                <span lang="hi">: {r.reason}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section id="src" title="स्रोत और सत्यापन">
        <p className="flex flex-wrap items-center gap-2"><VerificationBadge status={v.verificationStatus} /> <span className="ash-meta">{v.sourcePage}</span></p>
        <p lang="hi" className="ash-hindi mt-2"><strong>संपादकीय टिप्पणी:</strong> {v.editorialNotes}</p>
      </Section>
    </div>
  );
}
