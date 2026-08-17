type AnalyticsProps = Record<string, string | number | boolean | undefined>;

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim() ?? '';
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || 'https://eu.i.posthog.com';

/** Block PII / payment fields even if a caller passes them by mistake. */
const BLOCKED_PROP =
  /^(email|phone|password|otp|card|cvc|cvv|tckn|identity|name|firstName|lastName|address)/i;

export function isProductAnalyticsEnabled(
  key = POSTHOG_KEY,
  hasWindow = typeof window !== 'undefined',
): boolean {
  return hasWindow && key.trim().length > 0;
}

export function sanitizeAnalyticsProperties(
  properties?: AnalyticsProps,
): Record<string, string | number | boolean> {
  const safe: Record<string, string | number | boolean> = {};
  if (!properties) return safe;
  for (const [key, value] of Object.entries(properties)) {
    if (value === undefined) continue;
    if (BLOCKED_PROP.test(key)) continue;
    safe[key] = value;
  }
  return safe;
}

/** Anonymous product events. Never pass email, phone, card, OTP, or names. */
export function captureProductEvent(
  event: string,
  properties?: AnalyticsProps,
): void {
  if (!isProductAnalyticsEnabled()) return;

  const safe = sanitizeAnalyticsProperties(properties);

  void import('posthog-js').then(({ default: posthog }) => {
    if (!posthog.__loaded) {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        person_profiles: 'identified_only',
        capture_pageview: false,
        capture_pageleave: false,
        autocapture: false,
        disable_session_recording: true,
        persistence: 'memory',
      });
    }
    posthog.capture(event, safe);
  });
}
