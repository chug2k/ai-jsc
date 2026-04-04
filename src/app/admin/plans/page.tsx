import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';
import { redirect } from 'next/navigation';
import PlanEditor from './editor';

export default async function AdminPlansPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) redirect('/');

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
              Plans Editor
            </h1>
            <p style={{ fontSize: 13, color: '#6B7280' }}>Edit pricing, names, and feature flags. Changes go live immediately.</p>
          </div>
          <a href="/admin" style={{ fontSize: 13, color: '#6B7280' }}>← Back to dashboard</a>
        </div>
        <PlanEditor />
      </div>
    </div>
  );
}
