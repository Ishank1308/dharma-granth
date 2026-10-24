import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getChapterData, getChapterMeta, publishedChapterNumbers, verseHref } from '@/lib/ashtavakra';
import { ChapterEnvironment, ChapterFigureCaption } from '../visuals';
import { VerseCompact, Paras } from '../VerseView';
import { VerificationBadge } from '../VerseView';


export function generateStaticParams() {
  return publishedChapterNumbers().map((n) => ({ chapter: String(n) }));
}

export function generateMetadata({ params }: { params: { chapter: string } }): Metadata {
  const n = Number(params.chapter);
  const d = getChapterData(n);
  const m = getChapterMeta(n);
  if (!d || !m) return {};
  return {
    title: d.end.seo.title,
    description: d.end.seo.metaDescription,
    alternates: { canonical: `/ashtavakra/${n}/` },
  };
}

export default function ChapterPage({ params }: { params: { chapter: string } }) {
  const n = Number(params.chapter);
  const d = getChapterData(n);
  const m = getChapterMeta(n);
  if (!d || !m) notFound();

  const reviewCount = d.verses.filter((v) => v.verificationStatus !== 'verified').length;
  const prevMeta = getChapterMeta(n - 1);
  const nextMeta = getChapterMeta(n + 1);
  const nextPublished = nextMeta && getChapterData(n + 1);

  return (
    <main id="main">
      <header className="relative overflow-hidden">
        <ChapterEnvironment meta={m} />
        <div className="mx-auto max-w-4xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
          <nav aria-label="ब्रेडक्रम्ब" className="ash-meta">
            <Link href="/ashtavakra/" className="ash-link underline">अष्टावक्र गीता</Link> / <span>{m.bookTitle}</span>
          </nav>
          <p className="ash-eyebrow mt-4">अध्याय {n} · {m.bookTitle}</p>
          <h1 lang="hi" className="ash-hero-title font-bold" style={{ fontSize: 'clamp(2rem, 1.4rem + 3vw, 3.4rem)', lineHeight: 1.35 }}>
            {m.title}
          </h1>
          <p className="ash-meta">संपादकीय विषय-शीर्षक · पुस्तक में नाम: {m.bookTitle}</p>
          <p lang="hi" className="ash-reveal ash-hindi mt-3 max-w-2xl">{d.hero.oneLineSummary}</p>
          <dl className="ash-reveal mt-5 grid gap-x-8 gap-y-2 text-base sm:grid-cols-2">
            <div><dt className="ash-meta">श्लोकों की कुल संख्या</dt><dd className="font-bold">{d.hero.totalVerses}</dd></div>
            <div><dt className="ash-meta">अनुमानित पठन समय</dt><dd className="font-bold" lang="hi">{d.hero.estimatedReadingTime.split(';')[0]}</dd></div>
            <div><dt className="ash-meta">मुख्य संस्कृत शब्द</dt><dd lang="hi" className="font-bold">{d.hero.keySanskritTerms.join(' · ')}</dd></div>
            <div><dt className="ash-meta">प्रमुख विषय</dt><dd lang="hi" className="font-bold">{d.hero.mainTopics.join(' · ')}</dd></div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#verses" className="ash-btn ash-btn-primary">पढ़ना प्रारम्भ करें</a>
            <Link href={verseHref(d.verses[0].verseNumber)} className="ash-btn">श्लोक {d.verses[0].verseNumber} से</Link>
          </div>
          <div className="mt-5"><ChapterFigureCaption meta={m} /></div>
        </div>
      </header>

      <div className="mx-auto grid max-w-4xl gap-10 px-4 pb-24 sm:px-6">
        <section aria-labelledby="intro" className="ash-card">
          <h2 id="intro" className="font-bold" style={{ fontSize: '1.4rem' }}>अध्याय का परिचय</h2>
          <Paras text={d.introduction} className="ash-hindi mt-2" />
        </section>

        <section aria-labelledby="cq" className="ash-card">
          <h2 id="cq" className="font-bold" style={{ fontSize: '1.25rem' }}>केंद्रीय प्रश्न</h2>
          <p lang="hi" className="ash-hindi mt-2 font-bold">{d.centralQuestion}</p>
          <h2 className="font-bold mt-5" style={{ fontSize: '1.25rem' }}>अध्याय की मुख्य शिक्षा</h2>
          <p lang="hi" className="ash-hindi mt-2">{d.mainTeaching}</p>
        </section>

        <section aria-labelledby="pre" className="ash-card" style={{ borderColor: 'var(--ash-accent)' }}>
          <h2 id="pre" className="font-bold" style={{ fontSize: '1.25rem' }}>पढ़ने से पहले समझें</h2>
          <ul lang="hi" className="ash-hindi mt-2 grid gap-2" style={{ listStyle: 'disc', paddingLeft: '1.25rem' }}>
            {d.beforeYouRead.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </section>

        <section aria-labelledby="concepts" className="grid gap-3">
          <h2 id="concepts" className="font-bold" style={{ fontSize: '1.25rem' }}>प्रमुख अवधारणाएँ</h2>
          <dl className="grid gap-3 md:grid-cols-2">
            {d.concepts.map((c) => (
              <div key={c.term} className="ash-card"><dt lang="sa" className="font-bold">{c.term}</dt><dd lang="hi" className="ash-hindi">{c.definition}</dd></div>
            ))}
          </dl>
        </section>

        <section id="verses" aria-labelledby="verses-h" className="grid gap-6 sm:gap-8 scroll-mt-6">
          <div>
            <h2 id="verses-h" className="font-bold text-xl sm:text-2xl text-dharma-text">श्लोक-दर-श्लोक स्वाध्याय · Sacred Reading</h2>
            <p className="ash-meta mt-1">
              {d.verses.length} श्लोक, पुस्तक के क्रम में।{' '}
              {reviewCount > 0 ? `${reviewCount} श्लोकों पर पुस्तक के छपे पाठ में भेद मिला है और उन पर “समीक्षा आवश्यक” दर्शाया गया है।` : 'सभी श्लोक मूल पृष्ठ से मिलान किए गए हैं।'}
            </p>
            <p className="mt-2 flex flex-wrap gap-2"><VerificationBadge status="verified" /><VerificationBadge status="review-required" /></p>
          </div>
          {d.verses.map((v) => <VerseCompact key={v.verseNumber} v={v} />)}
        </section>

        <section aria-labelledby="end" className="ash-card">
          <h2 id="end" className="font-bold" style={{ fontSize: '1.4rem' }}>अध्याय का सरल सार</h2>
          <p lang="hi" className="ash-hindi mt-2">{d.end.simpleSummary}</p>
          <h3 className="font-bold mt-5">पाँच प्रमुख शिक्षाएँ</h3>
          <ol lang="hi" className="ash-hindi mt-2 grid gap-2" style={{ listStyle: 'decimal', paddingLeft: '1.25rem' }}>
            {d.end.fiveTeachings.map((t) => (
              <li key={t.teaching}>
                {t.teaching}{' '}
                <span className="ash-meta">
                  (
                  {t.verses.map((id, i) => (
                    <span key={id}>{i > 0 && ', '}<Link href={verseHref(id)} className="ash-link underline">{id}</Link></span>
                  ))}
                  )
                </span>
              </li>
            ))}
          </ol>
          <h3 className="font-bold mt-5">सामान्य गलतफहमियाँ</h3>
          <ul lang="hi" className="ash-hindi mt-2 grid gap-2" style={{ listStyle: 'disc', paddingLeft: '1.25rem' }}>
            {d.end.misunderstandings.map((x) => <li key={x}>{x}</li>)}
          </ul>
          <h3 className="font-bold mt-5">आत्मचिंतन प्रश्न</h3>
          <ol lang="hi" className="ash-hindi mt-2 grid gap-2" style={{ listStyle: 'decimal', paddingLeft: '1.25rem' }}>
            {d.end.reflectionQuestions.map((x) => <li key={x}>{x}</li>)}
          </ol>
          <h3 className="font-bold mt-5">संक्षिप्त चिंतन अभ्यास</h3>
          <p lang="hi" className="ash-hindi mt-2">{d.end.fiveMinutePractice}</p>
        </section>

        <section aria-labelledby="faq" className="grid gap-3">
          <h2 id="faq" className="font-bold" style={{ fontSize: '1.25rem' }}>अक्सर पूछे जाने वाले प्रश्न</h2>
          {d.end.faqs.map((f) => (
            <details key={f.q} className="ash-card">
              <summary className="cursor-pointer font-bold" style={{ minHeight: 44 }} lang="hi">{f.q}</summary>
              <p lang="hi" className="ash-hindi mt-2">{f.a}</p>
            </details>
          ))}
        </section>

        <nav aria-label="प्रकरण नेविगेशन" className="flex flex-wrap items-center justify-between gap-3">
          {prevMeta && getChapterData(n - 1) ? <Link href={`/ashtavakra/${n - 1}/`} className="ash-btn">← {prevMeta.bookTitle}</Link> : <span />}
          <Link href="/ashtavakra/#chapters" className="ash-btn">सभी प्रकरण</Link>
          {nextMeta && nextPublished ? (
            <Link href={`/ashtavakra/${n + 1}/`} className="ash-btn">{nextMeta.bookTitle} →</Link>
          ) : nextMeta ? (
            <span className="ash-meta">अगला: {nextMeta.bookTitle} (अभी तैयार नहीं)</span>
          ) : (
            <span className="ash-meta">यह अंतिम प्रकरण है।</span>
          )}
        </nav>
      </div>
    </main>
  );
}
