# Demo seed hesapları

> Şifre (hepsi): `Demo1234!`  
> Çalıştır: `pnpm --filter api prisma:seed`  
> Doğrula: `pnpm --filter api seed:verify`  
> Wipe: sadece **veri** (TRUNCATE) — tablolar silinmez.

## Müşteri

| Email                                                 | Rol      |
| ----------------------------------------------------- | -------- |
| customer01@demo.turta.com … customer05@demo.turta.com | CUSTOMER |

## Platform / Admin

| Email                                                             | Rol                  |
| ----------------------------------------------------------------- | -------------------- |
| admin01@demo.turta.com … admin05@demo.turta.com                   | ADMIN                |
| platform-admin01@demo.turta.com … platform-admin05@demo.turta.com | PLATFORM_ADMIN       |
| superadmin01@demo.turta.com … superadmin05@demo.turta.com         | PLATFORM_SUPER_ADMIN |

## Acente paneli (`/acente/giris`)

| Email                                                         | Rol          |
| ------------------------------------------------------------- | ------------ |
| owner01@agency.demo.turta.com … owner05@agency.demo.turta.com | AGENCY_OWNER |
| admin01@agency.demo.turta.com … admin05@agency.demo.turta.com | AGENCY_ADMIN |
| staff01@agency.demo.turta.com … staff05@agency.demo.turta.com | AGENCY_STAFF |

## Rehber / Otobüs

| Email                                           | Tip        |
| ----------------------------------------------- | ---------- |
| guide01@demo.turta.com … guide05@demo.turta.com | Guide      |
| bus01@demo.turta.com … bus05@demo.turta.com     | BusCompany |

## Hacimler (hedef)

- 5 Agency × 5 Tour = 25 tur (her birinde date, ageRange, pickup, extra, accommodation)
- 5 Agency × 5 Experience = 25 aktivite
- BusSeatLayout sistem 5 kind
- **Koltuk demo (Ankara Acente 01, ilk sefer):**
  - Koltuk `1` → Ayşe Yılmaz, `2` → Mehmet Demir (haritada kırmızı + baş harf)
  - Zeynep / Can / Elif → atanmamış (sol listeden seçip oturt)
  - Seat code layout ile aynı: `"1"`, `"2"`… (`1A` yok)
- **Yorumlar:** COMPLETED rezervasyon → Review (tur + deneyim); TourMetrics / Tour.averageRating mirror
  - Profil → Yorumlarım (`customer01@…`)
  - Tur detay + acente paneli yorumlar (bazılarında acente yanıtı)

## Ortam

Önce **local Docker** (`DATABASE_URL=…localhost:5433…`). Neon wipe ayrı onay ister.
