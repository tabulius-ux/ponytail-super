# Agent Portability

Ponytail is an agent-portable skill distribution. The skills in `skills/` hold
the core behavior; host-specific files are adapters that make that behavior easy
to load in a given agent.

## Installation provenance

This fork is distributed from `https://github.com/tabulius-ux/ponytail-super`.
All four marketplace manifests use the name `ponytail-super`; the plugin and
six skill names remain `ponytail` / `ponytail-*` so commands keep working.

| Route | Source of customized instructions |
|---|---|
| Codex | `.agents/plugins/marketplace.json` fetches this fork's `main`; `.codex-plugin/plugin.json` loads `./skills/` and local hooks. |
| Claude Code | `.claude-plugin/marketplace.json` uses `source: "./"`, the root of this fork; hook scripts read its `skills/` relative to their own location. |
| Copilot / Grok marketplaces | Local `source: "./"` uses this fork's files. |
| Other Git installs | README commands select `tabulius-ux/ponytail-super`. |
| OpenCode / Pi / Hermes / MCP / hooks | Instructions come from bundled local `skills/`, with local fallbacks; no upstream download happens at runtime. |
| Rule files / OpenClaw | Copy the files from this checkout. Repeat the copy after updating it. |

Disable or uninstall the upstream plugin before enabling this fork. Existing
installations and marketplace caches are not changed by editing this repository;
add this fork's marketplace and install `ponytail@ponytail-super` explicitly.
Update the `ponytail-super` marketplace, not the upstream `ponytail` marketplace.
Both variants share command names and mode state, so running both can inject
conflicting instructions.

Remote installs see committed and pushed files only. Local changes require a
local checkout installation; subsequent updates or reinstalls can replace edits
made directly in an installed plugin cache. Compare the installed six
`skills/*/SKILL.md` files with the intended checkout to verify the actual content.
The version `4.10.0` is inherited from upstream and cannot identify the fork.

The npm package is named `@tabulius-ux/ponytail-super` and marked private;
no fork registry publication is claimed. Upstream npm and ClawHub packages
are not installation sources for this fork. ClawHub publishing is also blocked
while the package is private to avoid reusing upstream slugs.

Original author/license credits, funding links, historical issue links and
benchmark badges are attribution only. They do not fetch instructions.

## Supported Adapters

| Host | Files | Notes |
|------|-------|-------|
| Claude Code | `.claude-plugin/plugin.json`, `commands/`, `hooks/claude-codex-hooks.json`, `hooks/` | Full plugin install with session activation, mode tracking, commands, and statusline support. |
| Codex | `.codex-plugin/plugin.json`, `hooks/claude-codex-hooks.json`, `hooks/`, `skills/` | Plugin install with the same skills plus lifecycle hooks for activation and mode tracking. |
| Grok Build | root `plugin.json`, `.grok-plugin/marketplace.json`, `skills/`, `commands/` | `grok plugin install tabulius-ux/ponytail-super --trust`, then enable. Grok can auto-invoke ponytail from its coding-task skill description; `/ponytail` makes activation explicit. Grok lifecycle hooks are not used because passive hook output cannot inject instructions. |
| OpenCode | `.opencode/plugins/ponytail.mjs`, `.opencode/command/`, `hooks/`, `skills/` | Server plugin injects the ruleset each turn via `experimental.chat.system.transform` and persists `/ponytail` switches; reuses the shared instruction builder. |
| pi | `pi-extension/`, `skills/`, `hooks/` | Package extension: injects the ruleset each turn through the shared instruction builder and registers the `/ponytail` commands. |
| Hermes Agent | `plugin.yaml`, `__init__.py`, `skills/` | Native Hermes plugin: injects active mode through `pre_llm_call`, rewrites gateway `/ponytail-*` skill commands into agent prompts, registers `/ponytail` mode switching, and exposes bundled skills as `ponytail:<skill>`. |
| Gemini CLI | `gemini-extension.json`, `AGENTS.md`, `commands/`, `skills/` | Extension manifest points `contextFileName` at `AGENTS.md` for always-on rules, and reuses the existing `commands/*.toml` and `skills/`, which Gemini CLI auto-discovers. The Claude/Codex hook map is not placed at Gemini's auto-discovered `hooks/hooks.json` path. |
| Cursor | `hooks/cursor-hooks.json`, `scripts/cursor-hooks.js`, `hooks/`, `.cursor/rules/ponytail.mdc` | Native hooks: `node scripts/cursor-hooks.js install` merges `sessionStart` (default-level ruleset via `additional_context`) and `beforeSubmitPrompt` (`/ponytail` level tracking, new-level ruleset via `additional_context`) into `~/.cursor/hooks.json`, or `.cursor/hooks.json` with `--project`, keeping unrelated hooks. No subagent injection (Cursor's `subagentStart` takes only `permission`/`user_message`) and no `sessionStart` in cloud agents. `.cursor/rules/ponytail.mdc` stays the instruction-only alternative; while that rule is in a workspace the hooks inject only a notice. Contract and verification record: [cursor-hooks.md](cursor-hooks.md). |
| Windsurf | `.windsurf/rules/ponytail.md` | Project rule. |
| Cline | `.clinerules/ponytail.md` | Project rule. |
| GitHub Copilot | `.github/copilot-instructions.md` | Repository instruction file. |
| GitHub Copilot CLI | `.github/plugin/`, `AGENTS.md`, `.github/copilot-instructions.md`, `~/.copilot/copilot-instructions.md` | Plugin-supported (`copilot plugin marketplace add tabulius-ux/ponytail-super` + `copilot plugin install ponytail@ponytail-super`). Fallback instruction mode remains: per-project from `AGENTS.md` or `.github/copilot-instructions.md`, or globally from `~/.copilot/copilot-instructions.md` (instruction-tier, no `/ponytail` levels or hooks). |
| Antigravity | `AGENTS.md` | Reads `AGENTS.md` at the repo root as always-on rules (like `.cursorrules`/`CLAUDE.md`); `.agents/rules/` also works for workspace rules. Instruction-tier. |
| CodeWhale | `AGENTS.md` | Reads `AGENTS.md` from the repo root as project instructions; also reads `CLAUDE.md` and `.claude/instructions.md` as fallbacks. Instruction-tier. |
| Swival | `.swival/skills/`, `AGENTS.md` | `swival skills add https://github.com/tabulius-ux/ponytail-super` installs the six skills straight into `.swival/skills/`. Add `--global` to stage them in the library (`~/.config/swival/library`) first, then `swival skills add ponytail-super` (or `--global ponytail-super`) to activate per-project or everywhere. Also reads `AGENTS.md` from the repo root and `~/.config/swival/AGENTS.md` globally as instruction-tier fallback. |
| VS Code + Codex extension | `AGENTS.md` | The Codex extension reads `AGENTS.md` (repo root, or `~/.codex/AGENTS.md` globally). Instruction-tier; the full Codex plugin row above adds `/ponytail` levels and hooks. |
| JetBrains Junie | `AGENTS.md` | Junie reads `AGENTS.md` once you point it there in Settings → Tools → Junie → Project Settings → Guidelines Path (not automatic yet); this repo ships `AGENTS.md`, and `.junie/guidelines.md` is Junie's legacy path. Instruction-tier. |
| Amp (Sourcegraph) | `AGENTS.md` | Amp reads `AGENTS.md` from the working directory and parent directories up to `$HOME` (plus global config like `~/.config/amp/AGENTS.md`); falls back to `AGENT.md`/`CLAUDE.md`. Instruction-tier. |
| Jules (Google) | `AGENTS.md` | Jules automatically reads `AGENTS.md` from the repository root. Instruction-tier. |
| Kiro | `.kiro/steering/ponytail.md` | Steering rule; copy globally or into a project. |
| Qoder | `.qoder/rules/ponytail.md`, `.qoder-plugin/plugin.json`, `hooks/qoder-hooks.json`, `skills/`, `AGENTS.md` | Qoder auto-loads `AGENTS.md` as always-on context; `.qoder/rules/ponytail.md` provides per-project rules; the plugin manifest points at `skills/` for the six ponytail skills (invoked as `/ponytail`, `/ponytail-review`, etc. via the Skill system). Full plugin-tier: `hooks/qoder-hooks.json` template registers `UserPromptSubmit` (mode activation + ruleset injection) and `PreToolUse` with `task|Task` matcher (subagent injection). Instruction-tier works from repo root with zero setup via `AGENTS.md`. |
| Zed | `AGENTS.md` | Auto-includes `AGENTS.md` from the worktree root as one of its default rule files for the Agent Panel. Instruction-tier. |
| Generic agents | `AGENTS.md` or `skills/*/SKILL.md` | Copy the compact rule file or load the skill files directly. |

## Adapter Rule

Keep adapters thin. When a host supports skills or hooks, point it at the
existing `skills/` and `hooks/` files. When a host only supports project
instructions, keep its copied rule text aligned with `AGENTS.md`.

## Portable Behavior

- `skills/ponytail/SKILL.md`: lazy senior dev mode
- `skills/ponytail-review/SKILL.md`: over-engineering review
- `skills/ponytail-audit/SKILL.md`: whole-repo over-engineering audit
- `skills/ponytail-debt/SKILL.md`: harvest `ponytail:` shortcuts into a tracked ledger
- `skills/ponytail-gain/SKILL.md`: measured-impact scoreboard from the benchmark
- `skills/ponytail-help/SKILL.md`: quick reference
- `AGENTS.md`: compact always-on instruction set for agents without skill support

## Instruction sources and copies

| Source or copy | How changes reach users | Maintenance |
|---|---|---|
| `skills/*/SKILL.md` | Skill-capable hosts load these bodies. | Canonical full instructions. |
| `hooks/ponytail-instructions.js` | Claude/Codex/Copilot/Qoder/Cursor hooks, Pi, OpenCode, and MCP share the mode-filtered core skill; the shared builder loads the review skill for review mode. | Update its embedded fallback too; it is used when the skill cannot be read. |
| `__init__.py` | Hermes reads and filters the core skill; review loads the review skill. | Separate Python fallback, including report-only review fallback. |
| `AGENTS.md` | Hosts that read project instructions. | Canonical compact text; shared safeguards are checked against the core skill. |
| `.cursor/rules/ponytail.mdc`, `.windsurf/rules/ponytail.md`, `.clinerules/ponytail.md`, `.agents/rules/ponytail.md`, `.qoder/rules/ponytail.md`, `.github/copilot-instructions.md`, `.kiro/steering/ponytail.md` | Static host instructions. | Hand-maintained compact copies; `scripts/check-rule-copies.js` compares bodies, preserving host frontmatter. |
| `commands/*.toml`, `.opencode/command/*.md` | Standalone command adapters. | Hand-maintained prompts: compact core or the corresponding skill body. `tests/commands.test.js` checks parity and argument placeholders. |
| `.openclaw/skills/*/SKILL.md` | OpenClaw/ClawHub packages. | Generated by `node scripts/build-openclaw-skills.js`; do not edit the copies directly. |

All active intensities retain the shared safeguards. Mode filtering changes
only the intensity rows and examples. Tests check the delivered text, mode
selection, fallbacks, and copy parity; they do not prove how a model will act.
Historical `benchmarks/` prompts, data, and results remain unchanged. Current
README translations and example notes distinguish those observations from the
revised guidance; no new empirical model-quality claim follows from text tests.

## Guidance consistency review

These are readings of the revised instructions, not empirical predictions of
model behavior or a new benchmark:

| Proposed simplification | Required judgment |
|---|---|
| Replace five distinct behavior tests with one happy-path test | Reject lost cases/assertions; consolidation is allowed only if coverage and failure localization survive. |
| Replace a batch fetch with a shorter per-row query loop | Reject brevity as justification for N+1; inspect call growth and retain needed batching. |
| Remove a one-implementation interface separating a service from business logic | Preserve the useful current boundary; implementation count alone proves nothing. |
| Split a long file with distinct responsibilities | Allow when it clarifies current responsibilities and dependencies, without speculative layers or arbitrary size limits. |
| Add a layer only for an imagined future need | Reject under YAGNI. |
| Compress a clear multiline condition into a hard-to-read expression | Reject the loss of readability; counts are secondary. |
