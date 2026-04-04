'use client';

import type { Member } from '@/stores/session-store';
import { useSessionStore } from '@/stores/session-store';

export default function MemberCard({ member }: { member: Member }) {
  const { selectedIds, toggleMember } = useSessionStore();
  const selected = selectedIds.includes(member.id);
  const isModerator = member.moderator;

  return (
    <div
      className={`member-card card ${selected ? 'selected' : ''}`}
      style={{ '--member-color': member.color, opacity: isModerator ? 1 : undefined } as React.CSSProperties}
      onClick={() => !isModerator && toggleMember(member.id)}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xl">{member.emoji}</span>
          <div className="font-semibold text-sm mt-1">{member.name}</div>
          <div className="text-xs" style={{ color: member.color }}>
            {member.role}
            {isModerator && <span style={{ color: 'var(--muted)', fontWeight: 400 }}> · always in session</span>}
          </div>
        </div>
        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1"
          style={{
            borderColor: member.color,
            background: selected ? member.color : 'transparent',
            cursor: isModerator ? 'default' : 'pointer',
          }}>
          {selected && <span style={{ color: '#fff', fontSize: '10px' }}>✓</span>}
        </div>
      </div>
      <div className="text-xs leading-relaxed mt-2" style={{ color: 'var(--muted)' }}>{member.challenge}</div>
      <div className="text-xs mt-2 italic" style={{ color: 'var(--muted)' }}>Voice: {member.voice}</div>
    </div>
  );
}
