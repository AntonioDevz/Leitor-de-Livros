import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Copies the pdf.js worker from node_modules into public/ so the Capacitor APK
// can convert PDFs offline (no CDN). Version matches the installed pdfjs-dist.
const root = dirname(fileURLToPath(import.meta.url)) + '/..';
const src = join(root, 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs');
const dstDir = join(root, 'public', 'pdfjs');
const dst = join(dstDir, 'pdf.worker.min.mjs');

if (!existsSync(src)) {
  console.error('[prepare-pdfjs-worker] arquivo não encontrado:', src);
  process.exit(1);
}
mkdirSync(dstDir, { recursive: true });
copyFileSync(src, dst);
console.log('[prepare-pdfjs-worker] worker copiado:', dst);