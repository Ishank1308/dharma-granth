'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Shield } from 'lucide-react';
import { answerQuestion, COPILOT_EXAMPLES, type CopilotAnswer } from '@/lib/copilot';
import { matchQuestions, type QuestionMatch, type QuestionBankEntry } from '@/lib/granth-answers-match';
import { CREDENTIAL_KEYS } from '@/lib/backup';

/**
 * Full-page library guide. Every answer is assembled on the device from the library's own verses and
 * answer pages; nothing the reader types leaves the browser.
 */
export function AskDharmaClient({ questionBank = [] }: { questionBank?: QuestionBankEntry[] }) {
  const [queryInput, setQueryInput] = useState('');
  const [asked, setAsked] = useState('');
  const [answer, setAnswer] = useState<CopilotAnswer | null>(null);
  const [matches, setMatches] = useState<QuestionMatch[] | null>(null);

  // This page once had an AI helper that kept the reader's own API key in the browser. Forget it.
  useEffect(() => {
    try {
      for (const key of CREDENTIAL_KEYS) window.localStorage.removeItem(key);
    } catch {
      // Storage can be unavailable (private mode); there is nothing to remove then.
    }
  }, []);

  const ask = (text: string) => {
    const next = text.trim();
    if (!next) return;
    setQueryInput(next);
    setAsked(next);
    setMatches(matchQuestions(next, questionBank));
    setAnswer(answerQuestion(next));
  };

  return (
    <div className="grid gap-8">
      <form
        className="apple-card grid grid-cols-1 gap-4 p-5 sm:p-7"
        onSubmit={(event) => {
          event.preventDefault();
          ask(queryInput);
        }}
      >
        <label htmlFor="ask-dharma-q" className="text-subhead font-semibold" lang="hi">
          अपना प्रश्न लिखें
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="ask-dharma-q"
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder="उदाहरण: क्रोध कैसे संभालें?"
            lang="hi"
            className="apple-field"
          />
          <button type="submit" className="apple-pill shrink-0">
            <span lang="hi">उत्तर देखें</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {COPILOT_EXAMPLES.map((example) => (
            <button
              key={example.en}
              type="button"
              onClick={() => ask(example.hi)}
              className="min-h-10 rounded-full bg-dharma-text/[0.06] px-3.5 text-left text-[14px] text-dharma-text transition hover:bg-dharma-text/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dharma-saffron"
            >
              <span lang="hi">{example.hi}</span>
            </button>
          ))}
        </div>
      </form>

      {matches && matches.length > 0 && (
        <section className="grid gap-4" aria-labelledby="granth-matches">
          <Link
            href={`/ask/${matches[0].entry.slug}/`}
            className="apple-card grid gap-2 p-5 transition hover:-translate-y-0.5 sm:p-7"
          >
            <span id="granth-matches" className="text-footnote font-semibold text-dharma-saffron">
              <span lang="hi">आपका उत्तर</span> <span>Your answer</span>
            </span>
            <span lang="hi" className="font-devanagari text-2xl font-semibold">{matches[0].entry.questionHi}</span>
            <span className="text-dharma-text-secondary">{matches[0].entry.questionEn}</span>
            <span lang="hi" className="font-devanagari text-lg leading-relaxed">{matches[0].entry.sarHi}</span>
            <span className="mt-1 inline-flex items-center gap-1.5 text-dharma-saffron">
              <span lang="hi">पूरा उत्तर पढ़ें</span> <span>Read the answer</span> <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </Link>
          {matches.length > 1 && (
            <p className="px-1 text-sm text-dharma-text-secondary">
              <span lang="hi">मिलते‑जुलते प्रश्न:</span> <span>Close questions:</span>{' '}
              {matches.slice(1, 3).map(({ entry }, i) => (
                <span key={entry.slug}>
                  {i > 0 && ' · '}
                  <Link href={`/ask/${entry.slug}/`} lang="hi" className="font-devanagari text-dharma-saffron hover:underline">
                    {entry.questionHi}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </section>
      )}

      {matches && matches.length === 0 && !answer && (
        <p className="apple-card p-5 text-subhead text-dharma-text-secondary">
          <span lang="hi">इस प्रश्न का उत्तर‑पृष्ठ अभी नहीं बना। नीचे की सूची में मिलता‑जुलता प्रश्न देखें।</span>{' '}
          <span>No answer page for this yet. Look for a close question in the list below.</span>
        </p>
      )}

      {answer && !(matches && matches.length > 0) && (
        <article className="apple-card grid gap-6 p-5 sm:p-8" lang="hi">
          <header className="grid gap-2">
            <p className="text-sm text-dharma-text-secondary">{asked}</p>
            <h2 className="text-2xl font-semibold sm:text-3xl">{answer.titleHi}</h2>
            {answer.titleEn !== answer.titleHi && <p className="text-dharma-text-secondary">{answer.titleEn}</p>}
            <p className="flex items-start gap-2 text-sm text-dharma-text-secondary">
              <Shield className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>यह उत्तर पुस्तकालय के श्लोकों और विषय-पृष्ठों से जोड़ा गया है। नई टीका नहीं लिखी जाती। यह दैवीय आदेश नहीं है।</span>
            </p>
          </header>

          {answer.verses.length > 0 && (
            <section className="grid gap-4">
              <h3 className="flex items-center gap-2 font-bold"><BookOpen className="h-4 w-4" aria-hidden="true" /> संबंधित श्लोक</h3>
              {answer.verses.map((verse) => (
                <div key={verse.href + verse.refEn} className="grid gap-2 rounded-group bg-dharma-text/[0.04] p-4">
                  <p className="text-sm font-semibold">{verse.refHi}</p>
                  <p lang="sa" className="whitespace-pre-line text-lg leading-relaxed">{verse.sanskrit}</p>
                  <p>{verse.hindi}</p>
                  <p className="text-sm text-dharma-text-secondary" lang="en">{verse.english}</p>
                  {verse.noteHi && <p className="text-sm">{verse.noteHi}</p>}
                  <Link href={verse.href} className="inline-flex min-h-11 items-center font-semibold text-dharma-saffron hover:underline">
                    श्लोक पृष्ठ खोलें
                  </Link>
                </div>
              ))}
            </section>
          )}

          {answer.simpleHi && (
            <section>
              <h3 className="font-bold">सरल अर्थ</h3>
              <p className="mt-1">{answer.simpleHi}</p>
            </section>
          )}
          {answer.contextHi && (
            <section>
              <h3 className="font-bold">पुस्तकालय में दर्ज संदर्भ</h3>
              <p className="mt-1">{answer.contextHi}</p>
            </section>
          )}
          {answer.applicationHi && (
            <section>
              <h3 className="font-bold">आज के जीवन में</h3>
              <p className="mt-1">{answer.applicationHi}</p>
            </section>
          )}
          {answer.dailyHi && (
            <section>
              <h3 className="font-bold">आज का एक कदम</h3>
              <p className="mt-1">{answer.dailyHi}</p>
            </section>
          )}
          {answer.related.length > 0 && (
            <section>
              <h3 className="font-bold">आगे पढ़ें</h3>
              <ul className="mt-1 grid gap-1">
                {answer.related.map((link) => (
                  <li key={link.href + link.labelEn}>
                    <Link href={link.href} className="inline-flex min-h-11 items-center font-semibold text-dharma-saffron hover:underline">
                      {link.labelHi}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {answer.disclaimerHi && <p className="text-sm text-dharma-text-secondary">{answer.disclaimerHi}</p>}
        </article>
      )}
    </div>
  );
}
