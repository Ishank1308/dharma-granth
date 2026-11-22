/**
 * Study orders must be eleven named lists of pages that already exist.
 * Run from the repo root:
 * node .\node_modules\tsx\dist\cli.mjs scripts\test-study-plans.ts
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { CONCEPT_DETAILS } from '../data/concept-details';
import { GUIDED_READING_PATHS } from '../data/guided-reading-paths';
import { learningPaths } from '../data/learning-paths';
import { PATHWAY_ID_ALIASES } from '../data/pathways';
import {
  STARTER_PLAN_ID,
  STUDY_PLANS,
  completedStepIds,
  milestoneLabel,
  planMinutes,
  todayStep,
  type StudyPlan,
} from '../data/study-plans';
import { publishedChapterNumbers } from '../lib/ashtavakra';
import { VERSE_PAGE_SCRIPTURE_IDS } from '../lib/verse-paths';
import { wisdomTopics } from '../data/wisdom-for-life';

const EXPECTED = [
  'plan-beginner-spirituality',
  'plan-gita-essentials',
  'plan-self-discovery',
  'plan-karma-yoga',
  'plan-bhakti-yoga',
  'plan-vedanta-foundations',
  'plan-student',
  'plan-leadership',
  'plan-stress-relief',
  'plan-purpose-discovery',
  'plan-meditation-journey',
];

assert.deepEqual(STUDY_PLANS.map((plan) => plan.id), EXPECTED);
assert.equal(STUDY_PLANS[0]?.id, STARTER_PLAN_ID);

const taken = new Set<string>([
  ...learningPaths.map((course) => course.id),
  ...Object.keys(PATHWAY_ID_ALIASES),
  ...GUIDED_READING_PATHS.map((item) => item.id),
]);
const stepIds = new Set<string>();
const wisdomSlugs = new Set(wisdomTopics.map((topic) => topic.slug));
const publishedAshtavakra = new Set(publishedChapterNumbers());
const verseScriptures = new Set<string>(VERSE_PAGE_SCRIPTURE_IDS);

for (const plan of STUDY_PLANS) {
  assert.ok(plan.titleHi.length > 0 && plan.titleEn.length > 0);
  assert.ok(plan.blurbHi.length > 0 && plan.blurbEn.length > 0);
  assert.equal(taken.has(plan.id), false, plan.id);
  taken.add(plan.id);
  assert.ok(plan.steps.length >= 4, plan.id);
  if (plan.nextPlanId) {
    assert.notEqual(plan.nextPlanId, plan.id);
    assert.ok(EXPECTED.includes(plan.nextPlanId), plan.nextPlanId);
  }
  assert.equal(planMinutes(plan), plan.steps.reduce((sum, item) => sum + item.minutes, 0));
  for (const item of plan.steps) {
    assert.equal(stepIds.has(item.id), false, item.id);
    stepIds.add(item.id);
    assert.ok(item.noteHi.length > 0 && item.noteHi.length < 180);
    assert.ok(item.noteEn.length > 0 && item.noteEn.length < 180);
    assert.equal(item.noteHi.includes('॥'), false, item.id);
    assert.equal(item.noteEn.includes('॥'), false, item.id);
    assertHref(plan, item.kind, item.href, item.minutes);
  }
}

assert.equal(milestoneLabel(0, 6), null);
assert.equal(milestoneLabel(2, 6), null);
assert.equal(milestoneLabel(3, 6), 'half');
assert.equal(milestoneLabel(6, 6), 'complete');
assert.equal(milestoneLabel(2, 5), null);
assert.equal(milestoneLabel(3, 5), 'half');

const beginner = STUDY_PLANS[0] as StudyPlan;
const empty = todayStep(STUDY_PLANS, []);
assert.equal(empty.kind, 'start');
if (empty.kind === 'start') {
  assert.equal(empty.plan.id, STARTER_PLAN_ID);
  assert.equal(empty.step.id, beginner.steps[0]?.id);
}

const partial = todayStep(STUDY_PLANS, [{
  pathwayId: STARTER_PLAN_ID,
  completedSteps: [beginner.steps[0]!.id, beginner.steps[1]!.id],
  startedAt: '2026-01-01T00:00:00.000Z',
}]);
assert.equal(partial.kind, 'resume');
if (partial.kind === 'resume') assert.equal(partial.step.id, beginner.steps[2]?.id);

const stale = todayStep(STUDY_PLANS, [{
  pathwayId: STARTER_PLAN_ID,
  completedSteps: ['missing-step'],
  startedAt: '2026-01-01T00:00:00.000Z',
}]);
assert.equal(stale.kind, 'start');
assert.deepEqual(completedStepIds(beginner, ['missing-step']), []);

const karma = STUDY_PLANS.find((plan) => plan.id === 'plan-karma-yoga') as StudyPlan;
const stress = STUDY_PLANS.find((plan) => plan.id === 'plan-stress-relief') as StudyPlan;
const later = todayStep(STUDY_PLANS, [
  {
    pathwayId: stress.id,
    completedSteps: [stress.steps[0]!.id],
    startedAt: '2026-02-01T00:00:00.000Z',
  },
  {
    pathwayId: karma.id,
    completedSteps: [karma.steps[0]!.id],
    startedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    pathwayId: STARTER_PLAN_ID,
    completedSteps: beginner.steps.map((item) => item.id),
    startedAt: '2026-01-01T00:00:00.000Z',
    completedAt: '2026-01-02T00:00:00.000Z',
  },
]);
assert.equal(later.kind, 'resume');
if (later.kind === 'resume') {
  assert.equal(later.plan.id, karma.id);
  assert.equal(later.step.id, karma.steps[1]?.id);
}

const afterStarter = todayStep(STUDY_PLANS, [{
  pathwayId: STARTER_PLAN_ID,
  completedSteps: beginner.steps.map((item) => item.id),
  startedAt: '2026-01-01T00:00:00.000Z',
  completedAt: '2026-01-02T00:00:00.000Z',
}]);
assert.equal(afterStarter.kind, 'next');
if (afterStarter.kind === 'next') assert.equal(afterStarter.plan.id, 'plan-gita-essentials');

const allDone = todayStep(
  STUDY_PLANS,
  STUDY_PLANS.map((plan) => ({
    pathwayId: plan.id,
    completedSteps: plan.steps.map((item) => item.id),
    startedAt: '2026-01-01T00:00:00.000Z',
    completedAt: '2026-01-02T00:00:00.000Z',
  })),
);
assert.equal(allDone.kind, 'done');

for (const guidedPath of GUIDED_READING_PATHS) {
  assert.equal(/[०-९]/.test(JSON.stringify(guidedPath)), false, `${guidedPath.id} contains Devanagari digits`);
  for (const v of guidedPath.verses) {
    const file = path.join('public', 'data', 'scriptures-full', v.scriptureId, `ch-${v.chapter}.json`);
    const data = JSON.parse(fs.readFileSync(file, 'utf8')) as {
      chapter: { verses: Array<{ number: number | string; sanskrit: string }> };
    };
    const canonical = data.chapter.verses.find((verse) => String(verse.number) === String(v.verse));
    assert.ok(canonical, `${guidedPath.id} missing ${v.scriptureId} ${v.chapter}.${v.verse}`);
    const normSa = (s: string) => s.replace(/ऽ/g, '').replace(/ं/g, 'म्');
    const snippetPrefix = v.sanskritSnippet.replace(/(?:\.{3}|…)\s*$/, '').split(/[।\s]+/)[0] ?? '';
    if (snippetPrefix) {
      assert.ok(
        normSa(canonical.sanskrit).includes(normSa(snippetPrefix)),
        `${guidedPath.id} ${v.scriptureId} ${v.chapter}.${v.verse} snippet mismatch: ${snippetPrefix}`,
      );
    }
  }
}

console.log('study plan tests passed');

function assertHref(plan: StudyPlan, kind: string, href: string, minutes: number): void {
  if (kind === 'concept') {
    const id = href.match(/^\/concepts\/([a-z0-9-]+)$/)?.[1];
    assert.ok(id && CONCEPT_DETAILS[id], `${plan.id} ${href}`);
    assert.equal(minutes, 5);
    return;
  }
  if (kind === 'wisdom') {
    const slug = href.match(/^\/wisdom-for-life\/([a-z0-9-]+)$/)?.[1];
    assert.ok(slug && wisdomSlugs.has(slug), `${plan.id} ${href}`);
    assert.equal(minutes, 6);
    return;
  }
  if (kind === 'verse') {
    const match = href.match(/^\/scripture\/([a-z0-9]+)\/chapter\/(\d+)\/verse\/(\d+)$/);
    assert.ok(match, href);
    const scriptureId = match[1] as string;
    const chapter = match[2] as string;
    const verseNumber = match[3] as string;
    assert.ok(verseScriptures.has(scriptureId), scriptureId);
    const file = path.join('public', 'data', 'scriptures-full', scriptureId, `ch-${chapter}.json`);
    const data = JSON.parse(fs.readFileSync(file, 'utf8')) as {
      chapter: { verses: Array<{ number: number | string }> };
    };
    const found = data.chapter.verses.some((verse) => String(verse.number) === verseNumber);
    assert.equal(found, true, href);
    assert.equal(minutes, 8);
    return;
  }
  if (kind === 'chapter') {
    const chapter = href.match(/^\/ashtavakra\/(\d+)$/)?.[1];
    assert.ok(chapter && publishedAshtavakra.has(Number(chapter)), href);
    assert.equal(minutes, 12);
    return;
  }
  assert.fail(kind);
}
