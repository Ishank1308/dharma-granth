// Starts `next dev` on port 3002 with its own build folder (.next), so it can run beside a
// dev server or production build that is using dist/. Usage: node scripts/dev-isolated.mjs
import { spawn } from 'node:child_process';

const child = spawn('npx', ['next', 'dev', '-p', '3002'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NEXT_DIST_DIR: '.next' },
});
child.on('exit', (code) => process.exit(code ?? 0));
