# TurlaDur — Sprint 19-24: Mimari Geçiş ve Tamamlama Planı

> **Başlangıç durumu:** Sprint 11-18 kodu yazılmış, iki paralel stack çalışıyor  
> **Hedef:** Tek bir çalışan sistem (yeni mimari), legacy tamamen kaldırılmış, production'da canlı  
> **Sprint süresi:** 1 hafta  
> **Toplam süre:** 6 hafta (Sprint 19 → Sprint 24)

---

## Sprint 19 — Ortam Stratejisi + Veritabanı Birleştirme

**Hedef:** Mobil + Web ekiplerinin ortam yapısını kurmak ve legacy 22 modeli yeni multi-schema'ya taşımak.

### Çoklu Ekip Ortam Stratejisi (Mobil + Web)

```
                   ┌─────────────────────────────────────────────────┐
                   │              Neon PostgreSQL                      │
                   │                                                   │
                   │  ┌─────────┐  ┌─────────────┐  ┌────────────┐  │
                   │  │  prod   │  │   staging    │  │    dev     │  │
                   │  │ (main)  │  │ (pre-prod)   │  │ (develop)  │  │
                   │  └────┬────┘  └──────┬───────┘  └─────┬──────┘  │
                   │       │              │                 │          │
                   └───────┼──────────────┼─────────────────┼──────────┘
                           │              │                 │
              ┌────────────┼──────────────┼─────────────────┼────────────┐
              │            │              │                 │            │
    ┌─────────▼────┐  ┌───▼──────┐  ┌───▼──────┐   ┌─────▼──────┐    │
    │  Production  │  │ Staging  │  │  Web Dev │   │ Mobile Dev │    │
    │  turladur.com│  │ test.    │  │ :3001    │   │  Emulator  │    │
    │  api.turl.. │  │ turladur │  │ :4000    │   │  :4000     │    │
    └──────────────┘  └──────────┘  └──────────┘   └────────────┘    │
              │                                                        │
              │         Paylaşılan API (NestJS) — Tek backend          │
              └────────────────────────────────────────────────────────┘
```

**Kural:** Mobil ve Web aynı NestJS API'yi kullanır. İki ayrı backend YOKTUR.

### Ortam Tanımları

| Ortam | DB | API URL | Kim Kullanır | Ne Zaman Güncellenir |
|-------|-----|---------|-------------|---------------------|
| **Local (dev)** | Docker PostgreSQL (localhost:5433) | localhost:4000 | Her dev kendi | Her `git pull` sonrası migrate |
| **Dev (paylaşılan)** | Neon branch: `develop` | dev-api.turladur.com | Web + Mobil ekip | Her merge to `develop` (otomatik) |
| **Staging** | Neon branch: `staging` | staging-api.turladur.com | QA + Demo | Sprint sonlarında (1-3 günde bir) |
| **Production** | Neon branch: `main` | api.turladur.com | Son kullanıcılar | Release sonrası |

### DB Senkronizasyon Akışı

```
Developer push → develop branch
       ↓
CI/CD (GitHub Actions):
  1. pnpm --filter api prisma migrate deploy (dev DB)
  2. API deploy (dev ortam)
       ↓
Her 1-3 günde bir (veya sprint sonunda):
  develop → staging merge
       ↓
CI/CD:
  1. pnpm --filter api prisma migrate deploy (staging DB)
  2. API + Web deploy (staging)
       ↓
QA onayı sonrası:
  staging → main merge
       ↓
CI/CD:
  1. pnpm --filter api prisma migrate deploy (production DB)
  2. API + Web deploy (production)
```

### Mobil Ekip Nasıl Çalışır?

| Adım | Açıklama |
|------|----------|
| 1 | Mobil dev, `dev-api.turladur.com` URL'ini kullanır (shared dev ortamı) |
| 2 | Yeni endpoint lazımsa → backend ekibine söyler veya PR açar |
| 3 | `develop` branch'e merge edilen her API değişikliği otomatik dev ortamına deploy olur |
| 4 | Mobil dev, endpoint değişikliğini hemen kullanabilir (1-3dk deploy süresi) |
| 5 | Local test için `pnpm dev:api` çalıştırıp localhost:4000 kullanabilir |

### Mobil Ekip Local Kurulum

```bash
# Sadece API'yi çalıştır (frontend gerekmez)
git clone https://github.com/MertUras/turladur.git
cd turladur
pnpm install
docker compose -f infrastructure/docker/docker-compose.yml up -d
cp .env.example apps/api/.env
pnpm dev:api   # localhost:4000 → Swagger: localhost:4000/api/docs
```

### API Versiyonlama (Mobil Uyumluluk)

Mobil uygulama yayınlandıktan sonra API breaking change yapılamaz. Kural:

| Durum | Ne Yapılır |
|-------|-----------|
| Yeni field ekleme | Uyumlu — mobil görmezden gelir |
| Field silme | YASAK — deprecated yap, 3 ay sonra kaldır |
| Endpoint URL değiştirme | YASAK — yeni URL ekle, eski çalışmaya devam etsin |
| Response format değişikliği | YASAK — yeni versiyon: `/api/v2/...` |
| Yeni endpoint ekleme | Uyumlu — mobil yeni versiyonda kullanır |

### Neon Branch Yönetimi

```bash
# Dev ortam DB oluştur (bir kez)
neonctl branches create --name develop --parent main

# Staging ortam DB oluştur (bir kez)
neonctl branches create --name staging --parent main

# Dev DB'yi main'den yenile (haftalık — temiz veri)
neonctl branches reset develop --parent main
pnpm --filter api prisma migrate deploy  # dev DB'ye migration uygula
pnpm --filter api prisma db seed         # seed veri
```

---

### Veritabanı Birleştirme Görevleri

### Görevler

| # | Görev | Öncelik | Çıktı |
|---|-------|---------|-------|
| 19.0a | Neon'da `develop` branch oluştur (dev ortam DB) | P0 | Dev DB hazır |
| 19.0b | Neon'da `staging` branch oluştur | P0 | Staging DB hazır |
| 19.0c | GitHub Actions: develop'a merge → otomatik dev deploy pipeline | P0 | CI/CD aktif |
| 19.0d | GitHub Actions: staging'e merge → otomatik staging deploy pipeline | P0 | CI/CD aktif |
| 19.0e | `apps/api/.env.example` güncelle — ortam URL'leri ekle | P0 | Dev/staging/prod URL'ler belirli |
| 19.0f | Mobil ekip onboarding dokümanı (API nasıl kullanılır) | P1 | `docs/MOBILE_ONBOARDING.md` |
| 19.1 | Legacy `prisma/schema.prisma` analiz — hangi model nereye gidecek belirle | P0 | Mapping dokümanı |
| 19.2 | `apps/api/prisma/schema.prisma`'ya Hotel + Room modelleri ekle | P0 | `@@schema("catalog")` |
| 19.3 | Experience + ActivityDate + ExperienceOperator modelleri ekle | P0 | `@@schema("catalog")` |
| 19.4 | TourAccommodation + TourPickupPoint + AgeRange modelleri ekle | P0 | `@@schema("catalog")` |
| 19.5 | Agency + TourOperator + SubUser modelleri ekle (Partner ile birleştir) | P0 | `@@schema("identity")` |
| 19.6 | Post + Category + Comment modelleri ekle | P1 | `@@schema("content")` — yeni schema |
| 19.7 | ActivityReview modelini Review modülüne entegre et | P1 | `@@schema("review")` |
| 19.8 | Legacy Booking → Reservation alanlarını birleştir (otel/aktivite desteği) | P0 | `@@schema("booking")` |
| 19.9 | Enum'ları birleştir (UserRole, BookingStatus, PaymentStatus) | P0 | Tek tutarlı enum seti |
| 19.10 | `datasource.schemas` listesine `content` ekle | P0 | Schema listesi güncel |
| 19.11 | Migration oluştur: `prisma migrate dev --name merge_legacy_models` | P0 | Çalışan migration |
| 19.12 | Seed verisi güncelle — yeni modeller için gerçekçi Türkçe veri | P1 | Otel, aktivite, blog seed |
| 19.13 | `packages/shared-types/` güncelle — tüm yeni modeller için tip tanımları | P0 | Hotel, Room, Experience, Post tipleri |
| 19.14 | Mevcut NestJS servislerinin yeni modellerle çalıştığını doğrula | P0 | `pnpm dev:api` hatasız |

### Definition of Done
- [ ] `apps/api/prisma/schema.prisma` tüm modelleri içeriyor (22+ model)
- [ ] `prisma migrate dev` başarıyla çalışıyor
- [ ] `prisma generate` hatasız
- [ ] Mevcut NestJS testleri geçiyor
- [ ] Seed komutu tüm tabloları dolduruyor
- [ ] `packages/shared-types/` güncel

---

## Sprint 20 — NestJS API Modülleri Tamamlama

**Hedef:** Tüm eksik endpoint'ler yazılmış, legacy API ile birebir aynı kapasitede.

### Görevler

| # | Görev | Öncelik | Çıktı |
|---|-------|---------|-------|
| 20.1 | Catalog — Hotel controller + service (CRUD + search) | P0 | `/api/v1/catalog/hotels` |
| 20.2 | Catalog — Room controller + service (CRUD) | P0 | `/api/v1/catalog/hotels/:id/rooms` |
| 20.3 | Catalog — Experience/Activity controller + service (CRUD) | P0 | `/api/v1/catalog/experiences` |
| 20.4 | Catalog — ActivityDate yönetimi (CRUD) | P0 | `/api/v1/catalog/experiences/:id/dates` |
| 20.5 | Catalog — Route (rota) controller + service (CRUD) | P1 | `/api/v1/catalog/routes` |
| 20.6 | Catalog — TourAccommodation + TourPickupPoint endpoint'leri | P1 | Alt kaynak API'ler |
| 20.7 | Catalog — AgeRange yönetimi (TourDate + ActivityDate) | P1 | `/api/v1/catalog/tours/:id/dates/:dateId/age-ranges` |
| 20.8 | Identity — SubUser CRUD + izin yönetimi | P0 | `/api/v1/identity/partners/:id/users` |
| 20.9 | Identity — Agency CRUD (admin onay akışı) | P1 | `/api/v1/identity/agencies` |
| 20.10 | Content modülü oluştur — Post CRUD | P1 | `/api/v1/content/posts` |
| 20.11 | Content — Category + Comment CRUD | P2 | `/api/v1/content/categories`, `/posts/:id/comments` |
| 20.12 | Booking — Otel rezervasyonu desteği (hotel + room booking) | P0 | Reservation'a `hotelId`, `roomId` opsiyonel alanlar |
| 20.13 | Booking — Aktivite/deneyim rezervasyonu desteği | P0 | Reservation'a `experienceId`, `activityDateId` |
| 20.14 | Partner — Deneyim yönetimi endpoint'leri | P0 | `/api/v1/partner/experiences` |
| 20.15 | Partner — SubUser yönetimi endpoint'leri | P1 | `/api/v1/partner/users` |
| 20.16 | Admin — Agency onaylama endpoint'i | P1 | `/api/v1/admin/agencies/:id/approve` |
| 20.17 | Admin — İçerik yönetimi (Post CRUD for admin) | P2 | `/api/v1/admin/content` |
| 20.18 | Swagger dokümanı tam — tüm yeni endpoint'ler dokümante | P0 | `/api/docs` güncel |
| 20.19 | DTO'lar + Zod şemaları (shared-validators) | P0 | Frontend-backend ortak validation |
| 20.20 | Unit testler — yeni servisler için minimum %80 coverage | P1 | `*.spec.ts` dosyaları |

### Definition of Done
- [ ] Legacy'deki 58 endpoint'in tamamı NestJS'te karşılığı var
- [ ] Swagger UI'da tüm endpoint'ler görünüyor ve çalışıyor
- [ ] `pnpm dev:api` hatasız, tüm route'lar erişilebilir
- [ ] Postman/Insomnia ile test edilmiş (temel akışlar)
- [ ] Shared types ve validators güncel

---

## Sprint 21 — Frontend Eksik Sayfalar (Marketing + Customer)

**Hedef:** Müşteri tarafı tamamen yeni `apps/web`'e taşınmış. SEO sayfaları SSR.

### Görevler

| # | Görev | Öncelik | Çıktı |
|---|-------|---------|-------|
| 21.1 | `(marketing)/hotels/page.tsx` — Otel listesi (search + filter) | P0 | SSR, SEO metadata |
| 21.2 | `(marketing)/hotels/[id]/page.tsx` — Otel detay (oda seçimi, galeri) | P0 | SSR, structured data |
| 21.3 | `(marketing)/activities/page.tsx` — Aktivite listesi | P0 | SSR, kategori filtre |
| 21.4 | `(marketing)/activities/[id]/page.tsx` — Aktivite detay | P0 | SSR, tarih seçimi |
| 21.5 | `(marketing)/routes/page.tsx` — Rota listesi | P1 | SSR |
| 21.6 | `(marketing)/routes/[id]/page.tsx` — Rota detay | P1 | SSR |
| 21.7 | `(marketing)/destinations/[slug]/page.tsx` — Destinasyon sayfası | P1 | SSR, SEO |
| 21.8 | `(marketing)/blog/page.tsx` — Blog listesi | P2 | SSR |
| 21.9 | `(marketing)/blog/[slug]/page.tsx` — Blog yazı detay | P2 | SSR |
| 21.10 | `(marketing)/about/page.tsx` — Hakkımızda | P2 | Statik |
| 21.11 | `(marketing)/contact/page.tsx` — İletişim formu | P1 | Form + email gönderim |
| 21.12 | `(marketing)/campaigns/page.tsx` — Kampanyalar | P2 | SSR |
| 21.13 | `(marketing)/careers/page.tsx` — Kariyer | P2 | Statik |
| 21.14 | `(customer)/profile/page.tsx` — Profil (bilgi güncelleme, şifre) | P0 | Protected, form |
| 21.15 | `(customer)/bookings/page.tsx` genişlet — otel + aktivite booking görüntüle | P0 | Booking tipi ayırımı |
| 21.16 | `(customer)/checkout/page.tsx` genişlet — otel + aktivite ödeme | P0 | Checkout akışına tip ekleme |
| 21.17 | Otel arama bileşenleri (HotelCard, HotelFilters, RoomSelector) | P0 | `components/features/hotel/` |
| 21.18 | Aktivite bileşenleri (ActivityCard, ActivityFilters, DatePicker) | P0 | `components/features/activity/` |
| 21.19 | Services katmanı: `hotel.service.ts`, `activity.service.ts`, `content.service.ts` | P0 | API client fonksiyonları |
| 21.20 | Responsive kontrol — tüm yeni sayfalar mobile-first | P0 | Tablet + mobile uyum |
| 21.21 | SEO metadata — tüm marketing sayfalarında title, description, OG | P0 | Lighthouse SEO > 90 |

### Definition of Done
- [ ] Otel arama ve detay sayfası çalışıyor (SSR)
- [ ] Aktivite arama ve detay sayfası çalışıyor (SSR)
- [ ] Profil sayfasında bilgi güncellenebiliyor
- [ ] Tüm public sayfalar Google'da indexlenebilir
- [ ] Mobilde düzgün görünüyor
- [ ] Lighthouse: Performance > 85, SEO > 90

---

## Sprint 22 — Frontend Partner + Admin Panelleri

**Hedef:** Partner ve Admin panelleri tam fonksiyonel, legacy'den farkı kalmamış.

### Görevler

| # | Görev | Öncelik | Çıktı |
|---|-------|---------|-------|
| 22.1 | `(partner)/experiences/page.tsx` — Deneyim listesi | P0 | Tablo + filtre |
| 22.2 | `(partner)/experiences/create/page.tsx` — Deneyim oluşturma formu | P0 | Form + resim upload |
| 22.3 | `(partner)/experiences/[id]/edit/page.tsx` — Deneyim düzenleme | P0 | Edit form |
| 22.4 | `(partner)/financials/page.tsx` — Gelir grafikleri (Recharts) | P1 | Aylık/haftalık grafikler |
| 22.5 | `(partner)/users/page.tsx` — Alt kullanıcı (SubUser) yönetimi | P1 | CRUD + izin toggle |
| 22.6 | `(partner)/settings/page.tsx` — Partner profil ayarları | P1 | Logo, bilgi güncelleme |
| 22.7 | `(partner)/tours/[id]/edit/page.tsx` geliştir — konaklama, pickup point | P0 | Ek form alanları |
| 22.8 | `(partner)/tours/create/page.tsx` geliştir — tarih + yaş aralığı yönetimi | P0 | AgeRange CRUD |
| 22.9 | `(admin)/agencies/page.tsx` — Acente listesi + onaylama | P1 | Tablo + approve/reject |
| 22.10 | `(admin)/statistics/page.tsx` — Detaylı platform istatistikleri | P1 | Grafikler + KPI kartları |
| 22.11 | `(admin)/content/page.tsx` — Blog yazısı yönetimi | P2 | Post CRUD |
| 22.12 | `(admin)/tours/page.tsx` geliştir — deneyim/aktivite onaylama | P1 | Tab: Turlar + Deneyimler |
| 22.13 | Image upload bileşeni — partner tur/deneyim görselleri | P0 | Drag-drop, presigned URL |
| 22.14 | Partner notification bell — WebSocket veya polling | P1 | Header'da bildirim dropdown |
| 22.15 | Responsive kontrol — partner/admin paneller tablet uyumlu | P1 | Sidebar collapse |

### Definition of Done
- [ ] Partner deneyim oluşturup yönetebiliyor (resim dahil)
- [ ] Partner gelir grafiklerini görebiliyor
- [ ] Partner alt kullanıcı ekleyip izin verebiliyor
- [ ] Admin acenteleri onaylayabiliyor
- [ ] Admin blog yazısı ekleyebiliyor
- [ ] Bildirim sistemi çalışıyor (en az polling)

---

## Sprint 23 — Legacy Kaldırma + Entegrasyonlar

**Hedef:** Eski kod tamamen silinmiş, yeni stack tek başına çalışıyor. Gerçek entegrasyonlar aktif.

### Görevler

| # | Görev | Öncelik | Çıktı |
|---|-------|---------|-------|
| 23.1 | `app/api/*` — 58 route dosyasını sil | P0 | Legacy API yok |
| 23.2 | `app/(dashboard)/*` — Eski müşteri sayfaları sil | P0 | Legacy UI yok |
| 23.3 | `app/(admin-dashboard)/*` — Eski admin paneli sil | P0 | Legacy admin yok |
| 23.4 | `app/(partner-dashboard)/*` — Eski partner paneli sil | P0 | Legacy partner yok |
| 23.5 | `app/(auth)/*`, `app/(partners-auth)/*` — Eski auth sayfaları sil | P0 | Legacy auth yok |
| 23.6 | `app/components/*`, `app/lib/*`, `app/providers/*`, `app/utils/*`, `app/types/*` sil | P0 | Legacy bileşenler yok |
| 23.7 | Root `prisma/` klasörü sil (43 migration dahil) | P0 | Tek prisma: `apps/api/prisma/` |
| 23.8 | Root `lib/` klasörü sil (68 dosya) | P0 | İş mantığı NestJS'te |
| 23.9 | Root `middleware.ts` sil | P0 | NestJS guards ile değiştirildi |
| 23.10 | Root `components/`, `hooks/`, `types/` sil | P0 | `apps/web/src/` altına taşınmış |
| 23.11 | `package.json` temizle — legacy deps kaldır (NextAuth, Prisma root, vb.) | P0 | Temiz bağımlılıklar |
| 23.12 | Root `next.config.js` sil, `app/page.tsx` sil, `app/layout.tsx` sil | P0 | Kök Next.js yok |
| 23.13 | `pnpm dev` komutu → `pnpm dev:apps`'e yönlendir | P0 | Tek çalıştırma komutu |
| 23.14 | Gerçek İyzico 3D Secure entegrasyonu (mock → production) | P0 | Sandbox test kartı ile ödeme |
| 23.15 | WebSocket gateway — realtime bildirim (Socket.io) | P1 | Anlık notification push |
| 23.16 | CDN setup — Cloudflare (statik + görseller) | P1 | `media.turladur.com` |
| 23.17 | E2E testleri genişlet — tam kayıt → booking → ödeme akışı | P0 | Playwright suite geçiyor |
| 23.18 | Lint + build kontrolü — `pnpm build:apps` hatasız | P0 | CI-ready |

### Definition of Done
- [ ] `app/` klasöründe legacy kod kalmamış (sadece `apps/web/` var)
- [ ] Root `prisma/`, `lib/`, `middleware.ts` yok
- [ ] `pnpm dev:apps` tek komutla tüm sistem çalışıyor
- [ ] İyzico test kartıyla gerçek ödeme yapılabiliyor
- [ ] E2E testler geçiyor
- [ ] `pnpm build:apps` hatasız tamamlanıyor

---

## Sprint 24 — Production Deploy + Soft Launch

**Hedef:** Platform canlıda. Beta kullanıcılar kullanmaya başlamış. Monitoring aktif.

### Görevler

| # | Görev | Öncelik | Çıktı |
|---|-------|---------|-------|
| 24.1 | Vercel production deploy — `apps/web` (root dir: apps/web) | P0 | `turladur.com` çalışıyor |
| 24.2 | Railway production deploy — `apps/api` | P0 | `api.turladur.com` çalışıyor |
| 24.3 | Neon — production branch oluştur + pooler aktif | P0 | Production DB hazır |
| 24.4 | Migration deploy: `prisma migrate deploy` (production) | P0 | Tablolar production'da |
| 24.5 | Redis — Upstash veya Railway Redis (production) | P0 | Cache + queue çalışıyor |
| 24.6 | Cloudflare DNS — domain yönlendirme + SSL | P0 | HTTPS aktif |
| 24.7 | MinIO → S3/R2 geçişi (production object storage) | P0 | Görseller CDN'den sunuluyor |
| 24.8 | Sentry — web + api error tracking aktif | P0 | Hata alerting |
| 24.9 | Environment variables — tüm production env'ler set | P0 | Hiçbir secret eksik değil |
| 24.10 | Health check monitoring — UptimeRobot veya Betterstack | P1 | Downtime alert |
| 24.11 | Performance audit — Lighthouse (Performance > 85, SEO > 90) | P0 | Metrikleri geç |
| 24.12 | Security audit — OWASP top 10 kontrol | P0 | Kritik açık yok |
| 24.13 | Rate limiting production ayarları | P0 | Brute force koruması aktif |
| 24.14 | Seed data temizleme — demo/test verisi kaldır | P1 | Production-ready DB |
| 24.15 | README + ONBOARDING güncelle (yeni mimari için) | P1 | Yeni dev 30dk'da başlar |
| 24.16 | Beta kullanıcılara davet gönder | P0 | İlk gerçek kullanıcılar |
| 24.17 | Hotfix workflow test — hata bulunca hızlı fix + deploy | P1 | Süreç doğrulanmış |
| 24.18 | Backup stratejisi — Neon otomatik backup doğrula | P1 | Veri kaybı riski sıfır |

### Definition of Done
- [ ] `turladur.com` canlı ve erişilebilir
- [ ] `api.turladur.com/api/v1/health` → `{ status: 'ok' }`
- [ ] Gerçek kullanıcı kayıt olup tur arayabiliyor
- [ ] Gerçek ödeme (İyzico sandbox) çalışıyor
- [ ] Sentry'de error tracking aktif
- [ ] Lighthouse: Performance > 85, SEO > 90, Accessibility > 85
- [ ] Zero critical bugs
- [ ] Beta kullanıcılar sistemi kullanıyor

---

## Browser Test Aşamaları (Her Sprint Sonunda)

Her sprint tamamlandığında Cursor browser ile şu kontrolleri otomatik yapacak:

### Sprint 19 Sonrası (DB Birleştirme)
| # | Test | URL/Komut | Beklenen Sonuç |
|---|------|-----------|----------------|
| T19.1 | API Health Check | `http://localhost:4000/api/v1/health` | `{ status: 'ok', database: 'up' }` |
| T19.2 | Swagger açılıyor | `http://localhost:4000/api/docs` | Swagger UI yükleniyor, tüm endpoint'ler listeleniyor |
| T19.3 | Prisma Studio | `npx prisma studio` (apps/api) | Tüm tablolar görünüyor (Hotel, Room, Experience, vb.) |

### Sprint 20 Sonrası (API Modülleri)
| # | Test | URL/Komut | Beklenen Sonuç |
|---|------|-----------|----------------|
| T20.1 | Otel arama | `GET /api/v1/catalog/hotels?page=1` | 200 + otel listesi dönüyor |
| T20.2 | Aktivite arama | `GET /api/v1/catalog/experiences?page=1` | 200 + aktivite listesi dönüyor |
| T20.3 | Partner login | `POST /api/v1/identity/login` | JWT token dönüyor |
| T20.4 | Tur oluşturma (auth) | `POST /api/v1/catalog/tours` (Bearer token) | 201 + tur oluştu |
| T20.5 | SubUser listesi | `GET /api/v1/identity/partners/:id/users` | 200 + kullanıcı listesi |
| T20.6 | Blog post | `GET /api/v1/content/posts` | 200 + post listesi |
| T20.7 | Swagger tüm endpoint'ler | `http://localhost:4000/api/docs` | 70+ endpoint görünüyor |

### Sprint 21 Sonrası (Frontend Marketing + Customer)
| # | Test | URL/Komut | Beklenen Sonuç |
|---|------|-----------|----------------|
| T21.1 | Ana sayfa yükleniyor | `http://localhost:3001` | Hero, turlar, SEO metadata var |
| T21.2 | Otel listesi sayfası | `http://localhost:3001/hotels` | Otel kartları render ediliyor |
| T21.3 | Otel detay | `http://localhost:3001/hotels/[id]` | Galeri, oda listesi, fiyat görünüyor |
| T21.4 | Aktivite listesi | `http://localhost:3001/activities` | Aktivite kartları render ediliyor |
| T21.5 | Aktivite detay | `http://localhost:3001/activities/[id]` | Tarih seçimi, fiyat görünüyor |
| T21.6 | Tur arama | `http://localhost:3001/tours` | Arama + filtre çalışıyor |
| T21.7 | Login sayfası | `http://localhost:3001/login` | Form görünüyor, submit çalışıyor |
| T21.8 | Profil sayfası | `http://localhost:3001/profile` (auth) | Kullanıcı bilgileri görünüyor |
| T21.9 | Checkout akışı | `http://localhost:3001/checkout` (auth) | Form + ödeme butonu var |
| T21.10 | Mobil responsive | Viewport 375px | Hamburger menu, stack layout |
| T21.11 | SEO kontrol | Page source view | `<title>`, `<meta description>`, OG tags mevcut |

### Sprint 22 Sonrası (Partner + Admin)
| # | Test | URL/Komut | Beklenen Sonuç |
|---|------|-----------|----------------|
| T22.1 | Partner login | `http://localhost:3001/login` → partner credentials | Dashboard'a yönlendirme |
| T22.2 | Partner dashboard | `http://localhost:3001/partner/dashboard` | İstatistik kartları görünüyor |
| T22.3 | Tur oluşturma | `http://localhost:3001/partner/tours/create` | Form + resim upload çalışıyor |
| T22.4 | Deneyim oluşturma | `http://localhost:3001/partner/experiences/create` | Form + tarih ekleme çalışıyor |
| T22.5 | Rezervasyonlar | `http://localhost:3001/partner/reservations` | Liste görünüyor, status değiştirilebiliyor |
| T22.6 | Alt kullanıcılar | `http://localhost:3001/partner/users` | SubUser listesi + ekleme |
| T22.7 | Admin login | `http://localhost:3001/login` → admin credentials | Admin dashboard'a yönlendirme |
| T22.8 | Admin kullanıcılar | `http://localhost:3001/admin/users` | Kullanıcı tablosu |
| T22.9 | Admin tur onaylama | `http://localhost:3001/admin/tours` | Pending turlar, onay butonu |
| T22.10 | Bildirim dropdown | Header'daki bell icon tıkla | Bildirim listesi açılıyor |

### Sprint 23 Sonrası (Legacy Kaldırma + Entegrasyonlar)
| # | Test | URL/Komut | Beklenen Sonuç |
|---|------|-----------|----------------|
| T23.1 | Legacy port kapalı | `http://localhost:3000` | Bağlantı reddedildi (legacy yok) |
| T23.2 | Yeni sistem çalışıyor | `http://localhost:3001` | Ana sayfa sorunsuz |
| T23.3 | API çalışıyor | `http://localhost:4000/api/v1/health` | `{ status: 'ok' }` |
| T23.4 | Tam booking akışı | Tur seç → checkout → ödeme | İyzico formu açılıyor, ödeme tamamlanıyor |
| T23.5 | Email gönderimi | Booking sonrası | Mailhog'da email görünüyor |
| T23.6 | Build başarılı | `pnpm build:apps` | Exit code 0, hata yok |
| T23.7 | E2E test suite | `pnpm test:e2e` | Tüm testler geçiyor |

### Sprint 24 Sonrası (Production)
| # | Test | URL/Komut | Beklenen Sonuç |
|---|------|-----------|----------------|
| T24.1 | Production web | `https://turladur.com` | Ana sayfa yükleniyor, SSL aktif |
| T24.2 | Production API | `https://api.turladur.com/api/v1/health` | `{ status: 'ok' }` |
| T24.3 | Kayıt akışı | Register → email doğrulama → login | Hesap oluşuyor |
| T24.4 | Tur arama + booking | Ara → seç → checkout → ödeme | Rezervasyon onaylanıyor |
| T24.5 | Partner kayıt | Partner register → doğrulama → login | Partner paneline erişim |
| T24.6 | Lighthouse audit | Chrome DevTools → Lighthouse | P > 85, SEO > 90, A11y > 85 |
| T24.7 | Mobil test | iPhone viewport | Tüm akışlar çalışıyor |
| T24.8 | Error tracking | Sentry dashboard | Entegrasyon aktif, event'ler geliyor |

---

## Cursor Browser Test Kuralı

Her sprint'in son görevi tamamlandığında:
1. `pnpm dev:apps` çalıştır (web:3001 + api:4000)
2. Yukarıdaki ilgili sprint test tablosundaki her satırı browser ile kontrol et
3. Başarısız test varsa → düzelt, tekrar test et
4. Tüm testler geçince sprint tamamlanmış say

---

## Genel Bağımlılık Sırası

```
Sprint 19: DB Birleştirme (herşeyin temeli)
    ↓
Sprint 20: API Modülleri (DB hazır → endpoint'leri yaz)
    ↓
Sprint 21: Frontend Marketing + Customer (API hazır → sayfaları bağla)
    ↓
Sprint 22: Frontend Partner + Admin (API hazır → panel sayfaları)
    ↓
Sprint 23: Legacy Kaldırma + Entegrasyonlar (tüm yeni hazır → eski sil)
    ↓
Sprint 24: Production Deploy + Soft Launch (her şey hazır → canlıya al)
```

---

## Risk Matrisi

| Risk | Olasılık | Etki | Mitigasyon |
|------|----------|------|-----------|
| DB migration sırasında veri kaybı | Düşük | Kritik | Migration öncesi Neon snapshot, staging'de test |
| Legacy kaldırma sonrası regresyon | Orta | Yüksek | E2E testler, sayfa sayfa karşılaştırma |
| İyzico production entegrasyonu gecikmesi | Orta | Yüksek | Sprint 23'te erken başla, sandbox ile paralel |
| Vercel/Railway deploy sorunları | Düşük | Orta | Staging deploy ile önceden test |
| Performance sorunları (yavaş API) | Orta | Orta | Redis cache tüm search'lerde, DB index review |

---

## Sprint Sonunda Metrikler (Sprint 24 Tamamlandığında)

| Metrik | Hedef |
|--------|-------|
| API Response Time (p95) | < 200ms |
| Frontend LCP | < 2.5s |
| Frontend FID | < 100ms |
| API Uptime | > 99.5% |
| Test Coverage (BE) | > 80% |
| Test Coverage (FE) | > 70% |
| Lighthouse Performance | > 85 |
| Lighthouse SEO | > 90 |
| Lighthouse Accessibility | > 85 |
| Zero Critical Bugs | Evet |
| E2E Test Pass Rate | 100% |
| Toplam Sayfa Sayısı | 40+ |
| Toplam API Endpoint | 70+ |
| Legacy Kod | 0 satır |
