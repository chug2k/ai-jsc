import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiRoute } from '@/lib/dal';

export async function GET(request: NextRequest) {
  const auth = await authenticateApiRoute();
  if ('error' in auth) return auth.error;
  const { supabase, jscUser } = auth;

  const sessionId = request.nextUrl.searchParams.get('sessionId');
  if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });

  // Verify session belongs to user
  const { data: session } = await supabase
    .from('jsc_sessions')
    .select('id')
    .eq('id', sessionId)
    .eq('user_id', jscUser.id)
    .single();
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const { data } = await supabase
    .from('jsc_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const auth = await authenticateApiRoute();
  if ('error' in auth) return auth.error;
  const { supabase, jscUser } = auth;

  const body = await request.json();

  // Verify session belongs to user
  const { data: session } = await supabase
    .from('jsc_sessions')
    .select('id')
    .eq('id', body.sessionId)
    .eq('user_id', jscUser.id)
    .single();
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const { data, error } = await supabase
    .from('jsc_messages')
    .insert({
      session_id: body.sessionId,
      role: body.role,
      content: body.content,
      member_name: body.memberName || null,
      phase: body.phase || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
