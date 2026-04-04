'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useSessionStore } from '@/stores/session-store';
import { getSessionTheme } from '@/lib/council/phases';
import ChatBubble from './ChatBubble';
import ChatInput, { type ReplyTarget } from './ChatInput';
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
  const [replyTo, setReplyTo] = useState<ReplyTarget | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages.length, isLoading]);

  const handleReply = useCallback((index: number) => {
    const msg = currentSession?.messages[index];
    if (!msg) return;
    setReplyTo({
      memberName: msg.memberName || null,
      content: msg.content.replace(/^\[.*?\]\s*/g, ''),
      index,
    });
  }, [currentSession?.messages]);

  if (!currentSession) return null;

  const handleScrollTo = useCallback((index: number) => {
    const el = document.getElementById(`msg-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.background = 'var(--accent-dim)';
      setTimeout(() => { el.style.background = ''; }, 1500);
    }
  }, []);

  const visibleMessages = currentSession.messages.filter(m => m.content !== 'Begin the JSC session.');

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ scrollBehavior: 'smooth' }}>
          <SessionAgendaBanner sessionNumber={currentSession.sessionNumber} />
          {visibleMessages.map((msg, i) => (
            <div key={i} id={`msg-${i}`} style={{ transition: 'background 0.3s', borderRadius: '0.75rem' }}>
              <ChatBubble message={msg} index={i} onReply={handleReply} onScrollTo={handleScrollTo} />
            </div>
          ))}
          {isLoading && <LoadingDots />}
          <div ref={chatEndRef} />
        </div>
        <ChatInput replyTo={replyTo} onClearReply={() => setReplyTo(null)} />
      </div>
    </div>
  );
}
