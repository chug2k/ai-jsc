/**
 * Council Engine — multi-agent reactive conversation.
 *
 * Each council member is an independent agent that shares a message store.
 * When a new message appears, all agents evaluate in parallel and decide
 * whether to respond. Their responses trigger another round of evaluation.
 *
 * The moderator (Maude) always evaluates first to set the tone and guide
 * the session. Other agents evaluate in parallel after her.
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
  /** Called each time an agent produces a message. Use to update UI / persist. */
  onMessage: (msg: AgentMessage) => void;
  /** The LLM call. Returns the text response. */
  llm: (systemPrompt: string, messages: AgentMessage[]) => Promise<string>;
  /** Max total agent messages per user message. Safety valve. Default 8. */
  maxResponses?: number;
  /** Only let the moderator speak (used for session init). */
  moderatorOnly?: boolean;
}

const SKIP_TOKEN = 'SKIP';

function isSkip(text: string): boolean {
  return text.trim().toUpperCase() === SKIP_TOKEN;
}


/**
 * Run one reaction cycle: a user (or agent) message just landed.
 * Moderator evaluates first, then all others in parallel.
 * Repeat until nobody has anything to say (or we hit the cap).
 */
export async function runReactionLoop(config: CouncilEngineConfig): Promise<AgentMessage[]> {
  const { agents, onMessage, llm, maxResponses = 8, moderatorOnly = false } = config;
  const messages = [...config.messages];
  const moderator = agents.find(a => a.isModerator);
  const members = moderatorOnly ? [] : agents.filter(a => !a.isModerator);
  let totalResponses = 0;
  const allNewMessages: AgentMessage[] = [];

  while (totalResponses < maxResponses) {
    const roundMessages: AgentMessage[] = [];

    // 1. Moderator evaluates first
    if (moderator && totalResponses < maxResponses) {
      const text = await evaluateAgent(moderator, messages, llm);
      if (text) {
        const msg: AgentMessage = { role: 'assistant', content: text, memberName: moderator.name };
        messages.push(msg);
        roundMessages.push(msg);
        allNewMessages.push(msg);
        onMessage(msg);
        totalResponses++;
      }
    }

    // 2. All other agents evaluate in parallel
    if (members.length > 0 && totalResponses < maxResponses) {
      const results = await Promise.all(
        members.map(async (agent) => {
          const text = await evaluateAgent(agent, messages, llm);
          if (text) return { agent, text };
          return null;
        })
      );

      for (const result of results) {
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
    }

    // 3. If nobody spoke this round, we're done
    if (roundMessages.length === 0) break;

    // 4. If only the moderator spoke and no members chimed in, we're done
    //    (prevents Maude from talking to herself in a loop)
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
    if (!text || isSkip(text)) return null;
    return text;
  } catch (err) {
    console.warn(`Agent ${agent.name} failed:`, err);
    return null;
  }
}
