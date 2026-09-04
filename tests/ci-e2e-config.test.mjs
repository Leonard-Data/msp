import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const e2eSpec = readFileSync(new URL('../tests/e2e/reference-layout.spec.mjs', import.meta.url), 'utf8');
const workflow = readFileSync(new URL('../.github/workflows/e2e-layout.yml', import.meta.url), 'utf8');

test('reference layout proof uses the tightened similarity threshold', () => {
  assert.match(e2eSpec, /expect\(score\)\.toBeGreaterThan\(0\.90\)/);
});

test('ci runs the layout e2e suite and uploads the evidence artifacts', () => {
  assert.match(workflow, /name: Layout reference proof/);
  assert.match(workflow, /npx playwright install --with-deps chromium/);
  assert.match(workflow, /npm run e2e/);
  assert.match(workflow, /path: playwright-report/);
  assert.match(workflow, /path: test-results/);
});
