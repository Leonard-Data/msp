import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';

function href(base, path = '') {
  return `${base.replace(/\/?$/, '/')}${path.replace(/^\/+/, '')}`;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function countMatches(value, pattern) {
  return [...value.matchAll(pattern)].length;
}

function buildSite(env = {}) {
  rmSync('dist', { recursive: true, force: true });
  execFileSync('npm', ['run', 'build'], {
    stdio: 'pipe',
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}

test('site builds with semantic heading rendering and base-aware single-owner navigation', () => {
  const env = {
    GITHUB_ACTIONS: '1',
    GITHUB_REPOSITORY: 'owner/msp-portal',
    GITHUB_REPOSITORY_OWNER: 'owner',
  };
  const base = '/msp-portal/';
  const docsHref = href(base, 'docs/');
  const howItWorksHref = href(base, 'docs/how-it-works/');
  const searchHref = href(base, 'search/');
  const overviewHref = href(base, 'docs/sources/agent-engineering/');
  const addDocsHref = 'https://github.com/owner/msp-portal/issues/new/choose';

  buildSite(env);

  const home = readFileSync('dist/index.html', 'utf8');
  const sourceDoc = readFileSync('dist/docs/sources/agent-engineering/index.html', 'utf8');
  const portalDoc = readFileSync('dist/docs/orches-harness/index.html', 'utf8');

  assert.doesNotMatch(home, /href="\/\//, 'base-prefixed links should not become protocol-relative');
  assert.doesNotMatch(home, /src="\/\//, 'base-prefixed assets should not become protocol-relative');
  assert.match(home, new RegExp(`<a class="brand" href="${escapeRegex(base)}">[\\s\\S]*?<img[\\s\\S]*?<span>MSP Docs<\\/span>[\\s\\S]*?<\\/a>`), 'brand should wrap its visible content and keep the configured base');
  assert.equal(countMatches(home, new RegExp(`href="${escapeRegex(docsHref)}"[^>]*>Library<\\/a>`, 'g')), 1, 'library should have one header owner');
  assert.equal(countMatches(home, new RegExp(`href="${escapeRegex(howItWorksHref)}"[^>]*>How it works<\\/a>`, 'g')), 1, 'how-it-works should have one header owner');
  assert.equal(countMatches(home, new RegExp(`href="${escapeRegex(searchHref)}"[^>]*>Search<\\/a>`, 'g')), 2, 'search should stay reachable from the nav and hero action');
  assert.equal(countMatches(home, new RegExp(`href="${escapeRegex(addDocsHref)}"[^>]*>Add documentation<\\/a>`, 'g')), 1, 'add documentation should have one header action owner');
  assert.match(home, /Documentation Library/, 'home should present the docs-library identity');
  assert.match(home, /Browse by category/, 'home should expose category browsing');
  assert.match(home, /Create New Section/, 'home should surface the create-section workflow');
  assert.match(home, /Connect Existing Repository/, 'home should surface the connect-existing workflow');

  assert.match(sourceDoc, /aria-label="Documentation navigation"/, 'docs pages should render documentation navigation');
  assert.equal(countMatches(sourceDoc, new RegExp(`href="${escapeRegex(overviewHref)}"[^>]*>Overview<\\/a>`, 'g')), 1, 'docs navigation should render one overview owner');
  assert.match(sourceDoc, /Source repository/, 'docs page should label source metadata clearly');
  assert.match(sourceDoc, /Open source repository/, 'docs page should expose the source repository action');
  assert.match(portalDoc, /Keep user-installed commands out of\s*<code>sudo<\/code>/, 'inline code inside headings should render');
  assert.doesNotMatch(portalDoc, /<h[1-6][^>]*>\s*<p>/, 'headings should not wrap paragraph tags');
});
