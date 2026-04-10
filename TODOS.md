# TODOS

## P1 — Must do next

### Dogfood sprint
**What:** Complete 5 real sessions over 2 weeks using jobsearch.quest for a genuine career question. Journal each session: what changed your thinking, what felt hollow, what surprised you.
**Why:** Premise 3 (AI delivers ~80% of council value) is unverified. Both the CEO review and outside voice flagged this as the #1 risk. The messaging rewrite promises "zero activation energy" — dogfooding verifies the experience matches the promise.
**Effort:** S (human: ~2.5 hours total, founder work)
**Depends on:** Messaging rewrite complete and deployed.
**Added:** 2026-04-10 via /plan-ceo-review

### Server-side prompt construction
**What:** Move prompt building from the browser to the API route. Client sends (userId, sessionId, message, phase, memberIds). Server loads souls, identities, and builds system prompts. Prompts never leave the server.
**Why:** Currently all soul content, prompt templates, and moderator agendas are visible in browser DevTools. For a paid product, this exposes the entire prompt engineering IP.
**Effort:** M (human: ~1 day / CC: ~30 min)
**Depends on:** Nothing.
**Added:** 2026-04-10 via /plan-ceo-review (app engine review)

### Add streaming for agent responses
**What:** Stream each agent's response to the UI as tokens arrive. Show the first agent's response immediately while other agents are still thinking.
**Why:** Currently the user waits 6-12 seconds with a loading spinner before seeing any text. Streaming makes it feel like people talking, not a chatbot loading. Perceived latency drops from 6-12s to ~500ms.
**Effort:** M (human: ~2 days / CC: ~45 min)
**Depends on:** Server-side prompt construction (above) makes this easier.
**Added:** 2026-04-10 via /plan-ceo-review (app engine review)

### User-visible error recovery in engine
**What:** When ALL agents fail (API down, rate limited, malformed response), surface a user-visible error message instead of silent failure. "The council is having a technical issue. Try sending your message again."
**Why:** Currently engine.ts catches all LLM errors and returns stay_silent. If OpenAI is down, the user sees nothing, no error, no retry option. Silent failures are the worst UX.
**Effort:** S (human: ~2 hours / CC: ~15 min)
**Depends on:** Nothing.
**Added:** 2026-04-10 via /plan-ceo-review (app engine review)

### Add session theme + exercise to member prompts
**What:** Add 3 lines to buildReactiveMemberPrompt in prompts.ts: include the session theme name, exercise description, and expected homework. Members currently fly blind.
**Why:** Maude gets the full agenda but members don't know what today's exercise is. They respond generically when they could tailor their perspective to the exercise topic.
**Effort:** S (CC: ~5 min)
**Depends on:** Nothing.
**Added:** 2026-04-10 via /plan-ceo-review (app engine review)

### Expand SessionAgendaBanner with exercise details
**What:** Show the user the exercise description and expected homework in the SessionAgendaBanner component, not just the theme name.
**Why:** In real JSC meetings, participants get the agenda in advance. Currently the user shows up blind. Seeing the exercise description helps them prepare better responses.
**Effort:** S (CC: ~10 min)
**Depends on:** Nothing.
**Added:** 2026-04-10 via /plan-ceo-review (app engine review)

### Increase message history window to 60
**What:** Change messages.slice(-30) to messages.slice(-60) in openai.ts line 49.
**Why:** A 45-minute session easily exceeds 30 messages. After that, earlier context (check-in discussion, exercise insights) falls off. The council "forgets" what was discussed.
**Effort:** S (CC: ~1 min, one-line change)
**Depends on:** Nothing. Will ~2x token costs per call.
**Added:** 2026-04-10 via /plan-ceo-review (app engine review)

## P2 — Important, not urgent

### Real social proof section
**What:** Add a landing page section with real user testimonials and usage stats once external users exist.
**Why:** Social proof is the #1 conversion driver. Simulation stats were cut from the current plan because they aren't real social proof. Real testimonials from real users are worth 10x.
**Effort:** S (CC: ~10 min once testimonials are gathered)
**Depends on:** Real users who have completed sessions and can provide quotes/data.
**Added:** 2026-04-10 via /plan-ceo-review
