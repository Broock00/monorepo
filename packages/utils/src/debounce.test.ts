import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce } from './debounce.js';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('invokes the function once after the delay when called repeatedly', () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d();
    d();
    d();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('cancel prevents the deferred invocation', () => {
    const fn = vi.fn();
    const d = debounce(fn, 50);
    d();
    d.cancel();
    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();
  });

  it('treats non-finite delay as zero', () => {
    const fn = vi.fn();
    const d = debounce(fn, Number.NaN);
    d();
    vi.advanceTimersByTime(0);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not schedule negative delays below zero', () => {
    const fn = vi.fn();
    const d = debounce(fn, -10);
    d();
    vi.advanceTimersByTime(0);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
