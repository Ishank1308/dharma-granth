'use client';

import { useEffect, useId, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Bot } from 'lucide-react';
import { answerQuestion, COPILOT_EXAMPLES, wisdomSlugFromPath, type CopilotAnswer } from '@/lib/copilot';
import { getWisdomTopic } from '@/data/wisdom-for-life';
import { askMuseSparkAgent } from '@/lib/muse-chat-agent';
import { MuseAgentResponseView } from './MuseAgentResponseView';
import { STUDY_HELPER_CAUTION_HI, STUDY_HELPER_MODEL_CREDIT, STUDY_HELPER_NAME } from '@/lib/editorial-terminology';

export function CopilotPanel({ onClose }: { onClose: () => void }) {
  const titleId = useId();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();
  const pageSlug = wisdomSlugFromPath(pathname);
  const pageTopic = pageSlug ? getWisdomTopic(pageSlug) : undefined;
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<CopilotAnswer | null>(null);

  // Muse Spark Agent states
  const [activeTab, setActiveTab] = useState<'library' | 'muse'>('library');
  const [museResponse, setMuseResponse] = useState<string | null>(null);
  const [museLoading, setMuseLoading] = useState(false);
  const [museError, setMuseError] = useState<string | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const ask = (text: string) => {
    const next = text.trim();
    if (!next) return;
    setQuery(next);
    setActiveTab('library');
    setAnswer(answerQuestion(next));
  };

  const askMuse = useCallback(async (text?: string) => {
    const target = (text || query).trim();
    if (!target) return;
    setQuery(target);
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
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end sm:p-4 print:hidden">
      <button type="button" className="absolute inset-0 bg-stone-950/40" aria-label="सहायक बंद करें" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[min(42rem,100dvh)] w-full flex-col overflow-hidden rounded-t-2xl border border-dharma-border bg-dharma-card text-dharma-text shadow-2xl sm:max-w-md sm:rounded-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-dharma-border px-4 py-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 id={titleId} className="text-lg font-bold" lang="hi">धर्म सहायक</h2>
              <span className="text-3xs font-mono uppercase bg-amber-500/20 text-amber-500 border border-amber-500/30 px-1.5 py-0.5 rounded">
                AI helper
              </span>
            </div>
            <p className="text-xs text-dharma-text-secondary" lang="hi">
              {activeTab === 'muse'
                ? `${STUDY_HELPER_NAME} · सारथी`
                : 'पुस्तकालय में दर्ज श्लोक और विषय'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/ask/" className="inline-flex min-h-11 items-center font-semibold text-dharma-maroon underline underline-offset-4 text-xs">
              पूरा पृष्ठ
            </Link>
            <button type="button" onClick={onClose} className="min-h-11 min-w-11 rounded-full border border-dharma-border px-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dharma-maroon">
              बंद
            </button>
          </div>
        </header>

        {/* Tab Selector */}
        <div className="flex border-b border-dharma-border bg-dharma-bg/50 px-4 py-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`flex-1 rounded-xl py-1.5 text-xs font-semibold transition ${
              activeTab === 'library'
                ? 'bg-dharma-card shadow-sm border border-dharma-border text-dharma-text font-bold'
                : 'text-dharma-text-secondary hover:text-dharma-text'
            }`}
          >
            📚 पुस्तकालय संदर्भ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('muse')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-semibold transition ${
              activeTab === 'muse'
                ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 font-bold shadow-sm'
                : 'text-dharma-text-secondary hover:text-amber-600'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>✨ Study helper</span>
          </button>
        </div>

        <form
          className="grid gap-2 border-b border-dharma-border px-4 py-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (activeTab === 'muse') {
              askMuse();
            } else {
              ask(query);
            }
          }}
        >
          <label htmlFor="dharma-copilot-q" className="text-sm font-semibold" lang="hi">
            {activeTab === 'muse' ? 'ज्ञान जिज्ञासा (AI helper)' : 'प्रश्न (Library Search)'}
          </label>
          <textarea
            id="dharma-copilot-q"
            ref={inputRef}
            rows={2}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              activeTab === 'muse'
                ? 'पूछें: अति-चिंतन या अशांति को कैसे शांत करें?'
                : 'उदाहरण: क्रोध कैसे संभालें?'
            }
            lang="hi"
            className="w-full resize-none rounded-xl border border-dharma-border bg-dharma-bg px-3 py-2 text-base text-dharma-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dharma-maroon"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 min-h-10 rounded-xl bg-dharma-maroon px-3 text-xs font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dharma-maroon"
            >
              पुस्तकालय में देखें
            </button>
            <button
              type="button"
              onClick={() => askMuse()}
              className="flex-1 flex items-center justify-center gap-1 min-h-10 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-3 text-xs font-bold text-stone-950 shadow-sm hover:brightness-105 active:scale-95 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ask the study helper</span>
            </button>
          </div>
        </form>

        <div className="grid gap-4 overflow-y-auto px-4 py-4">
          {activeTab === 'muse' ? (
            <div>
              {museResponse || museLoading || museError ? (
                <MuseAgentResponseView
                  query={query}
                  response={museResponse}
                  loading={museLoading}
                  error={museError}
                  onRetry={() => askMuse()}
                />
              ) : (
                <div className="space-y-4 py-2">
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center space-y-1.5">
                    <h3 className="text-sm font-bold text-amber-800 dark:text-amber-200 flex items-center justify-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span>{STUDY_HELPER_NAME}</span>
                    </h3>
                    <p className="text-xs text-dharma-text-secondary font-devanagari">
                      गहन दार्शनिक विवेक एवं शास्त्रीय समाधान ({STUDY_HELPER_MODEL_CREDIT} द्वारा संचालित; {STUDY_HELPER_CAUTION_HI})। नीचे दिए गए किसी विषय पर क्लिक करें अथवा ऊपर प्रश्न लिखें:
                    </p>
                  </div>

                  <div className="grid gap-2">
                    {[
                      'अति-चिंतन और मानसिक अशांति कैसे शांत करें?',
                      'कर्मयोग और कार्यक्षेत्र में बर्नआउट से मुक्ति',
                      'क्रोध और कटुता पर नियंत्रण के सूत्र',
                      'स्वधर्म और अपने जीवन-लक्ष्य की पहचान',
                    ].map((example, eIdx) => (
                      <button
                        key={eIdx}
                        type="button"
                        onClick={() => {
                          setQuery(example);
                          askMuse(example);
                        }}
                        className="rounded-xl border border-dharma-border p-3 text-left text-xs font-medium hover:border-amber-500/50 hover:bg-amber-500/5 transition flex items-center justify-between"
                      >
                        <span>{example}</span>
                        <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {pageTopic && (
                <button
                  type="button"
                  className="min-h-11 rounded-xl border border-dharma-border px-3 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dharma-maroon"
                  onClick={() => ask(pageTopic.titleHi)}
                >
                  <span lang="hi">इस पृष्ठ से: {pageTopic.titleHi}</span>
                </button>
              )}

              {!answer && (
                <div className="grid gap-2">
                  <p className="text-sm font-semibold" lang="hi">इनमें से पूछें</p>
                  {COPILOT_EXAMPLES.map((example) => (
                    <button
                      key={example.en}
                      type="button"
                      className="min-h-11 rounded-xl border border-dharma-border px-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dharma-maroon"
                      onClick={() => ask(example.hi)}
                    >
                      <span className="block font-medium" lang="hi">{example.hi}</span>
                      <span className="block text-sm text-dharma-text-secondary">{example.en}</span>
                    </button>
                  ))}
                </div>
              )}

              {answer && (
                <div className="space-y-4">
                  <AnswerView answer={answer} />
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 flex flex-col gap-2">
                    <p className="text-xs font-semibold text-amber-800 dark:text-amber-200">
                      इस विषय पर {STUDY_HELPER_NAME} से गहन दार्शनिक समाधान चाहते हैं?
                    </p>
                    <button
                      type="button"
                      onClick={() => askMuse(query || answer.titleHi)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400 transition"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Ask the study helper</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AnswerView({ answer }: { answer: CopilotAnswer }) {
  return (
    <article className="grid gap-4" lang="hi">
      <header>
        <h3 className="text-xl font-bold">{answer.titleHi}</h3>
        {answer.titleEn !== answer.titleHi && <p className="text-sm text-dharma-text-secondary">{answer.titleEn}</p>}
      </header>

      {answer.verses.length > 0 && (
        <section className="grid gap-3">
          <h4 className="font-bold">संबंधित श्लोक</h4>
          {answer.verses.map((verse) => (
            <div key={verse.href + verse.refEn} className="grid gap-2 rounded-xl border border-dharma-border p-3">
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
          <h4 className="font-bold">सरल अर्थ</h4>
          <p className="mt-1">{answer.simpleHi}</p>
        </section>
      )}

      {answer.contextHi && (
        <section>
          <h4 className="font-bold">पुस्तकालय में दर्ज संदर्भ</h4>
          <p className="mt-1">{answer.contextHi}</p>
        </section>
      )}

      {answer.applicationHi && (
        <section>
          <h4 className="font-bold">आज के जीवन में</h4>
          <p className="mt-1">{answer.applicationHi}</p>
        </section>
      )}

      {answer.dailyHi && (
        <section>
          <h4 className="font-bold">आज का एक कदम</h4>
          <p className="mt-1">{answer.dailyHi}</p>
        </section>
      )}

      {answer.related.length > 0 && (
        <section>
          <h4 className="font-bold">आगे पढ़ें</h4>
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
  );
}
