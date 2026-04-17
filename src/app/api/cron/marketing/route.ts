/**
 * Daily marketing agent cron.
 *
 * Invoked by Vercel cron (see vercel.json). Guarded by a shared-secret bearer
 * token so random traffic can't trigger it.
 *
 * Env:
 *   CRON_SECRET           — required, matched against Authorization: Bearer ...
 *   OPENAI_API_KEY        — required, for the LLM call
 *   SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL — required for persistence
 *   MARKETING_MODEL       — optional override (default: gpt-5.4)
 */

import { NextRequest, NextResponse } from 'next/server';
import { runDailyMarketing } from '@/lib/marketing/agent';
import type { RoutineName } from '@/lib/marketing/routines';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get('authorization') || '';
  return header === `Bearer ${secret}`;
}

async function run(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const override = url.searchParams.get('routine') as RoutineName | null;

  try {
    const result = await runDailyMarketing({ routine: override || undefined });
    return NextResponse.json({
      ok: true,
      routine: result.routine,
      model: result.model,
      latencyMs: result.latencyMs,
      outputId: result.stored?.id ?? null,
      preview: result.content.slice(0, 200),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[cron/marketing] error:', message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return run(req);
}

export async function POST(req: NextRequest) {
  return run(req);
}
