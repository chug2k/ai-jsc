'use client';

import { useState, useRef, useMemo, useCallback } from 'react';
import { useSessionStore, memberById } from '@/stores/session-store';
import { PHASE_LABELS, PHASE_HINTS } from '@/lib/council/phases';

export interface ReplyTarget {
  memberName: string | null;
  content: string;
  index: number;
}

export default function ChatInput({ replyTo, onClearReply }: { replyTo?: ReplyTarget | null; onClearReply?: () => void }) {
  const [text, setText] = useState('');
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const { currentSession, isLoading, sendMessage, customMembers } = useSessionStore();

  const phase = currentSession?.phase || 'checkin';
  const hint = (PHASE_HINTS as Record<string, { placeholder: string; chips: string[] }>)[phase] || PHASE_HINTS.checkin;

  const activeMembers = useMemo(() => {
    if (!currentSession) return [];
    return currentSession.memberIds
      .map(id => memberById(id, customMembers))
      .filter(Boolean) as { id: string; name: string; emoji: string; color: string; role: string }[];
  }, [currentSession?.memberIds, customMembers]);

  // Build regex for matching @mentions
  const mentionRegex = useMemo(() => {
    if (activeMembers.length === 0) return null;
    const names = activeMembers.map(m => m.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    return new RegExp(`(@(?:${names.join('|')}))`, 'g');
  }, [activeMembers]);

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
    sendMessage(text.trim(), replyTo);
    setText('');
    setMentionQuery(null);
    onClearReply?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    syncScroll();

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
    setTimeout(() => {
      const pos = atPos + member.name.length + 2;
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(pos, pos);
    }, 0);
  };

  // Atomic backspace: delete entire @mention when backspacing into one
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mentionQuery !== null && mentionResults.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setMentionIndex(i => Math.min(i + 1, mentionResults.length - 1)); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setMentionIndex(i => Math.max(i - 1, 0)); return; }
      if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); insertMention(mentionResults[mentionIndex]); return; }
      if (e.key === 'Escape') { setMentionQuery(null); return; }
    }

    if (e.key === 'Backspace' && mentionRegex) {
      const cursorPos = e.currentTarget.selectionStart;
      const selEnd = e.currentTarget.selectionEnd;
      if (cursorPos === selEnd && cursorPos > 0) {
        // Check if cursor is right after or inside a mention
        const beforeCursor = text.substring(0, cursorPos);
        for (const m of activeMembers) {
          const mention = '@' + m.name;
          if (beforeCursor.endsWith(mention) || beforeCursor.endsWith(mention + ' ')) {
            e.preventDefault();
            const start = beforeCursor.lastIndexOf(mention);
            const end = start + mention.length + (text[start + mention.length] === ' ' ? 1 : 0);
            const newText = text.substring(0, start) + text.substring(end);
            setText(newText);
            setTimeout(() => {
              textareaRef.current?.setSelectionRange(start, start);
            }, 0);
            return;
          }
        }
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const syncScroll = useCallback(() => {
    if (highlightRef.current && textareaRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  // Render text with highlighted mentions
  const renderHighlightedText = () => {
    if (!mentionRegex) return text + '\n';
    const parts = text.split(mentionRegex);
    return parts.map((part, i) => {
      if (part.match(mentionRegex!)) {
        return <mark key={i} style={{ background: '#3B82F622', color: '#3B82F6', borderRadius: 3, padding: '0 2px' }}>{part}</mark>;
      }
      return part;
    }).concat('\n'); // trailing newline to match textarea height
  };

  const replyMember = replyTo?.memberName ? memberById(
    activeMembers.find(m => m.name === replyTo.memberName)?.id || '',
    customMembers
  ) : null;

  return (
    <div className="border-t p-3 flex-shrink-0" style={{ borderColor: 'var(--border)', background: 'var(--surface)', position: 'relative' }}>
      {/* Phase bar */}
      <div className="flex items-center gap-2 mb-2">
        <span className="phase-pill">
          {(PHASE_LABELS as Record<string, string>)[phase] || phase}
        </span>
      </div>

      {/* Quick reply chips */}
      {!replyTo && hint.chips?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {hint.chips.map((chip: string) => (
            <button key={chip} onClick={() => { setText(chip); }} className="chip">
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Reply preview */}
      {replyTo && (
        <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-lg text-xs" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div style={{ borderLeft: `3px solid ${replyMember?.color || 'var(--muted)'}`, paddingLeft: 8, flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, color: replyMember?.color || 'var(--muted)', marginBottom: 2 }}>
              {replyTo.memberName || 'You'}
            </div>
            <div style={{ color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {replyTo.content.substring(0, 120)}
            </div>
          </div>
          <button onClick={onClearReply} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 16, padding: 4 }}>×</button>
        </div>
      )}

      {/* @mention dropdown */}
      {mentionQuery !== null && mentionResults.length > 0 && (
        <div style={{
          position: 'absolute', bottom: '100%', left: 12, right: 12,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '0.5rem', boxShadow: 'var(--paper-shadow-lg)',
          maxHeight: 200, overflowY: 'auto', zIndex: 10,
        }}>
          {mentionResults.map((m, i) => (
            <button key={m.id} onClick={() => insertMention(m)} style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%',
              padding: '8px 12px', border: 'none',
              background: i === mentionIndex ? 'var(--surface-hover)' : 'transparent',
              color: 'var(--text)', fontSize: '0.8125rem', cursor: 'pointer',
              fontFamily: 'inherit', textAlign: 'left',
            }}>
              <span>{m.emoji}</span>
              <span style={{ fontWeight: 600, color: m.color }}>{m.name}</span>
              <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{m.role}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input with highlight overlay */}
      <div className="flex gap-2">
        <div style={{ position: 'relative', flex: 1 }}>
          {/* Highlight layer */}
          <div ref={highlightRef} aria-hidden style={{
            position: 'absolute', inset: 0, padding: '0.75rem',
            fontSize: '1rem', fontFamily: 'inherit', lineHeight: 'inherit',
            whiteSpace: 'pre-wrap', wordWrap: 'break-word',
            color: 'transparent', pointerEvents: 'none', overflow: 'hidden',
          }}>
            {renderHighlightedText()}
          </div>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onScroll={syncScroll}
            placeholder={hint.placeholder}
            rows={2}
            className="resize-none"
            style={{
              width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
              color: 'var(--text)', borderRadius: '0.5rem', padding: '0.75rem',
              fontSize: '1rem', fontFamily: 'inherit', minHeight: '48px',
              position: 'relative', caretColor: 'var(--text)',
            }}
            aria-label="Your message"
          />
        </div>
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
