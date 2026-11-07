'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, Lock, Trash2, Wifi, WifiOff } from 'lucide-react';
import { RecommendationCards } from '@/app/components/study/RecommendationCards';
import { BackupRestore } from '@/app/components/BackupRestore';
import { HistoryControls } from './HistoryControls';
import { SavedCollections } from './SavedCollections';
import { daysAgo } from '@/lib/format';
import { clearOwnData } from '@/lib/backup';
import { readRecentChapters, type ChapterVisit } from '@/lib/reading-history';
import { READING_JOURNEYS } from '@/data/reading-journeys';
import { WeeklySummary } from './WeeklySummary';
import { WeeklyGoal } from './WeeklyGoal';
import { Reminders } from './Reminders';
import { SavedConcepts } from './SavedConcepts';
import { StorageInfo } from './StorageInfo';
import { useConnectivity } from '@/lib/useConnectivity';
import { readHref } from '@/lib/verse-paths';

const NOTES_KEY = 'dharma.notes';
const QUEUE_KEY = 'dharma.desk.queue';
const PIN_KEY = 'dharma.desk.pin';
const RECENT_KEY = 'dharma.recentChapters';
const JOURNEYS_KEY = 'dharma.journeys.v1';
const UNLOCK_KEY = 'dharma.desk.unlocked';

interface Note { scriptureId: string; chapterId: number; verseId: number | string; text: string; updatedAt: string }
interface QueueItem { href: string; label: string }
interface PinRecord { salt: string; hash: string }

function getJSON<T>(key: string, fallback: T): T {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(key) ?? 'null');
    return (v ?? fallback) as T;
  } catch {
    return fallback;
  }
}
function setJSON(key: string, value: unknown): boolean {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}

async function hashPin(pin: string, salt: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${salt}:${pin}`));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

const verseHref = (s: { scriptureId: string; chapterId?: number; verseId: number | string }) =>
  readHref(s.scriptureId, s.chapterId ?? 1, s.verseId);

function Section({ id, title, titleHi, children }: { id: string; title: string; titleHi: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
      <h2 id={id} className="font-serif text-xl font-bold text-dharma-text">{title} <span lang="hi" className="font-devanagari text-base font-normal text-dharma-muted">· {titleHi}</span></h2>
      <div className="mt-3 text-sm">{children}</div>
    </section>
  );
}

const small = 'focus-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-lg border border-dharma-border px-3 text-sm font-semibold text-dharma-text hover:border-saffron-400';
const empty = (text: string) => <p className="text-dharma-muted">{text}</p>;

export function DeskClient() {
  const [ready, setReady] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [recent, setRecent] = useState<ChapterVisit[]>([]);
  const [journeyProgress, setJourneyProgress] = useState<Record<string, string[]>>({});
  const online = useConnectivity();
  const [cached, setCached] = useState<number | null>(null);
  const [pin, setPin] = useState<PinRecord | null>(null);
  const [locked, setLocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinMsg, setPinMsg] = useState('');
  const [newPin, setNewPin] = useState('');
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    setNotes(getJSON<Note[]>(NOTES_KEY, []));
    setQueue(getJSON<QueueItem[]>(QUEUE_KEY, []));
    setRecent(readRecentChapters());
    setJourneyProgress(getJSON<Record<string, string[]>>(JOURNEYS_KEY, {}));
    const p = getJSON<PinRecord | null>(PIN_KEY, null);
    setPin(p);
    let unlocked = false;
    try { unlocked = sessionStorage.getItem(UNLOCK_KEY) === '1'; } catch { /* locked until PIN entered */ }
    setLocked(Boolean(p) && !unlocked);
  }, []);

  useEffect(() => {
    load();
    setReady(true);
    if ('caches' in window) {
      caches.keys()
        .then((names) => Promise.all(names.map((n) => caches.open(n).then((c) => c.keys()))))
        .then((all) => setCached(all.reduce((n, k) => n + k.length, 0)))
        .catch(() => setCached(null));
    }
  }, [load]);

  const flash = (m: string) => setMsg(m);

  /* ── records ── */
  const removeNote = (n: Note) => {
    const next = notes.filter((x) => !(x.scriptureId === n.scriptureId && x.chapterId === n.chapterId && String(x.verseId) === String(n.verseId)));
    setNotes(next);
    setJSON(NOTES_KEY, next);
    flash('Note deleted');
  };
  const saveQueue = (next: QueueItem[]) => { setQueue(next); setJSON(QUEUE_KEY, next); };
  const addToQueue = (item: QueueItem) => {
    if (queue.some((q) => q.href === item.href)) return flash('Already in your reading queue');
    saveQueue([...queue, item]);
    flash('Added to reading queue');
  };
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= queue.length) return;
    const next = [...queue];
    [next[i], next[j]] = [next[j], next[i]];
    saveQueue(next);
  };
  const removeRecent = (r: ChapterVisit) => {
    const next = recent.filter((x) => x.scriptureId !== r.scriptureId);
    setRecent(next);
    setJSON(RECENT_KEY, next);
  };
  const clearJourney = (id: string) => {
    const next = { ...journeyProgress };
    delete next[id];
    setJourneyProgress(next);
    setJSON(JOURNEYS_KEY, next);
    flash('Journey progress cleared');
  };

  /* ── PIN: a privacy screen on this page, not encryption ── */
  const savePin = async () => {
    if (!/^\d{4,8}$/.test(newPin)) return setPinMsg('Use 4 to 8 digits.');
    try {
      const salt = crypto.getRandomValues(new Uint32Array(2)).join('-');
      const rec = { salt, hash: await hashPin(newPin, salt) };
      setJSON(PIN_KEY, rec);
      setPin(rec);
      setNewPin('');
      setPinMsg('PIN set. The desk will ask for it in a new session.');
      try { sessionStorage.setItem(UNLOCK_KEY, '1'); } catch { /* ignore */ }
    } catch {
      setPinMsg('This browser cannot set a PIN.');
    }
  };
  const unlock = async () => {
    if (pin && (await hashPin(pinInput, pin.salt)) === pin.hash) {
      try { sessionStorage.setItem(UNLOCK_KEY, '1'); } catch { /* ignore */ }
      setLocked(false);
      setPinInput('');
      setPinMsg('');
    } else {
      setPinMsg('That PIN does not match.');
    }
  };
  const removePin = () => {
    try { localStorage.removeItem(PIN_KEY); sessionStorage.removeItem(UNLOCK_KEY); } catch { /* ignore */ }
    setPin(null);
    setPinMsg('PIN removed.');
  };

  const clearAll = () => {
    if (!window.confirm('Delete everything stored by Dharma Granth in this browser (saved verses, notes, queue, journeys, settings, Sadhana)? This cannot be undone.\n\nBack up first if you may want it again.')) return;
    const n = clearOwnData();
    load();
    flash(`${n} stored items deleted.`);
  };

  if (!ready) return (
    <main id="main" className="mx-auto max-w-3xl space-y-5 px-4 py-10 sm:px-6">
      <header>
        <h1 className="font-serif text-3xl font-bold text-dharma-text">My Study Desk</h1>
        <p lang="hi" className="font-devanagari text-lg text-dharma-muted">मेरा अध्ययन-पटल</p>
        <p className="mt-2 text-sm text-dharma-muted">Your private reading notes, saved verses and study progress, stored only in this browser.</p>
      </header>
      <p role="status" className="text-sm text-dharma-muted">Loading your study desk…</p>
    </main>
  );

  const activeJourneys = READING_JOURNEYS.filter((j) => (journeyProgress[j.id] ?? []).length > 0);

  return (
    <main id="main" className="mx-auto max-w-3xl space-y-5 px-4 py-10 sm:px-6">
      <header>
        <h1 className="font-serif text-3xl font-bold text-dharma-text">My Study Desk</h1>
        <p lang="hi" className="font-devanagari text-lg text-dharma-muted">मेरा अध्ययन-पटल</p>
        <p className="mt-2 text-sm text-dharma-muted">
          <strong className="text-dharma-text">Stored only in this browser.</strong> No account, nothing uploaded. Clearing your browser data, or using another device, will not carry this over unless you export a backup. Notes are never shared by the share buttons.
        </p>
        {online !== null ? (
          <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-dharma-border px-3 py-1 text-sm text-dharma-muted" role="status">
            {online ? <Wifi className="h-3.5 w-3.5" aria-hidden="true" /> : <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />}
            {online ? 'Online' : 'Offline mode active: your saved items are still here.'}
          </p>
        ) : null}
      </header>

      {msg && <p role="status" aria-live="polite" className="rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-950 dark:bg-sky-950/30 dark:text-sky-100">{msg}</p>}

      {locked ? (
        <section aria-labelledby="lock-h" className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
          <h2 id="lock-h" className="flex items-center gap-2 font-serif text-xl font-bold text-dharma-text"><Lock className="h-5 w-5" aria-hidden="true" /> Enter your PIN</h2>
          <form onSubmit={(e) => { e.preventDefault(); void unlock(); }} className="mt-3 flex flex-wrap items-end gap-2">
            <label className="text-sm font-semibold text-dharma-muted">PIN
              <input type="password" inputMode="numeric" autoComplete="off" value={pinInput} onChange={(e) => setPinInput(e.target.value)} className="mt-1 block min-h-[44px] w-40 rounded-xl border border-dharma-border bg-dharma-bg px-3 text-dharma-text" />
            </label>
            <button type="submit" className="focus-ring min-h-[44px] rounded-xl bg-saffron-700 px-5 text-sm font-semibold text-white">Unlock</button>
          </form>
          {pinMsg && <p role="status" className="mt-2 text-sm text-dharma-muted">{pinMsg}</p>}
          <p className="mt-3 text-sm text-dharma-muted">Forgot it? Clearing this site’s data in your browser settings removes the PIN and everything saved here.</p>
        </section>
      ) : (
        <>
          <RecommendationCards />

          <WeeklySummary onChange={load} />
          <WeeklyGoal />

          <Section id="saved-h" title="Saved verses" titleHi="सहेजे श्लोक">
            <SavedCollections onChange={load} onQueue={addToQueue} />
          </Section>

          <Section id="concepts-h" title="Saved concepts" titleHi="सहेजी अवधारणाएँ">
            <SavedConcepts />
          </Section>

          <Section id="notes-h" title="Personal notes" titleHi="निजी टिप्पणियाँ">
            {notes.length === 0 ? empty('No notes yet. Use Note on any verse; notes stay on this device.') : (
              <ul className="space-y-2">
                {notes.map((n) => (
                  <li key={`${n.scriptureId}-${n.chapterId}-${n.verseId}`} className="flex items-start gap-2 rounded-xl border border-dharma-border p-2">
                    <div className="min-w-0 flex-1">
                      <Link href={verseHref(n)} className="font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-300">{n.scriptureId} {n.chapterId}.{n.verseId}</Link>
                      <p className="whitespace-pre-line text-dharma-text">{n.text}</p>
                    </div>
                    <button type="button" onClick={() => removeNote(n)} aria-label={`Delete note on ${n.scriptureId} ${n.chapterId}.${n.verseId}`} className={small}><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section id="queue-h" title="Reading queue" titleHi="पठन-सूची">
            {queue.length === 0 ? empty('Your queue is empty. Add a saved verse with Queue.') : (
              <ol className="space-y-2">
                {queue.map((q, i) => (
                  <li key={q.href} className="flex items-center gap-1 rounded-xl border border-dharma-border p-2">
                    <Link href={q.href} className="min-w-0 flex-1 font-semibold text-dharma-text">{i + 1}. {q.label}</Link>
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${q.label} up`} className={small}><ArrowUp className="h-4 w-4" aria-hidden="true" /></button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === queue.length - 1} aria-label={`Move ${q.label} down`} className={small}><ArrowDown className="h-4 w-4" aria-hidden="true" /></button>
                    <button type="button" onClick={() => saveQueue(queue.filter((x) => x.href !== q.href))} aria-label={`Remove ${q.label} from queue`} className={small}><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
                  </li>
                ))}
              </ol>
            )}
          </Section>

          <Section id="recent-h" title="Recently viewed" titleHi="हाल में देखा">
            {recent.length === 0 ? empty('Nothing yet. Chapters you open appear here.') : (
              <ul className="space-y-2">
                {recent.map((r) => (
                  <li key={r.scriptureId} className="flex items-center gap-2 rounded-xl border border-dharma-border p-2">
                    <Link href={readHref(r.scriptureId, r.chapterId, r.verseId)} className="min-w-0 flex-1">
                      <span className="font-semibold text-dharma-text">Continue {r.scriptureTitle}</span>
                      <span className="block font-normal text-dharma-muted">
                        Chapter {r.chapterId}{r.verseId ? `, verse ${r.verseId}` : ''} · last opened {daysAgo(r.readAt)}
                      </span>
                    </Link>
                    <button type="button" onClick={() => removeRecent(r)} aria-label={`Forget ${r.scriptureTitle}`} className={small}><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
                  </li>
                ))}
              </ul>
            )}
            <HistoryControls onChange={load} />
          </Section>

          <Section id="journeys-h" title="Active journeys" titleHi="चालू यात्राएँ">
            {activeJourneys.length === 0 ? (
              <p className="text-dharma-muted">None yet. <Link href="/learn/journeys/" className="underline underline-offset-2">Browse reading journeys</Link>.</p>
            ) : (
              <ul className="space-y-2">
                {activeJourneys.map((j) => (
                  <li key={j.id} className="flex items-center gap-2 rounded-xl border border-dharma-border p-2">
                    <Link href={`/learn/journeys/${j.id}`} className="min-w-0 flex-1">
                      <span className="font-semibold text-dharma-text">{j.title}</span>
                      <span className="block text-dharma-muted">You have completed {(journeyProgress[j.id] ?? []).length} of {j.lessons.length} readings.</span>
                    </Link>
                    <button type="button" onClick={() => clearJourney(j.id)} className={small}>Clear</button>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section id="reminders-h" title="Reminders" titleHi="स्मरण">
            <Reminders />
          </Section>

          <Section id="storage-h" title="Storage information" titleHi="संग्रहण की जानकारी">
            <StorageInfo />
          </Section>

          <Section id="offline-h" title="Offline and downloads" titleHi="ऑफ़लाइन">
            <p className="text-dharma-muted">
              {cached === null
                ? 'Offline storage is not available in this browser.'
                : cached === 0
                  ? 'No pages are saved for offline use yet. Pages appear here only when this browser has stored them for offline use.'
                  : `${cached} files are available offline in this browser.`}
            </p>
          </Section>

          <Section id="settings-h" title="Language and reader settings" titleHi="भाषा एवं सेटिंग">
            <p className="text-dharma-muted">Reader settings (text size, language, depth, focus mode) are saved in this browser. Change them from the settings button on any verse, or <Link href="/learn/start/" className="underline underline-offset-2">redo Start My Journey</Link>.</p>
            <BackupRestore />
          </Section>

          <Section id="pin-h" title="Optional PIN" titleHi="वैकल्पिक पिन">
            <p className="text-dharma-muted">A PIN hides this page from casual viewing on a shared device. It is a privacy screen, not encryption: your data is still stored in this browser.</p>
            {pin ? (
              <button type="button" onClick={removePin} className={`${small} mt-2`}>Remove PIN</button>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); void savePin(); }} className="mt-2 flex flex-wrap items-end gap-2">
                <label className="text-sm font-semibold text-dharma-muted">New PIN (4 to 8 digits)
                  <input type="password" inputMode="numeric" autoComplete="new-password" value={newPin} onChange={(e) => setNewPin(e.target.value)} className="mt-1 block min-h-[44px] w-40 rounded-xl border border-dharma-border bg-dharma-bg px-3 text-dharma-text" />
                </label>
                <button type="submit" className="focus-ring min-h-[44px] rounded-xl bg-saffron-700 px-5 text-sm font-semibold text-white">Set PIN</button>
              </form>
            )}
            {pinMsg && <p role="status" className="mt-2 text-dharma-muted">{pinMsg}</p>}
          </Section>

          <div className="flex justify-end">
            <button type="button" onClick={clearAll} className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-rose-300 px-4 text-sm font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-300 dark:hover:bg-rose-950/30">
              <Trash2 className="h-4 w-4" aria-hidden="true" /> Clear all my data
            </button>
          </div>
        </>
      )}
    </main>
  );
}
