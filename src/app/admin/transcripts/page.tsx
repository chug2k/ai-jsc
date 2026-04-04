import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin';

export default async function TranscriptsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email || '')) redirect('/');

  const { data: sessions } = await supabase
    .from('jsc_sessions')
    .select(`
      id,
      started_at,
      ended_at,
      phase,
      member_ids,
      jsc_users!inner(name),
      jsc_messages(id, role, content, member_name, created_at)
    `)
    .order('started_at', { ascending: false })
    .limit(20);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Session Transcripts</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>
        <a href="/admin" style={{ color: 'var(--accent)' }}>← Admin</a> · Last 20 sessions
      </p>

      {!sessions?.length && <p style={{ color: 'var(--muted)' }}>No sessions yet.</p>}

      {sessions?.map((session: any) => {
        const messages = (session.jsc_messages || []).sort(
          (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        const userName = session.jsc_users?.name || 'Unknown';
        const date = new Date(session.started_at).toLocaleString();

        return (
          <div key={session.id} style={{
            marginBottom: '2rem', border: '1px solid var(--border)',
            borderRadius: '0.75rem', overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              padding: '0.75rem 1rem', background: 'var(--surface)',
              borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <strong>{userName}</strong>
                <span style={{ color: 'var(--muted)', marginLeft: 8, fontSize: '0.75rem' }}>
                  {date} · {messages.length} messages · Phase: {session.phase}
                </span>
              </div>
              <span style={{
                fontSize: '0.625rem', padding: '2px 6px', borderRadius: 3,
                background: session.phase === 'done' ? '#10b98122' : '#f59e0b22',
                color: session.phase === 'done' ? '#10b981' : '#f59e0b',
                fontFamily: 'monospace', textTransform: 'uppercase',
              }}>
                {session.phase}
              </span>
            </div>

            {/* Messages */}
            <div style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', lineHeight: 1.7 }}>
              {messages.map((msg: any, i: number) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={i} style={{
                    marginBottom: '0.5rem',
                    paddingLeft: isUser ? 0 : '1rem',
                    borderLeft: isUser ? 'none' : '2px solid var(--border)',
                  }}>
                    <span style={{
                      fontWeight: 600,
                      color: isUser ? 'var(--accent)' : '#10b981',
                      fontSize: '0.75rem',
                    }}>
                      {isUser ? userName : (msg.member_name || 'AI')}:
                    </span>{' '}
                    <span style={{ color: 'var(--text)' }}>
                      {msg.content.substring(0, 500)}
                      {msg.content.length > 500 ? '...' : ''}
                    </span>
                  </div>
                );
              })}
              {messages.length === 0 && (
                <div style={{ color: 'var(--muted)', fontStyle: 'italic' }}>No messages</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
