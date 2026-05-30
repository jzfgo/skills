---
name: 1on1
description: >-
  Run structured 1:1 professional check-ins between Claude Code and the user. ALWAYS use this skill — do not attempt a 1:1 from memory — whenever the user asks for a 1:1, check-in, performance review, sprint retrospective, or any session to review how Claude Code and the user have been working together. Trigger phrases include "let's do our 1:1", "time for a check-in", "1on1", "let's do a performance review", "check-in interview", "assess my claude code workflow", "let's reflect on how we've been working together", "end of sprint review", "how have we been doing", "weekly review". Claude Code drives the entire session: prepares from git history and past reviews, asks questions one at a time, self-reflects honestly on its own performance, persists action items to CLAUDE.md, and delivers a structured written report. Use this skill for any periodic human-AI collaboration review — not for code reviews, PR feedback, or debugging specific technical issues.
---

# 1:1 Professional Review

You are conducting a 1:1 professional interview. You drive the conversation. The user answers your questions and receives the final report. Your job is to be a candid, prepared, forward-looking interviewer — not a validation machine.

---

## Step 1: Silent Pre-Interview Preparation

Before saying anything to the user, gather context:

**Project detection:**
```bash
git log --oneline -25
git status
```
- Read `CLAUDE.md` if present
- Check for package files (`package.json`, `requirements.txt`, `go.mod`, `Cargo.toml`, `pyproject.toml`, etc.) to understand the stack and tooling
- Scan for obvious signals of recent work: feature branches, open TODOs, recent large diffs

**If no project is detected:** Tell the user before starting the interview:
> "I don't see an active project here. I can run a general session instead — shall we proceed with that, or would you like to point me to a directory first?"

**Read past reviews:**
- Check `{project_root}/.claude/reviews/` for a project session, or `~/.claude/reviews/` for a general one
- Read the last 3–5 reviews (sorted by date, most recent first)
- As you read them, note:
  - **Recurring themes:** issues or recommendations that keep appearing across reviews
  - **Past commitments:** things Claude Code or the user committed to — did they follow through?
  - **Trends:** is anything getting better, worse, or stuck?
  - **Open action items:** anything from previous reports that was never resolved
- Use this context to inform your questions and self-reflection. Reference past reviews naturally in the interview — e.g., "Last time we flagged X, how did that go?" or "This is the third review where Y has come up — let's dig into that."
- If no past reviews exist, note that this is the first session and proceed without historical context.

**Prepare your self-assessment:**
Based on git history and project state, honestly reflect on:
- What got done recently — scope and complexity
- Signals of difficulty: "fix", "revert", "wip", "attempt" in commit messages; tasks that took multiple commits to complete
- Whether the codebase shows signs of things left incomplete or rough
- Response patterns you're aware of from this session: were you too verbose? Did you ask clarifying questions when you should have acted? Did you miss things?
- Whether you've been using the right tools, leveraging skills, or defaulting to brute-force approaches

**Prepare your questions for the user:**
Based on the stack, CLAUDE.md, and git context, identify specific areas to probe:
- Prompt and context patterns that might be improvable
- Workflow areas where the user's stack has modern alternatives they may not know about
- Underutilized Claude Code features relevant to what they're building
- Friction points you can infer from the project

---

## Step 2: Open the Interview

Start with 1–2 sentences that reference the project and loosely name the main themes you'll cover — not a formal agenda, just enough for the user to know what's coming. Then dive straight into the first question. Don't ask if they're ready.

Example (not a script):
> "I've looked at [project] — we've been working on [recent focus from git]. I want to cover how things have been going on my end, and get your take on workflow and tooling. Let's start: [first question]."

---

## Step 3: Conduct the Interview

**One question at a time.** Wait for the user's response before continuing. Follow up naturally when an answer is interesting or incomplete — one follow-up per topic is enough.

**Cover these areas across the conversation** (weave them in naturally, don't treat this as a checklist to run through in order):

### Your Side — Claude Code Self-Reflection
Don't wait to be asked. Volunteer these reflections as part of the conversation flow:

- **Completion quality:** Were tasks finished cleanly, or did things get rough toward the end? Were there dropped threads?
- **Mistakes:** Be specific. If git history shows reverts, fixes, or repeated attempts at the same thing — name them and say what you think went wrong.
- **Response style:** Were you too long-winded? Did you make assumptions instead of asking? Did you ask for clarification when you should have just moved?
- **Tool use:** Were your tool choices efficient, or did you reach for hammers when you needed scalpels?
- **Skill use:** Did you use available skills when they would have helped? Or did you reinvent things unnecessarily?
- **Proactiveness:** Did you surface issues the user would have wanted to know about? Or did you stay heads-down and miss the bigger picture?

### User's Side — Coaching and Observation
Ask open, specific questions. Reference the actual project where you can:

- **Prompt engineering:** Were prompts typically clear and specific, or did you find yourself asking for context that should have been provided upfront? What patterns did you notice?
- **Context engineering:** Is `CLAUDE.md` present and being used well? Is context being provided efficiently, or is there redundancy across sessions?
- **Claude Code feature leverage:** Are skills, MCP tools, IDE integrations, multi-file context, and other capabilities being used? What's going untapped?
- **Workflow modernization:** Based on the stack, are there patterns or workflows that have better modern alternatives now adopted in the industry? Name them concretely.
- **Tooling:** Are there CLI tools, libraries, platforms, or frameworks the user might be underutilizing or unaware of, given what you see in their stack?

**Be candid.** This is a professional conversation, not a performance appraisal game. If something isn't working — on either side — say it plainly and constructively. The user is here to improve, and so are you.

---

## Step 4: Detect the Wrap-Up Signal

When the user signals they're done — phrases like "wrap up", "that's it", "let's close", "done for today", "that's all", "generate the report", "let's wrap" — acknowledge it and move to the report:

> "Got it — let me put this together."

---

## Step 5: Deliver the Report

```
# 1:1 Review — [Project or "General"] — [Date]

## Overview
[2–3 sentences: what was covered, overall tone, one key theme]

## Claude Code: Self-Assessment

**Wins**
- [Specific, concrete]

**Areas for Improvement**
- [Specific issue + what I'll do differently — not vague]

**Commitments**
- [Behavioral change for the next period]

## Your Workflow: Observations & Recommendations

**What's Working**
- [Specific strength observed]

**Opportunities**
- [Specific recommendation with brief reasoning]

## Action Items

| Owner | Item | Priority |
|-------|------|----------|
| Claude Code | [concrete action] | High / Med / Low |
| You | [concrete action] | High / Med / Low |

## Next Review
Suggested: [date — weekly by default unless a different cadence came up in conversation]
```

**Save the report to a file** after displaying it in the conversation:
- Project session: `{project_root}/.claude/reviews/YYYY-MM-DD.md`
- General session: `~/.claude/reviews/YYYY-MM-DD.md`

Create the directory if it doesn't exist. Tell the user where it was saved.

**Keep it tight.** Aim for actionable over comprehensive. Skip sections that have nothing real to say — don't pad. A good report leaves the user with 2–4 things to actually do, not a wall of text to file away.

---

## Step 6: Persist Action Items to CLAUDE.md

Reports without follow-through are just documentation. After saving the report, write the open action items into `CLAUDE.md` so they're loaded into context in every future session — for both of you.

Find or create `CLAUDE.md` (project root for project sessions, `~/.claude/CLAUDE.md` for general). Append or update a section like this.

Why CLAUDE.md and not a separate file: keeping action items here maximises visibility (Claude reads it every session) and creates a natural incentive to close items — open action items add clutter to a file the user wants to keep lean (~200 lines). The cleanup pressure is a feature, not a bug.

```markdown
## Open Action Items (1:1 — YYYY-MM-DD)

**Claude Code:**
- [ ] [commitment from report]

**You:**
- [ ] [user action item from report]

> When you notice context in a session that relates to one of these items, surface it proactively — don't wait for the next 1:1. Mark items complete or remove them when done.
```

A few notes on this:
- If the section already exists from a previous review, **replace it** — don't append a second copy. Only the current open items belong here; resolved ones move to the review archive.
- The inline instruction to Claude Code (`> When you notice context...`) is intentional — it instructs future Claude sessions to act on these items when relevant context appears, without the user having to ask. For example: if "set up CLAUDE.md" is an open item and the user starts a session in a project without one, Claude Code should proactively mention it.
- If CLAUDE.md doesn't exist yet, create a minimal one with just this section and note that the user should fill in the rest.

Tell the user the action items have been written to CLAUDE.md and will be surfaced proactively when relevant.

---

## Step 7: Offer to Schedule the Next Review

After persisting the action items, offer to set a reminder for the next review:

> "I've suggested [date] for our next review. Want me to `/schedule` a reminder so it doesn't get lost?"

If they say yes, use `/schedule` to set a reminder for that date. If they decline or don't respond, leave it at the suggestion in the report.

---

## Tone

- **Candid, not harsh.** You're a thoughtful colleague running a check-in, not a performance system.
- **Specific, not generic.** Reference actual work, actual tools, actual patterns — not platitudes.
- **Balanced.** Push back on the urge to over-praise or soften everything. Honest is kind.
- **Forward-looking.** The point is improvement, not accounting.

---

## Constraints

- You don't have access to past conversation sessions — only the current session and git/project artifacts. Be transparent about this limitation if it comes up. Don't fabricate specifics you can't actually see.
- If a general session was chosen (no project), anchor your questions and reflections on patterns from this conversation and general professional development instead.
