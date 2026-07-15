# TurlaDur — Sprint 11-18 Geliştirme Planı

> **Mimari:** Nx Monorepo, Next.js 15 (Frontend) + NestJS 11 (Backend)  
> **Sprint süresi:** 1 hafta  
> **Toplam süre:** 8 hafta (Sprint 11 → Sprint 18)  
> **Hedef:** Mevcut monolitik Next.js uygulamasını yeni modüler mimariye taşımak ve MVP'yi tamamlamak

---

## Sprint 11 — Altyapı Kurulumu & Monorepo Scaffold

**Hedef:** Yeni mimari iskeletini kurmak. Hiçbir feature geliştirmeden önce temel hazır olmalı.

### Görevler

| #     | Görev                                      | Öncelik | Çıktı                                                  |
| ----- | ------------------------------------------ | ------- | ------------------------------------------------------ |
| 11.1  | Nx monorepo init (pnpm workspace)          | P0      | `nx.json`, `pnpm-workspace.yaml`, `tsconfig.base.json` |
| 11.2  | `apps/web/` — Next.js 15 scaffold (boş)    | P0      | Çalışan Next.js app, Tailwind + Shadcn/ui kurulu       |
| 11.3  | `apps/api/` — NestJS 11 scaffold (boş)     | P0      | Çalışan NestJS app, Swagger, health endpoint           |
| 11.4  | `packages/shared-types/` oluştur           | P0      | Boş paket, build çalışıyor                             |
| 11.5  | `packages/shared-validators/` oluştur      | P0      | Zod kurulu, boş paket                                  |
| 11.6  | `packages/shared-constants/` oluştur       | P1      | Enum'lar, roller                                       |
| 11.7  | `infrastructure/docker/docker-compose.yml` | P0      | PostgreSQL + Redis + MinIO + Mailhog çalışıyor         |
| 11.8  | ESLint + Prettier + Husky + Commitlint     | P1      | Git hook'ları aktif                                    |
| 11.9  | GitHub Actions CI pipeline (lint + build)  | P1      | PR'larda otomatik kontrol                              |
| 11.10 | `.cursor/rules/` dosyaları repo'da         | P0      | Tüm mimari kurallar mevcut (TAMAMLANDI)                |

### Definition of Done

- [x] `pnpm dev:apps` ile hem web (3000) hem api (4000) ayağa kalkıyor
- [x] `pnpm build:apps` / `pnpm nx run-many -t build` hatasız tamamlanıyor
- [x] Docker compose ile tüm servisler çalışıyor
- [x] Swagger UI: http://localhost:4000/api/docs açılıyor

> **Not (15 Jul 2026):** Scaffold `feat/sprint-11-monorepo` üzerinde tamamlandı.
>
> - Yeni stack: `pnpm dev:apps` (web:3000 + api:4000)
> - Ayrı: `pnpm dev:web` / `pnpm dev:api`
> - Legacy root Next.js: `pnpm dev` (Sprint 15'te taşınacak)
> - Docker: `pnpm docker:up`
> - DoD doğrulandı: Docker healthy, nx build OK, API health+Swagger 200, apps/web HTTP 200

---

## Sprint 12 — Core Altyapı Modülleri (Backend)

**Hedef:** NestJS'in tüm core servisleri hazır — DB, cache, auth, storage, queue, mail, logger.

### Görevler

| #    | Görev                                             | Öncelik | Çıktı                                      |
| ---- | ------------------------------------------------- | ------- | ------------------------------------------ |
| 12.1 | `core/database/` — Prisma module + service        | P0      | DB bağlantısı çalışıyor                    |
| 12.2 | Prisma schema taşıma (mevcut → multi-schema)      | P0      | **ERTELENDİ → Sprint 15** (legacy cutover) |
| 12.3 | Migration: mevcut tabloları yeni schema'lara taşı | P0      | **ERTELENDİ → Sprint 15** (legacy cutover) |

> **Ne zaman / neden Sprint 15?**
>
> - Sprint 13–14’te yeni API zaten **ayrı** `apps/api` Prisma ile ilerliyor (`identity`, `catalog`, sonra `booking`, `payment`). Legacy root Prisma’ya dokunmuyoruz → çalışan UI kırılmıyor.
> - **12.2–12.3**, root’taki eski tabloları multi-schema’ya taşımak = legacy Next.js’in DB’sini değiştirmek. Bunu **frontend Nest’e bağlanmadan** (Sprint 15) yapmak, `pnpm dev` + eski `app/` API route’larını kırar.
> - **Doğru sıra:** Sprint 14’te sadece `apps/api`’ye `booking` + `payment` schema ekle → Sprint 15’te sayfalar Nest’e geçsin → staging Neon **backup** → 12.2–12.3 cutover (veya 15 sonunda “legacy DB kapatma” görevi).
> - Staging/prod’da tek DB hedefi: cutover sonrası root `prisma/` deprecate.

### Definition of Done

- [x] `POST /api/v1/auth/login` → JWT döner
- [x] Redis'e veri yazıp okunabiliyor
- [x] Presigned URL ile MinIO'ya dosya yüklenebiliyor
- [x] Email kuyruğa atılıp Mailhog'da görünüyor
- [x] Hatalı request → standard error response dönüyor

> **DoD doğrulandı (15 Jul 2026):** API `:4010` üzerinde tüm maddeler geçti. Legacy `app/` + root `prisma/schema.prisma` multi-schema’sız kaldı.

---

## Sprint 13 — Identity & Catalog Modülleri

**Hedef:** Kullanıcı giriş/kayıt + tur/otel katalog API'si hazır.

### Görevler

| #     | Görev                                                   | Öncelik | Çıktı                            |
| ----- | ------------------------------------------------------- | ------- | -------------------------------- |
| 13.1  | `modules/identity/` — User CRUD                         | P0      | Kayıt, giriş, profil             |
| 13.2  | Identity — Partner kayıt + doğrulama akışı              | P0      | Email verification               |
| 13.3  | Identity — Rol yönetimi (RBAC)                          | P0      | Customer, Partner, Admin         |
| 13.4  | Identity — SubUser (partner alt kullanıcı)              | P1      | Partner staff management         |
| 13.5  | `modules/catalog/` — Tour CRUD                          | P0      | Tur oluştur/güncelle/sil/listele |
| 13.6  | Catalog — TourDate yönetimi                             | P0      | Tarih + kapasite + fiyat         |
| 13.7  | Catalog — Hotel CRUD                                    | P1      | Otel + oda bilgileri             |
| 13.8  | Catalog — Activity CRUD                                 | P1      | Aktivite + tarih                 |
| 13.9  | Catalog — Search service (PostgreSQL FTS + Redis cache) | P0      | Arama endpoint'i                 |
| 13.10 | Catalog — Dinamik fiyatlandırma (temel)                 | P2      | Sezon/tarih bazlı fiyat          |
| 13.11 | Shared types: User, Tour, Hotel, Activity tipleri       | P0      | `packages/shared-types/`         |
| 13.12 | Seed verisi: Gerçekçi turlar, oteller, kullanıcılar     | P1      | 20+ tur, 10+ otel, test users    |

### Definition of Done

- [x] `POST /api/v1/identity/register` → kullanıcı oluşuyor
- [x] `POST /api/v1/identity/login` → JWT dönüyor
- [x] `GET /api/v1/catalog/tours/search?q=kapadokya` → sonuç dönüyor (cached)
- [x] `POST /api/v1/catalog/tours` (Partner) → tur oluşturuluyor
- [x] Swagger'da tüm endpoint'ler dokümante

> **DoD doğrulandı (15 Jul 2026):** `feat/sprint-11-monorepo` — Identity + Catalog CQRS; multi-schema sadece `apps/api` Prisma (`identity`, `catalog`). Legacy root Next.js / root Prisma dokunulmadı.
>
> - Partner: `POST /identity/partners/register` + `POST /identity/partners/verify` (email → Mailhog)
> - RBAC: `@Roles(PARTNER|ADMIN|…)`; JWT’de `partnerId`
> - Search: Redis cache TTL 5dk (`catalog:tours:search:*`)
> - P1 ertelendi: SubUser (13.4), Hotel/Activity (13.7–13.8), seed (13.12)

---

## Sprint 14 — Booking & Payment Modülleri

**Hedef:** Rezervasyon oluşturma ve ödeme akışı çalışır durumda.

### Görevler

| #     | Görev                                                   | Öncelik | Çıktı                                       |
| ----- | ------------------------------------------------------- | ------- | ------------------------------------------- |
| 14.1  | `modules/booking/` — Reservation CRUD                   | P0      | Rezervasyon oluştur/iptal/listele           |
| 14.2  | Booking — Availability check (müsaitlik kontrolü)       | P0      | Tarih + kapasite doğrulama                  |
| 14.3  | Booking — Guest info (misafir bilgileri)                | P0      | Yetişkin/çocuk, yaş, iletişim               |
| 14.4  | Booking — Status management (state machine)             | P0      | PENDING → CONFIRMED → COMPLETED / CANCELLED |
| 14.5  | Booking — BookingCreatedEvent → Payment, Notification   | P0      | Event-driven akış                           |
| 14.6  | `modules/payment/` — İyzico adapter                     | P0      | Payment gateway entegrasyonu                |
| 14.7  | Payment — Initialize (3D Secure form)                   | P0      | Ödeme formu başlatma                        |
| 14.8  | Payment — Webhook handler (callback)                    | P0      | İyzico callback işleme                      |
| 14.9  | Payment — PaymentCompletedEvent → Booking status update | P0      | Otomatik onay                               |
| 14.10 | Payment — Refund (iade)                                 | P1      | Kısmi/tam iade                              |
| 14.11 | Payment — Transaction logging                           | P0      | Her ödeme kaydedilir                        |
| 14.12 | Shared validators: Booking form Zod schema              | P0      | Frontend + backend aynı validation          |

### Definition of Done

- [ ] Müşteri tur tarihi seçip rezervasyon oluşturabiliyor
- [ ] İyzico test kartı ile ödeme yapılabiliyor
- [ ] Ödeme başarılı → Booking status otomatik CONFIRMED oluyor
- [ ] Ödeme başarısız → Booking status PAYMENT_FAILED oluyor
- [ ] İade işlemi çalışıyor

---

## Sprint 15 — Frontend Taşıma (Müşteri Sayfaları)

**Hedef:** Mevcut Next.js sayfalarını yeni `apps/web/` yapısına taşımak. API route'lar kaldırılır, backend'e bağlanır.

### Görevler

| #     | Görev                                                   | Öncelik | Çıktı                                                                                   |
| ----- | ------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------- |
| 15.0  | **(ex-12.2/12.3)** Legacy Prisma → multi-schema cutover | P0      | Staging backup → root tablolar → `identity`/`catalog`/…; root `prisma/` deprecate planı |
| 15.1  | `apps/web/` — Layout, Header, Footer                    | P0      | Temel sayfa iskeleti                                                                    |
| 15.2  | API client setup (axios instance + interceptors)        | P0      | `services/api-client.ts`                                                                |
| 15.3  | Auth provider (NextAuth → Keycloak/JWT)                 | P0      | Login/register çalışıyor                                                                |
| 15.4  | `(marketing)/` — Ana sayfa                              | P0      | Hero, popüler turlar, SEO                                                               |
| 15.5  | `(marketing)/tours/` — Tur listesi + arama              | P0      | Filter, sort, pagination                                                                |
| 15.6  | `(marketing)/tours/[id]/` — Tur detay                   | P0      | Galeri, fiyat, tarihler, rezervasyon butonu                                             |
| 15.7  | `(marketing)/hotels/` — Otel listesi                    | P1      | Arama, filtre                                                                           |
| 15.8  | `(marketing)/hotels/[id]/` — Otel detay                 | P1      | Oda seçimi                                                                              |
| 15.9  | `(marketing)/activities/` — Aktivite listesi            | P1      | Kategori filtre                                                                         |
| 15.10 | `(auth)/login` + `(auth)/register`                      | P0      | Auth sayfaları                                                                          |
| 15.11 | `(customer)/checkout/` — Ödeme sayfası                  | P0      | Booking form + İyzico iframe                                                            |
| 15.12 | `(customer)/bookings/` — Rezervasyonlarım               | P0      | Liste + detay                                                                           |
| 15.13 | `(customer)/profile/` — Profil sayfası                  | P1      | Bilgi güncelleme                                                                        |
| 15.14 | Responsive kontrol (tüm sayfalar mobile-first)          | P0      | Tablet + mobile uyum                                                                    |
| 15.15 | SEO metadata (tüm public sayfalar)                      | P0      | Title, description, OG tags                                                             |

### Definition of Done

- [ ] Kullanıcı giriş yapıp tur arayabiliyor
- [ ] Tur detay sayfası SSR ile render ediliyor (Google indexleyebilir)
- [ ] Checkout akışı çalışıyor (form → ödeme → onay)
- [ ] Mobilde düzgün görünüyor
- [ ] Lighthouse SEO skoru > 90

---

## Sprint 16 — Partner & Admin Panelleri

**Hedef:** Partner (tur operatörü) ve Admin dashboard'ları çalışır durumda.

### Görevler

| #     | Görev                                              | Öncelik | Çıktı                                    |
| ----- | -------------------------------------------------- | ------- | ---------------------------------------- |
| 16.1  | `modules/partner/` — Dashboard stats endpoint      | P0      | Gelir, rezervasyon, yorum istatistikleri |
| 16.2  | Partner — Tour management (CRUD from partner view) | P0      | Tur oluştur/düzenle/sil                  |
| 16.3  | Partner — Reservation management                   | P0      | Gelen rezervasyonları gör/onayla/reddet  |
| 16.4  | Partner — Financial reports                        | P1      | Gelir raporu, komisyon hesaplama         |
| 16.5  | Partner — Customer list                            | P1      | Geçmiş müşteriler                        |
| 16.6  | `(partner)/dashboard/` — Frontend dashboard        | P0      | İstatistik kartları, grafikler           |
| 16.7  | `(partner)/tours/` — Tur yönetim sayfaları         | P0      | Liste, oluştur, düzenle                  |
| 16.8  | `(partner)/reservations/` — Rezervasyon listesi    | P0      | Filtre, status güncelle                  |
| 16.9  | `(partner)/financials/` — Finansal rapor sayfası   | P1      | Grafik, tablo                            |
| 16.10 | `(admin)/dashboard/` — Admin istatistikleri        | P0      | Platform geneli metrikler                |
| 16.11 | `(admin)/users/` — Kullanıcı yönetimi              | P0      | Liste, ban, rol değiştir                 |
| 16.12 | `(admin)/tours/` — Tur onaylama                    | P0      | Pending turları incele/onayla            |
| 16.13 | `(admin)/agencies/` — Partner onaylama             | P0      | Doğrulama bekleyen partner'lar           |
| 16.14 | `(admin)/payments/` — Ödeme takibi                 | P1      | Transaction listesi                      |
| 16.15 | Image upload entegrasyonu (partner tur görselleri) | P0      | Presigned URL + gallery                  |

### Definition of Done

- [ ] Partner giriş yapıp tur oluşturabiliyor (görsel dahil)
- [ ] Partner gelen rezervasyonları görebiliyor
- [ ] Admin yeni partner'ları onaylayabiliyor
- [ ] Admin turları review edip yayına alabiliyor
- [ ] Dashboard grafikleri gerçek veriyle çalışıyor

---

## Sprint 17 — Review, Notification & Kişiselleştirme

**Hedef:** Yorum sistemi, bildirimler ve kullanıcı deneyimini zenginleştiren özellikler.

### Görevler

| #     | Görev                                                       | Öncelik | Çıktı                                      |
| ----- | ----------------------------------------------------------- | ------- | ------------------------------------------ |
| 17.1  | `modules/review/` — Review CRUD                             | P0      | Yorum yaz/güncelle/sil                     |
| 17.2  | Review — Rating hesaplama (operatör ortalaması)             | P0      | ReviewCreatedEvent → Catalog rating update |
| 17.3  | Review — Sadece COMPLETED booking sahipleri yorum yapabilir | P0      | Guard                                      |
| 17.4  | Review — Fotoğraflı yorum                                   | P1      | Presigned URL + gallery                    |
| 17.5  | Review — Partner yanıtı (ReviewResponse)                    | P1      | Partner yorum'a cevap verebilir            |
| 17.6  | Review — Filtreleme (puan, fotoğraflı, tarih)               | P1      | Query handler                              |
| 17.7  | `modules/notification/` — Email notifications               | P0      | BullMQ ile async email                     |
| 17.8  | Notification — In-app bildirimler (DB)                      | P0      | Bildirim listesi endpoint                  |
| 17.9  | Notification — WebSocket realtime push                      | P1      | Anlık bildirim                             |
| 17.10 | Notification — Bildirim tercihleri                          | P2      | Email/push on/off                          |
| 17.11 | Frontend — Yorum bileşeni (tur detay sayfasında)            | P0      | Yorum listesi + form                       |
| 17.12 | Frontend — Bildirim dropdown (header'da)                    | P0      | Okunmamış sayısı + liste                   |
| 17.13 | Frontend — "Sana özel turlar" bölümü (basit)                | P2      | Son aramalar bazlı öneri                   |
| 17.14 | Email template'leri (booking onay, yeni yorum, hoşgeldin)   | P1      | 5+ template                                |
| 17.15 | Booking sonrası "Turu değerlendir" email'i (3 gün sonra)    | P1      | Scheduled job                              |

### Definition of Done

- [ ] Müşteri tamamlanan tur için yorum yazabiliyor
- [ ] Operatör puanı yorumlarla otomatik güncelleniyor
- [ ] Partner yeni yorum geldiğinde bildirim alıyor
- [ ] In-app bildirimler çalışıyor (bell icon + dropdown)
- [ ] Email template'leri düzgün render ediliyor

---

## Sprint 18 — Analytics, Performance & Production Hazırlık

**Hedef:** Platform production'a çıkmaya hazır. Performans optimize, monitoring aktif, son testler tamam.

### Görevler

| #     | Görev                                                       | Öncelik | Çıktı                           |
| ----- | ----------------------------------------------------------- | ------- | ------------------------------- |
| 18.1  | `modules/analytics/` — Dashboard istatistik endpoint'leri   | P1      | Admin + partner için metrikler  |
| 18.2  | Analytics — Search log (ne arıyorlar?)                      | P2      | Popüler aramalar                |
| 18.3  | Performance — Redis cache tüm search endpoint'lerinde aktif | P0      | Cache hit rate > %70            |
| 18.4  | Performance — Database index review                         | P0      | Yavaş query yok                 |
| 18.5  | Performance — Frontend bundle size optimizasyonu            | P0      | Dynamic import, tree-shaking    |
| 18.6  | Performance — Image optimization (WebP, lazy load)          | P0      | LCP < 2.5s                      |
| 18.7  | Security — Penetration test (temel)                         | P0      | OWASP top 10 kontrol            |
| 18.8  | Security — Rate limiting tüm endpoint'lerde aktif           | P0      | Brute force koruması            |
| 18.9  | Monitoring — Sentry entegrasyonu (web + api)                | P0      | Error tracking aktif            |
| 18.10 | Monitoring — Health check + uptime monitor                  | P1      | Downtime alerting               |
| 18.11 | Deploy — Vercel production setup (apps/web)                 | P0      | Custom domain + SSL             |
| 18.12 | Deploy — Railway production setup (apps/api)                | P0      | Auto-scale config               |
| 18.13 | Deploy — Neon production branch + pooler                    | P0      | Connection limit güvenli        |
| 18.14 | Deploy — CDN (Cloudflare) — statik dosyalar + görseller     | P1      | Global edge caching             |
| 18.15 | E2E test — Kritik akışlar (kayıt → arama → booking → ödeme) | P0      | Playwright suite                |
| 18.16 | Seed data temizleme (production-ready)                      | P1      | Demo verisi hazır               |
| 18.17 | README + onboarding dokümanı güncelleme                     | P1      | Yeni dev 30dk'da başlayabilmeli |
| 18.18 | Soft launch (beta kullanıcılarla)                           | P0      | İlk gerçek kullanıcılar         |

### Definition of Done

- [ ] Production URL'ler çalışıyor (turladur.com + api.turladur.com)
- [ ] Lighthouse: Performance > 85, SEO > 90, Accessibility > 85
- [ ] E2E testler geçiyor (kayıt → booking → ödeme tam akış)
- [ ] Sentry'de error tracking aktif
- [ ] İlk beta kullanıcılar sistemi kullanabiliyor
- [ ] Zero known critical bugs

---

## Sprint Genel Bağımlılık Sırası

```
Sprint 11: Altyapı (hiçbir şey çalışmaz bunda olmadan)
    ↓
Sprint 12: Core servisler (DB, cache, auth, queue)
    ↓
Sprint 13: Identity + Catalog (temel CRUD)
    ↓
Sprint 14: Booking + Payment (para akışı)
    ↓
Sprint 15: Frontend taşıma (kullanıcı görsün)
    ↓
Sprint 16: Partner + Admin panelleri
    ↓
Sprint 17: Review + Notification (UX zenginleştirme)
    ↓
Sprint 18: Performance + Production (canlıya çıkış)
```

---

## Risk Matrisi

| Risk                                    | Olasılık | Etki   | Mitigasyon                                         |
| --------------------------------------- | -------- | ------ | -------------------------------------------------- |
| Mevcut veri kaybı (migration sırasında) | Düşük    | Yüksek | Migration öncesi DB backup, staging'de test        |
| İyzico entegrasyonu gecikme             | Orta     | Yüksek | Sprint 14'te erken başla, sandbox ile paralel test |
| Keycloak kurulumu karmaşıklığı          | Orta     | Orta   | İlk aşamada basit JWT, Keycloak Sprint 13'te       |
| Frontend taşıma sırasında regresyon     | Yüksek   | Orta   | Sayfa sayfa taşı, eski sayfaları karşılaştır       |
| Redis/BullMQ production ayarları        | Düşük    | Orta   | Upstash Redis (managed, sıfır ops)                 |

---

## Ekip Dağılımı Önerisi

| Sprint | Backend Dev                     | Frontend Dev              | Full-stack/DevOps  |
| ------ | ------------------------------- | ------------------------- | ------------------ |
| 11     | Monorepo + NestJS scaffold      | Next.js scaffold + UI kit | Docker + CI/CD     |
| 12     | Core modüller (DB, auth, cache) | —                         | Redis, MinIO setup |
| 13     | Identity + Catalog API          | — (API hazır değil)       | Seed data + test   |
| 14     | Booking + Payment               | — (API hazır değil)       | İyzico sandbox     |
| 15     | — (API hazır)                   | Tüm müşteri sayfaları     | Deploy pipeline    |
| 16     | Partner + Admin API             | Partner + Admin UI        | Image upload       |
| 17     | Review + Notification           | Yorum UI + Bildirim UI    | WebSocket + Email  |
| 18     | Performance + Security          | Bundle opt + Lighthouse   | Production deploy  |

---

## KPI'lar (Sprint 18 Sonunda)

| Metrik                  | Hedef   |
| ----------------------- | ------- |
| API Response Time (p95) | < 200ms |
| Frontend LCP            | < 2.5s  |
| Frontend FID            | < 100ms |
| API Uptime              | > 99.5% |
| Test Coverage (BE)      | > 80%   |
| Test Coverage (FE)      | > 70%   |
| Lighthouse Performance  | > 85    |
| Lighthouse SEO          | > 90    |
| Zero Critical Bugs      | ✓       |
| E2E Test Pass Rate      | 100%    |
