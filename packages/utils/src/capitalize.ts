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
  const rest = value.slice(String.fromCodePoint(first).length);
  return `${String.fromCodePoint(first).toLocaleUpperCase()}${rest}`;
}
