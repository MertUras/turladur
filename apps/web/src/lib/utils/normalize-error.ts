const NETWORK_ERROR_PATTERNS = [
  'failed to fetch',
  'networkerror',
  'load failed',
  'network request failed',
  'the internet connection appears to be offline',
];

function isNetworkErrorMessage(message: string): boolean {
  const normalized = message.trim().toLowerCase();
  return NETWORK_ERROR_PATTERNS.some((pattern) => normalized.includes(pattern));
}

/**
 * Normalize unknown thrown/rejected values into Error instances.
 * Prevents Next.js dev overlay from showing "[object Event]" for DOM events.
 */
export function normalizeError(
  value: unknown,
  fallbackMessage = 'Bir hata oluştu',
): Error {
  if (value instanceof Error) {
    if (value instanceof SyntaxError) {
      return new Error(
        'Sunucudan beklenmeyen bir yanıt alındı. Lütfen tekrar deneyin.',
      );
    }

    if (isNetworkErrorMessage(value.message)) {
      return new Error(
        'Sunucuya bağlanılamadı. Geliştirme sunucusunun çalıştığından emin olun ve tekrar deneyin.',
      );
    }

    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    if (isNetworkErrorMessage(value)) {
      return new Error(
        'Sunucuya bağlanılamadı. Geliştirme sunucusunun çalıştığından emin olun ve tekrar deneyin.',
      );
    }
    return new Error(value);
  }

  if (value instanceof Event) {
    const target = value.target;
    if (target instanceof HTMLImageElement && target.src) {
      return new Error(`Görsel yüklenemedi: ${target.src}`);
    }
    return new Error(fallbackMessage);
  }

  return new Error(fallbackMessage);
}

/**
 * Extract a user-facing message from a failed fetch response.
 */
export async function getResponseErrorMessage(
  response: Response,
  fallbackMessage = 'İşlem başarısız oldu',
): Promise<string> {
  try {
    const data = await response.json();
    if (data && typeof data === 'object') {
      const record = data as {
        error?: string | { message?: string };
        message?: string;
      };
      const nested =
        typeof record.error === 'object' && record.error
          ? record.error.message
          : undefined;
      const message =
        (typeof record.error === 'string' ? record.error : undefined) ??
        nested ??
        record.message;
      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }
  } catch {
    // Non-JSON error bodies fall back to status-based messaging.
  }

  return `${fallbackMessage} (HTTP ${response.status})`;
}
