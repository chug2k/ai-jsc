import { SupabaseClient } from '@supabase/supabase-js';

export interface PlanLimits {
  sessions_per_month: number | null; // null = unlimited
  max_council_members: number;
  real_people_voices: boolean;
  custom_members: boolean;
  premium_models: boolean;
}

// Fallback limits if DB is unreachable
const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    sessions_per_month: 4,
    max_council_members: 3,
    real_people_voices: false,
    custom_members: false,
    premium_models: false,
  },
  '3mo': {
    sessions_per_month: null,
    max_council_members: 5,
    real_people_voices: true,
    custom_members: true,
    premium_models: true,
  },
  '6mo': {
    sessions_per_month: null,
    max_council_members: 5,
    real_people_voices: true,
    custom_members: true,
    premium_models: true,
  },
  '12mo': {
    sessions_per_month: null,
    max_council_members: 5,
    real_people_voices: true,
    custom_members: true,
    premium_models: true,
  },
  founders_circle: {
    sessions_per_month: null,
    max_council_members: 5,
    real_people_voices: true,
    custom_members: true,
    premium_models: true,
  },
};

export function getLimitsForPlan(plan: string): PlanLimits {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
}

/** Get the user's active plan, checking expiry. */
export async function getActivePlan(supabase: SupabaseClient, jscUserId: string): Promise<string> {
  const { data: sub } = await supabase
    .from('jsc_subscriptions')
    .select('plan, expires_at, status')
    .eq('user_id', jscUserId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!sub) return 'free';

  // Check if expired
  if (sub.expires_at && new Date(sub.expires_at) < new Date()) {
    // Mark as expired in DB
    await supabase
      .from('jsc_subscriptions')
      .update({ status: 'expired' })
      .eq('user_id', jscUserId)
      .eq('status', 'active');
    await supabase
      .from('jsc_users')
      .update({ plan: 'free' })
      .eq('id', jscUserId);
    return 'free';
  }

  return sub.plan;
}

/** Get sessions used this month. */
export async function getSessionsUsedThisMonth(supabase: SupabaseClient, jscUserId: string): Promise<number> {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from('jsc_sessions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', jscUserId)
    .gte('started_at', monthStart.toISOString());

  return count || 0;
}

/** Check if user can start a new session. Returns { ok, reason? } */
export async function canStartSession(
  supabase: SupabaseClient,
  jscUserId: string
): Promise<{ ok: boolean; reason?: string }> {
  const plan = await getActivePlan(supabase, jscUserId);
  const limits = getLimitsForPlan(plan);

  if (limits.sessions_per_month === null) return { ok: true };

  const used = await getSessionsUsedThisMonth(supabase, jscUserId);
  if (used >= limits.sessions_per_month) {
    return { ok: false, reason: `You've used all ${limits.sessions_per_month} sessions this month. Upgrade for unlimited sessions.` };
  }

  return { ok: true };
}

/** Check if user can use a specific member. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function canUseMember(
  plan: string,
  member: Record<string, any>
): { ok: boolean; reason?: string } {
  const limits = getLimitsForPlan(plan);

  if (member.founders_circle && plan !== 'founders_circle') {
    return { ok: false, reason: "This member is exclusive to the Founder's Circle plan." };
  }
  if (member.real && !limits.real_people_voices) {
    return { ok: false, reason: 'Real people voices require a paid plan.' };
  }

  return { ok: true };
}
