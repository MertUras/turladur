# Ne Zaman Dolar? — Doldurma hikâyeleri

> Kaynak: `DATABASE_SCHEMA.md` · Sıra: `BACKEND_BUILD_ORDER.md`  
> Biçim: **Kim ne yaptı → hangi alan / tablo doldu.**

### İsim

`Agency` / `AgencyStaff` (OWNER|ADMIN|STAFF) · Partner yok · Hold **10 dk**

---

# A) Kimlik

## User

Kayıt → email (**partial unique**), passwordHash, CUSTOMER.  
Self-delete → deletedAt; aynı email sonra yeniden kayıt OK (silinmiş satır unique sayılmaz).  
Platform seed → PLATFORM_ADMIN / PLATFORM_SUPER_ADMIN.

## EmailOtp

REGISTER | PASSWORD_RESET (checkout OTP yok).

## Agency (tüzel — giriş yok)

Kayıt tx: Agency (taxNumber/VKN, legalTitle, address **zorunlu**) + ilk **AgencyStaff AGENCY_OWNER**.  
TÜRSAB → TursabVerificationLog → platform VERIFIED.  
Self-delete yok. VKN/unvan/adres yoksa tur PUBLISHED olamaz.

## AgencyStaff

OWNER / ADMIN / STAFF; email+passwordHash; RefreshToken(**agencyStaffId** only).  
Sahip de Staff satırı.

## Guide (TUREB) · BusCompany · Vehicle

Guide: TCKN, oda, sicil, ruhsat… + GuideAvailability (gün).  
BusCompany giriş → Vehicle (plaka, BusLayoutKind) + VehicleAvailability (gün).

## RefreshToken

userId XOR agencyStaffId XOR busCompanyId XOR guideId.

## AgencyBankInfo · IdempotencyKey · AuditLog · Favorite

Banka IBAN; çift tık key; audit polymorphic; favori tur.

---

# B) Katalog

## Tour → yayın

DRAFT → PENDING_REVIEW → (VKN+unvan+adres OK) PUBLISHED. version. childMaxAge, minParticipants.

## TourDepartureRule → TourDate

Kural üretimi / manuel tarih. capacity, version, busSeatLayoutId (opsiyonel N+1).  
vehicleId / guideId / busCompanyId → Assignment ACCEPTED sonrası mirror.

## TourDateAssignment

PENDING → rehber/araç kabul/red.  
**ACCEPTED:** TourDate.startDate…endDate arası **her gün** GuideAvailability / VehicleAvailability → `isAvailable=false`.

## TourAccommodation · Hotel · Pickup · TourExtra

Gün+hotelId (satış yok).  
Pickup: boardingPickupPointId checkout’ta **zorunlu açık seçim** (1. durak dahil).  
TourExtra → checkout ekstra; ReservationExtra.quantity = **kişi**.

## Experience*

MVP migrate yok (bağımsız mağaza sonra).

---

# C) Rezervasyon & ödeme

## Reservation (hold 10 dk)

PENDING_PAYMENT + holdExpiresAt + agencyId (satan acente) + boardingPickupPointId + guests + ReservationExtra.  
TourDate kontenjan − (version). Süre dolunca EXPIRED + iade.  
Ödeme CARD SUCCESS → CONFIRMED, PAID, Voucher.

## Invoice

SUCCESS anında QUEUED: **buyerSnapshot** + **sellerSnapshot** (acente VKN/unvan/adres mühür) + linesSnapshot.  
PDF/yeniden üretim snapshot’tan.

## SeatAssignment

Ödeme sonrası / kalkış öncesi; acente MANUAL veya AUTO_FIFO (alış sırası). Her yolcu koltuk + T.C.

## AgencyEarning / Payout / CommissionRate

Komisyon acenteye özel oran; kazanç → payout.

---

# D) Yorum

COMPLETED → Review (genel + guide/transport/accommodation) + Outbox aynı tx → TourMetrics → Tour mirror.

---

# E) Diğer

Notification · SearchQueryLog · Post/Tag RelatedTours · Coupon · StaticPage · Contact.

---

# Uçtan uca

```
Agency+OWNER kayıt (VKN) → tur+ekstra+pickup
→ Fatma hold 10dk + boarding + ekstra×kişi → öde
→ Invoice (buyer+seller snapshot) + Voucher
→ Acente koltuk / Assignment (çok gün müsaitlik kapat)
→ COMPLETED → Review → TourMetrics
```

_Şema: `DATABASE_SCHEMA.md`_
