/**
 * Client-Side IndexedDB Scripture Store for Dharma Granth (dharmagranth.in)
 * Database Name: dharma_granth_db_v1
 * 
 * Zero-dependency, lightweight Promise wrapper for client-side persistence:
 * - verses: Keyed by canonical ID, indexed by scriptureSlug, [scriptureSlug, chapter], concepts, speaker, chandas
 * - offline_scriptures: Downloaded manifests, version hashes, byte sizes
 * - user_manana: Bookmarked verses, personal notes, highlight spans, custom study tags
 *
 * Hydrates chapter shards in background for <5ms sub-millisecond repeat access.
 */

export interface StoredVerse {
  id: string; // e.g. "bhagavadgita:2:47"
  scriptureSlug: string;
  chapter: number;
  verseNum: string | number;
  sanskrit: string;
  transliteration?: string;
  translation?: string;
  hindi?: string;
  wordMeaning?: string;
  padaccheda?: string;
  commentary?: string;
  explanation?: string;
  science?: string;
  lifeLesson?: string;
  speaker?: string;
  chandas?: string;
  concepts?: string[];
  keywords?: string[];
  cachedAt: number;
}

export interface StoredOfflineScripture {
  scriptureSlug: string;
  title: string;
  titleSanskrit: string;
  versionHash: string;
  byteSize: number;
  chapterCount: number;
  verseCount: number;
  downloadedAt: number;
  manifest?: unknown;
}

export interface StoredMananaItem {
  id: string; // e.g. "note:bhagavadgita:2:47" or "bm:bhagavadgita:2:47"
  type: 'bookmark' | 'note' | 'highlight' | 'tag';
  scriptureSlug: string;
  chapter: number;
  verseNum: string | number;
  content?: string; // Note text or highlight string
  highlightColor?: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

const DB_NAME = 'dharma_granth_db_v1';
const DB_VERSION = 2;

let dbPromise: Promise<IDBDatabase> | null = null;

function isIndexedDBAvailable(): boolean {
  return typeof window !== 'undefined' && typeof indexedDB !== 'undefined';
}

/**
 * Open or retrieve the cached IndexedDB database connection.
 */
export function getGranthDB(): Promise<IDBDatabase> {
  if (!isIndexedDBAvailable()) {
    return Promise.reject(new Error('IndexedDB is not supported in this environment'));
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 1. verses object store
      if (!db.objectStoreNames.contains('verses')) {
        const verseStore = db.createObjectStore('verses', { keyPath: 'id' });
        verseStore.createIndex('scriptureSlug', 'scriptureSlug', { unique: false });
        verseStore.createIndex('scripture_chapter', ['scriptureSlug', 'chapter'], { unique: false });
        verseStore.createIndex('concepts', 'concepts', { unique: false, multiEntry: true });
        verseStore.createIndex('speaker', 'speaker', { unique: false });
        verseStore.createIndex('chandas', 'chandas', { unique: false });
      }

      // 2. offline_scriptures object store
      if (!db.objectStoreNames.contains('offline_scriptures')) {
        db.createObjectStore('offline_scriptures', { keyPath: 'scriptureSlug' });
      }

      // 3. user_manana object store (legacy v1)
      if (!db.objectStoreNames.contains('user_manana')) {
        const mananaStore = db.createObjectStore('user_manana', { keyPath: 'id' });
        mananaStore.createIndex('type', 'type', { unique: false });
        mananaStore.createIndex('scriptureSlug', 'scriptureSlug', { unique: false });
        mananaStore.createIndex('scripture_chapter_verse', ['scriptureSlug', 'chapter', 'verseNum'], { unique: false });
        mananaStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
        mananaStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      // 4. journal_entries (v2)
      if (!db.objectStoreNames.contains('journal_entries')) {
        const jStore = db.createObjectStore('journal_entries', { keyPath: 'id' });
        jStore.createIndex('createdAt', 'createdAt', { unique: false });
        jStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        jStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
        jStore.createIndex('status', 'status', { unique: false });
      }

      // 5. personal_annotations (v2)
      if (!db.objectStoreNames.contains('personal_annotations')) {
        const aStore = db.createObjectStore('personal_annotations', { keyPath: 'id' });
        aStore.createIndex('scriptureSlug', 'reference.scriptureId', { unique: false });
        aStore.createIndex('scripture_chapter', ['reference.scriptureId', 'reference.chapterId'], { unique: false });
        aStore.createIndex('scripture_chapter_verse', ['reference.scriptureId', 'reference.chapterId', 'reference.verseId'], { unique: false });
        aStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        aStore.createIndex('status', 'status', { unique: false });
      }

      // 6. study_collections (v2)
      if (!db.objectStoreNames.contains('study_collections')) {
        const cStore = db.createObjectStore('study_collections', { keyPath: 'id' });
        cStore.createIndex('name', 'name', { unique: false });
        cStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      // 7. saved_verses (v2)
      if (!db.objectStoreNames.contains('saved_verses')) {
        const sStore = db.createObjectStore('saved_verses', { keyPath: 'id' });
        sStore.createIndex('scriptureSlug', 'reference.scriptureId', { unique: false });
        sStore.createIndex('collectionIds', 'collectionIds', { unique: false, multiEntry: true });
        sStore.createIndex('savedAt', 'savedAt', { unique: false });
      }

      // 8. reading_history (v2)
      if (!db.objectStoreNames.contains('reading_history')) {
        const hStore = db.createObjectStore('reading_history', { keyPath: 'id' });
        hStore.createIndex('scriptureSlug', 'reference.scriptureId', { unique: false });
        hStore.createIndex('visitedAt', 'visitedAt', { unique: false });
      }

      // 9. reading_positions (v2)
      if (!db.objectStoreNames.contains('reading_positions')) {
        const pStore = db.createObjectStore('reading_positions', { keyPath: 'scriptureId' });
        pStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      // 10. offline_packs (v2)
      if (!db.objectStoreNames.contains('offline_packs')) {
        db.createObjectStore('offline_packs', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      dbPromise = null;
      reject(request.error || new Error('Failed to open dharma_granth_db_v1'));
    };

    request.onblocked = () => {
      console.warn('[dharma-idb] Database open blocked by another tab');
    };
  });

  return dbPromise;
}

/**
 * Save verses from a loaded chapter shard into IndexedDB.
 */
export async function saveChapterVersesToDB(
  scriptureSlug: string,
  chapter: number,
  verses: Array<{
    number: number | string;
    sanskrit?: string;
    transliteration?: string;
    translation?: string;
    hindi?: string;
    wordMeaning?: string;
    padaccheda?: string;
    commentary?: string;
    explanation?: string;
    science?: string;
    lifeLesson?: string;
    speaker?: string;
    chandas?: string;
    keywords?: string[];
    concepts?: string[];
  }>
): Promise<void> {
  if (!isIndexedDBAvailable()) return;

  try {
    const db = await getGranthDB();
    const tx = db.transaction('verses', 'readwrite');
    const store = tx.objectStore('verses');
    const now = Date.now();

    for (const v of verses) {
      const id = `${scriptureSlug}:${chapter}:${v.number}`;
      const record: StoredVerse = {
        id,
        scriptureSlug,
        chapter,
        verseNum: v.number,
        sanskrit: v.sanskrit ?? '',
        transliteration: v.transliteration,
        translation: v.translation,
        hindi: v.hindi,
        wordMeaning: v.wordMeaning,
        padaccheda: v.padaccheda,
        commentary: v.commentary,
        explanation: v.explanation,
        science: v.science,
        lifeLesson: v.lifeLesson,
        speaker: v.speaker,
        chandas: v.chandas,
        concepts: v.concepts ?? v.keywords ?? [],
        keywords: v.keywords,
        cachedAt: now,
      };
      store.put(record);
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[dharma-idb] Failed to cache chapter verses to IndexedDB:', err);
  }
}

/**
 * Retrieve cached chapter verses from IndexedDB for sub-5ms hydration.
 */
export async function getCachedChapterVersesFromDB(
  scriptureSlug: string,
  chapter: number
): Promise<StoredVerse[] | null> {
  if (!isIndexedDBAvailable()) return null;

  try {
    const db = await getGranthDB();
    const tx = db.transaction('verses', 'readonly');
    const store = tx.objectStore('verses');
    const index = store.index('scripture_chapter');
    const query = IDBKeyRange.only([scriptureSlug, chapter]);

    return new Promise((resolve) => {
      const request = index.getAll(query);
      request.onsuccess = () => {
        const results = request.result as StoredVerse[];
        if (results && results.length > 0) {
          // Sort numerically by verse number
          results.sort((a, b) => {
            const numA = Number(a.verseNum);
            const numB = Number(b.verseNum);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return String(a.verseNum).localeCompare(String(b.verseNum));
          });
          resolve(results);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Retrieve a single verse by canonical slug, chapter, and verse number.
 */
export async function getVerseFromDB(
  scriptureSlug: string,
  chapter: number,
  verseNum: string | number
): Promise<StoredVerse | null> {
  if (!isIndexedDBAvailable()) return null;

  try {
    const db = await getGranthDB();
    const tx = db.transaction('verses', 'readonly');
    const store = tx.objectStore('verses');
    const id = `${scriptureSlug}:${chapter}:${verseNum}`;

    return new Promise((resolve) => {
      const request = store.get(id);
      request.onsuccess = () => resolve((request.result as StoredVerse) || null);
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Query cached verses across all scriptures matching a philosophical concept.
 */
export async function queryVersesByConceptFromDB(
  concept: string,
  limit = 20
): Promise<StoredVerse[]> {
  if (!isIndexedDBAvailable()) return [];

  try {
    const db = await getGranthDB();
    const tx = db.transaction('verses', 'readonly');
    const store = tx.objectStore('verses');
    const index = store.index('concepts');

    return new Promise((resolve) => {
      const request = index.getAll(IDBKeyRange.only(concept.toLowerCase()));
      request.onsuccess = () => {
        const results = (request.result as StoredVerse[]) || [];
        resolve(results.slice(0, limit));
      };
      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * Save an offline scripture manifest entry.
 */
export async function saveOfflineScriptureManifest(
  manifest: StoredOfflineScripture
): Promise<void> {
  if (!isIndexedDBAvailable()) return;

  const db = await getGranthDB();
  const tx = db.transaction('offline_scriptures', 'readwrite');
  tx.objectStore('offline_scriptures').put(manifest);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Check if a scripture is marked as downloaded offline.
 */
export async function isScriptureOffline(scriptureSlug: string): Promise<boolean> {
  if (!isIndexedDBAvailable()) return false;

  try {
    const db = await getGranthDB();
    const tx = db.transaction('offline_scriptures', 'readonly');
    const request = tx.objectStore('offline_scriptures').get(scriptureSlug);

    return new Promise((resolve) => {
      request.onsuccess = () => resolve(Boolean(request.result));
      request.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

/**
 * Retrieve all offline downloaded scripture manifests.
 */
export async function getAllOfflineScriptures(): Promise<StoredOfflineScripture[]> {
  if (!isIndexedDBAvailable()) return [];

  try {
    const db = await getGranthDB();
    const tx = db.transaction('offline_scriptures', 'readonly');
    const request = tx.objectStore('offline_scriptures').getAll();

    return new Promise((resolve) => {
      request.onsuccess = () => resolve((request.result as StoredOfflineScripture[]) || []);
      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * Save a personal study item (note, bookmark, highlight, tag) to user_manana.
 */
export async function saveMananaItem(item: StoredMananaItem): Promise<void> {
  if (!isIndexedDBAvailable()) return;

  const db = await getGranthDB();
  const tx = db.transaction('user_manana', 'readwrite');
  tx.objectStore('user_manana').put(item);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Retrieve all manana items for a specific verse.
 */
export async function getMananaForVerse(
  scriptureSlug: string,
  chapter: number,
  verseNum: string | number
): Promise<StoredMananaItem[]> {
  if (!isIndexedDBAvailable()) return [];

  try {
    const db = await getGranthDB();
    const tx = db.transaction('user_manana', 'readonly');
    const index = tx.objectStore('user_manana').index('scripture_chapter_verse');
    const request = index.getAll(IDBKeyRange.only([scriptureSlug, chapter, verseNum]));

    return new Promise((resolve) => {
      request.onsuccess = () => resolve((request.result as StoredMananaItem[]) || []);
      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * Retrieve all user manana items across the entire library (for sync / backup).
 */
export async function getAllMananaItems(): Promise<StoredMananaItem[]> {
  if (!isIndexedDBAvailable()) return [];

  try {
    const db = await getGranthDB();
    const tx = db.transaction('user_manana', 'readonly');
    const request = tx.objectStore('user_manana').getAll();

    return new Promise((resolve) => {
      request.onsuccess = () => resolve((request.result as StoredMananaItem[]) || []);
      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * Delete a manana item by its unique ID.
 */
export async function deleteMananaItem(id: string): Promise<void> {
  if (!isIndexedDBAvailable()) return;

  const db = await getGranthDB();
  const tx = db.transaction('user_manana', 'readwrite');
  tx.objectStore('user_manana').delete(id);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
