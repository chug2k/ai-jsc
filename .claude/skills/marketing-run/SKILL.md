---
name: marketing-run
description: Run today's marketing routine for jobsearch.quest, publish the artifact, and evolve the plan. Use when the user says /marketing-run, when invoked by the daily marketing Claude Code routine, or when the user asks to publish a marketing artifact for today. Picks today's routine from MARKETING_PLAN.md by UTC day-of-week, drafts one artifact, publishes it (via connected MCP connectors if available), commits to main, updates content/marketing/INDEX.md + LEARNINGS.md, and — on weekly routines — edits MARKETING_PLAN.md to reflect what the data shows.
disable-model-invocation: true
argument-hint: [routine-name]
allowed-tools: Read Grep Glob Write Edit Bash(git *) Bash(date *) Bash(ls *) Bash(node *)
---

# Marketing run

You are the marketing agent for jobsearch.quest. This skill is invoked
autonomously by the daily Claude Code routine (no human review step). Your
job: produce one artifact, **publish it**, record what you learned, and, on
the weekly routines, **edit the plan itself** so the system gets smarter week
over week.

Everything you write ships — there is no review queue. Be rigorous.

## Arguments

`$ARGUMENTS` is an optional routine name to run explicitly. If empty, pick
today's routine by UTC day-of-week from `MARKETING_PLAN.md`.

## Steps

### 1. Read the plan and the history

Read in parallel:

- `MARKETING_PLAN.md` — schedule, voice rules, audiences. Voice rules are
  hard constraints for this session.
- `content/marketing/LEARNINGS.md` — last 20 entries. This is your memory.
- `content/marketing/INDEX.md` — what you've already shipped.
- `content/marketing/METRICS.md` — PostHog attribution per campaign. This
  is how you learn from real numbers. If the file says "No data yet",
  just note that and rely on LEARNINGS for now.
- The 7 most recent files under `content/marketing/*.md` (excluding
  README/INDEX/LEARNINGS/METRICS).
- `PROJECT.md` and `DESIGN.md` — product truth. Do not invent features,
  stats, users, or testimonials beyond what's in these.

### 2. Pick today's routine

If `$ARGUMENTS` is a recognized routine, use it. Otherwise:

```!
date -u +"%Y-%m-%d %A"
```

Map the UTC weekday name to the row in MARKETING_PLAN.md's schedule table.

### 3. Decide the angle

Using LEARNINGS, INDEX, METRICS, and the 7 most recent outputs, pick a
concrete angle you have NOT used recently. Reject:

- Any topic covered in the last 7 outputs.
- Any phrasing that echoes a previous opener.
- Any angle that LEARNINGS.md flagged as "underperforming" or "tried,
  skip next N runs".

If METRICS.md has real data, **bias toward patterns that converted**. If a
prior `short_post` with an angle about Gratitude House led to 2x the
converts of other posts, lean that direction again (different specifics,
same thematic territory). If everything is roughly flat, fall back to
novelty over optimization.

Write down (in your thinking, not the artifact) the one-sentence angle
you're committing to before drafting.

### 4. Draft the artifact

Produce exactly one artifact for the routine, following the format below.
Honor the voice rules from MARKETING_PLAN.md strictly: specific, concrete,
warm; no buzzwords; no emojis; no exclamation points except inside quotes;
no invented facts.

Output only the artifact — no preamble, no "Here is…", no meta.

#### Routine formats

For **any post that ships to an external platform** (`short_post`,
`linkedin_post`), include exactly ONE attributed link back to the product:

```
https://jobsearch.quest/?utm_campaign=<slug>
```

where `<slug>` is `<YYYY-MM-DD>-<routine>` — the file stem. This is how
the `/marketing-metrics` routine attributes traffic and conversions back
to this specific post. Do not add `utm_source` / `utm_medium` — Buffer and
the platforms overwrite those. Only `utm_campaign` is stable.

Keep the link natural. If the post can stand without the URL, that's
better — but attribution matters more than aesthetics for the first few
weeks while the agent is learning what works.

- **short_post** — one X/Twitter post, ≤ 270 characters including the
  URL, no hashtags, no emojis. Lead with a concrete observation.
  Reference one NSA concept (Mnookin Two-Pager, Gratitude House,
  Listening Tour, Hot Seat, Must-Nots vs Must-Haves, Candidate-Market
  Fit). The URL at the end is acceptable.

- **linkedin_post** — one LinkedIn post, 150-220 words, 4-8 short
  paragraphs with blank lines between. First line is a standalone hook.
  Include the attributed URL in the closing CTA paragraph. Optional ≤ 3
  hashtags on the final line.

- **landing_audit** — audit landing copy (from PROJECT.md) against three
  principles: (1) first 5 seconds promises a specific outcome, (2) proof
  gives reason to trust, (3) friction to first action. For each: 2-4
  sentences of diagnosis, 1-3 concrete edit bullets. Starts with
  `## Landing audit — <YYYY-MM-DD>`.

- **competitor_scan** — positioning note vs. 3 adjacent categories (not
  specific brands). For each: 3-5 sentences on what they offer, how
  jobsearch.quest differs, the strongest honest claim we can make. Starts
  with `## Positioning scan — <YYYY-MM-DD>`.

- **blog_draft** — 700-900 words on one NSA concept or exercise. H1 title,
  one-sentence deck, 3-5 H2 sections, closing with a soft CTA. Lead with a
  real job-seeker pain. Explain the exercise concretely. Acknowledge why
  the council amplifies it.

- **weekly_review** — review the last 7 files in `content/marketing/` AND
  read `content/marketing/METRICS.md`. For each file, score:
    - **Numbers** (if data available): views, converts, rate from METRICS.md
    - **Specificity**, **voice fit**, **likely resonance** (1-5 each)
    - One-sentence reason
  Name the top 1-2 by actual converts (or by qualitative score if METRICS
  is empty), and name one failure pattern across the week (e.g. "hooks
  got vague Thursday onward", "every blog_draft led with a question").
  Starts with `## Weekly review — <YYYY-MM-DD>`. **Also edit
  MARKETING_PLAN.md** — see step 6.

- **next_week_plan** — propose one concrete angle per daily content
  routine for the coming week. 1-2 sentences each, avoid recent
  duplicates. Starts with `## Next week plan — <YYYY-MM-DD>`. **Also edit
  MARKETING_PLAN.md's "Upcoming angles" section** — see step 7.

### 5. Write the artifact file (draft), then publish to Buffer

Do steps 5a → 5b before committing. The publish result gets baked into
the frontmatter in 5c so the committed file is an honest record of what
actually went out.

#### 5a. Write the draft file

File path: `content/marketing/<YYYY-MM-DD>-<routine>.md`. The file stem
IS the `utm_campaign` slug — do not deviate. Write these frontmatter
fields with a TEMPORARY `published: pending` placeholder:

```markdown
---
routine: <routine>
date: <YYYY-MM-DD>
audience: <primary audience or override>
angle: <one-sentence angle from step 3>
slug: <YYYY-MM-DD>-<routine>
published: pending
---

<artifact body, verbatim as it will be posted, including any UTM URL>
```

#### 5b. Publish to Buffer (short_post / linkedin_post only)

For `short_post` and `linkedin_post`, call the publish script:

```bash
node scripts/publish-to-buffer.mjs content/marketing/<YYYY-MM-DD>-<routine>.md
```

The script reads the file, extracts the body, and queues it to Buffer's
automatic queue for the channel matching the routine. It prints exactly
one JSON line to stdout. Three shapes:

- `{ "ok": true, "channel": "...", "post_id": "...", "due_at": "..." }`
  — queued successfully.
- `{ "ok": true, "skipped": "..." }` — not a publishable routine (you
  shouldn't see this for short_post/linkedin_post).
- `{ "ok": false, "channel": "...", "error": "..." }` — Buffer rejected
  the call. The artifact still commits; record the error and move on.

For all other routines (landing_audit, competitor_scan, blog_draft,
weekly_review, next_week_plan), skip the publish step entirely. Those
artifacts live in the repo only.

#### 5c. Update frontmatter with the result

Replace `published: pending` with a structured block reflecting what
happened in 5b:

```yaml
# On success:
published:
  buffer:
    post_id: <id from stdout>
    due_at: <due_at from stdout>

# On Buffer failure:
published:
  buffer:
    error: <error message from stdout>

# For non-publishable routines:
published:
  repo_only: true
```

If the publish failed, also mention it in the LEARNINGS.md entry in
step 6 (under "Risk") so the next run notices.

### 6. Update INDEX, LEARNINGS, and (on weekly routines) the plan

**Always update `content/marketing/INDEX.md`**: append one row to the table,
or create the table if it doesn't exist. Schema:

| Date | Routine | Angle | Destinations |
|------|---------|-------|--------------|

**Always append to `content/marketing/LEARNINGS.md`** a block like:

```markdown
## <YYYY-MM-DD> — <routine>

- Angle: <one sentence>
- Novelty: <what made this different from the last 7 outputs>
- Risk: <what could fall flat, or empty if confident>
- Try next time: <one concrete experiment the next same-routine run should try>
```

**If `routine == weekly_review`**: also edit `MARKETING_PLAN.md`. Make AT
MOST ONE bounded change: either (a) swap two days in the weekly schedule
table, (b) sharpen a voice rule (add or tighten one bullet), or (c) update
one audience line. Preserve the file's headings and table shape exactly.
Do not rewrite the file. Add an HTML comment on the edited line:
`<!-- evolved <YYYY-MM-DD> by weekly_review -->`.

**If `routine == next_week_plan`**: also edit `MARKETING_PLAN.md` to
add/replace an "Upcoming angles" section (create it if missing) that lists
the 6 suggested angles as a markdown list keyed by routine name. Future
runs read this section when deciding the angle in step 3.

### 7. Commit and push to main

The routine must have **"Allow unrestricted branch pushes"** enabled for
this repository (see MARKETING_PLAN.md setup notes). Stay on `main`. Stage
only the files you touched:

```bash
git add content/marketing/<YYYY-MM-DD>-<routine>.md content/marketing/INDEX.md content/marketing/LEARNINGS.md
# on weekly routines:
git add MARKETING_PLAN.md
```

Commit message format:

```
marketing(<routine>): <YYYY-MM-DD> — <angle summary>

Session: https://claude.ai/code/${CLAUDE_CODE_REMOTE_SESSION_ID}
```

Push to main:

```bash
git push origin main
```

If the push is rejected because someone else committed, rebase and retry:

```bash
git pull --rebase origin main && git push origin main
```

### 8. End with a two-line summary

```
routine: <routine>
slug: <YYYY-MM-DD>-<routine> — published: <buffer post id | error | repo_only>
```

## Safety rails

- **Never amend or force-push.** Always a new commit on `main`.
- **Never stage broadly.** Only the files listed in step 7.
- **Never rewrite `MARKETING_PLAN.md` wholesale.** Weekly routines make one
  bounded change per run.
- **Never invent a connector response.** If no URL came back, don't claim
  the post shipped.
- **If `content/marketing/` has < 3 files**, `weekly_review` and
  `next_week_plan` produce the best review/plan possible with what exists
  and skip the MARKETING_PLAN.md edit for that run.
- **If a voice rule from MARKETING_PLAN.md and the artifact conflict, the
  voice rule wins** — redraft before publishing.
