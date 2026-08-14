# CDN — Cloudflare (`media.turta.com`) — Sprint 23.19

## Canlıda metin + görsel görünürlüğü (zorunlu model)

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│ Partner     │────▶│ Nest API         │────▶│ Neon PostgreSQL     │
│ upload form │     │ coverUrl, text…  │     │ (tur bilgisi + URL) │
└─────────────┘     └────────┬─────────┘     └─────────────────────┘
                             │
                             ▼
                    ┌──────────────────┐     ┌─────────────────────┐
                    │ R2 / MinIO       │────▶│ CDN media.turta.com │
                    │ (dosya bytes)    │     │ (herkese açık HTTPS)│
                    └──────────────────┘     └──────────┬──────────┘
                                                       │
                             Vercel web ◀──────────────┘
                             next/image + API JSON
```

| Ne                          | Nerede tutulur                                 | Canlıda görünür mü?                    |
| --------------------------- | ---------------------------------------------- | -------------------------------------- |
| Tur başlık, fiyat, açıklama | Neon (backend DB)                              | Evet — aynı API/DB                     |
| Görsel dosyası              | R2 (prod) / MinIO (local)                      | **Sadece dosya R2’deyse**              |
| Görsel adresi               | DB’de URL; API yanıtında `CDN_URL` ile resolve | Prod `CDN_URL=https://media.turta.com` |

**Kritik:** Local MinIO’ya yüklenen dosya Vercel’den erişilemez. Canlıda göstermek için:

1. Railway API env → R2 + `CDN_URL=https://media.turta.com`
2. Partner **canlı API üzerinden** yeniden yükler (veya MinIO→R2 sync)
3. Vercel `NEXT_PUBLIC_API_URL` → canlı Nest API

API, DB’deki `localhost:9000/...` URL’lerini yanıtta otomatik `CDN_URL` host’una çevirir; **dosyanın kendisi R2’de yoksa** yine 404 olur.

---

## Mimari

```
Browser
  → POST /api/v1/storage/presigned-url  (Nest)
  → PUT  uploadUrl                      (doğrudan R2/MinIO; Cache-Control imzalı)
  → DB’ye publicUrl kaydı               (CDN host: media.turta.com/…)
  → next/image + remotePatterns         (media.turta.com allowlist)
```

| Env             | Değer                                                                                                                                                                 |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Local `CDN_URL` | Soft launch / R2: `http://localhost:4000/api/v1/storage/media` (veya MinIO path). Prod soft launch: `https://<API>/api/v1/storage/media` — [PUBLISH.md](./PUBLISH.md) |
| Prod `CDN_URL`  | Custom domain sonrası: `https://media.turta.com`                                                                                                                      |
| Web (opsiyonel) | `NEXT_PUBLIC_CDN_URL` = aynı CDN / proxy base                                                                                                                         |

`publicUrl` API’de `StorageService.getPublicUrl(key)` = `{CDN_URL}/{key}`.

Upload PUT başlıkları imzada: `Content-Type` + `Cache-Control: public, max-age=31536000, immutable` (dosya adı unique → 1 yıl cache güvenli).

---

## Cloudflare R2 kurulumu (ops runbook)

1. Cloudflare Dashboard → **R2** → Create bucket `tourtech-media`.
2. **Settings → Custom Domains** → `media.turta.com` ekle (SSL otomatik).
3. **Manage R2 API Tokens** → Access Key + Secret oluştur.
4. API / Railway env:

```env
MINIO_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
MINIO_ACCESS_KEY=<r2_access_key>
MINIO_SECRET_KEY=<r2_secret_key>
S3_BUCKET=tourtech-media
S3_REGION=auto
S3_FORCE_PATH_STYLE=false
CDN_URL=https://media.turta.com
```

5. Web (Vercel):

```env
NEXT_PUBLIC_CDN_URL=https://media.turta.com
NEXT_PUBLIC_API_URL=https://api.turta.com/api/v1
```

6. Bucket **public** erişim yalnızca custom domain üzerinden; API credential’ları secret manager’da.

### Cloudflare cache (öneri)

- Cache Rule: `media.turta.com/*` → Cache eligible, Edge TTL 1 month+ (objeler immutable key).
- Vercel `_next/static/*` için ayrı zone rule (site domain) — bkz. `docs/DEPLOYMENT.md`.

---

## Local doğrulama

```bash
pnpm docker:up   # MinIO :9000
# apps/api/.env → CDN_URL=http://localhost:9000/tourtech-media
pnpm dev:api
# Partner tur formu → görsel yükle → publicUrl localhost:9000/… olmalı
```

---

## Kod referansları

| Dosya                                             | Rol                                            |
| ------------------------------------------------- | ---------------------------------------------- |
| `apps/api/src/core/storage/storage.service.ts`    | Presign + `CDN_URL` public URL + Cache-Control |
| `apps/api/src/core/storage/storage.controller.ts` | `uploadHeaders` client’a döner                 |
| `apps/web/next.config.ts`                         | `media.turta.com` / R2 remotePatterns          |
| `apps/web/src/lib/media.ts`                       | `resolveMediaUrl` / `getCdnBaseUrl`            |

---

## Checklist (Definition of Done — 23.19)

- [x] `CDN_URL` → public URL sözleşmesi
- [x] Upload `Cache-Control` (CDN-friendly)
- [x] Next.js `media.turta.com` allowlist
- [x] R2 / forcePathStyle env desteği
- [x] Runbook dokümanı
- [ ] Cloudflare hesabında R2 + `media.turta.com` DNS (prod — 24.6/24.7)
