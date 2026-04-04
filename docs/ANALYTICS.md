# Analytics Events — jobsearch.quest

PostHog integration. Events are tracked client-side via `posthog-js`. No events fire when `NEXT_PUBLIC_POSTHOG_KEY` is unset.

## User Identification

On app load, the authenticated user is identified with:

| Property | Source | Example |
|----------|--------|---------|
| `id` | `jsc_users.id` | `2245ef70-c5c6-4409-8bf1-4892649b69e3` |
| `name` | `jsc_users.name` | `Jamie` |
| `email` | `auth.users.email` | `jamie@gmail.com` |
| `plan` | `jsc_users.plan` | `free`, `3mo`, `6mo`, `12mo`, `founders_circle` |
| `search_status` | `jsc_users.search_status` | `slow`, `fast`, `exploring`, `paused` |

## Automatic Events (PostHog autocapture)

These fire without any custom code:

| Event | When |
|-------|------|
| `$pageview` | Every page navigation (`/`, `/app`, `/auth/signin`) |
| `$pageleave` | User leaves a page |
| `$autocapture` | All clicks on buttons, links, form elements |

## Custom Events

### `app_loaded`
User opened the council app and data finished loading.

| Property | Type | Description |
|----------|------|-------------|
| `plan` | string | User's current plan |

### `session_started`
User started a new council session.

| Property | Type | Description |
|----------|------|-------------|
| `member_count` | number | How many council members selected |
| `member_ids` | string[] | IDs of selected members (e.g. `["prizrak", "pg", "operator"]`) |

### `phase_advanced`
The session moved from one phase to the next.

| Property | Type | Description |
|----------|------|-------------|
| `from` | string | Previous phase (e.g. `opening`) |
| `to` | string | New phase (e.g. `commitments_review`) |

Phase values: `opening` → `commitments_review` → `wins` → `blockers` → `hot_seat` → `new_commitments` → `closing` → `done`

## Key Metrics to Track

### Activation
- Users who complete at least one full session (reach `closing` or `done` phase)
- Time from sign-up to first `session_started`

### Engagement
- Sessions per user per week
- Average phases completed per session (do people finish or drop off mid-session?)
- Phase drop-off funnel: where do sessions stall?

### Retention
- Weekly active users (users with at least one `session_started` per week)
- Week-over-week retention cohorts

### Conversion
- Free → paid conversion rate (filter by `plan` property on identify)
- Which plan people choose (group `session_started` by `plan`)

## Setup

1. Create a PostHog project at [posthog.com](https://posthog.com)
2. Add env vars:
   ```
   NEXT_PUBLIC_POSTHOG_KEY=phk_your_project_key
   NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
   ```
3. On Vercel:
   ```
   echo "phk_your_key" | vercel env add NEXT_PUBLIC_POSTHOG_KEY production
   echo "https://us.i.posthog.com" | vercel env add NEXT_PUBLIC_POSTHOG_HOST production
   ```

## Future Events to Add

| Event | When | Why |
|-------|------|-----|
| `commitment_created` | AI extracts commitments | Track accountability loop |
| `commitment_toggled` | User marks done/undone | Measure follow-through rate |
| `council_customized` | User adds/removes member | Understand which voices people want |
| `session_completed` | Session reaches `done` phase | Distinguish complete vs abandoned |
| `upgrade_clicked` | User clicks a pricing CTA | Conversion funnel entry |
| `message_sent` | User sends a message | Engagement depth per session |
