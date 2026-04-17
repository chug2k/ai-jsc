/**
 * Local runner for the marketing agent.
 *
 * Usage:
 *   npx tsx scripts/marketing-agent.ts              # runs today's routine
 *   npx tsx scripts/marketing-agent.ts <routine>    # runs a specific routine
 *   npx tsx scripts/marketing-agent.ts <routine> --dry-run   # no DB write
 *
 * Routines: short_post | linkedin_post | landing_audit |
 *           competitor_scan | blog_draft | weekly_review | next_week_plan
 *
 * In production the Vercel cron hits /api/cron/marketing once per day. This
 * script is the same code path without the HTTP hop — useful for testing a
 * single routine against live Supabase + OpenAI from your laptop.
 */

import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

import { runDailyMarketing } from '../src/lib/marketing/agent';
import { ROUTINES, type RoutineName } from '../src/lib/marketing/routines';

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const positional = args.filter((a) => !a.startsWith('--'));
  const routine = positional[0] as RoutineName | undefined;

  const validRoutines = Object.keys(ROUTINES) as RoutineName[];
  if (routine && !validRoutines.includes(routine)) {
    console.error(`Unknown routine: ${routine}`);
    console.error(`Valid: ${validRoutines.join(' | ')}`);
    process.exit(1);
  }

  console.log(`[marketing-agent] routine=${routine || '(today)'} dryRun=${dryRun}`);

  const result = await runDailyMarketing({ routine, dryRun });

  console.log(`\n--- ${result.routine} (${result.latencyMs}ms, ${result.model}) ---\n`);
  console.log(result.content);
  console.log(`\n--- stored: ${result.stored?.id ?? '(dry-run, not stored)'} ---`);
}

main().catch((err) => {
  console.error('[marketing-agent] error:', err instanceof Error ? err.message : err);
  process.exit(1);
});
