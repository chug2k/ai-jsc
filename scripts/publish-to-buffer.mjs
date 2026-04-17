#!/usr/bin/env node
/**
 * Publish new marketing artifacts to Buffer.
 *
 * Invoked by .github/workflows/marketing-publish.yml after the marketing
 * agent commits to main. Reads files added in the latest commit under
 * content/marketing/, parses YAML frontmatter, and queues the text to the
 * channel matching the routine type.
 *
 * Env:
 *   BUFFER_ACCESS_TOKEN         — required. Personal access token from
 *                                 https://publish.buffer.com/account/apps
 *   BUFFER_TWITTER_CHANNEL_ID   — required for short_post routines
 *   BUFFER_LINKEDIN_CHANNEL_ID  — required for linkedin_post routines
 *   CHANGED_FILES               — required. Newline-separated list of files
 *                                 added in the triggering commit. The
 *                                 workflow computes this via git diff.
 *   DRY_RUN                     — optional. "1" skips the Buffer call.
 *
 * Exit codes:
 *   0 — all eligible posts published (or no eligible posts)
 *   1 — configuration error (missing env)
 *   2 — at least one Buffer call failed
 */

import { readFileSync } from 'node:fs';

const BUFFER_ENDPOINT = 'https://api.buffer.com';

const ROUTINE_TO_CHANNEL = {
  short_post: process.env.BUFFER_TWITTER_CHANNEL_ID,
  linkedin_post: process.env.BUFFER_LINKEDIN_CHANNEL_ID,
};

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  return { meta, body: match[2].trim() };
}

async function createBufferPost({ token, channelId, text }) {
  const res = await fetch(BUFFER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
        mutation CreatePost($input: CreatePostInput!) {
          createPost(input: $input) {
            __typename
            ... on PostActionSuccess { post { id dueAt } }
            ... on MutationError { message }
          }
        }
      `,
      variables: {
        input: {
          text,
          channelId,
          schedulingType: 'automatic',
          mode: 'addToQueue',
        },
      },
    }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Buffer HTTP ${res.status}: ${JSON.stringify(json)}`);
  }
  if (json.errors) {
    throw new Error(`Buffer GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  const result = json.data?.createPost;
  if (result?.__typename === 'MutationError') {
    throw new Error(`Buffer mutation error: ${result.message}`);
  }
  return result?.post ?? null;
}

async function main() {
  const token = process.env.BUFFER_ACCESS_TOKEN;
  const changed = (process.env.CHANGED_FILES || '').split('\n').map((s) => s.trim()).filter(Boolean);
  const dryRun = process.env.DRY_RUN === '1';

  if (!dryRun && !token) {
    console.error('[publish] BUFFER_ACCESS_TOKEN missing');
    process.exit(1);
  }

  const eligible = changed.filter((f) => /^content\/marketing\/\d{4}-\d{2}-\d{2}-[a-z_]+\.md$/.test(f));
  if (eligible.length === 0) {
    console.log('[publish] no eligible files in this commit — nothing to publish');
    return;
  }

  let failures = 0;

  for (const file of eligible) {
    const raw = readFileSync(file, 'utf8');
    const { meta, body } = parseFrontmatter(raw);
    const routine = meta.routine;

    if (!(routine in ROUTINE_TO_CHANNEL)) {
      console.log(`[publish] skip ${file} — routine ${routine} is not a publishable post`);
      continue;
    }

    const channelId = ROUTINE_TO_CHANNEL[routine];
    if (!channelId) {
      console.error(`[publish] skip ${file} — channel id env var for ${routine} is not set`);
      failures++;
      continue;
    }

    // The body is the post text. Strip any trailing whitespace.
    const text = body.trim();
    if (!text) {
      console.error(`[publish] skip ${file} — empty body`);
      failures++;
      continue;
    }

    console.log(`[publish] ${file} → ${routine} (${text.length} chars)`);
    if (dryRun) {
      console.log('[publish]   DRY_RUN=1, skipping Buffer call');
      continue;
    }

    try {
      const post = await createBufferPost({ token, channelId, text });
      console.log(`[publish]   queued: id=${post?.id ?? '?'} dueAt=${post?.dueAt ?? '?'}`);
    } catch (err) {
      console.error(`[publish]   failed: ${err.message}`);
      failures++;
    }
  }

  if (failures > 0) {
    console.error(`[publish] ${failures} failure(s)`);
    process.exit(2);
  }
}

main().catch((err) => {
  console.error('[publish] unexpected error:', err);
  process.exit(2);
});
