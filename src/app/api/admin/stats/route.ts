import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';

export async function GET() {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isAdmin(user.email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const admin = await createAdminClient();

  // Run all queries in parallel
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    usersResult,
    plansResult,
    sessionsWeekResult,
    sessionsAllResult,
    commitmentsResult,
    paymentsResult,
    revenueResult,
  ] = await Promise.all([
    // Total users
    admin.from('jsc_users').select('id', { count: 'exact', head: true }),
    // Plan distribution
    admin.from('jsc_users').select('plan'),
    // Sessions this week
    admin.from('jsc_sessions').select('id', { count: 'exact', head: true }).gte('started_at', weekAgo),
    // Sessions all time
    admin.from('jsc_sessions').select('id', { count: 'exact', head: true }),
    // Commitments (done vs total)
    admin.from('jsc_commitments').select('done'),
    // Payments this month
    admin.from('jsc_payments').select('amount_cents, type').gte('created_at', monthStart),
    // Revenue all time
    admin.from('jsc_payments').select('amount_cents, type'),
  ]);

  // Calculate plan distribution
  const planCounts: Record<string, number> = {};
  (plansResult.data || []).forEach((u: { plan: string }) => {
    planCounts[u.plan] = (planCounts[u.plan] || 0) + 1;
  });

  // Calculate commitments
  const commitments = commitmentsResult.data || [];
  const commitmentsDone = commitments.filter((c: { done: boolean }) => c.done).length;

  // Calculate revenue
  const revenueThisMonth = (paymentsResult.data || [])
    .filter((p: { type: string }) => p.type === 'charge')
    .reduce((sum: number, p: { amount_cents: number }) => sum + p.amount_cents, 0);

  const revenueAllTime = (revenueResult.data || [])
    .filter((p: { type: string }) => p.type === 'charge')
    .reduce((sum: number, p: { amount_cents: number }) => sum + p.amount_cents, 0);

  const refundsAllTime = (revenueResult.data || [])
    .filter((p: { type: string }) => p.type === 'refund')
    .reduce((sum: number, p: { amount_cents: number }) => sum + p.amount_cents, 0);

  return NextResponse.json({
    generated_at: now.toISOString(),
    users: {
      total: usersResult.count || 0,
      by_plan: planCounts,
    },
    sessions: {
      this_week: sessionsWeekResult.count || 0,
      all_time: sessionsAllResult.count || 0,
    },
    commitments: {
      total: commitments.length,
      done: commitmentsDone,
      completion_rate: commitments.length ? Math.round((commitmentsDone / commitments.length) * 100) + '%' : 'N/A',
    },
    revenue: {
      this_month: `$${(revenueThisMonth / 100).toFixed(2)}`,
      all_time: `$${(revenueAllTime / 100).toFixed(2)}`,
      refunds_all_time: `$${(refundsAllTime / 100).toFixed(2)}`,
      net: `$${((revenueAllTime - refundsAllTime) / 100).toFixed(2)}`,
    },
  });
}
