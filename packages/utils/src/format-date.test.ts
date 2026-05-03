import { describe, expect, it } from 'vitest';
import { formatDate } from './format-date.js';

describe('formatDate', () => {
  it('formats valid dates', () => {
    const s = formatDate(new Date('2024-06-01T12:00:00.000Z'));
    expect(s.length).toBeGreaterThan(0);
  });

  it('returns empty string for invalid input', () => {
    expect(formatDate('not-a-date')).toBe('');
  });
});
