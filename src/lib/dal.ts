import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

/** Verify the current session. Redirects to sign-in if not authenticated. (Server Components only) */
export const verifySession = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/signin');
  return user;
});

/** Get the JSC user record for the authenticated user. (Server Components only) */
export async function getJscUser() {
  const user = await verifySession();
  const supabase = await createClient();
  const { data } = await supabase
    .from('jsc_users')
    .select('*')
    .eq('auth_user_id', user.id)
    .single();
  return data;
}

/**
 * Authenticate and get the JSC user in an API route.
 * Returns { supabase, authUser, jscUser } or a NextResponse error.
 */
export async function authenticateApiRoute() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  let { data: jscUser } = await supabase
    .from('jsc_users')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  // Auto-create if missing (user existed before auth migration)
  if (!jscUser) {
    const { data: newUser } = await supabase
      .from('jsc_users')
      .insert({
        auth_user_id: user.id,
        client_id: crypto.randomUUID(),
        name: user.user_metadata?.full_name || 'Friend',
      })
      .select('id')
      .single();
    jscUser = newUser;
    if (!jscUser) {
      return { error: NextResponse.json({ error: 'Failed to create user' }, { status: 500 }) };
    }
  }

  return { supabase, authUser: user, jscUser };
}
