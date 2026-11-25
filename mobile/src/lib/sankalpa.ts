/**
 * Gita Sankalpa (गीता संकल्प साधना) and reading-plan progress: pure logic, mirroring lib/gita-sankalpa.ts on
 * the website so a pledge behaves the same in the app. Everything stays on the phone (src/state/practice.ts).
 * Calm by design: missing a day never loses a cycle, it only resets the running streak.
 */
export type SankalpaMode = '18-days' | 'daily-chapter' | 'weekly-parayana';
export const SANKALPA_MODES: SankalpaMode[] = ['18-days', 'daily-chapter', 'weekly-parayana'];

export interface SankalpaState {
  isActive: boolean;
  mode: SankalpaMode;
  /** The chapter of a daily-chapter pledge (12, Bhakti Yoga, by default). */
  targetChapter: number;
  startDate: string;
  currentCycle: number;
  /** Days a pledge was kept, YYYY-MM-DD in local time. */
  completedDates: string[];
  /** Chapters read in the current cycle (1..18). */
  cycleChapters: number[];
  bestStreak: number;
  totalChaptersRead: number;
  cyclesCompleted: number;
}

export interface PlanProgress {
  startedAt: string;
  /** Day numbers marked done. */
  done: number[];
}

export interface PracticeData {
  sankalpa: SankalpaState;
  plans: Record<string, PlanProgress>;
}

export function dayKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function defaultSankalpa(today = dayKey()): SankalpaState {
  return {
    isActive: false,
    mode: '18-days',
    targetChapter: 12,
    startDate: today,
    currentCycle: 1,
    completedDates: [],
    cycleChapters: [],
    bestStreak: 0,
    totalChaptersRead: 0,
    cyclesCompleted: 0,
  };
}

const DAY = 86_400_000;
const utc = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};

/** Current and best run of consecutive days. A run is still current if its last day was today or yesterday. */
export function streaks(dates: string[], today = dayKey()): { current: number; best: number } {
  const days = [...new Set(dates)].sort();
  if (!days.length) return { current: 0, best: 0 };
  let best = 0;
  let run = 0;
  let prev = -Infinity;
  for (const k of days) {
    const t = utc(k);
    run = t - prev === DAY ? run + 1 : 1;
    best = Math.max(best, run);
    prev = t;
  }
  const gap = Math.round((utc(today) - utc(days[days.length - 1])) / DAY);
  let current = 0;
  if (gap === 0 || gap === 1) {
    let expected = utc(days[days.length - 1]);
    for (let i = days.length - 1; i >= 0 && utc(days[i]) === expected; i--) {
      current++;
      expected -= DAY;
    }
  }
  return { current, best: Math.max(best, current) };
}

/** Today's chapters for the pledge, as on the website. */
export function todayChapters(state: SankalpaState, today = dayKey()): { chapters: number[]; done: boolean; dayInCycle: number } {
  const done = state.completedDates.includes(today);
  if (state.mode === 'daily-chapter') return { chapters: [state.targetChapter], done, dayInCycle: 1 };
  if (state.mode === 'weekly-parayana') {
    // Monday 1–3, Tuesday 4–6 … Saturday 16–18; Sunday is contemplation/review (no new chapters).
    const dow = new Date(utc(today)).getUTCDay();
    if (dow === 0) return { chapters: [], done, dayInCycle: 7 };
    const start = (dow - 1) * 3 + 1;
    return { chapters: [start, start + 1, start + 2], done, dayInCycle: dow };
  }
  const read = new Set(state.cycleChapters);
  const next = Array.from({ length: 18 }, (_, i) => i + 1).find((n) => !read.has(n)) ?? 1;
  return { chapters: [next], done, dayInCycle: Math.min(18, state.cycleChapters.length + (done ? 0 : 1)) };
}

function closeCycle(state: SankalpaState, chapters: number[]): SankalpaState {
  if (state.mode !== 'daily-chapter' && chapters.length >= 18) {
    return { ...state, cycleChapters: [], cyclesCompleted: state.cyclesCompleted + 1, currentCycle: state.currentCycle + 1 };
  }
  return { ...state, cycleChapters: chapters };
}

/** Marks today's reading done: the day counts toward the streak and its chapters toward the cycle. */
export function keepToday(state: SankalpaState, today = dayKey()): SankalpaState {
  if (state.completedDates.includes(today)) return state;
  const { chapters } = todayChapters(state, today);
  const completedDates = [...state.completedDates, today];
  const next = closeCycle(
    { ...state, completedDates, totalChaptersRead: state.totalChaptersRead + chapters.length },
    [...new Set([...state.cycleChapters, ...chapters])],
  );
  return { ...next, bestStreak: Math.max(state.bestStreak, streaks(completedDates, today).best) };
}

/** Ticks or unticks one chapter of the current cycle by hand (read out of order, or on another device). */
export function toggleChapter(state: SankalpaState, chapter: number, today = dayKey()): SankalpaState {
  const has = state.cycleChapters.includes(chapter);
  const completedDates = has || state.completedDates.includes(today) ? state.completedDates : [...state.completedDates, today];
  const chapters = has ? state.cycleChapters.filter((n) => n !== chapter) : [...state.cycleChapters, chapter];
  const next = closeCycle(
    { ...state, completedDates, totalChaptersRead: has ? Math.max(0, state.totalChaptersRead - 1) : state.totalChaptersRead + 1 },
    chapters,
  );
  return { ...next, bestStreak: Math.max(state.bestStreak, streaks(completedDates, today).best) };
}

/** Takes (or changes) the pledge. History, best streak and finished cycles are kept. */
export function takeSankalpa(state: SankalpaState, mode: SankalpaMode, targetChapter: number, today = dayKey()): SankalpaState {
  return {
    ...state,
    isActive: true,
    mode,
    targetChapter: Math.min(18, Math.max(1, Math.round(targetChapter) || 12)),
    startDate: today,
    currentCycle: Math.max(1, state.cyclesCompleted + 1),
    cycleChapters: [],
  };
}

const isDay = (s: unknown): s is string => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
const whole = (v: unknown, min: number, max: number, d: number) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= min && n <= max ? n : d;
};

/** Reads practice data from storage or a backup, keeping whatever is valid. */
export function normalizePractice(raw: unknown): PracticeData {
  const r = (raw && typeof raw === 'object' ? raw : {}) as { sankalpa?: Partial<SankalpaState>; plans?: Record<string, Partial<PlanProgress>> };
  const s = r.sankalpa ?? {};
  const d = defaultSankalpa();
  const sankalpa: SankalpaState = {
    isActive: typeof s.isActive === 'boolean' ? s.isActive : d.isActive,
    mode: SANKALPA_MODES.includes(s.mode as SankalpaMode) ? (s.mode as SankalpaMode) : d.mode,
    targetChapter: whole(s.targetChapter, 1, 18, d.targetChapter),
    startDate: isDay(s.startDate) ? s.startDate : d.startDate,
    currentCycle: whole(s.currentCycle, 1, 100000, 1),
    completedDates: Array.isArray(s.completedDates) ? [...new Set(s.completedDates.filter(isDay))].sort() : [],
    cycleChapters: Array.isArray(s.cycleChapters) ? [...new Set(s.cycleChapters.map(Number).filter((n) => Number.isInteger(n) && n >= 1 && n <= 18))] : [],
    bestStreak: whole(s.bestStreak, 0, 100000, 0),
    totalChaptersRead: whole(s.totalChaptersRead, 0, 10000000, 0),
    cyclesCompleted: whole(s.cyclesCompleted, 0, 100000, 0),
  };
  const plans: Record<string, PlanProgress> = {};
  if (r.plans && typeof r.plans === 'object') {
    for (const [id, p] of Object.entries(r.plans)) {
      if (!p || typeof p !== 'object') continue;
      plans[id] = {
        startedAt: typeof p.startedAt === 'string' ? p.startedAt : new Date(0).toISOString(),
        done: Array.isArray(p.done) ? [...new Set(p.done.map(Number).filter((n) => Number.isInteger(n) && n > 0))].sort((a, b) => a - b) : [],
      };
    }
  }
  return { sankalpa, plans };
}

/** A backup adds to what is on the phone: days and plan days are merged, the larger counts kept. */
export function mergePractice(current: PracticeData, incoming: PracticeData): PracticeData {
  const a = current.sankalpa;
  const b = incoming.sankalpa;
  const newer = b.isActive && (!a.isActive || b.startDate > a.startDate) ? b : a;
  const plans = { ...current.plans };
  for (const [id, p] of Object.entries(incoming.plans)) {
    const mine = plans[id];
    plans[id] = mine ? { startedAt: mine.startedAt < p.startedAt ? mine.startedAt : p.startedAt, done: [...new Set([...mine.done, ...p.done])].sort((x, y) => x - y) } : p;
  }
  return normalizePractice({
    sankalpa: {
      ...newer,
      completedDates: [...a.completedDates, ...b.completedDates],
      bestStreak: Math.max(a.bestStreak, b.bestStreak),
      totalChaptersRead: Math.max(a.totalChaptersRead, b.totalChaptersRead),
      cyclesCompleted: Math.max(a.cyclesCompleted, b.cyclesCompleted),
    },
    plans,
  });
}
