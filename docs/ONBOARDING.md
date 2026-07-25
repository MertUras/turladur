# turta — Geliştirici Onboarding (~30 dk)

Monorepo: **Nest API** (`apps/api` → `:4000`) + **Next web** (`apps/web` → `:3001`).

## 1. Ön koşullar

- Node 22+, pnpm 9.15+, Docker Desktop

## 2. Kurulum

```bash
git clone <repo> && cd tourtech
pnpm install
cp apps/api/.env.example apps/api/.env
cp infrastructure/docker/.env.example infrastructure/docker/.env   # gerekirse
pnpm docker:up
pnpm --filter api prisma:deploy
pnpm --filter api prisma db seed   # seed varsa
```

## 3. Çalıştırma

| Komut           | Açıklama              |
| --------------- | --------------------- |
| `pnpm dev`      | Web :3001 + API :4000 |
| `pnpm dev:apps` | `pnpm dev` ile aynı   |
| `pnpm dev:api`  | Sadece API            |
| `pnpm dev:web`  | Sadece web (3001)     |

- Web: http://localhost:3001
- Swagger: http://localhost:4000/api/docs
- Health: http://localhost:4000/api/v1/health

## 4. Ortam değişkenleri

| Değişken              | Nerede                | Açıklama                          |
| --------------------- | --------------------- | --------------------------------- |
| `DATABASE_URL`        | `apps/api/.env`       | PostgreSQL (local Docker `:5433`) |
| `REDIS_URL`           | `apps/api/.env`       | Redis                             |
| `JWT_SECRET`          | `apps/api/.env`       | API JWT                           |
| `FRONTEND_URL`        | `apps/api/.env`       | CORS (web origin)                 |
| `NEXT_PUBLIC_API_URL` | `apps/web/.env.local` | `http://localhost:4000/api/v1`    |
| `SENTRY_DSN`          | api + web             | Opsiyonel hata izleme             |

## 5. Test

```bash
pnpm --filter api test:e2e          # Nest health (Jest)
pnpm test:e2e:install               # Playwright browser (ilk sefer)
pnpm docker:up && pnpm dev:apps     # ayrı terminal
pnpm test:e2e                       # smoke + kritik API akışı
```

## 6. Migration

Yeni migration `apps/api/prisma/migrations/` altında:

```bash
pnpm --filter api prisma:deploy
```
