'use client';

import ChatBubble from '@/components/session/ChatBubble';
import PhaseBar from '@/components/session/PhaseBar';
import type { Member, Message } from '@/stores/session-store';

export interface SessionPreviewProps {
  scenarioLabel?: string;
  headline?: string;
  phase?: string;
  members: Member[];
  userName: string;
  messages: Message[];
}

/**
 * Landing-page session preview. Renders the real production ChatBubble + PhaseBar
 * with static demo data so the marketing surface always matches the actual app UI.
 */
export default function SessionPreview({
  scenarioLabel,
  headline,
  phase,
  members,
  userName,
  messages,
}: SessionPreviewProps) {
  return (
    <div
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: '0.75rem',
        boxShadow: 'var(--paper-shadow-lg)',
        overflow: 'hidden',
      }}
    >
      {phase && <PhaseBar demoPhase={phase} />}
      {(scenarioLabel || headline) && (
        <div style={{ padding: '1rem 1.25rem 0.5rem' }}>
          {scenarioLabel && (
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.6875rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: '0.25rem',
              }}
            >
              {scenarioLabel}
            </div>
          )}
          {headline && (
            <h3
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--text)',
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              {headline}
            </h3>
          )}
        </div>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          padding: '1rem 1.25rem 1.25rem',
        }}
      >
        {messages.map((msg, i) => (
          <ChatBubble
            key={i}
            message={msg}
            index={i}
            demoMembers={members}
            demoUserName={userName}
            hideControls
          />
        ))}
      </div>
    </div>
  );
}
