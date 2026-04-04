import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let { data: jscUser } = await supabase
    .from('jsc_users')
    .select('*, jsc_council_configs(*), jsc_subscriptions(*)')
    .eq('auth_user_id', user.id)
    .single();

  // Auto-create jsc_users row if trigger didn't fire (e.g. user existed before migration)
  if (!jscUser) {
    const { data: newUser } = await supabase
      .from('jsc_users')
      .insert({
        auth_user_id: user.id,
        client_id: crypto.randomUUID(),
        name: user.user_metadata?.full_name || 'Friend',
      })
      .select('*, jsc_council_configs(*), jsc_subscriptions(*)')
      .single();
    jscUser = newUser;
    if (!jscUser) return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }

  // Get plan limits + usage in parallel
  const plan = jscUser.jsc_subscriptions?.[0]?.plan || jscUser.plan || 'free';
  const periodStart = new Date();
  periodStart.setDate(1);
  const period = periodStart.toISOString().split('T')[0];

  const [limitsResult, usageResult] = await Promise.all([
    supabase.from('jsc_plan_limits').select('*').eq('plan', plan).single(),
    supabase.from('jsc_usage').select('*').eq('user_id', jscUser.id).eq('period_start', period).single(),
  ]);

  return NextResponse.json({
    user: jscUser,
    plan,
    limits: limitsResult.data,
    usage: usageResult.data || { sessions_used: 0 },
    authUser: { email: user.email, name: user.user_metadata?.full_name },
  });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const allowed = ['name', 'search_status', 'context'];
  const fields: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) fields[key] = body[key];
  }

  const { data, error } = await supabase
    .from('jsc_users')
    .update(fields)
    .eq('auth_user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
