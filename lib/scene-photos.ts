import { chapterScene, type SceneId } from './chapter-scenes';
import { chapterPainting, type PaintingId } from './chapter-paintings';
import { AVAILABLE_PHOTOS, PHOTO_CREDITS, PHOTO_FX } from './scene-photos.generated';
import type { ScriptureCategory } from '@/data/types';
import { BHAVAS, bhavaPhoto, scriptureBhava, type BhavaId } from './scripture-bhava';

/**
 * A real photograph or classical painting behind a chapter's verses, in place of the
 * drawn scene or painting. Every scene and painting maps to one photo subject here;
 * data/scene-photos/manifest.json names the public-domain or freely licensed image for
 * each, and scripts/build-scene-photos.mjs fetches, checks and compresses it. A chapter
 * whose photo has not been fetched yet keeps its drawing, so nothing ever points at a
 * missing file. app/styles/scene-photos.css draws it, with slow drift and a little light
 * moving over it (mist, embers, glints on water).
 *
 * Which picture a chapter ends up with also depends on the scripture's bhāva
 * (lib/scripture-bhava.ts): a picture that does not belong to the text's feeling, or a
 * chapter with none, shows one of the scripture's own pictures instead, and the bhāva
 * colours the picture (data-bhava).
 */
export const PHOTO_IDS = [
  'kurukshetra',
  'gita-chariot',
  'vishvarupa',
  'yogi',
  'ashram',
  'yajna',
  'dawn',
  'ganga',
  'kailash',
  'ocean',
  'forest',
  'palace',
  'lanka',
  'vrindavan',
  'devi',
  'cosmos',
  'lotus',
  'temple',
  'dusk',
  'storm',
  'stars',
  'pillar',
  'manuscript',
  'kishkindha',
  'setu',
  'lamp',
  // The texts' own figures, shown by the scripture's bhāva (lib/scripture-bhava.ts), not by a scene.
  'krishna',
  'shiva',
  'vishnu',
  'rama',
  'gurukul',
  'vyasa',
] as const;
export type PhotoId = (typeof PHOTO_IDS)[number];

const FROM_SCENE: Record<SceneId, PhotoId> = {
  kurukshetra: 'kurukshetra',
  chariot: 'gita-chariot',
  yajna: 'yajna',
  sunrise: 'dawn',
  lotus: 'lotus',
  dhyana: 'yogi',
  pearls: 'temple',
  'two-paths': 'dusk',
  offering: 'temple',
  himalaya: 'kailash',
  vishvarupa: 'vishvarupa',
  diyas: 'ganga',
  field: 'dawn',
  gunas: 'cosmos',
  ashvattha: 'forest',
  'dawn-storm': 'storm',
  vijaya: 'gita-chariot',
  ayodhya: 'palace',
  exile: 'forest',
  aranya: 'ashram',
  kishkindha: 'kishkindha',
  sundara: 'ocean',
  yuddha: 'setu',
  uttara: 'palace',
  'yama-door': 'dusk',
  'shreya-preya': 'dusk',
  ratha: 'gita-chariot',
  'inner-flame': 'lamp',
  jyoti: 'stars',
  'cosmic-ocean': 'ocean',
  'devi-battle': 'devi',
  'devi-victory': 'devi',
  'devi-stuti': 'devi',
  'devi-himalaya': 'kailash',
  kali: 'storm',
  'sky-battle': 'storm',
};

const FROM_PAINTING: Record<PaintingId, PhotoId> = {
  kurukshetra: 'kurukshetra',
  vishvarupa: 'vishvarupa',
  yogi: 'yogi',
  ashram: 'ashram',
  yajna: 'yajna',
  dawn: 'dawn',
  ganga: 'ganga',
  kailash: 'kailash',
  ocean: 'ocean',
  forest: 'forest',
  palace: 'palace',
  lanka: 'lanka',
  vrindavan: 'vrindavan',
  devi: 'devi',
  cosmos: 'cosmos',
  lotus: 'lotus',
  temple: 'temple',
  dusk: 'dusk',
  storm: 'storm',
  stars: 'stars',
  pillar: 'pillar',
  manuscript: 'manuscript',
};

const available = new Set<string>(AVAILABLE_PHOTOS);

/** The photo subject a chapter would show, whether or not it has been fetched yet. */
export function chapterPhotoSubject(scriptureId: string, chapterId: number): PhotoId | undefined {
  const scene = chapterScene(scriptureId, chapterId);
  if (scene) return FROM_SCENE[scene];
  const painting = chapterPainting(scriptureId, chapterId);
  return painting ? FROM_PAINTING[painting] : undefined;
}

const has = (id: string) => available.has(id);

/**
 * The photo to show behind this chapter's verses, only once its file exists. With the
 * scripture's category it is chosen in the scripture's bhāva; without it, by the chapter alone.
 */
export function chapterPhoto(scriptureId: string, chapterId: number, category?: ScriptureCategory): PhotoId | undefined {
  const id = chapterPhotoSubject(scriptureId, chapterId);
  if (category) return bhavaPhoto(scriptureId, scriptureBhava(scriptureId, category), chapterId, id, has, !!chapterScene(scriptureId, chapterId));
  return id && available.has(id) ? id : undefined;
}

/** Spread onto the page wrapper next to sceneAttrs: `<main {...photoAttrs(id, chapter, category)}>`. */
export function photoAttrs(
  scriptureId: string,
  chapterId: number,
  category?: ScriptureCategory,
): { 'data-photo'?: PhotoId; 'data-photo-fx'?: string; 'data-bhava'?: BhavaId } {
  const photo = chapterPhoto(scriptureId, chapterId, category);
  if (!photo) return {};
  const own = PHOTO_FX[photo] ?? 'none';
  if (!category) return { 'data-photo': photo, 'data-photo-fx': own };
  const bhava = scriptureBhava(scriptureId, category);
  // A picture with no light of its own (a painting, a temple) takes the light of the bhāva.
  return { 'data-photo': photo, 'data-photo-fx': own === 'none' ? BHAVAS[bhava].light : own, 'data-bhava': bhava };
}

export { PHOTO_CREDITS };
