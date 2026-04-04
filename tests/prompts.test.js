import { describe, it, expect } from 'vitest';
import { buildModeratorPrompt, buildWrapupPrompt, buildMemberPrompt } from '@/lib/council/prompts';

const mockMember = {
  id: 'test', name: 'Test Member', emoji: '🧪', color: '#ff0000',
  role: 'Test Role', voice: 'calm, analytical', challenge: 'Tests everything.',
};

const mockRealMember = { ...mockMember, id: 'pg', name: 'Paul Graham', real: true };

const mockCtx = {
  userName: 'Alice', searchStatus: 'fast',
  userContext: 'Looking for product roles at startups.',
  commitments: [{ text: 'Send 3 cold emails by Friday' }],
  sessionNumber: 3,
};

const firstSessionCtx = {
  userName: 'Bob', searchStatus: 'slow', userContext: '', commitments: [],
  sessionNumber: 0,
};

describe('buildModeratorPrompt', () => {
  it('includes member name and voice', () => {
    const p = buildModeratorPrompt(mockMember, [mockMember], 'checkin', mockCtx);
    expect(p).toContain('Test Member');
    expect(p).toContain('calm, analytical');
  });

  it('includes user name and search status', () => {
    const p = buildModeratorPrompt(mockMember, [mockMember], 'checkin', mockCtx);
    expect(p).toContain('Alice');
    expect(p).toContain('actively searching');
  });

  it('includes prior commitments when they exist', () => {
    const p = buildModeratorPrompt(mockMember, [mockMember], 'checkin', mockCtx);
    expect(p).toContain('Send 3 cold emails by Friday');
  });

  it('omits commitments section for first session', () => {
    const p = buildModeratorPrompt(mockMember, [mockMember], 'checkin', firstSessionCtx);
    expect(p).not.toContain('PRIOR COMMITMENTS');
  });

  it('includes session number and theme', () => {
    const p = buildModeratorPrompt(mockMember, [mockMember], 'checkin', mockCtx);
    expect(p).toContain('SESSION #3');
    expect(p).toContain('Mnookin Two-Pager Review');
  });

  it('includes phase instructions for exercise', () => {
    const p = buildModeratorPrompt(mockMember, [mockMember], 'exercise', mockCtx);
    expect(p).toContain('EXERCISE');
    expect(p).toContain('Mnookin Two-Pager Review');
  });

  it('includes guidelines', () => {
    const p = buildModeratorPrompt(mockMember, [mockMember], 'checkin', mockCtx);
    expect(p).toContain('Max 120 words');
    expect(p).toContain('Stay in character');
  });

  it('uses roleplaying note for real people', () => {
    const p = buildModeratorPrompt(mockRealMember, [mockRealMember], 'checkin', mockCtx);
    expect(p).toContain('roleplaying as Paul Graham');
  });

  it('uses character note for archetypes', () => {
    const p = buildModeratorPrompt(mockMember, [mockMember], 'checkin', mockCtx);
    expect(p).toContain('You are the character Test Member');
  });

  it('first session (0) is welcoming', () => {
    const p = buildModeratorPrompt(mockMember, [mockMember], 'checkin', firstSessionCtx);
    expect(p).toContain('FIRST SESSION');
    expect(p).toContain('Trust-Building');
  });
});

describe('buildWrapupPrompt', () => {
  it('includes wrap-up directive', () => {
    const p = buildWrapupPrompt(mockMember, [mockMember], mockCtx);
    expect(p).toContain('wrapping up the HOT SEAT');
    expect(p).toContain('right next step');
  });
});

describe('buildMemberPrompt', () => {
  it('includes member voice and HOT SEAT context', () => {
    const p = buildMemberPrompt(mockMember, [mockMember], mockCtx);
    expect(p).toContain('calm, analytical');
    expect(p).toContain('HOT SEAT');
  });

  it('includes 2-4 sentence guideline', () => {
    const p = buildMemberPrompt(mockMember, [mockMember], mockCtx);
    expect(p).toContain('2-4 sentences');
  });

  it('excludes self from other members list', () => {
    const other = { ...mockMember, id: 'other', name: 'Other', role: 'Role2' };
    const p = buildMemberPrompt(mockMember, [mockMember, other], mockCtx);
    expect(p).toContain('Other: Role2');
    const otherSection = p.split('OTHER COUNCIL MEMBERS')[1];
    expect(otherSection).not.toContain('Test Member: Test Role');
  });
});
