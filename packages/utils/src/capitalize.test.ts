import { describe, expect, it } from 'vitest';
import { capitalize } from './capitalize.js';

describe('capitalize', () => {
  it('capitalizes ascii', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('handles empty string', () => {
    expect(capitalize('')).toBe('');
  });

  it('uppercases BMP prefix without splitting an astral remainder', () => {
    expect(capitalize('a𝕳')).toBe('A𝕳');
  });

  it('leaves leading whitespace uppercase mapping to the first code point', () => {
    expect(capitalize(' hi')).toBe(' hi');
  });
});
