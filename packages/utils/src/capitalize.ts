/**
 * Capitalizes the first character of a string (Unicode-safe).
 */
export function capitalize(value: string): string {
  if (!value) {
    return value;
  }
  const first = value.codePointAt(0);
  if (first === undefined) {
    return value;
  }
  const head = String.fromCodePoint(first);
  const rest = value.slice(head.length);
  return `${head.toLocaleUpperCase()}${rest}`;
}
