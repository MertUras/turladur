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

### Faz A — Kritik Düzeltmeler (P0)

| #    | Görev                                                                                                 | Öncelik | Çıktı                                                                                                                                                            |
| ---- | ----------------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 25.1 | **Paket adı düzelt** — root `package.json` `"name"` → `"turta"`                                       | P0      | Tutarlı marka: `turta`                                                                                                                                           |
| 25.2 | **Next.js Middleware oluştur** — `apps/web/src/middleware.ts`                                         | P0      | Auth route'ları koruması (partner/_, admin/_, profile, bookings, checkout)                                                                                       |
| 25.3 | **Header `lightBackgroundPrefixes` düzelt** — İngilizce ghost path'leri Türkçe gerçek path'lere çevir | P0      | `/gastronomy/` → `/gastronomi`, `/cultural-tours/` → `/kultur-turlari`, `/adventure-activities/` → `/macera-aktiviteleri`; `/destinations/` ve `/agency/` kaldır |
| 25.4 | **URL stratejisi kararı** — Tüm public route'ları tek dile getir                                      | P0      | Aşağıda opsiyon tablosu                                                                                                                                          |

### Faz B — Teknik Borç Temizliği (P1)

| #     | Görev                                                                                                                                                            | Öncelik | Çıktı                                                                                                                        |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 25.5  | **Footer 404 sayfaları oluştur** — `/faq`, `/privacy`, `/terms`, `/cookie-policy`, `/accessibility`                                                              | P1      | Minimum statik sayfalar (yasal zorunluluk)                                                                                   |
| 25.6  | **dummy-data.ts kaldır** — API'den gelen veriyle değiştir veya fallback olarak işaretle                                                                          | P1      | Dosya silinir veya `__dev__` prefix alır                                                                                     |
| 25.7  | **shadcn/ui bileşen genişlet** — sık kullanılan: input, card, dialog, dropdown-menu, select, tabs, badge, skeleton                                               | P1      | `npx shadcn@latest add` ile tutarlı UI kit                                                                                   |
| 25.8  | **ESLint/TS build ignore kaldır** — lint hatalarını düzelt, `ignoreDuringBuilds` → `false`                                                                       | P1      | Temiz build (`pnpm build:apps` hatasız, gerçek type-check ile)                                                               |
| 25.9  | **Pages Router `_error.tsx` değerlendir** — Dosyada "App Router monorepo quirk" notu var; kaldırmadan önce `pnpm build:apps` ile test et. Build kırılırsa BIRAK. | P2      | Eğer güvenliyse App Router `error.tsx` + `global-error.tsx` yeterli                                                          |
| 25.10 | **Web paket adı** — `"web"` → `"@turta/web"`, API → `"@turta/api"`                                                                                               | P2      | Monorepo scope tutarlılığı. **DİKKAT:** `pnpm --filter web` ve Nx project adları buna bağlı — filter/script'leri de güncelle |

### Faz C — Kod Kalite & DX (P2)

| #     | Görev                                                                                                                                | Öncelik | Çıktı                                          |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------ | ------- | ---------------------------------------------- |
| 25.11 | **Placeholder image URL'leri temizle** — unsplash/pexels/picsum → sadece CDN veya API proxy                                          | P2      | `next.config.ts remotePatterns` sadeleşir      |
| 25.12 | **Stale import/unused file audit** — kullanılmayan lib dosyaları bul ve kaldır                                                       | P2      | Daha az dead code                              |
| 25.13 | **Commit lint + PR template** — conventional commits enforce edilsin                                                                 | P2      | Zaten husky + commitlint var, PR template ekle |
| 25.14 | **Cursor rules güncelle** — `architecture.mdc` "Keycloak" referansını kaldır (gerçekte Passport.js + JWT), eski referansları temizle | P2      | Rules güncel                                   |

---

## URL Stratejisi Kararı (25.4)

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

### Opsiyon C: Karma — ama kurallı (Pragmatik — ÖNERİLEN)

- **Marketing/SEO sayfaları:** Türkçe slug (mevcut haliyle kalır)
- **App sayfaları (auth, panel):** İngilizce kalır (kullanıcı görmez, UX etkisiz)
- **Kategori shortcut'ları:** `/gastronomi`, `/kultur-turlari`, `/macera-aktiviteleri` → `/aktiviteler?kategori=X` redirect (veya bağımsız sayfa olarak kalır)

| Segment Türü                  | Dil       | Örnek                                   |
| ----------------------------- | --------- | --------------------------------------- |
| Marketing (tur/aktivite/rota) | Türkçe    | `/turlar`, `/aktiviteler`, `/rotalar`   |
| Kategori landing              | Türkçe    | `/gastronomi`, `/kultur-turlari`        |
| Auth                          | İngilizce | `/login`, `/register` (global UX)       |
| Dashboard                     | İngilizce | `/partner/*`, `/admin/*`                |
| Yasal/About                   | Türkçe    | `/hakkimizda`, `/iletisim`, `/gizlilik` |

**Artı:** En az iş ile tutarlılık sağlanır; SEO korunur.  
**Eksi:** İki dil hâlâ var ama mantıksal sınırlar net.

---

## Bağımlılık Sırası

```
25.1  Paket adı (bağımsız, hemen)
  ↓
25.2  Middleware (auth koruması — P0)
  ↓
25.3  Header ghost paths (hemen düzeltilebilir)
  ↓
25.4  URL stratejisi kararı (ürün kararı gerekir → 25.5 ile bağlantılı)
  ↓
25.5  Footer 404 sayfaları (25.4 kararına bağlı)
  ↓
25.6  dummy-data temizliği
  ↓
25.7  shadcn genişlet (UI tutarlılığı)
  ↓
25.8  ESLint/TS ignore kaldır (en son — diğerleri bitince)
  ↓
25.9-14  Düşük öncelikli temizlik
```

---

## Tahmini Efor

| Faz        | Tahmini Süre | Açıklama                                     |
| ---------- | ------------ | -------------------------------------------- |
| A (P0)     | 2-3 gün      | Middleware + header fix + URL kararı         |
| B (P1)     | 3-4 gün      | Footer pages + shadcn + lint fix + paket adı |
| C (P2)     | 1-2 gün      | Temizlik, audit, docs                        |
| **Toplam** | **~1 hafta** | Sprint 24 öncesi tamam                       |

---

## Definition of Done

- [ ] Root `package.json` adı `"turta"`
- [ ] `apps/web/src/middleware.ts` mevcut — korunan route'lar doğru yönlendirme yapıyor
- [ ] Header'da ghost path yok — `lightBackgroundPrefixes` güncel
- [ ] URL stratejisi kararı alınmış ve uygulanmış (veya documented)
- [ ] Footer'daki tüm linkler çalışan sayfalara gidiyor (404 yok)
- [ ] `dummy-data.ts` kaldırılmış veya dev-only olarak işaretlenmiş
- [ ] shadcn/ui en az 8 temel bileşen eklenmiş
- [ ] `pnpm build:apps` — `ignoreDuringBuilds: false` ile hatasız
- [ ] Pages Router `_error.tsx` — build test sonucu kaldırılmış VEYA bilinçli olarak bırakılmış (documented)
- [ ] Paket adları scope'lu: `@turta/web`, `@turta/api` (veya mevcut filter/CI uyumsuzluğu varsa ertelenmiş)
- [ ] Kullanılmayan dosya/import audit tamamlanmış

---

## Notlar

- Bu sprint **UI tasarımı değiştirmez** — sadece yapısal/teknik temizlik.
- URL stratejisi değişikliği yapılırsa 301 redirect'ler zorunlu (SEO kaybı önleme).
- `ignoreBuildErrors` kaldırılmadan önce tüm type hatalarının düzeltilmesi gerekir — bu en büyük iş kalemi olabilir.
- Middleware eklenmesi client-side auth provider'ı kaldırmaz — ikisi birlikte çalışır (belt & suspenders).
