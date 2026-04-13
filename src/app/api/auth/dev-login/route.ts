import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Dev-only auth backdoor. Creates a test user and sets session cookies
 * so the headless browser can access the authenticated app.
 *
 * ONLY works when NODE_ENV === 'development'.
 * GET /api/auth/dev-login → sets auth cookies → redirects to /app
 */
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Dev-only endpoint' }, { status: 403 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const testEmail = 'qa-test@jobsearch.quest';
  const testPassword = 'qa-test-password-dev-only';

  // Find or create the test user
  const { data: existingUsers } = await admin.auth.admin.listUsers();
  let testUser = existingUsers?.users?.find(u => u.email === testEmail);

  if (!testUser) {
    const { data, error } = await admin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: { full_name: 'QA Tester' },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    testUser = data.user;
  }

  // Sign in as the test user to get a session
  const anonClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: signIn, error: signInError } = await anonClient.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (signInError || !signIn.session) {
    return NextResponse.json({ error: signInError?.message || 'No session' }, { status: 500 });
  }

  // Set the Supabase auth cookies so the middleware picks them up
  const cookieStore = await cookies();
  const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
  const cookieName = `sb-${projectRef}-auth-token`;

  cookieStore.set(cookieName, JSON.stringify({
    access_token: signIn.session.access_token,
    refresh_token: signIn.session.refresh_token,
    expires_at: signIn.session.expires_at,
    expires_in: signIn.session.expires_in,
    token_type: signIn.session.token_type,
  }), {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
  });

  return NextResponse.redirect(new URL('/app', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'http://localhost:3001' : 'http://localhost:3000'));
}
