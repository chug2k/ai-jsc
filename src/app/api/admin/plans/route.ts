import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const admin = await createAdminClient();
  const { data } = await admin
    .from('jsc_plan_limits')
    .select('*')
    .order('sort_order', { ascending: true });

  return NextResponse.json(data || []);
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const { plan, ...fields } = body;
  if (!plan) return NextResponse.json({ error: 'Missing plan' }, { status: 400 });

  const admin = await createAdminClient();
  const { data, error } = await admin
    .from('jsc_plan_limits')
    .update(fields)
    .eq('plan', plan)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
