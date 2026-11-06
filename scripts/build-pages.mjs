import { cp, mkdir, rm, symlink, readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
const root = process.cwd();
const stage = path.join(root, '.pages-build');
await rm(stage, { recursive: true, force: true });
await mkdir(stage);
const ignored = new Set(['node_modules', '.next', '.git', '.pages-build', 'out']);
for (const entry of await readdir(root)) {
 if (ignored.has(entry)) continue;
 await cp(path.join(root, entry), path.join(stage, entry), { recursive: true, filter: source => {
 const rel = path.relative(root, source);
 if (!rel) return true;
 if (rel.split(path.sep).some(part => ignored.has(part))) return false;
 if (rel === 'src/app/api' || rel.startsWith(`src/app/api${path.sep}`)) return false;
 return !path.basename(source).startsWith('.env') || path.basename(source) === '.env.example';
} });
}
await symlink(path.join(root, 'node_modules'), path.join(stage, 'node_modules'), 'dir');
const result = spawnSync(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'build', '--webpack'], {
 cwd: stage, stdio: 'inherit', env: { ...process.env, STATIC_EXPORT: 'true', NEXT_PUBLIC_STATIC_EXPORT: 'true', NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? '/cognalys-intelligence' }
});
if (result.status !== 0) process.exit(result.status || 1);
await rm(path.join(root, 'out'), { recursive: true, force: true });
await cp(path.join(stage, 'out'), path.join(root, 'out'), { recursive: true });
