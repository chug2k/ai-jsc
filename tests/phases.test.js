import { describe, it, expect } from 'vitest';
import { PHASE_ORDER, PHASE_LABELS, PHASE_HINTS, detectPhaseTransition, getSessionTheme, getCheckinPrompt } from '@/lib/council/phases';

describe('PHASE_ORDER', () => {
  it('has 6 phases in correct order', () => {
    expect(PHASE_ORDER).toEqual([
      'checkin', 'exercise', 'hot_seat', 'commitments', 'checkout', 'done',
    ]);
  });

  it('starts with checkin and ends with done', () => {
    expect(PHASE_ORDER[0]).toBe('checkin');
    expect(PHASE_ORDER[PHASE_ORDER.length - 1]).toBe('done');
  });
});

describe('PHASE_LABELS', () => {
  it('has a label for every phase', () => {
    for (const phase of PHASE_ORDER) {
      expect(PHASE_LABELS[phase]).toBeDefined();
      expect(typeof PHASE_LABELS[phase]).toBe('string');
    }
  });
});

describe('PHASE_HINTS', () => {
  it('has placeholder and chips for every phase', () => {
    for (const phase of PHASE_ORDER) {
      expect(PHASE_HINTS[phase]).toBeDefined();
      expect(PHASE_HINTS[phase].placeholder).toBeDefined();
      expect(Array.isArray(PHASE_HINTS[phase].chips)).toBe(true);
    }
  });

  it('done phase has empty chips', () => {
    expect(PHASE_HINTS.done.chips).toEqual([]);
  });

  it('checkout phase has one-word chip options', () => {
    for (const chip of PHASE_HINTS.checkout.chips) {
      expect(chip.split(' ').length).toBe(1);
    }
  });
});

describe('getSessionTheme', () => {
  it('returns theme for sessions 0-10', () => {
    for (let i = 0; i <= 10; i++) {
      const theme = getSessionTheme(i);
      expect(theme.name).toBeDefined();
      expect(theme.exercise).toBeDefined();
      expect(theme.description).toBeDefined();
      expect(theme.homework).toBeDefined();
    }
  });

  it('returns ongoing theme for sessions beyond 10', () => {
    const theme = getSessionTheme(15);
    expect(theme.name).toBe('Ongoing');
  });

  it('session 0 is trust-building', () => {
    expect(getSessionTheme(0).name).toBe('Trust-Building');
  });

  it('session 7 is Candidate-Market Fit', () => {
    expect(getSessionTheme(7).name).toBe('Candidate-Market Fit');
  });
});

describe('getCheckinPrompt', () => {
  it('returns a prompt for sessions 0-10', () => {
    for (let i = 0; i <= 10; i++) {
      expect(typeof getCheckinPrompt(i)).toBe('string');
      expect(getCheckinPrompt(i).length).toBeGreaterThan(0);
    }
  });

  it('returns a fallback prompt for high session numbers', () => {
    expect(typeof getCheckinPrompt(99)).toBe('string');
  });
});

describe('detectPhaseTransition', () => {
  it('stays on current phase when no trigger words found', () => {
    expect(detectPhaseTransition('checkin', 'Hello, how are you doing today?', 0)).toBe('checkin');
  });

  it('checkin → exercise', () => {
    expect(detectPhaseTransition('checkin', "Let's get into today's topic — the Mnookin Two-Pager.", 0)).toBe('exercise');
  });

  it('exercise → hot_seat', () => {
    expect(detectPhaseTransition('exercise', "Is there anything else you'd like the council to weigh in on?", 0)).toBe('hot_seat');
  });

  it('hot_seat → commitments', () => {
    expect(detectPhaseTransition('hot_seat', 'What will you commit to before next session?', 0)).toBe('commitments');
  });

  it('commitments → checkout on COMMITMENTS_BLOCK_END', () => {
    expect(detectPhaseTransition('commitments', 'COMMITMENTS_BLOCK_START\n- Do X\nCOMMITMENTS_BLOCK_END', 0)).toBe('checkout');
  });

  it('checkout → done only when enough messages', () => {
    expect(detectPhaseTransition('checkout', 'Great session. See you next time.', 3)).toBe('checkout');
    expect(detectPhaseTransition('checkout', 'Great session. See you next time.', 6)).toBe('done');
  });

  it('does not skip phases', () => {
    expect(detectPhaseTransition('checkin', 'What will you commit to?', 0)).toBe('checkin');
  });

  it('handles empty text', () => {
    expect(detectPhaseTransition('checkin', '', 0)).toBe('checkin');
  });
});
