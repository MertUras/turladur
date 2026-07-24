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

| Ortam                | DB                                 | API URL                  | Kim Kullanır     | Ne Zaman Güncellenir              |
| -------------------- | ---------------------------------- | ------------------------ | ---------------- | --------------------------------- |
| **Local (dev)**      | Docker PostgreSQL (localhost:5433) | localhost:4000           | Her dev kendi    | Her `git pull` sonrası migrate    |
| **Dev (paylaşılan)** | Neon branch: `develop`             | dev-api.turladur.com     | Web + Mobil ekip | Her merge to `develop` (otomatik) |
| **Staging**          | Neon branch: `staging`             | staging-api.turladur.com | QA + Demo        | Sprint sonlarında (1-3 günde bir) |
| **Production**       | Neon branch: `main`                | api.turladur.com         | Son kullanıcılar | Release sonrası                   |

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

| Adım | Açıklama                                                                              |
| ---- | ------------------------------------------------------------------------------------- |
| 1    | Mobil dev, `dev-api.turladur.com` URL'ini kullanır (shared dev ortamı)                |
| 2    | Yeni endpoint lazımsa → backend ekibine söyler veya PR açar                           |
| 3    | `develop` branch'e merge edilen her API değişikliği otomatik dev ortamına deploy olur |
| 4    | Mobil dev, endpoint değişikliğini hemen kullanabilir (1-3dk deploy süresi)            |
| 5    | Local test için `pnpm dev:api` çalıştırıp localhost:4000 kullanabilir                 |

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

| Durum                       | Ne Yapılır                                        |
| --------------------------- | ------------------------------------------------- |
| Yeni field ekleme           | Uyumlu — mobil görmezden gelir                    |
| Field silme                 | YASAK — deprecated yap, 3 ay sonra kaldır         |
| Endpoint URL değiştirme     | YASAK — yeni URL ekle, eski çalışmaya devam etsin |
| Response format değişikliği | YASAK — yeni versiyon: `/api/v2/...`              |
| Yeni endpoint ekleme        | Uyumlu — mobil yeni versiyonda kullanır           |

### Neon Branch Yönetimi

> **Durum (2026-07):** Neon'da `production` + `develop` + `staging` mevcut.

```bash
# Dev / Staging — ✅ oluşturuldu (parent: production)
# neonctl branches create --name develop --parent production
# neonctl branches create --name staging --parent production

# Dev DB'yi production'dan yenile (haftalık — temiz veri)
neonctl branches reset develop --parent production
pnpm --filter api prisma migrate deploy  # dev DB'ye migration uygula
pnpm --filter api prisma db seed         # seed veri
```

---

### Veritabanı Birleştirme Görevleri

### Görevler

| #     | Görev                                                                     | Öncelik | Çıktı                                                                          |
| ----- | ------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------ |
| 19.0a | Neon'da `develop` branch oluştur (dev ortam DB)                           | P0      | ✅ Tamam — Neon'da `develop` mevcut                                            |
| 19.0b | Neon'da `staging` branch oluştur                                          | P0      | ✅ Tamam — Neon'da `staging` mevcut                                            |
| 19.0c | GitHub Actions: develop'a merge → otomatik dev deploy pipeline            | P0      | ✅ Workflow: `.github/workflows/deploy-dev.yml` (secret gerekir)               |
| 19.0d | GitHub Actions: staging'e merge → otomatik staging deploy pipeline        | P0      | ✅ Workflow: `.github/workflows/deploy-staging.yml` (secret gerekir)           |
| 19.0e | `apps/api/.env.example` güncelle — ortam URL'leri ekle                    | P0      | ✅ Ortam URL şablonları eklendi                                                |
| 19.0f | Mobil ekip onboarding dokümanı (API nasıl kullanılır)                     | P1      | ✅ `docs/MOBILE_ONBOARDING.md`                                                 |
| 19.1  | Legacy `prisma/schema.prisma` analiz — hangi model nereye gidecek belirle | P0      | ✅ `docs/LEGACY_TO_NEST_SCHEMA_MAPPING.md`                                     |
| 19.2  | `apps/api/prisma/schema.prisma`'ya Hotel + Room modelleri ekle            | P0      | ✅ `@@schema("catalog")` + migration                                           |
| 19.3  | Experience + ActivityDate + ExperienceOperator modelleri ekle             | P0      | ✅ Experience + ActivityDate; Operator = Partner + `capabilities: EXPERIENCES` |
| 19.4  | TourAccommodation + TourPickupPoint + AgeRange modelleri ekle             | P0      | ✅ catalog + AgePricingType + migration                                        |
| 19.5  | Agency + TourOperator + SubUser modelleri ekle (Partner ile birleştir)    | P0      | ✅ Agency + SubUser; TourOperator = Partner+TOURS                              |
| 19.6  | Post + Category + Comment modelleri ekle                                  | P1      | ✅ `@@schema("content")`                                                       |
| 19.7  | ActivityReview modelini Review modülüne entegre et                        | P1      | ✅ Review.targetType + experienceId/hotelId                                    |
| 19.8  | Legacy Booking → Reservation alanlarını birleştir (otel/aktivite desteği) | P0      | ✅ opsiyonel hotel/room/experience FK                                          |
| 19.9  | Enum'ları birleştir (UserRole, BookingStatus, PaymentStatus)              | P0      | ✅ PENDING_PAYMENT, SUSPENDED, ReservationPaymentStatus                        |
| 19.10 | `datasource.schemas` listesine `content` ekle                             | P0      | ✅                                                                             |
| 19.11 | Migration oluştur: `prisma migrate dev --name merge_legacy_models`        | P0      | ✅ `20260721220000_sprint19_merge_legacy_models`                               |
| 19.12 | Seed verisi güncelle — yeni modeller için gerçekçi Türkçe veri            | P1      | ✅ `apps/api/prisma/seed.ts`                                                   |
| 19.13 | `packages/shared-types/` güncelle — tüm yeni modeller için tip tanımları  | P0      | ✅ Hotel, Experience, Agency, Post, …                                          |
| 19.14 | Mevcut NestJS servislerinin yeni modellerle çalıştığını doğrula           | P0      | ✅ generate + nullable tourId uyumu                                            |

### Definition of Done

- [x] `apps/api/prisma/schema.prisma` tüm modelleri içeriyor (22+ model)
- [x] Migration dosyaları eklendi (`20260721*` sprint 19)
- [x] `prisma generate` hatasız
- [x] Shared types güncellendi
- [x] Seed script eklendi (`apps/api/prisma/seed.ts`)
- [ ] Local `prisma:deploy` + `prisma:seed` (geliştirici ortamında çalıştırılacak)
- [ ] Neon develop’a migrate (bilinçli, ayrı adım)

---

## Sprint 20 — NestJS API Modülleri Tamamlama

**Hedef:** Tüm eksik endpoint'ler yazılmış, legacy API ile birebir aynı kapasitede.

### Görevler

| #     | Görev                                                       | Öncelik | Çıktı                                            |
| ----- | ----------------------------------------------------------- | ------- | ------------------------------------------------ |
| 20.1  | Catalog — Hotel controller + service (CRUD + search)        | P0      | ✅ `/api/v1/catalog/hotels`                      |
| 20.2  | Catalog — Room controller + service (CRUD)                  | P0      | ✅ `/api/v1/catalog/hotels/:id/rooms`            |
| 20.3  | Catalog — Experience/Activity controller + service (CRUD)   | P0      | ✅ `/api/v1/catalog/experiences`                 |
| 20.4  | Catalog — ActivityDate yönetimi (CRUD)                      | P0      | ✅ `/api/v1/catalog/experiences/:id/dates`       |
| 20.5  | Catalog — Route (rota) controller + service (CRUD)          | P1      | ✅ curated routes + stats (legacy parity)        |
| 20.6  | Catalog — TourAccommodation + TourPickupPoint endpoint'leri | P1      | ✅ `/tours/:id/accommodation`, `/pickup-points`  |
| 20.7  | Catalog — AgeRange yönetimi (TourDate + ActivityDate)       | P1      | ✅ age-ranges under tour/experience dates        |
| 20.8  | Identity — SubUser CRUD + izin yönetimi                     | P0      | ✅ `/api/v1/identity/partners/:id/users`         |
| 20.9  | Identity — Agency CRUD (admin onay akışı)                   | P1      | ✅ `/api/v1/identity/agencies`                   |
| 20.10 | Content modülü oluştur — Post CRUD                          | P1      | ✅ `/api/v1/content/posts`                       |
| 20.11 | Content — Category + Comment CRUD                           | P2      | ✅ categories + `/posts/:id/comments`            |
| 20.12 | Booking — Otel rezervasyonu desteği (hotel + room booking)  | P0      | ✅ `roomId` + check-in/out                       |
| 20.13 | Booking — Aktivite/deneyim rezervasyonu desteği             | P0      | ✅ `activityDateId`                              |
| 20.14 | Partner — Deneyim yönetimi endpoint'leri                    | P0      | ✅ `GET /api/v1/partner/experiences`             |
| 20.15 | Partner — SubUser yönetimi endpoint'leri                    | P1      | ✅ `GET /api/v1/partner/users` (+ identity CRUD) |
| 20.16 | Admin — Agency onaylama endpoint'i                          | P1      | ✅ `/api/v1/admin/agencies/:id/approve`          |
| 20.17 | Admin — İçerik yönetimi (Post CRUD for admin)               | P2      | ✅ `/api/v1/admin/content/posts`                 |
| 20.18 | Swagger dokümanı tam — tüm yeni endpoint'ler dokümante      | P0      | ✅ @ApiTags/@ApiOperation eklendi                |
| 20.19 | DTO'lar + Zod şemaları (shared-validators)                  | P0      | ✅ agency/post/category/comment + reservation    |
| 20.20 | Unit testler — yeni servisler için minimum %80 coverage     | P1      | ✅ 65 test; lines ~81% (sprint20 services)       |

### Definition of Done

- [ ] Legacy'deki 58 endpoint'in tamamı NestJS'te karşılığı var
- [ ] Swagger UI'da tüm endpoint'ler görünüyor ve çalışıyor
- [ ] `pnpm dev:api` hatasız, tüm route'lar erişilebilir
- [ ] Postman/Insomnia ile test edilmiş (temel akışlar)
- [ ] Shared types ve validators güncel

---

## Sprint 21 — Frontend Eksik Sayfalar (Marketing + Customer)

**Hedef:** Müşteri tarafı tamamen yeni `apps/web`'e taşınmış. SEO sayfaları SSR.  
**Ürün kapsamı:** Tur + aktivite/deneyim + rota. **Otel satışı yok** — hotel sayfası / bileşen / checkout yolu açılmaz.

### Mevcut durum (kontrol özeti)

| Alan                     | Legacy (`app/(dashboard)`)             | Yeni (`apps/web`)           | Karar                                  |
| ------------------------ | -------------------------------------- | --------------------------- | -------------------------------------- |
| Tur listesi / detay      | ✅ `/tours`, `/tour/[id]`              | ✅ `(marketing)/tours`      | Geliştir (filtre parity)               |
| Aktivite listesi / detay | ✅ `/activities`, kategori varyantları | ✅ `(marketing)/activities` | Nest experiences                       |
| Rotalar                  | ✅ `/routes`, `/routes/[id]`           | ✅ `(marketing)/routes`     | Nest curated routes                    |
| Destinasyon              | ✅ `/destinations/[slug]`              | ❌                          | Rota detay ile birleştir veya ince SSR |
| Ana sayfa                | ✅ Hero → `/routes`                    | ✅ stub                     | Rota + tur vurgusu                     |
| About / Contact          | ✅ nav’da                              | ❌                          | Taşı (P1)                              |
| Profil                   | ✅ `/profile` (dummy + tab’lar)        | ✅ `(customer)/profile`     | Nest identity + review/me; TC + fatura |
| Bookings / Checkout      | ✅ tur (+ legacy booking)              | ✅ tur + aktivite           | **otel yok**                           |
| Blog                     | ✅ footer                              | ❌                          | P2                                     |
| Campaigns / Careers      | ✅ zayıf/popup                         | ❌                          | P2 / opsiyonel                         |
| Otel                     | ✅ `/hotel*` + Footer “Konaklama”      | ❌                          | **Kapsam dışı** — linkleri kaldır      |
| Tour operator sayfaları  | ✅                                     | ❌                          | P1 (partner vitrin)                    |

### Görevler (revize)

| #     | Görev                                                                                                       | Öncelik | Çıktı                                          |
| ----- | ----------------------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------- |
| 21.1  | ~~Otel listesi~~                                                                                            | —       | ❌ Kapsam dışı                                 |
| 21.2  | ~~Otel detay~~                                                                                              | —       | ❌ Kapsam dışı                                 |
| 21.3  | `(marketing)/activities/page.tsx` — Aktivite listesi (search + kategori)                                    | P0      | SSR; Nest `GET /catalog/experiences`           |
| 21.4  | `(marketing)/activities/[id]/page.tsx` — Aktivite detay + tarih seçimi                                      | P0      | SSR; dates + rezervasyon CTA                   |
| 21.5  | `(marketing)/routes/page.tsx` — Rota listesi + istatistik                                                   | P0      | SSR; Nest `GET /catalog/routes`                |
| 21.6  | `(marketing)/routes/[id]/page.tsx` — Rota detay + eşleşen turlar                                            | P0      | SSR; Nest `GET /catalog/routes/:id`            |
| 21.7  | `(marketing)/tours` parity — süre, featured, fiyat, puan, sıralama                                          | P0      | ✅ Nest search genişletildi                    |
| 21.8  | `(marketing)/destinations/[slug]` — ince SEO sayfası **veya** `/routes/[id]` alias                          | P1      | Rota ile çakışmasın                            |
| 21.9  | Kategori shortcut sayfaları (opsiyonel redirect) — `/gastronomi`, `/kultur-turlari`, `/macera-aktiviteleri` | P2      | Activities filtre query’sine yönlendir         |
| 21.10 | `(marketing)/about/page.tsx`                                                                                | P1      | Statik / CMS                                   |
| 21.11 | `(marketing)/contact/page.tsx`                                                                              | P1      | Form (+ notification/mail)                     |
| 21.12 | `(marketing)/blog/page.tsx` + `[slug]`                                                                      | P2      | ✅ Nest content + SEO seed                     |
| 21.13 | `(marketing)/campaigns` / `careers`                                                                         | P2      | Legacy parity; düşük öncelik                   |
| 21.14 | `(customer)/profile/page.tsx` — bilgi + TC + fatura + şifre + yorumlar                                      | P0      | Protected; Nest identity + review/me           |
| 21.15 | `(customer)/bookings` — **tur + aktivite** rezervasyon görüntüleme                                          | P0      | Tip ayırımı; **otel UI yok**                   |
| 21.16 | `(customer)/checkout` — **tur + aktivite** ödeme                                                            | P0      | `tourDateId` \| `activityDateId`; **otel yok** |
| 21.17 | ~~Hotel bileşenleri~~                                                                                       | —       | ❌ Kapsam dışı                                 |
| 21.18 | Aktivite bileşenleri (`ActivityCard`, filters, date picker)                                                 | P0      | `components/features/activity/`                |
| 21.19 | Rota bileşenleri (`RouteCard`, route filters)                                                               | P0      | `components/features/route/`                   |
| 21.20 | Services: `activity.service.ts`, `route.service.ts`, `content.service.ts` (+ mevcut `catalog` tur)          | P0      | Nest API client; **hotel.service yok**         |
| 21.21 | Nav/Footer temizliği — “Konaklama”/hotel link kaldır; Rotalar + Aktiviteler ekle                            | P0      | Header/Footer parity                           |
| 21.22 | Responsive — yeni sayfalar mobile-first                                                                     | P0      | 375px                                          |
| 21.23 | SEO metadata — marketing sayfaları title/description/OG                                                     | P0      | Lighthouse SEO > 90                            |

### Definition of Done

- [x] Aktivite arama + detay SSR çalışıyor
- [x] Rota listesi + detay SSR çalışıyor; ana keşif rotaya bağlanıyor
- [x] Tur listesi legacy filtre seviyesine yakın
- [x] Profil güncellenebiliyor
- [x] Checkout tur **ve** aktivite için çalışıyor (otel yok)
- [x] Header/Footer’da otel/konaklama linki yok (Turlar + Aktiviteler + Rotalar)
- [ ] Mobilde düzgün; Lighthouse SEO > 90

---

## Sprint 22 — Frontend Partner + Admin Panelleri

**Hedef:** Partner ve Admin panelleri tam fonksiyonel; **legacy `partner-dashboard` detay ve UX parity** (form alanları, tarih/pickup/yaş aralığı, financials, users, settings).  
**Kural:** Sade stub ile yetinilmez. `TourForm` / `ExperienceForm` / date modal / pickup / age-range seviyesi korunur; tasarım mevcut ink/turta diline uyarlanır ama özellik kaybı olmaz.

### Görevler

| #     | Görev                                                                     | Öncelik | Çıktı                       |
| ----- | ------------------------------------------------------------------------- | ------- | --------------------------- |
| 22.1  | `(partner)/experiences/page.tsx` — Deneyim listesi                        | P0      | Tablo + filtre              |
| 22.2  | `(partner)/experiences/create/page.tsx` — Deneyim oluşturma formu         | P0      | Form + resim upload         |
| 22.3  | `(partner)/experiences/[id]/edit/page.tsx` — Deneyim düzenleme            | P0      | Edit form                   |
| 22.4  | `(partner)/financials/page.tsx` — Gelir grafikleri (Recharts)             | P1      | Aylık/haftalık grafikler    |
| 22.5  | `(partner)/users/page.tsx` — Alt kullanıcı (SubUser) yönetimi             | P1      | CRUD + izin toggle          |
| 22.6  | `(partner)/settings/page.tsx` — Partner profil ayarları                   | P1      | Logo, bilgi güncelleme      |
| 22.7  | `(partner)/tours/[id]/edit/page.tsx` geliştir — konaklama, pickup point   | P0      | Ek form alanları            |
| 22.8  | `(partner)/tours/create/page.tsx` geliştir — tarih + yaş aralığı yönetimi | P0      | AgeRange CRUD               |
| 22.9  | `(admin)/agencies/page.tsx` — Acente listesi + onaylama                   | P1      | Tablo + approve/reject      |
| 22.10 | `(admin)/statistics/page.tsx` — Detaylı platform istatistikleri           | P1      | Grafikler + KPI kartları    |
| 22.11 | `(admin)/content/page.tsx` — Blog yazısı yönetimi                         | P2      | Post CRUD                   |
| 22.12 | `(admin)/tours/page.tsx` geliştir — deneyim/aktivite onaylama             | P1      | Tab: Turlar + Deneyimler    |
| 22.13 | Image upload bileşeni — partner tur/deneyim görselleri                    | P0      | Drag-drop, presigned URL    |
| 22.14 | Partner notification bell — WebSocket veya polling                        | P1      | Header'da bildirim dropdown |
| 22.15 | Responsive kontrol — partner/admin paneller tablet uyumlu                 | P1      | Sidebar collapse            |

### Definition of Done

- [x] Partner deneyim oluşturup yönetebiliyor (resim dahil)
- [x] Partner gelir grafiklerini görebiliyor
- [x] Partner alt kullanıcı ekleyip izin verebiliyor
- [x] Admin acenteleri onaylayabiliyor
- [x] Admin blog yazısı ekleyebiliyor
- [x] Bildirim sistemi çalışıyor (en az polling)

---

## Sprint 23 — UI Parity Kapısı + Legacy Kaldırma + Entegrasyonlar

**Hedef:** `apps/web` + Nest tek başına çalışıyor; legacy kök silinmiş; gerçek entegrasyonlar aktif.  
**Evrensel kural (hard):** Nest’e geçerken **asla sadeleştirme / yeniden tasarım yok**.  
Kaynak: `.cursor/rules/ui-parity-no-simplify.mdc`

| Katman                       | Sorumluluk                                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Tasarım / UX / layout**    | Legacy (`app/(dashboard)`, `app/(partner-dashboard)`, `app/(admin-dashboard)`, `app/components`, …) — birebir port |
| **Plan / veri / iş mantığı** | NestJS (`apps/api`) + `apps/web` data wiring                                                                       |
| **Silme**                    | Yalnızca side-by-side parity onayından **sonra**                                                                   |

### Yasaklar (sprint boyunca)

- Stub sayfa, “cleaner UI”, bölüm/filtre/kart/hero kaldırma
- Layout yapısını ürün onayı olmadan değiştirme
- Parity tamamlanmadan `app/` veya kök legacy ağaçlarını silme
- Eksik Nest endpoint yüzünden UI’ı silme — UI kalır, data bağlanır / loading-empty korunur

### Faz A — Parity kapısı (silmeden önce, P0)

| #     | Görev                                                                                                                                 | Öncelik | Çıktı                                                                                                |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| 23.0a | Marketing + customer parity checklist — ana sayfa, tur listesi/detay, aktivite, rota, blog, checkout, profil, bookings                | P0      | ✅ audit; campaigns/careers port; checkout/profile PARTIAL — bkz. `docs/SPRINT_23_PHASE_A_PARITY.md` |
| 23.0b | Auth parity — login/register/forgot + partner login/register/verification                                                             | P0      | ✅ forgot + partner auth UI port + Nest wire                                                         |
| 23.0c | Partner panel parity — dashboard, tours CRUD, dates/pickup/age-range, experiences, reservations, financials, users, settings, reviews | P0      | 🟡 audit: core güçlü, bazı sayfalar ince                                                             |
| 23.0d | Admin panel parity — users, tours/approvals, agencies, content, statistics, settings                                                  | P0      | 🔴 STUB/MISSING — Faz B bloker                                                                       |
| 23.0e | Ortak bileşen parity — Header/Footer, booking bar, kartlar, filtreler, empty states                                                   | P0      | ✅ Footer restore; Header hotel temizliği kalan                                                      |
| 23.0f | Parity sign-off dokümanı — eksik ekran listesi kapatılmış veya bilinen istisna ürün onayıyla işaretlenmiş                             | P0      | 🔴 BLOKE — `docs/SPRINT_23_PHASE_A_PARITY.md`                                                        |

### Faz B — Legacy kaldırma (parity sign-off sonrası)

| #     | Görev                                                                                | Öncelik | Çıktı                                    |
| ----- | ------------------------------------------------------------------------------------ | ------- | ---------------------------------------- |
| 23.1  | `app/api/*` — legacy API route’larını sil                                            | P0      | Veri sadece Nest; UI `apps/web`          |
| 23.2  | `app/(dashboard)/*` — eski müşteri sayfalarını sil                                   | P0      | Karşılık `apps/web` + Nest data          |
| 23.3  | `app/(admin-dashboard)/*` — eski admin panelini sil                                  | P0      | Karşılık `apps/web` admin + Nest         |
| 23.4  | `app/(partner-dashboard)/*` — eski partner panelini sil                              | P0      | Karşılık `apps/web` partner + Nest       |
| 23.5  | `app/(auth)/*`, `app/(partners-auth)/*` — eski auth sayfalarını sil                  | P0      | Karşılık `apps/web` auth                 |
| 23.6  | `app/components/*`, `app/lib/*`, `app/providers/*`, `app/utils/*`, `app/types/*` sil | P0      | Port edilmiş kopyalar `apps/web/src/`’de |
| 23.7  | Root `prisma/` klasörünü sil (43 migration dahil)                                    | P0      | Tek prisma: `apps/api/prisma/`           |
| 23.8  | Root `lib/` klasörünü sil                                                            | P0      | İş mantığı NestJS’te                     |
| 23.9  | Root `middleware.ts` sil                                                             | P0      | Nest guards + `apps/web` middleware      |
| 23.10 | Root `components/`, `hooks/`, `types/` sil                                           | P0      | `apps/web/src/` altında                  |
| 23.11 | Root `package.json` temizle — legacy deps (NextAuth, root Prisma, vb.)               | P0      | Temiz bağımlılıklar                      |
| 23.12 | Root `next.config.js`, `app/page.tsx`, `app/layout.tsx` sil                          | P0      | Kök Next.js yok                          |
| 23.13 | `pnpm dev` → `pnpm dev:apps` yönlendir                                               | P0      | Tek çalıştırma komutu                    |

### Faz C — Entegrasyonlar + kalite

| #     | Görev                                                        | Öncelik | Çıktı                                           |
| ----- | ------------------------------------------------------------ | ------- | ----------------------------------------------- |
| 23.14 | İyzico 3D Secure (mock → sandbox/production path)            | P0      | Test kartı ile ödeme; checkout UI legacy parity |
| 23.15 | WebSocket gateway — realtime bildirim (Socket.io)            | P1      | Anlık notification; bell UI parity              |
| 23.16 | CDN — Cloudflare (statik + görseller)                        | P1      | `media.turladur.com`                            |
| 23.17 | E2E genişlet — kayıt → booking → ödeme + kritik parity smoke | P0      | Playwright suite geçiyor                        |
| 23.18 | Lint + build — `pnpm build:apps` hatasız                     | P0      | CI-ready                                        |

### Definition of Done

- [ ] Faz A parity checklist’leri tamam (veya ürün onaylı istisna listesi mevcut)
- [ ] Silinen her legacy ekranın `apps/web` karşılığı var; stub / sadeleştirilmiş UI yok
- [ ] `app/` klasöründe legacy kod kalmamış (çalışan UI yalnızca `apps/web/`)
- [ ] Root `prisma/`, `lib/`, `middleware.ts` yok
- [ ] `pnpm dev:apps` tek komutla sistem ayağa kalkıyor
- [ ] İyzico test kartıyla ödeme yapılabiliyor
- [ ] E2E testler geçiyor
- [ ] `pnpm build:apps` hatasız

---

## Sprint 24 — Production Deploy + Soft Launch

**Hedef:** Platform canlıda. Beta kullanıcılar kullanmaya başlamış. Monitoring aktif.

### Görevler

| #     | Görev                                                       | Öncelik | Çıktı                        |
| ----- | ----------------------------------------------------------- | ------- | ---------------------------- |
| 24.1  | Vercel production deploy — `apps/web` (root dir: apps/web)  | P0      | `turladur.com` çalışıyor     |
| 24.2  | Railway production deploy — `apps/api`                      | P0      | `api.turladur.com` çalışıyor |
| 24.3  | Neon — production branch oluştur + pooler aktif             | P0      | Production DB hazır          |
| 24.4  | Migration deploy: `prisma migrate deploy` (production)      | P0      | Tablolar production'da       |
| 24.5  | Redis — Upstash veya Railway Redis (production)             | P0      | Cache + queue çalışıyor      |
| 24.6  | Cloudflare DNS — domain yönlendirme + SSL                   | P0      | HTTPS aktif                  |
| 24.7  | MinIO → S3/R2 geçişi (production object storage)            | P0      | Görseller CDN'den sunuluyor  |
| 24.8  | Sentry — web + api error tracking aktif                     | P0      | Hata alerting                |
| 24.9  | Environment variables — tüm production env'ler set          | P0      | Hiçbir secret eksik değil    |
| 24.10 | Health check monitoring — UptimeRobot veya Betterstack      | P1      | Downtime alert               |
| 24.11 | Performance audit — Lighthouse (Performance > 85, SEO > 90) | P0      | Metrikleri geç               |
| 24.12 | Security audit — OWASP top 10 kontrol                       | P0      | Kritik açık yok              |
| 24.13 | Rate limiting production ayarları                           | P0      | Brute force koruması aktif   |
| 24.14 | Seed data temizleme — demo/test verisi kaldır               | P1      | Production-ready DB          |
| 24.15 | README + ONBOARDING güncelle (yeni mimari için)             | P1      | Yeni dev 30dk'da başlar      |
| 24.16 | Beta kullanıcılara davet gönder                             | P0      | İlk gerçek kullanıcılar      |
| 24.17 | Hotfix workflow test — hata bulunca hızlı fix + deploy      | P1      | Süreç doğrulanmış            |
| 24.18 | Backup stratejisi — Neon otomatik backup doğrula            | P1      | Veri kaybı riski sıfır       |

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

| #     | Test             | URL/Komut                             | Beklenen Sonuç                                        |
| ----- | ---------------- | ------------------------------------- | ----------------------------------------------------- |
| T19.1 | API Health Check | `http://localhost:4000/api/v1/health` | `{ status: 'ok', database: 'up' }`                    |
| T19.2 | Swagger açılıyor | `http://localhost:4000/api/docs`      | Swagger UI yükleniyor, tüm endpoint'ler listeleniyor  |
| T19.3 | Prisma Studio    | `npx prisma studio` (apps/api)        | Tüm tablolar görünüyor (Hotel, Room, Experience, vb.) |

### Sprint 20 Sonrası (API Modülleri)

| #     | Test                 | URL/Komut                                   | Beklenen Sonuç              |
| ----- | -------------------- | ------------------------------------------- | --------------------------- |
| T20.1 | Tur arama            | `GET /api/v1/catalog/tours/search?page=1`   | 200 + tur listesi           |
| T20.2 | Aktivite arama       | `GET /api/v1/catalog/experiences?page=1`    | 200 + aktivite listesi      |
| T20.3 | Rota listesi         | `GET /api/v1/catalog/routes`                | 200 + curated rotalar       |
| T20.4 | Partner login        | `POST /api/v1/identity/login`               | JWT token dönüyor           |
| T20.5 | Tur oluşturma (auth) | `POST /api/v1/catalog/tours` (Bearer token) | 201 + tur oluştu            |
| T20.6 | SubUser listesi      | `GET /api/v1/identity/partners/:id/users`   | 200 + kullanıcı listesi     |
| T20.7 | Blog post            | `GET /api/v1/content/posts`                 | 200 + post listesi          |
| T20.8 | Swagger              | `http://localhost:4000/api/docs`            | Yeni endpoint’ler görünüyor |

### Sprint 21 Sonrası (Frontend Marketing + Customer)

| #      | Test                    | URL/Komut                               | Beklenen Sonuç               |
| ------ | ----------------------- | --------------------------------------- | ---------------------------- |
| T21.1  | Ana sayfa               | `http://localhost:3001`                 | Hero; tur/rota CTA; otel yok |
| T21.2  | Tur listesi             | `http://localhost:3001/tours`           | Arama + filtre               |
| T21.3  | Aktivite listesi        | `http://localhost:3001/activities`      | Kartlar + kategori           |
| T21.4  | Aktivite detay          | `http://localhost:3001/activities/[id]` | Tarih seçimi + fiyat         |
| T21.5  | Rota listesi            | `http://localhost:3001/routes`          | Rota kartları + stats        |
| T21.6  | Rota detay              | `http://localhost:3001/routes/[id]`     | Eşleşen turlar               |
| T21.7  | Login                   | `http://localhost:3001/login`           | Form çalışıyor               |
| T21.8  | Profil                  | `http://localhost:3001/profile` (auth)  | Bilgi görünüyor              |
| T21.9  | Checkout (tur/aktivite) | `http://localhost:3001/checkout`        | Ürün tipine göre form        |
| T21.10 | Mobil                   | Viewport 375px                          | Hamburger + stack            |
| T21.11 | SEO                     | Page source                             | title, description, OG       |
| T21.12 | Otel yok                | `/hotels`, Footer Konaklama             | 404 veya link yok            |

### Sprint 22 Sonrası (Partner + Admin)

| #      | Test               | URL/Komut                                           | Beklenen Sonuç                             |
| ------ | ------------------ | --------------------------------------------------- | ------------------------------------------ |
| T22.1  | Partner login      | `http://localhost:3001/login` → partner credentials | Dashboard'a yönlendirme                    |
| T22.2  | Partner dashboard  | `http://localhost:3001/partner/dashboard`           | İstatistik kartları görünüyor              |
| T22.3  | Tur oluşturma      | `http://localhost:3001/partner/tours/create`        | Form + resim upload çalışıyor              |
| T22.4  | Deneyim oluşturma  | `http://localhost:3001/partner/experiences/create`  | Form + tarih ekleme çalışıyor              |
| T22.5  | Rezervasyonlar     | `http://localhost:3001/partner/reservations`        | Liste görünüyor, status değiştirilebiliyor |
| T22.6  | Alt kullanıcılar   | `http://localhost:3001/partner/users`               | SubUser listesi + ekleme                   |
| T22.7  | Admin login        | `http://localhost:3001/login` → admin credentials   | Admin dashboard'a yönlendirme              |
| T22.8  | Admin kullanıcılar | `http://localhost:3001/admin/users`                 | Kullanıcı tablosu                          |
| T22.9  | Admin tur onaylama | `http://localhost:3001/admin/tours`                 | Pending turlar, onay butonu                |
| T22.10 | Bildirim dropdown  | Header'daki bell icon tıkla                         | Bildirim listesi açılıyor                  |

### Sprint 23 Sonrası (Parity + Legacy Kaldırma + Entegrasyonlar)

| #     | Test               | URL/Komut                             | Beklenen Sonuç                                   |
| ----- | ------------------ | ------------------------------------- | ------------------------------------------------ |
| T23.0 | Parity spot-check  | Legacy (silmeden önce) vs `apps/web`  | Aynı section hierarchy; stub yok                 |
| T23.1 | Legacy port kapalı | `http://localhost:3000`               | Bağlantı reddedildi (legacy yok)                 |
| T23.2 | Yeni sistem        | `http://localhost:3001`               | Ana sayfa + tur/aktivite/rota legacy seviyesinde |
| T23.3 | API                | `http://localhost:4000/api/v1/health` | `{ status: 'ok' }`                               |
| T23.4 | Partner/admin      | `/partner/*`, `/admin/*`              | Form/alan kaybı yok; Nest data                   |
| T23.5 | Booking akışı      | Tur seç → checkout → ödeme            | İyzico açılır; UI parity                         |
| T23.6 | Email              | Booking sonrası                       | Mailhog'da email                                 |
| T23.7 | Build              | `pnpm build:apps`                     | Exit code 0                                      |
| T23.8 | E2E                | `pnpm test:e2e`                       | Suite geçiyor                                    |

### Sprint 24 Sonrası (Production)

| #     | Test                | URL/Komut                                | Beklenen Sonuç                       |
| ----- | ------------------- | ---------------------------------------- | ------------------------------------ |
| T24.1 | Production web      | `https://turladur.com`                   | Ana sayfa yükleniyor, SSL aktif      |
| T24.2 | Production API      | `https://api.turladur.com/api/v1/health` | `{ status: 'ok' }`                   |
| T24.3 | Kayıt akışı         | Register → email doğrulama → login       | Hesap oluşuyor                       |
| T24.4 | Tur arama + booking | Ara → seç → checkout → ödeme             | Rezervasyon onaylanıyor              |
| T24.5 | Partner kayıt       | Partner register → doğrulama → login     | Partner paneline erişim              |
| T24.6 | Lighthouse audit    | Chrome DevTools → Lighthouse             | P > 85, SEO > 90, A11y > 85          |
| T24.7 | Mobil test          | iPhone viewport                          | Tüm akışlar çalışıyor                |
| T24.8 | Error tracking      | Sentry dashboard                         | Entegrasyon aktif, event'ler geliyor |

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
Sprint 23: UI Parity kapısı → Legacy kaldırma + Entegrasyonlar (parity yoksa silme yok)
    ↓
Sprint 24: Production Deploy + Soft Launch (her şey hazır → canlıya al)
```

---

## Risk Matrisi

| Risk                                                   | Olasılık | Etki   | Mitigasyon                                                                           |
| ------------------------------------------------------ | -------- | ------ | ------------------------------------------------------------------------------------ |
| DB migration sırasında veri kaybı                      | Düşük    | Kritik | Migration öncesi Neon snapshot, staging'de test                                      |
| Legacy kaldırma sonrası regresyon / sadeleştirilmiş UI | Orta     | Yüksek | Faz A parity kapısı zorunlu; silmeden önce side-by-side; E2E + ui-parity-no-simplify |
| İyzico production entegrasyonu gecikmesi               | Orta     | Yüksek | Sprint 23'te erken başla, sandbox ile paralel                                        |
| Vercel/Railway deploy sorunları                        | Düşük    | Orta   | Staging deploy ile önceden test                                                      |
| Performance sorunları (yavaş API)                      | Orta     | Orta   | Redis cache tüm search'lerde, DB index review                                        |

---

## Sprint Sonunda Metrikler (Sprint 24 Tamamlandığında)

| Metrik                   | Hedef   |
| ------------------------ | ------- |
| API Response Time (p95)  | < 200ms |
| Frontend LCP             | < 2.5s  |
| Frontend FID             | < 100ms |
| API Uptime               | > 99.5% |
| Test Coverage (BE)       | > 80%   |
| Test Coverage (FE)       | > 70%   |
| Lighthouse Performance   | > 85    |
| Lighthouse SEO           | > 90    |
| Lighthouse Accessibility | > 85    |
| Zero Critical Bugs       | Evet    |
| E2E Test Pass Rate       | 100%    |
| Toplam Sayfa Sayısı      | 40+     |
| Toplam API Endpoint      | 70+     |
| Legacy Kod               | 0 satır |
