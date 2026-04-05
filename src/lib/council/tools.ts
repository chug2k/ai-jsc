/**
 * Tool definitions for council agents.
 *
 * Every agent gets base tools. Maude gets additional moderator tools.
 * These map to OpenAI function calling schemas.
 */

export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
}

export interface AgentAction {
  type: 'message' | 'reply' | 'silent' | 'move_phase' | 'commitment' | 'call_on' | 'end_session';
  text?: string;
  member?: string;
  members?: string[];
  quote?: string;
  phase?: string;
  deadline?: string;
}

/** Base tools available to all agents */
const BASE_TOOLS = [
  {
    type: 'function' as const,
    function: {
      name: 'send_message',
      description: 'Send a message to the group conversation.',
      parameters: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'Your message to the group. 2-4 sentences max.' },
        },
        required: ['text'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'reply_to',
      description: 'Reply to a specific member\'s previous message. Use when you want to directly respond to something someone said.',
      parameters: {
        type: 'object',
        properties: {
          member: { type: 'string', description: 'The name of the member you are replying to.' },
          quote: { type: 'string', description: 'A short excerpt from their message you are responding to.' },
          text: { type: 'string', description: 'Your reply. 2-4 sentences max.' },
        },
        required: ['member', 'quote', 'text'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'stay_silent',
      description: 'Choose not to speak. Use this when you have nothing meaningful to add, when someone else already covered your point, or when the conversation doesn\'t need your voice right now.',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
];

/** Additional tools only available to the moderator (Maude) */
const MODERATOR_TOOLS = [
  {
    type: 'function' as const,
    function: {
      name: 'move_to_phase',
      description: 'Advance the session to the next phase. Use when the current phase feels complete and it\'s time to move on.',
      parameters: {
        type: 'object',
        properties: {
          phase: {
            type: 'string',
            description: 'The phase to move to.',
            enum: ['checkin', 'exercise', 'hot_seat', 'commitments', 'checkout', 'done'],
          },
          transition_message: { type: 'string', description: 'A brief message to say while transitioning (e.g. "Great discussion. Let\'s move to commitments.")' },
        },
        required: ['phase', 'transition_message'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'create_commitment',
      description: 'Record a specific commitment the user has made. Use when the user states something they will do before the next session.',
      parameters: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'The specific commitment (e.g. "Send 3 cold emails by Friday")' },
          deadline: { type: 'string', description: 'When they will do it by (e.g. "Friday", "next session", "end of week")' },
        },
        required: ['text'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'call_on',
      description: 'Ask one or more council members to speak. Use when you want a particular member\'s perspective or when members have been quiet. Called members will speak in order.',
      parameters: {
        type: 'object',
        properties: {
          members: {
            type: 'array',
            items: { type: 'string' },
            description: 'Names of members to call on, in the order you want them to speak.',
          },
          prompt: { type: 'string', description: 'What you\'re asking them to weigh in on (e.g. "What networking angle do you see here?")' },
        },
        required: ['members', 'prompt'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'end_session',
      description: 'End the council session. Use after the closing word phase is complete.',
      parameters: {
        type: 'object',
        properties: {
          closing_message: { type: 'string', description: 'A brief warm closing message.' },
        },
        required: ['closing_message'],
      },
    },
  },
];

export function getToolsForAgent(isModerator: boolean) {
  return isModerator ? [...BASE_TOOLS, ...MODERATOR_TOOLS] : BASE_TOOLS;
}

/** Nano pre-filter tools — cheap model decides speak or silent */
export const FILTER_TOOLS = [
  {
    type: 'function' as const,
    function: {
      name: 'speak',
      description: 'You have something valuable to contribute that no one else has said. Claim your turn.',
      parameters: {
        type: 'object',
        properties: {
          reason: { type: 'string', description: 'Brief reason why you need to speak (1 sentence). What unique angle from your lens will you add?' },
        },
        required: ['reason'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'stay_silent',
      description: 'You have nothing new to add, or someone else already covered your point, or the conversation does not need your voice right now. This is the default — most of the time, stay silent.',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
];

export interface FilterResult {
  wantsToSpeak: boolean;
  reason?: string;
}

export function parseFilterCall(toolCall: ToolCall): FilterResult {
  if (toolCall.name === 'speak') {
    return { wantsToSpeak: true, reason: toolCall.args.reason as string };
  }
  return { wantsToSpeak: false };
}

/** Parse a tool call from OpenAI response into an AgentAction */
export function parseToolCall(toolCall: ToolCall): AgentAction {
  const { name, args } = toolCall;
  switch (name) {
    case 'send_message':
      return { type: 'message', text: args.text as string };
    case 'reply_to':
      return { type: 'reply', member: args.member as string, quote: args.quote as string, text: args.text as string };
    case 'stay_silent':
      return { type: 'silent' };
    case 'move_phase':
    case 'move_to_phase':
      return { type: 'move_phase', phase: args.phase as string, text: args.transition_message as string };
    case 'create_commitment':
      return { type: 'commitment', text: args.text as string, deadline: args.deadline as string };
    case 'call_on': {
      // Support both old format (member: string) and new (members: string[])
      const calledMembers = args.members as string[] | undefined;
      const singleMember = args.member as string | undefined;
      return {
        type: 'call_on',
        members: calledMembers || (singleMember ? [singleMember] : []),
        member: singleMember || calledMembers?.[0],
        text: args.prompt as string,
      };
    }
    case 'end_session':
      return { type: 'end_session', text: args.closing_message as string };
    default:
      return { type: 'silent' };
  }
}
