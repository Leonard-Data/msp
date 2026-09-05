import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const buildCommand = process.platform === 'win32'
  ? [process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', 'npm run build:static']]
  : ['npm', ['run', 'build:static']];

test('built markdown pages expose interactive code, image, accordion, and edit controls', () => {
  execFileSync(buildCommand[0], buildCommand[1], { stdio: 'pipe' });
  const page = readFileSync('dist/docs/markdown-features/index.html', 'utf8');

  assert.match(page, /data-image-zoom/);
  assert.match(page, /data-copy-code/);
  assert.match(page, /data-preview-srcdoc/);
  assert.match(page, /data-jsfiddle/);
  assert.match(page, /<details>/);
  assert.match(page, /data-copy-to-clipboard/);
  assert.match(page, /language-html/);
  assert.match(page, /Edit on GitHub/);
});
