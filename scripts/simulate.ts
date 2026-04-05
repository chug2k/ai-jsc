/**
 * Standalone simulation runner for council sessions.
 *
 * Usage: npx tsx scripts/simulate.ts <persona-file.json>
 *
 * Calls OpenAI directly (no web server needed), uses real prompt builders,
 * and outputs a clean transcript to stdout.
 */

import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

import { buildModeratorPrompt, buildReactiveMemberPrompt, buildFilterPrompt } from '../src/lib/council/prompts';
import { runReactionLoop, type AgentMessage, type CouncilAgent } from '../src/lib/council/engine';
import { callOpenAI } from '../src/lib/council/openai';
import { getSoul } from '../src/lib/council/souls';
import { defaultIdentity, type AgentIdentity } from '../src/lib/council/identities';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY in .env.local');
  process.exit(1);
}

interface Persona {
  name: string;
  searchStatus: 'slow' | 'fast' | 'exploring' | 'paused';
  userContext: string;
  sessionNumber: number;
  memberIds: string[];
  messages: string[];
}

const MODERATOR_MODEL = 'gpt-5.4';
const MEMBER_MODEL = 'gpt-5.4-mini';
const FILTER_MODEL = 'gpt-5.4-nano';

async function runSimulation(persona: Persona) {
  // Build identities from persona member IDs
  let memberIds = persona.memberIds;
  if (!memberIds.includes('facilitator')) memberIds = ['facilitator', ...memberIds];
  const identities: AgentIdentity[] = memberIds.map((id) => defaultIdentity(id));

  const ctx = {
    userName: persona.name,
    searchStatus: persona.searchStatus,
    userContext: persona.userContext,
    commitments: [] as { text: string }[],
    sessionNumber: persona.sessionNumber,
  };

  let phase = 'checkin';
  const messages: AgentMessage[] = [];
  const transcript: string[] = [];

  function log(prefix: string, text: string) {
    const line = `[${prefix}] ${text}`;
    transcript.push(line);
    console.log(line);
  }

  log('SYS', `Session ${persona.sessionNumber} | ${persona.name} | Members: ${identities.map((m) => m.name).join(', ')}`);
  log('SYS', `Context: ${persona.userContext}`);
  log('SYS', `Phase: ${phase}`);
  console.log('---');

  // LLM function — uses the same shared callOpenAI as /api/chat
  const llm = async (systemPrompt: string, msgs: AgentMessage[], model?: string, tools?: unknown[], options?: { reasoningEffort?: 'low' | 'medium' | 'high' }) => {
    return callOpenAI(OPENAI_API_KEY!, systemPrompt, msgs, model || MEMBER_MODEL, tools, options);
  };

  // Helper to build agents for current phase
  const buildAgents = (): CouncilAgent[] => identities.map((identity) => ({
    id: identity.soul_id,
    name: identity.name,
    isModerator: identity.is_moderator,
    model: identity.is_moderator ? MODERATOR_MODEL : MEMBER_MODEL,
    filterModel: FILTER_MODEL,
    reasoningEffort: identity.reasoning_effort,
    buildSystemPrompt: () => {
      const soul = getSoul(identity.soul_id);
      return identity.is_moderator
        ? buildModeratorPrompt(soul, identity, identities, phase, ctx)
        : buildReactiveMemberPrompt(soul, identity, identities, phase, ctx);
    },
    buildFilterPrompt: () =>
      buildFilterPrompt(identity, identities, phase, { userName: ctx.userName }),
  }));

  // Send __INIT__ to let Maude open the session (moderator-only, same as web app)
  messages.push({ role: 'user', content: 'Begin the JSC session.' });
  log('SYS', 'Session starting (moderator-only init)');
  await runReactionLoop({
    agents: buildAgents(),
    messages: [...messages],
    llm,
    moderatorOnly: true,
    callbacks: {
      onMessage: (msg) => { messages.push(msg); log(msg.memberName || 'Unknown', msg.content); },
      onPhaseChange: (p) => { phase = p; log('SYS', `Phase → ${phase}`); },
      onCommitment: (text) => { ctx.commitments.push({ text }); log('SYS', `Commitment: ${text}`); },
      onCallOn: () => {},
      onEndSession: () => { log('SYS', 'Session ended.'); },
    },
  });
  console.log('');

  for (const userMsg of persona.messages) {
    messages.push({ role: 'user', content: userMsg, memberName: persona.name });
    log(persona.name, userMsg);

    let sessionEnded = false;

    const newMessages = await runReactionLoop({
      agents: buildAgents(),
      messages: [...messages],
      llm,
      callbacks: {
        onMessage: (msg) => {
          messages.push(msg);
          log(msg.memberName || 'Unknown', msg.content);
        },
        onPhaseChange: (newPhase, _message) => {
          phase = newPhase;
          log('SYS', `Phase → ${phase}`);
        },
        onCommitment: (text, _deadline) => {
          const isDupe = ctx.commitments.some((c) => c.text === text);
          if (!isDupe) {
            ctx.commitments.push({ text });
            log('SYS', `Commitment recorded: ${text}`);
          }
        },
        onCallOn: (_member, _prompt) => {},
        onEndSession: (_message) => {
          sessionEnded = true;
          log('SYS', 'Session ended.');
        },
      },
    });

    if (sessionEnded) break;
    console.log('');
  }

  return { transcript, messages, finalPhase: phase, commitments: ctx.commitments };
}

async function main() {
  const personaFile = process.argv[2];
  if (!personaFile) {
    console.error('Usage: npx tsx scripts/simulate.ts <persona-file.json>');
    process.exit(1);
  }

  const personaPath = path.resolve(personaFile);
  const persona: Persona = JSON.parse(fs.readFileSync(personaPath, 'utf-8'));

  console.log(`\n${'='.repeat(60)}`);
  console.log(`SIMULATION: ${persona.name}`);
  console.log(`${'='.repeat(60)}\n`);

  const result = await runSimulation(persona);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`SUMMARY`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Messages: ${result.messages.length}`);
  console.log(`Final phase: ${result.finalPhase}`);
  console.log(`Commitments: ${result.commitments.map((c) => c.text).join('; ') || 'none'}`);

  // Write transcript to /tmp for the skill to read
  const outPath = `/tmp/sim-${Date.now()}.txt`;
  fs.writeFileSync(outPath, result.transcript.join('\n'), 'utf-8');
  console.log(`\nTranscript saved: ${outPath}`);
}

main().catch((err) => {
  console.error('Simulation failed:', err);
  process.exit(1);
});
