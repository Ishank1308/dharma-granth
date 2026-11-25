import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, FileCheck2, GitCommit, Layers, Scale, ScrollText, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { getRealVerseCount } from '@/data/scriptures';
import { formatCount } from '@/lib/holdings-label';
import { OnThisPage } from '@/app/components/OnThisPage';
import { PageHeader } from '@/app/components/apple/PageHeader';
import { PageCover } from '@/app/components/PagePhoto';

export const metadata: Metadata = {
  title: 'Methodology: how this site is made',
  description:
    'Where the Sanskrit texts come from, how translations and explanations are produced, where AI assistance is used, and how corrections are handled.',
  alternates: { canonical: '/methodology/' },
  openGraph: {
    title: 'Methodology: how this site is made',
    description:
      'Where the Sanskrit texts come from, how translations and explanations are produced, where AI assistance is used, and how corrections are handled.',
    url: '/methodology/',
    images: [DEFAULT_OG_IMAGE],
  },
};

/**
 * Plain statements of fact. Keep this page true: when review or sourcing
 * practice changes, update it in the same change. The AI counts are a
 * snapshot taken from the scripture data on the date shown.
 */
const SNAPSHOT = {
  date: '8 October 2026',
  verses: formatCount(getRealVerseCount()),
  ai: '72,471',
};

const SECTIONS = [
  {
    id: 'sources',
    num: '01',
    title: '1. Source texts',
    titleHi: 'मूल संस्कृत पाठ',
    Icon: ScrollText,
    paragraphs: [
      'The Sanskrit text is imported from open digital archives, mainly sanskritdocuments.org and the DharmicData collection on GitHub. Each chapter file records the archive address, its licence and the date it was fetched, and the verse page shows the archive it came from.',
      'These are digitised texts, not critical editions prepared by this site. They have not been compared line by line with a printed edition, so spelling, sandhi and verse numbering can differ from the edition you use. Numbering follows the imported source.',
    ],
  },
  {
    id: 'translations',
    num: '02',
    title: '2. Translations',
    titleHi: 'अनुवाद एवं भावार्थ',
    Icon: BookOpen,
    paragraphs: [
      'Where the source archive supplies a Hindi or English translation, it is used as supplied. Where it does not, a translation was drafted with AI assistance. Every such verse carries an “AI” flag in its data, and the reader marks it on the page.',
      `As of ${SNAPSHOT.date}, ${SNAPSHOT.ai} of ${SNAPSHOT.verses} verses in the library carry that flag. Those translations have not been checked by a Sanskrit scholar. Treat them as reading aids, and check the Sanskrit and a printed translation for anything that matters.`,
    ],
  },
  {
    id: 'commentary',
    num: '03',
    title: '3. Commentary and attribution',
    titleHi: 'भाष्य और श्रेय',
    Icon: Layers,
    paragraphs: [
      'Classical commentators (for example Shankara, Ramanuja and Sridhara) are named only when a summary is attributed to them. Those summaries are short paraphrases written for this site. They are not quotations or translations of the original commentaries, and they have not yet been checked against the original works. Commentary that was produced with AI assistance is labelled as such.',
    ],
  },
  {
    id: 'modern',
    num: '04',
    title: '4. Modern explanations',
    titleHi: 'आधुनिक संपादकीय टिप्पणियाँ',
    Icon: Scale,
    paragraphs: [
      'Simple meanings, “why it matters today”, modern examples, misunderstanding notes, teaching flows and reflection questions are editorial. They were written for this site to help new readers, and they are labelled “not scripture” wherever they appear. They are drafts awaiting scholarly review. They make no promises about outcomes and are not medical or psychological advice.',
    ],
  },
  {
    id: 'ai',
    num: '05',
    title: '5. AI assistance',
    titleHi: 'कृत्रिम बुद्धिमत्ता (AI) का उपयोग',
    Icon: Sparkles,
    paragraphs: [
      'AI (Anthropic’s Claude, among other tools) has been used to draft Hindi and English translations, commentary summaries and the editorial explanations above, and to help build this site. AI can make errors, including confident-sounding ones. That is why such content is flagged, kept visually separate from the Sanskrit, and open to correction.',
    ],
  },
  {
    id: 'review',
    num: '06',
    title: '6. Human review',
    titleHi: 'मानवीय विद्वत् समीक्षा',
    Icon: UserCheck,
    paragraphs: [
      'No systematic human review of the texts, translations or commentary is recorded yet. For that reason the site does not show “verified” or “reviewed” badges. When a named reviewer checks a text, the review will be recorded with the reviewer’s name and the date, and only then will a badge appear.',
    ],
  },
  {
    id: 'corrections',
    num: '07',
    title: '7. Corrections',
    titleHi: 'त्रुटि सुधार',
    Icon: ShieldAlert,
    paragraphs: [
      'Fixes are tracked and committed directly in the open project repository. Every verse page also links to the repository and contact channels so readers can flag discrepancies against printed editions.',
    ],
  },
  {
    id: 'rights',
    num: '08',
    title: '8. Rights information',
    titleHi: 'प्रतिलिप्यधिकार और स्रोत',
    Icon: FileCheck2,
    paragraphs: [
      'The classical Sanskrit texts are ancient and not under copyright, but a particular edition, translation or commentary can be. The source library names the edition behind each text. Where the licence of an edition or translation has not been confirmed, that is not stated as settled here; if you hold rights in material shown on this site, use the correction link on any verse page to tell the editors and it will be reviewed. Explanations marked as editorial or AI-assisted are this project’s own drafts.',
    ],
  },
  {
    id: 'versions',
    num: '09',
    title: '9. Version history',
    titleHi: 'संस्करण इतिहास',
    Icon: GitCommit,
    paragraphs: [
      'Every change to texts, translations and explanations is recorded, with its date, in the public project repository history, which is the authoritative record. Pages that carry an editorial explanation show its last-updated date where one is recorded.',
    ],
  },
] as const;

export default function MethodologyPage() {
  return (
    <main id="main" className="apple-scope long-read min-h-screen bg-dharma-bg pb-24 text-dharma-text">
      <div data-vt-hero>
        <PageHeader
          eyebrow="Methodology"
          eyebrowHi="कार्यपद्धति एवं प्रामाणिकता"
          title="How this site is made"
          titleHi="स्रोत, अनुवाद और समीक्षा की स्पष्ट नीति"
          cover={<PageCover photo="vyasa" />}
          lead={
            <p>
              This page states plainly where each kind of content comes from, what is machine-assisted, and what has not yet been reviewed by a scholar. For a quick reader guide, see{' '}
              <Link href="/how-dharma-granth-works/" data-vt="open" className="font-semibold text-dharma-saffron underline underline-offset-4">
                how Dharma Granth works
              </Link>
              .
            </p>
          }
        />
      </div>

      <div className="mx-auto max-w-content px-gutter">
        {/* Snapshot Metrics Strip */}
        <dl className="fluid-grid-xs reveal-grid mb-8">
          <div className="apple-card p-4 sm:p-5">
            <dt className="text-footnote text-dharma-muted">Published corpus</dt>
            <dd className="apple-stat mt-2 text-title-2 font-semibold text-dharma-text">{SNAPSHOT.verses} verses</dd>
          </div>
          <div className="apple-card p-4 sm:p-5">
            <dt className="text-footnote text-dharma-muted">AI-flagged study aids ({SNAPSHOT.date})</dt>
            <dd className="apple-stat mt-2 text-title-2 font-semibold text-dharma-saffron">{SNAPSHOT.ai}</dd>
          </div>
          <div className="apple-card p-4 sm:p-5">
            <dt className="text-footnote text-dharma-muted">Layer separation</dt>
            <dd className="mt-2 text-title-3 font-semibold text-dharma-text">मूल · भावार्थ · व्याख्या</dd>
          </div>
        </dl>

        <OnThisPage
          className="mb-8"
          items={SECTIONS.map((s) => ({
            id: s.id,
            en: s.title.replace(/^\d+\.\s*/, ''),
            hi: s.titleHi,
          }))}
        />

        <div className="reveal-grid fluid-grid-lg">
          {SECTIONS.map((section) => {
            const Icon = section.Icon;
            return (
              <section key={section.id} className="apple-card fluid-cq flex flex-col justify-between p-5 sm:p-6">
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-field bg-dharma-saffron/12 text-dharma-saffron">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="apple-stat rounded-pill border border-separator bg-fill-quaternary px-2.5 py-0.5 font-mono text-caption font-semibold text-label-secondary">
                      {section.num}
                    </span>
                  </div>
                  <h2 id={section.id} className="scroll-mt-24 text-title-3 font-semibold text-dharma-text">
                    <span>{section.title}</span>{' '}
                    <span lang="hi" className="mt-0.5 block font-devanagari text-sm font-normal text-dharma-muted">
                      {section.titleHi}
                    </span>
                  </h2>
                  <div className="mt-3 space-y-2.5 text-body leading-relaxed text-dharma-text-secondary">
                    {section.paragraphs.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
                {section.id === 'rights' && (
                  <div className="mt-4 border-t border-separator pt-3">
                    <Link href="/sources/" data-vt="open" className="chevron-nudge inline-flex min-h-[44px] items-center gap-1.5 text-footnote font-semibold text-dharma-saffron hover:underline">
                      <span>Inspect Textual Editions Registry</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-card border border-separator bg-surface-raised p-5 sm:p-6">
          <p className="text-subhead text-dharma-muted">
            Ready to explore the primary texts with transparent provenance?
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/sources/" data-vt="open" className="focus-ring inline-flex min-h-tap items-center rounded-pill border border-separator-strong px-4 text-subhead font-semibold text-dharma-text hover:border-dharma-saffron/50">
              Source Registry
            </Link>
            <Link href="/scriptures/" data-vt="open" className="apple-pill">
              <span>Scripture Library</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
