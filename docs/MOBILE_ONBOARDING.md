# Mobil Ekip — API Onboarding

TurlaDur mobil uygulaması **tek NestJS API** kullanır. Ayrı mobil backend / DB yoktur.

## Ortamlar

| Ortam              | API base URL                              | Neon DB branch  | Ne zaman               |
| ------------------ | ----------------------------------------- | --------------- | ---------------------- |
| Local (opsiyonel)  | `http://localhost:4000/api/v1`            | Docker Postgres | Offline / kendi deneme |
| **Dev (önerilen)** | `https://dev-api.turladur.com/api/v1`     | `develop`       | Günlük geliştirme      |
| Staging            | `https://staging-api.turladur.com/api/v1` | `staging`       | QA / demo              |
| Production         | `https://api.turladur.com/api/v1`         | `production`    | Store release          |

> Dev API henüz deploy edilmediyse geçici olarak local API veya legacy Next (`:3000`) kullanılabilir — ekiple teyit et.

## Hızlı başlangıç (local API)

```bash
git clone https://github.com/MertUras/turladur.git   # veya tourtech repo
cd turladur
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm docker:up
pnpm --filter api prisma migrate deploy
pnpm --filter api prisma db seed
pnpm dev:api
```

- Swagger: http://localhost:4000/api/docs
- Health: http://localhost:4000/api/v1/health

## Auth

- Aynı JWT yapısı (web ile ortak). Payload: `userId`, `role`, `partnerId?`.
- Access token kısa ömürlü; refresh akışı API dokümanına göre.
- Login / register endpoint’leri: Swagger → **Identity**.

```http
Authorization: Bearer <access_token>
```

## Response formatı

Tüm endpoint’ler:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": { "page": 1, "limit": 20, "total": 100 }
}
```

Hata:

```json
{
  "success": false,
  "data": null,
  "error": { "code": "NOT_FOUND", "message": "..." }
}
```

## Kritik kurallar (mobil)

| Kural           | Açıklama                                      |
| --------------- | --------------------------------------------- |
| Breaking change | Yasak — alan deprecate, gerekirse `/api/v2/`  |
| Endpoint silme  | Önce mobil ekibe haber + deprecation süresi   |
| Yeni endpoint   | Backend issue / PR; Swagger güncellenir       |
| Rate limit      | Login düşük limit; search orta; genel ~100/dk |

## Sık kullanılan path’ler

| Kaynak              | Path                           |
| ------------------- | ------------------------------ |
| Tur listesi / arama | `GET /catalog/tours`           |
| Tur detay           | `GET /catalog/tours/:id`       |
| Tur tarihleri       | `GET /catalog/tours/:id/dates` |
| Rezervasyon         | `POST /booking/...` (Swagger)  |
| Partner review      | `GET/POST /review/...`         |

Tam liste: **Swagger UI** (`/api/docs`).

## Destek

- Backend breaking / yeni field → Slack/Discord + PR checklist
- Env değişikliği → `.env.example` + ekip bildirimi
- Detaylı monorepo kurulum: `docs/ONBOARDING.md`
- Ortam stratejisi: `.cursor/rules/team-workflow.mdc` / `docs/SPRINT_19-24_MIGRATION_PLAN.md`
