# Sprint 23 — Faz A Parity Sign-off

> **Kural:** `.cursor/rules/ui-parity-no-simplify.mdc`  
> **Tarih:** 2026-07-23  
> **Durum:** 🔴 **BLOKE** — Faz B (legacy silme) henüz açılamaz

## Özet

| Alan                       | Kod            | Parity        | Not                                                       |
| -------------------------- | -------------- | ------------- | --------------------------------------------------------- |
| 23.0a Marketing + customer | ✅ audit + fix | 🟡 PARTIAL    | Campaigns/careers port edildi; checkout/profile PARTIAL   |
| 23.0b Auth                 | ✅ audit + fix | 🟢 P0 kapandı | forgot + partner auth UI port; Nest data wired            |
| 23.0c Partner panel        | ✅ audit       | 🟡 PARTIAL    | Core CRUD güçlü; financials/reservations/experiences ince |
| 23.0d Admin panel          | ✅ audit       | 🔴 GAP        | Çoğu STUB/MISSING — **Faz B bloker**                      |
| 23.0e Ortak bileşenler     | ✅ audit + fix | 🟡 PARTIAL    | Footer restore; Header hotel temizliği kalan              |
| 23.0f Sign-off             | 🟡 bu doküman  | 🔴 BLOKE      | Admin + checkout/profile boşlukları                       |

**Skor (yaklaşık):** ~18 PARITY · ~14 PARTIAL · ~8 STUB · ~12 MISSING

---

## Ürün onaylı istisnalar (silmeden önce geçerli)

| Ekran / özellik  | Karar                                                                               | Kaynak        |
| ---------------- | ----------------------------------------------------------------------------------- | ------------- |
| Otel / `/hotel*` | Kapsam dışı — Nest’te otel ürünü yok; Footer/Header’da Konaklama linki **olmamalı** | Sprint 21 DoD |

Diğer tüm MISSING/STUB öğeler **istisna değil** — port veya ürün onayı gerekir.

---

## 23.0a — Marketing + Customer

| Ekran                  | Legacy                           | apps/web                                | Durum                                                          |
| ---------------------- | -------------------------------- | --------------------------------------- | -------------------------------------------------------------- |
| Ana sayfa              | `app/page.tsx`                   | `(marketing)/page.tsx`                  | ✅ PARITY                                                      |
| Tur listesi            | `(dashboard)/tours`              | `(marketing)/tours`                     | ✅ PARITY                                                      |
| Tur detay              | `(dashboard)/tour/[id]`          | `(marketing)/tours/[id]`                | ✅ PARITY                                                      |
| Aktivite listesi/detay | `(dashboard)/activities*`        | `(marketing)/activities*`               | ✅ PARITY                                                      |
| Rota listesi/detay     | `(dashboard)/routes*`            | `(marketing)/routes*`                   | ✅ PARITY                                                      |
| Blog listesi/detay     | `(dashboard)/blog*`              | `(marketing)/blog*`                     | ✅ PARITY                                                      |
| Contact / About        | `(dashboard)/contact`, `about`   | `(marketing)/contact`, `about`          | ✅ PARITY                                                      |
| Bookings               | `(dashboard)/bookings`           | `(customer)/bookings`                   | ✅ PARITY                                                      |
| Checkout               | `checkout/CheckoutClient` (~734) | `(customer)/checkout` → checkout-client | ✅ PARITY (2026-07-24) — guest fatura + multi-guest; Nest wire |
| Profile                | 8 tab                            | 5 tab                                   | 🟡 PARTIAL — Favorites / Notifications / Help eksik            |
| Campaigns              | `(dashboard)/campaigns`          | `(marketing)/campaigns`                 | ✅ PARITY (2026-07-23 port)                                    |
| Careers                | `(dashboard)/careers`            | `(marketing)/careers`                   | ✅ PARITY (2026-07-23 port)                                    |
| Tour operator listing  | `(dashboard)/tour-operator`      | redirect `/tours`                       | 🟠 STUB                                                        |

---

## 23.0b — Auth

| Ekran                           | Durum                                                |
| ------------------------------- | ---------------------------------------------------- |
| Login                           | 🟡 PARTIAL — chrome ince; forgot link artık çalışır  |
| Register                        | 🟡 PARTIAL — daha ince chrome                        |
| Forgot password                 | ✅ PARITY UI (Nest endpoint yok → legacy simülasyon) |
| Partner login                   | ✅ PARITY → Nest `identity/login`                    |
| Partner register                | ✅ PARITY → Nest `identity/partners/register`        |
| Partner verification (+ verify) | ✅ PARITY UI; verify → Nest; resend simüle           |

---

## 23.0c — Partner

| Ekran                                                                        | Durum                     |
| ---------------------------------------------------------------------------- | ------------------------- |
| Dashboard, tour form (create/edit/detail), users, settings, reviews, reports | ✅ / güçlü PARTIAL→PARITY |
| Tours list, experiences, reservations, financials, customers, help           | 🟡 PARTIAL (daha ince UI) |

---

## 23.0d — Admin

| Ekran                                                                 | Durum      |
| --------------------------------------------------------------------- | ---------- |
| Dashboard, users, agencies, statistics                                | 🟠 STUB    |
| Tours approvals, content                                              | 🟡 PARTIAL |
| Settings, payments, reservations, support, guides, activity-operators | ❌ MISSING |

---

## 23.0e — Shared

| Bileşen          | Durum                                                           |
| ---------------- | --------------------------------------------------------------- |
| Header           | 🟡 PARTIAL — `/campaigns`, `/careers` (404); `/hotel` ürün dışı |
| Footer           | ✅ PARITY (otel linki hariç — ürün istisnası)                   |
| BottomBookingBar | ✅ PARITY                                                       |

---

## Faz B açılış kriteri (yeşil ışık)

- [x] P0 MISSING auth sayfaları port edildi (forgot + partner trio)
- [x] P0 campaigns + careers port edildi
- [x] Footer legacy kolon/legal/social restore (otel linki hariç)
- [ ] Admin: stub’lar legacy seviyesine çıkarıldı **veya** kesim listesi ürün onaylı
- [ ] Checkout SpecialConditions + success **veya** onaylı istisna
- [ ] Profile eksik tablar **veya** onaylı istisna
- [ ] Header’dan `/hotel` dead link temizliği
- [ ] Bu dokümanda **Durum: 🟢 HAZIR**

---

## Çalışma günlüğü

| Tarih      | İş                                                                                        |
| ---------- | ----------------------------------------------------------------------------------------- |
| 2026-07-23 | İlk audit tamam; sign-off BLOKE                                                           |
| 2026-07-23 | Footer restore; forgot + partner auth + campaigns/careers port; Nest verify URL hizalandı |
