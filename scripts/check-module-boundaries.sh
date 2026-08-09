#!/usr/bin/env bash
# Fail if module A imports module B's services/ (cross-domain service coupling).
# Allowed: same-module imports, events/, dto/ (prefer shared), core/, shared/.
# Excludes: **/__tests__/**
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MODULES="$ROOT/apps/api/src/modules"

if [[ ! -d "$MODULES" ]]; then
  echo "error: modules dir not found: $MODULES" >&2
  exit 1
fi

# ../../other-module/services/...
PATTERN="from ['\"]\\.\\./\\.\\./[a-z0-9-]+/services/"

HITS="$(
  rg -n --glob '!**/\__tests__/**' -e "$PATTERN" "$MODULES" || true
)"

if [[ -n "$HITS" ]]; then
  echo "❌ Module boundary violation: cross-module services/ import" >&2
  echo "" >&2
  echo "$HITS" >&2
  echo "" >&2
  echo "Rule: modules/A must not import modules/B/services/**" >&2
  echo "Use events (modules/*/events) or keep writes in the owning module." >&2
  exit 1
fi

echo "✓ Module boundary check passed (no cross-module services/ imports)"
