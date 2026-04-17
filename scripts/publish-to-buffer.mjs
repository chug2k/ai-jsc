#!/usr/bin/env node
/**
 * Publish one marketing artifact to Buffer.
 *
 * Invoked by the /marketing-run skill after drafting a short_post or
 * linkedin_post. The skill captures stdout and records the Buffer post
 * id (or error) in the artifact's frontmatter before committing.
 *
 * Usage:
 *   node scripts/publish-to-buffer.mjs <path-to-artifact.md>
 *   node scripts/publish-to-buffer.mjs <path> --dry-run
 *
 * Env:
 *   BUFFER_ACCESS_TOKEN         — required. Personal access token from
 *                                 https://publish.buffer.com/account/apps
 *   BUFFER_TWITTER_CHANNEL_ID   — required for short_post
 *   BUFFER_LINKEDIN_CHANNEL_ID  — required for linkedin_post
 *
 * Output (stdout): single JSON line describing the result:
 *   { "ok": true, "channel": "twitter", "post_id": "...", "due_at": "..." }
 *   { "ok": false, "channel": "twitter", "error": "..." }
 *   { "ok": true, "skipped": "not a publishable routine" }
 *
 * Exit codes:
 *   0 — success OR skipped OR dry-run
 *   1 — config error (missing env, bad args, unreadable file)
 *   2 — Buffer call failed
 */

import { readFileSync } from 'node:fs';

const BUFFER_ENDPOINT = 'https://api.buffer.com';

const ROUTINE_TO_CHANNEL = {
  short_post: { envVar: 'BUFFER_TWITTER_CHANNEL_ID', label: 'twitter' },
  linkedin_post: { envVar: 'BUFFER_LINKEDIN_CHANNEL_ID', label: 'linkedin' },
};

function die(msg, code = 1) {
  console.log(JSON.stringify({ ok: false, error: msg }));
  process.exit(code);
}

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
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(json)}`);
  if (json.errors) throw new Error(`GraphQL: ${JSON.stringify(json.errors)}`);
  const result = json.data?.createPost;
  if (result?.__typename === 'MutationError') throw new Error(result.message);
  return result?.post ?? null;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const filePath = args.find((a) => !a.startsWith('--'));

  if (!filePath) die('Usage: node scripts/publish-to-buffer.mjs <path> [--dry-run]');

  let raw;
  try { raw = readFileSync(filePath, 'utf8'); }
  catch (err) { die(`cannot read ${filePath}: ${err.message}`); }

  const { meta, body } = parseFrontmatter(raw);
  const routine = meta.routine;

  if (!(routine in ROUTINE_TO_CHANNEL)) {
    console.log(JSON.stringify({ ok: true, skipped: `routine ${routine || '?'} is not a publishable post` }));
    return;
  }

  const { envVar, label } = ROUTINE_TO_CHANNEL[routine];
  const channelId = process.env[envVar];
  if (!channelId) die(`env var ${envVar} is not set`);

  const text = body.trim();
  if (!text) die('artifact body is empty');

  if (dryRun) {
    console.log(JSON.stringify({ ok: true, channel: label, dry_run: true, chars: text.length }));
    return;
  }

  const token = process.env.BUFFER_ACCESS_TOKEN;
  if (!token) die('env var BUFFER_ACCESS_TOKEN is not set');

  try {
    const post = await createBufferPost({ token, channelId, text });
    console.log(JSON.stringify({
      ok: true,
      channel: label,
      post_id: post?.id ?? null,
      due_at: post?.dueAt ?? null,
    }));
  } catch (err) {
    console.log(JSON.stringify({ ok: false, channel: label, error: err.message }));
    process.exit(2);
  }
}

main().catch((err) => {
  console.log(JSON.stringify({ ok: false, error: `unexpected: ${err.message}` }));
  process.exit(2);
});
