// Gita Sankalpa and reading plans behave as on the website (lib/gita-sankalpa.ts), and survive a backup.
import assert from 'node:assert/strict';
import test from 'node:test';

import { calculateStreak, getTodayAssignment, getDefaultSankalpaState } from '../../lib/gita-sankalpa.ts';
import { defaultSankalpa, keepToday, mergePractice, normalizePractice, streaks, takeSankalpa, todayChapters, toggleChapter } from '../src/lib/sankalpa.ts';

test('streaks match the website', () => {
  const cases = [
    [[], '2026-11-21'],
    [['2026-11-20', '2026-11-21'], '2026-11-21'],
    [['2026-11-18', '2026-11-19', '2026-11-20'], '2026-11-21'],
    [['2026-11-10', '2026-11-11', '2026-11-12', '2026-11-19'], '2026-11-21'],
  ];
  for (const [dates, today] of cases) {
    const site = calculateStreak(dates, today);
    const app = streaks(dates, today);
    assert.deepEqual({ current: app.current, best: app.best }, { current: site.currentStreak, best: site.bestStreak }, dates.join(','));
  }
});

test('today’s chapters match the website for every mode and weekday', () => {
  for (const mode of ['18-days', 'daily-chapter', 'weekly-parayana']) {
    for (let d = 15; d <= 21; d++) {
      const today = `2026-11-${d}`;
      const site = getTodayAssignment({ ...getDefaultSankalpaState(), mode, targetChapter: 15, cycleChapters: [1, 2] }, today);
      const app = todayChapters({ ...defaultSankalpa(today), mode, targetChapter: 15, cycleChapters: [1, 2] }, today);
      assert.deepEqual(app.chapters, site.chapters.map((c) => c.number), `${mode} ${today}`);
    }
  }
});

test('an 18-day cycle closes after the 18th chapter and starts again', () => {
  let s = takeSankalpa(defaultSankalpa('2026-11-01'), '18-days', 12, '2026-11-01');
  for (let d = 1; d <= 18; d++) s = keepToday(s, `2026-11-${String(d).padStart(2, '0')}`);
  assert.equal(s.cyclesCompleted, 1);
  assert.deepEqual(s.cycleChapters, []);
  assert.equal(s.bestStreak, 18);
  assert.equal(keepToday(s, '2026-11-18'), s, 'a day counts once');
  s = toggleChapter(s, 5, '2026-11-19');
  assert.deepEqual(s.cycleChapters, [5]);
});

test('practice data survives storage and backups, and merges', () => {
  const a = normalizePractice({ sankalpa: { isActive: true, mode: 'daily-chapter', targetChapter: 15, completedDates: ['2026-11-20', 'bad'] }, plans: { 'gita-18-days': { startedAt: 'x', done: [1, 2, 2] } } });
  assert.deepEqual(a.sankalpa.completedDates, ['2026-11-20']);
  assert.deepEqual(a.plans['gita-18-days'].done, [1, 2]);
  const b = normalizePractice({ sankalpa: { completedDates: ['2026-11-21'] }, plans: { 'gita-18-days': { startedAt: 'y', done: [3] } } });
  const m = mergePractice(a, b);
  assert.deepEqual(m.sankalpa.completedDates, ['2026-11-20', '2026-11-21']);
  assert.deepEqual(m.plans['gita-18-days'].done, [1, 2, 3]);
  assert.equal(m.sankalpa.mode, 'daily-chapter');
  assert.equal(normalizePractice(null).sankalpa.isActive, false);
});
