# Multi-Harness Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add root-level scaffolding so skills are discoverable by Gemini CLI, Codex, Cursor, OpenCode, and Pi alongside existing Claude Code support.

**Architecture:** Each harness gets its native manifest format at the repo root. Skills are already AgentSkills-standard SKILL.md directories, so no skill content changes are needed. CLAUDE.md becomes a git symlink to AGENTS.md (the new canonical project instructions file).

**Tech Stack:** JSON (manifests), Markdown, ES modules (OpenCode plugin), git symlinks.

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `AGENTS.md` | Canonical project instructions (de-claudified from CLAUDE.md) |
| Convert to symlink | `CLAUDE.md` | Git symlink → `AGENTS.md` |
| Create | `.codex-plugin/plugin.json` | Codex manifest; points `"skills": "./"` at repo root |
| Create | `.cursor-plugin/plugin.json` | Cursor manifest; same skill discovery path |
| Create | `gemini-extension.json` | Gemini CLI extension manifest; references `GEMINI.md` |
| Create | `GEMINI.md` | Gemini context file; one `@` include per skill |
| Create | `.opencode/INSTALL.md` | OpenCode install instructions |
| Create | `.opencode/plugins/javito-skills.js` | OpenCode ES module plugin; registers skills dir via config hook |
| Create | `.agents/skills/1on1` | Relative symlink → `../../1on1`; Pi + AgentSkills project discovery |

---

### Task 1: Create AGENTS.md and convert CLAUDE.md to a git symlink

**Files:**
- Create: `AGENTS.md`
- Modify: `CLAUDE.md` (convert to git symlink)

- [ ] **Step 1: Write AGENTS.md**

Write `/Users/javi/Projects/personal/skills/AGENTS.md` with this exact content:

```markdown
# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

## What This Repo Is

A collection of personal AI agent skills conforming to the [AgentSkills open standard](https://agentskills.io). Each skill is a self-contained directory discoverable by any compatible AI agent. Skills are invoked via the agent's native skill mechanism when their `description:` frontmatter matches the user's intent.

## Skill Structure

Every skill lives in its own top-level directory named after the skill:

```
<skill-name>/
  SKILL.md          # frontmatter (name, description) + full skill instructions
  evals/
    evals.json       # functional test cases: what the skill should do when triggered
    trigger_eval.json # trigger test cases: when the skill should/should not fire
```

### SKILL.md frontmatter

```yaml
---
name: <skill-name>          # must match the directory name
description: <trigger text> # what the agent reads to decide whether to invoke
---
```

The `description:` field is critical — it drives automatic invocation. It should include trigger phrases, use-case scope, and explicit exclusions for common false-positive queries.

### evals/evals.json schema

```json
{
  "skill_name": "<name>",
  "evals": [
    {
      "id": 1,
      "prompt": "<user input>",
      "expected_output": "<what the skill should produce>",
      "files": [],
      "assertions": []
    }
  ]
}
```

### evals/trigger_eval.json schema

An array of `{ "query": "...", "should_trigger": true|false }` objects. Include both positive examples (clear matches) and negative examples (common false positives that must NOT fire the skill).

## Adding a New Skill

1. Create `<skill-name>/SKILL.md` with frontmatter and instructions.
2. Create `<skill-name>/evals/evals.json` with at least 2–3 functional test cases.
3. Create `<skill-name>/evals/trigger_eval.json` with a mix of positive and negative trigger examples — negative examples are especially important to prevent the skill from firing on superficially similar queries.
4. Create `<skill-name>/.claude-plugin/plugin.json` with skill metadata.
5. Add `@./<skill-name>/SKILL.md` to `GEMINI.md`.
6. Run `ln -s ../../<skill-name> .agents/skills/<skill-name>` and commit the symlink.
7. Add an entry to `.claude-plugin/marketplace.json` under `plugins[]`.

## Key Conventions

- Skill instructions inside `SKILL.md` are written for the agent to follow, not for humans to read as documentation. Write them as imperative directives.
- The `description:` should explicitly call out what the skill does NOT cover (e.g., "Use this skill for... Not for code reviews or debugging") — this is what populates the negative trigger cases.
- Report files and persistent artifacts produced by skills go into agent-specific subdirectories (e.g., `.claude/reviews/` for Claude Code) to keep them out of the way.

## Plugin manifests

### Claude Code

Each skill directory must contain `.claude-plugin/plugin.json` with `name`, `description`, `author`, `homepage`, `license`, and `keywords`.

The repo root `.claude-plugin/marketplace.json` lists every skill under `plugins[]`. When adding a new skill, add an entry:

```json
{
  "name": "<skill-name>",
  "description": "<one-line description>",
  "source": "./<skill-name>",
  "category": "<productivity|development|...>"
}
```

The `name` in `plugin.json` and in the `marketplace.json` entry must match the skill directory name.

### Codex

`.codex-plugin/plugin.json` at the repo root points `"skills": "./"`. Codex discovers skills automatically from subdirectories — no per-skill manifest needed.

### Cursor

`.cursor-plugin/plugin.json` at the repo root points `"skills": "./"`. Same auto-discovery as Codex.

### Gemini CLI

`gemini-extension.json` at the repo root references `GEMINI.md`. Add `@./<skill-name>/SKILL.md` to `GEMINI.md` when adding a new skill.

### OpenCode

See `.opencode/INSTALL.md` for setup instructions. Add `"plugin": ["javito-skills@git+https://github.com/jzfgo/skills.git"]` to your `opencode.json`.

### Pi / AgentSkills standard

`.agents/skills/` contains relative symlinks to each skill directory. Run `ln -s ../../<skill-name> .agents/skills/<skill-name>` and commit the symlink when adding a new skill.
```

- [ ] **Step 2: Remove CLAUDE.md from git tracking**

```bash
git -C /Users/javi/Projects/personal/skills rm CLAUDE.md
```

Expected output: `rm 'CLAUDE.md'`

- [ ] **Step 3: Create CLAUDE.md as a symlink**

```bash
ln -s AGENTS.md /Users/javi/Projects/personal/skills/CLAUDE.md
```

- [ ] **Step 4: Verify symlink is correct**

```bash
ls -la /Users/javi/Projects/personal/skills/CLAUDE.md
```

Expected output: `CLAUDE.md -> AGENTS.md`

- [ ] **Step 5: Stage both files**

```bash
git -C /Users/javi/Projects/personal/skills add AGENTS.md CLAUDE.md
```

- [ ] **Step 6: Verify git tracks CLAUDE.md as a symlink (mode 120000)**

```bash
git -C /Users/javi/Projects/personal/skills ls-files -s CLAUDE.md
```

Expected output: `120000 <sha> 0	CLAUDE.md`

- [ ] **Step 7: Commit**

```bash
git -C /Users/javi/Projects/personal/skills commit -m "feat: de-claudify project instructions; AGENTS.md is canonical, CLAUDE.md is symlink"
```

---

### Task 2: Add Codex scaffolding

**Files:**
- Create: `.codex-plugin/plugin.json`

- [ ] **Step 1: Create the directory**

```bash
mkdir -p /Users/javi/Projects/personal/skills/.codex-plugin
```

- [ ] **Step 2: Write plugin.json**

Write `/Users/javi/Projects/personal/skills/.codex-plugin/plugin.json` with this exact content:

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
  "homepage": "https://github.com/jzfgo/skills",
  "repository": "https://github.com/jzfgo/skills",
  "license": "MIT",
  "keywords": ["productivity", "workflow", "skills"],
  "skills": "./"
}
```

- [ ] **Step 3: Validate JSON**

```bash
python3 -m json.tool /Users/javi/Projects/personal/skills/.codex-plugin/plugin.json
```

Expected: JSON printed with no errors.

- [ ] **Step 4: Commit**

```bash
git -C /Users/javi/Projects/personal/skills add .codex-plugin/plugin.json
git -C /Users/javi/Projects/personal/skills commit -m "feat: add Codex plugin manifest"
```

---

### Task 3: Add Cursor scaffolding

**Files:**
- Create: `.cursor-plugin/plugin.json`

- [ ] **Step 1: Create the directory**

```bash
mkdir -p /Users/javi/Projects/personal/skills/.cursor-plugin
```

- [ ] **Step 2: Write plugin.json**

Write `/Users/javi/Projects/personal/skills/.cursor-plugin/plugin.json` with this exact content:

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
  "homepage": "https://github.com/jzfgo/skills",
  "repository": "https://github.com/jzfgo/skills",
  "license": "MIT",
  "keywords": ["productivity", "workflow", "skills"],
  "skills": "./"
}
```

- [ ] **Step 3: Validate JSON**

```bash
python3 -m json.tool /Users/javi/Projects/personal/skills/.cursor-plugin/plugin.json
```

Expected: JSON printed with no errors.

- [ ] **Step 4: Commit**

```bash
git -C /Users/javi/Projects/personal/skills add .cursor-plugin/plugin.json
git -C /Users/javi/Projects/personal/skills commit -m "feat: add Cursor plugin manifest"
```

---

### Task 4: Add Gemini CLI scaffolding

**Files:**
- Create: `gemini-extension.json`
- Create: `GEMINI.md`

- [ ] **Step 1: Write gemini-extension.json**

Write `/Users/javi/Projects/personal/skills/gemini-extension.json` with this exact content:

```json
{
  "name": "javito-skills",
  "description": "Personal AI agent skills by Javier Zapata",
  "version": "1.0.0",
  "contextFileName": "GEMINI.md"
}
```

- [ ] **Step 2: Validate JSON**

```bash
python3 -m json.tool /Users/javi/Projects/personal/skills/gemini-extension.json
```

Expected: JSON printed with no errors.

- [ ] **Step 3: Write GEMINI.md**

Write `/Users/javi/Projects/personal/skills/GEMINI.md` with this exact content:

```
@./1on1/SKILL.md
```

- [ ] **Step 4: Commit**

```bash
git -C /Users/javi/Projects/personal/skills add gemini-extension.json GEMINI.md
git -C /Users/javi/Projects/personal/skills commit -m "feat: add Gemini CLI scaffolding"
```

---

### Task 5: Add OpenCode scaffolding

**Files:**
- Create: `.opencode/INSTALL.md`
- Create: `.opencode/plugins/javito-skills.js`

- [ ] **Step 1: Create directories**

```bash
mkdir -p /Users/javi/Projects/personal/skills/.opencode/plugins
```

- [ ] **Step 2: Write INSTALL.md**

Write `/Users/javi/Projects/personal/skills/.opencode/INSTALL.md` with this exact content:

```markdown
# Installing Javito Skills for OpenCode

## Prerequisites

- [OpenCode](https://opencode.ai) installed

## Installation

Add `javito-skills` to the `plugin` array in your `opencode.json` (global or project-level):

```json
{
  "plugin": ["javito-skills@git+https://github.com/jzfgo/skills.git"]
}
```

Restart OpenCode. The plugin registers the skills directory so OpenCode's native `skill` tool can discover all skills.

Verify by asking OpenCode to list available skills:

```
use skill tool to list skills
```

## Usage

Use OpenCode's native `skill` tool to load any skill by name:

```
use skill tool to load 1on1
```

## Updating

OpenCode installs Javito Skills through a git-backed package spec. To pick up new skills after a repo update, clear OpenCode's package cache or reinstall the plugin.

To pin a specific version:

```json
{
  "plugin": ["javito-skills@git+https://github.com/jzfgo/skills.git#<commit-sha>"]
}
```
```

- [ ] **Step 3: Write javito-skills.js**

Write `/Users/javi/Projects/personal/skills/.opencode/plugins/javito-skills.js` with this exact content:

```javascript
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Plugin lives at .opencode/plugins/javito-skills.js
// Repo root is two directories up
const skillsDir = path.resolve(__dirname, '../..');

export const JavavitoSkillsPlugin = async ({ client, directory }) => {
  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(skillsDir)) {
        config.skills.paths.push(skillsDir);
      }
    }
  };
};

export default JavavitoSkillsPlugin;
```

- [ ] **Step 4: Commit**

```bash
git -C /Users/javi/Projects/personal/skills add .opencode/INSTALL.md .opencode/plugins/javito-skills.js
git -C /Users/javi/Projects/personal/skills commit -m "feat: add OpenCode plugin and install instructions"
```

---

### Task 6: Add Pi / AgentSkills project-level discovery

**Files:**
- Create: `.agents/skills/1on1` (relative symlink → `../../1on1`)

- [ ] **Step 1: Create the directory**

```bash
mkdir -p /Users/javi/Projects/personal/skills/.agents/skills
```

- [ ] **Step 2: Create the symlink**

```bash
ln -s ../../1on1 /Users/javi/Projects/personal/skills/.agents/skills/1on1
```

- [ ] **Step 3: Verify the symlink resolves correctly**

```bash
ls -la /Users/javi/Projects/personal/skills/.agents/skills/
```

Expected: `1on1 -> ../../1on1`

```bash
ls /Users/javi/Projects/personal/skills/.agents/skills/1on1/SKILL.md
```

Expected: path printed with no error.

- [ ] **Step 4: Commit**

```bash
git -C /Users/javi/Projects/personal/skills add .agents/skills/1on1
git -C /Users/javi/Projects/personal/skills commit -m "feat: add Pi/AgentSkills project-level skill discovery"
```

---

### Task 7: Final verification

- [ ] **Step 1: Confirm all harness files are present**

```bash
ls /Users/javi/Projects/personal/skills/.codex-plugin/plugin.json \
   /Users/javi/Projects/personal/skills/.cursor-plugin/plugin.json \
   /Users/javi/Projects/personal/skills/gemini-extension.json \
   /Users/javi/Projects/personal/skills/GEMINI.md \
   /Users/javi/Projects/personal/skills/AGENTS.md \
   /Users/javi/Projects/personal/skills/.opencode/INSTALL.md \
   /Users/javi/Projects/personal/skills/.opencode/plugins/javito-skills.js \
   /Users/javi/Projects/personal/skills/.agents/skills/1on1
```

Expected: all paths printed with no errors.

- [ ] **Step 2: Confirm CLAUDE.md is a git symlink**

```bash
git -C /Users/javi/Projects/personal/skills ls-files -s CLAUDE.md
```

Expected: mode `120000` in the output.

- [ ] **Step 3: Confirm CLAUDE.md and AGENTS.md have the same content**

```bash
diff /Users/javi/Projects/personal/skills/CLAUDE.md /Users/javi/Projects/personal/skills/AGENTS.md
```

Expected: no output (files are identical via symlink).

- [ ] **Step 4: Confirm git log shows all 6 commits**

```bash
git -C /Users/javi/Projects/personal/skills log --oneline -8
```

Expected: the 6 new commits from this plan appear above the prior history.
