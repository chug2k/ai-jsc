import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiRoute } from '@/lib/dal';
import { canStartSession, getActivePlan, getLimitsForPlan, canUseMember } from '@/lib/subscriptions';
import { ARCHETYPES, REAL_PEOPLE, FOUNDERS_CIRCLE } from '@/lib/council/roster';

const ALL_MEMBERS = [...ARCHETYPES, ...REAL_PEOPLE, ...FOUNDERS_CIRCLE];

export async function GET() {
  const auth = await authenticateApiRoute();
  if ('error' in auth) return auth.error;
  const { supabase, jscUser } = auth;

  const { data } = await supabase
    .from('jsc_sessions')
    .select('*')
    .eq('user_id', jscUser.id)
    .order('started_at', { ascending: false })
    .limit(10);

  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const auth = await authenticateApiRoute();
  if ('error' in auth) return auth.error;
  const { supabase, jscUser } = auth;

  // Enforce session limit
  const sessionCheck = await canStartSession(supabase, jscUser.id);
  if (!sessionCheck.ok) {
    return NextResponse.json({ error: sessionCheck.reason }, { status: 403 });
  }

  const body = await request.json();
  const memberIds: string[] = body.memberIds || [];

  // Enforce plan limits on members
  const plan = await getActivePlan(supabase, jscUser.id);
  const limits = getLimitsForPlan(plan);

  if (memberIds.length > limits.max_council_members) {
    return NextResponse.json({ error: `Your plan allows ${limits.max_council_members} council members.` }, { status: 403 });
  }

  for (const id of memberIds) {
    const member = ALL_MEMBERS.find(m => m.id === id);
    if (member) {
      const check = canUseMember(plan, member);
      if (!check.ok) return NextResponse.json({ error: check.reason }, { status: 403 });
    }
  }

  const { data, error } = await supabase
    .from('jsc_sessions')
    .insert({
      user_id: jscUser.id,
      member_ids: memberIds,
      phase: 'checkin',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
