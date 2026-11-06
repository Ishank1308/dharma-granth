import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { clipDescription } from '@/lib/meta-text';
import { getChapterData, getChapterMeta, getVerse, publishedChapterNumbers, verseHref, verseNeighbours } from '@/lib/ashtavakra';
import { VerseFull, VerificationBadge } from '../../VerseView';
import { ReadMark } from '../../VerseBits';
import { AshtavakraVerseReader } from '../../AshtavakraVerseReader';

export function generateStaticParams() {
  return publishedChapterNumbers().flatMap((c) =>
    getChapterData(c)!.verses.map((v) => ({ chapter: String(c), verse: v.verseNumber.split('.')[1] })),
  );
}

export async function generateMetadata(props: { params: Promise<{ chapter: string; verse: string }> }): Promise<Metadata> {
  const params = await props.params;
  const v = getVerse(Number(params.chapter), Number(params.verse));
  if (!v) return {};
  const firstWord = (v.sanskrit || '').split(/[|।\n]/)[0].trim().slice(0, 20);
  const title = `अष्टावक्र गीता ${v.verseNumber}${firstWord ? ` (${firstWord})` : ''} — श्लोक व अर्थ`;
  const canonical = `/ashtavakra/${params.chapter}/${params.verse}/`;
  const description = clipDescription(`${v.sanskrit} — ${v.literalHindiMeaning || v.oneLineSummaryHindi}`);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';
  return {
    title,
    description,
    keywords: [
      `अष्टावक्र गीता ${v.verseNumber}`,
      `Ashtavakra Gita ${v.verseNumber}`,
      `अष्टावक्र गीता श्लोक ${v.verseNumber}`,
      'अष्टावक्र गीता',
      'श्लोक अर्थ',
      'hindi meaning',
      'advaita vedanta',
      firstWord,
    ].filter(Boolean),
    alternates: { canonical },
    openGraph: {
      type: 'article',
      locale: 'hi_IN',
      alternateLocale: ['en_US'],
      title,
      description,
      url: canonical,
      images: [{ url: `${siteUrl}/og/library.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/og/library.png`],
    },
  };
}

export default async function VersePage(props: { params: Promise<{ chapter: string; verse: string }> }) {
  const params = await props.params;
  const c = Number(params.chapter);
  const n = Number(params.verse);
  const v = getVerse(c, n);
  const m = getChapterMeta(c);
  const chapterData = getChapterData(c);
  if (!v || !m || !chapterData) notFound();
  const { prev, next, prevCrossesChapter, nextCrossesChapter } = verseNeighbours(c, n);

  const allVerses = chapterData.verses.map((item) => ({
    number: item.verseNumber.split('.')[1],
    href: verseHref(item.verseNumber),
  }));

  const currentIndex = chapterData.verses.findIndex((item) => item.verseNumber === v.verseNumber);
  const prevItem = prev
    ? { verseNumber: prev.verseNumber, href: verseHref(prev.verseNumber), crossesChapter: prevCrossesChapter }
    : undefined;
  const nextItem = next
    ? { verseNumber: next.verseNumber, href: verseHref(next.verseNumber), crossesChapter: nextCrossesChapter }
    : undefined;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';
  const pageUrl = `${siteUrl}/ashtavakra/${c}/${n}/`;
  const hindiMeaning = v.literalHindiMeaning || v.oneLineSummaryHindi || '';
  const firstPhrase = (v.sanskrit || '').split(/[|।\n]/)[0].trim().slice(0, 24);

  const questions = [
    hindiMeaning && {
      '@type': 'Question',
      name: `अष्टावक्र गीता ${v.verseNumber} का हिन्दी अर्थ क्या है?`,
      acceptedAnswer: { '@type': 'Answer', text: hindiMeaning },
    },
    firstPhrase && hindiMeaning && {
      '@type': 'Question',
      name: `${firstPhrase} श्लोक का अर्थ क्या है?`,
      acceptedAnswer: { '@type': 'Answer', text: hindiMeaning },
    },
    hindiMeaning && {
      '@type': 'Question',
      name: `Ashtavakra Gita ${v.verseNumber} Meaning in Hindi`,
      acceptedAnswer: { '@type': 'Answer', text: `अष्टावक्र गीता ${v.verseNumber} का हिन्दी भावार्थ: ${hindiMeaning}` },
    },
    v.englishTranslation && {
      '@type': 'Question',
      name: `What is the meaning of Ashtavakra Gita ${v.verseNumber}?`,
      acceptedAnswer: { '@type': 'Answer', text: v.englishTranslation },
    },
  ].filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: `अष्टावक्र गीता ${v.verseNumber} — श्लोक व अर्थ (Hindi & English Meaning)`,
        description: clipDescription(`${v.sanskrit} — ${hindiMeaning}`),
        abstract: hindiMeaning || v.englishTranslation,
        text: [v.sanskrit, v.iast, hindiMeaning, v.englishTranslation].filter(Boolean).join('\n\n'),
        inLanguage: ['sa', 'hi', 'en'],
        isAccessibleForFree: true,
        genre: 'Advaita Vedanta',
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        publisher: {
          '@type': 'Organization',
          name: 'Dharma Granth',
          url: siteUrl,
          logo: { '@type': 'ImageObject', url: `${siteUrl}/icon-512.png` },
        },
        isPartOf: {
          '@type': 'Book',
          name: 'अष्टावक्र गीता (Ashtavakra Gita)',
          url: `${siteUrl}/ashtavakra/`,
        },
      },
      ...(questions.length > 0 ? [{ '@type': 'FAQPage', '@id': `${pageUrl}#faq`, mainEntity: questions }] : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Library', item: `${siteUrl}/scriptures/` },
          { '@type': 'ListItem', position: 3, name: 'अष्टावक्र गीता', item: `${siteUrl}/ashtavakra/` },
          { '@type': 'ListItem', position: 4, name: `अध्याय ${c}`, item: `${siteUrl}/ashtavakra/${c}/` },
          { '@type': 'ListItem', position: 5, name: `श्लोक ${v.verseNumber}`, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <AshtavakraVerseReader
      verse={v}
      chapterNumber={c}
      chapterTitle={m.title}
      bookTitle={m.bookTitle}
      totalVerses={chapterData.verses.length}
      currentIndex={currentIndex >= 0 ? currentIndex : 0}
      allVerses={allVerses}
      prev={prevItem}
      next={nextItem}
    >
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main" className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <nav aria-label="ब्रेडक्रम्ब" className="text-xs text-dharma-muted">
          <Link href="/ashtavakra/" className="font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-300">अष्टावक्र गीता</Link> /{' '}
          <Link href={`/ashtavakra/${c}/`} className="font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-300">{m.bookTitle}</Link> / <span>श्लोक {v.verseNumber}</span>
        </nav>
        <p lang="hi" className="mt-4 font-devanagari text-xs font-bold uppercase tracking-[0.14em] text-saffron-700 dark:text-saffron-400">अध्याय {c} · {m.title}</p>
        <h1 lang="hi" className="font-bold" style={{ fontSize: 'clamp(1.6rem, 1.2rem + 1.5vw, 2.2rem)', lineHeight: 1.4 }}>
          अष्टावक्र गीता, श्लोक {v.verseNumber}
        </h1>
        <p className="mt-2 flex flex-wrap items-center gap-2"><VerificationBadge status={v.verificationStatus} /></p>

        <div className="mt-6">
          <VerseFull v={v} />
        </div>

        <div className="mt-8 grid gap-4">
          <ReadMark id={v.verseNumber} />
          <nav aria-label="श्लोक नेविगेशन" className="hidden sm:flex flex-wrap items-center justify-between gap-3">
            {prev ? (
              <Link href={verseHref(prev.verseNumber)} rel="prev" className="inline-flex min-h-[44px] items-center rounded-xl border border-dharma-border bg-dharma-card px-4 py-2 text-sm font-semibold text-dharma-text transition hover:border-saffron-400">
                ← {prevCrossesChapter ? `पिछला प्रकरण, श्लोक ${prev.verseNumber}` : `श्लोक ${prev.verseNumber}`}
              </Link>
            ) : <span />}
            <Link href={`/ashtavakra/${c}/`} className="inline-flex min-h-[44px] items-center rounded-xl border border-dharma-border bg-dharma-card px-4 py-2 text-sm font-semibold text-dharma-text transition hover:border-saffron-400">अध्याय सूची</Link>
            {next ? (
              <Link href={verseHref(next.verseNumber)} rel="next" className="inline-flex min-h-[44px] items-center rounded-xl border border-dharma-border bg-dharma-card px-4 py-2 text-sm font-semibold text-dharma-text transition hover:border-saffron-400">
                {nextCrossesChapter ? `अगला प्रकरण, श्लोक ${next.verseNumber}` : `श्लोक ${next.verseNumber}`} →
              </Link>
            ) : <span className="text-xs text-dharma-muted">यह अंतिम प्रकरण है।</span>}
          </nav>
        </div>
      </main>
    </AshtavakraVerseReader>
  );
}
