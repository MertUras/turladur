# Faz 0 — Şema Kilidi

> **Durum:** TAMAMLANDI (2026-08-01)  
> **Kaynak:** `DATABASE_SCHEMA.md` · `DATABASE_FILL_STORIES.md` · `BACKEND_BUILD_ORDER.md`  
> **Sonraki:** Faz 1 local spike **yapıldı** → Neon develop onayı veya Faz 2

---

## 1. Amaç

Backend tablo şekillendirmesini hedef şemaya kilitlemek.  
Bu fazda **Prisma migrate yok**, **Neon yok**, **frontend/UI yok**.

---

## 2. Dokunulmazlar (ASLA)

| Alan                    | Kural                                                                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **UI / tasarım**        | Sayfa layout, stil, bileşen görünümü, CSS, hero, kartlar — **dokunulmaz**                                                          |
| **Fotoğraf / upload**   | `StorageService`, presigned upload, CDN URL akışı, `coverUrl` / `galleryUrls` / `images` yazma algoritması — **dokunulmaz**        |
| **Push**                | Kullanıcı demeden `git push` yok                                                                                                   |
| **Neon migrate**        | develop / staging / main — her seferinde **açık onay**                                                                             |
| **Frontend “düzeltme”** | API sözleşmesi değişince UI kırılırsa: **tasarımı değiştirmeden** sadece data wiring (sonra bulunur). Şimdilik frontend’e girilmez |

**İzinli:** `apps/api/prisma/*`, Nest modülleri, shared-types (backend sözleşmesi), seed, worker’lar.

---

## 3. Ortam matrisi

| Ortam                | DB                                   | Migrate politikası                                 |
| -------------------- | ------------------------------------ | -------------------------------------------------- |
| **Local**            | Docker PostgreSQL (`localhost:5433`) | Faz denemeleri burada; serbest (onaylı faz içinde) |
| **Neon develop**     | Paylaşılan dev                       | Local yeşil + **kullanıcı onayı** sonrası          |
| **Neon staging**     | QA / demo                            | Ayrı onay                                          |
| **Neon main (prod)** | Canlı                                | Ayrı onay; big-bang yasak                          |

**Strateji:** expand → data migrate → contract. Partner→Agency tek PR’da DROP edilmez.

---

## 4. Ürün kilitleri (şemayı bağlayan)

| #   | Kilit                                                                        |
| --- | ---------------------------------------------------------------------------- |
| 1   | Kod/DB’de **Partner kelimesi yok** → `Agency` / `AgencyStaff` / `agencyId`   |
| 2   | Legacy B2B `Agency` + `SubUser` → **DROP** (yeni Agency = tur satıcı tüzel)  |
| 3   | **Room yok** · Hotel satışı yok · fiyat/müsaitlik/hotel rezervasyonu yok     |
| 4   | Hotel = referans (`TourAccommodation.hotelId` + review)                      |
| 5   | Hold **10 dk** · Checkout OTP yok                                            |
| 6   | Giriş: AgencyStaff (sahip = `AGENCY_OWNER`); Agency satırında şifre yok      |
| 7   | Soft delete alanlarında **partial unique** (`WHERE deletedAt IS NULL`)       |
| 8   | Invoice: `buyerSnapshot` + `sellerSnapshot`                                  |
| 9   | Experience* bağımsız mağaza → MVP migrate/yeni iş yok; tur içi = `TourExtra` |
| 10  | Bozulursa eski modele sarma yok → hedef Agency mimarisine tamir              |

---

## 5. Hotel / Room kilidi (kesin)

| Nesne                              | Karar                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------ |
| `catalog.Room`                     | **DROP** — tablo, API, DTO, test, shared-type                            |
| `Reservation.roomId`               | **Kaldır**                                                               |
| `Hotel.rooms` relation             | **Kaldır**                                                               |
| Hotel fiyat / available / oda CRUD | **Yok**                                                                  |
| `TourAccommodation`                | Gün + `hotelId` (hedef); mevcut 1:1 özet alanlar Faz 2’de hedefe çekilir |
| `PartnerCapability.HOTELS`         | Hedefte yok; satıcı capabilities = `TOURS` (MVP)                         |

> Not: Socket.IO `userRoom()` gibi “room” kelimesi DB `Room` modeli değildir — dokunulmaz listede değil, karıştırılmaz.

---

## 6. Compatibility map — bugün → hedef

### 6.1 Enum / rol

| Bugün                                     | Hedef                           | Not                              |
| ----------------------------------------- | ------------------------------- | -------------------------------- |
| `UserRole.PARTNER`                        | —                               | Giriş `AgencyStaff`              |
| `UserRole.PARTNER_STAFF`                  | —                               | `AgencyStaffRole`                |
| `UserRole.ADMIN`                          | `PLATFORM_ADMIN`                |                                  |
| `UserRole.SUPER_ADMIN`                    | `PLATFORM_SUPER_ADMIN`          |                                  |
| `UserRole.CUSTOMER`                       | `CUSTOMER`                      | aynı                             |
| `PartnerStatus`                           | `AgencyStatus`                  | APPROVED→VERIFIED hizala         |
| `PartnerCapability`                       | `AgencyCapability`              | MVP: `TOURS` only                |
| `MembershipTier`                          | `SellerTier`                    | Agency üzerinde                  |
| `OtpPurpose.CHECKOUT`                     | **kaldır**                      | sadece REGISTER / PASSWORD_RESET |
| `ReviewTargetType.PARTNER`                | `AGENCY` (+ GUIDE, BUS_COMPANY) |                                  |
| `BookingStatus.PENDING`                   | yok                             | hold = `PENDING_PAYMENT`         |
| `ReservationPaymentStatus.PARTIALLY_PAID` | **kaldır**                      |                                  |
| `EXPIRED` (booking)                       | **ekle**                        | hold dolumu                      |

### 6.2 Identity tablolar

| Bugün                           | Hedef                                                      | Migrate notu                                                            |
| ------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------- |
| `Partner`                       | **`Agency`** (yeni şekil)                                  | Expand: yeni Agency; data: Partner satır→Agency; contract: Partner DROP |
| `Partner.taxNumber?`            | `Agency.taxNumber` **zorunlu**                             | Eksik VKN’ler PUBLISHED engeli; backfill gerekir                        |
| `Partner.contactEmail`          | `Agency.contactEmail` (bildirim; giriş değil)              | Partial unique                                                          |
| —                               | `Agency.legalTitle`, `address` zorunlu                     | e-fatura                                                                |
| —                               | `AgencyStaff`                                              | Her Agency + en az bir `AGENCY_OWNER`                                   |
| `SubUser`                       | **DROP** → `AgencyStaff`                                   | email/passwordHash staff’ta                                             |
| `User.partnerId`                | **DROP**                                                   |                                                                         |
| Legacy `Agency` (userId’li B2B) | **DROP**                                                   | İsim çakışması: önce rename/drop sırası planlanmalı                     |
| —                               | `Guide`, `BusCompany`, `Vehicle`                           | Faz 1                                                                   |
| —                               | `GuideAvailability`, `VehicleAvailability`                 | Faz 1                                                                   |
| —                               | `RefreshToken` (XOR aktör)                                 | Faz 1                                                                   |
| —                               | `AgencyBankInfo`, `IdempotencyKey`, `AuditLog`, `Favorite` | Faz 1–8                                                                 |
| —                               | `TursabVerificationLog`                                    | Faz 1 iskelet                                                           |

### 6.3 Catalog FK rename

| Bugün                                 | Hedef                                                                   |
| ------------------------------------- | ----------------------------------------------------------------------- |
| `Tour.partnerId`                      | `Tour.agencyId`                                                         |
| `Hotel.partnerId`                     | `Hotel.agencyId?` (opsiyonel; sahiplik ≠ satış)                         |
| `Experience.partnerId`                | MVP dokunma / faz 2; yeni iş yok                                        |
| `Room`                                | **DROP**                                                                |
| `TourAccommodation` (1:1 name/image…) | Hedef: N satır `dayNumber` + `hotelId`                                  |
| —                                     | `TourExtra`, `TourDepartureRule`, `BusSeatLayout`, `TourDateAssignment` |

### 6.4 Booking / payment / review

| Bugün                                       | Hedef                                                               |
| ------------------------------------------- | ------------------------------------------------------------------- |
| `Reservation.partnerId`                     | `agencyId` (zorunlu)                                                |
| `Reservation.roomId` / hotel satış alanları | kaldır / hotelId sadece tur bağlamında gerekirse gözden geçir       |
| —                                           | `holdExpiresAt`, `heldPartySize`, `boardingPickupPointId`           |
| —                                           | `ReservationGuest`, `ReservationExtra`, `Voucher`, `SeatAssignment` |
| —                                           | `Invoice` (buyer+seller snapshot)                                   |
| `Review.partnerId`                          | `agencyId`                                                          |
| `Review.partnerReply`                       | `agencyReply` (alan adı hedef: AgencyReply)                         |

### 6.5 Yeni schema’lar (sonraki fazlar)

`outbox` · `promotion` — Faz 6 / 8. Faz 1’de zorunlu değil.

---

## 7. Expand → contract (Partner → Agency) — zorunlu sıra

```
1. Local: hedef Agency + AgencyStaff tablolarını EKLE (Partner hâlâ durur)
2. Data migration: Partner → Agency; sahip User/SubUser → AgencyStaff OWNER
3. Dual-read/write veya adapter (API hâlâ ayakta; UI dokunulmaz)
4. FK’ler: partnerId kolonları yanına agencyId; backfill; sonra partnerId DROP
5. Partner / legacy Agency / SubUser DROP
6. Partial unique index’ler (raw SQL)
```

Neon adımları **ayrı onay**.

---

## 8. Faz 0 çıkış kriterleri (DoD)

- [x] Dokunulmazlar yazılı
- [x] Ortam / Neon politikası yazılı
- [x] Hotel/Room DROP kilidi yazılı
- [x] Partner→Agency compatibility map yazılı
- [x] Expand–contract sırası yazılı
- [x] Faz 1’e geçiş için onay noktası tanımlı

---

## 9. Faz 1’e geçiş (ONAY GEREKİR)

**Kapsam (local-only spike önerisi):**

1. Prisma identity: yeni `Agency` + `AgencyStaff` + enum’lar (Partner’ı henüz DROP etme)
2. Guide / BusCompany / Vehicle + Availability iskeleti
3. RefreshToken model
4. Partial unique SQL taslağı
5. Seed: PLATFORM_* + örnek Agency+OWNER
6. **Frontend / UI / storage: sıfır değişiklik**
7. **Neon: yok** (local yeşil olunca ayrıca sorulur)

**Başlatmak için kullanıcı cümlesi:** `Faz 1 local spike onay`

---

_Şema detayı:_ `DATABASE_SCHEMA.md` · _Hikâye:_ `DATABASE_FILL_STORIES.md`
