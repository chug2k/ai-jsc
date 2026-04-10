# TODOS

## P1 — Must do next

### Dogfood sprint
**What:** Complete 5 real sessions over 2 weeks using jobsearch.quest for a genuine career question. Journal each session: what changed your thinking, what felt hollow, what surprised you.
**Why:** Premise 3 (AI delivers ~80% of council value) is unverified. Both the CEO review and outside voice flagged this as the #1 risk. The messaging rewrite promises "zero activation energy" — dogfooding verifies the experience matches the promise.
**Effort:** S (human: ~2.5 hours total, founder work)
**Depends on:** Messaging rewrite complete and deployed.
**Added:** 2026-04-10 via /plan-ceo-review

## P2 — Important, not urgent

### Real social proof section
**What:** Add a landing page section with real user testimonials and usage stats once external users exist.
**Why:** Social proof is the #1 conversion driver. Simulation stats were cut from the current plan because they aren't real social proof. Real testimonials from real users are worth 10x.
**Effort:** S (CC: ~10 min once testimonials are gathered)
**Depends on:** Real users who have completed sessions and can provide quotes/data.
**Added:** 2026-04-10 via /plan-ceo-review

## Done (2026-04-10)
- ~~User-visible error recovery in engine~~ — implemented in engine.ts
- ~~Add session theme + exercise to member prompts~~ — implemented in prompts.ts
- ~~Expand SessionAgendaBanner with exercise details~~ — implemented in SessionView.tsx
- ~~Increase message history window to 60~~ — implemented in openai.ts
- ~~Server-side prompt construction~~ — /api/chat/council route, prompts never leave server
- ~~Add streaming for agent responses~~ — SSE stream, messages appear as each agent finishes
