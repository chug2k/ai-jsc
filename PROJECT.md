# jobsearch.quest

An AI-powered implementation of the **Job Search Council** methodology from Phyl Terry's *Never Search Alone: The Job Seeker's Playbook*.

## What is a Job Search Council?

A **Job Search Council (JSC)** is a small accountability group — typically 4-6 people — who agree to search for jobs together. They meet weekly via video call, follow a structured agenda with progressive exercises, and hold each other accountable between sessions.

The methodology was developed by [Phyl Terry](https://phyl.org) over 25+ years of coaching leaders across every career level, from early-career PMs to Fortune 500 CEOs. The core insight:

> "The job search is not a solo activity. It is a team sport. The people who search alone are slower, more prone to bad decisions, and more likely to take the first offer out of exhaustion. The people who search with a council are faster, more selective, and more likely to land the right role — not just any role."

Over 5,000 Job Search Councils have been launched through the [Never Search Alone](https://www.neversearchalone.org) community.

## How This App Works

jobsearch.quest replaces the human peer group with **AI council members** — each with a distinct voice, worldview, and perspective. The structured curriculum and accountability method remain the same. You run sessions with your AI council, guided through the real Never Search Alone exercises.

### Your Council

You assemble a council of up to 5 members from three pools:

- **Archetypes** — purpose-built advisor personas (The Strategist, The Operator, The Devil's Advocate, The Market Mirror, The Founder, The Witness, The Connector, Jordan the Facilitator)
- **Real people & historical figures** — AI approximations of documented voices (Paul Graham, Naval Ravikant, Ben Horowitz, Sheryl Sandberg, Peter Thiel, Patrick Collison, Marcus Aurelius, Reid Hoffman, Andy Grove, Sam Altman)
- **Custom members** — anyone you add: a former boss, a mentor, a fictional character, anyone whose lens sharpens your thinking

### The 5-Part Meeting Structure

Each session follows the real JSC meeting structure:

| Part | What Happens |
|------|-------------|
| **Check-In** | Personal prompt, emotional pulse (1-10), professional updates, commitment review |
| **Exercise** | The main activity — varies by session number (see curriculum below) |
| **Hot Seat / RFH** | Bring a specific issue for the council to weigh in on |
| **Commitments** | What will you do before next session? Specific, with a deadline |
| **Check-Out** | One word that captures how you're leaving today |

### The 10-Session Curriculum

Based on the real NSA moderator agendas:

| Session | Theme | Key Exercise |
|---------|-------|-------------|
| 0 | Trust-Building | Getting to know each other |
| 1 | Your Story & Goals | Extended introduction, what you're looking for |
| 2 | Must-Nots & Must-Haves | Mnookin Two-Pager exercises |
| 3 | Mnookin Review | Present and get feedback on your Two-Pager |
| 4 | Gratitude House | Who's helped your career, building your contact list |
| 5-6 | Listening Tour | Report back on conversations with your network |
| 7 | Candidate-Market Fit | 1-sentence job search strategy |
| 8 | LinkedIn/Resume Rehab | Align profile with your CMF |
| 9+ | Networking | Megibow Dashboard, target companies |
| 10+ | Interview Prep | Practice interviews, Job Mission with OKRs |

### Seeker Types

The app supports two search modes from the NSA methodology:

- **Slow Seeker** — Currently employed but exploring. The risk is indefinite "just looking" limbo. The council pushes real decisions.
- **Fast Seeker** — Actively searching, available now. The risk is desperation narrowing options. The council keeps you honest about what you actually want.

### Commitments & Accountability

Commitments persist between sessions in the sidebar. The council checks in on them during the Check-In phase of every session. This is the accountability engine — the thing that makes a JSC work where solo searching fails.

## Technical Details

- **Single-page app** — vanilla HTML/CSS/JS, no build step, no framework
- **AI backend** — calls the Anthropic Messages API directly from the browser
- **State** — persisted in `localStorage` (API key, council config, session history, commitments)
- **Models** — supports Claude Opus, Sonnet, and Haiku via model selector
- **No server** — runs entirely client-side. Your API key is stored locally and sent only to Anthropic.

## Source Material

- **Book**: [Never Search Alone: The Job Seeker's Playbook](https://www.amazon.com/Never-Search-Alone-Seekers-Playbook/dp/B0B9Q9YDQ5) by Phyl Terry with Marty Cagan (2022)
- **Community**: [neversearchalone.org](https://www.neversearchalone.org) — join a real JSC with real humans
- **Author**: [phyl.org](https://phyl.org)

## Running Locally

Open `index.html` in a browser. Enter your Anthropic API key. Build your council. Start a session.
