import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

function buildSite() {
  execFileSync('npm', ['run', 'build'], {
    stdio: 'pipe',
    encoding: 'utf8',
  });
}

test('site builds with semantic heading rendering and usable header/mobile navigation', () => {
  buildSite();

  const home = readFileSync('dist/index.html', 'utf8');
  const doc = readFileSync('dist/docs/orches-harness/index.html', 'utf8');

  assert.doesNotMatch(home, /href="\/\//, 'base-prefixed links should not become protocol-relative');
  assert.doesNotMatch(home, /src="\/\//, 'base-prefixed assets should not become protocol-relative');
  assert.match(home, /<a class="brand" href="\/">[\s\S]*?<img[\s\S]*?<span>MSP Docs<\/span>[\s\S]*?<\/a>/, 'brand should wrap its visible content');
  assert.match(home, /class="mobile-nav"/, 'mobile navigation trigger should be rendered');
  assert.match(home, /href="\/search\/"[^>]*>Search<\/a>/, 'search should stay reachable in mobile navigation');

  assert.match(doc, /class="mobile-sidebar"/, 'docs pages should render a mobile navigation menu');
  assert.match(doc, /href="\/docs\/sources\/agent-engineering\/"[^>]*>Overview<\/a>/, 'docs mobile navigation should expose section links');
  assert.match(doc, /Keep user-installed commands out of\s*<code>sudo<\/code>/, 'inline code inside headings should render');
  assert.doesNotMatch(doc, /<h[1-6][^>]*>\s*<p>/, 'headings should not wrap paragraph tags');
});
