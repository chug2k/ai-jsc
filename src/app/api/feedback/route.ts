import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sessionId, memberRatings, overallRating, comment } = await request.json();
  if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });

  const { data: jscUser } = await supabase
    .from('jsc_users')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  if (!jscUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Save per-member ratings
  if (memberRatings && Array.isArray(memberRatings)) {
    for (const { memberName, rating, comment: memberComment } of memberRatings) {
      if (!memberName || !rating) continue;
      await supabase.from('jsc_session_feedback').upsert(
        {
          session_id: sessionId,
          user_id: jscUser.id,
          member_name: memberName,
          rating,
          comment: memberComment || null,
        },
        { onConflict: 'session_id,user_id,member_name' },
      );
    }
  }

  // Save overall session review
  if (overallRating) {
    await supabase.from('jsc_session_reviews').upsert(
      {
        session_id: sessionId,
        user_id: jscUser.id,
        overall_rating: overallRating,
        comment: comment || null,
      },
      { onConflict: 'session_id,user_id' },
    );
  }

  return NextResponse.json({ ok: true });
}
