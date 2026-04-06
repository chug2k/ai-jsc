---
name: ship
description: Commit, push, and deploy to Vercel. Use when the user says /ship, "deploy", "push and deploy", or "commit and deploy". Handles the full git commit → push → Vercel production deploy → status check flow.
---

# Ship: Commit, Push & Deploy

Commit staged/unstaged changes, push to main, trigger a Vercel production deploy, and verify it succeeds.

## Steps

### 1. Check what's changed

Run these in parallel:
- `git status` — see all modified and untracked files
- `git diff --stat` — summary of changes
- `git log --oneline -3` — recent commit style

If there are no changes (clean working tree, nothing untracked), tell the user "Nothing to ship — working tree is clean." and stop.

### 2. Stage and commit

- Review the changes and draft a concise commit message (1-2 sentences) that describes the "why" not the "what"
- Stage relevant files by name (avoid `git add -A` — never stage `.env`, credentials, or large binaries)
- Commit using this format:

```bash
git commit -m "$(cat <<'EOF'
<commit message here>

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

If a pre-commit hook fails, fix the issue and create a NEW commit (never amend).

### 3. Push

```bash
git push origin main
```

If push fails (e.g., remote has new commits), pull with rebase first:
```bash
git pull --rebase origin main && git push origin main
```

### 4. Deploy to Vercel

This project auto-deploys on push to main via Vercel's GitHub integration. But to be safe and get immediate feedback, also trigger an explicit production deploy:

```bash
vercel --prod --yes 2>&1
```

The `--yes` flag skips confirmation prompts.

### 5. Verify deployment

After the deploy command completes, check the status:

```bash
vercel ls 2>&1 | head -5
```

Look for the most recent deployment and confirm it shows "● Ready" status.

If the deploy failed:
- Read the error output
- Check if it's a build error (likely TypeScript or import issue)
- Fix the issue, then go back to Step 2

### 6. Report

Give a brief summary:
- What was committed (files changed count + commit message)
- Push status
- Deploy status + production URL
- If anything failed, what went wrong and what was fixed
