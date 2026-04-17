# Marketing content

Populated by the `/marketing-run` skill invoked by the daily Claude Code
routine. See [../../MARKETING_PLAN.md](../../MARKETING_PLAN.md) for the
schedule, voice rules, and how the system evolves.

## Files

- `<YYYY-MM-DD>-<routine>.md` — one per run, the shipped artifact + YAML
  frontmatter recording routine, angle, and destinations.
- `INDEX.md` — auto-maintained table of every shipped artifact.
- `LEARNINGS.md` — auto-appended memory the agent reads before each run to
  avoid repetition and carry forward hypotheses.

Everything here is shipped. The agent writes directly to `main` — there is
no review queue.
