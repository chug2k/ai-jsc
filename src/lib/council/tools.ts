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
      description: 'Ask a specific council member to speak. Use when you want a particular member\'s perspective or when a member has been quiet.',
      parameters: {
        type: 'object',
        properties: {
          member: { type: 'string', description: 'The name of the member to call on.' },
          prompt: { type: 'string', description: 'What you\'re asking them to weigh in on (e.g. "Connector, what networking angle do you see here?")' },
        },
        required: ['member', 'prompt'],
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
    case 'call_on':
      return { type: 'call_on', member: args.member as string, text: args.prompt as string };
    case 'end_session':
      return { type: 'end_session', text: args.closing_message as string };
    default:
      return { type: 'silent' };
  }
}
