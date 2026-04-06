/**
 * Soul loader — reads soul markdown files.
 *
 * Souls define an agent's immutable personality: voice, lens, rules, anti-patterns.
 * They live as .md files in src/lib/council/souls/.
 *
 * On the server (API routes, simulation), loads from disk via fs.
 * On the client (session store), souls are embedded inline as a fallback.
 */

const cache = new Map<string, string>();

/** Map from soul ID to filename */
const SOUL_FILES: Record<string, string> = {
  facilitator: 'facilitator.md',
  strategist: 'strategist.md',
  operator: 'operator.md',
  devils_advocate: 'devils-advocate.md',
  recruiter: 'market-mirror.md',
  therapist: 'witness.md',
  interview_coach: 'interview-coach.md',
  insider: 'insider.md',
  // Legacy
  founder: 'founder.md',
  network: 'connector.md',
};

function loadFromDisk(soulId: string): string {
  try {
    // Dynamic require to avoid bundler pulling fs into client
    const fs = require('fs');
    const path = require('path');
    const soulsDir = path.join(process.cwd(), 'src', 'lib', 'council', 'souls');
    const filename = SOUL_FILES[soulId];
    if (!filename) return '';
    return fs.readFileSync(path.join(soulsDir, filename), 'utf-8');
  } catch {
    return '';
  }
}

/**
 * Get the soul markdown content for a given soul ID.
 * Returns empty string if not found.
 */
export function getSoul(soulId: string): string {
  if (cache.has(soulId)) return cache.get(soulId)!;

  const content = loadFromDisk(soulId);
  if (content) {
    cache.set(soulId, content);
  }
  return content;
}

/** Get all available soul IDs. */
export function getAllSoulIds(): string[] {
  return Object.keys(SOUL_FILES);
}

/** Check if a soul file exists for a given ID. */
export function hasSoul(soulId: string): boolean {
  return soulId in SOUL_FILES;
}
