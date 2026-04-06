import { describe, it, expect, vi } from 'vitest';
import { runReactionLoop } from '@/lib/council/engine';

function makeAgent(id, name, isModerator = false) {
  return {
    id,
    name,
    isModerator,
    model: 'test-model',
    filterModel: 'test-filter-model',
    buildSystemPrompt: () => `You are ${name}.`,
    buildFilterPrompt: () => `Should ${name} speak?`,
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

    // Filter says speak, inference returns send_message
    const llm = vi.fn(async (_sys, _msgs, model) => {
      if (model === 'test-filter-model') return { toolCalls: [{ name: 'speak', args: { reason: 'test' } }] };
      return { toolCalls: [{ name: 'send_message', args: { text: 'Hello!' } }] };
    });

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

  it('processes stay_silent from filter', async () => {
    const received = [];
    const agents = [makeAgent('mod', 'Maude', true)];

    // Filter says silent — inference should never be called
    const llm = vi.fn(async (_sys, _msgs, model) => {
      if (model === 'test-filter-model') return { toolCalls: [{ name: 'stay_silent', args: {} }] };
      throw new Error('Should not reach inference');
    });

    await runReactionLoop({
      agents,
      messages: [{ role: 'user', content: 'Hi' }],
      callbacks: { ...noopCallbacks, onMessage: (msg) => received.push(msg) },
      llm,
    });

    expect(received.length).toBe(0);
  });

  it('processes move_to_phase tool calls', async () => {
    let newPhase = null;
    const agents = [makeAgent('mod', 'Maude', true)];

    const llm = vi.fn(async (_sys, _msgs, model) => {
      if (model === 'test-filter-model') return { toolCalls: [{ name: 'speak', args: { reason: 'transition' } }] };
      return { toolCalls: [{ name: 'move_to_phase', args: { phase: 'exercise', transition_message: 'Moving on!' } }] };
    });

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

    const llm = vi.fn(async (_sys, _msgs, model) => {
      if (model === 'test-filter-model') return { toolCalls: [{ name: 'speak', args: { reason: 'call' } }] };
      return { toolCalls: [{ name: 'call_on', args: { members: ['The Connector'], prompt: 'What do you think?' } }] };
    });

    await runReactionLoop({
      agents,
      messages: [{ role: 'user', content: 'Hmm' }],
      callbacks: { ...noopCallbacks, onMessage: () => {}, onCallOn: (m) => { calledMember = m; } },
      llm,
    });

    expect(calledMember).toBe('The Connector');
  });

  it('passes tools to llm callback for inference (not filter)', async () => {
    const agents = [makeAgent('mod', 'Maude', true)];
    const toolsReceived = [];

    const llm = vi.fn(async (_sys, _msgs, model, tools) => {
      if (model === 'test-filter-model') {
        // Filter tools should have speak/stay_silent
        return { toolCalls: [{ name: 'speak', args: { reason: 'test' } }] };
      }
      // Inference tools should have moderator tools
      toolsReceived.push(...(tools || []).map(t => t.function.name));
      return { toolCalls: [{ name: 'stay_silent', args: {} }] };
    });

    await runReactionLoop({
      agents,
      messages: [{ role: 'user', content: 'Hi' }],
      callbacks: noopCallbacks,
      llm,
    });

    expect(toolsReceived).toContain('send_message');
    expect(toolsReceived).toContain('stay_silent');
    expect(toolsReceived).toContain('move_to_phase');
    expect(toolsReceived).toContain('call_on');
  });
});
