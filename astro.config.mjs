import { defineConfig } from 'astro/config';

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const base = process.env.PUBLIC_BASE_PATH ?? (process.env.GITHUB_ACTIONS && repo ? `/${repo}` : '/');
const site = process.env.PUBLIC_SITE_URL ?? (process.env.GITHUB_REPOSITORY_OWNER && repo ? `https://${process.env.GITHUB_REPOSITORY_OWNER}.github.io` : 'https://example.com');

export default defineConfig({
  site,
  base,
  output: 'static'
});
