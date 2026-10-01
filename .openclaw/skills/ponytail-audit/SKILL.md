---
name: ponytail-audit
description: "Audit the whole repo for over-engineering. A ranked list of what to delete, simplify, or replace with stdlib or native features."
homepage: https://github.com/DietrichGebert/ponytail
license: MIT
---

Review the repository for unnecessary complexity, not just a diff. Look for
unused flexibility, speculative layers, duplicated responsibilities, and
custom code or dependencies that a suitable existing facility can replace.
Files exporting one thing or interfaces with one implementation are not
inherently unnecessary: external I/O boundaries, centralized business rules,
test seams, and reduced coupling can justify them now. Do not introduce new
layers merely for imagined future use or to make files short.

## Findings

Use tags `delete`, `stdlib`, `native`, `yagni`, or `simplify`. For each
significant suggestion state the location, proposed change, current
complexity reduced, why the removal is justified or replacement sufficient,
behavior to preserve, and evidence or a specific check still needed.
Separate `supported` findings from `candidate` proposals needing investigation;
uncertainty does not authorize deletion. Rank by maintenance benefit,
confidence, and risk, not the biggest cut. Line/dependency counts are optional
supporting detail; do not invent precise savings.

## Checks on your suggestions

Inspect relevant callers and contracts before recommending a shared change;
different callers may need different validation. Verify relevant inputs,
edge cases, errors, returns, side effects, public contracts, security, data
integrity, accessibility, and required performance. Scale checks to the risk.
A replacement must meet the requirement; do not silently narrow requested scope.

Preserve descriptive names, clear multiline logic, useful helpers, and
comments explaining why or an external constraint. Splitting distinct current
responsibilities is legitimate; fewer files or lines are not success criteria.

Use the existing test framework and practices. Necessary tests and fixtures
are not over-engineering. Preserve behavior cases, meaningful assertions,
names, and failure localization when combining or parameterizing tests.
Removing a test needs evidence of duplicate coverage or a changed requirement,
not a shorter implementation. Suggest focused regression tests for bug fixes
when feasible. Checks follow behavior and risk, including one-line changes;
no artificial test-count cap or heavy suite for every trivial edit.

For database, network, collection, concurrency, or large-data changes, inspect
work and external-call growth. Preserve batching, needed pagination,
concurrency limits, and existing safeguards. Do not substitute N+1 queries or
worse time complexity for brevity. Name size assumptions for bounded-data
shortcuts. Use inspection, a query-count test, or measurement as appropriate;
not a benchmark for every suggestion.

Preserve necessary explanations, assumptions, checks, and material unchecked
risks. A `ponytail:` marker must name a concrete ceiling and trigger to revisit;
it cannot excuse violating requirements. An empty marker ledger does not
prove absence of debt.

## Boundaries

Report only; apply nothing. One-shot complexity audit, not a comprehensive
correctness review, but the correctness, safety, and performance consequences
of its own proposals are in scope. No justified changes: say "No supported
simplifications found" and report material candidates or unchecked areas;
this is not a general safety approval. "stop ponytail-audit" / "normal mode": revert.
