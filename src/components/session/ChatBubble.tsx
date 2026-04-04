'use client';

import type { Member, Message } from '@/stores/session-store';
import { allMembers } from '@/stores/session-store';
import { useSessionStore } from '@/stores/session-store';
import { stripCommitmentBlock, hasCommitmentBlock } from '@/lib/commitments';

function fmt(text: string) {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br/>');
}

export default function ChatBubble({ message }: { message: Message }) {
  const { customMembers, user } = useSessionStore();
  const members = allMembers(customMembers);

  // Parse member from [Name] prefix
  let member: Member | undefined;
  let displayText = message.content;

  if (message.role === 'assistant') {
    const match = message.content.match(/^\[(.+?)\] ([\s\S]*)$/);
    if (match) {
      member = members.find(m => m.name === match[1]);
      displayText = match[2];
    }
    displayText = stripCommitmentBlock(displayText);
    if (hasCommitmentBlock(message.content)) {
      displayText += '\n\n✅ Commitments saved.';
    }
  }

  if (message.role === 'user') {
    const initial = (user?.name || 'You')[0].toUpperCase();
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 justify-end">
          <div className="chat-bubble chat-bubble-user max-w-[85%] sm:max-w-lg"
            dangerouslySetInnerHTML={{ __html: fmt(displayText) }} />
          <div className="avatar mono text-xs mt-0.5"
            style={{ background: 'var(--surface-hover)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
            {initial}
          </div>
        </div>
      </div>
    );
  }

  const color = member?.color || 'var(--accent)';
  const emoji = member?.emoji || '🥔';

  return (
    <div className="max-w-4xl mx-auto">
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
            </div>
          )}
          <div className="chat-bubble chat-bubble-ai"
            style={{ borderLeft: `3px solid ${color}` }}
            dangerouslySetInnerHTML={{ __html: fmt(displayText) }} />
        </div>
      </div>
    </div>
  );
}
