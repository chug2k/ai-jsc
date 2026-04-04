/**
 * Council Engine — multi-agent reactive conversation.
 *
 * All agents evaluate independently. Before an agent's response is
 * accepted, we check if the message store changed underneath them.
 * If it did, the response is stale — discard it and re-evaluate.
 */

export interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
  memberName?: string | null;
}

export interface CouncilAgent {
  id: string;
  name: string;
  isModerator: boolean;
  buildSystemPrompt: () => string;
}

export interface CouncilEngineConfig {
  agents: CouncilAgent[];
  messages: AgentMessage[];
  onMessage: (msg: AgentMessage) => void;
  llm: (systemPrompt: string, messages: AgentMessage[]) => Promise<string>;
  maxResponses?: number;
  moderatorOnly?: boolean;
}

const SKIP_TOKEN = 'SKIP';

function isSkip(text: string): boolean {
  return text.trim().toUpperCase() === SKIP_TOKEN;
}

export async function runReactionLoop(config: CouncilEngineConfig): Promise<AgentMessage[]> {
  const { agents, onMessage, llm, maxResponses = 8, moderatorOnly = false } = config;
  const messages = [...config.messages];
  const activeAgents = moderatorOnly ? agents.filter(a => a.isModerator) : agents;
  const allNewMessages: AgentMessage[] = [];

  // Track which agents still need to evaluate
  const pending = new Set(activeAgents.map(a => a.id));

  while (pending.size > 0 && allNewMessages.length < maxResponses) {
    // Snapshot the current message count — agents evaluate against this state
    const snapshotLength = messages.length;

    // Fire all pending agents
    const evaluations = [...pending].map(async (agentId) => {
      const agent = activeAgents.find(a => a.id === agentId)!;
      const text = await evaluateAgent(agent, messages, llm);
      return { agent, text, snapshotLength };
    });

    // Process results as they arrive
    let anyAccepted = false;
    for (const evalPromise of evaluations) {
      const { agent, text, snapshotLength: evalSnapshot } = await evalPromise;

      // Remove from pending regardless — they've had their chance
      pending.delete(agent.id);

      if (!text) continue; // SKIPped

      // Check if messages changed since this agent started evaluating
      if (messages.length !== evalSnapshot) {
        // Context changed — this response is stale. Re-queue for another round.
        console.log(`[engine] ${agent.name}: stale (messages changed ${evalSnapshot} → ${messages.length}), re-queuing`);
        pending.add(agent.id);
        continue;
      }

      // Accept the response
      const msg: AgentMessage = {
        role: 'assistant',
        content: text,
        memberName: agent.name,
      };
      messages.push(msg);
      allNewMessages.push(msg);
      onMessage(msg);
      anyAccepted = true;

      console.log(`[engine] ${agent.name}: responded (${text.length} chars)`);

      if (allNewMessages.length >= maxResponses) break;
    }

    // If nobody was accepted or re-queued, we're done
    if (!anyAccepted && pending.size === 0) break;
  }

  return allNewMessages;
}

async function evaluateAgent(
  agent: CouncilAgent,
  messages: AgentMessage[],
  llm: (systemPrompt: string, messages: AgentMessage[]) => Promise<string>,
): Promise<string | null> {
  try {
    const systemPrompt = agent.buildSystemPrompt();
    const text = await llm(systemPrompt, messages);
    if (!text || isSkip(text)) {
      console.log(`[engine] ${agent.name}: SKIP`);
      return null;
    }
    return text;
  } catch (err) {
    console.warn(`[engine] ${agent.name} failed:`, err);
    return null;
  }
}
