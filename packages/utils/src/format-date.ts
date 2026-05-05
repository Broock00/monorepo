const defaultFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
});

function toValidDate(date: Date | string | number): Date | null {
  if (typeof date === 'number' && Number.isNaN(date)) {
    return null;
  }
  const d = date instanceof Date ? date : new Date(date);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Formats a date for display using the runtime locale.
 * Invalid values (including `NaN` timestamps) yield an empty string.
 */
export function formatDate(date: Date | string | number): string {
  const d = toValidDate(date);
  if (!d) {
    return '';
  }
  return defaultFormatter.format(d);
}
