'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, PauseCircle, PlayCircle, Trash2, Upload } from 'lucide-react';
import { clearHistory, exportHistory, importHistory, isHistoryPaused, setHistoryPaused } from '@/lib/reading-history';

const MAX_BYTES = 1024 * 1024;
const btn =
  'focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-dharma-border bg-dharma-card px-3 text-sm font-semibold text-dharma-text hover:border-saffron-400';

/**
 * Controls for the reading history only: pause, export, import, clear.
 * The history holds chapters and the verse last open, never notes. `onChange`
 * lets the page re-read the list after an import or clear.
 */
export function HistoryControls({ onChange }: { onChange: () => void }) {
  const [paused, setPaused] = useState(false);
  const [msg, setMsg] = useState('');
  const file = useRef<HTMLInputElement>(null);

  useEffect(() => setPaused(isHistoryPaused()), []);

  const toggle = () => {
    const next = !paused;
    setHistoryPaused(next);
    setPaused(next);
    setMsg(next ? 'History paused. New reading is not recorded.' : 'History resumed.');
  };

  const download = () => {
    try {
      const url = URL.createObjectURL(new Blob([exportHistory()], { type: 'application/json' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `dharma-granth-reading-history-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setMsg('Reading history exported.');
    } catch {
      setMsg('Could not export: browser storage may be blocked.');
    }
  };

  const upload = async (f: File | undefined) => {
    if (!f) return;
    const reset = () => { if (file.current) file.current.value = ''; };
    if (f.size > MAX_BYTES) { setMsg('That file is too large to be a reading history.'); reset(); return; }
    if (!window.confirm('Add the chapters in this file to your reading history? Your current history is kept and merged.')) { reset(); return; }
    try {
      const n = await importHistory(await f.text());
      setMsg(`${n} ${n === 1 ? 'entry' : 'entries'} imported.`);
      onChange();
    } catch {
      setMsg('That is not a valid reading history file.');
    }
    reset();
  };

  const clear = () => {
    if (!window.confirm('Remove your whole reading history from this browser? Saved verses and notes are not affected.')) return;
    const n = clearHistory();
    setMsg(`${n} ${n === 1 ? 'entry' : 'entries'} removed.`);
    onChange();
  };

  return (
    <div className="mt-3 border-t border-dharma-border/60 pt-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={toggle} aria-pressed={paused} className={btn}>
          {paused ? <PlayCircle className="h-4 w-4" aria-hidden="true" /> : <PauseCircle className="h-4 w-4" aria-hidden="true" />}
          {paused ? 'Resume history' : 'Pause history'}
        </button>
        <button type="button" onClick={download} className={btn}><Download className="h-4 w-4" aria-hidden="true" /> Export history</button>
        <button type="button" onClick={() => file.current?.click()} className={btn}><Upload className="h-4 w-4" aria-hidden="true" /> Import history</button>
        <button type="button" onClick={clear} className={btn}><Trash2 className="h-4 w-4" aria-hidden="true" /> Clear history</button>
        <input ref={file} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => void upload(e.target.files?.[0])} />
      </div>
      {paused && <p className="mt-2 text-sm text-dharma-muted">History is paused. Your existing entries stay until you remove them.</p>}
      <p role="status" aria-live="polite" className="mt-1 min-h-[1.25rem] text-sm text-dharma-muted">{msg}</p>
    </div>
  );
}
