import type { RoutePageOverlay } from '@turta/shared-types';

import type { RouteWithStats } from '@/services/route';

export function mergeRouteWithOverlay(
  route: RouteWithStats,
  overlay: RoutePageOverlay | null | undefined,
): RouteWithStats {
  if (!overlay?.exists) {
    return route;
  }

  const summary = overlay.summary?.trim();
  const body = overlay.body?.trim();

  return {
    ...route,
    description: summary || route.description,
    longDescription: body || route.longDescription,
  };
}

export function buildRoutePageMetadata(
  route: RouteWithStats,
  overlay: RoutePageOverlay | null | undefined,
): { title: string; description: string } {
  const seoTitle = overlay?.exists ? overlay.seoTitle?.trim() : '';
  const seoDescription = overlay?.exists ? overlay.seoDescription?.trim() : '';

  return {
    title: seoTitle || `${route.name} | turta`,
    description: (seoDescription || route.description).slice(0, 160),
  };
}

export function routeOverlaysByKey(
  overlays: RoutePageOverlay[],
): Map<string, RoutePageOverlay> {
  return new Map(overlays.map((overlay) => [overlay.routeKey, overlay]));
}
