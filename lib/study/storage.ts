/**
 * High-Performance Client-Side Personal Study Storage Repository
 * Built on top of IndexedDB v2 (dharma_granth_db_v1 v2) with fallback buffering.
 * 
 * 100% Client-Side, Local-First, Zero-Server.
 */

import { getGranthDB } from '@/lib/db/granth-indexeddb';
import type {
  JournalEntry,
  PersonalAnnotation,
  SavedVerse,
  PersonalCollection,
  ReadingPosition,
  ReadingHistoryEntry,
  OfflineReadingPack,
  DharmaStudyBackupV2,
} from './types';

// Default Builtin Collections
export const DEFAULT_STUDY_COLLECTIONS: PersonalCollection[] = [
  {
    id: 'read-later',
    name: 'Read Later',
    nameHi: 'बाद में पढ़ें',
    description: 'Verses queued for deeper contemplation.',
    colourToken: 'from-amber-500 to-orange-500',
    icon: 'clock',
    isBuiltin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'favourites',
    name: 'Favourites',
    nameHi: 'प्रिय श्लोक',
    description: 'Verses that deeply illuminate your inner journey.',
    colourToken: 'from-rose-500 to-pink-500',
    icon: 'heart',
    isBuiltin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'daily-reflection',
    name: 'Daily Contemplation',
    nameHi: 'नित्य मनन',
    description: 'Core verses for daily svādhyāya meditation.',
    colourToken: 'from-saffron-500 to-amber-600',
    icon: 'sun',
    isBuiltin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'duty-and-courage',
    name: 'Duty & Courage',
    nameHi: 'कर्तव्य व धैर्य',
    description: 'Verses on svadharma, resolute action, and steadfastness.',
    colourToken: 'from-emerald-500 to-teal-600',
    icon: 'shield',
    isBuiltin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'moksha-and-peace',
    name: 'Moksha & Inner Peace',
    nameHi: 'मोक्ष व शांति',
    description: 'Verses on detachment, non-duality, and transcendental freedom.',
    colourToken: 'from-indigo-500 to-purple-600',
    icon: 'sparkles',
    isBuiltin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function notifyChange(storeName: string, action: 'save' | 'delete' | 'wipe', id?: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('dharma-study-updated', {
        detail: { store: storeName, action, id, timestamp: Date.now() },
      })
    );
  }
}

// ── 1. JOURNAL ENTRIES ─────────────────────────────────────────────────────

export async function saveJournalEntry(entry: JournalEntry): Promise<void> {
  const db = await getGranthDB();
  const tx = db.transaction('journal_entries', 'readwrite');
  tx.objectStore('journal_entries').put(entry);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      notifyChange('journal_entries', 'save', entry.id);
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function getJournalEntry(id: string): Promise<JournalEntry | null> {
  const db = await getGranthDB();
  const tx = db.transaction('journal_entries', 'readonly');
  const request = tx.objectStore('journal_entries').get(id);
  return new Promise((resolve) => {
    request.onsuccess = () => resolve((request.result as JournalEntry) || null);
    request.onerror = () => resolve(null);
  });
}

export async function getAllJournalEntries(): Promise<JournalEntry[]> {
  try {
    const db = await getGranthDB();
    const tx = db.transaction('journal_entries', 'readonly');
    const request = tx.objectStore('journal_entries').getAll();
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const results = (request.result as JournalEntry[]) || [];
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(results);
      };
      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const db = await getGranthDB();
  const tx = db.transaction('journal_entries', 'readwrite');
  tx.objectStore('journal_entries').delete(id);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      notifyChange('journal_entries', 'delete', id);
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

// ── 2. PERSONAL VERSE ANNOTATIONS ──────────────────────────────────────────

export async function saveAnnotation(anno: PersonalAnnotation): Promise<void> {
  const db = await getGranthDB();
  const tx = db.transaction('personal_annotations', 'readwrite');
  tx.objectStore('personal_annotations').put(anno);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      notifyChange('personal_annotations', 'save', anno.id);
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAnnotationForVerse(
  scriptureId: string,
  chapterId: number,
  verseId: string | number
): Promise<PersonalAnnotation | null> {
  try {
    const db = await getGranthDB();
    const tx = db.transaction('personal_annotations', 'readonly');
    const index = tx.objectStore('personal_annotations').index('scripture_chapter_verse');
    const request = index.getAll(IDBKeyRange.only([scriptureId, chapterId, verseId]));
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const results = (request.result as PersonalAnnotation[]) || [];
        // Return latest active note
        const active = results.filter((r) => r.status === 'active');
        active.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        resolve(active[0] || null);
      };
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function getAllAnnotations(): Promise<PersonalAnnotation[]> {
  try {
    const db = await getGranthDB();
    const tx = db.transaction('personal_annotations', 'readonly');
    const request = tx.objectStore('personal_annotations').getAll();
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const results = (request.result as PersonalAnnotation[]) || [];
        resolve(results.filter((r) => r.status === 'active'));
      };
      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

export async function deleteAnnotation(id: string): Promise<void> {
  const db = await getGranthDB();
  const tx = db.transaction('personal_annotations', 'readwrite');
  tx.objectStore('personal_annotations').delete(id);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      notifyChange('personal_annotations', 'delete', id);
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

// ── 3. SAVED VERSES & SMART COLLECTIONS ────────────────────────────────────

export async function saveVerseBookmark(saved: SavedVerse): Promise<void> {
  const db = await getGranthDB();
  const tx = db.transaction('saved_verses', 'readwrite');
  tx.objectStore('saved_verses').put(saved);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      notifyChange('saved_verses', 'save', saved.id);
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function getSavedVerse(
  scriptureId: string,
  chapterId: number,
  verseId: string | number
): Promise<SavedVerse | null> {
  const id = `saved:${scriptureId}:${chapterId}:${verseId}`;
  try {
    const db = await getGranthDB();
    const tx = db.transaction('saved_verses', 'readonly');
    const request = tx.objectStore('saved_verses').get(id);
    return new Promise((resolve) => {
      request.onsuccess = () => resolve((request.result as SavedVerse) || null);
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function getAllSavedVerses(): Promise<SavedVerse[]> {
  try {
    const db = await getGranthDB();
    const tx = db.transaction('saved_verses', 'readonly');
    const request = tx.objectStore('saved_verses').getAll();
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const results = (request.result as SavedVerse[]) || [];
        results.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
        resolve(results);
      };
      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

export async function deleteSavedVerse(id: string): Promise<void> {
  const db = await getGranthDB();
  const tx = db.transaction('saved_verses', 'readwrite');
  tx.objectStore('saved_verses').delete(id);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      notifyChange('saved_verses', 'delete', id);
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function saveCollection(collection: PersonalCollection): Promise<void> {
  const db = await getGranthDB();
  const tx = db.transaction('study_collections', 'readwrite');
  tx.objectStore('study_collections').put(collection);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      notifyChange('study_collections', 'save', collection.id);
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllCollections(): Promise<PersonalCollection[]> {
  try {
    const db = await getGranthDB();
    const tx = db.transaction('study_collections', 'readonly');
    const request = tx.objectStore('study_collections').getAll();
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const stored = (request.result as PersonalCollection[]) || [];
        const map = new Map<string, PersonalCollection>();
        // Ensure default builtins are always present
        DEFAULT_STUDY_COLLECTIONS.forEach((c) => map.set(c.id, c));
        stored.forEach((c) => map.set(c.id, c));
        resolve(Array.from(map.values()));
      };
      request.onerror = () => resolve(DEFAULT_STUDY_COLLECTIONS);
    });
  } catch {
    return DEFAULT_STUDY_COLLECTIONS;
  }
}

export async function deleteCollection(id: string): Promise<void> {
  const db = await getGranthDB();
  const tx = db.transaction('study_collections', 'readwrite');
  tx.objectStore('study_collections').delete(id);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      notifyChange('study_collections', 'delete', id);
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

// ── 4. READING POSITIONS & HISTORY ─────────────────────────────────────────

export async function saveReadingPosition(pos: ReadingPosition): Promise<void> {
  const db = await getGranthDB();
  const tx = db.transaction('reading_positions', 'readwrite');
  tx.objectStore('reading_positions').put(pos);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      notifyChange('reading_positions', 'save', pos.scriptureId);
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function getReadingPosition(scriptureId: string): Promise<ReadingPosition | null> {
  try {
    const db = await getGranthDB();
    const tx = db.transaction('reading_positions', 'readonly');
    const request = tx.objectStore('reading_positions').get(scriptureId);
    return new Promise((resolve) => {
      request.onsuccess = () => resolve((request.result as ReadingPosition) || null);
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function getAllReadingPositions(): Promise<ReadingPosition[]> {
  try {
    const db = await getGranthDB();
    const tx = db.transaction('reading_positions', 'readonly');
    const request = tx.objectStore('reading_positions').getAll();
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const results = (request.result as ReadingPosition[]) || [];
        results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        resolve(results);
      };
      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

export async function recordReadingHistory(entry: ReadingHistoryEntry): Promise<void> {
  const db = await getGranthDB();
  const tx = db.transaction('reading_history', 'readwrite');
  tx.objectStore('reading_history').put(entry);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      notifyChange('reading_history', 'save', entry.id);
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllReadingHistory(limit = 100): Promise<ReadingHistoryEntry[]> {
  try {
    const db = await getGranthDB();
    const tx = db.transaction('reading_history', 'readonly');
    const request = tx.objectStore('reading_history').getAll();
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const results = (request.result as ReadingHistoryEntry[]) || [];
        results.sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime());
        resolve(results.slice(0, limit));
      };
      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

export async function clearReadingHistory(): Promise<void> {
  const db = await getGranthDB();
  const tx = db.transaction('reading_history', 'readwrite');
  tx.objectStore('reading_history').clear();
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      notifyChange('reading_history', 'wipe');
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

// ── 5. OFFLINE READING PACKS ───────────────────────────────────────────────

export async function saveOfflinePack(pack: OfflineReadingPack): Promise<void> {
  const db = await getGranthDB();
  const tx = db.transaction('offline_packs', 'readwrite');
  tx.objectStore('offline_packs').put(pack);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      notifyChange('offline_packs', 'save', pack.id);
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllOfflinePacks(): Promise<OfflineReadingPack[]> {
  try {
    const db = await getGranthDB();
    const tx = db.transaction('offline_packs', 'readonly');
    const request = tx.objectStore('offline_packs').getAll();
    return new Promise((resolve) => {
      request.onsuccess = () => resolve((request.result as OfflineReadingPack[]) || []);
      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

export async function deleteOfflinePack(id: string): Promise<void> {
  const db = await getGranthDB();
  const tx = db.transaction('offline_packs', 'readwrite');
  tx.objectStore('offline_packs').delete(id);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      notifyChange('offline_packs', 'delete', id);
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

// ── 6. COMPREHENSIVE BACKUP & ZERO-SERVER RESTORE ──────────────────────────

export async function exportFullStudyBackup(): Promise<DharmaStudyBackupV2> {
  const [collections, savedVerses, annotations, journal, readingHistory, readingPositions] =
    await Promise.all([
      getAllCollections(),
      getAllSavedVerses(),
      getAllAnnotations(),
      getAllJournalEntries(),
      getAllReadingHistory(500),
      getAllReadingPositions(),
    ]);

  const preferences: Record<string, string> = {};
  if (typeof window !== 'undefined' && window.localStorage) {
    const prefKeys = [
      'dharma-theme',
      'dharma_reader_layers',
      'dharma_reader_fontsize',
      'dharma_haptics_enabled',
      'dharma.desk.pin',
    ];
    prefKeys.forEach((k) => {
      const v = window.localStorage.getItem(k);
      if (v) preferences[k] = v;
    });
  }

  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    source: 'dharmagranth.in',
    stats: {
      journalCount: journal.length,
      annotationCount: annotations.length,
      savedVerseCount: savedVerses.length,
      collectionCount: collections.length,
      historyCount: readingHistory.length,
    },
    collections,
    savedVerses,
    annotations,
    journal,
    readingHistory,
    readingPositions,
    preferences,
  };
}

export async function restoreFullStudyBackup(backup: DharmaStudyBackupV2): Promise<boolean> {
  if (!backup || backup.version !== 2 || backup.source !== 'dharmagranth.in') {
    throw new Error('Invalid or incompatible Dharma Granth backup file');
  }

  const db = await getGranthDB();

  // Restore collections
  if (Array.isArray(backup.collections)) {
    const tx = db.transaction('study_collections', 'readwrite');
    const store = tx.objectStore('study_collections');
    backup.collections.forEach((c) => store.put(c));
    await new Promise((res) => {
      tx.oncomplete = () => res(null);
    });
  }

  // Restore saved verses
  if (Array.isArray(backup.savedVerses)) {
    const tx = db.transaction('saved_verses', 'readwrite');
    const store = tx.objectStore('saved_verses');
    backup.savedVerses.forEach((s) => store.put(s));
    await new Promise((res) => {
      tx.oncomplete = () => res(null);
    });
  }

  // Restore annotations
  if (Array.isArray(backup.annotations)) {
    const tx = db.transaction('personal_annotations', 'readwrite');
    const store = tx.objectStore('personal_annotations');
    backup.annotations.forEach((a) => store.put(a));
    await new Promise((res) => {
      tx.oncomplete = () => res(null);
    });
  }

  // Restore journal
  if (Array.isArray(backup.journal)) {
    const tx = db.transaction('journal_entries', 'readwrite');
    const store = tx.objectStore('journal_entries');
    backup.journal.forEach((j) => store.put(j));
    await new Promise((res) => {
      tx.oncomplete = () => res(null);
    });
  }

  // Restore reading history
  if (Array.isArray(backup.readingHistory)) {
    const tx = db.transaction('reading_history', 'readwrite');
    const store = tx.objectStore('reading_history');
    backup.readingHistory.forEach((h) => store.put(h));
    await new Promise((res) => {
      tx.oncomplete = () => res(null);
    });
  }

  // Restore reading positions
  if (Array.isArray(backup.readingPositions)) {
    const tx = db.transaction('reading_positions', 'readwrite');
    const store = tx.objectStore('reading_positions');
    backup.readingPositions.forEach((p) => store.put(p));
    await new Promise((res) => {
      tx.oncomplete = () => res(null);
    });
  }

  // Restore preferences into localStorage
  if (backup.preferences && typeof window !== 'undefined' && window.localStorage) {
    Object.entries(backup.preferences).forEach(([k, v]) => {
      window.localStorage.setItem(k, v);
    });
  }

  notifyChange('all', 'save');
  return true;
}

export async function clearAllPersonalStudyData(): Promise<void> {
  const db = await getGranthDB();
  const stores = [
    'journal_entries',
    'personal_annotations',
    'study_collections',
    'saved_verses',
    'reading_history',
    'reading_positions',
  ] as const;

  for (const s of stores) {
    const tx = db.transaction(s, 'readwrite');
    tx.objectStore(s).clear();
    await new Promise((res) => {
      tx.oncomplete = () => res(null);
    });
  }

  notifyChange('all', 'wipe');
}
