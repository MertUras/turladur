# Bulgular

Bu doküman sprint sırasında tespit edilen teknik bulguları ve sonraki sprint için önerilen aksiyonları tutar.

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
