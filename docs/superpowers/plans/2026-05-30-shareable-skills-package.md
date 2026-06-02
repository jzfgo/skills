# Shareable Skills Package Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure the `skills` repo as a self-hosted Claude Code marketplace where each skill is independently installable via `/plugin install <skill>@javito-skills`.

**Architecture:** The repo root holds a `.claude-plugin/marketplace.json` that lists each skill as a separate plugin pointing to its subdirectory. Each skill subdirectory holds its own `.claude-plugin/plugin.json` with metadata. The repo is pushed to `github.com/jzfgo/agents` and registered as a marketplace via `/plugin add-marketplace`.

**Tech Stack:** JSON (plugin manifests), Git, GitHub, Claude Code plugin system.

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `.claude-plugin/marketplace.json` | Marketplace registry listing all skills as plugins |
| Create | `1on1/.claude-plugin/plugin.json` | Per-skill metadata for the 1on1 skill |
| Create | `LICENSE` | MIT license |
| Create | `.gitignore` | Ignore OS/editor artifacts |
| Modify | `CLAUDE.md` | Add plugin manifest conventions section |

---

### Task 1: Initialize git repository

**Files:**
- Creates: `.git/`

- [ ] **Step 1: Initialize git**

```bash
cd /Users/javi/Projects/personal/skills && git init
```

Expected output: `Initialized empty Git repository in /Users/javi/Projects/personal/skills/.git/`

- [ ] **Step 2: Verify status**

```bash
git status
```

Expected: untracked files listed, branch `main` or `master`.

- [ ] **Step 3: Set branch to main if needed**

```bash
git branch -m main
```

---

### Task 2: Create .gitignore

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: Create .gitignore**

Write `/Users/javi/Projects/personal/skills/.gitignore` with this exact content:

```
.DS_Store
```

- [ ] **Step 2: Verify file exists**

```bash
cat /Users/javi/Projects/personal/skills/.gitignore
```

Expected output: `.DS_Store`

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: add .gitignore"
```

---

### Task 3: Create LICENSE

**Files:**
- Create: `LICENSE`

- [ ] **Step 1: Create MIT license**

Write `/Users/javi/Projects/personal/skills/LICENSE` with this exact content:

```
MIT License

Copyright (c) 2026 Javier Zapata

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 2: Commit**

```bash
git add LICENSE
git commit -m "chore: add MIT license"
```

---

### Task 4: Create marketplace.json

**Files:**
- Create: `.claude-plugin/marketplace.json`

- [ ] **Step 1: Create directory**

```bash
mkdir -p /Users/javi/Projects/personal/skills/.claude-plugin
```

- [ ] **Step 2: Write marketplace.json**

Write `/Users/javi/Projects/personal/skills/.claude-plugin/marketplace.json` with this exact content:

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

- [ ] **Step 3: Validate JSON**

```bash
python3 -m json.tool /Users/javi/Projects/personal/skills/.claude-plugin/marketplace.json
```

Expected: JSON printed with no errors.

- [ ] **Step 4: Commit**

```bash
git add .claude-plugin/marketplace.json
git commit -m "feat: add marketplace manifest"
```

---

### Task 5: Create 1on1 plugin.json

**Files:**
- Create: `1on1/.claude-plugin/plugin.json`

- [ ] **Step 1: Create directory**

```bash
mkdir -p /Users/javi/Projects/personal/skills/1on1/.claude-plugin
```

- [ ] **Step 2: Write plugin.json**

Write `/Users/javi/Projects/personal/skills/1on1/.claude-plugin/plugin.json` with this exact content:

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

- [ ] **Step 3: Validate JSON**

```bash
python3 -m json.tool /Users/javi/Projects/personal/skills/1on1/.claude-plugin/plugin.json
```

Expected: JSON printed with no errors.

- [ ] **Step 4: Commit**

```bash
git add 1on1/.claude-plugin/plugin.json
git commit -m "feat: add 1on1 plugin manifest"
```

---

### Task 6: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add plugin manifest section to CLAUDE.md**

Append the following to `/Users/javi/Projects/personal/skills/CLAUDE.md`:

```markdown

## Plugin manifests

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
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: document plugin manifest conventions"
```

---

### Task 7: Commit remaining files and push to GitHub

**Files:**
- Modifies: git history

- [ ] **Step 1: Stage and commit any remaining untracked files**

```bash
git add docs/ 1on1/SKILL.md 1on1/evals/
git status
```

Verify nothing important is unstaged (`docs/` and `1on1/SKILL.md`, `1on1/evals/` are the files not yet committed by earlier tasks).

- [ ] **Step 2: Final commit for any remaining files**

```bash
git commit -m "chore: initial commit of skills repo"
```

If nothing to commit, skip this step.

- [ ] **Step 3: Create GitHub repo**

Go to https://github.com/new and create a repo named `skills` under `jzfgo`. You can set it to private while testing.

- [ ] **Step 4: Add remote and push**

```bash
git remote add origin https://github.com/jzfgo/agents.git
git push -u origin main
```

- [ ] **Step 5: Register as marketplace**

In a Claude Code session:

```
/plugin add-marketplace github/jzfgo/agents
```

- [ ] **Step 6: Install and verify the 1on1 skill**

```
/plugin install 1on1@javito-skills
```

Expected: skill installs successfully and appears in `/plugin list`.
