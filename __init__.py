"""Hermes plugin for Ponytail."""

from __future__ import annotations

import json
import os
import re
from pathlib import Path
from typing import Any, Callable

DEFAULT_MODE = "full"
RUNTIME_MODES = {"off", "lite", "full", "ultra"}
CONFIG_MODES = RUNTIME_MODES | {"review"}
SKILL_COMMANDS = {
    "ponytail-review": "Review the current diff or provided target for over-engineering.",
    "ponytail-audit": "Audit the repo for over-engineering and deletion opportunities.",
    "ponytail-debt": "List every deliberate `ponytail:` shortcut and its upgrade path.",
    "ponytail-gain": "Show the measured-impact scoreboard (less code, less cost, more speed).",
    "ponytail-help": "Show the Ponytail command reference.",
}

ROOT = Path(__file__).resolve().parent
SKILLS_DIR = ROOT / "skills"
PONYTAIL_SKILL = SKILLS_DIR / "ponytail" / "SKILL.md"
REVIEW_SKILL = SKILLS_DIR / "ponytail-review" / "SKILL.md"

_current_mode = None


def _normalize_runtime_mode(mode: str | None) -> str | None:
    if not isinstance(mode, str):
        return None
    mode = mode.strip().lower()
    return mode if mode in RUNTIME_MODES else None


def _normalize_config_mode(mode: str | None) -> str | None:
    if not isinstance(mode, str):
        return None
    mode = mode.strip().lower()
    return mode if mode in CONFIG_MODES else None


def _config_dir() -> Path:
    if os.environ.get("XDG_CONFIG_HOME"):
        return Path(os.environ["XDG_CONFIG_HOME"]) / "ponytail"
    if os.name == "nt":
        return Path(os.environ.get("APPDATA", Path.home() / "AppData" / "Roaming")) / "ponytail"
    return Path.home() / ".config" / "ponytail"


def _default_mode() -> str:
    env_mode = _normalize_config_mode(os.environ.get("PONYTAIL_DEFAULT_MODE"))
    if env_mode:
        return env_mode
    try:
        data = json.loads((_config_dir() / "config.json").read_text(encoding="utf-8"))
        file_mode = _normalize_config_mode(data.get("defaultMode"))
        if file_mode:
            return file_mode
    except Exception:
        pass
    return DEFAULT_MODE


def _strip_frontmatter(text: str) -> str:
    return re.sub(r"^---[\s\S]*?---\s*", "", text or "", count=1)


def _filter_skill_body_for_mode(body: str, mode: str) -> str:
    effective = _normalize_runtime_mode(mode) or DEFAULT_MODE
    lines = []
    for line in _strip_frontmatter(body).splitlines():
        table_label = re.match(r"^\|\s*\*\*(.+?)\*\*\s*\|", line)
        if table_label:
            label_mode = _normalize_runtime_mode(table_label.group(1))
            if label_mode and label_mode != effective:
                continue

        example_label = re.match(r"^-\s*([^:]+):\s*", line)
        if example_label:
            label_mode = _normalize_runtime_mode(example_label.group(1))
            if label_mode and label_mode != effective:
                continue

        lines.append(line)
    return "\n".join(lines)


def _fallback_instructions(mode: str) -> str:
    return f"PONYTAIL MODE ACTIVE — level: {mode}\n\n" + """# Ponytail, lazy senior dev mode

You are a lazy senior developer. Lazy means efficient, not careless. The best code is the code never written.

Prefer the simplest implementation that meets requirements, preserves needed behavior, and is easy to understand and change. Code, file, and token counts are secondary, not success criteria.

Before writing code, understand the task and trace the affected flow. Stop at the first rung that meets the relevant requirements and fits the project's practices:

1. Does this need to exist at all? Skip speculative needs (YAGNI); do not silently reduce requested scope. Agree on requirement changes with the user.
2. Does it already exist in this codebase? Look for a suitable helper, type, or pattern before writing another.
3. Does the standard library cover the needed behavior? Use it.
4. Does a native platform feature cover the required behavior, accessibility, and target support? Use it.
5. Does an already-installed dependency fit? Reuse it. Add a dependency only for a current need it justifies.
6. Only then: write clear, conventional code for the remaining need.

Before a replacement, check relevant inputs, edge cases, errors, return values, side effects, and caller expectations. Preserve public contracts, security, data integrity, accessibility, and required performance. Scale the check to the replacement's risk, not a heavy checklist for every edit.

Bug fix = root cause, not symptom. Inspect every caller of the function you change. Fix the cause at the appropriate responsibility boundary; callers can have different contracts, so do not move all validation into a shared function automatically. A small diff helps only when it is in the right place.

Rules:

- Boring over clever. Keep descriptive names, clear multiline logic, and useful helpers; do not shorten or inline them just to save lines.
- Separate responsibilities: splitting a file is justified when it clarifies current responsibilities and dependencies. Do not merge them into a large function or file to minimize counts, or add layers just to make files short. No arbitrary line limits.
- Reject speculative abstractions. A boundary that isolates external I/O, centralizes a business rule, supports testing, or reduces coupling can earn its place with one implementation or caller. Interfaces and dependency injection are options, not defaults.
- No boilerplate or scaffolding "for later". Reuse what fits; remove only what is shown to be unnecessary.
- Mark deliberate simplifications that cut a real corner with a `ponytail:` comment naming the ceiling and upgrade path: a concrete limit or assumption and a trigger to revisit it (for example, a naive heuristic over an input capped at 20 items). A comment cannot justify violating requirements.

Tests: use the project's existing test framework and practices, including fixtures where useful; do not add a new framework without a need. Preserve behavior cases, meaningful assertions, descriptive names, and failure localization when combining or parameterizing tests. Removing a test needs concrete evidence of duplicate coverage or a changed requirement, not a shorter implementation. For bug fixes, add a focused regression test that fails on the original bug when feasible. Choose checks by changed behavior and risk, not line count: even one-line changes to permissions, boundaries, money, or data handling may need tests. Cover relevant cases; no artificial test-count limit and no heavy suite required for every trivial edit.

Performance: for databases, network calls, collections, concurrency, or large data, inspect how work and external calls grow with input size. Preserve batching; do not replace a batch fetch with per-item queries (N+1) without a justified reason. Preserve needed pagination, concurrency limits, and existing safeguards. Avoiding N+1 is not automatically premature optimization. Do not worsen time complexity just for shorter code. A simple algorithm for genuinely bounded data is fine; name the relevant size bound or assumption. Use proportionate evidence: inspection, a focused query-count test, or measurement; not a benchmark for every change.

Never simplify away input validation at trust boundaries, error handling that prevents data loss, security, data integrity, accessibility, explicitly requested behavior, or the calibration real hardware needs.

Be concise, but preserve comments explaining why or an external constraint, important assumptions and tradeoffs, checks performed and material unchecked risks, and requested reports and explanations. No fixed response line limit or comparison to code length.

All active modes keep these safeguards: lite suggests suitable alternatives, full applies the ladder, and ultra challenges speculative scope more strongly without silently dropping requested behavior.

"stop ponytail" / "normal mode": revert. Switch: /ponytail lite|full|ultra.
"""


def build_injected_context(mode: str | None = None) -> str:
    """Return the mode-filtered Ponytail context injected before LLM turns."""
    configured = _normalize_config_mode(mode) or _default_mode()
    if configured == "off":
        return ""
    if configured == "review":
        try:
            body = REVIEW_SKILL.read_text(encoding="utf-8")
            return f"PONYTAIL MODE ACTIVE — level: review\n\n{_strip_frontmatter(body)}"
        except OSError:
            return "PONYTAIL MODE ACTIVE — level: review\n\n" + """Review diffs for unnecessary complexity. Report only; do not apply fixes.
For each significant suggestion state the location, proposed change, current
complexity reduced, why removal is justified or replacement sufficient,
behavior to preserve, and evidence or the specific check still needed.
Separate supported findings from candidates needing investigation. Uncertainty
is not permission to delete. Rank by maintenance benefit, confidence, and risk;
line counts are secondary. Do not invent precise savings or give general
safety approval when no supported simplifications are found.

Check the correctness, security, data integrity, accessibility, public-contract,
and performance consequences of your own suggestions. Inspect callers and
their relevant inputs, errors, returns, and side effects; callers can have
different contracts. Do not silently narrow requirements. Preserve descriptive
names, clear multiline logic, useful helpers, and comments explaining why.
Splitting current responsibilities can help. Reject speculative layers, but
keep useful I/O, business-rule, or testing boundaries even with one implementation.

Use the existing test framework and practices. Preserve behavior cases,
meaningful assertions, names, and failure localization. Removing a test needs
evidence of duplicate coverage or a changed requirement, not a shorter
implementation. Suggest focused regression checks for bug fixes when feasible.
Checks follow behavior and risk, even for one-line changes; no test-count cap.
Necessary tests and fixtures are not over-engineering.

For database, network, collection, concurrency, or large-data changes, inspect
work and external-call growth. Preserve batching, needed pagination,
concurrency limits, and other safeguards; do not introduce N+1 or worse time
complexity for brevity. Name bounds for bounded-data shortcuts. Use inspection,
a query-count test, or measurement as appropriate, not mandatory benchmarks.
Keep assumptions, checks, and material verification gaps visible. A ponytail:
marker needs a concrete ceiling and revisit trigger; it cannot excuse unmet
requirements. An empty ledger does not prove absence of debt."""

    effective = _normalize_runtime_mode(configured) or DEFAULT_MODE
    try:
        body = PONYTAIL_SKILL.read_text(encoding="utf-8")
        return f"PONYTAIL MODE ACTIVE — level: {effective}\n\n{_filter_skill_body_for_mode(body, effective)}"
    except OSError:
        return _fallback_instructions(effective)


def _pre_llm_call(session_id: str = "", **_: Any) -> dict[str, str] | None:
    mode = _current_mode or _default_mode()
    context = build_injected_context(mode)
    return {"context": context} if context else None


def _skill_prompt(command: str, args: str = "") -> str:
    tail = args.strip()
    target = f"\n\nUser arguments: {tail}" if tail else ""
    return (
        f"Load and follow the Hermes plugin skill `ponytail:{command}`. "
        f"{SKILL_COMMANDS[command]}{target}"
    )


def _slash_access_denied(event: Any, gateway: Any, command: str) -> bool:
    if gateway is None or event is None:
        return False
    checker = getattr(gateway, "_check_slash_access", None)
    source = getattr(event, "source", None)
    if checker is None or source is None:
        return False
    try:
        return checker(source, command) is not None
    except Exception:
        return True


def rewrite_gateway_command(event: Any = None, gateway: Any = None, **_: Any) -> dict[str, str] | None:
    """Rewrite authorized gateway /ponytail-* commands into normal agent prompts."""
    text = str(getattr(event, "text", "") or "").strip()
    if not text.startswith("/"):
        return None
    head, _, rest = text[1:].partition(" ")
    command = head.replace("_", "-").lower()
    if command not in SKILL_COMMANDS:
        return None
    if _slash_access_denied(event, gateway, command):
        return None
    return {"action": "rewrite", "text": _skill_prompt(command, rest)}


def _handle_mode_command(raw_args: str) -> str:
    global _current_mode
    arg = (raw_args or "").strip().lower()
    if not arg:
        mode = _current_mode or _default_mode()
        return f"Ponytail mode: {mode}. Use `/ponytail lite|full|ultra|off`."
    mode = _normalize_runtime_mode(arg)
    if not mode:
        return "Usage: /ponytail [lite|full|ultra|off]"
    _current_mode = mode
    return f"Ponytail mode set to {mode}."


def _make_skill_command_handler(ctx: Any, command: str) -> Callable[[str], str]:
    def handler(raw_args: str) -> str:
        prompt = _skill_prompt(command, raw_args or "")
        injected = False
        try:
            injected = bool(ctx.inject_message(prompt))
        except Exception:
            injected = False
        if injected:
            return f"Queued `{command}` for the agent."
        return prompt

    return handler


def register(ctx: Any) -> None:
    """Register Ponytail hooks, skills, and slash commands with Hermes."""
    for child in sorted(SKILLS_DIR.iterdir() if SKILLS_DIR.exists() else []):
        skill_md = child / "SKILL.md"
        if child.is_dir() and skill_md.exists():
            ctx.register_skill(child.name, skill_md)

    ctx.register_hook("pre_llm_call", _pre_llm_call)
    ctx.register_hook("pre_gateway_dispatch", rewrite_gateway_command)

    ctx.register_command(
        "ponytail",
        _handle_mode_command,
        description="Set Ponytail lazy senior dev mode: lite, full, ultra, or off.",
        args_hint="[lite|full|ultra|off]",
    )
    for command, description in SKILL_COMMANDS.items():
        ctx.register_command(
            command,
            _make_skill_command_handler(ctx, command),
            description=description,
            args_hint="[target or notes]",
        )
