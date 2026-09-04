import { PNG } from 'pngjs';

const DOWNSCALE = 96;

export function layoutSimilarityScore(leftBuffer, rightBuffer, size = DOWNSCALE) {
  const leftImage = decodePng(leftBuffer);
  const portrait = leftImage.width < 1200 && leftImage.height > leftImage.width * 3;
  const leftGrid = toLuminanceGrid(leftImage, size);
  const rightGrid = toLuminanceGrid(rightBuffer, size);
  const mirroredRightGrid = toMirroredGrid(rightGrid, size);
  const leftHorizontal = toDirectionalSignature(leftGrid, size, 1, 0);
  const rightHorizontal = toDirectionalSignature(rightGrid, size, 1, 0);
  const leftVertical = toDirectionalSignature(leftGrid, size, 0, 1);
  const rightVertical = toDirectionalSignature(rightGrid, size, 0, 1);

  const score = similarity(leftGrid, rightGrid);
  const mirroredScore = similarity(leftGrid, mirroredRightGrid);
  const edgeEnergyScore = relativeEnergy(leftHorizontal, rightHorizontal, leftVertical, rightVertical);

  if (edgeEnergyScore < 0.08) return score * edgeEnergyScore;
  if (portrait && mirroredScore + 0.005 >= score) return score * 0.5;
  return score;
}

function decodePng(buffer) {
  return PNG.sync.read(buffer);
}

function toLuminanceGrid(imageOrBuffer, size) {
  const png = imageOrBuffer?.data ? imageOrBuffer : decodePng(imageOrBuffer);
  const cellWidth = png.width / size;
  const cellHeight = png.height / size;
  const values = [];

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const startX = Math.floor(col * cellWidth);
      const endX = Math.max(startX + 1, Math.floor((col + 1) * cellWidth));
      const startY = Math.floor(row * cellHeight);
      const endY = Math.max(startY + 1, Math.floor((row + 1) * cellHeight));
      let total = 0;
      let count = 0;

      for (let y = startY; y < endY; y += 1) {
        for (let x = startX; x < endX; x += 1) {
          const index = (png.width * y + x) << 2;
          const r = png.data[index];
          const g = png.data[index + 1];
          const b = png.data[index + 2];
          total += 0.299 * r + 0.587 * g + 0.114 * b;
          count += 1;
        }
      }

      values.push(total / (count * 255));
    }
  }

  return values;
}

function toMirroredGrid(grid, size) {
  const mirrored = [];
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      mirrored.push(grid[row * size + (size - col - 1)]);
    }
  }
  return mirrored;
}

function toDirectionalSignature(grid, size, dx, dy) {
  const gradients = [];

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const nextRow = row + dy;
      const nextCol = col + dx;
      if (nextRow >= size || nextCol >= size) continue;
      const index = row * size + col;
      const nextIndex = nextRow * size + nextCol;
      gradients.push(grid[nextIndex] - grid[index]);
    }
  }

  return gradients;
}

function similarity(left, right, maxDiff = 1) {
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) diff += Math.abs(left[index] - right[index]);
  return 1 - diff / (left.length * maxDiff);
}

function relativeEnergy(...signatures) {
  const means = signatures.map((values) => averageMagnitude(values));
  const strongest = Math.max(...means);
  if (!strongest) return 1;
  return Math.min(...means) / strongest;
}

function averageMagnitude(values) {
  return values.reduce((sum, value) => sum + Math.abs(value), 0) / values.length;
}
