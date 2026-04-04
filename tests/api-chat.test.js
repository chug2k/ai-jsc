import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/server
vi.mock('next/server', () => ({
  NextRequest: class { constructor(url) { this.url = url; } },
  NextResponse: { json: (body, init) => ({ body, status: init?.status || 200 }) },
}));

// Mock supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }) },
  }),
}));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('/api/chat route', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    process.env.OPENAI_API_KEY = 'sk-test-key';
  });

  it('rejects request without system prompt', async () => {
    const { POST } = await import('@/app/api/chat/route');
    const request = { json: async () => ({ messages: [{ role: 'user', content: 'hi' }] }) };
    const res = await POST(request);
    expect(res.status).toBe(400);
  });

  it('returns AI text on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'Hello from AI' } }] }),
    });

    const { POST } = await import('@/app/api/chat/route');
    const request = {
      json: async () => ({
        system: 'You are helpful.',
        messages: [{ role: 'user', content: 'hi' }],
      }),
    };
    const res = await POST(request);
    expect(res.body.text).toBe('Hello from AI');
  });

  it('handles thinking model fallback', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: '', reasoning_content: 'Thinking... The answer is 42.' } }],
      }),
    });

    const { POST } = await import('@/app/api/chat/route');
    const request = {
      json: async () => ({
        system: 'sys',
        messages: [{ role: 'user', content: 'q' }],
      }),
    };
    const res = await POST(request);
    expect(res.body.text).toContain('42');
  });
});
