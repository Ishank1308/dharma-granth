'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, Download, Loader2 } from 'lucide-react';
import { formatBytes, offlineSupported, readManifest, removeScripture, saveScripture, type OfflineEntry } from '@/lib/offline-scriptures';

/** Hero-header button: save this scripture for offline reading, or remove the saved copy. */
export function OfflineScriptureToggle({ scriptureId, title }: { scriptureId: string; title: string }) {
  const [entry, setEntry] = useState<OfflineEntry | null>(null);
  const [busy, setBusy] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState('');
  const [supported, setSupported] = useState(false);

  const refresh = useCallback(() => setEntry(readManifest()[scriptureId] ?? null), [scriptureId]);

  useEffect(() => {
    setSupported(offlineSupported());
    refresh();
    window.addEventListener('dharma-offline-changed', refresh);
    return () => window.removeEventListener('dharma-offline-changed', refresh);
  }, [refresh]);

  if (!supported) return null;

  async function onClick() {
    setError('');
    try {
      if (entry) {
        await removeScripture(scriptureId);
      } else {
        setBusy({ done: 0, total: 1 });
        await saveScripture(scriptureId, title, (done, total) => setBusy({ done, total }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Saving failed.');
    } finally {
      setBusy(null);
      refresh();
    }
  }

  const label = busy ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span>Saving {Math.round((busy.done / busy.total) * 100)}%</span>
    </>
  ) : entry ? (
    <>
      <Check className="h-4 w-4" aria-hidden="true" />
      <span lang="hi" className="font-devanagari">ऑफ़लाइन सुरक्षित</span>
      <span>· Saved offline ({formatBytes(entry.bytes)}) · tap to remove</span>
    </>
  ) : (
    <>
      <Download className="h-4 w-4" aria-hidden="true" />
      <span lang="hi" className="font-devanagari">ऑफ़लाइन सहेजें</span>
      <span>· Available offline</span>
    </>
  );

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={onClick}
        disabled={busy !== null}
        aria-live="polite"
        className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-70"
      >
        {label}
      </button>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-amber-100">
          {error}
        </p>
      ) : null}
    </div>
  );
}
