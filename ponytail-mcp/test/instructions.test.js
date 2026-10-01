import assert from "node:assert/strict";
import test from "node:test";

import { MODES, resolveMode, buildInstructions } from "../instructions.js";

test("resolveMode keeps valid intensities", () => {
  for (const mode of MODES) assert.equal(resolveMode(mode), mode);
});

test("resolveMode falls back to a runtime intensity for off/unknown/empty", () => {
  // PONYTAIL_DEFAULT_MODE could be anything in CI, so just assert the contract:
  // never returns "off", "review", or junk — always one of the served modes.
  for (const input of ["off", "review", "nonsense", "", undefined, null]) {
    assert.ok(MODES.includes(resolveMode(input)), `resolveMode(${input}) must be a served mode`);
  }
});

test("buildInstructions returns the ruleset tagged with the resolved mode", () => {
  const text = buildInstructions("ultra");
  assert.match(text, /PONYTAIL MODE ACTIVE/);
  assert.match(text, /ultra/);
});

for (const mode of MODES) {
  test(`${mode} MCP instructions match the shared builder with safeguards intact`, async () => {
    const { createRequire } = await import('node:module');
    const require = createRequire(import.meta.url);
    const { getPonytailInstructions } = require('../../hooks/ponytail-instructions.js');
    const text = buildInstructions(mode);
    assert.equal(text, getPonytailInstructions(mode));
    assert.match(text, /existing test framework/);
    assert.match(text, /N\+1/);
    assert.match(text, /one implementation or caller/);
    assert.match(text, /clear multiline logic/);
    assert.match(text, /All active modes keep the same behavior/);
  });
}
