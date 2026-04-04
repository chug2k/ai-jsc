'use client';

import { useState, useRef } from 'react';
import { useSessionStore } from '@/stores/session-store';
import { PHASE_LABELS, PHASE_HINTS } from '@/lib/council/phases';

export default function ChatInput() {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { currentSession, isLoading, sendMessage } = useSessionStore();

  const phase = currentSession?.phase || 'checkin';
  const hint = (PHASE_HINTS as Record<string, { placeholder: string; chips: string[] }>)[phase] || PHASE_HINTS.checkin;

  const handleSend = () => {
    if (!text.trim() || isLoading) return;
    sendMessage(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t p-3 flex-shrink-0" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
      {/* Phase bar */}
      <div className="flex items-center gap-2 mb-2">
        <span className="phase-pill">
          {(PHASE_LABELS as Record<string, string>)[phase] || phase}
        </span>
        {phase === 'hot_seat' && currentSession?.hotSeatReady && (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>← all members speak</span>
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

      {/* Input */}
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
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
