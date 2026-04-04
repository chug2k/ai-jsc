import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiRoute } from '@/lib/dal';

export async function GET() {
  const auth = await authenticateApiRoute();
  if ('error' in auth) return auth.error;
  const { supabase, jscUser } = auth;

  const { data } = await supabase
    .from('jsc_commitments')
    .select('*')
    .eq('user_id', jscUser.id)
    .order('created_at', { ascending: false })
    .limit(20);

  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const auth = await authenticateApiRoute();
  if ('error' in auth) return auth.error;
  const { supabase, jscUser } = auth;

  const body = await request.json();
  const texts: string[] = body.texts || [];

  const rows = texts.map((text: string) => ({
    user_id: jscUser.id,
    session_id: body.sessionId || null,
    text,
  }));

  const { data, error } = await supabase
    .from('jsc_commitments')
    .insert(rows)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const auth = await authenticateApiRoute();
  if ('error' in auth) return auth.error;
  const { supabase } = auth;

  const body = await request.json();
  const { id, done } = body;

  const fields: Record<string, unknown> = { done };
  if (done) fields.completed_at = new Date().toISOString();
  else fields.completed_at = null;

  const { data, error } = await supabase
    .from('jsc_commitments')
    .update(fields)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
