export type Debounced<T extends (...args: never[]) => unknown> = ((
  ...args: Parameters<T>
) => void) & { cancel: () => void };

/**
 * Returns a debounced function that delays invoking `fn` until `delayMs` have elapsed
 * since the last call.
 */
export function debounce<T extends (...args: never[]) => unknown>(
  fn: T,
  delayMs: number,
): Debounced<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const ms = Number.isFinite(delayMs) ? Math.max(0, delayMs) : 0;

  const debounced = (...args: Parameters<T>) => {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, ms);
  };

  debounced.cancel = () => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  return debounced as Debounced<T>;
}
