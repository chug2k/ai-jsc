'use client';

import { useState, useRef, useMemo } from 'react';
import { useSessionStore, allMembers, memberById } from '@/stores/session-store';
import { PHASE_LABELS, PHASE_HINTS } from '@/lib/council/phases';

export default function ChatInput() {
  const [text, setText] = useState('');
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { currentSession, isLoading, sendMessage, customMembers } = useSessionStore();

  const phase = currentSession?.phase || 'checkin';
  const hint = (PHASE_HINTS as Record<string, { placeholder: string; chips: string[] }>)[phase] || PHASE_HINTS.checkin;

  // Get active members for @mention
  const activeMembers = useMemo(() => {
    if (!currentSession) return [];
    return currentSession.memberIds
      .map(id => memberById(id, customMembers))
      .filter(Boolean) as { id: string; name: string; emoji: string; color: string; role: string }[];
  }, [currentSession?.memberIds, customMembers]);

  // Filter members by mention query
  const mentionResults = useMemo(() => {
    if (mentionQuery === null) return [];
    if (mentionQuery === '') return activeMembers;
    const q = mentionQuery.toLowerCase();
    return activeMembers.filter(m =>
      m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)
    );
  }, [mentionQuery, activeMembers]);

  const handleSend = () => {
    if (!text.trim() || isLoading) return;
    sendMessage(text.trim());
    setText('');
    setMentionQuery(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);

    // Detect @mention
    const cursorPos = e.target.selectionStart;
    const beforeCursor = val.substring(0, cursorPos);
    const atMatch = beforeCursor.match(/@(\w*)$/);
    if (atMatch) {
      setMentionQuery(atMatch[1]);
      setMentionIndex(0);
    } else {
      setMentionQuery(null);
    }
  };

  const insertMention = (member: { name: string }) => {
    const cursorPos = textareaRef.current?.selectionStart || text.length;
    const beforeCursor = text.substring(0, cursorPos);
    const afterCursor = text.substring(cursorPos);
    const atPos = beforeCursor.lastIndexOf('@');
    const newText = beforeCursor.substring(0, atPos) + '@' + member.name + ' ' + afterCursor;
    setText(newText);
    setMentionQuery(null);

    // Focus back
    setTimeout(() => {
      const pos = atPos + member.name.length + 2;
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(pos, pos);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle mention navigation
    if (mentionQuery !== null && mentionResults.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMentionIndex(i => Math.min(i + 1, mentionResults.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMentionIndex(i => Math.max(i - 1, 0));
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertMention(mentionResults[mentionIndex]);
        return;
      }
      if (e.key === 'Escape') {
        setMentionQuery(null);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t p-3 flex-shrink-0" style={{ borderColor: 'var(--border)', background: 'var(--surface)', position: 'relative' }}>
      {/* Phase bar */}
      <div className="flex items-center gap-2 mb-2">
        <span className="phase-pill">
          {(PHASE_LABELS as Record<string, string>)[phase] || phase}
        </span>
        {phase === 'hot_seat' && (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>← council weighs in</span>
        )}
      </div>

      {/* Quick reply chips */}
      {hint.chips?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {hint.chips.map((chip: string) => (
            <button key={chip} onClick={() => { setText(chip); }} className="chip">
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* @mention dropdown */}
      {mentionQuery !== null && mentionResults.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: 12,
          right: 12,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '0.5rem',
          boxShadow: 'var(--paper-shadow-lg)',
          maxHeight: 200,
          overflowY: 'auto',
          zIndex: 10,
        }}>
          {mentionResults.map((m, i) => (
            <button
              key={m.id}
              onClick={() => insertMention(m)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                background: i === mentionIndex ? 'var(--surface-hover)' : 'transparent',
                color: 'var(--text)',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
              }}
            >
              <span>{m.emoji}</span>
              <span style={{ fontWeight: 600, color: m.color }}>{m.name}</span>
              <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{m.role}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={hint.placeholder}
          rows={2}
          className="flex-1 resize-none"
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            fontSize: '1rem',
            fontFamily: 'inherit',
            minHeight: '48px',
          }}
          aria-label="Your message"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !text.trim()}
          className="btn btn-primary self-end"
          style={{ opacity: isLoading || !text.trim() ? 0.5 : 1, minWidth: 44, minHeight: 44, fontSize: '1.125rem' }}
          aria-label="Send"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
