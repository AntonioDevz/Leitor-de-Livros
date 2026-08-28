import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Builds the static web bundle with the GitHub Pages basePath disabled and
// syncs it into the native Android project (Capacitor). Run as: npm run build:android
const root = dirname(fileURLToPath(import.meta.url)) + '/..';

const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { stdio: 'inherit', cwd: root, env });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

const env = {
  ...process.env,
  CAPACITOR_BUILD: '1',
  NEXT_PUBLIC_PDFJS_WORKER: '/pdfjs/pdf.worker.min.mjs',
};

const there = (modulePath) => join(root, 'node_modules', modulePath);
const script = (name) => join(root, 'scripts', name);

run(process.execPath, [script('prepare-pdfjs-worker.mjs')]);
run(process.execPath, [there('next/dist/bin/next'), 'build'], env);

const capBin = there('@capacitor/cli/bin/capacitor');
run(process.execPath, [capBin, 'sync', 'android']);
console.log('[build-android] concluído — rode gradle em android/ (ou dispare o workflow APK).');