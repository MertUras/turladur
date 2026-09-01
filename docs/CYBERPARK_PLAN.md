# CYBERPARK_PLAN — Altyapı & Sistem Tasarımı Envanteri

> **Amaç:** Cyberpark / teknik mülakat / altyapı denetimi için terim bazlı envanter.  
> Projede **ne var**, **ne kısmen var**, **ne yok** — ve screenshot karşılaştırması için planlama iskeleti.  
> **Güncelleme:** 2026-09-01  
> **Kaynak doğruluk:** Repo kodu + `docs/STACK_TOOLS_AND_SCALE.md`, `docs/SECURITY_CHECKLIST.md`, `docs/DEPLOYMENT.md`, `.cursor/rules/*`

---

## 0. NEON — Geçici Free Tier vs Ücretli Plan (önce bunu oku)

> **Bu bölüm unutulmasın diye en üstte.** Neon Free compute limiti (100 CU-hr/ay) ve canlıda tur görünmeme olayı burada özetlenir.  
> **Ücretli plan (Neon Launch) alındığında** aşağıdaki “Hedef mod”a dönülecek — otomatik seed + branch disiplini geri gelir.

### 0.1 Mevcut durum özeti (2026-09-01)

| Gözlem                 | Detay                                                                                                                                                                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neon kota              | Ağustos’ta **compute 110%** (`develop` ~109.91 CU-hr). 1 Eylül yeni dönem sıfırlandı.                                                                                                                                                          |
| Storage                | Sorun değil (~0.09 GB / 0.5 GB). Asıl darboğaz **compute**.                                                                                                                                                                                    |
| Canlı site             | `turladur-zjyf.vercel.app` → `/api/v1/health` → **`database: down`**, `redis: up` → tur arama **500**.                                                                                                                                         |
| Railway `DATABASE_URL` | Neon **`production`** (default / main) branch’e işaret ediyor (ekip teyidi).                                                                                                                                                                   |
| Dev + prod besleme     | **Aynı DB’ye beslenme riski:** `DEV_DATABASE_URL` secret’ı da `production` endpoint’ine ayarlıysa, GitHub Actions seed/cron **canlı veritabanını** etkiler. `refresh-env-dbs.yml` yorumu: _“Staging removed — single prod branch on Railway”_. |

**Kontrol listesi (secret doğrulama — Neon Console):**

| Secret / env               | Olması gereken (hedef mimari) | Şu an şüphe                                        |
| -------------------------- | ----------------------------- | -------------------------------------------------- |
| Railway `DATABASE_URL`     | `production` → **pooled** URL | ✓ production (doğru host, bağlantı kırık olabilir) |
| GitHub `DEV_DATABASE_URL`  | `develop` → **direct** URL    | ⚠️ production ile **aynı host** ise tek DB         |
| `deploy-dev.yml` seed      | Sadece `develop`              | ⚠️ secret yanlışsa prod’u seed’ler                 |
| `refresh-env-dbs.yml` cron | Sadece `develop`              | ⚠️ secret yanlışsa **günlük prod seed**            |

Neon Console → Branches → `develop` ve `production` **Connect** URL’lerindeki `ep-xxxx-...` host’larını karşılaştır. Aynıysa dev/prod tek besleniyor demektir.

### 0.2 Geçici mod — Free tier (şimdi, Launch öncesi)

Amaç: Canlıyı ayağa kaldır + compute’u tekrar yakmamak.

| #   | Aksiyon                                                                                               | Neden                                     |
| --- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 1   | Railway `DATABASE_URL` → Neon **`production` pooled** + **redeploy**                                  | `database: down` → turlar 500             |
| 2   | Health `ok` olunca search test                                                                        | Boş liste = veri yok, 500 = hâlâ bağlantı |
| 3   | **Tek sefer** prod’da `prisma db seed` (Direct URL, onaylı)                                           | Demo turlar canlıda görünsün              |
| 4   | `refresh-env-dbs` **cron kapat** (✓ 2026-09-01 yorum satırı) + secret’ı **develop**’a ayır            | Günlük seed CU yakar                      |
| 5   | `deploy-dev` içinde seed’i geçici **kapat** (migrate-only) veya `DEV_DATABASE_URL`’yi develop’a çevir | Prod’u yanlışlıkla seed’leme              |
| 6   | Local geliştirme → **Docker Postgres** (`localhost:5433`)                                             | Neon CU tasarrufu                         |

**Bu adımlar kod/UI değiştirmez** — yalnızca env, workflow tetikleme ve DB operasyonu.

### 0.3 Hedef mod — Neon Launch (ücretli) alındığında

> **Tetikleyici:** Neon Launch upgrade + açık ekip onayı.  
> **Amaç:** Ekip kurallarındaki ortam ayrımına dönmek + **oto seed** disiplinini güvenle geri açmak.

#### Branch haritası (geri yüklenecek)

| Ortam                   | Neon branch            | Kim bağlanır                        | Migrate                               | Oto seed                 |
| ----------------------- | ---------------------- | ----------------------------------- | ------------------------------------- | ------------------------ |
| **Production**          | `production` (default) | Railway API (`DATABASE_URL` pooled) | Release / one-off `migrate deploy`    | **Hayır** (gerçek veri)  |
| **Dev (paylaşılan)**    | `develop`              | GitHub `DEV_DATABASE_URL` (direct)  | `deploy-dev.yml`                      | **Evet** — push + cron   |
| **Staging** (opsiyonel) | `staging`              | `STAGING_DATABASE_URL`              | `deploy-staging.yml` (şu an disabled) | **Evet** — merge sonrası |
| **Local**               | Docker `:5433`         | Her geliştirici                     | `migrate deploy`                      | `db seed` manuel         |

#### Oto seed geri açılacak workflow’lar

| Workflow              | Tetik                                    | Hedef DB           | İşlem                            |
| --------------------- | ---------------------------------------- | ------------------ | -------------------------------- |
| `deploy-dev.yml`      | `develop` branch push                    | Neon **`develop`** | `migrate deploy` + **`db seed`** |
| `refresh-env-dbs.yml` | Cron `0 3 * * *` (günlük 06:00 TR)       | Neon **`develop`** | `migrate deploy` + **`db seed`** |
| `deploy-staging.yml`  | `staging` push (branch yeniden açılırsa) | Neon **`staging`** | migrate + seed                   |

#### Launch sonrası ek adımlar

1. GitHub Secrets: `DEV_DATABASE_URL` = **develop direct** (production host **değil**).
2. Railway: `DATABASE_URL` = **production pooled** (değişmez).
3. `develop` compute: autoscale **0.25 CU** min; Launch’ta CU limiti geniş — günlük cron güvenli.
4. `deploy-staging.yml` disabled → staging branch + secret varsa **yeniden etkinleştir** (opsiyonel).
5. `docs/NEON_ENV_SYNC.md` ile secret host’ları çapraz doğrula.
6. Neon Usage alert (ör. 80% CU) — tekrar limit sürprizi olmasın.

#### Free → Launch karşılaştırma (hatırlatma)

|                     | Free (geçici)                  | Launch (hedef)                            |
| ------------------- | ------------------------------ | ----------------------------------------- |
| CU-hr               | 100/ay — kolay dolar           | ~190 CU-hr örnek ~$22/ay (kullanıma göre) |
| Günlük develop seed | **Kapalı** / haftalık          | **Açık**                                  |
| Branch sayısı       | 2 (production + develop) yeter | develop + staging ayrılabilir             |
| Prod oto seed       | **Asla**                       | **Asla**                                  |

### 0.4 “DB düzeltince UI / auth / foto bozulur mu?”

**Hayır — doğru env ile global kurallar korunur.** Yapılanlar infra katmanında; uygulama kodu ve UX parity değişmez.

| Alan                      | Etkilenir mi? | Not                                                                                                                                                                                        |
| ------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **UI / UX**               | Hayır         | Bileşen, layout, filtreler aynı; sadece API veri döner                                                                                                                                     |
| **Same-origin `/api/v1`** | Hayır         | `NEXT_PUBLIC_API_URL=/api/v1` + Vercel rewrite aynı kalır                                                                                                                                  |
| **Refresh token / JWT**   | Hayır         | `JWT_SECRET`, cookie adı (`turta_refresh`), memory access token değişmez                                                                                                                   |
| **CORS / cookie**         | Hayır         | `FRONTEND_URL=https://turladur-zjyf.vercel.app` + `CORS_ALLOW_VERCEL=true` aynı                                                                                                            |
| **Foto / medya**          | Hayır         | R2 + `CDN_URL` / media proxy DB’den bağımsız                                                                                                                                               |
| **Redis / BullMQ**        | Hayır         | `REDIS_URL` (Upstash) ayrı — health’te zaten `up`                                                                                                                                          |
| **Mobil API**             | Hayır         | Aynı Nest API URL; breaking change yok                                                                                                                                                     |
| **Seed (tek sefer)**      | Dikkat        | Idempotent demo (`seed-*` id’ler); **gerçek partner verisi** prod’da seed öncesi yoksa güvenli. Canlıda gerçek rezervasyon birikmişse seed **onaylı** ve prod’da **otomatik seed açılmaz** |

**Bozulabilecek tek senaryolar (kaçınılır):**

- `JWT_SECRET` veya `FRONTEND_URL` yanlış değişirse → login kırılır (**değiştirme**).
- `API_PROXY_TARGET` yanlış Railway URL → API 502 (**sadece doğru host**).
- Prod’da günlük seed açık kalırsa → demo veri üzerine yazma / CU israfı (**Launch’ta sadece develop**).

### 0.5 Canlı turlar — bugünkü aksiyon sırası (kısa)

**Sıra önemli:** Önce Railway DB bağlantısı, sonra seed.

#### A — Railway (senin yapacağın — ~5 dk)

1. [Neon Console](https://console.neon.tech) → proje **TURTA** → branch **`production`** → **Connect**
2. **Pooled** connection string kopyala (`?sslmode=require` ile)
3. [Railway](https://railway.app) → API servisi → **Variables** → `DATABASE_URL` = pooled URL (eski şifre/URL değiştiyse güncelle)
4. **Deploy / Redeploy** (env değişince zorunlu)
5. Kontrol:
   ```bash
   curl https://turladur-zjyf.vercel.app/api/v1/health
   ```
   Beklenen: `"database":"up"`, `"status":"ok"`

#### B — Demo turlar (GitHub Actions — repo push sonrası)

1. GitHub → **Settings** → **Secrets** → `PRODUCTION_DATABASE_URL`
   - Neon **`production`** → **Direct** URL (pooler değil)
   - `DEV_DATABASE_URL` zaten production host’una gidiyorsa → **aynı Direct URL**’yi buraya da ekle
2. Actions → **Seed Production (manual)** → **Run workflow**
   - İlk sefer: `skip_seed: false` (varsayılan) → migrate + seed
   - Sadece şema: `skip_seed: true`
3. Kontrol:
   ```bash
   curl "https://turladur-zjyf.vercel.app/api/v1/catalog/tours/search?limit=3"
   ```
4. Tarayıcı: https://turladur-zjyf.vercel.app/tours

#### C — Repo değişiklikleri (2026-09-01)

| Dosya                 | Ne                                                   |
| --------------------- | ---------------------------------------------------- |
| `refresh-env-dbs.yml` | Günlük cron **kapalı** (yorum) — manuel hâlâ çalışır |
| `seed-production.yml` | Canlı için **manuel** migrate + seed                 |

#### Hâlâ `database: down` ise

- Neon `production` branch **Active** mi? (Usage limit dolmadı mı?)
- Railway `DATABASE_URL` **pooled** mı, **direct** değil mi?
- URL’de `sslmode=require` var mı?
- Railway log’da Prisma connection hatası var mı?

```
1. Railway DATABASE_URL (production pooled) doğrula → redeploy
2. GET /api/v1/health → database: up
3. GitHub Seed Production (manual) veya tek sefer local: DATABASE_URL=direct pnpm exec prisma db seed
4. /tours sayfasını yenile
5. DEV_DATABASE_URL ≠ production host (Launch’a kadar ideal)
6. Launch alınana kadar günlük cron seed kapalı (✓)
```

---

## 1. Bu doküman ne işe yarar?

1. İletilecek **screenshot** listesindeki terimlerle birebir eşleşme sağlar.
2. Her terim için turta’daki **gerçek kullanım** (araç, dosya, ortam) kayıt altına alınır.
3. Eksikler **soft launch kurallarına** uygun fazlara ayrılır — erken tool şişirme yok.
4. Cyberpark sunumu / teknik görüşme öncesi “boşluk analizi” tek yerden okunur.

**Kod değişikliği gerektirmez.** Screenshot geldikçe §6 karşılaştırma tablosu doldurulur.

---

## 2. Proje bağlamı (hatırlatma)

| Katman         | Teknoloji                            | Rol                               |
| -------------- | ------------------------------------ | --------------------------------- |
| Frontend       | Next.js 15 (Vercel)                  | UI, same-origin `/api/v1` rewrite |
| Backend        | NestJS 11 modüler monolit (Railway)  | Tek API — web + mobil             |
| Kalıcı veri    | PostgreSQL 16 (Neon)                 | Source of truth                   |
| Cache + kuyruk | Redis 7 (Upstash / local Docker)     | Cache + BullMQ                    |
| Dosya          | MinIO (local) / Cloudflare R2 (prod) | Binary storage                    |
| ORM            | Prisma 6 (multi-schema)              | Migration + sorgular              |
| Auth           | Nest identity + JWT (Passport)       | Keycloak/OIDC **yok**             |
| Monorepo       | Nx + pnpm                            | CI, shared packages               |

### Evrensel kurallar (tüm planlama bunlara tabi)

1. **Tek API** — mobil için ayrı backend/DB yok; breaking change yasak (`/v2` veya deprecate).
2. **Modüler monolit** — modüller birbirinin service’ini import etmez; iletişim **event / queue / net API sözleşmesi**.
3. **Frontend ↔ backend ayrımı** — `apps/web` içinde Prisma/DB yok.
4. **Tool şişirme yasağı** — soft launch’ta Grafana, Elasticsearch, Kafka, K8s, full APM **varsayılan değil**.
5. **Gözlemleme sırası** — Sentry (hata) → health/uptime → cloud panelleri → Grafana/APM (Band 3+).
6. **Onay kuralı** — prod secret, Neon wipe, custom domain, destrüktif işlem → açık onay.
7. **Local Docker dokunulmaz (prod için)** — prod = Neon + Upstash + R2.

Detay: `docs/STACK_TOOLS_AND_SCALE.md` § “Evrensel kurallar”.

---

## 3. Durum lejantı

| Simge | Anlam                                                      |
| ----- | ---------------------------------------------------------- |
| ✅    | Projede aktif / kodda veya operasyonda kullanılıyor        |
| 🟡    | Kısmen — platform sağlıyor, planlanmış veya sınırlı kapsam |
| ❌    | Yok — bilinçli erteleme veya henüz ihtiyaç yok             |
| 📋    | Planlandı — sprint/ölçek bandında net hedef var            |
| 📚    | Kavramsal — ekip bilgisi; ayrı tool gerektirmez            |

---

## 4. Terim envanteri (tam liste)

### 4.1 Ağ, trafik & dağıtım

| Terim                 | Durum | turta’da ne kullanıyoruz?                                                                              | Not / eksik                                                               |
| --------------------- | ----- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| **Rate Limiting**     | ✅    | `@nestjs/throttler` — global 100 req/dk; auth 5/dk; search 30/dk; `@SkipThrottle` health               | `apps/api/src/core/throttling/throttling.module.ts`, endpoint `@Throttle` |
| **Caching**           | ✅    | Redis `CacheService` (API); TanStack Query staleTime (web); Next.js `revalidate` (SSR)                 | TTL: arama ~5dk, detay ~15dk — `tour.service.ts`, `hotel.service.ts`      |
| **Load Balancing**    | 🟡    | Railway / Vercel / Neon platform LB — **custom LB yok**                                                | Tek instance soft launch; çoklu replica Band 2+                           |
| **Reverse Proxies**   | 🟡    | Vercel rewrite `/api/v1` → Railway; Railway edge proxy                                                 | Ayrı nginx repo’da yok (`infrastructure/docker` sadece PG/Redis/MinIO)    |
| **API Gateways**      | ❌    | Dedicated gateway yok — **NestJS doğrudan API**                                                        | Kong/APISIX ihtiyaç yok (modüler monolit + `/api/v1`)                     |
| **CI/CD**             | ✅    | GitHub Actions: `ci.yml`, `deploy-dev.yml`, `deploy-staging.yml`, `refresh-env-dbs.yml`                | Host deploy Railway/Vercel dashboard — CI DB migrate + build              |
| **Docker**            | ✅    | Local: `infrastructure/docker/docker-compose.yml`; Prod: `apps/api/Dockerfile` (multi-stage, non-root) | Web Vercel serverless/build — container değil                             |
| **Kubernetes**        | ❌    | Kullanılmıyor — Railway/Fly hedef                                                                      | Band 4+ ancak gerçek ihtiyaçta konuşulur                                  |
| **Service Discovery** | ❌    | Statik env URL (`DATABASE_URL`, `API_PROXY_TARGET`)                                                    | K8s/consul yok; ölçekte gerekmez                                          |
| **Circuit Breakers**  | ❌    | Yok — harici API (İyzico, SMTP) için breaker yok                                                       | Band 3: opossum / resilience4j benzeri değerlendir                        |
| **Timeouts**          | 🟡    | CI job timeout; health probe; ioredis `maxRetriesPerRequest: 3`                                        | HTTP client global timeout standardize edilmedi                           |
| **Retries**           | ✅    | BullMQ email `attempts: 3`; api-client 401→refresh retry; outbox retry (5 attempt)                     | `email-queue.service.ts`, `outbox.service.ts`                             |

### 4.2 Mesajlaşma & güvenilirlik

| Terim                         | Durum | turta’da ne kullanıyoruz?                                                                     | Not / eksik                                                           |
| ----------------------------- | ----- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **Exponential Backoff**       | ✅    | BullMQ email: `backoff: { type: 'exponential', delay: 5000 }`                                 | Outbox manuel delay 60s — exponential değil                           |
| **Idempotency**               | ✅    | `IdempotencyModule` + `IdempotencyKey` tablosu; header `Idempotency-Key`; CORS allowed header | Booking/payment kritik path’lerde genişletme devam edebilir           |
| **Message Queues**            | ✅    | BullMQ + Redis — şu an **`email` kuyruğu** aktif                                              | payment-webhook, image-processing planlı (rules) — henüz register yok |
| **Pub/Sub**                   | 🟡    | **In-process:** `@nestjs/event-emitter` (EventEmitter2)                                       | Dağıtık pub/sub (Redis pub/sub, Kafka) yok                            |
| **Event-Driven Architecture** | ✅    | Event emit + `@OnEvent` listener’lar (booking, payment, notification, catalog, analytics)     | Modül bağımsızlığı korunuyor                                          |
| **Distributed Transactions**  | ❌    | 2PC yok                                                                                       | Local Prisma `$transaction` + outbox                                  |
| **Saga Pattern**              | ❌    | Formal saga orchestrator yok                                                                  | İptal/iade akışları event + servis adımları — dokümante saga yok      |
| **Dead Letter Queues**        | 🟡    | BullMQ `removeOnFail: 50`; Outbox `FAILED` status                                             | Ayrı DLQ kuyruğu / operasyon paneli yok                               |
| **Cron Jobs**                 | 🟡    | **GitHub Actions cron:** `refresh-env-dbs.yml` (günlük migrate+seed)                          | Uygulama içi `@nestjs/schedule` **henüz yok** — tur expiry vb. planlı |
| **WebSockets**                | ✅    | `NotificationGateway` — Socket.IO `/notifications`, JWT auth, `notification.created`          | Partner/müşteri bildirim push                                         |
| **Long Polling**              | ❌    | Kullanılmıyor                                                                                 | REST + WS yeterli                                                     |
| **Server-Sent Events**        | ❌    | Kullanılmıyor                                                                                 | Dashboard canlı metrik için ileride opsiyonel                         |
| **Database Indexing**         | ✅    | Prisma `@@index` — FK, status, email, deletedAt, arama alanları                               | Periyodik slow-query review yok                                       |
| **Query Optimization**        | 🟡    | Prisma `include`/`select`; cache; index                                                       | EXPLAIN disiplini / Neon insights rutini 📋 Band 3                    |

### 4.3 Veritabanı & tutarlılık

| Terim                    | Durum | turta’da ne kullanıyoruz?                                                      | Not / eksik                                                |
| ------------------------ | ----- | ------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| **N+1 Queries**          | 🟡    | Kurallarda yasak; servislerde `include` kullanımı var                          | Sistematik audit / CI check yok                            |
| **Connection Pooling**   | ✅    | Prod: Neon **pooler** URL (runtime); Direct URL (migrate)                      | `docs/DEPLOYMENT.md`, `.env.example`                       |
| **Read Replicas**        | ❌    | Yok                                                                            | 📋 Band 3 (~1.5k+ satış/ay) — Neon read replica            |
| **Sharding**             | ❌    | Yok — tek Neon Postgres                                                        | Türkiye ölçeğinde erken                                    |
| **Partitioning**         | ❌    | Tablo partition yok                                                            | Büyük log/analytics tablolarında ileride                   |
| **Replication**          | 🟡    | Neon managed replication (platform)                                            | Uygulama katmanında replica routing yok                    |
| **Leader Election**      | ❌    | Gerek yok (tek writer DB, tek API instance soft launch)                        | Multi-worker cron gelirse Redis lock düşünülür             |
| **CAP Theorem**          | 📚    | CP tercih (Postgres); cache/eventual cache layer                               | Sunumda bilinçli tercih olarak anlatılır                   |
| **Eventual Consistency** | 🟡    | Redis cache TTL; outbox async işleme; rating mirror gecikmesi                  | Kullanıcıya “anında tutarlı” booking/payment kritik        |
| **Optimistic Locking**   | ✅    | `version` alanı — `TourDate`, `Review`; booking’de `version` check + increment | `reservation.service.ts`, `review.service.ts`              |
| **Pessimistic Locking**  | ❌    | `SELECT FOR UPDATE` kullanılmıyor                                              | Yoğun kontenjan yarışında değerlendirilir                  |
| **Distributed Locks**    | ❌    | Redis Redlock yok                                                              | Outbox claim `updateMany` ile tek process yeterli şimdilik |

### 4.4 Eşzamanlılık & ölçek

| Terim                           | Durum | turta’da ne kullanıyoruz?                                                  | Not / eksik                                     |
| ------------------------------- | ----- | -------------------------------------------------------------------------- | ----------------------------------------------- |
| **Race Conditions**             | 🟡    | Optimistic lock + transaction; kontenjan decrement                         | Load test ile doğrulanmadı                      |
| **Deadlocks**                   | 🟡    | Postgres deadlock detection (platform)                                     | App-level retry on deadlock yok                 |
| **Memory Leaks**                | 📚    | Node.js heap — prod izleme sınırlı                                         | Sentry + Railway metrics ile izleme 📋          |
| **Garbage Collection**          | 📚    | V8 GC — Node 20/22                                                         | JVM tipi tuning yok                             |
| **Thread Safety**               | 📚    | Node single-thread event loop                                              | CPU-heavy iş queue’ya taşınmalı (kural)         |
| **Backpressure**                | ❌    | Kuyruk depth limit / HTTP 503 throttle yok                                 | Band 2: ayrı BullMQ worker + queue monitoring   |
| **Autoscaling**                 | 🟡    | Railway/Vercel platform autoscale                                          | Konfigürasyon repo’da yok                       |
| **Horizontal Scaling**          | 🟡    | Mümkün (stateless API + external Redis/DB)                                 | WS sticky session / Redis adapter gerekebilir   |
| **Vertical Scaling**            | 🟡    | Railway plan upgrade                                                       |                                                 |
| **CDN**                         | 🟡    | Cloudflare R2 + `CDN_URL` media proxy; `media.turta.com` 📋 domain sonrası | `docs/CDN_CLOUDFLARE.md`                        |
| **Edge Caching**                | 🟡    | Vercel static/ISR; Next.js image optimization                              | API response edge cache yok                     |
| **Cache Invalidation**          | ✅    | `cache.invalidatePattern('catalog:tours:search:*')` vb.                    | Event-driven invalidation kısmen (listener’lar) |
| **Feature Flags**               | ❌    | Yok                                                                        | 📋 Band 2+ — LaunchDarkly / env flag / DB flag  |
| **Blue-Green Deployments**      | ❌    | Railway/Vercel rolling — blue-green yok                                    | Rollback: previous deployment (manual)          |
| **Canary Releases**             | ❌    | Yok                                                                        | Trafik split gerektirmez şimdilik               |
| **Rolling Deployments**         | 🟡    | Platform default                                                           | Zero-downtime health check ile                  |
| **Rollbacks**                   | 🟡    | Vercel instant rollback; Railway previous deploy                           | Runbook kısa — `docs/DEPLOYMENT.md`             |
| **Health Checks**               | ✅    | `GET /api/v1/health` — DB + Redis, `ok` / `degraded`                       | UptimeRobot keyword `ok`                        |
| **Liveness & Readiness Probes** | 🟡    | Tek endpoint (K8s ayrımı yok)                                              | Railway health path `/api/v1/health`            |
| **Monitoring**                  | 🟡    | Railway/Vercel/Neon/Upstash panelleri; Sentry kod hazır                    | DSN prod deploy 📋 Sprint C5                    |
| **Logging**                     | ✅    | `nestjs-pino` structured JSON                                              | Prod log aggregation (Loki/Datadog) yok         |
| **Distributed Tracing**         | ❌    | OpenTelemetry / Jaeger yok                                                 | Band 3 APM ile birlikte                         |
| **Metrics**                     | 🟡    | Platform metrikleri; app-level Prometheus yok                              | Grafana Cloud 📋 Band 3                         |
| **Alerting**                    | 🟡    | UptimeRobot hedef; Slack alert 📋 Band 1                                   | 429/5xx spike alert yok                         |
| **SLOs**                        | ❌    | Tanımlı değil                                                              | 📋 İlk para/SLA sonrası (ör. 99.5% uptime)      |
| **SLIs**                        | ❌    | Tanımlı değil                                                              | Health success rate, p95 latency, error rate    |
| **Error Budgets**               | ❌    | Yok                                                                        | SLO tanımından sonra                            |
| **Observability**               | 🟡    | Logs + (planlı) Sentry + uptime — ** üçlü tam değil**                      | Metrics + traces eksik                          |

### 4.5 Güvenlik

| Terim                     | Durum | turta’da ne kullanıyoruz?                                                       | Not / eksik                                      |
| ------------------------- | ----- | ------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Secrets Management**    | ✅    | GitHub Secrets; Railway/Vercel env; `.env` gitignore                            | Vault/Sealed Secrets yok — gerek yok soft launch |
| **IAM**                   | 🟡    | Uygulama RBAC: `@Roles`, `StaffPermissionsGuard`, partner `agencyId` izolasyonu | Cloud IAM (AWS/GCP) — managed host               |
| **OAuth**                 | ❌    | Nest email+password JWT — OAuth/OIDC **ertelendi**                              | Keycloak kural dışı (ürün kararı)                |
| **JWT Rotation**          | 🟡    | Access 15m; refresh rotate (cookie); `JWT_SECRET` manuel rotate                 | Otomatik secret rotation yok                     |
| **TLS**                   | ✅    | HTTPS (Vercel/Railway); Redis `rediss://`; Postgres `sslmode=require`           |                                                  |
| **Encryption at Rest**    | 🟡    | Neon / Upstash / R2 platform encryption                                         | Uygulama seviyesi field encryption yok           |
| **Encryption in Transit** | ✅    | TLS her katmanda                                                                |                                                  |
| **WAF**                   | ❌    | Yok                                                                             | 📋 Cloudflare domain + şirket `.tr` sonrası      |
| **DDoS Protection**       | 🟡    | Platform + rate limit                                                           | Cloudflare WAF ile güçlendirme 📋                |
| **CORS**                  | ✅    | `FRONTEND_URL` allowlist; opsiyonel `CORS_ALLOW_VERCEL`                         | Wildcard `*` yok — prod                          |
| **CSRF**                  | 🟡    | SameSite=Lax refresh cookie + Bearer access (memory)                            | CSRF token yok — API-first model                 |
| **SQL Injection**         | ✅    | Prisma parameterized; `$queryRaw` → `Prisma.sql`                                |                                                  |
| **XSS**                   | ✅    | React escape; `dangerouslySetInnerHTML` yalnızca JSON-LD                        | User HTML sanitize backend’de TipTap için planlı |

### 4.6 Veri yaşam döngüsü & operasyon

| Terim                        | Durum | turta’da ne kullanıyoruz?                                    | Not / eksik                                                             |
| ---------------------------- | ----- | ------------------------------------------------------------ | ----------------------------------------------------------------------- |
| **Database Migrations**      | ✅    | Prisma `migrate dev` (local) / `migrate deploy` (CI+prod)    | Neon branch başına otomatik CI                                          |
| **Schema Versioning**        | ✅    | `apps/api/prisma/migrations/*` timestamp sıralı              | Multi-schema: catalog, booking, payment, identity, review, notification |
| **Disaster Recovery**        | 🟡    | Neon branch reset (develop); backup runbook referans         | Tam DR drill 📋 Band 1                                                  |
| **Backups**                  | 🟡    | Neon otomatik backup (platform)                              | Restore test süreci 📋                                                  |
| **Failover**                 | 🟡    | Neon managed                                                 | RTO/RPO tanımlı değil                                                   |
| **Multi-Region Deployments** | ❌    | Tek bölge (EU/US Neon branch)                                | Band 4+                                                                 |
| **Chaos Engineering**        | ❌    | Yok                                                          | Erken — maliyet/fayda düşük                                             |
| **Cost Optimization**        | 🟡    | Tool şişirme yasağı; Upstash/Neon free-tier bilinci; tek API | Aylık maliyet dashboard yok                                             |
| **Cold Starts**              | 🟡    | Vercel serverless / Railway sleep — latency risk             | Always-on Railway prod                                                  |
| **Serverless Limits**        | 🟡    | Vercel function timeout/body limit                           | API ağırlıklı iş Railway’de                                             |
| **Latency**                  | 🟡    | Cache, pooler, same-origin rewrite ile düşürülüyor           | p95 ölçümü yok                                                          |
| **Throughput**               | 🟡    | Throttle ile koruma                                          | Load test sonuçları yok                                                 |
| **P99 Latency**              | ❌    | Ölçülmüyor                                                   | APM/Grafana sonrası                                                     |

### 4.7 API & altyapı kodu

| Terim                      | Durum | turta’da ne kullanıyoruz?                                     | Not / eksik                                        |
| -------------------------- | ----- | ------------------------------------------------------------- | -------------------------------------------------- |
| **HTTP/2 & HTTP/3**        | 🟡    | Vercel / Cloudflare / Railway terminate eder                  | Uygulama config gerekmez                           |
| **gRPC**                   | ❌    | REST + OpenAPI Swagger                                        | Mobil/web aynı REST                                |
| **Webhooks**               | ✅    | `POST /api/v1/payment/webhook/iyzico`                         | İmza doğrulama 📋 prod öncesi (SECURITY_CHECKLIST) |
| **API Versioning**         | ✅    | Global prefix `/api/v1`                                       | `/v2` breaking change politikası                   |
| **Semantic Versioning**    | 🟡    | npm package semver; API URL `v1` sabit                        | Public API semver policy yazılı değil              |
| **Infrastructure as Code** | ❌    | Terraform/Pulumi yok                                          | Railway/Vercel UI + GitHub Actions YAML            |
| **Terraform**              | ❌    | Repo’da yok                                                   | İleride multi-env IaC düşünülebilir                |
| **Helm Charts**            | ❌    | K8s yok                                                       |                                                    |
| **Build Caching**          | ✅    | GitHub Actions `cache: pnpm`; Docker layer cache; Nx affected |                                                    |
| **Dependency Hell**        | 🟡    | pnpm workspace; `pnpm audit` CI (continue-on-error)           | Hard gate 📋 Sprint C6                             |
| **Production Incidents**   | ❌    | Formal incident runbook yok                                   | 📋 Band 1 — severity, iletişim, rollback           |
| **On-call**                | ❌    | Tanımlı değil                                                 | 📋 Band 3                                          |
| **Postmortems**            | ❌    | Şablon yok                                                    | 📋 İlk ciddi incident sonrası                      |

---

## 5. Özet skor kartı

| Kategori                  | ✅ Tam  | 🟡 Kısmi | ❌ Yok  | 📋 Planlı |
| ------------------------- | ------- | -------- | ------- | --------- |
| Ağ & dağıtım (12)         | 5       | 4        | 3       | —         |
| Mesajlaşma (14)           | 6       | 5        | 3       | —         |
| Veritabanı (12)           | 3       | 4        | 4       | 1         |
| Eşzamanlılık & ölçek (24) | 3       | 14       | 5       | 2         |
| Güvenlik (14)             | 6       | 6        | 2       | —         |
| Veri & operasyon (13)     | 2       | 8        | 3       | —         |
| API & IaC (12)            | 4       | 4        | 4       | —         |
| **Toplam (~101 satır)**   | **~29** | **~45**  | **~24** | **~3**    |

> Sayılar yaklaşık — bazı terimler kavramsal (📚) skora dahil değil.

**Güçlü yanlar (Cyberpark’ta vurgulanabilir):**

- Modüler monolit + event-driven + idempotency + optimistic locking
- Rate limit, CORS, Helmet, Prisma güvenliği, JWT+cookie modeli
- CI/CD + Prisma migration disiplini + Docker prod image
- Redis cache + BullMQ + outbox pattern (review metrics)
- WebSocket bildirim altyapısı hazır

**Bilinen boşluklar (dürüst anlatım):**

- K8s, API Gateway, Circuit Breaker, Distributed Tracing, SLO/SLI
- Formal saga, DLQ operasyonu, feature flags, canary/blue-green
- WAF, webhook imza (prod), CSP, `pnpm audit` hard gate
- Uygulama içi cron (`@nestjs/schedule`) — sadece GitHub cron

---

## 6. Screenshot karşılaştırma tablosu (doldurulacak)

> Screenshot’lardaki madde listesini buraya yapıştırın. **Cyberpark’ta istenen** sütunu doldurun.

| #   | Screenshot terimi | turta durumu (§4) | Cyberpark beklentisi | Gap | Aksiyon / faz | Öncelik |
| --- | ----------------- | ----------------- | -------------------- | --- | ------------- | ------- |
| 1   | Rate Limiting     | ✅                | _TODO_               |     |               |         |
| 2   | Caching           | ✅                | _TODO_               |     |               |         |
| 3   | …                 |                   |                      |     |               |         |

**Doldurma kuralı:**

- Gap = “Beklenen − Mevcut”
- Aksiyon mutlaka **ölçek bandına** bağlansın (§7)
- Soft launch’ı bloke etmeyen maddeler **Faz 2+**

---

## 7. Fazlı yol haritası (proje kurallarına uygun)

### Faz 0 — Soft launch (Band 0: ~0–50 satış/ay) — **şimdi**

| Madde             | Aksiyon                                     |
| ----------------- | ------------------------------------------- |
| Sentry            | DSN + Railway/Vercel env + smoke            |
| Uptime            | UptimeRobot → `/api/v1/health` keyword `ok` |
| Upstash TLS       | BullMQ `rediss://` ✓ (C0)                   |
| Webhook güvenliği | İyzico imza doğrulama                       |
| CSP               | Vercel headers / middleware                 |
| `pnpm audit`      | CI hard gate (C6)                           |

### Faz 1 — İlk operasyon (Band 1: ~50–300/ay)

| Madde              | Aksiyon                                          |
| ------------------ | ------------------------------------------------ |
| Alerting           | Uptime + 5xx Slack/email                         |
| DR                 | Neon backup restore drill (runbook)              |
| Incident           | Production incident şablonu + rollback checklist |
| Postmortem         | Blameless template                               |
| Failed login / 429 | Log izleme kuralı                                |

### Faz 2 — Traction (Band 2: ~300–1.5k/ay)

| Madde          | Aksiyon                                           |
| -------------- | ------------------------------------------------- |
| Worker ayrımı  | BullMQ email (+ payment webhook) ayrı process     |
| Cron           | `@nestjs/schedule` — tur expiry, outbox processor |
| Feature flags  | Env veya basit DB flag (kampanya A/B)             |
| Backpressure   | Queue depth alert; API 503 when overloaded        |
| Ürün analitiği | PostHog veya internal dashboard                   |

### Faz 3 — Ciddi SLA (Band 3: ~1.5k–5k/ay)

| Madde                | Aksiyon                                     |
| -------------------- | ------------------------------------------- |
| SLO/SLI/Error budget | 99.5% availability, p95 < 500ms hedef       |
| Grafana / APM        | p95, 5xx, queue depth                       |
| Read replica         | Neon read routing (search/report)           |
| Arama indeksi        | Meilisearch/Typesense (ES değil varsayılan) |
| Circuit breaker      | İyzico/SMTP/resend adapter                  |
| DLQ                  | BullMQ failed job dashboard + replay        |
| On-call              | Rotasyon + escalation                       |

### Faz 4 — Bölgesel ölçek (Band 5k+/ay)

| Madde        | Aksiyon                                    |
| ------------ | ------------------------------------------ |
| Servis bölme | payment/catalog ayrı deploy (blast radius) |
| Multi-region | Neon + API edge (gerçek ihtiyaçta)         |
| Kafka        | Yalnızca event fırtınası kanıtlanırsa      |
| K8s          | Railway yetmezse — **erken alma**          |

### Domain / şirket kilidi (satış bandından bağımsız)

| Madde    | Aksiyon                 |
| -------- | ----------------------- |
| WAF      | Cloudflare + `turta.tr` |
| Mail DNS | SPF/DKIM/DMARC + Resend |
| CDN      | `media.turta.tr` → R2   |

---

## 8. Cyberpark sunum önerisi (anlatım sırası)

1. **Mimari diyagram** — Vercel → Railway → Neon/Redis/R2 (§2 tablo)
2. **Güvenilirlik** — idempotency, optimistic lock, outbox, BullMQ retry+backoff
3. **Güvenlik** — OWASP checklist (`docs/SECURITY_CHECKLIST.md`) — açık maddeler dürüst
4. **Ölçek stratejisi** — “Erken almıyoruz” listesi (K8s, Kafka, ES) + band tetikleyicileri
5. **Observability yol haritası** — Sentry → uptime → Grafana (sıra kuralı)
6. **Ekip süreci** — PR checklist, migration, tek API mobil+web

---

## 9. İlgili dosyalar (hızlı referans)

| Konu                | Dosya                                                             |
| ------------------- | ----------------------------------------------------------------- |
| Ölçek & tool eşiği  | `docs/STACK_TOOLS_AND_SCALE.md`                                   |
| Cloud sprint        | `docs/SPRINT_C_INFRASTRUCTURE.md`                                 |
| Deploy              | `docs/DEPLOYMENT.md`                                              |
| Güvenlik            | `docs/SECURITY_CHECKLIST.md`                                      |
| Neon ortam sync     | `docs/NEON_ENV_SYNC.md`                                           |
| Rate limit          | `apps/api/src/core/throttling/throttling.module.ts`               |
| Cache               | `apps/api/src/core/cache/cache.service.ts`                        |
| Queue               | `apps/api/src/core/queue/`                                        |
| Idempotency         | `apps/api/src/core/idempotency/`                                  |
| Health              | `apps/api/src/core/health/health.controller.ts`                   |
| WebSocket           | `apps/api/src/core/realtime/notification.gateway.ts`              |
| Outbox              | `apps/api/src/modules/review/services/outbox.service.ts`          |
| CI                  | `.github/workflows/ci.yml`                                        |
| Docker              | `infrastructure/docker/docker-compose.yml`, `apps/api/Dockerfile` |
| Reverse proxy (web) | `apps/web/next.config.ts` rewrites                                |

---

## 10. Revizyon geçmişi

| Tarih      | Değişiklik                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------ |
| 2026-09-01 | §0 eklendi — Neon Free geçici mod, Launch sonrası oto seed planı, dev/prod besleme uyarısı |
| 2026-08-29 | İlk envanter — screenshot karşılaştırma iskeleti                                           |

---

**Sonraki adım:** Screenshot’ları paylaşın → §6 tablosu doldurulur → gap’lere göre Faz 0–4 öncelikleri netleştirilir.
