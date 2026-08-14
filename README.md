# turta (tourtech)

Türkiye turizm ekosistemi için **Nx + pnpm** monorepo: NestJS API + Next.js web.

Tasarıma ve iş kurallarına dokunulmadan korunan hedef yapı: **modüler monolit backend** + **App Router frontend** + **paylaşılan paketler**.

| Doküman                                      | İçerik                            |
| -------------------------------------------- | --------------------------------- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Klasör sözleşmesi, SoC, alias’lar |
| [docs/ONBOARDING.md](docs/ONBOARDING.md)     | Yeni geliştirici kurulumu         |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)     | Production / ortamlar             |

---

## Tech stack

| Katman   | Teknoloji                                                                    |
| -------- | ---------------------------------------------------------------------------- |
| Monorepo | Nx 20, pnpm 9, TypeScript 5.8                                                |
| Web      | Next.js 15 (App Router), React 19, Tailwind 4, TanStack Query                |
| API      | NestJS 11, CQRS, EventEmitter, BullMQ                                        |
| Data     | PostgreSQL 16, Prisma 6 (multi-schema), Redis 7                              |
| Shared   | `@turta/shared-types`, `@turta/shared-constants`, `@turta/shared-validators` |

---

## Repo haritası

```
turta/
├── apps/
│   ├── api/                 # NestJS — tek backend (web + mobil)
│   │   ├── prisma/          # schema, migrations, seed
│   │   └── src/
│   │       ├── core/        # auth, db, cache, mail, queue, storage, filters
│   │       ├── shared/      # BusinessException, utils
│   │       └── modules/     # catalog | booking | payment | identity | …
│   └── web/                 # Next.js — UI only (Prisma yok)
│       └── src/
│           ├── app/         # (marketing|customer|partner|admin|auth)
│           ├── components/  # ui | layout | features/*
│           ├── services/    # HTTP client’lar
│           ├── lib/         # utils, constants
│           └── providers/
├── packages/                # shared-types | shared-constants | shared-validators
├── infrastructure/docker/   # local Postgres, Redis, …
├── e2e/                     # Playwright
└── docs/
```

**Kural:** UI iş kuralı yazmaz; API başka modülün service’ini import etmez (event ile konuşur).

Detay: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Getting started

```bash
pnpm install
pnpm docker:up
pnpm --filter api prisma migrate deploy
pnpm --filter api prisma db seed
pnpm dev
```

| Servis           | URL                            |
| ---------------- | ------------------------------ |
| Web (`apps/web`) | http://localhost:3001          |
| API (`apps/api`) | http://localhost:4000          |
| Swagger          | http://localhost:4000/api/docs |

`pnpm dev` = web + api paralel (`pnpm dev:apps`).

### Ortam değişkenleri

| Dosya                   | Rol                                            |
| ----------------------- | ---------------------------------------------- |
| `.env.example` (kök)    | Workspace örnekleri                            |
| `apps/api/.env.example` | API (DB, JWT, SMTP, Redis, …)                  |
| `apps/web`              | `NEXT_PUBLIC_*` / API base URL (onboarding’de) |

Gerçek `.env` dosyaları commit edilmez.

### Dev server sorun giderme

1. Tek örnek çalıştırın — birden fazla `pnpm dev` açmayın.
2. Çalışırken `.next` silmeyin — yalnızca sunucu kapalıyken.
3. Temiz yeniden başlatma: `pnpm dev:clean`

---

## Useful scripts

| Komut                            | Açıklama                   |
| -------------------------------- | -------------------------- |
| `pnpm dev` / `pnpm dev:apps`     | Web :3001 + API :4000      |
| `pnpm build:apps`                | Shared + web + api build   |
| `pnpm db:migrate:deploy`         | Prisma migrate (api)       |
| `pnpm db:seed`                   | API seed                   |
| `pnpm docker:up` / `docker:down` | Local infra                |
| `pnpm test:e2e`                  | Playwright (baseURL :3001) |
| `pnpm lint`                      | web + api lint             |

---

## Docker (local)

```bash
pnpm docker:up
# veya
docker compose -f infrastructure/docker/docker-compose.yml up -d
```

BullMQ için Redis `maxmemory-policy noeviction` compose içinde ayarlıdır.

```bash
docker exec turta-redis redis-cli CONFIG GET maxmemory-policy
# beklenen: noeviction
```

---

## Mimari ilkeler (kısa)

1. **apps/web** içinde DB / Prisma yok — sadece HTTP.
2. **apps/api** domain modülleri bağımsız; cross-module = event.
3. Response sözleşmesi: `{ success, data, error, meta? }`.
4. Global hata: `GlobalExceptionFilter` + `BusinessException`.
5. İsimlendirme: klasör/dosya `kebab-case` (bkz. `.cursor/rules`).

Bu README yalnızca yapı ve çalıştırma bilgisini tanımlar; UI tasarımı veya iş akışı değiştirilmez.
