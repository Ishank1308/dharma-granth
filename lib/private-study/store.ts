import { validateStudyRecord, verseKey } from './canonical';
import type { CanonicalVerseRef, StudyArchive, StudyRecord } from './types';

const DB_NAME = 'dharma-private-study';
const STORE = 'records';
const DB_VERSION = 1;

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Study storage request failed'));
  });
}

function transactionDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(tx.error ?? new Error('Study storage transaction aborted'));
    tx.onerror = () => reject(tx.error ?? new Error('Study storage transaction failed'));
  });
}

/** IndexedDB access is intentionally delayed until a browser calls the API. */
export function openStudyStore(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') return Promise.reject(new Error('Private study storage is unavailable'));
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const records = db.createObjectStore(STORE, { keyPath: 'id' });
        records.createIndex('verse', 'verseKey', { unique: false });
        records.createIndex('kind', 'kind', { unique: false });
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => db.close();
      resolve(db);
    };
    request.onerror = () => reject(request.error ?? new Error('Private study storage could not open'));
    request.onblocked = () => reject(new Error('Close other Dharma Granth tabs and try again'));
  });
}

type StoredRecord = StudyRecord & { verseKey: string };
function stored(record: StudyRecord): StoredRecord {
  const clean = validateStudyRecord(record);
  return { ...clean, verseKey: verseKey(clean.ref) };
}

export async function putStudyRecord(record: StudyRecord): Promise<void> {
  const value = stored(record);
  const db = await openStudyStore();
  try {
    const tx = db.transaction(STORE, 'readwrite');
    const done = transactionDone(tx);
    tx.objectStore(STORE).put(value);
    await done;
  } finally { db.close(); }
}

export async function deleteStudyRecord(id: string): Promise<void> {
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id)) throw new Error('Invalid record id');
  const db = await openStudyStore();
  try {
    const tx = db.transaction(STORE, 'readwrite');
    const done = transactionDone(tx);
    tx.objectStore(STORE).delete(id);
    await done;
  } finally { db.close(); }
}

export async function listStudyRecords(ref?: CanonicalVerseRef): Promise<StudyRecord[]> {
  const key = ref ? verseKey(ref) : undefined;
  const db = await openStudyStore();
  try {
    const tx = db.transaction(STORE, 'readonly');
    const done = transactionDone(tx);
    const source = key ? tx.objectStore(STORE).index('verse') : tx.objectStore(STORE);
    const rows = await requestResult(source.getAll(key) as IDBRequest<StoredRecord[]>);
    await done;
    return rows.map(validateStudyRecord);
  } finally { db.close(); }
}

export async function exportStudyArchive(): Promise<StudyArchive> {
  return { format: 'dharma-private-study', version: 1, exportedAt: new Date().toISOString(), records: await listStudyRecords() };
}

/** Validate the entire archive before changing any record. Import merges by id. */
export async function importStudyArchive(raw: string): Promise<number> {
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object') throw new Error('Invalid study archive');
  const archive = parsed as Partial<StudyArchive>;
  if (archive.format !== 'dharma-private-study' || archive.version !== 1 || !Array.isArray(archive.records)) {
    throw new Error('Unsupported study archive');
  }
  const rows = archive.records.map(stored);
  const ids = new Set(rows.map((row) => row.id));
  if (ids.size !== rows.length) throw new Error('Duplicate study record ids');
  const db = await openStudyStore();
  try {
    const tx = db.transaction(STORE, 'readwrite');
    const done = transactionDone(tx);
    for (const row of rows) tx.objectStore(STORE).put(row);
    await done;
  } finally { db.close(); }
  return rows.length;
}
