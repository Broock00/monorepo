import { describe, expect, it, vi } from 'vitest';
import { createApiClient } from './api-client.js';

describe('createApiClient', () => {
  it('parses JSON responses', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 1 }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
    const client = createApiClient({
      baseUrl: 'https://api.example.com',
      fetchImpl: fetchImpl as typeof fetch,
    });
    await expect(client.get<{ id: number }>('/items')).resolves.toEqual({ id: 1 });
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://api.example.com/items',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('prefers message on failed JSON responses', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'Bad input' }), {
        status: 422,
        headers: { 'content-type': 'application/json' },
      }),
    );
    const client = createApiClient({
      baseUrl: 'https://api.example.com',
      fetchImpl: fetchImpl as typeof fetch,
    });
    await expect(client.get('/x')).rejects.toMatchObject({ message: 'Bad input', status: 422 });
  });

  it('falls back to error field when message is absent', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: 'Not allowed' }), {
        status: 403,
        headers: { 'content-type': 'application/json' },
      }),
    );
    const client = createApiClient({
      baseUrl: 'https://api.example.com',
      fetchImpl: fetchImpl as typeof fetch,
    });
    await expect(client.get('/x')).rejects.toMatchObject({ message: 'Not allowed' });
  });

  it('rethrows normalized errors from the fetch layer', async () => {
    const existing = Object.assign(new Error('opaque'), { code: 'ABORT', status: 0 });
    const fetchImpl = vi.fn().mockRejectedValue(existing);
    const client = createApiClient({
      baseUrl: 'https://api.example.com',
      fetchImpl: fetchImpl as typeof fetch,
    });
    await expect(client.get('/x')).rejects.toBe(existing);
  });
});
