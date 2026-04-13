---
name: interactive-qa
description: QA test the authenticated app experience using the headless browser with dev auth backdoor
---

# Interactive QA: Authenticated App Testing

Test the full authenticated app experience with the headless browser.
Use when you need to test pages behind auth (session views, dashboards, user settings).

## Prerequisites

1. **Dev server running on port 3001.** Check: `curl -s -o /dev/null -w '%{http_code}' http://localhost:3001`
   If not: `PORT=3001 npx next dev --turbopack &` — wait for "Ready".

2. **Dev login endpoint** at `/api/auth/dev-login` (src/app/api/auth/dev-login/route.ts).
   Creates test user `qa-test@jobsearch.quest` via Supabase service role. Dev-only.

## Critical Rule: Single Bash Call

**The gstack browse binary (`$B`) starts a fresh browser on every Bash tool invocation.**
ALL browse commands for one test flow MUST be in a SINGLE Bash tool call.

The browse server also has a ~5 second idle timeout. If you `sleep` for more than
~4 seconds without a `$B` command, the server dies and all state (cookies, page, DOM) is lost.

**Keep-alive pattern:** Poll with `$B js` every 1-2 seconds instead of long sleeps:
```bash
# WRONG: server dies during long sleep
sleep 15 && $B screenshot out.png

# RIGHT: poll to keep alive
sleep 2 && $B js "'alive'" && sleep 2 && $B js "'alive'" && $B screenshot out.png
```

## Standard Test Flow

### 1. Auth + Navigate + Verify Team Builder

```bash
B=~/.claude/skills/gstack/browse/dist/browse
$B goto "http://localhost:3001/api/auth/dev-login" && \
sleep 1 && \
$B goto "http://localhost:3001/app" && \
sleep 4 && \
$B snapshot -i -a -o .gstack/qa-reports/screenshots/team-builder.png
```

**Check:** "Your Team" heading (not "Your Council"), member cards, "Start Session" button.

### 2. Start/Resume Session + Verify Session View

```bash
B=~/.claude/skills/gstack/browse/dist/browse
$B goto "http://localhost:3001/api/auth/dev-login" && \
sleep 1 && \
$B goto "http://localhost:3001/app" && \
sleep 4 && \
$B js "document.querySelectorAll('button').forEach(b => {
  if(b.textContent.includes('Resume') || b.textContent.includes('Start Session')) b.click()
}); 'clicked'" && \
sleep 2 && \
$B snapshot -i -a -o .gstack/qa-reports/screenshots/session-view.png && \
$B js "document.body.innerText.substring(0, 400)"
```

**Check:** PhaseBar shows progress line + "N of 5" (NOT clickable tabs).
SessionAgendaBanner shows exercise description + homework. Sidebar: "YOUR TEAM".

### 3. Send Message + Observe AI Response

```bash
B=~/.claude/skills/gstack/browse/dist/browse
$B goto "http://localhost:3001/api/auth/dev-login" && \
sleep 1 && \
$B goto "http://localhost:3001/app" && \
sleep 4 && \
$B js "document.querySelectorAll('button').forEach(b => {
  if(b.textContent.includes('Resume') || b.textContent.includes('Start Session')) b.click()
}); 'clicked'" && \
sleep 2 && \
$B fill "textarea" "I am exploring a career change and feeling uncertain about next steps." && \
$B js "document.querySelector('button[aria-label=\"Send\"]').click(); 'sent'" && \
sleep 1 && $B js "'1s bubbles:'+document.querySelectorAll('.chat-bubble').length+' loading:'+!!document.querySelector('.loading-dot')" && \
sleep 1 && $B js "'2s bubbles:'+document.querySelectorAll('.chat-bubble').length" && \
sleep 1 && $B js "'3s bubbles:'+document.querySelectorAll('.chat-bubble').length" && \
$B screenshot .gstack/qa-reports/screenshots/ai-response.png && \
$B console --errors
```

**Check:** Bubble count increases after send. Loading dots appear. No console errors.
Note: AI response takes 3-10 seconds. The browse server may timeout before full response
renders. Confirm loading state shows (dots visible) — that proves the SSE pipeline works.

## How ChatInput Works

The chat textarea has NO parent `<form>`. Submit happens via:
- **Enter key** (non-shift) triggers `handleSend()` in ChatInput.tsx:118
- **Click the "↑" button** (aria-label="Send") triggers `handleSend()` via onClick

Use `$B fill "textarea" "message"` to set text (handles React state),
then `$B js "document.querySelector('button[aria-label=\"Send\"]').click()"` to send.

Do NOT use form.submit() or form.requestSubmit() — there is no form element.

## Known Limitations

1. **Browse server ~5s idle timeout.** AI responses take 3-10 seconds.
   You may not see the full response. The loading dots prove the pipeline works.

2. **Session accumulates messages.** Each test run resumes the same session.
   For a clean test, the test user needs a new session (delete old ones via DB).

3. **No streaming verification.** Can't verify SSE streams render incrementally
   because the browse server may restart mid-stream. Verify streaming by checking
   the network tab or server logs instead.

## What to Verify (Checklist)

### Onboarding (Welcome.tsx)
- [ ] "Your support team is ready." (NOT "council")
- [ ] "Meet Your Team →" button
- [ ] "Helps your advisors understand..." helper text

### Team Builder (CouncilBuilder.tsx)
- [ ] "Your Team" heading
- [ ] "Start Session →" button (NOT "Start Council Session")
- [ ] "Customize your team (add / swap advisors)" toggle

### Session View
- [ ] PhaseBar: progress line + "N of 5" (NOT clickable tabs)
- [ ] SessionAgendaBanner: exercise description + homework visible
- [ ] Sidebar: "YOUR TEAM" label
- [ ] Chat bubbles render with member colors
- [ ] Loading dots appear during AI processing
- [ ] No console errors

### Header
- [ ] "Team" nav button (NOT "Council")

### Sign-in Page
- [ ] "Sign in to start your first session." (NOT "council session")
