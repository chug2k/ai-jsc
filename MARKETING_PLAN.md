# Marketing Plan — jobsearch.quest

An **automated, self-evolving** marketing agent for jobsearch.quest. It runs
as two Claude Code routines, publishes through Buffer, and learns from real
PostHog attribution data.

## How it works (end to end)

1. **Daily content routine** (Claude Code routine, Anthropic-side schedule)
   invokes `/marketing-run`. The skill picks today's routine from the
   schedule below, drafts one artifact with a UTM-tagged link back to
   jobsearch.quest, and — for `short_post` / `linkedin_post` — runs
   `scripts/publish-to-buffer.mjs` to queue the post to Buffer. Buffer
   fans out to X and LinkedIn on its own queue schedule. The artifact's
   Buffer post id (or error) goes into the file's frontmatter, then
   everything commits to `main`.
2. **Daily metrics routine** (second Claude Code routine) invokes
   `/marketing-metrics`. It queries PostHog for pageviews and conversions
   per utm_campaign, writes `content/marketing/METRICS.md`, and commits.
3. **Weekly self-evolution**: on Saturday, `weekly_review` reads
   METRICS.md and makes one bounded edit to this file (swap days,
   sharpen a voice rule, or update an audience). On Sunday,
   `next_week_plan` rewrites the "Upcoming angles" section.

No human review step. No DB. No GitHub Actions. The Claude Code routine
is the only moving part; content, memory, metrics, and the plan itself
all live in this repo.

## Weekly schedule

| UTC day   | Routine            | Goal |
|-----------|--------------------|------|
| Monday    | `short_post`       | One X post, attributed |
| Tuesday   | `linkedin_post`    | One LinkedIn post, attributed |
| Wednesday | `landing_audit`    | 3-principle audit of landing copy |
| Thursday  | `competitor_scan`  | Positioning note vs. 3 adjacent categories |
| Friday    | `blog_draft`       | 700-900 word post on an NSA concept |
| Saturday  | `weekly_review`    | Score the week using METRICS.md, evolve the plan |
| Sunday    | `next_week_plan`   | Propose next week's angles, append below |

## Voice rules

- Specific, concrete, warm. Never hypey.
- No buzzwords ("leverage", "unlock", "revolutionize", "game-changer").
- No emojis. No exclamation points except inside quotes.
- Never invent testimonials, stats, user counts, or features not in
  `PROJECT.md` / `DESIGN.md`.
- Reference Never Search Alone methodology accurately.
- Return only the artifact — no preambles, no meta.

## Audiences

- **Primary:** mid-career job seekers who feel stuck searching alone
- **Secondary:** recently laid-off PMs, designers, engineers
- **Tertiary:** employed "slow seekers" exploring without urgency

## Upcoming angles

<!-- next_week_plan rewrites this section every Sunday -->
_No plan yet — the first `next_week_plan` run will populate this._

## Attribution

Every external post includes exactly one link to jobsearch.quest with a
`utm_campaign` tag matching the artifact's file stem:

```
https://jobsearch.quest/?utm_campaign=<YYYY-MM-DD>-<routine>
```

PostHog's default config captures `utm_campaign` on the `$pageview` event
and stores `$initial_utm_campaign` on the person. `/marketing-metrics`
uses the person-level property to attribute the conversion event
(default `session_started`) back to the post that brought the user in.

## One-time setup

### 1. Buffer (for X + LinkedIn publishing)

1. Sign up at [buffer.com](https://buffer.com), connect your X and
   LinkedIn accounts as channels.
2. Generate a personal access token at
   [publish.buffer.com/account/apps](https://publish.buffer.com/account/apps).
3. Fetch your channel IDs with this query (replace `$TOKEN`):
   ```bash
   curl -X POST https://api.buffer.com \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"query":"query { account { organizations { id channels { id service name } } } }"}'
   ```
   You'll see one channel object per connected account with an `id` and
   `service` (e.g. `twitter`, `linkedin`). Save the `id`s.

The Buffer token + channel IDs get wired into the content routine's
environment in step 3 below, not into GitHub.

To test the publish script locally against a committed artifact:
```bash
BUFFER_ACCESS_TOKEN=... BUFFER_TWITTER_CHANNEL_ID=... \
  node scripts/publish-to-buffer.mjs content/marketing/2026-04-14-short_post.md --dry-run
```

### 2. PostHog (for attribution-driven learning)

1. At [us.posthog.com](https://us.posthog.com) → **Settings → Personal
   API keys** → create a key with `query:read` scope. Copy it (shown
   once).
2. Note your project id (under **Settings → Project**, numeric).
3. Confirm your activation event. The current default is
   `session_started` (matches `src/stores/session-store.ts`). If you
   want a different event (e.g. a paid-plan upgrade), note its exact
   name.

### 3. Claude Code routines (two of them)

#### Content routine

At [claude.ai/code/routines](https://claude.ai/code/routines) → **New
routine**.

- **Name:** `jobsearch.quest marketing — content`
- **Prompt:**
  ```
  Run the /marketing-run skill for today. Follow the instructions in
  that skill exactly. For short_post and linkedin_post, the skill will
  publish to Buffer via scripts/publish-to-buffer.mjs before committing.
  Commit the artifact to main, update INDEX.md and LEARNINGS.md, and —
  on weekly_review or next_week_plan — edit MARKETING_PLAN.md per the
  skill's rules.
  ```
- **Repository:** `chug2k/ai-jsc`
- **Enable "Allow unrestricted branch pushes"** (so the skill can commit
  to `main`).
- **Environment:** create a custom environment with:
  - **Env vars:**
    - `BUFFER_ACCESS_TOKEN=...` (from Buffer setup step 2)
    - `BUFFER_TWITTER_CHANNEL_ID=...`
    - `BUFFER_LINKEDIN_CHANNEL_ID=...`
  - **Network access:** **Custom** → check "Also include default list of
    common package managers" → add one line under Allowed domains:
    ```
    api.buffer.com
    ```
    (Buffer's API host isn't on the default Trusted allowlist; without
    this, the publish script can't reach it.)
- **Trigger:** Schedule → Daily, ~08:00 your local time.
- **Connectors:** none required.

#### Metrics routine

Same creation flow, second routine.

- **Name:** `jobsearch.quest marketing — metrics`
- **Prompt:**
  ```
  Run the /marketing-metrics skill. Pull PostHog attribution for every
  campaign in INDEX.md, rewrite content/marketing/METRICS.md, and commit
  to main. Do not touch anything else.
  ```
- **Repository:** `chug2k/ai-jsc`
- **Enable "Allow unrestricted branch pushes"**.
- **Environment:** create a custom environment with:
  - **Env vars:**
    - `POSTHOG_API_KEY=phx_...`
    - `POSTHOG_PROJECT_ID=12345`
    - `POSTHOG_API_HOST=https://us.i.posthog.com` (or your region)
    - `POSTHOG_CONVERSION_EVENT=session_started` (optional override)
  - **Network access:** **Custom** → check "Also include default list of
    common package managers" → add one line:
    ```
    us.i.posthog.com
    ```
    (Or your EU/custom PostHog host. The default allowlist doesn't
    include PostHog.)
- **Trigger:** Schedule → Daily, ~07:30 your local time (before the
  content routine, so `weekly_review` on Saturday sees today's numbers).
- **Connectors:** none required.

## How the agent evolves

- **Every run** (content routine) writes to `LEARNINGS.md` — append-only
  memory: angle tried, novelty, risk, one hypothesis for next time.
- **Every day** (metrics routine) refreshes `METRICS.md` — views,
  conversions, scored rank per campaign.
- **Every Saturday** (`weekly_review`) edits this plan: one bounded
  change based on what the numbers + learnings show (swap two schedule
  days, sharpen a voice rule, or update an audience line). Edited lines
  get a `<!-- evolved YYYY-MM-DD -->` comment.
- **Every Sunday** (`next_week_plan`) rewrites the "Upcoming angles"
  section above with 6 concrete angles weekday routines will use.

Your hand edits to this file always win — the agent's changes are
bounded and traceable; yours are authoritative.

## Manual invocation

From any Claude Code session in this repo:

```
/marketing-run                  # today's content routine
/marketing-run blog_draft       # a specific content routine
/marketing-metrics              # refresh metrics
```

Both skills have `disable-model-invocation: true` so they only run on
explicit invocation.

## Operations

- **What shipped:** `content/marketing/INDEX.md`
- **What's landing:** `content/marketing/METRICS.md`
- **What the agent is thinking:** `content/marketing/LEARNINGS.md`
- **Pulling a post back:** each artifact's frontmatter has a
  `published.buffer.post_id`. Delete from Buffer's queue (or directly
  on the platform if it already went out).
- **Pausing:** toggle **Repeats** off on either routine at
  [claude.ai/code/routines](https://claude.ai/code/routines).
