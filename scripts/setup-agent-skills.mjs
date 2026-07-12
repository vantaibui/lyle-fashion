import { createHash } from 'node:crypto';
import {
  cp,
  lstat,
  mkdir,
  readFile,
  readdir,
  realpath,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const canonicalRoot = path.join(root, '.agents', 'skills');
const lockPath = path.join(root, 'agent-skills.lock.json');
const adapterRoots = [
  '.claude/skills',
  '.codex/skills',
  '.cursor/skills',
  '.github/skills',
];
const manifestName = '.agent-skills-adapters.json';

async function exists(target) {
  try {
    await lstat(target);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

async function filesUnder(directory, base = directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesUnder(entryPath, base)));
    else if (entry.isFile())
      files.push(path.relative(base, entryPath).split(path.sep).join('/'));
    else throw new Error(`Unsupported canonical entry: ${entryPath}`);
  }

  return files;
}

async function hashDirectory(directory) {
  const hash = createHash('sha256');
  for (const relativePath of await filesUnder(directory)) {
    hash.update(relativePath);
    hash.update('\0');
    hash.update(await readFile(path.join(directory, relativePath)));
    hash.update('\0');
  }
  return hash.digest('hex');
}

async function readManifest(adapterRoot) {
  try {
    return JSON.parse(
      await readFile(path.join(adapterRoot, manifestName), 'utf8'),
    );
  } catch (error) {
    if (error.code === 'ENOENT') return { schemaVersion: 1, generated: {} };
    throw error;
  }
}

async function pointsToCanonical(adapterPath, canonicalPath) {
  try {
    return (await realpath(adapterPath)) === (await realpath(canonicalPath));
  } catch {
    return false;
  }
}

async function createAdapter(adapterPath, canonicalPath) {
  if (process.platform === 'win32') {
    try {
      await symlink(canonicalPath, adapterPath, 'junction');
      return 'junction';
    } catch (error) {
      if (!['EPERM', 'EACCES', 'ENOTSUP', 'UNKNOWN'].includes(error.code))
        throw error;
    }
  } else {
    try {
      const target = path.relative(path.dirname(adapterPath), canonicalPath);
      await symlink(target, adapterPath, 'dir');
      return 'symlink';
    } catch (error) {
      if (!['EPERM', 'EACCES', 'ENOTSUP', 'UNKNOWN'].includes(error.code))
        throw error;
    }
  }

  await cp(canonicalPath, adapterPath, {
    recursive: true,
    force: false,
    errorOnExist: true,
    preserveTimestamps: true,
  });
  return 'copy';
}

const lock = JSON.parse(await readFile(lockPath, 'utf8'));
const skillNames = lock.skills.map(({ name }) => name).sort();
const failures = [];

for (const adapterRootRelative of adapterRoots) {
  const adapterRoot = path.join(root, adapterRootRelative);
  await mkdir(adapterRoot, { recursive: true });
  const previous = await readManifest(adapterRoot);
  const generated = {};

  for (const name of skillNames) {
    const canonicalPath = path.join(canonicalRoot, name);
    const adapterPath = path.join(adapterRoot, name);
    const integrity = await hashDirectory(canonicalPath);

    if (await exists(adapterPath)) {
      if (await pointsToCanonical(adapterPath, canonicalPath)) {
        const stats = await lstat(adapterPath);
        generated[name] = {
          mode: stats.isSymbolicLink() ? 'symlink' : 'junction',
          integrity,
        };
        console.log(`${adapterRootRelative}/${name}: existing link`);
        continue;
      }

      if (previous.generated?.[name]) {
        await rm(adapterPath, { recursive: true, force: true });
      } else {
        failures.push(
          `${adapterRootRelative}/${name}: unrelated path preserved; adapter not generated`,
        );
        continue;
      }
    }

    const mode = await createAdapter(adapterPath, canonicalPath);
    generated[name] = { mode, integrity };
    console.log(`${adapterRootRelative}/${name}: generated ${mode}`);
  }

  await writeFile(
    path.join(adapterRoot, manifestName),
    `${JSON.stringify(
      {
        schemaVersion: 1,
        canonical: path
          .relative(adapterRoot, canonicalRoot)
          .split(path.sep)
          .join('/'),
        generated,
      },
      null,
      2,
    )}\n`,
  );
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    `Generated adapters for ${skillNames.length} skills across ${adapterRoots.length} agents.`,
  );
}
