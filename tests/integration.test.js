import { describe, it, expect } from 'vitest';
import { detectPhaseTransition, PHASE_ORDER } from '@/lib/council/phases';
import { ARCHETYPES, REAL_PEOPLE, FOUNDERS_CIRCLE } from '@/lib/council/roster';

describe('full session phase flow', () => {
  it('can traverse all phases in order with realistic AI text', () => {
    const transitions = [
      { from: 'checkin', text: "Great to hear that update. Let's get into today's topic — the Mnookin Two-Pager.", expected: 'exercise' },
      { from: 'exercise', text: "That's a solid draft. Is there anything else you'd like the council to weigh in on?", expected: 'hot_seat' },
      { from: 'hot_seat', text: "Great perspectives. What will you commit to before next session?", expected: 'commitments' },
      { from: 'commitments', text: "COMMITMENTS_BLOCK_START\n- Send 3 emails by Friday\nCOMMITMENTS_BLOCK_END\nOne last thing.", expected: 'checkout' },
      { from: 'checkout', text: "Great session today. See you next time.", expected: 'done' },
    ];

    let phase = 'checkin';
    let msgCount = 0;
    for (const t of transitions) {
      expect(phase).toBe(t.from);
      msgCount += 2;
      phase = detectPhaseTransition(phase, t.text, msgCount);
      expect(phase).toBe(t.expected);
    }
  });

  it('cannot skip phases', () => {
    let phase = 'checkin';
    phase = detectPhaseTransition(phase, "What will you commit to?", 2);
    expect(phase).toBe('checkin');
  });
});

describe('roster data integrity', () => {
  const allMembers = [...ARCHETYPES, ...REAL_PEOPLE, ...FOUNDERS_CIRCLE];

  it('no duplicate IDs', () => {
    const ids = allMembers.map(m => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all challenges are substantial', () => {
    for (const m of allMembers) {
      expect(m.challenge.length).toBeGreaterThan(10);
    }
  });

  it('PHASE_ORDER has no duplicates', () => {
    expect(new Set(PHASE_ORDER).size).toBe(PHASE_ORDER.length);
  });
});
