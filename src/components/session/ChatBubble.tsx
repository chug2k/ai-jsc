'use client';

import { useState } from 'react';
import type { Member, Message } from '@/stores/session-store';
import { allMembers } from '@/stores/session-store';
import { useSessionStore } from '@/stores/session-store';
import { stripCommitmentBlock, hasCommitmentBlock } from '@/lib/commitments';

function fmt(text: string, members: Member[]) {
  let html = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');

  // Highlight @mentions in blue
  for (const m of members) {
    const escaped = m.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(
      new RegExp(`@${escaped}`, 'g'),
      `<span style="color:#3B82F6;font-weight:600">@${m.name}</span>`
    );
  }

  return html.replace(/\n/g, '<br/>');
}

interface ChatBubbleProps {
  message: Message;
  index: number;
  messageId?: string;
  onReply?: (index: number) => void;
  onScrollTo?: (index: number) => void;
}

export default function ChatBubble({ message, index, messageId, onReply, onScrollTo }: ChatBubbleProps) {
  const { customMembers, user } = useSessionStore();
  const [reaction, setReaction] = useState<'up' | 'down' | null>(null);
  const [reacting, setReacting] = useState(false);

  const handleReaction = async (type: 'up' | 'down') => {
    if (!messageId || reacting) return;
    setReacting(true);
    const newReaction = reaction === type ? null : type;
    setReaction(newReaction);
    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, reaction: type }),
      });
    } catch { /* silent fail */ }
    setReacting(false);
  };
  const members = allMembers(customMembers);

  let member: Member | undefined;
  let displayText = message.content;

  if (message.role === 'assistant') {
    if (message.memberName) {
      member = members.find(m => m.name === message.memberName);
    }
    displayText = displayText.replace(/^\[.*?\]\s*:?\s*/g, '');
    displayText = stripCommitmentBlock(displayText);
    if (hasCommitmentBlock(message.content)) {
      displayText += '\n\n✅ Commitments saved.';
    }
  }

  if (message.role === 'user') {
    const initial = (user?.name || 'You')[0].toUpperCase();
    const replyMember = message.replyTo?.memberName
      ? members.find(m => m.name === message.replyTo!.memberName)
      : null;
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 justify-end">
          <div className="chat-bubble chat-bubble-user max-w-[85%] sm:max-w-lg">
            {message.replyTo && (
              <div
                onClick={() => onScrollTo?.(message.replyTo!.index)}
                style={{
                  borderLeft: `3px solid ${replyMember?.color || 'var(--border)'}`,
                  padding: '4px 8px', marginBottom: 8, fontSize: '0.75rem',
                  color: 'var(--muted)', borderRadius: 2, cursor: 'pointer',
                }}
              >
                <strong style={{ color: replyMember?.color || 'var(--muted)' }}>
                  {message.replyTo.memberName || 'You'}
                </strong>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {message.replyTo.content.substring(0, 120)}
                </div>
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: fmt(displayText, members) }} />
          </div>
          <div className="avatar mono text-xs mt-0.5"
            style={{ background: 'var(--surface-hover)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
            {initial}
          </div>
        </div>
      </div>
    );
  }

  const color = member?.color || 'var(--accent)';
  const emoji = member?.emoji || '💬';

  return (
    <div className="max-w-4xl mx-auto group">
      <div className="flex gap-3">
        <div className="avatar mt-0.5"
          style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          {member && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold" style={{ color }}>{member.name}</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{member.role}</span>
              {onReply && (
                <button
                  onClick={() => onReply(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: 'none', border: 'none', color: 'var(--muted)',
                    cursor: 'pointer', fontSize: '0.6875rem', padding: '0 4px',
                    fontFamily: 'inherit',
                  }}
                >
                  ↩ Reply
                </button>
              )}
            </div>
          )}
          <div className="chat-bubble chat-bubble-ai"
            style={{ borderLeft: `3px solid ${color}` }}
            dangerouslySetInnerHTML={{ __html: fmt(displayText, members) }} />
          <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleReaction('up')}
              className="reaction-btn"
              style={{
                color: reaction === 'up' ? 'var(--accent)' : 'var(--muted)',
                opacity: reaction === 'up' ? 1 : 0.5,
              }}
              title="Helpful"
            >
              <ThumbUp filled={reaction === 'up'} />
            </button>
            <button
              onClick={() => handleReaction('down')}
              className="reaction-btn"
              style={{
                color: reaction === 'down' ? 'var(--danger, #ef4444)' : 'var(--muted)',
                opacity: reaction === 'down' ? 1 : 0.5,
              }}
              title="Not helpful"
            >
              <ThumbDown filled={reaction === 'down'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThumbUp({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 22V11M2 13V20C2 21.1 2.9 22 4 22H17.4C18.7 22 19.8 21.1 20 19.8L21.5 11.8C21.7 10.3 20.5 9 19 9H14V4C14 2.9 13.1 2 12 2L7 11" />
    </svg>
  );
}

function ThumbDown({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 2V13M22 11V4C22 2.9 21.1 2 20 2H6.6C5.3 2 4.2 2.9 4 4.2L2.5 12.2C2.3 13.7 3.5 15 5 15H10V20C10 21.1 10.9 22 12 22L17 13" />
    </svg>
  );
}
