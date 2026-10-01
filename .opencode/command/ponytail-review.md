---
description: Review changes for justified simplifications; report only
---

Review diffs for unnecessary complexity. Prefer clearer responsibilities and
less maintenance burden while preserving requirements, not the shortest diff.

## Findings

For each significant suggestion, give the location, proposed change,
complexity it removes, why removal is justified or the replacement sufficient,
behavior to preserve, and supporting evidence or a specific check still needed.
Keep it concise, but do not force findings into one line.

Use `supported` for evidence-backed changes and `candidate` for proposals
needing investigation. Uncertainty is not permission to delete. Rank by
current maintenance benefit, confidence, and risk; line/dependency counts are
optional supporting detail, not a score. Do not invent precise savings.

Tags:

- `delete:` demonstrably dead code, unused flexibility, or speculative features.
- `stdlib:` custom code a suitable standard-library feature can replace.
- `native:` code or a dependency a suitable platform feature can replace.
- `yagni:` an abstraction serving only imagined future needs.
- `simplify:` clearer equivalent logic or separation of existing responsibilities.

## Checks on your suggestions

Check the effects of your own proposals on correctness, security, data
integrity, accessibility, public contracts, and performance. Trace relevant
callers, inputs, errors, returns, and side effects; different callers can
have different contracts. A native feature must cover the required behavior.
Do not silently reduce requested scope.

Keep descriptive names, clear multiline logic, useful helpers, and comments
explaining why or an external constraint. Splitting distinct responsibilities
can help; line counts alone do not justify merging or splitting files. A
boundary that isolates external I/O, centralizes a business rule, supports
testing, or reduces coupling can be useful with one implementation or caller.
Do not demand interfaces or dependency injection without a current need.

Use the existing test framework and practices. Necessary tests and fixtures
are not over-engineering: preserve behavior cases, meaningful assertions,
names, and failure localization even when combining or parameterizing tests.
Removing a test requires evidence of duplicate coverage or a changed
requirement. Shorter code does not justify fewer tests. Suggest focused
regression coverage for bug fixes when feasible; even a one-line change may
need checks, depending on behavior and risk. No artificial test-count cap.

For database, network, collection, concurrency, or large-data changes, inspect
work and external-call growth. Preserve batching, needed pagination,
concurrency limits, and other safeguards. Do not replace batch fetches with
N+1 queries or worsen time complexity for brevity. Bounded-data shortcuts
need a concrete size assumption. Inspection, a query-count test, or a focused
measurement can suffice; no blanket benchmark requirement.

A `ponytail:` comment records a concrete ceiling and trigger to revisit a
valid shortcut; it does not justify breaking a requirement. Keep necessary
explanations, assumptions, test results, and material verification gaps.

## Examples

- `supported · format.js:L4 · native:` Replace the format-only date dependency with the platform formatter. Removes dependency upkeep; callers use only the locale and timezone options covered by it. Preserve those options and error behavior; existing output tests cover the supported locales.
- `candidate · repo.py:L88 · yagni:` A repository interface has one implementation. Check whether it isolates external I/O or supports test substitution before proposing removal; implementation count alone is not evidence.
- `candidate · pairs.py:L30 · simplify:` A dict construction may use a built-in. Verify length-mismatch, duplicate-key, and invalid-input handling before replacement; a shorter expression alone is insufficient.

## Boundaries

Report only; do not apply fixes. This remains a complexity review, not a
comprehensive general audit, but the consequences of its own suggestions are
in scope. No justified changes: say "No supported simplifications found" and
report any material candidates or unchecked areas; do not imply general
correctness or safety approval. "stop ponytail-review" / "normal mode": revert.
