# Simulation Runs

Track of all council session simulations. Check before creating new personas to avoid repetition.

---

## Run 1 — Diana Reyes — 2026-04-05
- **Status**: fast
- **Context**: Former VP Marketing at fintech, laid off 3 weeks ago, relieved but guilty, two kids
- **Session**: 0 (Trust-Building)
- **Members**: Maude, The Strategist, The Operator, The Witness
- **Messages**: 8 user, 40 total
- **Final phase**: checkin (never advanced)
- **Commitments**: Reach out to recruiter and set up call
- **Quality notes**: Conversation was empathetic and relevant. Members gave good advice on interviewing founders back. However, Maude never moved phases (stayed in checkin the whole time), nobody used stay_silent so every member spoke on every turn, and responses were repetitive across members.
- **Bugs**: Maude's call_on produced a bare prompt instead of a natural message. Maude's commitment message echoed the tool arg verbatim. Phase transitions never happened.

## Run 2 — Marcus Thompson — 2026-04-05
- **Status**: exploring
- **Context**: Senior nurse practitioner, 9 years ER, burnt out, considering consulting/admin/leaving medicine, $180k loans
- **Session**: 3 (Mnookin Two-Pager Review)
- **Members**: Maude, The Devil's Advocate, The Founder, The Connector
- **Messages**: 8 user, 40 total
- **Final phase**: checkin (never advanced)
- **Commitments**: Reach out to 2 clinical-to-consulting people (recorded twice — duplicate bug)
- **Quality notes**: Good pushback from Marcus on consulting stereotype, council engaged well with it. Maude said the phase transition text but used send_message instead of move_to_phase (same as run 1). Devil's Advocate spoke AS Marcus on the first turn (identity bleed). All members spoke every turn, no stay_silent usage.
- **Bugs**: Phase never advanced (Maude embeds transition text in send_message). DA identity bleed. Duplicate commitment recording. Maude commitment message = raw tool arg.

## Run 3 — Priya Chakrabarti — 2026-04-05
- **Status**: paused
- **Context**: Former HS math teacher (5 yrs), left due to admin politics, exploring ed-tech/instructional design, introverted/analytical
- **Session**: 2 (Must-Nots & Must-Haves)
- **Members**: Maude, The Operator, The Market Mirror, The Witness
- **Messages**: 8 user, 40 total
- **Final phase**: exercise (advanced via text detection on last message — too late)
- **Commitments**: Research 5 ID roles; message friend in ID for honest conversation
- **Quality notes**: Commitments worked perfectly (no dupes). Market Mirror gave strong advice about translating teaching into market language. Maude used call_on once. However, Market Mirror had identity bleed (spoke AS Priya on turn 1). Still no stay_silent from any member — all spoke every turn. Phase transition text was present but move_to_phase tool wasn't used.
- **Bugs**: Market Mirror identity bleed (turn 1). Phase advanced only via fallback text detection, not move_to_phase tool. No stay_silent usage across all members.

## Run 4 — Jordan Webb — 2026-04-05
- **Status**: slow
- **Context**: SWE at big bank (3 yrs), 26yo, bored/underpaid, wants startups but scared of losing stability, overthinker
- **Session**: 7 (Candidate-Market Fit)
- **Members**: Maude, The Operator, The Devil's Advocate, The Founder
- **Messages**: 8 user, 41 total
- **Final phase**: exercise (advanced via text detection)
- **Commitments**: Apply to 3 startups this week; update LinkedIn headline to match CMF
- **Quality notes**: Best conversation yet — Jordan's CMF revision was guided well, the self-awareness moment ("lose the fantasy") got strong responses. Maude's feedback was specific and useful. However, identity bleed is rampant — Operator, Founder, and DA all answered questions AS Jordan across multiple turns. DA recycled a message verbatim from turn 2 on the last turn.
- **Bugs**: Identity bleed on 4+ turns (members answer as user). No stay_silent usage. DA recycled a verbatim message. Maude double-messaged on commitment turn. move_to_phase tool still not used (text detection fallback only).

---
## Post Soul/Identity Architecture (runs 5+)

## Run 5 — Tanya Brooks — 2026-04-05 (quick test)
- **Status**: fast | **Session**: 0 | **Members**: Maude, Strategist, Operator
- **Messages**: 4 user, 16 total | **Phase**: checkin | **Identity bleed**: none
- **Notes**: First run after soul/identity. No identity bleed — anti-patterns working.

## Run 6 — Ray Donovan — 2026-04-05 (round 1)
- **Status**: slow | **Session**: 0 | **Members**: Maude, DA, Founder, Witness
- **Messages**: 6 user, 29 total | **Phase**: exercise (move_to_phase tool!) | **Identity bleed**: none
- **Commitments**: 3 conversations in climate tech; talk to wife about timelines
- **Notes**: Phase advanced via actual tool. DA had "I ask because" verbal tic on every message. Everyone spoke every turn.

## Run 7 — Keiko Tanaka — 2026-04-05 (round 1)
- **Status**: fast | **Session**: 5 | **Members**: Maude, Market Mirror, Operator, Connector
- **Messages**: 7 user, 28 total | **Phase**: exercise (move_to_phase tool) | **Identity bleed**: none
- **Commitments**: Referral ask; rewrite case study (+ 1 auto-detected early)
- **Notes**: Phase advanced. No identity bleed. All members spoke most turns.

## Run 8 — Andre Mitchell — 2026-04-05 (round 1)
- **Status**: exploring | **Session**: 7 | **Members**: Maude, Strategist, Market Mirror, Operator
- **Messages**: 7 user, 32 total | **Phase**: checkin (never advanced) | **Identity bleed**: none
- **Commitments**: Call ed-tech founder; respond to Fortune 500 recruiter
- **Notes**: Andre jumped to CMF, Maude stayed in checkin. All spoke every turn. Market Mirror verbose.

## Run 9 — Ray Donovan — 2026-04-05 (round 2, after silence/pacing fix)
- **Status**: slow | **Session**: 0 | **Members**: Maude, DA, Founder, Witness
- **Messages**: 6 user, 26 total | **Phase**: exercise | **Identity bleed**: none
- **Commitments**: 3 climate tech conversations + wife timeline talk
- **Notes**: Witness silent on turn 1 (warmup). DA varied openings (no more "I ask because"). Founder spoke less. Still some pile-on on emotional turns.

## Run 10 — Keiko Tanaka — 2026-04-05 (round 2)
- **Status**: fast | **Session**: 5 | **Members**: Maude, Market Mirror, Operator, Connector
- **Messages**: 7 user, 22 total | **Phase**: checkin | **Identity bleed**: none
- **Commitments**: Referral ask + case study rewrite
- **Notes**: Major silence improvement. Turns 1-2: only Maude spoke. Turn 3: Maude + 1 member. Best pacing yet.

## Run 11 — Andre Mitchell — 2026-04-05 (round 2)
- **Status**: exploring | **Session**: 7 | **Members**: Maude, Strategist, Market Mirror, Operator
- **Messages**: 7 user, 29 total | **Phase**: checkin | **Identity bleed**: none
- **Commitments**: Ed-tech call + Fortune 500 response
- **Notes**: Silence improved (Strategist only on turn 1). Phase still stuck — Maude insists on emotional check-in when Andre skips it.

## Run 12-14 — Round 3 (after pacing rule + checkin skip rule)
- **Ray**: 26 msgs, phase advanced, 0 identity bleed, Witness silent turn 1
- **Keiko**: 24 msgs, stayed in checkin, 0 identity bleed, turns 1-2 Maude only
- **Andre**: 31 msgs, stayed in checkin, 0 identity bleed, good voice differentiation
- **Overall**: Identity bleed completely fixed. Silence improved but not perfect (~30% reduction). Phase transitions work when Maude has clear signal. Remaining issue: members still pile on substantive turns; Maude blocks on checkin when user skips ahead.

---
## Maude-as-Pure-Moderator + call_on Bypass (runs 15+)

## Run 15-17 — Ray/Keiko/Andre (Maude redesign validation)
- Maude stops giving advice, only orchestrates via call_on, move_to_phase, synthesis
- call_on bypass: called members skip nano filter, respond sequentially
- Intros work when Maude call_on's members by name array
- Session quality dramatically improved — members shine, Maude stays out of the way

## Run 18 — Sofia Herrera — 2026-04-05
- **Status**: fast | **Session**: 4 (Gratitude House) | **Members**: Maude, Strategist, DA, Connector
- **Messages**: 7 user, 24 total | **Phase**: exercise | **Identity bleed**: none
- **Commitments**: Call Diane
- **Highlight**: DA's burnout-vs-leverage test: "does the pull survive rest?" Strategist's "avoidance is the data." Connector stayed in people/connections lane perfectly. Gratitude House exercise worked organically.

## Run 19 — Tommy Pak — 2026-04-05
- **Status**: exploring | **Session**: 1 (Story & Goals) | **Members**: Maude, Founder, Market Mirror, Operator
- **Messages**: 7 user, 23 total | **Phase**: exercise | **Identity bleed**: none
- **Commitments**: Apply to 5 React roles; get resume/portfolio in shape
- **Highlight**: Council correctly identified parents' store app as killer proof. Market Mirror: "barcode scanning + daily use says you can ship end-to-end." Founder: "don't hide WordPress years, frame as shipping under constraints." Quiet persona respected — no one pushed him to talk more.

## Run 20 — Catherine Osei — 2026-04-05
- **Status**: paused | **Session**: 0 (Trust-Building) | **Members**: Maude, Strategist, Witness, Operator
- **Messages**: 6 user, 22 total | **Phase**: checkin | **Identity bleed**: none
- **Commitments**: Write down 3-month needs from employer before talking to manager
- **Highlight**: Zero toxic positivity despite grief context. Witness: "guilt attached to the version of your mother who helped build this path." Strategist: "avoid making a permanent identity decision from a temporary crisis." Turn 4: all members went silent after Catherine asked for no platitudes. Turn 6 (commitment): total silence from council — respectful of "that's all I can do right now."

