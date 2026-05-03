import { normalizeError, toErrorMessage } from './error-handler.js';

export type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  /** JSON body; serialized automatically */
  json?: unknown;
  /** Query parameters appended to the path */
  searchParams?: Record<string, string | number | boolean | undefined | null>;
};

export type ApiClientConfig = {
  baseUrl: string;
  defaultHeaders?: HeadersInit;
  fetchImpl?: typeof fetch;
};

export type ApiClient = {
  request: <T>(path: string, options?: ApiRequestOptions) => Promise<T>;
  get: <T>(path: string, options?: ApiRequestOptions) => Promise<T>;
  post: <T>(path: string, options?: ApiRequestOptions) => Promise<T>;
  put: <T>(path: string, options?: ApiRequestOptions) => Promise<T>;
  patch: <T>(path: string, options?: ApiRequestOptions) => Promise<T>;
  delete: <T>(path: string, options?: ApiRequestOptions) => Promise<T>;
};

function buildUrl(baseUrl: string, path: string, searchParams?: ApiRequestOptions['searchParams']) {
  const url = new URL(path.startsWith('http') ? path : `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined || value === null) continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/**
 * Thin fetch abstraction: JSON in/out, typed responses, consistent errors.
 */
export function createApiClient(config: ApiClientConfig): ApiClient {
  const fetchFn = config.fetchImpl ?? fetch;

  const request = async <T>(path: string, options: ApiRequestOptions = {}): Promise<T> => {
    const { json, searchParams, headers: optionHeaders, ...init } = options;
    const url = buildUrl(config.baseUrl, path, searchParams);

    const headers = new Headers(config.defaultHeaders);
    if (optionHeaders) {
      new Headers(optionHeaders).forEach((value, key) => headers.set(key, value));
    }

    let body: BodyInit | undefined = init.body as BodyInit | undefined;
    if (json !== undefined) {
      headers.set('content-type', 'application/json');
      body = JSON.stringify(json);
    }

    try {
      const response = await fetchFn(url, { ...init, headers, body });
      const contentType = response.headers.get('content-type') ?? '';
      const isJson = contentType.includes('application/json');
      const payload = isJson ? await response.json().catch(() => null) : await response.text();

      if (!response.ok) {
        const message =
          typeof payload === 'object' && payload && 'message' in payload
            ? String((payload as { message: unknown }).message)
            : typeof payload === 'string'
              ? payload
              : response.statusText;
        throw normalizeError(new Error(message || `HTTP ${response.status}`), {
          status: response.status,
          url,
        });
      }

      return payload as T;
    } catch (err) {
      if (err && typeof err === 'object' && 'code' in err) {
        throw err;
      }
      throw normalizeError(err, { url });
    }
  };

  return {
    request: async <T>(path: string, options?: ApiRequestOptions) => request<T>(path, options),
    get: <T>(path: string, options?: ApiRequestOptions) =>
      request<T>(path, { ...options, method: 'GET' }),
    post: <T>(path: string, options?: ApiRequestOptions) =>
      request<T>(path, { ...options, method: 'POST' }),
    put: <T>(path: string, options?: ApiRequestOptions) =>
      request<T>(path, { ...options, method: 'PUT' }),
    patch: <T>(path: string, options?: ApiRequestOptions) =>
      request<T>(path, { ...options, method: 'PATCH' }),
    delete: <T>(path: string, options?: ApiRequestOptions) =>
      request<T>(path, { ...options, method: 'DELETE' }),
  };
}

export { toErrorMessage };
