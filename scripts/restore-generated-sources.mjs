import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const publicSourcesDir = path.join(root, 'public', '_sources');
const aggregatedDir = path.join(root, '.tmp', 'aggregated');

await fs.rm(aggregatedDir, { recursive: true, force: true });
await fs.mkdir(aggregatedDir, { recursive: true });
await copyDir(publicSourcesDir, aggregatedDir);
console.log('Restored generated source docs');

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
