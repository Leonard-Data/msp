import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
import { evaluateLayoutProof } from './reference-layout-metric.mjs';
const FIXTURE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');
const REFERENCE_FIXTURES = {
  'desktop-chromium': 'reference-home-desktop.png',
  'mobile-chromium': 'reference-home-mobile.png',
};

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

async function writeReport(testInfo, proof, localFile, referenceFile) {
  const reportPath = testInfo.outputPath('reference-match-report.md');
  await fs.writeFile(
    reportPath,
    [
      '# Reference match evidence',
      '',
      `- Project: ${testInfo.project.name}`,
      `- Similarity score: ${proof.overallScore.toFixed(4)}`,
      `- Bands: ${proof.labels.join(', ')}`,
      `- Band scores: ${proof.bandScores.map((score) => score.toFixed(4)).join(', ')}`,
      `- Band energies: ${proof.bandEnergies.map((energy) => energy.toFixed(4)).join(', ')}`,
      `- Low-variance row runs: ${proof.lowVarianceRuns.join(', ')}`,
      ...proof.profileChecks.flatMap(({ label, score, otherScore }) => [
        `- ${label} profile score: ${score.toFixed(4)}`,
        otherScore == null ? null : `- ${label} cross-band score: ${otherScore.toFixed(4)}`,
      ]),
      `- Local screenshot: ${path.basename(localFile)}`,
      `- Reference screenshot: ${path.basename(referenceFile)}`,
      '',
      'The proof combines an overall layout score with explicit reference-derived homepage bands, requiring each major band to keep its own structural fingerprint rather than matching another band without relying on page text.',
    ].filter(Boolean).join('\n'),
  );
  await testInfo.attach('reference-match-report', { path: reportPath, contentType: 'text/markdown' });
}

test('homepage keeps the AI Hero layout rhythm on desktop and mobile', async ({ page }, testInfo) => {
  const referenceName = REFERENCE_FIXTURES[testInfo.project.name];
  expect(referenceName, `missing reference fixture for ${testInfo.project.name}`).toBeTruthy();
  const referenceFile = path.join(FIXTURE_DIR, referenceName);

  await page.goto('/');

  const localShot = await captureEvidence(page, 'local-home', testInfo);
  const referenceBuffer = await fs.readFile(referenceFile);
  const proof = evaluateLayoutProof(localShot.buffer, referenceBuffer, testInfo.project.name);

  await writeReport(testInfo, proof, localShot.file, referenceFile);
  await testInfo.attach('local-home', { path: localShot.file, contentType: 'image/png' });
  await testInfo.attach('reference-home', { path: referenceFile, contentType: 'image/png' });

  expect(proof.passes).toBe(true);
});
