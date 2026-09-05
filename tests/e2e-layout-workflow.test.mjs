import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

test('layout workflow runs only the layout proof spec', () => {
  const workflow = parse(readFileSync('.github/workflows/e2e-layout.yml', 'utf8'));
  const job = workflow.jobs?.['e2e-layout'];
  assert.ok(job, 'missing e2e-layout job');

  const runSteps = (job.steps || []).filter((step) => typeof step.run === 'string').map((step) => step.run);
  const playwrightRuns = runSteps.filter((run) => run.includes('playwright test'));

  assert.equal(playwrightRuns.length, 1, 'workflow should invoke Playwright once');
  assert.match(playwrightRuns[0], /playwright test\s+tests\/e2e\/reference-layout\.spec\.mjs\b/, 'workflow should target only the layout proof spec');
  assert.doesNotMatch(playwrightRuns[0], /search-discovery\.spec\.mjs|\*|--grep/, 'workflow should not broaden beyond the layout proof spec');
  assert.ok(runSteps.every((run) => !/npm run e2e\b/.test(run)), 'workflow should not delegate to the full e2e script');
});
