'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { readSavedConcepts, toggleSavedConcept } from '@/lib/saved-concepts';

const LABELS: Record<string, string> = {
  dharma: 'Dharma', karma: 'Karma', atman: 'Atman', brahman: 'Brahman', moksha: 'Moksha', bhakti: 'Bhakti', jnana: 'Jnana',
  yoga: 'Yoga', maya: 'Maya', ahimsa: 'Ahimsa', samsara: 'Samsara', vairagya: 'Vairagya', yajna: 'Yajna',
};

/** Concepts saved from their pages. Stored only in this browser; each can be removed. */
export function SavedConcepts() {
  const [ids, setIds] = useState<string[] | null>(null);
  const [msg, setMsg] = useState('');
  useEffect(() => setIds(readSavedConcepts()), []);
  if (ids === null) return null;
  if (ids.length === 0) {
    return <p className="text-dharma-muted">No saved concepts yet. Use Save concept on a <Link href="/concepts" className="underline underline-offset-2">concept page</Link>.</p>;
  }
  return (
    <div>
      <ul className="space-y-2">
        {ids.map((id) => (
          <li key={id} className="flex items-center gap-2 rounded-xl border border-dharma-border p-2">
            <Link href={`/concepts/${id}`} className="min-w-0 flex-1 font-semibold text-dharma-text">{LABELS[id] ?? id}</Link>
            <button
              type="button"
              aria-label={`Remove ${LABELS[id] ?? id} from saved concepts`}
              onClick={() => {
                const next = toggleSavedConcept(id);
                if (next === null) return setMsg('Your browser blocked storage, so the change was not saved.');
                setIds(next);
                setMsg(`${LABELS[id] ?? id} removed.`);
              }}
              className="focus-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-dharma-border text-dharma-text hover:border-saffron-400"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      <p role="status" aria-live="polite" className="mt-1 min-h-[1.25rem] text-sm text-dharma-muted">{msg}</p>
    </div>
  );
}
