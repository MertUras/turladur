# Sprint 25 — Kod Kalite & Yapısal Temizlik

> **Bağlam:** Kullanıcı tarafından tespit edilen 14 sorunun analizi.  
> Sprint 19-23 Faz B ile birçoğu çözülmüş, kalan ve yeni tespit edilen sorunlar bu sprint'te ele alınacak.  
> **Sprint süresi:** 1 hafta  
> **Öncelik:** Production deploy (Sprint 24) öncesi son temizlik

---

## Durum Özeti — Orijinal 14 Sorun

### ✅ Zaten Çözülmüş (Sprint 23 Faz B)

| #   | Sorun                                     | Durum | Çözüm                                                       |
| --- | ----------------------------------------- | ----- | ----------------------------------------------------------- |
| 1   | Duplicate klasörler (app/lib/ + kök lib/) | ✅    | Sprint 23.6 + 23.8 — legacy `app/` ve kök `lib/` silindi    |
| 2   | Duplicate components                      | ✅    | Sprint 23.6 + 23.10 — tek konum: `apps/web/src/components/` |
| 3   | Duplicate types                           | ✅    | Sprint 23.6 + 23.10 — tek konum: `packages/shared-types/`   |
| 4   | Boş src/ klasörü                          | ✅    | Sprint 23 — kök `src/` silindi                              |
| 5   | İki next.config dosyası                   | ✅    | Sprint 23.12 — tek dosya: `apps/web/next.config.ts`         |
| 8   | .env.example yok                          | ✅    | Mevcut: kök + `apps/api/` + `infrastructure/docker/`        |
| 9   | Tek rules dosyası                         | ✅    | 16 adet `.cursor/rules/*.mdc` dosyası mevcut                |
| 10  | SQLite kalıntısı (prisma/dev.db)          | ✅    | Sprint 23.7 — kök `prisma/` silindi; PostgreSQL aktif       |
| 13  | Webpack crypto workaround                 | ✅    | Kodda `crypto-browserify` referansı yok                     |
| 14  | Test endpoint açık (app/api/test/)        | ✅    | Sprint 23.1 — legacy API route'ları silindi                 |

### ⚠️ Kısmen Çözülmüş

| #   | Sorun                 | Durum | Kalan İş                                                                                        |
| --- | --------------------- | ----- | ----------------------------------------------------------------------------------------------- |
| 7   | UI kütüphane karışımı | ⚠️    | MUI ve Headless UI kaldırılmış; shadcn/ui sadece 2 bileşen (button, phone-input) — tamamlanmalı |
| 11  | README şablon         | ⚠️    | Güncellenmiş ama paket adı tutarsızlığı var, marka netleşmeli                                   |

### ❌ Hâlâ Mevcut

| #   | Sorun                  | Durum | Detay                                                                                                           |
| --- | ---------------------- | ----- | --------------------------------------------------------------------------------------------------------------- |
| 6   | Paket adı tutarsızlığı | ❌    | Root `package.json`: `"tourtech"`, paketler: `@turta/*`, marka: TurlaDur                                        |
| 12  | URL dili karışık       | ❌    | Türkçe: `/gastronomi`, `/kultur-turlari`, `/macera-aktiviteleri`; İngilizce: `/tours`, `/activities`, `/routes` |

---

## Yeni Tespit Edilen Sorunlar

| #   | Sorun                               | Seviye      | Detay                                                                                                                                                             |
| --- | ----------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| N1  | Header'da ghost path referansları   | Orta        | `lightBackgroundPrefixes`: `/gastronomy/`, `/cultural-tours/`, `/adventure-activities/` — gerçek rotalar `/gastronomi`, `/kultur-turlari`, `/macera-aktiviteleri` |
| N2  | Footer'da 404 linkleri              | Orta        | `/faq`, `/privacy`, `/terms`, `/cookie-policy`, `/accessibility` — sayfa dosyası yok                                                                              |
| N3  | `next.config.ts` — ESLint/TS ignore | Teknik borç | `ignoreDuringBuilds: true`, `ignoreBuildErrors: true` — build hatalarını gizliyor                                                                                 |
| N4  | `dummy-data.ts` production'da       | Düşük       | `apps/web/src/lib/dummy-data.ts` — placeholder veri, API bağlantısı sonrası gereksiz                                                                              |
| N5  | Pages Router kalıntısı              | Düşük       | `apps/web/src/pages/_error.tsx` — App Router'da `not-found.tsx` + `error.tsx` kullanılmalı                                                                        |
| N6  | shadcn/ui minimal                   | Orta        | Sadece `button.tsx` + `phone-input.tsx` — birçok UI pattern elle yazılmış                                                                                         |
| N7  | Middleware yok                      | Yüksek      | Next.js edge middleware yok — route koruması tamamen client-side (flash/FOUC riski)                                                                               |
| N8  | `apps/web` paket adı `"web"`        | Düşük       | Workspace scope'suz (`@turta/web` olmalı)                                                                                                                         |

---

## Sprint 25 Görevleri

### Faz A — Düşük Riskli Kritik Düzeltmeler (P0)

| #    | Görev                                                                                                 | Öncelik | Çıktı                                                                                                                                                            |
| ---- | ----------------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 25.3 | **Header `lightBackgroundPrefixes` düzelt** — İngilizce ghost path'leri Türkçe gerçek path'lere çevir | P0      | `/gastronomy/` → `/gastronomi`, `/cultural-tours/` → `/kultur-turlari`, `/adventure-activities/` → `/macera-aktiviteleri`; `/destinations/` ve `/agency/` kaldır |
| 25.4 | **URL stratejisi kararı** — Tüm public route'ları tek dile getir                                      | P0      | Aşağıda opsiyon tablosu                                                                                                                                          |
| 25.5 | **Footer 404 sayfaları oluştur** — `/faq`, `/privacy`, `/terms`, `/cookie-policy`, `/accessibility`   | P0      | Minimum statik sayfalar (yasal zorunluluk)                                                                                                                       |
| 25.6 | **dummy-data.ts kaldır** — API'den gelen veriyle değiştir veya fallback olarak işaretle               | P0      | Dosya silinir veya `__dev__` prefix alır                                                                                                                         |
| 25.1 | **Paket adı düzelt** — root `package.json` `"name"` → `"turta"`                                       | P1      | Tutarlı marka: `turta`                                                                                                                                           |

### Faz B — Teknik Borç Temizliği (P1)

| #    | Görev                                                                                                                                                            | Öncelik | Çıktı                                                                      |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------- |
| 25.2 | **Next.js Middleware oluştur** — `apps/web/src/middleware.ts`                                                                                                    | P1      | Auth route'ları koruması (partner/_, admin/_, profile, bookings, checkout) |
| 25.7 | **shadcn/ui bileşen genişlet** — sık kullanılan: input, card, dialog, dropdown-menu, select, tabs, badge, skeleton                                               | P1      | `npx shadcn@latest add` ile tutarlı UI kit                                 |
| 25.9 | **Pages Router `_error.tsx` değerlendir** — Dosyada "App Router monorepo quirk" notu var; kaldırmadan önce `pnpm build:apps` ile test et. Build kırılırsa BIRAK. | P2      | Eğer güvenliyse App Router `error.tsx` + `global-error.tsx` yeterli        |

### Faz C — Kod Kalite & DX (P2)

| #     | Görev                                                                                                                                | Öncelik | Çıktı                                                          |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------ | ------- | -------------------------------------------------------------- |
| 25.11 | **Placeholder image URL'leri temizle** — unsplash/pexels/picsum → sadece CDN veya API proxy                                          | P2      | `next.config.ts remotePatterns` sadeleşir                      |
| 25.12 | **Stale import/unused file audit** — kullanılmayan lib dosyaları bul ve kaldır                                                       | P2      | Daha az dead code                                              |
| 25.13 | **Commit lint + PR template** — conventional commits enforce edilsin                                                                 | P2      | Zaten husky + commitlint var, PR template ekle                 |
| 25.14 | **Cursor rules güncelle** — `architecture.mdc` "Keycloak" referansını kaldır (gerçekte Passport.js + JWT), eski referansları temizle | P2      | Rules güncel                                                   |
| 25.8  | **ESLint/TS build ignore kaldır** — lint hatalarını düzelt, `ignoreDuringBuilds` → `false`                                           | P2      | Temiz build (`pnpm build:apps` hatasız, gerçek type-check ile) |
| 25.10 | **Web paket adı** — `"web"` → `"@turta/web"`, API → `"@turta/api"`                                                                   | P2      | Monorepo scope tutarlılığı (en sona: Nx/filter etkisi riski)   |

---

## URL Stratejisi Kararı (25.4)

> **KARAR (Sprint 25): Opsiyon C kabul edildi.**  
> Bu sprintte büyük URL rename / 301 dalgası YOK. Ghost path + footer yeterli.  
> Opsiyon A/B ancak ayrı ürün onayıyla yapılır.

Mevcut durum: **Karma dil** — bazı URL'ler Türkçe, bazıları İngilizce.

### Opsiyon A: Tamamen Türkçe (SEO-friendly, yerel pazar)

| Eski                   | Yeni                   | Redirect |
| ---------------------- | ---------------------- | -------- |
| `/tours`               | `/turlar`              | 301      |
| `/tours/[id]`          | `/turlar/[id]`         | 301      |
| `/activities`          | `/aktiviteler`         | 301      |
| `/activities/[id]`     | `/aktiviteler/[id]`    | 301      |
| `/routes`              | `/rotalar`             | 301      |
| `/routes/[id]`         | `/rotalar/[id]`        | 301      |
| `/about`               | `/hakkimizda`          | 301      |
| `/contact`             | `/iletisim`            | 301      |
| `/blog`                | `/blog`                | —        |
| `/login`               | `/giris`               | 301      |
| `/register`            | `/kayit`               | 301      |
| `/profile`             | `/profil`              | 301      |
| `/bookings`            | `/rezervasyonlarim`    | 301      |
| `/checkout`            | `/odeme`               | 301      |
| `/gastronomi`          | `/gastronomi`          | —        |
| `/kultur-turlari`      | `/kultur-turlari`      | —        |
| `/macera-aktiviteleri` | `/macera-aktiviteleri` | —        |

**Artı:** Türk kullanıcılar için doğal, Google TR sıralamasında avantaj.  
**Eksi:** Büyük refactor, tüm internal linkler + service URL'leri değişmeli.

### Opsiyon B: Tamamen İngilizce (Uluslararası genişleme kolay)

| Eski                   | Yeni                              | Redirect |
| ---------------------- | --------------------------------- | -------- |
| `/gastronomi`          | `/activities?category=gastronomy` | 301      |
| `/kultur-turlari`      | `/activities?category=cultural`   | 301      |
| `/macera-aktiviteleri` | `/activities?category=adventure`  | 301      |

**Artı:** Tutarlı, i18n prefix (`/tr/`, `/en/`) eklenebilir.  
**Eksi:** Mevcut SEO endeksi etkilenir (Türkçe slug'lar varsa).

### Opsiyon C: Karma — ama kurallı (Pragmatik — KABUL EDİLDİ)

- **Marketing/SEO sayfaları:** Türkçe slug (mevcut haliyle kalır: `/gastronomi`, `/kultur-turlari`, `/macera-aktiviteleri`)
- **Liste sayfaları:** mevcut İngilizce path korunur (`/tours`, `/activities`, `/routes`) — rename ertelendi
- **App sayfaları (auth, panel):** İngilizce kalır (`/login`, `/partner/*`)
- **Yasal:** İngilizce path + TR içerik (`/faq`, `/privacy`, `/terms`, …) — footer linkleriyle uyumlu, bu sprintte oluşturuldu

| Segment Türü       | Dil       | Örnek                              |
| ------------------ | --------- | ---------------------------------- |
| Marketing listeler | İngilizce | `/tours`, `/activities`, `/routes` |
| Kategori landing   | Türkçe    | `/gastronomi`, `/kultur-turlari`   |
| Auth               | İngilizce | `/login`, `/register`              |
| Dashboard          | İngilizce | `/partner/*`, `/admin/*`           |
| Yasal              | EN path   | `/faq`, `/privacy`, `/terms`       |

**Artı:** En az iş ile tutarlılık sağlanır; SEO korunur.  
**Eksi:** İki dil hâlâ var ama mantıksal sınırlar net.

---

## Bağımlılık Sırası

```
25.3  Header ghost paths (en düşük risk, hemen)
  ↓
25.4  URL stratejisi kararı (ürün kararı → hangi sayfalar/redirect’ler netleşsin)
  ↓
25.5  Footer 404 sayfaları (25.4 kararına bağlı — yasal/SEO tutarlılığı)
  ↓
25.6  dummy-data temizliği (UI işlevselliği korunarak / dev-only)
  ↓
25.1  Paket adı düzelt (scope dışı branding; önce build-smoke kontrol)
  ↓
25.2  Middleware (en yüksek risk: sadece route whitelist ile + smoke test)
  ↓
25.7  shadcn genişlet (UI tutarlılığı)
  ↓
25.9-14  Düşük öncelikli temizlik
  ↓
25.8  ESLint/TS ignore kaldır (en sona: type-fix dalgası riski)
  ↓
25.10 Web paket adı (en sona: Nx/filter/script etkisi riski)
```

---

## 25.2 Middleware — Whitelist & Smoke Test (Risk Kontrolü)

> Middleware en yüksek riskli madde. **Client-side `AuthProvider` kaldırılmaz** — ikisi birlikte çalışır (belt & suspenders).  
> Amaç: korunan sayfalarda flash/FOUC azaltmak; mevcut login/redirect akışını bozmamak.

### Korunan route whitelist (matcher)

| Prefix / path                       | Kim girebilir              | Yetkisiz yönlendirme           |
| ----------------------------------- | -------------------------- | ------------------------------ |
| `/partner/*` (login/register hariç) | `PARTNER`, `PARTNER_STAFF` | `/partner-login`               |
| `/admin/*`                          | `ADMIN`, `SUPER_ADMIN`     | `/login`                       |
| `/profile`                          | authenticated (CUSTOMER+)  | `/login?callbackUrl=/profile`  |
| `/bookings`                         | authenticated              | `/login?callbackUrl=/bookings` |
| `/checkout`                         | authenticated              | `/login?callbackUrl=/checkout` |

### Explicit allowlist (middleware ASLA engellemez)

```
/, /tours, /activities, /routes, /blog, /about, /contact,
/gastronomi, /kultur-turlari, /macera-aktiviteleri,
/login, /register, /forgot-password,
/partner-login, /partner-register, /partner-verification,
/faq, /privacy, /terms, /cookie-policy, /accessibility,
/_next/*, /favicon.ico, /brand/*, /api/* (varsa)
```

### Uygulama kuralları (bozmama garantisi)

1. Token yoksa → sadece whitelist dışı protected path'lerde redirect.
2. Token varsa ama rol uyumsuzsa → ilgili login sayfasına (loop yok: login sayfaları allowlist'te).
3. Cookie/header okuma başarısızsa → **fail-open değil, fail-to-login** (protected için); public sayfalar etkilenmez.
4. `matcher` mümkün olduğunca dar — marketing sayfalarına middleware yükü yok.
5. Deploy öncesi aşağıdaki smoke checklist **zorunlu**; bir madde kırmızıysa middleware merge edilmez.

### Smoke test checklist (25.2 DoD)

- [ ] Misafir: `/` açılır, header/footer normal
- [ ] Misafir: `/tours`, `/partner-login`, `/login` açılır (redirect yok)
- [ ] Misafir: `/partner/dashboard` → `/partner-login`
- [ ] Misafir: `/admin/dashboard` → `/login`
- [ ] Misafir: `/profile`, `/bookings`, `/checkout` → `/login?callbackUrl=...`
- [ ] Partner login sonrası: `/partner/dashboard` açılır
- [ ] Customer login sonrası: `/profile`, `/bookings` açılır; checkout akışı bozulmaz
- [ ] Partner token ile `/admin/*` → login (yetki sızması yok)
- [ ] Hard refresh korunan sayfada: flash yok / kısa spinner kabul
- [ ] Logout sonrası korunan URL → tekrar login'e düşer
- [ ] Mobil 375px: aynı redirect davranışı

### Rollback

Middleware sorun çıkarırsa: `middleware.ts` silinir veya `matcher` boşaltılır → client auth tek başına çalışmaya devam eder. Tasarım/API etkilenmez.

---

## Tahmini Efor

| Faz        | Tahmini Süre | Açıklama                                            |
| ---------- | ------------ | --------------------------------------------------- |
| A (P0)     | 1-2 gün      | Header fix + URL kararı + footer + dummy-data       |
| B (P1)     | 2-3 gün      | Paket adı + middleware (+ smoke) + shadcn           |
| C (P2)     | 1-2 gün      | DX temizlik; lint ignore + paket scope **en sonda** |
| **Toplam** | **~1 hafta** | Risk sırasına göre; yüksek riskliler sona bırakılır |

---

## Definition of Done

- [x] Header'da ghost path yok — `lightBackgroundPrefixes` güncel (25.3)
- [x] URL stratejisi kararı alınmış ve documented — **Opsiyon C** (25.4)
- [x] Footer'daki tüm linkler çalışan sayfalara gidiyor (404 yok) (25.5)
- [x] `dummy-data.ts` kaldırılmış veya dev-only olarak işaretlenmiş (25.6)
- [x] Root `package.json` adı `"turta"` (25.1)
- [ ] `apps/web/src/middleware.ts` mevcut — whitelist + smoke checklist yeşil (kısmi: no-store; auth cookie yok → docs/bulgular.md)
- [x] shadcn/ui en az 8 temel bileşen eklenmiş (mevcut sayfa stilleri bozulmadan) (25.7)
- [x] Commit lint mevcut; PR template eklendi (25.13 — `.github/PULL_REQUEST_TEMPLATE.md`)
- [x] Cursor rules auth stack güncel — Keycloak kaldırıldı, Passport JWT / identity yazıldı (25.14)
- [x] Pages Router `_error.tsx` kaldırıldı — build deneyi yeşil (25.9; detay: `docs/bulgular.md` §5)
- [x] Kullanılmayan dosya/import audit tamamlanmış (25.12 — ölü `normalize-error.ts` silindi; shadcn kit bilinçli bırakıldı; detay: `docs/bulgular.md` §7)
- [ ] `pnpm build:apps` — `ignoreDuringBuilds: false` ile hatasız (**en sonda**)
- [ ] Paket adları scope'lu: `@turta/web`, `@turta/api` (veya ertelenmiş) (**en sonda**)
- [ ] Push yok — kullanıcı açıkça istemeden remote'a gönderilmez

---

## Sprint çalışma kuralları (Evrensel)

1. **Tasarım bozulmaz** — UI parity; restyle/simplify yok.
2. **Mimari bozulmaz** — modüler monolit, ADR-001; mikroservis/gateway yok.
3. **Push izinsiz yok** — commit local kalabilir; push sadece kullanıcı onayıyla.
4. **Fonksiyonellik korunur** — değiştirilen şey aynı davranışı sürdürür.
5. **Risk minimize** — düşük risk önce; middleware / lint-ignore / paket-rename en sonda + smoke.

---

## Notlar

- Bu sprint **UI tasarımı değiştirmez** — sadece yapısal/teknik temizlik.
- URL stratejisi: **Opsiyon C (önerilen)** — büyük rename bu sprint'te yok; ghost path + footer yeterli.
- Büyük URL rename (A/B) yapılırsa 301 redirect'ler zorunlu (SEO kaybı önleme) — ayrı onay.
- `ignoreBuildErrors` kaldırılmadan önce tüm type hatalarının düzeltilmesi gerekir — bu en büyük iş kalemi; **en sonda**.
- Middleware eklenmesi client-side auth provider'ı kaldırmaz — ikisi birlikte çalışır (belt & suspenders).
