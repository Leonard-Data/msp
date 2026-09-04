import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { layoutSimilarityScore } from './e2e/reference-layout-metric.mjs';
import { passesLayoutThreshold } from './e2e/reference-layout-threshold.mjs';

const fixtureDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'e2e', 'fixtures');

for (const fixture of ['reference-home-desktop.png', 'reference-home-mobile.png']) {
  test(`layout proof rejects solid-color image for ${fixture}`, () => {
    const reference = readFileSync(path.join(fixtureDir, fixture));
    const png = PNG.sync.read(reference);
    const solid = new PNG({ width: png.width, height: png.height });
    for (let index = 0; index < solid.data.length; index += 4) {
      solid.data[index] = 245;
      solid.data[index + 1] = 245;
      solid.data[index + 2] = 245;
      solid.data[index + 3] = 255;
    }

    const score = layoutSimilarityScore(PNG.sync.write(solid), reference);
    assert.equal(passesLayoutThreshold(score), false);
  });
}

test('layout proof rejects a large vertical shift of the desktop reference', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-desktop.png'));
  const png = PNG.sync.read(reference);
  const shifted = new PNG({ width: png.width, height: png.height });
  const offset = 200;

  for (let y = 0; y < png.height - offset; y += 1) {
    for (let x = 0; x < png.width; x += 1) {
      const from = (png.width * y + x) << 2;
      const to = (png.width * (y + offset) + x) << 2;
      shifted.data[to] = png.data[from];
      shifted.data[to + 1] = png.data[from + 1];
      shifted.data[to + 2] = png.data[from + 2];
      shifted.data[to + 3] = png.data[from + 3];
    }
  }

  const score = layoutSimilarityScore(PNG.sync.write(shifted), reference);
  assert.equal(passesLayoutThreshold(score), false);
});

test('layout proof rejects a mirrored mobile reference', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-mobile.png'));
  const png = PNG.sync.read(reference);
  const mirrored = new PNG({ width: png.width, height: png.height });

  for (let y = 0; y < png.height; y += 1) {
    for (let x = 0; x < png.width; x += 1) {
      const from = (png.width * y + x) << 2;
      const to = (png.width * y + (png.width - x - 1)) << 2;
      mirrored.data[to] = png.data[from];
      mirrored.data[to + 1] = png.data[from + 1];
      mirrored.data[to + 2] = png.data[from + 2];
      mirrored.data[to + 3] = png.data[from + 3];
    }
  }

  const score = layoutSimilarityScore(PNG.sync.write(mirrored), reference);
  assert.equal(passesLayoutThreshold(score), false);
});
