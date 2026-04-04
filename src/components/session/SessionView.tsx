'use client';

import { useRef, useEffect } from 'react';
import { useSessionStore } from '@/stores/session-store';
import { getSessionTheme } from '@/lib/council/phases';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import Sidebar from './Sidebar';

function LoadingDots({ color = 'var(--accent)', emoji = '📋' }: { color?: string; emoji?: string }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex gap-3">
        <div className="avatar" style={{ background: `${color}22`, border: `1px solid ${color}44` }}>{emoji}</div>
        <div className="chat-bubble chat-bubble-ai flex gap-1 items-center">
          <div className="loading-dot w-1.5 h-1.5 rounded-full" style={{ background: color }} />
          <div className="loading-dot w-1.5 h-1.5 rounded-full" style={{ background: color }} />
          <div className="loading-dot w-1.5 h-1.5 rounded-full" style={{ background: color }} />
        </div>
      </div>
    </div>
  );
}

function SessionAgendaBanner({ sessionNumber }: { sessionNumber: number }) {
  const theme = getSessionTheme(sessionNumber);
  return (
    <div className="mx-auto max-w-4xl mb-4">
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '0.75rem',
        padding: '0.875rem 1rem',
        boxShadow: 'var(--paper-shadow)',
      }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="section-label-accent">Session {sessionNumber}</span>
          <span style={{ color: 'var(--text)', fontSize: '0.8125rem', fontWeight: 600 }}>{theme.name}</span>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.75rem', lineHeight: 1.5, margin: 0 }}>
          {theme.description}
        </p>
      </div>
    </div>
  );
}

export default function SessionView() {
  const { currentSession, isLoading } = useSessionStore();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages.length, isLoading]);

  if (!currentSession) return null;

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ scrollBehavior: 'smooth' }}>
          <SessionAgendaBanner sessionNumber={currentSession.sessionNumber} />
          {currentSession.messages
            .filter(m => m.content !== 'Begin the JSC session.')
            .map((msg, i) => (
              <ChatBubble key={i} message={msg} />
            ))}
          {isLoading && <LoadingDots />}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <ChatInput />
      </div>
    </div>
  );
}
