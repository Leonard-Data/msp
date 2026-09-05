import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const generatedDir = path.join(root, 'src', 'generated');
const portalDir = path.join(root, 'content', 'portal');
const sources = JSON.parse(await fs.readFile(path.join(generatedDir, 'sources.json'), 'utf8'));

const portalPages = await loadPortalPages();
const sourceGroups = [];
const sourcePages = [];

for (const source of sources) {
  const docs = await walkMarkdown(path.join(root, source.sourceDir));
  const pages = [];
  for (const file of docs) pages.push(await buildSourcePage(source, file));
  pages.sort(compareSourcePages(source));
  sourceGroups.push({
    id: source.id,
    name: source.name,
    category: source.category,
    description: source.description,
    repo: source.repo,
    repoUrl: source.repoUrl,
    tags: source.tags,
    pages: pages.map(({ title, href, section, headings }) => ({ title, href, section, headings }))
  });
  sourcePages.push(...pages);
}

const categories = groupCategories(sourceGroups);
const sidebar = buildSidebar(portalPages, categories);
const searchIndex = [...portalPages, ...sourcePages].map(({ title, href, description, content, category, sourceName, tags, headings }) => ({
  title,
  href,
  description,
  category,
  sourceName,
  tags,
  headings: headings.map((heading) => heading.text).join(' '),
  content
}));

const docsData = {
  updatedAt: new Date().toISOString(),
  portalPages,
  sourceGroups,
  categories,
  sidebar,
  pages: [...portalPages, ...sourcePages]
};

await fs.writeFile(path.join(generatedDir, 'docs-data.json'), JSON.stringify(docsData, null, 2));
await fs.writeFile(path.join(generatedDir, 'search-index.json'), JSON.stringify(searchIndex, null, 2));
console.log(`Built ${docsData.pages.length} page(s)`);

async function loadPortalPages() {
  const files = await walkMarkdown(portalDir);
  const pages = [];
  for (const file of files) {
    const relativePath = path.relative(portalDir, file);
    const raw = await fs.readFile(file, 'utf8');
    const title = getTitle(raw, relativePath);
    const headings = getHeadings(raw);
    const slug = relativePath.replace(/\\/g, '/').replace(/\.md$/i, '');
    pages.push({
      kind: 'portal',
      title,
      description: firstParagraph(raw),
      content: normalizeText(raw),
      headings,
      file: path.relative(root, file).replace(/\\/g, '/'),
      relativePath,
      slug,
      href: slug === 'overview' ? '/docs/' : `/docs/${slug}/`,
      category: 'Portal',
      sourceId: 'portal',
      sourceName: 'MSP Portal',
      tags: ['portal']
    });
  }
  return pages.sort((a, b) => a.href.localeCompare(b.href));
}

async function buildSourcePage(source, file) {
  const sourceRoot = path.join(root, source.sourceDir);
  const relativePath = path.relative(sourceRoot, file).replace(/\\/g, '/');
  const raw = await fs.readFile(file, 'utf8');
  const slugBits = ['sources', source.id, ...relativePath.replace(/\.md$/i, '').split('/')];
  if (isReadmePage(relativePath)) slugBits.pop();
  const href = `/docs/${slugBits.join('/')}/`;
  return {
    kind: 'source',
    title: getTitle(raw, relativePath),
    description: firstParagraph(raw) || source.description,
    content: normalizeText(raw),
    headings: getHeadings(raw),
    file: path.relative(root, file).replace(/\\/g, '/'),
    relativePath,
    slug: slugBits.join('/'),
    href,
    category: source.category,
    sourceId: source.id,
    sourceName: source.name,
    sourceDescription: source.description,
    section: isReadmePage(relativePath) ? 'overview' : relativePath.split('/')[0],
    repo: source.repo,
    repoUrl: source.repoUrl,
    tags: source.tags
  };
}

function compareSourcePages(source) {
  const order = new Map((source.navigation || []).map((item, index) => [item, index]));
  return (a, b) => {
    const aSection = a.section || 'zzz';
    const bSection = b.section || 'zzz';
    const aRank = order.has(aSection) ? order.get(aSection) : Number.MAX_SAFE_INTEGER;
    const bRank = order.has(bSection) ? order.get(bSection) : Number.MAX_SAFE_INTEGER;
    if (isReadmePage(a.relativePath)) return -1;
    if (isReadmePage(b.relativePath)) return 1;
    if (aRank !== bRank) return aRank - bRank;
    return a.href.localeCompare(b.href);
  };
}

function isReadmePage(relativePath) {
  return /(^|\/)README\.md$/i.test(relativePath);
}

function groupCategories(groups) {
  const map = new Map();
  for (const source of groups) {
    if (!map.has(source.category)) map.set(source.category, []);
    map.get(source.category).push(source);
  }
  return [...map.entries()].map(([name, sources]) => ({
    name,
    sources: sources.sort((a, b) => a.name.localeCompare(b.name))
  })).sort((a, b) => a.name.localeCompare(b.name));
}

function buildSidebar(portalPages, categories) {
  const homeItems = portalPages.map((page) => ({ label: page.title, href: page.href }));
  return [
    { label: 'Portal', items: homeItems },
    ...categories.map((category) => ({
      label: category.name,
      items: category.sources.map((source) => ({
        label: source.name,
        href: source.pages[0]?.href || '#',
        children: source.pages.slice(1).map((page) => ({ label: page.title, href: page.href }))
      }))
    }))
  ];
}

async function walkMarkdown(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walkMarkdown(full));
    else if (/\.md$/i.test(entry.name)) out.push(full);
  }
  return out;
}

function getTitle(raw, fallback) {
  const match = raw.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback.replace(/\.md$/i, '').split('/').pop();
}

function firstParagraph(raw) {
  const lines = raw.split(/\r?\n/).map((line) => line.trim());
  return lines.find((line) => line && !line.startsWith('#') && !line.startsWith('- ') && !line.startsWith('>') && !/^\d+\.\s/.test(line)) || '';
}

function getHeadings(raw) {
  return raw.split(/\r?\n/)
    .map((line) => line.match(/^(#{2,3})\s+(.+)$/))
    .filter(Boolean)
    .map((match) => ({ depth: match[1].length, text: match[2].trim(), slug: slugify(match[2].trim()) }));
}

function normalizeText(raw) {
  return raw.replace(/```[\s\S]*?```/g, ' ').replace(/`([^`]+)`/g, '$1').replace(/[#>*_\-\[\]()|]/g, ' ').replace(/\s+/g, ' ').trim();
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
