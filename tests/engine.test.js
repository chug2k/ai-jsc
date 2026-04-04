import { describe, it, expect, vi } from 'vitest';
import { runReactionLoop } from '@/lib/council/engine';

function makeAgent(id, name, isModerator = false) {
  return {
    id,
    name,
    isModerator,
    model: 'test-model',
    buildSystemPrompt: () => `You are ${name}.`,
  };
}

const noopCallbacks = {
  onMessage: () => {},
  onPhaseChange: () => {},
  onCommitment: () => {},
  onCallOn: () => {},
  onEndSession: () => {},
};

describe('runReactionLoop', () => {
  it('processes send_message tool calls', async () => {
    const received = [];
    const agents = [makeAgent('mod', 'Maude', true)];

    const llm = vi.fn(async () => ({
      toolCalls: [{ name: 'send_message', args: { text: 'Hello!' } }],
    }));

    await runReactionLoop({
      agents,
      messages: [{ role: 'user', content: 'Hi' }],
      callbacks: { ...noopCallbacks, onMessage: (msg) => received.push(msg) },
      llm,
    });

    expect(received.length).toBe(1);
    expect(received[0].content).toBe('Hello!');
    expect(received[0].memberName).toBe('Maude');
  });

  it('processes stay_silent tool calls', async () => {
    const received = [];
    const agents = [
      makeAgent('mod', 'Maude', true),
      makeAgent('strat', 'The Strategist'),
    ];

    const llm = vi.fn(async (system) => {
      if (system.includes('Maude')) return { toolCalls: [{ name: 'send_message', args: { text: 'Welcome' } }] };
      return { toolCalls: [{ name: 'stay_silent', args: {} }] };
    });

    await runReactionLoop({
      agents,
      messages: [{ role: 'user', content: 'Hi' }],
      callbacks: { ...noopCallbacks, onMessage: (msg) => received.push(msg) },
      llm,
    });

    expect(received.length).toBe(1);
    expect(received[0].memberName).toBe('Maude');
  });

  it('processes move_to_phase tool calls', async () => {
    let newPhase = null;
    const agents = [makeAgent('mod', 'Maude', true)];

    const llm = vi.fn(async () => ({
      toolCalls: [{ name: 'move_to_phase', args: { phase: 'exercise', transition_message: 'Moving on!' } }],
    }));

    await runReactionLoop({
      agents,
      messages: [{ role: 'user', content: 'Ready' }],
      callbacks: { ...noopCallbacks, onMessage: () => {}, onPhaseChange: (p) => { newPhase = p; } },
      llm,
    });

    expect(newPhase).toBe('exercise');
  });

  it('processes call_on tool calls', async () => {
    let calledMember = null;
    const agents = [makeAgent('mod', 'Maude', true)];

    const llm = vi.fn(async () => ({
      toolCalls: [{ name: 'call_on', args: { member: 'The Connector', prompt: 'What do you think?' } }],
    }));

    await runReactionLoop({
      agents,
      messages: [{ role: 'user', content: 'Hmm' }],
      callbacks: { ...noopCallbacks, onMessage: () => {}, onCallOn: (m) => { calledMember = m; } },
      llm,
    });

    expect(calledMember).toBe('The Connector');
  });

  it('passes tools to llm callback', async () => {
    const agents = [makeAgent('mod', 'Maude', true)];

    const llm = vi.fn(async (_sys, _msgs, _model, tools) => {
      // Moderator should get extra tools
      const toolNames = tools.map(t => t.function.name);
      expect(toolNames).toContain('send_message');
      expect(toolNames).toContain('stay_silent');
      expect(toolNames).toContain('move_to_phase');
      expect(toolNames).toContain('call_on');
      return { toolCalls: [{ name: 'stay_silent', args: {} }] };
    });

    await runReactionLoop({
      agents,
      messages: [{ role: 'user', content: 'Hi' }],
      callbacks: noopCallbacks,
      llm,
    });
  });
});
