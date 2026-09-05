import { PNG } from 'pngjs';

const GRID_SIZE = 96;
const LAYOUT_THRESHOLD = 0.9;
const LOW_VARIANCE_THRESHOLD = 0.0003;

const PROJECT_RULES = {
  'desktop-chromium': {
    bands: [0, 0.08, 0.16, 0.18, 0.46, 1],
    labels: ['hero/search', 'stats', 'category', 'featured-shelf', 'contribution'],
    minBandScores: [0.895, 0.887, 0.91, 0.95, 0.91],
    minBandEnergies: [0.008, 0.008, 0.015, 0.01, 0.005],
    maxLowVarianceRuns: [Infinity, Infinity, Infinity, 4, Infinity],
    profileChecks: [
      { label: 'hero/search', bandIndex: 0, minScore: 0.936, maxAgainstBandIndex: 4, maxOtherScore: 0.965 },
      { label: 'stats', bandIndex: 1, minScore: 0.926 },
      { label: 'contribution', bandIndex: 4, minScore: 0.959 },
    ],
  },
  'mobile-chromium': {
    bands: [0, 0.08, 0.16, 0.18, 0.46, 1],
    labels: ['hero/search', 'stats', 'category', 'featured-shelf', 'contribution'],
    minBandScores: [0.89, 0.85, 0.84, 0.91, 0.91],
    minBandEnergies: [0.02, 0.05, 0.03, 0.03, 0.03],
    maxLowVarianceRuns: [Infinity, Infinity, Infinity, Infinity, Infinity],
    profileChecks: [
      { label: 'hero/search', bandIndex: 0, minScore: 0.92, maxAgainstBandIndex: 4, maxOtherScore: 0.96 },
      { label: 'featured-shelf', bandIndex: 3, maxAgainstBandIndex: 4, maxOtherScore: 0.945 },
      { label: 'contribution', bandIndex: 4, minScore: 0.94 },
    ],
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
  const lowVarianceRuns = regionLowVarianceRuns(leftGrid, rule.bands);

  const profileChecks = (rule.profileChecks || []).map((check) => ({
    ...check,
    score: profileSimilarity(leftGrid, rightGrid, rule.bands[check.bandIndex], rule.bands[check.bandIndex + 1]),
    otherScore: check.maxAgainstBandIndex == null
      ? null
      : profileSimilarity(
          leftGrid,
          rightGrid,
          rule.bands[check.bandIndex],
          rule.bands[check.bandIndex + 1],
          rule.bands[check.maxAgainstBandIndex],
          rule.bands[check.maxAgainstBandIndex + 1],
        ),
  }));

  const passes =
    overallScore >= LAYOUT_THRESHOLD &&
    bandScores.every((score, index) => score >= rule.minBandScores[index]) &&
    bandEnergies.every((energy, index) => energy >= rule.minBandEnergies[index]) &&
    lowVarianceRuns.every((run, index) => run <= rule.maxLowVarianceRuns[index]) &&
    profileChecks.every(({ minScore, score, maxOtherScore, otherScore }) =>
      (minScore == null || score >= minScore) &&
      (maxOtherScore == null || otherScore <= maxOtherScore),
    );

  return {
    overallScore,
    bandScores,
    bandEnergies,
    lowVarianceRuns,
    profileChecks,
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

function regionLowVarianceRuns(grid, bands, size = GRID_SIZE) {
  const runs = [];

  for (let index = 0; index < bands.length - 1; index += 1) {
    const startRow = Math.floor(size * bands[index]);
    const endRow = Math.max(startRow + 1, Math.floor(size * bands[index + 1]));
    let best = 0;
    let current = 0;

    for (let row = startRow; row < endRow; row += 1) {
      const values = [];
      for (let col = 0; col < size; col += 1) values.push(grid[row * size + col]);
      const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
      const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;

      if (variance < LOW_VARIANCE_THRESHOLD) {
        current += 1;
        best = Math.max(best, current);
      } else {
        current = 0;
      }
    }

    runs.push(best);
  }

  return runs;
}

function profileSimilarity(leftGrid, rightGrid, leftStart, leftEnd, rightStart = leftStart, rightEnd = leftEnd) {
  const leftProfile = gradientProfile(leftGrid, leftStart, leftEnd);
  const rightProfile = gradientProfile(rightGrid, rightStart, rightEnd);
  return similarity(leftProfile, rightProfile);
}

function gradientProfile(grid, start, end, size = GRID_SIZE, samples = 12) {
  const s = Math.floor(size * start);
  const e = Math.max(s + 1, Math.floor(size * end));
  const rows = e - s;
  const steps = Math.min(samples, rows);
  const profile = [];

  for (let index = 0; index < steps; index += 1) {
    const startRow = s + Math.floor((index * rows) / steps);
    const endRow = s + Math.max(1, Math.floor(((index + 1) * rows) / steps));
    let total = 0;
    let count = 0;

    for (let row = startRow; row < Math.min(e, endRow); row += 1) {
      for (let col = 0; col < size; col += 1) {
        total += grid[row * size + col];
        count += 1;
      }
    }

    profile.push(total / count);
  }

  if (profile.length === 1) return [0];

  const gradients = [];
  for (let index = 0; index < profile.length - 1; index += 1) {
    gradients.push(profile[index + 1] - profile[index]);
  }
  return gradients;
}
