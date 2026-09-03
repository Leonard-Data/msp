import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

const root = process.cwd();
const registryPath = path.join(root, 'sources.yml');
const raw = await fs.readFile(registryPath, 'utf8');
const registry = YAML.parse(raw) ?? {};
const sources = Array.isArray(registry.sources) ? registry.sources : [];

if (!sources.length) {
  throw new Error('sources.yml has no sources');
}

const ids = new Set();
for (const source of sources) {
  if (!source.repo) throw new Error('Each source needs repo');
  if (!source.localPath && !/^[-\w.]+\/[-\w.]+$/.test(source.repo)) {
    throw new Error(`Invalid repo format: ${source.repo}`);
  }

  if (source.localPath) {
    const metadataPath = path.join(root, source.localPath, '.docs-source.yml');
    const metadataRaw = await fs.readFile(metadataPath, 'utf8');
    const metadata = YAML.parse(metadataRaw);
    if (!metadata?.id) throw new Error(`Missing id in ${metadataPath}`);
    if (ids.has(metadata.id)) throw new Error(`Duplicate source id: ${metadata.id}`);
    ids.add(metadata.id);

    const docsDir = path.join(root, source.localPath, metadata.docs_path || 'docs');
    const stat = await fs.stat(docsDir).catch(() => null);
    if (!stat?.isDirectory()) throw new Error(`Missing docs path: ${docsDir}`);
  }
}

console.log(`Validated ${sources.length} source(s)`);
