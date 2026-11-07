'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Trash2, WifiOff } from 'lucide-react';
import { formatBytes, readManifest, removeScripture, totalBytes, type OfflineManifest } from '@/lib/offline-scriptures';
import { useConnectivity } from '@/lib/useConnectivity';

/** Lists the scriptures saved for offline reading, their total size, and a remove button for each. */
export function OfflineLibraryManager() {
  const [manifest, setManifest] = useState<OfflineManifest>({});
  const online = useConnectivity();
  const [quota, setQuota] = useState('');

  const refresh = useCallback(() => setManifest(readManifest()), []);

  useEffect(() => {
    refresh();
    window.addEventListener('dharma-offline-changed', refresh);
    navigator.storage?.estimate?.().then((e) => {
      if (e.usage != null && e.quota != null) setQuota(`${formatBytes(e.usage)} of about ${formatBytes(e.quota)} used by this site`);
    });
    return () => {
      window.removeEventListener('dharma-offline-changed', refresh);
    };
  }, [refresh]);

  const ids = Object.keys(manifest).sort((a, b) => manifest[a].title.localeCompare(manifest[b].title));

  return (
    <section aria-labelledby="offline-heading" className="mt-8">
      {online === false && (
        <p role="status" className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          <WifiOff className="h-4 w-4" aria-hidden="true" /> You are offline. Saved scriptures still open.
        </p>
      )}
      <h2 id="offline-heading" className="font-serif text-xl font-bold text-dharma-text">
        {ids.length === 0 ? 'Nothing saved yet' : `${ids.length} saved · ${formatBytes(totalBytes(manifest))}`}
      </h2>
      {quota ? <p className="mt-1 text-xs text-dharma-muted">{quota}</p> : null}

      {ids.length === 0 ? (
        <p className="mt-3 text-sm text-dharma-muted">
          Open a scripture and choose &ldquo;Available offline&rdquo; in its header. <Link href="/scriptures/" className="font-semibold underline">Browse the library</Link>.
        </p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {ids.map((id) => {
            const e = manifest[id];
            return (
              <li key={id} className="flex items-center justify-between gap-3 rounded-2xl border border-dharma-border bg-dharma-card p-4">
                <div className="min-w-0">
                  <Link href={`/scripture/${id}/`} className="font-semibold text-dharma-text hover:underline">
                    {e.title}
                  </Link>
                  <p className="text-xs text-dharma-muted">
                    {e.chapters} chapters · {formatBytes(e.bytes)} · saved {new Date(e.savedAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void removeScripture(id).then(refresh)}
                  className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full border border-dharma-border px-3.5 text-sm font-semibold text-dharma-text transition hover:border-red-400 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Remove offline copy
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
