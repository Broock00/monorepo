import { describe, expect, it } from 'vitest';
import { capitalize } from './capitalize.js';

describe('capitalize', () => {
  it('capitalizes ascii', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('handles empty string', () => {
    expect(capitalize('')).toBe('');
  });
});
