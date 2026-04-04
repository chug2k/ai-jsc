import { describe, it, expect } from 'vitest';
import { stripCommitmentBlock, extractCommitments, hasCommitmentBlock } from '@/lib/commitments';

describe('stripCommitmentBlock', () => {
  it('removes block from text', () => {
    const text = "Great.\nCOMMITMENTS_BLOCK_START\n- Do X\nCOMMITMENTS_BLOCK_END\nNow closing.";
    expect(stripCommitmentBlock(text)).toBe('Great.\n\nNow closing.');
  });

  it('returns text unchanged if no block', () => {
    expect(stripCommitmentBlock('Hello world')).toBe('Hello world');
  });
});

describe('extractCommitments', () => {
  it('extracts simple commitments', () => {
    const text = `COMMITMENTS_BLOCK_START\n- Send 3 emails by Friday\n- Update resume\nCOMMITMENTS_BLOCK_END`;
    expect(extractCommitments(text)).toEqual(['Send 3 emails by Friday', 'Update resume']);
  });

  it('handles bullet points with •', () => {
    const text = `COMMITMENTS_BLOCK_START\n• Do X\n• Do Y\nCOMMITMENTS_BLOCK_END`;
    expect(extractCommitments(text)).toEqual(['Do X', 'Do Y']);
  });

  it('ignores blank lines', () => {
    const text = `COMMITMENTS_BLOCK_START\n- Do X\n\n- Do Y\nCOMMITMENTS_BLOCK_END`;
    expect(extractCommitments(text)).toEqual(['Do X', 'Do Y']);
  });

  it('returns empty array when no block', () => {
    expect(extractCommitments('No commitments here.')).toEqual([]);
  });

  it('handles block embedded in longer text', () => {
    const text = `Here they are:\n\nCOMMITMENTS_BLOCK_START\n- First\n- Second\nCOMMITMENTS_BLOCK_END\n\nNow closing.`;
    expect(extractCommitments(text)).toHaveLength(2);
  });
});

describe('hasCommitmentBlock', () => {
  it('returns true when block present', () => {
    expect(hasCommitmentBlock('COMMITMENTS_BLOCK_START\n- X\nCOMMITMENTS_BLOCK_END')).toBe(true);
  });

  it('returns false when no block', () => {
    expect(hasCommitmentBlock('Just regular text')).toBe(false);
  });
});
