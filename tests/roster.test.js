import { describe, it, expect } from 'vitest';
import { ARCHETYPES, REAL_PEOPLE, FOUNDERS_CIRCLE } from '@/lib/council/roster';

describe('ARCHETYPES', () => {
  it('has at least 5 archetypes', () => {
    expect(ARCHETYPES.length).toBeGreaterThanOrEqual(5);
  });

  it('each archetype has required fields', () => {
    for (const m of ARCHETYPES) {
      expect(m.id).toBeDefined();
      expect(m.name).toBeDefined();
      expect(m.emoji).toBeDefined();
      expect(m.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(m.role).toBeDefined();
      expect(m.voice).toBeDefined();
      expect(m.challenge).toBeDefined();
    }
  });

  it('all IDs are unique', () => {
    const ids = ARCHETYPES.map(m => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('includes facilitator', () => {
    expect(ARCHETYPES.find(m => m.id === 'facilitator')).toBeDefined();
  });
});

describe('REAL_PEOPLE', () => {
  it('has at least 5 real people', () => {
    expect(REAL_PEOPLE.length).toBeGreaterThanOrEqual(5);
  });

  it('each has real=true', () => {
    for (const m of REAL_PEOPLE) {
      expect(m.real).toBe(true);
    }
  });

  it('no ID collision with archetypes', () => {
    const archetypeIds = new Set(ARCHETYPES.map(m => m.id));
    for (const m of REAL_PEOPLE) {
      expect(archetypeIds.has(m.id)).toBe(false);
    }
  });
});

describe('FOUNDERS_CIRCLE', () => {
  it('has charles_lee', () => {
    const charles = FOUNDERS_CIRCLE.find(m => m.id === 'charles_lee');
    expect(charles).toBeDefined();
    expect(charles.founders_circle).toBe(true);
  });
});

describe('roster data integrity', () => {
  const allMembers = [...ARCHETYPES, ...REAL_PEOPLE, ...FOUNDERS_CIRCLE];

  it('no duplicate IDs across all members', () => {
    const ids = allMembers.map(m => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('no duplicate names', () => {
    const names = allMembers.map(m => m.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('all colors are valid hex', () => {
    for (const m of allMembers) {
      expect(m.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('default selected IDs all exist', () => {
    const defaults = ['facilitator', 'strategist', 'operator', 'devils_advocate'];
    const allIds = allMembers.map(m => m.id);
    for (const id of defaults) {
      expect(allIds).toContain(id);
    }
  });
});
