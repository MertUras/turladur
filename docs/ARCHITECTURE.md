# turta — Architecture

Bu doküman **klasör sözleşmesini** sabitler. UI tasarımı ve iş kuralları burada değiştirilmez; amaç okunabilir, ölçeklenebilir monorepo düzenidir.

## Neden bu şekil?

Trendyol tarzı ölçekte tipik tercih: **Nx monorepo + modüler monolit API + ince BFF’siz UI**.

Tek kök altında `/src/db` + `/src/api` + `/src/ui` flatten **yapılmaz** — NestJS modül sınırları ve Next.js App Router dosya routing’i kırılır.

Kavramsal SoC map:

| Kavram                     | Konum                                                    |
| -------------------------- | -------------------------------------------------------- |
| DB connection              | `apps/api/src/core/database/`                            |
| Schema / migrate / seed    | `apps/api/prisma/`                                       |
| HTTP + business            | `apps/api/src/modules/{domain}/`                         |
| Cross-cutting              | `apps/api/src/core/` (auth, cache, mail, queue, filters) |
| Shared types / enums / zod | `packages/shared-*`                                      |
| UI                         | `apps/web/src/`                                          |

## API modül iskeleti

Her domain (`catalog`, `booking`, `payment`, `identity`, `notification`, `partner`, `review`, `analytics`, `admin`, `content`):

```
modules/{domain}/
├── {domain}.module.ts
├── controllers/     # HTTP, DTO bağlama, guard
├── services/        # iş kuralları
├── dto/             # class-validator
├── commands/        # CQRS yazma (opsiyonel — karmaşık akışlarda)
├── queries/         # CQRS okuma (opsiyonel)
├── events/          # yayınlanan event’ler
├── listeners/       # başka modül event’leri (service import YOK)
└── __tests__/
```

İleride şişkin service’lerden Prisma ayırmak için **hedef** klasör (zorunlu değil; davranış değiştirmeden, ayrı PR’larda):

```
modules/{domain}/repositories/   # saf DB okuma/yazma — henüz standart zorunluluk değil
```

## Web iskeleti

```
apps/web/src/
├── app/
│   ├── (marketing)/   # public katalog, blog, …
│   ├── (customer)/    # checkout, bookings, profile
│   ├── (partner)/     # partner portal
│   ├── (admin)/       # admin
│   └── (auth)/        # login / register
├── components/
│   ├── ui/            # atomik
│   ├── layout/
│   └── features/      # domain UI
├── services/          # Nest HTTP client (iş kuralı yok)
├── lib/
└── providers/
```

## Path aliases

| Alias                      | Hedef                        |
| -------------------------- | ---------------------------- |
| `@turta/shared-types`      | `packages/shared-types`      |
| `@turta/shared-constants`  | `packages/shared-constants`  |
| `@turta/shared-validators` | `packages/shared-validators` |
| `@/*` (web)                | `apps/web/src/*`             |

API içinde göreli import’lar (`../../../core/...`) geçerlidir; büyük taşıma yapılmadan alias eklemek isteğe bağlıdır.

## Hata yönetimi

- Nest: `apps/api/src/core/filters/global-exception.filter.ts`
- Domain: `BusinessException` (`apps/api/src/shared/exceptions/`)
- Web: `services/api-client.ts` üzerinden API `error.code` / `message`

## Yasaklar (yapıyı bozmamak için)

- `apps/web` içine Prisma / DB erişimi ekleme
- Modül A service’ini Modül B’den import etme
- App Router `app/` ağacını `pages/` veya `ui/` altına taşıma
- Finder kopyası klasörleri (`* 2`) commit etme — `.gitignore` ile engelli

### Modül sınır kontrolü (CI)

`modules/A` → `modules/B/services/**` import’ları CI’da reddedilir:

```bash
pnpm check:module-boundaries
# scripts/check-module-boundaries.sh — .github/workflows/ci.yml adımı
```

İzinli: aynı modül içi service, `modules/*/events/**`, DTO (tercihen `packages/shared-*`), `core/`, `shared/`.  
`__tests__` hariç tutulur. Cross-modül yazma için event (`EventEmitter2`) kullan.

## Hijyen

Boş `* 2` klasörleri (macOS kopyası) runtime’a dahil değildir; silinmeleri davranışı değiştirmez.
