# turta — Mimari Borç Runbook (Cursor Agent)

Bu dosya Cursor’a yüklenerek **adım adım** uygulanır. Amaç: modüler monolit sınırlarını düzeltmek; mikroservis rewrite **yok**. tasarım ve global kurallar bozulmayacak !

**Repo:** `turladur` (turta)  
**Hedef mimari:** Nx + NestJS modular monolith (`apps/api`) + Next.js (`apps/web`) + `packages/shared-*`  
**Kaynak sözleşme:** `docs/ARCHITECTURE.md`, `.cursor/rules/architecture.mdc`

---

## Agent kuralları (her turda oku)

1. **Tek faz çalış.** Aşağıdaki fazlardan yalnızca birini seç; bitmeden sonrakine geçme.
2. **Önce doğrula, sonra kod yaz.** Her fazın “Başlamadan önce” checklist’ini tamamla.
3. **Küçük PR dilimi.** Faz içinde birden fazla bağımsız değişiklik varsa alt maddeleri ayrı commit/PR mantığında tut; tek turda her şeyi birleştirme.
4. **Davranış koru.** UI parity kuralına uy (`.cursor/rules/ui-parity-no-simplify.mdc`): sadeleştirme / yeniden tasarım yok.
5. **Yasaklar (asla yapma):**
   - Mikroservis / ayrı deployable servislere bölme (daf2026 kopyası)
   - Keycloak’ı “şimdi zorunlu” diye ekleme
   - Kafka / Elasticsearch / nginx’i local zorunluluk yapma
   - Tüm modüllere boş CQRS iskeleti ekleme
   - Cross-schema **okumaları** toptan yasaklama (booking→catalog read normal)
   - UI’yi basitleştirerek küçültme
6. **Faz bitişi:** “Bitiş kapısı” checklist’inin tamamı ✅ olmalı; özet mesajda ne değişti + nasıl test edildi yaz.
7. **İlerleme kaydı:** Bu dosyadaki ilgili `[ ]` kutularını `[x]` yap (aynı PR’da).

---

## Korunan sağlıklı parçalar (bozma)

- [x] `apps/api` + `apps/web` + `packages/shared-*` düzeni
- [x] Web’de Prisma yok
- [x] JWT + RolesGuard + StaffPermissionsGuard
- [x] Event örnekleri: payment→booking, review→catalog rating, catalog cancel→booking
- [x] `infrastructure/docker` (postgres, redis, minio, mailhog)
- [x] Evrim yolu: monolit → horizontal scale → sonra extract (şimdi extract yok)

---

## Genel ilerleme

| Faz | Konu                             | Durum |
| --- | -------------------------------- | ----- |
| 0   | Doc / reality sync               | [x]   |
| 1   | Orphan event envanteri           | [x]   |
| 2   | Payment refund → booking event   | [x]   |
| 3   | Partner booking sahipliği        | [x]   |
| 4   | Admin ↔ Content decoupling       | [x]   |
| 5   | Module boundary lint (CI)        | [x]   |
| 6   | Web HTTP tek giriş (api-client)  | [x]   |
| 7   | Fat UI split (parity koru)       | [x]   |
| 8   | Kritik unit test + CI genişletme | [x]   |

---

# FAZ 0 — Doküman / reality sync

**Amaç:** Keycloak / nginx / eslint-config iddialarını gerçekle hizala. Kod davranışı değişmez.

### Başlamadan önce

- [x] `docs/ARCHITECTURE.md` okundu
- [x] `.cursor/rules/architecture.mdc` okundu
- [x] `.cursor/rules/project-description.mdc` okundu
- [x] `infrastructure/` altında gerçekten ne var listelendi (`docker` var; `nginx` yok)
- [x] `packages/` altında `eslint-config` olmadığı doğrulandı
- [x] Auth’un JWT olduğu doğrulandı: `apps/api/src/core/auth/`

### Yapılacaklar

- [x] Rules/docs’ta “Keycloak + Passport” → **“JWT (Passport) — Keycloak ertelendi / plan”** olarak güncelle
- [x] `infrastructure/nginx` iddiasını kaldır veya “prod opsiyonel, repo’da yok” yaz
- [x] `packages/eslint-config` iddiasını kaldır (veya “henüz yok” de)
- [x] `docs/NEON_DAY1-2.md` içinde “compose yok” gibi stale ifadeleri düzelt — **dosya yok** (N/A); compose: `infrastructure/docker/docker-compose.yml`
- [x] `docs/ARCHITECTURE.md` içinde `repositories/` maddesini “hedef / ayrı PR, zorunlu değil” diye netleştir
- [x] CQRS’i “her domain zorunlu” gibi okunuyorsa “karmaşık yazma akışlarında opsiyonel” diye yumuşat

### Dokunulacak dosyalar (beklenen)

- `.cursor/rules/architecture.mdc`
- `.cursor/rules/project-description.mdc`
- `.cursor/rules/security.mdc` (Keycloak geçiyorsa)
- `.cursor/rules/development-workflow.mdc` (Keycloak compose/env temizliği)
- `docs/ARCHITECTURE.md`
- `docs/NEON_DAY1-2.md` (stale ise) — **yok**
- İlgili sprint planlarında Keycloak “şu an canlı” iddiası varsa dipnot

### Yapılmayacaklar

- [x] Keycloak servisi / compose ekleme
- [x] nginx klasörü uydurma
- [x] eslint-config paketini bu fazda oluşturma (Faz 5’e bırak)

### Bitiş kapısı

- [x] Repo’da “Keycloak zorunlu / şu an kullanılıyor” yanıltıcı cümle kalmadı (en azından alwaysApply rules + ARCHITECTURE)
- [x] `rg -i "keycloak|nginx|eslint-config" docs .cursor/rules` çıktısı gözden geçirildi; gerçek dışı zorunluluk yok
- [x] Uygulama kodu değişmedi (veya yalnızca yorum)
- [x] Bu dosyada Faz 0 satırı `[x]`

### Agent özet şablonu

```
Faz 0 tamam.
Değişen dosyalar: …
Doğrulama: Keycloak/nginx/eslint iddiaları hizalandı.
Sonraki: Faz 1
```

---

# FAZ 1 — Orphan domain event envanteri

**Amaç:** Emit edilen ama dinlenmeyen event’leri ya bağla ya kaldır/dokümante et.

**Durum:** [x] tamamlandı (2026-08-09)

### Başlamadan önce

- [x] Faz 0 tamam (veya kullanıcı “Faz 0’ı atla” dedi)
- [x] Tüm `eventEmitter.emit` / `EventEmitter2` kullanımları listelendi
- [x] Tüm `@OnEvent(...)` kullanımları listelendi

### Bilinen orphan adayları (doğrula)

- [x] `user.registered` → **Listener:** `DomainAuditListener` (welcome e-posta emit tarafında kalır)
- [x] `partner.registered` → **Listener:** `DomainAuditListener`
- [x] `partner.verified` → **Listener:** `DomainAuditListener` (partner-approved e-posta emit tarafında)
- [x] `booking.created` → **Bilinçli no-op** (audit zaten `reservation.service.emitCreated`; event gelecek consumer için tutuluyor)
- [x] `tour.created` → **Listener:** `DomainAuditListener`

### Event envanteri (EventEmitter2 domain)

| Event                                     | Publisher(s)     | Consumer(s)                  | Not                               |
| ----------------------------------------- | ---------------- | ---------------------------- | --------------------------------- |
| `payment.completed`                       | payment, partner | booking, notification        | OK                                |
| `payment.failed`                          | payment          | booking                      | OK                                |
| `payment.refunded`                        | payment          | notification, **booking**    | Faz 2: booking owns paymentStatus |
| `booking.cancelled`                       | booking, partner | notification                 | OK                                |
| `booking.completed`                       | booking, partner | notification                 | OK                                |
| `booking.confirmed`                       | reservation      | invoice, agency-earning      | OK                                |
| `booking.created`                         | reservation      | **none** (inline audit)      | Bilinçli no-op                    |
| `review.created`                          | review           | catalog rating, notification | OK                                |
| `review.updated` / `review.deleted`       | review           | catalog rating               | OK                                |
| `tour.cancelled` / `tour.dates.cancelled` | tour             | booking                      | OK                                |
| `tour.created`                            | tour             | DomainAuditListener          | Faz 1 bağlandı                    |
| `catalog.tour.search`                     | tour             | analytics                    | OK                                |
| `user.registered`                         | identity         | DomainAuditListener          | Welcome e-posta inline            |
| `partner.registered`                      | identity         | DomainAuditListener          | OK                                |
| `partner.verified`                        | admin            | DomainAuditListener          | Approved e-posta inline           |

**Hariç:** Socket.IO `notification.created` (`notification.gateway`) — realtime kanalı, domain EventEmitter2 değil.

### Yapılacaklar (her orphan için TEK karar)

Her event için aşağıdaki üçünden **biri**:

1. **Listener ekle** — gerçek ihtiyaç varsa (notification, analytics, audit)
2. **Emit kaldır** — ölü kod
3. **Bilinçli no-op** — kodda kısa yorum + bu runbook’ta “ertelendi: Sprint …” notu

- [x] Event envanter tablosu bu dosyaya eklendi
- [x] Orphan kalmadı **veya** her orphan “bilinçli no-op” olarak işaretli
- [x] Kod: `apps/api/src/core/audit/domain-audit.listener.ts` + `AuditModule` provider

### Doğrulama komutları

```bash
# Emit’ler
rg -n "emit\(|\.emit\(" apps/api/src

# Listener’lar
rg -n "@OnEvent" apps/api/src
```

### Bitiş kapısı

- [x] Her emit’in 0 (dokümante) veya ≥1 consumer’ı var
- [x] Mevcut çalışan akışlar bozulmadı (payment.completed, booking.cancelled, review.*, tour.cancelled, catalog.tour.search)
- [x] Bu dosyada Faz 1 `[x]`

### Agent özet

```
Faz 1 tamam.
+ DomainAuditListener (user/partner registered|verified, tour.created)
~ booking.created bilinçli no-op + yorum
~ Runbook envanter tablosu
Sonraki: Faz 2 (payment refund → booking event)
```

---

# FAZ 2 — Payment refund → booking event

**Amaç:** Refund sonrası `reservation.paymentStatus` yazımını booking listener’a taşı.

**Durum:** [x] tamamlandı (2026-08-09)

### Başlamadan önce

- [x] Faz 1 tamam (veya kullanıcı atladı)
- [x] `apps/api/src/modules/payment/services/payment.service.ts` içinde refund + `reservation.update` okundu
- [x] `apps/api/src/modules/booking/listeners/payment-events.listener.ts` okundu (completed/failed örneği)

### Yapılacaklar

- [x] Refund yolunda booking şemasına **doğrudan yazımı kaldır**
- [x] Mevcut `payment.refunded` event’e booking consumer bağlandı
- [x] Booking listener: `markPaymentRefunded` → `paymentStatus: REFUNDED` (status’a dokunulmaz — davranış korundu)
- [x] Notification `payment.refunded` dinlemeye devam (çift iş yok; ayrı sorumluluk)
- [x] Unit: `markPaymentRefunded` idempotent

### Doğrulama

- [x] `rg -n "paymentStatus|REFUNDED" apps/api/src/modules/payment` — reservation yazımı yok
- [x] `rg -n "payment\.refunded|REFUNDED" apps/api/src/modules/booking`
- [x] API build yeşil

### Yapılmayacaklar

- [x] İyzico akışını yeniden yazma
- [x] Partner refund UI değiştirme

### Bitiş kapısı

- [x] Refund status transition owning module = booking
- [x] Build yeşil
- [x] Bu dosyada Faz 2 `[x]`

### Agent özet

```
Faz 2 tamam.
- payment.service refund → reservation.update kaldırıldı
+ reservation.markPaymentRefunded + PaymentEventsListener.onPaymentRefunded
Sonraki: Faz 3 (partner booking sahipliği)
```

---

# FAZ 3 — Partner booking sahipliği (en kritik)

**Amaç:** `partner.service` rezervasyon status / kapasite / payment event’lerini booking domain’inden çalmayı bıraksın.

**Durum:** [x] tamamlandı (2026-08-09) — 3E god-file split ertelendi

### Başlamadan önce

- [x] Faz 2 tamam (önerilir; refund ile aynı aile)
- [x] `partner.service.ts` COMPLETED / CANCELLED / kapasite / `payment.completed` işaretlendi
- [x] `reservation.service.ts` ve booking listener’lar okundu
- [x] Partner panel `PATCH /partner/reservations/:id` UX aynı (davranış korundu)

### Alt dilimler

#### 3A — Envanter + sözleşme

| Partner eski yazım                                               | Hedef                                   |
| ---------------------------------------------------------------- | --------------------------------------- |
| reservation status COMPLETED + `booking.completed`               | `ReservationService.agencyUpdateStatus` |
| CANCELLED + tourDate/activityDate capacity + `booking.cancelled` | aynı                                    |
| CONFIRMED + PAID + `payment.completed` (manuel)                  | aynı                                    |
| metadata.seatNumbers                                             | `agencyUpdateSeatNumbers`               |
| Liste/rapor reservation **okuma**                                | Partner’da kaldı (izinli)               |

- [x] Envanter çıkarıldı
- [x] Sözleşme: Partner HTTP → `ReservationService` (BookingModule export); UI route değişmedi

#### 3B — Status geçişleri booking’e

- [x] COMPLETED / CANCELLED / CONFIRMED yazımı booking’e taşındı
- [x] Partner Prisma ile reservation **yazmıyor** (yalnızca re-read + toReservation)

#### 3C — Kapasite

- [x] Kapasite iadesi `restoreCapacity` (booking) üzerinden
- [x] Partner doğrudan kapasite yazmıyor

#### 3D — Sahte / çapraz payment emit

- [x] `payment.completed` emit’i booking `agencyUpdateStatus(CONFIRMED)` içinde
- [x] Partner event import’ları kaldırıldı

#### 3E — Service split

- [ ] Ertelendi (davranış kritik; god-file sonraki tur)

### Doğrulama senaryoları

- [x] Unit: agency COMPLETED / CANCELLED
- [x] `rg reservation\.(update|updateMany) apps/api/src/modules/partner` → 0
- [x] Customer `payment.completed` → booking listener yolu değişmedi
- [x] Build / jest yeşil

### Yapılmayacaklar

- [x] Partner UI redesign yok
- [x] Ayrı Nest app yok
- [x] Partner Prisma okumaları yasaklanmadı

### Bitiş kapısı

- [x] Booking yazma sahipliği partner’da değil
- [x] Kritik unit senaryolar geçti
- [x] Build yeşil
- [x] Bu dosyada Faz 3 `[x]`

### Not (Faz 5)

Partner → booking yazımları `agency.reservation.update` event ile; `ReservationService` cross-import yok. Boundary CI yeşil.

### Agent özet

```
Faz 3 tamam (3E hariç).
+ reservation.agencyUpdateStatus / agencyUpdateSeatNumbers
~ partner.updateReservation → booking delegate
- partner booking/payment event emit + capacity yazımı
Sonraki: Faz 4 (Admin ↔ Content)
```

---

# FAZ 4 — Admin ↔ Content decoupling

**Amaç:** Tek hard ihlali kaldır: Admin → `ContentService` import.

**Durum:** [x] tamamlandı (2026-08-09)

### Başlamadan önce

- [x] AdminService ContentService kullanımı listelendi (posts CRUD proxy)
- [x] AdminModule ContentModule import’u görüldü
- [x] Content PostController zaten admin rollerine sahip CRUD barındırıyordu; FE `/admin/content/posts` kullanıyordu

### Yapılacaklar

- [x] Content’te uygulama yüzeyi: `AdminContentController` (`/admin/content/*`) — ContentService dışarı export edilmiyor
- [x] AdminService / AdminController content metotları kaldırıldı
- [x] AdminModule → ContentModule import kaldırıldı
- [x] Content DTO import’ları admin’den kalktı (controller content içinde)

### Doğrulama

```bash
rg -n "ContentService|ContentModule" apps/api/src/modules/admin
```

- [x] Sonuç: service/module import yok
- [x] FE path aynı: `/admin/content/posts`
- [x] `tsc` build yeşil

### Bitiş kapısı

- [x] Cross-module `ContentService` import = 0
- [x] Bu dosyada Faz 4 `[x]`

### Agent özet

```
Faz 4 tamam.
+ content/controllers/admin-content.controller.ts
- admin content proxy + ContentModule import
~ ContentModule artık ContentService export etmiyor
Sonraki: Faz 5 (module boundary lint)
```

---

# FAZ 5 — Module boundary lint (CI)

**Amaç:** Ihlalin geri gelmesini engelle.

**Durum:** [x] tamamlandı (2026-08-09)

### Başlamadan önce

- [x] Faz 4 tamam
- [x] Kök `eslint.config.mjs` boş (minimal) — boundary için ayrı shell script tercih edildi

### Yapılacaklar

- [x] Kural: `modules/A` → `modules/B/services/**` yasak (`scripts/check-module-boundaries.sh`)
- [x] İzin: events / aynı-modül / tests hariç; DTO lint dışı (script yalnızca services/)
- [x] Partner → ReservationService köprüsü kaldırıldı → `agency.reservation.update` event + `AgencyReservationListener`
- [x] `pnpm check:module-boundaries` script
- [x] `.github/workflows/ci.yml` adımı
- [x] `docs/ARCHITECTURE.md` notu

### Doğrulama

- [x] Bilerek yanlış import → check fail (kanıtlandı, geri alındı)
- [x] Mevcut kod check’ten geçiyor
- [x] CI workflow güncel
- [x] `tsc` + reservation jest yeşil

### Yapılmayacaklar

- [x] Cross-schema Prisma okuma lint’i yok
- [x] Keycloak yok

### Bitiş kapısı

- [x] CI’da boundary adımı var
- [x] Bu dosyada Faz 5 `[x]`

### Agent özet

```
Faz 5 tamam.
+ scripts/check-module-boundaries.sh + CI + ARCHITECTURE notu
+ AgencyReservationListener (partner event → booking)
- PartnerModule BookingModule / ReservationService import
Sonraki: Faz 6 (web HTTP tek giriş)
```

---

# FAZ 6 — Web HTTP tek giriş

**Amaç:** Relative `/api/...` ve dağınık raw fetch’leri `api-client` / `services/` altına topla.

**Durum:** [x] tamamlandı (2026-08-09)

### Başlamadan önce

- [x] `api-client.ts` okundu (`signal` desteği eklendi)
- [x] Relative `fetch('/api...')` yoktu; hotspot = `getPublicApiBaseUrl` + raw fetch
- [x] Bypass noktaları listelendi

### Bilinen hotspots

- [x] `hero.tsx` — zaten service/yok (N/A)
- [x] `tours-page-client.tsx` → `searchToursByQueryString`
- [x] `tour-detail-client.tsx` → `tryGetTourDetailBundle` / age-ranges / search
- [x] `routes-page-client.tsx` / `route-detail-client.tsx` → `listRoutes` / `getRouteById`
- [x] `activities-page-client.tsx` / `activity-detail-client.tsx` → `searchExperiences` / `getExperienceById`
- [x] `hot-deals.tsx` → catalog/activity services
- [x] `contact-form.tsx` → `sendContactMessage`
- [x] `bottom-booking-bar.tsx` → `getTourDateAgeRanges`

### İstisna (bırakılabilir)

- [x] Presigned S3 upload fetch’leri dokunulmadı (`partner-tour-helpers`, `image-upload-field`)

### Yapılacaklar

- [x] Feature service fonksiyonları genişletildi (`catalog.ts`, `contact.ts`, `route.ts`, `activity.ts`)
- [x] Component’ler service/api-client çağırıyor
- [x] Hata formatı ApiError ile tutarlı
- [x] UI metni/layout değişmedi

### Doğrulama

- [x] Component’te `getPublicApiBaseUrl` yalnızca tour-detail hata mesajında (URL teşhisi)
- [x] `pnpm --filter web exec tsc --noEmit` yeşil

### Bitiş kapısı

- [x] Nest-bypass raw catalog/contact fetch kalmadı
- [x] Bu dosyada Faz 6 `[x]`

### Agent özet

```
Faz 6 tamam.
+ catalog/contact helpers + api-client signal
~ tours/routes/activities/hot-deals/contact/booking-bar → services
Sonraki: Faz 7 (fat UI split) veya Faz 8 (test/CI)
```

---

# FAZ 7 — Fat UI split (parity koru)

**Amaç:** Dev dosyaları parçala; görünen UI aynı kalsın.

**Durum:** [x] tamamlandı (2026-08-09) — 5/5 fat dosya split (parity)

### Başlamadan önce

- [x] `.cursor/rules/ui-parity-no-simplify.mdc` okundu
- [x] Hedef dosya seçildi (önerilen sıra aşağıda)
- [x] Ekranın mevcut section listesi not edildi (split öncesi checklist)

### Önerilen sıra (her dosya ayrı tur)

1. [x] `tour-form.tsx` (~3949 → ~1502 shell + `tour-form/*` steps)
2. [x] `tour-detail-client.tsx` (~2439 → ~765 shell + `tour-detail/*` sections)
3. [x] `tours-page-client.tsx` (~1808 → ~532 shell + `tours-page/*`)
4. [x] `activities-page-client.tsx` (~1407 → ~607 shell + `activities-page/*`)
5. [x] `checkout-client.tsx` (~1367 → ~630 shell + `checkout/*` steps)

### Her split turunda

- [x] Alt bileşenlere ayır
- [x] State/data context’te — UI parity bozulmadan
- [x] Görsel/hierarchy aynı (parity checklist)
- [x] “Temiz UI” / stil iyileştirmesi **yok**
- [x] `tsc` — ilgili path’ler hatasız

### Bitiş kapısı (dosya başına)

- [x] Ana dosya belirgin küçüldü
- [x] Side-by-side: section’lar kaybolmadı
- [x] Bu runbook’ta ilgili dosya `[x]`

### Faz 7 genel bitiş

- [x] En az `tour-form.tsx` tamamlandı (minimum bar)
- [x] Tüm önerilen fat dosyalar tamamlandı
- [x] Bu dosyada Faz 7 `[x]`

### Agent özet

```
Faz 7 tamam.
Son: checkout/{helpers,context,step-summary,guests,payment,confirm,sidebar}
~ checkout-client.tsx shell (~630)
Parity: UI/stil/akış değişmedi
```

---

# FAZ 8 — Kritik test + CI

**Amaç:** P0/P1 regresyon ağını kur.

**Durum:** [x] tamamlandı (2026-08-09)

### Başlamadan önce

- [x] Faz 2–4 tamam
- [x] Faz 5 boundary CI yeşil

### Yapılacaklar

- [x] Unit: `payment-events.listener.spec.ts` (refund → markPaymentRefunded)
- [x] Unit: `agency-reservation.listener.spec.ts` + `partner-booking-ownership.spec.ts` + agency CONFIRMED
- [x] Mevcut suite: 112 test yeşil
- [x] CI: `pnpm --filter api test -- --runInBand --forceExit` (+ boundary zaten var)
- [x] Playwright: lokal config var; CI’da zorunlu job **eklenmedi** (ortam/secrets yok — bilinçli skip)

### Yapılmayacaklar

- [x] Thin CQRS proxy test spam yok
- [x] %100 coverage yok

### Bitiş kapısı

- [x] Kritik unit’ler lokal geçiyor (112)
- [x] CI: unit + boundary + build
- [x] Bu dosyada Faz 8 `[x]`

### Agent özet

```
Faz 8 tamam.
+ payment/agency listener specs + partner ownership static test
+ CI api unit step + root test:api script
Playwright CI: ertelendi (ortam)
Sonraki: Faz 7 (fat UI split) isteğe bağlı
```

---

## Cross-schema yazım checklist (Faz 3–4 ile birlikte kullan)

Yeni kod için mini kural (code review):

- [ ] Modül kendi schema’sına yazıyor mu?
- [ ] Yabancı schema yazımı varsa: event/command ile owning modüle mi gidiyor?
- [ ] Admin/analytics **sadece okuma** mı? (yazma varsa gerekçeli + owning delege)

**Şimdilik OK (yasaklama):**

- booking’in catalog ürün/kapasite **okuması**
- admin/analytics agregasyon **okuması**

---

## Agent başlangıç prompt’u (kopyala-yapıştır)

```
docs/ARCHITECTURE_DEBT_RUNBOOK.md dosyasını oku.
Yalnızca bir sonraki tamamlanmamış FAZ’ı uygula.
Kurallar: tek faz, önce checklist, yasaklara uy, UI parity bozma, mikroservis yok.
Faz bitince runbook checklist’lerini [x] yap, bitiş kapısını doğrula, özet yaz, DUR.
Sonraki faza geçme — kullanıcı onaylasın.
```

İlk tur için:

```
docs/ARCHITECTURE_DEBT_RUNBOOK.md — FAZ 0’ı uygula. Başka faza geçme.
```

---

## Hızlı referans — kritik dosyalar

| Alan                     | Path                                                                |
| ------------------------ | ------------------------------------------------------------------- |
| Partner god service      | `apps/api/src/modules/partner/services/partner.service.ts`          |
| Reservation              | `apps/api/src/modules/booking/services/reservation.service.ts`      |
| Payment                  | `apps/api/src/modules/payment/services/payment.service.ts`          |
| Payment→booking listener | `apps/api/src/modules/booking/listeners/payment-events.listener.ts` |
| Admin service            | `apps/api/src/modules/admin/services/admin.service.ts`              |
| Web api-client           | `apps/web/src/services/api-client.ts`                               |
| CI                       | `.github/workflows/ci.yml`                                          |
| Architecture doc         | `docs/ARCHITECTURE.md`                                              |

---

## Değişiklik günlüğü (agent doldurur)

| Tarih      | Faz | Not                                                                                                    |
| ---------- | --- | ------------------------------------------------------------------------------------------------------ |
| 2026-08-09 | 0–6 | Doc sync, orphan events, refund→booking, partner ownership, admin/content, boundary CI, web api-client |
| 2026-08-09 | 8   | Kritik unit + CI jest; Playwright CI skip                                                              |
| 2026-08-09 | 7   | Fat UI split tamam: tour-form, tour-detail, tours-page, activities-page, checkout                      |
