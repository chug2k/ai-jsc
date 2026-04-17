# Marketing Plan — jobsearch.quest

The automated marketing agent runs as a **Claude Code routine**
([docs](https://code.claude.com/docs/en/routines)) scheduled by Anthropic. Each
day the routine opens a cloud session against this repo and invokes the
`/marketing-run` skill (`.claude/skills/marketing-run/SKILL.md`), which drafts
one artifact and commits it on a `claude/marketing-<date>-<routine>` branch.

No cron, no external infra, no database. The repo is the system of record.

## Weekly schedule

The `/marketing-run` skill reads this table to pick today's routine by UTC
day-of-week. Edit the table to change the rotation — the skill picks up the
change on the next run.

| UTC day   | Routine            | Goal |
|-----------|--------------------|------|
| Monday    | `short_post`       | One X/Twitter post seeded with a concrete NSA concept |
| Tuesday   | `linkedin_post`    | One LinkedIn post for mid-career professionals |
| Wednesday | `landing_audit`    | 3-principle audit of landing copy with concrete edits |
| Thursday  | `competitor_scan`  | 1-page positioning note vs. 3 adjacent categories |
| Friday    | `blog_draft`       | 700-900 word post on one NSA exercise or concept |
| Saturday  | `weekly_review`    | Score + flag top 1-2 outputs of the week |
| Sunday    | `next_week_plan`   | Propose angles for the coming week |

## Voice rules (hard constraints — enforced inside the skill)

- Specific, concrete, warm. Never hypey.
- No buzzwords ("leverage", "unlock", "revolutionize", "game-changer").
- No emojis. No exclamation points except inside quotes.
- Never invent testimonials, statistics, user counts, or features that are
  not in `PROJECT.md` or `DESIGN.md`.
- Reference the Never Search Alone methodology accurately when relevant.
- Return only the artifact — no preambles, no "Here is…", no meta.

## Audiences

- **Primary:** mid-career job seekers who feel stuck searching alone
- **Secondary:** recently laid-off PMs, designers, engineers
- **Tertiary:** employed "slow seekers" exploring without urgency

## Output location

Every run writes one markdown file to `drafts/marketing/`:

```
drafts/marketing/<YYYY-MM-DD>-<routine>.md
```

Each file starts with a small YAML frontmatter block (`routine`, `date`,
`audience`) so the `weekly_review` routine can scan metadata without parsing
prose.

## Setting up the routine (one-time)

Claude Code Routines are configured in Anthropic's web UI, not in this repo.

1. Go to [claude.ai/code/routines](https://claude.ai/code/routines) and click
   **New routine**.
2. **Name:** `jobsearch.quest marketing`
3. **Prompt:** paste this verbatim:
   ```
   Run the /marketing-run skill for today. Follow the instructions in that
   skill exactly. Pick today's routine from MARKETING_PLAN.md by UTC day-of-week,
   draft the artifact, and commit it to a claude/marketing-<date>-<routine>
   branch. Do not open a PR — just push the branch and stop.
   ```
4. **Repository:** `chug2k/ai-jsc` (default branch clones each run).
5. **Environment:** Default is fine — no special network or env vars needed.
6. **Trigger:** Schedule → **Daily** at a reasonable hour in your local zone.
7. **Connectors:** remove any not needed (the skill only touches the repo).
8. Click **Create**. Use **Run now** to smoke-test the first run.

## Manual invocation

From any Claude Code session in this repo:

```
/marketing-run                 # picks today's routine
/marketing-run blog_draft      # runs a specific routine
```

The skill has `disable-model-invocation: true` so it only runs when invoked
explicitly.

## Operations

- Reviewing drafts: each run pushes a branch. Review the branch, cherry-pick
  what to ship, or turn it into a PR manually. Nothing goes live automatically.
- Changing the rotation: edit the weekly schedule table above — the skill
  re-reads this file on every run.
- Changing voice rules: same — edit the voice rules section above.
- Adding a new routine: add it to the table, then add a format block to the
  skill's `Routine formats` section.
