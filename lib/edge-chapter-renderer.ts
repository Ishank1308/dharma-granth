/**
 * Edge Chapter HTML Renderer
 *
 * Generates identical, crawlable, accessible semantic HTML for scripture chapters
 * at the edge (Cloudflare Pages Functions / Workers) from compact JSON shards.
 *
 * Benefits:
 * - 0ms build-time overhead
 * - Eliminates monolithic React Server Component (.txt) flight stream payloads
 * - Eliminates Cloudflare Pages 20,000 file ceiling
 * - Bit-for-bit identical canonical Sanskrit, Hindi, English, and JSON-LD schema
 */

import { cleanVerseField, toDevanagari, verseLines } from './verse-format';

export interface EdgeVerseData {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  hindi?: string;
  translation?: string;
}

export interface EdgeChapterPayload {
  id: string;
  chapter: {
    number: number;
    title?: string;
    titleSanskrit?: string;
    summary?: string;
    verses: EdgeVerseData[];
  };
  source?: {
    repo?: string;
    license?: string;
    fetchedAt?: string;
  };
}

export interface ScriptureMetadataStub {
  id: string;
  title: string;
  titleSanskrit: string;
  titleIast?: string;
  description: string;
  category: string;
  tags?: string[];
  totalChapters: number;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderVerseArticle(v: EdgeVerseData, chapterId: number, scriptureId: string, siteUrl: string): string {
  const label = String(v.number);
  const sanskrit = cleanVerseField(v.sanskrit);
  const transliteration = cleanVerseField(v.transliteration).replace(/[\s|।॥0-9.]+$/, '');
  const hindi = cleanVerseField(v.hindi);
  const english = cleanVerseField(v.translation);
  const lines = sanskrit ? verseLines(sanskrit) : [];
  const title = `श्लोक ${label}`;
  const verseHref = `/scripture/${scriptureId}/chapter/${chapterId}/verse/${label}/`;

  const linesHtml = lines
    .map((line) => `<span>${escapeHtml(line)}</span>`)
    .join('\n');

  return `
    <article id="verse-${escapeHtml(label)}" class="verse-card vt" aria-label="${escapeHtml(title)}">
      <header class="vt-head">
        <h3 class="vt-title">
          <a href="${verseHref}"><span class="sr-only">श्लोक </span>${escapeHtml(toDevanagari(chapterId))}.${escapeHtml(toDevanagari(label))}</a>
        </h3>
      </header>

      ${
        lines.length > 0
          ? `<div class="vt-leaf verse-folio">
              <p lang="sa" class="vt-sa">
                ${linesHtml}
                <span class="vt-num" aria-hidden="true">॥ ${escapeHtml(toDevanagari(label))} ॥</span>
              </p>
            </div>`
          : ''
      }

      ${
        transliteration
          ? `<div class="vt-tr">
              <p>${escapeHtml(transliteration)}</p>
            </div>`
          : ''
      }

      ${
        hindi
          ? `<div class="vt-hi">
              <span class="vt-label">भावार्थ (हिन्दी)</span>
              <p lang="hi">${escapeHtml(hindi)}</p>
            </div>`
          : ''
      }

      ${
        english
          ? `<div class="vt-en">
              <span class="vt-label">Translation (English)</span>
              <p lang="en">${escapeHtml(english)}</p>
            </div>`
          : ''
      }
    </article>
  `;
}

export function renderEdgeChapterHtml(
  payload: EdgeChapterPayload,
  meta: ScriptureMetadataStub,
  options: {
    siteUrl?: string;
    basePath?: string;
  } = {}
): string {
  const siteUrl = options.siteUrl || 'https://dharmagranth.dev';
  const scriptureId = meta.id;
  const chapter = payload.chapter;
  const chapterId = chapter.number;
  const canonicalUrl = `${siteUrl}/scripture/${scriptureId}/chapter/${chapterId}/`;

  const pageTitle = `${meta.titleSanskrit} अध्याय ${chapterId} — ${meta.titleSanskrit} (${meta.title}) | हिंदी अर्थ · English Meaning — Dharma Granth`;
  const firstVerseHindi = chapter.verses[0]?.hindi || '';
  const opening = firstVerseHindi ? firstVerseHindi.slice(0, 100) : '';
  const pageDescription = `${meta.titleSanskrit} (${meta.title}) अध्याय ${chapterId} के ${chapter.verses.length} श्लोक — संस्कृत मूल, हिंदी अर्थ और English translation। ${opening}…`;

  // JSON-LD structured data
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Scriptures', item: `${siteUrl}/scriptures/` },
      { '@type': 'ListItem', position: 3, name: meta.title, item: `${siteUrl}/scripture/${scriptureId}/` },
      { '@type': 'ListItem', position: 4, name: `अध्याय ${chapterId}`, item: canonicalUrl },
    ],
  };

  const bookJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': `${siteUrl}/scripture/${scriptureId}`,
    name: meta.title,
    alternateName: meta.titleSanskrit,
    description: meta.description,
    isAccessibleForFree: true,
    workExample: {
      '@type': 'Chapter',
      name: chapter.title || `Chapter ${chapterId}`,
      alternateName: chapter.titleSanskrit,
      position: chapterId,
      url: canonicalUrl,
    },
  };

  const versesHtml = chapter.verses
    .map((v) => renderVerseArticle(v, chapterId, scriptureId, siteUrl))
    .join('\n');

  return `<!DOCTYPE html>
<html lang="hi" class="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(pageDescription)}">
  <link rel="canonical" href="${canonicalUrl}">

  <meta property="og:type" content="article">
  <meta property="og:locale" content="hi_IN">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(pageDescription)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${siteUrl}/og/${scriptureId}.png">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}">
  <meta name="twitter:description" content="${escapeHtml(pageDescription)}">
  <meta name="twitter:image" content="${siteUrl}/og/${scriptureId}.png">

  <script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd)}</script>
  <script type="application/ld+json">${JSON.stringify(bookJsonLd)}</script>

  <link rel="stylesheet" href="/_next/static/css/app.css" media="all">
</head>
<body class="min-h-screen bg-dharma-bg text-dharma-text antialiased">
  <div id="main-content">
    <header class="border-b border-dharma-border bg-dharma-card py-10 px-6 sm:py-14">
      <div class="mx-auto max-w-5xl">
        <nav class="mb-4 text-xs font-semibold text-dharma-muted">
          <a href="/scriptures/" class="hover:text-saffron-700">ग्रंथालय</a> &gt;
          <a href="/scripture/${scriptureId}/" class="hover:text-saffron-700">${escapeHtml(meta.title)}</a> &gt;
          <span>अध्याय ${escapeHtml(toDevanagari(chapterId))}</span>
        </nav>
        <p class="editorial-section-eyebrow text-xs uppercase tracking-wider text-saffron-600 font-bold mb-1">
          ${escapeHtml(meta.titleSanskrit)} · अध्याय ${escapeHtml(toDevanagari(chapterId))}
        </p>
        <h1 class="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-dharma-text">
          ${escapeHtml(chapter.titleSanskrit || chapter.title || `अध्याय ${chapterId}`)}
        </h1>
        <p class="mt-2 text-sm text-dharma-muted">
          ${chapter.verses.length} श्लोक · संस्कृत मूल, हिंदी भावार्थ एवं English translation
        </p>
      </div>
    </header>

    <main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div id="verse-list" class="space-y-6">
        ${versesHtml}
      </div>
    </main>

    <footer class="border-t border-dharma-border py-8 text-center text-xs text-dharma-muted">
      <p>Dharma Granth · 100% नि:शुल्क, विज्ञापन-रहित एवं खुला डिजिटल शास्त्र संग्रह</p>
    </footer>
  </div>
</body>
</html>`;
}
