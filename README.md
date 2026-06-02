# skills

[![skills.sh](https://skills.sh/b/jzfgo/agents)](https://skills.sh/jzfgo/agents)

Personal AI agent skills by [Javier Zapata](https://github.com/jzfgo), conforming to the [AgentSkills open standard](https://agentskills.io). Works with any compatible agent harness.

## Skills

| Skill | Description |
|-------|-------------|
| [1on1](./skills/1on1/SKILL.md) | Structured 1:1 professional check-ins — reviews how you and your AI agent have been working together |

## Installation

Skills are auto-discovered by any [AgentSkills-compatible](https://agentskills.io) harness. For harnesses that require explicit installation:

| Harness | Install |
|---------|---------|
| **Claude Code** | `claude mcp add javito-skills@git+https://github.com/jzfgo/agents.git` |
| **OpenCode** | Add `"plugin": ["javito-skills@git+https://github.com/jzfgo/agents.git"]` to `opencode.json` |
| **Gemini CLI** | Add `@./skills/<name>/SKILL.md` entries to `GEMINI.md` |
| **Pi** | Auto-discovered via `.agents/skills/` symlinks |
| **Codex** | Auto-discovered via `.codex-plugin/plugin.json` |
| **Cursor** | Auto-discovered via `.cursor-plugin/plugin.json` |

## License

MIT
