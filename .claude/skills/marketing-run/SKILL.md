---
name: marketing-run
description: Run today's marketing routine for jobsearch.quest and commit the draft. Use when the user says /marketing-run, when invoked by the daily marketing Claude Code routine, or when the user asks to generate a marketing draft for today. Pulls the schedule and voice rules from MARKETING_PLAN.md, picks today's routine by UTC day-of-week, drafts one artifact, and commits it on a claude/marketing-<date> branch.
disable-model-invocation: true
argument-hint: [routine-name]
allowed-tools: Read Grep Glob Write Edit Bash(git *) Bash(date *) Bash(ls *)
---

# Marketing run

You are the marketing agent for jobsearch.quest. This skill is invoked by the
daily Claude Code routine (or manually by the operator). Your job is to produce
**one** well-formed marketing artifact and commit it, then stop.

## Arguments

`$ARGUMENTS` may be a routine name to run explicitly. If empty, pick today's
routine by the UTC day-of-week from MARKETING_PLAN.md.

## Steps

### 1. Read the plan

Read `MARKETING_PLAN.md` from the repo root. It contains the weekly schedule
(UTC day → routine name), voice rules, and audience targets. Treat the voice
rules as hard constraints for this session.

### 2. Pick today's routine

If `$ARGUMENTS` is a non-empty recognized routine name, use it. Otherwise:

```!
date -u +"%Y-%m-%d %A (UTC day %u)"
```

Map the UTC day-of-week (Mon=1 … Sun=7) to the routine listed in
MARKETING_PLAN.md. If the mapping is ambiguous, prefer the routine that matches
the current weekday name in the table.

### 3. Read recent outputs (avoid repetition)

List the 14 most recent files under `drafts/marketing/` and read the 7 newest.
Use them to avoid repeating angles, topics, or phrasing.

```bash
ls -1t drafts/marketing/*.md 2>/dev/null | head -14
```

### 4. Read project context

Read `PROJECT.md` and `DESIGN.md`. Do not invent features, stats, user counts,
or testimonials that are not present in those files.

### 5. Draft the artifact

Produce exactly one artifact for the chosen routine. Follow the routine-specific
format below. Honor the voice rules from MARKETING_PLAN.md: specific, concrete,
warm; no buzzwords; no emojis; no exclamation points except inside quotes;
no invented facts.

Output only the artifact itself — no preamble, no "Here is…", no meta commentary.

#### Routine formats

- **short_post**: one X/Twitter post, ≤ 270 characters, no hashtags, no emojis.
  Lead with a concrete observation. Reference one NSA concept (Mnookin
  Two-Pager, Gratitude House, Listening Tour, Hot Seat, Must-Nots vs Must-Haves,
  Candidate-Market Fit). End with an implicit nod to jobsearch.quest.

- **linkedin_post**: one LinkedIn post, 150-220 words, 4-8 short paragraphs
  separated by blank lines, first line is a standalone hook. Closing question
  or soft CTA. Optional ≤ 3 hashtags on the final line.

- **landing_audit**: audit landing copy (from PROJECT.md) against three
  principles: (1) first 5 seconds promises a specific outcome, (2) proof gives
  reason to trust, (3) friction to first action. For each principle: 2-4
  sentences of diagnosis, then 1-3 concrete edits as a bullet list. Markdown,
  starts with `## Landing audit — <YYYY-MM-DD>`.

- **competitor_scan**: 1-page positioning note vs. 3 adjacent categories
  (not specific brands). For each: 3-5 sentences on what they offer, how
  jobsearch.quest is different, and the strongest claim we can make without
  overreaching. Starts with `## Positioning scan — <YYYY-MM-DD>`.

- **blog_draft**: 700-900 words on one NSA concept or exercise. H1 title, then
  one-sentence deck, 3-5 H2 sections, closing paragraph with a soft CTA. Lead
  with a real job-seeker pain. Explain the exercise concretely. Acknowledge why
  a council is better than doing it alone.

- **weekly_review**: review every file in the most recent 7 days of
  `drafts/marketing/`. For each: score 1-5 on specificity, voice fit, likely
  resonance; one-sentence reason per score. Flag top 1-2 to ship and name one
  failure pattern across the week. Starts with `## Weekly review — <YYYY-MM-DD>`.

- **next_week_plan**: propose one concrete angle per daily content routine
  (short_post, linkedin_post, landing_audit, competitor_scan, blog_draft,
  weekly_review) for the coming week. 1-2 sentences each, avoid recent
  duplicates. Starts with `## Next week plan — <YYYY-MM-DD>`.

### 6. Create the branch and write the file

Branch name: `claude/marketing-<YYYY-MM-DD>-<routine>`. If it already exists
(e.g. a re-run), suffix with `-2`, `-3`, etc.

```bash
TODAY=$(date -u +%Y-%m-%d)
git checkout -b "claude/marketing-${TODAY}-<routine>"
```

Write the artifact to `drafts/marketing/<YYYY-MM-DD>-<routine>.md`. Prepend a
small YAML frontmatter block so weekly_review can scan metadata without parsing
prose:

```markdown
---
routine: <routine>
date: <YYYY-MM-DD>
audience: <primary audience from MARKETING_PLAN.md, or overridden>
---

<artifact content>
```

For `short_post` and `linkedin_post`, the content after the frontmatter is the
post text exactly as it would be published — no surrounding commentary.

### 7. Commit

Stage only the new draft file (never `git add -A`). Commit message format:

```
marketing(<routine>): <YYYY-MM-DD> — <one-line summary of the angle>
```

Do not include a `Co-Authored-By` trailer; the routine infrastructure attributes
the commit to the operator.

### 8. Push and stop

Push the branch:

```bash
git push -u origin "claude/marketing-${TODAY}-<routine>"
```

Do not open a pull request. The routine infrastructure (or a follow-up review
routine) handles that. End the session with a two-line summary:

```
routine: <routine>
branch: claude/marketing-<YYYY-MM-DD>-<routine>
```

## Failure modes

- If the routine is `weekly_review` or `next_week_plan` and `drafts/marketing/`
  has fewer than 3 files, say so in the output and still produce the best
  review/plan possible with what exists.
- If you cannot read `MARKETING_PLAN.md`, stop and report the error. Do not
  guess the schedule.
- Never invent recent outputs. If `drafts/marketing/` is empty, say so.
