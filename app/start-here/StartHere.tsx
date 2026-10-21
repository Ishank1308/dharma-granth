'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { START_KEY, recommend, type StartAnswers } from '@/data/start-here';
import { useReaderSettings } from '@/lib/useReaderSettings';

interface Option { value: string; en: string; hi: string }
interface Question { key: keyof StartAnswers; en: string; hi: string; options: Option[] }

const QUESTIONS: Question[] = [
  {
    key: 'interest', en: 'What would you like to explore?', hi: 'आप क्या जानना चाहेंगे?',
    options: [
      { value: 'gita', en: 'Bhagavad Gita', hi: 'भगवद्गीता' },
      { value: 'upanishads', en: 'Upanishads', hi: 'उपनिषद्' },
      { value: 'karma', en: 'Karma Yoga', hi: 'कर्मयोग' },
      { value: 'bhakti', en: 'Bhakti', hi: 'भक्ति' },
      { value: 'daily', en: 'Daily wisdom', hi: 'दैनिक चिंतन' },
      { value: 'sanskrit', en: 'Sanskrit', hi: 'संस्कृत' },
      { value: 'life', en: 'A life situation', hi: 'जीवन की कोई स्थिति' },
      { value: 'unsure', en: 'I am not sure', hi: 'अभी तय नहीं' },
    ],
  },
  {
    key: 'familiarity', en: 'How familiar are you with scripture?', hi: 'शास्त्रों से आपका परिचय कितना है?',
    options: [
      { value: 'new', en: 'New reader', hi: 'नया पाठक' },
      { value: 'some', en: 'Some familiarity', hi: 'थोड़ा परिचय' },
      { value: 'regular', en: 'Regular reader', hi: 'नियमित पाठक' },
      { value: 'serious', en: 'Serious student', hi: 'गंभीर अध्येता' },
    ],
  },
  {
    key: 'language', en: 'Which language do you prefer?', hi: 'आप किस भाषा में पढ़ना चाहेंगे?',
    options: [
      { value: 'hindi', en: 'Hindi', hi: 'हिन्दी' },
      { value: 'english', en: 'English', hi: 'अंग्रेज़ी' },
      { value: 'both', en: 'Hindi and English', hi: 'हिन्दी और अंग्रेज़ी' },
    ],
  },
  {
    key: 'time', en: 'How much time would you like to spend?', hi: 'कितना समय देना चाहेंगे?',
    options: [
      { value: '5', en: '5 minutes', hi: '५ मिनट' },
      { value: '10', en: '10 minutes', hi: '१० मिनट' },
      { value: '20', en: '20 minutes', hi: '२० मिनट' },
      { value: 'deep', en: 'Deep study', hi: 'गहन अध्ययन' },
    ],
  },
];

type Draft = Partial<Record<keyof StartAnswers, string>>;

function isAnswers(v: unknown): v is StartAnswers {
  const o = v as Partial<Record<keyof StartAnswers, unknown>> | null;
  return Boolean(o) && QUESTIONS.every((q) => typeof o![q.key] === 'string' && q.options.some((opt) => opt.value === o![q.key]));
}

/** Four optional questions leading to a suggested starting path, with the reason shown. */
export function StartHere() {
  const { update } = useReaderSettings();
  const [draft, setDraft] = useState<Draft>({});
  const [saved, setSaved] = useState<StartAnswers | null>(null);
  const [ready, setReady] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    try {
      const raw: unknown = JSON.parse(localStorage.getItem(START_KEY) ?? 'null');
      if (isAnswers(raw)) setSaved(raw);
    } catch {
      setStorageOk(false);
    }
    setReady(true);
  }, []);

  const complete = QUESTIONS.every((q) => draft[q.key]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complete) return;
    const answers = draft as unknown as StartAnswers;
    try {
      localStorage.setItem(START_KEY, JSON.stringify(answers));
    } catch {
      setStorageOk(false);
    }
    // The language answer also sets the reader's language layers; this is stated on the page and can be changed in Reader settings.
    update('preferredLanguage', answers.language === 'both' ? 'all' : answers.language);
    update('showHindi', answers.language !== 'english');
    update('showEnglish', answers.language !== 'hindi');
    setSaved(answers);
  };

  const reset = () => {
    try { localStorage.removeItem(START_KEY); } catch { /* nothing to remove */ }
    setSaved(null);
    setDraft({});
    setMsg('Your answers were deleted from this browser.');
  };

  const recs = saved ? recommend(saved) : [];

  return (
    <main id="main" className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-dharma-text">Start Here</h1>
      <p lang="hi" className="font-devanagari text-lg text-dharma-muted">कहाँ से आरम्भ करें?</p>
      <p className="mt-3 text-sm text-dharma-muted">Four short questions. You can skip them and browse the library instead.</p>

      <aside aria-label="What is stored" className="mt-4 rounded-xl border border-dharma-border bg-dharma-card p-4 text-sm text-dharma-muted">
        <strong className="text-dharma-text">What is stored.</strong> Your four answers, and the reader language they imply, stay in this browser. Nothing is sent anywhere, no account is needed, and nothing is guessed about your beliefs or identity. You can delete them at any time.
      </aside>

      {!ready ? (
        <p role="status" className="mt-8 text-sm text-dharma-muted">Loading…</p>
      ) : saved ? (
        <section aria-labelledby="sh-rec" className="mt-8">
          <h2 id="sh-rec" className="font-serif text-2xl font-bold text-dharma-text">This may be a helpful place to begin</h2>
          <ul className="mt-4 space-y-4">
            {recs.map(({ path, reason }) => (
              <li key={path.id} className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
                <h3 className="font-serif text-lg font-bold text-dharma-text">{path.title} <span lang="hi" className="font-devanagari text-sm font-normal text-dharma-muted">· {path.titleHi}</span></h3>
                <p className="mt-1 text-sm text-dharma-muted">{path.summary}</p>
                <p className="mt-2 text-sm text-dharma-text"><span className="font-semibold">Why this is suggested:</span> {reason}</p>
                <p className="mt-1 text-sm text-dharma-muted">{path.minutes}</p>
                {path.note && <p className="mt-1 text-sm text-dharma-muted">{path.note}</p>}
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                  {path.steps.map((s) => (
                    <li key={s.href + s.label}><Link href={s.href} className="inline-flex min-h-[44px] items-center text-saffron-800 underline underline-offset-2 dark:text-saffron-300">{s.label}</Link></li>
                  ))}
                </ul>
                <Link href={path.href} className="focus-ring mt-3 inline-flex min-h-[44px] items-center rounded-xl bg-saffron-700 px-5 text-sm font-semibold text-white hover:bg-saffron-800">Begin</Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => setSaved(null)} className="focus-ring min-h-[44px] rounded-xl border border-dharma-border px-5 text-sm font-semibold text-dharma-text hover:border-saffron-400">Change my answers</button>
            <button type="button" onClick={reset} className="focus-ring min-h-[44px] rounded-xl border border-dharma-border px-5 text-sm font-semibold text-dharma-text hover:border-rose-400">Reset and delete my answers</button>
          </div>
        </section>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-6">
          {QUESTIONS.map((q, i) => (
            <fieldset key={q.key} className="rounded-2xl border border-dharma-border bg-dharma-card p-4">
              <legend className="px-1 text-base font-semibold text-dharma-text">{i + 1}. {q.en} <span lang="hi" className="font-devanagari text-sm font-normal text-dharma-muted">· {q.hi}</span></legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {q.options.map((o) => (
                  <label key={o.value} className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border px-3 text-sm focus-within:ring-2 focus-within:ring-saffron-500 ${draft[q.key] === o.value ? 'border-saffron-700 bg-saffron-50 dark:bg-saffron-950/30' : 'border-dharma-border'}`}>
                    <input type="radio" name={q.key} value={o.value} checked={draft[q.key] === o.value} onChange={() => setDraft({ ...draft, [q.key]: o.value })} className="h-4 w-4 accent-saffron-700" />
                    <span>{o.en} <span lang="hi" className="font-devanagari text-dharma-muted">· {o.hi}</span></span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={!complete} className="focus-ring min-h-[48px] rounded-xl bg-saffron-700 px-6 text-sm font-semibold text-white hover:bg-saffron-800 disabled:cursor-not-allowed disabled:opacity-50">Show where to begin</button>
            <Link href="/scriptures" className="focus-ring inline-flex min-h-[48px] items-center rounded-xl px-4 text-sm font-semibold text-dharma-muted underline underline-offset-2">Skip and browse the library</Link>
          </div>
          {!complete && <p className="text-sm text-dharma-muted">Answer all four to see suggestions, or skip.</p>}
        </form>
      )}

      {!storageOk && <p role="status" className="mt-6 text-sm text-dharma-muted">Your browser is blocking storage, so answers will not be remembered after you leave.</p>}
      <p role="status" aria-live="polite" className="mt-4 min-h-[1.25rem] text-sm text-dharma-muted">{msg}</p>
    </main>
  );
}
