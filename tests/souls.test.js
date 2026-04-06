import { describe, it, expect } from 'vitest';
import { getSoul, getAllSoulIds, hasSoul } from '@/lib/council/souls';

describe('souls', () => {
  it('loads facilitator soul', () => {
    const soul = getSoul('facilitator');
    expect(soul).toContain('Facilitator');
    expect(soul).toContain('moderator');
  });

  it('loads all archetype souls', () => {
    const ids = ['strategist', 'operator', 'devils_advocate', 'recruiter', 'therapist', 'interview_coach', 'insider'];
    for (const id of ids) {
      const soul = getSoul(id);
      expect(soul.length).toBeGreaterThan(100);
    }
  });

  it('returns empty string for unknown soul', () => {
    expect(getSoul('nonexistent')).toBe('');
  });

  it('getAllSoulIds returns all known souls', () => {
    const ids = getAllSoulIds();
    expect(ids).toContain('facilitator');
    expect(ids).toContain('strategist');
    expect(ids).toContain('interview_coach');
    expect(ids).toContain('insider');
    expect(ids.length).toBeGreaterThanOrEqual(8);
  });

  it('hasSoul returns true for known, false for unknown', () => {
    expect(hasSoul('facilitator')).toBe(true);
    expect(hasSoul('strategist')).toBe(true);
    expect(hasSoul('nonexistent')).toBe(false);
  });

  it('caches soul content on second load', () => {
    const first = getSoul('operator');
    const second = getSoul('operator');
    expect(first).toBe(second); // same reference from cache
  });

  it('soul files contain required sections', () => {
    const ids = ['strategist', 'operator', 'devils_advocate', 'recruiter', 'therapist'];
    for (const id of ids) {
      const soul = getSoul(id);
      expect(soul).toContain('## Core');
      expect(soul).toContain('## Voice');
      expect(soul).toContain('## Lens');
      expect(soul).toContain('## Rules');
      expect(soul).toContain('## Anti-patterns');
    }
  });

  it('all souls contain identity boundary rule', () => {
    const ids = ['strategist', 'operator', 'devils_advocate', 'recruiter', 'therapist', 'interview_coach', 'insider'];
    for (const id of ids) {
      const soul = getSoul(id);
      expect(soul).toContain('NOT the user');
    }
  });
});
