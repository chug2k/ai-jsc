/**
 * Council Engine — multi-agent reactive conversation.
 *
 * All agents (including the moderator) evaluate in parallel and
 * independently decide whether to respond. Their responses trigger
 * another round of evaluation.
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
  /** Only let the moderator speak (used for session init). */
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
    // All agents evaluate in parallel — everyone sees the same state
    const results = await Promise.all(
      activeAgents.map(async (agent) => {
        const text = await evaluateAgent(agent, messages, llm);
        if (text) return { agent, text };
        return null;
      })
    );

    // Collect responses, moderator first for consistent ordering
    const roundMessages: AgentMessage[] = [];
    const ordered = results.filter(Boolean).sort((a, b) => {
      // Moderator's response appears first if they spoke
      if (a!.agent.isModerator) return -1;
      if (b!.agent.isModerator) return 1;
      return 0;
    });

    for (const result of ordered) {
      if (result && totalResponses < maxResponses) {
        const msg: AgentMessage = {
          role: 'assistant',
          content: result.text,
          memberName: result.agent.name,
        };
        messages.push(msg);
        roundMessages.push(msg);
        allNewMessages.push(msg);
        onMessage(msg);
        totalResponses++;
      }
    }

    // Nobody spoke — we're done
    if (roundMessages.length === 0) break;

    // Only the moderator spoke and no one else — don't loop, wait for user
    const moderator = agents.find(a => a.isModerator);
    if (roundMessages.length === 1 && roundMessages[0].memberName === moderator?.name) break;
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
    console.log(`[engine] ${agent.name}: raw response = "${String(text).substring(0, 80)}"`);
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
