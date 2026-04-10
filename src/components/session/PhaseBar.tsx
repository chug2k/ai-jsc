'use client';

import { useSessionStore } from '@/stores/session-store';
import { PHASE_ORDER, PHASE_LABELS } from '@/lib/council/phases';

interface PhaseBarProps {
  /** Override the store-driven phase (landing/demo use). */
  demoPhase?: string;
}

export default function PhaseBar({ demoPhase }: PhaseBarProps = {}) {
  const storePhase = useSessionStore(s => s.currentSession?.phase);
  const phase = demoPhase ?? storePhase;

  if (!phase) return null;

  const currentIdx = PHASE_ORDER.indexOf(phase);
  const visiblePhases = PHASE_ORDER.filter(p => p !== 'done');
  const total = visiblePhases.length;
  const progress = phase === 'done' ? total : currentIdx + 1;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.5rem 1rem',
      borderBottom: '1px solid var(--border)',
      background: 'var(--surface)',
      fontSize: '0.75rem',
    }}>
      <span style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '0.6875rem',
        color: phase === 'done' ? 'var(--accent)' : 'var(--text)',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}>
        {phase === 'done' ? 'Session Complete' : PHASE_LABELS[phase]}
      </span>
      <div style={{
        flex: 1,
        height: '3px',
        background: 'var(--border-light)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${(progress / total) * 100}%`,
          background: 'var(--accent)',
          borderRadius: '2px',
          transition: 'width 0.3s ease',
        }} />
      </div>
      <span style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '0.625rem',
        color: 'var(--muted)',
        whiteSpace: 'nowrap',
      }}>
        {progress} of {total}
      </span>
    </div>
  );
}
