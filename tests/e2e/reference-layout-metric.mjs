import { PNG } from 'pngjs';
import { passesLayoutThreshold } from './reference-layout-threshold.mjs';

const GRID_SIZE = 96;

const PROJECT_RULES = {
  'desktop-chromium': {
    bands: [0, 0.08, 0.16, 0.2, 0.62, 1],
    labels: ['hero/search', 'stats', 'category', 'featured-shelf', 'contribution'],
    minBandScores: [0.895, 0.887, 0.92, 0.93, 0.91],
    minBandEnergies: [0.008, 0.008, 0.01, 0.005, 0.001],
  },
  'mobile-chromium': {
    bands: [0, 0.08, 0.16, 0.2, 0.62, 1],
    labels: ['hero/search', 'stats', 'category', 'featured-shelf', 'contribution'],
    minBandScores: [0.89, 0.85, 0.89, 0.91, 0.91],
    minBandEnergies: [0.02, 0.05, 0.03, 0.03, 0.03],
  },
};

export function evaluateLayoutProof(leftBuffer, rightBuffer, projectName) {
  const rule = PROJECT_RULES[projectName];
  if (!rule) throw new Error(`Unknown layout proof project: ${projectName}`);

  const leftGrid = toLuminanceGrid(leftBuffer);
  const rightGrid = toLuminanceGrid(rightBuffer);
  const overallScore = similarity(leftGrid, rightGrid);
  const bandScores = regionSimilarityScores(leftGrid, rightGrid, rule.bands);
  const bandEnergies = regionEdgeEnergies(leftGrid, rule.bands);

  const passes =
    passesLayoutThreshold(overallScore) &&
    bandScores.every((score, index) => score >= rule.minBandScores[index]) &&
    bandEnergies.every((energy, index) => energy >= rule.minBandEnergies[index]);

  return {
    overallScore,
    bandScores,
    bandEnergies,
    labels: rule.labels,
    passes,
  };
}

function decodePng(buffer) {
  return PNG.sync.read(buffer);
}

function toLuminanceGrid(buffer, size = GRID_SIZE) {
  const png = decodePng(buffer);
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

function similarity(left, right) {
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) diff += Math.abs(left[index] - right[index]);
  return 1 - diff / left.length;
}

function regionSimilarityScores(leftGrid, rightGrid, bands, size = GRID_SIZE) {
  const scores = [];

  for (let index = 0; index < bands.length - 1; index += 1) {
    const startRow = Math.floor(size * bands[index]);
    const endRow = Math.max(startRow + 1, Math.floor(size * bands[index + 1]));
    let diff = 0;
    let count = 0;

    for (let row = startRow; row < endRow; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const offset = row * size + col;
        diff += Math.abs(leftGrid[offset] - rightGrid[offset]);
        count += 1;
      }
    }

    scores.push(1 - diff / count);
  }

  return scores;
}

function regionEdgeEnergies(grid, bands, size = GRID_SIZE) {
  const energies = [];

  for (let index = 0; index < bands.length - 1; index += 1) {
    const startRow = Math.floor(size * bands[index]);
    const endRow = Math.max(startRow + 1, Math.floor(size * bands[index + 1]));
    let total = 0;
    let count = 0;

    for (let row = startRow; row < endRow; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const offset = row * size + col;
        if (col + 1 < size) {
          total += Math.abs(grid[offset] - grid[offset + 1]);
          count += 1;
        }
        if (row + 1 < endRow) {
          total += Math.abs(grid[offset] - grid[offset + size]);
          count += 1;
        }
      }
    }

    energies.push(total / Math.max(1, count));
  }

  return energies;
}

