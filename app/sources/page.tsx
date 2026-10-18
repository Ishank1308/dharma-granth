'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  FileCheck2,
  Filter,
  History,
  Layers,
  Scale,
  ScrollText,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { SCRIPTURE_SOURCES, type ScriptureSourceMeta } from '@/data/sources-registry';

export default function SourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const sourcesList = useMemo(() => {
    return Object.entries(SCRIPTURE_SOURCES).map(([id, meta]) => ({
      id,
      ...(meta as Record<string, unknown>),
    })) as Array<{ id: string } & Partial<ScriptureSourceMeta>>;
  }, []);

  const filteredSources = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sourcesList;
    return sourcesList.filter((s) => {
      const haystack = `${s.sourceScriptureTitle ?? ''} ${s.sourceScriptureTitleSanskrit ?? ''} ${s.sanskritEdition ?? ''} ${s.primaryTranslator ?? ''} ${s.traditionalCommentaryAuthor ?? ''}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [sourcesList, searchQuery]);

  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text pb-20">
      {/* Header Banner */}
      <section className="border-b border-dharma-border bg-gradient-to-b from-amber-50/70 via-dharma-card to-dharma-bg dark:from-amber-950/20 py-14 px-5 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-saffron-500/15 text-saffron-800 dark:text-saffron-300">
              <ScrollText className="h-4.5 w-4.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-saffron-700 dark:text-saffron-400">
              Reference Editions & Digital Archive Provenance · स्रोत एवं पाठ-शुद्धि
            </span>
          </div>

          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-dharma-text">
            Reference Editions & Digital Archive Provenance
          </h1>
          <p className="mt-1 font-devanagari text-xl text-dharma-muted">
            प्रमाणिक संदर्भ, डिजिटल संग्रह, टीकाकार एवं पाठभेद विवरण
          </p>

          <p className="mt-4 max-w-3xl text-sm sm:text-base leading-relaxed text-dharma-muted">
            Dharma Granth adheres to strict textual transparency. Canonical Sanskrit verses are imported from open digital archives (principally <code className="text-xs font-mono bg-dharma-bg px-1.5 py-0.5 rounded border border-dharma-border">sanskritdocuments.org</code> and the <code className="text-xs font-mono bg-dharma-bg px-1.5 py-0.5 rounded border border-dharma-border">DharmicData</code> collection on GitHub) based on traditional reference editions (Gita Press, Chaukhamba, BORI, Anandashram). Classical commentary sections present traditional sampradayic paraphrases, while AI-assisted draft study aids and translations are transparently flagged and undergoing human scholar verification. For complete disclosures on our ingestion pipeline and review status, see our full{' '}
            <Link href="/methodology/" className="font-semibold text-saffron-700 dark:text-saffron-400 underline underline-offset-4 hover:text-saffron-800">
              Methodology
            </Link>
            .
          </p>

          {/* Epistemic Tiers Grid */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3 text-xs">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-4">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wide text-amber-900 dark:text-amber-200">
                <ScrollText className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                <span>Tier 1 · Canonical Sanskrit</span>
              </div>
              <p className="mt-2 text-dharma-text/90 leading-relaxed">
                Unaltered canonical verses with IAST transliteration imported from verified digital archives referencing critical and traditional editions.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-400/50 bg-stone-100/60 dark:border-stone-700 dark:bg-stone-900/30 p-4">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wide text-stone-900 dark:text-stone-200">
                <Layers className="h-4 w-4 text-stone-600 dark:text-stone-400" />
                <span>Tier 2 · Classical Paraphrases</span>
              </div>
              <p className="mt-2 text-dharma-text/90 leading-relaxed">
                Traditional commentary summaries (Advaita, Vishishtadvaita, Dvaita) presented side-by-side as concise, non-sectarian study aids.
              </p>
            </div>

            <div className="rounded-2xl border border-sky-400/40 bg-sky-50/50 dark:border-sky-700 dark:bg-sky-950/20 p-4">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wide text-sky-900 dark:text-sky-200">
                <Scale className="h-4 w-4 text-sky-700 dark:text-sky-400" />
                <span>Tier 3 · AI-Assisted Study Aids</span>
              </div>
              <p className="mt-2 text-dharma-text/90 leading-relaxed">
                Modern pedagogical study guides and translations lacking open editions carry an explicit AI flag awaiting scholar peer review. Clearly demarcated from scripture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Directory of Editions */}
      <section className="mx-auto max-w-5xl px-5 sm:px-8 mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-dharma-border pb-4 mb-6">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-dharma-text">
            Textual Editions Registry ({filteredSources.length})
          </h2>

          <div className="relative min-w-[260px] max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dharma-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by scripture, scholar, or edition..."
              className="w-full rounded-xl border border-dharma-border bg-dharma-card pl-9 pr-8 py-2 text-xs text-dharma-text outline-none focus:border-saffron-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-dharma-muted hover:text-dharma-text"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {filteredSources.map((s) => (
            <article
              key={s.id}
              className="rounded-2xl border border-dharma-border bg-dharma-card p-6 shadow-xs hover:border-saffron-400 transition"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-dharma-border/60 pb-3">
                <div>
                  <h3 className="font-serif text-xl font-bold text-dharma-text">
                    {s.sourceScriptureTitle}{' '}
                    <span lang="hi" className="font-devanagari font-normal text-lg text-dharma-muted">
                      · {s.sourceScriptureTitleSanskrit}
                    </span>
                  </h3>
                </div>

                <Link
                  href={`/scripture/${s.id}/chapter/1`}
                  className="focus-ring inline-flex min-h-[36px] items-center gap-1 rounded-xl bg-saffron-600 px-3.5 py-1 text-xs font-semibold text-white hover:bg-saffron-700 transition"
                >
                  <span>Read Scripture</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <dl className="mt-4 grid gap-4 text-xs sm:grid-cols-2">
                <div>
                  <dt className="font-bold uppercase tracking-wider text-dharma-muted">Sanskrit Critical Edition</dt>
                  <dd className="mt-1 font-medium text-dharma-text text-sm">{s.sanskritEdition}</dd>
                  {s.sanskritEditionDetails && (
                    <dd className="mt-0.5 text-dharma-muted">{s.sanskritEditionDetails}</dd>
                  )}
                </div>

                <div>
                  <dt className="font-bold uppercase tracking-wider text-dharma-muted">Digital Archive & Publisher</dt>
                  <dd className="mt-1 text-dharma-text text-sm">
                    {s.publisherArchive}
                    {s.archiveUrl && (
                      <a
                        href={s.archiveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex items-center gap-0.5 text-xs text-saffron-700 hover:text-saffron-800 dark:text-saffron-400 underline"
                      >
                        <span>Archive Link</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="font-bold uppercase tracking-wider text-dharma-muted">Primary Translators</dt>
                  <dd className="mt-1 text-dharma-text">{s.primaryTranslator}</dd>
                </div>

                <div>
                  <dt className="font-bold uppercase tracking-wider text-dharma-muted">Traditional Commentators</dt>
                  <dd className="mt-1 text-dharma-text">{s.traditionalCommentaryAuthor}</dd>
                </div>

                {s.numberingSystemNote && (
                  <div className="sm:col-span-2 rounded-xl bg-dharma-bg/80 p-3 border border-dharma-border/60">
                    <dt className="font-bold uppercase tracking-wider text-dharma-muted text-[11px]">Numbering System & Recension Notes</dt>
                    <dd className="mt-1 text-dharma-text leading-relaxed">{s.numberingSystemNote}</dd>
                  </div>
                )}

                {s.alternativeReadingNote && (
                  <div className="sm:col-span-2 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 p-3 border border-amber-400/30">
                    <dt className="font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 text-[11px]">Variant Readings (पाठभेद)</dt>
                    <dd className="mt-1 text-dharma-text leading-relaxed">{s.alternativeReadingNote}</dd>
                  </div>
                )}
              </dl>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
