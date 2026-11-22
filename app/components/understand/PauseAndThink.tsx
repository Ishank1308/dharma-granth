'use client';

import { useEffect, useId, useState } from 'react';
import { Download, Lock, Trash2 } from 'lucide-react';

/**
 * "Pause and think" (spec §6). A question, then either thinking quietly or
 * writing privately. Writing is saved only in this browser: no account, no
 * upload, with delete and export always one tap away.
 */

const KEY = 'dharma.reflections.v1';

interface Entry {
  text: string;
  question: string;
  at: string;
}
type Store = Record<string, Entry>;

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? (parsed as Store) : {};
  } catch {
    return {};
  }
}

function write(store: Store): boolean {
  try {
    if (Object.keys(store).length === 0) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}

export function PauseAndThink({
  refKey,
  reference,
  question,
  questionHi,
}: {
  refKey: string;
  reference: string;
  question: string;
  questionHi?: string;
}) {
  const [mode, setMode] = useState<'idle' | 'quiet' | 'write'>('idle');
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const [storageOk, setStorageOk] = useState(true);
  const [saved, setSaved] = useState(false);
  const fieldId = useId();

  useEffect(() => {
    const existing = read()[refKey];
    if (existing) {
      setText(existing.text);
      setSaved(true);
    }
  }, [refKey]);

  const save = () => {
    const store = read();
    if (text.trim()) store[refKey] = { text: text.trim(), question, at: new Date().toISOString() };
    else delete store[refKey];
    const ok = write(store);
    setStorageOk(ok);
    setSaved(Boolean(text.trim()) && ok);
    setStatus(ok ? (text.trim() ? 'Saved on this device only.' : 'Entry removed.') : 'Sorry, this could not be saved because the browser is not allowing storage. Your words are still on screen.');
  };

  const remove = () => {
    const store = read();
    delete store[refKey];
    write(store);
    setText('');
    setSaved(false);
    setStatus('Entry deleted from this device.');
  };

  const exportAll = () => {
    const store = read();
    const body = Object.entries(store)
      .map(([k, e]) => `${k}\n${e.at}\n${e.question}\n\n${e.text}\n`)
      .join('\n---\n\n');
    if (!body) {
      setStatus('Nothing to export yet.');
      return;
    }
    const url = URL.createObjectURL(new Blob([body], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dharma-granth-private-reflections.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    setStatus('Exported to a text file on your device.');
  };

  const btn = 'focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition';

  return (
    <section aria-labelledby={`${fieldId}-h`} className="understand-fade rounded-2xl border border-violet-500/30 bg-violet-50/60 p-4 dark:bg-violet-950/20 sm:p-5">
      <h3 id={`${fieldId}-h`} className="font-serif text-base font-bold text-dharma-text">
        <span data-bi="en">Pause and think</span> <span lang="hi" data-bi="hi" data-bi-lead className="font-devanagari text-sm font-semibold text-dharma-muted">रुकें और सोचें</span>
      </h3>
      <p className="mt-2 text-lg leading-snug text-dharma-text">{question}</p>
      {questionHi && <p lang="hi" className="mt-1 font-devanagari text-base text-dharma-muted">{questionHi}</p>}

      {mode === 'idle' && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => setMode('write')} className={`${btn} border-violet-700 bg-violet-700 text-white hover:bg-violet-800`}>
            Write privately{saved ? ' (edit)' : ''}
          </button>
          <button type="button" onClick={() => setMode('quiet')} className={`${btn} border-dharma-border bg-dharma-card text-dharma-text hover:border-violet-500`}>
            Think quietly
          </button>
        </div>
      )}

      {mode === 'quiet' && (
        <div className="mt-4">
          <p className="text-sm text-dharma-muted">Take as long as you like. Nothing is recorded.</p>
          <button type="button" onClick={() => setMode('idle')} className={`${btn} mt-3 border-dharma-border bg-dharma-card text-dharma-text`}>
            Done
          </button>
        </div>
      )}

      {mode === 'write' && (
        <div className="mt-4">
          <label htmlFor={fieldId} className="sr-only">Your private reflection on {reference}</label>
          <textarea
            id={fieldId}
            value={text}
            rows={5}
            maxLength={2000}
            onChange={(e) => setText(e.target.value)}
            className="w-full resize-y rounded-xl border border-dharma-border bg-dharma-bg p-3 text-base text-dharma-text outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/25"
          />
          <p className="mt-2 flex items-start gap-2 text-sm text-dharma-muted">
            <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Stored only in this browser. It is never uploaded or published, and no account is needed. Clearing site data removes it.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={save} className={`${btn} border-violet-700 bg-violet-700 text-white hover:bg-violet-800`}>Save on this device</button>
            <button type="button" onClick={exportAll} className={`${btn} border-dharma-border bg-dharma-card text-dharma-text`}>
              <Download className="h-4 w-4" aria-hidden="true" /> Export all
            </button>
            <button type="button" onClick={remove} disabled={!saved && !text} className={`${btn} border-dharma-border bg-dharma-card text-dharma-text disabled:opacity-50`}>
              <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
            </button>
            <button type="button" onClick={() => setMode('idle')} className={`${btn} border-transparent text-dharma-muted`}>Close</button>
          </div>
        </div>
      )}

      <p role="status" aria-live="polite" className={`mt-2 min-h-[1.25rem] text-sm ${storageOk ? 'text-dharma-muted' : 'font-semibold text-rose-800 dark:text-rose-300'}`}>
        {status}
      </p>
    </section>
  );
}
