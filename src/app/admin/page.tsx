import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) redirect('/');

  return <AdminDashboard />;
}

async function AdminDashboard() {
  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
              Admin
            </h1>
            <p style={{ fontSize: 13, color: '#6B7280' }}>jobsearch.quest dashboard</p>
          </div>
          <a href="/app" style={{ fontSize: 13, color: '#6B7280' }}>← Back to app</a>
        </div>
        <AdminStats />
      </div>
    </div>
  );
}

async function AdminStats() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

  // Fetch stats from our own API (server-side, with cookies forwarded)
  // We can't easily call our own route handler from a Server Component,
  // so just query Supabase directly here
  const { createAdminClient } = await import('@/lib/supabase/server');
  const admin = await createAdminClient();

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();

  const [users, plans, sessionsWeek, sessionsAll, commitments, payments] = await Promise.all([
    admin.from('jsc_users').select('id', { count: 'exact', head: true }),
    admin.from('jsc_users').select('plan'),
    admin.from('jsc_sessions').select('id', { count: 'exact', head: true }).gte('started_at', weekAgo),
    admin.from('jsc_sessions').select('id', { count: 'exact', head: true }),
    admin.from('jsc_commitments').select('done'),
    admin.from('jsc_payments').select('amount_cents, type'),
  ]);

  const planCounts: Record<string, number> = {};
  (plans.data || []).forEach((u: { plan: string }) => { planCounts[u.plan] = (planCounts[u.plan] || 0) + 1; });

  const allCommitments = commitments.data || [];
  const doneCount = allCommitments.filter((c: { done: boolean }) => c.done).length;

  const charges = (payments.data || []).filter((p: { type: string }) => p.type === 'charge');
  const revenue = charges.reduce((s: number, p: { amount_cents: number }) => s + p.amount_cents, 0);

  const stats = [
    { label: 'Total Users', value: users.count || 0 },
    { label: 'Sessions (this week)', value: sessionsWeek.count || 0 },
    { label: 'Sessions (all time)', value: sessionsAll.count || 0 },
    { label: 'Commitments', value: `${doneCount}/${allCommitments.length} done` },
    { label: 'Revenue (net)', value: `$${(revenue / 100).toFixed(2)}` },
  ];

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 4, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-pt-mono)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-montserrat)', letterSpacing: '-0.02em' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 4, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-pt-mono)', marginBottom: 8 }}>Users by Plan</div>
        {Object.entries(planCounts).map(([plan, count]) => (
          <div key={plan} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 14, borderBottom: '1px solid #F3F4F6' }}>
            <span>{plan}</span>
            <span style={{ fontWeight: 600 }}>{count}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'var(--font-pt-mono)' }}>
        Generated {now.toISOString()} · <a href="/api/admin/stats" style={{ color: '#3B82F6' }}>JSON endpoint →</a> · <a href="/admin/marketing" style={{ color: '#3B82F6' }}>Marketing agent →</a>
      </p>
    </>
  );
}
