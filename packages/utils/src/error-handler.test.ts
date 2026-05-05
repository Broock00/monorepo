import { describe, expect, it } from 'vitest';
import { normalizeError, toErrorMessage } from './error-handler.js';

describe('normalizeError', () => {
  it('preserves Error instances and merges context', () => {
    const err = new Error('fail');
    const normalized = normalizeError(err, { status: 500, url: 'https://example.com', code: 'ERR' });
    expect(normalized.message).toBe('fail');
    expect(normalized.status).toBe(500);
    expect(normalized.url).toBe('https://example.com');
    expect(normalized.code).toBe('ERR');
  });

  it('stringifies plain objects', () => {
    const normalized = normalizeError({ ok: false });
    expect(normalized.message).toBe('{"ok":false}');
  });

  it('does not throw on circular structures', () => {
    const circular: Record<string, unknown> = { a: 1 };
    circular.self = circular;
    const normalized = normalizeError(circular);
    expect(normalized.message).toBe('Unknown error');
    expect(normalized.cause).toBe(circular);
  });
});

describe('toErrorMessage', () => {
  it('returns Error.message', () => {
    expect(toErrorMessage(new Error('x'))).toBe('x');
  });

  it('returns string input unchanged', () => {
    expect(toErrorMessage('plain')).toBe('plain');
  });
});
