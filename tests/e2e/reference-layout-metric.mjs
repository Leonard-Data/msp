import { PNG } from 'pngjs';

const DOWNSCALE = 48;

export function layoutSimilarityScore(leftBuffer, rightBuffer, size = DOWNSCALE) {
  const leftGrid = toLuminanceGrid(leftBuffer, size);
  const rightGrid = toLuminanceGrid(rightBuffer, size);
  const leftEdges = toEdgeSignature(leftGrid, size);
  const rightEdges = toEdgeSignature(rightGrid, size);

  const luminanceScore = similarity(leftGrid, rightGrid);
  const edgeEnergyScore = relativeEnergy(leftEdges, rightEdges);

  return edgeEnergyScore < 0.15 ? luminanceScore * edgeEnergyScore : luminanceScore;
}

function decodePng(buffer) {
  return PNG.sync.read(buffer);
}

function toLuminanceGrid(buffer, size) {
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

function toEdgeSignature(grid, size) {
  const edges = [];

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const index = row * size + col;
      const cell = grid[index];
      if (col + 1 < size) edges.push(Math.abs(cell - grid[index + 1]));
      if (row + 1 < size) edges.push(Math.abs(cell - grid[index + size]));
    }
  }

  return edges;
}

function similarity(left, right) {
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) diff += Math.abs(left[index] - right[index]);
  return 1 - diff / left.length;
}

function relativeEnergy(left, right) {
  const leftMean = average(left);
  const rightMean = average(right);
  const strongest = Math.max(leftMean, rightMean);
  if (!strongest) return 1;
  return Math.min(leftMean, rightMean) / strongest;
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
