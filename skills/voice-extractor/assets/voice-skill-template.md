# Template — the emitted voice skill

Skeleton for the `SKILL.md` you produce. Fill every `{{...}}`; delete sections
the corpus gave you no evidence for rather than padding them with plausible
guesses, and say in `VOICE_PROFILE.md` which ones you dropped and why.

Section order below is by descending impact on the output, not by tidiness. An
applying agent reads top-down and its attention decays, so the ban lists come
before the pattern descriptions.

---

```markdown
---
name: write-like-me
description: >-
  Write, rewrite or review a text in {{author}}'s voice — {{one-line voice
  summary}}. Use for anything they will publish or send under their own name —
  {{formats}} — including when they haven't asked for it by name, and when they
  say {{their own phrasings}}. Supports rewrite, edit, review and extract modes.
  Not for {{exclusions}}.
---

# Write like me

Read `VOICE_PROFILE.md` before drafting. Before asserting anything factual about
the author, check `GROUNDING.md`.

## Choose a mode

An explicit mode word wins:

```txt
rewrite | {{their word}}      Rewrite an existing text in their voice.
edit | {{their word}}         Touch the minimum; keep structure and order.
review | {{their word}}       Say what does not sound like them. Do NOT edit.
extract | recalibrate         Re-extract or recalibrate → hand off to `voice-extractor`.
(no mode)                     Write from scratch in their voice.
```

Without an explicit mode, infer it. Ask only when review and rewrite are equally
plausible — handing back a rewrite to someone who asked for a critique takes the
decision away from them, and it is the most expensive of the four mistakes.

Load only what the mode needs, and say so explicitly. An applying agent that
loads everything for a two-line edit wastes the budget it needs for the edit.

## Before you write

Find the closest same-format sample in `VOICE_PROFILE.md` and mirror its
structure, paragraphing and rhythm. Mirroring a real piece gets you closer than
any rule below — the rules are guardrails for what mirroring misses, not a
template to fill in.

## Never write

### Words
{{banned words, by grammatical category — each one verified absent from the
corpus, or present only in material the author disowned}}

### Phrases and patterns
{{scenic openings; importance-flagging filler; rule-of-three triads;
"not just X, but Y"; summary-plus-uplift closings}}

### Exceptions
{{words on the general LLM-ism lists that this author demonstrably uses in clean
writing — with the quote proving it. These are theirs. Do not strip them.}}

### Stacking, not banning
{{patterns that are both signature and tell. Give the count: one use is voice,
{{n}} in a piece is a tell.}}

## Don't perform the voice

Patterns here describe tendencies, not obligations. Specifically:

- A phrase used once in the corpus is not a catchphrase. Don't build a running
  bit out of it.
- An occasional habit is not a signature. {{author}} does {{x}} sometimes; doing
  it in every paragraph is a caricature.
- Don't manufacture roughness. If the register is casual, write casually — but
  inserting deliberate errors or forced asides to seem human reads worse than
  clean prose.
- Fix only in the direction of drift: models come out too tidy and too neutral,
  so correct toward {{author}} and stop there.

## Core patterns

{{3-6 patterns, each: the rule, then a wrong/right pair drawn from real corpus
text. The contrast carries the voice; the prose around it is scaffolding.}}

**{{Pattern name}}**
{{one-line rule, with a count attached if one applies}}
- Wrong: {{generic version}}
- Right: {{quoted or closely-modelled real line}}

## Format modes

Default: **{{mode}}** — assume it unless the task says otherwise.

{{per format: length, structure, register, and what changes from the default}}

### Openings
{{how {{author}} actually starts, with real examples. This is the highest-tell
region of any text — be specific and concrete here.}}

### Closings
{{how they actually end. Generated text defaults to restating the argument and
turning outward on an uplift; say what {{author}} does instead.}}

## Adapting

{{when to bend the voice — audience, formality, medium — and what stays fixed
regardless. Something must stay fixed, or there is no voice.}}

## Before delivering

Run these in order, silently. The reader sees a finished draft, never a
checklist or a score.

1. **Ban list, line by line.** Check each entry against the draft individually,
   not as one skim. Anything the profile marks as never-used must be at zero;
   "used sparingly" is a failure, not a pass.
2. **LLM-ism sweep.** Openings and closings first, then the body.
3. **Performance sweep.** Separate pass, because it's a different failure mode:
   have you overplayed a habit, invented a catchphrase, or performed the voice
   rather than written in it?
4. **Grounding check.** Every proper noun, date, figure and claim traces to the
   request, to `GROUNDING.md`, or to a placeholder. Voice-matching never
   licenses inventing content.
5. **Mirror check.** Put the draft beside the sample from step one. Does it
   sound like the same person?

If any check fails, fix it and **re-run from step 1** — a spot fix often breaks
something earlier in the list.

Two guards while you do this: don't add a feature merely so a check has
something to measure (if the piece has no request in it, the ask-placement rule
simply doesn't apply), and don't let a passing feel substitute for a passing
check. Feel is what this list exists to override.
```

---

## Notes for the extractor

**On the name** — it is always `write-like-me`, never `write-like-<author>`. The
skill is installed for its own author, so the possessive is redundant, the command
is the same in everyone's muscle memory, and the author's name stays out of a
directory listing. Put the name in the `description:` and in `VOICE_PROFILE.md`,
where it belongs.

**On modes** — emit the four. `review` is the one authors reach for most and the
one an agent is most likely to get wrong by "helpfully" rewriting instead. Make
the prohibition explicit in the mode's own description, not only in a general
rule, and use the author's own words as mode aliases where they gave you any.

**On `description:`** — make it eager, **and this does not conflict with having
modes**. A voice skill with a command interface still has to fire on its default
when nobody typed a command; that is the whole point. Prior art for the shape:
`clarity` carries four modes and an eager description together. If the author's
other skills disable model invocation, say why this one should not — a false
trigger here costs a paragraph in their voice, while a missed one costs a
paragraph in nobody's. The extractor that produced it is
invoked deliberately; this skill is worthless if it sits idle while the author
writes in a generic voice. Name the formats and the near-miss cases explicitly.

**On sections you drop** — a template section with `{{...}}` left in it, or
filled with confident-sounding filler, is worse than an absent one. Absence is
honest and the author can see the gap. Filler is invisible and gets applied.

**On length** — the applicator should stay comfortably promptable. Push evidence,
corpus notes and the reasoning behind each rule into `VOICE_PROFILE.md`; keep
`SKILL.md` to the rules themselves and the samples they hang on.
