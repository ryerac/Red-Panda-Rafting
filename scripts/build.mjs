import { build } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

await build();
let html = await readFile('dist/index.html', 'utf8');
for (const match of [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g)]) {
  const code = await readFile(resolve('dist', match[1]), 'utf8');
  html = html.replace(match[0], () => `<script type="module">${code.replace(/<\/script/gi, '<\\/script')}</script>`);
}
for (const match of [...html.matchAll(/<link\b[^>]*\bhref="([^"]+\.css)"[^>]*>/g)]) {
  const css = await readFile(resolve('dist', match[1]), 'utf8');
  html = html.replace(match[0], () => `<style>${css}</style>`);
}
await writeFile('dist/index.html', html);
await writeFile('index.html', html);
console.log('Standalone game written to index.html and dist/index.html.');
