---
name: voice-extractor
description: >-
  Build a personalised writing-voice skill from a corpus of someone's own
  writing. This is a compiler, not a writer: it qualifies a corpus, analyses it
  across eight dimensions, interviews the author about what it found,
  calibrates against real samples, and emits an installable voice skill plus a
  re-runnable regression suite that detects drift after a model or corpus
  change. Use it whenever someone wants an agent to write the way they actually
  write — "write like me", "escribe como yo", "capture my tone of voice", "stop
  making me sound like ChatGPT", "build a style guide from my blog posts" — and
  also to update, re-calibrate, or debug a voice skill that already exists.
  Spanish and English are both first-class targets. Not for editing one
  document to read better, and not for imitating a voice that isn't the
  requester's own.
disable-model-invocation: true
---

# Voice Extractor

You are building **a skill for one specific person**. Think compiler: the corpus
and the author's judgement are your inputs, and your output is a second,
installable skill that a future agent will load in a session that remembers
nothing about this conversation.

Two documents get confused constantly. Hold them apart from the first minute:

- **This document** is the extractor. It runs once per author, is heavily
  interactive, and is discarded when the run ends.
- **The voice skill you emit** is the product. It has to stand alone.

Anything you learn here that doesn't survive into the emitted files is lost. That
single fact should govern every judgement call you make below.

## Choose the surface first

The three passes are identical everywhere; only how you get text differs.

**Filesystem available** (Claude Code, or any agent with file tools): ask for a
directory, a glob, or a repo path. Read the files yourself. Prefer this — it lets
you cite exact filenames, which the whole evidence discipline below depends on.

**No filesystem** (Desktop, mobile, chat): run the corpus in through the
conversation. Ask for uploads or pasted text, and number each piece as it
arrives (`[C1]`, `[C2]`, …) so you can cite it later the way you'd otherwise cite
a filename. Batch the intake — ask for several pieces per turn, not one, or the
author will abandon the process before Pass 1.

Say which mode you're in before you start reading. If someone points you at a
folder and you can't actually read it, that's worth catching in the first turn
rather than the fifth.

## Intake: qualify the corpus before you analyse a word

Skip this and everything downstream is confidently wrong, because a voice
extracted from the wrong text is indistinguishable — to you — from one extracted
from the right text.

The failure is not hypothetical or rare. People point voice extractors at a notes
vault or a "writing" folder, and those are usually full of saved articles by
other people, AI-drafted summaries, and translations. All three read as fluent
prose. None of them is the author's voice.

Sort every candidate document into one of four buckets, and say which bucket you
put it in:

| Bucket | What it is | Use it? |
|---|---|---|
| **Native** | Written by the author, in the target language, without AI help | Yes — this is the corpus |
| **Assisted** | AI wrote it, or AI edited it past light proofreading | No |
| **Translated** | The author wrote it, but in a different language first | No — see below |
| **Not theirs** | Clippings, quotes, co-authored text, forwarded material | No |

**On translated text.** It's the bucket people forget, and it's the one that
feels safest to include, because the author really did write it. But translation
carries the source language's rhythm, and a translator's word choices are
constrained by the original in a way that free composition never is. Extract from
a translation and you get the author's ideas wearing someone else's sentences.
Keep translations out of the corpus. They're still useful later as calibration
material, since the author can judge whether a generated passage sounds like
them.

**How to actually tell.** You can't ask "did you write this?" for two hundred
files. Get leverage instead:

- Ask directly about *provenance rules* rather than documents: which folders,
  which date ranges, which platforms. Authors know "everything after March is
  AI-assisted" even when they can't remember individual files.
- Check for structural tells of capture rather than composition: source URLs in
  frontmatter, an author field that isn't them, consistent metadata that a person
  wouldn't hand-write.
- Look for paired files across languages — a shared translation key, matching
  filenames in `es/` and `en/` — which usually means one side is derived.
- Read a little of the prose. Translated text tends to lose language-specific
  habits the author uses freely when composing natively: forms of address,
  idiom, register shifts, discourse particles.
- When you're unsure about a document, ask about that document. Being unsure
  about six is normal; being unsure about sixty means you're asking the wrong
  question.

**Then check whether what's left can support an extraction:**

- **Volume**: 10+ documents, and enough words that patterns can repeat. Under
  that, you are extracting noise.
- **Variety**: two or more content types. One type gives you a *format*, not a
  voice — you'll have no way to separate what's characteristic of the person from
  what's characteristic of blog posts.
- **Recency**: prefer the last two years. Voice moves. If the corpus straddles a
  long gap, don't silently average across it — surface the gap, ask which era is
  the target, and weight accordingly. Someone's writing at 25 and at 43 are two
  different authors, and blending them produces a voice belonging to neither.
- **Length spread**: a mix. All-short gives you no evidence about how they build
  an argument; all-long gives you none about how they're terse.

### The gate has three outcomes, not two

Treating it as pass/fail is the mistake that makes this step feel bureaucratic.
Almost every real corpus lands in the middle.

**Fails.** Say so and stop. This is a real stopping point, not a formality — an
extraction from a thin or contaminated corpus spends the author's review time on
patterns that aren't real, and produces an artifact that looks authoritative
anyway. Report what you found, in which bucket, and what's missing.

**Qualifies, with gaps.** The common case: enough documents, but only one content
type, or a decade-wide hole, or nothing short. Don't wave it through with a
caveat buried in a footnote, and don't refuse either — **prescribe the exercises
that would close the specific gap**, and let the author decide whether to write
them now or accept a weaker profile. A caveat tells someone their result is
limited; an exercise lets them fix it in twenty minutes.

**Qualifies cleanly.** Rare. Proceed.

### Enrichment: prescribe for the gap you actually found

Whether the corpus failed outright or merely came up short on one dimension, the
remedy is the same instrument — ask the author to write fresh material *now*, to
prompts you supply. What changes is which prompts, and that should follow
directly from what's missing rather than being a fixed list:

| What's missing | Ask them to write |
|---|---|
| A second content type | Something in the register the skill will actually serve — an email to a colleague, a message to their team, a reply to a stranger |
| Recent voice, when the corpus is old | Anything at all from this month; two short pieces beat ten old ones for establishing the current register |
| Short-form evidence | Three replies, each under a hundred words |
| Long-form evidence | One piece where they have to sustain an argument past a page |
| Emotional range | A piece of bad news; something that annoyed them; a recommendation to a friend |
| A whole corpus | Six to ten short responses across all of the above |

Fresh writing is small but perfectly clean, and clean beats large. Say that
plainly — authors assume more words is better and will offer you an archive when
what you need is four paragraphs written today.

Tell them not to polish. Writing-for-the-exercise is its own register and it
isn't the one they'll be using the skill for. Naming that reflex is usually
enough to defuse it.

Full prompt set and rationale in `references/corpus-qualification.md`.

## Pass 1 — Baseline analysis

Read the qualified corpus and characterise it across eight dimensions. Details,
including what to look for in each, are in `references/dimensions.md`; read that
file now if you have not.

**A.** Sentence patterns · **B.** Opening patterns · **C.** Vocabulary
fingerprint · **D.** Structural patterns · **E.** Tone markers · **F.**
Formatting habits · **G.** Language-specific patterns · **H.** LLM-ism presence

Openings and closings get their own attention (B, and the closing half of D)
because that's where generated text gives itself away most reliably, and so
that's where the emitted skill needs its sharpest rules.

### Classify every pattern before you write it down

For each pattern, decide what it actually is:

- **VOICE** — a choice the author makes. It would follow them to another platform.
- **PLATFORM** — a convention of the medium. Anyone writing there does it.
- **BORDERLINE** — you genuinely can't tell yet.

This classification is the single highest-leverage step in the pass, because the
confound it addresses is the one that quietly ruins voice skills. "Uses H2
headings and short paragraphs" is not a personality; it's what blogging looks
like. Encode enough of that and you produce a skill that writes competent blog
posts in nobody's voice.

The useful test: would this pattern survive a change of medium? If they moved
from blog to email, would the habit come along? Bullet lists mostly wouldn't.
A fondness for parenthetical asides would.

Mark BORDERLINE items honestly. They are the most valuable input to Pass 2 —
they're precisely the questions where the author knows something you can't see.

**Excluded from the corpus is not the same as useless as evidence.** The medium
test needs two media, and the documents you disqualified are usually the only
other medium you have. A habit that shows up both in the corpus and in something
you excluded — a translated piece, a work document, writing in an institutional
voice — has just survived a change of medium, which is the test. Read the
excluded pile for *this* purpose and no other: it settles BORDERLINE items, and
it never contributes a pattern of its own. Do not let it back in through the side
door — cite it as corroboration for a pattern the corpus already shows, never as
the source of one.

### Evidence discipline

Every claim needs a **filename (or corpus tag) plus a quoted span**. Not "seen in
8 of 12 posts" — a count nobody recomputes is a number you are free to invent,
and you will, without noticing. A quote is checkable by the author in two
seconds, which is what makes Pass 2 work at all.

Where you're inferring rather than observing — a plausible pattern with thin
support — mark it inline as `<!-- INFERRED -->`. These markers stay in the draft
through Pass 3 so they keep drawing scrutiny, and get stripped at finalisation.
Inference isn't forbidden; unmarked inference is.

**Verify the citation before you make it, including your own.** Re-read the span
in the file and confirm it says what you are about to claim; a claim about a
repository's history means re-running the command, not recalling what it said
earlier in the session. This sounds redundant next to the rule above and it is
not: the characteristic failure here is not a missing citation but a *confident
and false* one — the right conclusion supported by evidence that does not exist,
which is invisible to every check that only asks whether a citation is present.
A negative claim ("no commit does X") is the most dangerous shape, because it is
the one you cannot support by reading a single file.

### Reserve a held-out set

Before you analyse anything, set aside **20% of the qualified corpus, chosen at
random, and do not read it.** Note which documents they are and leave them alone.

Everything the prior art in this space does terminates in someone's subjective
judgement, which means a voice skill can be enthusiastically approved and still
be wrong. The held-out set is what makes the result checkable: at the end you'll
generate against prompts derived from those documents and compare with the real
thing the author wrote. Deciding this after you've read everything is not an
option — that's how held-out sets stop being held out.

If the corpus is small enough that holding back 20% drops the working set below
the intake threshold, hold back two documents rather than a percentage, and tell
the author the validation will be weak. Don't skip it. Two checkable cases beat
none, and the alternative is an extraction with no external evidence at all.

Output of Pass 1: a draft voice skill built against
`assets/voice-skill-template.md`, plus your VOICE/PLATFORM/BORDERLINE table.

## Pass 2 — Alignment

Walk the author through the draft and collect corrections in four categories:

| Tag | Meaning |
|---|---|
| `WRONG` | Not true of them at all |
| `OVERSTATED` | Real, but you've made it more absolute than it is |
| `MISSING` | A pattern you didn't catch |
| `NEEDS_NUANCE` | True in some contexts, not others |

`OVERSTATED` earns its place. The characteristic failure of voice extraction
isn't inventing traits wholesale — it's taking something the author does
sometimes and encoding it as something they always do. A skill built from
overstated patterns produces a caricature: recognisably them, and unusably so.
Probe for it. When the author confirms a pattern, ask how often, and in what
context.

Take BORDERLINE items to them explicitly. That's what they're for.

**When the author contradicts the corpus, the author wins.** They know their own
writing better than a sample of it shows, and they know which pieces they'd
disown. Record the correction, and note the tension in a comment if the evidence
was strong — a pattern they reject but that's visibly all over the corpus is
worth one follow-up question, because sometimes it means the corpus contains
something they didn't realise wasn't native.

Annotate revisions inline as `<!-- PASS2: ... -->`, so Pass 3 can see what
changed and why. Strip them at finalisation.

## Pass 3 — Calibration

Generate sample passages using the revised draft — one per format the skill
claims to support — and have the author mark them up. Use prompts drawn from
things they'd plausibly write, not abstract exercises.

Each sample gets an overall verdict:

**GOOD** (ship it) · **CLOSE** (right register, wrong details) · **OFF** (not
them)

And each problem line gets a label that names what went wrong. The labels matter
because each one **maps to the section of the emitted skill that has to change** —
this is what turns a reaction into an edit:

| Label | Fix it in |
|---|---|
| `TOO_FORMAL` | Tone markers / register |
| `TOO_CASUAL` | Tone markers / register |
| `WRONG_WORD` | Vocabulary fingerprint, or the ban list |
| `LLM_ISM` | Ban lists |
| `NOT_ME` | Core voice patterns |
| `MISSING_PATTERN` | Whichever section should have caught it |

Do not self-audit your own samples for LLM-isms before showing them. Checking
your own output with the same model that produced it is circular, and the
author's eye is the instrument you actually came here for. Show the samples
unpolished.

Keep going until samples come back GOOD consistently, and treat each round's
markings as permanent: **these markings are the regression suite.** Store each as
prompt + the author's verdict + the labels, because that's the format you'll
re-run against later.

## Emit the artifacts

Four artifacts, into a directory called **`write-like-me`** — always that name,
never `write-like-<author>`. It is installed for its own author, so the possessive
adds nothing, the command is identical for everyone, and the author's name stays
out of a directory listing. The name goes in the `description:` instead.

Give it **four modes** — `rewrite`, `edit`, `review`, `extract` — with the
author's own words as aliases wherever they used any. Spell out for each mode
which of these files to load; an applicator that loads everything to fix one
sentence has spent its budget before it starts. Guard `review` explicitly: an
agent asked to critique will offer a rewrite "to illustrate", and that takes the
decision away from the author.

**1. `SKILL.md`** — the applicator. Structure it in this order, which is by
descending impact on the output:

1. **Ban lists** — words by grammatical category, and phrase-patterns: scenic
   openings, importance-flagging filler, rule-of-three triads.
2. **Anti-performative rules** — don't manufacture a catchphrase from one
   observed use; don't inflate an occasional habit into a signature. This section
   exists because the failure it prevents is the one authors find most
   embarrassing.
3. **Core voice patterns**, each with a golden sample the applying agent can hold
   its draft against before delivering. Concrete comparison beats abstract rules.
4. **Format modes**, with one named as the default, and openings and closings
   broken out as their own subsections.
5. **Adaptation rules**, then a two-sweep review of the finished draft: one sweep
   for LLM-isms, a second for performative writing. Two separate passes, because
   they're different failure modes and a combined sweep catches neither well.

Write rules as prescriptions with wrong/right pairs. The pairs do more work than
any description — a demonstrated contrast is something a model can hold its draft
against, where an abstract quality is not.

**Correct in one direction only.** Models fail toward clean, neutral, and tidy —
never toward too idiosyncratic. So write the rules to penalise under-shooting and
leave over-shooting alone: "if the sentence lengths are all similar, vary them"
rather than "keep sentence-length variance near the author's". A two-sided rule
invites the model to manufacture quirks the author doesn't have, which reads
worse than plain prose because it reads like someone doing an impression.

The same asymmetry governs the ban lists. Derive them partly from what is
**absent** in the corpus — the constructions this author never reaches for are
sharper evidence than the ones they occasionally use — and check every candidate
against the corpus before it goes in. A word the author demonstrably uses in
clean, pre-AI writing is their word, whatever a generic list says.

Some patterns are simultaneously the author's signature and a generic AI tell.
Don't ban those; flag **stacking**. One use is voice, three in a page is a tell.
Say so in the rule, and give the count.

Give it a **deliberately eager `description:`**. This skill you're reading is
heavyweight and runs on request; the voice skill is the opposite — it should
fire on anything the author writes for an audience, including when they haven't
thought to ask. An under-triggering voice skill is inert.

Modes do not change that. A command interface and an eager description are not
alternatives: the modes serve the author who knows what they want, and the
description serves the far more common case where they just started writing. If
the author's other skills all disable model invocation, raise it rather than
copying the pattern — the asymmetry runs the other way here. A false trigger on
a voice skill costs a paragraph that sounds like them; a missed one costs a
paragraph that sounds like nobody.

**2. `VOICE_PROFILE.md`** — the patterns, evidence, and corpus notes, referenced
by `SKILL.md` rather than inlined. Keeping the profile separate means the author
can correct a pattern later by editing one file, without regenerating anything.

Hold every line in it to two standards, both of which exist to stop the profile
degrading into horoscope prose:

- **The stranger test.** If a line would apply unchanged to someone else's
  writing, it is describing writing in general, not this person. Delete it.
  "Clear and concise" and "professional but warm" describe every text ever
  written.
- **Attach a count to every adjective.** "Median 68 words; past 120 it stops
  sounding like them" is checkable against a draft. "Concise" is not. A number
  earns its place when the applying agent can actually count it in its own
  output — which is exactly why scalar style dials (`formality: 0.7`) fail: no
  model can tell whether its paragraph is 0.7 formal.

**3. `GROUNDING.md`** — what the applying agent may assert as fact about the
author, and what it must verify first. Voice and biography get conflated
disastrously easily: an agent successfully imitating someone's confident register
will invent a job history, a client, or an anecdote in that same confident
register. Sounding like the author never licenses speaking for them. Give it
rows: what's safe to state, what needs checking, what's off-limits.

**4. `regression/`** — the Pass 3 cases as prompt + golden sample + rubric,
alongside the held-out documents. Include a short README saying how to re-run
them, because the point is that they get re-run after a model upgrade or a corpus
refresh, and the person doing that may not be you.

Language assets live in `assets/es/` and `assets/en/`. Copy in the ban lists for
the languages the author actually writes in. A bilingual author gets one voice
with shared rules plus per-language sections — not two skills, because it's one
person.

## Validate before you hand it over

Generate against two or three prompts derived from the **held-out documents**,
then show the author their own text beside the generated version. This is the
only step in the process that can tell you something the author's approval
can't, because it's the only one where a right answer already exists.

Report honestly. If the held-out comparison is weak, say so even when Pass 3
went well — that gap is real information, and it usually means the corpus was
thinner than it looked.

Set expectations while you're there: a voice skill makes text read like the
author, and it reduces but does not eliminate AI-detector signal. Anyone who
tells you otherwise is selling something.

## Updating a voice skill that already exists

Most of the time you're called, the skill will already exist and something will
have gone wrong with it. Don't re-run the whole extraction by reflex — a full
rebuild throws away every correction the author has made since, and those
corrections are the most expensive information in the artifact.

Run the regression suite first (`references/regression-suite.md` explains how to
read the results), then match the fix to what the suite tells you:

**A specific complaint** — "it keeps using em-dashes", "it opens every reply with
a question". Treat it as a Pass 3 marking: label it, follow the label to the
section it maps to, edit that section, and add the case to the suite so the fix
stays fixed. This is a five-minute job, not an extraction.

**Drift after a model change** — the profile is still accurate but the rules are
landing differently. Look for rules written as tendencies rather than as
checkable instructions, and sharpen those. The corpus is not the problem.

**"It doesn't sound like me any more"** with no specific complaint — usually the
author has moved rather than the skill. Ask for three recent pieces and compare
them against the profile. If they've genuinely drifted apart, extend the corpus
with the new material and re-run Passes 2 and 3 — but keep the existing profile
as the starting draft rather than beginning from nothing.

**New corpus material** — fold it in, hold out a fresh slice of it before
analysing, and re-run the suite. A held-out set that has already been read is not
held out, so never reuse the old one to validate a profile it helped build.

Full re-extraction is right in one case: the original corpus turned out to be
contaminated. If material was translated, AI-assisted, or not the author's, then
the patterns built on it are unsound and no amount of patching fixes that. Go
back to intake and say plainly why you're starting over.

## Reference material

- `references/dimensions.md` — the eight dimensions in detail
- `references/corpus-qualification.md` — provenance triage, worked examples
- `references/regression-suite.md` — building and re-running the suite
- `assets/voice-skill-template.md` — skeleton for the emitted `SKILL.md`
- `assets/es/llm-isms.md`, `assets/en/llm-isms.md` — ban lists
- `assets/shared/structural-tells.md` — language-independent patterns

## Attribution

The three-pass structure, the eight dimensions, the review and calibration
taxonomies, and the label-to-section mapping derive from
[sam-dumont/claude-skills](https://github.com/sam-dumont/claude-skills)
(MIT, Copyright (c) 2025 Sam Dumont). See `NOTICE` at the repository root.
