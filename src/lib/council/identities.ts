/**
 * Agent Identity — the instantiated facts of a council agent.
 *
 * A soul defines personality (immutable, in codebase).
 * An identity defines who this instance IS (name, age, industry, background).
 * Together they form a complete agent.
 */

export interface AgentIdentity {
  id: string;
  soul_id: string;
  name: string;
  emoji: string;
  color: string;
  role_title: string;
  age?: number;
  industry?: string;
  years_exp?: number;
  background?: string;
  is_fixed: boolean;
  is_moderator: boolean;
  reasoning_effort?: 'low' | 'medium' | 'high';
}

/**
 * Default identities for archetypes — used as fallbacks when no DB identity exists.
 * These match the current roster.ts names so the app works without migration.
 */
/**
 * Reasoning effort per archetype:
 * - Analytical agents (Strategist, DA) get 'medium' — deeper thinking improves insight quality
 * - Procedural agents (Maude, Operator, Connector) get none — their jobs are tactical, not analytical
 * - Emotional agents (Witness) get none — observation doesn't benefit from extended reasoning
 *
 * Based on A/B testing: medium reasoning on DA/Strategist produced noticeably sharper
 * insights ("not a rejection of people work, but a rejection of being assigned the least
 * powerful version of it") at ~2x latency cost, which is acceptable since members respond
 * after Maude is already on screen.
 */
export const DEFAULT_IDENTITIES: Record<string, Omit<AgentIdentity, 'id'>> = {
  facilitator: {
    soul_id: 'facilitator',
    name: 'Maude',
    emoji: '📋',
    color: '#4ade80',
    role_title: 'Council Moderator',
    is_fixed: true,
    is_moderator: true,
    // No reasoning — Maude's job is procedural orchestration
  },
  strategist: {
    soul_id: 'strategist',
    name: 'The Strategist',
    emoji: '🗺️',
    color: '#818cf8',
    role_title: 'Career Arc Advisor',
    is_fixed: false,
    is_moderator: false,
    reasoning_effort: 'medium',  // Analytical — benefits from deeper thinking
  },
  operator: {
    soul_id: 'operator',
    name: 'The Operator',
    emoji: '⚙️',
    color: '#f59e0b',
    role_title: 'Action Partner',
    is_fixed: false,
    is_moderator: false,
    // No reasoning — tactical action steps don't need extended thinking
  },
  devils_advocate: {
    soul_id: 'devils_advocate',
    name: "The Devil's Advocate",
    emoji: '😈',
    color: '#ef4444',
    role_title: 'Assumption Checker',
    is_fixed: false,
    is_moderator: false,
    reasoning_effort: 'medium',  // Analytical — finding untested assumptions benefits from reasoning
  },
  recruiter: {
    soul_id: 'recruiter',
    name: 'The Market Mirror',
    emoji: '🔍',
    color: '#22d3ee',
    role_title: 'Outside-In Lens',
    is_fixed: false,
    is_moderator: false,
    // No reasoning — market reads are pattern-matching, not deep analysis
  },
  founder: {
    soul_id: 'founder',
    name: 'The Founder',
    emoji: '🚀',
    color: '#a3e635',
    role_title: 'Startup Instinct',
    is_fixed: false,
    is_moderator: false,
    // No reasoning — founder instinct is fast, not deliberate
  },
  therapist: {
    soul_id: 'therapist',
    name: 'The Witness',
    emoji: '🪞',
    color: '#e879f9',
    role_title: 'Emotional Compass',
    is_fixed: false,
    is_moderator: false,
    // No reasoning — emotional observation is about noticing, not analyzing
  },
  network: {
    soul_id: 'network',
    name: 'The Connector',
    emoji: '🕸️',
    color: '#fb923c',
    role_title: 'Network Activator',
    is_fixed: false,
    is_moderator: false,
    // No reasoning — connection suggestions are tactical
  },
};

/** Create a default AgentIdentity from a soul ID (no DB required). */
export function defaultIdentity(soulId: string): AgentIdentity {
  const base = DEFAULT_IDENTITIES[soulId];
  if (!base) {
    return {
      id: soulId,
      soul_id: soulId,
      name: soulId,
      emoji: '🎭',
      color: '#818cf8',
      role_title: 'Council Member',
      is_fixed: false,
      is_moderator: false,
    };
  }
  return { id: soulId, ...base };
}

/** Format identity context for injection into a prompt. */
export function formatIdentityContext(identity: AgentIdentity): string {
  const parts: string[] = [];
  parts.push(`Name: ${identity.name}`);
  parts.push(`Role: ${identity.role_title}`);
  if (identity.age) parts.push(`Age: ${identity.age}`);
  if (identity.industry) parts.push(`Industry: ${identity.industry}`);
  if (identity.years_exp) parts.push(`Experience: ${identity.years_exp} years`);
  if (identity.background) parts.push(`Background: ${identity.background}`);
  return parts.join('\n');
}
