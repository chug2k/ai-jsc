---
name: interactive-qa
description: QA test the authenticated app experience using the headless browser with dev auth backdoor
---

# Interactive QA: Authenticated App Testing

Test the full authenticated app experience with the headless browser.
Use when you need to test pages behind auth (session views, dashboards, user settings).

## Prerequisites

1. **Dev server must be running.** Check with `curl -s -o /dev/null -w '%{http_code}' http://localhost:3001`.
   If not running: `PORT=3001 npx next dev --turbopack &` and wait for "Ready".

2. **Dev login endpoint must exist** at `/api/auth/dev-login`.
   This endpoint (src/app/api/auth/dev-login/route.ts) uses the Supabase service role
   to create and sign in a test user. Only works in NODE_ENV=development.
   Test user: qa-test@jobsearch.quest

## Critical Rule: Cookie Persistence

**The gstack browse binary (`$B`) starts a fresh browser context on every invocation.**
Cookies set in one `$B` command are LOST by the next `$B` command.

**ALWAYS chain browse commands in a SINGLE Bash call:**

```bash
B=~/.claude/skills/gstack/browse/dist/browse

# CORRECT: one Bash call, all commands chained
$B goto "http://localhost:3001/api/auth/dev-login" && \
sleep 2 && \
$B goto "http://localhost:3001/app" && \
sleep 5 && \
$B snapshot -i -a -o /tmp/app.png

# WRONG: separate Bash calls lose cookies
$B goto "http://localhost:3001/api/auth/dev-login"  # sets cookie
# ... cookie is GONE by next call ...
$B goto "http://localhost:3001/app"  # redirects to signin
```

## Testing Flow

### Step 1: Auth + Navigate (single Bash call)

```bash
B=~/.claude/skills/gstack/browse/dist/browse
$B goto "http://localhost:3001/api/auth/dev-login" && \
sleep 2 && \
$B goto "http://localhost:3001/app" && \
sleep 6 && \
$B snapshot -i -a -o .gstack/qa-reports/screenshots/app-authed.png && \
$B console --errors
```

The 6-second sleep after /app is critical. The app loads user data, council config,
sessions, and commitments in parallel (see session-store.ts:init). First-time users
also see the Welcome onboarding flow which renders after init completes.

### Step 2: Interact with the app

Chain interactions in a single Bash call to maintain state:

```bash
B=~/.claude/skills/gstack/browse/dist/browse
# Example: click Start Session and wait for AI response
$B js "document.querySelectorAll('button').forEach(b => { if(b.textContent.includes('Start Session')) b.click() })" && \
sleep 12 && \
$B snapshot -i -a -o .gstack/qa-reports/screenshots/session.png && \
$B console --errors
```

The 12-second sleep after starting a session accounts for:
- Session creation API call (~1s)
- __INIT__ message sent to council engine (~1s)
- Nano filter calls for all agents in parallel (~500ms)
- Full inference for responding agents (~3-8s per agent)
- Multiple reaction loop rounds

### Step 3: Send a message

```bash
B=~/.claude/skills/gstack/browse/dist/browse
$B js "
  const input = document.querySelector('textarea, input[type=text]');
  if (input) {
    input.value = 'I am exploring a career change from engineering to product management.';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const form = input.closest('form');
    if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
    else {
      const btn = document.querySelector('button[type=submit], button:last-of-type');
      if (btn) btn.click();
    }
  }
  'sent';
" && \
sleep 15 && \
$B snapshot -i -a -o .gstack/qa-reports/screenshots/response.png
```

## What to Check

### Welcome/Onboarding (first-time users)
- "Your support team is ready." (NOT "Your council is ready.")
- Search status selector renders 4 options
- LinkedIn headline input appears after status selected
- "Meet Your Team →" button (NOT "Meet Your Council")

### CouncilBuilder (team selection)
- "Your Team" heading (NOT "Your Council")
- Member cards show name + role
- "Start Session →" button (NOT "Start Council Session")
- "Customize your team (add / swap advisors)" toggle

### Session View
- PhaseBar shows as progress indicator (text + line), NOT clickable tabs
- SessionAgendaBanner shows exercise description + homework
- Chat bubbles render with member colors and avatars
- Loading dots appear while AI is responding
- Messages appear incrementally via SSE (not all at once)

### Sidebar
- "YOUR TEAM" label (NOT "COUNCIL")
- Member roster with colors
- Commitments section

### Error States
- If OpenAI is down/rate-limited: "The council is having a technical issue" message
  (NOT silent failure)

## Supabase Cookie Format

The dev-login endpoint sets a cookie named `sb-{projectRef}-auth-token` where
projectRef is extracted from NEXT_PUBLIC_SUPABASE_URL. The cookie value is a
JSON object with access_token, refresh_token, expires_at, etc.

The Supabase SSR middleware reads this cookie on every request to authenticate.

## New Test User Setup

The dev-login endpoint auto-creates the test user on first use:
- Email: qa-test@jobsearch.quest
- Name: QA Tester
- Plan: free (auto-assigned)
- The jsc_users row is auto-created by the /api/user GET endpoint on first access.
