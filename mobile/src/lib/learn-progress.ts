/**
 * What the reader has done in Learn: lessons finished in each course and reading journey, Gita journey
 * chapters studied, and the answers to "discover your path". Pure logic, no React or native code, so
 * `npm test` can run it. Kept on the phone only (zero-account privacy) and carried in the local JSON backup
 * under `learn`, as the website keeps /learn and /practice state in localStorage with export and import.
 */

export interface LearnProgress {
  /** Finished lesson ids, by course id. */
  courses: Record<string, string[]>;
  /** Finished lesson ids, by reading journey id. */
  journeys: Record<string, string[]>;
  /** Gita journey chapters marked as studied. */
  gita: number[];
  /** The last answers to "discover your path", by question key, or null. */
  discover: Record<string, string> | null;
}

export const EMPTY_LEARN: LearnProgress = { courses: {}, journeys: {}, gita: [], discover: null };

const ID_RE = /^[\w.-]{1,80}$/;

function idLists(raw: unknown): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
  for (const [key, list] of Object.entries(raw as Record<string, unknown>)) {
    if (!ID_RE.test(key) || !Array.isArray(list)) continue;
    const ids = [...new Set(list.filter((x): x is string => typeof x === 'string' && ID_RE.test(x)))];
    if (ids.length) out[key] = ids;
  }
  return out;
}

/** Cleans up stored or imported data; anything unreadable becomes empty rather than failing. */
export function normalizeLearn(raw: unknown): LearnProgress {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Partial<Record<keyof LearnProgress, unknown>>;
  const gita = Array.isArray(r.gita)
    ? [...new Set(r.gita.filter((n): n is number => Number.isInteger(n) && (n as number) >= 1 && (n as number) <= 18))].sort((a, b) => a - b)
    : [];
  let discover: Record<string, string> | null = null;
  if (r.discover && typeof r.discover === 'object' && !Array.isArray(r.discover)) {
    const entries = Object.entries(r.discover as Record<string, unknown>).filter(
      (e): e is [string, string] => ID_RE.test(e[0]) && typeof e[1] === 'string' && ID_RE.test(e[1]),
    );
    if (entries.length) discover = Object.fromEntries(entries);
  }
  return { courses: idLists(r.courses), journeys: idLists(r.journeys), gita, discover };
}

/** Marks a lesson finished (done = true) or not, in a course or a journey. */
export function setLesson(p: LearnProgress, kind: 'courses' | 'journeys', id: string, lesson: string, done: boolean): LearnProgress {
  const list = p[kind][id] ?? [];
  const has = list.includes(lesson);
  if (has === done) return p;
  const next = done ? [...list, lesson] : list.filter((x) => x !== lesson);
  const map = { ...p[kind] };
  if (next.length) map[id] = next;
  else delete map[id];
  return { ...p, [kind]: map };
}

export function setGita(p: LearnProgress, chapter: number, done: boolean): LearnProgress {
  const has = p.gita.includes(chapter);
  if (has === done) return p;
  return { ...p, gita: done ? [...p.gita, chapter].sort((a, b) => a - b) : p.gita.filter((c) => c !== chapter) };
}

/** How many of a list of lesson ids are finished. */
export function doneCount(p: LearnProgress, kind: 'courses' | 'journeys', id: string, lessons: string[]): number {
  const set = new Set(p[kind][id] ?? []);
  return lessons.filter((l) => set.has(l)).length;
}

/** The first lesson not yet finished, or the first one when all are (to read again). */
export function nextLesson(p: LearnProgress, kind: 'courses' | 'journeys', id: string, lessons: string[]): number {
  const set = new Set(p[kind][id] ?? []);
  const i = lessons.findIndex((l) => !set.has(l));
  return i < 0 ? 0 : i;
}

/** A backup's progress added to what is on the phone: nothing finished is ever un-finished by an import. */
export function mergeLearn(current: LearnProgress, incoming: unknown): LearnProgress {
  const inc = normalizeLearn(incoming);
  const union = (a: Record<string, string[]>, b: Record<string, string[]>) => {
    const out: Record<string, string[]> = { ...a };
    for (const [k, v] of Object.entries(b)) out[k] = [...new Set([...(out[k] ?? []), ...v])];
    return out;
  };
  return {
    courses: union(current.courses, inc.courses),
    journeys: union(current.journeys, inc.journeys),
    gita: [...new Set([...current.gita, ...inc.gita])].sort((a, b) => a - b),
    discover: current.discover ?? inc.discover,
  };
}
