/**
 * Council Engine — multi-agent reactive conversation with tool calling.
 *
 * Agents use tools (send_message, reply_to, stay_silent, etc.) to take
 * actions. The moderator gets additional tools (move_to_phase, call_on, etc.)
 */

import { getToolsForAgent, parseToolCall, type AgentAction, type ToolCall } from './tools';

export interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
  memberName?: string | null;
  replyTo?: { memberName: string | null; content: string; index: number } | null;
}

export interface CouncilAgent {
  id: string;
  name: string;
  isModerator: boolean;
  model?: string;
  buildSystemPrompt: () => string;
}

export interface EngineCallbacks {
  onMessage: (msg: AgentMessage) => void;
  onPhaseChange: (phase: string, message: string) => void;
  onCommitment: (text: string, deadline?: string) => void;
  onCallOn: (memberName: string, prompt: string) => void;
  onEndSession: (message: string) => void;
}

export interface CouncilEngineConfig {
  agents: CouncilAgent[];
  messages: AgentMessage[];
  callbacks: EngineCallbacks;
  llm: (systemPrompt: string, messages: AgentMessage[], model?: string, tools?: unknown[]) => Promise<{ toolCalls?: ToolCall[]; text?: string }>;
  maxResponses?: number;
  moderatorOnly?: boolean;
  replyToMember?: string;
}

export async function runReactionLoop(config: CouncilEngineConfig): Promise<AgentMessage[]> {
  const { agents, callbacks, llm, maxResponses = 8, moderatorOnly = false, replyToMember } = config;
  const messages = [...config.messages];
  const activeAgents = moderatorOnly ? agents.filter(a => a.isModerator) : agents;
  const allNewMessages: AgentMessage[] = [];

  const pending = new Set(activeAgents.map(a => a.id));
  const staleDrafts = new Map<string, string>();

  // If replying to a specific member, let them go first
  if (replyToMember && pending.has(replyToMember)) {
    const agent = activeAgents.find(a => a.id === replyToMember);
    if (agent) {
      const action = await evaluateAgent(agent, messages, llm, undefined, true);
      pending.delete(agent.id);
      const msg = processAction(action, agent, callbacks);
      if (msg) {
        messages.push(msg);
        allNewMessages.push(msg);
        console.log(`[engine] ${agent.name}: replied first (${action.type})`);
      }
    }
  }

  while (pending.size > 0 && allNewMessages.length < maxResponses) {
    const snapshotLength = messages.length;

    const evaluations = [...pending].map(async (agentId) => {
      const agent = activeAgents.find(a => a.id === agentId)!;
      const staleDraft = staleDrafts.get(agentId);
      const action = await evaluateAgent(agent, messages, llm, staleDraft);
      return { agent, action, snapshotLength };
    });

    let anyAccepted = false;
    for (const evalPromise of evaluations) {
      const { agent, action, snapshotLength: evalSnapshot } = await evalPromise;
      pending.delete(agent.id);
      staleDrafts.delete(agent.id);

      if (action.type === 'silent') {
        console.log(`[engine] ${agent.name}: stay_silent`);
        continue;
      }

      if (messages.length !== evalSnapshot) {
        console.log(`[engine] ${agent.name}: stale, re-queuing`);
        pending.add(agent.id);
        if (action.text) staleDrafts.set(agent.id, action.text);
        continue;
      }

      const msg = processAction(action, agent, callbacks);
      if (msg) {
        messages.push(msg);
        allNewMessages.push(msg);
        anyAccepted = true;
        console.log(`[engine] ${agent.name}: ${action.type} (${msg.content.length} chars)`);
      }

      if (allNewMessages.length >= maxResponses) break;
    }

    if (!anyAccepted && pending.size === 0) break;
  }

  return allNewMessages;
}

/** Process an agent action and return a message (if applicable) */
function processAction(action: AgentAction, agent: CouncilAgent, callbacks: EngineCallbacks): AgentMessage | null {
  switch (action.type) {
    case 'message':
      if (!action.text) return null;
      const msg: AgentMessage = { role: 'assistant', content: action.text, memberName: agent.name };
      callbacks.onMessage(msg);
      return msg;

    case 'reply':
      if (!action.text) return null;
      const replyMsg: AgentMessage = {
        role: 'assistant',
        content: action.text,
        memberName: agent.name,
        replyTo: action.member ? { memberName: action.member, content: action.quote || '', index: -1 } : null,
      };
      callbacks.onMessage(replyMsg);
      return replyMsg;

    case 'move_phase':
      if (action.text) {
        const phaseMsg: AgentMessage = { role: 'assistant', content: action.text, memberName: agent.name };
        callbacks.onMessage(phaseMsg);
        if (action.phase) callbacks.onPhaseChange(action.phase, action.text);
        return phaseMsg;
      }
      if (action.phase) callbacks.onPhaseChange(action.phase, '');
      return null;

    case 'commitment':
      if (action.text) {
        callbacks.onCommitment(action.text, action.deadline);
        const commitMsg: AgentMessage = {
          role: 'assistant',
          content: `✅ Commitment recorded: ${action.text}${action.deadline ? ` (by ${action.deadline})` : ''}`,
          memberName: agent.name,
        };
        callbacks.onMessage(commitMsg);
        return commitMsg;
      }
      return null;

    case 'call_on':
      if (action.member && action.text) {
        const callMsg: AgentMessage = { role: 'assistant', content: action.text, memberName: agent.name };
        callbacks.onMessage(callMsg);
        callbacks.onCallOn(action.member, action.text);
        return callMsg;
      }
      return null;

    case 'end_session':
      if (action.text) {
        const endMsg: AgentMessage = { role: 'assistant', content: action.text, memberName: agent.name };
        callbacks.onMessage(endMsg);
        callbacks.onEndSession(action.text);
        return endMsg;
      }
      callbacks.onEndSession('');
      return null;

    case 'silent':
    default:
      return null;
  }
}

async function evaluateAgent(
  agent: CouncilAgent,
  messages: AgentMessage[],
  llm: (systemPrompt: string, messages: AgentMessage[], model?: string, tools?: unknown[]) => Promise<{ toolCalls?: ToolCall[]; text?: string }>,
  staleDraft?: string,
  isRepliedTo?: boolean,
): Promise<AgentAction> {
  try {
    let systemPrompt = agent.buildSystemPrompt();

    if (isRepliedTo) {
      systemPrompt += `\n\nIMPORTANT: The user replied directly to YOUR message. You MUST respond using send_message or reply_to — do not use stay_silent.`;
    }

    if (staleDraft) {
      systemPrompt += `\n\nNOTE: You were about to say: "${staleDraft}" — but new messages arrived. If your point is still relevant, send it (reworded if needed). If someone covered it, use stay_silent.`;
    }

    const tools = getToolsForAgent(agent.isModerator);
    const result = await llm(systemPrompt, messages, agent.model, tools);

    if (result.toolCalls && result.toolCalls.length > 0) {
      return parseToolCall(result.toolCalls[0]);
    }

    // Fallback: plain text (shouldn't happen with tool_choice: required)
    if (result.text) {
      return { type: 'message', text: result.text };
    }

    return { type: 'silent' };
  } catch (err) {
    console.warn(`[engine] ${agent.name} failed:`, err);
    return { type: 'silent' };
  }
}
