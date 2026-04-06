import { describe, it, expect } from 'vitest';
import { defaultIdentity, formatIdentityContext, DEFAULT_IDENTITIES, ARCHETYPE_INFO } from '@/lib/council/identities';

describe('identities', () => {
  it('defaultIdentity returns correct identity for each archetype', () => {
    const ids = ['facilitator', 'strategist', 'operator', 'devils_advocate', 'recruiter', 'therapist', 'interview_coach', 'insider'];
    for (const id of ids) {
      const identity = defaultIdentity(id);
      expect(identity.soul_id).toBe(id);
      expect(identity.name.length).toBeGreaterThan(0);
      expect(identity.role_title.length).toBeGreaterThan(0);
    }
  });

  it('facilitator is always moderator and fixed', () => {
    const maude = defaultIdentity('facilitator');
    expect(maude.is_moderator).toBe(true);
    expect(maude.is_fixed).toBe(true);
    expect(maude.name).toBe('Maude');
  });

  it('non-facilitator identities are not moderator', () => {
    const eli = defaultIdentity('strategist');
    expect(eli.is_moderator).toBe(false);
    expect(eli.is_fixed).toBe(false);
  });

  it('all identities have real human names', () => {
    const genericNames = ['The Strategist', 'The Operator', "The Devil's Advocate", 'The Market Mirror', 'The Witness', 'The Founder', 'The Connector'];
    for (const id of Object.keys(DEFAULT_IDENTITIES)) {
      const identity = defaultIdentity(id);
      expect(genericNames).not.toContain(identity.name);
    }
  });

  it('analytical agents have reasoning_effort set', () => {
    expect(defaultIdentity('strategist').reasoning_effort).toBe('medium');
    expect(defaultIdentity('devils_advocate').reasoning_effort).toBe('medium');
  });

  it('non-analytical agents have no reasoning_effort', () => {
    expect(defaultIdentity('operator').reasoning_effort).toBeUndefined();
    expect(defaultIdentity('facilitator').reasoning_effort).toBeUndefined();
    expect(defaultIdentity('interview_coach').reasoning_effort).toBeUndefined();
  });

  it('formatIdentityContext includes key fields', () => {
    const identity = defaultIdentity('strategist');
    const ctx = formatIdentityContext(identity);
    expect(ctx).toContain('Eli');
    expect(ctx).toContain('Career Arc Advisor');
    expect(ctx).toContain('52');
    expect(ctx).toContain('25 years');
  });

  it('defaultIdentity returns fallback for unknown soul', () => {
    const unknown = defaultIdentity('unknown_thing');
    expect(unknown.id).toBe('unknown_thing');
    expect(unknown.name).toBe('unknown_thing');
    expect(unknown.role_title).toBe('Council Member');
  });

  it('ARCHETYPE_INFO covers all non-moderator archetypes', () => {
    const expected = ['strategist', 'operator', 'devils_advocate', 'recruiter', 'therapist', 'interview_coach', 'insider'];
    for (const id of expected) {
      expect(ARCHETYPE_INFO[id]).toBeDefined();
      expect(ARCHETYPE_INFO[id].label.length).toBeGreaterThan(0);
      expect(ARCHETYPE_INFO[id].description.length).toBeGreaterThan(0);
    }
  });
});
