# User Test Log — AI-JSC with Local LM Studio

**Date:** 2026-04-03  
**Model:** qwen/qwen3.5-35b-a3b via LM Studio (localhost:1234)  
**Tester persona:** Jamie, mid-level PM at a bank, 4 years exp, actively searching, tendency to overthink

---

## Setup Experience

**First-run overlay** worked smoothly. Fields: name, situation, search status, optional API key. The "optional for local models" label was clear. Hit "Launch My Council" — went straight into a session. No friction.

**Default council:** Prizrak (moderator), The Strategist, The Operator, The Devil's Advocate. Good default mix.

## Session Flow

### Phase 1: Opening Round

**Prizrak's opener:**
> "The summit waits for no one. You are here because the air got thin in that bank. Have you moved a single inch since we last spoke, or have you been circling the same base camp polishing your boots while the weather turns?"
> 
> "Give me the numbers, Jamie. Applications sent? Interviews booked? Silence is just another form of refusal."

**Assessment:** Excellent. The mountain metaphor voice is consistent. Pushed for specifics immediately. Felt like a real accountability check, not a chatbot greeting. The character voice was maintained throughout.

### Phase 1→2 Transition

**Jamie's response:**
> "Two applications this week. One at Stripe, one at a Series B fintech. No interviews yet. Updated resume but not LinkedIn. Still at the bank. Paralyzed about qualifications."

**Prizrak's response:**
> "Two applications is motion. Motion cures paralysis... Update LinkedIn today. Visibility beats perfection. You're comparing your behind-the-scenes to their highlight reel."

**Assessment:** Solid advice. Named the real issue (self-comparison), gave a concrete push (update LinkedIn by 5 PM). Stayed under the 120-word limit. Felt like someone who actually cares but won't coddle you.

## Bugs Found & Fixed

### Bug 1: Thinking model empty content (CRITICAL)
- **Symptom:** Qwen 3.5 returned empty `content` field, putting all output in `reasoning_content`
- **Cause:** Model uses "thinking" mode — 600 max_tokens was consumed by reasoning with nothing left for actual output
- **Fix:** Increased `max_tokens` to 4096 + added fallback to parse `reasoning_content`

### Bug 2: CORS rejection on cross-origin fetch (CRITICAL)
- **Symptom:** `ERR_FAILED` — browser blocked fetch from localhost:3456 to localhost:1234
- **Cause:** LM Studio doesn't set CORS headers
- **Fix:** Created `server.js` dev server that serves static files and proxies `/v1/*` to LM Studio

### Bug 3: Supabase schema not exposed (CRITICAL)
- **Symptom:** 406 "Invalid schema: ai_jsc" on all Supabase calls
- **Cause:** PostgREST only exposes schemas listed in API settings; `ai_jsc` wasn't exposed
- **Fix:** Migrated all tables to `public` schema with `jsc_` prefix

### Bug 4: Message history starts with assistant role (CRITICAL)
- **Symptom:** 400 Bad Request on second turn of conversation
- **Cause:** `buildMessages()` returned the seed `"Begin the JSC session."` user message but never stored it in `store.current.messages`. On the second call, history started with `{role: 'assistant'}`, which LM Studio rejects.
- **Fix:** Store the seed message in history so subsequent turns always start with `user` role

### Bug 5: NaN in "days since last session" display
- **Symptom:** Header shows "NaNd since last"
- **Cause:** `daysSinceLastSession()` reads `sessions[0].startedAt` but Supabase returns `started_at` (snake_case)
- **Status:** Cosmetic, noted for fix

## What Worked Well

1. **Character voice** — Prizrak's mountain metaphors, blunt style, and accountability push felt authentic and consistent across turns
2. **Phase UI** — The phase pill, quick-reply chips, and context-aware placeholder text made the session structure clear
3. **Sidebar** — Council members, commitments, and past sessions all visible without leaving the chat
4. **Supabase persistence** — User profile, sessions, and messages all synced to the database correctly
5. **Zero-auth setup** — No sign-up required. Just enter a name and go. Client ID in localStorage is invisible but effective.
6. **LM Studio compatibility** — Once CORS was solved, the local model ran the full JSC protocol convincingly

## What Needs Work

1. **Response time** — 30-90 seconds per turn with local Qwen 3.5 35B. Acceptable for dev but would frustrate real users. Need streaming.
2. **Phase transitions** — Only tested opening → commitments review. The keyword-detection approach for transitions is fragile with local models that may phrase things differently.
3. **Hot seat multi-member** — Not tested yet. Would be 4-5 sequential API calls = 2-5 minutes of waiting.
4. **Mobile** — Not tested. Sidebar likely broken on small screens.
5. **Session resume** — If you close the tab mid-session, the session is lost (in-memory state not persisted).

## Verdict

**The core loop works.** A job seeker can sit down, launch a session, and get pushed by AI council members who maintain distinct voices and follow the JSC methodology. The structured phases (opening → commitments → wins → blockers → hot seat → new commitments → closing) give the session real shape.

The local model (Qwen 3.5 35B) handled the persona and accountability format well — better than expected for an open-weight model. It stayed in character, pushed for specifics, and gave actionable advice.

**Biggest risk:** Phase transition detection is keyword-based and brittle. If the model phrases the transition differently, the session gets stuck. A more robust approach (explicit phase advancement by the user, or structured output from the model) would be more reliable.
