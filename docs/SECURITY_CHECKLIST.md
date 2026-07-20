# Security Checklist (OWASP-oriented, Sprint 18)

Temel penetrasyon / self-review listesi. Production öncesi işaretleyin.

## Authentication & session

- [ ] JWT kısa ömür (`JWT_EXPIRES_IN=15m`), refresh HttpOnly cookie (legacy NextAuth ayrı stack)
- [ ] Login/register rate limit: 5/dk (`@Throttle` identity endpoints)
- [ ] Şifreler bcrypt, düz metin log yok

## API

- [ ] Global validation pipe: whitelist + forbidNonWhitelisted
- [ ] CORS: sadece `FRONTEND_URL` (wildcard yok prod)
- [ ] Helmet HTTP headers (`main.ts`)
- [ ] Throttler: 100 req/dk default; search 30/dk; webhook `@SkipThrottle`
- [ ] Partner izolasyonu: `partnerId` service katmanında
- [ ] Admin/partner route’ları `@Roles`

## Data

- [ ] Prisma parameterized queries (SQL concat yok)
- [ ] Hassas alanlar response’da yok (`passwordHash`, kart verisi)
- [ ] Webhook imza doğrulama (İyzico prod’da zorunlu — sandbox’ta doğrula)

## Frontend

- [ ] Token memory/localStorage’a yazılmıyor (Nest web client)
- [ ] `dangerouslySetInnerHTML` yok / sanitize
- [ ] CSP (Vercel headers veya middleware) — prod hardening

## Ops

- [ ] Secret’lar env’de, `.env` gitignore
- [ ] `pnpm audit` CI’da
- [ ] Sentry `SENTRY_DSN` prod/staging ayrı project
- [ ] DB backup before major migration

## Periyodik

- [ ] Dependency güncelleme (Renovate/Dependabot)
- [ ] Failed login / 429 spike izleme
