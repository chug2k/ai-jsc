/**
 * Council Engine — multi-agent reactive conversation with claim loop.
 *
 * Flow per user message:
 * 1. All agents do a cheap nano filter call in parallel (speak/silent)
 * 2. First agent who wants to speak does full inference
 * 3. Their message is added to conversation
 * 4. Remaining agents re-evaluate with nano (seeing the new message)
 * 5. Repeat until no one wants to speak or max iterations hit
 *
 * This naturally produces organic pacing — agents riff off each other,
 * and the conversation self-regulates as points get covered.
 */

import { getToolsForAgent, parseToolCall, FILTER_TOOLS, parseFilterCall, type AgentAction, type ToolCall } from './tools';

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
  filterModel?: string;
  reasoningEffort?: 'low' | 'medium' | 'high';
  buildSystemPrompt: () => string;
  buildFilterPrompt: () => string;
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
  llm: (systemPrompt: string, messages: AgentMessage[], model?: string, tools?: unknown[], options?: { reasoningEffort?: 'low' | 'medium' | 'high' }) => Promise<{ toolCalls?: ToolCall[]; text?: string; latencyMs?: number }>;
  maxResponses?: number;
  moderatorOnly?: boolean;
  replyToMember?: string;
}

export async function runReactionLoop(config: CouncilEngineConfig): Promise<AgentMessage[]> {
  const { agents, callbacks, llm, maxResponses = 6, moderatorOnly = false, replyToMember } = config;
  const messages = [...config.messages];
  const activeAgents = moderatorOnly ? agents.filter(a => a.isModerator) : agents;
  const allNewMessages: AgentMessage[] = [];

  // Track who has spoken this turn — each agent speaks at most once
  const spoken = new Set<string>();

  /** Process all actions from an agent. Handles multi-tool-call responses
   *  (e.g. Maude can move_to_phase AND call_on in one turn). */
  const processAgentActions = async (agent: CouncilAgent, actions: AgentAction[]) => {
    for (const action of actions) {
      if (action.type === 'silent') {
        console.log(`[engine] ${agent.name}: stay_silent`);
        continue;
      }

      const msg = processAction(action, agent, callbacks);
      if (msg) {
        messages.push(msg);
        allNewMessages.push(msg);
        console.log(`[engine] ${agent.name}: ${action.type} (${msg.content.length} chars)`);
      }

      // If call_on, give called members direct claims
      if (action.type === 'call_on' && action.members && action.members.length > 0) {
        for (const calledName of action.members) {
          if (allNewMessages.length >= maxResponses) break;
          const calledAgent = activeAgents.find(a =>
            a.name === calledName || a.name.toLowerCase().includes(calledName.toLowerCase()),
          );
          if (!calledAgent || spoken.has(calledAgent.id)) continue;

          const callHint = `Maude called on you to speak. The prompt was: "${action.text || ''}". You MUST respond — do not use stay_silent.`;
          const calledActions = await evaluateAgent(calledAgent, messages, llm, callHint);
          spoken.add(calledAgent.id);
          await processAgentActions(calledAgent, calledActions);
        }
      }
    }
  };

  // If user replied to a specific member, they skip the filter and go first
  if (replyToMember) {
    const agent = activeAgents.find(a => a.id === replyToMember);
    if (agent) {
      const actions = await evaluateAgent(agent, messages, llm, `The user replied directly to YOUR message. You MUST respond.`);
      spoken.add(agent.id);
      await processAgentActions(agent, actions);
    }
  }

  // Claim loop — max 4 iterations to prevent runaway
  const MAX_ROUNDS = 4;
  for (let round = 0; round < MAX_ROUNDS; round++) {
    if (allNewMessages.length >= maxResponses) break;

    const eligible = activeAgents.filter(a => !spoken.has(a.id));
    if (eligible.length === 0) break;

    const filterResults = await Promise.all(
      eligible.map(async (agent) => {
        const result = await filterAgent(agent, messages, llm);
        return { agent, ...result };
      }),
    );

    const candidates = filterResults.filter(r => r.wantsToSpeak);
    if (candidates.length === 0) {
      console.log(`[engine] Round ${round + 1}: no one wants to speak. Done.`);
      break;
    }

    console.log(`[engine] Round ${round + 1}: ${candidates.map(c => c.agent.name).join(', ')} want to speak`);

    const { agent, reason } = candidates[0];
    const hint = reason ? `You decided to speak because: "${reason}". Now compose your response from your lens.` : undefined;
    const actions = await evaluateAgent(agent, messages, llm, hint);
    spoken.add(agent.id);

    // Check if all actions are silent
    if (actions.every(a => a.type === 'silent')) {
      console.log(`[engine] ${agent.name}: changed mind, stay_silent`);
      continue;
    }

    await processAgentActions(agent, actions);

    // Loop back — remaining agents will re-evaluate with the new message
  }

  // If no agents responded at all, surface an error so the user isn't left staring at nothing
  if (allNewMessages.length === 0) {
    const errorMsg: AgentMessage = {
      role: 'assistant',
      content: 'The council is having a technical issue. Please try sending your message again.',
      memberName: null,
    };
    callbacks.onMessage(errorMsg);
    allNewMessages.push(errorMsg);
  }

  return allNewMessages;
}

type LLMFn = (systemPrompt: string, messages: AgentMessage[], model?: string, tools?: unknown[], options?: { reasoningEffort?: 'low' | 'medium' | 'high' }) => Promise<{ toolCalls?: ToolCall[]; text?: string; latencyMs?: number }>;

/** Nano pre-filter: cheap model decides if agent should speak */
async function filterAgent(
  agent: CouncilAgent,
  messages: AgentMessage[],
  llm: LLMFn,
): Promise<{ wantsToSpeak: boolean; reason?: string }> {
  try {
    const filterPrompt = agent.buildFilterPrompt();
    // No reasoning_effort for nano filter — not supported with function tools
    const result = await llm(filterPrompt, messages.slice(-10), agent.filterModel, FILTER_TOOLS);

    if (result.latencyMs) {
      console.log(`[engine] ${agent.name} filter: ${result.latencyMs}ms`);
    }

    if (result.toolCalls && result.toolCalls.length > 0) {
      return parseFilterCall(result.toolCalls[0]);
    }
    return { wantsToSpeak: false };
  } catch (err) {
    console.warn(`[engine] ${agent.name} filter failed:`, err);
    return { wantsToSpeak: false };
  }
}

/** Full inference: agent composes their response with all tools. Returns all actions (model may emit multiple tool calls). */
async function evaluateAgent(
  agent: CouncilAgent,
  messages: AgentMessage[],
  llm: LLMFn,
  hint?: string,
): Promise<AgentAction[]> {
  try {
    let systemPrompt = agent.buildSystemPrompt();

    if (hint) {
      systemPrompt += `\n\n${hint}`;
    }

    const tools = getToolsForAgent(agent.isModerator);
    const result = await llm(systemPrompt, messages, agent.model, tools, agent.reasoningEffort ? { reasoningEffort: agent.reasoningEffort } : undefined);

    if (result.latencyMs) {
      console.log(`[engine] ${agent.name} inference: ${result.latencyMs}ms`);
    }

    if (result.toolCalls && result.toolCalls.length > 0) {
      return result.toolCalls.map(tc => parseToolCall(tc));
    }

    if (result.text) {
      return [{ type: 'message', text: result.text }];
    }

    return [{ type: 'silent' }];
  } catch (err) {
    console.warn(`[engine] ${agent.name} failed:`, err);
    return [{ type: 'silent' }];
  }
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
        // Don't emit a message for commitment recording — Maude should
        // acknowledge naturally via a separate send_message tool call.
        return null;
      }
      return null;

    case 'call_on':
      if ((action.member || action.members?.length) && action.text) {
        const callMsg: AgentMessage = { role: 'assistant', content: action.text, memberName: agent.name };
        callbacks.onMessage(callMsg);
        const calledName = action.members?.[0] || action.member || '';
        callbacks.onCallOn(calledName, action.text);
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
