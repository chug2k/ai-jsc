import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { messageId, reaction } = await request.json();
  if (!messageId || !['up', 'down'].includes(reaction)) {
    return NextResponse.json({ error: 'Invalid reaction' }, { status: 400 });
  }

  // Get user's jsc_users id
  const { data: jscUser } = await supabase
    .from('jsc_users')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  if (!jscUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Upsert — toggle off if same reaction, switch if different
  const { data: existing } = await supabase
    .from('jsc_message_reactions')
    .select('id, reaction')
    .eq('message_id', messageId)
    .eq('user_id', jscUser.id)
    .single();

  if (existing && existing.reaction === reaction) {
    // Same reaction — remove it (toggle off)
    await supabase.from('jsc_message_reactions').delete().eq('id', existing.id);
    return NextResponse.json({ reaction: null });
  }

  // Upsert the reaction
  const { data, error } = await supabase
    .from('jsc_message_reactions')
    .upsert(
      { message_id: messageId, user_id: jscUser.id, reaction },
      { onConflict: 'message_id,user_id' },
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reaction: data.reaction });
}
