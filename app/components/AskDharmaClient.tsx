'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { BookOpen, Shield, Sparkles } from 'lucide-react';
import { answerQuestion, COPILOT_EXAMPLES, type CopilotAnswer } from '@/lib/copilot';
import { askMuseSparkAgent } from '@/lib/muse-chat-agent';
import { MuseAgentResponseView } from './copilot/MuseAgentResponseView';

/** Full-page library guide & Meta Muse Spark 1.3 reasoning agent. */
export function AskDharmaClient() {
  const [queryInput, setQueryInput] = useState('');
  const [asked, setAsked] = useState('');
  const [answer, setAnswer] = useState<CopilotAnswer | null>(null);

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
        className="grid gap-4 rounded-3xl border border-dharma-border bg-dharma-card p-5 shadow-lg sm:p-7"
        onSubmit={(event) => {
          event.preventDefault();
          if (activeTab === 'muse') {
            askMuse();
          } else {
            ask(queryInput);
          }
        }}
      >
        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dharma-border pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`rounded-2xl px-4 py-2 text-xs font-bold transition ${
                activeTab === 'library'
                  ? 'bg-dharma-maroon text-white shadow-md'
                  : 'border border-dharma-border bg-dharma-bg/60 text-dharma-text-secondary hover:text-dharma-text'
              }`}
            >
              📚 पुस्तकालय संग्रह (Canonical)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('muse')}
              className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-bold transition ${
                activeTab === 'muse'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 shadow-md font-bold'
                  : 'border border-dharma-border bg-dharma-bg/60 text-dharma-text-secondary hover:text-amber-600'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>✨ Muse Spark 1.3 (AI सारथी)</span>
            </button>
          </div>
          <span className="text-2xs text-dharma-text-secondary font-mono">
            {activeTab === 'muse' ? 'Meta Muse Spark 1.3 Reasoning' : 'Offline Verified Verses'}
          </span>
        </div>

        <label htmlFor="ask-dharma-q" className="font-semibold text-base" lang="hi">
          {activeTab === 'muse' ? 'दार्शनिक जिज्ञासा अथवा परिस्थिति' : 'पुस्तकालय में खोजें'}
        </label>
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
          className="min-h-12 w-full rounded-2xl border border-dharma-border bg-dharma-bg px-4 text-base text-dharma-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dharma-maroon"
        />

        <div className="flex flex-wrap gap-2.5">
          <button
            type="submit"
            className="min-h-11 rounded-2xl bg-dharma-maroon px-5 font-semibold text-white shadow-sm hover:opacity-95 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dharma-maroon text-sm"
          >
            पुस्तकालय में देखें
          </button>
          <button
            type="button"
            onClick={() => askMuse()}
            className="flex items-center gap-2 min-h-11 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 px-5 font-bold text-stone-950 shadow-md hover:brightness-105 active:scale-95 transition text-sm"
          >
            <Sparkles className="h-4 w-4" />
            <span>Ask Muse Spark 1.3</span>
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
              className="min-h-10 rounded-full border border-dharma-border bg-dharma-bg/40 px-3.5 text-left text-xs font-semibold hover:border-amber-500/50 hover:bg-amber-500/5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dharma-maroon"
            >
              <span lang="hi">{example.hi}</span>
            </button>
          ))}
        </div>
      </form>

      {/* Muse Spark View */}
      {activeTab === 'muse' && (
        <div className="rounded-3xl border border-dharma-border bg-dharma-card p-5 sm:p-8 shadow-lg">
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
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Meta Muse Spark 1.3 · AI चिंतन सारथी</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-dharma-text">
                जीवन के जटिल द्वंद्वों पर गहन दार्शनिक चिंतन
              </h3>
              <p className="max-w-2xl mx-auto text-sm sm:text-base text-dharma-text-secondary leading-relaxed font-devanagari">
                Meta Muse Spark 1.3 विस्तृत विवेक (Reasoning) द्वारा संचालित है। यह वेदों, उपनिषदों और भगवद्गीता के प्रामाणिक संदर्भों के साथ आपकी विशिष्ट परिस्थिति पर व्यक्तिगत मार्गदर्शन प्रस्तुत करता है।
              </p>
            </div>
          )}
        </div>
      )}

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
          {/* Consult Muse Spark CTA */}
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-dharma-bg/60 to-transparent p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-stone-950 shadow-md">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h4 className="font-bold text-sm text-dharma-text flex items-center gap-2">
                  इस विषय पर गहन व्यक्तिगत चिंतन चाहिए?
                  <span className="text-3xs font-mono uppercase bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                    Muse Spark 1.3
                  </span>
                </h4>
                <p className="text-xs text-dharma-text-secondary font-devanagari mt-0.5">
                  Meta Muse Spark 1.3 आपकी विशिष्ट स्थिति के अनुसार शास्त्रीय सिद्धांतों का व्यावहारिक अनुप्रयोग प्रस्तुत करेगा।
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => askMuse(queryInput || answer.titleHi)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2.5 text-xs font-bold text-stone-950 shadow-md hover:brightness-105 active:scale-95 transition shrink-0"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ask Muse Spark 1.3</span>
            </button>
          </div>

          {answer.disclaimerHi && <p className="text-sm text-dharma-text-secondary">{answer.disclaimerHi}</p>}
        </article>
      )}
    </div>
  );
}
