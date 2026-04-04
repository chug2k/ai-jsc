import { describe, it, expect } from 'vitest';
import { getLimitsForPlan, canUseMember } from '@/lib/subscriptions';

describe('getLimitsForPlan', () => {
  it('returns free limits by default', () => {
    const limits = getLimitsForPlan('free');
    expect(limits.sessions_per_month).toBe(4);
    expect(limits.max_council_members).toBe(3);
    expect(limits.real_people_voices).toBe(false);
    expect(limits.custom_members).toBe(false);
    expect(limits.premium_models).toBe(false);
  });

  it('returns free limits for unknown plan', () => {
    const limits = getLimitsForPlan('nonexistent');
    expect(limits.sessions_per_month).toBe(4);
  });

  it('3mo plan has unlimited sessions', () => {
    const limits = getLimitsForPlan('3mo');
    expect(limits.sessions_per_month).toBeNull();
    expect(limits.max_council_members).toBe(5);
    expect(limits.real_people_voices).toBe(true);
    expect(limits.custom_members).toBe(true);
  });

  it('6mo plan matches 3mo features', () => {
    const l3 = getLimitsForPlan('3mo');
    const l6 = getLimitsForPlan('6mo');
    expect(l6.sessions_per_month).toBe(l3.sessions_per_month);
    expect(l6.max_council_members).toBe(l3.max_council_members);
    expect(l6.real_people_voices).toBe(l3.real_people_voices);
  });

  it('12mo plan matches 3mo features', () => {
    const l3 = getLimitsForPlan('3mo');
    const l12 = getLimitsForPlan('12mo');
    expect(l12.sessions_per_month).toBe(l3.sessions_per_month);
    expect(l12.max_council_members).toBe(l3.max_council_members);
  });

  it('founders_circle has unlimited sessions', () => {
    const limits = getLimitsForPlan('founders_circle');
    expect(limits.sessions_per_month).toBeNull();
    expect(limits.max_council_members).toBe(5);
  });

  it('free plan limits are stricter than paid', () => {
    const free = getLimitsForPlan('free');
    const paid = getLimitsForPlan('3mo');
    expect(free.sessions_per_month).toBeLessThan(paid.sessions_per_month ?? Infinity);
    expect(free.max_council_members).toBeLessThan(paid.max_council_members);
    expect(free.real_people_voices).toBe(false);
    expect(paid.real_people_voices).toBe(true);
  });
});

describe('canUseMember', () => {
  it('free plan allows archetypes', () => {
    const result = canUseMember('free', {});
    expect(result.ok).toBe(true);
  });

  it('free plan blocks real people voices', () => {
    const result = canUseMember('free', { real: true });
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('paid plan');
  });

  it('paid plan allows real people voices', () => {
    expect(canUseMember('3mo', { real: true }).ok).toBe(true);
    expect(canUseMember('6mo', { real: true }).ok).toBe(true);
    expect(canUseMember('12mo', { real: true }).ok).toBe(true);
  });

  it('only founders_circle plan allows founders_circle members', () => {
    expect(canUseMember('free', { founders_circle: true }).ok).toBe(false);
    expect(canUseMember('3mo', { founders_circle: true }).ok).toBe(false);
    expect(canUseMember('12mo', { founders_circle: true }).ok).toBe(false);
    expect(canUseMember('founders_circle', { founders_circle: true }).ok).toBe(true);
  });

  it('founders_circle reason message is descriptive', () => {
    const result = canUseMember('3mo', { founders_circle: true });
    expect(result.reason).toContain("Founder's Circle");
  });
});
