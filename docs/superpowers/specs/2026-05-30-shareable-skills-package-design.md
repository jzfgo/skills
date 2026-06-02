# Shareable Skills Package — Design

**Date:** 2026-05-30  
**Author:** Javier Zapata

## Overview

Configure the `skills` repo as a self-hosted Claude Code marketplace so each skill can be installed independently. The repo will eventually be submitted to `claude-plugins-official`, but starts as a private/personal marketplace for testing.

## Architecture

One GitHub repo (`github.com/jzfgo/agents`) acts as both the marketplace registry and the plugin host. The root `marketplace.json` lists each skill as a separate plugin pointing to its subdirectory. Each skill subdirectory contains its own `plugin.json` with metadata.

This mirrors how third-party publishers (e.g. Sentry, Chrome DevTools) are structured in the official catalog, so submission later requires only updating `source` from a relative path to a `git-subdir` reference — no restructuring.

## File Changes

### New: `.claude-plugin/marketplace.json` (repo root)

```json
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "javito-skills",
  "description": "Personal Claude Code skills by Javier Zapata",
  "owner": {
    "name": "Javier Zapata",
    "email": "javierzapata82@gmail.com"
  },
  "plugins": [
    {
      "name": "1on1",
      "description": "Run structured 1:1 professional check-ins between Claude Code and the user",
      "source": "./1on1",
      "category": "productivity"
    }
  ]
}
```

### New: `1on1/.claude-plugin/plugin.json`

```json
{
  "name": "1on1",
  "description": "Run structured 1:1 professional check-ins between Claude Code and the user",
  "author": {
    "name": "Javier Zapata",
    "email": "javierzapata82@gmail.com"
  },
  "homepage": "https://github.com/jzfgo/agents/tree/main/1on1",
  "license": "MIT",
  "keywords": ["productivity", "workflow", "review"]
}
```

### New: `LICENSE` (MIT)

Standard MIT license with Javier Zapata as copyright holder.

### New: `.gitignore`

Ignore `.DS_Store` and any OS/editor artifacts.

### Updated: `CLAUDE.md`

Add a "Plugin manifest" section documenting the `.claude-plugin/` convention and the workflow for adding new skills to `marketplace.json`.

## Testing Workflow

Once pushed to `github.com/jzfgo/agents`:

```
/plugin add-marketplace github/jzfgo/agents
/plugin install 1on1@javito-skills
```

## Adding a New Skill

1. Create `<skill-name>/SKILL.md` and `<skill-name>/evals/`.
2. Create `<skill-name>/.claude-plugin/plugin.json` with skill metadata.
3. Add one entry to `.claude-plugin/marketplace.json` under `plugins`.

## Future: Submitting to Official Marketplace

When ready to submit a skill to `claude-plugins-official`, the marketplace.json entry's `source` field changes from:
```json
"source": "./1on1"
```
to:
```json
"source": {
  "source": "git-subdir",
  "url": "https://github.com/jzfgo/agents.git",
  "path": "1on1",
  "ref": "main",
  "sha": "<commit sha at time of submission>"
}
```
No other structural changes are needed.
