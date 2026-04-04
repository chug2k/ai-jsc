import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiRoute } from '@/lib/dal';

export async function GET() {
  const auth = await authenticateApiRoute();
  if ('error' in auth) return auth.error;
  const { supabase, jscUser } = auth;

  const { data } = await supabase
    .from('jsc_council_configs')
    .select('*')
    .eq('user_id', jscUser.id)
    .single();

  return NextResponse.json(data || { selected_ids: ['facilitator', 'strategist', 'operator'], custom_members: [] });
}

export async function PUT(request: NextRequest) {
  const auth = await authenticateApiRoute();
  if ('error' in auth) return auth.error;
  const { supabase, jscUser } = auth;

  const body = await request.json();

  const { data, error } = await supabase
    .from('jsc_council_configs')
    .upsert({
      user_id: jscUser.id,
      selected_ids: body.selectedIds,
      custom_members: body.customMembers || [],
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
