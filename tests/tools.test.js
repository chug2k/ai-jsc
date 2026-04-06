import { describe, it, expect } from 'vitest';
import { getToolsForAgent, parseToolCall, parseFilterCall, FILTER_TOOLS } from '@/lib/council/tools';

describe('tools', () => {
  it('base agents get 3 tools', () => {
    const tools = getToolsForAgent(false);
    const names = tools.map(t => t.function.name);
    expect(names).toContain('send_message');
    expect(names).toContain('reply_to');
    expect(names).toContain('stay_silent');
    expect(names).not.toContain('move_to_phase');
  });

  it('moderator gets extra tools', () => {
    const tools = getToolsForAgent(true);
    const names = tools.map(t => t.function.name);
    expect(names).toContain('send_message');
    expect(names).toContain('move_to_phase');
    expect(names).toContain('create_commitment');
    expect(names).toContain('call_on');
    expect(names).toContain('end_session');
  });

  it('call_on tool accepts members array', () => {
    const tools = getToolsForAgent(true);
    const callOn = tools.find(t => t.function.name === 'call_on');
    expect(callOn.function.parameters.properties.members.type).toBe('array');
  });
});

describe('parseToolCall', () => {
  it('parses send_message', () => {
    const action = parseToolCall({ name: 'send_message', args: { text: 'hello' } });
    expect(action.type).toBe('message');
    expect(action.text).toBe('hello');
  });

  it('parses reply_to', () => {
    const action = parseToolCall({ name: 'reply_to', args: { member: 'Eli', quote: 'something', text: 'I agree' } });
    expect(action.type).toBe('reply');
    expect(action.member).toBe('Eli');
  });

  it('parses stay_silent', () => {
    const action = parseToolCall({ name: 'stay_silent', args: {} });
    expect(action.type).toBe('silent');
  });

  it('parses move_to_phase', () => {
    const action = parseToolCall({ name: 'move_to_phase', args: { phase: 'exercise', transition_message: 'Moving on' } });
    expect(action.type).toBe('move_phase');
    expect(action.phase).toBe('exercise');
    expect(action.text).toBe('Moving on');
  });

  it('parses call_on with members array', () => {
    const action = parseToolCall({ name: 'call_on', args: { members: ['Eli', 'Rina'], prompt: 'Weigh in' } });
    expect(action.type).toBe('call_on');
    expect(action.members).toEqual(['Eli', 'Rina']);
    expect(action.text).toBe('Weigh in');
  });

  it('parses call_on with legacy single member field', () => {
    const action = parseToolCall({ name: 'call_on', args: { member: 'Eli', prompt: 'What do you think?' } });
    expect(action.type).toBe('call_on');
    expect(action.members).toEqual(['Eli']);
  });

  it('unknown tool returns silent', () => {
    const action = parseToolCall({ name: 'unknown_tool', args: {} });
    expect(action.type).toBe('silent');
  });
});

describe('filter tools', () => {
  it('FILTER_TOOLS has speak and stay_silent', () => {
    const names = FILTER_TOOLS.map(t => t.function.name);
    expect(names).toContain('speak');
    expect(names).toContain('stay_silent');
    expect(names).toHaveLength(2);
  });

  it('parseFilterCall handles speak', () => {
    const result = parseFilterCall({ name: 'speak', args: { reason: 'test reason' } });
    expect(result.wantsToSpeak).toBe(true);
    expect(result.reason).toBe('test reason');
  });

  it('parseFilterCall handles stay_silent', () => {
    const result = parseFilterCall({ name: 'stay_silent', args: {} });
    expect(result.wantsToSpeak).toBe(false);
  });
});
