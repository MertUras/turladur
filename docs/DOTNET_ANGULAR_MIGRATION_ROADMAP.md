# .NET Core + Angular Migrasyon Yol Haritası

> **Karar:** Backend Next.js API Routes → **.NET Core (Modüler Monolit + CQRS/MediatR)**, Frontend Next.js/React → **Angular**.
> **Database:** Neon PostgreSQL **değişmiyor** — EF Core (Npgsql) ile devam.
> **Strateji:** Big-bang rewrite değil, **Strangler Fig** — Next.js canlı kalırken modül modül .NET+Angular'a geçiş.

---

## 0. Mevcut Durum (Day 0 — göç öncesi envanter)

| Alan          | Rakam / Detay                                                                                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend       | Next.js 15 App Router, `app/api/**/route.ts` — **57 route dosyası**                                                                                                                   |
| Database      | PostgreSQL (Neon'a taşınıyor) + Prisma 6.x — **22 model**, **43 migration**                                                                                                           |
| Auth          | NextAuth (credentials provider, kullanıcı) + ayrı JWT akışı (`partner-credentials`, partner login)                                                                                    |
| Yetkilendirme | `middleware.ts` — rol bazlı (`USER`, `TOUR_OPERATOR`, `EXPERIENCE_PROVIDER`, admin) + `SubUser` bazlı granüler izinler (tours, reservations, customers, reports, users)               |
| Dosya yükleme | `app/api/upload/route.ts` — **yerel disk** (`public/uploads/`), 8MB limit, JPEG/PNG/WEBP/GIF                                                                                          |
| Chat widget   | `app/api/chat/route.ts` — dış AI servisi yok, kural/anahtar-kelime tabanlı basit motor                                                                                                |
| Frontend      | React 19 + TypeScript, react-hook-form + zod, MUI/Radix/Tailwind, 5 route grubu: `(dashboard)` (public site), `(admin-dashboard)`, `(partner-dashboard)`, `(auth)`, `(partners-auth)` |
| Hosting       | Vercel (Next.js) + Neon Postgres (Frankfurt/eu-central-1)                                                                                                                             |
| Ekip          | 3 kişi (Neon runbook'taki Dev A/B/C rol dağılımı)                                                                                                                                     |

**Gerçekçi beklenti:** 22 model, çoklu rol/izin sistemi, çok-yaşlı fiyatlandırma (age-range pricing), çok adımlı checkout gibi karmaşık iş mantığı var. 3 kişilik ekiple **tam parity ~5-7 ay**; ekip büyütülürse (5 kişi) **~3-4 ay**. Bu süre boyunca Next.js'te sadece kritik bug-fix yapılmalı, büyük yeni özellik geliştirmesi dondurulmalı — aksi halde iki kod tabanı birbirinden uzaklaşır ve göç asla bitmez.

---

## Bounded Context / Modül Haritası

Mevcut 22 Prisma modelinden çıkarılan modül sınırları (.NET modüler monolitte klasör/namespace sınırı olacak):

| Modül                  | Modeller                                                                       | Öncelik                                            |
| ---------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------- |
| **Identity**           | `User`, `SubUser`                                                              | 1 — her şey buna bağımlı                           |
| **Catalog.Tours**      | `Tour`, `TourDate`, `TourDateAgeRange`, `TourPickupPoint`, `TourAccommodation` | 2                                                  |
| **Catalog.Activities** | `Experience`, `ActivityDate`, `ExperienceDateAgeRange`, `ExperienceOperator`   | 2                                                  |
| **Catalog.Hotels**     | `Hotel`, `Room`                                                                | 3                                                  |
| **Partners**           | `Agency`, `TourOperator`, `PartnerReview`                                      | 2                                                  |
| **Bookings**           | `Booking`                                                                      | 1 — en kritik, en çok CQRS'ten fayda görecek modül |
| **Reviews**            | `Review`, `ActivityReview`, `PartnerReview`                                    | 3                                                  |
| **Content**            | `Post`, `Category`, `Comment`                                                  | 4 — en düşük risk, en son taşınabilir              |

CQRS ayrımı özellikle **Bookings** ve **Catalog** modüllerinde değer üretir (yüksek okuma trafiği + tutarlılık gereken yazma işlemleri).

---

## Faz 0 — Temel Kararlar & İskelet (1-2 hafta)

- [ ] **Çözüm yapısı:** `TourTech.Api` (sunum) / `TourTech.Application` (CQRS — Command/Query + MediatR handler) / `TourTech.Domain` (entity/aggregate) / `TourTech.Infrastructure` (EF Core, Npgsql, depolama, e-posta)
- [ ] Her modül için `Modules/<ModuleName>/{Commands,Queries,Entities,EndpointsOrControllers}` klasör düzeni
- [ ] **EF Core şema göçü:** Neon `develop` branch'ine karşı reverse-engineer:
  ```bash
  dotnet ef dbcontext scaffold "Host=ep-xxxx.eu-central-1.aws.neon.tech;Database=neondb;Username=...;Password=...;SSL Mode=Require" \
    Npgsql.EntityFrameworkCore.PostgreSQL -o Models --context TourTechDbContext
  ```
  Bu, 43 migration'ı elle yeniden yazmak yerine mevcut şemayı otomatik C# entity'lerine çevirir; sonra modüllere göre refactor edilir.
- [ ] **Hosting kararı:** Azure App Service, bölge **Germany West Central** veya **West Europe** (Neon'un Frankfurt/eu-central-1'ine en yakın — düşük gecikme). Alternatif: Render/Fly.io (daha ucuz, Docker tabanlı) — Azure ile ölçme kararı Faz 0'da netleşmeli.
- [ ] **Angular kararı:** Güncel Angular (standalone components), state için Signals (basit) veya NgRx (karmaşık partner-dashboard formları için); UI kit — Angular Material veya mevcut Tailwind görsel dilini koruma kararı.
- [ ] **Auth kararı:** ASP.NET Core Identity + JWT Bearer. `partner-credentials` ayrı login akışı ve `SubUser` izin modeli, Authorization Policy + Claims olarak yeniden modellenecek.
- [ ] **CI/CD POC:** GitHub Actions → Azure App Service, "hello world" deploy ile pipeline doğrulaması.
- [ ] Ekip modül sınırları ve isimlendirme üzerinde hizalanır (bu doküman taslak, ekiple gözden geçirilmeli).

---

## Faz 1 — Backend Çekirdeği + Identity Modülü (3-4 hafta)

- [ ] `TourTechDbContext` kurulumu, Neon bağlantı stratejisi .NET tarafında da **direct (migration) / pooled (runtime)** ayrımıyla korunur
- [ ] Identity modülü: register, login, partner-login, partner-verification (resend/verify) — mevcut `app/api/auth/**` karşılığı
- [ ] JWT issuance + refresh stratejisi, rol claim'leri (`USER`, `TOUR_OPERATOR`, `EXPERIENCE_PROVIDER`, admin)
- [ ] `SubUser` izin modeli → Authorization Policy (`tours`, `reservations`, `customers`, `reports`, `users` bazlı)
- [ ] **Dosya yükleme — göç fırsatı:** Azure App Service'te dosya sistemi ephemeral'dır (`public/uploads/` yaklaşımı prod'da veri kaybına yol açar). Bu fazda **Azure Blob Storage**'a geçiş zorunlu — mevcut teknik borç aynı zamanda düzeltilir.
- [ ] xUnit ile Identity modülü entegrasyon testleri (Neon dev branch'e karşı)

---

## Faz 2 — Domain Modülleri Port (8-14 hafta, modül modül)

Sıra (kritiklik + karmaşıklığa göre):

1. **Catalog (Tours/Activities/Hotels)** — read-heavy, CQRS Query'lerle düşük riskli başlangıç
2. **Bookings/Checkout** — en karmaşık iş mantığı (çok-yaşlı fiyatlandırma, tarih/kapasite yönetimi), CQRS'in en çok değer ürettiği modül
3. **Partners** (partner dashboard verileri: financials, reports, customers)
4. **Reviews**
5. **Content/Blog**
6. **Chat** — dış servis bağımlılığı yok, kural tabanlı; en kolay/en düşük riskli 1:1 port

Her modül için checklist:

- [ ] Entity configuration + DbContext mapping
- [ ] Command/Query + Handler (MediatR)
- [ ] FluentValidation kuralları (mevcut zod şemalarının karşılığı)
- [ ] Controller veya Minimal API endpoint
- [ ] xUnit + entegrasyon testi (Neon dev/PR branch'e karşı)
- [ ] Next.js tarafındaki karşılığıyla davranış paritesi doğrulaması (aynı input → aynı output)

---

## Faz 3 — Angular Frontend (Faz 1-2 ile paralel, ~1-2 hafta gecikmeli başlar)

- [ ] Angular workspace kurulumu, routing yapısı mevcut route gruplarını yansıtır: public site, `(auth)`/`(partners-auth)`, `(partner-dashboard)`, `(admin-dashboard)`
- [ ] Sayfa göç sırası (riskten güvenliye → karmaşıktan basite değil, **trafikten aza**):
  1. Public site: ana sayfa, tur/aktivite/otel listeleme ve detay sayfaları
  2. Auth: login/register/partner-login
  3. Booking/Checkout: **en karmaşık form** — `react-hook-form` çok adımlı akış → Angular Reactive Forms + `FormArray` (çok yaşlı/çok kişi fiyatlandırma)
  4. Profile/Bookings (kullanıcı tarafı)
  5. Partner dashboard: deneyim/tur CRUD, tarih + yaş aralığı fiyatlama formu (mevcut `ExperienceForm.tsx` en karmaşık bileşenlerden biri)
  6. Admin dashboard (en son — düşük kullanıcı sayısı, düşük risk)
- [ ] JWT interceptor, route guard'lar (izin bazlı, `SubUser` modeliyle eşleşecek)
- [ ] Playwright/Cypress ile booking flow gibi kritik akışların e2e testi

---

## Faz 4 — Kademeli Cutover (4-8 hafta)

- [ ] **Strangler Fig routing:** path veya subdomain bazlı yönlendirme (örn. yeni Angular `app.tourtech.com`, eski Next.js geçiş süresince `tourtech.com`'da kalır) veya reverse proxy ile modül bazlı yönlendirme
- [ ] Aynı Neon veritabanı **her iki sistem tarafından da** kullanılır — dual-write riski yok, tek kaynak-of-truth korunur
- [ ] Her modül geçişinde: staging kabul testleri → prod yönlendirme → N gün gözlem → Next.js'teki eski route kaldırılır
- [ ] Büyük patlama (tüm sistemi bir günde değiştirme) **yapılmaz** — modül modül, geri alınabilir adımlarla ilerlenir

---

## Faz 5 — Next.js/Vercel'i Devreden Çıkarma

- [ ] Tüm modüllerde %100 parity + kabul testleri geçtiğinde Vercel deploy'u durdurulur, DNS tamamen Azure App Service + Angular'a yönlendirilir
- [ ] Monitoring: Application Insights, secrets → Azure Key Vault, alerting kurulumu
- [ ] Geçiş sonrası retrospektif — kalan teknik borç ve öğrenilen dersler kayda geçirilir

---

## Teknoloji Eşleme Tablosu

| Next.js/React tarafı                       | .NET Core / Angular karşılığı                                                           |
| ------------------------------------------ | --------------------------------------------------------------------------------------- |
| NextAuth (credentials + partner JWT)       | ASP.NET Core Identity + JWT Bearer                                                      |
| Prisma ORM + 43 migration                  | EF Core + Npgsql — `dotnet ef dbcontext scaffold` ile Neon'dan reverse-engineer         |
| `app/api/**/route.ts` (57 route)           | ASP.NET Core Controllers/Minimal API + MediatR Command/Query handler                    |
| zod validation                             | FluentValidation                                                                        |
| react-hook-form (çok adımlı booking formu) | Angular Reactive Forms + `FormArray`                                                    |
| `middleware.ts` (rol/izin route guard)     | ASP.NET Core Authorization Policy + Angular Route Guard                                 |
| Yerel disk upload (`public/uploads`)       | Azure Blob Storage (App Service dosya sistemi ephemeral olduğu için zorunlu değişiklik) |
| Kural bazlı chat (`app/api/chat`)          | Aynı mantığın 1:1 .NET portu — düşük risk                                               |
| Vercel                                     | Azure App Service (bölge: Germany West Central / West Europe)                           |
| Neon Postgres                              | **Değişmiyor** — Npgsql ile EF Core doğrudan bağlanır                                   |

---

## Riskler ve Azaltma

| Risk                                                                 | Etki                                                        | Azaltma                                                                            |
| -------------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Ekibin .NET/Angular deneyimi sınırlıysa                              | Timeline tahminleri gerçek dışı kalır                       | Faz 0'da 1 haftalık POC/eğitim sprintini plana ekle, süre tahminine dahil et       |
| İki kod tabanının paralel bakımı                                     | Next.js'te yeni feature + .NET'te göç aynı anda yürütülemez | Next.js'i "sadece kritik bug-fix" moduna al, göç bitene kadar büyük özellik dondur |
| EF Core ↔ Prisma şema farkları (enum, `cuid()` id, nullable alanlar) | Scaffold sonrası veri tipi uyumsuzlukları                   | Scaffold çıktısını manuel doğrula, her modülde entegrasyon testiyle kontrol et     |
| Dosya yükleme yerel diskte kalırsa                                   | Prod'da veri kaybı (App Service ephemeral fs)               | Faz 1'de Blob Storage'a geçişi zorunlu adım olarak planla                          |
| Modül modül değil, büyük patlama ile geçiş                           | Uzun süre "hiçbir şey canlı değil" riski, geri alma zor     | Strangler Fig — her modül ayrı ayrı, geri alınabilir şekilde devreye alınır        |

---

## Sprint 0 — Hemen Atılabilecek İlk Adımlar

- [ ] .NET SDK + Angular CLI kurulumu, boş çözüm/workspace iskeleti
- [ ] Neon dev branch'ine karşı `dotnet ef dbcontext scaffold` çalıştır, çıkan modelleri incele
- [ ] Azure App Service + GitHub Actions ile "hello world" deploy POC'u (Neon bölgesiyle hizalı bölgede)
- [ ] Identity modülü POC: register + login + JWT, Neon'a gerçek bağlantı
- [ ] Angular workspace + ilk sayfa (tur listesi) POC'u, .NET API'den veri çekerek render
- [ ] Bu dokümandaki modül sınırlarını ve önceliklerini ekiple gözden geçir, gerekirse yeniden sırala

**Sonraki adım:** Sprint 0 tamamlanınca Faz 1'e (Identity modülü + dosya depolama göçü) geçilir.
