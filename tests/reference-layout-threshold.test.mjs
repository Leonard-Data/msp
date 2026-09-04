import test from 'node:test';
import assert from 'node:assert/strict';
import { passesLayoutThreshold } from './e2e/reference-layout-threshold.mjs';

test('layout proof accepts an exact 0.90 score', () => {
  assert.equal(passesLayoutThreshold(0.9), true);
});
