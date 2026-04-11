'use client';

import { useState } from 'react';
import { useSessionStore, allMembers } from '@/stores/session-store';
import { ARCHETYPES, REAL_PEOPLE, FOUNDERS_CIRCLE } from '@/lib/council/roster';
import type { Member } from '@/stores/session-store';
import MemberCard from './MemberCard';

export default function CouncilBuilder() {
  const { selectedIds, customMembers, setView, user, error, pastSessions } = useSessionStore();
  const hasUnfinished = pastSessions.some(s => s.phase !== 'done');
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [customVoice, setCustomVoice] = useState('');
  const [customChallenge, setCustomChallenge] = useState('');

  const store = useSessionStore.getState();
  const members = allMembers(customMembers);
  const selected = selectedIds.map(id => members.find(m => m.id === id)).filter(Boolean) as Member[];

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    const colors = ['#818cf8', '#f59e0b', '#22d3ee', '#a3e635', '#e879f9', '#fb923c'];
    store.addCustomMember({
      id: 'custom_' + Date.now(),
      name: customName.trim(),
      role: customRole.trim() || 'Custom Member',
      voice: customVoice.trim() || 'direct',
      challenge: customChallenge.trim() || 'Brings a unique perspective.',
      emoji: '🎭',
      color: colors[customMembers.length % colors.length],
    });
    setCustomName(''); setCustomRole(''); setCustomVoice(''); setCustomChallenge('');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col">
      <div className="max-w-2xl mx-auto w-full">

        {/* Selected team */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Your Team</h2>
            <button onClick={() => setView('learn')} className="btn btn-subtle">How does JSC work? →</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {selected.length === 0 ? (
              <div className="col-span-full text-sm" style={{ color: 'var(--muted)' }}>
                No members selected — expand &quot;Customize&quot; below.
              </div>
            ) : (
              selected.map(m => (
                <div key={m.id} className="rounded-xl p-3 text-center"
                  style={{ background: `${m.color}11`, border: `1px solid ${m.color}33` }}>
                  <div className="text-2xl mb-1">{m.emoji}</div>
                  <div className="text-xs font-semibold" style={{ color: m.color }}>{m.name}</div>
                  <div className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--muted)' }}>{m.role}</div>
                </div>
              ))
            )}
          </div>
          <button onClick={() => store.startSession()} className="btn btn-primary btn-lg w-full">
            {hasUnfinished ? 'Resume Session →' : 'Start Session →'}
          </button>
          {error && (
            <p className="text-center text-xs mt-2 px-3 py-2 rounded-lg" style={{ color: 'var(--danger)', background: '#ef444411', border: '1px solid #ef444433' }}>
              {error}
            </p>
          )}
          <p className="text-center text-xs mt-2" style={{ color: 'var(--muted)' }}>
            10-session curriculum · ~30 min per session
          </p>
        </section>

        {/* Customize toggle */}
        <div className="mb-3">
          <button onClick={() => setCustomizeOpen(!customizeOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--muted)' }}>
              {customizeOpen ? 'Collapse' : 'Customize your team (add / swap advisors)'}
            </span>
            <span style={{ color: 'var(--muted)' }}>{customizeOpen ? '▲' : '▼'}</span>
          </button>
        </div>

        {/* Roster */}
        {customizeOpen && (
          <div>
            <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
              Pick up to 5. Click to add or remove.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="col-span-full mb-1">
                <div className="section-label mb-3">ARCHETYPES</div>
              </div>
              {(ARCHETYPES as Member[]).map(m => <MemberCard key={m.id} member={m} />)}

              <div className="col-span-full mt-4 mb-1 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="section-label mb-3">FICTIONAL VOICES INSPIRED BY REAL PEOPLE</div>
              </div>
              {(REAL_PEOPLE as Member[]).map(m => <MemberCard key={m.id} member={m} />)}

              <div className="col-span-full mt-4 mb-1 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="section-label mb-3" style={{ color: '#60a5fa' }}>FOUNDER&apos;S CIRCLE</div>
              </div>
              {(FOUNDERS_CIRCLE as Member[]).map(m => <MemberCard key={m.id} member={m} />)}

              {customMembers.length > 0 && (
                <>
                  <div className="col-span-full mt-4 mb-1 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="section-label mb-3">CUSTOM</div>
                  </div>
                  {customMembers.map(m => <MemberCard key={m.id} member={m} />)}
                </>
              )}
            </div>

            {/* Add custom member form */}
            <div className="card mb-4">
              <div className="section-label-accent mb-2">+ ADD ANYONE</div>
              <div className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
                Real person, historical figure, mentor, fictional character.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <input value={customName} onChange={e => setCustomName(e.target.value)} placeholder="Name" />
                <input value={customRole} onChange={e => setCustomRole(e.target.value)} placeholder="Role" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                <input value={customVoice} onChange={e => setCustomVoice(e.target.value)} placeholder="Voice (e.g. blunt, visionary)" />
                <input value={customChallenge} onChange={e => setCustomChallenge(e.target.value)} placeholder="What they push on" />
              </div>
              <button onClick={handleAddCustom} className="btn btn-ghost">Add to Roster</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
