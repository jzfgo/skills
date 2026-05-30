# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A collection of personal Claude Code skills. Each skill is a self-contained directory that gets installed into Claude Code via the `superpowers` plugin. Skills are invoked via the `Skill` tool when their `description:` frontmatter matches the user's intent.

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
description: <trigger text> # what Claude Code reads to decide whether to invoke
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

## Key Conventions

- Skill instructions inside `SKILL.md` are written for Claude Code to follow, not for humans to read as documentation. Write them as imperative directives.
- The `description:` should explicitly call out what the skill does NOT cover (e.g., "Use this skill for... Not for code reviews or debugging") — this is what populates the negative trigger cases.
- Report files and persistent artifacts produced by skills go into `.claude/` subdirectories (e.g., `.claude/reviews/`) to keep them out of the way.

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
