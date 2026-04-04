const BLOCK_REGEX = /COMMITMENTS_BLOCK_START\n([\s\S]*?)\nCOMMITMENTS_BLOCK_END/;

/** Remove the commitment block markers from display text. */
export function stripCommitmentBlock(text: string): string {
  return text.replace(BLOCK_REGEX, '').trim();
}

/** Extract commitment texts from the block markers. Returns empty array if no block found. */
export function extractCommitments(text: string): string[] {
  const match = text.match(BLOCK_REGEX);
  if (!match) return [];
  return match[1].split('\n').map(l => l.replace(/^[-•]\s*/, '').trim()).filter(Boolean);
}

/** Check if text contains a commitment block. */
export function hasCommitmentBlock(text: string): boolean {
  return BLOCK_REGEX.test(text);
}
