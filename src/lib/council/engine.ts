/**
 * Council Engine — multi-agent reactive conversation.
 *
 * All agents evaluate independently. Before an agent's response is
 * accepted, we check if the message store changed underneath them.
 * If it did, the response is stale — we re-evaluate with the stale
 * response as context so the agent can decide if it's still relevant.
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
  /** If the user replied to a specific member, that member evaluates first. */
  replyToMember?: string;
}

const SKIP_TOKEN = 'SKIP';

function isSkip(text: string): boolean {
  return text.trim().toUpperCase() === SKIP_TOKEN;
}

export async function runReactionLoop(config: CouncilEngineConfig): Promise<AgentMessage[]> {
  const { agents, onMessage, llm, maxResponses = 8, moderatorOnly = false, replyToMember } = config;
  const messages = [...config.messages];
  const activeAgents = moderatorOnly ? agents.filter(a => a.isModerator) : agents;
  const allNewMessages: AgentMessage[] = [];

  const pending = new Set(activeAgents.map(a => a.id));
  const staleDrafts = new Map<string, string>();

  // If replying to a specific member, let them go first
  if (replyToMember && pending.has(replyToMember)) {
    const agent = activeAgents.find(a => a.id === replyToMember);
    if (agent) {
      const text = await evaluateAgent(agent, messages, llm, undefined, true);
      pending.delete(agent.id);
      if (text) {
        const msg: AgentMessage = { role: 'assistant', content: text, memberName: agent.name };
        messages.push(msg);
        allNewMessages.push(msg);
        onMessage(msg);
        console.log(`[engine] ${agent.name}: replied first (${text.length} chars)`);
      }
    }
  }

  while (pending.size > 0 && allNewMessages.length < maxResponses) {
    const snapshotLength = messages.length;

    const evaluations = [...pending].map(async (agentId) => {
      const agent = activeAgents.find(a => a.id === agentId)!;
      const staleDraft = staleDrafts.get(agentId);
      const text = await evaluateAgent(agent, messages, llm, staleDraft);
      return { agent, text, snapshotLength };
    });

    let anyAccepted = false;
    for (const evalPromise of evaluations) {
      const { agent, text, snapshotLength: evalSnapshot } = await evalPromise;

      pending.delete(agent.id);
      staleDrafts.delete(agent.id);

      if (!text) continue;

      if (messages.length !== evalSnapshot) {
        console.log(`[engine] ${agent.name}: stale (messages changed ${evalSnapshot} → ${messages.length}), re-queuing with draft`);
        pending.add(agent.id);
        staleDrafts.set(agent.id, text); // Save what they were going to say
        continue;
      }

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

    if (!anyAccepted && pending.size === 0) break;
  }

  return allNewMessages;
}

async function evaluateAgent(
  agent: CouncilAgent,
  messages: AgentMessage[],
  llm: (systemPrompt: string, messages: AgentMessage[]) => Promise<string>,
  staleDraft?: string,
  isRepliedTo?: boolean,
): Promise<string | null> {
  try {
    let systemPrompt = agent.buildSystemPrompt();

    if (isRepliedTo) {
      systemPrompt += `\n\nIMPORTANT: The user replied directly to YOUR message. You MUST respond — do not SKIP.`;
    }

    if (staleDraft) {
      systemPrompt += `\n\nNOTE: You were about to say: "${staleDraft}" — but new messages arrived before you could speak. Look at the latest messages. If your point is still relevant and hasn't been covered, you can say it (reworded if needed). If someone else already covered it, say SKIP.`;
    }

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
