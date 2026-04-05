import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateSessionSummary } from '@/lib/council/summarize';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sessionId } = await request.json();
  if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });

  // Get user profile
  const { data: jscUser } = await supabase
    .from('jsc_users')
    .select('id, name')
    .eq('auth_user_id', user.id)
    .single();
  if (!jscUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Get session
  const { data: session } = await supabase
    .from('jsc_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', jscUser.id)
    .single();
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  // Get messages
  const { data: messages } = await supabase
    .from('jsc_messages')
    .select('role, content, member_name')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (!messages?.length) return NextResponse.json({ error: 'No messages' }, { status: 400 });

  // Get commitments for this session
  const { data: commitments } = await supabase
    .from('jsc_commitments')
    .select('text')
    .eq('session_id', sessionId);

  // Determine session number from past sessions
  const { count } = await supabase
    .from('jsc_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', jscUser.id)
    .lt('started_at', session.started_at);

  const sessionNumber = count || 0;

  // Generate summary
  const summary = await generateSessionSummary(OPENAI_API_KEY, {
    sessionNumber,
    userName: jscUser.name || 'Friend',
    messages: messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
      memberName: m.member_name,
    })),
    commitments: (commitments || []).map(c => c.text),
  });

  // Save to session
  await supabase
    .from('jsc_sessions')
    .update({ summary })
    .eq('id', sessionId);

  return NextResponse.json({ summary });
}
