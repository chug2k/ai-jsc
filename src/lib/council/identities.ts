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
}

/**
 * Default identities for archetypes — used as fallbacks when no DB identity exists.
 * These match the current roster.ts names so the app works without migration.
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
  },
  strategist: {
    soul_id: 'strategist',
    name: 'The Strategist',
    emoji: '🗺️',
    color: '#818cf8',
    role_title: 'Career Arc Advisor',
    is_fixed: false,
    is_moderator: false,
  },
  operator: {
    soul_id: 'operator',
    name: 'The Operator',
    emoji: '⚙️',
    color: '#f59e0b',
    role_title: 'Action Partner',
    is_fixed: false,
    is_moderator: false,
  },
  devils_advocate: {
    soul_id: 'devils_advocate',
    name: "The Devil's Advocate",
    emoji: '😈',
    color: '#ef4444',
    role_title: 'Assumption Checker',
    is_fixed: false,
    is_moderator: false,
  },
  recruiter: {
    soul_id: 'recruiter',
    name: 'The Market Mirror',
    emoji: '🔍',
    color: '#22d3ee',
    role_title: 'Outside-In Lens',
    is_fixed: false,
    is_moderator: false,
  },
  founder: {
    soul_id: 'founder',
    name: 'The Founder',
    emoji: '🚀',
    color: '#a3e635',
    role_title: 'Startup Instinct',
    is_fixed: false,
    is_moderator: false,
  },
  therapist: {
    soul_id: 'therapist',
    name: 'The Witness',
    emoji: '🪞',
    color: '#e879f9',
    role_title: 'Emotional Compass',
    is_fixed: false,
    is_moderator: false,
  },
  network: {
    soul_id: 'network',
    name: 'The Connector',
    emoji: '🕸️',
    color: '#fb923c',
    role_title: 'Network Activator',
    is_fixed: false,
    is_moderator: false,
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
