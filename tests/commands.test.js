#!/usr/bin/env node
// Every ponytail command the pi extension registers must also ship as a
// file-based command for the hosts that need one: Claude Code (commands/*.toml,
// which Gemini CLI reuses) and OpenCode (.opencode/command/*.md). /ponytail-help
// was advertised in the README and the help card but missing both files; this
// guards that drift -- a registered command with no adapter file fails here.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

// pi-extension registers the canonical command set.
const piSource = fs.readFileSync(path.join(root, 'pi-extension', 'index.js'), 'utf8');
const commands = [...piSource.matchAll(/registerCommand\(["']([\w-]+)["']/g)].map((m) => m[1]);

test('pi registers at least the base command', () => {
  assert.ok(commands.includes('ponytail'), 'expected pi to register a ponytail command');
});

test('every registered command ships a Claude commands/*.toml', () => {
  for (const name of commands) {
    assert.ok(
      fs.existsSync(path.join(root, 'commands', `${name}.toml`)),
      `missing commands/${name}.toml`,
    );
  }
});

test('every registered command ships an OpenCode .opencode/command/*.md', () => {
  for (const name of commands) {
    assert.ok(
      fs.existsSync(path.join(root, '.opencode', 'command', `${name}.md`)),
      `missing .opencode/command/${name}.md`,
    );
  }
});

for (const name of commands) {
  test(`${name} command copies preserve the full applicable instruction body`, () => {
    const markdown = fs.readFileSync(path.join(root, '.opencode', 'command', `${name}.md`), 'utf8')
      .replace(/^---\n[\s\S]*?\n---\n*/, '').trim();
    const toml = fs.readFileSync(path.join(root, 'commands', `${name}.toml`), 'utf8');
    // These adapters use a TOML basic string with JSON-compatible escaping.
    const prompt = JSON.parse(toml.match(/^prompt = (".*")$/m)[1]);
    if (name === 'ponytail') {
      const compact = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8')
        .replace(/\n\n\(Yes, this file also applies[\s\S]*?\)\s*$/, '').trim();
      assert.match(markdown, /\$ARGUMENTS/);
      assert.match(prompt, /\{\{args\}\}/);
      assert.equal(markdown.replace('$ARGUMENTS', '{{args}}'), prompt);
      assert.equal(prompt.slice(prompt.indexOf('# Ponytail')), compact);
    } else {
      const body = fs.readFileSync(path.join(root, 'skills', name, 'SKILL.md'), 'utf8')
        .replace(/^---\n[\s\S]*?\n---\n*/, '').trim();
      assert.equal(markdown, body, 'OpenCode command drifted from skill');
      assert.equal(prompt, body, 'TOML command drifted from skill');
    }
  });
}
