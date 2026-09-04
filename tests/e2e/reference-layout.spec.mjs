import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { test, expect } from '@playwright/test';

const REFERENCE_URL = 'https://www.aihero.dev/skills-to-questionnaire';
const DOWNSCALE = 48;

function decodePng(buffer) {
  return PNG.sync.read(buffer);
}

function toSignature(buffer, size = DOWNSCALE) {
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

function similarityScore(leftBuffer, rightBuffer) {
  const left = toSignature(leftBuffer);
  const right = toSignature(rightBuffer);
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff += Math.abs(left[index] - right[index]);
  }
  return 1 - diff / left.length;
}

async function captureEvidence(page, label, testInfo) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after { animation: none !important; transition: none !important; }
      img, svg, video, canvas { filter: grayscale(1) contrast(1.05); }
      body { background-attachment: initial !important; }
    `,
  }).catch(() => {});
  await page.waitForLoadState('networkidle');
  const buffer = await page.screenshot({ fullPage: true, animations: 'disabled' });
  const file = testInfo.outputPath(`${label}.png`);
  await fs.writeFile(file, buffer);
  return { file, buffer };
}

async function writeReport(testInfo, score, localFile, referenceFile) {
  const reportPath = testInfo.outputPath('reference-match-report.md');
  await fs.writeFile(
    reportPath,
    [
      '# Reference match evidence',
      '',
      `- Project: ${testInfo.project.name}`,
      `- Similarity score: ${score.toFixed(4)}`,
      `- Local screenshot: ${path.basename(localFile)}`,
      `- Reference screenshot: ${path.basename(referenceFile)}`,
      '',
      'The score is a low-detail grayscale layout signature comparison intended to judge section rhythm and large-block composition, not text or branding identity.',
    ].join('\n'),
  );
  await testInfo.attach('reference-match-report', { path: reportPath, contentType: 'text/markdown' });
}

test('homepage keeps the AI Hero layout rhythm on desktop and mobile', async ({ page, browser }, testInfo) => {
  const local = await browser.newPage({ viewport: page.viewportSize() ?? { width: 1440, height: 2200 } });
  const reference = await browser.newPage({ viewport: page.viewportSize() ?? { width: 1440, height: 2200 } });

  try {
    await local.goto('/');
    await expect(local.getByRole('heading', { level: 1 })).toContainText('One library');
    await expect(local.getByText('Create New Section')).toBeVisible();
    await expect(local.getByText('Connect Existing Repository')).toBeVisible();

    await reference.goto(REFERENCE_URL, { waitUntil: 'domcontentloaded' });
    await expect(reference.getByRole('heading', { level: 1 })).toBeVisible();

    const localShot = await captureEvidence(local, 'local-home', testInfo);
    const referenceShot = await captureEvidence(reference, 'reference-home', testInfo);
    const score = similarityScore(localShot.buffer, referenceShot.buffer);

    await writeReport(testInfo, score, localShot.file, referenceShot.file);
    await testInfo.attach('local-home', { path: localShot.file, contentType: 'image/png' });
    await testInfo.attach('reference-home', { path: referenceShot.file, contentType: 'image/png' });

    expect(score).toBeGreaterThan(0.90);
  } finally {
    await local.close();
    await reference.close();
  }
});
