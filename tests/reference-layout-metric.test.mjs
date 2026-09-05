import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { evaluateLayoutProof } from './e2e/reference-layout-metric.mjs';

const fixtureDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'e2e', 'fixtures');
const BAND_BREAKS = [0, 0.08, 0.16, 0.18, 0.46, 1];
const BAND_LABELS = ['hero/search', 'stats', 'category', 'featured-shelf', 'contribution'];
const BAND_SLICE_COUNT = 4;

function blankRange(reference, start, end) {
  const png = PNG.sync.read(reference);
  const startY = Math.floor(png.height * start);
  const endY = Math.floor(png.height * end);

  for (let y = startY; y < endY; y += 1) {
    for (let x = 0; x < png.width; x += 1) {
      const index = (png.width * y + x) << 2;
      png.data[index] = 245;
      png.data[index + 1] = 245;
      png.data[index + 2] = 245;
      png.data[index + 3] = 255;
    }
  }

  return PNG.sync.write(png);
}

function replaceRange(reference, fromStart, fromEnd, toStart, toEnd) {
  const src = PNG.sync.read(reference);
  const replaced = PNG.sync.read(reference);
  const fromStartY = Math.floor(src.height * fromStart);
  const fromEndY = Math.floor(src.height * fromEnd);
  const toStartY = Math.floor(src.height * toStart);
  const toEndY = Math.floor(src.height * toEnd);
  const fromHeight = Math.max(1, fromEndY - fromStartY);
  const toHeight = Math.max(1, toEndY - toStartY);

  for (let y = 0; y < toHeight; y += 1) {
    for (let x = 0; x < src.width; x += 1) {
      const sourceY = fromStartY + Math.min(fromHeight - 1, Math.floor((y * fromHeight) / toHeight));
      const from = (src.width * sourceY + x) << 2;
      const to = (src.width * (toStartY + y) + x) << 2;
      replaced.data[to] = src.data[from];
      replaced.data[to + 1] = src.data[from + 1];
      replaced.data[to + 2] = src.data[from + 2];
      replaced.data[to + 3] = src.data[from + 3];
    }
  }

  return PNG.sync.write(replaced);
}

function replaceBand(reference, fromIndex, toIndex) {
  return replaceRange(
    reference,
    BAND_BREAKS[fromIndex],
    BAND_BREAKS[fromIndex + 1],
    BAND_BREAKS[toIndex],
    BAND_BREAKS[toIndex + 1],
  );
}

function bandSliceRange(bandIndex, sliceIndex, slices = BAND_SLICE_COUNT) {
  const start = BAND_BREAKS[bandIndex];
  const end = BAND_BREAKS[bandIndex + 1];
  const span = end - start;
  return {
    start: start + (span * sliceIndex) / slices,
    end: start + (span * (sliceIndex + 1)) / slices,
  };
}

function replaceBandSlice(reference, bandIndex, fromSliceIndex, toSliceIndex) {
  const fromRange = bandSliceRange(bandIndex, fromSliceIndex);
  const toRange = bandSliceRange(bandIndex, toSliceIndex);
  return replaceRange(reference, fromRange.start, fromRange.end, toRange.start, toRange.end);
}

for (const [projectName, fixture] of [
  ['desktop-chromium', 'reference-home-desktop.png'],
  ['mobile-chromium', 'reference-home-mobile.png'],
]) {
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

    const proof = evaluateLayoutProof(PNG.sync.write(solid), reference, projectName);
    assert.equal(proof.passes, false);
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

  const proof = evaluateLayoutProof(PNG.sync.write(shifted), reference, 'desktop-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects a blank top half on desktop', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-desktop.png'));
  const proof = evaluateLayoutProof(blankRange(reference, 0, 0.5), reference, 'desktop-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects a blanked 30%-50% desktop region', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-desktop.png'));
  const proof = evaluateLayoutProof(blankRange(reference, 0.3, 0.5), reference, 'desktop-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects a blank lower half on desktop', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-desktop.png'));
  const proof = evaluateLayoutProof(blankRange(reference, 0.5, 1), reference, 'desktop-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects a blanked desktop contribution slice', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-desktop.png'));
  const proof = evaluateLayoutProof(blankRange(reference, 0.46, 0.7), reference, 'desktop-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects a blanked desktop hero slice', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-desktop.png'));
  const proof = evaluateLayoutProof(blankRange(reference, 0, 0.04), reference, 'desktop-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects a partially replaced desktop contribution slice', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-desktop.png'));
  const proof = evaluateLayoutProof(replaceRange(reference, 0.18, 0.3, 0.46, 0.6), reference, 'desktop-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects a desktop contribution slice replaced by another contribution slice', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-desktop.png'));
  const proof = evaluateLayoutProof(replaceBandSlice(reference, 4, 1, 0), reference, 'desktop-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects a desktop category slice replaced by another category slice', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-desktop.png'));
  const proof = evaluateLayoutProof(replaceBandSlice(reference, 2, 1, 0), reference, 'desktop-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects swapped top and bottom halves on desktop', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-desktop.png'));
  const png = PNG.sync.read(reference);
  const swapped = new PNG({ width: png.width, height: png.height });
  const middle = Math.floor(png.height / 2);

  for (let y = 0; y < png.height; y += 1) {
    for (let x = 0; x < png.width; x += 1) {
      const sourceY = y < middle ? y + middle : y - middle;
      if (sourceY >= png.height) continue;
      const from = (png.width * sourceY + x) << 2;
      const to = (png.width * y + x) << 2;
      swapped.data[to] = png.data[from];
      swapped.data[to + 1] = png.data[from + 1];
      swapped.data[to + 2] = png.data[from + 2];
      swapped.data[to + 3] = png.data[from + 3];
    }
  }

  const proof = evaluateLayoutProof(PNG.sync.write(swapped), reference, 'desktop-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects a downward shift on mobile', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-mobile.png'));
  const png = PNG.sync.read(reference);
  const shifted = new PNG({ width: png.width, height: png.height });
  const offset = 100;

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

  const proof = evaluateLayoutProof(PNG.sync.write(shifted), reference, 'mobile-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects a blanked mobile hero slice', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-mobile.png'));
  const proof = evaluateLayoutProof(blankRange(reference, 0, 0.04), reference, 'mobile-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects a partially replaced mobile contribution slice', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-mobile.png'));
  const proof = evaluateLayoutProof(replaceRange(reference, 0.18, 0.32, 0.46, 0.73), reference, 'mobile-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects a mobile contribution slice replaced by another contribution slice', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-mobile.png'));
  const proof = evaluateLayoutProof(replaceBandSlice(reference, 4, 1, 0), reference, 'mobile-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects a mobile hero slice replaced by another hero slice', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-mobile.png'));
  const proof = evaluateLayoutProof(replaceBandSlice(reference, 0, 3, 0), reference, 'mobile-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects swapped top quarter-bands on mobile', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-mobile.png'));
  const png = PNG.sync.read(reference);
  const swapped = PNG.sync.read(reference);
  const quarter = Math.floor(png.height / 4);

  for (let y = 0; y < quarter * 2; y += 1) {
    for (let x = 0; x < png.width; x += 1) {
      const sourceY = y < quarter ? y + quarter : y - quarter;
      const from = (png.width * sourceY + x) << 2;
      const to = (png.width * y + x) << 2;
      swapped.data[to] = png.data[from];
      swapped.data[to + 1] = png.data[from + 1];
      swapped.data[to + 2] = png.data[from + 2];
      swapped.data[to + 3] = png.data[from + 3];
    }
  }

  const proof = evaluateLayoutProof(PNG.sync.write(swapped), reference, 'mobile-chromium');
  assert.equal(proof.passes, false);
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

  const proof = evaluateLayoutProof(PNG.sync.write(mirrored), reference, 'mobile-chromium');
  assert.equal(proof.passes, false);
});

for (const [projectName, fixture] of [
  ['desktop-chromium', 'reference-home-desktop.png'],
  ['mobile-chromium', 'reference-home-mobile.png'],
]) {
  test(`layout proof rejects every named band substitution for ${projectName}`, () => {
    const reference = readFileSync(path.join(fixtureDir, fixture));

    for (let toIndex = 0; toIndex < BAND_LABELS.length; toIndex += 1) {
      for (let fromIndex = 0; fromIndex < BAND_LABELS.length; fromIndex += 1) {
        if (fromIndex === toIndex) continue;
        const proof = evaluateLayoutProof(replaceBand(reference, fromIndex, toIndex), reference, projectName);
        assert.equal(
          proof.passes,
          false,
          `${projectName} should reject ${BAND_LABELS[fromIndex]} -> ${BAND_LABELS[toIndex]} but passed with ${proof.overallScore.toFixed(4)}`,
        );
      }
    }
  });
}
