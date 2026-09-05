import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { evaluateLayoutProof } from './e2e/reference-layout-metric.mjs';

const fixtureDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'e2e', 'fixtures');

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
  const blanked = PNG.sync.read(reference);
  for (let y = 0; y < Math.floor(blanked.height / 2); y += 1) {
    for (let x = 0; x < blanked.width; x += 1) {
      const index = (blanked.width * y + x) << 2;
      blanked.data[index] = 245;
      blanked.data[index + 1] = 245;
      blanked.data[index + 2] = 245;
      blanked.data[index + 3] = 255;
    }
  }

  const proof = evaluateLayoutProof(PNG.sync.write(blanked), reference, 'desktop-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects a blanked 30%-50% desktop region', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-desktop.png'));
  const blanked = PNG.sync.read(reference);
  for (let y = Math.floor(blanked.height * 0.3); y < Math.floor(blanked.height * 0.5); y += 1) {
    for (let x = 0; x < blanked.width; x += 1) {
      const index = (blanked.width * y + x) << 2;
      blanked.data[index] = 245;
      blanked.data[index + 1] = 245;
      blanked.data[index + 2] = 245;
      blanked.data[index + 3] = 255;
    }
  }

  const proof = evaluateLayoutProof(PNG.sync.write(blanked), reference, 'desktop-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects a blank lower half on desktop', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-desktop.png'));
  const blanked = PNG.sync.read(reference);
  for (let y = Math.floor(blanked.height / 2); y < blanked.height; y += 1) {
    for (let x = 0; x < blanked.width; x += 1) {
      const index = (blanked.width * y + x) << 2;
      blanked.data[index] = 245;
      blanked.data[index + 1] = 245;
      blanked.data[index + 2] = 245;
      blanked.data[index + 3] = 255;
    }
  }

  const proof = evaluateLayoutProof(PNG.sync.write(blanked), reference, 'desktop-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects a desktop stats band replaced by category structure', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-desktop.png'));
  const src = PNG.sync.read(reference);
  const replaced = PNG.sync.read(reference);
  const fromStart = Math.floor(src.height * 0.16);
  const fromEnd = Math.floor(src.height * 0.18);
  const toStart = Math.floor(src.height * 0.08);
  const toEnd = Math.floor(src.height * 0.16);
  const fromHeight = fromEnd - fromStart;
  const toHeight = toEnd - toStart;

  for (let y = 0; y < toHeight; y += 1) {
    for (let x = 0; x < src.width; x += 1) {
      const sourceY = fromStart + Math.min(fromHeight - 1, Math.floor((y * fromHeight) / toHeight));
      const from = (src.width * sourceY + x) << 2;
      const to = (src.width * (toStart + y) + x) << 2;
      replaced.data[to] = src.data[from];
      replaced.data[to + 1] = src.data[from + 1];
      replaced.data[to + 2] = src.data[from + 2];
      replaced.data[to + 3] = src.data[from + 3];
    }
  }

  const proof = evaluateLayoutProof(PNG.sync.write(replaced), reference, 'desktop-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects a desktop contribution band replaced by featured-shelf structure', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-desktop.png'));
  const src = PNG.sync.read(reference);
  const replaced = PNG.sync.read(reference);
  const fromStart = Math.floor(src.height * 0.18);
  const fromEnd = Math.floor(src.height * 0.46);
  const toStart = Math.floor(src.height * 0.46);
  const toEnd = src.height;
  const fromHeight = fromEnd - fromStart;
  const toHeight = toEnd - toStart;

  for (let y = 0; y < toHeight; y += 1) {
    for (let x = 0; x < src.width; x += 1) {
      const sourceY = fromStart + Math.min(fromHeight - 1, Math.floor((y * fromHeight) / toHeight));
      const from = (src.width * sourceY + x) << 2;
      const to = (src.width * (toStart + y) + x) << 2;
      replaced.data[to] = src.data[from];
      replaced.data[to + 1] = src.data[from + 1];
      replaced.data[to + 2] = src.data[from + 2];
      replaced.data[to + 3] = src.data[from + 3];
    }
  }

  const proof = evaluateLayoutProof(PNG.sync.write(replaced), reference, 'desktop-chromium');
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

test('layout proof rejects a mobile category band replaced by hero structure', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-mobile.png'));
  const src = PNG.sync.read(reference);
  const replaced = PNG.sync.read(reference);
  const fromStart = 0;
  const fromEnd = Math.floor(src.height * 0.08);
  const toStart = Math.floor(src.height * 0.16);
  const toEnd = Math.floor(src.height * 0.18);
  const fromHeight = fromEnd - fromStart;
  const toHeight = toEnd - toStart;

  for (let y = 0; y < toHeight; y += 1) {
    for (let x = 0; x < src.width; x += 1) {
      const sourceY = fromStart + Math.min(fromHeight - 1, Math.floor((y * fromHeight) / toHeight));
      const from = (src.width * sourceY + x) << 2;
      const to = (src.width * (toStart + y) + x) << 2;
      replaced.data[to] = src.data[from];
      replaced.data[to + 1] = src.data[from + 1];
      replaced.data[to + 2] = src.data[from + 2];
      replaced.data[to + 3] = src.data[from + 3];
    }
  }

  const proof = evaluateLayoutProof(PNG.sync.write(replaced), reference, 'mobile-chromium');
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

 test('layout proof rejects a desktop hero band replaced by contribution structure', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-desktop.png'));
  const src = PNG.sync.read(reference);
  const replaced = PNG.sync.read(reference);
  const fromStart = Math.floor(src.height * 0.46);
  const fromEnd = src.height;
  const toStart = 0;
  const toEnd = Math.floor(src.height * 0.08);
  const fromHeight = fromEnd - fromStart;
  const toHeight = toEnd - toStart;

  for (let y = 0; y < toHeight; y += 1) {
    for (let x = 0; x < src.width; x += 1) {
      const sourceY = fromStart + Math.min(fromHeight - 1, Math.floor((y * fromHeight) / toHeight));
      const from = (src.width * sourceY + x) << 2;
      const to = (src.width * (toStart + y) + x) << 2;
      replaced.data[to] = src.data[from];
      replaced.data[to + 1] = src.data[from + 1];
      replaced.data[to + 2] = src.data[from + 2];
      replaced.data[to + 3] = src.data[from + 3];
    }
  }

  const proof = evaluateLayoutProof(PNG.sync.write(replaced), reference, 'desktop-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects a mobile hero band replaced by contribution structure', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-mobile.png'));
  const src = PNG.sync.read(reference);
  const replaced = PNG.sync.read(reference);
  const fromStart = Math.floor(src.height * 0.46);
  const fromEnd = src.height;
  const toStart = 0;
  const toEnd = Math.floor(src.height * 0.08);
  const fromHeight = fromEnd - fromStart;
  const toHeight = toEnd - toStart;

  for (let y = 0; y < toHeight; y += 1) {
    for (let x = 0; x < src.width; x += 1) {
      const sourceY = fromStart + Math.min(fromHeight - 1, Math.floor((y * fromHeight) / toHeight));
      const from = (src.width * sourceY + x) << 2;
      const to = (src.width * (toStart + y) + x) << 2;
      replaced.data[to] = src.data[from];
      replaced.data[to + 1] = src.data[from + 1];
      replaced.data[to + 2] = src.data[from + 2];
      replaced.data[to + 3] = src.data[from + 3];
    }
  }

  const proof = evaluateLayoutProof(PNG.sync.write(replaced), reference, 'mobile-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects a mobile featured-shelf band replaced by contribution structure', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-mobile.png'));
  const src = PNG.sync.read(reference);
  const replaced = PNG.sync.read(reference);
  const fromStart = Math.floor(src.height * 0.46);
  const fromEnd = src.height;
  const toStart = Math.floor(src.height * 0.18);
  const toEnd = Math.floor(src.height * 0.46);
  const fromHeight = fromEnd - fromStart;
  const toHeight = toEnd - toStart;

  for (let y = 0; y < toHeight; y += 1) {
    for (let x = 0; x < src.width; x += 1) {
      const sourceY = fromStart + Math.min(fromHeight - 1, Math.floor((y * fromHeight) / toHeight));
      const from = (src.width * sourceY + x) << 2;
      const to = (src.width * (toStart + y) + x) << 2;
      replaced.data[to] = src.data[from];
      replaced.data[to + 1] = src.data[from + 1];
      replaced.data[to + 2] = src.data[from + 2];
      replaced.data[to + 3] = src.data[from + 3];
    }
  }

  const proof = evaluateLayoutProof(PNG.sync.write(replaced), reference, 'mobile-chromium');
  assert.equal(proof.passes, false);
});

test('layout proof rejects a mobile contribution band replaced by featured-shelf structure', () => {
  const reference = readFileSync(path.join(fixtureDir, 'reference-home-mobile.png'));
  const src = PNG.sync.read(reference);
  const replaced = PNG.sync.read(reference);
  const fromStart = Math.floor(src.height * 0.18);
  const fromEnd = Math.floor(src.height * 0.46);
  const toStart = Math.floor(src.height * 0.46);
  const toEnd = src.height;
  const fromHeight = fromEnd - fromStart;
  const toHeight = toEnd - toStart;

  for (let y = 0; y < toHeight; y += 1) {
    for (let x = 0; x < src.width; x += 1) {
      const sourceY = fromStart + Math.min(fromHeight - 1, Math.floor((y * fromHeight) / toHeight));
      const from = (src.width * sourceY + x) << 2;
      const to = (src.width * (toStart + y) + x) << 2;
      replaced.data[to] = src.data[from];
      replaced.data[to + 1] = src.data[from + 1];
      replaced.data[to + 2] = src.data[from + 2];
      replaced.data[to + 3] = src.data[from + 3];
    }
  }

  const proof = evaluateLayoutProof(PNG.sync.write(replaced), reference, 'mobile-chromium');
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

