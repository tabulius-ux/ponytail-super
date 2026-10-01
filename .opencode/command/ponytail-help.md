---
description: Show the Ponytail command reference
---

# Ponytail Help

Display this reference card when invoked. One-shot, do NOT change mode,
write flag files, or persist anything.

## Levels

| Level | Trigger | What change |
|-------|---------|-------------|
| **Lite** | `/ponytail lite` | Build what's asked; suggest suitable simpler alternatives. |
| **Full** | `/ponytail` | YAGNI → existing code → suitable stdlib/native/dependency → clear implementation. Default. |
| **Ultra** | `/ponytail ultra` | Challenge speculative scope more strongly; preserve requested behavior. |

All active levels preserve requirements, readability, tests, and performance.
Level sticks until changed or session end.

## Skills

| Skill | Trigger | What it does |
|-------|---------|--------------|
| **ponytail** | `/ponytail` | Lazy mode itself. Simplest solution that works. |
| **ponytail-review** | `/ponytail-review` | Complexity review: justified simplifications, preservation requirements, and evidence. |
| **ponytail-audit** | `/ponytail-audit` | Repo-wide complexity audit: supported findings and candidates; report only. |
| **ponytail-debt** | `/ponytail-debt` | Harvest `ponytail:` shortcut comments into a tracked ledger. |
| **ponytail-gain** | `/ponytail-gain` | Measured-impact scoreboard: less code, less cost, more speed. |
| **ponytail-help** | `/ponytail-help` | This card. |

Codex uses `@ponytail`, `@ponytail-review`, and `@ponytail-help`; Claude Code
and OpenCode use the slash-command forms above (OpenCode ships all six as
slash commands).

## Deactivate

Say "stop ponytail" or "normal mode". Resume anytime with `/ponytail`.
`/ponytail off` also works.

## Configure Default Mode

Default mode = `full`, auto-active every session. Change it:

**Environment variable** (highest priority):
```bash
export PONYTAIL_DEFAULT_MODE=ultra
```

**Config file** (`~/.config/ponytail/config.json`, Windows: `%APPDATA%\ponytail\config.json`):
```json
{ "defaultMode": "lite" }
```

Set `"off"` to disable auto-activation on session start, activate manually
with `/ponytail` when wanted.

Resolution: env var > config file > `full`.

## Update

This is the customized Ponytail-super fork. Use the `ponytail-super` marketplace
from `tabulius-ux/ponytail-super`; the upstream marketplace and npm/ClawHub
packages do not contain these changes. Disable or uninstall the upstream
Ponytail plugin before enabling this fork to avoid duplicate instructions.

Enable auto-update once: open `/plugin`, go to Marketplaces, pick ponytail-super, Enable auto-update. Claude Code then pulls new versions at startup (run `/reload-plugins` when it prompts). Manual refresh: `/plugin marketplace update ponytail-super` then `/reload-plugins`.

If `/plugin` is not recognized, your Claude Code is out of date. Update it (`npm install -g @anthropic-ai/claude-code@latest`, or `brew upgrade claude-code`) and restart. Other hosts use their own update flow.

## More

Full docs + examples: https://github.com/tabulius-ux/ponytail-super
