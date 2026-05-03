export type NormalizedError = Error & {
  code?: string;
  status?: number;
  url?: string;
  cause?: unknown;
};

export function normalizeError(
  input: unknown,
  context?: { status?: number; url?: string; code?: string },
): NormalizedError {
  if (input instanceof Error) {
    const normalized = input as NormalizedError;
    if (context?.status !== undefined) normalized.status = context.status;
    if (context?.url !== undefined) normalized.url = context.url;
    if (context?.code !== undefined) normalized.code = context.code;
    return normalized;
  }

  const message =
    typeof input === 'string'
      ? input
      : input === null || input === undefined
        ? 'Unknown error'
        : JSON.stringify(input);

  const err = new Error(message) as NormalizedError;
  err.cause = input;
  if (context?.status !== undefined) err.status = context.status;
  if (context?.url !== undefined) err.url = context.url;
  if (context?.code !== undefined) err.code = context.code;
  return err;
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return 'Unknown error';
  }
}
