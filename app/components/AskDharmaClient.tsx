'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Shield } from 'lucide-react';
import { answerQuestion, COPILOT_EXAMPLES, type CopilotAnswer } from '@/lib/copilot';

/** Full-page library guide: answers drawn only from the library's verses and topic pages. */
export function AskDharmaClient() {
  const [queryInput, setQueryInput] = useState('');
  const [asked, setAsked] = useState('');
  const [answer, setAnswer] = useState<CopilotAnswer | null>(null);

  const ask = (text: string) => {
    const next = text.trim();
    if (!next) return;
    setQueryInput(next);
    setAsked(next);
    setAnswer(answerQuestion(next));
  };

  return (
    <div className="grid gap-8">
      <form
        className="grid gap-4 rounded-3xl border border-dharma-border bg-dharma-card p-5 shadow-lg sm:p-7"
        onSubmit={(event) => {
          event.preventDefault();
          ask(queryInput);
        }}
      >
        <label htmlFor="ask-dharma-q" className="font-semibold text-base" lang="hi">
          पुस्तकालय में खोजें
        </label>
        <input
          id="ask-dharma-q"
          value={queryInput}
          onChange={(event) => setQueryInput(event.target.value)}
          placeholder="उदाहरण: क्रोध कैसे संभालें?"
          lang="hi"
          className="min-h-12 w-full rounded-2xl border border-dharma-border bg-dharma-bg px-4 text-base text-dharma-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dharma-maroon"
        />

        <div className="flex flex-wrap gap-2.5">
          <button
            type="submit"
            className="min-h-11 rounded-2xl bg-dharma-maroon px-5 font-semibold text-white shadow-sm hover:opacity-95 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dharma-maroon text-sm"
          >
            पुस्तकालय में देखें
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {COPILOT_EXAMPLES.map((example) => (
            <button
              key={example.en}
              type="button"
              onClick={() => ask(example.hi)}
              className="min-h-10 rounded-full border border-dharma-border bg-dharma-bg/40 px-3.5 text-left text-xs font-semibold hover:border-amber-500/50 hover:bg-amber-500/5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dharma-maroon"
            >
              <span lang="hi">{example.hi}</span>
            </button>
          ))}
        </div>
      </form>

      {answer && (
        <article className="grid gap-6 rounded-3xl border border-dharma-border bg-dharma-card p-5 sm:p-8" lang="hi">
          <header className="grid gap-2">
            <p className="text-sm text-dharma-text-secondary">{asked}</p>
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">{answer.titleHi}</h2>
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
                <div key={verse.href + verse.refEn} className="grid gap-2 rounded-2xl border border-dharma-border p-4">
                  <p className="text-sm font-semibold">{verse.refHi}</p>
                  <p lang="sa" className="whitespace-pre-line text-lg leading-relaxed">{verse.sanskrit}</p>
                  <p>{verse.hindi}</p>
                  <p className="text-sm text-dharma-text-secondary" lang="en">{verse.english}</p>
                  {verse.noteHi && <p className="text-sm">{verse.noteHi}</p>}
                  <Link href={verse.href} className="inline-flex min-h-11 items-center font-semibold text-dharma-maroon underline underline-offset-4">
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
                    <Link href={link.href} className="inline-flex min-h-11 items-center font-semibold text-dharma-maroon underline underline-offset-4">
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
