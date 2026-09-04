import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const script = '/home/sam/agent-orchestrator/projects/msp/scripts/new-doc-page.mjs';

function makeTempProject() {
  const root = mkdtempSync(join(tmpdir(), 'msp-doc-page-'));
  mkdirSync(join(root, 'content', 'portal'), { recursive: true });
  writeFileSync(join(root, 'package.json'), '{}');
  return root;
}

test('new-doc-page creates a markdown file with title and intro stub', () => {
  const root = makeTempProject();

  try {
    execFileSync('node', [script, '--title', 'Library Guide', '--slug', 'library-guide'], {
      cwd: root,
      stdio: 'pipe',
      encoding: 'utf8',
    });

    const file = join(root, 'content', 'portal', 'library-guide.md');
    assert.equal(existsSync(file), true);
    assert.match(readFileSync(file, 'utf8'), /^# Library Guide\n\nAdd an introduction here\./m);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('new-doc-page refuses to overwrite an existing page', () => {
  const root = makeTempProject();
  const file = join(root, 'content', 'portal', 'library-guide.md');
  writeFileSync(file, '# Existing\n');

  try {
    assert.throws(() => {
      execFileSync('node', [script, '--title', 'Library Guide', '--slug', 'library-guide'], {
        cwd: root,
        stdio: 'pipe',
        encoding: 'utf8',
      });
    }, /Refusing to overwrite/);
    assert.equal(readFileSync(file, 'utf8'), '# Existing\n');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
