import { describe, it, expect } from 'vitest';
import { buildModeratorPrompt, buildReactiveMemberPrompt } from '@/lib/council/prompts';

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

  it('includes session number and theme', () => {
    const p = buildModeratorPrompt(mockMember, [mockMember], 'checkin', mockCtx);
    expect(p).toContain('SESSION #3');
  });

  it('includes tools list', () => {
    const p = buildModeratorPrompt(mockMember, [mockMember], 'checkin', mockCtx);
    expect(p).toContain('call_on');
    expect(p).toContain('move_to_phase');
    expect(p).toContain('create_commitment');
    expect(p).toContain('end_session');
  });

  it('includes concrete agenda with steps', () => {
    const p = buildModeratorPrompt(mockMember, [mockMember], 'checkin', mockCtx);
    expect(p).toContain('STEP 1');
    expect(p).toContain('AGENDA');
  });

  it('first session has special welcome agenda', () => {
    const p = buildModeratorPrompt(mockMember, [mockMember], 'checkin', firstSessionCtx);
    expect(p).toContain('FIRST');
    expect(p).toContain('call_on');
  });

  it('uses roleplaying note for real people', () => {
    const p = buildModeratorPrompt(mockRealMember, [mockRealMember], 'checkin', mockCtx);
    expect(p).toContain('roleplaying as Paul Graham');
  });

  it('includes style rules about not repeating questions', () => {
    const p = buildModeratorPrompt(mockMember, [mockMember], 'checkin', mockCtx);
    expect(p).toContain('same type of question twice');
  });
});

describe('buildReactiveMemberPrompt', () => {
  it('includes member voice and lens', () => {
    const p = buildReactiveMemberPrompt(mockMember, [mockMember], 'checkin', mockCtx);
    expect(p).toContain('calm, analytical');
    expect(p).toContain('Tests everything');
  });

  it('includes when-to-speak triggers', () => {
    const p = buildReactiveMemberPrompt(mockMember, [mockMember], 'checkin', mockCtx);
    expect(p).toContain('emotionally significant');
    expect(p).toContain('stay_silent');
  });

  it('includes tools', () => {
    const p = buildReactiveMemberPrompt(mockMember, [mockMember], 'checkin', mockCtx);
    expect(p).toContain('send_message');
    expect(p).toContain('reply_to');
    expect(p).toContain('stay_silent');
  });

  it('excludes self from other members list', () => {
    const other = { ...mockMember, id: 'other', name: 'Other', role: 'Role2' };
    const p = buildReactiveMemberPrompt(mockMember, [mockMember, other], 'checkin', mockCtx);
    expect(p).toContain('Other');
    const otherSection = p.split('OTHER MEMBERS')[1];
    expect(otherSection).not.toContain('Test Member');
  });
});
