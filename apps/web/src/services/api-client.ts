import type { ApiResponse } from '@turta/shared-types';

/**
 * Browser: always same-origin `/api/v1` (Next rewrite → Nest) so HttpOnly
 * refresh cookies work (SameSite=Lax). Cross-origin NEXT_PUBLIC_API_URL breaks
 * preview login (cookie on API host, middleware on web host → bounce to /login).
 *
 * SSR/server: Node fetch cannot use relative `/api/v1` — must hit Nest with an
 * absolute URL (`API_PROXY_TARGET` or absolute `NEXT_PUBLIC_API_URL`).
 */
function resolveApiBase(): string {
  if (typeof window !== 'undefined') return '/api/v1';

  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured && !configured.startsWith('/')) {
    return configured.replace(/\/$/, '');
  }

  const upstream =
    process.env.API_PROXY_TARGET?.trim() || 'http://localhost:4000';
  return `${upstream.replace(/\/$/, '')}/api/v1`;
}

export const API_BASE = resolveApiBase();

export function getPublicApiBaseUrl() {
  return API_BASE;
}

/** Avoid infinite "Giriş yapılıyor…" when Nest API is down. */
const REQUEST_TIMEOUT_MS = 12_000;

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  token?: string | null;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  /** Skip 401 → refresh retry (used by refresh itself). */
  skipAuthRefresh?: boolean;
  /** Optional AbortSignal (debounce / unmount). */
  signal?: AbortSignal;
};

type TokenHandlers = {
  getAccessToken: () => string | null;
  setAccessToken: (token: string | null) => void;
  onSessionExpired?: () => void;
};

let tokenHandlers: TokenHandlers | null = null;
let refreshInFlight: Promise<string | null> | null = null;

/** AuthProvider binds memory access token for silent refresh. */
export function bindAuthTokenHandlers(handlers: TokenHandlers | null) {
  tokenHandlers = handlers;
}

async function parseJsonResponse<T>(
  response: Response,
): Promise<ApiResponse<T>> {
  try {
    return (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(
      'INVALID_RESPONSE',
      'API yanıtı okunamadı. Nest API çalışıyor mu? (pnpm dev:api)',
      response.status || 0,
    );
  }
}

function withTimeoutSignal(timeoutMs: number): AbortSignal {
  if (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal) {
    return AbortSignal.timeout(timeoutMs);
  }
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
}

async function fetchApi(path: string, init: RequestInit): Promise<Response> {
  const timeoutSignal = withTimeoutSignal(REQUEST_TIMEOUT_MS);
  const signal =
    init.signal &&
    typeof AbortSignal !== 'undefined' &&
    'any' in AbortSignal &&
    typeof AbortSignal.any === 'function'
      ? AbortSignal.any([timeoutSignal, init.signal])
      : (init.signal ?? timeoutSignal);

  try {
    return await fetch(`${API_BASE}${path}`, {
      ...init,
      credentials: 'include',
      signal,
    });
  } catch (err) {
    const aborted =
      err instanceof Error &&
      (err.name === 'AbortError' || err.name === 'TimeoutError');
    const isLocalApi = /localhost|127\.0\.0\.1/.test(API_BASE);
    throw new ApiError(
      aborted ? 'TIMEOUT' : 'NETWORK_ERROR',
      aborted
        ? isLocalApi
          ? 'API zaman aşımı. Nest kapalı olabilir — pnpm dev:api'
          : 'API zaman aşımı. Sunucu yanıt vermiyor; biraz sonra tekrar deneyin.'
        : isLocalApi
          ? 'API’ye bağlanılamadı. Nest çalışıyor mu? (localhost:4000)'
          : 'API’ye bağlanılamadı. Bağlantıyı kontrol edip tekrar deneyin.',
      0,
    );
  }
}

async function trySilentRefresh(): Promise<string | null> {
  if (!tokenHandlers) return null;
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const response = await fetchApi('/identity/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const payload = await parseJsonResponse<{ accessToken: string }>(
          response,
        );
        if (!response.ok || !payload.success || !payload.data?.accessToken) {
          tokenHandlers?.setAccessToken(null);
          tokenHandlers?.onSessionExpired?.();
          return null;
        }
        tokenHandlers.setAccessToken(payload.data.accessToken);
        return payload.data.accessToken;
      } catch {
        tokenHandlers?.setAccessToken(null);
        tokenHandlers?.onSessionExpired?.();
        return null;
      } finally {
        refreshInFlight = null;
      }
    })();
  }
  return refreshInFlight;
}

/**
 * HTTP client for Nest API only.
 * Why: apps/web must never import Prisma or hit legacy /api/* routes —
 * that keeps root `pnpm dev` untouched while we migrate.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = options.token ?? tokenHandlers?.getAccessToken() ?? null;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetchApi(path, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: options.cache,
    next: options.next,
    signal: options.signal,
  });

  if (
    response.status === 401 &&
    !options.skipAuthRefresh &&
    path !== '/identity/refresh' &&
    path !== '/identity/login' &&
    typeof window !== 'undefined'
  ) {
    const refreshed = await trySilentRefresh();
    if (refreshed) {
      return apiRequest<T>(path, {
        ...options,
        token: refreshed,
        skipAuthRefresh: true,
      });
    }
  }

  const payload = await parseJsonResponse<T>(response);

  if (!response.ok || !payload.success) {
    throw new ApiError(
      payload.error?.code ?? `HTTP_${response.status}`,
      payload.error?.message ?? 'İstek başarısız',
      response.status,
    );
  }

  return payload.data as T;
}

export async function apiRequestWithMeta<T>(
  path: string,
  options: RequestOptions = {},
): Promise<{ data: T; meta?: ApiResponse<T>['meta'] }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = options.token ?? tokenHandlers?.getAccessToken() ?? null;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetchApi(path, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: options.cache,
    next: options.next,
    signal: options.signal,
  });

  if (
    response.status === 401 &&
    !options.skipAuthRefresh &&
    typeof window !== 'undefined'
  ) {
    const refreshed = await trySilentRefresh();
    if (refreshed) {
      return apiRequestWithMeta<T>(path, {
        ...options,
        token: refreshed,
        skipAuthRefresh: true,
      });
    }
  }

  const payload = await parseJsonResponse<T>(response);

  if (!response.ok || !payload.success) {
    throw new ApiError(
      payload.error?.code ?? `HTTP_${response.status}`,
      payload.error?.message ?? 'İstek başarısız',
      response.status,
    );
  }

  return { data: payload.data as T, meta: payload.meta };
}

/** Restore access token from HttpOnly refresh cookie (F5). */
export async function refreshAccessToken(): Promise<string | null> {
  return trySilentRefresh();
}
