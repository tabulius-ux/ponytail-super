const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const forkUrl = 'https://github.com/tabulius-ux/ponytail-super';
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const readJson = (relativePath) => JSON.parse(read(relativePath));

test('Codex fetches the fork, and the other marketplaces load their own checkout', () => {
  const codex = readJson('.agents/plugins/marketplace.json');
  assert.equal(codex.name, 'ponytail-super');
  assert.deepEqual(codex.plugins[0].source, {
    source: 'url', url: `${forkUrl}.git`, ref: 'main',
  });
  for (const file of [
    '.claude-plugin/marketplace.json', '.github/plugin/marketplace.json',
    '.grok-plugin/marketplace.json',
  ]) {
    const marketplace = readJson(file);
    assert.equal(marketplace.name, 'ponytail-super', file);
    assert.equal(marketplace.plugins[0].name, 'ponytail', file);
    assert.equal(marketplace.plugins[0].source, './', file);
  }
  const manifest = readJson('.codex-plugin/plugin.json');
  assert.equal(manifest.skills, './skills/');
  assert.equal(manifest.hooks, './hooks/claude-codex-hooks.json');
  assert.equal(readJson('.claude-plugin/plugin.json').hooks, manifest.hooks);
});

test('install and update instructions cannot select upstream distribution', () => {
  for (const file of ['README.md', 'README.es.md', 'README.ko.md']) {
    const contents = read(file);
    const installation = contents.slice(contents.indexOf('### Claude Code'), contents.indexOf('### Cursor'));
    assert.doesNotMatch(installation, /DietrichGebert\/ponytail|@dietrichgebert\/ponytail|clawhub install/i, file);
    assert.match(installation, /marketplace add tabulius-ux\/ponytail-super/, file);
    assert.match(installation, /ponytail@ponytail-super/, file);
    assert.match(installation, /\.openclaw\/skills\/ponytail\*/, file);
  }
  const help = read('skills/ponytail-help/SKILL.md');
  assert.match(help, /marketplace update ponytail-super`/);
  assert.doesNotMatch(help, /marketplace update ponytail`|github\.com\/DietrichGebert\/ponytail/i);
  const pkg = readJson('package.json');
  assert.equal(pkg.name, '@tabulius-ux/ponytail-super');
  assert.equal(pkg.private, true);
  assert.equal(pkg.repository.url, `git+${forkUrl}.git`);
});

test('a copied installation reads all customized skills and local runtime instructions', (t) => {
  const installedRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ponytail-install-'));
  t.after(() => fs.rmSync(installedRoot, { recursive: true, force: true }));
  for (const directory of ['hooks', 'skills']) {
    fs.cpSync(path.join(root, directory), path.join(installedRoot, directory), { recursive: true });
  }
  for (const name of fs.readdirSync(path.join(root, 'skills'))) {
    assert.equal(
      fs.readFileSync(path.join(installedRoot, 'skills', name, 'SKILL.md'), 'utf8'),
      read(`skills/${name}/SKILL.md`),
      name,
    );
  }
  const original = require('../hooks/ponytail-instructions');
  const installed = require(path.join(installedRoot, 'hooks', 'ponytail-instructions.js'));
  for (const mode of ['lite', 'full', 'ultra', 'review']) {
    const instructions = installed.getPonytailInstructions(mode);
    assert.equal(instructions, original.getPonytailInstructions(mode), mode);
    assert.match(instructions, /preserve\s+batching/i, mode);
  }
  // Prove the installed builder reads its own skill, rather than the source checkout.
  const skill = path.join(installedRoot, 'skills', 'ponytail', 'SKILL.md');
  fs.appendFileSync(skill, '\nInstalled checkout provenance marker\n');
  assert.match(installed.getPonytailInstructions('full'), /Installed checkout provenance marker/);
  assert.doesNotMatch(original.getPonytailInstructions('full'), /Installed checkout provenance marker/);
});

test('ClawHub publishing refuses upstream slugs before invoking an external CLI', () => {
  const result = spawnSync(process.execPath, [path.join(root, 'scripts/publish-openclaw-skills.js')], {
    cwd: root, encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Registry publishing is disabled for this fork/);
  assert.equal(result.stdout, '');
});
