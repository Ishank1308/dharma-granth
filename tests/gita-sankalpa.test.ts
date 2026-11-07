import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  GITA_CHAPTERS,
  calculateStreak,
  activateSankalpa,
  getTodayAssignment,
  fulfillTodayAssignment,
  toggleChapterInCycle,
  getTraditionalSankalpaInvocation,
  getDefaultSankalpaState,
  type GitaSankalpaState,
} from '../lib/gita-sankalpa';

test('GITA_CHAPTERS contains all 18 chapters with exact 701 verse total', () => {
  assert.equal(GITA_CHAPTERS.length, 18);
  const totalVerses = GITA_CHAPTERS.reduce((sum, c) => sum + c.verses, 0);
  assert.equal(totalVerses, 701);

  // Check critical chapters
  assert.equal(GITA_CHAPTERS[1].number, 2); // Sankhya Yoga
  assert.equal(GITA_CHAPTERS[1].verses, 72);
  assert.equal(GITA_CHAPTERS[11].number, 12); // Bhakti Yoga
  assert.equal(GITA_CHAPTERS[11].verses, 20);
  assert.equal(GITA_CHAPTERS[14].number, 15); // Purushottama Yoga
  assert.equal(GITA_CHAPTERS[14].verses, 20);
  assert.equal(GITA_CHAPTERS[17].number, 18); // Moksha Sannyasa Yoga
  assert.equal(GITA_CHAPTERS[17].verses, 78);
});

test('calculateStreak computes current and best streaks accurately across gaps', () => {
  // Empty
  assert.deepEqual(calculateStreak([]), { currentStreak: 0, bestStreak: 0 });

  // 1 day
  assert.deepEqual(calculateStreak(['2026-11-07'], '2026-11-07'), { currentStreak: 1, bestStreak: 1 });

  // 3 consecutive days ending today
  const consecutive = ['2026-11-05', '2026-11-06', '2026-11-07'];
  assert.deepEqual(calculateStreak(consecutive, '2026-11-07'), { currentStreak: 3, bestStreak: 3 });

  // Completed yesterday but not yet today (active streak maintained)
  assert.deepEqual(calculateStreak(['2026-11-05', '2026-11-06'], '2026-11-07'), { currentStreak: 2, bestStreak: 2 });

  // Gap of 2 days: streak resets to 0 for today
  assert.deepEqual(calculateStreak(['2026-11-01', '2026-11-02', '2026-11-03'], '2026-11-07'), { currentStreak: 0, bestStreak: 3 });
});

test('18-day sequential parayana schedules chapter 1 through 18 and handles cycle rollover', () => {
  let state: GitaSankalpaState = {
    ...getDefaultSankalpaState(),
    isActive: true,
    mode: '18-days',
  };

  // Day 1: Chapter 1 is assigned
  let assign = getTodayAssignment(state, '2026-11-01');
  assert.equal(assign.chapters[0].number, 1);
  assert.equal(assign.dayIndexInCycle, 1);
  assert.equal(assign.isFulfilledToday, false);

  // Complete day 1
  state = fulfillTodayAssignment(state, '2026-11-01');
  assert.deepEqual(state.cycleChapters, [1]);
  assert.equal(state.currentStreak, 1);
  assert.equal(state.totalChaptersRead, 1);

  // Day 2: Chapter 2 is assigned
  assign = getTodayAssignment(state, '2026-11-02');
  assert.equal(assign.chapters[0].number, 2);

  // Fast forward to chapter 17 completed
  state.cycleChapters = Array.from({ length: 17 }, (_, i) => i + 1);
  assign = getTodayAssignment(state, '2026-11-18');
  assert.equal(assign.chapters[0].number, 18);

  // Complete chapter 18 -> Rollover to Cycle 2!
  state = fulfillTodayAssignment(state, '2026-11-18');
  assert.equal(state.cyclesCompleted, 1);
  assert.equal(state.currentCycle, 2);
  assert.deepEqual(state.cycleChapters, []); // fresh cycle starts
});

test('daily-chapter pledge focuses exclusively on the reader chosen chapter', () => {
  const state: GitaSankalpaState = {
    ...getDefaultSankalpaState(),
    isActive: true,
    mode: 'daily-chapter',
    targetChapter: 15, // Purushottama Yoga
  };

  const assign = getTodayAssignment(state, '2026-11-07');
  assert.equal(assign.chapters.length, 1);
  assert.equal(assign.chapters[0].number, 15);
  assert.equal(assign.chapters[0].nameHi, 'पुरुषोत्तमयोग');
});

test('toggleChapterInCycle toggles chapters and calculates progress', () => {
  let state = getDefaultSankalpaState();
  state = toggleChapterInCycle(state, 12, '2026-11-07');
  assert.deepEqual(state.cycleChapters, [12]);
  assert.equal(state.totalChaptersRead, 1);

  // Untoggle
  state = toggleChapterInCycle(state, 12, '2026-11-07');
  assert.deepEqual(state.cycleChapters, []);
  assert.equal(state.totalChaptersRead, 0);
});

test('getTraditionalSankalpaInvocation produces authentic Sanskrit and Hindi invocation without duplicate adya', () => {
  const invocation = getTraditionalSankalpaInvocation('शनि', 'त्रयोदशी', 'श्रीमद्भगवद्गीता द्वादश अध्याय');
  assert.ok(invocation.sanskrit.includes('ॐ तत्सत्'));
  assert.ok(invocation.sanskrit.includes('शनि वासरे'));
  assert.ok(invocation.sanskrit.includes('त्रयोदशी'));
  assert.ok(invocation.hindi.includes('भगवान् श्रीकृष्ण के प्रीत्यर्थ'));
  assert.ok(invocation.english.includes('Om Tat Sat'));

  // Regression: passing 'अद्य' or 'शनिवार' never duplicates 'अद्य अद्य' or 'वार वासरे'
  const fallbackInvocation = getTraditionalSankalpaInvocation('अद्य', 'पावन तिथौ', 'भक्तियोग');
  assert.ok(!fallbackInvocation.sanskrit.includes('अद्य अद्य'));
  assert.ok(fallbackInvocation.sanskrit.includes('अद्य शुभ वासरे'));

  const fullVaraInvocation = getTraditionalSankalpaInvocation('शनिवार', 'शुक्ल सप्तमी तिथौ', 'भक्तियोग');
  assert.ok(fullVaraInvocation.sanskrit.includes('अद्य शनि वासरे'));
  assert.ok(fullVaraInvocation.hindi.includes('आज शनिवार के पावन दिवस पर'));
});

test('activateSankalpa preserves completedDates, bestStreak, totalChaptersRead, and cyclesCompleted on mode switch', () => {
  const priorState: GitaSankalpaState = {
    ...getDefaultSankalpaState(),
    isActive: false,
    mode: '18-days',
    completedDates: ['2026-11-05', '2026-11-06'],
    bestStreak: 5,
    totalChaptersRead: 22,
    cyclesCompleted: 1,
    cycleChapters: [1, 2, 3, 4],
  };

  const restarted = activateSankalpa(priorState, 'daily-chapter', 15, '2026-11-07');
  assert.equal(restarted.isActive, true);
  assert.equal(restarted.mode, 'daily-chapter');
  assert.equal(restarted.targetChapter, 15);
  assert.deepEqual(restarted.completedDates, ['2026-11-05', '2026-11-06']);
  assert.equal(restarted.currentStreak, 2); // completed yesterday -> streak stays alive today
  assert.equal(restarted.bestStreak, 5);
  assert.equal(restarted.totalChaptersRead, 22);
  assert.equal(restarted.cyclesCompleted, 1);
  assert.equal(restarted.currentCycle, 2);
  assert.deepEqual(restarted.cycleChapters, []);
});

test('weekly-parayana resolves exact calendar weekday via UTC without negative-offset shift', () => {
  const state: GitaSankalpaState = {
    ...getDefaultSankalpaState(),
    isActive: true,
    mode: 'weekly-parayana',
  };
  // 2026-11-02 is Monday -> chapters 1, 2, 3
  const monAssign = getTodayAssignment(state, '2026-11-02');
  assert.deepEqual(
    monAssign.chapters.map((c) => c.number),
    [1, 2, 3],
  );
  assert.equal(monAssign.dayIndexInCycle, 1);

  // 2026-11-07 is Saturday -> chapters 16, 17, 18
  const satAssign = getTodayAssignment(state, '2026-11-07');
  assert.deepEqual(
    satAssign.chapters.map((c) => c.number),
    [16, 17, 18],
  );
  assert.equal(satAssign.dayIndexInCycle, 6);
});
