import type { ApiResponse } from '@turta/shared-types';

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

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
};

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
  try {
    return await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: withTimeoutSignal(REQUEST_TIMEOUT_MS),
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

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetchApi(path, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: options.cache,
    next: options.next,
  });

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
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetchApi(path, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: options.cache,
    next: options.next,
  });

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
