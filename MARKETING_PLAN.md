# Marketing Plan — jobsearch.quest

The automated marketing agent runs as a **Claude Code routine**
([docs](https://code.claude.com/docs/en/routines)). Each day the routine
opens a cloud session against this repo and invokes `/marketing-run`
(`.claude/skills/marketing-run/SKILL.md`), which:

1. Picks today's routine by UTC day-of-week from the schedule below.
2. Drafts one artifact in the voice described here.
3. **Publishes** to any attached MCP connector that fits (Twitter, LinkedIn,
   CMS, etc.) and commits the artifact to `content/marketing/` on `main`.
4. Updates `content/marketing/INDEX.md` and appends to
   `content/marketing/LEARNINGS.md` so the next run has memory.
5. On `weekly_review` and `next_week_plan`, **edits this file** — the plan
   evolves week over week based on what shipped.

There is no human review queue. Commits go straight to `main`.

## Weekly schedule

The skill reads this table on every run. Edit it here; the next run picks
up the change.

| UTC day   | Routine            | Goal |
|-----------|--------------------|------|
| Monday    | `short_post`       | One X/Twitter post seeded with a concrete NSA concept |
| Tuesday   | `linkedin_post`    | One LinkedIn post for mid-career professionals |
| Wednesday | `landing_audit`    | 3-principle audit of landing copy with concrete edits |
| Thursday  | `competitor_scan`  | 1-page positioning note vs. 3 adjacent categories |
| Friday    | `blog_draft`       | 700-900 word post on one NSA exercise or concept |
| Saturday  | `weekly_review`    | Score the week's outputs, edit this plan |
| Sunday    | `next_week_plan`   | Propose next week's angles, append them below |

## Voice rules (hard constraints)

- Specific, concrete, warm. Never hypey.
- No buzzwords ("leverage", "unlock", "revolutionize", "game-changer").
- No emojis. No exclamation points except inside quotes.
- Never invent testimonials, statistics, user counts, or features that are
  not in `PROJECT.md` or `DESIGN.md`.
- Reference the Never Search Alone methodology accurately.
- Return only the artifact — no preambles, no meta.

## Audiences

- **Primary:** mid-career job seekers who feel stuck searching alone
- **Secondary:** recently laid-off PMs, designers, engineers
- **Tertiary:** employed "slow seekers" exploring without urgency

## Upcoming angles

<!-- next_week_plan rewrites this section every Sunday -->
_No plan yet — the first `next_week_plan` run will populate this._

## Self-evolution

The plan is not static. Two routines edit this file:

- **`weekly_review` (Saturdays)** makes at most one bounded change per run:
  swap two days in the schedule, sharpen a single voice rule, or update
  one audience line. Edited lines carry a
  `<!-- evolved YYYY-MM-DD by weekly_review -->` comment.
- **`next_week_plan` (Sundays)** rewrites the "Upcoming angles" section
  with 6 concrete angles for the coming week.

Every run also writes to `content/marketing/LEARNINGS.md` — an
append-only log of angle, novelty, risk, and a hypothesis for next time.
The agent reads the last ~20 entries before each draft, so decisions
compound.

If the plan ever drifts somewhere you don't want, edit this file by hand
and the next run picks it up — your edits override the agent's.

## Setting up the routine (one-time)

Configured in Anthropic's web UI, not in this repo.

1. Go to [claude.ai/code/routines](https://claude.ai/code/routines) → **New
   routine**.
2. **Name:** `jobsearch.quest marketing`
3. **Prompt (paste verbatim):**
   ```
   Run the /marketing-run skill for today. Follow the instructions in that
   skill exactly. Publish the artifact to any attached connector that fits,
   commit to main (not a branch), update content/marketing/INDEX.md and
   LEARNINGS.md, and — on weekly_review or next_week_plan — edit
   MARKETING_PLAN.md per the skill's rules.
   ```
4. **Repository:** `chug2k/ai-jsc`.
5. **Enable "Allow unrestricted branch pushes"** for this repository.
   Required — otherwise the skill can only push to `claude/*` branches and
   can't commit directly to `main`.
6. **Environment:** Default is fine. No env vars needed unless a connector
   requires one.
7. **Trigger:** Schedule → **Daily** at a sensible hour in your local zone.
8. **Connectors:** attach the ones you want to publish to (Twitter/X,
   LinkedIn, your CMS). The skill uses whatever's attached and silently
   skips the rest. If no connectors are attached, the commit to `main` is
   the only publication — content lives in the repo until you wire up a
   destination.
9. Click **Create** → **Run now** to smoke-test.

## Manual invocation

From a Claude Code session in this repo:

```
/marketing-run                  # picks today's routine
/marketing-run blog_draft       # runs a specific routine
```

The skill has `disable-model-invocation: true` so it only runs on an
explicit request.

## Operations

- **Reviewing what shipped:** `content/marketing/INDEX.md` is the running
  log of every artifact, with dates, angles, and destinations.
- **Auditing the agent's thinking:** `content/marketing/LEARNINGS.md` has
  one entry per run — what it tried, what was novel, what to try next.
- **Pulling a post back:** if something went out that shouldn't have, the
  `published` block in each file's frontmatter lists destinations and URLs
  so you know what to delete on each platform.
- **Pausing the agent:** toggle **Repeats** off on the routine at
  [claude.ai/code/routines](https://claude.ai/code/routines).
