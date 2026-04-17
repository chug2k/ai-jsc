# Marketing Plan — jobsearch.quest

The automated marketing agent reads this file on every run. Edit the schedule,
voice rules, or audiences here and redeploy — the agent picks up the changes.

## Weekly schedule

The agent runs once per day (see `vercel.json`) and executes whichever routine
is scheduled for the current UTC day-of-week.

| Day (UTC) | Routine | Goal |
|-----------|---------|------|
| Mon | `short_post` | Ship one X/Twitter post seeded with a concrete NSA methodology idea |
| Tue | `linkedin_post` | Draft one LinkedIn post aimed at mid-career professionals |
| Wed | `landing_audit` | Audit landing page copy against 3 conversion principles, output recs |
| Thu | `competitor_scan` | Sketch a 1-page note on how we're positioned vs. 3 adjacent products |
| Fri | `blog_draft` | Draft a 700-900 word blog post on a NSA exercise or concept |
| Sat | `weekly_review` | Review the week's outputs, score them, flag top 1-2 to ship |
| Sun | `next_week_plan` | Propose themes + angles for the coming week based on recent outputs |

## Voice rules (hard constraints, enforced in the agent system prompt)

- Specific, concrete, warm. Never hypey.
- No buzzwords ("leverage", "unlock", "revolutionize", "game-changer").
- No emojis. No exclamation points except where content quotes someone.
- Never invent testimonials, statistics, user counts, or features that are
  not present in PROJECT.md / DESIGN.md.
- Reference Never Search Alone methodology accurately when relevant.
- Return only the requested artifact — no preambles, no "Here is...".

## Default audiences

- Primary: mid-career job seekers who feel stuck searching alone
- Secondary: recently laid-off PMs, designers, and engineers
- Tertiary: employed "slow seekers" exploring without urgency

## Outputs

Every routine run writes one row to `jsc_marketing_outputs` in Supabase:

```
id, routine, content, meta (jsonb), created_at
```

Retrieve them via the admin dashboard or by querying Supabase directly.

## Manual trigger

To run a routine outside the cron:

```
npx tsx scripts/marketing-agent.ts               # today's routine
npx tsx scripts/marketing-agent.ts blog_draft    # specific routine
```

## Operations

- Schedule: `vercel.json` cron entry, daily at 14:00 UTC
- Endpoint: `POST /api/cron/marketing` (guarded by `CRON_SECRET` bearer)
- Model: `gpt-5.4` (override with `MARKETING_MODEL` env var)
- Failure mode: on error, the endpoint returns 500 with the error message.
  No retries — the next day's cron will move on. Check Vercel logs.
