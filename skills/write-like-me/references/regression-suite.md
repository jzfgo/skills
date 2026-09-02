# The regression suite

Most voice extraction ends when the author says "yes, that's me." That's a
one-time subjective sign-off on a system with at least three moving parts — the
model, the corpus, and the skill text — and when any of them shifts, nothing
tells anyone.

The suite exists so the question "does this still sound like me?" has a repeatable
answer. Build it as a by-product of Pass 3 rather than as extra work: the
calibration markings **are** the suite, if you store them in a re-runnable shape.

---

## What goes in it

### 1. Calibration cases, from Pass 3

One per sample the author marked. Store:

```
prompt/              the task that produced the sample
generated.md         what the skill produced at extraction time
verdict              GOOD | CLOSE | OFF
labels               the line-level markings and where they landed
```

Keep the `OFF` and `CLOSE` cases. The instinct is to keep only the good ones, but
a case that used to fail and now passes is the only evidence you have that a
revision did something, and a case that used to pass and now fails is exactly
what drift looks like.

### 2. Held-out documents

The 20% set aside before Pass 1, never read during extraction. For each, store a
prompt reconstructing the brief the author was writing to, plus the real
document as the reference.

These are the only cases with an objective answer: the author already wrote the
right one. Everything else in the suite measures agreement with the author's
judgement on a given day, which is worth having but is not the same thing.

### 3. Negative cases

Two or three prompts where the correct behaviour is *not* to sound maximally
like the author: a format the profile says they don't write, a register they
don't use, a factual claim the skill should refuse to invent rather than assert
in a confident voice.

A voice skill that passes every positive case and cheerfully fabricates a
biography in the author's cadence has failed at the thing that actually matters.

---

## Re-running it

Run the suite when the model changes, when the corpus grows, and after any edit
to the profile. For each case: generate from the stored prompt against the
current skill, then compare.

Compare **blind where you can**. Put the new generation beside the reference —
the author's real text for held-out cases, the stored generation for calibration
cases — without labelling which is which, and ask the author to pick the one that
sounds more like them. An unlabelled comparison catches things a labelled one
doesn't, because knowing which is the new version is enough to bias the read.

Record for each case: the verdict now, the verdict before, and any new labels.
Three or more cases moving from GOOD to CLOSE is drift, even when each
individual drop looks tolerable.

## Reading the results

**Held-out cases fail while calibration cases pass.** The profile is tuned to
the author's stated preferences rather than their actual writing. It happens when
Pass 2 corrections went unexamined — the author described the voice they think
they have. Go back to the corpus.

**Calibration cases fail while held-out cases pass.** Usually a model change. The
profile is still right; the rules it relies on are landing differently. Look for
rules stated as tendencies rather than as checkable instructions.

**Everything drops together.** Either the model changed substantially or the
corpus grew in a way that shifted the profile's centre. Check what was added.

**Everything passes, and the author is still unhappy.** The suite is measuring
the wrong thing, or the voice has moved. Ask for three recent pieces and compare
them against the profile directly. A voice extracted two years ago describes a
writer from two years ago.

## Keeping it honest

The suite decays in a specific way: cases get quietly dropped when they fail,
until only the passing ones remain and the suite reports health forever. Guard
against it by keeping the case count fixed and recording verdicts per run rather
than a single current state, so a case that stops being run is visible as a gap.

If a case becomes genuinely obsolete — a format the author abandoned — retire it
explicitly with a note, and add a replacement. Retiring is fine. Silent
disappearance is what you're preventing.

Refresh the held-out set when the corpus grows: hold out from the new material
too, before analysing it. A held-out set that was read once is not held out any
more, and reusing it produces confident, meaningless passes.
