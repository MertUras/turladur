# Production Deployment (Sprint 18)

## Hedef mimari

| Bileşen        | Önerilen host           | Not                                      |
| -------------- | ----------------------- | ---------------------------------------- |
| `apps/web`     | Vercel                  | Custom domain, SSL otomatik              |
| `apps/api`     | Railway / Fly.io        | `PORT`, health check `/api/v1/health`    |
| PostgreSQL     | Neon `main` branch      | **Pooler** URL kullan (connection limit) |
| Redis          | Upstash / Railway Redis | BullMQ + cache                           |
| Object storage | S3 / R2                 | MinIO sadece local                       |
| CDN            | Cloudflare (opsiyonel)  | Statik + `CDN_URL` görseller             |

## Vercel (`apps/web`)

1. Root Directory: `apps/web`
2. Build: `pnpm --filter web build` (monorepo root install)
3. Env: `NEXT_PUBLIC_API_URL=https://api.turladur.com/api/v1`
4. Opsiyonel: `SENTRY_DSN`, `SENTRY_AUTH_TOKEN` (source maps)

## Railway (`apps/api`)

1. Dockerfile veya Nixpacks; start: `node dist/main.js`
2. Release command: `pnpm prisma migrate deploy --schema=prisma/schema.prisma`
3. Env: `DATABASE_URL` (Neon pooler), `REDIS_URL`, `JWT_SECRET`, `FRONTEND_URL`, `SENTRY_DSN`
4. Health check path: `/api/v1/health`

## Neon

- Develop: branch `develop`; Staging: branch `staging`; Production: branch `production`
- Connection string: `-pooler` host for serverless/API runtime; **Direct** for `prisma migrate deploy`
- CI secrets: `DEV_DATABASE_URL`, `STAGING_DATABASE_URL` (bkz. `.github/workflows/deploy-*.yml`)
- Migration öncesi staging backup (Neon snapshot / `pg_dump`)

## GitHub Actions (Sprint 19)

| Workflow             | Trigger        | Secret                 |
| -------------------- | -------------- | ---------------------- |
| `deploy-dev.yml`     | push `develop` | `DEV_DATABASE_URL`     |
| `deploy-staging.yml` | push `staging` | `STAGING_DATABASE_URL` |

Repo → Settings → Secrets and variables → Actions → Neon Direct URL ekle.

## Cloudflare (P1)

- Proxy `www` + apex → Vercel
- Cache rules: `/_next/static/*`, public images on `CDN_URL`
- API subdomain `api` → Railway (DNS only veya limited proxy)

## Uptime (18.10)

Better Stack / UptimeRobot: GET `https://api.turladur.com/api/v1/health` every 1–5 min, alert on non-200 or `data.status !== ok`.

## Soft launch (18.18)

- Staging QA → prod deploy → kapalı beta (davetli partner + test müşteri)
- Sentry + health alert aktif
- Rollback: Vercel instant rollback + Railway previous deployment
