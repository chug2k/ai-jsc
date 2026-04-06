import { describe, it, expect } from 'vitest';
import { buildModeratorPrompt, buildReactiveMemberPrompt } from '@/lib/council/prompts';

// New signature: (soul, identity, allCouncil, phase, ctx)
const mockSoul = `# Test Member
## Voice
calm, analytical
## Lens
Tests everything.`;

const mockIdentity = {
  id: 'test', soul_id: 'test', name: 'Test Member', emoji: '🧪', color: '#ff0000',
  role_title: 'Test Role', is_fixed: false, is_moderator: false,
};

const mockModIdentity = {
  id: 'facilitator', soul_id: 'facilitator', name: 'Maude', emoji: '📋', color: '#4ade80',
  role_title: 'Moderator', is_fixed: true, is_moderator: true,
};

const mockCtx = {
  userName: 'Alice', searchStatus: 'fast',
  userContext: 'Looking for product roles at startups.',
  commitments: [{ text: 'Send 3 cold emails by Friday' }],
  sessionNumber: 3,
  priorSessions: [],
  turnsInPhase: 0,
};

const firstSessionCtx = {
  userName: 'Bob', searchStatus: 'slow', userContext: '', commitments: [],
  sessionNumber: 0, priorSessions: [], turnsInPhase: 0,
};

describe('buildModeratorPrompt', () => {
  it('includes identity name and role', () => {
    const p = buildModeratorPrompt(mockSoul, mockModIdentity, [mockModIdentity], 'checkin', mockCtx);
    expect(p).toContain('Maude');
    expect(p).toContain('Moderator');
  });

  it('includes user name and search status', () => {
    const p = buildModeratorPrompt(mockSoul, mockModIdentity, [mockModIdentity], 'checkin', mockCtx);
    expect(p).toContain('Alice');
    expect(p).toContain('actively searching');
  });

  it('includes session agenda', () => {
    const p = buildModeratorPrompt(mockSoul, mockModIdentity, [mockModIdentity], 'checkin', mockCtx);
    expect(p).toContain('SESSION');
    expect(p).toContain('RUN OF SHOW');
  });

  it('includes tools list', () => {
    const p = buildModeratorPrompt(mockSoul, mockModIdentity, [mockModIdentity], 'checkin', mockCtx);
    expect(p).toContain('call_on');
    expect(p).toContain('move_to_phase');
    expect(p).toContain('create_commitment');
    expect(p).toContain('end_session');
  });

  it('first session has trust-building agenda', () => {
    const p = buildModeratorPrompt(mockSoul, mockModIdentity, [mockModIdentity], 'checkin', firstSessionCtx);
    expect(p).toContain('TRUST-BUILDING');
    expect(p).toContain('call_on');
  });

  it('includes soul content', () => {
    const p = buildModeratorPrompt(mockSoul, mockModIdentity, [mockModIdentity], 'checkin', mockCtx);
    expect(p).toContain('calm, analytical');
  });

  it('includes phase management with turn count', () => {
    const ctx3 = { ...mockCtx, turnsInPhase: 3 };
    const p = buildModeratorPrompt(mockSoul, mockModIdentity, [mockModIdentity], 'checkin', ctx3);
    expect(p).toContain('3 user messages');
  });
});

describe('buildReactiveMemberPrompt', () => {
  it('includes soul content', () => {
    const p = buildReactiveMemberPrompt(mockSoul, mockIdentity, [mockModIdentity, mockIdentity], 'checkin', mockCtx);
    expect(p).toContain('calm, analytical');
    expect(p).toContain('Tests everything');
  });

  it('includes when-to-speak triggers', () => {
    const p = buildReactiveMemberPrompt(mockSoul, mockIdentity, [mockModIdentity, mockIdentity], 'checkin', mockCtx);
    expect(p).toContain('emotionally significant');
    expect(p).toContain('stay_silent');
  });

  it('includes tools', () => {
    const p = buildReactiveMemberPrompt(mockSoul, mockIdentity, [mockModIdentity, mockIdentity], 'checkin', mockCtx);
    expect(p).toContain('send_message');
    expect(p).toContain('reply_to');
    expect(p).toContain('stay_silent');
  });

  it('excludes self from other members list', () => {
    const other = { ...mockIdentity, id: 'other', soul_id: 'other', name: 'Other', role_title: 'Role2' };
    const p = buildReactiveMemberPrompt(mockSoul, mockIdentity, [mockModIdentity, mockIdentity, other], 'checkin', mockCtx);
    expect(p).toContain('Other');
    // Extract just the OTHER MEMBERS lines (between the header and the next section)
    const otherSection = p.split('OTHER MEMBERS')[1].split('\n\n')[0];
    expect(otherSection).toContain('Other');
    expect(otherSection).toContain('Maude');
    expect(otherSection).not.toContain('Test Member');
  });
});
