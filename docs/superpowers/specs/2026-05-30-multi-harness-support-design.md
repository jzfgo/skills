# Multi-Harness Support — Design

**Date:** 2026-05-30
**Author:** Javier Zapata

## Overview

Add scaffolding so skills in this repo are discoverable and usable in Gemini CLI, OpenAI Codex, Cursor, OpenCode, and Pi Coding Agent — alongside existing Claude Code support. Skills already conform to the [AgentSkills open standard](https://agentskills.io), so no skill content changes are needed. This is purely structural scaffolding.

## Reference

[obra/superpowers](https://github.com/obra/superpowers) is the canonical reference for harness scaffolding conventions. This design mirrors its approach, adapted for a skills-only repo (no framework bootstrap injection needed).

## Architecture

Each harness gets a root-level manifest directory or file using its native format. Skills are discovered by pointing the harness at `"./"` — the repo root — where it finds `SKILL.md` files in immediate subdirectories. No per-skill changes are needed beyond what already exists for Claude Code.

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `.codex-plugin/plugin.json` | Codex manifest; `"skills": "./"` points to repo root |
| Create | `.cursor-plugin/plugin.json` | Cursor manifest; same skill discovery path |
| Create | `gemini-extension.json` | Gemini CLI extension manifest; references `GEMINI.md` |
| Create | `GEMINI.md` | Gemini context file; one `@` include per skill |
| Create (rename) | `AGENTS.md` | Canonical project instructions; de-claudified from `CLAUDE.md` |
| Convert to symlink | `CLAUDE.md` | Git symlink → `AGENTS.md` |
| Create | `.opencode/INSTALL.md` | OpenCode install instructions |
| Create | `.opencode/plugins/javito-skills.js` | Minimal OpenCode plugin; registers skills dir |
| Create | `.agents/skills/1on1` | Relative symlink → `../../1on1`; Pi/AgentSkills discovery |

## File Contents

### `.codex-plugin/plugin.json`

Same structure as `.claude-plugin/plugin.json`. `"skills": "./"` tells Codex to discover `SKILL.md` files in immediate subdirectories of the repo root.

```json
{
  "name": "javito-skills",
  "version": "1.0.0",
  "description": "Personal AI agent skills by Javier Zapata",
  "author": {
    "name": "Javier Zapata",
    "email": "javierzapata82@gmail.com",
    "url": "https://github.com/jzfgo"
  },
  "homepage": "https://github.com/jzfgo/agents",
  "repository": "https://github.com/jzfgo/agents",
  "license": "MIT",
  "keywords": ["productivity", "workflow", "skills"],
  "skills": "./"
}
```

### `.cursor-plugin/plugin.json`

Cursor format includes `displayName` and omits fields Cursor doesn't use. `"skills": "./"` is the same discovery path.

```json
{
  "name": "javito-skills",
  "displayName": "Javito Skills",
  "description": "Personal AI agent skills by Javier Zapata",
  "version": "1.0.0",
  "author": {
    "name": "Javier Zapata",
    "email": "javierzapata82@gmail.com"
  },
  "homepage": "https://github.com/jzfgo/agents",
  "repository": "https://github.com/jzfgo/agents",
  "license": "MIT",
  "keywords": ["productivity", "workflow", "skills"],
  "skills": "./"
}
```

### `gemini-extension.json`

Four-field manifest. `contextFileName` tells Gemini CLI which file to inject into context at session start.

```json
{
  "name": "javito-skills",
  "description": "Personal AI agent skills by Javier Zapata",
  "version": "1.0.0",
  "contextFileName": "GEMINI.md"
}
```

### `GEMINI.md`

One `@` include per skill. Gemini CLI loads these files into context. Updated whenever a new skill is added.

```
@./1on1/SKILL.md
```

### `AGENTS.md` (canonical project instructions)

Replaces `CLAUDE.md` as the canonical file. Content is the same as the current `CLAUDE.md` with these changes:

- Title: `# AGENTS.md`
- Remove: "installed into Claude Code via the `superpowers` plugin"
- Replace with: "conforming to the [AgentSkills open standard](https://agentskills.io)"
- "Skills are invoked via the `Skill` tool…" → "Skills are invoked via the agent's native skill mechanism…"
- "`description:` field…what Claude Code reads" → "…what the agent reads"
- "written for Claude Code to follow" → "written for the agent to follow"
- "Plugin manifests" section updated to document all harnesses, not just `.claude-plugin/`

### `CLAUDE.md` (git symlink)

Converted from a regular file to a git symlink pointing to `AGENTS.md`. Claude Code follows symlinks, so behavior is unchanged. Codex reads `AGENTS.md` directly.

### `.opencode/INSTALL.md`

Install instructions: add `"plugin": ["javito-skills@git+https://github.com/jzfgo/agents.git"]` to `opencode.json`.

### `.opencode/plugins/javito-skills.js`

Minimal ES module plugin. Unlike superpowers, no bootstrap injection is needed — just registers the repo root as a skills directory so OpenCode's native `skill` tool can discover `SKILL.md` files.

### `.agents/skills/1on1`

Relative symlink: `../../1on1`. Pi Coding Agent (and any AgentSkills-standard harness using `.agents/skills/` for project-level discovery) resolves this to the skill directory. A new symlink is added here for each new skill.

## Maintenance: Adding a New Skill

When adding a new skill `<name>`:

1. Create `<name>/SKILL.md`, `<name>/evals/`, `<name>/.claude-plugin/plugin.json` (existing steps).
2. Add `@./<name>/SKILL.md` to `GEMINI.md`.
3. Add `ln -s ../../<name> .agents/skills/<name>`.
4. Add entry to `.claude-plugin/marketplace.json` (existing step).

## Non-Goals

- No MCP server — instruction-only approach.
- No per-skill harness manifests for Codex/Cursor/Gemini/OpenCode/Pi — root-level discovery covers all skills.
- No skill content changes — SKILL.md files are already harness-agnostic.
