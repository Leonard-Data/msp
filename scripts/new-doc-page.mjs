import fs from 'node:fs/promises';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));
const title = args.get('--title');
const slug = normalizeSlug(args.get('--slug') || title || '');

if (!title) {
  console.error('Missing required --title');
  process.exit(1);
}

if (!slug) {
  console.error('Could not determine slug');
  process.exit(1);
}

const root = process.cwd();
const targetDir = path.join(root, 'content', 'portal');
const targetFile = path.join(targetDir, `${slug}.md`);

await fs.mkdir(targetDir, { recursive: true });

try {
  await fs.access(targetFile);
  throw new Error(`Refusing to overwrite ${targetFile}`);
} catch (error) {
  if (error?.message?.startsWith('Refusing to overwrite')) throw error;
}

const body = `# ${title}\n\nAdd an introduction here.\n\n## Why it matters\n\nExplain what this page helps the reader do.\n`;
await fs.writeFile(targetFile, body, { flag: 'wx' });
console.log(path.relative(root, targetFile));

function parseArgs(argv) {
  const entries = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    entries.set(token, argv[index + 1] && !argv[index + 1].startsWith('--') ? argv[++index] : '');
  }
  return entries;
}

function normalizeSlug(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
