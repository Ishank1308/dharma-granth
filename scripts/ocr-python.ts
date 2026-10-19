/**
 * Launch tools/granth-ocr/pipeline.py. The site scripts stay on npm.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const PIPELINE = resolve(HERE, '../tools/granth-ocr/pipeline.py');

function probe(exe: string): boolean {
  if (exe !== 'python' && exe !== 'python3' && !existsSync(exe)) return false;
  const result = spawnSync(exe, ['-c', 'import sys; print(sys.executable)'], { encoding: 'utf8' });
  return result.status === 0 && Boolean(result.stdout && result.stdout.trim());
}

export function pythonExe(): string {
  const local = process.env.LOCALAPPDATA || '';
  const candidates = [
    process.env.PYTHON,
    join(local, 'Programs', 'Python', 'Python312', 'python.exe'),
    join(local, 'Programs', 'Python', 'Python313', 'python.exe'),
    join(local, 'Programs', 'Python', 'Python311', 'python.exe'),
    'python',
    'python3',
  ].filter((item): item is string => Boolean(item));
  for (const candidate of candidates) {
    if (probe(candidate)) return candidate;
  }
  throw new Error('Python 3.11+ was not found. See tools/granth-ocr/INSTALL-WINDOWS.md');
}

export function runGranthOcr(args: string[]): never {
  const python = pythonExe();
  const result = spawnSync(python, [PIPELINE, ...args], { stdio: 'inherit' });
  process.exit(result.status ?? 1);
}
