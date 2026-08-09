# Bulgular

Bu doküman sprint sırasında tespit edilen teknik bulguları ve sonraki sprint için önerilen aksiyonları tutar.

---

## ⬆ SONRA (P0-B B1–B3 + B6 LOCAL TAMAM — EN ÖNCE bak)

> **P0-A (LOCAL TAMAM):** Partner / LegacyAgency / SubUser **DROP** + sahiplik `agencyId`.  
> **P0-B B1–B3 (LOCAL TAMAM):** `/acente` · `/rehber` · `/otobus` giriş + shell + dashboard (PartnerShell parity). Nest API hâlâ `/partner/*`. Neon yok.  
> **P0-B6 (LOCAL TAMAM):** Guide/Vehicle müsaitlik takvimi (`/rehber/musaitlik` · `/otobus/araclar/.../musaitlik`) — Cloudflare / Neon yok.
>
> Aşağıdakiler **bilerek P0-B çekirdek dışında**.

| Öncelik  | Madde                                        | Neden sonra                                  | Not                                                    |
| -------- | -------------------------------------------- | -------------------------------------------- | ------------------------------------------------------ |
| **P0**   | **B4 koltuk paneli**                         | API hazır; FE sayfa yok                      | **LOCAL TAMAM** — `/acente/tours/.../seats` + TR alias |
| **P0**   | **B5 atama (inbox kalanı)**                  | Acente sefer paneli + rehber kabul **kısmi** | **LOCAL TAMAM** — `/acente/atamalar`                   |
| **P1**   | **AgencyStaff granular UX** (permissions UI) | Guard hazır; FE ayrı                         | `/acente/kullanicilar`                                 |
| **P1**   | **Checkout `pickupPointId`**                 | Data-only                                    |                                                        |
| **P0-C** | **Neon migrate**                             | Ayrı onay                                    |                                                        |
| **P2**   | Tursab · SellerTier · PDF · Idempotency FE   |                                              |                                                        |

**Yasaklar aynı:** UI redesign yok · Cloudflare upload yok · Push/Neon onaysız yok · Room geri gelmez.

### P0 aşama rehberi — nasıl ulaşırız?

| Aşama     | Ne                    | Önkoşul               | Kaynak / parity                                        | DoD                                                                  |
| --------- | --------------------- | --------------------- | ------------------------------------------------------ | -------------------------------------------------------------------- |
| **P0-A**  | Hard contract DROP    | Local DB              | Prisma + PartnerModule                                 | Partner tablosu yok; `/partner` API Agency-native — **TAMAM**        |
| **P0-B1** | `/acente` cutover     | P0-A                  | `(partner)` → `(agency)/acente` · `AgencyShell`        | `/acente/giris` → dashboard; `/partner/*` redirect — **TAMAM**       |
| **P0-B2** | Rehber panel iskeleti | Guide JWT             | `GuideShell` + `/rehber/giris`                         | Login + dashboard gate — **TAMAM**                                   |
| **P0-B3** | Otobüs panel iskeleti | Bus JWT               | `BusShell` + `/otobus/giris`                           | Login + dashboard gate — **TAMAM**                                   |
| **P0-B4** | Koltuk MANUAL/AUTO    | Faz 5 API             | Acente: `/acente/turlar/.../koltuklar`                 | Harita + assign/unassign — **LOCAL**                                 |
| **P0-B5** | Atama kabul/red       | Faz 4 API             | `/acente/tours/[id]` sefer paneli · `/rehber/atamalar` | Acente davet + rehber respond — **LOCAL TAMAM** (`/acente/atamalar`) |
| **P0-B6** | Müsaitlik             | Faz 4 API             | `/rehber/musaitlik` · `/otobus/araclar/.../musaitlik`  | Takvim CRUD — **LOCAL TAMAM**                                        |
| **P1**    | Permissions UX        | StaffPermissionsGuard | `/acente/kullanicilar`                                 | Granular FE                                                          |
| **P0-C**  | Neon                  | Onay                  | migrate deploy                                         | Dev/staging DB                                                       |

**Demo girişler:**  
`agency-owner@demo.turta.com` → `/acente/giris` · `guide@demo.turta.com` → `/rehber/giris` · `bus@demo.turta.com` → `/otobus/giris` (şifre: `Demo1234!`)

### Eksik UI → hedef konum

> Şema kapıları: `/giris` · `/acente` · `/rehber` · `/otobus`.  
> **P0-B:** B1–B3 path cutover + **B6 müsaitlik** **uygulandı**; B4–B5 (koltuk · atama) sırada.

| Bulgular kaynağı | Eksik yüzey                                               | Hedef app path                                         | Shell / not                     |
| ---------------- | --------------------------------------------------------- | ------------------------------------------------------ | ------------------------------- |
| A11, Faz1/10     | AgencyStaff giriş                                         | `(auth)/acente/giris` → `/acente/giris`                | **P0-B1 TAMAM**                 |
| P0 paneller      | Acente panel (tur, rezervasyon, finans, kullanıcı, ayar…) | `(agency)/acente/**`                                   | **P0-B1 TAMAM** · `AgencyShell` |
| A12, Faz5        | Koltuk haritası / MANUAL-AUTO                             | `/acente/turlar/[id]/tarihler/[dateId]/koltuklar`      | **P0-B4 LOCAL**                 |
| Faz4             | Atama kabul/red                                           | `/acente/atamalar` · rehber/otobüs inbox               | **P0-B5 LOCAL TAMAM**           |
| A11              | Rehber giriş + panel                                      | `/rehber/giris` · `(guide)/rehber/**`                  | **P0-B2 TAMAM** (dashboard)     |
| A11              | Otobüs giriş + panel                                      | `/otobus/giris` · `(bus)/otobus/**`                    | **P0-B3 TAMAM** (dashboard)     |
| Faz4             | Guide/Vehicle müsaitlik                                   | `/rehber/musaitlik` · `/otobus/araclar/[id]/musaitlik` | **P0-B6 LOCAL TAMAM**           |
| A2, Faz3         | Checkout pickup/guest/extra/hold                          | `(customer)/checkout` data-only                        | Tasarım yok                     |
| Faz2             | TourExtra / boarding                                      | Tur detay + checkout                                   | Marketing/customer              |
| Faz6             | Related tours / metrics                                   | Tur detay + `/acente` metrics                          |                                 |
| Faz7             | Payout / bank                                             | `/acente/finans`                                       | financials parity               |
| Faz8             | Favori / kupon / multi-inbox                              | Customer + aktör shell bell                            |                                 |
| P1               | AgencyStaff permissions UX                                | `/acente/kullanicilar`                                 | Guard hazır                     |
| A13              | PDF/manifest                                              | Acente rezervasyon detay                               |                                 |
| Bilinçli yok     | Experience mağaza, müşteri koltuk                         | —                                                      | A8/A14                          |

---

## 2026-08-01 — Marketplace şema migrate: ertelenenler & takip

> Kaynak yol: Faz 0–12; UI paneller / Cloudflare dokunulmaz; Neon en sonda.  
> Bu liste “daha sonra” denilen işleri tek yerde tutar.

### A) Şimdiye kadar ertelenenler (yapılacak)

| #   | Madde                                     | Neden ertelendi                                                        | Ne zaman           | FE yansıması                                                |
| --- | ----------------------------------------- | ---------------------------------------------------------------------- | ------------------ | ----------------------------------------------------------- |
| A1  | **IdempotencyKey HTTP middleware**        | ~~Tablo var; HTTP path bağlanmadı~~ → **Faz 9 LOCAL TAMAM**            | —                  | Yok (API-only)                                              |
| A2  | **Checkout `pickupPointId` data wiring**  | API zorunlu; UI dokunulmadı                                            | Frontend data-only | **Yok** — checkout hâlâ göndermeyebilir                     |
| A3  | **Partner → Agency contract**             | Soft → Faz 12–13; **DROP → Faz 14 P0-A LOCAL TAMAM**                   | —                  | **Kısmi** — `/partner` API Agency-native; URL cutover sonra |
| A4  | **LegacyAgency / SubUser DROP**           | ~~Soft önce~~ → **Faz 14 P0-A LOCAL TAMAM**                            | —                  | **Yok** (legacy panel)                                      |
| A5  | **RefreshToken HttpOnly + multi-session** | ~~Tablo var; cookie yok~~ → **Faz 10 LOCAL TAMAM**                     | —                  | Data-only proxy + credentials                               |
| A6  | **User/Partner email partial unique**     | ~~Expand~~ → **Faz 9 LOCAL TAMAM**                                     | —                  | Yok (DB)                                                    |
| A7  | **TourDate full UNIQUE**                  | Partial unique uygulandı                                               | Opsiyonel          | Yok (DB)                                                    |
| A8  | **Experience bağımsız mağaza**            | MVP kapalı                                                             | Ürün               | **Yok** (bilinçli)                                          |
| A9  | **Neon migrate**                          | Local only                                                             | Onay               | Yok                                                         |
| A10 | **Seed (Agency+OWNER)**                   | ~~Onay~~ → **Faz 9 seed polish LOCAL** (çalıştırma: `prisma:seed`)     | Local              | Yok                                                         |
| A11 | **Guide / Bus JWT + panel**               | JWT login → **Faz 10 API TAMAM**; B2/B3 shell + **B6 müsaitlik LOCAL** | FE panel           | **Kısmi** — atama inbox **P0-B5** yok                       |
| A12 | **busSeatLayoutId FK**                    | Faz 5 tamam                                                            | —                  | **Yok** — acente koltuk UI yok                              |
| A13 | **PDF/manifest export**                   | API map var                                                            | Sonra              | **Yok**                                                     |
| A14 | **Müşteri checkout koltuk**               | v1 kasıtlı yok                                                         | Ürün               | **Yok** (bilinçli)                                          |

### B) Fazlar — backend durum + frontend yansıması

| Faz                                                               | Backend (local)              | Frontend yansıması                                                                          |
| ----------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------- |
| **0** Şema kilidi                                                 | Tamam                        | Yok (docs)                                                                                  |
| **1** Identity expand (Agency, Guide, Bus, RefreshToken…)         | Tamam                        | **Yok** — AgencyStaff login / Guide / Bus panel yok; UI Partner                             |
| **2** Catalog + Room DROP + TourExtra / agencyId                  | Tamam                        | **Kısmi** — tur listesi/detay eski API ile çalışır; Room UI ölü; TourExtra/boarding **yok** |
| **3** Hold 10dk + Guest + Extra + Invoice snapshot                | Tamam                        | **Yok** — checkout hold/pickup/guest/extra/invoice yeni alanlar wiring yok                  |
| **4** TourDateAssignment + availability                           | Tamam                        | **Kısmi** — müsaitlik paneli **P0-B6**; atama kabul/red **P0-B5** yok                       |
| **5** BusSeatLayout + SeatAssignment MANUAL/AUTO_FIFO             | Tamam                        | **Yok** — otobüs haritası / koltuk yerleştirme UI yok                                       |
| **6** Review → Outbox → TourMetrics; Tag/RelatedTours             | **LOCAL TAMAM**              | Mevcut review UI kısmen var; **Outbox/TourMetrics/related wiring yok**                      |
| **7** Commission / Earning / Payout / BankInfo                    | **LOCAL TAMAM**              | **Yok** — finans/payout paneli wiring yok                                                   |
| **8** Notification çok aktör · Favorite · Coupon · SearchQueryLog | **LOCAL TAMAM**              | **Yok/kısmi** — multi-aktör inbox, favori, kupon/kampanya wiring yok                        |
| **9** Idempotency HTTP · AuditLog · partial unique · seed         | **LOCAL TAMAM**              | **Yok** — FE Idempotency-Key / audit UI yok (API-only)                                      |
| **10** Auth P0 Refresh + multi-actor JWT                          | **LOCAL TAMAM**              | Data-only: proxy + credentials + silent refresh (panel UI yok)                              |
| **11** Middleware auth/role + session probe                       | **LOCAL TAMAM**              | Redirect guard; tasarım yok                                                                 |
| **12** Partner→Agency soft contract                               | **SUPERSEDED** (Faz 14)      | Link + dual-write; UI Partner kalır                                                         |
| **13** AgencyStaff→partner panel bridge                           | **LOCAL TAMAM**              | Data-only: seller login + `/partner` API; **UI aynı**                                       |
| **14** P0-A hard contract (DROP Partner/LegacyAgency/SubUser)     | **LOCAL TAMAM**              | Agency-native API `/partner/*`                                                              |
| **15** P0-B panel cutover B1–B3                                   | **LOCAL TAMAM**              | `/acente` · `/rehber` · `/otobus` giriş+shell+dashboard                                     |
| **15b** P0-B6 Guide/Vehicle müsaitlik                             | **LOCAL TAMAM**              | `/rehber/musaitlik` · `/otobus/araclar` · identity availability API                         |
| Sonra                                                             | B4–B5 (koltuk/atama) · Neon… | Üst tablo (**⬆ SONRA**)                                                                     |

**Kural:** FE “yok” = `apps/web` bu turda **bilerek** dokunulmadı. Sonra: **tasarım değiştirmeden** sadece data wiring.

### C) Bilinçli asla / yasak (hatırlatma)

- **Room / otel satışı** — DROP; geri gelmez
- **UI / tasarım** — migrate sırasında dokunulmaz; bozulursa data wiring ile yeni mimariye çek
- **Cloudflare / Storage upload algoritması** — dokunulmaz
- **Push / Neon** — açık onay olmadan yok

### D) Bozulursa tamir politikası

Eski Partner path’e geri sarma yok. Kırılan yer **Agency / agencyId / hedef şema** ile rebuild edilir; tasarım korunur.

---

## 2026-07-28 — Sprint 25 hazırlık bulguları

### 1) Auth middleware için gerekli cookie mevcut değil

- Vercel preview ortamında görülen cookie'ler:
  - `__vercel_toolbar`
  - `__vercel_jwt`
- Bunlar platform/tooling cookie'leri; uygulama auth cookie'si değildir.
- `apps/web/src/providers/auth-provider.tsx` içinde auth durumu memory'de tutuluyor:
  - `accessToken` localStorage/cookie yerine React state'te saklanıyor.

**Sonuç:**  
`apps/web/src/middleware.ts` içinde cookie tabanlı role/auth redirect'i güvenli biçimde tamamlamak şu an mümkün değil (yanlış redirect/loop riski).

**Geçici güvenli uygulama:**  
Middleware sadece korunan rotalarda `Cache-Control: no-store` header'ı set edecek şekilde bırakıldı (fonksiyonellik bozulmadan düşük riskli adım).

---

### 2) 25.2 maddesi (middleware) kısmi tamamlandı

- Tamamlanan: route matcher + no-store cache koruması.
- Eksik kalan: cookie tabanlı auth/role redirect.

**Neden eksik bırakıldı:**  
Projede HttpOnly refresh cookie akışı henüz yok; auth tamamen client memory state'e bağlı.

---

### 3) Sonraki sprint için önerilen net aksiyon

#### Aksiyon A — Auth cookie altyapısı (ön koşul)

1. API tarafında refresh token'ı HttpOnly cookie olarak set et.
2. Cookie adı/özellikleri standartlaştır:
   - Örn: `refreshToken`
   - `HttpOnly`, `Secure`, `SameSite=Strict`, uygun `Path`/`Domain`
3. Frontend login/refresh akışını bu modele bağla.

#### Aksiyon B — Middleware 25.2'yi tamamla

1. Middleware'de yalnızca doğrulanmış auth cookie'ye bak.
2. Whitelist + role bazlı redirect kurallarını aktive et.
3. Redirect loop testlerini zorunlu smoke test'e dahil et:
   - guest -> partner/admin/profile/bookings/checkout
   - partner/admin/customer role geçişleri
   - logout sonrası korunan sayfalar

---

### 4) Risk notu

- Cookie altyapısı eklenmeden middleware'e agresif redirect eklemek, özellikle partner/admin girişlerinde erişim kaybı ve login loop riski oluşturur.
- Bu nedenle mevcut yaklaşım: **önce güvenli/no-store**, sonra cookie altyapısıyla **tam auth middleware**.

---

### 5) 25.9 — Pages Router `_error.tsx` (tamamlandı — kaldırıldı)

**Dosya:** ~~`apps/web/src/pages/_error.tsx`~~ (silindi; `pages/` klasörü de boş kaldığı için kaldırıldı)

**Ne işe yarıyordu:**

- Build-only plumbing; App Router monorepo quirk için `/500` prerender.

**Deney (2026-07-28):**

1. Baseline: `pnpm --filter web build` — `_error` ile **yeşil**.
2. `_error.tsx` + `src/pages/` kaldırıldı → build tekrar — **yeşil** (exit 0).
3. Sonuç: quirk bu ortamda artık gerekli değil → dosya **kalıcı silindi**.

**Karar:** Kaldırıldı. App Router `not-found.tsx` duruyor; `error.tsx` / `global-error.tsx` bu turda eklenmedi (UI değişikliği yok).

**Not:** Build hâlâ `Skipping validation of types` / `Skipping linting` (`ignoreDuringBuilds`) — 25.8 ayrı madde.

---

### 6) 25.11 — Placeholder image URL temizliği (ertelendi)

**Sprint maddesi:** unsplash / pexels / picsum → sadece CDN veya API proxy.

**Mevcut durum (örnekler):**

- Hardcoded Unsplash: `hero.tsx`, `login`, `partner-verification`, `campaigns`, vb.
- `media.ts` zaten unsplash/pexels/picsum host’larını tanıyor (allowlist / resolve).
- Prod medya modeli: R2 + `CDN_URL` / `media.turta.com` — bkz. `docs/CDN_CLOUDFLARE.md`.

**Karar (şimdilik):**

- Placeholder URL’lere **dokunulmadı** — acele replace tasarımı / boş görsel riski yaratır.
- 25.11, Cloudflare entegrasyonu tamamlandıktan sonra yapılacak.

**Planlanan yol:**

1. **Admin paneline bağlanarak Cloudflare entegrasyonu kurulacak** (R2 / CDN ayarları, env, medya yönetimi admin üzerinden).
2. Marka / marketing görselleri CDN’e (`media.turta.com` veya API media proxy) yüklenecek.
3. Sonra hardcoded unsplash/pexels/picsum URL’leri CDN adresleriyle değiştirilecek; `next.config` `remotePatterns` sadeleştirilecek.
4. UI parity korunacak — görsel içeriği aynı kalacak, sadece kaynak host değişecek.

**Ön koşul:** Admin ↔ Cloudflare (R2/CDN) entegrasyonu + çalışan `CDN_URL`.
**Bu sprintte yapılmaz** — bulgu olarak sonraki işe bırakıldı.

---

### 7) 25.12 — Stale import / unused file audit (rapor)

**Kapsam:** `apps/web/src/lib`, `services`, `hooks`, `components/ui` (import sayımı).  
**Durum:** Tarama yapıldı; güvenli silme uygulandı (2026-07-28).

#### Silindi (0 import)

| Dosya                                                              | Neden                                                                                                                     |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| ~~`apps/web/src/lib/utils/normalize-error.ts`~~ + boş `lib/utils/` | Hiçbir yer import etmiyordu. Aynı isimde daha basit `normalizeError` zaten `partner-tour-helpers.ts` içinde kullanılıyor. |

#### Kullanılıyor — silinmez (yanlış pozitif risk)

| Dosya / alan                                                   | Not                                                       |
| -------------------------------------------------------------- | --------------------------------------------------------- |
| `lib/partner/reviews/types.ts`                                 | Doğrudan import az; `client.ts` re-export ediyor → canlı. |
| Tüm `lib/*.ts` (bank-transfer, health-privileges, operator, …) | En az 1 tüketici var.                                     |
| Tüm `services/*.ts`, `hooks/*`                                 | En az 1 tüketici var.                                     |

#### Bilinçli bırak (dead code değil / kit)

| Dosya                                                                            | Neden                                                                                                               |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `components/ui/{badge,card,dialog,dropdown-menu,input,select,skeleton,tabs}.tsx` | Sprint 25.7 shadcn kit — henüz sayfalara bağlanmamış; silmek 25.7’yi geri alır. Sayfa restyle yokken adopt edilmez. |
| `button.tsx`, `phone-input.tsx`                                                  | Kullanımda.                                                                                                         |

#### Duplikasyon (silme değil — ileride birleştirilebilir)

| Durum               | Detay                                                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `IMAGE_PLACEHOLDER` | `lib/image-placeholder.ts` (hot-deals) + `lib/partner-tour-helpers.ts` (tour-form). Birleştirmek düşük risk ama ayrı onay. |
| `normalizeError`    | Ölü `utils/normalize-error.ts` vs aktif `partner-tour-helpers` — ölü dosya silinince düzelir.                              |

#### `partner/reviews/types.ts` içinde kullanılmayan export’lar (dosya kalır)

- `EMPTY_PARTNER_REVIEWS_*`, `PartnerReviewsProvider`, `PartnerReviewsSubscription*` — hiçbir consumer yok (legacy Firebase/Prisma abonelik izleri). Export temizliği opsiyonel; davranış değişmez.

#### Uygulanan aksiyon

1. ✅ `lib/utils/normalize-error.ts` + boş `lib/utils/` silindi.
2. ✅ shadcn unused kit’e dokunulmadı.
3. IMAGE_PLACEHOLDER birleştirme ertelendi (opsiyonel).
4. Sprint 25 DoD 25.12: audit + güvenli silme tamam.

---

### 8) URL’leri tamamen Türkçeleştirme (Opsiyon A) — ertelendi

**Sprint 25 kararı:** Opsiyon C (karma ama kurallı) kabul edildi. Bu sprintte büyük rename / 301 dalgası yok.

**Neden ertelendi:**

- Kapsam büyük: tüm internal linkler, header/footer, sitemap, servis URL’leri, olası mobil deep link’ler.
- SEO riski: eski path’ler için 301 zorunlu; yanlış redirect sıralamayı bozar.
- Sprint 25 amacı yapısal temizlikti; URL dil reformu ayrı ürün kararı.

**Mevcut (Opsiyon C) sınırlar:**

| Segment            | Dil                 | Örnek                                                    |
| ------------------ | ------------------- | -------------------------------------------------------- |
| Marketing listeler | İngilizce           | `/tours`, `/activities`, `/routes`                       |
| Kategori landing   | Türkçe              | `/gastronomi`, `/kultur-turlari`, `/macera-aktiviteleri` |
| Auth / panel       | İngilizce           | `/login`, `/partner/*`, `/admin/*`                       |
| Yasal              | EN path + TR içerik | `/faq`, `/privacy`, `/terms`                             |

**Sonraki sprintte yapılacak (Opsiyon A — ürün onayıyla):**

| Eski                                                     | Yeni                | Redirect |
| -------------------------------------------------------- | ------------------- | -------- |
| `/tours`                                                 | `/turlar`           | 301      |
| `/tours/[id]`                                            | `/turlar/[id]`      | 301      |
| `/activities`                                            | `/aktiviteler`      | 301      |
| `/activities/[id]`                                       | `/aktiviteler/[id]` | 301      |
| `/routes`                                                | `/rotalar`          | 301      |
| `/routes/[id]`                                           | `/rotalar/[id]`     | 301      |
| `/about`                                                 | `/hakkimizda`       | 301      |
| `/contact`                                               | `/iletisim`         | 301      |
| `/login`                                                 | `/giris`            | 301      |
| `/register`                                              | `/kayit`            | 301      |
| `/profile`                                               | `/profil`           | 301      |
| `/bookings`                                              | `/rezervasyonlarim` | 301      |
| `/checkout`                                              | `/odeme`            | 301      |
| `/blog`                                                  | `/blog`             | —        |
| `/gastronomi`, `/kultur-turlari`, `/macera-aktiviteleri` | (aynı)              | —        |

**DoD (ileride):**

1. Ürün onayı (Opsiyon A).
2. Next.js route klasör rename + tüm internal link güncellemesi.
3. Middleware veya `next.config` redirects ile 301.
4. Sitemap / canonical güncellemesi.
5. Smoke: eski URL → yeni URL; SEO kırığı yok.
6. Mobil / harici bookmark etkisini kontrol.

**Kaynak:** `docs/SPRINT_25_CLEANUP.md` → URL Stratejisi Kararı (25.4).

---

### 9) `/routes/[id]` — Hydration mismatch + rota CMS (ertelendi)

**Gözlem (2026-07-28):**  
`http://localhost:3001/routes/kapadokya` açılınca Next.js overlay:

> Hydration failed because the server rendered HTML didn't match the client.

**Muhtemel kök neden (kod):**

1. `apps/web/src/app/(marketing)/routes/[id]/page.tsx` — `RouteDetailClient` `useSearchParams()` kullandığı için `Suspense` ile sarılı.
2. **Sunucu HTML:** Suspense fallback → `"Yükleniyor..."`
3. **İstemci ilk render:** `RouteDetailClient` state `loading === true` → `"Rota yükleniyor..."`
4. Metin / DOM ağacı eşleşmediği için hydration fail; React ağacı client’ta yeniden üretilir (overlay “1/2 Issues”).

**İkincil / katkı riskleri:**

- Layout `Header` (`mounted`, scroll) — genelde `useEffect` sonrası; ilk paint’te daha az şüpheli.
- Tarayıcı eklentileri DOM’u bozabilir (Next overlay’de de listeleniyor).
- (Ayrı bug, düzeltilmiş) API `{ success, data }` unwrap edilmiyordu → rota detay takılıyordu; TS branch’te unwrap + `toursByCategory` fallback eklendi. Hydration’ın asıl sebebi bu değil.

**Şimdilik yapılmayacak:** Hydration fix’i bu turda zorunlu değil; overlay dev-only, prod’da çoğu kullanıcı görmez ama SSR/SEO için sonra düzeltilmeli.

**Önerilen teknik fix (sonra, küçük PR):**

- Suspense fallback metnini client loading ile **aynı** yap (`Rota yükleniyor...`), veya
- Fallback’te client ile birebir aynı markup kullan, veya
- Rota detayı için `useSearchParams` bağımlılığını azaltıp SSR-friendly fetch (page’den prop) — admin CMS ile birlikte düşünülür.

---

#### İleride: Rota içeriği + bağlantılar — Admin / Editor hesabı

**Ürün kararı (kullanıcı):**  
Rota sayfalarının düzenlenmesi ve bağlantıları **editor / admin hesabından** yönetilecek. Şimdi hardcoded / seed / marketing static akış kalır; CMS eklenmeyecek.

**Sonraki sprint kapsamı (taslak):**

| Alan      | Not                                                                        |
| --------- | -------------------------------------------------------------------------- |
| Kim       | `ADMIN` / `SUPER_ADMIN` (veya ayrı `EDITOR` rolü — ürün onayı)             |
| Ne        | Rota metinleri, görseller, linkler, kategori ilişkileri, tur eşlemeleri    |
| Nerede    | `/admin/...` paneli (mevcut admin shell’e uyum)                            |
| API       | Catalog veya content modülü — CRUD + ownership/RBAC                        |
| Web       | `/routes/[id]` API’den okusun; admin yazsın                                |
| Hydration | CMS ile SSR snapshot (generateMetadata + server fetch) uyumlu tasarlanmalı |

**Bu sprintte:** Sadece bulgu; admin rota editörü **implement edilmez**.

---

### 10) Partner “Turu Oluştur” → Unauthorized (canlı / Vercel) — 2026-07-29

**Gözlem (ekip testi, canlı UI):**

- Ortam: Vercel (`turladur-zjyf.vercel.app` / canlı preview-prod web).
- Senaryo: Partner panel → **Yeni Tur Oluştur** → form dolduruldu (dahil olanlar, tarihler, yaş indirimleri, pickup noktaları) → **Turu Oluştur** → kırmızı **Unauthorized**.
- Üst bar hâlâ girişli görünüyor (örn. “Demo Partner” avatar/isim).
- Tester notu: _“En son tur tarihlerini girdim turu oluştur dedim hata aldım.”_

**Net sebep (cache değil):**

| Katman        | Durum                                                                                                                       |
| ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Access JWT    | Kısa ömürlü — varsayılan **`JWT_EXPIRES_IN=15m`** (`apps/api/.env.example`, `identity.service` / `auth.module`)             |
| Token saklama | **Sadece React memory** (`AuthProvider` — localStorage/cookie yok; güvenlik kuralı)                                         |
| Refresh       | **Yok** — HttpOnly refresh cookie + rotate + sessiz yenileme implement edilmedi                                             |
| UI vs API     | Login sonrası `user` state kalır → header “girişli”; token expire olunca Nest **401** → UI `error.message` ≈ `Unauthorized` |

Uzun partner formu (özellikle tarih/kontenjan adımı) kolayca **15 dakikayı aşar**. Submit anında Authorization header’daki access token geçersizdir; tarayıcı cache’i POST’u 401 yapmaz.

**Cache hipotezi neden zayıf:**

- Create tour **POST** — tipik HTTP cache’e konu değil.
- Hata metni Nest/JWT guard **Unauthorized**; stale HTML/CSS ile uyumsuz.
- Aynı oturumda kısa sürede tekrar denerse (token hâlâ geçerliyse) geçebilir; uzun doldurmada tekrarlar → süre ile korele.

**Geçici kullanıcı workaround (kod yok):**

1. Partner logout → `/partner-login` tekrar.
2. Formu **~15 dk içinde** tamamla / kritik adımları böl.
3. Hard refresh tek başına yetmez (token memory’de; süre dolunca yine 401).

**Mimari sağlamlaştırma (zorunlu sonraki iş — Sprint önceliği yüksek):**

Bu madde §1–§3 (auth cookie / middleware) ile **aynı kök problem**. Ürün stabilitesi için auth stack’i security rules ile hizala:

#### A — Refresh token altyapısı (ön koşul)

1. API login/register: **access (kısa)** + **refresh (uzun, rotate)** üret.
2. Refresh’i **HttpOnly + Secure + SameSite=Strict** cookie ile set et (localStorage yok).
3. Access hâlâ memory (veya kısa ömürlü; XSS’e token yazma).
4. `POST /identity/auth/refresh` (veya mevcut identity altında): cookie ile yeni access (+ rotate refresh).
5. Logout: refresh cookie invalidate + clear.
6. **Oturum ömrü (ürün kararı):** idle/absolute logout **1 ay** — partner sürekli çıkarılmamalı.
   - Refresh cookie / session TTL ≈ **30 gün** (1 ay); sliding yenileme: her başarılı refresh’te süre uzatılabilir (max absolute cap ürün onayıyla).
   - Access kısa kalır (örn. 15m); süre dolunca sessiz refresh, kullanıcıyı panelden atma.
   - security.mdc’teki “7 gün” örnek değeri bu ürün kararıyla **partner/dashboard için 30 güne** güncellenecek (ayrı rules PR).
7. **Sessiz refresh frekansı — sürekli değil (operasyon yükü):**
   - **Yanlış:** her N saniyede bir timer ile `/refresh` poll (CPU, DB, rate-limit, batarya).
   - **Doğru (event-driven, seyrek):**
     | Tetikleyici              | Ne zaman                                                                         | Beklenen sıklık                                                   |
     | ------------------------ | -------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
     | Sayfa mount / F5         | Cookie ile 1 kez restore                                                         | Sekme açılışı başına 1                                            |
     | API **401**              | Access ölmüş → 1 refresh + orijinal isteği retry                                 | Access TTL’ye yakın (örn. ~15 dk’da en fazla 1, aktif kullanımda) |
     | Proaktif (opsiyonel)     | Access bitmesine ~60–90 sn kala, **yalnızca sekme görünür + kullanıcı aktifken** | Aktif sekmede ~15 dk’da 1                                         |
     | Idle / arka plan sekmesi | Refresh **yapma**; kullanıcı dönünce mount veya sonraki API 401 yolundan         | 0                                                                 |
   - Özet: 1 ay = refresh **token ömrü**; sessiz refresh = **access yenileme olayı** (~çeyrek saatte bir, aktifken). Sürekli stream yok.

#### B — Frontend sessiz yenileme

1. `api-client`: **401** → bir kez refresh dene → retry; fail → logout + partner-login’e yönlendir.
2. Uzun formlar (tur oluştur / düzenle): submit öncesi opsiyonel proaktif refresh veya “oturum dolmak üzere” uyarısı.
3. Kullanıcıya ham `Unauthorized` yerine TR mesaj: _“Oturum süresi doldu, tekrar giriş yapın.”_

#### C — Middleware + smoke (A’dan sonra)

1. §3 Aksiyon B: cookie ile korunan route redirect (partner/admin/profile…).
2. DoD smoke: partner tur oluşturma >15 dk simülasyonu (expire + refresh + başarılı create); logout sonrası 401.

**İlgili dosyalar (referans, bu turda değiştirilmedi):**

- `apps/web/src/providers/auth-provider.tsx`
- `apps/web/src/services/api-client.ts`
- `apps/web/src/app/(partner)/partner/tours/new/page.tsx` (`submitError`)
- `apps/api/src/modules/identity/services/identity.service.ts` (`expiresIn`)
- `docs/bulgular.md` §1–§3
- `.cursor/rules/security.mdc` (Access 15m / Refresh 7g / HttpOnly)

**Karar:** Bu turda kod yok — sadece bulgu. Auth refresh + sessiz yenileme **ayrı sprint / P0 mimari iş**; partner CRUD canlı testi öncesi veya hemen sonrası planlanmalı.

---

### 11) Partner / Editor panel — sayfa yenileyince “logout” (canlı) — 2026-07-29

**Gözlem (ekip testi, canlı):**

1. Partner (tur operatörü) turu oluşturup yayına gönderdi.
2. Editor hesabı turu onayladı.
3. Partner, “yayına alındı mı?” diye **Partner Dashboard’da sayfayı yeniledi** → panelden **atıldı** (yeniden login gerekir).
4. Aynı denemede **editor hesabında da** panel sayfası yenilenince **yine atıldığı** gözlemlendi.

**Net sebep — eşzamanlı giriş “birbirini drop” etmiyor:**

Bu davranış, editor onayının partner oturumunu sunucuda iptal etmesinden **kaynaklanmıyor**.

Kodda tur onay / publish akışı tipik olarak **catalog cache invalidate** eder; identity tarafında “diğer kullanıcının JWT’sini revoke et / tek oturum zorunluluğu” yok (access token stateless JWT; refresh/session store henüz yok).

Asıl mekanizma:

| Adım                   | Ne olur                                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------- |
| Login                  | `accessToken` + `user` → **React memory** (`AuthProvider`)                                                |
| F5 / soft-hard refresh | JS bundle yeniden yüklenir → **memory state sıfır**                                                       |
| İlk paint              | `accessToken === null` → `isAuthenticated === false` → partner/admin shell login’e düşer veya “giriş yok” |

Yani hem partner hem editor **kendi tarayıcısında yenileyince kendi oturumunu kaybeder**. Diğer kişinin online olması bunu tetiklemez; zamanlama (onay sonrası yenileme) korelasyon, nedensellik değil.

§10 (Unauthorized / 15 dk) ile **aynı kök aile**: kalıcı oturum yok + refresh cookie yok. §10 = süre dolunca API 401 (UI hâlâ “girişli” görünebilir). §11 = **yenilemede UI oturumu tamamen silinir**.

**Ürün gereksinimi (açık):**

- Aynı anda birden fazla kişi (partner + editor + customer) **bağımsız login** kalabilmeli.
- Birinin işlem yapması (tur onay, yayın) **diğerini otomatik drop etmemeli**.
- Sayfa yenileme / sekme kapat-aç **oturumu düşürmemeli**.
- **Partner (ve editor/admin panel) oturum ömrü: 1 ay** — sürekli logout / “yine giriş yap” kabul edilmez.
- Bilinçli logout / şifre değişimi / güvenlik revoke hariç.

**Çözüm — mimariye uygun (security.mdc + §1–§3 + §10 ile hizalı):**

#### A — Oturum sürekliliği (refresh cookie) — §10 A ile aynı

1. Login: kısa access (memory) + uzun **refresh HttpOnly cookie** (Secure, SameSite=Strict).
2. Sayfa yüklenince (`AuthProvider` mount): refresh cookie ile sessiz `POST .../refresh` → yeni access + profil; başarısızsa login sayfası.
3. Access **asla** localStorage’a yazılmaz (XSS).
4. **TTL ürün kararı: 1 ay (≈ 30 gün).** Partner dashboard’da F5, sekme, günlerce kullanım → sessiz refresh; otomatik atma yok.
5. Access 15m expire olsa bile kullanıcıya “çıktınız” hissi vermeden yenile (§10 B); sadece refresh de ölmüşse (30 gün+) veya bilinçli logout’ta login’e gönder.

#### B — Çoklu eşzamanlı oturum (tek cihaz/kullanıcı drop yok)

1. Refresh token’ları **oturum bazlı** sakla (DB/Redis: `sessionId`, `userId`, `tokenHash`, `expiresAt`, `revokedAt`).
2. **Varsayılan: multi-session** — aynı `userId` için birden fazla geçerli refresh (partner telefon + laptop; editor + partner ayrı hesaplar zaten ayrı userId).
3. **Tek oturum zorunluluğu YAPMA** (login’de diğer session’ları toplu revoke etme) — ürün “aynı anda kişiler log olsun” ister.
4. İsteğe bağlı ileride (ürün onayı): “Diğer cihazlardan çıkış” butonu → bilinçli revoke; otomatik değil.
5. Rotate: her refresh’te eski refresh invalidate + yeni ver (hijack penceresini küçült); paralel sekmeler için dikkat — ya refresh lock ya da aile token modeli (sonraki tasarım detayı).

#### C — Partner ↔ Editor etkileşimi

1. Tur onay/publish: **sadece catalog/domain**; identity session’a dokunma (bugün de böyle; böyle kalsın).
2. Partner dashboard “yayında mı?” için: yenileme güvenli olmalı (A sayesinde) veya soft poll/SSE — oturum düşmeden status güncellenir.

#### D — DoD / smoke (canlı öncesi)

- [ ] Partner login → F5 → hâlâ partner dashboard
- [ ] Editor login → F5 → hâlâ admin/editor panel
- [ ] Partner + editor aynı anda iki tarayıcıda login → editor tur onaylar → partner F5 → **hâlâ login** + tur status güncel
- [ ] Partner logout → sadece o oturum ölür; editor etkilenmez
- [ ] Access 15 dk expire + refresh → sessiz yenileme; ham Unauthorized yok (§10 B)
- [ ] Partner login → ~30 gün (veya testte TTL kısaltılmış simülasyon) içinde F5 / yeniden açılış → hâlâ login; sürekli logout yok
- [ ] 1 ay+ (TTL sonrası) → tek seferlik login sayfası (beklenen); arada keyfi atma yok

**Geçici workaround (kod yok):**

- Panelde F5 kullanma; status için mümkünse navigasyon/link ile git.
- Düştüyse tekrar login (beklenen, root cause düzelene kadar).

**Karar:** Kod değişikliği yok — bulgu. §10 + §11 tek P0 epikte birleşmeli: **HttpOnly refresh (TTL 1 ay) + mount’ta restore + multi-session + 401 sessiz yenileme + partner’ı sürekli çıkarmama**. Middleware (§3 B) bundan sonra.
