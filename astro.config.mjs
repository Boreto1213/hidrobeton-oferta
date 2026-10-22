// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  build: { inlineStylesheets: 'always' },
  // node_modules is a symlink to node_modules.nosync (keeps it out of iCloud sync)
  vite: { resolve: { preserveSymlinks: true } },
});
