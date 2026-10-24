/**
 * Wisdom Pathway canonical types (MISSION Phase 1).
 * Single import surface for the Pathway / Stage / Lesson / Verse /
 * Reflection / Concept / Question model. Nothing is redefined here:
 * Pathway, Verse and Reflection shapes live in data/wisdom-pathways.ts,
 * Concept in data/wisdom-concepts.ts, Question in data/wisdom-questions.ts.
 * This file adds the staged-reading model (Stage, Lesson), shared
 * stage/lesson builders, and structural validation. Backward compatible:
 * pure additions, no existing export is changed.
 */
import type {
  PathwaySection,
  PathwayVerseLens,
  WisdomPathway,
} from './wisdom-pathways';
import type { WisdomConcept } from './wisdom-concepts';
import type { WisdomQuestion } from './wisdom-questions';

export type {
  PathwaySection as WisdomPathwaySection,
  PathwayVerseLens as WisdomPathwayVerse,
  WisdomPathway,
  WisdomConcept,
  WisdomQuestion,
};

/**
 * One ordered stop on a pathway. A stage never copies scripture: it points
 * at the pathway's own verse lenses, reflection questions and contemplation
 * prompts by index, plus validated concept slugs. Out-of-range indexes and
 * unknown slugs are skipped at resolution time, never rendered.
 */
export interface WisdomPathwayStage {
  order: number;
  titleEn: string;
  titleHi: string;
  focusEn: string;
  focusHi: string;
  lensIndexes: number[];
  reflectionIndexes: number[];
  contemplationIndexes: number[];
  conceptSlugs: string[];
}

/** Smallest reading unit inside a stage (one verse, one question or one pause). */
export interface WisdomPathwayLesson {
  stageOrder: number;
  order: number;
  titleEn: string;
  titleHi: string;
  lensIndex?: number;
  reflectionIndex?: number;
  contemplationIndex?: number;
}

function nonEmpty(value: unknown, name: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`WisdomPathwayStage: ${name} must be a non-empty string.`);
  }
  return value;
}

function indexList(value: unknown, name: string): number[] {
  if (!Array.isArray(value)) {
    throw new Error(`WisdomPathwayStage: ${name} must be an array of indexes.`);
  }
  for (const n of value) {
    if (!Number.isInteger(n) || (n as number) < 0) {
      throw new Error(`WisdomPathwayStage: ${name} must hold non-negative integer indexes.`);
    }
  }
  return value as number[];
}

/** Structural validation for one stage (editorial links are resolved, not validated). */
export function assertValidWisdomPathwayStage(value: unknown): asserts value is WisdomPathwayStage {
  if (typeof value !== 'object' || value === null) {
    throw new Error('WisdomPathwayStage must be an object.');
  }
  const stage = value as Record<string, unknown>;
  if (!Number.isInteger(stage.order) || (stage.order as number) < 1) {
    throw new Error('WisdomPathwayStage.order must be a positive integer.');
  }
  nonEmpty(stage.titleEn, 'titleEn');
  nonEmpty(stage.titleHi, 'titleHi');
  nonEmpty(stage.focusEn, 'focusEn');
  nonEmpty(stage.focusHi, 'focusHi');
  indexList(stage.lensIndexes, 'lensIndexes');
  indexList(stage.reflectionIndexes, 'reflectionIndexes');
  indexList(stage.contemplationIndexes, 'contemplationIndexes');
  if (!Array.isArray(stage.conceptSlugs)) {
    throw new Error('WisdomPathwayStage.conceptSlugs must be an array.');
  }
}

/** Structural validation for one lesson. */
export function assertValidWisdomPathwayLesson(value: unknown): asserts value is WisdomPathwayLesson {
  if (typeof value !== 'object' || value === null) {
    throw new Error('WisdomPathwayLesson must be an object.');
  }
  const lesson = value as Record<string, unknown>;
  for (const key of ['stageOrder', 'order'] as const) {
    if (!Number.isInteger(lesson[key]) || (lesson[key] as number) < 1) {
      throw new Error(`WisdomPathwayLesson.${key} must be a positive integer.`);
    }
  }
  nonEmpty(lesson.titleEn, 'titleEn');
  nonEmpty(lesson.titleHi, 'titleHi');
  for (const key of ['lensIndex', 'reflectionIndex', 'contemplationIndex'] as const) {
    const n = lesson[key];
    if (n !== undefined && (!Number.isInteger(n) || (n as number) < 0)) {
      throw new Error(`WisdomPathwayLesson.${key} must be a non-negative integer when present.`);
    }
  }
}

/** Structural validation for a pathway record (links resolve elsewhere). */
export function validateWisdomPathway(pathway: WisdomPathway): void {
  for (const key of ['id', 'slug', 'titleEn', 'titleHi', 'questionEn'] as const) {
    const v = pathway[key];
    if (typeof v !== 'string' || v.trim().length === 0) {
      throw new Error(`WisdomPathway.${key} must be a non-empty string (${pathway.slug || 'unknown'}).`);
    }
  }
  if (!Array.isArray(pathway.verseLenses) || pathway.verseLenses.length === 0) {
    throw new Error(`WisdomPathway ${pathway.slug} needs at least one verse lens.`);
  }
}

export type NewWisdomPathwayStage = Omit<WisdomPathwayStage, 'lensIndexes' | 'reflectionIndexes' | 'contemplationIndexes' | 'conceptSlugs'> &
  Partial<Pick<WisdomPathwayStage, 'lensIndexes' | 'reflectionIndexes' | 'contemplationIndexes' | 'conceptSlugs'>>;

/** Shared stage builder (MISSION Phase 2): fills index-array defaults. */
export function buildWisdomStage(def: NewWisdomPathwayStage): WisdomPathwayStage {
  const stage: WisdomPathwayStage = {
    ...def,
    lensIndexes: def.lensIndexes ?? [],
    reflectionIndexes: def.reflectionIndexes ?? [],
    contemplationIndexes: def.contemplationIndexes ?? [],
    conceptSlugs: def.conceptSlugs ?? [],
  };
  assertValidWisdomPathwayStage(stage);
  return stage;
}

/** Shared stage-list builder: assigns 1-based order from array position. */
export function buildWisdomStages(
  defs: Array<Omit<NewWisdomPathwayStage, 'order'> & { order?: number }>,
): WisdomPathwayStage[] {
  return defs.map((def, i) => buildWisdomStage({ ...def, order: i + 1 }));
}

export type NewWisdomPathwayLesson = Omit<WisdomPathwayLesson, 'order'> & { order?: number };

/** Shared lesson builder (MISSION Phase 2). */
export function buildWisdomLesson(def: NewWisdomPathwayLesson & { order: number }): WisdomPathwayLesson {
  const lesson: WisdomPathwayLesson = {
    stageOrder: def.stageOrder,
    order: def.order,
    titleEn: def.titleEn,
    titleHi: def.titleHi,
    ...(def.lensIndex !== undefined ? { lensIndex: def.lensIndex } : {}),
    ...(def.reflectionIndex !== undefined ? { reflectionIndex: def.reflectionIndex } : {}),
    ...(def.contemplationIndex !== undefined ? { contemplationIndex: def.contemplationIndex } : {}),
  };
  assertValidWisdomPathwayLesson(lesson);
  return lesson;
}
