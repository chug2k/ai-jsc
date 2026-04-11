'use client';

import { useState } from 'react';
import { useSessionStore } from '@/stores/session-store';

const STATUSES = [
  { value: 'slow', label: 'Employed, exploring', emoji: '🟡' },
  { value: 'fast', label: 'Actively searching', emoji: '🔴' },
  { value: 'exploring', label: 'Exploring quietly', emoji: '🟢' },
  { value: 'paused', label: 'Just curious', emoji: '⚫' },
] as const;

export default function Welcome() {
  const { authUser, updateUser } = useSessionStore();
  const [status, setStatus] = useState<string | null>(null);
  const [showContext, setShowContext] = useState(false);
  const [context, setContext] = useState('');
  const [moreContext, setMoreContext] = useState('');
  const [launching, setLaunching] = useState(false);

  const firstName = authUser?.name?.split(' ')[0] || 'there';

  const handleLaunch = async () => {
    if (!status) return;
    setLaunching(true);
    const fullContext = [context.trim(), moreContext.trim()].filter(Boolean).join(' — ');
    await updateUser({
      search_status: status,
      context: fullContext || '',
    });
    useSessionStore.getState().setView('council');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center', padding: '0 1rem' }}>

        {/* Greeting */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</div>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem',
          }}>
            Hey {firstName}.
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
            Your support team is ready.
          </p>
        </div>

        {/* Search status */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9375rem',
            marginBottom: '1rem',
          }}>
            Where are you in the search?
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
          }}>
            {STATUSES.map(s => (
              <button
                key={s.value}
                onClick={() => setStatus(s.value)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: status === s.value ? '2px solid var(--accent)' : '1px solid var(--border)',
                  background: status === s.value ? 'var(--accent-dim)' : 'var(--surface)',
                  color: status === s.value ? 'var(--text)' : 'var(--text-secondary)',
                  fontSize: '0.8125rem',
                  fontWeight: status === s.value ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>{s.emoji}</span> {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* LinkedIn headline */}
        {status && (
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <input
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="Your LinkedIn headline (e.g. Senior PM at Chase | Ex-Spotify)"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: '0.8125rem',
                fontFamily: 'inherit',
              }}
            />
            <p style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: '0.375rem' }}>
              Helps your advisors understand your background. Optional.
            </p>
          </div>
        )}

        {/* More context */}
        {status && !showContext ? (
          <button
            onClick={() => setShowContext(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-tertiary)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              marginBottom: '1.5rem',
              fontFamily: 'inherit',
              padding: '0.25rem',
            }}
          >
            + Add more context about your situation
          </button>
        ) : status ? (
          <div style={{ marginBottom: '1.5rem' }}>
            <textarea
              value={moreContext}
              onChange={e => setMoreContext(e.target.value)}
              placeholder="e.g. Want to move to tech but worried about qualifications. Tend to overthink decisions."
              rows={2}
              autoFocus
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: '0.8125rem',
                fontFamily: 'inherit',
                resize: 'none',
                lineHeight: 1.5,
              }}
            />
            <p style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: '0.375rem' }}>
              This helps your advisors give you better, more specific advice.
            </p>
          </div>
        ) : null}

        {/* Launch */}
        <button
          onClick={handleLaunch}
          disabled={!status || launching}
          style={{
            width: '100%',
            padding: '0.875rem',
            borderRadius: '0.75rem',
            border: 'none',
            background: status ? 'var(--accent)' : 'var(--border)',
            color: status ? '#fff' : 'var(--muted)',
            fontSize: '0.9375rem',
            fontWeight: 600,
            cursor: status && !launching ? 'pointer' : 'default',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
            opacity: launching ? 0.7 : 1,
          }}
        >
          {launching ? 'Setting up...' : 'Meet Your Team →'}
        </button>

        {!status && (
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.6875rem', marginTop: '0.75rem' }}>
            Pick a status to continue
          </p>
        )}
      </div>
    </div>
  );
}
