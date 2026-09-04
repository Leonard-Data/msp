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

