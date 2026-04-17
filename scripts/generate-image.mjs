#!/usr/bin/env node
/**
 * Generate a creative image for a marketing artifact via OpenAI image API.
 *
 * Usage:
 *   node scripts/generate-image.mjs --slug <slug> --prompt "<prompt>"
 *   node scripts/generate-image.mjs --slug <slug> --prompt "<prompt>" --size 1536x1024
 *   node scripts/generate-image.mjs --slug <slug> --prompt "<prompt>" --dry-run
 *
 * Writes public/marketing/<slug>.png. The OG route at /api/og serves
 * the file automatically (redirecting to /marketing/<slug>.png) when a
 * scraper visits a UTM-tagged link; no Buffer media upload required.
 *
 * Env:
 *   OPENAI_API_KEY   — required (unless --dry-run)
 *   OPENAI_IMAGE_MODEL — optional, default "gpt-image-1"
 *
 * Output (stdout): one JSON line.
 *   { "ok": true, "path": "public/marketing/<slug>.png", "url": "https://..." }
 *   { "ok": false, "error": "..." }
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';
const ENDPOINT = 'https://api.openai.com/v1/images/generations';
const PUBLIC_BASE = process.env.PUBLIC_BASE_URL || 'https://jobsearch.quest';

function die(msg, code = 1) {
  console.log(JSON.stringify({ ok: false, error: msg }));
  process.exit(code);
}

function parseArgs(argv) {
  const out = { size: '1536x1024' };
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    const val = argv[i + 1];
    if (key === '--slug') { out.slug = val; i++; }
    else if (key === '--prompt') { out.prompt = val; i++; }
    else if (key === '--size') { out.size = val; i++; }
    else if (key === '--dry-run') { out.dryRun = true; }
  }
  return out;
}

async function generate({ prompt, size }) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: MODEL, prompt, size, n: 1 }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${json.error?.message || JSON.stringify(json)}`);
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error(`no b64_json in response: ${JSON.stringify(json).slice(0, 200)}`);
  return Buffer.from(b64, 'base64');
}

async function main() {
  const { slug, prompt, size, dryRun } = parseArgs(process.argv.slice(2));
  if (!slug) die('--slug is required');
  if (!prompt) die('--prompt is required');
  if (!/^[a-z0-9-_]+$/i.test(slug)) die(`invalid slug: ${slug}`);

  if (dryRun) {
    console.log(JSON.stringify({
      ok: true,
      dry_run: true,
      path: `public/marketing/${slug}.png`,
      url: `${PUBLIC_BASE}/marketing/${slug}.png`,
      prompt_chars: prompt.length,
      size,
    }));
    return;
  }

  if (!process.env.OPENAI_API_KEY) die('OPENAI_API_KEY not set');

  let png;
  try { png = await generate({ prompt, size }); }
  catch (err) { die(err.message, 2); }

  const relPath = `public/marketing/${slug}.png`;
  const absPath = join(process.cwd(), relPath);
  mkdirSync(dirname(absPath), { recursive: true });
  writeFileSync(absPath, png);

  console.log(JSON.stringify({
    ok: true,
    path: relPath,
    url: `${PUBLIC_BASE}/marketing/${slug}.png`,
    bytes: png.byteLength,
  }));
}

main().catch((err) => die(`unexpected: ${err.message}`, 2));
