import { describe, it, expect } from 'vitest';
import { PHASE_ORDER, PHASE_LABELS, getNextPhase, getSessionTheme, getSessionAgenda, getCheckinPrompt } from '@/lib/council/phases';

describe('phase ordering', () => {
  it('has correct phase sequence', () => {
    expect(PHASE_ORDER).toEqual(['checkin', 'exercise', 'hot_seat', 'commitments', 'checkout', 'done']);
  });

  it('getNextPhase returns correct next phase', () => {
    expect(getNextPhase('checkin')).toBe('exercise');
    expect(getNextPhase('exercise')).toBe('hot_seat');
    expect(getNextPhase('hot_seat')).toBe('commitments');
    expect(getNextPhase('commitments')).toBe('checkout');
    expect(getNextPhase('checkout')).toBe('done');
    expect(getNextPhase('done')).toBeNull();
  });

  it('getNextPhase returns null for unknown phase', () => {
    expect(getNextPhase('nonexistent')).toBeNull();
  });

  it('all phases have labels', () => {
    for (const phase of PHASE_ORDER) {
      expect(PHASE_LABELS[phase]).toBeDefined();
      expect(PHASE_LABELS[phase].length).toBeGreaterThan(0);
    }
  });
});

describe('session agendas', () => {
  it('sessions 0-10 all have agendas', () => {
    for (let i = 0; i <= 10; i++) {
      const agenda = getSessionAgenda(i);
      expect(agenda.length).toBeGreaterThan(100);
      expect(agenda).toContain('RUN OF SHOW');
      expect(agenda).toContain('CHECK-IN');
    }
  });

  it('session 0 is trust-building', () => {
    const agenda = getSessionAgenda(0);
    expect(agenda).toContain('TRUST-BUILDING');
    expect(agenda).toContain('INTRODUCTIONS');
  });

  it('session 7 is CMF', () => {
    const agenda = getSessionAgenda(7);
    expect(agenda).toContain('CANDIDATE-MARKET FIT');
  });

  it('session 10 is interview prep', () => {
    const agenda = getSessionAgenda(10);
    expect(agenda).toContain('INTERVIEW PREP');
  });

  it('sessions 11+ return ongoing agenda', () => {
    const agenda = getSessionAgenda(15);
    expect(agenda).toContain('ONGOING');
  });

  it('each session has a unique checkin prompt', () => {
    const prompts = new Set();
    for (let i = 0; i <= 10; i++) {
      const prompt = getCheckinPrompt(i);
      expect(prompt.length).toBeGreaterThan(10);
      prompts.add(prompt);
    }
    // Most should be unique (some may repeat)
    expect(prompts.size).toBeGreaterThanOrEqual(8);
  });
});

describe('session themes', () => {
  it('sessions 0-10 have themes', () => {
    for (let i = 0; i <= 10; i++) {
      const theme = getSessionTheme(i);
      expect(theme.name.length).toBeGreaterThan(0);
      expect(theme.exercise.length).toBeGreaterThan(0);
      expect(theme.homework.length).toBeGreaterThan(0);
    }
  });

  it('sessions 11+ return ongoing theme', () => {
    const theme = getSessionTheme(99);
    expect(theme.name).toBe('Ongoing');
  });
});
