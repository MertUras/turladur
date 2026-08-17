'use client';

import { usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim() ?? '';
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || 'https://eu.i.posthog.com';

async function getPosthog() {
  if (!POSTHOG_KEY) return null;
  const { default: posthog } = await import('posthog-js');
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
  return posthog;
}

export function PostHogProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    void getPosthog().then((posthog) => {
      if (!posthog || !pathname) return;
      posthog.capture('page_view', { path: pathname });
    });
  }, [pathname]);

  return children;
}
