import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Docs · Dharma Granth',
  description:
    'Machine-readable interfaces of Dharma Granth: clarity-feedback collector, health check, and static scripture search indexes, with OpenAPI and RFC 9727 catalog links.',
  alternates: { canonical: '/api-docs/' },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';

export default function ApiDocsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-6 lg:py-16">
      <header className="mb-10">
        <p className="text-sm font-semibold text-saffron-700 dark:text-saffron-300">Developers</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-dharma-text">API docs</h1>
        <p className="mt-3 text-sm leading-relaxed text-dharma-muted">
          Dharma Granth is a static reading site; these are the only endpoints meant for automated clients. Automated
          discovery starts at <code>/.well-known/api-catalog</code> (RFC 9727).
        </p>
      </header>

      <div className="space-y-8 leading-relaxed text-dharma-muted">
        <section>
          <h2 className="font-serif text-xl font-bold text-dharma-text">Discovery</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>
              API catalog:{' '}
              <a className="underline decoration-saffron-500 underline-offset-2" href="/.well-known/api-catalog">
                /.well-known/api-catalog
              </a>{' '}
              (Content-Type: application/linkset+json)
            </li>
            <li>
              OpenAPI 3.1:{' '}
              <a className="underline decoration-saffron-500 underline-offset-2" href="/openapi.json">
                /openapi.json
              </a>
            </li>
            <li>
              Health check:{' '}
              <a className="underline decoration-saffron-500 underline-offset-2" href="/api/health">
                /api/health
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-dharma-text">POST /api/feedback</h2>
          <p className="mt-2 text-sm">
            Submit an anonymous clarity vote for one explanation. Body: <code>refKey</code> (for example
            bhagavadgita:2:47), <code>rating</code> (yes, partly, no) and fixed <code>reasons</code> ids. Nothing else
            is accepted or stored. Returns 204 on success, or 503 until the deployment configures its feedback store
            (see docs/feedback-collection.md). Reading aggregated counters (GET /api/feedback) needs the editorial
            token and is documented in /openapi.json.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-dharma-text">GET /api/health</h2>
          <p className="mt-2 text-sm">
            Liveness probe returning <code>{'{"status":"ok","service":"dharma-granth","time":"…"}'}</code>. It backs
            the <code>status</code> links in the API catalog.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-dharma-text">GET /chapter-index.json and /search-index/verses.json</h2>
          <p className="mt-2 text-sm">
            Static build-time indexes behind global search: chapter titles (<code>{"{"}v, counts, chapters{"}"}</code>)
            and every verse that has its own page (<code>{"{"}v, scriptures, rows{"}"}</code>). They are rebuilt with
            each deploy; cache them for an hour in the browser.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-dharma-text">Base URL</h2>
          <p className="mt-2 text-sm">
            Production base URL is <code>{SITE_URL}</code>. Catalog anchors and OpenAPI server URLs are absolute so
            scanners can resolve them without knowing the request host.
          </p>
        </section>
      </div>
    </main>
  );
}
