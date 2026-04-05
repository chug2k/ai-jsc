---
name: simulate
description: Run a simulated council session with a unique AI-generated persona. Use when the user says /simulate or asks to test/simulate a council conversation. Generates a fresh persona each time, runs the full session against OpenAI, and logs results to scripts/simulation-runs.md.
---

# Simulate a Council Session

Run a full council session simulation with a unique persona against the real engine + OpenAI.

## Steps

### 1. Check past runs

Read `scripts/simulation-runs.md` to see what personas have already been used. Your new persona MUST be meaningfully different — different name, different career stage, different industry, different emotional situation.

### 2. Generate a unique persona

Create a JSON file at `/tmp/sim-persona.json` with this shape:

```json
{
  "name": "<realistic full name>",
  "searchStatus": "<slow|fast|exploring|paused>",
  "userContext": "<1-2 sentence background — career, situation, emotional state>",
  "sessionNumber": 0,
  "memberIds": ["facilitator", "<pick 2-3 from: strategist, operator, devils_advocate, recruiter, founder, therapist, network>"],
  "messages": [
    "<greeting — casual, in character>",
    "<response to introductions — share something about themselves>",
    "<deeper share — the real situation, emotions, fears>",
    "<reaction to council feedback — agree, push back, or ask for clarity>",
    "<engagement with exercise — try the thing Maude asks>",
    "<hot seat question or dilemma — something specific they need help with>",
    "<response to council advice>",
    "<commitment or closing word>"
  ]
}
```

Persona variety guidelines:
- Vary industries: tech, finance, healthcare, education, creative, nonprofit, trades, government
- Vary levels: intern, mid-career, senior, executive, career-changer, returner
- Vary emotions: anxious, angry, numb, cautiously optimistic, grieving, excited, confused
- Vary search status across the 4 options
- Vary session numbers (0-10) to test different curriculum themes
- Messages should feel like a real person — hesitations, half-thoughts, emotional shifts
- 8 messages is the target, but 6-10 is fine depending on the persona's style

### 3. Run the simulation

```bash
cd /Users/chug2k/Documents/charles-nueva/ai-jsc && npx tsx scripts/simulate.ts /tmp/sim-persona.json
```

This takes 30-90 seconds (multiple OpenAI calls). Read the full output.

### 4. Analyze the output

After the simulation completes, evaluate:
- Did Maude follow the agenda for the session number?
- Did Maude use tools appropriately (call_on, move_to_phase, create_commitment)?
- Did members speak when appropriate and stay silent when they should?
- Did the conversation feel natural or robotic?
- Any bugs, errors, or weird behavior?

### 5. Log the run

Read the transcript file path from the simulation output (it prints "Transcript saved: /tmp/sim-XXXXX.txt"). Read that file.

Then append to `scripts/simulation-runs.md` using this format:

```markdown
## Run N — <Persona Name> — <date>
- **Status**: <slow/fast/exploring/paused>
- **Context**: <1-line background>
- **Session**: <number> (<theme name>)
- **Members**: <list>
- **Messages**: <count> user, <count> total
- **Final phase**: <phase>
- **Commitments**: <list or "none">
- **Quality notes**: <2-3 sentences on what went well and what was off>
- **Bugs**: <any errors or issues, or "none">
```

### 6. Report

Give a brief summary: what happened, what was good, what needs work.
