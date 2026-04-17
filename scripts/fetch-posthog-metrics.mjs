#!/usr/bin/env node
/**
 * Fetch marketing attribution metrics from PostHog.
 *
 * Queries pageviews grouped by utm_campaign and conversion events (default
 * "session_started") grouped by the person's first-touch utm_campaign over
 * a trailing window. Emits JSON to stdout that the /marketing-metrics
 * skill reads and turns into content/marketing/METRICS.md.
 *
 * Env:
 *   POSTHOG_API_KEY          — required. Personal API key (phx_...) with
 *                              "query:read" scope.
 *   POSTHOG_PROJECT_ID       — required. Numeric project id.
 *   POSTHOG_API_HOST         — optional. Default https://us.i.posthog.com
 *   POSTHOG_CONVERSION_EVENT — optional. Default "session_started". The
 *                              event used as the "signup / activation"
 *                              conversion, matching the repo's existing
 *                              capture calls.
 *   METRICS_WINDOW_DAYS      — optional. Default 7.
 *
 * Output shape (stdout):
 *   {
 *     "window_days": 7,
 *     "conversion_event": "session_started",
 *     "pageviews": [{ "campaign": "2026-04-14-short_post", "count": 42 }, ...],
 *     "conversions": [{ "campaign": "2026-04-14-short_post", "count": 3 }, ...]
 *   }
 */

const HOST = process.env.POSTHOG_API_HOST || 'https://us.i.posthog.com';
const PROJECT = process.env.POSTHOG_PROJECT_ID;
const KEY = process.env.POSTHOG_API_KEY;
const CONVERSION_EVENT = process.env.POSTHOG_CONVERSION_EVENT || 'session_started';
const WINDOW_DAYS = Number.parseInt(process.env.METRICS_WINDOW_DAYS || '7', 10);

if (!PROJECT || !KEY) {
  console.error('Missing POSTHOG_PROJECT_ID or POSTHOG_API_KEY');
  process.exit(1);
}

async function hogql(query) {
  const res = await fetch(`${HOST}/api/projects/${PROJECT}/query/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`PostHog ${res.status}: ${JSON.stringify(json)}`);
  }
  return json.results || [];
}

const PAGEVIEWS_QUERY = `
  SELECT
    properties.utm_campaign AS campaign,
    count() AS count
  FROM events
  WHERE event = '$pageview'
    AND timestamp >= now() - toIntervalDay(${WINDOW_DAYS})
    AND properties.utm_campaign IS NOT NULL
    AND properties.utm_campaign != ''
  GROUP BY campaign
  ORDER BY count DESC
  LIMIT 200
`;

// First-touch attribution via PostHog's person-level $initial_utm_campaign.
// Counts conversion events by the utm_campaign the person arrived with.
const CONVERSIONS_QUERY = `
  SELECT
    person.properties.$initial_utm_campaign AS campaign,
    count() AS count
  FROM events
  WHERE event = '${CONVERSION_EVENT.replace(/'/g, "''")}'
    AND timestamp >= now() - toIntervalDay(${WINDOW_DAYS})
    AND person.properties.$initial_utm_campaign IS NOT NULL
    AND person.properties.$initial_utm_campaign != ''
  GROUP BY campaign
  ORDER BY count DESC
  LIMIT 200
`;

async function main() {
  const [pv, conv] = await Promise.all([hogql(PAGEVIEWS_QUERY), hogql(CONVERSIONS_QUERY)]);
  const output = {
    window_days: WINDOW_DAYS,
    conversion_event: CONVERSION_EVENT,
    pageviews: pv.map(([campaign, count]) => ({ campaign, count })),
    conversions: conv.map(([campaign, count]) => ({ campaign, count })),
  };
  console.log(JSON.stringify(output, null, 2));
}

main().catch((err) => {
  console.error('[metrics] error:', err.message);
  process.exit(1);
});
