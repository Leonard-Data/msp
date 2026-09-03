import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import YAML from 'yaml';

const execFileAsync = promisify(execFile);
const root = process.cwd();
const tmpDir = path.join(root, '.tmp');
const clonesDir = path.join(tmpDir, 'clones');
const aggregatedDir = path.join(tmpDir, 'aggregated');
const publicSourcesDir = path.join(root, 'public', '_sources');
const generatedDir = path.join(root, 'src', 'generated');

await fs.mkdir(clonesDir, { recursive: true });
await fs.mkdir(aggregatedDir, { recursive: true });
await fs.mkdir(publicSourcesDir, { recursive: true });
await fs.mkdir(generatedDir, { recursive: true });

await cleanDir(aggregatedDir);
await cleanDir(publicSourcesDir);

const registry = YAML.parse(await fs.readFile(path.join(root, 'sources.yml'), 'utf8')) ?? {};
const sources = Array.isArray(registry.sources) ? registry.sources : [];
const synced = [];

for (const source of sources) {
  const repoDir = source.localPath
    ? path.resolve(root, source.localPath)
    : await cloneRepo(source, clonesDir);

  const metadataPath = path.join(repoDir, '.docs-source.yml');
  const metadata = YAML.parse(await fs.readFile(metadataPath, 'utf8'));
  const docsPath = metadata.docs_path || 'docs';
  const docsDir = path.join(repoDir, docsPath);
  const targetDir = path.join(aggregatedDir, metadata.id);
  const publicDir = path.join(publicSourcesDir, metadata.id);

  await copyDir(docsDir, targetDir);
  await copyDir(docsDir, publicDir);

  synced.push({
    id: metadata.id,
    name: metadata.name || metadata.id,
    description: metadata.description || '',
    category: metadata.category || 'General',
    tags: metadata.tags || [],
    navigation: metadata.navigation || [],
    repo: source.repo,
    repoUrl: source.repoUrl || `https://github.com/${source.repo}`,
    docsPath,
    sourceDir: path.relative(root, targetDir).replace(/\\/g, '/'),
    publicDir: path.relative(root, publicDir).replace(/\\/g, '/'),
    local: Boolean(source.localPath)
  });
}

await fs.writeFile(path.join(generatedDir, 'sources.json'), JSON.stringify(synced, null, 2));
console.log(`Synced ${synced.length} source(s)`);

async function cloneRepo(source, parentDir) {
  const name = source.repo.replace(/[\/]/g, '__');
  const dir = path.join(parentDir, name);
  await fs.rm(dir, { recursive: true, force: true });

  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';
  const url = token
    ? `https://x-access-token:${token}@github.com/${source.repo}.git`
    : `https://github.com/${source.repo}.git`;

  await execFileAsync('git', ['clone', '--depth', '1', '--branch', source.defaultBranch || 'main', url, dir], {
    cwd: parentDir
  });

  return dir;
}

async function cleanDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}

async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  const entries = await fs.readdir(from, { withFileTypes: true });
  for (const entry of entries) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) {
      await copyDir(src, dest);
    } else {
      await fs.copyFile(src, dest);
    }
  }
}
