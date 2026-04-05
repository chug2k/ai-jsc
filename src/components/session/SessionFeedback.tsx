'use client';

import { useState } from 'react';
import { useSessionStore, allMembers } from '@/stores/session-store';

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.25rem',
            color: star <= (hover || value) ? '#f59e0b' : 'var(--border)',
            transition: 'color 0.1s',
            padding: '0 1px',
          }}
        >
          {star <= (hover || value) ? '\u2605' : '\u2606'}
        </button>
      ))}
    </div>
  );
}

export default function SessionFeedback() {
  const { currentSession, customMembers } = useSessionStore();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [overall, setOverall] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!currentSession || currentSession.phase !== 'done') return null;

  const members = allMembers(customMembers);
  const sessionMembers = currentSession.memberIds
    .filter(id => id !== 'facilitator')
    .map(id => members.find(m => m.id === id))
    .filter(Boolean) as typeof members;

  const maude = members.find(m => m.id === 'facilitator');

  const handleSubmit = async () => {
    if (!currentSession.dbId || submitting) return;
    setSubmitting(true);

    const memberRatings = [
      ...(maude && ratings[maude.name] ? [{ memberName: maude.name, rating: ratings[maude.name] }] : []),
      ...sessionMembers
        .filter(m => ratings[m.name])
        .map(m => ({ memberName: m.name, rating: ratings[m.name] })),
    ];

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSession.dbId,
          memberRatings,
          overallRating: overall || undefined,
          comment: comment.trim() || undefined,
        }),
      });
      setSubmitted(true);
    } catch {
      /* silent */
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto my-6">
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Thank you</div>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
            Your feedback helps improve the council experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-6">
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
          How was this session?
        </h3>

        {/* Overall rating */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Overall</span>
            <StarRating value={overall} onChange={setOverall} />
          </div>
        </div>

        {/* Per-member ratings */}
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          Rate each member
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          {maude && (
            <div className="flex items-center justify-between" style={{ padding: '0.375rem 0' }}>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '1rem' }}>{maude.emoji}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: maude.color }}>{maude.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Moderator</span>
              </div>
              <StarRating value={ratings[maude.name] || 0} onChange={(v) => setRatings(r => ({ ...r, [maude.name]: v }))} />
            </div>
          )}
          {sessionMembers.map((m) => (
            <div key={m.id} className="flex items-center justify-between" style={{ padding: '0.375rem 0' }}>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '1rem' }}>{m.emoji}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: m.color }}>{m.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{m.role}</span>
              </div>
              <StarRating value={ratings[m.name] || 0} onChange={(v) => setRatings(r => ({ ...r, [m.name]: v }))} />
            </div>
          ))}
        </div>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Anything you'd like to share about this session? (optional)"
          rows={3}
          style={{
            width: '100%',
            resize: 'vertical',
            fontSize: '0.875rem',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            marginBottom: '1rem',
            fontFamily: 'inherit',
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={submitting || (!overall && Object.keys(ratings).length === 0)}
          className="btn btn-primary"
          style={{ width: '100%' }}
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </div>
  );
}
