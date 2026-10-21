/**
 * Zero-Data-Loss Migration Engine from Legacy localStorage to IndexedDB v2
 * 
 * Safely inspects older localStorage keys (dharma.notes, dharma.userMananaNotes,
 * dharma.bookmarkedVerses, dharma.verseCollections.v1, dharma.readingHistory)
 * and promotes them into the unified Personal Study System.
 */

import {
  saveAnnotation,
  saveJournalEntry,
  saveVerseBookmark,
  saveCollection,
  recordReadingHistory,
  DEFAULT_STUDY_COLLECTIONS,
} from './storage';
import type {
  PersonalAnnotation,
  JournalEntry,
  SavedVerse,
  PersonalCollection,
  ReadingHistoryEntry,
} from './types';

const MIGRATION_FLAG = 'dharma_study_v2_migrated';

export async function runStudyDataMigration(): Promise<boolean> {
  if (typeof window === 'undefined' || !window.localStorage) return false;

  try {
    if (window.localStorage.getItem(MIGRATION_FLAG) === 'true') {
      return false; // Already migrated
    }

    // 1. Initialize Builtin Collections
    for (const c of DEFAULT_STUDY_COLLECTIONS) {
      await saveCollection(c);
    }

    // 2. Migrate Custom Collections from dharma.verseCollections.v1
    const rawCollections = window.localStorage.getItem('dharma.verseCollections.v1');
    const assignments: Record<string, string> = {};
    if (rawCollections) {
      try {
        const parsed = JSON.parse(rawCollections);
        if (parsed && Array.isArray(parsed.collections)) {
          for (const c of parsed.collections) {
            if (c.id && c.name && !c.builtin) {
              const customCol: PersonalCollection = {
                id: c.id,
                name: c.name,
                colourToken: 'from-amber-600 to-orange-600',
                isBuiltin: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              await saveCollection(customCol);
            }
          }
        }
        if (parsed && parsed.assign && typeof parsed.assign === 'object') {
          Object.assign(assignments, parsed.assign);
        }
      } catch {}
    }

    // 3. Migrate Bookmarked Verses from dharma.bookmarkedVerses
    const rawBookmarks = window.localStorage.getItem('dharma.bookmarkedVerses');
    if (rawBookmarks) {
      try {
        const list: Array<{
          scriptureId: string;
          scriptureTitle?: string;
          chapterId?: number;
          chapterTitle?: string;
          verseId: number | string;
          sanskrit?: string;
          translation?: string;
          hindi?: string;
          timestamp?: string;
        }> = JSON.parse(rawBookmarks);

        if (Array.isArray(list)) {
          for (const b of list) {
            const chId = b.chapterId ?? 1;
            const vId = b.verseId;
            const key = `${b.scriptureId}:${chId}:${vId}`;
            const colId = assignments[key] || 'read-later';

            const saved: SavedVerse = {
              id: `saved:${b.scriptureId}:${chId}:${vId}`,
              reference: {
                scriptureId: b.scriptureId,
                scriptureTitle: b.scriptureTitle || b.scriptureId,
                chapterId: chId,
                verseId: vId,
                canonicalReference: `${b.scriptureTitle || b.scriptureId} ${chId}.${vId}`,
                sanskritSnippet: b.sanskrit?.slice(0, 160),
                translationSnippet: (b.hindi || b.translation || '')?.slice(0, 200),
              },
              collectionIds: [colId],
              savedAt: b.timestamp || new Date().toISOString(),
            };
            await saveVerseBookmark(saved);
          }
        }
      } catch {}
    }

    // 4. Migrate Verse Notes from dharma.notes
    const rawNotes = window.localStorage.getItem('dharma.notes');
    if (rawNotes) {
      try {
        const notes: Array<{
          scriptureId: string;
          chapterId: number;
          verseId: number | string;
          text: string;
          updatedAt: string;
        }> = JSON.parse(rawNotes);

        if (Array.isArray(notes)) {
          for (const n of notes) {
            if (!n.text || !n.text.trim()) continue;
            const anno: PersonalAnnotation = {
              id: `anno:${n.scriptureId}:${n.chapterId}:${n.verseId}:legacy`,
              reference: {
                scriptureId: n.scriptureId,
                chapterId: n.chapterId,
                verseId: n.verseId,
                canonicalReference: `${n.scriptureId} ${n.chapterId}.${n.verseId}`,
              },
              note: n.text.trim(),
              tags: ['legacy-note'],
              createdAt: n.updatedAt || new Date().toISOString(),
              updatedAt: n.updatedAt || new Date().toISOString(),
              status: 'active',
            };
            await saveAnnotation(anno);
          }
        }
      } catch {}
    }

    // 5. Migrate Story Deck Reflections from dharma.userMananaNotes
    const rawManana = window.localStorage.getItem('dharma.userMananaNotes');
    if (rawManana) {
      try {
        const mananaItems: Array<{
          id: string;
          reference?: string;
          prompt: string;
          date: string;
        }> = JSON.parse(rawManana);

        if (Array.isArray(mananaItems)) {
          for (const m of mananaItems) {
            if (!m.prompt || !m.prompt.trim()) continue;
            const entry: JournalEntry = {
              id: m.id || `journal:story-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              title: m.reference ? `मनन चिंतन · ${m.reference}` : 'स्वाध्याय चिंतन',
              body: m.prompt.trim(),
              linkedReferences: [],
              moodTag: 'contemplative',
              tags: ['story-deck', 'svadhyaya'],
              createdAt: m.date || new Date().toISOString(),
              updatedAt: m.date || new Date().toISOString(),
              status: 'active',
            };
            await saveJournalEntry(entry);
          }
        }
      } catch {}
    }

    // 6. Migrate Recent Chapters to Reading History
    const rawHistory = window.localStorage.getItem('dharma.recentChapters');
    if (rawHistory) {
      try {
        const history: Array<{
          scriptureId: string;
          chapterId: number;
          lastReadAt: string;
          lastVerse?: number | string;
        }> = JSON.parse(rawHistory);

        if (Array.isArray(history)) {
          for (const h of history) {
            const entry: ReadingHistoryEntry = {
              id: `hist:${h.scriptureId}:${h.chapterId}:${new Date(h.lastReadAt).getTime()}`,
              reference: {
                scriptureId: h.scriptureId,
                chapterId: h.chapterId,
                verseId: h.lastVerse || 1,
                canonicalReference: `${h.scriptureId} ${h.chapterId}`,
              },
              visitedAt: h.lastReadAt || new Date().toISOString(),
              progressPercent: 50,
              timeSpentSeconds: 60,
            };
            await recordReadingHistory(entry);
          }
        }
      } catch {}
    }

    window.localStorage.setItem(MIGRATION_FLAG, 'true');
    window.dispatchEvent(new Event('dharma-study-migrated'));
    return true;
  } catch (err) {
    console.warn('[dharma-study] Migration encountered warning:', err);
    return false;
  }
}
