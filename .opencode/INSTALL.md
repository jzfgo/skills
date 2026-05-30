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
