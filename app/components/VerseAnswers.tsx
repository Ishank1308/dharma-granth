import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { granthAnswersForVerse } from '@/data/granth-answers';

/** "This verse answers": links from a verse page to the Granth se Poochhiye answers that cite it. Server HTML only. */
export function VerseAnswers({ scriptureId, chapterId, verseId }: { scriptureId: string; chapterId: number; verseId: string }) {
  const answers = granthAnswersForVerse(scriptureId, chapterId, verseId);
  if (answers.length === 0) return null;
  return (
    <section aria-labelledby="verse-answers" className="mt-8 rounded-3xl border border-dharma-border bg-dharma-card p-5 sm:p-6">
      <h2 id="verse-answers" className="font-serif text-lg font-bold">
        <span lang="hi" className="font-devanagari">यह श्लोक इन प्रश्नों का उत्तर देता है</span>{' '}
        <span className="text-sm font-semibold text-dharma-muted">Questions this verse answers</span>
      </h2>
      <ul className="mt-3 grid gap-2">
        {answers.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/ask/${a.slug}/`}
              className="flex min-h-11 items-center justify-between gap-3 rounded-2xl border border-dharma-border bg-dharma-bg/60 px-4 py-3 hover:border-saffron-500/60"
            >
              <span>
                <span lang="hi" className="block font-devanagari font-semibold">{a.questionHi}</span>
                <span className="block text-sm text-dharma-muted">{a.questionEn}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-saffron-700" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
