# Revize Planı — Turlar + Partner Onboarding

> **Tür:** Sadece plan. Kod / migrate / Cloudflare / checkout **yok**.  
> **Tarih:** 2026-08-11  
> **Kaynak:** Turlar ekranı + partner kayıt/profil geri bildirimi  
> **Kilidi:** `ARCHITECTURE.md` · `PHASE_0_SCHEMA_LOCK.md` · `BACKEND_BUILD_ORDER.md` · `CDN_CLOUDFLARE.md`

Bu doküman uygulama sırasını sabitler. Uygulama ayrı onayla, paket paket yapılır.

---

## 0. Evrensel kurallar (en başta oku)

Bu maddeler her paketin üstündedir. Çelişirse **bu bölüm kazanır** uı cloudflare akışları checkout akışları bozmayacakssın.

### 0.1 Mimari

| Kural              | Anlamı                                                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| FE ↔ BE ayrı       | `apps/web` Prisma / DB görmez. Sadece HTTP (`/api/v1/...`).                                                                 |
| Modüler monolit    | Catalog, booking, identity, notification, admin birbirinin **service**’ini import etmez.                                    |
| Modüller arası     | Sadece event (`EventEmitter2`) veya kuyruk (`BullMQ`).                                                                      |
| Şema sınırı        | Catalog tabloları `catalog.*`, acente `identity.Agency`. Cross-schema service yok.                                          |
| Response           | `{ success, data, error, meta? }`                                                                                           |
| Auth               | Public olan `@Public()`. Partner/acente yazma: JWT + ownership (`agencyId`). Admin: `ADMIN` / `SUPER_ADMIN` / `PLATFORM_*`. |
| Soft delete        | `deletedAt`. Fiziksel silme yok.                                                                                            |
| Breaking API       | Yasak. Yeni query/field ekle; eskisini kırarak silme. Mobil + web aynı Nest API.                                            |
| Shared sözleşmeler | Enum / DTO yüzeyi `packages/shared-types` + `shared-constants` + `shared-validators`.                                       |
| İsimlendirme       | Kod İngilizce. Dosya `kebab-case`. `any` yok.                                                                               |

### 0.2 UI (parity — redesign yok)

| ASLA                                                            | İZİN                                                                    |
| --------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Turlar sayfasını yeniden tasarlamak                             | Mevcut hero / sidebar / kart hiyerarşisini koru                         |
| Filtreleri üst bara taşımak                                     | Aynı yerleşimde yeni seçenek ekle                                       |
| Checkout adımlarını, ödeme iframe’ini, sepet UI’ını değiştirmek | Checkout’a **sadece** voucher/mail tarafında yansıyan data (dokunma UI) |
| “Daha temiz” boş sayfa / stub                                   | Eksik endpoint’te UI kalsın, data wiring yapılsın                       |
| Palette / brand token değiştirmek                               | Mevcut token’lar                                                        |

İstisna: Bu plandaki **akış** değişiklikleri (arama kaydırma, tur türü ilk soru, ülke/şehir dropdown, “Başvurunuzu aldık” metni) mevcut sayfa iskeleti içinde, aynı görsel dilde yapılır. Yeni bir tasarım sistemi açılmaz.

### 0.3 Cloudflare / CDN / checkout — DOKUNULMAZ

| Alan                              | Kural                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------ |
| Cloudflare R2 / `media.turta.com` | Env, bucket, custom domain, cache header, `CDN_URL` **dokunulmaz**.                              |
| Presigned upload algoritması      | `POST /storage/presigned-url` → PUT R2/MinIO → DB’ye URL. Tur `folder: tours` yolu **bozulmaz**. |
| Checkout                          | `(customer)/checkout/**`, İyzico, hold, `pickupPointId` seçim UI’sı bu revizede **yok**.         |
| Neon / prod migrate               | Ayrı açık onay. Local migrate pakette belirtilir.                                                |
| Push                              | Kullanıcı demeden `git push` yok.                                                                |

### 0.4 Storage kuralı (logo vs tur fotoğrafı)

Mevcut allowlist (`storage.dto.ts`):

`hotels` · `tours` · `activities` · `operators` · `users` · `documents`

- Tur / galeri → **sadece** `tours` (ve otel/aktivite için kendi klasörleri).
- Acente logo / profil → **`operators`** (`operators/{agencyId}/logo.webp`).
- `partners` klasörü **yok**. Acente ayarları bugün `folder="partners"` gönderiyor → validation hatası. Düzeltme: FE `operators` kullanır. Allowlist’e yeni “tur benzeri” klasör eklenmez.
- Tur upload DTO / `generateKey` / confirm akışı **refactor edilmez**. Sadece yanlış `folder` çağrısı düzeltilir.

### 0.5 İş paketi disiplini

1. Paket bitmeden sonrakine geçilmez (bağımlılık sırası).
2. Her paket: önce anlat → onay → uygula.
3. Bitince Türkçe rapor + ilgili rule checklist.
4. UI değişen paketlerde browser smoke (`docs/SPRINT_END_TEST_SCENARIOS.md`).

---

## 1. Kapsam dışı (bu revize)

- Checkout UI / ödeme / 3DS
- Cloudflare / R2 / CDN kurulumu
- Neon / staging / prod deploy
- UI redesign, yeni renk, kart layout değişimi
- Tur fotoğraf upload algoritmasını yeniden yazmak
- P0-B4/B5 koltuk-atama (ayrı hat: `bulgular.md`)
- Yeni `EDITOR` rolü icat etmek (aşağıda mevcut rollerle eşlenir)

---

## 2. Mevcut durum (kök neden — kod taraması)

Uygulamaya girmeden önce teşhis. Tahmin değil; repo gerçeği.

### 2.1 Turlar — kalkış şehri filtresi yanlış sonuç veriyor

| Katman                     | Gerçek                                                                                                                      |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Nest `SearchToursDto`      | `departureCity` **yok**. Server sadece `q`, `category`, `duration` / `durationDays`, fiyat, rating, `featured`, `agencyId`. |
| FE `tours-page-client.tsx` | Kalkış / bölge **bilinçli client-side**. Yorum: _“extras (kalkış/bölge) client-side”_.                                      |
| Veri                       | `Tour.departureCity` kolonu yok. Değer `Tour.extras.departureCity` (string veya dizi) JSON çantasında.                      |
| Eşleşme                    | `matchesClientExtrasFilters`: `city === needle \|\| city.includes(needle)`.                                                 |
| Facet                      | API facet endpoint yok. İlk `limit=100` tur üzerinden sayaç.                                                                |

**Sonuç:** Ankara filtresi Nest’e gitmiyor. İlk 100 satır + gevşek `includes` + extras yazım farkı (İstanbul / istanbul / “İstanbul çıkışlı”) Antalya turunun listelenmesine yol açabilir. Filtre **endpoint’te yok**; “endpoint bozuk” değil, **sözleşme eksik**.

### 2.2 Günübirlik / Haftalık → “Tur bulunamadı”

Header (`header.tsx`):

- Günübirlik → `/tours?duration=1`
- Haftalık → `/tours?duration=7`

Nest `duration` allowlist: `'1' | '2-3' | '4-6' | '7+'`.

FE davranışı:

- `1` → server `duration=1` → `durationDays` min=max=1. Tur `extras.tourType = "Günübirlik Tur"` ama `durationDays` 2 ise **düşer**.
- `7` allowlist’te **yok** → FE `durationDays=7` (tam 7 gün). 8–10 günlük “haftalık” turlar **sıfır sonuç**.

Ayrıca `period` filtresi `extras.period` arar; çoğu turda boş → ek boş liste riski.

### 2.3 Tur oluşturma — tür ilk soru değil

`tourType` serbest select (`Günübirlik Tur` vb.), `extras` JSON’a yazılıyor. Yurtiçi / yurtdışı birinci sınıf alan değil. Public filtre `tourType`’ı bazen `TourCategory` (CULTURAL…) sanıyor — iki kavram karışmış.

### 2.4 Yolcu alım noktası — konum yok

`TourPickupPoint`: `city`, `location` (metin), `time`. **lat / lng / placeId yok**.  
Voucher mail’de metin var (`pickupLocation` + saat). Harita / Maps linki yok.  
Checkout UI bu revizede dokunulmaz; boarding seçimi zaten ayrı (Faz 3).

### 2.5 Partner kayıt

| Beklenen              | Gerçek                                                                                                                                                                                         |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Şehir / ülke dropdown | Serbest text                                                                                                                                                                                   |
| Ülke → alan kodu      | `PhoneInput` müşteri kayıtta var; partner kayıtta bağlı değil                                                                                                                                  |
| Website → profil      | Formda var; `registerPartner()` **göndermiyor**. `RegisterPartnerDto`’da `website` / `city` / `country` yok. `Agency.website` kolonu boş kalır.                                                |
| “Başvurunuzu aldık”   | Submit sonrası `/partner-verification?email=...` (eski e-posta doğrulama). `verifyPartner` **kaldırılmış** (`LEGACY_PARTNER_VERIFY_DROPPED`).                                                  |
| Talep → admin/editor  | `Agency.status = PENDING` oluşuyor. `/admin/agencies` kuyruğu var. Ayrı “talep” modeli yok.                                                                                                    |
| Onay maili            | `PATCH admin/agencies/:id/approve` → `partner.verified` + `partner-approved` kuyruğu **zaten var**. Login URL hâlâ `/partner-login` (cutover sonrası `/acente/giris` olmalı — küçük düzeltme). |

### 2.6 Logo upload uyarısı

Acente ayarlar: `ImageUploadField folder="partners"`.  
DTO allowlist’te `partners` yok → tam olarak ekrandaki hata.  
Tur upload `folder: 'tours'` — ayrı yol; ona dokunulmaz.

---

## 3. Hedef sözleşme (mimari)

### 3.1 Tur sınıflandırması (catalog, birinci sınıf)

`extras` çantasına yeni iş kuralı gömülmez. Catalog şemasına açık alanlar:

| Alan               | Tip                             | Anlam                                                                               |
| ------------------ | ------------------------------- | ----------------------------------------------------------------------------------- |
| `stayKind`         | `DAY_TRIP` \| `OVERNIGHT`       | Günübirlik / Konaklamalı — **ilk soru**                                             |
| `destinationScope` | `DOMESTIC` \| `INTERNATIONAL`   | Yurtiçi / yurtdışı. `DAY_TRIP` için de sorulur (Kapadokya vs. günübirlik yurtdışı). |
| `departureCities`  | normalize edilmiş şehir listesi | Filtre + facet. JSON serbest metin bırakılmaz.                                      |

`durationDays`:

- `DAY_TRIP` → her zaman `1` (form kilidi).
- `OVERNIGHT` → `>= 2`.

Public arama query (ek alanlar, eskisi durur):

```
GET /api/v1/catalog/tours?stayKind=DAY_TRIP&destinationScope=DOMESTIC&departureCity=Ankara
```

Facet (opsiyonel aynı pakette veya hemen sonra):

```
GET /api/v1/catalog/tours/facets
```

Cache: search key’e yeni param’lar dahil; tur create/update’te `catalog:tours:search:*` invalidate (mevcut kural).

### 3.2 Pickup konum (catalog + notification)

`TourPickupPoint` ek alanlar: `latitude`, `longitude`, `placeId?`, `mapsUrl?`.  
Partner dashboard: Places / Maps picker (mevcut form kartına; layout değişmez).  
Voucher HTML: metin + `mapsUrl` (veya `https://maps.google.com/?q=lat,lng`). **Checkout ekranı yok.**

Booking zaten `metadata.pickup` yazıyor; event ile notification’a gider. Booking service import edilmez.

### 3.3 Partner başvuru (identity + admin + mail)

Yeni “Ticket” tablosu şart değil. Mevcut `Agency(PENDING)` = talep.

Akış:

```
Kayıt formu
  → POST /identity/partners/register
      (city, country, website, phone E.164 dahil persist)
  → Agency PENDING + AgencyStaff
  → partner.registered
       → mail: başvuru alındı (aday)
       → in-app / liste: ADMIN + PLATFORM_ADMIN (editor eşlemesi)
  → UI: /partner-application-received  (doğrulama sayfası değil)
Admin onay
  → mevcut PATCH .../approve
  → partner.verified
  → mail: hesabınız onaylandı + /acente/giris
```

**Editor eşlemesi:** Kodda `EDITOR` yok. Bu planda editor = `PLATFORM_ADMIN` (içerik/onay kuyruğu). Yeni rol **açılmadan** mevcut roller kullanılır. Ayrı `EDITOR` rolü istenirse ayrı onay.

Ülke → alan kodu: kayıt formunda ülke seçilince `PhoneInput` `countryCode` set edilir (müşteri kayıt paterni). Şehir listesi ülkeye bağlı statik TR illeri + ülke paketi; Google Places **kayıt adresinde zorunlu değil** (pickup’ta zorunlu).

---

## 4. Uygulama sırası (bağımlılık)

Önce veri sözleşmesi, sonra arama, sonra onboarding, sonra harita. Cloudflare / checkout yok.

| #      | Paket                                                | Modül                      | Neden bu sırada                         | Risk                                |
| ------ | ---------------------------------------------------- | -------------------------- | --------------------------------------- | ----------------------------------- |
| **R0** | Teşhis kilidi + shared enum’lar                      | shared-constants           | Sonraki paketler aynı isimleri kullanır | Düşük                               |
| **R1** | `stayKind` / `destinationScope` + tur formu ilk adım | catalog + acente tur formu | Filtre ve header linkleri buna bağlanır | Orta — extras geriye dönük okuma    |
| **R2** | Kalkış şehri server filtresi + normalize             | catalog search             | Ankara/Antalya bug’ı burada biter       | Orta — eski extras migrate/backfill |
| **R3** | Public tur filtre revizyonu + header linkleri        | web marketing (data-only)  | R1+R2 olmadan “Tur bulunamadı” düzelmez | Düşük — layout aynı                 |
| **R4** | Turlar arama: animated scroll                        | web tours hero             | Bağımsız, en ucuz UX                    | Düşük                               |
| **R5** | Logo folder `operators`                              | web settings only          | Tur upload’a dokunma                    | Düşük                               |
| **R6** | Partner kayıt persist + ülke/şehir/alan kodu         | identity + auth FE         | Website profil yansıması                | Orta                                |
| **R7** | “Başvurunuzu aldık” + admin kuyruk görünürlüğü       | identity event + admin FE  | Doğrulama sayfası kalkar                | Düşük                               |
| **R8** | Onay maili metin + login URL                         | notification / admin       | Akış R7’ye bağlı                        | Düşük                               |
| **R9** | Pickup Maps + voucher harita linki                   | catalog + mail template    | Checkout yok; Maps API key env          | Orta                                |

R4 ve R5, R1–R3’ten **bağımsız** parallel yapılabilir (onay sonrası). R6–R8 zinciri kendi içinde sıralı. R9 en son: Maps key + voucher HTML.

---

## 5. Paket detayları

### R0 — Sözleşme (kod yok / minimal shared)

- Enum: `TourStayKind`, `TourDestinationScope`
- Şehir normalize kuralı: TR locale, trim, canonical liste (`packages/shared-constants` veya mevcut `departure-cities`)
- Backfill kuralı (R1 migrate notu):
  - `extras.tourType` içerir `günübirlik` → `DAY_TRIP`, aksi `OVERNIGHT` (durationDays === 1 ise DAY_TRIP)
  - `destinationScope` default `DOMESTIC` (bilinmiyorsa; yurtdışı tag/region sonra düzeltilir)

### R1 — Acente tur ekleme: ilk soru tür

**Hedef:** Partner tur oluştururken ilk cevap: Günübirlik mi, Konaklamalı mı? Sonra Yurtiçi / Yurtdışı.

**Dosya adayları (uygulamada netleşir):**

- `schema.prisma` → `Tour.stayKind`, `Tour.destinationScope` + index
- `create-tour.dto` / `update-tour.dto` / `tour.service`
- `tour-form-basic-step.tsx` — mevcut ilk blok; yeni wizard değil, **aynı formun en üstü**
- `partner-tour-submit.ts` / helpers — extras’a yazmayı kes, kolonlara yaz

**Davranış:**

1. `stayKind` zorunlu.
2. `DAY_TRIP` → konaklama tipi disabled (bugün de var); `durationDays = 1`.
3. `destinationScope` zorunlu (her iki türde).
4. Kalkış şehirleri mevcut çoklu seçim; R2 ile normalize.

**Dokunma:** Tur galeri upload, checkout, public kart tasarımı.

### R2 — Kalkış filtresi server-side

**Hedef:** “Ankara çıkışlı” yalnızca Ankara `departureCities` içeren turlar.

- `SearchToursDto.departureCity?: string` (canonical)
- `TourService.search`: JSON extras `includes` **kullanılmaz**. Kolon veya `TourDepartureRule` / normalize tablo.
- Tercih: `departureCities String[]` (Prisma) + `has` / overlap. Extras yalnızca geriye dönük backfill kaynağı.
- FE: `departureCity` query’sini Nest’e gönder; `matchesClientExtrasFilters` kalkış dalı kalkar (bölge ayrı karar).
- Facet: mümkünse `GET .../facets` (city + count). Yoksa geçici: server search + meta. Client 100-limit facet **kapanır**.

**Test:** Ankara seç → Antalya çıkışlı tur gelmez. Seed + en az 1 unit test.

### R3 — Filtre + header (Günübirlik / Haftalık)

**Hedef:** Header ve sidebar, R1 alanlarıyla konuşur.

| UI                 | Query                                                                                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Günübirlik Turlar  | `stayKind=DAY_TRIP` (**`duration=1` değil**)                                                                                                                          |
| Haftalık Turlar    | `duration=7+` (tam `7` değil) ve/veya `stayKind=OVERNIGHT` ürün kararı — **öneri:** header “Haftalık” = `duration=7+`; “Konaklamalı” ayrı chip = `stayKind=OVERNIGHT` |
| Yurtiçi / yurtdışı | `destinationScope=`                                                                                                                                                   |
| Kalkış             | `departureCity=` (R2)                                                                                                                                                 |

Sidebar’a `stayKind` + `destinationScope` eklenir; mevcut süre bucket’ları (`1`, `2-3`…) durur. Layout aynı.

Boş sonuç: gerçekten 0 tur varsa empty state kalır (bugünkü bileşen). Yanlış query yüzünden 0 olmamalı.

### R4 — Arama butonu: animated scroll

`tours-page-hero.tsx` “Ara”: şu an sadece fake loading.

- Sonuç / filtre iskeletine `id` (ör. `tours-results`)
- `scrollIntoView({ behavior: 'smooth', block: 'start' })`
- Mobil offset: sticky header yüksekliği kadar `scroll-margin-top`
- Tasarım değişmez

### R5 — Logo / profil görseli

- `acente/settings`: `folder="operators"`, `entityId=agencyId`
- Allowlist **aynı** kalır
- Tur formundaki `folder: 'tours'` **satırına dokunulmaz**
- SVG: DTO `image/svg+xml` yok. Ayar metni “SVG” diyor; ya metni PNG/JPG/WebP yap (önerilen, Cloudflare/MIME riski yok) ya da allowlist’e SVG **ayrı onay** (XSS). Bu revizede SVG eklenmez.

### R6 — Partner kayıt formu → profil

`RegisterPartnerDto` + `identity.service.registerPartner`:

- `city`, `country`, `website`, `contactPhone` (ülke kodu + numara) `Agency`’ye yazılır
- FE: ülke dropdown → dial; şehir dropdown (ülkeye göre)
- `registerPartner()` body’sine website/city/country eklenir
- Ayarlar sayfası GET zaten `website` okuyor — kayıt sonrası dolu gelir

Mevcut `PhoneInput` yeniden kullanılır; yeni telefon bileşeni yazılmaz.

### R7 — Başvuru alındı (doğrulama sayfası yerine)

- Redirect: `/partner-verification` → `/partner-application-received` (veya verification sayfası aynı route’ta metin değişir; eski verify token UI kalkar)
- Metin (kurumsal, nihai kopya uygulamada netleşir):

  > Başvurunuzu aldık.  
  > En kısa sürede inceleyeceğiz. Sizinle **{contactEmail}** ve kayıtlı telefon üzerinden iletişime geçeceğiz.  
  > Onay sonrası giriş bilgileri e-posta ile iletilir.

- `partner.registered` dinleyicisi: adaya “başvuru alındı” maili (yeni template). Admin kuyruk: mevcut `/admin/agencies` PENDING listesi — editor (`PLATFORM_ADMIN`) + `ADMIN` aynı endpoint’i görür. Guard kontrolü: bu roller erişiyor mu? Eksikse **sadece guard**, yeni sayfa tasarımı yok.

### R8 — Onay maili

Mevcut `partner-approved` kalır; kopya: “Hesabınız onaylanmıştır.”  
`loginUrl`: `/acente/giris` (eski `/partner-login` değil).  
Red: isteğe bağlı `partner-rejected` (kapsam: evet, kısa mail; yoksa sadece status).

### R9 — Pickup Maps + voucher

- Migration: `TourPickupPoint.latitude` `longitude` `placeId?` `mapsUrl?`
- Dashboard `PickupPointForm`: adres autocomplete + pin; lat/lng zorunlu (en az bir aktif nokta)
- `createTourPickupPoint` DTO
- `notification` voucher: satır + “Haritada aç” linki (img static map **opsiyonel**, key maliyeti; varsayılan sadece link)
- Env: `GOOGLE_MAPS_API_KEY` (FE public Places) + `.env.example` — Cloudflare değil
- Checkout formu / pickup select UI **yok**

---

## 6. Etkilenen alanlar

```
catalog          Tour kolonları, search DTO, pickup DTO, cache invalidate
identity         RegisterPartnerDto, Agency persist, partner.registered payload
admin            Kuyruk erişimi (rol), approve loginUrl
notification     başvuru alındı + onay maili, voucher maps link
web marketing    /tours query, header href, hero scroll, filtre chip
web agency       tur formu ilk sorular, pickup maps, settings logo folder
web auth         partner register dropdown + received page
shared-*         enum + search query tipi
prisma           2 migrate adayı: tour taxonomy; pickup geo
```

Checkout, payment, Cloudflare, tur `tours/` upload path: **yok**.

---

## 7. Riskler

| Risk                                                   | Önlem                                       |
| ------------------------------------------------------ | ------------------------------------------- |
| Eski turlar extras-only; search boş                    | R1 backfill migrate + seed verify           |
| `includes('ankara')` benzeri gevşek eşleşme geri gelir | Canonical şehir kodu; exact / array-has     |
| Haftalık = tam 7 gün                                   | Header `7+`; dokümante ürün kararı          |
| Logo fix tur upload’u bozar                            | R5 sadece settings `folder` prop            |
| Maps key sızması                                       | Public key HTTP referrer kısıtı; secret yok |
| Yeni EDITOR rolü auth’u dağıtır                        | Kullanma; `PLATFORM_ADMIN`                  |
| Checkout’a “haritayı da koyalım”                       | Red. Bu revize dışı                         |
| Search cache eski key                                  | Yeni param’lar hash’e girer                 |

---

## 8. Definition of Done (revize bitince)

- [ ] Ankara çıkış filtresi Antalya çıkışlı tur getirmez (API + UI)
- [ ] Header Günübirlik / Haftalık boş liste üretmez (veri varsa)
- [ ] Yeni tur: ilk zorunlu alan `stayKind`, sonra `destinationScope`
- [ ] Public filtre bu iki alan + kalkış ile çalışır
- [ ] Pickup’ta lat/lng var; voucher mail’de harita linki var; checkout değişmedi
- [ ] Partner kayıt: ülke/şehir select, alan kodu otomatik, website profilde
- [ ] Kayıt sonrası “Başvurunuzu aldık”; verify-token sayfası yok
- [ ] Admin/PLATFORM_ADMIN kuyruğunda PENDING; onay maili `/acente/giris`
- [ ] Logo `operators` ile yüklenir; tur fotoğrafı hâlâ `tours`
- [ ] Cloudflare / CDN / checkout diff yok
- [ ] Shared types + Swagger güncel; breaking query yok

---

## 9. Öneriler (plana dahil — uygulama onayında netleşir)

1. **`departureCities` kolonu** extras’ta bırakılmasın. Neden: R2 bug’ının kaynağı JSON + client filter.
2. **Facet endpoint** client 100-limit’i bitsin. Neden: yanlış sayaç = yanlış tıklama.
3. **SVG logo bu turda yok.** Neden: allowlist + XSS; metni düzeltmek yeterli.
4. **Editor = `PLATFORM_ADMIN`.** Neden: yeni rol = JWT / guard / seed şişmesi.
5. **R4 + R5 paralel** (R1 onayını beklemeden). Neden: bağımsız, kullanıcıya hızlı kazanım.
6. **Voucher’da static map görseli yok**, sadece link. Neden: Maps Static ücret + Cloudflare cache karmaşası.

---

## 10. Sonraki adım

Bu doküman onaylandıktan sonra **R0 + R1** (veya paralel istenirse **R4 + R5**) için ayrı “yapılacak iş” kartı açılır; kod o onayla yazılır.

Referans:

- Mimari: `docs/ARCHITECTURE.md`
- Şema kilidi: `docs/PHASE_0_SCHEMA_LOCK.md`
- Cloudflare (dokunma): `docs/CDN_CLOUDFLARE.md`
- Ertelenenler: `docs/bulgular.md`
- Storage kuralı: `.cursor/rules/storage-media.mdc`
- UI parity: `.cursor/rules/ui-parity-no-simplify.mdc`
