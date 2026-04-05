/**
 * Soul loader — reads and caches soul markdown files from disk.
 *
 * Souls define an agent's immutable personality: voice, lens, rules, anti-patterns.
 * They live as .md files in src/lib/council/souls/ and are loaded once at startup.
 */

import * as fs from 'fs';
import * as path from 'path';

const SOULS_DIR = path.join(process.cwd(), 'src', 'lib', 'council', 'souls');

const cache = new Map<string, string>();

/** Map from soul ID to filename (handles hyphenated filenames) */
const SOUL_FILES: Record<string, string> = {
  facilitator: 'facilitator.md',
  strategist: 'strategist.md',
  operator: 'operator.md',
  devils_advocate: 'devils-advocate.md',
  recruiter: 'market-mirror.md',
  founder: 'founder.md',
  therapist: 'witness.md',
  network: 'connector.md',
};

/**
 * Get the soul markdown content for a given soul ID.
 * Returns empty string if not found (graceful fallback for custom/famous agents).
 */
export function getSoul(soulId: string): string {
  if (cache.has(soulId)) return cache.get(soulId)!;

  const filename = SOUL_FILES[soulId];
  if (!filename) return '';

  try {
    const content = fs.readFileSync(path.join(SOULS_DIR, filename), 'utf-8');
    cache.set(soulId, content);
    return content;
  } catch {
    console.warn(`[souls] Could not load soul file for "${soulId}"`);
    return '';
  }
}

/** Get all available soul IDs. */
export function getAllSoulIds(): string[] {
  return Object.keys(SOUL_FILES);
}

/** Check if a soul file exists for a given ID. */
export function hasSoul(soulId: string): boolean {
  return soulId in SOUL_FILES;
}
