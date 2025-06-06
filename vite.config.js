import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

const pagesDir = resolve(__dirname, 'src/pages');
const htmlFiles = fs.readdirSync(pagesDir).filter(file => file.endsWith('.html'));

const input = htmlFiles.reduce((entries, file) => {
  const name = file.replace('.html', '');
  entries[name] = resolve(pagesDir, file);
  return entries;
}, {});

export default defineConfig({
  base: '/democracy-game/',
  build: {
    rollupOptions: {
      input,
    }
  }
});
