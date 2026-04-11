'use client';

import { useSessionStore, allMembers, memberById } from '@/stores/session-store';

export default function Sidebar() {
  const { currentSession, commitments, pastSessions, customMembers, toggleCommitment, loadSessionHistory } = useSessionStore();

  const members = currentSession
    ? currentSession.memberIds.map(id => memberById(id, customMembers)).filter(Boolean)
    : [];

  return (
    <aside className="sidebar w-56 flex-shrink-0 hidden sm:flex flex-col border-r overflow-y-auto"
      style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>

      {/* Team */}
      <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="section-label mb-2">YOUR TEAM</div>
        <div className="space-y-1.5">
          {members.map(m => m && (
            <div key={m.id} className="flex items-center gap-2 px-2 py-1.5 rounded text-xs"
              style={{ background: `${m.color}11` }}>
              <span>{m.emoji}</span>
              <div>
                <div style={{ color: m.color }}>{m.name}</div>
                <div style={{ color: 'var(--muted)' }}>{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commitments */}
      <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="section-label">COMMITMENTS</div>
          {commitments.length > 0 && (
            <div className="mono text-xs" style={{ color: 'var(--muted)' }}>
              {commitments.filter(c => c.done).length}/{commitments.length}
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          {commitments.length === 0 ? (
            <div className="text-xs" style={{ color: 'var(--muted)', fontStyle: 'italic' }}>None yet.</div>
          ) : (
            commitments.slice(0, 10).map(c => (
              <div
                key={c.id}
                className={`commitment-item ${c.done ? 'done' : ''} rounded px-2 py-1.5 cursor-pointer text-xs leading-tight`}
                style={{ background: 'var(--bg)' }}
                onClick={() => toggleCommitment(c.id)}
              >
                <span style={{ color: c.done ? 'var(--muted)' : 'var(--text)' }}>
                  {c.done ? '✓ ' : '○ '}{c.text}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Past sessions */}
      <div className="p-3">
        <div className="section-label mb-2">PAST SESSIONS</div>
        <div className="space-y-1">
          {pastSessions.length === 0 ? (
            <div className="text-xs" style={{ color: 'var(--muted)', fontStyle: 'italic' }}>None yet.</div>
          ) : (
            pastSessions.slice(0, 5).map(s => {
              const d = new Date(s.started_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return (
                <div key={s.id} className="rounded px-2 py-1.5 cursor-pointer text-xs" style={{ transition: 'background 0.15s' }} onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div className="mono" style={{ color: 'var(--accent)' }}>{d}</div>
                  <div style={{ color: 'var(--muted)' }}>{s.phase || 'done'}</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}
