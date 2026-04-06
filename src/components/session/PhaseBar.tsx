'use client';

import { useSessionStore } from '@/stores/session-store';
import { PHASE_ORDER, PHASE_LABELS } from '@/lib/council/phases';

export default function PhaseBar() {
  const phase = useSessionStore(s => s.currentSession?.phase);
  const advancePhase = useSessionStore(s => s.advancePhase);
  const isLoading = useSessionStore(s => s.isLoading);

  if (!phase) return null;

  const currentIdx = PHASE_ORDER.indexOf(phase);
  const visiblePhases = PHASE_ORDER.filter(p => p !== 'done');

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      padding: '0.5rem 1rem',
      borderBottom: '1px solid var(--border)',
      background: 'var(--surface)',
      fontSize: '0.75rem',
    }}>
      {visiblePhases.map((p) => {
        const idx = PHASE_ORDER.indexOf(p);
        const isCurrent = p === phase;
        const isPast = idx < currentIdx;
        const isNext = idx === currentIdx + 1;

        return (
          <button
            key={p}
            onClick={() => {
              if (isNext && !isLoading) advancePhase();
            }}
            disabled={!isNext || isLoading}
            style={{
              flex: 1,
              padding: '0.375rem 0.5rem',
              border: 'none',
              borderRadius: '4px',
              cursor: isNext ? 'pointer' : 'default',
              fontFamily: 'inherit',
              fontSize: '0.7rem',
              fontWeight: isCurrent ? 700 : 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.15s',
              background: isCurrent
                ? 'var(--accent)'
                : isPast
                  ? 'var(--accent-dim)'
                  : 'transparent',
              color: isCurrent
                ? 'white'
                : isPast
                  ? 'var(--accent)'
                  : 'var(--muted)',
            }}
            title={isNext ? `Advance to ${PHASE_LABELS[p]}` : PHASE_LABELS[p]}
          >
            {isPast ? '\u2713 ' : ''}{PHASE_LABELS[p]}
            {isNext && !isLoading && (
              <span style={{ marginLeft: '4px', opacity: 0.6 }}>&rarr;</span>
            )}
          </button>
        );
      })}
      {phase === 'done' && (
        <div style={{
          flex: 1,
          padding: '0.375rem 0.5rem',
          textAlign: 'center',
          fontWeight: 700,
          color: 'var(--accent)',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Session Complete
        </div>
      )}
    </div>
  );
}
