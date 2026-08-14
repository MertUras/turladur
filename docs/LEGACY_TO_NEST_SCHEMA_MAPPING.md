# Legacy → Nest Schema Mapping (Sprint 19.1)

Kaynak: kök `prisma/schema.prisma` (legacy Next, `public` schema)  
Hedef: `apps/api/prisma/schema.prisma` (multi-schema Nest API)

Bu doküman **hangi legacy modelin hangi Nest schema/modele** gideceğini sabitler.  
Uygulama: Sprint 19.2–19.11 (model ekleme + `merge_legacy_models` migration).

## Schema hedefi

| Nest schema        | Sorumluluk                                                                          |
| ------------------ | ----------------------------------------------------------------------------------- |
| `identity`         | User, Partner, Agency, SubUser, roller                                              |
| `catalog`          | Tour, TourDate, Hotel, Room, Experience, ActivityDate, konaklama, pickup, age range |
| `booking`          | Reservation (legacy Booking birleşimi)                                              |
| `payment`          | PaymentTransaction                                                                  |
| `review`           | Review (+ ActivityReview / PartnerReview birleşimi)                                 |
| `notification`     | Notification                                                                        |
| `analytics`        | SearchQueryLog vb.                                                                  |
| `content` _(yeni)_ | Post, Category, Comment — Sprint 19.6 / 19.10                                       |

## Model mapping

| Legacy model             | Nest hedef                               | Schema     | Not                                                                                              |
| ------------------------ | ---------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------ |
| `User`                   | `User`                                   | `identity` | `password` → `passwordHash`; `name` → `firstName`/`lastName`; `UserRole` enum birleşimi (19.9)   |
| `TourOperator`           | `Partner` (`capabilities` ⊇ TOURS)       | `identity` | Ayrı kayıt + tur dashboard; tek Partner tablosu                                                  |
| `ExperienceOperator`     | `Partner` (`capabilities` ⊇ EXPERIENCES) | `identity` | Ayrı aktiviteci kaydı + deneyim dashboard; **ayrı tablo değil**, `PartnerCapability.EXPERIENCES` |
| `Agency`                 | `Agency` _(yeni)_ veya Partner alt tipi  | `identity` | 19.5 — Agency CRUD ayrı kalabilir                                                                |
| `SubUser`                | `User` (`PARTNER_STAFF`) veya `SubUser`  | `identity` | 19.5 / 20.8 — izinler JSON                                                                       |
| `Tour`                   | `Tour`                                   | `catalog`  | `name` → `title`; slug zorunlu; status enum                                                      |
| `TourDate`               | `TourDate`                               | `catalog`  | Kapasite / indirim alanları genişletilecek                                                       |
| `TourAccommodation`      | `TourAccommodation`                      | `catalog`  | 19.4 — henüz Nest’te yok                                                                         |
| `TourPickupPoint`        | `TourPickupPoint`                        | `catalog`  | 19.4                                                                                             |
| `TourDateAgeRange`       | `TourDateAgeRange`                       | `catalog`  | 19.4                                                                                             |
| `Experience`             | `Experience`                             | `catalog`  | 19.3                                                                                             |
| `ActivityDate`           | `ActivityDate`                           | `catalog`  | 19.3                                                                                             |
| `ExperienceDateAgeRange` | `ExperienceDateAgeRange`                 | `catalog`  | 19.4 ile birlikte                                                                                |
| `Hotel`                  | `Hotel`                                  | `catalog`  | 19.2                                                                                             |
| `Room`                   | `Room`                                   | `catalog`  | 19.2                                                                                             |
| `Booking`                | `Reservation`                            | `booking`  | 19.8 — `hotelId`/`roomId`/`experienceId` opsiyonel                                               |
| `Review`                 | `Review`                                 | `review`   | Genel ürün yorumu                                                                                |
| `PartnerReview`          | `Review` (veya `PartnerReview`)          | `review`   | Booking tamamlandı sonrası; kategori alanları korunur                                            |
| `ActivityReview`         | `Review`                                 | `review`   | 19.7 — Experience’a bağlanır                                                                     |
| `Post`                   | `Post`                                   | `content`  | 19.6                                                                                             |
| `Category`               | `Category`                               | `content`  | 19.6                                                                                             |
| `Comment`                | `Comment`                                | `content`  | 19.6                                                                                             |

## Enum birleşimi (19.9)

| Legacy                                                                                 | Nest hedef                                                                               |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `UserRole`: USER, HOTEL_ADMIN, AGENCY_ADMIN, TOUR_OPERATOR, EXPERIENCE_PROVIDER, ADMIN | `CUSTOMER`, `PARTNER`, `PARTNER_STAFF`, `ADMIN`, `SUPER_ADMIN` (+ gerekirse domain flag) |
| `BookingStatus`                                                                        | Nest `ReservationStatus` ile hizala; `PENDING_PAYMENT` vb. korunur                       |
| `PaymentStatus`                                                                        | `payment` schema enum                                                                    |
| `TourOperatorStatus` / partner status                                                  | `PartnerStatus`                                                                          |
| `MembershipTier`                                                                       | Partner alanı veya derived (rating) — katalog “öne çıkan” mantığı                        |

## Nest’te zaten var

- `User`, `Partner`, `Tour`, `TourDate`, `Reservation`, `PaymentTransaction`, `Review`, `Notification`, `SearchQueryLog`
- **`Hotel`, `Room`** (Sprint 19.2 — `catalog`)
- **`Experience`, `ActivityDate`** (Sprint 19.3 — `catalog`)
- **`Partner.capabilities`** (`TOURS` \| `EXPERIENCES` \| `HOTELS`) + `membershipTier` — aktiviteci / tur operatörü ayrı kayıt ve dashboard rolü (legacy ayrı tabloların yerine)

## Nest’e eklenecek (sonraki sprintler / endpoint’ler)

- Sprint 20: Hotel/Experience/Agency controller’lar
- Sprint 21+: Frontend cutover

## Nest’te tamamlanan (Sprint 19 şema)

- Hotel, Room, Experience, ActivityDate
- Partner.capabilities + membershipTier
- TourAccommodation, TourPickupPoint, AgeRange’ler
- Agency, SubUser
- Post, Category, Comment (`content`)
- Reservation otel/aktivite alanları; Review targetType birleşimi
- Enum genişlemeleri (BookingStatus, ReservationPaymentStatus, …)

## Veri taşıma notu

- Legacy DB = çoğunlukla Neon `public` (tek schema).
- Nest = PostgreSQL **multi-schema**. Cutover’da ya:
  1. ETL / SQL script ile `public.*` → `catalog.*` / `identity.*`, veya
  2. Soft cutover: yeni yazımlar Nest’e, okuma geçici dual-read (tercih edilmez).
- Demo seed’ler (Silver turlar vb.) cutover sonrası **`apps/api` seed** ile yeniden üretilir (kök `prisma/seed-*.ts` Sprint 23’te kalkar).

## DoD (19.1)

- [x] Mapping tablosu bu dosyada
- [ ] 19.2+ PR’larında bu tabloya referans
- [ ] Breaking field rename’leri mobil/web checklist’te işaretlenir
