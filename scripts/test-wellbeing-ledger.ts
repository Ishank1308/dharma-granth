import assert from 'node:assert/strict';
import {
  localDay,
  readStudySessions,
  readWellbeingSnapshot,
  recordStudySession,
  STUDY_SESSIONS_KEY,
  type StoragePort,
} from '../lib/wellbeing-ledger';

class MemoryStorage implements StoragePort {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

function dayOffset(date: Date, offset: number): string {
  return localDay(new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset));
}

const now = new Date(2026, 9, 23, 12, 0, 0);
const storage = new MemoryStorage();
storage.setItem('dharma.readingDays.v1', JSON.stringify({
  [dayOffset(now, 0)]: ['gita:2'],
  [dayOffset(now, -7)]: ['katha:1'],
  [dayOffset(now, -27)]: ['isha:1'],
  [dayOffset(now, -28)]: ['outside-window:1'],
  [dayOffset(now, -6)]: [],
  '2026-02-31': ['invalid-date:1'],
}));
storage.setItem('dharma.practice.reflections', JSON.stringify({
  [dayOffset(now, 0)]: { note: 'A private thought' },
  [dayOffset(now, -10)]: 'Older style private entry',
  [dayOffset(now, -12)]: { tag: 'dharma' },
  [dayOffset(now, -29)]: { action: 'outside window' },
}));
storage.setItem(STUDY_SESSIONS_KEY, JSON.stringify([
  { id: 'session-1', day: dayOffset(now, 0), minutes: 10 },
  { id: 'session-2', day: dayOffset(now, -14), minutes: 15 },
  { id: 'too-old', day: dayOffset(now, -28), minutes: 60 },
  { id: 'invalid-minutes', day: dayOffset(now, -2), minutes: 181 },
  null,
]));

let snapshot = readWellbeingSnapshot(now, storage);
assert.deepEqual(snapshot, {
  windowDays: 28,
  readingDays: 3,
  reflectionDays: 2,
  wisdomSessions: 2,
  studyMinutes: 25,
});
assert.equal(readStudySessions(storage).length, 3);

const saved = recordStudySession(5, now, storage);
assert.ok(saved);
assert.equal(saved.day, localDay(now));
assert.equal(recordStudySession(0, now, storage), null);
assert.equal(recordStudySession(181, now, storage), null);

snapshot = readWellbeingSnapshot(now, storage);
assert.equal(snapshot.wisdomSessions, 3);
assert.equal(snapshot.studyMinutes, 30);

storage.setItem('dharma.readingDays.v1', '{broken json');
storage.setItem('dharma.practice.reflections', 'null');
storage.setItem(STUDY_SESSIONS_KEY, 'not json');
snapshot = readWellbeingSnapshot(now, storage);
assert.equal(snapshot.readingDays, 0);
assert.equal(snapshot.reflectionDays, 0);
assert.equal(snapshot.wisdomSessions, 0);
assert.equal(snapshot.studyMinutes, 0);

console.log('Wellbeing ledger tests passed.');
