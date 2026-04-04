import { describe, it, expect, vi } from 'vitest';
import { runReactionLoop } from '@/lib/council/engine';

function makeAgent(id, name, isModerator = false) {
  return {
    id,
    name,
    isModerator,
    buildSystemPrompt: () => `You are ${name}.`,
  };
}

describe('runReactionLoop', () => {
  it('moderator speaks first', async () => {
    const order = [];
    const agents = [
      makeAgent('mod', 'Maude', true),
      makeAgent('strat', 'The Strategist'),
    ];

    const llm = vi.fn(async (system) => {
      const name = system.includes('Maude') ? 'Maude' : 'Strategist';
      order.push(name);
      return `Response from ${name}`;
    });

    await runReactionLoop({
      agents,
      messages: [{ role: 'user', content: 'Hello' }],
      onMessage: () => {},
      llm,
    });

    expect(order[0]).toBe('Maude');
  });

  it('filters SKIP responses', async () => {
    const received = [];
    let round = 0;
    const agents = [
      makeAgent('mod', 'Maude', true),
      makeAgent('strat', 'The Strategist'),
      makeAgent('op', 'The Operator'),
    ];

    const llm = vi.fn(async (system) => {
      // Only first round produces real responses
      if (received.length >= 2) return 'SKIP';
      if (system.includes('Maude')) return 'Welcome!';
      if (system.includes('Strategist')) return 'SKIP';
      return 'I have a thought.';
    });

    await runReactionLoop({
      agents,
      messages: [{ role: 'user', content: 'Hello' }],
      onMessage: (msg) => received.push(msg),
      llm,
    });

    expect(received.length).toBe(2); // Maude + Operator, Strategist skipped
    expect(received[0].memberName).toBe('Maude');
    expect(received[0].content).not.toContain('[Maude]');
    expect(received[1].memberName).toBe('The Operator');
  });

  it('stops when nobody has anything to say', async () => {
    let callCount = 0;
    const agents = [
      makeAgent('mod', 'Maude', true),
      makeAgent('strat', 'The Strategist'),
    ];

    const llm = vi.fn(async () => {
      callCount++;
      // First round: both speak. Second round: both SKIP.
      if (callCount <= 2) return 'Something to say';
      return 'SKIP';
    });

    const result = await runReactionLoop({
      agents,
      messages: [{ role: 'user', content: 'Hello' }],
      onMessage: () => {},
      llm,
    });

    expect(result.length).toBe(2); // Only first round produced messages
  });

  it('respects maxResponses cap', async () => {
    const agents = [
      makeAgent('mod', 'Maude', true),
      makeAgent('a', 'Agent A'),
      makeAgent('b', 'Agent B'),
    ];

    const llm = vi.fn(async () => 'I always have something to say!');

    const result = await runReactionLoop({
      agents,
      messages: [{ role: 'user', content: 'Hello' }],
      onMessage: () => {},
      llm,
      maxResponses: 4,
    });

    expect(result.length).toBeLessThanOrEqual(4);
  });

  it('terminates if only moderator speaks', async () => {
    const agents = [
      makeAgent('mod', 'Maude', true),
      makeAgent('strat', 'The Strategist'),
    ];

    const llm = vi.fn(async (system) => {
      if (system.includes('Maude')) return 'I have thoughts';
      return 'SKIP';
    });

    const result = await runReactionLoop({
      agents,
      messages: [{ role: 'user', content: 'Hello' }],
      onMessage: () => {},
      llm,
    });

    // Maude speaks once, nobody else has anything, loop ends
    expect(result.length).toBe(1);
    expect(result[0].memberName).toBe('Maude');
  });
});
