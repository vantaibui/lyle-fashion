import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { lstat, readFile, readdir, realpath } from 'node:fs/promises';
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
const requiredSkills = [
  'find-skills',
  'frontend-design',
  'lyle-ecommerce',
  'next-best-practices',
  'ui-ux-pro-max',
  'vercel-react-best-practices',
  'web-design-guidelines',
];
const failures = [];

async function filesUnder(directory, base = directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesUnder(entryPath, base)));
    else if (entry.isFile())
      files.push(path.relative(base, entryPath).split(path.sep).join('/'));
    else failures.push(`Unsupported canonical entry: ${entryPath}`);
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

async function readJson(file, label) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    failures.push(`${label}: ${error.message}`);
    return null;
  }
}

const lock = await readJson(lockPath, 'Lock file');
if (!lock || lock.schemaVersion !== 1 || !Array.isArray(lock.skills)) {
  failures.push(
    'Lock metadata must use schemaVersion 1 and contain a skills array.',
  );
} else {
  const lockedNames = lock.skills.map(({ name }) => name).sort();
  if (JSON.stringify(lockedNames) !== JSON.stringify(requiredSkills)) {
    failures.push(
      `Lock skills mismatch: expected ${requiredSkills.join(', ')}`,
    );
  }

  for (const skill of lock.skills) {
    for (const field of [
      'name',
      'sourceRepository',
      'sourcePath',
      'version',
      'commit',
      'license',
      'installDate',
      'runtimeRequirements',
      'integrity',
      'review',
    ]) {
      if (
        skill[field] === undefined ||
        skill[field] === null ||
        skill[field] === ''
      ) {
        failures.push(
          `${skill.name ?? 'unknown'}: missing lock field ${field}`,
        );
      }
    }

    const skillPath = path.join(canonicalRoot, skill.name);
    try {
      const skillDocument = await readFile(
        path.join(skillPath, 'SKILL.md'),
        'utf8',
      );
      const frontmatter = skillDocument.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!frontmatter) {
        failures.push(`${skill.name}: SKILL.md has no YAML frontmatter`);
      } else {
        const declaredName = frontmatter[1].match(
          /^name:\s*["']?([^"'\r\n]+)["']?\s*$/m,
        )?.[1];
        if (declaredName !== skill.name) {
          failures.push(
            `${skill.name}: SKILL.md declares ${declaredName ?? 'no name'}`,
          );
        }
        if (!/^description:\s*.+$/m.test(frontmatter[1])) {
          failures.push(`${skill.name}: SKILL.md has no description`);
        }
      }
      const actualIntegrity = await hashDirectory(skillPath);
      if (
        skill.integrity.algorithm !== 'sha256' ||
        skill.integrity.value !== actualIntegrity
      ) {
        failures.push(`${skill.name}: canonical integrity mismatch`);
      }
    } catch (error) {
      failures.push(`${skill.name}: ${error.message}`);
    }
  }
}

for (const adapterRootRelative of adapterRoots) {
  const adapterRoot = path.join(root, adapterRootRelative);
  const manifest = await readJson(
    path.join(adapterRoot, '.agent-skills-adapters.json'),
    `${adapterRootRelative} manifest`,
  );

  for (const name of requiredSkills) {
    const canonicalPath = path.join(canonicalRoot, name);
    const adapterPath = path.join(adapterRoot, name);
    try {
      const stats = await lstat(adapterPath);
      if (stats.isSymbolicLink()) {
        if ((await realpath(adapterPath)) !== (await realpath(canonicalPath))) {
          failures.push(
            `${adapterRootRelative}/${name}: link does not target canonical skill`,
          );
        }
      } else if (process.platform === 'win32') {
        if ((await realpath(adapterPath)) !== (await realpath(canonicalPath))) {
          const actual = await hashDirectory(adapterPath);
          const expected = await hashDirectory(canonicalPath);
          if (actual !== expected)
            failures.push(`${adapterRootRelative}/${name}: stale copied skill`);
        }
      } else {
        const actual = await hashDirectory(adapterPath);
        const expected = await hashDirectory(canonicalPath);
        if (actual !== expected)
          failures.push(`${adapterRootRelative}/${name}: stale copied skill`);
      }

      if (!manifest?.generated?.[name]) {
        failures.push(
          `${adapterRootRelative}/${name}: missing adapter manifest metadata`,
        );
      }
    } catch (error) {
      failures.push(
        `${adapterRootRelative}/${name}: missing or broken adapter (${error.message})`,
      );
    }
  }
}

const nodeMajor = Number(process.versions.node.split('.')[0]);
if (nodeMajor < 22)
  failures.push(`Node.js >=22 required; found ${process.versions.node}`);

const python = spawnSync(
  process.platform === 'win32' ? 'python' : 'python3',
  ['--version'],
  {
    encoding: 'utf8',
  },
);
if (python.status !== 0)
  failures.push('Python 3 is required for ui-ux-pro-max scripts.');

if (failures.length) {
  console.error('Agent skills verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Verified ${requiredSkills.length} canonical skills and ${adapterRoots.length} adapter roots.`,
);
console.log(
  `Runtime: Node ${process.versions.node}; ${(python.stdout || python.stderr).trim()}`,
);
