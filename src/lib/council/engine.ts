/**
 * Council Engine — multi-agent reactive conversation.
 *
 * All agents evaluate independently and their responses stream
 * to the UI as they arrive — no batching, no waiting for everyone.
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
  let totalResponses = 0;
  const allNewMessages: AgentMessage[] = [];

  while (totalResponses < maxResponses) {
    let anyoneSpoke = false;

    // Fire all agents independently — each resolves on its own time
    const promises = activeAgents.map(async (agent) => {
      const text = await evaluateAgent(agent, messages, llm);
      if (text && totalResponses < maxResponses) {
        const msg: AgentMessage = {
          role: 'assistant',
          content: text,
          memberName: agent.name,
        };
        // Immediately push to UI as this agent resolves
        messages.push(msg);
        allNewMessages.push(msg);
        onMessage(msg);
        totalResponses++;
        anyoneSpoke = true;
      }
    });

    await Promise.all(promises);

    // One round per user message. Agents react to what's there, then we wait for the user.
    break;
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
    console.log(`[engine] ${agent.name}: responded (${text.length} chars)`);
    return text;
  } catch (err) {
    console.warn(`[engine] ${agent.name} failed:`, err);
    return null;
  }
}
