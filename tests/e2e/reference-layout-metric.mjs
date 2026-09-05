import { PNG } from 'pngjs';

const GRID_SIZE = 256;
const LAYOUT_THRESHOLD = 0.9;
const LOW_VARIANCE_THRESHOLD = 0.0003;
const BAND_FINGERPRINT_ROWS = 12;
const BAND_FINGERPRINT_COLS = 12;
const BAND_SLICE_COUNT = 4;
const SLICE_FINGERPRINT_ROWS = 3;
const SLICE_FINGERPRINT_COLS = 12;

const PROJECT_RULES = {
  'desktop-chromium': {
    bands: [0, 0.08, 0.16, 0.18, 0.46, 1],
    labels: ['hero/search', 'stats', 'category', 'featured-shelf', 'contribution'],
    minBandScores: [0.926, 0.905, 0.942, 0.95, 0.91],
    minBandEnergies: [0.008, 0.008, 0.015, 0.01, 0.005],
    maxLowVarianceRuns: [Infinity, Infinity, Infinity, 4, Infinity],
    minIdentityScores: [0.85, 0.84, 0.86, 0.9, 0.86],
    minIdentityMargins: [0.015, 0.015, 0.015, 0.02, 0.015],
    minSliceIdentityScores: [0.9, 0.9, 0.9, 0.9, 0.9],
    minSliceIdentityMargins: [0.005, 0.005, 0.005, 0.005, 0.005],
    minSliceEnergyRatios: [0.7, 0.7, 0.7, 0.7, 0.7],
  },
  'mobile-chromium': {
    bands: [0, 0.08, 0.16, 0.18, 0.46, 1],
    labels: ['hero/search', 'stats', 'category', 'featured-shelf', 'contribution'],
    minBandScores: [0.921, 0.893, 0.878, 0.91, 0.91],
    minBandEnergies: [0.02, 0.05, 0.03, 0.03, 0.03],
    maxLowVarianceRuns: [Infinity, Infinity, Infinity, Infinity, Infinity],
    minIdentityScores: [0.84, 0.8, 0.79, 0.86, 0.86],
    minIdentityMargins: [0.015, 0.015, 0.015, 0.015, 0.015],
    minSliceIdentityScores: [0.9, 0.9, 0.9, 0.9, 0.9],
    minSliceIdentityMargins: [0.005, 0.005, 0.005, 0.005, 0.005],
    minSliceEnergyRatios: [0.7, 0.7, 0.7, 0.7, 0.7],
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
  const identityChecks = rule.labels.map((label, bandIndex) => {
    const score = bandFingerprintSimilarity(
      leftGrid,
      rightGrid,
      rule.bands[bandIndex],
      rule.bands[bandIndex + 1],
    );
    const otherScores = rule.labels
      .map((otherLabel, otherBandIndex) => {
        if (otherBandIndex === bandIndex) return null;
        return {
          label: otherLabel,
          score: bandFingerprintSimilarity(
            leftGrid,
            rightGrid,
            rule.bands[bandIndex],
            rule.bands[bandIndex + 1],
            rule.bands[otherBandIndex],
            rule.bands[otherBandIndex + 1],
          ),
        };
      })
      .filter(Boolean)
      .sort((left, right) => right.score - left.score);

    return {
      label,
      bandIndex,
      score,
      maxOtherScore: otherScores[0]?.score ?? 0,
      margin: score - (otherScores[0]?.score ?? 0),
      otherScores,
    };
  });
  const sliceIdentityChecks = rule.labels.flatMap((label, bandIndex) =>
    sliceRanges(rule.bands[bandIndex], rule.bands[bandIndex + 1]).map(({ start, end }, sliceIndex) => {
      const score = sliceFingerprintSimilarity(leftGrid, rightGrid, start, end);
      const energy = regionEdgeEnergy(leftGrid, start, end);
      const referenceEnergy = regionEdgeEnergy(rightGrid, start, end);
      const energyRatio = energy / Math.max(referenceEnergy, Number.EPSILON);
      const otherScores = rule.labels
        .flatMap((otherLabel, otherBandIndex) =>
          sliceRanges(rule.bands[otherBandIndex], rule.bands[otherBandIndex + 1])
            .map(({ start: otherStart, end: otherEnd }, otherSliceIndex) => {
              if (otherBandIndex === bandIndex && otherSliceIndex === sliceIndex) return null;
              return {
                label: `${otherLabel}:${otherSliceIndex}`,
                score: sliceFingerprintSimilarity(leftGrid, rightGrid, start, end, otherStart, otherEnd),
              };
            })
            .filter(Boolean),
        )
        .sort((left, right) => right.score - left.score);

      return {
        label,
        bandIndex,
        sliceIndex,
        score,
        energy,
        referenceEnergy,
        energyRatio,
        maxOtherScore: otherScores[0]?.score ?? 0,
        margin: score - (otherScores[0]?.score ?? 0),
        otherScores,
      };
    }),
  );

  const passes =
    overallScore >= LAYOUT_THRESHOLD &&
    bandScores.every((score, index) => score >= rule.minBandScores[index]) &&
    bandEnergies.every((energy, index) => energy >= rule.minBandEnergies[index]) &&
    lowVarianceRuns.every((run, index) => run <= rule.maxLowVarianceRuns[index]) &&
    identityChecks.every(({ score, margin }, index) =>
      score >= rule.minIdentityScores[index] && margin >= rule.minIdentityMargins[index],
    ) &&
    sliceIdentityChecks.every(({ bandIndex, score, margin, energyRatio }) =>
      score >= rule.minSliceIdentityScores[bandIndex] &&
      margin >= rule.minSliceIdentityMargins[bandIndex] &&
      energyRatio >= rule.minSliceEnergyRatios[bandIndex],
    );

  return {
    overallScore,
    bandScores,
    bandEnergies,
    lowVarianceRuns,
    identityChecks,
    sliceIdentityChecks,
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
  return bands.slice(0, -1).map((start, index) => regionEdgeEnergy(grid, start, bands[index + 1], size));
}

function regionEdgeEnergy(grid, start, end, size = GRID_SIZE) {
  const startRow = Math.floor(size * start);
  const endRow = Math.max(startRow + 1, Math.floor(size * end));
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

  return total / Math.max(1, count);
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

function bandFingerprintSimilarity(leftGrid, rightGrid, leftStart, leftEnd, rightStart = leftStart, rightEnd = leftEnd) {
  return similarity(
    bandFingerprint(leftGrid, leftStart, leftEnd),
    bandFingerprint(rightGrid, rightStart, rightEnd),
  );
}

function sliceFingerprintSimilarity(leftGrid, rightGrid, leftStart, leftEnd, rightStart = leftStart, rightEnd = leftEnd) {
  return similarity(
    bandFingerprint(leftGrid, leftStart, leftEnd, GRID_SIZE, SLICE_FINGERPRINT_ROWS, SLICE_FINGERPRINT_COLS),
    bandFingerprint(rightGrid, rightStart, rightEnd, GRID_SIZE, SLICE_FINGERPRINT_ROWS, SLICE_FINGERPRINT_COLS),
  );
}

function sliceRanges(start, end, slices = BAND_SLICE_COUNT) {
  const ranges = [];
  const span = end - start;

  for (let index = 0; index < slices; index += 1) {
    ranges.push({
      start: start + (span * index) / slices,
      end: start + (span * (index + 1)) / slices,
    });
  }

  return ranges;
}

function bandFingerprint(grid, start, end, size = GRID_SIZE, rows = BAND_FINGERPRINT_ROWS, cols = BAND_FINGERPRINT_COLS) {
  const startRow = Math.floor(size * start);
  const endRow = Math.max(startRow + 1, Math.floor(size * end));
  const totalRows = endRow - startRow;
  const fingerprint = [];

  for (let row = 0; row < rows; row += 1) {
    const sampleStart = startRow + Math.floor((row * totalRows) / rows);
    const sampleEnd = startRow + Math.max(1, Math.floor(((row + 1) * totalRows) / rows));

    for (let col = 0; col < cols; col += 1) {
      const sampleLeft = Math.floor((col * size) / cols);
      const sampleRight = Math.max(sampleLeft + 1, Math.floor(((col + 1) * size) / cols));
      let luminanceTotal = 0;
      let luminanceCount = 0;
      let edgeTotal = 0;
      let edgeCount = 0;

      for (let y = sampleStart; y < Math.min(endRow, sampleEnd); y += 1) {
        for (let x = sampleLeft; x < sampleRight; x += 1) {
          const offset = y * size + x;
          luminanceTotal += grid[offset];
          luminanceCount += 1;
          if (x + 1 < sampleRight) {
            edgeTotal += Math.abs(grid[offset] - grid[offset + 1]);
            edgeCount += 1;
          }
          if (y + 1 < Math.min(endRow, sampleEnd)) {
            edgeTotal += Math.abs(grid[offset] - grid[offset + size]);
            edgeCount += 1;
          }
        }
      }

      fingerprint.push(luminanceTotal / Math.max(1, luminanceCount));
      fingerprint.push(edgeTotal / Math.max(1, edgeCount));
    }
  }

  return fingerprint;
}
