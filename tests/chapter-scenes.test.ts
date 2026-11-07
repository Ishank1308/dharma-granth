import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { SCENES, chapterScene, sceneAttrs, scenesFor, type SceneId } from '../lib/chapter-scenes';

const css = fs.readFileSync(path.join(__dirname, '..', 'app', 'styles', 'scenes.css'), 'utf8');

test('every Gita chapter and Ramayana kanda has a scene', () => {
  for (let k = 1; k <= 7; k++) assert.ok(chapterScene('ramayana', k), `Ramayana kanda ${k} has no scene`);
  for (let v = 1; v <= 6; v++) assert.ok(chapterScene('katha', v), `Katha valli ${v} has no scene`);
  for (let a = 1; a <= 13; a++) assert.ok(chapterScene('durgasaptashati', a), `Saptashati ${a} has no scene`);
  for (let ch = 1; ch <= 18; ch++) assert.ok(chapterScene('bhagavadgita', ch), `Gita ${ch} has no scene`);
  assert.equal(chapterScene('bhagavadgita', 19), undefined);
  assert.deepEqual(sceneAttrs('mandukya', 1), {});
});

test('every scene has words and a drawing', () => {
  for (const id of Object.keys(SCENES) as SceneId[]) {
    assert.ok(SCENES[id].en && SCENES[id].hi, `${id} needs English and Hindi`);
    assert.ok(css.includes(`[data-scene='${id}']`), `${id} has no rule in scenes.css`);
  }
});

test('every mapped scene exists and every drawing it uses is on disk', () => {
  for (const id of [...Object.values(scenesFor('bhagavadgita')), ...Object.values(scenesFor('ramayana')), ...Object.values(scenesFor('katha')), ...Object.values(scenesFor('durgasaptashati'))]) assert.ok(SCENES[id], `${id} is not a scene`);
  for (const [, file] of css.matchAll(/url\('\.\/scenes\/([a-z-]+\.svg)'\)/g)) {
    assert.ok(fs.existsSync(path.join(__dirname, '..', 'app', 'styles', 'scenes', file)), `${file} is missing`);
  }
});

test('each scene gives one size, repeat and position per mask layer', () => {
  for (const block of css.matchAll(/\[data-scene='([a-z-]+)'\] \{([^}]*)\}/g)) {
    const [, id, body] = block;
    const count = (prop: string) => {
      const m = body.match(new RegExp(`--scene-${prop}:([^;]*);`));
      return m ? m[1].split(',').length : -1;
    };
    const layers = count('mask');
    for (const prop of ['size', 'repeat', 'from', 'to']) assert.equal(count(prop), layers, `${id}: --scene-${prop}`);
  }
});
