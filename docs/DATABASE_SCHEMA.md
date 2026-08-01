# Veritabanı Şeması — Tablolar, PK, FK, İndeksler

> **Tek kaynak (yapı).** Hikâye → `DATABASE_FILL_STORIES.md` · Kurulum sırası → `BACKEND_BUILD_ORDER.md`

> **Tarih:** 2026-08-01  
> **DB:** PostgreSQL (Neon) · Prisma multi-schema  
> **Standart:** `id` = PK (cuid) · soft delete = `deletedAt` · domain’de mümkünse `createdBy` / `updatedBy` / `deletedBy`  
> **Soft delete + UNIQUE (kritik):** Giriş/kimlik alanlarında düz `UNIQUE` **yasak** (soft-delete sonrası aynı email/VKN/TCKN tekrar kayıt patlar). Prisma/Postgres’te **partial unique**: yalnızca `WHERE "deletedAt" IS NULL`. Detay → § Soft delete & partial unique.

### Schema’lar

`identity` · `catalog` · `booking` · `payment` · `review` · `notification` · `analytics` · `content` · `outbox` · `promotion`

### Ürün kuralları (şemayı bağlayan)

#### İş modeli — çok satıcılı pazar yeri (Trendyol benzeri)

Platform birden fazla **acenteyi** toplar. Her acente kendi turunu oluşturur ve **bizim kanalda** satar.

| İş dili              | Tablo (DB)          | Rol                                                                |
| -------------------- | ------------------- | ------------------------------------------------------------------ |
| **Acente** (tüzel)   | **`Agency`**        | Firma, VKN, unvan, adres; tur + ekstra; rehber/araç atar           |
| **Acente personeli** | **`AgencyStaff`**   | Giriş yapan gerçek kişi — sahip = **AGENCY_OWNER** (zorunlu satır) |
| Müşteri              | `User` CUSTOMER     | Tur + ekstralar                                                    |
| Platform             | `User` `PLATFORM_*` | Onay                                                               |
| **Rehber**           | `Guide` (TUREB)     | Takvim müsaitlik + atama kabul/red                                 |
| **Ulaşım firması**   | `BusCompany`        | Giriş; altında **`Vehicle`** + takvim                              |
| **Hotel**            | `Hotel`             | Satış yok — konaklama günü + review                                |

**İsim:** Kod/DB’de **`Agency` / `AgencyStaff`** — `Partner` kelimesi **YASAK**.  
**Eski B2B `Agency`+`SubUser` (Prisma legacy):** DROP — karışmaz; tek acente modeli bu.  
**Sahip girişi:** Agency satırında şifre yok; sahip mutlaka `AgencyStaff` + `AGENCY_OWNER`.

#### İsim standardı — “admin” tek başına YASAK

| Yazılacak                  | Anlam                                                                                                           | Nerede             |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------ |
| **`PLATFORM_ADMIN`**       | Turta operasyon (onay, içerik, destek) — kapsamlı ama sınırlanabilir                                            | `User.role`        |
| **`PLATFORM_SUPER_ADMIN`** | **Tüm sistemin sahibi** — her kapı, her tablo, her ayar, diğer `PLATFORM_ADMIN`’leri yönetir; üstünde kimse yok | `User.role`        |
| **`AGENCY_OWNER`**         | Acente sahibi — tam yetki; kayıtta zorunlu AgencyStaff satırı                                                   | `AgencyStaff.role` |
| **`AGENCY_ADMIN`**         | Acente yönetici (sahibin verdiği)                                                                               | `AgencyStaff.role` |
| **`AGENCY_STAFF`**         | Acente personel (sınırlı)                                                                                       | `AgencyStaff.role` |

**Hiyerarşi:**

```
PLATFORM_SUPER_ADMIN
    └── PLATFORM_ADMIN
            ├── Agency / AgencyStaff (OWNER|ADMIN|STAFF)
            ├── BusCompany → Vehicle · Guide
            └── User CUSTOMER
```

| #   | Kural                                                                                 |
| --- | ------------------------------------------------------------------------------------- |
| 0   | Aktörler: User · **Agency** + **AgencyStaff** · BusCompany+Vehicle · Guide            |
| 1   | Kapılar: `/giris` · `/acente/giris` · `/otobus` · `/rehber`                           |
| 2   | Giriş yalnızca AgencyStaff (sahip = OWNER satırı); çapraz e-posta yasak               |
| 3   | Checkout OTP yok · Hold **10 dk**                                                     |
| 4   | Agency: **VKN + unvan + adres zorunlu** — yoksa tur PUBLISHED olamaz                  |
| 5   | Room yok · Hotel satışı asla yok                                                      |
| 6   | TourExtra kişi bazlı quantity · boarding **tüm duraklardan zorunlu seçim** (1. dahil) |
| 7   | Ödeme SUCCESS → Invoice QUEUED (provider-agnostic)                                    |
| 8   | Guide TUREB alanları · GuideAvailability + VehicleAvailability (gün bazlı)            |
| 9   | TourDateAssignment kabul/red · Review→Outbox→TourMetrics                              |
| 10  | Kodda **Partner kelimesi yok** — Agency / agencyId                                    |
| 11  | Soft-delete alanlarında **partial unique** (`deletedAt IS NULL`)                      |
| 12  | Invoice: **buyerSnapshot + sellerSnapshot** (anlık mühür)                             |

### Soft delete & partial unique (Prisma / PostgreSQL)

Soft delete satırı silmez; düz `UNIQUE(email)` → aynı email ile yeniden kayıt **P2002**.

| Alan                      | Tablo              | Partial unique (aktif satırlar)                    |
| ------------------------- | ------------------ | -------------------------------------------------- |
| `email`                   | User               | `UNIQUE (email) WHERE deletedAt IS NULL`           |
| `taxNumber`               | Agency             | `UNIQUE (taxNumber) WHERE deletedAt IS NULL`       |
| `contactEmail`            | Agency, BusCompany | aynı                                               |
| `identityNumber`, `email` | Guide              | aynı                                               |
| `plateNumber`             | Vehicle            | aynı                                               |
| `(agencyId, email)`       | AgencyStaff        | `UNIQUE (agencyId, email) WHERE deletedAt IS NULL` |
| `tursabBelgeNo`           | Agency             | aynı (null’lar Postgres’te çoklu olabilir)         |

**Prisma:** `@@unique` + soft delete yetmez. Migrate’de `CREATE UNIQUE INDEX ... WHERE "deletedAt" IS NULL` (raw SQL) veya Prisma partial index desteği.  
**Uygulama:** Yeni kayıt / restore öncesi yalnızca `deletedAt IS NULL` satırlara bak.

### Silinen / legacy

| Nesne                                    | Durum                                        |
| ---------------------------------------- | -------------------------------------------- |
| `Partner` / `PartnerStaff` / `partnerId` | **RENAME → Agency / AgencyStaff / agencyId** |
| Eski B2B `Agency` + `SubUser` (Prisma)   | **DROP** — yeni Agency = tur satıcı acente   |
| `Room` / otel satışı                     | **DROP — asla**                              |
| `User.partnerId` / UserRole PARTNER*     | DROP                                         |
| `membershipTier`                         | SellerTier + AgencySellerMetrics             |

---

## 0. Enum’lar

| Enum                      | Schema       | Değerler                                                                                                                 |
| ------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| UserRole                  | identity     | CUSTOMER, PLATFORM_ADMIN, PLATFORM_SUPER_ADMIN                                                                           |
| AgencyStaffRole           | identity     | **AGENCY_OWNER**, **AGENCY_ADMIN**, **AGENCY_STAFF**                                                                     |
| AgencyStatus              | identity     | PENDING, VERIFIED, REJECTED, SUSPENDED                                                                                   |
| AgencyCapability          | identity     | **TOURS** (MVP). EXPERIENCES = sonra (bağımsız mağaza); şimdi tur içi ekstra = `TourExtra`                               |
| SellerTier                | identity     | BRONZE, SILVER, GOLD — e-ticaret satıcı seviyesi (eski MembershipTier)                                                   |
| BusCompanyStatus          | identity     | PENDING, VERIFIED, REJECTED, SUSPENDED                                                                                   |
| GuideStatus               | identity     | PENDING, VERIFIED, REJECTED, SUSPENDED                                                                                   |
| OtpPurpose                | identity     | REGISTER, PASSWORD_RESET                                                                                                 |
| TursabVerificationStatus  | identity     | NOT_SUBMITTED, PENDING, VERIFIED, MISMATCH, NOT_FOUND, SUSPENDED, ERROR                                                  |
| TourStatus                | catalog      | DRAFT, PENDING_REVIEW, PUBLISHED, ARCHIVED                                                                               |
| TourCategory              | catalog      | CULTURAL, ADVENTURE, GASTRONOMY, NATURE, CITY, BEACH                                                                     |
| AgePricingType            | catalog      | FREE, HALF, PERCENTAGE, FIXED                                                                                            |
| HotelType                 | catalog      | HOTEL, BOUTIQUE_HOTEL, RESORT, HOSTEL, APARTMENT, VILLA, GUESTHOUSE                                                      |
| ExperienceStatus          | catalog      | DRAFT, PENDING_REVIEW, PUBLISHED, ARCHIVED                                                                               |
| TagKind                   | catalog      | DESTINATION, TOUR_CATEGORY, THEME, GENERIC                                                                               |
| BookingStatus             | booking      | **PENDING_PAYMENT**, CONFIRMED, COMPLETED, CANCELLED, SUSPENDED, PAYMENT_FAILED, **EXPIRED** — düz PENDING yok           |
| ReservationPaymentStatus  | booking      | UNPAID, PAID, REFUNDED — PARTIALLY_PAID yok                                                                              |
| AssignmentStatus          | catalog      | PENDING, ACCEPTED, REJECTED — rehber/otobüs atama yanıtı                                                                 |
| InvoiceProvider           | payment      | MOCK, PARASUT, LOGO, UYUMSOFT, OTHER — provider-agnostic e-fatura                                                        |
| InvoiceStatus             | payment      | DRAFT, QUEUED, ISSUED, FAILED, CANCELLED                                                                                 |
| PaymentStatus             | payment      | PENDING, AWAITING_3DS, SUCCESS, FAILED, REFUNDED — **durum** (kart/havale değil)                                         |
| PaymentMethod             | payment      | CARD, BANK_TRANSFER, WALLET, OTHER — **nasıl ödendi** (havale/kart burada)                                               |
| PaymentProvider           | payment      | IYZICO, MOCK                                                                                                             |
| ReviewTargetType          | review       | TOUR, EXPERIENCE, HOTEL, AGENCY, GUIDE, BUS_COMPANY                                                                      |
| NotificationRecipientType | notification | USER, AGENCY, AGENCY_STAFF, BUS_COMPANY, GUIDE, PLATFORM                                                                 |
| OutboxStatus              | outbox       | PENDING, PROCESSING, PROCESSED, FAILED                                                                                   |
| PeriodType                | review       | WEEKLY, MONTHLY                                                                                                          |
| RefundStatus              | payment      | PENDING, SUCCESS, FAILED                                                                                                 |
| **BusLayoutKind**         | catalog      | **BUS_19_PLUS_1**, **BUS_31_PLUS_1**, **BUS_35_PLUS_1**, **BUS_46_PLUS_1**, **BUS_50_PLUS_1** — tur otobüsü standartları |

---

## 1. identity

### User

| Alan                                                                         | Tip       | Kısıt                                                                         |
| ---------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------- |
| **id**                                                                       | String    | **PK**                                                                        |
| email                                                                        | String    | **UNIQUE aktif** — partial: `WHERE deletedAt IS NULL`                         |
| passwordHash                                                                 | String    | NOT NULL                                                                      |
| firstName, lastName, phone                                                   | String?   |                                                                               |
| identityNumber, address                                                      | String?   |                                                                               |
| birthDate                                                                    | Date?     |                                                                               |
| billingLine1/2, billingCity, billingState, billingPostalCode, billingCountry | String?   |                                                                               |
| role                                                                         | UserRole  | default CUSTOMER · platform hesabı: `PLATFORM_ADMIN` / `PLATFORM_SUPER_ADMIN` |
| isActive                                                                     | Boolean   | default true                                                                  |
| permissions                                                                  | Json?     | (legacy; Agency staff değil)                                                  |
| createdAt, updatedAt                                                         | DateTime  |                                                                               |
| deletedAt                                                                    | DateTime? | soft delete — **müşteri kendi silebilir**; Agency/Bus/Guide self-delete yok   |

**Index:** `role`, `deletedAt`  
**FK yok** (Agency / BusCompany / Guide’a bağlı değil)  
**Silme:** CUSTOMER → self soft-delete OK. Acente hesabı silinmez (alacak/verecek); platform settlement sonrası.

---

### EmailOtp

| Alan       | Tip        | Kısıt     |
| ---------- | ---------- | --------- |
| **id**     | String     | **PK**    |
| email      | String     |           |
| purpose    | OtpPurpose |           |
| codeHash   | String     |           |
| attempts   | Int        | default 0 |
| expiresAt  | DateTime   |           |
| verifiedAt | DateTime?  |           |
| createdAt  | DateTime   |           |

**Index:** `(email, purpose)`, `expiresAt`  
**Not:** Soft delete yok (kısa ömürlü)

---

### Agency — tüzel acente (giriş YOK — sadece veri)

| Alan                                                   | Tip                      | Kısıt                                                          |
| ------------------------------------------------------ | ------------------------ | -------------------------------------------------------------- |
| **id**                                                 | String                   | **PK**                                                         |
| companyName                                            | String                   |                                                                |
| **taxNumber**                                          | String                   | **VKN — ZORUNLU**; **UNIQUE aktif** (`deletedAt IS NULL`)      |
| **legalTitle**                                         | String                   | **Unvan — ZORUNLU** (e-fatura)                                 |
| **address**                                            | String                   | **ZORUNLU** (e-fatura)                                         |
| city, country                                          | String                   |                                                                |
| contactEmail                                           | String                   | **UNIQUE aktif** (`deletedAt IS NULL`) — bildirim; giriş değil |
| contactPhone                                           | String?                  |                                                                |
| status                                                 | AgencyStatus             | default PENDING                                                |
| capabilities                                           | AgencyCapability[]       | default [TOURS]                                                |
| **sellerTier**                                         | SellerTier               | default BRONZE                                                 |
| **sellerScore**                                        | Decimal(5,2)?            |                                                                |
| **sellerTierCalculatedAt**                             | DateTime?                |                                                                |
| website, logo, license                                 | String?                  |                                                                |
| verifiedAt                                             | DateTime?                |                                                                |
| tursabBelgeNo                                          | String?                  | **UNIQUE**                                                     |
| tursabUnvan, tursabGroup, tursabCity                   | String?                  |                                                                |
| tursabVerificationStatus                               | TursabVerificationStatus | default NOT_SUBMITTED                                          |
| tursabVerifiedAt, tursabLastCheckedAt, tursabExpiresAt | DateTime?                |                                                                |
| tursabRawSnapshot                                      | Json?                    |                                                                |
| averageRating                                          | Decimal(3,2)             | default 0                                                      |
| reviewCount                                            | Int                      | default 0                                                      |
| createdAt, updatedAt                                   | DateTime                 |                                                                |
| deletedAt                                              | DateTime?                |                                                                |

**Index:** `status`, `taxNumber`, `sellerTier`, `deletedAt`  
**Kural:** `taxNumber` + `legalTitle` + `address` yoksa tur **PUBLISHED** olamaz.  
**Giriş:** Yok. Sahip = `AgencyStaff` role **AGENCY_OWNER**. Self-delete yok.

---

### AgencyStaff — giriş yapan gerçek kişi (sahip dahil)

| Alan                            | Tip             | Kısıt                                            |
| ------------------------------- | --------------- | ------------------------------------------------ |
| **id**                          | String          | **PK**                                           |
| **agencyId**                    | String          | **FK → Agency.id** CASCADE                       |
| name                            | String          |                                                  |
| email                           | String          |                                                  |
| passwordHash                    | String          | **giriş**                                        |
| role                            | AgencyStaffRole | **AGENCY_OWNER** \| AGENCY_ADMIN \| AGENCY_STAFF |
| permissions                     | Json            |                                                  |
| status                          | String          | default ACTIVE                                   |
| lastLoginAt                     | DateTime?       |                                                  |
| createdAt, updatedAt, deletedAt | DateTime        |                                                  |

**UNIQUE aktif:** `(agencyId, email) WHERE deletedAt IS NULL`  
**Kural:** Her Agency’de en az bir **AGENCY_OWNER**. Kayıt tx: Agency + OWNER staff.  
**RefreshToken:** yalnızca `agencyStaffId` (agencyId ile token yok).

| Rol              | Ne yapar              |
| ---------------- | --------------------- |
| **AGENCY_OWNER** | Sahip — tam yetki     |
| **AGENCY_ADMIN** | Yönetici              |
| **AGENCY_STAFF** | `permissions` sınırlı |

---

### AgencySellerMetrics (e-ticaret satıcı metrik penceresi)

| Alan                   | Tip           | Kısıt                           |
| ---------------------- | ------------- | ------------------------------- |
| **id**                 | String        | **PK**                          |
| **agencyId**           | String        | **FK → Agency.id**              |
| periodType             | PeriodType    | WEEKLY \| MONTHLY               |
| periodStart, periodEnd | Date          |                                 |
| completedOrderCount    | Int           | CONFIRMED/COMPLETED rezervasyon |
| cancelledOrderCount    | Int           |                                 |
| cancellationRate       | Decimal(5,2)  | %                               |
| gmvAmount              | Decimal(14,2) | dönem ciro (TRY)                |
| avgRating              | Decimal(3,2)? |                                 |
| reviewCount            | Int           |                                 |
| agencyReplyRate        | Decimal(5,2)? | yoruma yanıt %                  |
| refundRate             | Decimal(5,2)? | %                               |
| onTimeCompletionRate   | Decimal(5,2)? | opsiyonel                       |
| score                  | Decimal(5,2)  | 0–100 bileşik skor              |
| suggestedTier          | SellerTier    | bu pencerenin önerdiği seviye   |
| calculatedAt           | DateTime      |                                 |
| createdAt              | DateTime      |                                 |
| deletedAt              | DateTime?     |                                 |

**UNIQUE:** `(agencyId, periodType, periodStart)`  
**Index:** `(agencyId, periodType, periodStart)`, `score`  
**Job:** SellerTierRecalcJob — Reservation + Review + Refund → bu tablo → Agency.sellerScore / sellerTier güncelle

---

### BusCompany (otobüs firması — ayrı giriş)

| Alan                            | Tip              | Kısıt                                          |
| ------------------------------- | ---------------- | ---------------------------------------------- |
| **id**                          | String           | **PK**                                         |
| companyName                     | String           |                                                |
| taxNumber                       | String?          |                                                |
| contactEmail                    | String           | **UNIQUE aktif** (`deletedAt IS NULL`) — giriş |
| passwordHash                    | String           | NOT NULL                                       |
| contactPhone                    | String?          |                                                |
| status                          | BusCompanyStatus | default PENDING                                |
| address, city, country          | String?          |                                                |
| website, logo                   | String?          |                                                |
| licenseNumber                   | String?          | taşıma / yetki belgesi no                      |
| vehicleCount                    | Int?             | filo özeti (opsiyonel)                         |
| notes                           | Text?            | platform notu                                  |
| verifiedAt                      | DateTime?        |                                                |
| averageRating                   | Decimal(3,2)?    | default 0 — ileride ulaşım puanı               |
| reviewCount                     | Int              | default 0                                      |
| createdAt, updatedAt            | DateTime         |                                                |
| createdBy, updatedBy, deletedBy | String?          |                                                |
| deletedAt                       | DateTime?        |                                                |

**Index:** `status`, `deletedAt`  
**Giriş kapısı:** `/otobus/giris` — yalnızca `status=VERIFIED`  
**Çapraz mail:** User / Agency / Guide ile aynı e-posta yasak

---

### Guide — TUREB rehber (ayrı giriş)

| Alan                 | Tip           | Kısıt                                                      |
| -------------------- | ------------- | ---------------------------------------------------------- |
| **id**               | String        | **PK**                                                     |
| **identityNumber**   | String        | **TCKN — ZORUNLU**, **UNIQUE aktif** (`deletedAt IS NULL`) |
| firstName            | String        |                                                            |
| lastName             | String        |                                                            |
| email                | String        | **UNIQUE aktif** (`deletedAt IS NULL`) — giriş             |
| passwordHash         | String        | NOT NULL                                                   |
| phone                | String?       |                                                            |
| birthDate            | Date?         |                                                            |
| status               | GuideStatus   | default PENDING                                            |
| languages            | String[]      |                                                            |
| **oda**              | String?       | TUREB oda                                                  |
| **sicilNo**          | String?       | UNIQUE?                                                    |
| **ruhsatNo**         | String?       | UNIQUE?                                                    |
| **ruhsatExpiresAt**  | DateTime?     | geçerlilik                                                 |
| licenseNumber        | String?       | legacy alias / kokart                                      |
| bio                  | Text?         |                                                            |
| photoUrl             | String?       |                                                            |
| city                 | String?       |                                                            |
| verifiedAt           | DateTime?     |                                                            |
| averageRating        | Decimal(3,2)? | default 0                                                  |
| reviewCount          | Int           | default 0                                                  |
| createdAt, updatedAt | DateTime      |                                                            |
| deletedAt            | DateTime?     |                                                            |

**Index:** `status`, `city`, `sicilNo`, `deletedAt`  
**Müsaitlik:** `GuideAvailability` (gün). Atama: `TourDateAssignment`.

---

### Vehicle — firmanın aracı (kapasite N+1)

| Alan                            | Tip           | Kısıt                                  |
| ------------------------------- | ------------- | -------------------------------------- |
| **id**                          | String        | **PK**                                 |
| **busCompanyId**                | String        | **FK → BusCompany.id** CASCADE         |
| plateNumber                     | String        | **UNIQUE aktif** (`deletedAt IS NULL`) |
| modelYear                       | Int?          |                                        |
| **seatLayoutKind**              | BusLayoutKind | 19/31/35/46/50 +1                      |
| capacity                        | Int           | passengerSeats (kind ile uyumlu)       |
| isActive                        | Boolean       | default true                           |
| notes                           | Text?         |                                        |
| createdAt, updatedAt, deletedAt | DateTime      |                                        |

**Index:** `busCompanyId`, `seatLayoutKind`, `deletedAt`  
**Müsaitlik:** `VehicleAvailability` (gün). TourDate’e `vehicleId` atanabilir.

---

### TursabVerificationLog

| Alan            | Tip                       | Kısıt                                  |
| --------------- | ------------------------- | -------------------------------------- |
| **id**          | String                    | **PK**                                 |
| agencyId        | String                    | **FK → Agency.id**                     |
| belgeNo         | String(32)                |                                        |
| trigger         | String(40)                | REGISTER \| MANUAL \| CRON \| PLATFORM |
| success         | Boolean                   |                                        |
| statusResult    | TursabVerificationStatus? |                                        |
| httpStatus      | Int?                      |                                        |
| requestId       | String?                   |                                        |
| errorMessage    | Text?                     |                                        |
| responseSummary | Json?                     |                                        |
| createdAt       | DateTime                  |                                        |
| createdBy       | String?                   |                                        |

**Index:** `(agencyId, createdAt)`, `(belgeNo, createdAt)`, `(success, createdAt)`

---

### TursabRouteSubmission (faz 2)

| Alan                            | Tip        | Kısıt                   |
| ------------------------------- | ---------- | ----------------------- |
| **id**                          | String     | **PK**                  |
| **agencyId**                    | String     | **FK → Agency.id**      |
| tourId                          | String?    | **FK → Tour.id**        |
| tourDateId                      | String?    | **FK → TourDate.id**    |
| reservationId                   | String?    | **FK → Reservation.id** |
| externalId                      | String?    |                         |
| status                          | String(40) |                         |
| payload                         | Json       |                         |
| lastError                       | Text?      |                         |
| submittedAt                     | DateTime?  |                         |
| createdAt, updatedAt, deletedAt | DateTime   |                         |

**Index:** `(agencyId, status)`, `tourDateId`, `reservationId`

---

### RefreshToken

| Alan                   | Tip       | Kısıt                                                               |
| ---------------------- | --------- | ------------------------------------------------------------------- |
| **id**                 | String    | **PK**                                                              |
| userId                 | String?   | **FK → User.id** — müşteri / platform                               |
| agencyStaffId          | String?   | **FK → AgencyStaff.id** — OWNER/ADMIN/STAFF (tek acente giriş yolu) |
| busCompanyId           | String?   | **FK → BusCompany.id**                                              |
| guideId                | String?   | **FK → Guide.id**                                                   |
| tokenHash              | String    | **UNIQUE** — refresh token hash                                     |
| **familyId**           | String?   | rotasyon ailesi (reuse tespit)                                      |
| **expiresAt**          | DateTime  | **mutlak bitiş** (örn. Agency 7 gün, müşteri 30 gün — config)       |
| **idleTimeoutMinutes** | Int?      | boşta kalınca düşür (örn. Agency 120 dk); null = sadece expiresAt   |
| **lastUsedAt**         | DateTime? | her API / refresh’te güncellenir — idle hesabı                      |
| **revokedAt**          | DateTime? | **logout** veya güvenlik iptali                                     |
| **replacedById**       | String?   | **FK → RefreshToken.id** — yenilemede yeni satır                    |
| createdAt              | DateTime  |                                                                     |
| deletedAt              | DateTime? |                                                                     |

**Index:** `userId`, `agencyStaffId`, `busCompanyId`, `guideId`, `expiresAt`, `familyId`  
**Kural:** Tam **biri** dolu: userId XOR agencyStaffId XOR busCompanyId XOR guideId

**Oturum / logout / yenileme (kısa):**

| Olay           | Ne olur                                                                                   |
| -------------- | ----------------------------------------------------------------------------------------- |
| Giriş          | RefreshToken insert; access JWT kısa ömür (config, DB’de tutulmaz)                        |
| Token yenileme | Eski `revokedAt` + `replacedById`; yeni satır aynı `familyId`; `lastUsedAt` = now         |
| Logout         | `revokedAt` = now (tüm cihazlar için agencyId/userId ile toplu revoke opsiyonel)          |
| Idle timeout   | `now - lastUsedAt > idleTimeoutMinutes` → geçersiz (Agency sıkı; müşteri gevşek olabilir) |
| Süre dolumu    | `expiresAt < now` → yenileme yok, tekrar giriş                                            |

---

### Favorite

| Alan                 | Tip      | Kısıt                  |
| -------------------- | -------- | ---------------------- |
| **id**               | String   | **PK**                 |
| **userId**           | String   | **FK → User.id**       |
| tourId               | String?  | **FK → Tour.id**       |
| experienceId         | String?  | **FK → Experience.id** |
| createdAt, deletedAt | DateTime |                        |

**Kural:** tourId XOR experienceId (biri dolu)  
**UNIQUE:** `(userId, tourId)` tour doluyken; `(userId, experienceId)` experience doluyken  
**Index:** `userId`

---

### AgencyBankInfo

| Alan                            | Tip         | Kısıt                          |
| ------------------------------- | ----------- | ------------------------------ |
| **id**                          | String      | **PK**                         |
| **agencyId**                    | String      | **UNIQUE**, **FK → Agency.id** |
| iban                            | String(34)  |                                |
| accountName                     | String(200) |                                |
| bankName                        | String?     |                                |
| createdAt, updatedAt            | DateTime    |                                |
| createdBy, updatedBy, deletedBy | String?     |                                |
| deletedAt                       | DateTime?   |                                |

---

### IdempotencyKey

| Alan           | Tip         | Kısıt      |
| -------------- | ----------- | ---------- |
| **id**         | String      | **PK**     |
| key            | String(128) | **UNIQUE** |
| userId         | String?     |            |
| agencyId       | String?     |            |
| agencyStaffId  | String?     |            |
| method         | String(16)  |            |
| path           | String(256) |            |
| requestHash    | String?     |            |
| responseStatus | Int?        |            |
| responseBody   | Json?       |            |
| createdAt      | DateTime    |            |
| expiresAt      | DateTime    |            |
| deletedAt      | DateTime?   |            |

**Index:** `expiresAt`, `(userId, createdAt)`

---

### AuditLog

| Alan       | Tip        | Kısıt                                                                                        |
| ---------- | ---------- | -------------------------------------------------------------------------------------------- |
| **id**     | String     | **PK**                                                                                       |
| actorType  | String(40) | USER \| Agency \| AGENCY_STAFF \| AGENCY_ADMIN \| PLATFORM \| BUS_COMPANY \| GUIDE \| SYSTEM |
| actorId    | String?    |                                                                                              |
| action     | String(80) |                                                                                              |
| entityType | String(80) |                                                                                              |
| entityId   | String?    |                                                                                              |
| meta       | Json?      |                                                                                              |
| createdAt  | DateTime   |                                                                                              |

**Index:** `(entityType, entityId, createdAt)`, `(actorId, createdAt)`  
**Not:** Soft delete yok

---

## 2. catalog

### Tour

| Alan                            | Tip           | Kısıt                                                              |
| ------------------------------- | ------------- | ------------------------------------------------------------------ |
| **id**                          | String        | **PK**                                                             |
| title                           | String(200)   |                                                                    |
| slug                            | String(220)   | **UNIQUE**                                                         |
| description                     | Text          |                                                                    |
| coverUrl                        | String?       |                                                                    |
| galleryUrls                     | String[]      |                                                                    |
| extras                          | Json          |                                                                    |
| price                           | Decimal(10,2) |                                                                    |
| currency                        | String(3)     | default TRY                                                        |
| category                        | TourCategory  |                                                                    |
| status                          | TourStatus    | default DRAFT                                                      |
| durationDays                    | Int           | default 1                                                          |
| **childMaxAge**                 | Int?          | örn. 12 — bu yaşa kadar `isChild`; **acente tur bazında belirler** |
| **minParticipants**             | Int?          | az doluluk uyarısı / manuel iptal eşiği                            |
| featured                        | Boolean       |                                                                    |
| averageRating                   | Decimal(3,2)  | mirror (kaynak: TourMetrics)                                       |
| reviewCount                     | Int           |                                                                    |
| **version**                     | Int           | default 1 — optimistic lock                                        |
| **agencyId**                    | String        | **FK → Agency.id**                                                 |
| cancellationPolicyId            | String?       | **FK → CancellationPolicy.id**                                     |
| createdAt, updatedAt            | DateTime      |                                                                    |
| createdBy, updatedBy, deletedBy | String?       |                                                                    |
| deletedAt                       | DateTime?     |                                                                    |

**Index:** `agencyId`, `(category, status)`, `(featured, status)`, `slug`, `deletedAt`

---

### TourDepartureRule

| Alan                            | Tip       | Kısıt                    |
| ------------------------------- | --------- | ------------------------ |
| **id**                          | String    | **PK**                   |
| **tourId**                      | String    | **FK → Tour.id** CASCADE |
| rangeStart, rangeEnd            | Date      |                          |
| weekdays                        | Int[]     | ISO 1=Pzt … 7=Paz        |
| defaultCapacity                 | Int       |                          |
| defaultPriceOverride            | Decimal?  |                          |
| ageRangeTemplate                | Json?     |                          |
| isActive                        | Boolean   |                          |
| lastGeneratedAt                 | DateTime? |                          |
| createdAt, updatedAt            | DateTime  |                          |
| createdBy, updatedBy, deletedBy | String?   |                          |
| deletedAt                       | DateTime? |                          |

**Index:** `(tourId, isActive)`, `deletedAt`

---

### TourDate

| Alan                            | Tip      | Kısıt                                                                   |
| ------------------------------- | -------- | ----------------------------------------------------------------------- |
| **id**                          | String   | **PK**                                                                  |
| **tourId**                      | String   | **FK → Tour.id**                                                        |
| startDate, endDate              | Date     |                                                                         |
| capacity                        | Int      |                                                                         |
| remainingCapacity               | Int      |                                                                         |
| priceOverride                   | Decimal? |                                                                         |
| isActive                        | Boolean  |                                                                         |
| **version**                     | Int      | default 1                                                               |
| **departureRuleId**             | String?  | **FK → TourDepartureRule.id** SET NULL                                  |
| **busCompanyId**                | String?  | **FK → BusCompany.id** SET NULL — ACCEPTED mirror                       |
| **vehicleId**                   | String?  | **FK → Vehicle.id** SET NULL — atanan araç                              |
| **guideId**                     | String?  | **FK → Guide.id** SET NULL — ACCEPTED mirror                            |
| **busSeatLayoutId**             | String?  | **FK → BusSeatLayout.id** SET NULL — opsiyonel; Vehicle.kind ile uyumlu |
| createdAt, updatedAt, deletedAt | DateTime |                                                                         |

**UNIQUE:** `(tourId, startDate, endDate)`  
**Index:** `(tourId, startDate)`, `departureRuleId`, `busCompanyId`, `guideId`, `busSeatLayoutId`, `deletedAt`  
**Atama:** Acente teklif → `TourDateAssignment` PENDING → rehber/otobüs ACCEPTED/REJECTED → mirror id güncellenir.  
**Koltuk:** layout varsa capacity = passengerSeats; yoksa serbest kontenjan. Her yolcu koltuk (sigorta).

---

### TourDateAssignment — rehber / otobüs kabul-red (23-B)

| Alan                            | Tip              | Kısıt                             |
| ------------------------------- | ---------------- | --------------------------------- |
| **id**                          | String           | **PK**                            |
| **tourDateId**                  | String           | **FK → TourDate.id** CASCADE      |
| role                            | String(16)       | GUIDE \| BUS                      |
| **guideId**                     | String?          | **FK → Guide.id** — role=GUIDE    |
| **busCompanyId**                | String?          | **FK → BusCompany.id** — role=BUS |
| status                          | AssignmentStatus | default PENDING                   |
| invitedByAgencyId               | String           | **FK → Agency.id**                |
| invitedByAgencyStaffId          | String?          | **FK → AgencyStaff.id**           |
| respondedAt                     | DateTime?        |                                   |
| note                            | Text?            | red gerekçesi vb.                 |
| createdAt, updatedAt, deletedAt | DateTime         |                                   |

**UNIQUE aktif:** bir TourDate’te role başına en fazla bir PENDING|ACCEPTED  
**Index:** `(guideId, status)`, `(busCompanyId, status)`, `tourDateId`  
**Panel:** PENDING → kabul/red. ACCEPTED → TourDate.guideId / busCompanyId / vehicleId.

**İş mantığı — çok günlü müsaitlik (kritik):**  
`TourDate.startDate`…`endDate` (örn. 10–12 Eki). Assignment **ACCEPTED** olunca handler `GuideAvailability` / `VehicleAvailability` üzerinde **aralıktaki her takvim gününü** `isAvailable = false` yapar (yoksa satır insert + false). **REJECTED** / iptal / unassign → günleri tekrar açma politikası (genelde true’ya çek veya blokaj kaydını soft-delete). Aksi halde rehber ara günlerde ikinci tura atanabilir.

---

### GuideAvailability — müsait günler (ücret yok)

| Alan                            | Tip      | Kısıt                     |
| ------------------------------- | -------- | ------------------------- |
| **id**                          | String   | **PK**                    |
| **guideId**                     | String   | **FK → Guide.id** CASCADE |
| date                            | Date     |                           |
| isAvailable                     | Boolean  | default true              |
| createdAt, updatedAt, deletedAt | DateTime |                           |

**UNIQUE:** `(guideId, date)`  
**Index:** `(guideId, date, isAvailable)`  
**Not:** Günlük satır. Çok günlü turda blokaj → `TourDateAssignment` ACCEPTED iş mantığı (yukarı).

---

### VehicleAvailability — araç müsait günleri

| Alan                            | Tip      | Kısıt                       |
| ------------------------------- | -------- | --------------------------- |
| **id**                          | String   | **PK**                      |
| **vehicleId**                   | String   | **FK → Vehicle.id** CASCADE |
| date                            | Date     |                             |
| isAvailable                     | Boolean  | default true                |
| createdAt, updatedAt, deletedAt | DateTime |                             |

**UNIQUE:** `(vehicleId, date)`  
**Index:** `(vehicleId, date, isAvailable)`  
**Filtre:** Acente sadece o günde `isAvailable=true` araçları listeler. Çok günlü tur → Assignment ACCEPTED tüm günleri kapatır.

---

### BusSeatLayout — tur otobüsü planı (N+1 standart)

Türkiye tur otobüsü: **yolcu + 1** (şoför/mürettebat koltuğu satılmaz).

| Kind              | Yolcu (`passengerSeats`) | +1  | Fiziksel toplam | Tipik dizilim       |
| ----------------- | ------------------------ | --- | --------------- | ------------------- |
| **BUS_19_PLUS_1** | 19                       | 1   | 20              | 2+2 (küçük midibüs) |
| **BUS_31_PLUS_1** | 31                       | 1   | 32              | 2+2                 |
| **BUS_35_PLUS_1** | 35                       | 1   | 36              | 2+2                 |
| **BUS_46_PLUS_1** | 46                       | 1   | 47              | 2+2 (en yaygın tur) |
| **BUS_50_PLUS_1** | 50                       | 1   | 51              | 2+2                 |

| Alan                            | Tip           | Kısıt                                                                         |
| ------------------------------- | ------------- | ----------------------------------------------------------------------------- |
| **id**                          | String        | **PK**                                                                        |
| **kind**                        | BusLayoutKind | **UNIQUE** — platform seed’de her kind bir satır                              |
| **agencyId**                    | String?       | **FK → Agency.id** — null = **sistem şablonu**; dolu = acente kopyası (nadir) |
| name                            | String(120)   | örn. `46+1`                                                                   |
| **passengerSeats**              | Int           | 19 \| 31 \| 35 \| 46 \| 50 — **TourDate.capacity bununla eşit**               |
| **crewSeats**                   | Int           | default **1** (+1)                                                            |
| rows                            | Int           |                                                                               |
| cols                            | Int           | ızgara genişliği (koridor dahil; örn. 5 = L L                                 | R R) |
| **layoutJson**                  | Json          | UI’nin çizdiği harita (aşağı)                                                 |
| isSystem                        | Boolean       | default true — seed                                                           |
| createdAt, updatedAt, deletedAt | DateTime      |                                                                               |

**Index:** `kind`, `agencyId`, `deletedAt`  
**UNIQUE (sistem):** `kind` WHERE `isSystem = true` (5 seed). Acente kopyası varsa `(agencyId, kind)` unique — sistem satırında `agencyId` null.  
**Seed:** 5 sistem satırı. Acente TourDate’te **kind seçer** → sistem `busSeatLayoutId`; `capacity = passengerSeats`.

#### layoutJson sözleşmesi (UI + API)

```json
{
  "orientation": "front-top",
  "legend": ["FREE", "OCCUPIED", "SELECTED", "BLOCKED", "CREW"],
  "cells": [
    { "code": "CREW", "row": 0, "col": 2, "type": "CREW", "sellable": false },
    { "code": "1", "row": 1, "col": 0, "type": "SEAT", "sellable": true },
    { "code": "2", "row": 1, "col": 1, "type": "SEAT", "sellable": true },
    { "code": "AISLE", "row": 1, "col": 2, "type": "AISLE", "sellable": false },
    { "code": "3", "row": 1, "col": 3, "type": "SEAT", "sellable": true },
    { "code": "4", "row": 1, "col": 4, "type": "SEAT", "sellable": true }
  ]
}
```

| `type`           | Anlam               | UI                             |
| ---------------- | ------------------- | ------------------------------ |
| `SEAT`           | Yolcu koltuğu       | Tıklanır; doluysa isim/initial |
| `CREW`           | +1 şoför/mürettebat | Kilitli, farklı renk           |
| `AISLE`          | Koridor             | Boşluk                         |
| `WC` / `BLOCKED` | WC / satışa kapalı  | Disabled                       |

**Numaralama:** Tur otobüsünde pratik → **1…N** (soldan sağa, önden arkaya; koridor atlanır). `SeatAssignment.seatCode` = bu `code` (`"12"` gibi).

**TourDate kuralı:** `busSeatLayoutId` seçilince `capacity` ve `remainingCapacity` başlangıcı = `passengerSeats`. Kind dışı özel plan şimdilik yok.

---

### TourDateAgeRange

| Alan                            | Tip            | Kısıt                        |
| ------------------------------- | -------------- | ---------------------------- |
| **id**                          | String         | **PK**                       |
| **tourDateId**                  | String         | **FK → TourDate.id** CASCADE |
| minAge                          | Int            |                              |
| maxAge                          | Int?           |                              |
| pricingType                     | AgePricingType |                              |
| value                           | Decimal(10,2)  |                              |
| createdAt, updatedAt, deletedAt | DateTime       |                              |

**UNIQUE:** `(tourDateId, minAge, maxAge)`  
**Index:** `tourDateId`, `deletedAt`

---

### TourAccommodation — hangi gün nerede (satış değil)

Bir turda birden fazla gece / otel olabilir.

| Alan                            | Tip      | Kısıt                              |
| ------------------------------- | -------- | ---------------------------------- |
| **id**                          | String   | **PK**                             |
| **tourId**                      | String   | **FK → Tour.id** CASCADE           |
| **dayNumber**                   | Int      | 1…N — turun kaçıncı günü/gecesi    |
| **hotelId**                     | String   | **FK → Hotel.id** — konaklama yeri |
| nights                          | Int      | default 1                          |
| note                            | Text?    | oda tipi notu vb. (satış yok)      |
| sortOrder                       | Int      |                                    |
| createdAt, updatedAt, deletedAt | DateTime |                                    |

**UNIQUE:** `(tourId, dayNumber)`  
**Index:** `tourId`, `hotelId`  
**UI:** Tur detayında “Gün 1 → Hotel X”. **Review:** `accommodationRating` + isteğe `hotelId` (bu listedeki otellerden).

---

### TourPickupPoint

| Alan                            | Tip      | Kısıt                                                   |
| ------------------------------- | -------- | ------------------------------------------------------- |
| **id**                          | String   | **PK**                                                  |
| **tourId**                      | String   | **FK → Tour.id** CASCADE                                |
| city, location, time            | String   |                                                         |
| description                     | String?  |                                                         |
| **order**                       | Int      | 1…N sıra                                                |
| **isFixedOrigin**               | Boolean  | bilgilendirme (rota başı); boarding seçimini engellemez |
| isActive                        | Boolean  |                                                         |
| createdAt, updatedAt, deletedAt | DateTime |                                                         |

**Index:** `(tourId, order)`, `city`, `deletedAt`  
**Kural:** Checkout’ta yolcu **boardingPickupPointId’yi zorunlu ve açıkça seçer** — **1. durak dahil** tüm aktif duraklar listede; varsayılan atama yok.

---

### TourItineraryDay

| Alan                            | Tip         | Kısıt                    |
| ------------------------------- | ----------- | ------------------------ |
| **id**                          | String      | **PK**                   |
| **tourId**                      | String      | **FK → Tour.id** CASCADE |
| dayNumber                       | Int         |                          |
| title                           | String(200) |                          |
| description                     | Text        |                          |
| createdAt, updatedAt, deletedAt | DateTime    |                          |

**UNIQUE:** `(tourId, dayNumber)`

---

### TourInclude

| Alan       | Tip         | Kısıt                    |
| ---------- | ----------- | ------------------------ |
| **id**     | String      | **PK**                   |
| **tourId** | String      | **FK → Tour.id** CASCADE |
| text       | String(500) |                          |
| included   | Boolean     | true=dahil, false=hariç  |
| sortOrder  | Int         |                          |
| deletedAt  | DateTime?   |                          |

**Index:** `(tourId, included)`

---

### TourExtra — tur içi opsiyonel aktivite (MVP “Ekstralar”)

Bağımsız aktivite mağazası değil. Örn. Kapadokya turu → 2. gün balon.

| Alan                            | Tip           | Kısıt                          |
| ------------------------------- | ------------- | ------------------------------ |
| **id**                          | String        | **PK**                         |
| **tourId**                      | String        | **FK → Tour.id** CASCADE       |
| title                           | String(200)   | örn. “Sıcak hava balonu”       |
| description                     | Text?         |                                |
| **dayNumber**                   | Int?          | turun kaçıncı günü (opsiyonel) |
| price                           | Decimal(10,2) |                                |
| currency                        | String(3)     | default tur para birimi        |
| isActive                        | Boolean       | default true                   |
| sortOrder                       | Int           |                                |
| createdAt, updatedAt, deletedAt | DateTime      |                                |

**Index:** `(tourId, isActive)`, `sortOrder`  
**Kontenjan limiti yok (L-B)** — sadece fiyat. Checkout “Ekstralar” → ReservationExtra.

---

### CancellationPolicy

| Alan                            | Tip         | Kısıt  |
| ------------------------------- | ----------- | ------ |
| **id**                          | String      | **PK** |
| name                            | String(120) |        |
| description                     | Text        |        |
| rules                           | Json        |        |
| createdAt, updatedAt, deletedAt | DateTime    |        |

---

### Tag

| Alan                            | Tip         | Kısıt      |
| ------------------------------- | ----------- | ---------- |
| **id**                          | String      | **PK**     |
| name                            | String(120) |            |
| slug                            | String(140) | **UNIQUE** |
| kind                            | TagKind     |            |
| createdAt, updatedAt, deletedAt | DateTime    |            |

**Index:** `(kind, deletedAt)`, `deletedAt`

---

### TourTag (M:N)

| Alan       | Tip    | Kısıt                            |
| ---------- | ------ | -------------------------------- |
| **tourId** | String | **PK**, **FK → Tour.id** CASCADE |
| **tagId**  | String | **PK**, **FK → Tag.id** CASCADE  |

**Index:** `tagId`  
**Composite PK:** `(tourId, tagId)`

---

### Destination

| Alan                            | Tip         | Kısıt      |
| ------------------------------- | ----------- | ---------- |
| **id**                          | String      | **PK**     |
| name                            | String(160) |            |
| slug                            | String(180) | **UNIQUE** |
| description                     | Text?       |            |
| coverUrl                        | String?     |            |
| createdAt, updatedAt, deletedAt | DateTime    |            |

---

### TourDestination (M:N — destinasyon ↔ tur)

| Alan              | Tip    | Kısıt                                   |
| ----------------- | ------ | --------------------------------------- |
| **tourId**        | String | **PK**, **FK → Tour.id** CASCADE        |
| **destinationId** | String | **PK**, **FK → Destination.id** CASCADE |

**Index:** `destinationId`

---

### Route

| Alan                            | Tip         | Kısıt      |
| ------------------------------- | ----------- | ---------- |
| **id**                          | String      | **PK**     |
| title                           | String(200) |            |
| slug                            | String(220) | **UNIQUE** |
| description                     | Text?       |            |
| coverUrl                        | String?     |            |
| stops                           | Json        |            |
| createdAt, updatedAt, deletedAt | DateTime    |            |

---

### TourRoute (M:N — küratör rota ↔ tur, opsiyonel)

| Alan        | Tip    | Kısıt                             |
| ----------- | ------ | --------------------------------- |
| **tourId**  | String | **PK**, **FK → Tour.id** CASCADE  |
| **routeId** | String | **PK**, **FK → Route.id** CASCADE |
| sortOrder   | Int    | default 0                         |

**Index:** `routeId`

---

### Hotel — konaklama referansı (SATIŞ YOK)

| Alan                                                      | Tip           | Kısıt                                                                   |
| --------------------------------------------------------- | ------------- | ----------------------------------------------------------------------- |
| **id**                                                    | String        | **PK**                                                                  |
| name                                                      | String(200)   |                                                                         |
| slug                                                      | String(220)   | **UNIQUE**                                                              |
| description                                               | Text?         |                                                                         |
| address, city, country, postalCode, phone, email, website | String?       |                                                                         |
| stars                                                     | Int?          |                                                                         |
| type                                                      | HotelType     |                                                                         |
| amenities, images                                         | Json          |                                                                         |
| latitude, longitude                                       | Float?        |                                                                         |
| checkInTime, checkOutTime                                 | String?       |                                                                         |
| **agencyId**                                              | String?       | **FK → Agency.id** — kaydı ekleyen acente (opsiyonel); sahiplik ≠ satış |
| averageRating                                             | Decimal(3,2)? | review mirror (opsiyonel)                                               |
| reviewCount                                               | Int           | default 0                                                               |
| createdAt, updatedAt, deletedAt                           | DateTime      |                                                                         |

**Index:** `agencyId`, `city`, `type`, `deletedAt`  
**ASLA:** Room, fiyat, müsaitlik, hotel rezervasyonu.  
**Kullanım:** `TourAccommodation.hotelId` (hangi gün nerede) + `Review.hotelId` / accommodationRating.

---

### Experience · ActivityDate · ExperienceDepartureRule · ExperienceDateAgeRange

**MVP’de KAPALI** — sitede bağımsız aktivite satışı yok.  
Tur içi opsiyoneller → **`TourExtra`** + **`ReservationExtra`**.  
Experience / ActivityDate tabloları **faz 2** (ayrı mağaza); MVP migrate’e alınmaz.

---

## 3. booking

### Reservation

| Alan                            | Tip                      | Kısıt                                                                 |
| ------------------------------- | ------------------------ | --------------------------------------------------------------------- |
| **id**                          | String                   | **PK**                                                                |
| bookingNumber                   | String(20)               | **UNIQUE**                                                            |
| **userId**                      | String                   | **FK → User.id**                                                      |
| tourId                          | String?                  | **FK → Tour.id** — MVP’de dolu                                        |
| **tourDateId**                  | String?                  | **FK → TourDate.id** — MVP’de dolu                                    |
| experienceId                    | String?                  | **FK** — MVP kullanılmaz (faz 2)                                      |
| activityDateId                  | String?                  | **FK** — MVP kullanılmaz (faz 2)                                      |
| **agencyId**                    | String                   | **FK → Agency.id** — satan acente                                     |
| status                          | BookingStatus            | hold = **PENDING_PAYMENT**                                            |
| paymentStatus                   | ReservationPaymentStatus | UNPAID \| PAID \| REFUNDED (kısmi yok)                                |
| paymentMethod                   | PaymentMethod?           | MVP: **CARD**                                                         |
| currency                        | String(3)                | TRY \| EUR \| USD…                                                    |
| adults, children                | Int                      | herkes koltuk/kontenjan (sigorta)                                     |
| totalAmount                     | Decimal(10,2)            | tur + **ReservationExtra** toplamı                                    |
| **boardingPickupPointId**       | String                   | **FK → TourPickupPoint.id** — **zorunlu** açık seçim (1. durak dahil) |
| contactEmail                    | String                   |                                                                       |
| contactPhone                    | String?                  |                                                                       |
| guests                          | Json?                    | legacy; tercih ReservationGuest                                       |
| specialRequests                 | Text?                    |                                                                       |
| metadata                        | Json?                    |                                                                       |
| startDate, endDate              | DateTime?                |                                                                       |
| **holdExpiresAt**               | DateTime?                | **10 dk** hold                                                        |
| **heldPartySize**               | Int?                     | iade miktarı                                                          |
| cancelledAt                     | DateTime?                |                                                                       |
| createdAt, updatedAt            | DateTime                 |                                                                       |
| createdBy, updatedBy, deletedBy | String?                  |                                                                       |
| deletedAt                       | DateTime?                |                                                                       |

**Index:** `userId`, `tourId`, `tourDateId`, `agencyId`, `status`, `(agencyId, status, createdAt)`, **`(status, holdExpiresAt)`**, `deletedAt`  
**Yok:** roomId · bağımsız aktivite satışı · PARTIALLY_PAID  
**Ek:** ReservationGuest · ReservationExtra · Voucher · SeatAssignment (ödeme sonrası / kalkış öncesi acente)

---

### ReservationGuest

| Alan              | Tip         | Kısıt                                 |
| ----------------- | ----------- | ------------------------------------- |
| **id**            | String      | **PK**                                |
| **reservationId** | String      | **FK → Reservation.id** CASCADE       |
| fullName          | String(200) |                                       |
| identityNumber    | String      | **zorunlu** — T.C. / kimlik (sigorta) |
| birthDate         | Date?       |                                       |
| isChild           | Boolean     |                                       |
| sortOrder         | Int         |                                       |
| deletedAt         | DateTime?   |                                       |

**Index:** `reservationId`

---

### ReservationExtra — rezervasyona eklenen tur ekstra

| Alan                 | Tip           | Kısıt                                                         |
| -------------------- | ------------- | ------------------------------------------------------------- |
| **id**               | String        | **PK**                                                        |
| **reservationId**    | String        | **FK → Reservation.id** CASCADE                               |
| **tourExtraId**      | String        | **FK → TourExtra.id**                                         |
| quantity             | Int           | **kişi sayısı** (≥1) — flat yok; tutar = unitPrice × quantity |
| unitPrice            | Decimal(10,2) | anlık fiyat kopyası                                           |
| currency             | String(3)     |                                                               |
| createdAt, deletedAt | DateTime      |                                                               |

**UNIQUE:** `(reservationId, tourExtraId)`  
**Index:** `reservationId`, `tourExtraId`  
**Kural:** Yalnızca o turun `TourExtra` satırları; tutar faturaya `linesSnapshot` ile gider.  
**MVP:** Sadece `quantity` (örn. “balon × 2”) yeter — hangi misafir olduğu tutulmaz.  
**Sonra (gerekirse):** `ReservationExtraGuest` M:N (`reservationExtraId` ↔ `reservationGuestId`) — manifesto “Ayşe/Ali balonda”.

---

### SeatAssignment — yolcu → koltuk (Excel’in yerine)

| Alan                        | Tip        | Kısıt                                                     |
| --------------------------- | ---------- | --------------------------------------------------------- |
| **id**                      | String     | **PK**                                                    |
| **tourDateId**              | String     | **FK → TourDate.id** CASCADE                              |
| **seatCode**                | String(16) | layoutJson `code` — örn. `12` (1…N yolcu); `CREW` atanmaz |
| **reservationGuestId**      | String     | **FK → ReservationGuest.id** CASCADE                      |
| **reservationId**           | String     | **FK → Reservation.id** CASCADE — sorgu kolaylığı         |
| **assignedByAgencyStaffId** | String?    | **FK → AgencyStaff.id** SET NULL — kim yerleştirdi        |
| assignedByAgencyId          | String?    | **FK → Agency.id** SET NULL — sahip elle yerleştirdiyse   |
| assignedAt                  | DateTime   |                                                           |
| source                      | String(20) | MANUAL \| AUTO_FIFO — elle / “alış sırasıyla doldur”      |
| createdAt, updatedAt        | DateTime   |                                                           |
| deletedAt                   | DateTime?  |                                                           |

**UNIQUE:** `(tourDateId, seatCode)` WHERE deletedAt IS NULL — bir koltuk bir yolcu  
**UNIQUE:** `(reservationGuestId)` WHERE deletedAt IS NULL — bir yolcu bir koltuk  
**Index:** `(tourDateId, assignedAt)`, `reservationId`

**Akış (Excel yerine — Obilet tarzı UI):**

1. TourDate → kind seç (`46+1`…) → capacity = 46.
2. Müşteri öder → Guest kuyrukta (koltuk yok).
3. Acente: **üstte otobüs önü**, 2+2 + koridor; renk: boş / dolu / seçili / kilitli(+1).
4. Kuyruktan yolcu seç → koltuğa tıkla → SeatAssignment; veya “Sırayla yerleştir” AUTO_FIFO.
5. Dolu koltukta tooltip: ad + rezervasyon no. Çift tık / boşalt = unassign.
6. PDF/manifest export.

**Kim:** Agency / AGENCY_*. Müşteri checkout’ta koltuk seçmez (v1).

---

### Voucher

| Alan              | Tip        | Kısıt                                       |
| ----------------- | ---------- | ------------------------------------------- |
| **id**            | String     | **PK**                                      |
| **reservationId** | String     | **UNIQUE**, **FK → Reservation.id** CASCADE |
| code              | String(40) | **UNIQUE**                                  |
| qrPayload         | Text?      |                                             |
| issuedAt          | DateTime   |                                             |
| deletedAt         | DateTime?  |                                             |

---

## 4. payment

### PaymentTransaction

| Alan                 | Tip             | Kısıt                      |
| -------------------- | --------------- | -------------------------- |
| **id**               | String          | **PK**                     |
| **reservationId**    | String          | **FK → Reservation.id**    |
| amount               | Decimal(10,2)   |                            |
| currency             | String(3)       |                            |
| status               | PaymentStatus   | işlem durumu               |
| method               | PaymentMethod   | CARD \| BANK_TRANSFER \| … |
| provider             | PaymentProvider | IYZICO \| MOCK             |
| conversationId       | String          | **UNIQUE**                 |
| providerPaymentId    | String?         |                            |
| errorMessage         | String?         |                            |
| rawResponse          | Json?           |                            |
| paidAt, refundedAt   | DateTime?       |                            |
| createdAt, updatedAt | DateTime        |                            |
| deletedAt            | DateTime?       | önerilir                   |

**Index:** `reservationId`, `status`

---

### Refund

| Alan                            | Tip           | Kısıt                          |
| ------------------------------- | ------------- | ------------------------------ |
| **id**                          | String        | **PK**                         |
| **paymentTransactionId**        | String        | **FK → PaymentTransaction.id** |
| **reservationId**               | String        | **FK → Reservation.id**        |
| amount                          | Decimal(10,2) |                                |
| currency                        | String(3)     |                                |
| status                          | RefundStatus  | PENDING \| SUCCESS \| FAILED   |
| reason                          | Text?         |                                |
| createdAt, updatedAt, deletedAt | DateTime      |                                |

**Index:** `reservationId`

---

### Invoice — e-fatura / resmi fatura (22-C, kritik)

| Alan                            | Tip             | Kısıt                                                                                                             |
| ------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------- |
| **id**                          | String          | **PK**                                                                                                            |
| **reservationId**               | String          | **FK → Reservation.id**                                                                                           |
| **paymentTransactionId**        | String?         | **FK → PaymentTransaction.id**                                                                                    |
| **userId**                      | String          | **FK → User.id**                                                                                                  |
| **agencyId**                    | String          | **FK → Agency.id** — satıcı acente (referans)                                                                     |
| provider                        | InvoiceProvider | PARASUT \| LOGO \| UYUMSOFT \| MOCK \| OTHER                                                                      |
| status                          | InvoiceStatus   | default QUEUED                                                                                                    |
| externalId                      | String?         | sağlayıcı fatura id                                                                                               |
| invoiceNumber                   | String?         |                                                                                                                   |
| amount                          | Decimal(12,2)   |                                                                                                                   |
| currency                        | String(3)       |                                                                                                                   |
| **buyerSnapshot**               | Json            | alıcı: unvan, VKN/TCKN, adres — kesim anı mühür                                                                   |
| **sellerSnapshot**              | Json            | **satıcı acente:** VKN, unvan (`legalTitle`), adres — kesim anı mühür (Agency sonradan değişse bile fatura sabit) |
| linesSnapshot                   | Json            | kalemler (tur + ekstralar)                                                                                        |
| pdfUrl                          | String?         |                                                                                                                   |
| rawResponse                     | Json?           |                                                                                                                   |
| issuedAt                        | DateTime?       |                                                                                                                   |
| lastError                       | Text?           |                                                                                                                   |
| createdAt, updatedAt, deletedAt | DateTime        |                                                                                                                   |

**Index:** `reservationId`, `(status, createdAt)`, `provider`, `externalId`  
**Akış:** Ödeme SUCCESS → Invoice QUEUED (buyer+seller snapshot doldur) → provider worker → ISSUED \| FAILED.  
**Kural:** PDF yeniden üretim / itiraz → **snapshot’lardan** oku; canlı `Agency` / `User` tablosuna güvenme.

---

### AgencyCommissionRate — acenteye özel komisyon (31-B)

| Alan                            | Tip          | Kısıt                                  |
| ------------------------------- | ------------ | -------------------------------------- |
| **id**                          | String       | **PK**                                 |
| **agencyId**                    | String       | **FK → Agency.id** UNIQUE veya dönemli |
| ratePercent                     | Decimal(5,2) | örn. 10.00 = %10 platform payı         |
| effectiveFrom                   | Date         |                                        |
| effectiveTo                     | Date?        | null = açık                            |
| createdAt, updatedAt, deletedAt | DateTime     |                                        |

**Index:** `(agencyId, effectiveFrom)`  
**Job/ödeme:** AgencyEarning = gross − komisyon.

---

### AgencyEarning

| Alan                 | Tip           | Kısıt                      |
| -------------------- | ------------- | -------------------------- |
| **id**               | String        | **PK**                     |
| **agencyId**         | String        | **FK → Agency.id**         |
| **reservationId**    | String        | **FK → Reservation.id**    |
| amount               | Decimal(10,2) |                            |
| currency             | String(3)     |                            |
| status               | String(40)    | ACCRUED \| PAYABLE \| PAID |
| createdAt, deletedAt | DateTime      |                            |

**Index:** `(agencyId, status)`

---

### AgencyPayout

| Alan                 | Tip           | Kısıt              |
| -------------------- | ------------- | ------------------ |
| **id**               | String        | **PK**             |
| **agencyId**         | String        | **FK → Agency.id** |
| amount               | Decimal(10,2) |                    |
| currency             | String(3)     |                    |
| status               | String(40)    |                    |
| paidAt               | DateTime?     |                    |
| createdAt, deletedAt | DateTime      |                    |

**Index:** `(agencyId, status)`

---

## 5. review

### Review

| Alan                                                    | Tip              | Kısıt                                         |
| ------------------------------------------------------- | ---------------- | --------------------------------------------- |
| **id**                                                  | String           | **PK**                                        |
| targetType                                              | ReviewTargetType |                                               |
| **reservationId**                                       | String           | **UNIQUE**, **FK → Reservation.id**           |
| **userId**                                              | String           | **FK → User.id**                              |
| **agencyId**                                            | String           | **FK → Agency.id** — turun/deneyimin acentesi |
| tourId                                                  | String?          | **FK → Tour.id**                              |
| experienceId                                            | String?          | **FK → Experience.id**                        |
| hotelId                                                 | String?          | **FK → Hotel.id**                             |
| guideId                                                 | String?          | **FK → Guide.id**                             |
| busCompanyId                                            | String?          | **FK → BusCompany.id**                        |
| rating                                                  | Int              | 1–5 genel                                     |
| guideRating, transportRating, accommodationRating       | Int?             | 1–5                                           |
| operatorRating, routeRating, foodRating                 | Int?             |                                               |
| guideFeedback, transportFeedback, accommodationFeedback | Text?            |                                               |
| comment                                                 | Text?            |                                               |
| photoUrls                                               | String[]         |                                               |
| AgencyReply                                             | Text?            |                                               |
| AgencyRepliedAt                                         | DateTime?        |                                               |
| **version**                                             | Int              | default 1                                     |
| createdAt, updatedAt                                    | DateTime         |                                               |
| createdBy, updatedBy, deletedBy                         | String?          |                                               |
| deletedAt                                               | DateTime?        |                                               |

**Index:** `tourId`, `experienceId`, `hotelId`, `guideId`, `busCompanyId`, `agencyId`, `userId`, `targetType`, `rating`, `guideRating`, `transportRating`, `accommodationRating`, `(tourId, deletedAt)`, `deletedAt`

---

### TourMetrics (read-model)

| Alan                                                         | Tip          | Kısıt                        |
| ------------------------------------------------------------ | ------------ | ---------------------------- |
| **id**                                                       | String       | **PK**                       |
| **tourId**                                                   | String       | **UNIQUE**, **FK → Tour.id** |
| reviewCount                                                  | Int          |                              |
| averageRating                                                | Decimal(3,2) |                              |
| averageGuideRating                                           | Decimal(3,2) |                              |
| averageTransportRating                                       | Decimal(3,2) |                              |
| averageAccommodationRating                                   | Decimal(3,2) |                              |
| averageOperatorRating, averageRouteRating, averageFoodRating | Decimal?     |                              |
| lastReviewAt                                                 | DateTime?    |                              |
| updatedAt                                                    | DateTime     |                              |
| deletedAt                                                    | DateTime?    |                              |

**Index:** `averageRating`, `averageGuideRating`, `averageTransportRating`, `averageAccommodationRating`, `reviewCount`, **`(averageGuideRating, averageTransportRating, averageAccommodationRating)`**, `deletedAt`

---

### AgencySatisfactionSnapshot

| Alan                 | Tip        | Kısıt               |
| -------------------- | ---------- | ------------------- |
| **id**               | String     | **PK**              |
| **agencyId**         | String     | **FK → Agency.id**  |
| **periodType**       | PeriodType | WEEKLY \| MONTHLY   |
| **periodStart**      | Date       |                     |
| **periodEnd**        | Date       |                     |
| payload              | Json?      | özet/ham agregasyon |
| createdAt, deletedAt | DateTime   |                     |

**UNIQUE:** `(agencyId, periodType, periodStart)`  
**Index:** `(agencyId, periodType, periodStart)`

---

### AgencyCategorySatisfaction

| Alan           | Tip          | Kısıt                                    |
| -------------- | ------------ | ---------------------------------------- |
| **id**         | String       | **PK**                                   |
| **snapshotId** | String       | **FK → AgencySatisfactionSnapshot.id**   |
| categoryKey    | String(40)   | guide \| transport \| accommodation \| … |
| average        | Decimal(3,2) |                                          |
| sampleCount    | Int          |                                          |
| deletedAt      | DateTime?    |                                          |

**Index:** `snapshotId`

---

## 6. notification · analytics

### Notification

| Alan                 | Tip                       | Kısıt                                                              |
| -------------------- | ------------------------- | ------------------------------------------------------------------ |
| **id**               | String                    | **PK**                                                             |
| recipientType        | NotificationRecipientType | USER \| Agency \| AGENCY_STAFF \| BUS_COMPANY \| GUIDE \| PLATFORM |
| userId               | String?                   | **FK → User.id**                                                   |
| agencyId             | String?                   | **FK → Agency.id**                                                 |
| agencyStaffId        | String?                   | **FK → AgencyStaff.id**                                            |
| busCompanyId         | String?                   | **FK → BusCompany.id**                                             |
| guideId              | String?                   | **FK → Guide.id**                                                  |
| type                 | String(64)                |                                                                    |
| title                | String(200)               |                                                                    |
| body                 | Text                      |                                                                    |
| data                 | Json?                     |                                                                    |
| readAt               | DateTime?                 |                                                                    |
| createdAt, updatedAt | DateTime                  |                                                                    |

**Index:** `(recipientType, readAt)`, `userId`, `agencyId`, `agencyStaffId`, `busCompanyId`, `guideId`  
**Kural:** recipientType’a göre ilgili id dolu

---

### SearchQueryLog

| Alan        | Tip         | Kısıt  |
| ----------- | ----------- | ------ |
| **id**      | String      | **PK** |
| query       | String(500) |        |
| category    | String?     |        |
| resultCount | Int         |        |
| cacheHit    | Boolean     |        |
| createdAt   | DateTime    |        |

**Index:** `createdAt`, `query`

---

## 7. content

### Category

| Alan                            | Tip         | Kısıt      |
| ------------------------------- | ----------- | ---------- |
| **id**                          | String      | **PK**     |
| name                            | String(120) | **UNIQUE** |
| slug                            | String(140) | **UNIQUE** |
| description                     | Text?       |            |
| createdAt, updatedAt, deletedAt | DateTime    |            |

**M:N:** `CategoryPost` (veya Prisma implicit) — Category ↔ Post

---

### CategoryPost (M:N)

| Alan           | Tip    | Kısıt                                |
| -------------- | ------ | ------------------------------------ |
| **categoryId** | String | **PK**, **FK → Category.id** CASCADE |
| **postId**     | String | **PK**, **FK → Post.id** CASCADE     |

**Index:** `postId`

---

### Post

| Alan                            | Tip         | Kısıt                             |
| ------------------------------- | ----------- | --------------------------------- |
| **id**                          | String      | **PK**                            |
| title                           | String(300) |                                   |
| slug                            | String(320) | **UNIQUE**                        |
| content                         | Text        |                                   |
| excerpt                         | Text?       |                                   |
| coverImage                      | String?     |                                   |
| published                       | Boolean     |                                   |
| publishedAt                     | DateTime?   |                                   |
| authorId                        | String      | **FK → User.id** (platform yazar) |
| createdAt, updatedAt, deletedAt | DateTime    |                                   |

**Index:** `authorId`, `(published, publishedAt)`, `deletedAt`

---

### PostTag (M:N)

| Alan       | Tip    | Kısıt                            |
| ---------- | ------ | -------------------------------- |
| **postId** | String | **PK**, **FK → Post.id** CASCADE |
| **tagId**  | String | **PK**, **FK → Tag.id** CASCADE  |

**Index:** `tagId`

---

### Comment

| Alan                            | Tip      | Kısıt                    |
| ------------------------------- | -------- | ------------------------ |
| **id**                          | String   | **PK**                   |
| content                         | Text     |                          |
| authorId                        | String   | **FK → User.id**         |
| **postId**                      | String   | **FK → Post.id** CASCADE |
| createdAt, updatedAt, deletedAt | DateTime |                          |

**Index:** `postId`, `authorId`, `deletedAt`

---

### StaticPage

| Alan                            | Tip         | Kısıt      |
| ------------------------------- | ----------- | ---------- |
| **id**                          | String      | **PK**     |
| slug                            | String(120) | **UNIQUE** |
| title                           | String(200) |            |
| body                            | Text        |            |
| published                       | Boolean     |            |
| createdAt, updatedAt, deletedAt | DateTime    |            |

---

### ContactSubmission

| Alan                 | Tip         | Kısıt  |
| -------------------- | ----------- | ------ |
| **id**               | String      | **PK** |
| name                 | String(120) |        |
| email                | String(200) |        |
| message              | Text        |        |
| createdAt, deletedAt | DateTime    |        |

---

## 8. outbox

### OutboxEvent

| Alan                 | Tip          | Kısıt               |
| -------------------- | ------------ | ------------------- |
| **id**               | String       | **PK**              |
| aggregateType        | String(64)   | Review \| …         |
| aggregateId          | String(64)   |                     |
| eventType            | String(96)   | review.created \| … |
| payload              | Json         |                     |
| status               | OutboxStatus | default PENDING     |
| attempts             | Int          |                     |
| lastError            | Text?        |                     |
| availableAt          | DateTime     | retry               |
| processedAt          | DateTime?    |                     |
| createdAt, updatedAt | DateTime     |                     |
| deletedAt            | DateTime?    | opsiyonel           |

**Index:** `(status, availableAt)`, `(aggregateType, aggregateId)`, `(eventType, createdAt)`

---

## 9. promotion

### Coupon

| Alan                            | Tip           | Kısıt            |
| ------------------------------- | ------------- | ---------------- |
| **id**                          | String        | **PK**           |
| code                            | String(40)    | **UNIQUE**       |
| discountType                    | String(20)    | PERCENT \| FIXED |
| discountValue                   | Decimal(10,2) |                  |
| startsAt, endsAt                | DateTime?     |                  |
| maxUses                         | Int?          |                  |
| usedCount                       | Int           |                  |
| isActive                        | Boolean       |                  |
| createdAt, updatedAt, deletedAt | DateTime      |                  |

---

### CouponUsage

| Alan          | Tip      | Kısıt                   |
| ------------- | -------- | ----------------------- |
| **id**        | String   | **PK**                  |
| **couponId**  | String   | **FK → Coupon.id**      |
| **userId**    | String   | **FK → User.id**        |
| reservationId | String?  | **FK → Reservation.id** |
| createdAt     | DateTime |                         |

**UNIQUE:** `(couponId, userId, reservationId)`

---

### Campaign

| Alan                 | Tip         | Kısıt      |
| -------------------- | ----------- | ---------- |
| **id**               | String      | **PK**     |
| title                | String(200) |            |
| slug                 | String(220) | **UNIQUE** |
| bannerUrl            | String?     |            |
| startsAt, endsAt     | DateTime?   |            |
| payload              | Json?       |            |
| isActive             | Boolean     |            |
| createdAt, deletedAt | DateTime    |            |

---

## 10. FK özet diyagramı

```
User ──< Reservation ──FK── TourDate ──FK── Tour ──FK── Agency
  │            │                              │
  │            ├── Guest, Voucher             ├── DepartureRule
  │            ├── Payment ── Refund          ├── busCompanyId → BusCompany
  │            ├── AgencyEarning             ├── guideId → Guide
  │            └── Review ──FK── Guide?       ├── TourTag → Tag ← PostTag ← Post
                     └── BusCompany?          ├── TourDestination → Destination
                                              ├── TourRoute → Route
                                              └── TourMetrics (1:1)

Agency (=Acente) ── AgencyStaff · BankInfo · Tursab* · Snapshot · SellerMetrics · Hotel · Experience · **BusSeatLayout**
TourDate ── busCompanyId · guideId · **busSeatLayoutId** → SeatAssignment ── ReservationGuest
BusCompany / Guide ── TourDate ataması (Agency / AGENCY_*)

RefreshToken ──FK── User | AgencyStaff | BusCompany | Guide
Notification ──FK── …
```

### İlişki denetimi (özet)

| Durum               | Ne                                                                  |
| ------------------- | ------------------------------------------------------------------- |
| **İsim**            | `PLATFORM_*` · `AGENCY_*` — çıplak ADMIN yok; UI’de Agency = Acente |
| **Personel**        | Agency → **AgencyStaff** (tek ağaç)                                 |
| **Tam**             | Tour ağacı, TourDate↔Bus/Guide, Tag M:N, Snapshot, Guest/Voucher    |
| **Bilinçli FK yok** | Outbox; AuditLog polymorphic; SearchQueryLog                        |

---

### Kapı / aktör özeti

| Aktör               | Tablo           | Rol adı                     | Giriş                      |
| ------------------- | --------------- | --------------------------- | -------------------------- |
| Müşteri             | User            | CUSTOMER                    | `/giris`                   |
| Platform            | User            | PLATFORM_ADMIN              | platform panel             |
| **Süper yönetici**  | User            | **PLATFORM_SUPER_ADMIN**    | her şey (üst yetki)        |
| **Acente sahibi**   | Agency          | —                           | `/Agency/giris`            |
| **Acente personel** | **AgencyStaff** | AGENCY_STAFF / AGENCY_ADMIN | `/Agency/giris` (personel) |
| Otobüs              | BusCompany      | —                           | `/otobus/giris`            |
| Rehber              | Guide           | —                           | `/rehber/giris`            |

---

## 11. Arka plan işleri (tablo bağı — uygulama detayı değil)

| Job                     | Okur / yazar                                                                              |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| OutboxWorker            | OutboxEvent → TourMetrics (+ Tour mirror)                                                 |
| HoldReleaseWorker       | Reservation `(PENDING_PAYMENT, holdExpiresAt < now)` → EXPIRED; TourDate capacity ↑       |
| SatisfactionSnapshotJob | Review → AgencySatisfactionSnapshot + Category                                            |
| TursabReverifyWorker    | Agency tursab* + TursabVerificationLog                                                    |
| **SellerTierRecalcJob** | Reservation + Review + Refund → **AgencySellerMetrics** → Agency.sellerScore / sellerTier |

---

## 12. Tablo sayısı

|                             | Adet                                                            |
| --------------------------- | --------------------------------------------------------------- |
| Hedef modeller (Room hariç) | ~57 (+ AgencyStaff, BusSeatLayout, SeatAssignment; Agency drop) |
| Drop                        | Room · legacy B2B Agency/SubUser · Partner* rename              |
| Yeni schema                 | `outbox`, `promotion`                                           |

### 13. Bilinçli boşluklar / sonraki faz (eksik sayılmaz, ertelenir)

| Konu                                  | Not                                                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------------------ |
| ExperienceMetrics                     | Deneyim arama filtresi için TourMetrics benzeri — faz 2; şimdilik Experience.averageRating |
| Bus/Guide SellerTier                  | AgencySellerMetrics benzeri — isteğe bağlı                                                 |
| Coupon.agencyId                       | Acenteye özel kupon — faz 2                                                                |
| SMS OTP                               | EmailOtp yeterli; SMS ayrı tablo sonra                                                     |
| TursabRouteSubmission                 | Faz 2 iskelet                                                                              |
| Hotel satışı / Room                   | **Asla yok** — Hotel = gün+konum + review                                                  |
| B2B aracı acente                      | Yok                                                                                        |
| Deneyim / ActivityDate bağımsız satış | **MVP yok** — tur içi `TourExtra`                                                          |
| Experience* tablolar                  | Faz 2 migrate                                                                              |
| Müşteri koltuk seçimi                 | Faz 2                                                                                      |
| Özel layout (kind dışı)               | Şimdilik yok; sadece 19/31/35/46/50 +1                                                     |
| BusCompany layout paylaşımı           | Ortak araç şablonu — faz 2                                                                 |
| Platform komisyon oranı tablosu       | AgencyEarning hesabı config/env veya sonra `PlatformFeeRule`                               |
| Reservation.boardingPickupPointId     | Zorunlu açık seçim (1. durak dahil)                                                        |
| Invoice / e-fatura                    | buyerSnapshot + **sellerSnapshot**; SUCCESS→QUEUED                                         |
| Agency self-delete                    | Yasak; müşteri self-delete OK (partial unique ile yeniden kayıt)                           |
| Guide/Vehicle availability            | GuideAvailability + **VehicleAvailability** (şirket değil araç)                            |
| Çok günlü blokaj                      | Assignment ACCEPTED → startDate…endDate tüm günler `isAvailable=false`                     |
| ReservationExtraGuest                 | Faz 2 — MVP’de sadece quantity                                                             |
| TourDateAssignment                    | Kabul/red zorunlu                                                                          |
| Soft delete UNIQUE                    | Partial index `WHERE deletedAt IS NULL` — migrate zorunlu                                  |
| Global EmailRegistry                  | Çapraz e-posta tekil → uygulama katmanı; ayrı tablo şart değil                             |
| Media / Asset tablosu                 | coverUrl / galleryUrls / photoUrls string yeter; CDN asset registry sonra                  |
| Cross-schema Prisma FK                | Bazı FK’ler index + uygulama bütünlüğü                                                     |

_Hikâye: `DATABASE_FILL_STORIES.md` · Kurulum: `BACKEND_BUILD_ORDER.md`_
