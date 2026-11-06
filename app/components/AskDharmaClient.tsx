'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Shield, Sparkles } from 'lucide-react';
import { answerQuestion, COPILOT_EXAMPLES, type CopilotAnswer } from '@/lib/copilot';
import { askMuseSparkAgent } from '@/lib/muse-chat-agent';
import { MuseAgentResponseView } from './copilot/MuseAgentResponseView';
import { matchQuestions, type QuestionMatch, type QuestionBankEntry } from '@/lib/granth-answers-match';
import { STUDY_HELPER_CAUTION_HI, STUDY_HELPER_MODEL_CREDIT, STUDY_HELPER_NAME, STUDY_HELPER_NAME_HI } from '@/lib/editorial-terminology';

/** Full-page library guide & Meta Muse Spark 1.3 reasoning agent. */
export function AskDharmaClient({ questionBank = [] }: { questionBank?: QuestionBankEntry[] }) {
  const [queryInput, setQueryInput] = useState('');
  const [asked, setAsked] = useState('');
  const [answer, setAnswer] = useState<CopilotAnswer | null>(null);
  const [matches, setMatches] = useState<QuestionMatch[] | null>(null);

  // Muse Spark Agent states
  const [activeTab, setActiveTab] = useState<'library' | 'muse'>('library');
  const [museResponse, setMuseResponse] = useState<string | null>(null);
  const [museLoading, setMuseLoading] = useState(false);
  const [museError, setMuseError] = useState<string | null>(null);

  const ask = (text: string) => {
    const next = text.trim();
    if (!next) return;
    setQueryInput(next);
    setAsked(next);
    setActiveTab('library');
    setMatches(matchQuestions(next, questionBank));
    setAnswer(answerQuestion(next));
  };

  const askMuse = useCallback(async (text?: string) => {
    const target = (text || queryInput).trim();
    if (!target) return;
    setQueryInput(target);
    setAsked(target);
    setActiveTab('muse');
    setMuseLoading(true);
    setMuseError(null);
    try {
      const res = await askMuseSparkAgent(target);
      setMuseResponse(res);
    } catch (err: any) {
      setMuseError(err?.message || 'Error communicating with Muse Spark 1.3');
    } finally {
      setMuseLoading(false);
    }
  }, [queryInput]);

  return (
    <div className="grid gap-8">
      <form
        className="apple-card grid gap-4 p-5 sm:p-7"
        onSubmit={(event) => {
          event.preventDefault();
          if (activeTab === 'muse') {
            askMuse();
          } else {
            ask(queryInput);
          }
        }}
      >
        {/* Mode selector: a segmented control */}
        <div className="apple-segmented justify-self-start" role="group" aria-label="Where to look">
          <button type="button" aria-pressed={activeTab === 'library'} onClick={() => setActiveTab('library')}>
            <span>Library</span> <span lang="hi" className="font-devanagari">पुस्तकालय</span>
          </button>
          <button type="button" aria-pressed={activeTab === 'muse'} onClick={() => setActiveTab('muse')} className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{STUDY_HELPER_NAME}</span> <span lang="hi" className="font-devanagari">{STUDY_HELPER_NAME_HI}</span>
          </button>
        </div>

        <label htmlFor="ask-dharma-q" className="text-[15px] font-semibold" lang="hi">
          {activeTab === 'muse' ? 'दार्शनिक जिज्ञासा अथवा परिस्थिति' : 'अपना प्रश्न लिखें'}
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="ask-dharma-q"
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder={
              activeTab === 'muse'
                ? 'पूछें: अति-चिंतन, भविष्य का भय, कार्यक्षेत्र में बर्नआउट, स्वधर्म की पहचान...'
                : 'उदाहरण: क्रोध कैसे संभालें?'
            }
            lang="hi"
            className="apple-field"
          />
          <button type="submit" className="apple-pill shrink-0">
            {activeTab === 'muse' ? <span>Ask the study helper</span> : <span lang="hi">उत्तर देखें</span>}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {COPILOT_EXAMPLES.map((example) => (
            <button
              key={example.en}
              type="button"
              onClick={() => {
                if (activeTab === 'muse') {
                  askMuse(example.hi);
                } else {
                  ask(example.hi);
                }
              }}
              className="min-h-10 rounded-full bg-dharma-text/[0.06] px-3.5 text-left text-[14px] text-dharma-text transition hover:bg-dharma-text/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dharma-saffron"
            >
              <span lang="hi">{example.hi}</span>
            </button>
          ))}
        </div>
      </form>

      {/* Muse Spark View */}
      {activeTab === 'muse' && (
        <div className="apple-card p-5 sm:p-8">
          {museResponse || museLoading || museError ? (
            <MuseAgentResponseView
              query={queryInput}
              response={museResponse}
              loading={museLoading}
              error={museError}
              onRetry={() => askMuse()}
            />
          ) : (
            <div className="space-y-6 py-4 text-center">
              <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-dharma-saffron">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>{STUDY_HELPER_NAME} · {STUDY_HELPER_NAME_HI}</span>
              </div>
              <h3 className="text-2xl font-semibold tracking-[-0.02em] text-dharma-text sm:text-3xl">
                जीवन के जटिल द्वंद्वों पर गहन दार्शनिक चिंतन
              </h3>
              <p className="max-w-2xl mx-auto text-sm sm:text-base text-dharma-text-secondary leading-relaxed font-devanagari">
                यह सहायक AI ({STUDY_HELPER_MODEL_CREDIT}) द्वारा संचालित है। यह वेदों, उपनिषदों और भगवद्गीता के प्रामाणिक संदर्भों के साथ आपकी विशिष्ट परिस्थिति पर व्यक्तिगत मार्गदर्शन प्रस्तुत करता है। {STUDY_HELPER_CAUTION_HI}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'library' && matches && matches.length > 0 && (
        <section className="grid gap-4" aria-labelledby="granth-matches">
          <Link
            href={`/ask/${matches[0].entry.slug}/`}
            className="apple-card grid gap-2 p-5 transition hover:-translate-y-0.5 sm:p-7"
          >
            <span id="granth-matches" className="text-[13px] font-semibold text-dharma-saffron">
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

      {activeTab === 'library' && matches && matches.length === 0 && !answer && (
        <p className="apple-card p-5 text-[15px] text-dharma-text-secondary">
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
                <div key={verse.href + verse.refEn} className="grid gap-2 rounded-[14px] bg-dharma-text/[0.04] p-4">
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
          {/* Consult Muse Spark CTA */}
          <div className="flex flex-col items-start justify-between gap-4 rounded-[14px] bg-dharma-text/[0.04] p-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="apple-tint-chip h-10 w-10" aria-hidden="true">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h4 className="font-bold text-sm text-dharma-text flex items-center gap-2">
                  इस विषय पर गहन व्यक्तिगत चिंतन चाहिए?
                  <span className="rounded-full bg-dharma-text/[0.08] px-2 py-0.5 text-[11px] font-normal text-dharma-muted">
                    AI helper
                  </span>
                </h4>
                <p className="text-xs text-dharma-text-secondary font-devanagari mt-0.5">
                  AI study helper आपकी विशिष्ट स्थिति के अनुसार शास्त्रीय सिद्धांतों का व्यावहारिक अनुप्रयोग प्रस्तुत करेगा ({STUDY_HELPER_MODEL_CREDIT} द्वारा संचालित; {STUDY_HELPER_CAUTION_HI})।
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => askMuse(queryInput || answer.titleHi)}
              className="apple-pill shrink-0"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ask the study helper</span>
            </button>
          </div>

          {answer.disclaimerHi && <p className="text-sm text-dharma-text-secondary">{answer.disclaimerHi}</p>}
        </article>
      )}
    </div>
  );
}
