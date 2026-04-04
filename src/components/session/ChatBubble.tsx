'use client';

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
  onReply?: (index: number) => void;
  onScrollTo?: (index: number) => void;
}

export default function ChatBubble({ message, index, onReply, onScrollTo }: ChatBubbleProps) {
  const { customMembers, user } = useSessionStore();
  const members = allMembers(customMembers);

  let member: Member | undefined;
  let displayText = message.content;

  if (message.role === 'assistant') {
    if (message.memberName) {
      member = members.find(m => m.name === message.memberName);
    }
    displayText = displayText.replace(/^\[.*?\]\s*/g, '');
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
        </div>
      </div>
    </div>
  );
}
