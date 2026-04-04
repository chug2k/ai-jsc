/**
 * Simulate a council session with scripted user messages.
 *
 * Usage: npx tsx scripts/simulate-session.ts
 *
 * Runs a full session against the real API, stores results in Supabase,
 * and prints the conversation to stdout.
 */

import 'dotenv/config';

const API_BASE = process.env.SIMULATE_API_BASE || 'http://localhost:3456';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Simulated user persona
const USER_PERSONAS = [
  {
    name: 'Alex Chen',
    status: 'fast',
    context: 'Senior PM at a Series B startup. Company did layoffs. 8 years experience in product.',
    messages: [
      'Hi everyone, excited to start.',
      "Can everyone introduce themselves?",
      "I was a senior PM at a startup that just did layoffs. I'm one of the people who got cut.",
      "Honestly I'm feeling pretty lost. I don't know if I want to stay in product or try something new.",
      "I've been thinking about going into AI product management but I don't have direct experience.",
      "That's a good point. What do you think I should do first?",
      "Okay, I'll reach out to 3 people this week.",
      "Hopeful",
    ],
  },
  {
    name: 'Sarah Kim',
    status: 'slow',
    context: 'Engineering manager at Google. 12 years. Bored but comfortable.',
    messages: [
      "Hey! Nice to meet everyone.",
      "Let me hear from the others first.",
      "I'm an engineering manager at Google. Been there 12 years. I'm... bored. But the comp is good and I have a family.",
      "I guess I'm afraid of leaving the safety net. Golden handcuffs, you know?",
      "The startup world interests me but I haven't worked at a small company since 2012.",
      "I don't think I'm ready to actually apply anywhere yet. I just want to explore.",
      "One conversation with a startup EM this week. That's my commitment.",
      "Curious",
    ],
  },
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
  memberName?: string | null;
}

async function callChat(system: string, messages: Message[], model: string) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: '' },
    body: JSON.stringify({ system, messages, model }),
  });
  return res.json();
}

async function storeSimulation(persona: typeof USER_PERSONAS[0], messages: Message[]) {
  // Store directly in Supabase using service role
  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
  };

  // Create a simulation record
  const simRes = await fetch(`${SUPABASE_URL}/rest/v1/jsc_simulations`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'return=representation' },
    body: JSON.stringify({
      persona_name: persona.name,
      persona_context: persona.context,
      message_count: messages.length,
      created_at: new Date().toISOString(),
    }),
  });

  if (!simRes.ok) {
    console.error('Failed to store simulation:', await simRes.text());
    console.log('(You may need to create the jsc_simulations table first)');
    return;
  }

  const [sim] = await simRes.json();
  console.log(`\nStored as simulation ${sim.id}`);

  // Store messages
  for (const msg of messages) {
    await fetch(`${SUPABASE_URL}/rest/v1/jsc_simulation_messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        simulation_id: sim.id,
        role: msg.role,
        content: msg.content,
        member_name: msg.memberName || null,
      }),
    });
  }
}

async function runSimulation(persona: typeof USER_PERSONAS[0]) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`SIMULATING: ${persona.name}`);
  console.log(`Context: ${persona.context}`);
  console.log(`${'='.repeat(60)}\n`);

  const allMessages: Message[] = [];

  // Note: This is a simplified simulation that calls the chat API directly
  // without auth. For a real simulation, you'd need to either:
  // 1. Use a test user session, or
  // 2. Call the engine directly

  // For now, just print what the conversation would look like
  for (const userMsg of persona.messages) {
    console.log(`\n  [${persona.name}]: ${userMsg}`);
    allMessages.push({ role: 'user', content: userMsg });

    // Small delay between messages
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Simulation complete: ${allMessages.length} messages`);
  console.log(`${'='.repeat(60)}\n`);

  return allMessages;
}

async function main() {
  const personaIndex = parseInt(process.argv[2] || '0');
  const persona = USER_PERSONAS[personaIndex % USER_PERSONAS.length];

  console.log('Available personas:');
  USER_PERSONAS.forEach((p, i) => console.log(`  ${i}: ${p.name} — ${p.context.substring(0, 60)}...`));
  console.log(`\nUsing persona ${personaIndex}: ${persona.name}\n`);

  const messages = await runSimulation(persona);

  // Try to store in Supabase
  try {
    await storeSimulation(persona, messages);
  } catch (err) {
    console.log('Could not store in Supabase:', (err as Error).message);
  }
}

main().catch(console.error);
