import { mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const output = resolve(process.cwd(), 'dist');
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
