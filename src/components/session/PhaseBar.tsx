'use client';

import { useSessionStore } from '@/stores/session-store';
import { PHASE_ORDER, PHASE_LABELS } from '@/lib/council/phases';

export default function PhaseBar() {
  const { currentSession, advancePhase, isLoading } = useSessionStore();
  if (!currentSession) return null;

  const currentIdx = PHASE_ORDER.indexOf(currentSession.phase);
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
      {visiblePhases.map((phase, i) => {
        const idx = PHASE_ORDER.indexOf(phase);
        const isCurrent = phase === currentSession.phase;
        const isPast = idx < currentIdx;
        const isNext = idx === currentIdx + 1;

        return (
          <button
            key={phase}
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
              opacity: isNext ? 1 : undefined,
            }}
            title={isNext ? `Advance to ${PHASE_LABELS[phase]}` : PHASE_LABELS[phase]}
          >
            {isPast ? '\u2713 ' : ''}{PHASE_LABELS[phase]}
            {isNext && !isLoading && (
              <span style={{ marginLeft: '4px', opacity: 0.6 }}>&rarr;</span>
            )}
          </button>
        );
      })}
      {currentSession.phase === 'done' && (
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
