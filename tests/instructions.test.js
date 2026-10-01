const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { getPonytailInstructions, getFallbackInstructions } = require('../hooks/ponytail-instructions');

const root = path.join(__dirname, '..');
const skillPath = path.join(root, 'skills', 'ponytail', 'SKILL.md');
const reviewPath = path.join(root, 'skills', 'ponytail-review', 'SKILL.md');
const core = fs.readFileSync(skillPath, 'utf8');
const compact = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8')
  .replace(/\n\n\(Yes, this file also applies[\s\S]*?\)\s*$/, '').trim();

// These text contracts detect delivery regressions, not future model behavior.
const safeguards = [
  ['readability over counts', /Code, file, and token counts are secondary, not success criteria/],
  ['clear logic and names', /Keep descriptive names, clear multiline logic, and useful helpers/],
  ['responsibility separation', /splitting a file is justified/],
  ['useful single-implementation boundaries', /isolates external I\/O.*one implementation or caller/],
  ['caller-specific contracts', /callers can have different contracts/i],
  ['existing test practices', /existing test framework and practices/],
  ['test preservation', /meaningful assertions.*failure localization/],
  ['evidence for test removal', /duplicate coverage or a changed requirement/],
  ['bug regression checks', /regression test that fails on the original bug/],
  ['one-line risk', /even one-line changes to permissions, boundaries, money, or data handling may need tests/],
  ['batching', /do not replace a batch fetch with per-item queries \(N\+1\)/],
  ['request safeguards', /pagination, concurrency limits/],
  ['complexity and bounds', /Do not worsen time complexity.*size bound or assumption/],
  ['public contracts', /Preserve public contracts, security, data integrity, accessibility, and required performance/],
  ['requested scope', /do not silently reduce requested scope/i],
  ['debt limits', /A comment cannot justify violating requirements/],
  ['necessary explanations', /checks performed and material unchecked risks/],
];

for (const mode of ['lite', 'full', 'ultra']) {
  for (const [label, pattern] of safeguards) {
    test(`${mode} delivers ${label} in normal and fallback instructions`, () => {
      for (const [route, text] of [
        ['skill', getPonytailInstructions(mode)],
        ['fallback', getFallbackInstructions(mode)],
      ]) {
        assert.match(text.replace(/\s+/g, ' '), pattern, `${mode} ${route}: ${label}`);
      }
    });
  }

  test(`${mode} filters only other intensity rows and examples`, () => {
    const instructions = getPonytailInstructions(mode);
    assert.ok(instructions.startsWith(`PONYTAIL MODE ACTIVE — level: ${mode}\n\n`));
    assert.doesNotMatch(instructions, /^---/m);
    for (const line of core.split('\n').filter((line) => /^\| \*\*(lite|full|ultra)\*\*|^- (lite|full|ultra): "/.test(line))) {
      const belongsToMode = line.startsWith(`| **${mode}**`) || line.startsWith(`- ${mode}:`);
      assert.equal(instructions.includes(line), belongsToMode, line);
    }
    assert.match(instructions, /60-second expiry/);
    assert.match(instructions, /invalidation/);
  });

  test(`${mode} read failure actually delivers the compact fallback`, (t) => {
    const originalRead = fs.readFileSync;
    t.mock.method(fs, 'readFileSync', (file, ...args) => {
      if (file === skillPath) throw Object.assign(new Error('missing skill'), { code: 'ENOENT' });
      return originalRead(file, ...args);
    });
    const delivered = getPonytailInstructions(mode);
    assert.equal(delivered, getFallbackInstructions(mode));
    assert.ok(delivered.includes(compact), 'fallback must carry all compact safeguards');
  });
}

test('review mode delivers the report-only review skill, not just a reference', () => {
  const body = fs.readFileSync(reviewPath, 'utf8').replace(/^---[\s\S]*?---\s*/, '');
  assert.equal(getPonytailInstructions('review'), `PONYTAIL MODE ACTIVE — level: review\n\n${body}`);
});

test('missing review skill retains reporting and preservation requirements', (t) => {
  const originalRead = fs.readFileSync;
  t.mock.method(fs, 'readFileSync', (file, ...args) => {
    if (file === reviewPath) throw Object.assign(new Error('missing review'), { code: 'ENOENT' });
    return originalRead(file, ...args);
  });
  const text = getPonytailInstructions('review').replace(/\s+/g, ' ');
  assert.match(text, /Report only; do not apply fixes/);
  assert.match(text, /why removal is justified or replacement sufficient/);
  assert.match(text, /Separate supported findings from candidates/);
  assert.match(text, /correctness, security, data integrity, accessibility, public-contract, and performance/);
  assert.match(text, /Removing a test needs evidence of duplicate coverage or a changed requirement/);
  assert.match(text, /do not introduce N\+1 or worse time complexity/);
  assert.match(text, /keep useful I\/O.*even with one implementation/);
});

test('active core text no longer contains conflicting minimization instructions', () => {
  for (const text of [core, compact, getFallbackInstructions('ultra')]) {
    assert.doesNotMatch(text, /Can (?:this|it) be one line|Fewest files possible|Shortest working diff wins|ONE runnable check|No frameworks|Trivial one-liners need no test|at most three short lines|delete the explanation|no interface with one implementation/i);
  }
});

for (const name of ['ponytail-review', 'ponytail-audit']) {
  test(`${name} requires evidence and checks consequences without applying fixes`, () => {
    const text = fs.readFileSync(path.join(root, 'skills', name, 'SKILL.md'), 'utf8').replace(/\s+/g, ' ');
    assert.match(text, /Report only; (?:do not apply fixes|apply nothing)/);
    assert.match(text, /why (?:removal is justified or the replacement sufficient|the removal is justified or replacement sufficient)/);
    assert.match(text, /behavior to preserve/);
    assert.match(text, /evidence or a specific check still needed/);
    assert.match(text, /`supported`/);
    assert.match(text, /`candidate`/);
    assert.match(text, /failure localization/);
    assert.match(text, /duplicate coverage or a changed requirement/);
    assert.match(text, /security, data integrity, accessibility/);
    assert.match(text, /performance/);
    assert.match(text, /N\+1/);
    assert.doesNotMatch(text, /performance are explicitly out of scope|only metric that matters|End with.*net:|Lean already\. Ship/);
  });
}
