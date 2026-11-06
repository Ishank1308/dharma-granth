import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { getRealVerseCount } from '@/data/scriptures';
import { formatCount } from '@/lib/holdings-label';

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

const h2 = 'mt-10 font-serif text-xl font-bold text-dharma-text';
const p = 'mt-3 leading-relaxed text-dharma-text';

export default function MethodologyPage() {
  return (
    <main id="main" className="min-h-screen bg-dharma-bg">
      <article className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-saffron-800 dark:text-saffron-300">Methodology · कार्यपद्धति</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-dharma-text sm:text-4xl">How this site is made</h1>
        <p className={p}>
          This page says plainly where each kind of content comes from, what is machine-assisted, and what has not been reviewed by a person.
          It describes what is true today, not what is intended. For a shorter overview, see <Link href="/how-dharma-granth-works" className="font-semibold text-saffron-800 underline-offset-2 hover:underline dark:text-saffron-300">how Dharma Granth works</Link>.
        </p>

        <nav aria-label="On this page" className="mt-6 rounded-2xl border border-dharma-border bg-dharma-card p-4">
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {[
              ['sources', 'Source texts'],
              ['translations', 'Translations'],
              ['commentary', 'Commentary and attribution'],
              ['modern', 'Modern explanations'],
              ['ai', 'AI assistance'],
              ['review', 'Human review'],
              ['corrections', 'Corrections'],
              ['audio', 'Audio & soundscape architecture'],
            ].map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="focus-ring inline-flex min-h-[44px] items-center text-saffron-800 hover:underline dark:text-saffron-300">
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <h2 id="sources" className={h2}>1. Source texts</h2>
        <p className={p}>
          The Sanskrit text is imported from open digital archives, mainly sanskritdocuments.org and the DharmicData collection on GitHub. Each
          chapter file records the archive address, its licence and the date it was fetched, and the verse page shows the archive it came from.
        </p>
        <p className={p}>
          These are digitised texts, not critical editions prepared by this site. They have not been compared line by line with a printed
          edition, so spelling, sandhi and verse numbering can differ from the edition you use. Numbering follows the imported source.
        </p>

        <h2 id="translations" className={h2}>2. Translations</h2>
        <p className={p}>
          Where the source archive supplies a Hindi or English translation, it is used as supplied. Where it does not, a translation was
          drafted with AI assistance. Every such verse carries an “AI” flag in its data, and the reader marks it on the page.
        </p>
        <p className={p}>
          As of {SNAPSHOT.date}, {SNAPSHOT.ai} of {SNAPSHOT.verses} verses in the library carry that flag. Those translations have not been
          checked by a Sanskrit scholar. Treat them as reading aids, and check the Sanskrit and a printed translation for anything that matters.
        </p>

        <h2 id="commentary" className={h2}>3. Commentary and attribution</h2>
        <p className={p}>
          Classical commentators (for example Shankara, Ramanuja and Sridhara) are named only when a summary is attributed to them. Those
          summaries are short paraphrases written for this site. They are not quotations or translations of the original commentaries, and they
          have not yet been checked against the original works. Commentary that was produced with AI assistance is labelled as such.
        </p>

        <h2 id="modern" className={h2}>4. Modern explanations</h2>
        <p className={p}>
          Simple meanings, “why it matters today”, modern examples, misunderstanding notes, teaching flows and reflection questions are editorial.
          They were written for this site to help new readers, and they are labelled “not scripture” wherever they appear. They are drafts
          awaiting scholarly review. They make no promises about outcomes and are not medical or psychological advice.
        </p>

        <h2 id="ai" className={h2}>5. AI assistance</h2>
        <p className={p}>
          AI (Anthropic’s Claude, among other tools) has been used to draft Hindi and English translations, commentary summaries and the editorial
          explanations above, and to help build this site. AI can make errors, including confident-sounding ones. That is why such content is
          flagged, kept visually separate from the Sanskrit, and open to correction.
        </p>

        <h2 id="review" className={h2}>6. Human review</h2>
        <p className={p}>
          No systematic human review of the texts, translations or commentary is recorded yet. For that reason the site does not show
          “verified” or “reviewed” badges. When a named reviewer checks a text, the review will be recorded with the reviewer’s name and the
          date, and only then will a badge appear.
        </p>

        <h2 id="corrections" className={h2}>7. Corrections</h2>
        <p className={p}>
          There is no public channel for reporting corrections yet; one will be listed on the Contact page once it is set up. Fixes are
          made in the project repository. There is no separate correction log on the site yet.
        </p>

        <h2 id="rights" className={h2}>8. Rights information</h2>
        <p className={p}>
          The classical Sanskrit texts are ancient and not under copyright, but a particular edition, translation or commentary can be.
          The <Link href="/sources" className="font-semibold text-saffron-800 underline-offset-2 hover:underline dark:text-saffron-300">source library</Link> names
          the edition behind each text. Where the licence of an edition or translation has not been confirmed, that is not stated as settled here;
          if you hold rights in material shown on this site, use the correction link on any verse page to tell the editors and it will be reviewed.
          Explanations marked as editorial or AI-assisted are this project’s own drafts.
        </p>

        <h2 id="versions" className={h2}>9. Version history</h2>
        <p className={p}>
          The site has no separate version log. Every change to texts, translations and explanations is recorded, with its date, in the public
          project repository history, which is the authoritative record. Pages that carry an editorial explanation show its last-updated date where
          one is recorded.
        </p>

        <h2 id="audio" className={h2}>10. Audio and soundscape architecture</h2>
        <p className={p}>
          Dharma Granth includes no network audio streaming, zero audio tracking, and no external audio hosting dependencies.
          Contemplative ambient soundscapes (Vedic Tanpura, Pranava Om, Bansuri Flute, Temple Singing Bowl) are generated procedurally in the user’s
          browser using the Web Audio API based on mathematical harmonic ratios (432Hz and 108Hz overtone series). Sanskrit verse recitation
          and word-by-word pronunciation use the client-side Web Speech API (with Devanagari voice detection) strictly as an accessibility and
          phonetic pronunciation aid, chunked metric-by-metric by dandas (। / ॥) to maintain sacred cadence.
        </p>

        <p className="mt-10 text-sm text-dharma-muted">
          Back to the <Link href="/scriptures" className="font-semibold text-saffron-800 underline-offset-2 hover:underline dark:text-saffron-300">scripture library</Link>.
        </p>
      </article>
    </main>
  );
}
